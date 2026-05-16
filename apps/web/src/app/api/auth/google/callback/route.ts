// ════════════════════════════════════════════════════════════════
// FILE 2: app/api/auth/google/callback/route.ts
// GET /api/auth/google/callback  → handles Google OAuth callback
// ════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signJwt } from "@/lib/auth";
import type { UserRole } from "@/lib/supabase";

// export const runtime = "edge";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");
	const state = searchParams.get("state") || "/dashboard";
	const error = searchParams.get("error");

	// User denied permission
	if (error || !code) {
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_APP_URL}/?login=1&error=google_denied`
		);
	}

	try {
		// 1. Exchange code for tokens
		const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				code,
				client_id: process.env.GOOGLE_CLIENT_ID!,
				client_secret: process.env.GOOGLE_CLIENT_SECRET!,
				redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
				grant_type: "authorization_code",
			}),
		});

		const tokens = await tokenRes.json();
		if (!tokens.access_token) throw new Error("No access token from Google");

		// 2. Get user info from Google
		const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
			headers: { Authorization: `Bearer ${tokens.access_token}` },
		});
		const googleUser = await userInfoRes.json();

		const { email, name, sub: googleId } = googleUser as {
			email: string; name: string; sub: string;
		};

		if (!email) throw new Error("No email from Google");

		// 3. Find or create user in DB
		// First try to find by google_id, then by email
		let { data: existingUser } = await supabaseAdmin
			.from("users")
			.select("*")
			.eq("google_id", googleId)
			.single();

		if (!existingUser) {
			// Try by email
			const { data: byEmail } = await supabaseAdmin
				.from("users")
				.select("*")
				.eq("email", email)
				.single();

			if (byEmail) {
				// Link Google to existing account
				await supabaseAdmin
					.from("users")
					.update({ google_id: googleId, name: byEmail.name || name })
					.eq("id", byEmail.id);
				existingUser = { ...byEmail, google_id: googleId };
			} else {
				// Create new user
				const adminEmail = process.env.ADMIN_EMAIL;
				const role: UserRole = adminEmail && email === adminEmail ? "main_admin" : "user";

				const { data: newUser, error: createErr } = await supabaseAdmin
					.from("users")
					.insert({
						email,
						name,
						google_id: googleId,
						role,
						// mobile will be null — user prompted to add later
					})
					.select("*")
					.single();

				if (createErr) {
					console.error("\n🔥 SUPABASE DB ERROR 🔥:", createErr);
					throw new Error(`DB Error: ${createErr.message}`);
				}
				if (!newUser) throw new Error("Failed to create user: No user returned"); existingUser = newUser;
			}
		}

		// 4. Issue our JWT
		const token = await signJwt({
			sub: existingUser.id,
			mobile: existingUser.mobile || "",
			email: existingUser.email || null,
			role: existingUser.role,
			name: existingUser.name,
			preferred_lang: existingUser.preferred_lang,
		});

		// 5. Set cookies and redirect
		const redirectTo = state.startsWith("/") ? state : "/dashboard";
		const res = NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_APP_URL}${redirectTo}`
		);

		const isProduction = process.env.NODE_ENV === "production";
		const cookieOpts = {
			httpOnly: true,
			secure: isProduction,
			sameSite: "lax" as const,
			maxAge: 60 * 60 * 24 * 30,
			path: "/",
		};

		res.cookies.set("csc_token", token, cookieOpts);
		res.cookies.set("csc_role", existingUser.role, { ...cookieOpts, httpOnly: false });
		res.cookies.set("csc_lang", existingUser.preferred_lang || "hi", { ...cookieOpts, httpOnly: false });

		return res;
	} catch (err) {
		// START OF CHANGES
		console.error("\n================ GOOGLE OAUTH ERROR ================");
		console.error("The error object is:", err);
		if (err instanceof Error) {
			console.error("Error Message:", err.message);
			console.error("Error Stack:", err.stack);
		}
		console.error("====================================================\n");
		// END OF CHANGES

		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_APP_URL}/?login=1&error=google_failed`
		);
	}
}