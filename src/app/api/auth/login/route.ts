// apps/web/src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { mobile, otp, password } = await req.json();

  // TODO: verify OTP or password against Supabase
  // const user = await supabase.from("users").select().eq("mobile", mobile).single()

  // Mock: set cookies on success
  const response = NextResponse.json({ success: true });

  response.cookies.set("csc_token", "your_jwt_here", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  response.cookies.set("csc_role", "main_admin", { // or "user", "co_admin"
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}