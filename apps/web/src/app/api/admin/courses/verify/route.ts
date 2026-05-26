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
    await requireAdmin();
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Booking code is required" }, { status: 400 });
    }

    // Normalize code: uppercase, trim whitespace
    const normalizedCode = code.trim().toUpperCase();

    // Search by booking code (exact match)
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("course_bookings")
      .select(`
        id,
        booking_code,
        payment_status,
        admission_status,
        amount_paid,
        created_at,
        expires_at,
        qr_code_url,
        course_id,
        user_id
      `)
      .eq("booking_code", normalizedCode)
      .single();

    if (bookingError || !booking) {
      // Try searching by partial match if exact fails
      const { data: fuzzyBooking } = await supabaseAdmin
        .from("course_bookings")
        .select("id, booking_code")
        .ilike("booking_code", `%${normalizedCode}%`)
        .limit(1);

      if (fuzzyBooking && fuzzyBooking.length > 0) {
        return NextResponse.json({
          valid: false,
          error: `No exact match. Did you mean: ${fuzzyBooking[0].booking_code}?`,
        });
      }

      return NextResponse.json({ valid: false, error: "Invalid booking code. No booking found." });
    }

    // Check if payment is completed
    if (booking.payment_status !== "paid") {
      return NextResponse.json({
        valid: false,
        error: `Booking found but payment status is "${booking.payment_status}". Only paid bookings can be verified.`,
        booking: {
          id: booking.id,
          booking_code: booking.booking_code,
          payment_status: booking.payment_status,
          amount_paid: booking.amount_paid,
          created_at: booking.created_at,
          expires_at: booking.expires_at,
          qr_code_url: booking.qr_code_url,
        },
      });
    }

    // Check expiry
    if (booking.expires_at && new Date(booking.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: "Booking has expired. Validity was 7 days from booking date.",
        booking: {
          id: booking.id,
          booking_code: booking.booking_code,
          payment_status: booking.payment_status,
          amount_paid: booking.amount_paid,
          created_at: booking.created_at,
          expires_at: booking.expires_at,
          qr_code_url: booking.qr_code_url,
        },
      });
    }

    // Fetch course details
    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("id, title, title_hi, fee, prebook_amount, duration, start_date")
      .eq("id", booking.course_id)
      .single();

    // Fetch user details
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id, name, email, mobile")
      .eq("id", booking.user_id)
      .single();

    return NextResponse.json({
      valid: true,
      booking: {
        id: booking.id,
        booking_code: booking.booking_code,
        payment_status: booking.payment_status,
        admission_status: booking.admission_status,
        amount_paid: booking.amount_paid,
        created_at: booking.created_at,
        expires_at: booking.expires_at,
        qr_code_url: booking.qr_code_url,
      },
      course: course || undefined,
      user: userData || undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message || "Verification failed" }, { status: 401 });
  }
}