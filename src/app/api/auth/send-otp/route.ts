// app/api/auth/send-otp/route.ts
// POST /api/auth/send-otp
// Body: { mobile: string, channel?: "sms" | "whatsapp" }
// FIX: removed "edge" runtime — Supabase admin client needs Node.js runtime

import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/auth";

// !! DO NOT add: export const runtime = "edge"
// Supabase service role key only works in Node.js runtime

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobile, channel = "sms" } = body as {
      mobile: string;
      channel?: "sms" | "whatsapp";
    };

    // Validate Indian mobile number
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, message: "Invalid mobile number. Must be 10 digits starting with 6–9." },
        { status: 400 }
      );
    }

    const result = await sendOtp(mobile, channel);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}