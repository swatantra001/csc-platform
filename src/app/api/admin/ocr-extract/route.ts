import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { base64, mimeType } = await request.json();

    if (!base64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Pass the image directly to Groq's active 90B Vision model
    const response = await groq.chat.completions.create({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a financial parsing agent for an Indian Jan Seva Kendra. Extract details from this transaction screenshot. 
              Respond ONLY in valid JSON format with these exact keys: 
              "txId" (UPI Ref or Transaction ID), 
              "senderName", 
              "receiverName", 
              "amount" (number only, exact amount paid), 
              "type" ("credit" or "debit"), 
              "category" (Choose from: UPI Transfer, Bank Transfer, NEFT/RTGS, Wallet, Cash Deposit, Cash Withdrawal, Recharge, Bill Payment),
              "date" (YYYY-MM-DD), 
              "time" (HH:MM), 
              "bank", 
              "upiId", 
              "rawText" (leave empty), 
              "confidence" (object with keys: overall, txId, amount, names, datetime, category - integer values 0-100 estimating your parsing confidence).`
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temp for accurate data extraction
    });

    const extracted = JSON.parse(response.choices[0].message.content || "{}");
    return NextResponse.json({ extracted });

  } catch (error: any) {
    console.error("Groq Vision Error:", error);
    return NextResponse.json({ error: error.message || "AI Extraction failed" }, { status: 500 });
  }
}