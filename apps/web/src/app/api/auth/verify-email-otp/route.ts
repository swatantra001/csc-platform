import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    // 1. Fetch user by email
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user || user.otp_code !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 401 });
    }

    // 2. Check Expiry
    if (new Date() > new Date(user.otp_expires_at)) {
      return NextResponse.json({ success: false, message: "OTP expired" }, { status: 401 });
    }

    // 3. Clear OTP to prevent reuse
    await supabaseAdmin.from("users").update({ otp_code: null, otp_expires_at: null }).eq("id", user.id);

    // 4. Create Session JWT
    const jwtPayload = {
      sub: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      name: user.name,
      preferred_lang: user.preferred_lang,
    };
    
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "fallback", { expiresIn: '30d' });

    // 5. Set Cookies
    const res = NextResponse.json({ success: true, user });
    const cookieOpts = {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 30, path: "/",
    };

    res.cookies.set("csc_token", token, cookieOpts);
    res.cookies.set("csc_role", user.role, { ...cookieOpts, httpOnly: false });
    
    return res;
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}