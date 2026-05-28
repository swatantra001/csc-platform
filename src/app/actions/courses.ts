"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import crypto from "crypto";

// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────
async function getAuthUser() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) return null;
  return await getUserFromToken(token);
}

async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role === "user") throw new Error("Forbidden - Admin access required");
  return user;
}

// ─── COURSE CRUD ──────────────────────────────────────────────────────────────
export interface CoursePayload {
  title: string;
  title_hi?: string;
  slug?: string;
  short_desc?: string;
  full_desc?: string;
  full_desc_hi?: string;
  category?: string;
  theme?: string;
  banner_url?: string;
  duration: string;
  duration_hi?: string;
  fee: number;
  prebook_amount: number;
  max_seats: number;
  start_date?: string;
  syllabus?: Array<{ topic: string; topic_hi?: string; hours?: number }>;
  eligibility?: string;
  eligibility_hi?: string;
  certification?: string;
  certification_hi?: string;
  tags?: string[];
  is_published?: boolean;
}

export async function adminGetCoursesAction() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*, users(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function adminGetCourseAction(id: string) {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminCreateCourseAction(courseData: CoursePayload) {
  const admin = await requireAdmin();
  
  const insertPayload = {
    ...courseData,
    created_by: admin.sub,
    filled_seats: 0,
    slug: courseData.slug || null,
  };

  const { data, error } = await supabaseAdmin
    .from("courses")
    .insert([insertPayload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Created course: ${courseData.title}`,
    record_id: data.id,
  }]);

  return data;
}

export async function adminUpdateCourseAction(id: string, courseData: Partial<CoursePayload>) {
  const admin = await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("courses")
    .update({ ...courseData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Updated course: ${courseData.title || id}`,
    record_id: id,
  }]);

  return data;
}

export async function adminDeleteCourseAction(id: string) {
  const admin = await requireAdmin();
  if (admin.role !== "main_admin") throw new Error("Only Main Admin can delete courses");

  const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Deleted course: ${id}`,
    record_id: id,
  }]);

  return { success: true };
}

// ─── PUBLIC COURSE ACTIONS ────────────────────────────────────────────────────
export async function getPublishedCoursesAction() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("id, title, title_hi, slug, short_desc, category, theme, banner_url, duration, duration_hi, fee, prebook_amount, max_seats, filled_seats, start_date, tags, certification")
    .eq("is_published", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCourseByIdAction(id: string) {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();
  
  if (error) throw new Error(error.message);
  return data;
}

// ─── BOOKING & PAYMENT ────────────────────────────────────────────────────────
export async function createCourseBookingAction(courseId: string, amount: number) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Please login to pre-book" };

  // Check if already booked
  const { data: existing } = await supabaseAdmin
    .from("course_bookings")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", user.sub)
    .eq("payment_status", "paid")
    .single();

  if (existing) {
    return { success: false, error: "You have already pre-booked this course" };
  }

  // Check seat availability
  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("filled_seats, max_seats, title")
    .eq("id", courseId)
    .single();

  if (!course) return { success: false, error: "Course not found" };
  if (course.filled_seats >= course.max_seats) {
    return { success: false, error: "Seats are full" };
  }

  // Create Razorpay order
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return { success: false, error: "Payment system not configured" };
  }

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const amountInPaise = Math.round(Number(amount) * 100);
  const bookingCode = `CSC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).substring(4, 8).toUpperCase()}`;

  // Create pending booking record
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("course_bookings")
    .insert([{
      course_id: courseId,
      user_id: user.sub,
      payment_status: "pending",
      amount_paid: amount,
      booking_code: bookingCode,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days validity
    }])
    .select()
    .single();

  if (bookingError) throw new Error(bookingError.message);

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `course_${booking.id.substring(0, 20)}`,
    notes: {
      course_id: courseId,
      user_id: user.sub,
      booking_id: booking.id,
      booking_code: bookingCode,
    },
  };

  const order = await razorpay.orders.create(options);

  // Update booking with order ID
  await supabaseAdmin
    .from("course_bookings")
    .update({ razorpay_order_id: order.id })
    .eq("id", booking.id);

  return { success: true, order, bookingId: booking.id, bookingCode };
}

export async function verifyCoursePaymentAction(
  bookingId: string,
  courseId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return { success: false, error: "Invalid payment signature" };
  }

  // Update booking as paid
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("course_bookings")
    .update({
      payment_status: "paid",
      razorpay_payment_id: razorpay_payment_id,
    })
    .eq("id", bookingId)
    .eq("user_id", user.sub)
    .select()
    .single();

  if (bookingError || !booking) {
    return { success: false, error: "Booking not found" };
  }

  // Increment filled seats
  await supabaseAdmin.rpc("increment_course_seats", { course_id: courseId });

  // Get course and user details for email
  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("title, start_date")
    .eq("id", courseId)
    .single();

  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("email, name")
    .eq("id", user.sub)
    .single();

  // Generate QR code URL (using a QR API)
  const qrData = JSON.stringify({
    bookingCode: booking.booking_code,
    course: course?.title,
    user: userData?.name,
    amount: booking.amount_paid,
    date: booking.created_at,
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

  // Update booking with QR
  await supabaseAdmin
    .from("course_bookings")
    .update({ qr_code_url: qrCodeUrl })
    .eq("id", bookingId);

  // Send email with QR code
  if (userData?.email) {
    await sendBookingEmail(userData.email, userData.name, course?.title, booking.booking_code, qrCodeUrl, booking.amount_paid, course?.start_date);
  }

  return { success: true, bookingCode: booking.booking_code, qrCodeUrl };
}

// ─── CHECK USER BOOKING STATUS ────────────────────────────────────────────────
export async function getUserBookingStatusAction(courseId: string) {
  const user = await getAuthUser();
  if (!user) return { booked: false };

  const { data } = await supabaseAdmin
    .from("course_bookings")
    .select("payment_status, booking_code, qr_code_url, created_at")
    .eq("course_id", courseId)
    .eq("user_id", user.sub)
    .eq("payment_status", "paid")
    .maybeSingle();

  if (data) {
    return { booked: true, booking: data };
  }
  return { booked: false };
}

// ─── EMAIL HELPER ─────────────────────────────────────────────────────────────
async function sendBookingEmail(
  email: string,
  name: string,
  courseTitle: string | undefined,
  bookingCode: string,
  qrCodeUrl: string,
  amount: number,
  startDate: string | undefined
) {
  try {
    const nodemailer = await import("nodemailer");
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Srilal CSC — Course Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎓 Seat Pre-Booked — ${courseTitle || "Course"}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',system-ui,sans-serif;">
          <table cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;padding:24px 0;">
            <tr><td align="center">
              <table cellpadding="0" cellspacing="0" width="480" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:linear-gradient(135deg,#1e3a8a,#4338ca);padding:32px 24px;text-align:center;">
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:1.6rem;color:#fff;">🏛️ Srilal CSC</h1>
                    <p style="margin:6px 0 0;color:#c7d2fe;font-size:0.85rem;">Shambhuganj, Jaunpur — Computer Training Center</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 24px;">
                    <p style="margin:0 0 16px;color:#334155;font-size:0.95rem;line-height:1.6;">
                      Namaste <strong>${name}</strong> 🙏,<br><br>
                      Congratulations! Your seat has been successfully pre-booked for:
                    </p>
                    <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
                      <div style="font-size:1.3rem;font-weight:800;color:#1e3a8a;margin-bottom:8px;">${courseTitle || "Computer Course"}</div>
                      <div style="font-size:2rem;font-weight:800;color:#2563eb;font-family:monospace;letter-spacing:4px;">${bookingCode}</div>
                      <div style="font-size:0.8rem;color:#64748b;margin-top:8px;">Booking Reference Code</div>
                    </div>
                    <div style="text-align:center;margin-bottom:20px;">
                      <img src="${qrCodeUrl}" alt="Booking QR Code" style="width:200px;height:200px;border-radius:12px;border:2px solid #e2e8f0;">
                      <p style="margin:8px 0 0;color:#64748b;font-size:0.75rem;">Show this QR at the center</p>
                    </div>
                    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px;margin-bottom:16px;">
                      <p style="margin:0;color:#15803d;font-size:0.85rem;line-height:1.6;">
                        <strong>✅ Payment Received:</strong> ₹${amount}<br>
                        <strong>📍 Next Step:</strong> Visit Srilal CSC center at Shambhuganj, Jaunpur with this QR code and a photocopy of your Aadhaar card to complete physical admission.<br>
                        ${startDate ? `<strong>📅 Course Starts:</strong> ${new Date(startDate).toLocaleDateString("en-IN")}` : ""}
                      </p>
                    </div>
                    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 16px;">
                      <p style="margin:0;color:#dc2626;font-size:0.8rem;line-height:1.5;">
                        <strong>⚠️ Important:</strong> This is a non-refundable pre-booking amount. Please bring the original documents for verification. Booking valid for 7 days from today.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
                    <p style="margin:0;color:#94a3b8;font-size:0.7rem;">
                      © 2026 Srilal CSC, Shambhuganj, Jaunpur<br>
                      Authorized Training Center | NSQF Certified
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("Failed to send booking email:", err);
  }
}


export interface VerificationResult {
  valid: boolean;
  booking?: {
    id: string;
    booking_code: string;
    payment_status: string;
	admission_status?: string | null;  // <-- ADD THIS
    amount_paid: number;
    created_at: string;
    expires_at: string | null;
    qr_code_url: string | null;
  };
  course?: {
    id: string;
    title: string;
    title_hi: string | null;
    fee: number;
    prebook_amount: number;
    duration: string;
    start_date: string | null;
  };
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    mobile: string | null;
  };
  error?: string;
}

export async function verifyBookingByCodeAction(code: string): Promise<VerificationResult> {
  await requireAdmin();

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
      return {
        valid: false,
        error: `No exact match. Did you mean: ${fuzzyBooking[0].booking_code}?`,
      };
    }

    return { valid: false, error: "Invalid booking code. No booking found." };
  }

  // Check if payment is completed
  if (booking.payment_status !== "paid") {
    return {
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
    };
  }

  // Check expiry
  if (booking.expires_at && new Date(booking.expires_at) < new Date()) {
    return {
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
    };
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

  return {
    valid: true,
    booking: {
      id: booking.id,
      booking_code: booking.booking_code,
      payment_status: booking.payment_status,
      amount_paid: booking.amount_paid,
      created_at: booking.created_at,
      expires_at: booking.expires_at,
      qr_code_url: booking.qr_code_url,
    },
    course: course || undefined,
    user: userData || undefined,
  };
}

export async function markAdmissionCompleteAction(bookingId: string) {
  const admin = await requireAdmin();

  // First check if already admitted
  const { data: existing } = await supabaseAdmin
    .from("course_bookings")
    .select("admission_status")
    .eq("id", bookingId)
    .single();

  if (existing?.admission_status === "completed") {
    throw new Error("Admission is already marked complete for this booking");
  }

  const { error } = await supabaseAdmin
    .from("course_bookings")
    .update({
      admission_status: "completed",
    //   updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) throw new Error(error.message);

  // Audit log
  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Marked admission complete for booking: ${bookingId}`,
    record_id: bookingId,
  }]);

  return { success: true };
}


export async function revokeBookingAction(bookingId: string) {
  const admin = await requireAdmin();

  // Get booking details first for audit
  const { data: booking } = await supabaseAdmin
    .from("course_bookings")
    .select("course_id, user_id")
    .eq("id", bookingId)
    .single();

  // Delete the booking
  const { error: deleteError } = await supabaseAdmin
    .from("course_bookings")
    .delete()
    .eq("id", bookingId);

  if (deleteError) throw new Error(deleteError.message);

  // Decrement filled_seats
  if (booking?.course_id) {
    await supabaseAdmin.rpc("decrement_course_seats", { course_id: booking.course_id });
  }

  // Audit log
  await supabaseAdmin.from("audit_logs").insert([{
    actor_id: admin.sub,
    actor_name: admin.name,
    action: `Revoked booking ${bookingId} for course ${booking?.course_id}`,
    record_id: bookingId,
  }]);

  return { success: true };
}