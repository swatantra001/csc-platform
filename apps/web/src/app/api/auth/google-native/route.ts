import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signJwt } from "@/lib/auth";
import type { UserRole } from "@/lib/supabase";

export async function POST(req: NextRequest) {
	try {
		const { idToken } = await req.json();

		if (!idToken) {
			return NextResponse.json(
				{ success: false, message: "ID token is required" },
				{ status: 400 }
			);
		}

		// Verify token with Google's tokeninfo endpoint (no extra library needed)
		const tokenRes = await fetch(
			`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
		);
		if (!tokenRes.ok) {
			return NextResponse.json(
				{ success: false, message: "Invalid Google ID token" },
				{ status: 401 }
			);
		}

		const googleUser = await tokenRes.json();
		const { email, name, sub: googleId, aud } = googleUser;

		// ADD THIS LINE:
		console.log("🔥 THE GOOGLE TOKEN AUDIENCE IS:", aud);

		// Verify aud matches either our Web OR Android client ID
		const webAud = process.env.GOOGLE_CLIENT_ID;
		const androidAud = process.env.GOOGLE_ANDROID_CLIENT_ID;

		// Check if the token's audience matches either one
		const isValidAudience = aud === webAud || aud === androidAud;

		if (!isValidAudience) {
			return NextResponse.json(
				{ success: false, message: "Token audience mismatch" },
				{ status: 401 }
			);
		}

		if (!email) {
			return NextResponse.json(
				{ success: false, message: "No email from Google" },
				{ status: 400 }
			);
		}

		// 1. Find by google_id
		let { data: existingUser } = await supabaseAdmin
			.from("users")
			.select("*")
			.eq("google_id", googleId)
			.single();

		// 2. Find by email and link Google ID
		if (!existingUser) {
			const { data: byEmail } = await supabaseAdmin
				.from("users")
				.select("*")
				.eq("email", email)
				.single();

			if (byEmail) {
				await supabaseAdmin
					.from("users")
					.update({ google_id: googleId, name: byEmail.name || name })
					.eq("id", byEmail.id);
				existingUser = { ...byEmail, google_id: googleId };
			} else {
				// 3. Create new user
				const adminEmail = process.env.ADMIN_EMAIL;
				const role: UserRole =
					adminEmail && email === adminEmail ? "main_admin" : "user";

				const { data: newUser, error: createErr } = await supabaseAdmin
					.from("users")
					.insert({ email, name, google_id: googleId, role })
					.select("*")
					.single();

				if (createErr) {
					console.error("SUPABASE DB ERROR:", createErr);
					throw new Error(`DB Error: ${createErr.message}`);
				}
				if (!newUser) throw new Error("Failed to create user");
				existingUser = newUser;
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

		const response = NextResponse.json({
			success: true,
			token,
			user: {
				id: existingUser.id,
				name: existingUser.name,
				role: existingUser.role,
				mobile: existingUser.mobile,
				email: existingUser.email,
				preferred_lang: existingUser.preferred_lang,
			},
		});

		// Set cookies
		// (If your password route uses a different cookie name than "token", change it here!)
		// response.cookies.set("token", token, {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === "production",
		// 	path: "/",
		// 	maxAge: 60 * 60 * 24 * 7, // 7 days
		// });

		const cookieOpts = {
			httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 30, path: "/",
		};

		response.cookies.set("csc_token", token, cookieOpts);

		return response;
		
	} catch (err: any) {
		console.error("GOOGLE NATIVE AUTH ERROR:", err);
		return NextResponse.json(
			{ success: false, message: err.message || "Google authentication failed" },
			{ status: 500 }
		);
	}
}