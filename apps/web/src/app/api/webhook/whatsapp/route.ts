// // ── Webhook handler for WhatsApp incoming messages (Meta) ─────────────────
// // app/api/webhooks/whatsapp/route.ts

// import { NextRequest } from "next/dist/server/web/spec-extension/request";

// export async function GET(req: NextRequest) {
//   // Meta webhook verification
//   const { searchParams } = new URL(req.url);
//   const mode      = searchParams.get("hub.mode");
//   const token     = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");
//   if (mode === "subscribe" && token === process.env.META_WA_VERIFY_TOKEN) {
//     return new Response(challenge, { status: 200 });
//   }
//   return new Response("Forbidden", { status: 403 });
// }

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   // Process incoming WhatsApp messages
//   const entry = body.entry?.[0]?.changes?.[0]?.value;
//   if (!entry?.messages?.[0]) return new Response("ok");
//   const msg    = entry.messages[0];
//   const from   = msg.from.slice(2); // remove "91" prefix → 10-digit mobile
//   const text   = msg.text?.body?.trim() || "";

//   // Auto-reply with status if user sends their request ID
//   if (text.toUpperCase().startsWith("REQ-") || /^\d{10}$/.test(text)) {
//     const status = await lookupStatus(text);
//     await sendWhatsAppMeta(from, status);
//   }
//   return new Response("ok");
// }