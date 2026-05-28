import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("sid");
  if (!sid) return NextResponse.json({ success: false }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("qr_sessions")
    .select("*")
    .eq("id", sid)
    .single();

  if (!data || new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ success: false, expired: true });
  }

  if (data.status === "approved" && data.web_token) {
    return NextResponse.json({ success: true, token: data.web_token });
  }

  return NextResponse.json({ success: false, status: data.status });
}