import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

async function requireAdmin() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) throw new Error("Unauthorized");

  const user = await getUserFromToken(token);
  if (!user || user.role === "user") throw new Error("Forbidden");
  return user;
}

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("id, title, category, theme, duration, fee, prebook_amount, max_seats, filled_seats, start_date, is_published, banner_url, created_by, users(name)")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const insertPayload = {
      ...body,
      created_by: admin.sub,
      filled_seats: 0,
      slug: body.slug || null,
    };

    const { data, error } = await supabaseAdmin
      .from("courses")
      .insert([insertPayload])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabaseAdmin.from("audit_logs").insert([{
      actor_id: admin.sub,
      actor_name: admin.name,
      action: `Created course: ${body.title}`,
      record_id: data.id,
    }]);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}