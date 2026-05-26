import { NextRequest, NextResponse } from "next/server";
import { createCourseBookingAction } from "@/app/actions/courses";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createCourseBookingAction(body.courseId, body.amount);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}