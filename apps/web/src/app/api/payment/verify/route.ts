import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the Mobile Request
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || req.cookies.get("csc_token")?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // 2. Parse the request body
    const { 
      messageId, 
      requestId, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await req.json();

    // 3. Verify the Razorpay Signature securely on the backend
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // 4. Update the Message as Paid in Supabase
    await supabaseAdmin
      .from("request_messages")
      .update({
        payment_status: "paid",
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id
      })
      .eq("id", messageId);

    // 5. Update the parent Request status
    await supabaseAdmin
      .from("requests")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", requestId);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🚨 MOBILE PAYMENT VERIFY CRASH 🚨:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}