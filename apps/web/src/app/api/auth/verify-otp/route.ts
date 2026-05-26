// ════════════════════════════════════════════════════════════════════════════
// FILE 2: app/api/auth/verify-otp/route.ts
// ════════════════════════════════════════════════════════════════════════════
// POST /api/auth/verify-otp
// Body: { mobile: string, otp: string }
// Returns: sets httpOnly cookie + returns user info
 
import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth";
 
export const runtime = "edge";
 
export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json() as { mobile: string; otp: string };
 
    if (!mobile || !otp || otp.length !== 6) {
      return NextResponse.json({ success: false, message: "Invalid input." }, { status: 400 });
    }
 
    const result = await verifyOtp(mobile, otp);
    if (!result.success || !result.token) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 });
    }
 
    const res = NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
      token: result.token,
    });
 
    // Set secure httpOnly cookies
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOpts = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    };
 
    res.cookies.set("csc_token", result.token, cookieOpts);
    res.cookies.set("csc_role",  result.user!.role, { ...cookieOpts, httpOnly: false }); // role readable by middleware
    res.cookies.set("csc_lang",  result.user!.preferred_lang, { ...cookieOpts, httpOnly: false });
 
    return res;
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}