// ════════════════════════════════════════════════════════════════════════════
// FILE 3: app/api/auth/login-password/route.ts
// ════════════════════════════════════════════════════════════════════════════
// POST /api/auth/login-password
// Body: { mobile: string, password: string }
 
import { NextRequest, NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/auth";
 
export const runtime = "edge";
 
export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json() as { identifier: string; password: string };
 
    if (!identifier || !password) {
      return NextResponse.json({ success: false, message: "Mobile/Email and password required." }, { status: 400 });
    }
    
 
    const result = await loginWithPassword(identifier, password);
    if (!result.success || !result.token) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 });
    }
 
    const res = NextResponse.json({ success: true, user: result.user });
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOpts = { httpOnly: true, secure: isProduction, sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 30, path: "/" };
 
    res.cookies.set("csc_token", result.token, cookieOpts);
    res.cookies.set("csc_role",  result.user!.role, { ...cookieOpts, httpOnly: false });
    res.cookies.set("csc_lang",  result.user!.preferred_lang, { ...cookieOpts, httpOnly: false });
 
    return res;
  } catch (err) {
    console.error("[login-password]", err);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}