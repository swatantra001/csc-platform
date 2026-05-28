import { NextRequest, NextResponse } from "next/server";
import { verifyCoursePaymentAction } from "@/app/actions/courses";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await verifyCoursePaymentAction(
      body.bookingId,
      body.courseId,
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}