"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


// ─── AUTH VERIFICATION ────────────────────────────────────────────────────────
async function requireAdmin() {
	const cookie = await cookies();
	const token = cookie.get("csc_token")?.value;
	if (!token) throw new Error("Unauthorized - No token");

	const user = await getUserFromToken(token);
	if (!user || (user.role !== "main_admin" && user.role !== "co_admin")) {
		throw new Error("Forbidden - Admin access required");
	}
	return user;
}

export async function getFormsAction() {
	const { data, error } = await supabaseAdmin.from("forms").select("*").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data;
}

export async function createFormAction(formPayload: any) {
	await requireAdmin();

	const { data, error } = await supabaseAdmin.from("forms").insert([formPayload]).select().single();
	if (error) throw new Error(error.message);

	revalidatePath("/admin/forms");
	return data;
}

export async function updateFormAction(id: string, formPayload: any) {
	await requireAdmin();

	const { data, error } = await supabaseAdmin.from("forms").update(formPayload).eq("id", id).select().single();
	if (error) throw new Error(error.message);

	revalidatePath("/admin/forms");
	return data;
}

export async function deleteFormAction(id: string) {
	await requireAdmin();

	const { error } = await supabaseAdmin.from("forms").delete().eq("id", id);
	if (error) throw new Error(error.message);

	revalidatePath("/admin/forms");
	return { success: true };
}