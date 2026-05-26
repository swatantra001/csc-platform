import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("csc_token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback") as any;
    if (!decoded?.sub) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    const { requestId, otp } = await req.json();
    if (!requestId || !otp) return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });

    const { data: row, error } = await supabaseAdmin
      .from("requests")
      .select("delivery_boy_id, delivery_otp_code, delivery_otp_expires_at")
      .eq("id", requestId)
      .single();

    if (error || !row) return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    if (row.delivery_boy_id !== decoded.sub) {
      return NextResponse.json({ success: false, message: "Not your delivery" }, { status: 403 });
    }

    if (row.delivery_otp_code !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }
    if (!row.delivery_otp_expires_at || new Date() > new Date(row.delivery_otp_expires_at)) {
      return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
    }

    // ── Auto-mark delivered ──
    await supabaseAdmin.from("requests").update({
      delivery_status: "delivered",
      delivery_otp_verified_at: new Date().toISOString(),
      delivery_otp_code: null,
      delivery_otp_expires_at: null,
      updated_at: new Date().toISOString(),
    }).eq("id", requestId);

    return NextResponse.json({ success: true, message: "Delivery confirmed successfully" });
  } catch (err: any) {
    console.error("Verify OTP Error:", err);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}