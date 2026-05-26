import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ success: false }, { status: 400 });

  const cookieStore = await cookies();
  cookieStore.set("csc_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ success: true, token });
}