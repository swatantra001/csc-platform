import { NextRequest, NextResponse } from "next/server";

// ─── Route protection rules ─────────────────────────────────────────────────
// Public routes — no login needed
const PUBLIC_ROUTES = ["/", "/status", "/verify", "posts", "galary", "/courses", "sitemap.xml"];

// User routes — any logged-in user
const USER_ROUTES = ["/dashboard"];

// Admin-only routes
const ADMIN_ROUTES = ["/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public SEO and static files to pass through immediately
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt' || pathname === '/manifest.json') {
    return NextResponse.next();
  }

  // Read JWT token from cookie (set after login)
  const token = request.cookies.get("csc_token")?.value;
  const role = request.cookies.get("csc_role")?.value;  // "user" | "co_admin" | "main_admin"

  // ── Allow public routes always ──
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return NextResponse.next();
  }

  // ── No token → redirect to login (home page has login modal) ──
  if (!token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("login", "1"); // triggers login modal on landing page
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin routes: require main_admin or co_admin role ──
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    // if (role !== "main_admin" && role !== "co_admin") {
    //   // Logged in but not admin → send to user dashboard
    //   return NextResponse.redirect(new URL("/dashboard", request.url));
    // }
    if (role !== "main_admin" && role !== "co_admin") {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("roleAlert", "1"); // ← triggers modal on landing page
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // ── User routes: any logged-in user ──
  if (USER_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on these paths (exclude static files, api routes, _next)
  matcher: [
    // Ignore next internals, static files, images, sitemaps, and robots
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json).*)',
  ],
};