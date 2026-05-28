"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function getAuthUser() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) return null;
  return await getUserFromToken(token);
}

// 1. Create Order (Now tied to a specific MESSAGE)
export async function createRazorpayOrderAction(messageId: string, amount: number) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return { success: false, error: "Razorpay API keys are missing" };
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise, 
      currency: "INR",
      receipt: messageId.substring(0, 39), // Tie the receipt to the specific message
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
    
  } catch (error: any) {
    console.error("🚨 RAZORPAY API CRASH 🚨:", error);
    return { success: false, error: error?.error?.description || error?.message || "Failed to create Order" };
  }
}

// 2. Verify Payment (Updates the specific MESSAGE)
export async function verifyRazorpayPaymentAction(
  messageId: string,
  requestId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return { success: false, error: "Invalid signature." };
    }

    // ✨ UPDATE THE SPECIFIC MESSAGE AS PAID ✨
    await supabaseAdmin
      .from("request_messages")
      .update({
        payment_status: "paid",
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id
      })
      .eq("id", messageId);

    // Also update the main request to show it's being worked on
    await supabaseAdmin
      .from("requests")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", requestId);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Verification failed" };
  }
}