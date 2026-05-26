// // ════════════════════════════════════════════════════════════════
// // FILE 1: app/api/auth/google/route.ts
// // GET /api/auth/google  → redirects to Google OAuth
// // ════════════════════════════════════════════════════════════════
// import { NextRequest, NextResponse } from "next/server";
 
// export const runtime = "edge";
 
// export async function GET(req: NextRequest) {
//   const clientId    = process.env.GOOGLE_CLIENT_ID!;
//   const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

//   console.log("[Google OAuth] Initiating login with Google", { clientId, redirectUri });
 
//   const params = new URLSearchParams({
//     client_id:     clientId,
//     redirect_uri:  redirectUri,
//     response_type: "code",
//     scope:         "openid email profile",
//     access_type:   "offline",
//     prompt:        "select_account",
//     // Pass through the page user was on so we can redirect back
//     state: req.nextUrl.searchParams.get("from") || "/dashboard",
//   });
 
//   return NextResponse.redirect(
//     `https://accounts.google.com/o/oauth2/v2/auth?${params}`
//   );
// }


import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  const clientId    = process.env.GOOGLE_CLIENT_ID!;
  const from        = req.nextUrl.searchParams.get("from") || "/dashboard";
  const isMobile    = req.nextUrl.searchParams.get("mobile") === "true";
  
  // Encode mobile flag into state (backward-compatible)
  const state       = JSON.stringify({ from, mobile: isMobile });
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: "code",
    scope:         "openid email profile",
    access_type:   "offline",
    prompt:        "select_account",
    state,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}