// lib/supabase.ts
// Supabase client — works in both browser (client components) and server (API routes)

import { createClient } from "@supabase/supabase-js";

// Clean the URL by trimming hidden spaces/line-breaks AND removing any trailing slash
const SUPABASE_URL  = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");

// Clean the keys by trimming hidden spaces/line-breaks
const SUPABASE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
const SUPABASE_SVC  = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

// Add helpful debug logs
if (!SUPABASE_URL) console.error("❌ NEXT_PUBLIC_SUPABASE_URL is missing!");
if (!SUPABASE_ANON) console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!");

// ONLY check for the service key if we are on the server (Node environment)
if (typeof window === "undefined" && !SUPABASE_SVC) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is missing from environment!");
}

// ── Browser client (uses anon key, respects RLS) ───────────────────────────
// Call this inside Client Components
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Server/admin client (uses service role, bypasses RLS) ─────────────────
// NEVER import this in client components — service key must stay server-side
// ── Server/admin client (uses service role, bypasses RLS) ─────────────────
// Safely checks if we are on the server before initializing to prevent browser crashes
export const supabaseAdmin = typeof window === 'undefined'
  ? createClient(SUPABASE_URL, SUPABASE_SVC as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : (null as any);

// ── Database types (extend as you add more tables) ────────────────────────
export type UserRole = "user" | "co_admin" | "main_admin";

export interface DbUser {
  id: string;
  mobile: string;
  email: string | null;
  name: string | null;
  password_hash: string | null;
  role: UserRole;
  position_label: string | null;
  wallet_balance: number;
  preferred_lang: "hi" | "en";
  otp_code: string | null;
  otp_expires_at: string | null;
  otp_attempts: number;
  created_at: string;
}