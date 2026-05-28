import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyJwt, signJwt } from "@/lib/auth";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const mobileToken = auth.replace("Bearer ", "");
  if (!mobileToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const payload = await verifyJwt(mobileToken);
  if (!payload) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  const sid = body.session_id;
  if (!sid) return NextResponse.json({ success: false }, { status: 400 });

  const { data: session } = await supabaseAdmin
    .from("qr_sessions")
    .select("*")
    .eq("id", sid)
    .eq("status", "pending")
    .single();

  if (!session || new Date(session.expires_at) < new Date()) {
    return NextResponse.json(
      { success: false, message: "QR expired or invalid" },
      { status: 400 }
    );
  }

  const webToken = await signJwt({
    sub: payload.sub,
    mobile: payload.mobile,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    preferred_lang: payload.preferred_lang,
  });

  await supabaseAdmin
    .from("qr_sessions")
    .update({ status: "approved", user_id: payload.sub, web_token: webToken })
    .eq("id", sid);

  return NextResponse.json({ success: true });
}