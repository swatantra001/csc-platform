"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { updateUserProfile } from "./user";

// Helper to get the logged-in user securely
async function getAuthUser() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) return null;
  return await getUserFromToken(token);
}

// 1. Upload Avatar
export async function uploadAvatarAction(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.sub}/${Date.now()}-avatar.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabaseAdmin.storage.from("avatars").getPublicUrl(fileName);
    await updateUserProfile({ avatar_url: publicUrlData.publicUrl } as any); 

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.error("Avatar Upload Error:", err);
    return { success: false, error: err.message };
  }
}

// 2. Upload Chat Attachment
export async function uploadChatFileAction(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const requestId = formData.get("requestId") as string;
    if (!file || !requestId) throw new Error("Missing file or requestId");

    // Sanitize filename to prevent URL issues
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${requestId}/${Date.now()}-${safeName}`;

    // ✨ FIX: Added contentType to prevent .htm downloads
    const { data, error } = await supabaseAdmin.storage
      .from("chat_files")
      .upload(fileName, file, {
        contentType: file.type, 
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabaseAdmin.storage.from("chat_files").getPublicUrl(fileName);
    
    return { success: true, url: publicUrlData.publicUrl, size: file.size, name: file.name };
  } catch (err: any) {
    console.error("File Upload Error:", err);
    return { success: false, error: err.message };
  }
}