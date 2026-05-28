// ════════════════════════════════════════════════════════════════════════════
// FILE 6: app/api/auth/set-password/route.ts
// ════════════════════════════════════════════════════════════════════════════
// POST /api/auth/set-password
// Body: { password: string }  — requires valid csc_token cookie (user must be logged in via OTP first)
 
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, setPassword } from "@/lib/auth";
 
// export const runtime = "edge";
 
export async function POST(req: NextRequest) {
  const token = req.cookies.get("csc_token")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
 
  const payload = await getUserFromToken(token);
  if (!payload) return NextResponse.json({ success: false, message: "Invalid session." }, { status: 401 });
 
  const { password } = await req.json() as { password: string };
  if (!password || password.length < 6) {
    return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
  }
 
  const ok = await setPassword(payload.sub, password);
  return NextResponse.json({ success: ok, message: ok ? "Password set successfully." : "Failed to set password." });
}