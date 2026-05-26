import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the Mobile Request (Checks Bearer token or Cookie)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || req.cookies.get("csc_token")?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // 2. Parse the request body
    const { messageId, amount } = await req.json();

    if (!messageId || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ success: false, error: "Razorpay keys missing on server" }, { status: 500 });
    }

    // 3. Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.round(Number(amount) * 100);

    // 4. Create the Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: messageId.substring(0, 39), // Tie to the specific message
    };

    const order = await razorpay.orders.create(options);
    
    // Return the JSON that the mobile app expects!
    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    console.error("🚨 MOBILE RAZORPAY CRASH 🚨:", error);
    return NextResponse.json(
      { success: false, error: error?.description || error?.message || "Failed to create Order" },
      { status: 500 }
    );
  }
}