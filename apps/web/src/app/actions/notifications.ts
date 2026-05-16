"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function getAuthUser() {
	const cookie = await cookies();
	const token = cookie.get("csc_token")?.value;
	if (!token) return null;
	return await getUserFromToken(token);
}

// 1. Fetch all notifications for the user
export async function fetchNotificationsAction() {
	const user = await getAuthUser();
	if (!user) return [];

	const { data, error } = await supabaseAdmin
		.from("notifications")
		.select("*")
		.eq("user_id", user.sub)
		.order("created_at", { ascending: false })
		.limit(20);

	if (error) {
		console.error("Fetch notifs error:", error);
		return [];
	}
	return data;
}

// 2. Mark all notifications as read when panel is opened
export async function markNotificationsReadAction() {
	const user = await getAuthUser();
	if (!user) return { success: false };

	const { error } = await supabaseAdmin
		.from("notifications")
		.update({ is_read: true, read_at: new Date().toISOString() }) // Using your read_at column!
		.eq("user_id", user.sub)
		.eq("is_read", false);

	if (error) return { success: false, error: error.message };
	return { success: true };
}




export async function broadcastNotificationAction(data: {
	title: string;
	title_hi: string;
	body: string;
	body_hi: string;
	type: string;
	priority: string;
	action_url?: string;
}) {
	const cookie = await cookies();
	const token = cookie.get("csc_token")?.value;
	if (!token) return { success: false, error: "Unauthorized" };

	const adminUser = await getUserFromToken(token);
	if (!adminUser || (adminUser.role !== "main_admin" && adminUser.role !== "co_admin")) {
		return { success: false, error: "Only admins can broadcast" };
	}

	// Fetch all active users
	const { data: users, error: userErr } = await supabaseAdmin
		.from("users")
		.select("id")
		.eq("is_active", true);

	if (userErr || !users) return { success: false, error: "Failed to fetch users" };

	// Prepare the batch insert payload
	const payloads = users.map((u: { id: string }) => ({
		user_id: u.id,
		actor_id: adminUser.sub,
		type: data.type,
		priority: data.priority,
		title: data.title,
		title_hi: data.title_hi,
		body: data.body,
		body_hi: data.body_hi,
		action_url: data.action_url || null,
		is_read: false
	}));

	// Bulk insert to notifications table
	const { error: insertErr } = await supabaseAdmin
		.from("notifications")
		.insert(payloads);

	if (insertErr) return { success: false, error: insertErr.message };
	return { success: true, count: payloads.length };
}