import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    
    // 1. Get the custom JWT
    const token = cookieStore.get("csc_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token found" }, { status: 401 });
    }

    // 2. Decode the JWT payload to get the User ID
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const userId = decodedPayload.sub; 

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid token payload" }, { status: 401 });
    }

    // 3. LIVE SECURITY CHECK: Verify user exists and is active
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, role, is_active")
      .eq("id", userId)
      .single();

    if (userError || !dbUser) {
      return NextResponse.json({ error: "Unauthorized - User not found" }, { status: 401 });
    }

    if (!dbUser.is_active) {
      return NextResponse.json({ error: "Forbidden - Account deactivated" }, { status: 403 });
    }

    // 4. Validate FCM token from request body
    const { fcmToken } = body;
    
    if (!fcmToken || typeof fcmToken !== "string" || fcmToken.length < 10) {
      return NextResponse.json({ error: "Invalid FCM token" }, { status: 400 });
    }

    // 5. Update user's FCM push token
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ 
        push_token: fcmToken,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select("id, push_token")
      .single();

    if (error) throw error;

    console.log(`✅ FCM token updated for user: ${userId}, role: ${dbUser.role}`);

    return NextResponse.json({ 
      success: true, 
      message: "FCM token registered successfully",
      data: {
        userId: data.id,
        tokenUpdated: true
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("FCM Token Update Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to update FCM token" 
    }, { status: 500 });
  }
}

// Optional: DELETE endpoint to remove FCM token (on logout)
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("csc_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const userId = decodedPayload.sub;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Clear FCM token on logout
    const { error } = await supabaseAdmin
      .from("users")
      .update({ 
        push_token: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: "FCM token removed successfully" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("FCM Token Delete Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to remove FCM token" 
    }, { status: 500 });
  }
}