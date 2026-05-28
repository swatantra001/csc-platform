"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken, hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";



async function getAuthUser() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) return null;
  return await getUserFromToken(token);
}

// 1. UPDATE PROFILE (Name, Mobile, Language)
export async function updateUserProfile(data: { name?: string; mobile?: string; preferred_lang?: "hi" | "en" }) {
  try {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");

    // check if mobile is being updated and if it's already taken by another user
    if (data.mobile) {
      const { data: existingUser, error: e } = await supabaseAdmin.from("users").select("id").eq("mobile", data.mobile).single();
      if (e && e.code !== "PGRST116") throw e;
      if (existingUser && existingUser.id !== user.sub) {
        throw new Error("Mobile number already in use");
      }
    }

    const { error } = await supabaseAdmin.from("users").update(data).eq("id", user.sub);
    if (error) throw error;

    return { success: true, message: "Profile updated successfully" };
  } catch (err: any) {
    return { success: false, error: err.message, message: "Failed to update profile" };
  }
}

// 2. UPDATE PASSWORD
export async function updatePasswordAction(newPassword: string) {
  try {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");

    // Securely hash the password before saving
    const hashedPassword = await hashPassword(newPassword);

    const { error } = await supabaseAdmin
      .from("users")
      .update({ password_hash: hashedPassword })
      .eq("id", user.sub);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// 3. TOP-UP WALLET
export async function topUpWalletAction(amount: number) {
  try {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Fetch current balance
    const { data: dbUser, error: fetchErr } = await supabaseAdmin
      .from("users")
      .select("wallet_balance")
      .eq("id", user.sub)
      .single();

    if (fetchErr || !dbUser) throw new Error("Could not fetch wallet");

    const newBalance = Number(dbUser.wallet_balance) + Number(amount);

    // 2. Update Balance
    const { error: updateErr } = await supabaseAdmin
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("id", user.sub);

    if (updateErr) throw updateErr;

    // 3. Insert Transaction Record
    await supabaseAdmin.from("wallet_transactions").insert({
      user_id: user.sub,
      type: "credit",
      amount: amount,
      description: "Wallet top-up via UPI",
      description_hi: "UPI द्वारा वॉलेट में जोड़ा",
      balance_after: newBalance
    });

    return { success: true, newBalance };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}