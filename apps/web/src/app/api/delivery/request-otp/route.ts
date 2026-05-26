import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──
    const token = req.cookies.get("csc_token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback") as any;
    if (!decoded?.sub) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    const { requestId } = await req.json();
    if (!requestId) return NextResponse.json({ success: false, message: "Missing requestId" }, { status: 400 });

    // ── Verify assignment ──
    const { data: row, error } = await supabaseAdmin
      .from("requests")
      .select("delivery_boy_id, user_id, users!requests_user_id_fkey(email, name)")
      .eq("id", requestId)
      .single();

    if (error || !row) return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    if (row.delivery_boy_id !== decoded.sub) {
      return NextResponse.json({ success: false, message: "Not your delivery" }, { status: 403 });
    }

    const userEmail = row.users?.email;
    const userName = row.users?.name || "User";
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "User has no email on file" }, { status: 400 });
    }

    // ── Generate & Save OTP ──
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    await supabaseAdmin.from("requests").update({
      delivery_otp_code: otp,
      delivery_otp_expires_at: expiresAt,
      delivery_otp_verified_at: null,
    }).eq("id", requestId);

    // ── Email User ──
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from: `"Srilal CSC Delivery" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🛵 Your Delivery OTP — Srilal CSC",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
          <h2 style="color:#15803d;margin-top:0;">🛵 Delivery OTP</h2>
          <p>Hi ${userName},</p>
          <p>Your delivery agent has arrived. Share the code below only when you receive your documents.</p>
          <div style="text-align:center;padding:20px;background:#f0fdf4;border-radius:10px;margin:16px 0;">
            <span style="font-size:2rem;font-weight:800;color:#15803d;letter-spacing:6px;">${otp}</span>
            <p style="margin:8px 0 0;font-size:0.8rem;color:#64748b;">Valid for 10 minutes</p>
          </div>
          <p style="font-size:0.85rem;color:#64748b;">If you did not request this, please ignore.</p>
          <p style="margin-top:20px;font-size:0.8rem;color:#94a3b8;">— Srilal CSC, Shambhuganj</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to user email" });
  } catch (err: any) {
    console.error("Delivery OTP Error:", err);
    return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
  }
}