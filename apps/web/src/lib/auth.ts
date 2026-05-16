// lib/auth.ts
// All authentication logic — OTP, JWT, password hashing, session management

import { SignJWT, jwtVerify } from "jose";
import { supabaseAdmin, type DbUser, type UserRole } from "./supabase";

// ── Config ─────────────────────────────────────────────────────────────────
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "csc-Shambhuganj-jaunpur-secret-change-in-production-2025"
);
const JWT_EXPIRY = "30d";    // token valid for 30 days
const OTP_EXPIRY_MIN = 10;       // OTP expires in 10 minutes
const OTP_LENGTH = 6;
const MAX_OTP_ATTEMPTS = 5;

// ── OTP helpers ────────────────────────────────────────────────────────────
export function generateOtp(): string {
  // Cryptographically random 6-digit OTP
  const array = new Uint32Array(1);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    array[0] = Math.floor(Math.random() * 1000000);
  }
  return String(array[0] % 1000000).padStart(OTP_LENGTH, "0");
}

export function otpExpiryTime(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + OTP_EXPIRY_MIN);
  return d.toISOString();
}

// ── Password hashing (using Web Crypto API — works on Edge runtime) ───────
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const h = await hashPassword(password);
  return h === hash;
}

// ── JWT helpers ────────────────────────────────────────────────────────────
export interface JwtPayload {
  sub: string;       // user id
  mobile: string;
  email?: string | null;
  role: UserRole;
  name: string | null;
  preferred_lang: "hi" | "en";
}

export async function signJwt(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

// ── User lookup / creation ─────────────────────────────────────────────────
export async function findOrCreateUser(mobile: string): Promise<DbUser> {
  // Check if user exists
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("mobile", mobile)
    .single();

  if (existing) return existing as DbUser;

  // New user — create with default role
  // Check if this is the designated admin mobile
  const adminMobile = process.env.ADMIN_MOBILE; // set in .env.local
  const role: UserRole = adminMobile && mobile === adminMobile ? "main_admin" : "user";

  const { data: created, error } = await supabaseAdmin
    .from("users")
    .insert({ mobile, role, otp_attempts: 0 })
    .select("*")
    .single();

  if (error || !created) throw new Error("Failed to create user: " + error?.message);
  return created as DbUser;
}

// ── OTP flow ───────────────────────────────────────────────────────────────
export interface SendOtpResult {
  success: boolean;
  message: string;
  // In production these come from SMS/WhatsApp — returned here for dev only
  devOtp?: string;
}

export async function sendOtp(
  mobile: string,
  channel: "sms" | "whatsapp" = "sms"
): Promise<SendOtpResult> {
  const user = await findOrCreateUser(mobile);
  const otp = generateOtp();
  const exp = otpExpiryTime();

  // Store OTP + expiry in DB (hashed for security)
  const otpHash = await hashPassword(otp);
  const { error } = await supabaseAdmin
    .from("users")
    .update({ otp_code: otpHash, otp_expires_at: exp, otp_attempts: 0 })
    .eq("id", user.id);

  if (error) return { success: false, message: "Database error. Try again." };

  // ── Send via Twilio ──────────────────────────────────────────────────────
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = channel === "whatsapp"
      ? process.env.TWILIO_WHATSAPP_FROM   // "whatsapp:+14155238886"
      : process.env.TWILIO_SMS_FROM;        // "+1XXXXXXXXXX"
    const to = channel === "whatsapp" ? `whatsapp:+91${mobile}` : `+91${mobile}`;
    const body = `आपका OTP है: ${otp}\nYour CSC Shambhuganj OTP: ${otp}\nValid for ${OTP_EXPIRY_MIN} minutes. Do not share.`;

    try {
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ To: to, From: twilioFrom!, Body: body }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Twilio error:", err);
        // Fall through — still return success but log the error
      }
    } catch (e) {
      console.error("Twilio fetch failed:", e);
    }
  }

  return {
    success: true,
    message: channel === "whatsapp"
      ? `OTP sent to WhatsApp +91${mobile}`
      : `OTP sent to +91${mobile}`,
    // Expose OTP only in dev — remove in production
    devOtp: isDev ? otp : undefined,
  };
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  token?: string;
  user?: Pick<DbUser, "id" | "name" | "role" | "mobile" | "email" | "wallet_balance" | "preferred_lang">;
}

export async function verifyOtp(
  mobile: string,
  otp: string
): Promise<VerifyOtpResult> {
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("mobile", mobile)
    .single();

  if (error || !user) return { success: false, message: "User not found." };

  const u = user as DbUser;

  // Check attempts
  if (u.otp_attempts >= MAX_OTP_ATTEMPTS) {
    return { success: false, message: "Too many attempts. Request a new OTP." };
  }

  // Check expiry
  if (!u.otp_expires_at || new Date(u.otp_expires_at) < new Date()) {
    return { success: false, message: "OTP expired. Request a new one." };
  }

  // Verify OTP hash
  const otpHash = await hashPassword(otp);
  if (otpHash !== u.otp_code) {
    // Increment attempts
    await supabaseAdmin
      .from("users")
      .update({ otp_attempts: (u.otp_attempts || 0) + 1 })
      .eq("id", u.id);
    const remaining = MAX_OTP_ATTEMPTS - (u.otp_attempts + 1);
    return { success: false, message: `Wrong OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} left.` };
  }

  // Clear OTP
  await supabaseAdmin
    .from("users")
    .update({ otp_code: null, otp_expires_at: null, otp_attempts: 0 })
    .eq("id", u.id);

  const token = await signJwt({ sub: u.id, mobile: u.mobile, email: u.email, role: u.role, name: u.name, preferred_lang: u.preferred_lang });
  return {
    success: true,
    message: "Login successful.",
    token,
    user: { id: u.id, name: u.name, role: u.role, mobile: u.mobile, email: u.email, wallet_balance: u.wallet_balance, preferred_lang: u.preferred_lang },
  };
}

// ── Password login ─────────────────────────────────────────────────────────
export interface PasswordLoginResult {
  success: boolean;
  message: string;
  token?: string;
  user?: Pick<DbUser, "id" | "name" | "role" | "mobile" | "email" | "wallet_balance" | "preferred_lang">;
}

export async function loginWithPassword(
  identifier: string,
  password: string
): Promise<PasswordLoginResult> {

  // ✨ Smart Lookup: Check if identifier contains '@' to search by email, else mobile
  const column = identifier.includes("@") ? "email" : "mobile";

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq(column, identifier)
    .single();

  if (error || !user) return { success: false, message: "Mobile number not registered." };

  const u = user as DbUser;
  if (!u.password_hash) return { success: false, message: "No password set. Use OTP to login." };

  const ok = await verifyPassword(password, u.password_hash);
  if (!ok) return { success: false, message: "Incorrect password." };

  const token = await signJwt({ sub: u.id, mobile: u.mobile, email: u.email, role: u.role, name: u.name, preferred_lang: user.preferred_lang, });
  return {
    success: true,
    message: "Login successful.",
    token,
    user: { id: u.id, name: u.name, role: u.role, mobile: u.mobile, email: u.email, wallet_balance: u.wallet_balance, preferred_lang: u.preferred_lang },
  };
}

// ── Set / reset password ───────────────────────────────────────────────────
export async function setPassword(userId: string, newPassword: string): Promise<boolean> {
  const hash = await hashPassword(newPassword);
  const { error } = await supabaseAdmin
    .from("users")
    .update({ password_hash: hash })
    .eq("id", userId);
  return !error;
}

// ── Get user from JWT (used in API routes + middleware) ────────────────────
export async function getUserFromToken(token: string): Promise<JwtPayload | null> {
  return verifyJwt(token);
}