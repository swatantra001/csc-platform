"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Helper to get the logged-in user securely on the server
async function getAuthUser() {
	const cookie = await cookies();
	const token = cookie.get("csc_token")?.value;
	if (!token) return null;
	return await getUserFromToken(token);
}

export async function fetchMyRequestsAction() {
	const user = await getAuthUser();
	if (!user) return [];

	// ✨ CRITICAL FIX: Safely extract ID whether your token stores it as .sub or .id
	const userId = (user as any).sub || (user as any).id;
	if (!userId) {
		console.error("No user ID found in token payload!");
		return [];
	}

	// Fetch requests and join messages + users (to get admin names)
	const { data: reqs, error } = await supabaseAdmin
		.from("requests")
		.select(`
            *,
            request_messages(*, users!request_messages_sender_id_fkey(name, role))
        `)
		.eq("user_id", userId)
		.order("updated_at", { ascending: false });

	if (error) {
		console.error("Fetch error:", error);
		return [];
	}

	return reqs.map((r: any) => {
		// Sort messages safely so they appear in correct chat order
		const sortedMessages = (r.request_messages || []).sort(
			(a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		);

		return {
			id: r.id,
			displayId: r.id.split("-")[0].toUpperCase(),
			title: r.title || "Support Request",
			titleEn: r.title || "Support Request",
			service: r.service,
			status: r.status,
			unread: 0,
			lastMsg: sortedMessages.length > 0 ? (sortedMessages[sortedMessages.length - 1]?.content || "Attachment") : "Application submitted",
			lastMsgEn: sortedMessages.length > 0 ? (sortedMessages[sortedMessages.length - 1]?.content || "Attachment") : "Application submitted",
			lastTime: new Date(r.updated_at || r.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
			resolvedBy: null,
			paymentPending: r.payment_status === "pending",
			paymentAmount: r.payment_amount || 0,
			deliveryType: r.delivery_type,       // ✨ Added for delivery
            deliveryStatus: r.delivery_status,   // ✨ Added for live tracking
            urgency: r.urgency,                  // ✨ Added for urgency
			messages: sortedMessages.map((m: any) => ({
				id: m.id,
				from: m.sender_role === "user" ? "user" : "admin",
				text: m.content,
				textEn: m.content,
				time: new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
				date: "today",
				type: m.message_type || "text",
				// Dynamically support both doc_url and file_url depending on DB insertions
				doc: (m.doc_url || m.file_url) ? {
					name: m.doc_name || m.file_name,
					size: m.doc_size || m.file_size,
					icon: "📄",
					url: m.doc_url || m.file_url,
					isResult: m.is_result_doc
				} : undefined,
				// ✨ THIS IS THE CRITICAL LINE THAT WAS MISSING! ✨
				amount: m.payment_amount,
				paymentStatus: m.payment_status || "pending", // ✨ ADD THIS LINE
				replyToId: m.reply_to_id || null,
				adminName: m.users?.name || "Admin",
				adminRole: m.users?.role || "Support"
			})),
			timeline: [
				{ event: "submitted", time: "Just now", eventEn: "Submitted", timeEn: "Just now" }
			],
		};
	});
}

export async function createRequestAction(data: { 
    service: string; title: string; desc: string; priority: string; 
    delivery_type?: string; urgency?: string; address_id?: string; 
}) {
	const user = await getAuthUser();
	if (!user) throw new Error("Unauthorized");

	const userId = (user as any).sub || (user as any).id;

	// Insert into requests table
	const { data: reqData, error: reqError } = await supabaseAdmin
		.from("requests")
		.insert({
			user_id: userId,
			service: data.service,
			title: data.title,
			description: data.desc,
			priority: data.priority,
			status: "pending",
			payment_status: data.priority === "prepaid" ? "pending" : "na",
			delivery_type: data.delivery_type || 'pickup',
            urgency: data.urgency || 'flexible',
            address_id: data.address_id || null,
            delivery_status: data.delivery_type === 'delivery' ? 'pending' : 'na',
		})
		.select()
		.single();

	if (reqError) throw new Error(reqError.message);

	// Insert the initial message chat
	if (data.desc || data.title) {
		await supabaseAdmin.from("request_messages").insert({
			request_id: reqData.id,
			sender_id: userId,
			sender_role: "user",
			message_type: "text",
			content: data.desc || data.title,
		});
	}

	return reqData;
}

export async function sendChatMessageAction(requestId: string, content: string, fileUrl?: string, fileName?: string, fileSize?: string, replyToId?: string) {
	const user = await getAuthUser();
	if (!user) throw new Error("Unauthorized");

	const userId = (user as any).sub || (user as any).id;

	const { error } = await supabaseAdmin.from("request_messages").insert({
		request_id: requestId,
		sender_id: userId,
		sender_role: "user",
		message_type: fileUrl ? "doc" : "text",
		content: content || null,
		file_url: fileUrl || null,
		file_name: fileName || null,
		file_size: fileSize || null,
		reply_to_id: replyToId || null,
	});

	if (error) throw new Error(error.message);

	// Bump the request to the top of the queue
	await supabaseAdmin.from("requests").update({ updated_at: new Date().toISOString() }).eq("id", requestId);
	return { success: true };
}