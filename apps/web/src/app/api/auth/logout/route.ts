// ════════════════════════════════════════════════════════════════════════════
// FILE 4: app/api/auth/logout/route.ts
// ════════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout  — clears all auth cookies
 
import { NextResponse } from "next/server";
 
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("csc_token");
  res.cookies.delete("csc_role");
  res.cookies.delete("csc_lang");
  return res;
}