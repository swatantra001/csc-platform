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

export async function fetchMyAddressesAction() {
  const user = await getAuthUser();
  if (!user) return [];
  const userId = (user as any).sub || (user as any).id;
  
  const { data, error } = await supabaseAdmin
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Address fetch error:", error);
    return [];
  }
  return data || [];
}

export async function addAddressAction(payload: { label: string; full_address: string; pincode: string }) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  const userId = (user as any).sub || (user as any).id;

  const { data, error } = await supabaseAdmin
    .from("addresses")
    .insert({
      user_id: userId,
      label: payload.label,
      full_address: payload.full_address,
      pincode: payload.pincode
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}


// 3. Delete Address
export async function deleteAddressAction(addressId: string) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  const userId = (user as any).sub || (user as any).id;

  const { error } = await supabaseAdmin
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId); // Security check to ensure they own it

  if (error) throw new Error(error.message);
  return { success: true };
}