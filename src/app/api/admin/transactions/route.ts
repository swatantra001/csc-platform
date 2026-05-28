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

    // ✨ 3. LIVE SECURITY CHECK: Fetch the user's real-time role from the database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (!dbUser || (dbUser.role !== "main_admin" && dbUser.role !== "co_admin")) {
      return NextResponse.json({ error: "Forbidden - You do not have permission to add transactions" }, { status: 403 });
    }

    // 4. Map the frontend form data to DB schema
    const txData = {
      tx_id: body.txId || null,
      sender_name: body.senderName || null,
      receiver_name: body.receiverName || null,
      amount: parseFloat(body.amount),
      tx_type: body.type, 
      category: body.category,
      tx_date: body.date || new Date().toISOString().split('T')[0],
      tx_time: body.time,
      bank: body.bank || null,
      upi_id: body.upiId || null,
      notes: body.notes || null,
      ocr_raw_text: body.rawText || null,
      ocr_confidence: body.confidence?.overall || 0,
      is_flagged: body.flags?.length > 0,
      flag_reason: body.flags?.map((f: any) => f.msg).join(" | ") || null,
      entered_by: userId, 
      settlement_date: new Date().toISOString().split('T')[0] 
    };

    // 5. Insert data
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .insert([txData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error: any) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save transaction" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("csc_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT to get User ID
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const userId = decodedPayload.sub;

    // ✨ LIVE SECURITY CHECK: Fetch the user's real-time role
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (!dbUser || (dbUser.role !== "main_admin" && dbUser.role !== "co_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch transactions and JOIN with the users table
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select(`
        *,
        users!entered_by (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) throw error;

    // Map database snake_case back to frontend camelCase
    const formattedData = data.map((row: any) => ({
      id: row.id,
      txId: row.tx_id,
      senderName: row.sender_name,
      receiverName: row.receiver_name,
      amount: row.amount?.toString(),
      type: row.tx_type,
      category: row.category,
      date: row.tx_date,
      time: row.tx_time,
      bank: row.bank,
      upiId: row.upi_id,
      rawText: row.ocr_raw_text,
      notes: row.notes,
      operator: row.users?.name || "Unknown Operator", 
      confidence: { overall: row.ocr_confidence },
      flags: row.is_flagged ? [{ level: "warning", msg: "Flagged", detail: row.flag_reason }] : []
    }));

    return NextResponse.json({ transactions: formattedData }, { status: 200 });

  } catch (error: any) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch transactions" }, { status: 500 });
  }
}