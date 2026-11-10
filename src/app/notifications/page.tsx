// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "@/components/AuthProvider";
// import { supabase } from "@/lib/supabase";
// import { fetchNotificationsAction, markNotificationsReadAction, broadcastNotificationAction } from "@/app/actions/notifications";

// // ════════════════════════════════════════════════════════════════════════════════
// // TYPES (Preserved Exactly)
// // ════════════════════════════════════════════════════════════════════════════════
// type Lang      = "hi" | "en";
// type NotifType = "document_viewed" | "status_changed" | "payment_request" | "payment_done" | "message" | "scheme" | "urgent_alert" | "admin_action";
// type Priority  = "urgent" | "high" | "normal" | "low";
// type Group     = "today" | "yesterday" | "older";

// interface AppNotification {
//   id: string;
//   type: NotifType;
//   priority: Priority;
//   title: string;
//   title_hi: string;
//   body: string;
//   body_hi: string;
//   created_at: string;
//   group?: Group;
//   is_read: boolean;
//   request_id: string | null;
//   actor_id: string | null;
//   action_url: string | null;
//   meta?: Record<string, string>;
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // CONFIG (Preserved Exactly)
// // ════════════════════════════════════════════════════════════════════════════════
// const TYPE_CFG: Record<string, any> = {
//   document_viewed: { icon: "👁️", color: "#00b8d4", bgDark: "#040e14", bgLight: "#e0f8fc", borderDark: "#0a3a44", borderLight: "#90d8e8", labelEn: "Document Viewed",  labelHi: "दस्तावेज़ देखा" },
//   status_changed:  { icon: "🔄", color: "#e0a020", bgDark: "#140e00", bgLight: "#fef8e0", borderDark: "#443000", borderLight: "#e8cc80", labelEn: "Status Update",    labelHi: "स्थिति अपडेट" },
//   payment_request: { icon: "💳", color: "#c45c1a", bgDark: "#140800", bgLight: "#fff5ee", borderDark: "#442000", borderLight: "#f0c090", labelEn: "Payment Request",  labelHi: "भुगतान अनुरोध" },
//   payment_done:    { icon: "✅", color: "#1a7a3a", bgDark: "#041408", bgLight: "#e8f8ee", borderDark: "#0a3a18", borderLight: "#90d0a0", labelEn: "Payment Received", labelHi: "भुगतान प्राप्त" },
//   message:         { icon: "💬", color: "#6a6a8a", bgDark: "#0e0e14", bgLight: "#f0f0f8", borderDark: "#22223a", borderLight: "#b0b0d0", labelEn: "New Message",      labelHi: "नया संदेश" },
//   scheme:          { icon: "🏛️", color: "#1a5aa0", bgDark: "#040a14", bgLight: "#e8f0fb", borderDark: "#0a2040", borderLight: "#90b8e8", labelEn: "New Scheme",       labelHi: "नई योजना" },
//   urgent_alert:    { icon: "🚨", color: "#c03010", bgDark: "#140404", bgLight: "#fef0ee", borderDark: "#441010", borderLight: "#f0a090", labelEn: "Urgent Alert",     labelHi: "अत्यावश्यक" },
//   admin_action:    { icon: "🔧", color: "#8a50d0", bgDark: "#0e0814", bgLight: "#f4f0fb", borderDark: "#2e1844", borderLight: "#c0a0e8", labelEn: "Admin Action",     labelHi: "एडमिन कार्रवाई" },
// };

// const PRIORITY_CFG: Record<string, any> = {
//   urgent: { label: "URGENT",  labelHi: "अत्यावश्यक", color: "#c03010", dot: "#ff4020" },
//   high:   { label: "HIGH",    labelHi: "उच्च",        color: "#c45c1a", dot: "#e07030" },
//   normal: { label: "NORMAL",  labelHi: "सामान्य",     color: "#6a6a8a", dot: "#9090b0" },
//   low:    { label: "LOW",     labelHi: "कम",          color: "#4a6a4a", dot: "#7090708" },
// };

// const GROUP_LABELS: Record<Group, Record<Lang, string>> = {
//   today:     { hi: "आज",  en: "Today" },
//   yesterday: { hi: "कल",  en: "Yesterday" },
//   older:     { hi: "पुराने", en: "Earlier" },
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // LANGUAGE STRINGS (Renamed from T → LANG to free up T for Theme Tokens)
// // ════════════════════════════════════════════════════════════════════════════════
// const LANG: Record<Lang, Record<string, string>> = {
//   hi: {
//     title: "सूचना केंद्र", subtitle: "सभी सूचनाएं एक जगह", all: "सभी", unread: "अपठित",
//     markAll: "सभी पढ़े हुए चिह्नित करें", clearAll: "सभी साफ करें", noNotifs: "कोई सूचना नहीं",
//     noNotifsSub: "आपकी सभी सूचनाएं यहाँ दिखेंगी।", viewReq: "आवेदन देखें", payNow: "अभी भुगतान करें",
//     viewPost: "देखें", filter: "फ़िल्टर", settings: "सेटिंग्स",
//     adminDispatch: "प्रसारण भेजें", dispatchTitle: "नया प्रसारण", sendBlast: "सभी को भेजें",
//   },
//   en: {
//     title: "Notification Center", subtitle: "All your alerts in one place", all: "All", unread: "Unread",
//     markAll: "Mark all as read", clearAll: "Clear all", noNotifs: "No notifications",
//     noNotifsSub: "Your notifications will appear here.", viewReq: "View Request", payNow: "Pay Now",
//     viewPost: "View Post", filter: "Filter", settings: "Settings",
//     adminDispatch: "Dispatch Broadcast", dispatchTitle: "New Broadcast", sendBlast: "Blast to All",
//   },
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // DUAL THEME TOKENS (Exact Reference Structure)
// // ════════════════════════════════════════════════════════════════════════════════
// const THEMES = {
//   light: {
//     pageBg:            "#f1f5f9",
//     navBg:             "#1e3a8a",
//     navBottomBorder:   "#3b82f6",
//     navText:           "rgba(255,255,255,0.65)",
//     navTextHover:      "#ffffff",
//     navActiveBg:       "#3b82f6",
//     navActiveText:     "#ffffff",
//     navBrand:          "#ffffff",
//     navBrandAccent:    "#93c5fd",

//     sidebarBg:         "#ffffff",
//     sidebarHeaderBg:   "#f8fafc",

//     cardBg:            "#ffffff",
//     cardBorder:        "#e2e8f0",
//     cardShadow:        "0 1px 4px rgba(0,0,0,0.07)",

//     sectionGrad:       "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
//     sectionGradText:   "#ffffff",

//     textPrimary:       "#1e293b",
//     textSecondary:     "#475569",
//     textMuted:         "#94a3b8",

//     accent:            "#2563eb",
//     accentHover:       "#1d4ed8",
//     accentLight:       "#eff6ff",
//     accentBorder:      "#bfdbfe",

//     inputBg:           "#f8fafc",
//     inputBorder:       "#e2e8f0",
//     inputFocusBorder:  "#3b82f6",
//     inputText:         "#1e293b",
//     inputPlaceholder:  "#94a3b8",

//     divider:           "#e2e8f0",

//     chatBg:            "#f1f5f9",
//     chatPattern:       "radial-gradient(#2563eb14 1px,transparent 1px)",
//     bubbleAdminBg:     "#dbeafe",
//     bubbleAdminBorder: "#bfdbfe",
//     bubbleAdminText:   "#1e293b",
//     bubbleUserBg:      "#ffffff",
//     bubbleUserBorder:  "#e2e8f0",
//     bubbleUserText:    "#1e293b",
//     bubbleMeta:        "rgba(0,0,0,0.35)",

//     pillBg:            "#f1f5f9",
//     pillBorder:        "#e2e8f0",
//     pillText:          "#64748b",
//     pillActiveBg:      "#dbeafe",
//     pillActiveBorder:  "#93c5fd",
//     pillActiveText:    "#1d4ed8",

//     chatRowActiveBg:   "#eff6ff",
//     chatRowActiveBorder:"#2563eb",
//     rowHover:          "#f8fafc",

//     btnPrimary:        "linear-gradient(135deg,#2563eb,#1d4ed8)",
//     btnPrimaryText:    "#ffffff",
//     btnPrimaryGlow:    "rgba(37,99,235,0.35)",
//     btnGhostBg:        "#f1f5f9",
//     btnGhostBorder:    "#e2e8f0",
//     btnGhostText:      "#475569",
//     btnGhostHoverBg:   "#eff6ff",
//     btnGhostHoverText: "#2563eb",
//     btnDangerBg:       "#fef2f2",
//     btnDangerBorder:   "#fecaca",
//     btnDangerText:     "#dc2626",
//     btnSuccessBg:      "linear-gradient(135deg,#15803d,#16a34a)",
//     btnSuccessText:    "#ffffff",

//     subTabHdrBg:       "#f8fafc",
//     subTabText:        "#94a3b8",
//     subTabActive:      "#2563eb",
//     subTabBorder:      "#2563eb",

//     tagBg:             "#dbeafe",
//     tagText:           "#1d4ed8",
//     scrollThumb:       "#bfdbfe",

//     modalOverlay:      "rgba(15,23,42,0.55)",
//     modalBg:           "#ffffff",
//     modalBorder:       "#e2e8f0",

//     teamCardBorder:    "#e2e8f0",
//     teamCardBg:        "#ffffff",
//     teamCardHover:     "#f8fafc",

//     statusDotBorder:   "#ffffff",
//     toggleIcon:        "🌙",
//     toggleLabel:       "Dark",

//     payPendingGrad:    "linear-gradient(135deg,#b45309,#d97706)",
//     payPaidGrad:       "linear-gradient(135deg,#15803d,#16a34a)",
//     docIconBg:         "#fef2f2",
//     docIconBorder:     "#fecaca",
//     docIconColor:      "#dc2626",
//   },
//   dark: {
//     pageBg:            "#060b14",
//     navBg:             "rgba(6,11,20,0.98)",
//     navBottomBorder:   "#f59e0b",
//     navText:           "rgba(255,255,255,0.45)",
//     navTextHover:      "#ffffff",
//     navActiveBg:       "rgba(245,158,11,0.18)",
//     navActiveText:     "#f59e0b",
//     navBrand:          "#ffffff",
//     navBrandAccent:    "#f59e0b",

//     sidebarBg:         "rgba(6,11,20,0.9)",
//     sidebarHeaderBg:   "rgba(255,255,255,0.02)",

//     cardBg:            "rgba(255,255,255,0.03)",
//     cardBorder:        "rgba(255,255,255,0.08)",
//     cardShadow:        "0 1px 4px rgba(0,0,0,0.3)",

//     sectionGrad:       "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
//     sectionGradText:   "#000000",

//     textPrimary:       "#f1f5f9",
//     textSecondary:     "rgba(255,255,255,0.55)",
//     textMuted:         "rgba(255,255,255,0.28)",

//     accent:            "#f59e0b",
//     accentHover:       "#d97706",
//     accentLight:       "rgba(245,158,11,0.08)",
//     accentBorder:      "rgba(245,158,11,0.25)",

//     inputBg:           "rgba(255,255,255,0.05)",
//     inputBorder:       "rgba(255,255,255,0.08)",
//     inputFocusBorder:  "rgba(245,158,11,0.5)",
//     inputText:         "#f1f5f9",
//     inputPlaceholder:  "rgba(255,255,255,0.25)",

//     divider:           "rgba(255,255,255,0.06)",

//     chatBg:            "#080d17",
//     chatPattern:       "radial-gradient(rgba(245,158,11,0.018) 1px,transparent 1px)",
//     bubbleAdminBg:     "rgba(245,158,11,0.12)",
//     bubbleAdminBorder: "rgba(245,158,11,0.22)",
//     bubbleAdminText:   "#f1f5f9",
//     bubbleUserBg:      "rgba(255,255,255,0.05)",
//     bubbleUserBorder:  "rgba(255,255,255,0.08)",
//     bubbleUserText:    "#f1f5f9",
//     bubbleMeta:        "rgba(255,255,255,0.3)",

//     pillBg:            "rgba(255,255,255,0.03)",
//     pillBorder:        "rgba(255,255,255,0.08)",
//     pillText:          "rgba(255,255,255,0.4)",
//     pillActiveBg:      "rgba(245,158,11,0.15)",
//     pillActiveBorder:  "rgba(245,158,11,0.4)",
//     pillActiveText:    "#f59e0b",

//     chatRowActiveBg:   "rgba(245,158,11,0.08)",
//     chatRowActiveBorder:"#f59e0b",
//     rowHover:          "rgba(255,255,255,0.03)",

//     btnPrimary:        "linear-gradient(135deg,#f59e0b,#d97706)",
//     btnPrimaryText:    "#000000",
//     btnPrimaryGlow:    "rgba(245,158,11,0.35)",
//     btnGhostBg:        "rgba(255,255,255,0.05)",
//     btnGhostBorder:    "rgba(255,255,255,0.1)",
//     btnGhostText:      "rgba(255,255,255,0.7)",
//     btnGhostHoverBg:   "rgba(245,158,11,0.1)",
//     btnGhostHoverText: "#f59e0b",
//     btnDangerBg:       "rgba(239,68,68,0.1)",
//     btnDangerBorder:   "rgba(239,68,68,0.25)",
//     btnDangerText:     "#f87171",
//     btnSuccessBg:      "linear-gradient(135deg,#10b981,#059669)",
//     btnSuccessText:    "#ffffff",

//     subTabHdrBg:       "rgba(6,11,20,0.6)",
//     subTabText:        "rgba(255,255,255,0.35)",
//     subTabActive:      "#f59e0b",
//     subTabBorder:      "#f59e0b",

//     tagBg:             "rgba(245,158,11,0.15)",
//     tagText:           "#f59e0b",
//     scrollThumb:       "rgba(245,158,11,0.3)",

//     modalOverlay:      "rgba(0,0,0,0.85)",
//     modalBg:           "#0f172a",
//     modalBorder:       "rgba(255,255,255,0.1)",

//     teamCardBorder:    "rgba(255,255,255,0.08)",
//     teamCardBg:        "rgba(255,255,255,0.03)",
//     teamCardHover:     "rgba(255,255,255,0.05)",

//     statusDotBorder:   "#060b14",
//     toggleIcon:        "☀️",
//     toggleLabel:       "Light",

//     payPendingGrad:    "linear-gradient(135deg,#b45309,#d97706)",
//     payPaidGrad:       "linear-gradient(135deg,#065f46,#047857)",
//     docIconBg:         "rgba(239,68,68,0.12)",
//     docIconBorder:     "rgba(239,68,68,0.28)",
//     docIconColor:      "#f87171",
//   },
// } as const;

// type ThemeTokens = typeof THEMES.light;

// // ════════════════════════════════════════════════════════════════════════════════
// // NAV LINKS (User Specified)
// // ════════════════════════════════════════════════════════════════════════════════
// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/delivery" : "http://localhost:3000/delivery", icon: "📦", label: "Delivery" },
// ];

// // ════════════════════════════════════════════════════════════════════════════════
// // ICONS (Inline SVG from Reference)
// // ════════════════════════════════════════════════════════════════════════════════
// const Ico = {
//   Search:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
//   Plus:     () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
//   X:        () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
//   Send:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
//   Attach:   () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
//   Pay:      () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
//   Check:    () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
//   DblChk:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 6 7 17 2 12"/><polyline points="22 6 11 17 7 13"/></svg>,
//   Reply:    () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>,
//   Download: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
//   Doc:      () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
//   Team:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
//   Post:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
//   ZoomIn:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // AVATAR (From Reference)
// // ════════════════════════════════════════════════════════════════════════════════
// function Avatar({ name, size = 40, isDark }: { name?: string | null; size?: number; isDark: boolean }) {
//   const ch = name?.charAt(0).toUpperCase() || "?";
//   const grad = isDark ? "linear-gradient(135deg,#334155,#1e293b)" : "linear-gradient(135deg,#64748b,#475569)";
//   return (
//     <div style={{ width: size, height: size, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.18)" }}>
//       {ch}
//     </div>
//   );
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // GENERATED CSS (Theme-aware)
// // ════════════════════════════════════════════════════════════════════════════════
// function buildCss(T: ThemeTokens): string {
//   return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}

// .serif{font-family:'DM Serif Display',serif;}
// .mono{font-family:'JetBrains Mono',monospace;}

// /* ── NAV LINK ── */
// .top-nav-link{
//   display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
//   font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
//   transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
// }
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

// /* ── FILTER PILLS ── */
// .pill{
//   padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
//   cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
//   background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
// }
// .pill:hover{border-color:${T.accent};color:${T.accent};}
// .pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

// /* ── BUTTONS ── */
// .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;
//   font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;
//   font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;}
// .btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
// .btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
// .btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
// .btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
// .btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
// .btn-d:hover{filter:brightness(.95);}
// .btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
// .btn-s:hover{filter:brightness(1.08);}
// .btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

// /* ── INPUT ── */
// .inp{
//   width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
//   border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
//   transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
// }
// .inp:focus{border-color:${T.inputFocusBorder};}
// .inp::placeholder{color:${T.inputPlaceholder};}
// select.inp option{background:${T.modalBg};color:${T.inputText};}

// /* ── CARD ── */
// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

// /* ── SECTION HEADER (gradient) inside card ── */
// .sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
// .sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

// /* ── MODAL ── */
// .modal-ov{position:fixed;inset:0;background:${T.modalOverlay};backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
// .modal-bx{background:${T.modalBg};border:1px solid ${T.modalBorder};border-radius:14px;width:100%;max-width:460px;animation:pop .2s ease;box-shadow:0 30px 60px rgba(0,0,0,0.25);}

// /* ── THEME TOGGLE ── */
// .tog{
//   display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
//   border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
//   color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
//   transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
// }
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

// /* ── NOTIF CARD ── */
// .notif-card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;padding:16px;margin-bottom:10px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden;}
// .notif-card:hover{border-color:${T.accentBorder};background:${T.rowHover};transform:translateY(-1px);box-shadow:${T.cardShadow};}
// .notif-card.unread{border-left:3px solid ${T.accent};}
// .notif-card.urgent{animation:urgentPulse 2s infinite;}

// /* ── FILTER CHIP ── */
// .filter-chip{
//   padding:5px 14px;border-radius:20px;border:1px solid ${T.pillBorder};
//   background:transparent;color:${T.pillText};font-size:11px;font-weight:700;
//   letter-spacing:.04em;text-transform:uppercase;cursor:pointer;
//   font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap;
// }
// .filter-chip.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}
// .filter-chip:hover:not(.on){border-color:${T.accent};color:${T.accent};}

// /* ── GROUP HEADER ── */
// .group-hdr{display:flex;align-items:center;gap:12px;margin:20px 0 10px;padding:0 4px;}
// .group-lbl{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${T.textMuted};font-family:'JetBrains Mono',monospace;white-space:nowrap;}
// .group-line{flex:1;height:1px;background:${T.divider};}

// /* ── PRIORITY STAMP ── */
// .p-stamp{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;border:1px solid;}

// /* ── TYPE ICON ── */
// .type-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}

// /* ── ACTION LINK ── */
// .act-link{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.01em;border:1.5px solid;text-decoration:none;transition:all .15s;}
// .act-p{background:${T.btnPrimary};border-color:transparent;color:${T.btnPrimaryText};}
// .act-p:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
// .act-g{background:transparent;border-color:${T.inputBorder};color:${T.textSecondary};}
// .act-g:hover{border-color:${T.accent};color:${T.accent};background:${T.accentLight};}
// .act-pay{background:linear-gradient(135deg,#15803d,#16a34a);border-color:transparent;color:#fff;}
// .act-pay:hover{filter:brightness(1.08);}

// /* ── SETTINGS / DISPATCH PANEL ── */
// .side-panel{
//   position:fixed;top:0;right:0;bottom:0;width:380px;background:${T.modalBg};
//   border-left:1px solid ${T.modalBorder};z-index:1001;padding:24px;
//   animation:slideInR .25s ease;overflow-y:auto;display:flex;flex-direction:column;
// }
// .side-backdrop{position:fixed;inset:0;background:${T.modalOverlay};backdrop-filter:blur(4px);z-index:1000;}

// /* ── ADMIN INPUT ── */
// .admin-inp{
//   width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
//   border-radius:7px;color:${T.inputText};font-size:13px;font-family:inherit;margin-bottom:12px;outline:none;
//   transition:border-color .18s;
// }
// .admin-inp:focus{border-color:${T.inputFocusBorder};}
// .admin-inp::placeholder{color:${T.inputPlaceholder};}

// /* ── PULSE ── */
// @keyframes urgentPulse{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.4);}70%{box-shadow:0 0 0 8px rgba(245,158,11,0);}}

// /* ── ANIMS ── */
// @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
// @keyframes slideInR{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
// @keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

// /* ── MOBILE RESPONSIVE ── */
// @media(max-width:768px){
//   .nav-links{display:none!important;}
//   .side-panel{width:100%!important;}
// }
// `;
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // SECTION HEADER COMPONENT
// // ════════════════════════════════════════════════════════════════════════════════
// function SecHdr({ icon, label }: { icon: string; label: string }) {
//   return (
//     <div className="sec-hdr">
//       <span style={{ fontSize: "1.05rem" }}>{icon}</span>
//       <span className="sec-hdr-txt">{label}</span>
//     </div>
//   );
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ════════════════════════════════════════════════════════════════════════════════
// export default function NotificationCenter() {
//   // DEFAULT = LIGHT theme
//   const [isDark, setIsDark] = useState(false);
//   const T = isDark ? THEMES.dark : THEMES.light;

//   const { user, isLoggedIn } = useAuth();
//   const [lang, setLang] = useState<Lang>("hi");
//   const t = LANG[lang];

//   const [notifs, setNotifs] = useState<AppNotification[]>([]);
//   const [filter, setFilter] = useState<"all" | "unread" | NotifType>("all");
//   const [showSettings, setShowSettings] = useState(false);
//   const [showAdminDispatch, setShowAdminDispatch] = useState(false);
//   const [expanding, setExpanding] = useState<string | null>(null);

//   // Admin Broadcast Form State (Preserved Exactly)
//   const [bType, setBType] = useState("scheme");
//   const [bPriority, setBPriority] = useState("normal");
//   const [bTitleEn, setBTitleEn] = useState("");
//   const [bTitleHi, setBTitleHi] = useState("");
//   const [bBodyEn, setBBodyEn] = useState("");
//   const [bBodyHi, setBBodyHi] = useState("");
//   const [isBroadcasting, setIsBroadcasting] = useState(false);

//   // Initialize DB & Real-time (Preserved Exactly)
//   useEffect(() => {
//     if (!isLoggedIn || !user) return;
//     setLang((user.preferred_lang as Lang) || "hi");

//     fetchNotificationsAction().then((data) => {
//       const processed = (data as any[]).map(n => ({
//         ...n,
//         group: new Date(n.created_at).toDateString() === new Date().toDateString() ? "today" : "older"
//       }));
//       setNotifs(processed);
//     });

//     const channel = supabase
//       .channel('realtime_notifs')
//       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
//         const newNotif = { ...payload.new, group: "today" } as AppNotification;
//         setNotifs(prev => [newNotif, ...prev]);
//       })
//       .subscribe();

//     return () => { supabase.removeChannel(channel); };
//   }, [isLoggedIn, user]);

//   // Theme Sync (Preserved Exactly)
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("csc_theme");
//     if (savedTheme) {
//       setIsDark(savedTheme === "dark");
//     } else {
//       const mq = window.matchMedia("(prefers-color-scheme: dark)");
//       setIsDark(mq.matches);
//     }
//   }, []);

//   const markRead = useCallback(async (id: string) => {
//     setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
//     await supabase.from("notifications").update({ is_read: true }).eq("id", id);
//   }, []);

//   const markAllRead = useCallback(async () => {
//     setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
//     await markNotificationsReadAction();
//   }, []);

//   const clearAll = useCallback(() => {
//     setNotifs([]);
//   }, []);

//   const handleBroadcast = async () => {
//     if (!bTitleEn || !bBodyEn) return;
//     setIsBroadcasting(true);
//     const res = await broadcastNotificationAction({
//       type: bType, priority: bPriority, title: bTitleEn, title_hi: bTitleHi || bTitleEn, body: bBodyEn, body_hi: bBodyHi || bBodyEn
//     });
//     setIsBroadcasting(false);
//     if (res.success) {
//       alert(`Successfully dispatched to ${res.count} users!`);
//       setShowAdminDispatch(false);
//       setBTitleEn(""); setBTitleHi(""); setBBodyEn(""); setBBodyHi("");
//     } else {
//       alert("Broadcast failed: " + res.error);
//     }
//   };

//   const toggleTheme = () => {
//     const newDark = !isDark; setIsDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

//   const filteredNotifs = notifs.filter((n) => {
//     if (filter === "unread") return !n.is_read;
//     if (filter !== "all") return n.type === filter;
//     return true;
//   });

//   const unreadCount = notifs.filter((n) => !n.is_read).length;
//   const isAdmin = user?.role === "main_admin" || user?.role === "co_admin";

//   const groups: Group[] = ["today", "yesterday", "older"];
//   const grouped = groups.reduce((acc, g) => {
//     const items = filteredNotifs.filter((n) => n.group === g);
//     if (items.length) acc[g] = items;
//     return acc;
//   }, {} as Record<Group, AppNotification[]>);

//   // ════════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ════════════════════════════════════════════════════════════════════════════
//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s", fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif" }}>
//       <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

//       {/* ════════════════════════════════════════════════════════
//           HEADER — navy indigo in both themes
//       ════════════════════════════════════════════════════════ */}
//       <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)", position: "sticky", top: 0 }}>
//         <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

//           <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
//             <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
//             <div>
//               <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
//                 Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>NOTIFICATIONS</div>
//             </div>
//           </a>

//           <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

//           {/* Nav links */}
//           <nav className="nav-links" style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
//             {NAV_LINKS.map(l => (
//               <a key={l.href} href={l.href} className="top-nav-link">
//                 <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
//               </a>
//             ))}
//           </nav>

//           <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//             {unreadCount > 0 && (
//               <div style={{ background: T.accent, color: "#000", borderRadius: 10, minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, padding: "0 5px" }}>
//                 {unreadCount}
//               </div>
//             )}

//             {unreadCount > 0 && (
//               <button onClick={markAllRead} className="btn btn-g" style={{ fontSize: 11, padding: "5px 12px" }}>
//                 <Ico.Check /> {t.markAll}
//               </button>
//             )}

//             <button onClick={() => setLang(l => l === "hi" ? "en" : "hi")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "5px 12px", fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" }}
//               onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
//               onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>
//               {lang === "hi" ? "EN" : "हि"}
//             </button>

//             {/* Theme Toggle */}
//             <button className="tog" onClick={toggleTheme}>
//               <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
//             </button>

//             <button onClick={() => setShowSettings(true)} className="btn btn-g" style={{ padding: "6px 10px", fontSize: 12 }}>
//               ⚙️
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ════════════════════════════════════════════════════════
//           MAIN CONTENT
//       ════════════════════════════════════════════════════════ */}
//       <div style={{ flex: 1, maxWidth: 800, margin: "0 auto", width: "100%", padding: "20px 16px 60px" }}>

//         {/* Page Title */}
//         <div style={{ marginBottom: 20 }}>
//           <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>{t.title}</div>
//           <div style={{ fontSize: 13, color: T.textMuted }}>{t.subtitle}</div>
//         </div>

//         {/* Admin Dispatch Button */}
//         {isAdmin && (
//           <div style={{ marginBottom: 16 }}>
//             <button onClick={() => setShowAdminDispatch(true)} className="btn btn-p" style={{ fontSize: 13 }}>
//               <Ico.Plus /> {t.adminDispatch}
//             </button>
//           </div>
//         )}

//         {/* Filter Chips */}
//         <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
//           <button className={`filter-chip ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>{t.all}</button>
//           <button className={`filter-chip ${filter === "unread" ? "on" : ""}`} onClick={() => setFilter("unread")}>
//             {t.unread} {unreadCount > 0 && `(${unreadCount})`}
//           </button>
//           <div style={{ width: 1, height: 28, background: T.divider, flexShrink: 0, alignSelf: "center" }} />
//           {(["document_viewed", "payment_request", "status_changed", "scheme", "urgent_alert"] as NotifType[]).map((type) => {
//             const cfg = TYPE_CFG[type] || TYPE_CFG.message;
//             return (
//               <button key={type} className={`filter-chip ${filter === type ? "on" : ""}`}
//                 onClick={() => setFilter(f => f === type ? "all" : type)}
//                 style={{ borderColor: filter === type ? cfg.color : undefined, color: filter === type ? cfg.color : undefined, background: filter === type ? `${cfg.color}18` : undefined }}>
//                 {cfg.icon} {lang === "hi" ? cfg.labelHi : cfg.labelEn}
//               </button>
//             );
//           })}
//         </div>

//         {/* Notification Groups */}
//         {filteredNotifs.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "60px 20px", animation: "fadeIn 0.3s ease" }}>
//             <div style={{ fontSize: 52, opacity: 0.25, marginBottom: 16 }}>📭</div>
//             <div className="mono" style={{ fontSize: 12, color: T.textMuted, letterSpacing: "0.08em", fontWeight: 700 }}>{t.noNotifs.toUpperCase()}</div>
//             <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>{t.noNotifsSub}</div>
//           </div>
//         ) : (
//           groups.map((group) => {
//             const items = grouped[group];
//             if (!items?.length) return null;
//             return (
//               <div key={group}>
//                 <div className="group-hdr">
//                   <div className="group-line" />
//                   <span className="group-lbl">{GROUP_LABELS[group][lang]}</span>
//                   <div className="group-line" />
//                 </div>

//                 {items.map((n, idx) => {
//                   const cfg  = TYPE_CFG[n.type] || TYPE_CFG.message;
//                   const pcfg = PRIORITY_CFG[n.priority] || PRIORITY_CFG.normal;
//                   const isExpanded = expanding === n.id;

//                   return (
//                     <div
//                       key={n.id}
//                       className={`notif-card ${!n.is_read ? "unread" : ""} ${n.priority === "urgent" ? "urgent" : ""}`}
//                       onClick={() => { markRead(n.id); setExpanding(isExpanded ? null : n.id); }}
//                       style={{
//                         animationDelay: `${idx * 0.04}s`,
//                         borderLeftColor: !n.is_read ? cfg.color : T.cardBorder,
//                         background: !n.is_read ? (isDark ? cfg.bgDark : cfg.bgLight) : T.cardBg,
//                         borderColor: !n.is_read ? (isDark ? cfg.borderDark : cfg.borderLight) : T.cardBorder,
//                       }}
//                     >
//                       <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
//                         <div className="type-icon" style={{ background: isDark ? cfg.bgDark : cfg.bgLight, border: `2px solid ${isDark ? cfg.borderDark : cfg.borderLight}` }}>
//                           {cfg.icon}
//                         </div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
//                             <span className="mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: cfg.color }}>
//                               {lang === "hi" ? cfg.labelHi : cfg.labelEn}
//                             </span>
//                             {n.priority !== "normal" && (
//                               <span className="p-stamp" style={{ background: `${pcfg.color}18`, color: pcfg.color, borderColor: `${pcfg.color}40` }}>
//                                 <span style={{ width: 6, height: 6, borderRadius: "50%", background: pcfg.dot }} />
//                                 {lang === "hi" ? pcfg.labelHi : pcfg.label}
//                               </span>
//                             )}
//                             {n.request_id && (
//                               <span className="mono" style={{ fontSize: 9, color: T.textMuted }}>{n.request_id.split('-')[0].toUpperCase()}</span>
//                             )}
//                             <span style={{ marginLeft: "auto", fontSize: 11, color: T.textMuted, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>
//                               {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </span>
//                             {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />}
//                           </div>
//                           <div style={{ fontSize: 14, fontWeight: !n.is_read ? 700 : 600, color: T.textPrimary, lineHeight: 1.4, marginBottom: 4 }}>
//                             {lang === "hi" ? (n.title_hi || n.title) : n.title}
//                           </div>
//                           <div style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.7, display: isExpanded ? "block" : "-webkit-box", WebkitLineClamp: isExpanded ? undefined : 2, WebkitBoxOrient: isExpanded ? undefined : "vertical", overflow: isExpanded ? "visible" : "hidden" }}>
//                             {lang === "hi" ? (n.body_hi || n.body) : n.body}
//                           </div>
//                         </div>
//                       </div>

//                       {isExpanded && (
//                         <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${T.divider}`, display: "flex", gap: 8, flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
//                           {n.type === "payment_request" && (
//                             <a href={n.action_url || "/dashboard"} className="act-link act-pay">💳 {t.payNow}</a>
//                           )}
//                           {(n.type === "status_changed" || n.type === "message" || n.type === "document_viewed") && n.request_id && (
//                             <a href={n.action_url || "/dashboard"} className="act-link act-p">{t.viewReq} →</a>
//                           )}
//                           {n.type === "scheme" && n.action_url && (
//                             <a href={n.action_url} className="act-link act-p">{t.viewPost} →</a>
//                           )}
//                           {n.type === "urgent_alert" && n.action_url && (
//                             <a href={n.action_url} className="act-link act-p" style={{ background: "#dc2626" }}>🚨 {t.viewPost} →</a>
//                           )}
//                           <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))} className="act-link act-g" style={{ marginLeft: "auto" }}>
//                             🗑 Clear
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           })
//         )}

//         {/* Clear all */}
//         {notifs.length > 0 && (
//           <div style={{ textAlign: "center", marginTop: 24 }}>
//             <button onClick={clearAll} className="btn btn-d" style={{ fontSize: 12 }}>
//               🗑 {t.clearAll}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           ADMIN DISPATCH PANEL
//       ════════════════════════════════════════════════════════ */}
//       {isAdmin && showAdminDispatch && (
//         <>
//           <div className="side-backdrop" onClick={() => setShowAdminDispatch(false)} />
//           <div className="side-panel">
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//               <div>
//                 <div className="mono" style={{ fontSize: 10, color: T.accent, fontWeight: 900, letterSpacing: "0.08em" }}>⚡ TERMINAL</div>
//                 <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginTop: 4 }}>{t.dispatchTitle}</div>
//               </div>
//               <button onClick={() => setShowAdminDispatch(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 20 }}><Ico.X /></button>
//             </div>

//             <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 16, padding: "10px 14px", background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 8 }}>
//               This will broadcast to ALL registered users instantly.
//             </div>

//             <label className="mono" style={{ fontSize: 10, color: T.textMuted, marginBottom: 4, display: "block", fontWeight: 700, letterSpacing: "0.06em" }}>DISPATCH TYPE</label>
//             <select className="admin-inp" value={bType} onChange={e => setBType(e.target.value)}>
//               <option value="scheme">🏛️ Scheme Announcement</option>
//               <option value="urgent_alert">🚨 Urgent Alert</option>
//               <option value="message">💬 General Message</option>
//             </select>

//             <label className="mono" style={{ fontSize: 10, color: T.textMuted, marginBottom: 4, display: "block", fontWeight: 700, letterSpacing: "0.06em" }}>PRIORITY</label>
//             <select className="admin-inp" value={bPriority} onChange={e => setBPriority(e.target.value)}>
//               <option value="normal">NORMAL</option>
//               <option value="high">HIGH</option>
//               <option value="urgent">URGENT</option>
//             </select>

//             <label className="mono" style={{ fontSize: 10, color: T.textMuted, marginBottom: 4, display: "block", marginTop: 10, fontWeight: 700, letterSpacing: "0.06em" }}>TITLE (ENGLISH)</label>
//             <input className="admin-inp" placeholder="Title in English" value={bTitleEn} onChange={e => setBTitleEn(e.target.value)} />

//             <label className="mono" style={{ fontSize: 10, color: T.textMuted, marginBottom: 4, display: "block", fontWeight: 700, letterSpacing: "0.06em" }}>TITLE (HINDI)</label>
//             <input className="admin-inp" placeholder="Title in Hindi" value={bTitleHi} onChange={e => setBTitleHi(e.target.value)} />

//             <label className="mono" style={{ fontSize: 10, color: T.textMuted, marginBottom: 4, display: "block", marginTop: 10, fontWeight: 700, letterSpacing: "0.06em" }}>BODY (ENGLISH)</label>
//             <textarea className="admin-inp" rows={3} placeholder="Body in English" value={bBodyEn} onChange={e => setBBodyEn(e.target.value)} style={{ resize: "vertical", lineHeight: 1.6 }} />

//             <label className="mono" style={{ fontSize: 10, color: T.textMuted, marginBottom: 4, display: "block", fontWeight: 700, letterSpacing: "0.06em" }}>BODY (HINDI)</label>
//             <textarea className="admin-inp" rows={3} placeholder="Body in Hindi" value={bBodyHi} onChange={e => setBBodyHi(e.target.value)} style={{ resize: "vertical", lineHeight: 1.6 }} />

//             <button onClick={handleBroadcast} disabled={isBroadcasting || !bTitleEn || !bBodyEn} className="btn btn-p" style={{ width: "100%", justifyContent: "center", marginTop: 8, padding: "12px" }}>
//               {isBroadcasting ? "TRANSMITTING..." : `📡 ${t.sendBlast}`}
//             </button>
//           </div>
//         </>
//       )}

//       {/* ════════════════════════════════════════════════════════
//           SETTINGS PANEL
//       ════════════════════════════════════════════════════════ */}
//       {showSettings && (
//         <>
//           <div className="side-backdrop" onClick={() => setShowSettings(false)} />
//           <div className="side-panel">
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//               <div>
//                 <div className="mono" style={{ fontSize: 10, color: T.textMuted, fontWeight: 900, letterSpacing: "0.08em" }}>SETTINGS</div>
//                 <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginTop: 4 }}>Preferences</div>
//               </div>
//               <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 20 }}><Ico.X /></button>
//             </div>
//             <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>
//               Notification channels and preferences can be configured in your main Profile settings.
//               <br /><br />
//               <a href="/dashboard/profile" className="act-link act-p" style={{ display: "inline-flex" }}>Go to Profile →</a>
//             </div>
//           </div>
//         </>
//       )}

//       <style>{`@keyframes slideInR{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}`}</style>
//     </div>
//   );
// }















"use client";

// src/app/notifications/page.tsx — Notification Centre (rewritten)
// ─────────────────────────────────────────────────────────────────────────────
// KEPT (all logic exactly as supplied):
//   • Types Lang / NotifType / Priority / Group / AppNotification.
//   • TYPE_CFG for all 8 notification types (labelEn/labelHi and per-type
//     colours kept verbatim; the colours now live only on the small type
//     badge, the unread left border and the icon chip — they are status
//     colours, not decoration). Emoji type icons replaced by lucide icons.
//   • PRIORITY_CFG verbatim (see FLAG 1 below), GROUP_LABELS, LANG hi/en
//     strings byte-for-byte.
//   • fetchNotificationsAction + group assignment (today vs older),
//     Supabase realtime channel "realtime_notifs" (INSERT on notifications
//     filtered by user_id), markRead (optimistic + supabase update),
//     markAllRead, clearAll (local-only, see FLAG 3), handleBroadcast
//     (broadcastNotificationAction, alert on success/failure, form reset),
//     isAdmin check (main_admin / co_admin), filter logic (all / unread /
//     type), unreadCount, expanding card state, per-type action links
//     (payment_request → Pay, status_changed / message / document_viewed →
//     View Request, scheme / urgent_alert → action_url), settings panel
//     (links to /dashboard/profile), admin dispatch side panel with all
//     form fields (type, priority, title EN/HI, body EN/HI).
//   • Avatar and SecHdr helpers (restyled plain). Both are defined but
//     NOT used anywhere in the render — see FLAG 4.
//   • Default light theme (useState(false)), localStorage key "csc_theme"
//     with prefers-color-scheme fallback; theme now syncs the "dark" class
//     on document.documentElement (Tailwind dark: classes).
// REMOVED:
//   • The whole THEMES object and ThemeTokens type, buildCss() (Google Fonts
//     @import + global * margin/padding reset), every <style> block and
//     inline style object, all gradients, the urgent-card pulse animation,
//     the auto-slide/fade keyframes, and every emoji used as an icon
//     (nav icons, ⚙️ settings, 📭 empty state, 🗑 clear, 📡 broadcast,
//     💳 pay, 🚨 urgent, ⚡ terminal) — all replaced by lucide-react icons.
//   • Absolute NAV_LINKS (production https://srilalsahaj.co.in/... vs
//     http://localhost:3000/...) → relative routes only.
// FIXED / FLAGGED (not changed — see report):
//   1. PRIORITY_CFG low dot is "#7090708" (7 hex digits) — looks like a
//      typo; kept verbatim, the dot simply renders uncoloured.
//   2. Group "yesterday" is never assigned — fetch maps everything not
//      from today to "older", so the Yesterday group never appears.
//   3. clearAll only clears local state; it deletes nothing server-side.
//   4. SecHdr and Avatar are defined but never rendered (as supplied).
// NO NEW FILE NEEDED. Drop-in replacement for src/app/notifications/page.tsx.

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  fetchNotificationsAction,
  markNotificationsReadAction,
  broadcastNotificationAction,
} from "@/app/actions/notifications";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  CreditCard,
  Eye,
  Image as ImageIcon,
  Inbox,
  Landmark,
  LayoutDashboard,
  MessageSquare,
  Moon,
  Package,
  PenLine,
  Plus,
  Radio,
  RefreshCw,
  Settings,
  Sun,
  Trash2,
  User,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ════════════════════════════════════════════════════════════════════════════
// TYPES (Preserved Exactly)
// ════════════════════════════════════════════════════════════════════════════
type Lang = "hi" | "en";
type NotifType =
  | "document_viewed"
  | "status_changed"
  | "payment_request"
  | "payment_done"
  | "message"
  | "scheme"
  | "urgent_alert"
  | "admin_action";
type Priority = "urgent" | "high" | "normal" | "low";
type Group = "today" | "yesterday" | "older";

interface AppNotification {
  id: string;
  type: NotifType;
  priority: Priority;
  title: string;
  title_hi: string;
  body: string;
  body_hi: string;
  created_at: string;
  group?: Group;
  is_read: boolean;
  request_id: string | null;
  actor_id: string | null;
  action_url: string | null;
  meta?: Record<string, string>;
}

// ════════════════════════════════════════════════════════════════════════════
// CONFIG (Preserved Exactly — only the emoji icons became lucide icons)
// ════════════════════════════════════════════════════════════════════════════
interface TypeConfig {
  icon: LucideIcon;
  color: string;
  bgDark: string;
  bgLight: string;
  borderDark: string;
  borderLight: string;
  labelEn: string;
  labelHi: string;
}

const TYPE_CFG: Record<string, TypeConfig> = {
  document_viewed: { icon: Eye, color: "#00b8d4", bgDark: "#040e14", bgLight: "#e0f8fc", borderDark: "#0a3a44", borderLight: "#90d8e8", labelEn: "Document Viewed", labelHi: "दस्तावेज़ देखा" },
  status_changed: { icon: RefreshCw, color: "#e0a020", bgDark: "#140e00", bgLight: "#fef8e0", borderDark: "#443000", borderLight: "#e8cc80", labelEn: "Status Update", labelHi: "स्थिति अपडेट" },
  payment_request: { icon: CreditCard, color: "#c45c1a", bgDark: "#140800", bgLight: "#fff5ee", borderDark: "#442000", borderLight: "#f0c090", labelEn: "Payment Request", labelHi: "भुगतान अनुरोध" },
  payment_done: { icon: CheckCircle2, color: "#1a7a3a", bgDark: "#041408", bgLight: "#e8f8ee", borderDark: "#0a3a18", borderLight: "#90d0a0", labelEn: "Payment Received", labelHi: "भुगतान प्राप्त" },
  message: { icon: MessageSquare, color: "#6a6a8a", bgDark: "#0e0e14", bgLight: "#f0f0f8", borderDark: "#22223a", borderLight: "#b0b0d0", labelEn: "New Message", labelHi: "नया संदेश" },
  scheme: { icon: Landmark, color: "#1a5aa0", bgDark: "#040a14", bgLight: "#e8f0fb", borderDark: "#0a2040", borderLight: "#90b8e8", labelEn: "New Scheme", labelHi: "नई योजना" },
  urgent_alert: { icon: AlertTriangle, color: "#c03010", bgDark: "#140404", bgLight: "#fef0ee", borderDark: "#441010", borderLight: "#f0a090", labelEn: "Urgent Alert", labelHi: "अत्यावश्यक" },
  admin_action: { icon: Wrench, color: "#8a50d0", bgDark: "#0e0814", bgLight: "#f4f0fb", borderDark: "#2e1844", borderLight: "#c0a0e8", labelEn: "Admin Action", labelHi: "एडमिन कार्रवाई" },
};

const PRIORITY_CFG: Record<string, { label: string; labelHi: string; color: string; dot: string }> = {
  // FLAG: low dot "#7090708" has 7 hex digits — kept verbatim as supplied.
  urgent: { label: "URGENT", labelHi: "अत्यावश्यक", color: "#c03010", dot: "#ff4020" },
  high: { label: "HIGH", labelHi: "उच्च", color: "#c45c1a", dot: "#e07030" },
  normal: { label: "NORMAL", labelHi: "सामान्य", color: "#6a6a8a", dot: "#9090b0" },
  low: { label: "LOW", labelHi: "कम", color: "#4a6a4a", dot: "#7090708" },
};

const GROUP_LABELS: Record<Group, Record<Lang, string>> = {
  today: { hi: "आज", en: "Today" },
  yesterday: { hi: "कल", en: "Yesterday" },
  older: { hi: "पुराने", en: "Earlier" },
};

// ════════════════════════════════════════════════════════════════════════════
// LANGUAGE STRINGS (byte-for-byte as supplied)
// ════════════════════════════════════════════════════════════════════════════
const LANG: Record<Lang, Record<string, string>> = {
  hi: {
    title: "सूचना केंद्र", subtitle: "सभी सूचनाएं एक जगह", all: "सभी", unread: "अपठित",
    markAll: "सभी पढ़े हुए चिह्नित करें", clearAll: "सभी साफ करें", noNotifs: "कोई सूचना नहीं",
    noNotifsSub: "आपकी सभी सूचनाएं यहाँ दिखेंगी।", viewReq: "आवेदन देखें", payNow: "अभी भुगतान करें",
    viewPost: "देखें", filter: "फ़िल्टर", settings: "सेटिंग्स",
    adminDispatch: "प्रसारण भेजें", dispatchTitle: "नया प्रसारण", sendBlast: "सभी को भेजें",
  },
  en: {
    title: "Notification Center", subtitle: "All your alerts in one place", all: "All", unread: "Unread",
    markAll: "Mark all as read", clearAll: "Clear all", noNotifs: "No notifications",
    noNotifsSub: "Your notifications will appear here.", viewReq: "View Request", payNow: "Pay Now",
    viewPost: "View Post", filter: "Filter", settings: "Settings",
    adminDispatch: "Dispatch Broadcast", dispatchTitle: "New Broadcast", sendBlast: "Blast to All",
  },
};

// ════════════════════════════════════════════════════════════════════════════
// NAV LINKS (relative routes only — was absolute production/localhost URLs)
// ════════════════════════════════════════════════════════════════════════════
const NAV_LINKS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts", icon: PenLine, label: "Posts" },
  { href: "/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/status", icon: BarChart3, label: "Status" },
  { href: "/delivery", icon: Package, label: "Delivery" },
];

// ════════════════════════════════════════════════════════════════════════════
// AVATAR (restyled plain — solid blue, no gradient)
// NOTE: defined but never rendered anywhere in this page (as supplied).
// ════════════════════════════════════════════════════════════════════════════
function Avatar({ name, size = 40, isDark }: { name?: string | null; size?: number; isDark: boolean }) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${isDark ? "bg-blue-500" : "bg-blue-700"}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {ch}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION HEADER (restyled plain — lucide icon + uppercase label, no gradient)
// NOTE: defined but never rendered anywhere in this page (as supplied).
// ════════════════════════════════════════════════════════════════════════════
function SecHdr({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
      <span className="text-sm text-blue-700 dark:text-blue-400">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">{label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function NotificationCenter() {
  // DEFAULT = LIGHT theme
  const [isDark, setIsDark] = useState(false);

  const { user, isLoggedIn } = useAuth();
  const [lang, setLang] = useState<Lang>("hi");
  const t = LANG[lang];

  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | NotifType>("all");
  const [showSettings, setShowSettings] = useState(false);
  const [showAdminDispatch, setShowAdminDispatch] = useState(false);
  const [expanding, setExpanding] = useState<string | null>(null);

  // Admin Broadcast Form State (Preserved Exactly)
  const [bType, setBType] = useState("scheme");
  const [bPriority, setBPriority] = useState("normal");
  const [bTitleEn, setBTitleEn] = useState("");
  const [bTitleHi, setBTitleHi] = useState("");
  const [bBodyEn, setBBodyEn] = useState("");
  const [bBodyHi, setBBodyHi] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Initialize DB & Real-time (Preserved Exactly)
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    setLang((user.preferred_lang as Lang) || "hi");

    fetchNotificationsAction().then((data) => {
      const processed = (data as any[]).map((n) => ({
        ...n,
        group: new Date(n.created_at).toDateString() === new Date().toDateString() ? "today" : "older",
      }));
      setNotifs(processed);
    });

    const channel = supabase
      .channel("realtime_notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        const newNotif = { ...payload.new, group: "today" } as AppNotification;
        setNotifs((prev) => [newNotif, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, user]);

  // Theme Sync (Preserved Exactly) + dark-class sync for Tailwind dark: variants
  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const markRead = useCallback(async (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await markNotificationsReadAction();
  }, []);

  const clearAll = useCallback(() => {
    setNotifs([]);
  }, []);

  const handleBroadcast = async () => {
    if (!bTitleEn || !bBodyEn) return;
    setIsBroadcasting(true);
    const res = await broadcastNotificationAction({
      type: bType,
      priority: bPriority,
      title: bTitleEn,
      title_hi: bTitleHi || bTitleEn,
      body: bBodyEn,
      body_hi: bBodyHi || bBodyEn,
    });
    setIsBroadcasting(false);
    if (res.success) {
      alert(`Successfully dispatched to ${res.count} users!`);
      setShowAdminDispatch(false);
      setBTitleEn("");
      setBTitleHi("");
      setBBodyEn("");
      setBBodyHi("");
    } else {
      alert("Broadcast failed: " + res.error);
    }
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const filteredNotifs = notifs.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter !== "all") return n.type === filter;
    return true;
  });

  const unreadCount = notifs.filter((n) => !n.is_read).length;
  const isAdmin = user?.role === "main_admin" || user?.role === "co_admin";

  const groups: Group[] = ["today", "yesterday", "older"];
  const grouped = groups.reduce((acc, g) => {
    const items = filteredNotifs.filter((n) => n.group === g);
    if (items.length) acc[g] = items;
    return acc;
  }, {} as Record<Group, AppNotification[]>);

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#0b1220] dark:text-slate-200">
      {/* ════════════════════════════════════════════════════════
          HEADER — navy in both themes
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 shrink-0 border-b-2 border-blue-700 bg-[#0b2239] shadow-md">
        <div className="flex h-14 items-center gap-3.5 border-b border-white/10 px-5">
          <a href="/dashboard" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white">
              <Landmark size={17} />
            </div>
            <div>
              <div className="text-[17px] font-bold leading-none tracking-tight text-white">
                Srilal<span className="text-blue-300">CSC</span>
              </div>
              <div className="mt-0.5 font-mono text-[9px] tracking-[0.1em] text-white/40">NOTIFICATIONS</div>
            </div>
          </a>

          <div className="h-[26px] w-px shrink-0 bg-white/10" />

          {/* Nav links */}
          <nav className="hidden flex-1 gap-1 overflow-x-auto md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  l.href === "/notifications"
                    ? "bg-blue-700 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <l.icon size={13} /> {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
            {unreadCount > 0 && (
              <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                {unreadCount}
              </div>
            )}

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="hidden items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/70 transition-colors hover:border-blue-400 hover:text-blue-300 sm:inline-flex"
              >
                <Check size={12} /> {t.markAll}
              </button>
            )}

            <button
              onClick={() => setLang((l) => (l === "hi" ? "en" : "hi"))}
              className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs font-bold text-white/90 transition-colors hover:bg-white/20"
            >
              {lang === "hi" ? "EN" : "हि"}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-blue-400/40 bg-white/10 px-2 py-0.5 text-xs font-bold text-white/70 transition-colors hover:border-blue-400 hover:text-white"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />} {isDark ? "Light" : "Dark"}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-1.5 text-white/70 transition-colors hover:border-blue-400 hover:text-blue-300"
              aria-label="Settings"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <div className="mx-auto w-full max-w-[800px] flex-1 px-4 pb-16 pt-5">
        {/* Page Title */}
        <div className="mb-5">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.title}</div>
          <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">{t.subtitle}</div>
        </div>

        {/* Admin Dispatch Button */}
        {isAdmin && (
          <div className="mb-4">
            <button
              onClick={() => setShowAdminDispatch(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-blue-800"
            >
              <Plus size={13} /> {t.adminDispatch}
            </button>
          </div>
        )}

        {/* Filter Chips */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-2">
          <button
            className={`shrink-0 rounded-full border px-2 !py-0 !text-[11px] font-bold uppercase tracking-wide transition-colors ${
              filter === "all"
                ? "border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-400"
                : "border-slate-200 bg-white text-slate-500 hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
            }`}
            onClick={() => setFilter("all")}
          >
            {t.all}
          </button>
          <button
            className={`shrink-0 rounded-full border px-2 !py-0 !text-[11px] font-bold uppercase tracking-wide transition-colors ${
              filter === "unread"
                ? "border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-400"
                : "border-slate-200 bg-white text-slate-500 hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
            }`}
            onClick={() => setFilter("unread")}
          >
            {t.unread} {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <div className="w-px shrink-0 self-center bg-slate-200 dark:bg-slate-700" style={{ height: 28 }} />
          {(["document_viewed", "payment_request", "status_changed", "scheme", "urgent_alert"] as NotifType[]).map((type) => {
            const cfg = TYPE_CFG[type] || TYPE_CFG.message;
            const TypeIcon = cfg.icon;
            const isOn = filter === type;
            return (
              <button
                key={type}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2 !py-0 !text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  isOn
                    ? ""
                    : "border-slate-200 bg-white text-slate-500 hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
                }`}
                style={isOn ? { borderColor: cfg.color, color: cfg.color, backgroundColor: `${cfg.color}18` } : undefined}
                onClick={() => setFilter((f) => (f === type ? "all" : type))}
              >
                <TypeIcon size={13} /> {lang === "hi" ? cfg.labelHi : cfg.labelEn}
              </button>
            );
          })}
        </div>

        {/* Notification Groups */}
        {filteredNotifs.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Inbox size={52} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
            <div className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
              {t.noNotifs.toUpperCase()}
            </div>
            <div className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400">{t.noNotifsSub}</div>
          </div>
        ) : (
          groups.map((group) => {
            const items = grouped[group];
            if (!items?.length) return null;
            return (
              <div key={group}>
                <div className="my-5 flex items-center gap-3 px-1">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span className="whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                    {GROUP_LABELS[group][lang]}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                {items.map((n) => {
                  const cfg = TYPE_CFG[n.type] || TYPE_CFG.message;
                  const pcfg = PRIORITY_CFG[n.priority] || PRIORITY_CFG.normal;
                  const isExpanded = expanding === n.id;
                  const TypeIcon = cfg.icon;

                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        markRead(n.id);
                        setExpanding(isExpanded ? null : n.id);
                      }}
                      className={`mb-2.5 cursor-pointer rounded-xl border bg-white p-4 transition-all hover:-translate-y-px hover:border-blue-300 hover:shadow-sm dark:bg-[#111a2e] dark:hover:border-blue-500/50 ${
                        !n.is_read ? "border-l-4" : "border-slate-200 dark:border-[#1e293b]"
                      }`}
                      style={
                        !n.is_read
                          ? {
                              borderLeftColor: cfg.color,
                              backgroundColor: isDark ? cfg.bgDark : cfg.bgLight,
                              borderColor: isDark ? cfg.borderDark : cfg.borderLight,
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2"
                          style={{
                            color: cfg.color,
                            borderColor: isDark ? cfg.borderDark : cfg.borderLight,
                            backgroundColor: isDark ? cfg.bgDark : cfg.bgLight,
                          }}
                        >
                          <TypeIcon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: cfg.color }}>
                              {lang === "hi" ? cfg.labelHi : cfg.labelEn}
                            </span>
                            {n.priority !== "normal" && (
                              <span
                                className="inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                                style={{ backgroundColor: `${pcfg.color}18`, color: pcfg.color, borderColor: `${pcfg.color}40` }}
                              >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pcfg.dot }} />
                                {lang === "hi" ? pcfg.labelHi : pcfg.label}
                              </span>
                            )}
                            {n.request_id && (
                              <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500">
                                {n.request_id.split("-")[0].toUpperCase()}
                              </span>
                            )}
                            <span className="ml-auto shrink-0 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {!n.is_read && (
                              <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cfg.color }} />
                            )}
                          </div>
                          <div
                            className={`text-sm leading-snug text-slate-900 dark:text-slate-100 ${
                              !n.is_read ? "font-bold" : "font-semibold"
                            }`}
                          >
                            {lang === "hi" ? n.title_hi || n.title : n.title}
                          </div>
                          <div
                            className={`mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 ${
                              isExpanded ? "" : "line-clamp-2"
                            }`}
                          >
                            {lang === "hi" ? n.body_hi || n.body : n.body}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          className="mt-3.5 flex flex-wrap gap-2 border-t border-dashed border-slate-200 pt-3 dark:border-slate-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {n.type === "payment_request" && (
                            <a
                              href={n.action_url || "/dashboard"}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                            >
                              <CreditCard size={14} /> {t.payNow}
                            </a>
                          )}
                          {(n.type === "status_changed" || n.type === "message" || n.type === "document_viewed") &&
                            n.request_id && (
                              <a
                                href={n.action_url || "/dashboard"}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-800"
                              >
                                {t.viewReq} <ArrowRight size={13} />
                              </a>
                            )}
                          {n.type === "scheme" && n.action_url && (
                            <a
                              href={n.action_url}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-800"
                            >
                              {t.viewPost} <ArrowRight size={13} />
                            </a>
                          )}
                          {n.type === "urgent_alert" && n.action_url && (
                            <a
                              href={n.action_url}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700"
                            >
                              <AlertTriangle size={13} /> {t.viewPost} <ArrowRight size={13} />
                            </a>
                          )}
                          <button
                            onClick={() => setNotifs((prev) => prev.filter((x) => x.id !== n.id))}
                            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-transparent px-3.5 py-2 text-xs font-bold text-slate-500 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                          >
                            <Trash2 size={13} /> Clear
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}

        {/* Clear all */}
        {notifs.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <Trash2 size={13} /> {t.clearAll}
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          ADMIN DISPATCH PANEL
      ════════════════════════════════════════════════════════ */}
      {isAdmin && showAdminDispatch && (
        <>
          <div className="fixed inset-0 z-[1000] bg-black/50" onClick={() => setShowAdminDispatch(false)} />
          <div className="fixed bottom-0 right-0 top-0 z-[1001] flex w-full max-w-[380px] flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#111a2e]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-400">
                  <Zap size={11} /> Terminal
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{t.dispatchTitle}</div>
              </div>
              <button
                onClick={() => setShowAdminDispatch(false)}
                className="cursor-pointer border-none bg-transparent text-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs leading-relaxed text-blue-800 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300">
              This will broadcast to ALL registered users instantly.
            </div>

            <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dispatch Type
            </label>
            <select
              value={bType}
              onChange={(e) => setBType(e.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
            >
              <option value="scheme">Scheme Announcement</option>
              <option value="urgent_alert">Urgent Alert</option>
              <option value="message">General Message</option>
            </select>

            <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Priority
            </label>
            <select
              value={bPriority}
              onChange={(e) => setBPriority(e.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
            >
              <option value="normal">NORMAL</option>
              <option value="high">HIGH</option>
              <option value="urgent">URGENT</option>
            </select>

            <label className="mb-1 mt-2.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Title (English)
            </label>
            <input
              placeholder="Title in English"
              value={bTitleEn}
              onChange={(e) => setBTitleEn(e.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Title (Hindi)
            </label>
            <input
              placeholder="Title in Hindi"
              value={bTitleHi}
              onChange={(e) => setBTitleHi(e.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <label className="mb-1 mt-2.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Body (English)
            </label>
            <textarea
              rows={3}
              placeholder="Body in English"
              value={bBodyEn}
              onChange={(e) => setBBodyEn(e.target.value)}
              className="mb-3 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Body (Hindi)
            </label>
            <textarea
              rows={3}
              placeholder="Body in Hindi"
              value={bBodyHi}
              onChange={(e) => setBBodyHi(e.target.value)}
              className="mb-3 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <button
              onClick={handleBroadcast}
              disabled={isBroadcasting || !bTitleEn || !bBodyEn}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-3 text-[13px] font-bold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isBroadcasting ? (
                "TRANSMITTING..."
              ) : (
                <>
                  <Radio size={14} /> {t.sendBlast}
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════
          SETTINGS PANEL
      ════════════════════════════════════════════════════════ */}
      {showSettings && (
        <>
          <div className="fixed inset-0 z-[1000] bg-black/50" onClick={() => setShowSettings(false)} />
          <div className="fixed bottom-0 right-0 top-0 z-[1001] flex w-full max-w-[380px] flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#111a2e]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Settings</div>
                <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">Preferences</div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="cursor-pointer border-none bg-transparent text-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
              Notification channels and preferences can be configured in your main Profile settings.
              <br />
              <br />
              <a
                href="/dashboard/profile"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-[13px] font-bold text-white no-underline transition-colors hover:bg-blue-800"
              >
                Go to Profile <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

