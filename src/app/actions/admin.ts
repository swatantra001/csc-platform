
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

// ─── AUTH VERIFICATION ────────────────────────────────────────────────────────
async function requireAdmin() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) throw new Error("Unauthorized - No token");

  const user = await getUserFromToken(token);
  if (!user || (user.role !== "main_admin")) {
    throw new Error("Forbidden - Admin access required");
  }
  return user;
}

async function requireCOAdmin() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) throw new Error("Unauthorized - No token");

  const user = await getUserFromToken(token);
  if (!user || user.role === "user") {
    throw new Error("Forbidden - Co-Admin access required");
  }
  return user;
}

// ─── QUEUE & CHAT ACTIONS ─────────────────────────────────────────────────────
export async function adminGetRequestsAction(statusFilter: string, search: string) {
  await requireCOAdmin();
  let query = supabaseAdmin
    .from("requests")
    .select(`*, users!requests_user_id_fkey(name, mobile), assignee:users!requests_assigned_to_fkey(name), address:addresses(*), request_messages(*)`)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (statusFilter !== "all") query = query.eq("status", statusFilter);
  if (search) query = query.or(`title.ilike.%${search}%,service.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function adminGetChatAction(reqId: string) {
  await requireCOAdmin();
  const [msgRes, docRes] = await Promise.all([
    supabaseAdmin.from("request_messages").select(`*, users!request_messages_sender_id_fkey(name, role), forms(title)`).eq("request_id", reqId).order("created_at", { ascending: true }),
    supabaseAdmin.from("documents").select(`*`).eq("request_id", reqId).order("created_at", { ascending: false })
  ]);
  return { messages: msgRes.data || [], documents: docRes.data || [] };
}

// export async function adminSendMessageAction(payload: any) {
//   const admin = await requireAdmin();
//   const { error } = await supabaseAdmin.from("request_messages").insert([{
//     ...payload,
//     sender_id: admin.sub,
//     sender_role: admin.role,
//   }]);
//   if (error) throw new Error(error.message);
//   await supabaseAdmin.from("requests").update({ updated_at: new Date().toISOString() }).eq("id", payload.request_id);
//   return { success: true };
// }

export async function adminSendMessageAction(payload: any) {
  const admin = await requireCOAdmin();
  
  // ✨ SANITIZE: Only extract known safe fields
  const cleanPayload = {
    request_id: payload.request_id,
    message_type: payload.message_type,
    content: payload.content || null,
    payment_amount: payload.payment_amount || null,
    is_result_doc: payload.is_result_doc || false,
    reply_to_id: null,
    doc_name: payload.doc_name || null,
    doc_url: payload.doc_url || null,
    doc_size: payload.doc_size || null,
  };

  // Validate reply_to_id is a real UUID or null
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (payload.reply_to_id && uuidRegex.test(payload.reply_to_id)) {
    cleanPayload.reply_to_id = payload.reply_to_id;
  } else {
    cleanPayload.reply_to_id = null;
  }

  const { error } = await supabaseAdmin.from("request_messages").insert([{
    ...cleanPayload,
    sender_id: admin.sub,
    sender_role: admin.role,
  }]);
  
  if (error) throw new Error(error.message);
  
  await supabaseAdmin.from("requests").update({ 
    updated_at: new Date().toISOString() 
  }).eq("id", payload.request_id);
  
  return { success: true };
}

export async function adminUpdateReqStatusAction(reqId: string, status: string) {
  const admin = await requireCOAdmin();
  const { error } = await supabaseAdmin.from("requests").update({ status }).eq("id", reqId);
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("audit_logs").insert([{ actor_id: admin.sub, actor_name: admin.name, action: `Status changed to ${status}`, record_id: reqId }]);
  return { success: true };
}

export async function adminAssignReqAction(reqId: string, assigneeId: string) {
  await requireCOAdmin();
  const { error } = await supabaseAdmin.from("requests").update({ assigned_to: assigneeId }).eq("id", reqId);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function adminCreateNewChatAction(userId: string) {
  const admin = await requireCOAdmin();
  const { data, error } = await supabaseAdmin.from("requests").insert([{
    user_id: userId, service: "Admin Support Chat", title: "Direct Interaction", status: "processing", priority: "regular", assigned_to: admin.sub, payment_status: "na", payment_amount: 0
  }]).select("*, users!requests_user_id_fkey(name, mobile)").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminSearchUsersAction(query: string) {
  await requireCOAdmin();
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("role", "user").or(`name.ilike.%${query}%,mobile.ilike.%${query}%`).limit(10);
  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdateDeliveryStatusAction(reqId: string, deliveryStatus: string) {
  const admin = await getAuthUser();
  if (!admin) throw new Error("Unauthorized");
  const { error } = await supabaseAdmin
    .from("requests")
    .update({ 
      delivery_status: deliveryStatus,
      delivery_boy_id: deliveryStatus === 'out_for_delivery' ? admin.sub : null,
      updated_at: new Date().toISOString()
    })
    .eq("id", reqId);

  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── LIVE TRACKING ACTIONS ──────────────────────────────────────────────────
export async function updateDeliveryLocationAction(payload: { 
  request_id: string; 
  current_lat: number; 
  current_lng: number; 
  heading: number; 
}) {
  const admin = await getAuthUser(); // Security check! Only admins can broadcast.
  if (!admin) throw new Error("Unauthorized");
  const { error } = await supabaseAdmin
    .from("delivery_tracking")
    .upsert({
      request_id: payload.request_id,
      delivery_boy_id: admin.sub, // The admin currently doing the delivery
      current_lat: payload.current_lat,
      current_lng: payload.current_lng,
      heading: payload.heading,
      updated_at: new Date().toISOString()
    }, { 
      onConflict: 'request_id' // If this request already has a location, update it instead of creating a new row!
    });

  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── TEAM ACTIONS ─────────────────────────────────────────────────────────────
export async function adminGetTeamAction() {
  await requireCOAdmin();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdateUserRoleAction(userId: string, role: string) {
  const admin = await requireAdmin();
  if (admin.role !== "main_admin") throw new Error("Only Main Admin can alter roles");

  const { error } = await supabaseAdmin.from("users").update({ role }).eq("id", userId);
  if (error) throw new Error(error.message);

  const { error: authError } = await supabaseAdmin.auth.admin.signOut(userId, "global");
  if (authError) console.error("Failed to revoke session globally:", authError);

  return { success: true };
}

// ─── POST ACTIONS ─────────────────────────────────────────────────────────────

/** Shape of a full Sarkari-style post coming from the create page */
export interface PostPayload {
  // Core
  title: string;
  title_hi: string;
  short_desc: string;
  theme: string;
  service_cost: number;
  category: string;
  tags: string[];
  slug?: string;
  banner_url?: string;
  is_published: boolean;

  // Organisation
  organization: string;
  organization_hi: string;
  total_posts: number;
  post_date: string; // ISO date string

  // Dates
  important_dates: Array<{
    label: string;
    label_hi: string;
    date: string;
    is_bold: boolean;
  }>;

  // Fee
  fee_general: number;
  fee_sc_st: number;
  fee_ph: number;
  fee_payment_modes: string[];

  // Age
  age_min: number;
  age_max: string;
  age_as_on_date: string;
  age_relaxation: string;

  // Vacancy
  vacancy_details: Array<{
    post_name: string;
    no_of_posts: number;
    category?: string;
  }>;

  // Eligibility
  eligibility: Array<{
    post_name: string;
    criteria: string;
    criteria_hi: string;
  }>;

  // Selection
  selection_process: string[];

  // How to apply
  how_to_apply: string;
  how_to_apply_hi: string;

  // Links
  important_links: Array<{
    label: string;
    label_hi: string;
    url: string;
    is_active: boolean;
  }>;

  // FAQs
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // Also check
  also_check: Array<{
    label: string;
    url: string;
  }>;

  // Social
  whatsapp_link: string;
  telegram_link: string;
}

export async function adminGetPostsAction() {
  await requireCOAdmin();
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*, users(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function adminGetPostByIdAction(postId: string) {
  await requireCOAdmin();
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*, users(name)")
    .eq("id", postId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminCreatePostAction(postData: PostPayload) {
  const admin = await requireAdmin();

  const insertPayload = {
    // Legacy / core fields
    title: postData.title,
    title_hi: postData.title_hi,
    short_desc: postData.short_desc,
    theme: postData.theme,
    service_cost: Number(postData.service_cost) || 0,
    created_by: admin.sub,
    is_published: postData.is_published ?? true,
    category: postData.category || "Latest Job",
    tags: postData.tags || [],

    // Slug (if not provided, DB trigger will generate from title)
    slug: postData.slug || null,
    banner_url: postData.banner_url || null,

    // Organisation
    organization: postData.organization,
    organization_hi: postData.organization_hi,
    total_posts: postData.total_posts || 0,
    post_date: postData.post_date || new Date().toISOString().split("T")[0],

    // Dates
    important_dates: postData.important_dates || [],

    // Fee
    fee_general: postData.fee_general || 0,
    fee_sc_st: postData.fee_sc_st || 0,
    fee_ph: postData.fee_ph || 0,
    fee_payment_modes: postData.fee_payment_modes || ["Online"],

    // Age
    age_min: postData.age_min || null,
    age_max: postData.age_max || null,
    age_as_on_date: postData.age_as_on_date || null,
    age_relaxation: postData.age_relaxation || "",

    // Vacancy
    vacancy_details: postData.vacancy_details || [],

    // Eligibility
    eligibility: postData.eligibility || [],

    // Selection
    selection_process: postData.selection_process || [],

    // How to apply
    how_to_apply: postData.how_to_apply || "",
    how_to_apply_hi: postData.how_to_apply_hi || "",

    // Links
    important_links: postData.important_links || [],

    // FAQs
    faqs: postData.faqs || [],

    // Also check
    also_check: postData.also_check || [],

    // Social
    whatsapp_link: postData.whatsapp_link || "",
    telegram_link: postData.telegram_link || "",
  };

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert([insertPayload])
    .select("*, users(name)")
    .single();

  if (error) throw new Error(error.message);

  // Audit log
  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Created post: ${postData.title}`,
    record_id: data.id,
  }]);

  return data;
}

export async function adminUpdatePostAction(postId: string, postData: Partial<PostPayload>) {
  const admin = await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("posts")
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select("*, users(name)")
    .single();

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Updated post: ${postData.title || postId}`,
    record_id: postId,
  }]);

  return data;
}

export async function adminTogglePostPublishAction(postId: string, isPublished: boolean) {
  const admin = await requireAdmin();
  const { error } = await supabaseAdmin
    .from("posts")
    .update({ is_published: isPublished })
    .eq("id", postId);
  if (error) throw new Error(error.message);

  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Post ${isPublished ? "published" : "unpublished"}: ${postId}`,
    record_id: postId,
  }]);

  return { success: true };
}

export async function adminDeletePostAction(postId: string) {
  const admin = await requireAdmin();
  if (admin.role !== "main_admin") throw new Error("Only Main Admin can delete posts");

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", postId);
  if (error) throw new Error(error.message);

  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Deleted post: ${postId}`,
    record_id: postId,
  }]);

  return { success: true };
}

export async function adminDeleteRequestsAction(requestIds: string[]) {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("requests")
    .delete()
    .in("id", requestIds);

  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── FETCH CURRENT ADMIN PROFILE ───
export async function getAdminProfileAction() {
  try {
    const liveUser = await requireAdmin();
    return liveUser;
  } catch (error) {
    return null;
  }
}


// ─── GET POST FOR EDITING ───
export async function adminGetPostAction(id: string) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}



// ─── GALLERY ACTIONS ───

export async function uploadGalleryImageAction(formData: FormData) {
  const admin = await requireAdmin(); // Your security check
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!file) throw new Error("No file uploaded");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `work-images/${fileName}`;

  // 1. Upload to Storage
  const { data: storageData, error: storageError } = await supabaseAdmin.storage
    .from("gallery")
    .upload(filePath, file);

  if (storageError) throw storageError;

  // 2. Get Public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("gallery")
    .getPublicUrl(filePath);

  // 3. Save to Database
  const { error: dbError } = await supabaseAdmin
    .from("gallery")
    .insert([{ url: publicUrl, title }]);

  if (dbError) throw dbError;
  return { success: true };
}

export async function deleteGalleryImageAction(id: string, storagePath: string) {
  const admin = await requireAdmin();
  
  // 1. Delete from DB
  await supabaseAdmin.from("gallery").delete().eq("id", id);
  
  // 2. Delete from Storage (extracted from URL)
  const path = storagePath.split('public/gallery/')[1];
  await supabaseAdmin.storage.from("gallery").remove([path]);
  
  return { success: true };
}



// ─── GET GALLERY IMAGES ───
export async function getGalleryImagesAction() {
  const { data, error } = await supabaseAdmin
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw new Error(error.message);
  return data || [];
}


// Add to src/app/actions/admin.ts
export async function adminAssignDeliveryBoyAction(requestId: string, deliveryBoyId: string) {
    const user = await getAuthUser();
    if (!user || user.role === "user") throw new Error("Unauthorized");
    
    const { error } = await supabaseAdmin.from("requests")
        .update({ delivery_boy_id: deliveryBoyId, delivery_status: 'pending' })
        .eq("id", requestId);
        
    if (error) throw new Error(error.message);
    return true;
}

// ─── AADHAR ACTIONS ───────────────────────────────────────────────────────────
export async function adminGetAadharScansAction() {
  await requireCOAdmin();
  const { data, error } = await supabaseAdmin
    .from("aadhar_scans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function adminDeleteAadharScanAction(id: string) {
  const admin = await requireAdmin();
  if (admin.role !== "main_admin") throw new Error("Only Main Admin can delete Aadhar records");
  const { error } = await supabaseAdmin.from("aadhar_scans").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function adminDeleteAadharScansAction(ids: string[]) {
  const admin = await requireAdmin();
  if (admin.role !== "main_admin") throw new Error("Only Main Admin can delete Aadhar records");
  const { error } = await supabaseAdmin.from("aadhar_scans").delete().in("id", ids);
  if (error) throw new Error(error.message);
  return { success: true };
}

 