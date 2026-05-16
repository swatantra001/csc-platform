// lib/notifications.ts
// Complete notification system — WhatsApp (Twilio), WhatsApp (Meta Cloud API),
// SMS fallback, Firebase push notifications, and DB persistence
// Used by all API routes to send notifications

import { supabaseAdmin } from "./supabase";

// ── Types ──────────────────────────────────────────────────────────────────
export type NotifType =
  | "document_viewed"
  | "status_changed"
  | "payment_request"
  | "payment_done"
  | "new_request"
  | "new_scheme"
  | "deadline_reminder"
  | "otp";

export interface NotifPayload {
  userId:    string;
  mobile:    string;          // 10-digit Indian mobile
  type:      NotifType;
  title:     string;
  titleHi:   string;
  body:      string;
  bodyHi:    string;
  requestId?: string;
  actorId?:   string;
  actionUrl?: string;
  meta?:      Record<string, string>;
  priority?:  "urgent" | "high" | "normal" | "low";
  channels?:  ("push" | "whatsapp" | "sms")[];  // defaults to all
}

// ── WhatsApp message templates (Twilio sandbox format) ────────────────────
// In production, register approved templates on WhatsApp Business API
function buildWhatsAppMessage(payload: NotifPayload, lang: "hi" | "en" = "hi"): string {
  const center = "जन सेवा केंद्र, बक्सा | Jan Seva Kendra, Shambhuganj";
  const isHindi = lang === "hi";

  const templates: Record<NotifType, string> = {
    document_viewed: isHindi
      ? `🏛️ *${center}*\n\n👁️ *दस्तावेज़ देखा जा रहा है*\n\nआपके आवेदन के दस्तावेज़ अभी समीक्षा में हैं।\n\n${payload.meta?.doc ? `📄 फ़ाइल: ${payload.meta.doc}` : ""}\n\nस्थिति देखें: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      : `🏛️ *${center}*\n\n👁️ *Document Being Reviewed*\n\nYour documents are currently being reviewed.\n\nTrack: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,

    status_changed: isHindi
      ? `🏛️ *${center}*\n\n🔄 *आवेदन अपडेट*\n\n${payload.bodyHi}\n\nआवेदन ID: ${payload.requestId || "—"}\n\nस्थिति देखें: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      : `🏛️ *${center}*\n\n🔄 *Request Update*\n\n${payload.body}\n\nRequest ID: ${payload.requestId || "—"}\n\nTrack: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,

    payment_request: isHindi
      ? `🏛️ *${center}*\n\n💳 *भुगतान अनुरोध*\n\n₹${payload.meta?.amount || "?"} का भुगतान आवश्यक है।\n\n${payload.bodyHi}\n\n👉 भुगतान करें: ${process.env.NEXT_PUBLIC_APP_URL}${payload.actionUrl || "/dashboard"}`
      : `🏛️ *${center}*\n\n💳 *Payment Required*\n\n₹${payload.meta?.amount || "?"} payment is required.\n\n${payload.body}\n\n👉 Pay now: ${process.env.NEXT_PUBLIC_APP_URL}${payload.actionUrl || "/dashboard"}`,

    payment_done: isHindi
      ? `🏛️ *${center}*\n\n✅ *भुगतान सफल*\n\n₹${payload.meta?.amount || "?"} का भुगतान प्राप्त हो गया।\n\nधन्यवाद! आपकी सेवा में हमें खुशी है। 🙏`
      : `🏛️ *${center}*\n\n✅ *Payment Received*\n\n₹${payload.meta?.amount || "?"} received successfully.\n\nThank you for choosing us! 🙏`,

    new_request: isHindi
      ? `🏛️ *${center}*\n\n📋 *नया आवेदन*\n\n${payload.bodyHi}\n\nआवेदन ID: ${payload.requestId || "—"}\n\n👉 देखें: ${process.env.NEXT_PUBLIC_APP_URL}/admin`
      : `🏛️ *${center}*\n\n📋 *New Request*\n\n${payload.body}\n\nRequest: ${payload.requestId || "—"}\n\n👉 View: ${process.env.NEXT_PUBLIC_APP_URL}/admin`,

    new_scheme: isHindi
      ? `🏛️ *${center}*\n\n🏛️ *नई सरकारी योजना*\n\n${payload.titleHi}\n\n${payload.bodyHi}\n\n👉 विवरण: ${process.env.NEXT_PUBLIC_APP_URL}${payload.actionUrl || "/"}` 
      : `🏛️ *${center}*\n\n🏛️ *New Government Scheme*\n\n${payload.title}\n\n${payload.body}\n\n👉 Details: ${process.env.NEXT_PUBLIC_APP_URL}${payload.actionUrl || "/"}`,

    deadline_reminder: isHindi
      ? `🏛️ *${center}*\n\n⚡ *समय सीमा अनुस्मारक*\n\n${payload.titleHi}\n\n${payload.bodyHi}\n\n⏰ अंतिम तिथि: ${payload.meta?.deadline || "जल्द"}\n\n👉 अभी आवेदन करें: ${process.env.NEXT_PUBLIC_APP_URL}`
      : `🏛️ *${center}*\n\n⚡ *Deadline Reminder*\n\n${payload.title}\n\n${payload.body}\n\n⏰ Last date: ${payload.meta?.deadline || "Soon"}\n\n👉 Apply now: ${process.env.NEXT_PUBLIC_APP_URL}`,

    otp: isHindi
      ? `🏛️ *${center}*\n\n🔐 *OTP / वन टाइम पासवर्ड*\n\nआपका OTP है: *${payload.meta?.otp || "------"}*\n\n⏱️ यह ${payload.meta?.expiry || "10"} मिनट में समाप्त होगा।\n\n⚠️ OTP किसी के साथ साझा न करें।`
      : `🏛️ *${center}*\n\n🔐 *One Time Password (OTP)*\n\nYour OTP is: *${payload.meta?.otp || "------"}*\n\n⏱️ Valid for ${payload.meta?.expiry || "10"} minutes.\n\n⚠️ Never share this OTP with anyone.`,
  };

  return templates[payload.type] || `${payload.title}\n${payload.body}`;
}

// ── Send WhatsApp via Twilio ───────────────────────────────────────────────
async function sendWhatsAppTwilio(mobile: string, message: string): Promise<boolean> {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_WHATSAPP_FROM; // "whatsapp:+14155238886"

  if (!sid || !token || !from) {
    console.warn("[WhatsApp Twilio] Missing credentials — skipping");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To:   `whatsapp:+91${mobile}`,
          From: from,
          Body: message,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("[WhatsApp Twilio] Error:", err.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[WhatsApp Twilio] Fetch error:", e);
    return false;
  }
}

// ── Send WhatsApp via Meta Cloud API ─────────────────────────────────────
// Meta allows free-form messages only within 24-hr window after user messages you.
// For proactive messages, you MUST use approved templates.
async function sendWhatsAppMeta(mobile: string, message: string): Promise<boolean> {
  const token   = process.env.META_WA_TOKEN;
  const phoneId = process.env.META_WA_PHONE_ID;

  if (!token || !phoneId) {
    console.warn("[WhatsApp Meta] Missing credentials — skipping");
    return false;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `91${mobile}`,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) { console.error("[WhatsApp Meta] Error:", data); return false; }
    return true;
  } catch (e) {
    console.error("[WhatsApp Meta] Fetch error:", e);
    return false;
  }
}

// ── Send SMS via Twilio ───────────────────────────────────────────────────
async function sendSMS(mobile: string, message: string): Promise<boolean> {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_SMS_FROM;

  if (!sid || !token || !from) {
    console.warn("[SMS] Missing credentials — skipping");
    return false;
  }

  // SMS is limited to 160 chars — truncate message
  const smsBody = message.replace(/\*|_|🏛️|👁️|🔄|💳|✅|📋|🏛|⚡|🔐/g, "").slice(0, 155);

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To:   `+91${mobile}`,
          From: from,
          Body: smsBody,
        }),
      }
    );
    return res.ok;
  } catch (e) {
    console.error("[SMS] Error:", e);
    return false;
  }
}

// ── Send Firebase push notification ──────────────────────────────────────
async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("[Push] Missing Firebase credentials — skipping");
    return false;
  }

  try {
    // Get access token via service account
    // In production use firebase-admin SDK or google-auth-library
    // For now we use a simplified JWT approach
    const { SignJWT } = await import("jose");
    const key = await crypto.subtle.importKey(
      "pkcs8",
      Buffer.from(privateKey.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\s/g, ""), "base64"),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["sign"]
    );

    const now = Math.floor(Date.now() / 1000);
    const jwt = await new SignJWT({
      iss:   clientEmail,
      sub:   clientEmail,
      aud:   "https://oauth2.googleapis.com/token",
      iat:   now,
      exp:   now + 3600,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
    }).setProtectedHeader({ alg: "RS256" }).sign(key);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    const { access_token } = await tokenRes.json();

    // Send FCM message
    const fcmRes = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          message: {
            token: pushToken,
            notification: { title, body },
            data: data || {},
            android: {
              priority: "HIGH",
              notification: { sound: "default", click_action: "FLUTTER_NOTIFICATION_CLICK" },
            },
            apns: {
              payload: { aps: { sound: "default", badge: 1 } },
            },
          },
        }),
      }
    );

    return fcmRes.ok;
  } catch (e) {
    console.error("[Push] Error:", e);
    return false;
  }
}

// ── Main notification sender ──────────────────────────────────────────────
// This is the single function all API routes call to send any notification.
export async function sendNotification(payload: NotifPayload): Promise<void> {
  const channels = payload.channels || ["push", "whatsapp"];
  const priority = payload.priority || "normal";

  // 1. Always save to DB first
  try {
    await supabaseAdmin.from("notifications").insert({
      user_id:    payload.userId,
      type:       payload.type,
      priority,
      title:      payload.title,
      title_hi:   payload.titleHi,
      body:       payload.body,
      body_hi:    payload.bodyHi,
      request_id: payload.requestId || null,
      actor_id:   payload.actorId || null,
      action_url: payload.actionUrl || null,
      meta:       payload.meta || {},
    });
  } catch (e) {
    console.error("[Notification] DB insert failed:", e);
  }

  // 2. Get user's push token and language preference
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("push_token, preferred_lang")
    .eq("id", payload.userId)
    .single();

  const lang      = (user?.preferred_lang || "hi") as "hi" | "en";
  const pushToken = user?.push_token;

  // 3. Build WhatsApp message
  const waMessage = buildWhatsAppMessage(payload, lang);

  // 4. Send via all requested channels (in parallel)
  const promises: Promise<boolean>[] = [];

  if (channels.includes("push") && pushToken) {
    promises.push(
      sendPushNotification(
        pushToken,
        lang === "hi" ? payload.titleHi : payload.title,
        lang === "hi" ? payload.bodyHi  : payload.body,
        { type: payload.type, requestId: payload.requestId || "", url: payload.actionUrl || "" }
      ).then((ok) => {
        if (ok) supabaseAdmin.from("notifications")
          .update({ sent_push: true })
          .eq("user_id", payload.userId)
          .eq("type", payload.type)
          .order("created_at", { ascending: false })
          .limit(1);
        return ok;
      })
    );
  }

  if (channels.includes("whatsapp")) {
    // Try Twilio first, fall back to Meta
    promises.push(
      sendWhatsAppTwilio(payload.mobile, waMessage)
        .then((ok) => ok || sendWhatsAppMeta(payload.mobile, waMessage))
        .then((ok) => {
          if (ok) supabaseAdmin.from("notifications")
            .update({ sent_wa: true })
            .eq("user_id", payload.userId)
            .eq("type", payload.type)
            .order("created_at", { ascending: false })
            .limit(1);
          return ok;
        })
    );
  }

  if (channels.includes("sms")) {
    promises.push(
      sendSMS(payload.mobile, waMessage).then((ok) => {
        if (ok) supabaseAdmin.from("notifications")
          .update({ sent_sms: true })
          .eq("user_id", payload.userId)
          .eq("type", payload.type)
          .order("created_at", { ascending: false })
          .limit(1);
        return ok;
      })
    );
  }

  // Fire all — don't await (notifications are non-blocking)
  Promise.allSettled(promises).then((results) => {
    const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value));
    if (failed.length) console.warn(`[Notification] ${failed.length} channel(s) failed for user ${payload.userId}`);
  });
}

// ── Convenience notification helpers ─────────────────────────────────────
// Call these from your API routes — no need to build payloads manually.

export async function notifyDocumentViewed(params: {
  userId: string; mobile: string; docName: string;
  requestId: string; viewerName: string; viewerId: string;
}) {
  await sendNotification({
    userId:    params.userId,
    mobile:    params.mobile,
    type:      "document_viewed",
    priority:  "high",
    title:     `${params.viewerName} is viewing your document`,
    titleHi:   `${params.viewerName} आपके दस्तावेज़ देख रहे हैं`,
    body:      `${params.docName} is being reviewed right now.`,
    bodyHi:    `${params.docName} की अभी समीक्षा हो रही है।`,
    requestId: params.requestId,
    actorId:   params.viewerId,
    actionUrl: "/dashboard",
    meta:      { doc: params.docName, viewer: params.viewerName },
    channels:  ["push", "whatsapp"],
  });
}

export async function notifyStatusChanged(params: {
  userId: string; mobile: string; requestId: string;
  service: string; serviceHi: string; newStatus: string; actorId: string;
}) {
  const statusLabels: Record<string, [string, string]> = {
    seen:            ["Received at office",  "कार्यालय में प्राप्त"],
    processing:      ["In progress",         "प्रक्रिया में"],
    payment_pending: ["Payment required",    "भुगतान आवश्यक"],
    done:            ["Completed ✅",         "पूर्ण ✅"],
    cancelled:       ["Cancelled",           "रद्द"],
  };
  const [statusEn, statusHi] = statusLabels[params.newStatus] || [params.newStatus, params.newStatus];

  await sendNotification({
    userId:    params.userId,
    mobile:    params.mobile,
    type:      "status_changed",
    priority:  params.newStatus === "done" ? "high" : "normal",
    title:     `Request ${statusEn}: ${params.service}`,
    titleHi:   `आवेदन ${statusHi}: ${params.serviceHi}`,
    body:      `Your ${params.service} request is now: ${statusEn}`,
    bodyHi:    `आपका ${params.serviceHi} आवेदन: ${statusHi}`,
    requestId: params.requestId,
    actorId:   params.actorId,
    actionUrl: "/dashboard",
  });
}

export async function notifyPaymentRequest(params: {
  userId: string; mobile: string; requestId: string; amount: number;
  service: string; serviceHi: string; actorId: string; orderId: string;
}) {
  await sendNotification({
    userId:    params.userId,
    mobile:    params.mobile,
    type:      "payment_request",
    priority:  "high",
    title:     `Payment required — ₹${params.amount}`,
    titleHi:   `भुगतान अनुरोध — ₹${params.amount}`,
    body:      `Service fee for ${params.service}. Tap to pay now.`,
    bodyHi:    `${params.serviceHi} के लिए सेवा शुल्क। भुगतान करने के लिए टैप करें।`,
    requestId: params.requestId,
    actorId:   params.actorId,
    actionUrl: `/pay/${params.orderId}`,
    meta:      { amount: String(params.amount) },
    channels:  ["push", "whatsapp"],
  });
}

export async function notifyPaymentReceived(params: {
  userId: string; mobile: string; amount: number;
  service: string; serviceHi: string; paymentId: string;
}) {
  await sendNotification({
    userId:   params.userId,
    mobile:   params.mobile,
    type:     "payment_done",
    priority: "normal",
    title:    `Payment received — ₹${params.amount}`,
    titleHi:  `भुगतान प्राप्त — ₹${params.amount}`,
    body:     `Your payment for ${params.service} was received.`,
    bodyHi:   `${params.serviceHi} के लिए भुगतान प्राप्त हो गया।`,
    meta:     { amount: String(params.amount), paymentId: params.paymentId },
    channels: ["push", "whatsapp"],
  });
}

export async function notifyNewScheme(params: {
  userIds: string[]; mobiles: string[]; postId: string;
  title: string; titleHi: string; theme: string;
}) {
  // Batch notify all users about a new scheme post
  const promises = params.userIds.map((userId, i) =>
    sendNotification({
      userId,
      mobile:    params.mobiles[i],
      type:      "new_scheme",
      priority:  "low",
      title:     params.title,
      titleHi:   params.titleHi,
      body:      "A new government scheme is available at Jan Seva Kendra, Shambhuganj.",
      bodyHi:    "जन सेवा केंद्र, शंभुगंज पर नई सरकारी योजना उपलब्ध है।",
      actionUrl: `/posts/${params.postId}`,
      channels:  ["push"], // Don't WhatsApp blast all users for schemes
    })
  );
  await Promise.allSettled(promises);
}

