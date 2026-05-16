import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import * as admin from "firebase-admin";
import jwt from "jsonwebtoken"; // Ensure jsonwebtoken is installed

if (!admin.apps.length) {
  // Try replacing literal \n strings, OR if the environment variable just stripped them entirely, 
  // wrap it properly.
  let formattedKey = process.env.FIREBASE_PRIVATE_KEY || "";

  if (formattedKey.includes("\\n")) {
    formattedKey = formattedKey.replace(/\\n/g, '\n');
  } else if (!formattedKey.includes("\n") && formattedKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
    // If GitHub Secrets stripped the newlines completely, reconstruct it:
    formattedKey = formattedKey.replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n");
    formattedKey = formattedKey.replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----\n");
    formattedKey = formattedKey.replace(/([^\n]{64})/g, "$1\n"); // Add a newline every 64 characters
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: formattedKey,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { idToken, mobile } = await req.json();

    // 1. Verify the token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.phone_number || !decodedToken.phone_number.includes(mobile)) {
      return NextResponse.json({ success: false, message: "Token/Phone mismatch" }, { status: 400 });
    }

    // 2. Find or Create User in Supabase
    let { data: user } = await supabaseAdmin.from("users").select("*").eq("mobile", mobile).single();

    if (!user) {
      const { data: newUser, error } = await supabaseAdmin.from("users").insert([{
        mobile,
        role: "user",
        preferred_lang: "hi"
      }]).select().single();

      if (error) throw error;
      user = newUser;
    }

    // 3. Create Custom JWT for Next.js Session
    const jwtPayload = {
      sub: user.id,
      mobile: user.mobile,
      role: user.role,
      name: user.name,
      preferred_lang: user.preferred_lang,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "fallback_secret", { expiresIn: '30d' });

    // 4. Set Secure Cookies
    const res = NextResponse.json({ success: true, user });

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    };

    res.cookies.set("csc_token", token, cookieOpts);
    res.cookies.set("csc_role", user.role, { ...cookieOpts, httpOnly: false });

    return res;
  } catch (err) {
    console.error("[verify-firebase]", err);
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 });
  }
}