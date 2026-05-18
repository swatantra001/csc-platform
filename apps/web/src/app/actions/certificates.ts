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

// 1. Save certificate record to DB
export async function issueCertificateAction(payload: { user_id: string; student_name: string; course_name: string; certificate_number: string; file_url: string }) {
    const user = await getAuthUser();
    if (!user || user.role === "user" || user.role === "co_admin") throw new Error("Unauthorized");

    const { data, error } = await supabaseAdmin.from("certificates").insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
}

// 2. Fetch for user dashboard
export async function getMyCertificatesAction() {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");
    const userId = (user as any).sub || (user as any).id;

    const { data, error } = await supabaseAdmin.from("certificates").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

// 3. Verify certificate (Public)
export async function verifyCertificateAction(certNumber: string) {
    const { data, error } = await supabaseAdmin.from("certificates").select("*, users(mobile)").eq("certificate_number", certNumber).single();
    if (error) return null;
    return data;
}



export async function uploadAndIssueCertificateAction(formData: FormData) {
    const user = await getAuthUser();
    if (!user || user.role === "user") throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const targetUserId = formData.get("targetUserId") as string;
    const targetUserName = formData.get("targetUserName") as string;
    const courseName = formData.get("courseName") as string;
    const certNumber = formData.get("certNumber") as string;

    if (!file) throw new Error("Missing PDF file");

    // 1. Upload using Admin client (Bypasses Storage RLS restrictions)
    const fileName = `${certNumber}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
        .from("certificates")
        .upload(fileName, file, { contentType: "application/pdf", upsert: true });

    if (uploadError) throw new Error("Storage Upload failed: " + uploadError.message);

    // 2. Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage.from("certificates").getPublicUrl(fileName);

    // 3. Save to DB
    const { data, error: dbError } = await supabaseAdmin.from("certificates").insert([{
        user_id: targetUserId,
        student_name: targetUserName,
        course_name: courseName,
        certificate_number: certNumber,
        file_url: publicUrlData.publicUrl,
    }]).select().single();

    if (dbError) throw new Error("Database insert failed: " + dbError.message);

    return data;
}