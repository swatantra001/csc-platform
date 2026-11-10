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

// 3. Verify certificate (Public) — works for BOTH pdf certs & excel certs
export async function verifyCertificateAction(certNumber: string) {
    // Try PDF certificates first
    const { data: pdfCert, error: pdfErr } = await supabaseAdmin
        .from("certificates")
        .select("*, users(mobile)")
        .eq("certificate_number", certNumber)
        .single();

    if (!pdfErr && pdfCert) return pdfCert;

    // Fallback to Excel-backed certificates
    const { data: excelCert, error: excelErr } = await supabaseAdmin
        .from("excel_certificates")
        .select("*")
        .eq("roll_no", certNumber)
        .single();

    if (!excelErr && excelCert) {
        return {
            ...excelCert,
            certificate_number: excelCert.roll_no,
            student_name: excelCert.student_name,
            course_name: excelCert.course_name,
            issue_date: excelCert.created_at,
            file_url: null,
            users: null,
        };
    }

    return null;
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


// 4. Bulk upload parsed Excel rows (Admin only)
export async function uploadBulkExcelAction(rows: {
    roll_no: string;
    student_name: string;
    father_name?: string;
    mother_name?: string;
    course_name: string;
    grade?: string;
    email?: string;
    mobile?: string;
}[]) {
    const user = await getAuthUser();
    if (!user || user.role === "user") throw new Error("Unauthorized");

    for (const r of rows) {
        if (!r.roll_no?.trim() || !r.student_name?.trim() || !r.course_name?.trim()) {
            throw new Error("Each row must contain Roll No, Student Name & Course Name");
        }
        if (!r.email?.trim() && !r.mobile?.trim()) {
            throw new Error("Each row must have at least Email or Mobile");
        }
    }

    const { error } = await supabaseAdmin.from("excel_certificates").insert(rows);
    if (error) throw new Error("Bulk insert failed: " + error.message);
    return { count: rows.length };
}

// 5. Fetch Excel certificates for the logged-in student (matched by email/mobile)
export async function getMyExcelCertificatesAction() {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");

    const email = (user as any).email;
    const mobile = (user as any).mobile;
    if (!email && !mobile) return [];

    let query = supabaseAdmin.from("excel_certificates").select("*");

    if (email && mobile) {
        query = query.or(`email.eq.${email},mobile.eq.${mobile}`);
    } else if (email) {
        query = query.eq("email", email);
    } else if (mobile) {
        query = query.eq("mobile", mobile);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    // Deduplicate by roll_no so student never sees redundant entries
    const seen = new Set<string>();
    return (data || []).filter((row: any) => {
        if (seen.has(row.roll_no)) return false;
        seen.add(row.roll_no);
        return true;
    });
}





// ─────────────────────────────────────────────────────────────────────────────
// NEW SERVER ACTIONS — paste all four functions at the end of
// D:\csc-platform\src\app\actions\certificates.ts (no new file, no new imports:
// they use that file's existing getAuthUser() and supabaseAdmin).
//
// 1. getAllCertificatesAction — list (was already delivered; kept unchanged).
// 2. updateCertificateAction — edit a PDF certificate's record.
// 3. updateExcelCertificateAction — edit an Excel-backed certificate's record.
// 4. deleteCertificateAction — delete a certificate (main_admin only).
//
// ROLES: viewing and editing allow co_admin + main_admin (same as the upload
// actions in this file). Deleting is main_admin-only, matching
// adminDeletePostAction / adminDeleteAadharScanAction in admin.ts. The page
// hides the Delete button for co_admin; the server check below is the real
// enforcement, so a co_admin calling the action directly still gets rejected.
//
// WHY IT IS NEEDED:
// None of the supplied actions can list every certificate. getMyCertificatesAction
// returns only the logged-in user's own certificates, and
// getMyExcelCertificatesAction returns only Excel rows matching the logged-in
// user's own email/mobile — an admin opening the certificates page with those
// would see almost nothing. This action fetches both tables (PDF certificates
// and Excel-backed certificates), newest first, for the admin list.
//
// ACCESS: throws "Unauthorized" when there is no login or the role is "user",
// so co_admin and main_admin can view. That matches uploadAndIssueCertificateAction
// and uploadBulkExcelAction in the same file. NOTE: issueCertificateAction in the
// same file is stricter — it also throws for co_admin, so only main_admin can
// issue. If viewing should also be main_admin-only, change the check below to
// `if (!user || user.role !== "main_admin")`.
//
// RETURNS: { pdf, excel } — pdf rows are the certificates table with the
// student's mobile joined (same select as verifyCertificateAction uses:
// "*, users(mobile)"); excel rows are the excel_certificates table as stored.
// ─────────────────────────────────────────────────────────────────────────────
export async function getAllCertificatesAction() {
  const user = await getAuthUser();
  if (!user || user.role === "user") throw new Error("Unauthorized");

  const [pdfRes, excelRes] = await Promise.all([
    supabaseAdmin
      .from("certificates")
      .select("*, users(mobile)")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("excel_certificates")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (pdfRes.error) throw new Error(pdfRes.error.message);
  if (excelRes.error) throw new Error(excelRes.error.message);

  return { pdf: pdfRes.data || [], excel: excelRes.data || [] };
}

// 7. Update a PDF certificate's record (Admin only: co_admin + main_admin)
// NOTE: this updates the database row only. The stored PDF file itself is
// unchanged — to change what the PDF says, re-issue it from the admin panel.
export async function updateCertificateAction(
  id: string,
  patch: { certificate_number: string; student_name: string; course_name: string }
) {
  const user = await getAuthUser();
  if (!user || user.role === "user") throw new Error("Unauthorized");
  if (!patch.certificate_number?.trim() || !patch.student_name?.trim() || !patch.course_name?.trim()) {
    throw new Error("Certificate number, student name and course are required");
  }

  const { error } = await supabaseAdmin.from("certificates").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// 8. Update an Excel-backed certificate's record (Admin only: co_admin + main_admin)
export async function updateExcelCertificateAction(
  id: string,
  patch: {
    roll_no: string;
    student_name: string;
    father_name?: string | null;
    mother_name?: string | null;
    course_name: string;
    grade?: string | null;
    email?: string | null;
    mobile?: string | null;
  }
) {
  const user = await getAuthUser();
  if (!user || user.role === "user") throw new Error("Unauthorized");
  if (!patch.roll_no?.trim() || !patch.student_name?.trim() || !patch.course_name?.trim()) {
    throw new Error("Roll no., student name and course are required");
  }

  const { error } = await supabaseAdmin.from("excel_certificates").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// 9. Delete a certificate (Main Admin only)
export async function deleteCertificateAction(id: string, kind: "pdf" | "excel") {
  const user = await getAuthUser();
  if (!user || user.role !== "main_admin") {
    throw new Error("Only Main Admin can delete certificates");
  }

  const table = kind === "pdf" ? "certificates" : "excel_certificates";
  const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}
