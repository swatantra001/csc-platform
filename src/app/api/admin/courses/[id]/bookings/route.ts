import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("course_bookings")
    .select(`
      id,
      booking_code,
      payment_status,
      admission_status,
      amount_paid,
      created_at,
      expires_at,
      user_id,
      users:user_id (name, email, mobile)
    `)
    .eq("course_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}