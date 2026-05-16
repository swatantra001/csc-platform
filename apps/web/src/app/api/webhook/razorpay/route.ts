import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

    // Verify Webhook Signature (requires setting RAZORPAY_WEBHOOK_SECRET in .env.local)
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // If a payment successfully cleared
    if (event.event === "payment.captured") {
      const orderId = event.payload.payment.entity.order_id;
      
      // Update the request status safely in the background
      await supabaseAdmin
        .from("requests")
        .update({
          payment_status: "paid",
          status: "processing",
          updated_at: new Date().toISOString()
        })
        .eq("razorpay_order_id", orderId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}