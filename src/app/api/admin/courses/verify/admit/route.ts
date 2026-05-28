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

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const { bookingId } = await req.json();

    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // First check if already admitted
    const { data: existing } = await supabaseAdmin
      .from("course_bookings")
      .select("admission_status")
      .eq("id", bookingId)
      .single();

    if (existing?.admission_status === "completed") {
      return NextResponse.json({ error: "Admission is already marked complete for this booking" }, { status: 409 });
    }

    const { error } = await supabaseAdmin
      .from("course_bookings")
      .update({ admission_status: "completed" })
      .eq("id", bookingId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Audit log
    await supabaseAdmin.from("audit_logs").insert([{
      actor_id: admin.sub,
      actor_name: admin.name,
      action: `Marked admission complete for booking: ${bookingId}`,
      record_id: bookingId,
    }]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to mark admission" }, { status: 401 });
  }
}