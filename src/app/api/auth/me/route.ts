// app/api/auth/me/route.ts
// GET /api/auth/me  — returns current user from JWT in cookie
 
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
 
// DELETED: export const runtime = "edge"; <-- Standard Node.js is safer for DB calls!
 
export async function GET(req: NextRequest) {
  const token = req.cookies.get("csc_token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
 
  const payload = await getUserFromToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
 
  // Fetch fresh data from DB (in case role changed)
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, mobile, email, name, role, wallet_balance, preferred_lang, position_label, created_at")
    .eq("id", payload.sub)
    .single();
 
  // If there's an error, print it to VS Code so we aren't guessing!
  if (error || !user) {
    console.error("[Auth/Me] DB Error fetching user:", error?.message);
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}