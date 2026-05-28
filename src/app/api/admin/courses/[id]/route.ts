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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("courses")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabaseAdmin.from("audit_logs").insert([{
      actor_id: admin.sub,
      actor_name: admin.name,
      action: `Updated course: ${body.title || id}`,
      record_id: id,
    }]);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (admin.role !== "main_admin") {
      return NextResponse.json({ error: "Only Main Admin can delete courses" }, { status: 403 });
    }

    const { id } = await params;
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabaseAdmin.from("audit_logs").insert([{
      actor_id: admin.sub,
      actor_name: admin.name,
      action: `Deleted course: ${id}`,
      record_id: id,
    }]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}