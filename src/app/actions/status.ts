"use server";
import { supabaseAdmin } from "@/lib/supabase";

export async function getPublicRequestStatusAction(query: string) {
  // Check if the query is a 10-digit phone number
  const isPhone = /^\d{10}$/.test(query.trim());

  let dbQuery = supabaseAdmin
    .from("requests")
    .select(`
      *,
      users!requests_user_id_fkey(name, mobile),
      assigned:assigned_to(name)
    `);

  if (isPhone) {
    // Get the most recent request for this mobile number
    dbQuery = dbQuery.eq("users.mobile", query.trim()).order("created_at", { ascending: false }).limit(1);
  } else {
    // Get by Request ID (UUID)
    dbQuery = dbQuery.eq("id", query.trim()).limit(1);
  }

  const { data, error } = await dbQuery.single();

  if (error || !data) return null;

  // ─── Generate the Dynamic Timeline ───
  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const isDone = data.status === "done";
  const isProcessing = ["processing", "done"].includes(data.status);

  const timeline = [
    { status: "submitted", label: "Application submitted", labelHi: "आवेदन जमा हुआ", time: formatTime(data.created_at), actor: "You", done: true, current: data.status === "pending" },
    { status: "seen", label: "Received at office", labelHi: "कार्यालय में प्राप्त", time: data.status !== "pending" ? formatTime(data.updated_at) : "—", actor: "Staff", done: data.status !== "pending", current: data.status === "seen" },
    { status: "processing", label: "In progress", labelHi: "प्रक्रिया जारी", time: isProcessing ? formatTime(data.updated_at) : "—", actor: data.assigned?.name || "Staff", done: isProcessing, current: data.status === "processing" },
    { status: "done", label: "Completed", labelHi: "पूर्ण", time: isDone ? formatTime(data.updated_at) : "—", actor: data.assigned?.name || "—", done: isDone, current: isDone },
  ];

  return {
    id: data.id,
    service: data.service,
    serviceHi: data.service_hi || data.service,
    userName: data.users?.name || "User",
    mobile: data.users?.mobile,
    status: data.status,
    delivery_status: data.delivery_status || 'na', // ✨ New Delivery Field
    submittedAt: new Date(data.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    lastUpdated: new Date(data.updated_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    assignedTo: data.assigned?.name || null,
    paymentPending: data.payment_status === "pending",
    paymentAmount: data.payment_amount,
    timeline
  };
}