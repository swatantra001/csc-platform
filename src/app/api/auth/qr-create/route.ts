import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST() {
  const id = randomUUID();
  const expires = new Date(Date.now() + 2 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin
    .from("qr_sessions")
    .insert({ id, status: "pending", expires_at: expires });

  if (error) return NextResponse.json({ success: false }, { status: 500 });

  return NextResponse.json({ success: true, session_id: id });
}