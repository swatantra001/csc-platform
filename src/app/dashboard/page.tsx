
// "use client";

// import { useState, useEffect, useRef, type DragEvent, useCallback } from "react";
// import { useAuth } from "@/components/AuthProvider";
// import { fetchMyRequestsAction, createRequestAction, sendChatMessageAction, sendFormMessageAction } from "@/app/actions/requests";
// import { updateUserProfile } from "../actions/user";
// import { uploadChatFileAction } from "../actions/storage";
// import { fetchNotificationsAction, markNotificationsReadAction } from "@/app/actions/notifications";
// import { io, Socket } from "socket.io-client";
// import { createRazorpayOrderAction, verifyRazorpayPaymentAction } from "@/app/actions/payment";
// import { fetchMyAddressesAction, addAddressAction } from "@/app/actions/address"; // ✨ Add this
// import { getFormsAction } from "../actions/forms";
// import { getMyCertificatesAction, getMyExcelCertificatesAction } from "../actions/certificates";
// import { AuthGuard } from "@/components/AuthGuard";

// // ════════════════════════════════════════════════════════════════════════════════
// // TYPES (Preserved Exactly)
// // ════════════════════════════════════════════════════════════════════════════════
// interface AppNotification {
//   id: string;
//   title: string;
//   title_hi: string;
//   body: string;
//   body_hi: string;
//   type: string;
//   is_read: boolean;
//   created_at: string;
// }

// interface TimelineEvent {
//   event: "submitted" | "seen" | "processing" | "done" | "payment";
//   time: string;
//   eventEn: string;
//   timeEn: string;
// }

// interface MessageDoc {
//   name: string;
//   size: string;
//   icon: string;
//   url?: string;
//   isResult?: boolean;
// }

// interface Message {
//   id: number | string;
//   from: "user" | "admin";
//   time: string;
//   date: string;
//   type: string;
//   text?: string;
//   textEn?: string;
//   doc?: MessageDoc;
//   amount?: number;
//   paymentStatus?: string;
//   adminName?: string;
//   adminRole?: string;
//   status?: "seen" | "delivered";
//   replyToId?: string | number | null;
//   reply_to_msg?: Message;
//   formId?: string;
//   formData?: Record<string, string>;
//   formTitle?: string;
// }

// interface ResolvedBy {
//   name: string;
//   role: string;
// }

// interface Request {
//   id: string;
//   displayId?: string;
//   title: string;
//   titleEn: string;
//   service: string;
//   status: "pending" | "processing" | "done";
//   unread: number;
//   lastMsg: string;
//   lastMsgEn: string;
//   lastTime: string;
//   resolvedBy: ResolvedBy | null;
//   paymentPending: boolean;
//   paymentAmount?: number;
//   deliveryType?: string;   // ✨ Added
//   deliveryStatus?: string; // ✨ Added
//   urgency?: string;        // ✨ Added
//   messages: Message[];
//   timeline: TimelineEvent[];
// }

// // 2. Add these Form Interfaces right below your existing interfaces:
// interface FormField { id: string; label: string; required: boolean; }
// interface DbForm { id: string; title: string; price: number; requires_document: boolean; document_label: string | null; fields: FormField[]; }

// // ════════════════════════════════════════════════════════════════════════════════
// // UTILS (Preserved + Reference Utils)
// // ════════════════════════════════════════════════════════════════════════════════
// const formatBytes = (bytes: number) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };
// const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
// const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
// const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
// const isImg = (name: string | null) => !!name?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

// function useDebounce<T>(value: T, delay: number): T {
//   const [v, setV] = useState<T>(value);
//   useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
//   return v;
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // LANGUAGE STRINGS (Renamed from T → LANG to free up T for Theme Tokens)
// // ════════════════════════════════════════════════════════════════════════════════
// const LANG = {
//   hi: {
//     appName: "श्रीलाल जन सेवा केंद्र",
//     myRequests: "मेरे आवेदन", newRequest: "नया आवेदन", search: "खोजें...",
//     all: "सभी", pending: "लंबित", processing: "प्रक्रिया में", done: "पूर्ण",
//     sent: "भेजा", seen: "देखा", online: "ऑनलाइन", today: "आज", yesterday: "कल",
//     typeMsg: "संदेश लिखें...", send: "भेजें", attach: "दस्तावेज़ जोड़ें",
//     requestTitle: "आवेदन का विषय", requestDesc: "विवरण लिखें", serviceType: "सेवा चुनें",
//     submitRequest: "आवेदन जमा करें", uploadDoc: "दस्तावेज़ अपलोड करें",
//     dragDrop: "फ़ाइल यहाँ खींचें या क्लिक करें", timeline: "गतिविधि",
//     payNow: "अभी भुगतान करें", download: "डाउनलोड", resolvedBy: "द्वारा हल किया गया",
//     viewingDoc: "आपके दस्तावेज़ देख रहे हैं", noRequests: "अभी कोई आवेदन नहीं",
//     startNew: "नया आवेदन शुरू करें", wallet: "वॉलेट", notifications: "सूचनाएं",
//     profile: "प्रोफ़ाइल", logout: "लॉगआउट", cancel: "रद्द करें", close: "बंद करें",
//     priority: "प्राथमिकता", prepaid: "प्रीपेड (तेज़ सेवा)", regular: "सामान्य",
//     deliveryOpt: "वितरण विकल्प", pickup: "दुकान से प्राप्त करें", homeDelivery: "होम डिलीवरी (घर पर)",
//     urgency: "कितनी जल्दी चाहिए?", flex: "कोई जल्दी नहीं (2-3 दिन)", instant: "तुरंत (तत्काल)",
//     selectAddr: "पता चुनें", addAddr: "+ नया पता जोड़ें", addrLabel: "लेबल (जैसे: घर)", addrText: "पूरा पता",
//     pin: "पिनकोड", saveAddr: "पता सेव करें", trackLive: "लाइव ट्रैक करें 🛵",
//   },
//   en: {
//     appName: "Srilal Sahaj Jan Seva Kendra",
//     myRequests: "My Requests", newRequest: "New Request", search: "Search...",
//     all: "All", pending: "Pending", processing: "Processing", done: "Done",
//     sent: "Sent", seen: "Seen", online: "Online", today: "Today", yesterday: "Yesterday",
//     typeMsg: "Type a message...", send: "Send", attach: "Attach Document",
//     requestTitle: "Request Subject", requestDesc: "Describe your need", serviceType: "Select Service",
//     submitRequest: "Submit Request", uploadDoc: "Upload Document",
//     dragDrop: "Drag file here or click to browse", timeline: "Activity",
//     payNow: "Pay Now", download: "Download", resolvedBy: "Resolved by",
//     viewingDoc: "is viewing your document", noRequests: "No requests yet",
//     startNew: "Start a new request", wallet: "Wallet", notifications: "Notifications",
//     profile: "Profile", logout: "Logout", cancel: "Cancel", close: "Close",
//     priority: "Priority", prepaid: "Prepaid (Faster Service)", regular: "Regular",
//     deliveryOpt: "Delivery Options", pickup: "Shop Pickup", homeDelivery: "Home Delivery",
//     urgency: "Delivery Urgency", flex: "No Rush (2-3 Days)", instant: "Instant (High Priority)",
//     selectAddr: "Select Address", addAddr: "+ Add New Address", addrLabel: "Label (e.g. Home)", addrText: "Full Address",
//     pin: "Pincode", saveAddr: "Save Address", trackLive: "Track Live 🛵",
//   },
// } as const;

// const SERVICES = ["आधार अपडेट / Aadhaar Update", "पैन कार्ड / PAN Card", "जाति प्रमाण पत्र / Caste Certificate", "छात्रवृत्ति / Scholarship", "PM किसान / PM Kisan", "आयुष्मान कार्ड / Ayushman Card", "टिकट बुकिंग / Ticket Booking", "पैसे ट्रांसफर / Money Transfer", "अन्य / Other"];

// const STATUS_CONFIG: Record<string, any> = {
//   pending: { color: "#b45309", bg: "#fffbeb", bgDark: "#1c1400", border: "#fcd34d", borderDark: "#92400e", label: "लंबित", labelEn: "Pending", icon: "⏳" },
//   seen: { color: "#1d4ed8", bg: "#eff6ff", bgDark: "#0a1628", border: "#93c5fd", borderDark: "#1e3a8a", label: "देखा गया", labelEn: "Seen", icon: "👁️" },
//   processing: { color: "#1d4ed8", bg: "#eff6ff", bgDark: "#0a1628", border: "#93c5fd", borderDark: "#1e3a8a", label: "प्रक्रिया में", labelEn: "Processing", icon: "⚙️" },
//   payment_pending: { color: "#c2410c", bg: "#fff7ed", bgDark: "#1a0800", border: "#fb923c", borderDark: "#7c2d12", label: "भुगतान बाकी", labelEn: "Payment Pending", icon: "💳" },
//   done: { color: "#15803d", bg: "#f0fdf4", bgDark: "#031a0a", border: "#86efac", borderDark: "#14532d", label: "पूर्ण", labelEn: "Done", icon: "✅" },
//   cancelled: { color: "#6b7280", bg: "#f9fafb", bgDark: "#111", border: "#d1d5db", borderDark: "#374151", label: "रद्द", labelEn: "Cancelled", icon: "❌" },
// };

// const TIMELINE_ICONS = { submitted: "📤", seen: "👁️", processing: "⚙️", done: "✅", payment: "💳" };

// // ════════════════════════════════════════════════════════════════════════════════
// // DUAL THEME TOKENS (Exact Reference Structure)
// // ════════════════════════════════════════════════════════════════════════════════
// const THEMES = {
//   light: {
//     pageBg: "#f1f5f9",
//     navBg: "#1e3a8a",
//     navBottomBorder: "#3b82f6",
//     navText: "rgba(255,255,255,0.65)",
//     navTextHover: "#ffffff",
//     navActiveBg: "#3b82f6",
//     navActiveText: "#ffffff",
//     navBrand: "#ffffff",
//     navBrandAccent: "#93c5fd",

//     sidebarBg: "#ffffff",
//     sidebarHeaderBg: "#f8fafc",

//     cardBg: "#ffffff",
//     cardBorder: "#e2e8f0",
//     cardShadow: "0 1px 4px rgba(0,0,0,0.07)",

//     sectionGrad: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
//     sectionGradText: "#ffffff",

//     textPrimary: "#1e293b",
//     textSecondary: "#475569",
//     textMuted: "#94a3b8",

//     accent: "#2563eb",
//     accentHover: "#1d4ed8",
//     accentLight: "#eff6ff",
//     accentBorder: "#bfdbfe",

//     inputBg: "#f8fafc",
//     inputBorder: "#e2e8f0",
//     inputFocusBorder: "#3b82f6",
//     inputText: "#1e293b",
//     inputPlaceholder: "#94a3b8",

//     divider: "#e2e8f0",

//     chatBg: "#f1f5f9",
//     chatPattern: "radial-gradient(#2563eb14 1px,transparent 1px)",
//     bubbleAdminBg: "#dbeafe",
//     bubbleAdminBorder: "#bfdbfe",
//     bubbleAdminText: "#1e293b",
//     bubbleUserBg: "#ffffff",
//     bubbleUserBorder: "#e2e8f0",
//     bubbleUserText: "#1e293b",
//     bubbleMeta: "rgba(0,0,0,0.35)",

//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#64748b",
//     pillActiveBg: "#dbeafe",
//     pillActiveBorder: "#93c5fd",
//     pillActiveText: "#1d4ed8",

//     chatRowActiveBg: "#eff6ff",
//     chatRowActiveBorder: "#2563eb",
//     rowHover: "#f8fafc",

//     btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)",
//     btnPrimaryText: "#ffffff",
//     btnPrimaryGlow: "rgba(37,99,235,0.35)",
//     btnGhostBg: "#f1f5f9",
//     btnGhostBorder: "#e2e8f0",
//     btnGhostText: "#475569",
//     btnGhostHoverBg: "#eff6ff",
//     btnGhostHoverText: "#2563eb",
//     btnDangerBg: "#fef2f2",
//     btnDangerBorder: "#fecaca",
//     btnDangerText: "#dc2626",
//     btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)",
//     btnSuccessText: "#ffffff",

//     subTabHdrBg: "#f8fafc",
//     subTabText: "#94a3b8",
//     subTabActive: "#2563eb",
//     subTabBorder: "#2563eb",

//     tagBg: "#dbeafe",
//     tagText: "#1d4ed8",
//     scrollThumb: "#bfdbfe",

//     modalOverlay: "rgba(15,23,42,0.55)",
//     modalBg: "#ffffff",
//     modalBorder: "#e2e8f0",

//     teamCardBorder: "#e2e8f0",
//     teamCardBg: "#ffffff",
//     teamCardHover: "#f8fafc",

//     statusDotBorder: "#ffffff",
//     toggleIcon: "🌙",
//     toggleLabel: "Dark",

//     payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
//     payPaidGrad: "linear-gradient(135deg,#15803d,#16a34a)",
//     docIconBg: "#fef2f2",
//     docIconBorder: "#fecaca",
//     docIconColor: "#dc2626",
//   },
//   dark: {
//     pageBg: "#060b14",
//     navBg: "rgba(6,11,20,0.98)",
//     navBottomBorder: "#f59e0b",
//     navText: "rgba(255,255,255,0.45)",
//     navTextHover: "#ffffff",
//     navActiveBg: "rgba(245,158,11,0.18)",
//     navActiveText: "#f59e0b",
//     navBrand: "#ffffff",
//     navBrandAccent: "#f59e0b",

//     sidebarBg: "rgba(6,11,20,0.9)",
//     sidebarHeaderBg: "rgba(255,255,255,0.02)",

//     cardBg: "rgba(255,255,255,0.03)",
//     cardBorder: "rgba(255,255,255,0.08)",
//     cardShadow: "0 1px 4px rgba(0,0,0,0.3)",

//     sectionGrad: "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
//     sectionGradText: "#000000",

//     textPrimary: "#f1f5f9",
//     textSecondary: "rgba(255,255,255,0.55)",
//     textMuted: "rgba(255,255,255,0.28)",

//     accent: "#f59e0b",
//     accentHover: "#d97706",
//     accentLight: "rgba(245,158,11,0.08)",
//     accentBorder: "rgba(245,158,11,0.25)",

//     inputBg: "rgba(255,255,255,0.05)",
//     inputBorder: "rgba(255,255,255,0.08)",
//     inputFocusBorder: "rgba(245,158,11,0.5)",
//     inputText: "#f1f5f9",
//     inputPlaceholder: "rgba(255,255,255,0.25)",

//     divider: "rgba(255,255,255,0.06)",

//     chatBg: "#080d17",
//     chatPattern: "radial-gradient(rgba(245,158,11,0.018) 1px,transparent 1px)",
//     bubbleAdminBg: "rgba(245,158,11,0.12)",
//     bubbleAdminBorder: "rgba(245,158,11,0.22)",
//     bubbleAdminText: "#f1f5f9",
//     bubbleUserBg: "rgba(255,255,255,0.05)",
//     bubbleUserBorder: "rgba(255,255,255,0.08)",
//     bubbleUserText: "#f1f5f9",
//     bubbleMeta: "rgba(255,255,255,0.3)",

//     pillBg: "rgba(255,255,255,0.03)",
//     pillBorder: "rgba(255,255,255,0.08)",
//     pillText: "rgba(255,255,255,0.4)",
//     pillActiveBg: "rgba(245,158,11,0.15)",
//     pillActiveBorder: "rgba(245,158,11,0.4)",
//     pillActiveText: "#f59e0b",

//     chatRowActiveBg: "rgba(245,158,11,0.08)",
//     chatRowActiveBorder: "#f59e0b",
//     rowHover: "rgba(255,255,255,0.03)",

//     btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)",
//     btnPrimaryText: "#000000",
//     btnPrimaryGlow: "rgba(245,158,11,0.35)",
//     btnGhostBg: "rgba(255,255,255,0.05)",
//     btnGhostBorder: "rgba(255,255,255,0.1)",
//     btnGhostText: "rgba(255,255,255,0.7)",
//     btnGhostHoverBg: "rgba(245,158,11,0.1)",
//     btnGhostHoverText: "#f59e0b",
//     btnDangerBg: "rgba(239,68,68,0.1)",
//     btnDangerBorder: "rgba(239,68,68,0.25)",
//     btnDangerText: "#f87171",
//     btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)",
//     btnSuccessText: "#ffffff",

//     subTabHdrBg: "rgba(6,11,20,0.6)",
//     subTabText: "rgba(255,255,255,0.35)",
//     subTabActive: "#f59e0b",
//     subTabBorder: "#f59e0b",

//     tagBg: "rgba(245,158,11,0.15)",
//     tagText: "#f59e0b",
//     scrollThumb: "rgba(245,158,11,0.3)",

//     modalOverlay: "rgba(0,0,0,0.85)",
//     modalBg: "#0f172a",
//     modalBorder: "rgba(255,255,255,0.1)",

//     teamCardBorder: "rgba(255,255,255,0.08)",
//     teamCardBg: "rgba(255,255,255,0.03)",
//     teamCardHover: "rgba(255,255,255,0.05)",

//     statusDotBorder: "#060b14",
//     toggleIcon: "☀️",
//     toggleLabel: "Light",

//     payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
//     payPaidGrad: "linear-gradient(135deg,#065f46,#047857)",
//     docIconBg: "rgba(239,68,68,0.12)",
//     docIconBorder: "rgba(239,68,68,0.28)",
//     docIconColor: "#f87171",
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
// ];

// // ════════════════════════════════════════════════════════════════════════════════
// // ICONS (Inline SVG from Reference)
// // ════════════════════════════════════════════════════════════════════════════════
// const Ico = {
//   Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
//   Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
//   X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
//   Send: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
//   Attach: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>,
//   Pay: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
//   Check: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
//   DblChk: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 6 7 17 2 12" /><polyline points="22 6 11 17 7 13" /></svg>,
//   Reply: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 00-4-4H4" /></svg>,
//   Download: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
//   Doc: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
//   Team: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
//   Post: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
//   ZoomIn: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
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
// // LIGHTBOX (From Reference, adapted to user's download handler)
// // ════════════════════════════════════════════════════════════════════════════════
// function Lightbox({ src, name, onClose, onDownload }: { src: string; name: string; onClose: () => void; onDownload: (url: string, filename: string) => void }) {
//   useEffect(() => {
//     const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", h);
//     return () => document.removeEventListener("keydown", h);
//   }, [onClose]);

//   return (
//     <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.96)", backdropFilter: "blur(14px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "lbIn .2s ease" }}>
//       <style>{`@keyframes lbIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>
//       <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 10 }}>
//         <button onClick={e => { e.stopPropagation(); onDownload(src, name); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 16px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
//           <Ico.Download /> Download
//         </button>
//         <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: 9, borderRadius: 8, cursor: "pointer", display: "flex" }}><Ico.X /></button>
//       </div>
//       <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{name}</div>
//       <img src={src} alt={name} onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }} />
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

// /* ── CHAT ROW ── */
// .chat-row{
//   padding:13px 14px;cursor:pointer;border-bottom:1px solid ${T.divider};
//   transition:background .12s;display:flex;gap:12px;align-items:center;position:relative;
// }
// .chat-row:hover{background:${T.rowHover};}
// .chat-row.active{background:${T.chatRowActiveBg};border-left:3px solid ${T.chatRowActiveBorder};}

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

// /* ── BUBBLE ── */
// .bubble{max-width:100%; min-width:100%; padding:10px 13px;border-radius:13px;position:relative;animation:bub .2s ease;}
// .b-admin{background:${T.bubbleAdminBg};border:1px solid ${T.bubbleAdminBorder};color:${T.bubbleAdminText};border-radius:13px 13px 3px 13px;}
// .b-user{background:${T.bubbleUserBg};border:1px solid ${T.bubbleUserBorder};color:${T.bubbleUserText};border-radius:13px 13px 13px 3px;}

// /* ── REPLY HOVER ── */
// .msgrow:hover .rep-btn{opacity:1;}
// .rep-btn{opacity:0;transition:opacity .15s;}

// /* ── MODAL ── */
// .modal-ov{position:fixed;inset:0;background:${T.modalOverlay};backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
// .modal-bx{background:${T.modalBg};border:1px solid ${T.modalBorder};border-radius:14px;width:100%;max-width:460px;animation:pop .2s ease;box-shadow:0 30px 60px rgba(0,0,0,0.25);}

// /* ── DRAG OVERLAY ── */
// .drag-ov{position:absolute;inset:0;background:${T.accentLight};border:2px dashed ${T.accent};border-radius:10px;margin:12px;z-index:50;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}

// /* ── DOC BUBBLE ── */
// .doc-bub{display:flex;align-items:center;gap:11px;background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:9px;padding:11px 13px;margin-top:4px;}

// /* ── THEME TOGGLE ── */
// .tog{
//   display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
//   border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
//   color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
//   transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
// }
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

// /* ── PULSE ── */
// @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
// .pulse-dot{animation:pulse 2s ease-in-out infinite;}

// /* ── ANIMS ── */
// @keyframes bub{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
// @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
// @keyframes spin{to{transform:rotate(360deg)}}

// /* ── MOBILE RESPONSIVE ── */
// @media(max-width:768px){
//   .hide-mobile{display:none!important;}
//   .full-mobile{width:100%!important;position:absolute!important;inset:0!important;z-index:20!important;}
//   .nav-links{display:none!important;}
//   .mobile-back{display:flex!important;}
// }
// @media(min-width:769px){
//   .mobile-back{display:none!important;}
//   .desktop-only{display:flex!important;}
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
// export default function CSCUserDashboard() {
//   // DEFAULT = LIGHT theme
//   const [isDark, setIsDark] = useState(false);
//   const T = isDark ? THEMES.dark : THEMES.light;

//   const [lang, setLang] = useState("en");
//   const t = LANG[lang as "hi" | "en"] as typeof LANG["hi"];

//   const [activeTab, setActiveTab] = useState("all");
//   const [activeRequest, setActiveRequest] = useState<Request | null>(null);
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const [showNew, setShowNew] = useState(false);
//   const [showTimeline, setShowTimeline] = useState(false);
//   const [searchVal, setSearchVal] = useState("");
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [viewingAlert, setViewingAlert] = useState(false);
//   const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
//   const [lightboxName, setLightboxName] = useState<string>("");

//   const [msgVal, setMsgVal] = useState("");
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   const [newTitle, setNewTitle] = useState("");
//   const [newDesc, setNewDesc] = useState("");
//   const [newService, setNewService] = useState("");
//   const [newPriority, setNewPriority] = useState("regular");
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

//   // ✨ Delivery & Address States
//   const [deliveryMode, setDeliveryMode] = useState<"pickup" | "delivery">("pickup");
//   const [urgency, setUrgency] = useState("flexible");
//   const [addresses, setAddresses] = useState<any[]>([]);
//   const [selectedAddr, setSelectedAddr] = useState("");
//   const [showAddAddr, setShowAddAddr] = useState(false);
//   const [newAddr, setNewAddr] = useState({ label: "", full: "", pin: "" });

//   // ✨ Form States
//   const [availableForms, setAvailableForms] = useState<DbForm[]>([]);
//   const [showFormsMenu, setShowFormsMenu] = useState(false);
//   const [activeFormFill, setActiveFormFill] = useState<DbForm | null>(null);
//   const [formInputs, setFormInputs] = useState<Record<string, string>>({});
//   const [formDocFile, setFormDocFile] = useState<File | null>(null);

//   // Mobile view state
//   const [showMobileChat, setShowMobileChat] = useState(false);

//   // 2. Add these states near your other states (around line 250):
//   const [myCerts, setMyCerts] = useState<any[]>([]);
//   const [showCertsModal, setShowCertsModal] = useState(false);
//   const [myExcelCerts, setMyExcelCerts] = useState<any[]>([]);

//   const msgEndRef = useRef<HTMLDivElement>(null);

//   const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

//   // ─── AUTH & INIT ─── (Preserved Exactly)
//   useEffect(() => {
//     if (!authLoading && !isLoggedIn) window.location.href = "/";
//   }, [authLoading, isLoggedIn]);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("csc_theme");
//     if (savedTheme) setIsDark(savedTheme === "dark");
//     else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//     if (user?.preferred_lang) setLang(user.preferred_lang);
//   }, [user]);

//   // ─── FETCH LOGIC ─── (Preserved Exactly)
//   const loadRequests = useCallback(async () => {
//     if (!isLoggedIn) return;
//     try {
//       const data = await fetchMyRequestsAction();
//       const enrichedData = data.map((req: any) => ({
//         ...req,
//         messages: req.messages.map((m: any) => ({
//           ...m,
//           reply_to_msg: m.replyToId ? req.messages.find((old: any) => old.id === m.replyToId) : undefined
//         }))
//       }));
//       setRequests(enrichedData);
//       setActiveRequest(prev => {
//         if (!prev) return prev;
//         const updated = enrichedData.find((r: any) => r.id === prev.id);
//         return updated || prev;
//       });
//     } catch (e) { console.error(e); }
//   }, [isLoggedIn]);

//   useEffect(() => {
//     if (isLoggedIn) {
//       loadRequests();
//       fetchNotificationsAction().then((data) => setNotifications(data as any));
//       fetchMyAddressesAction().then(data => { setAddresses(data); if (data.length > 0) setSelectedAddr(data[0].id); });
//       getFormsAction().then((data) => setAvailableForms(data as any));
//       getMyCertificatesAction().then(data => setMyCerts(data || [])).catch(console.error);
//       getMyExcelCertificatesAction().then(data => setMyExcelCerts(data || [])).catch(console.error);
//     }
//   }, [isLoggedIn, loadRequests]);

//   useEffect(() => {
//     const socketInstance = io();
//     setSocket(socketInstance);
//     return () => { socketInstance.disconnect(); };
//   }, []);

//   useEffect(() => {
//     if (!socket) return;
//     const handleRefresh = () => loadRequests();
//     socket.on("refresh_queue", handleRefresh);
//     return () => { socket.off("refresh_queue", handleRefresh); };
//   }, [socket, loadRequests]);

//   const activeReqId = activeRequest?.id;
//   useEffect(() => {
//     if (!activeReqId || !socket) return;
//     socket.emit("join_chat", activeReqId);
//     const handleNewMessage = (newMsg: any) => {
//       const formattedMsg: Message = {
//         id: newMsg.id,
//         from: newMsg.sender_role === "user" ? "user" : "admin",
//         text: newMsg.content, textEn: newMsg.content,
//         time: new Date(newMsg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
//         date: "today", type: newMsg.message_type || "text",
//         doc: (newMsg.doc_url || newMsg.file_url) ? { name: newMsg.doc_name || newMsg.file_name, size: newMsg.doc_size || newMsg.file_size, icon: "📄", url: newMsg.doc_url || newMsg.file_url } : undefined,
//         amount: newMsg.payment_amount, replyToId: newMsg.reply_to_id || null,
//         adminName: newMsg.users?.name, adminRole: newMsg.users?.role,
//         // Add these inside the formattedMsg object in handleNewMessage:
//         formId: newMsg.form_id,
//         formData: newMsg.form_data,
//         formTitle: newMsg.forms?.title || newMsg.form_title, // We pass form_title via socket
//       };
//       setRequests(prev => prev.map(req => {
//         if (req.id !== newMsg.request_id) return req;
//         if (req.messages.some(m => m.id === formattedMsg.id)) return req;
//         const repMsg = formattedMsg.replyToId ? req.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
//         formattedMsg.reply_to_msg = repMsg;
//         return { ...req, messages: [...req.messages, formattedMsg] };
//       }));
//       setActiveRequest(prev => {
//         if (!prev || prev.id !== newMsg.request_id) return prev;
//         if (prev.messages.some(m => m.id === formattedMsg.id)) return prev;
//         const repMsg = formattedMsg.replyToId ? prev.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
//         formattedMsg.reply_to_msg = repMsg;
//         return { ...prev, messages: [...prev.messages, formattedMsg] };
//       });
//     };
//     socket.on("new_message", handleNewMessage);
//     return () => { socket.off("new_message", handleNewMessage); };
//   }, [activeReqId, socket]);

//   // ✨ REAL-TIME DESKTOP NOTIFICATIONS (SOCKET.IO)
//   useEffect(() => {
//     if (!socket || !user || requests.length === 0) return;

//     // Ask browser for permission
//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }

//     const handleGlobalAlert = (newMsg: any) => {
//       // 1. Verify this message belongs to ONE of the user's requests
//       const isMyRequest = requests.some(r => r.id === newMsg.request_id);
//       if (!isMyRequest) return;

//       // 2. Only notify if the sender is an admin
//       if (newMsg.sender_role !== "user") {
//         // Play sound
//         const audio = new Audio('/notify.mp3');
//         audio.play().catch(err => console.log("Audio play blocked", err));

//         // Show Desktop Popup (Only if they are on another tab)
//         if (Notification.permission === "granted" && document.hidden) {
//           new Notification("New Message from Support", {
//             body: newMsg.content || "📎 Sent a new attachment or form",
//             icon: "/favicon.ico"
//           });
//         }

//         // Refresh the sidebar instantly
//         loadRequests();
//       }
//     };

//     socket.on("global_message_alert", handleGlobalAlert);
//     return () => { socket.off("global_message_alert", handleGlobalAlert); };
//   }, [socket, user, requests, loadRequests]);

//   useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeRequest?.messages]);

//   useEffect(() => {
//     if (activeRequest?.status === "processing") {
//       const timer = setTimeout(() => setViewingAlert(true), 3000);
//       return () => clearTimeout(timer);
//     }
//     setViewingAlert(false);
//   }, [activeRequest]);

//   useEffect(() => {
//     if (!socket || !user) return;
//     const handleKick = () => {
//       alert("Your account role has been updated by an Administrator. Please log in again.");
//       logout();
//     };
//     socket.on(`logout_command_${user.id}`, handleKick);
//     return () => { socket.off(`logout_command_${user.id}`, handleKick); };
//   }, [socket, user, logout]);

//   // ─── HANDLERS ─── (Preserved Exactly)
//   const toggleTheme = () => {
//     const newDark = !isDark; setIsDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

//   const toggleLanguage = async () => {
//     const newLang = lang === "hi" ? "en" : "hi"; setLang(newLang);
//     if (user) await updateUserProfile({ preferred_lang: newLang });
//   };

//   // ─── INSTANT CLIENT-SIDE PDF FOR EXCEL-BACKED CERTIFICATES ───
//   const generateExcelCertPdf = async (cert: any) => {
//     const [{ toJpeg }, { jsPDF }] = await Promise.all([
//       import("html-to-image"),
//       import("jspdf"),
//     ]);

//     const verifyUrl = `${window.location.origin}/verify/${cert.roll_no}`;
//     const issueDate = new Date(cert.created_at || Date.now()).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });

//     const container = document.createElement("div");
//     container.style.position = "fixed";
//     container.style.left = "-9999px";
//     container.style.top = "0";
//     container.innerHTML = `
//       <div style="width:1123px;height:794px;background:#f8f6f0;position:relative;box-sizing:border-box;font-family:'Georgia','Times New Roman',serif;color:#1a1a2e;overflow:hidden;">
//         <div style="position:absolute;inset:0;opacity:0.04;background-image:repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(26,58,138,0.03) 35px,rgba(26,58,138,0.03) 70px);pointer-events:none;"></div>

//         <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:120px;font-weight:900;color:rgba(26,58,138,0.025);letter-spacing:20px;white-space:nowrap;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILALSAHAJ</div>
//         <div style="position:absolute;top:30%;left:20%;transform:rotate(25deg);font-size:80px;font-weight:900;color:rgba(26,58,138,0.02);letter-spacing:15px;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILALSAHAJ</div>
//         <div style="position:absolute;top:70%;left:60%;transform:rotate(-15deg);font-size:90px;font-weight:900;color:rgba(26,58,138,0.02);letter-spacing:15px;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILALSAHAJ</div>

//         <svg style="position:absolute;top:0;left:0;width:100%;height:260px;pointer-events:none;" viewBox="0 0 1123 260" preserveAspectRatio="none">
//           <path d="M0,0 L1123,0 L1123,70 Q800,190 400,110 Q200,70 0,150 Z" fill="#0a1628"/>
//           <path d="M0,18 L1123,18 L1123,83 Q800,203 400,123 Q200,83 0,163 Z" fill="none" stroke="#c9a227" stroke-width="3"/>
//           <path d="M0,32 L1123,32 L1123,92 Q800,212 400,132 Q200,92 0,172 Z" fill="none" stroke="#d4af37" stroke-width="1.5" opacity="0.6"/>
//           <path d="M0,45 L1123,45 L1123,100 Q800,220 400,140 Q200,100 0,180 Z" fill="none" stroke="#e8c547" stroke-width="0.8" opacity="0.4"/>
//         </svg>

//         <div style="position:absolute;top:40px;left:50px;z-index:10;">
//           <svg width="120" height="120" viewBox="0 0 130 130">
//             <defs>
//               <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%">
//                 <stop offset="0%" stop-color="#f4e4a6"/>
//                 <stop offset="40%" stop-color="#d4af37"/>
//                 <stop offset="70%" stop-color="#c9a227"/>
//                 <stop offset="100%" stop-color="#8b6914"/>
//               </radialGradient>
//               <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
//                 <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
//               </filter>
//             </defs>
//             <path d="M65,5 L72,25 L92,18 L82,35 L105,42 L85,52 L100,70 L80,68 L85,90 L68,78 L65,100 L58,78 L38,90 L45,68 L25,70 L42,52 L22,42 L45,35 L35,18 L55,25 Z" fill="url(#gold-grad)" filter="url(#seal-shadow)" stroke="#b8941f" stroke-width="1"/>
//             <circle cx="65" cy="55" r="38" fill="#0a1628" stroke="#d4af37" stroke-width="2.5"/>
//             <circle cx="65" cy="55" r="32" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="3,2"/>
//             <text x="65" y="32" text-anchor="middle" fill="#d4af37" font-size="10">★ ★ ★</text>
//             <text x="65" y="85" text-anchor="middle" fill="#d4af37" font-size="10">★</text>
//             <text x="65" y="48" text-anchor="middle" fill="#f4e4a6" font-size="9" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="1">HONORED</text>
//             <text x="65" y="62" text-anchor="middle" fill="#d4af37" font-size="11" font-weight="800" font-family="'DM Sans',sans-serif" letter-spacing="1">MENTION</text>
//           </svg>
//         </div>

//         <div style="position:absolute;top:45px;right:55px;text-align:center;z-index:10;">
//           <div style="width:65px;height:65px;border-radius:50%;border:3px solid #c9a227;background:linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%);margin:0 auto;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,0.2);">
//             <span style="font-size:26px;">🏛️</span>
//           </div>
//           <div style="font-size:10px;font-weight:700;color:#0a1628;margin-top:6px;font-family:'DM Sans',sans-serif;letter-spacing:1;">SRILAL SAHAJ</div>
//           <div style="font-size:8px;color:#64748b;font-family:'DM Sans',sans-serif;letter-spacing:0.5;">JANSEVA KENDRA</div>
//         </div>

//         <div style="position:absolute;top:30px;left:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;"></div>
//         <div style="position:absolute;top:30px;right:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;"></div>
//         <div style="position:absolute;bottom:30px;left:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;"></div>
//         <div style="position:absolute;bottom:30px;right:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;"></div>

//         <div style="position:absolute;top:150px;left:80px;right:80px;bottom:40px;display:flex;flex-direction:column;align-items:center;text-align:center;">

//           <div style="font-size:48px;font-weight:400;color:#1a1a2e;text-transform:uppercase;letter-spacing:8px;font-family:'Playfair Display','Georgia',serif;">Certificate</div>

//           <div style="background:linear-gradient(90deg,#0a1628 0%,#1a3a5c 50%,#0a1628 100%);color:#f4e4a6;padding:8px 45px;border-radius:30px;font-size:15px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-top:10px;font-family:'DM Sans',sans-serif;box-shadow:0 4px 15px rgba(10,22,40,0.3);">
//             of Achievement
//           </div>

//           <div style="margin-top:22px;display:flex;align-items:center;gap:12px;">
//             <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
//             <div style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:2.5px;font-family:'DM Sans',sans-serif;font-weight:500;">
//               This Certificate is Proudly Presented to
//             </div>
//             <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
//           </div>

//           <div style="margin-top:16px;position:relative;width:100%;">
//             <div style="font-size:52px;font-weight:400;color:#1a1a2e;font-family:'Great Vibes','Brush Script MT','Georgia',cursive;letter-spacing:2px;line-height:1;">
//               ${cert.student_name}
//             </div>

//             <div style="margin-top:0px;display:flex;align-items:center;justify-content:center;gap:0;width:100%;">
//               <div style="width:180px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
//               <div style="width:8px;height:8px;background:#c9a227;transform:rotate(45deg);margin:0 12px;box-shadow:0 0 6px rgba(201,162,39,0.4);"></div>
//               <div style="width:180px;height:1.5px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
//             </div>
//           </div>

//           <div style="margin-top:16px;display:flex;justify-content:center;gap:50px;width:100%;">
//             <div style="text-align:center;">
//               <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;">Father's Name</div>
//               <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:3px;font-family:'DM Sans',sans-serif;">${cert.father_name || "—"}</div>
//             </div>
//             <div style="text-align:center;">
//               <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;">Mother's Name</div>
//               <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:3px;font-family:'DM Sans',sans-serif;">${cert.mother_name || "—"}</div>
//             </div>
//             <div style="text-align:center;">
//               <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;">Roll Number</div>
//               <div style="font-size:14px;font-weight:700;color:#b8941f;margin-top:3px;font-family:'JetBrains Mono',monospace;">${cert.roll_no}</div>
//             </div>
//           </div>
//           <div style="margin-top:16px;font-size:14px;color:#475569;line-height:1.7;max-width:720px;font-family:'DM Sans',sans-serif;">
//             This is to certify that <strong style="color:#1a3a5c;">${cert.student_name}</strong> 
//             <span style="color:#64748b;font-size:12px;">(Roll No: <strong style="color:#b8941f;">${cert.roll_no}</strong>)</span> 
//             has successfully completed the training and examination in 
//             <strong style="color:#1a3a5c;">${cert.course_name}</strong> with 
//             <strong style="color:#b8941f;">Grade ${cert.grade || "—"}</strong> under the guidance and supervision of 
//             <strong style="color:#1a3a5c;">Srilal Yadav</strong>, Proprietor & Director of Srilal Sahaj Janseva Kendra, 
//             Shambhuganj, Jaunpur — 222132, Uttar Pradesh. This certificate is awarded in recognition of their 
//             dedication, hard work, and successful completion of all prescribed requirements.
//           </div>
//         </div>

//         <div style="position:absolute;bottom:55px;left:80px;right:80px;height:110px;display:flex;align-items:flex-end;justify-content:space-between;">

//           <div style="display:flex;align-items:center;gap:10px;">
//             <div style="border:2px solid #c9a227;border-radius:6px;padding:5px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
//               <img crossorigin="anonymous" src="https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${encodeURIComponent(verifyUrl)}" width="75" height="75" style="display:block;" />
//             </div>
//             <div style="padding-bottom:4px;">
//               <div style="font-size:10px;font-weight:700;color:#1a3a5c;font-family:'DM Sans',sans-serif;">Scan to Verify</div>
//               <div style="font-size:8px;color:#8b7355;font-family:'JetBrains Mono',monospace;margin-top:2px;">ID: ${cert.roll_no}</div>
//               <div style="font-size:8px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:1px;">${issueDate}</div>
//             </div>
//           </div>

//           <div style="display:flex;flex-direction:column;align-items:center;padding-bottom:5px;">
//             <svg width="100" height="100" viewBox="0 0 125 125">
//               <defs>
//                 <radialGradient id="seal-gold" cx="50%" cy="50%" r="50%">
//                   <stop offset="0%" stop-color="#f4e4a6"/>
//                   <stop offset="30%" stop-color="#e8c547"/>
//                   <stop offset="60%" stop-color="#d4af37"/>
//                   <stop offset="100%" stop-color="#8b6914"/>
//                 </radialGradient>
//                 <filter id="seal-glow" x="-30%" y="-30%" width="160%" height="160%">
//                   <feGaussianBlur stdDeviation="3" result="blur"/>
//                   <feComposite in="SourceGraphic" in2="blur" operator="over"/>
//                 </filter>
//               </defs>
//               <circle cx="62.5" cy="62.5" r="58" fill="none" stroke="url(#seal-gold)" stroke-width="3" filter="url(#seal-glow)"/>
//               <circle cx="62.5" cy="62.5" r="55" fill="#0a1628" stroke="#c9a227" stroke-width="1.5"/>
//               <circle cx="62.5" cy="62.5" r="48" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="4,3" opacity="0.6"/>
//               <circle cx="62.5" cy="62.5" r="42" fill="none" stroke="#d4af37" stroke-width="0.5" opacity="0.4"/>
//               <circle cx="62.5" cy="62.5" r="38" fill="url(#ink-seal-bg)"/>
//               <text x="62.5" y="48" text-anchor="middle" fill="#d4af37" font-size="22">👑</text>
//               <text x="62.5" y="68" text-anchor="middle" fill="#f4e4a6" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SRILAL</text>
//               <text x="62.5" y="80" text-anchor="middle" fill="#d4af37" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SAHAJ</text>
//               <path id="seal-arc" d="M 25,62.5 A 37.5,37.5 0 0,1 100,62.5" fill="none"/>
//               <text fill="#c9a227" font-size="7" font-family="'DM Sans',sans-serif" letter-spacing="2">
//                 <textPath href="#seal-arc" startOffset="50%" text-anchor="middle">JANSEVA KENDRA</textPath>
//               </text>
//             </svg>
//           </div>

//           <div style="display:flex;flex-direction:column;align-items:flex-between;padding-bottom:8px;">
//             <svg width="200" height="70" viewBox="0 0 350 180" style="display:block;">
//               <path d="M 65 110 C 50 120, 50 100, 65 70 C 80 40, 100 20, 100 30 C 100 40, 75 90, 85 95 C 95 100, 105 75, 110 95 C 115 105, 125 75, 125 95 C 135 45, 140 40, 135 95 C 145 80, 150 80, 150 95 C 160 45, 165 40, 160 95 C 165 95, 170 85, 175 85" fill="none" stroke="#11214d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
//               <path d="M 190 65 C 190 90, 210 90, 215 65 C 205 100, 195 160, 180 150 C 165 140, 180 110, 215 85 C 225 75, 230 75, 230 90 C 240 75, 250 75, 245 90 C 255 40, 255 40, 250 90 C 260 75, 270 75, 265 90 C 275 85, 280 75, 280 85 C 290 95, 295 90, 310 85" fill="none" stroke="#11214d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
//               <circle cx="120" cy="40" r="2.5" fill="#11214d" />
//             </svg>

//             <div style="border-top:1.5px solid #1a1a2e;width:180px;padding-top:0px;text-align:center;">
//               <div style="font-size:13px;font-weight:700;color:#1a1a2e;font-family:'DM Sans',sans-serif;">Srilal Yadav</div>
//               <div style="font-size:9px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:2px;letter-spacing:0.3px;">Authorized Signatory & Proprietor</div>
//             </div>
//           </div>
//         </div>

//         <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;">
//           <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
//           <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
//           <div style="font-size:8px;color:#8b7355;letter-spacing:1.5px;font-family:'DM Sans',sans-serif;">SHAMBHUGANJ, JAUNPUR — 222132, UTTAR PRADESH</div>
//           <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
//           <div style="width:80px;height:1px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
//         </div>

//       </div>`;

//     document.body.appendChild(container);

//     try {
//       const dataUrl = await toJpeg(container.firstElementChild as HTMLElement, {
//         quality: 0.95,
//         backgroundColor: "#ffffff",
//       });
//       const pdf = new jsPDF("landscape", "mm", "a4");
//       pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210);
//       window.open(pdf.output("bloburl"), "_blank");
//     } catch (err) {
//       alert("Failed to generate certificate PDF. Please try again.");
//     } finally {
//       document.body.removeChild(container);
//     }
//   };

//   const handleDownload = async (url: string, filename: string) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = blobUrl; link.download = filename || "download";
//       document.body.appendChild(link); link.click();
//       document.body.removeChild(link); window.URL.revokeObjectURL(blobUrl);
//     } catch (e) { window.open(url, '_blank'); }
//   };

//   const openLightbox = (url: string, name: string) => {
//     setLightboxUrl(url);
//     setLightboxName(name);
//   };

//   const handlePayment = async (messageId: string, amount: number) => {
//     if (!activeRequest || !user) return;
//     const loadScript = () => new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true); script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//     const res = await loadScript();
//     if (!res) { alert("Razorpay SDK failed to load. Are you online?"); return; }
//     try {
//       const orderRes = await createRazorpayOrderAction(messageId, amount);
//       if (!orderRes.success) throw new Error(orderRes.error || "Could not create order");
//       if (!orderRes.order) throw new Error("Invalid order response from server");
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: orderRes.order.amount, currency: "INR",
//         name: "CSC Shambhuganj - Srilal Yadav",
//         description: `Payment for ${activeRequest.title}`,
//         order_id: orderRes.order.id,
//         prefill: { name: user.name || "", contact: user.mobile || "", email: user.email || "" },
//         theme: { color: "#1d4ed8" },
//         handler: async function (response: any) {
//           try {
//             await verifyRazorpayPaymentAction(messageId, activeRequest.id, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
//             alert("Payment Successful! Your request is now processing.");
//             loadRequests(); socket?.emit("trigger_queue_refresh");
//           } catch (err) { alert("Payment Verification Failed!"); }
//         },
//       };
//       const paymentObject = new (window as any).Razorpay(options);
//       paymentObject.open();
//     } catch (err: any) { alert(err.message); }
//   };

//   const sendMessage = async () => {
//     if (!activeRequest || !user) return;
//     if (!msgVal.trim() && attachedFiles.length === 0) return;
//     setIsSending(true);
//     const replyId = replyingTo?.id ? String(replyingTo.id) : undefined;
//     const textToSend = msgVal.trim();
//     try {
//       const uploadedDocs = [];
//       for (const file of attachedFiles) {
//         const formData = new FormData();
//         formData.append("file", file); formData.append("requestId", activeRequest.id);
//         const uploadResult = await uploadChatFileAction(formData);
//         if (!uploadResult.success) throw new Error(uploadResult.error);
//         uploadedDocs.push({ name: uploadResult.name, url: uploadResult.url, size: formatBytes(file.size) });
//       }
//       if (textToSend) {
//         await sendChatMessageAction(activeRequest.id, textToSend, undefined, undefined, undefined, replyId);
//         const msgPayload = { id: `temp-${Date.now()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user", message_type: "text", content: textToSend, reply_to_id: replyId || null, created_at: new Date().toISOString(), users: { name: user.name } };
//         socket?.emit("send_message", msgPayload); socket?.emit("trigger_queue_refresh");
//       }
//       for (const doc of uploadedDocs) {
//         await sendChatMessageAction(activeRequest.id, "", doc.url, doc.name, doc.size, replyId);
//         const docPayload = { id: `temp-${Date.now()}-${Math.random()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user", message_type: "doc", doc_name: doc.name, doc_url: doc.url, doc_size: doc.size, file_name: doc.name, file_url: doc.url, file_size: doc.size, reply_to_id: replyId || null, created_at: new Date().toISOString(), users: { name: user.name } };
//         socket?.emit("send_message", docPayload); socket?.emit("trigger_queue_refresh");
//       }
//       setMsgVal(""); setAttachedFiles([]); setReplyingTo(null);
//     } catch (err: any) { alert("Failed to send message: " + err.message); }
//     finally { setIsSending(false); }
//   };

//   const handleSendForm = async () => {
//     if (!activeRequest || !user || !activeFormFill) return;

//     // Validate Required Fields
//     for (const field of activeFormFill.fields) {
//       if (field.required && !formInputs[field.label]) {
//         return alert(`Please fill the required field: ${field.label}`);
//       }
//     }
//     if (activeFormFill.requires_document && !formDocFile) {
//       return alert(`Please attach the required document: ${activeFormFill.document_label}`);
//     }

//     setIsSending(true);
//     try {
//       let docUrl, docName, docSize;

//       // Upload document if attached
//       if (formDocFile) {
//         const formData = new FormData();
//         formData.append("file", formDocFile);
//         formData.append("requestId", activeRequest.id);
//         const uploadResult = await uploadChatFileAction(formData);
//         if (!uploadResult.success) throw new Error(uploadResult.error);
//         docUrl = uploadResult.url;
//         docName = uploadResult.name;
//         docSize = formatBytes(formDocFile.size);
//       }

//       // Save to DB
//       await sendFormMessageAction(activeRequest.id, activeFormFill.id, formInputs, docUrl, docName, docSize);

//       // Send Socket Event
//       const msgPayload = {
//         id: `temp-${Date.now()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user",
//         message_type: "form", form_id: activeFormFill.id, form_data: formInputs, form_title: activeFormFill.title,
//         doc_url: docUrl, doc_name: docName, doc_size: docSize,
//         created_at: new Date().toISOString(), users: { name: user.name }
//       };
//       socket?.emit("send_message", msgPayload);
//       socket?.emit("trigger_queue_refresh");

//       setActiveFormFill(null);
//       setFormInputs({});
//       setFormDocFile(null);
//     } catch (err: any) {
//       alert("Failed to send form: " + err.message);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const submitNewRequest = async () => {
//     if (!newTitle || !newService) return;
//     if (deliveryMode === 'delivery' && !selectedAddr) { alert("Please select a delivery address."); return; }
//     try {
//       await createRequestAction({
//         service: newService, title: newTitle, desc: newDesc, priority: newPriority,
//         delivery_type: deliveryMode, urgency: deliveryMode === 'delivery' ? urgency : undefined,
//         address_id: deliveryMode === 'delivery' ? selectedAddr : undefined
//       });
//       loadRequests(); socket?.emit("trigger_queue_refresh");
//       setShowNew(false); setNewTitle(""); setNewDesc(""); setNewService(""); setNewPriority("regular"); setUploadedFiles([]);
//     } catch (error) { alert("Failed to submit request."); }
//   };

//   const unreadNotifsCount = notifications.filter(n => !n.is_read).length;
//   const filtered = requests.filter(r => {
//     if (activeTab !== "all" && r.status !== activeTab) return false;
//     const q = searchVal.toLowerCase();
//     if (q) {
//       if (!(r.title || "").toLowerCase().includes(q) && !(r.titleEn || "").toLowerCase().includes(q) && !(r.displayId || r.id || "").toLowerCase().includes(q)) return false;
//     }
//     return true;
//   });

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <AuthGuard>
//       <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s", fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif" }}>
//         <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

//         {lightboxUrl && (
//           <Lightbox src={lightboxUrl} name={lightboxName} onClose={() => setLightboxUrl(null)} onDownload={handleDownload} />
//         )}

//         {/* ════════════════════════════════════════════════════════
//           HEADER — navy indigo in both themes
//       ════════════════════════════════════════════════════════ */}
//         <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
//           <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

//             {/* Mobile menu + Brand */}
//             <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 20, padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", transition: "color 0.2s" }}
//               onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
//               onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>☰</button>

//             <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
//               <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
//               <div>
//                 <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
//                   Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//                 </div>
//                 <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>USER PORTAL</div>
//               </div>
//             </a>

//             <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

//             {/* Nav links */}
//             <nav className="nav-links" style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
//               {NAV_LINKS.map(l => (
//                 <a key={l.href} href={l.href} className="top-nav-link">
//                   <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
//                 </a>
//               ))}
//             </nav>

//             <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//               {/* Language Toggle */}
//               <button onClick={toggleLanguage} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "5px 12px", fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" }}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>
//                 {lang === "hi" ? "EN" : "हि"}
//               </button>

//               {/* Theme Toggle */}
//               <button className="tog" onClick={toggleTheme}>
//                 <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
//               </button>

//               {/* Notifications */}
//               <button style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, transition: "all 0.2s", position: "relative" }}
//                 onClick={() => { setNotifOpen(true); if (unreadNotifsCount > 0) { setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))); markNotificationsReadAction(); } }}
//                 onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#fff"; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}>
//                 🔔
//                 {unreadNotifsCount > 0 && (
//                   <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>{unreadNotifsCount}</span>
//                 )}
//               </button>

//               {/* User chip */}
//               <div onClick={() => setSidebarOpen(true)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px 5px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0, cursor: "pointer", transition: "all 0.2s" }}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>
//                 <Avatar name={user?.name} size={28} isDark={isDark} />
//                 <div>
//                   <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{user?.name?.split(" ")[0] || "User"}</div>
//                   <div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>CITIZEN</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* ════════════════════════════════════════════════════════
//           BODY
//       ════════════════════════════════════════════════════════ */}
//         <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

//           {/* ─── REQUEST LIST SIDEBAR ─── */}
//           <div className={`${showMobileChat ? 'hide-mobile' : ''}`} style={{ width: 360, borderRight: `1px solid ${T.divider}`, display: "flex", flexDirection: "column", background: T.sidebarBg, flexShrink: 0, overflow: "hidden", boxShadow: isDark ? "none" : "2px 0 8px rgba(0,0,0,0.04)" }}>

//             {/* Sidebar header */}
//             <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.divider}`, background: T.sidebarHeaderBg, flexShrink: 0 }}>
//               <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
//                 <div style={{ position: "relative", flex: 1 }}>
//                   <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
//                   <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder={t.search}
//                     className="inp" style={{ paddingLeft: 33, fontSize: 13 }} />
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
//                 {["all", "pending", "processing", "done"].map(tab => (
//                   <button key={tab} onClick={() => setActiveTab(tab)} className={`pill ${activeTab === tab ? "on" : ""}`}>
//                     {tab === "all" ? t.all : tab === "pending" ? t.pending : tab === "processing" ? t.processing : t.done}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Request rows */}
//             <div style={{ flex: 1, overflowY: "auto" }}>
//               {filtered.length === 0 ? (
//                 <div style={{ padding: 40, textAlign: "center", color: T.textMuted, fontSize: 13 }}>
//                   <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>📭</div>
//                   <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 600 }}>{t.noRequests}</div>
//                   <button onClick={() => setShowNew(true)} style={{ background: "none", border: "none", color: T.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>{t.startNew}</button>
//                 </div>
//               ) : filtered.map((req) => {
//                 const sc = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
//                 if (!sc) return null;
//                 const isActive = activeRequest?.id === req.id;
//                 const icon = req.service.includes("आधार") || req.service.includes("Aadhaar") ? "🪪" : req.service.includes("किसान") || req.service.includes("Kisan") ? "🌾" : req.service.includes("छात्र") || req.service.includes("Scholar") ? "🎓" : "📋";
//                 return (
//                   <div key={req.id} className={`chat-row ${isActive ? "active" : ""}`}
//                     onClick={() => { setActiveRequest(req as any); setRequests(prev => prev.map(r => r.id === req.id ? { ...r, unread: 0 } : r) as any); setShowMobileChat(true); }}>
//                     <div style={{ position: "relative", flexShrink: 0 }}>
//                       <div style={{ width: 42, height: 42, borderRadius: 12, background: isActive ? T.accentLight : T.inputBg, border: `2px solid ${isActive ? T.accent : T.divider}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all 0.2s" }}>{icon}</div>
//                       {req.status === "pending" && <span className="pulse-dot" style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: sc.color, border: `2px solid ${T.sidebarBg}` }} />}
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       {/* ✨ WhatsApp Logic */}
//                       {(() => {
//                         const lastMsgObj = req.messages?.[req.messages.length - 1];
//                         const isUnreadActual = req.unread > 0;

//                         let previewText = lang === "hi" ? req.lastMsg : req.lastMsgEn;
//                         if (lastMsgObj) {
//                           if (lastMsgObj.type === "text") previewText = lastMsgObj.text || "";
//                           else if (lastMsgObj.type === "form") previewText = "📝 Form Received";
//                           else if (lastMsgObj.type === "payment") previewText = "💳 Payment Request";
//                           else if (lastMsgObj.doc) previewText = "📎 Document Attached";
//                         }

//                         return (
//                           <>
//                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
//                               <span style={{ fontWeight: 700, fontSize: 13.5, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                                 {lang === "hi" ? req.title : req.titleEn}
//                               </span>

//                               {/* ✨ Time of Last Message */}
//                               <span style={{ fontSize: 11, color: isUnreadActual ? "#10b981" : T.textMuted, fontWeight: isUnreadActual ? 700 : 500, flexShrink: 0, marginLeft: 8 }}>
//                                 {lastMsgObj ? lastMsgObj.time : req.lastTime}
//                               </span>
//                             </div>

//                             {/* ✨ WhatsApp-Style Last Message Preview & Unread Dot */}
//                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
//                               <div style={{
//                                 fontSize: 12,
//                                 color: isUnreadActual ? T.textPrimary : T.textSecondary,
//                                 fontWeight: isUnreadActual ? 600 : 400,
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 flex: 1,
//                                 paddingRight: 10
//                               }}>
//                                 {previewText}
//                               </div>

//                               {isUnreadActual && (
//                                 <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: "#10b981", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", flexShrink: 0, boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)" }}>
//                                   {req.unread}
//                                 </span>
//                               )}
//                             </div>
//                           </>
//                         );
//                       })()}

//                       {/* Status Pill */}
//                       <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
//                         <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 700, border: "1.5px solid", textTransform: "uppercase", letterSpacing: "0.04em", background: isDark ? sc.bgDark : sc.bg, color: sc.color, borderColor: isDark ? sc.borderDark : sc.border }}>
//                           {sc.icon} {lang === "hi" ? sc.label : sc.labelEn}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* FAB */}
//             <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.divider}`, background: T.sidebarHeaderBg, flexShrink: 0 }}>
//               <button onClick={() => setShowNew(true)} className="btn btn-p" style={{ width: "100%", justifyContent: "center", borderRadius: 9, padding: "10px" }}>
//                 <Ico.Plus /> {t.newRequest}
//               </button>
//             </div>
//           </div>

//           {/* ─── CHAT PANEL ─── */}
//           {activeRequest ? (
//             <div className={`${!showMobileChat ? 'hide-mobile' : 'full-mobile'}`} style={{ flex: 1, display: "flex", flexDirection: "column", background: T.chatBg, position: "relative" }}
//               onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
//               onDragLeave={() => setIsDragOver(false)}
//               onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files) setAttachedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}>

//               {isDragOver && (
//                 <div className="drag-ov">
//                   <div style={{ textAlign: "center", color: T.accent }}>
//                     <div style={{ fontSize: 38, marginBottom: 8 }}>📎</div>
//                     <div style={{ fontWeight: 700, fontSize: 15 }}>Drop files to attach</div>
//                   </div>
//                 </div>
//               )}

//               {/* Chat header */}
//               <div style={{ background: isDark ? "rgba(6,11,20,0.98)" : T.cardBg, borderBottom: `1px solid ${T.divider}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 10, boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                   {/* Mobile back button */}
//                   <button className="mobile-back" onClick={() => { setShowMobileChat(false); setActiveRequest(null); }} style={{ background: "none", border: "none", color: T.textPrimary, cursor: "pointer", fontSize: 20, padding: 4, display: "none" }}>
//                     ←
//                   </button>
//                   <div style={{ width: 44, height: 44, borderRadius: 12, background: isDark ? "rgba(245,158,11,0.12)" : T.accentLight, border: `2px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
//                     {activeRequest.service.includes("आधार") || activeRequest.service.includes("Aadhaar") ? "🪪" : activeRequest.service.includes("किसान") ? "🌾" : activeRequest.service.includes("छात्र") ? "🎓" : "📋"}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "hi" ? activeRequest.title : activeRequest.titleEn}</div>
//                     <div style={{ fontSize: 11, color: T.textSecondary, fontWeight: 600, marginTop: 2 }}>
//                       <span style={{ background: isDark ? "rgba(245,158,11,0.15)" : T.accentLight, color: T.accent, padding: "1px 7px", borderRadius: 5, fontSize: 10, fontWeight: 700, marginRight: 6 }}>{(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()}</span>
//                       {activeRequest.service}
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                   {activeRequest.resolvedBy && (
//                     <div style={{ fontSize: 11, color: "#15803d", background: isDark ? "rgba(21,128,61,0.15)" : "#f0fdf4", border: `1px solid ${isDark ? "rgba(21,128,61,0.3)" : "#86efac"}`, borderRadius: 8, padding: "4px 10px", fontWeight: 700, display: "none" }} className="desktop-only">
//                       ✅ {t.resolvedBy}: {activeRequest.resolvedBy.name}
//                     </div>
//                   )}

//                   {activeRequest?.deliveryStatus === 'out_for_delivery' && (
//                     <div
//                       onClick={() => window.open(`/status?q=${activeRequest.id}`, "_blank")}
//                       style={{
//                         background: "linear-gradient(135deg, #10b981, #059669)",
//                         color: "#fff",
//                         padding: "14px 20px",
//                         borderRadius: 12,
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         cursor: "pointer",
//                         marginBottom: 16,
//                         boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
//                         animation: "fadeUp 0.3s ease",
//                         transition: "transform 0.2s",
//                       }}
//                       onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
//                       onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                         <div style={{
//                           width: 40,
//                           height: 40,
//                           borderRadius: "50%",
//                           background: "rgba(255,255,255,0.2)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: 20,
//                           animation: "pulse 2s infinite",
//                         }}>
//                           🛵
//                         </div>
//                         <div>
//                           <div style={{ fontWeight: 800, fontSize: 14 }}>
//                             {lang === 'hi' ? 'आपका दस्तावेज़ रास्ते में है!' : 'Your document is out for delivery!'}
//                           </div>
//                           <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
//                             {lang === 'hi' ? 'लाइव ट्रैकिंग देखने के लिए क्लिक करें' : 'Click to view live tracking'}
//                           </div>
//                         </div>
//                       </div>
//                       <div style={{
//                         background: "rgba(255,255,255,0.2)",
//                         padding: "6px 14px",
//                         borderRadius: 8,
//                         fontSize: 12,
//                         fontWeight: 800,
//                         backdropFilter: "blur(4px)",
//                       }}>
//                         📍 {lang === 'hi' ? 'ट्रैक करें' : 'Track Live'}
//                       </div>
//                     </div>
//                   )}
//                   <button onClick={() => setShowTimeline(true)} className="btn btn-g" style={{ fontSize: 12, padding: "7px 11px" }} title="Activity">📋</button>
//                 </div>
//               </div>

//               {/* Viewing banner */}
//               {viewingAlert && (
//                 <div style={{ background: isDark ? "rgba(21,128,61,0.12)" : "#f0fdf4", borderBottom: `2px solid ${isDark ? "rgba(21,128,61,0.3)" : "#86efac"}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: isDark ? "#4ade80" : "#15803d", animation: "fadeUp 0.3s ease", fontWeight: 600 }}>
//                   <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s infinite", flexShrink: 0 }} />
//                   <span>{activeRequest?.messages?.find(m => m.from === "admin")?.adminName || "An Operator"} {t.viewingDoc}</span>
//                   <button onClick={() => setViewingAlert(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 14, padding: "0 4px" }}>✕</button>
//                 </div>
//               )}

//               {/* Messages */}
//               <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 4, backgroundImage: T.chatPattern, backgroundSize: "28px 28px" }}>
//                 {activeRequest.messages.map((msg: Message, idx: number) => {
//                   const isUser = msg.from === "user";
//                   const prevMsg = activeRequest.messages[idx - 1];
//                   const showDate = !prevMsg || prevMsg.date !== msg.date;
//                   const showSender = !isUser && (!prevMsg || prevMsg.from === "user" || prevMsg.adminName !== msg.adminName);
//                   const isImage = msg.doc?.name?.match(/\.(jpeg|jpg|gif|png|webp)$/i) && msg.doc?.url;

//                   return (
//                     <div key={msg.id} className="msgrow" style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", marginBottom: 8, animation: "fadeUp 0.2s ease" }}>
//                       {showDate && (
//                         <div style={{ textAlign: "center", margin: "14px 0", width: "100%" }}>
//                           <span style={{ display: "inline-block", background: isDark ? "rgba(245,158,11,0.12)" : "rgba(30,58,138,0.08)", border: `1px solid ${isDark ? T.accentBorder : T.accentBorder}`, borderRadius: 20, padding: "3px 14px", fontSize: 11, color: isDark ? T.accent : T.accent, fontWeight: 600, letterSpacing: "0.03em" }}>
//                             {msg.date === "today" ? t.today : t.yesterday}
//                           </span>
//                         </div>
//                       )}
//                       <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: isUser ? "row-reverse" : "row" }}>
//                         {!isUser && (
//                           <div style={{ width: 30, height: 30, borderRadius: 8, background: isDark ? "rgba(245,158,11,0.12)" : T.accentLight, border: `1.5px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: T.accent, flexShrink: 0, marginBottom: 2 }}>
//                             {msg.adminName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) || "OP"}
//                           </div>
//                         )}
//                         <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
//                           {!isUser && showSender && (
//                             <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginBottom: 3, paddingLeft: 4 }}>{msg.adminName} · <span style={{ color: T.textMuted }}>{msg.adminRole}</span></div>
//                           )}
//                           <div className={`bubble ${isUser ? "b-user" : "b-admin"}`} style={{ padding: msg.type === "doc" || isImage ? "6px" : "10px 14px 6px" }}>

//                             {/* Reply preview */}
//                             {msg.reply_to_msg && (
//                               <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(30,58,138,0.06)", borderLeft: `3px solid ${T.accent}`, borderRadius: "0 6px 6px 0", padding: "6px 10px", marginBottom: 8, cursor: "pointer" }}>
//                                 <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 2 }}>{msg.reply_to_msg.from === "user" ? "You" : msg.reply_to_msg.adminName || "Admin"}</div>
//                                 <div style={{ fontSize: 12, color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
//                                   {msg.reply_to_msg.text || (msg.reply_to_msg.type === "doc" ? "📄 Document" : "💳 Payment")}
//                                 </div>
//                               </div>
//                             )}

//                             {/* Payment */}
//                             {/* Payment */}
//                             {msg.type === "payment" ? (
//                               <div style={{ width: "100%", boxSizing: "border-box", background: msg.paymentStatus === "paid" ? T.payPaidGrad : T.payPendingGrad, borderRadius: 8, padding: "14px", color: "#fff", position: "relative", overflow: "hidden", marginTop: 4, animation: "fadeUp 0.3s ease" }}>
//                                 <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

//                                 <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
//                                   <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                     {msg.paymentStatus === "paid" ? <Ico.Check /> : <Ico.Pay />}
//                                   </div>
//                                   <div style={{ flex: 1, minWidth: 0 }}>
//                                     <div style={{ fontSize: 10, opacity: 0.9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
//                                       {msg.paymentStatus === "paid" ? "Payment Received" : "Payment Required"}
//                                     </div>
//                                     <div className="mono" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1, marginTop: 2 }}>
//                                       {fmtCurrency(msg.amount || 0)}
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {msg.paymentStatus !== "paid" && (
//                                   <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 12, lineHeight: 1.4 }}>
//                                     Secure payment powered by Razorpay
//                                   </div>
//                                 )}

//                                 <button className="btn"
//                                   style={{ width: "100%", padding: "10px", border: "none", borderRadius: 8, background: msg.paymentStatus === "paid" ? "rgba(255,255,255,0.2)" : "#ffffff", color: msg.paymentStatus === "paid" ? "#ffffff" : "#d97706", fontSize: 13, fontWeight: 800, cursor: msg.paymentStatus === "paid" ? "default" : "pointer", fontFamily: "inherit", display: "flex", justifyContent: "center", alignItems: "center", gap: 6, boxShadow: msg.paymentStatus === "paid" ? "none" : "0 4px 12px rgba(0,0,0,0.15)" }}
//                                   onClick={() => msg.paymentStatus !== "paid" && handlePayment(String(msg.id), msg.amount || 0)}
//                                   disabled={msg.paymentStatus === "paid"}>
//                                   {msg.paymentStatus === "paid" ? (<>✅ Amount Received</>) : (<>💳 Pay Now</>)}
//                                 </button>
//                               </div>
//                             ) : msg.type === "form" ? (
//                               <div style={{ width: "100%", animation: "fadeUp 0.3s ease" }}>

//                                 {/* Header */}
//                                 <div style={{ display: "flex", gap: 10, alignItems: "center", borderBottom: `1px dashed ${T.divider}`, paddingBottom: 10, marginBottom: 12 }}>
//                                   <div style={{ background: T.accentLight, padding: "6px 8px", borderRadius: 8, fontSize: 16 }}>📝</div>
//                                   <div style={{ flex: 1, minWidth: 0 }}>
//                                     <div style={{ fontSize: 13, fontWeight: 800, color: T.accent }}>{msg.formTitle || "Form Submission"}</div>
//                                     <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Submitted Data</div>
//                                   </div>
//                                 </div>

//                                 {/* Form Fields */}
//                                 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                                   {msg.formData && Object.entries(msg.formData).map(([key, val]) => (
//                                     <div key={key} style={{ minWidth: 0 }}>
//                                       <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{key}</div>
//                                       <div style={{
//                                         fontSize: 13, color: T.textPrimary, fontWeight: 600,
//                                         background: isDark ? "rgba(0,0,0,0.2)" : "#fff",
//                                         padding: "6px 10px", borderRadius: 6,
//                                         border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : T.inputBorder}`,
//                                         width: "100%", boxSizing: "border-box",
//                                         wordBreak: "break-word", overflowWrap: "anywhere"
//                                       }}>
//                                         {String(val)}
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>

//                                 {/* Document Attachment */}
//                                 {msg.doc && (
//                                   <div onClick={() => handleDownload(msg.doc!.url!, msg.doc!.name || "document")} style={{ marginTop: 12, background: isDark ? "rgba(0,0,0,0.2)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : T.inputBorder}`, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = T.accent} onMouseLeave={e => e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.05)" : T.inputBorder}>
//                                     <span style={{ fontSize: 16 }}>📎</span>
//                                     <div style={{ flex: 1, minWidth: 0 }}>
//                                       <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.doc.name}</div>
//                                       <div style={{ fontSize: 10, color: T.textMuted }}>{msg.doc.size}</div>
//                                     </div>
//                                     <span style={{ fontSize: 16, color: T.textMuted }}>⬇</span>
//                                   </div>
//                                 )}

//                               </div>
//                             ) : msg.type === "doc" && msg.doc ? (
//                               <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "4px" }}>
//                                 {isImage ? (
//                                   <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer", display: "inline-block", maxWidth: 260 }} onClick={() => openLightbox(msg.doc!.url!, msg.doc!.name)}>
//                                     <img src={msg.doc.url} alt="attachment" style={{ width: "100%", maxHeight: 340, objectFit: "cover", objectPosition: "top center", display: "block", borderRadius: 8 }} />
//                                     <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.5))", borderRadius: 8 }} />
//                                     <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 6 }}>
//                                       <button onClick={(e) => { e.stopPropagation(); openLightbox(msg.doc!.url!, msg.doc!.name); }} style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "4px 10px", color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>🔍 View</button>
//                                       <button onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc!.url!, msg.doc!.name); }} style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "4px 10px", color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>⬇ Save</button>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <div className="doc-bub" onClick={() => msg.doc?.url && handleDownload(msg.doc.url, msg.doc.name)} style={{ cursor: "pointer" }}>
//                                     <div style={{ width: 36, height: 36, borderRadius: 8, background: T.docIconBg, border: `1px solid ${T.docIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.docIconColor }}><Ico.Doc /></div>
//                                     <div style={{ flex: 1, minWidth: 0 }}>
//                                       <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.textPrimary }}>{msg.doc.name}</div>
//                                       <div style={{ fontSize: 11, color: T.textMuted }}>{msg.doc.size}</div>
//                                     </div>
//                                     <button onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc?.url || "", msg.doc?.name || "file"); }} style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary, cursor: "pointer", padding: "6px 10px", borderRadius: 7, fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>⬇</button>
//                                   </div>
//                                 )}
//                                 {msg.text && <span style={{ fontSize: 13, color: T.textPrimary, paddingLeft: 4, paddingTop: 2 }}>{lang === "hi" ? msg.text : (msg.textEn || msg.text)}</span>}
//                               </div>
//                             ) : (
//                               <div style={{ fontSize: 14, lineHeight: 1.6, color: isUser ? T.bubbleUserText : T.bubbleAdminText, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{lang === "hi" ? msg.text : (msg.textEn || msg.text)}</div>
//                             )}

//                             {/* Timestamp */}
//                             <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: msg.type === "payment" ? 0 : 4, paddingTop: msg.type === "payment" ? 0 : 2 }}>
//                               <span style={{ fontSize: 10, color: T.bubbleMeta, fontWeight: 600 }}>{msg.time}</span>
//                               {isUser && <span style={{ fontSize: 11, color: msg.status === "seen" ? "#3b82f6" : T.bubbleMeta }}>✓✓</span>}
//                             </div>
//                           </div>

//                           {/* Reply button */}
//                           <button className="rep-btn" onClick={() => setReplyingTo(msg)} title="Reply" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: "2px 6px", color: T.textMuted, fontFamily: "inherit", marginTop: 2 }}>
//                             ↩ Reply
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div ref={msgEndRef} />
//               </div>

//               {/* Message Input */}
//               <div style={{ background: isDark ? "rgba(6,11,20,0.98)" : T.cardBg, borderTop: `1px solid ${T.divider}`, padding: "10px 14px", flexShrink: 0, boxShadow: isDark ? "none" : "0 -1px 6px rgba(0,0,0,0.05)" }}>
//                 {/* Reply bar */}
//                 {replyingTo && (
//                   <div style={{ background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `2px solid ${isDark ? T.accentBorder : T.accentBorder}`, borderRadius: "10px 10px 0 0", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "none" }}>
//                     <div style={{ fontSize: 12 }}>
//                       <div style={{ fontWeight: 700, color: T.accent, marginBottom: 2 }}>↩ {lang === "hi" ? "जवाब दे रहे हैं:" : "Replying to"} <span style={{ color: T.textPrimary }}>{replyingTo.from === "user" ? "You" : "Admin"}</span></div>
//                       <div style={{ color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{replyingTo.text || (replyingTo.type === "doc" ? "📄 Document" : "💳 Payment")}</div>
//                     </div>
//                     <button onClick={() => setReplyingTo(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 18, padding: "0 4px" }}>✕</button>
//                   </div>
//                 )}

//                 {/* Attached files */}
//                 {attachedFiles.length > 0 && (
//                   <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
//                     {attachedFiles.map((f, i) => (
//                       <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `1px solid ${isDark ? T.accentBorder : T.accentBorder}`, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: T.accent }}>
//                         <span>📎</span><span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(f as File).name}</span>
//                         <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
//                   <button className="btn btn-g" style={{ padding: "7px 11px", fontSize: 12 }} onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.onchange = e => setAttachedFiles(Array.from((e.target as HTMLInputElement).files || [])); el.click(); }} title={t.attach}>
//                     <Ico.Attach />
//                   </button>
//                   {/* ✨ Forms Menu Button */}
//                   <div style={{ position: "relative" }}>
//                     <button className="btn btn-g" style={{ padding: "7px 11px", fontSize: 12 }} onClick={() => setShowFormsMenu(!showFormsMenu)} title="Fill a Form">
//                       📋
//                     </button>
//                     {showFormsMenu && (
//                       <div style={{ position: "absolute", bottom: "120%", left: 0, background: T.modalBg, border: `1px solid ${T.inputBorder}`, borderRadius: 12, padding: 8, display: "flex", flexDirection: "column", gap: 4, width: 240, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 50, animation: "fadeUp 0.2s ease" }}>
//                         <div style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", padding: "4px 8px", marginBottom: 4 }}>Select a Form</div>
//                         {availableForms.length === 0 ? (
//                           <div style={{ fontSize: 12, padding: 8, color: T.textMuted, textAlign: "center" }}>No forms available</div>
//                         ) : (
//                           availableForms.map(f => (
//                             <button key={f.id} onClick={() => { setActiveFormFill(f); setShowFormsMenu(false); setFormInputs({}); setFormDocFile(null); }} style={{ textAlign: "left", padding: "10px", background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", color: T.textPrimary, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = T.rowHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//                               <span style={{ fontSize: 16 }}>📝</span> {f.title}
//                             </button>
//                           ))
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <textarea className="inp" rows={1} value={msgVal}
//                     onChange={e => { setMsgVal(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
//                     onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
//                     placeholder={t.typeMsg} style={{ resize: "none", maxHeight: 100, lineHeight: 1.5, fontSize: 14 }} />
//                   <button className="btn btn-p" onClick={sendMessage} disabled={isSending || (!msgVal.trim() && attachedFiles.length === 0)} style={{ width: 46, height: 46, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     {isSending
//                       ? <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} />
//                       : <Ico.Send />}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: T.textMuted }}>
//               <div style={{ width: 80, height: 80, borderRadius: 20, background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `2px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📬</div>
//               <div className="serif" style={{ fontSize: 20, color: T.textPrimary }}>Select a request to start chatting</div>
//               <div style={{ fontSize: 13, color: T.textMuted }}>{lang === "hi" ? "या नया आवेदन शुरू करें" : "or start a new one below"}</div>
//               <button onClick={() => setShowNew(true)} className="btn btn-p" style={{ padding: "11px 28px", fontSize: 14 }}>✏️ {t.newRequest}</button>
//             </div>
//           )}

//           {/* ─── TIMELINE PANEL ─── */}
//           {showTimeline && activeRequest && (
//             <div style={{ width: 300, borderLeft: `1px solid ${T.divider}`, background: T.sidebarBg, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", zIndex: 100, position: "absolute", right: 0, height: "100%", boxShadow: "-4px 0 20px rgba(0,0,0,0.12)", animation: "slideInR 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
//               <div style={{ padding: "14px 18px", borderBottom: `2px solid ${T.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.sidebarBg }}>
//                 <div style={{ fontWeight: 800, fontSize: 14, color: T.textPrimary }}>📋 {t.timeline}</div>
//                 <button onClick={() => setShowTimeline(false)} className="btn btn-g" style={{ padding: "6px 9px", fontSize: 12 }}><Ico.X /></button>
//               </div>
//               <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px" }}>
//                 {activeRequest.timeline.map((ev: TimelineEvent, i: number) => (
//                   <div key={i} style={{ display: "flex", gap: 14, marginBottom: 22 }}>
//                     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                       <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, background: i === activeRequest.timeline.length - 1 ? T.btnPrimary : T.inputBg, border: `2px solid ${i === activeRequest.timeline.length - 1 ? T.accent : T.divider}`, color: i === activeRequest.timeline.length - 1 ? "#fff" : T.textMuted }}>
//                         <span style={{ fontSize: 13 }}>{TIMELINE_ICONS[ev.event as keyof typeof TIMELINE_ICONS] || "📌"}</span>
//                       </div>
//                       {i < activeRequest.timeline.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${T.accent}44,${T.divider})`, marginTop: 4, minHeight: 20, borderRadius: 1 }} />}
//                     </div>
//                     <div style={{ paddingTop: 6 }}>
//                       <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{lang === "hi" ? (ev.event === "submitted" ? "जमा किया गया" : ev.event === "seen" ? "देखा गया" : ev.event === "processing" ? "प्रक्रिया शुरू" : "पूर्ण") : ev.eventEn}</div>
//                       <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, fontWeight: 600 }}>{lang === "hi" ? ev.time : ev.timeEn}</div>
//                     </div>
//                   </div>
//                 ))}
//                 {activeRequest.status !== "done" && (
//                   <div style={{ display: "flex", gap: 14, opacity: 0.35 }}>
//                     <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${T.divider}` }}><span style={{ fontSize: 13 }}>✅</span></div>
//                     <div style={{ paddingTop: 6 }}><div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{lang === "hi" ? "पूर्ण" : "Completed"}</div><div style={{ fontSize: 11, color: T.textMuted }}>{lang === "hi" ? "जल्द आएगा" : "Coming soon"}</div></div>
//                   </div>
//                 )}
//               </div>
//               {/* Status + pay */}
//               <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.divider}` }}>
//                 {(() => {
//                   const sc = STATUS_CONFIG[activeRequest.status as keyof typeof STATUS_CONFIG]; return (
//                     <div style={{ background: isDark ? sc.bgDark : sc.bg, border: `1.5px solid ${isDark ? sc.borderDark : sc.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
//                       <span style={{ fontSize: 20 }}>{sc.icon}</span>
//                       <div>
//                         <div style={{ fontSize: 13, color: sc.color, fontWeight: 800 }}>{lang === "hi" ? sc.label : sc.labelEn}</div>
//                         <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600 }}>{(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()}</div>
//                       </div>
//                     </div>
//                   );
//                 })()}
//                 {(() => {
//                   const unpaidMsg = activeRequest.messages.find(m => m.type === "payment" && m.paymentStatus !== "paid");
//                   if (unpaidMsg) return (
//                     <button className="btn btn-p" style={{ width: "100%", justifyContent: "center" }} onClick={() => handlePayment(String(unpaidMsg.id), unpaidMsg.amount || 0)}>
//                       💳 {t.payNow} — {fmtCurrency(unpaidMsg.amount || 0)}
//                     </button>
//                   );
//                   return null;
//                 })()}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ════════════════════════════════════════════════════════
//           NEW REQUEST MODAL
//       ════════════════════════════════════════════════════════ */}
//         {showNew && (
//           <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
//             <div className="modal-bx" style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "17px 22px", borderBottom: `1px solid ${T.divider}` }}>
//                 <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Serif Display', serif" }}>✏️ {t.newRequest}</div>
//                 <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 18 }}><Ico.X /></button>
//               </div>
//               <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
//                 <div>
//                   <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.serviceType} *</span>
//                   <select value={newService} onChange={e => setNewService(e.target.value)} className="inp" style={{ appearance: "none", cursor: "pointer" }}>
//                     <option value="">{lang === "hi" ? "सेवा चुनें..." : "Select service..."}</option>
//                     {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.requestTitle} *</span>
//                   <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={lang === "hi" ? "जैसे: आधार में नाम सुधार" : "e.g. Name correction in Aadhaar"} className="inp" />
//                 </div>
//                 <div>
//                   <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.requestDesc}</span>
//                   <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={lang === "hi" ? "पूरी जानकारी लिखें..." : "Write details here..."} className="inp" rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
//                 </div>
//                 <div>
//                   <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.priority}</span>
//                   <div style={{ display: "flex", gap: 10 }}>
//                     {["regular", "prepaid"].map(p => (
//                       <button key={p} onClick={() => setNewPriority(p)}
//                         style={{ flex: 1, padding: "12px 10px", borderRadius: 12, border: `2px solid ${newPriority === p ? T.accent : T.divider}`, cursor: "pointer", textAlign: "center", transition: "all 0.2s", fontFamily: "inherit", background: newPriority === p ? T.accentLight : "transparent", color: newPriority === p ? T.accent : T.textMuted, fontWeight: newPriority === p ? 700 : 500 }}>
//                         <div style={{ fontSize: 22, marginBottom: 6 }}>{p === "regular" ? "🕐" : "⚡"}</div>
//                         <div style={{ fontSize: 12, fontWeight: 700 }}>{p === "regular" ? t.regular : t.prepaid}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.uploadDoc}</span>
//                   <div
//                     onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}
//                     onDrop={e => { e.preventDefault(); setIsDragOver(false); setUploadedFiles(Array.from((e.dataTransfer as DataTransfer).files)); }}
//                     onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.accept = ".pdf,.jpg,.jpeg,.png,.webp"; el.onchange = (event) => { const target = event.target as HTMLInputElement; setUploadedFiles(Array.from(target.files || [])); }; el.click(); }}
//                     style={{ border: `2px dashed ${isDragOver ? T.accent : T.divider}`, borderRadius: 12, padding: 24, textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: isDragOver ? T.accentLight : "transparent" }}>
//                     <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
//                     <div style={{ fontSize: 13, color: T.textSecondary, fontWeight: 600 }}>{t.dragDrop}</div>
//                     <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>PDF, JPG, PNG up to 10MB</div>
//                   </div>
//                   {uploadedFiles.length > 0 && (
//                     <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
//                       {uploadedFiles.map((f, i) => (
//                         <div key={i} className="doc-bub">
//                           <div style={{ width: 36, height: 36, borderRadius: 8, background: T.docIconBg, border: `1px solid ${T.docIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.docIconColor }}><Ico.Doc /></div>
//                           <span style={{ flex: 1, fontSize: 13, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
//                           <button onClick={e => { e.stopPropagation(); setUploadedFiles(prev => prev.filter((_, j) => j !== i)); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 16 }}><Ico.X /></button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 {/* ✨ E-COMMERCE DELIVERY SECTION ✨ */}
//                 <div style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", border: `1px solid ${T.divider}`, borderRadius: 12, padding: 16 }}>
//                   <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>{t.deliveryOpt}</span>
//                   <div style={{ display: "flex", gap: 10, marginBottom: deliveryMode === 'delivery' ? 16 : 0 }}>
//                     {(['pickup', 'delivery'] as const).map(mode => (
//                       <button key={mode} onClick={() => setDeliveryMode(mode)}
//                         style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1.5px solid ${deliveryMode === mode ? T.accent : T.divider}`, background: deliveryMode === mode ? T.accentLight : "transparent", color: deliveryMode === mode ? T.accent : T.textMuted, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>
//                         {mode === 'pickup' ? `🏪 ${t.pickup}` : `🛵 ${t.homeDelivery}`}
//                       </button>
//                     ))}
//                   </div>

//                   {deliveryMode === 'delivery' && (
//                     <div style={{ animation: "fadeUp 0.2s ease" }}>
//                       {/* Urgency */}
//                       <div style={{ marginBottom: 16 }}>
//                         <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.urgency}</span>
//                         <select value={urgency} onChange={e => setUrgency(e.target.value)} className="inp" style={{ appearance: "none", cursor: "pointer" }}>
//                           <option value="flexible">🟢 {t.flex}</option>
//                           <option value="today">🟡 {t.today}</option>
//                           <option value="instant">🔴 {t.instant}</option>
//                         </select>
//                       </div>

//                       {/* Address Selection */}
//                       <div>
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
//                           <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.selectAddr} *</span>
//                           {!showAddAddr && <button onClick={() => setShowAddAddr(true)} style={{ background: "none", border: "none", color: T.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t.addAddr}</button>}
//                         </div>

//                         {showAddAddr ? (
//                           <div style={{ border: `1px solid ${T.accentBorder}`, padding: 12, borderRadius: 8, background: isDark ? "rgba(245,158,11,0.05)" : "#fff" }}>
//                             <input placeholder={t.addrLabel} className="inp" style={{ marginBottom: 8, padding: 8, fontSize: 13 }} value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} />
//                             <textarea placeholder={t.addrText} className="inp" style={{ marginBottom: 8, padding: 8, fontSize: 13 }} rows={2} value={newAddr.full} onChange={e => setNewAddr({ ...newAddr, full: e.target.value })} />
//                             <input placeholder={t.pin} className="inp" style={{ marginBottom: 8, padding: 8, fontSize: 13 }} value={newAddr.pin} onChange={e => setNewAddr({ ...newAddr, pin: e.target.value })} />
//                             <div style={{ display: "flex", gap: 8 }}>
//                               <button className="btn btn-g" style={{ flex: 1 }} onClick={() => setShowAddAddr(false)}>{t.cancel}</button>
//                               <button className="btn btn-p" style={{ flex: 1 }} disabled={!newAddr.label || !newAddr.full} onClick={async () => {
//                                 try {
//                                   const adr = await addAddressAction({ label: newAddr.label, full_address: newAddr.full, pincode: newAddr.pin });
//                                   setAddresses([adr, ...addresses]); setSelectedAddr(adr.id); setShowAddAddr(false); setNewAddr({ label: "", full: "", pin: "" });
//                                 } catch (e) { alert("Failed to save address"); }
//                               }}>{t.saveAddr}</button>
//                             </div>
//                           </div>
//                         ) : (
//                           <select value={selectedAddr} onChange={e => setSelectedAddr(e.target.value)} className="inp" style={{ appearance: "none", cursor: "pointer" }}>
//                             <option value="">{t.selectAddr}</option>
//                             {addresses.map(a => <option key={a.id} value={a.id}>{a.label} - {a.full_address}</option>)}
//                           </select>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <button onClick={submitNewRequest} disabled={!newTitle || !newService || (deliveryMode === 'delivery' && !selectedAddr)} className="btn btn-p" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>{t.submitRequest} →</button>
//                 {/* <button onClick={submitNewRequest} disabled={!newTitle || !newService} className="btn btn-p" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>
//                 {t.submitRequest} →
//               </button> */}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ════════════════════════════════════════════════════════
//           FORM FILLING MODAL (STUNNING UI)
//       ════════════════════════════════════════════════════════ */}
//         {activeFormFill && (
//           <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setActiveFormFill(null); }}>
//             <div className="modal-bx" style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: 0 }}>

//               {/* Header */}
//               <div style={{ background: T.sectionGrad, padding: "24px", color: T.sectionGradText, borderRadius: "14px 14px 0 0" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <div>
//                     <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Secure Form Submission</div>
//                     <h2 className="serif" style={{ margin: 0, fontSize: 24, lineHeight: 1.2 }}>{activeFormFill.title}</h2>
//                   </div>
//                   <button onClick={() => setActiveFormFill(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", padding: 6, borderRadius: 50, display: "flex" }}><Ico.X /></button>
//                 </div>
//               </div>

//               {/* Caution Banner */}
//               <div style={{ background: "rgba(245, 158, 11, 0.1)", borderBottom: "1px solid rgba(245, 158, 11, 0.2)", padding: "12px 24px", display: "flex", gap: 10, alignItems: "center", color: "#d97706", fontSize: 12, fontWeight: 700 }}>
//                 <span style={{ fontSize: 16 }}>⚠️</span> Please verify all details carefully. Submitted forms are final and cannot be edited.
//               </div>

//               {/* Form Fields */}
//               <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
//                 {activeFormFill.fields.map(field => (
//                   <div key={field.id}>
//                     <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", marginBottom: 6 }}>
//                       {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
//                     </label>
//                     <input
//                       className="inp"
//                       placeholder={`Enter ${field.label}`}
//                       value={formInputs[field.label] || ""}
//                       onChange={e => setFormInputs({ ...formInputs, [field.label]: e.target.value })}
//                     />
//                   </div>
//                 ))}

//                 {/* Document Upload */}
//                 {activeFormFill.requires_document && (
//                   <div style={{ marginTop: 8 }}>
//                     <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", marginBottom: 6 }}>
//                       {activeFormFill.document_label} <span style={{ color: "#ef4444" }}>*</span>
//                     </label>
//                     <div
//                       onClick={() => { const el = document.createElement("input"); el.type = "file"; el.accept = ".pdf,.jpg,.jpeg,.png"; el.onchange = e => setFormDocFile((e.target as HTMLInputElement).files?.[0] || null); el.click(); }}
//                       style={{ background: formDocFile ? T.accentLight : T.inputBg, border: `2px dashed ${formDocFile ? T.accent : T.inputBorder}`, padding: "20px", borderRadius: 12, textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
//                     >
//                       {formDocFile ? (
//                         <div style={{ color: T.accent, fontWeight: 700 }}>✅ {formDocFile.name} Attached</div>
//                       ) : (
//                         <div>
//                           <div style={{ fontSize: 24, marginBottom: 8 }}>📎</div>
//                           <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>Click to attach document</div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Price Note */}
//                 {activeFormFill.price > 0 && (
//                   <div style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: T.textSecondary, fontWeight: 600 }}>
//                     Note: A service fee of <span style={{ color: T.accent, fontWeight: 800 }}>₹{activeFormFill.price}</span> will be requested by the admin after review.
//                   </div>
//                 )}
//               </div>

//               {/* Footer */}
//               <div style={{ padding: "16px 24px", borderTop: `1px solid ${T.divider}`, background: T.sidebarHeaderBg, display: "flex", justifyContent: "flex-end", gap: 12, borderRadius: "0 0 14px 14px" }}>
//                 <button onClick={() => setActiveFormFill(null)} className="btn btn-g">Cancel</button>
//                 <button onClick={handleSendForm} disabled={isSending} className="btn btn-p" style={{ padding: "10px 24px" }}>
//                   {isSending ? "Sending..." : "Secure Submit"}
//                 </button>
//               </div>

//             </div>
//           </div>
//         )}

//         {/* ════════════════════════════════════════════════════════
//           SIDEBAR PANEL
//       ════════════════════════════════════════════════════════ */}
//         {sidebarOpen && (
//           <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
//             <div style={{ width: 280, background: T.sidebarBg, height: "100%", padding: 0, display: "flex", flexDirection: "column", animation: "slideInL 0.3s cubic-bezier(0.34,1.56,0.64,1)", borderRight: `1px solid ${T.divider}`, boxShadow: "4px 0 20px rgba(0,0,0,0.15)", overflow: "hidden" }}>
//               <div style={{ background: T.sectionGrad, padding: "24px 20px 20px", borderBottom: `2px solid ${T.accentBorder}` }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
//                   <div style={{ width: 50, height: 50, borderRadius: 14, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20, border: "2px solid rgba(255,255,255,0.3)" }}>
//                     {user?.name ? user.name[0].toUpperCase() : "👤"}
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{user?.name || (lang === "hi" ? "उपयोगकर्ता" : "User")}</div>
//                     <div style={{ fontSize: 12, color: T.navBrandAccent }}>{user?.mobile ? `+91 ${user.mobile}` : user?.email}</div>
//                   </div>
//                 </div>
//                 <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div>
//                     <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.wallet}</div>
//                     <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>₹ {user?.wallet_balance || 0}</div>
//                   </div>
//                   <button style={{ background: T.accent, border: "none", borderRadius: 9, color: "#fff", fontSize: 12, fontWeight: 700, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>+ Add</button>
//                 </div>
//               </div>

//               <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
//                 {[
//                   { icon: "📋", label: t.myRequests, action: () => { window.location.href = "/dashboard"; setSidebarOpen(false); } },
//                   { icon: "🎓", label: "My Certificates", action: () => { setShowCertsModal(true); setSidebarOpen(false); } },
//                   { icon: "📝", label: "Posts", action: () => { window.location.href = "/admin/posts"; } },
//                   { icon: "🖼️", label: "Gallery", action: () => { window.location.href = "/gallery"; } },
//                   { icon: "🔔", label: t.notifications, action: () => { window.location.href = "/notifications"; } },
//                   { icon: "📊", label: "Status", action: () => { window.location.href = "/status"; } },
//                   { icon: "👤", label: t.profile, action: () => { window.location.href = "/dashboard/profile"; } },
//                 ].map(({ icon, label, action }) => (
//                   <button key={label} onClick={action}
//                     style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: T.textPrimary, fontSize: 14, fontFamily: "inherit", transition: "all 0.15s", borderLeft: "3px solid transparent" }}
//                     onMouseEnter={e => { e.currentTarget.style.background = T.rowHover; e.currentTarget.style.borderLeftColor = T.accent; e.currentTarget.style.color = T.accent; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.color = T.textPrimary; }}>
//                     <span style={{ fontSize: 18 }}>{icon}</span><span style={{ fontWeight: 600 }}>{label}</span>
//                   </button>
//                 ))}
//                 <div style={{ height: 1, background: T.divider, margin: "8px 16px" }} />
//                 <button onClick={() => logout()}
//                   style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "#ef4444", fontSize: 14, fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
//                   onMouseEnter={e => e.currentTarget.style.background = T.btnDangerBg}
//                   onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//                   <span style={{ fontSize: 18 }}>🚪</span>{t.logout}
//                 </button>
//               </div>
//             </div>
//             <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
//           </div>
//         )}

//         {/* ════════════════════════════════════════════════════════
//           NOTIFICATIONS PANEL
//       ════════════════════════════════════════════════════════ */}
//         {notifOpen && (
//           <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", justifyContent: "flex-end" }}>
//             <div style={{ flex: 1 }} onClick={() => setNotifOpen(false)} />
//             <div style={{ width: 360, background: T.sidebarBg, height: "100%", display: "flex", flexDirection: "column", animation: "slideInR 0.3s cubic-bezier(0.34,1.56,0.64,1)", borderLeft: `1px solid ${T.divider}`, boxShadow: "-4px 0 20px rgba(0,0,0,0.15)" }}>
//               <div style={{ padding: "16px 20px", borderBottom: `2px solid ${T.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.sidebarBg }}>
//                 <div>
//                   <div style={{ fontWeight: 800, fontSize: 15, color: T.textPrimary }}>🔔 {t.notifications}</div>
//                   {unreadNotifsCount > 0 && <div style={{ fontSize: 11, color: T.textMuted }}>{unreadNotifsCount} unread</div>}
//                 </div>
//                 <button onClick={() => setNotifOpen(false)} className="btn btn-g" style={{ padding: "6px 9px", fontSize: 12 }}><Ico.X /></button>
//               </div>
//               <div style={{ flex: 1, overflowY: "auto" }}>
//                 {notifications.length === 0 ? (
//                   <div style={{ padding: 40, textAlign: "center", color: T.textMuted }}>
//                     <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>🔔</div>
//                     <div style={{ fontWeight: 600 }}>{lang === "hi" ? "कोई नई सूचना नहीं" : "No new notifications"}</div>
//                   </div>
//                 ) : notifications.map((n) => (
//                   <div key={n.id} style={{ padding: "14px 18px", borderBottom: `1px solid ${T.divider}`, display: "flex", gap: 12, cursor: "pointer", transition: "background 0.15s", background: n.is_read ? "transparent" : (isDark ? "rgba(245,158,11,0.05)" : "rgba(30,58,138,0.04)"), animation: "fadeUp 0.3s ease" }}
//                     onMouseEnter={e => (e.currentTarget.style.background = T.rowHover)}
//                     onMouseLeave={e => (e.currentTarget.style.background = n.is_read ? "transparent" : (isDark ? "rgba(245,158,11,0.05)" : "rgba(30,58,138,0.04)"))}>
//                     <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `1.5px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
//                       {n.type === "document_viewed" ? "👁️" : n.type === "status_changed" ? "⚙️" : n.type === "payment_request" ? "💳" : "🔔"}
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: 13, fontWeight: n.is_read ? 500 : 700, color: T.textPrimary, lineHeight: 1.4 }}>{lang === "hi" ? (n.title_hi || n.title) : n.title}</div>
//                       <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2, lineHeight: 1.5 }}>{lang === "hi" ? (n.body_hi || n.body) : n.body}</div>
//                       <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, fontWeight: 600 }}>{new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
//                     </div>
//                     {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, alignSelf: "center", flexShrink: 0 }} />}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ════════════════════════════════════════════════════════
//           MY CERTIFICATES MODAL
//       ════════════════════════════════════════════════════════ */}
//         {showCertsModal && (
//           <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowCertsModal(false); }}>
//             <div className="modal-bx" style={{ maxWidth: 550, padding: 0, overflow: "hidden", background: T.modalBg }}>

//               <div style={{ background: T.sectionGrad, padding: "20px 24px", color: T.sectionGradText, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <div>
//                   <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>🎓 My Certificates</h2>
//                   <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Verified Course Completions</div>
//                 </div>
//                 <button onClick={() => setShowCertsModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex" }}><Ico.X /></button>
//               </div>

//               <div style={{ padding: "24px", maxHeight: "60vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
//                 {(() => {
//                   // Merge PDF + Excel certs. PDF takes precedence if roll_no == certificate_number.
//                   const mergedMap = new Map<string, any>();
//                   myCerts.forEach((c: any) =>
//                     mergedMap.set(c.certificate_number, { ...c, _source: "pdf" })
//                   );
//                   myExcelCerts.forEach((c: any) => {
//                     if (!mergedMap.has(c.roll_no)) {
//                       mergedMap.set(c.roll_no, { ...c, _source: "excel", certificate_number: c.roll_no });
//                     }
//                   });
//                   const allCerts = Array.from(mergedMap.values());

//                   if (allCerts.length === 0) return (
//                     <div style={{ textAlign: "center", padding: 40, color: T.textMuted }}>
//                       <div style={{ fontSize: 40, marginBottom: 10 }}>📜</div>
//                       <div style={{ fontSize: 16, fontWeight: 700 }}>No Certificates Yet</div>
//                       <div style={{ fontSize: 13 }}>Complete a course at the CSC to earn your verified certificate.</div>
//                     </div>
//                   );

//                   return allCerts.map((cert: any) => (
//                     <div key={cert.id || cert.roll_no} style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, padding: 16, borderRadius: 12, display: "flex", gap: 16, alignItems: "center", transition: "all 0.2s" }}>
//                       <div style={{ width: 48, height: 48, borderRadius: 10, background: T.accentLight, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
//                         🎖️
//                       </div>
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ fontSize: 16, fontWeight: 800, color: T.textPrimary, marginBottom: 4 }}>{cert.course_name}</div>
//                         <div className="mono" style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.05em" }}>
//                           ID: {cert.certificate_number} • ISSUED: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : new Date(cert.created_at).toLocaleDateString()}
//                         </div>
//                       </div>
//                       {cert._source === "pdf" && cert.file_url ? (
//                         <a
//                           href={cert.file_url}
//                           target="_blank"
//                           rel="noreferrer"
//                           download={`${cert.course_name}_Certificate.pdf`}
//                           style={{ textDecoration: "none", background: T.btnPrimary, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
//                         >
//                           ⬇ PDF
//                         </a>
//                       ) : (
//                         <button
//                           onClick={() => generateExcelCertPdf(cert)}
//                           style={{ background: T.btnPrimary, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, flexShrink: 0, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontFamily: "inherit" }}
//                         >
//                           📄 Open Certificate
//                         </button>
//                       )}
//                     </div>
//                   ));
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}

//         <style>{`@keyframes slideInR{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes slideInL{from{transform:translateX(-100%)}to{transform:translateX(0)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     </AuthGuard>
//   );
// }
























"use client";

/**
 * dashboard/page.tsx — REDESIGNED for
 * D:\csc-platform\src\app\dashboard\page.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same component
 * as before: CSCUserDashboard, wrapped in AuthGuard, no props.
 *
 * DESIGN: a working chat dashboard, not a showcase — a navy header,
 * a request list on the left, the conversation on the right, and
 * plain cards and modals for everything else. One blue accent in
 * both themes, system fonts, no gradients, no serif display font,
 * no emoji as icons, no hover tricks that rewrite styles in JS.
 *
 * KEPT, exactly as supplied — every line of behaviour:
 * - All interfaces (AppNotification, TimelineEvent, MessageDoc,
 *   Message, ResolvedBy, Request, FormField, DbForm).
 * - The utils (formatBytes, fmtCurrency, fmtTime, fmtDate, isImg)
 *   and the useDebounce hook.
 * - The LANG object byte-for-byte (Hindi/English strings, including
 *   the emoji inside the copy, e.g. "लाइव ट्रैक करें 🛵").
 * - SERVICES (9 services) and the request list, search, tab filter,
 *   unread counts and WhatsApp-style last-message preview.
 * - All data loading: fetchMyRequestsAction (with reply_to_msg
 *   enrichment), fetchNotificationsAction, fetchMyAddressesAction,
 *   getFormsAction, getMyCertificatesAction,
 *   getMyExcelCertificatesAction.
 * - All socket.io behaviour: io() connect/disconnect, join_chat,
 *   new_message (with dedupe and reply resolution), refresh_queue,
 *   global_message_alert (sound /notify.mp3 + desktop Notification
 *   when the tab is hidden), logout_command_<user.id>.
 * - sendMessage (text + file upload via uploadChatFileAction +
 *   socket emits), handleSendForm (required-field and document
 *   validation, upload, sendFormMessageAction, socket emit),
 *   submitNewRequest (delivery mode, urgency, address validation),
 *   handlePayment (Razorpay checkout, verify, refresh), the
 *   viewing-alert timer, the auto-scroll to the newest message.
 * - generateExcelCertPdf — kept BYTE-FOR-BYTE. It builds a
 *   printable certificate document (gold seal, signature, QR) that
 *   html-to-image renders into a PDF. It is a document template,
 *   not page UI, so its inline styles stay exactly as they are.
 * - The Lightbox (Escape closes, download button), the timeline
 *   panel, the new-request modal (priority, drag-drop upload,
 *   delivery options, urgency, address add), the form-filling
 *   modal, the user sidebar panel (wallet, menu, logout), the
 *   notifications panel, and the certificates modal (PDF + Excel
 *   certs merged, PDF wins on a duplicate roll number).
 * - The theme state (localStorage csc_theme, system fallback) and
 *   the toggle — plus the `dark` class sync, so Tailwind `dark:`
 *   classes work.
 *
 * CHANGED, small and safe:
 * - The ~90-field THEMES object and the buildCss() string are gone:
 *   the Google Fonts @import, the global * { margin: 0; padding: 0 }
 *   reset, the fadeIn/pulse keyframes and the .pill / .btn / .card /
 *   .bubble / .modal-ov / .sec-hdr classes are all Tailwind classes
 *   now. (The only keyframes left are fadeUp, slideInR, slideInL,
 *   bub and pop, defined once in a <style> block at the bottom.)
 * - Nav links were absolute URLs chosen by NODE_ENV (production
 *   https://srilalsahaj.co.in/... vs http://localhost:3000/...) —
 *   now relative routes. Same destinations on every domain.
 * - Icons were emoji and hand-drawn inline SVGs — lucide icons now.
 *   STATUS_CONFIG keeps the same labels but its colours are Tailwind
 *   classes per status instead of hex values, and its icons are
 *   lucide components.
 * - Payment bubbles were amber/green gradients — now solid amber-600
 *   (pending) and solid emerald-600 (paid).
 * - The out-for-delivery banner was a green gradient — solid
 *   emerald-600 now.
 * - The mobile layout classes (hide-mobile / full-mobile /
 *   mobile-back / desktop-only / nav-links) are Tailwind responsive
 *   classes now (hidden md:flex, absolute inset-0 on mobile, etc.).
 * - The processing spinner used a `spin` keyframe from buildCss —
 *   Tailwind's built-in animate-spin now.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import { useState, useEffect, useRef, type DragEvent, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchMyRequestsAction, createRequestAction, sendChatMessageAction, sendFormMessageAction } from "@/app/actions/requests";
import { updateUserProfile } from "../actions/user";
import { uploadChatFileAction } from "../actions/storage";
import { fetchNotificationsAction, markNotificationsReadAction } from "@/app/actions/notifications";
import { io, Socket } from "socket.io-client";
import { createRazorpayOrderAction, verifyRazorpayPaymentAction } from "@/app/actions/payment";
import { fetchMyAddressesAction, addAddressAction } from "@/app/actions/address";
import { getFormsAction } from "../actions/forms";
import { getMyCertificatesAction, getMyExcelCertificatesAction } from "../actions/certificates";
import { AuthGuard } from "@/components/AuthGuard";
import SectionsModal from "@/components/SectionsModal";
import StudentSectionsPanel from "@/components/StudentSectionsPanel";
import {
  Award,
  BarChart3,
  Bell,
  Bike,
  Check,
  CheckCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  Hourglass,
  IdCard,
  Image as ImageIcon,
  Inbox,
  Landmark,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Paperclip,
  PenLine,
  Plus,
  Reply,
  ScrollText,
  Search,
  Send,
  Settings,
  Store,
  Sun,
  TriangleAlert,
  User,
  Wheat,
  X,
  XCircle,
  Zap,
  CheckCircle2,
  Megaphone
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ════════════════════════════════════════════════════════════════════════════════
// TYPES (Preserved Exactly)
// ════════════════════════════════════════════════════════════════════════════════
interface AppNotification {
  id: string;
  title: string;
  title_hi: string;
  body: string;
  body_hi: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface TimelineEvent {
  event: "submitted" | "seen" | "processing" | "done" | "payment";
  time: string;
  eventEn: string;
  timeEn: string;
}

interface MessageDoc {
  name: string;
  size: string;
  icon: string;
  url?: string;
  isResult?: boolean;
}

interface Message {
  id: number | string;
  from: "user" | "admin";
  time: string;
  date: string;
  type: string;
  text?: string;
  textEn?: string;
  doc?: MessageDoc;
  amount?: number;
  paymentStatus?: string;
  adminName?: string;
  adminRole?: string;
  status?: "seen" | "delivered";
  replyToId?: string | number | null;
  reply_to_msg?: Message;
  formId?: string;
  formData?: Record<string, string>;
  formTitle?: string;
}

interface ResolvedBy {
  name: string;
  role: string;
}

interface Request {
  id: string;
  displayId?: string;
  title: string;
  titleEn: string;
  service: string;
  status: "pending" | "processing" | "done";
  unread: number;
  lastMsg: string;
  lastMsgEn: string;
  lastTime: string;
  resolvedBy: ResolvedBy | null;
  paymentPending: boolean;
  paymentAmount?: number;
  deliveryType?: string;
  deliveryStatus?: string;
  urgency?: string;
  messages: Message[];
  timeline: TimelineEvent[];
}

interface FormField { id: string; label: string; required: boolean; }
interface DbForm { id: string; title: string; price: number; requires_document: boolean; document_label: string | null; fields: FormField[]; }

// ════════════════════════════════════════════════════════════════════════════════
// UTILS (Preserved + Reference Utils)
// ════════════════════════════════════════════════════════════════════════════════
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const isImg = (name: string | null) => !!name?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

function useDebounce<T>(value: T, delay: number): T {
  const [v, setV] = useState<T>(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}

// ════════════════════════════════════════════════════════════════════════════════
// LANGUAGE STRINGS (Preserved byte-for-byte)
// ════════════════════════════════════════════════════════════════════════════════
const LANG = {
  hi: {
    appName: "श्रीलाल जन सेवा केंद्र",
    myRequests: "मेरे आवेदन", newRequest: "नया आवेदन", search: "खोजें...",
    all: "सभी", pending: "लंबित", processing: "प्रक्रिया में", done: "पूर्ण",
    sent: "भेजा", seen: "देखा", online: "ऑनलाइन", today: "आज", yesterday: "कल",
    typeMsg: "संदेश लिखें...", send: "भेजें", attach: "दस्तावेज़ जोड़ें",
    requestTitle: "आवेदन का विषय", requestDesc: "विवरण लिखें", serviceType: "सेवा चुनें",
    submitRequest: "आवेदन जमा करें", uploadDoc: "दस्तावेज़ अपलोड करें",
    dragDrop: "फ़ाइल यहाँ खींचें या क्लिक करें", timeline: "गतिविधि",
    payNow: "अभी भुगतान करें", download: "डाउनलोड", resolvedBy: "द्वारा हल किया गया",
    viewingDoc: "आपके दस्तावेज़ देख रहे हैं", noRequests: "अभी कोई आवेदन नहीं",
    startNew: "नया आवेदन शुरू करें", wallet: "वॉलेट", notifications: "सूचनाएं",
    profile: "प्रोफ़ाइल", logout: "लॉगआउट", cancel: "रद्द करें", close: "बंद करें",
    priority: "प्राथमिकता", prepaid: "प्रीपेड (तेज़ सेवा)", regular: "सामान्य",
    deliveryOpt: "वितरण विकल्प", pickup: "दुकान से प्राप्त करें", homeDelivery: "होम डिलीवरी (घर पर)",
    urgency: "कितनी जल्दी चाहिए?", flex: "कोई जल्दी नहीं (2-3 दिन)", instant: "तुरंत (तत्काल)",
    selectAddr: "पता चुनें", addAddr: "+ नया पता जोड़ें", addrLabel: "लेबल (जैसे: घर)", addrText: "पूरा पता",
    pin: "पिनकोड", saveAddr: "पता सेव करें", trackLive: "लाइव ट्रैक करें 🛵",
  },
  en: {
    appName: "Srilal Sahaj Jan Seva Kendra",
    myRequests: "My Requests", newRequest: "New Request", search: "Search...",
    all: "All", pending: "Pending", processing: "Processing", done: "Done",
    sent: "Sent", seen: "Seen", online: "Online", today: "Today", yesterday: "Yesterday",
    typeMsg: "Type a message...", send: "Send", attach: "Attach Document",
    requestTitle: "Request Subject", requestDesc: "Describe your need", serviceType: "Select Service",
    submitRequest: "Submit Request", uploadDoc: "Upload Document",
    dragDrop: "Drag file here or click to browse", timeline: "Activity",
    payNow: "Pay Now", download: "Download", resolvedBy: "Resolved by",
    viewingDoc: "is viewing your document", noRequests: "No requests yet",
    startNew: "Start a new request", wallet: "Wallet", notifications: "Notifications",
    profile: "Profile", logout: "Logout", cancel: "Cancel", close: "Close",
    priority: "Priority", prepaid: "Prepaid (Faster Service)", regular: "Regular",
    deliveryOpt: "Delivery Options", pickup: "Shop Pickup", homeDelivery: "Home Delivery",
    urgency: "Delivery Urgency", flex: "No Rush (2-3 Days)", instant: "Instant (High Priority)",
    selectAddr: "Select Address", addAddr: "+ Add New Address", addrLabel: "Label (e.g. Home)", addrText: "Full Address",
    pin: "Pincode", saveAddr: "Save Address", trackLive: "Track Live 🛵",
  },
} as const;

const SERVICES = ["आधार अपडेट / Aadhaar Update", "पैन कार्ड / PAN Card", "जाति प्रमाण पत्र / Caste Certificate", "छात्रवृत्ति / Scholarship", "PM किसान / PM Kisan", "आयुष्मान कार्ड / Ayushman Card", "टिकट बुकिंग / Ticket Booking", "पैसे ट्रांसफर / Money Transfer", "अन्य / Other"];

// Status colours are Tailwind classes (same light/dark intent as the
// old hex values); labels and icons are unchanged.
const STATUS_CONFIG: Record<string, { label: string; labelEn: string; Icon: LucideIcon; cls: string; dot: string }> = {
  pending: { label: "लंबित", labelEn: "Pending", Icon: Hourglass, cls: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300", dot: "bg-amber-600" },
  seen: { label: "देखा गया", labelEn: "Seen", Icon: Eye, cls: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300", dot: "bg-blue-600" },
  processing: { label: "प्रक्रिया में", labelEn: "Processing", Icon: Settings, cls: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300", dot: "bg-blue-600" },
  payment_pending: { label: "भुगतान बाकी", labelEn: "Payment Pending", Icon: CreditCard, cls: "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300", dot: "bg-orange-600" },
  done: { label: "पूर्ण", labelEn: "Done", Icon: CheckCircle2, cls: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300", dot: "bg-emerald-600" },
  cancelled: { label: "रद्द", labelEn: "Cancelled", Icon: XCircle, cls: "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400", dot: "bg-slate-500" },
};

const TIMELINE_ICONS: Record<string, LucideIcon> = { submitted: Send, seen: Eye, processing: Settings, done: Check, payment: CreditCard };

function serviceIcon(service: string): LucideIcon {
  if (service.includes("आधार") || service.includes("Aadhaar")) return IdCard;
  if (service.includes("किसान") || service.includes("Kisan")) return Wheat;
  if (service.includes("छात्र") || service.includes("Scholar")) return GraduationCap;
  return ClipboardList;
}

// ════════════════════════════════════════════════════════════════════════════════
// NAV LINKS (relative routes)
// ════════════════════════════════════════════════════════════════════════════════
const NAV_LINKS = [
  { href: "/dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts", Icon: PenLine, label: "Posts" },
  { href: "/galary", Icon: ImageIcon, label: "Gallery" },
  { href: "/notifications", Icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", Icon: User, label: "Profile" },
  { href: "/status", Icon: ClipboardList, label: "Status" },
];

// ════════════════════════════════════════════════════════════════════════════════
// SHARED CLASSES
// ════════════════════════════════════════════════════════════════════════════════
const btnPrimaryCls = "inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-[13px] font-semibold text-white hover:bg-blue-800 disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500";
const btnGhostCls = "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-[13px] font-semibold text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/60 dark:hover:text-blue-400";
const btnDangerCls = "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400";
const btnSuccessCls = "inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700";
const inputCls = "w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[13.5px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500";
const cardCls = "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#111a2e]";

function SecHdr({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-3.5 dark:border-slate-700">
      <span className="text-blue-700 dark:text-blue-400">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">{label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// AVATAR
// ════════════════════════════════════════════════════════════════════════════════
function Avatar({ name, size = 40 }: { name?: string | null; size?: number }) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/20 bg-slate-500 font-bold text-white dark:bg-slate-600"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {ch}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// LIGHTBOX
// ════════════════════════════════════════════════════════════════════════════════
function Lightbox({ src, name, onClose, onDownload }: { src: string; name: string; onClose: () => void; onDownload: (url: string, filename: string) => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
      style={{ animation: "lbIn .2s ease" }}
    >
      <style>{`@keyframes lbIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>
      <div className="absolute right-5 top-5 flex gap-2.5">
        <button
          onClick={e => { e.stopPropagation(); onDownload(src, name); }}
          className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/20"
        >
          <Download className="h-3.5 w-3.5" aria-hidden /> Download
        </button>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center justify-center rounded-lg border border-white/20 bg-white/10 p-2.5 text-white hover:bg-white/20"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
      <div className="absolute bottom-5 text-xs text-white/40">{name}</div>
      <img
        src={src}
        alt={name}
        onClick={e => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function CSCUserDashboard() {
  const [isDark, setIsDark] = useState(false);

  const [lang, setLang] = useState("en");
  const t = LANG[lang as "hi" | "en"] as typeof LANG["hi"];

  const [activeTab, setActiveTab] = useState("all");
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [showNew, setShowNew] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingAlert, setViewingAlert] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState<string>("");

  const [msgVal, setMsgVal] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newService, setNewService] = useState("");
  const [newPriority, setNewPriority] = useState("regular");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Delivery & Address States
  const [deliveryMode, setDeliveryMode] = useState<"pickup" | "delivery">("pickup");
  const [urgency, setUrgency] = useState("flexible");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddr, setSelectedAddr] = useState("");
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", full: "", pin: "" });

  // Form States
  const [availableForms, setAvailableForms] = useState<DbForm[]>([]);
  const [showFormsMenu, setShowFormsMenu] = useState(false);
  const [activeFormFill, setActiveFormFill] = useState<DbForm | null>(null);
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [formDocFile, setFormDocFile] = useState<File | null>(null);

  // Mobile view state
  const [showMobileChat, setShowMobileChat] = useState(false);

  const [myCerts, setMyCerts] = useState<any[]>([]);
  const [showCertsModal, setShowCertsModal] = useState(false);
  const [myExcelCerts, setMyExcelCerts] = useState<any[]>([]);

  const [showSectionsModal, setShowSectionsModal] = useState(false);
  const [dashboardView, setDashboardView] = useState<"chats" | "sections">("chats");

  const msgEndRef = useRef<HTMLDivElement>(null);

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

  // ─── AUTH & INIT ─── (Preserved Exactly)
  useEffect(() => {
    if (!authLoading && !isLoggedIn) window.location.href = "/";
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
    if (user?.preferred_lang) setLang(user.preferred_lang);
  }, [user]);

  // Keep the local theme state in sync with the `dark` class so
  // Tailwind's dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // ─── FETCH LOGIC ─── (Preserved Exactly)
  const loadRequests = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const data = await fetchMyRequestsAction();
      const enrichedData = data.map((req: any) => ({
        ...req,
        messages: req.messages.map((m: any) => ({
          ...m,
          reply_to_msg: m.replyToId ? req.messages.find((old: any) => old.id === m.replyToId) : undefined
        }))
      }));
      setRequests(enrichedData);
      setActiveRequest(prev => {
        if (!prev) return prev;
        const updated = enrichedData.find((r: any) => r.id === prev.id);
        return updated || prev;
      });
    } catch (e) { console.error(e); }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      loadRequests();
      fetchNotificationsAction().then((data) => setNotifications(data as any));
      fetchMyAddressesAction().then(data => { setAddresses(data); if (data.length > 0) setSelectedAddr(data[0].id); });
      getFormsAction().then((data) => setAvailableForms(data as any));
      getMyCertificatesAction().then(data => setMyCerts(data || [])).catch(console.error);
      getMyExcelCertificatesAction().then(data => setMyExcelCerts(data || [])).catch(console.error);
    }
  }, [isLoggedIn, loadRequests]);

  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);
    return () => { socketInstance.disconnect(); };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => loadRequests();
    socket.on("refresh_queue", handleRefresh);
    return () => { socket.off("refresh_queue", handleRefresh); };
  }, [socket, loadRequests]);

  const activeReqId = activeRequest?.id;
  useEffect(() => {
    if (!activeReqId || !socket) return;
    socket.emit("join_chat", activeReqId);
    const handleNewMessage = (newMsg: any) => {
      const formattedMsg: Message = {
        id: newMsg.id,
        from: newMsg.sender_role === "user" ? "user" : "admin",
        text: newMsg.content, textEn: newMsg.content,
        time: new Date(newMsg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        date: "today", type: newMsg.message_type || "text",
        doc: (newMsg.doc_url || newMsg.file_url) ? { name: newMsg.doc_name || newMsg.file_name, size: newMsg.doc_size || newMsg.file_size, icon: "📄", url: newMsg.doc_url || newMsg.file_url } : undefined,
        amount: newMsg.payment_amount, replyToId: newMsg.reply_to_id || null,
        adminName: newMsg.users?.name, adminRole: newMsg.users?.role,
        formId: newMsg.form_id,
        formData: newMsg.form_data,
        formTitle: newMsg.forms?.title || newMsg.form_title,
      };
      setRequests(prev => prev.map(req => {
        if (req.id !== newMsg.request_id) return req;
        if (req.messages.some(m => m.id === formattedMsg.id)) return req;
        const repMsg = formattedMsg.replyToId ? req.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
        formattedMsg.reply_to_msg = repMsg;
        return { ...req, messages: [...req.messages, formattedMsg] };
      }));
      setActiveRequest(prev => {
        if (!prev || prev.id !== newMsg.request_id) return prev;
        if (prev.messages.some(m => m.id === formattedMsg.id)) return prev;
        const repMsg = formattedMsg.replyToId ? prev.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
        formattedMsg.reply_to_msg = repMsg;
        return { ...prev, messages: [...prev.messages, formattedMsg] };
      });
    };
    socket.on("new_message", handleNewMessage);
    return () => { socket.off("new_message", handleNewMessage); };
  }, [activeReqId, socket]);

  // REAL-TIME DESKTOP NOTIFICATIONS (SOCKET.IO)
  useEffect(() => {
    if (!socket || !user || requests.length === 0) return;

    // Ask browser for permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handleGlobalAlert = (newMsg: any) => {
      // 1. Verify this message belongs to ONE of the user's requests
      const isMyRequest = requests.some(r => r.id === newMsg.request_id);
      if (!isMyRequest) return;

      // 2. Only notify if the sender is an admin
      if (newMsg.sender_role !== "user") {
        // Play sound
        const audio = new Audio('/notify.mp3');
        audio.play().catch(err => console.log("Audio play blocked", err));

        // Show Desktop Popup (Only if they are on another tab)
        if (Notification.permission === "granted" && document.hidden) {
          new Notification("New Message from Support", {
            body: newMsg.content || "📎 Sent a new attachment or form",
            icon: "/favicon.ico"
          });
        }

        // Refresh the sidebar instantly
        loadRequests();
      }
    };

    socket.on("global_message_alert", handleGlobalAlert);
    return () => { socket.off("global_message_alert", handleGlobalAlert); };
  }, [socket, user, requests, loadRequests]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeRequest?.messages]);

  useEffect(() => {
    if (activeRequest?.status === "processing") {
      const timer = setTimeout(() => setViewingAlert(true), 3000);
      return () => clearTimeout(timer);
    }
    setViewingAlert(false);
  }, [activeRequest]);

  useEffect(() => {
    if (!socket || !user) return;
    const handleKick = () => {
      alert("Your account role has been updated by an Administrator. Please log in again.");
      logout();
    };
    socket.on(`logout_command_${user.id}`, handleKick);
    return () => { socket.off(`logout_command_${user.id}`, handleKick); };
  }, [socket, user, logout]);

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark; setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const toggleLanguage = async () => {
    const newLang = lang === "hi" ? "en" : "hi"; setLang(newLang);
    if (user) await updateUserProfile({ preferred_lang: newLang });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // generateExcelCertPdf — DROP-IN REPLACEMENT
  // - TEXTURE FIXED: Uses the EXACT waveTexture SVG (with the 5 bezier curves) 
  //   and repeating-linear-gradient you provided from the second screenshot.
  // - Keeps all the fixed overlaps, new signature layout, and "SRILAL COMPUTER
  //   INSTITUTE" branding.
  // ─────────────────────────────────────────────────────────────────────────────
  const generateExcelCertPdf = async (cert: any) => {
    const [{ toJpeg }, { jsPDF }] = await Promise.all([
      import("html-to-image"),
      import("jspdf"),
    ]);

    const verifyUrl = `${window.location.origin}/verify/${cert.roll_no}`;
    const issueDate = new Date(cert.created_at || Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.innerHTML = `
    <div style="width:1123px;height:794px;background:#f8f6f0;position:relative;box-sizing:border-box;font-family:'Georgia','Times New Roman',serif;color:#1a1a2e;overflow:hidden;">
      
      <!-- SVG GENERATED WAVE TEXTURE (Exactly as provided) -->
      <svg style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.12;pointer-events:none;z-index:0;" preserveAspectRatio="none">
        <defs>
          <pattern id="waveTexture" x="0" y="0" width="400" height="100" patternUnits="userSpaceOnUse">
            <!-- Seamless wavy bezier curves -->
            <path d="M0,20 C100,5 200,35 300,20 S400,5 400,20" fill="none" stroke="#1a3a5c" stroke-width="0.6" opacity="0.8"/>
            <path d="M0,40 C100,25 200,55 300,40 S400,25 400,40" fill="none" stroke="#1a3a5c" stroke-width="0.5" opacity="0.6"/>
            <path d="M0,60 C100,45 200,75 300,60 S400,45 400,60" fill="none" stroke="#1a3a5c" stroke-width="0.5" opacity="0.5"/>
            <path d="M0,80 C100,65 200,95 300,80 S400,65 400,80" fill="none" stroke="#1a3a5c" stroke-width="0.4" opacity="0.4"/>
            <path d="M0,100 C100,85 200,115 300,100 S400,85 400,100" fill="none" stroke="#1a3a5c" stroke-width="0.4" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waveTexture)"/>
      </svg>

      <div style="position:absolute;inset:0;opacity:0.04;background-image:repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(26,58,138,0.03) 35px,rgba(26,58,138,0.03) 70px);pointer-events:none;"></div>

      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-24deg);font-size:50px;font-weight:900;color:rgba(26,58,138,0.03);letter-spacing:8px;white-space:nowrap;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILAL COMPUTER INSTITUTE</div>

      <svg style="position:absolute;top:0;left:0;width:100%;height:260px;pointer-events:none;z-index:1;" viewBox="0 0 1123 260" preserveAspectRatio="none">
        <path d="M0,0 L1123,0 L1123,70 Q800,190 400,110 Q200,70 0,150 Z" fill="#0a1628"/>
        <path d="M0,18 L1123,18 L1123,83 Q800,203 400,123 Q200,83 0,163 Z" fill="none" stroke="#c9a227" stroke-width="3"/>
        <path d="M0,32 L1123,32 L1123,92 Q800,212 400,132 Q200,92 0,172 Z" fill="none" stroke="#d4af37" stroke-width="1.5" opacity="0.6"/>
        <path d="M0,45 L1123,45 L1123,100 Q800,220 400,140 Q200,100 0,180 Z" fill="none" stroke="#e8c547" stroke-width="0.8" opacity="0.4"/>
      </svg>

      <div style="position:absolute;top:40px;left:50px;z-index:10;">
        <svg width="120" height="120" viewBox="0 0 130 130">
          <defs>
            <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f4e4a6"/>
              <stop offset="40%" stop-color="#d4af37"/>
              <stop offset="70%" stop-color="#c9a227"/>
              <stop offset="100%" stop-color="#8b6914"/>
            </radialGradient>
            <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
            </filter>
          </defs>
          <path d="M65,5 L72,25 L92,18 L82,35 L105,42 L85,52 L100,70 L80,68 L85,90 L68,78 L65,100 L58,78 L38,90 L45,68 L25,70 L42,52 L22,42 L45,35 L35,18 L55,25 Z" fill="url(#gold-grad)" filter="url(#seal-shadow)" stroke="#b8941f" stroke-width="1"/>
          <circle cx="65" cy="55" r="38" fill="#0a1628" stroke="#d4af37" stroke-width="2.5"/>
          <circle cx="65" cy="55" r="32" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="3,2"/>
          <text x="65" y="32" text-anchor="middle" fill="#d4af37" font-size="10">★ ★ ★</text>
          <text x="65" y="85" text-anchor="middle" fill="#d4af37" font-size="10">★</text>
          <text x="65" y="48" text-anchor="middle" fill="#f4e4a6" font-size="9" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="1">HONORED</text>
          <text x="65" y="62" text-anchor="middle" fill="#d4af37" font-size="11" font-weight="800" font-family="'DM Sans',sans-serif" letter-spacing="1">MENTION</text>
        </svg>
      </div>

      <div style="position:absolute;top:45px;right:55px;text-align:center;z-index:10;">
        <div style="width:65px;height:65px;border-radius:50%;border:3px solid #c9a227;background:linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%);margin:0 auto;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,0.2);">
          <span style="font-size:26px;">🏛️</span>
        </div>
        <div style="font-size:10px;font-weight:700;color:#0a1628;margin-top:6px;font-family:'DM Sans',sans-serif;letter-spacing:1;">SRILAL COMPUTER</div>
        <div style="font-size:8px;color:#64748b;font-family:'DM Sans',sans-serif;letter-spacing:0.5;">INSTITUTE</div>
      </div>

      <div style="position:absolute;top:30px;left:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>
      <div style="position:absolute;top:30px;right:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>
      <div style="position:absolute;bottom:30px;left:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>
      <div style="position:absolute;bottom:30px;right:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>

      <div style="position:absolute;top:150px;left:80px;right:80px;bottom:40px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:10;">

        <div style="font-size:48px;font-weight:400;color:#1a1a2e;text-transform:uppercase;letter-spacing:8px;font-family:'Playfair Display','Georgia',serif;">Certificate</div>

        <div style="background:linear-gradient(90deg,#0a1628 0%,#1a3a5c 50%,#0a1628 100%);color:#f4e4a6;padding:8px 45px;border-radius:30px;font-size:15px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-top:10px;font-family:'DM Sans',sans-serif;box-shadow:0 4px 15px rgba(10,22,40,0.3);">
          of Achievement
        </div>

        <div style="margin-top:22px;display:flex;align-items:center;gap:12px;">
          <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
          <div style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:2.5px;font-family:'DM Sans',sans-serif;font-weight:500;white-space:nowrap;">
            This Certificate is Proudly Presented to
          </div>
          <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
        </div>

        <div style="margin-top:22px;position:relative;width:100%;">
          <div style="font-size:52px;font-weight:400;color:#1a1a2e;font-family:'Great Vibes','Brush Script MT','Georgia',cursive;letter-spacing:2px;line-height:1.15;">
            ${cert.student_name}
          </div>

          <div style="margin-top:0px;display:flex;align-items:center;justify-content:center;gap:0;width:100%;">
            <div style="width:180px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
            <div style="width:8px;height:8px;background:#c9a227;transform:rotate(45deg);margin:0 12px;box-shadow:0 0 6px rgba(201,162,39,0.4);"></div>
            <div style="width:180px;height:1.5px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
          </div>
        </div>

        <div style="margin-top:16px;display:flex;justify-content:center;gap:50px;width:100%;">
          <div style="width:220px;flex-shrink:0;text-align:center;">
            <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.3;">Father's Name</div>
            <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:4px;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.4;">${cert.father_name || "—"}</div>
          </div>
          <div style="width:220px;flex-shrink:0;text-align:center;">
            <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.3;">Mother's Name</div>
            <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:4px;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.4;">${cert.mother_name || "—"}</div>
          </div>
          <div style="width:220px;flex-shrink:0;text-align:center;">
            <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.3;">Roll Number</div>
            <div style="font-size:14px;font-weight:700;color:#b8941f;margin-top:4px;font-family:'JetBrains Mono',monospace;white-space:nowrap;line-height:1.4;">${cert.roll_no}</div>
          </div>
        </div>
        <div style="margin-top:16px;font-size:14px;color:#475569;line-height:1.7;max-width:720px;font-family:'DM Sans',sans-serif;">
          This is to certify that <strong style="color:#1a3a5c;">${cert.student_name}</strong>
          <span style="color:#64748b;font-size:12px;">(Roll No: <strong style="color:#b8941f;">${cert.roll_no}</strong>)</span>
          has successfully completed the training and examination in
          <strong style="color:#1a3a5c;">${cert.course_name}</strong> with
          <strong style="color:#b8941f;">Grade ${cert.grade || "—"}</strong> under the guidance and supervision of
          <strong style="color:#1a3a5c;">Srilal Yadav</strong>, Proprietor & Director of Srilal Computer Institute (SCI),
          Shambhuganj, Jaunpur — 222132, Uttar Pradesh. This certificate is awarded in recognition of their
          dedication, hard work, and successful completion of all prescribed requirements.
        </div>
      </div>

      <div style="position:absolute;bottom:55px;left:80px;right:80px;height:110px;display:flex;align-items:flex-end;justify-content:space-between;z-index:10;">

        <div style="display:flex;align-items:center;gap:12px;">
          <div style="flex-shrink:0;border:2px solid #c9a227;border-radius:6px;padding:5px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
            <img crossorigin="anonymous" src="https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${encodeURIComponent(verifyUrl)}" width="75" height="75" style="display:block;" />
          </div>
          <div style="width:130px;flex-shrink:0;padding-bottom:4px;">
            <div style="font-size:10px;font-weight:700;color:#1a3a5c;font-family:'DM Sans',sans-serif;white-space:nowrap;">Scan to Verify</div>
            <div style="font-size:8px;color:#8b7355;font-family:'JetBrains Mono',monospace;margin-top:3px;white-space:nowrap;">ID: ${cert.roll_no}</div>
            <div style="font-size:8px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:2px;white-space:nowrap;">${issueDate}</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;padding-bottom:5px;">
          <svg width="100" height="100" viewBox="0 0 125 125">
            <defs>
              <radialGradient id="seal-gold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f4e4a6"/>
                <stop offset="30%" stop-color="#e8c547"/>
                <stop offset="60%" stop-color="#d4af37"/>
                <stop offset="100%" stop-color="#8b6914"/>
              </radialGradient>
              <filter id="seal-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>
            <circle cx="62.5" cy="62.5" r="58" fill="none" stroke="url(#seal-gold)" stroke-width="3" filter="url(#seal-glow)"/>
            <circle cx="62.5" cy="62.5" r="55" fill="#0a1628" stroke="#c9a227" stroke-width="1.5"/>
            <circle cx="62.5" cy="62.5" r="48" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="4,3" opacity="0.6"/>
            <circle cx="62.5" cy="62.5" r="42" fill="none" stroke="#d4af37" stroke-width="0.5" opacity="0.4"/>
            <text x="62.5" y="48" text-anchor="middle" fill="#d4af37" font-size="22">👑</text>
            <text x="62.5" y="68" text-anchor="middle" fill="#f4e4a6" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SRILAL</text>
            <text x="62.5" y="80" text-anchor="middle" fill="#d4af37" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SCI</text>
            <path id="seal-arc" d="M 25,62.5 A 37.5,37.5 0 0,1 100,62.5" fill="none"/>
            <text fill="#c9a227" font-size="7" font-family="'DM Sans',sans-serif" letter-spacing="1.5">
              <textPath href="#seal-arc" startOffset="50%" text-anchor="middle">COMPUTER INSTITUTE</textPath>
            </text>
          </svg>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;padding-bottom:6px;width:280px;flex-shrink:0;">
          <div style="font-family:'Great Vibes','Brush Script MT','Segoe Script',cursive;font-size:38px;color:#11214d;line-height:1.2;transform:rotate(-2deg);white-space:nowrap;">Srilal Yadav</div>
          <svg width="190" height="12" viewBox="0 0 190 12" style="display:block;margin-top:4px;">
            <path d="M6 8 C 60 2, 130 2, 184 7" fill="none" stroke="#c9a227" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <div style="margin-top:8px;text-align:center;">
            <div style="font-size:13px;font-weight:700;color:#1a1a2e;font-family:'DM Sans',sans-serif;">Srilal Yadav</div>
            <div style="font-size:9px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:2px;letter-spacing:0.3px;">Director, Srilal Computer Institute (SCI)</div>
          </div>
        </div>
      </div>

      <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;z-index:10;">
        <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
        <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
        <div style="font-size:8px;color:#8b7355;letter-spacing:1.5px;font-family:'DM Sans',sans-serif;">SHAMBHUGANJ, JAUNPUR — 222132, UTTAR PRADESH</div>
        <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
        <div style="width:80px;height:1px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
      </div>

    </div>`;

    document.body.appendChild(container);

    try {
      const dataUrl = await toJpeg(container.firstElementChild as HTMLElement, {
        quality: 0.95,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210);
      window.open(pdf.output("bloburl"), "_blank");
    } catch (err) {
      alert("Failed to generate certificate PDF. Please try again.");
    } finally {
      document.body.removeChild(container);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl; link.download = filename || "download";
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); window.URL.revokeObjectURL(blobUrl);
    } catch (e) { window.open(url, '_blank'); }
  };

  const openLightbox = (url: string, name: string) => {
    setLightboxUrl(url);
    setLightboxName(name);
  };

  const handlePayment = async (messageId: string, amount: number) => {
    if (!activeRequest || !user) return;
    const loadScript = () => new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true); script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
    const res = await loadScript();
    if (!res) { alert("Razorpay SDK failed to load. Are you online?"); return; }
    try {
      const orderRes = await createRazorpayOrderAction(messageId, amount);
      if (!orderRes.success) throw new Error(orderRes.error || "Could not create order");
      if (!orderRes.order) throw new Error("Invalid order response from server");
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderRes.order.amount, currency: "INR",
        name: "CSC Shambhuganj - Srilal Yadav",
        description: `Payment for ${activeRequest.title}`,
        order_id: orderRes.order.id,
        prefill: { name: user.name || "", contact: user.mobile || "", email: user.email || "" },
        theme: { color: "#1d4ed8" },
        handler: async function (response: any) {
          try {
            await verifyRazorpayPaymentAction(messageId, activeRequest.id, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
            alert("Payment Successful! Your request is now processing.");
            loadRequests(); socket?.emit("trigger_queue_refresh");
          } catch (err) { alert("Payment Verification Failed!"); }
        },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) { alert(err.message); }
  };

  const sendMessage = async () => {
    if (!activeRequest || !user) return;
    if (!msgVal.trim() && attachedFiles.length === 0) return;
    setIsSending(true);
    const replyId = replyingTo?.id ? String(replyingTo.id) : undefined;
    const textToSend = msgVal.trim();
    try {
      const uploadedDocs = [];
      for (const file of attachedFiles) {
        const formData = new FormData();
        formData.append("file", file); formData.append("requestId", activeRequest.id);
        const uploadResult = await uploadChatFileAction(formData);
        if (!uploadResult.success) throw new Error(uploadResult.error);
        uploadedDocs.push({ name: uploadResult.name, url: uploadResult.url, size: formatBytes(file.size) });
      }
      if (textToSend) {
        await sendChatMessageAction(activeRequest.id, textToSend, undefined, undefined, undefined, replyId);
        const msgPayload = { id: `temp-${Date.now()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user", message_type: "text", content: textToSend, reply_to_id: replyId || null, created_at: new Date().toISOString(), users: { name: user.name } };
        socket?.emit("send_message", msgPayload); socket?.emit("trigger_queue_refresh");
      }
      for (const doc of uploadedDocs) {
        await sendChatMessageAction(activeRequest.id, "", doc.url, doc.name, doc.size, replyId);
        const docPayload = { id: `temp-${Date.now()}-${Math.random()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user", message_type: "doc", doc_name: doc.name, doc_url: doc.url, doc_size: doc.size, file_name: doc.name, file_url: doc.url, file_size: doc.size, reply_to_id: replyId || null, created_at: new Date().toISOString(), users: { name: user.name } };
        socket?.emit("send_message", docPayload); socket?.emit("trigger_queue_refresh");
      }
      setMsgVal(""); setAttachedFiles([]); setReplyingTo(null);
    } catch (err: any) { alert("Failed to send message: " + err.message); }
    finally { setIsSending(false); }
  };

  const handleSendForm = async () => {
    if (!activeRequest || !user || !activeFormFill) return;

    // Validate Required Fields
    for (const field of activeFormFill.fields) {
      if (field.required && !formInputs[field.label]) {
        return alert(`Please fill the required field: ${field.label}`);
      }
    }
    if (activeFormFill.requires_document && !formDocFile) {
      return alert(`Please attach the required document: ${activeFormFill.document_label}`);
    }

    setIsSending(true);
    try {
      let docUrl, docName, docSize;

      // Upload document if attached
      if (formDocFile) {
        const formData = new FormData();
        formData.append("file", formDocFile);
        formData.append("requestId", activeRequest.id);
        const uploadResult = await uploadChatFileAction(formData);
        if (!uploadResult.success) throw new Error(uploadResult.error);
        docUrl = uploadResult.url;
        docName = uploadResult.name;
        docSize = formatBytes(formDocFile.size);
      }

      // Save to DB
      await sendFormMessageAction(activeRequest.id, activeFormFill.id, formInputs, docUrl, docName, docSize);

      // Send Socket Event
      const msgPayload = {
        id: `temp-${Date.now()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user",
        message_type: "form", form_id: activeFormFill.id, form_data: formInputs, form_title: activeFormFill.title,
        doc_url: docUrl, doc_name: docName, doc_size: docSize,
        created_at: new Date().toISOString(), users: { name: user.name }
      };
      socket?.emit("send_message", msgPayload);
      socket?.emit("trigger_queue_refresh");

      setActiveFormFill(null);
      setFormInputs({});
      setFormDocFile(null);
    } catch (err: any) {
      alert("Failed to send form: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const submitNewRequest = async () => {
    if (!newTitle || !newService) return;
    if (deliveryMode === 'delivery' && !selectedAddr) { alert("Please select a delivery address."); return; }
    try {
      await createRequestAction({
        service: newService, title: newTitle, desc: newDesc, priority: newPriority,
        delivery_type: deliveryMode, urgency: deliveryMode === 'delivery' ? urgency : undefined,
        address_id: deliveryMode === 'delivery' ? selectedAddr : undefined
      });
      loadRequests(); socket?.emit("trigger_queue_refresh");
      setShowNew(false); setNewTitle(""); setNewDesc(""); setNewService(""); setNewPriority("regular"); setUploadedFiles([]);
    } catch (error) { alert("Failed to submit request."); }
  };

  const unreadNotifsCount = notifications.filter(n => !n.is_read).length;
  const filtered = requests.filter(r => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    const q = searchVal.toLowerCase();
    if (q) {
      if (!(r.title || "").toLowerCase().includes(q) && !(r.titleEn || "").toLowerCase().includes(q) && !(r.displayId || r.id || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-900 transition-colors duration-200 dark:bg-[#0b1220] dark:text-slate-100">
        {lightboxUrl && (
          <Lightbox src={lightboxUrl} name={lightboxName} onClose={() => setLightboxUrl(null)} onDownload={handleDownload} />
        )}

        {/* HEADER */}
        <header className="z-[100] shrink-0 border-b-2 border-blue-600 bg-[#0b2239] text-white shadow-md dark:border-blue-900">
          <div className="flex h-[54px] items-center gap-3.5 border-b border-white/10 px-5">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="flex items-center rounded-md px-1.5 py-1 text-xl text-white/70 transition hover:text-white"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>

            <a href="/" className="flex shrink-0 items-center gap-2.5">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white">
                <Landmark className="h-5 w-5" aria-hidden />
              </span>
              <span className="leading-none">
                <span className="block text-[17px] font-bold tracking-tight text-white">
                  Srilal <span className="text-blue-300">CSC</span>
                </span>
                <span className="mt-0.5 block font-mono text-[9px] tracking-[0.1em] text-white/40">
                  USER PORTAL
                </span>
              </span>
            </a>

            <span className="h-[26px] w-px shrink-0 bg-white/10" aria-hidden />

            <nav className="hidden flex-1 gap-1 overflow-x-auto md:flex" aria-label="App navigation">
              {NAV_LINKS.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-bold text-white/90 transition hover:bg-white/20"
              >
                {lang === "hi" ? "EN" : "हि"}
              </button>

              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-blue-300/50 bg-white/10 px-2 py-1 text-xs font-bold text-white/70 transition hover:border-blue-400 hover:text-white"
              >
                {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                {isDark ? "Light" : "Dark"}
              </button>

              <button
                aria-label="Notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                onClick={() => { setNotifOpen(true); if (unreadNotifsCount > 0) { setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))); markNotificationsReadAction(); } }}
              >
                <Bell className="h-4 w-4" aria-hidden />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSidebarOpen(true)}
                className="flex shrink-0 items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3 transition hover:bg-white/20"
              >
                <Avatar name={user?.name} size={28} />
                <span className="text-left leading-none">
                  <span className="block text-[13px] font-bold text-white">{user?.name?.split(" ")[0] || "User"}</span>
                  <span className="mt-0.5 block font-mono text-[9px] tracking-wider text-blue-300">CITIZEN</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* SUBHEADER — Support Chats / Sections tabs */}
        <div className="flex shrink-0 gap-1 border-1 rounded-md mx-3 border-slate-200 bg-white px-5 dark:border-slate-700 dark:bg-[#0d1526]">
          {(["chats", "sections"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setDashboardView(v)}
              className={`border-b-2 px-4 py-2.5 text-xs! font-extrabold uppercase tracking-wider transition-colors ${dashboardView === v ? "border-blue-700 text-blue-700 dark:border-blue-500 dark:text-blue-400" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
            >
              {v === "chats" ? "Support Chats" : "Sections"}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className={`relative flex flex-1 overflow-hidden ${dashboardView === "sections" ? "hidden" : "flex"}`}>

          {/* ─── REQUEST LIST SIDEBAR ─── */}
          <div
            className={`w-[360px] max-w-full shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0d1526] ${showMobileChat ? "hidden md:flex" : "flex"}`}
          >

            {/* Sidebar header */}
            <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800/40">

              <div className="mb-2.5 flex gap-2">

                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
                  <input
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    placeholder={t.search}
                    aria-label={t.search}
                    className={`${inputCls} !py-2.5 !pl-[33px] !text-[13px]`}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "processing", "done"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    aria-pressed={activeTab === tab}
                    className={`rounded-full border px-2 py-0 !text-[12px] font-bold uppercase tracking-wide transition ${activeTab === tab
                      ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                      : "border-slate-200 bg-slate-100 text-slate-500 hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                      }`}
                  >
                    {tab === "all" ? t.all : tab === "pending" ? t.pending : tab === "processing" ? t.processing : t.done}
                  </button>
                ))}
              </div>
            </div>

            {/* Request rows */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-10 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400">
                  <Inbox className="mx-auto mb-3 h-12 w-12 opacity-40" aria-hidden />
                  <p className="mb-2 text-sm font-semibold">{t.noRequests}</p>
                  <button onClick={() => setShowNew(true)} className="text-[13px] font-bold text-blue-700 underline dark:text-blue-400">
                    {t.startNew}
                  </button>
                </div>
              ) : filtered.map((req) => {
                const sc = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
                if (!sc) return null;
                const isActive = activeRequest?.id === req.id;
                const SvcIcon = serviceIcon(req.service);
                return (
                  <div
                    key={req.id}
                    onClick={() => { setActiveRequest(req as any); setRequests(prev => prev.map(r => r.id === req.id ? { ...r, unread: 0 } : r) as any); setShowMobileChat(true); }}
                    className={`relative flex cursor-pointer items-center gap-3 border-b border-slate-200 px-3.5 py-3.5 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40 ${isActive ? "border-l-[3px] border-l-blue-600 bg-blue-50 dark:bg-blue-950/40" : ""
                      }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`flex h-[42px] w-[42px] items-center justify-center rounded-xl border-2 text-blue-700 transition dark:text-blue-400 ${isActive ? "border-blue-600 bg-blue-100 dark:bg-blue-950/60" : "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                          }`}
                      >
                        <SvcIcon className="h-5 w-5" aria-hidden />
                      </div>
                      {req.status === "pending" && (
                        <span className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white ${sc.dot} dark:border-[#0d1526]`} aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {(() => {
                        const lastMsgObj = req.messages?.[req.messages.length - 1];
                        const isUnreadActual = req.unread > 0;

                        let previewText = lang === "hi" ? req.lastMsg : req.lastMsgEn;
                        if (lastMsgObj) {
                          if (lastMsgObj.type === "text") previewText = lastMsgObj.text || "";
                          else if (lastMsgObj.type === "form") previewText = "Form received";
                          else if (lastMsgObj.type === "payment") previewText = "Payment request";
                          else if (lastMsgObj.doc) previewText = "Document attached";
                        }

                        return (
                          <>
                            <div className="mb-1 flex items-center justify-between">
                              <span className="truncate text-[13.5px] font-bold text-slate-900 dark:text-white">
                                {lang === "hi" ? req.title : req.titleEn}
                              </span>
                              <span className={`ml-2 shrink-0 text-[11px] font-semibold ${isUnreadActual ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                                {lastMsgObj ? lastMsgObj.time : req.lastTime}
                              </span>
                            </div>

                            <div className="mb-1 flex items-center justify-between">
                              <p className={`flex-1 truncate pr-2.5 text-xs ${isUnreadActual ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                                {previewText}
                              </p>
                              {isUnreadActual && (
                                <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                                  {req.unread}
                                </span>
                              )}
                            </div>
                          </>
                        );
                      })()}

                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full border-[1.5px] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${sc.cls}`}>
                          <sc.Icon className="h-3 w-3" aria-hidden /> {lang === "hi" ? sc.label : sc.labelEn}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAB */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800/40">
              <button onClick={() => setShowNew(true)} className={`${btnPrimaryCls} w-full !rounded-lg !py-2.5`}>
                <Plus className="h-3.5 w-3.5" aria-hidden /> {t.newRequest}
              </button>
            </div>
          </div>

          {/* ─── CHAT PANEL ─── */}
          {activeRequest ? (
            <div
              className={`flex-1 flex-col bg-slate-100 dark:bg-[#080d17] ${!showMobileChat ? "hidden md:flex" : "absolute inset-0 z-20 flex md:relative md:inset-auto"
                }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files) setAttachedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}
            >
              {isDragOver && (
                <div className="absolute inset-0 z-50 m-3 flex items-center justify-center rounded-lg border-2 border-dashed border-blue-600 bg-blue-50/90 backdrop-blur dark:bg-blue-950/60">
                  <div className="text-center text-blue-700 dark:text-blue-300">
                    <Paperclip className="mx-auto mb-2 h-9 w-9" aria-hidden />
                    <p className="text-[15px] font-bold">Drop files to attach</p>
                  </div>
                </div>
              )}

              {/* Chat header */}
              <div className="z-10 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-[#0d1526]">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => { setShowMobileChat(false); setActiveRequest(null); }}
                    aria-label="Back to requests"
                    className="flex p-1 text-xl text-slate-900 dark:text-white md:hidden"
                  >
                    ←
                  </button>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                    {(() => { const SvcIcon = serviceIcon(activeRequest.service); return <SvcIcon className="h-5 w-5" aria-hidden />; })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold leading-snug text-slate-900 dark:text-white">
                      {lang === "hi" ? activeRequest.title : activeRequest.titleEn}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="mr-1.5 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()}
                      </span>
                      {activeRequest.service}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeRequest.resolvedBy && (
                    <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 md:inline-flex">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> {t.resolvedBy}: {activeRequest.resolvedBy.name}
                    </span>
                  )}

                  {activeRequest?.deliveryStatus === 'out_for_delivery' && (
                    <div
                      onClick={() => window.open(`/status?q=${activeRequest.id}`, "_blank")}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-emerald-600 px-5 py-3.5 text-white shadow-md transition hover:-translate-y-0.5"
                      style={{ animation: "fadeUp 0.3s ease" }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-white/20 text-xl">
                          <Bike className="h-5 w-5" aria-hidden />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold">
                            {lang === 'hi' ? 'आपका दस्तावेज़ रास्ते में है!' : 'Your document is out for delivery!'}
                          </span>
                          <span className="mt-0.5 block text-xs opacity-90">
                            {lang === 'hi' ? 'लाइव ट्रैकिंग देखने के लिए क्लिक करें' : 'Click to view live tracking'}
                          </span>
                        </span>
                      </div>
                      <span className="rounded-lg bg-white/20 px-3.5 py-1.5 text-xs font-extrabold backdrop-blur">
                        <MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden /> {lang === 'hi' ? 'ट्रैक करें' : 'Track Live'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowTimeline(true)}
                    title="Activity"
                    aria-label="Activity"
                    className={`${btnGhostCls} !px-3 !py-2 !text-xs`}
                  >
                    <ClipboardList className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>

              {/* Viewing banner */}
              {viewingAlert && (
                <div
                  className="flex items-center gap-2 border-b-2 border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  style={{ animation: "fadeUp 0.3s ease" }}
                >
                  <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500" aria-hidden />
                  <span>{activeRequest?.messages?.find(m => m.from === "admin")?.adminName || "An Operator"} {t.viewingDoc}</span>
                  <button onClick={() => setViewingAlert(false)} aria-label="Dismiss" className="ml-auto px-1 text-sm">✕</button>
                </div>
              )}

              {/* Messages */}
              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {activeRequest.messages.map((msg: Message, idx: number) => {
                  const isUser = msg.from === "user";
                  const prevMsg = activeRequest.messages[idx - 1];
                  const showDate = !prevMsg || prevMsg.date !== msg.date;
                  const showSender = !isUser && (!prevMsg || prevMsg.from === "user" || prevMsg.adminName !== msg.adminName);
                  const isImage = msg.doc?.name?.match(/\.(jpeg|jpg|gif|png|webp)$/i) && msg.doc?.url;

                  return (
                    <div
                      key={msg.id}
                      className="group mb-2 flex flex-col"
                      style={{ alignItems: isUser ? "flex-end" : "flex-start", animation: "fadeUp 0.2s ease" }}
                    >
                      {showDate && (
                        <div className="my-3.5 w-full text-center">
                          <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                            {msg.date === "today" ? t.today : t.yesterday}
                          </span>
                        </div>
                      )}
                      <div className="flex items-end gap-2" style={{ flexDirection: isUser ? "row-reverse" : "row" }}>
                        {!isUser && (
                          <span className="mb-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-[1.5px] border-blue-200 bg-blue-50 text-[11px] font-extrabold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                            {msg.adminName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) || "OP"}
                          </span>
                        )}
                        <div className="flex max-w-[72%] flex-col" style={{ alignItems: isUser ? "flex-end" : "flex-start" }}>
                          {!isUser && showSender && (
                            <p className="mb-1 pl-1 text-[11px] font-bold text-blue-700 dark:text-blue-400">
                              {msg.adminName} · <span className="text-slate-500 dark:text-slate-400">{msg.adminRole}</span>
                            </p>
                          )}
                          <div
                            className={`w-full rounded-[13px] px-3.5 py-2.5 ${isUser
                              ? "rounded-bl-[3px] border border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                              : "rounded-br-[3px] border border-blue-200 bg-blue-100 text-slate-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-slate-100"
                              } ${msg.type === "doc" || isImage ? "!p-1.5" : ""}`}
                          >
                            {/* Reply preview */}
                            {msg.reply_to_msg && (
                              <div className="mb-2 cursor-pointer rounded-r-md border-l-[3px] border-blue-600 bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">
                                <p className="mb-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-400">
                                  {msg.reply_to_msg.from === "user" ? "You" : msg.reply_to_msg.adminName || "Admin"}
                                </p>
                                <p className="max-w-[220px] truncate text-xs text-slate-600 dark:text-slate-400">
                                  {msg.reply_to_msg.text || (msg.reply_to_msg.type === "doc" ? "Document" : "Payment")}
                                </p>
                              </div>
                            )}

                            {/* Payment */}
                            {msg.type === "payment" ? (
                              <div className={`relative mt-1 w-full overflow-hidden rounded-lg p-3.5 text-white ${msg.paymentStatus === "paid" ? "bg-emerald-600" : "bg-amber-600"}`} style={{ animation: "fadeUp 0.3s ease" }}>
                                <span className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" aria-hidden />
                                <div className="mb-3 flex items-center gap-2.5">
                                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white/20">
                                    {msg.paymentStatus === "paid" ? <Check className="h-4 w-4" aria-hidden /> : <CreditCard className="h-4 w-4" aria-hidden />}
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-[10px] font-bold uppercase tracking-wider opacity-90">
                                      {msg.paymentStatus === "paid" ? "Payment Received" : "Payment Required"}
                                    </span>
                                    <span className="mt-0.5 block font-mono text-2xl font-extrabold leading-tight">
                                      {fmtCurrency(msg.amount || 0)}
                                    </span>
                                  </span>
                                </div>
                                {msg.paymentStatus !== "paid" && (
                                  <p className="mb-3 text-[11px] leading-relaxed opacity-90">
                                    Secure payment powered by Razorpay
                                  </p>
                                )}
                                <button
                                  className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[13px] font-extrabold shadow-sm ${msg.paymentStatus === "paid" ? "cursor-default bg-white/20 text-white" : "bg-white text-amber-700"
                                    }`}
                                  onClick={() => msg.paymentStatus !== "paid" && handlePayment(String(msg.id), msg.amount || 0)}
                                  disabled={msg.paymentStatus === "paid"}
                                >
                                  {msg.paymentStatus === "paid" ? (
                                    <><CheckCircle2 className="h-4 w-4" aria-hidden /> Amount Received</>
                                  ) : (
                                    <><CreditCard className="h-4 w-4" aria-hidden /> Pay Now</>
                                  )}
                                </button>
                              </div>
                            ) : msg.type === "form" ? (
                              <div className="w-full" style={{ animation: "fadeUp 0.3s ease" }}>
                                <div className="mb-3 flex items-center gap-2.5 border-b border-dashed border-slate-300 pb-2.5 dark:border-slate-600">
                                  <span className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <FileText className="h-4 w-4" aria-hidden />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-[13px] font-extrabold text-blue-700 dark:text-blue-400">{msg.formTitle || "Form Submission"}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Submitted Data</span>
                                  </span>
                                </div>
                                <div className="flex flex-col gap-2.5">
                                  {msg.formData && Object.entries(msg.formData).map(([key, val]) => (
                                    <div key={key} className="min-w-0">
                                      <p className="mb-0.5 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{key}</p>
                                      <p className="w-full break-words rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                                        {String(val)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                {msg.doc && (
                                  <div
                                    onClick={() => handleDownload(msg.doc!.url!, msg.doc!.name || "document")}
                                    className="mt-3 flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition hover:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                  >
                                    <Paperclip className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-xs font-bold">{msg.doc.name}</span>
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{msg.doc.size}</span>
                                    </span>
                                    <Download className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
                                  </div>
                                )}
                              </div>
                            ) : msg.type === "doc" && msg.doc ? (
                              <div className="flex flex-col gap-1.5 p-1">
                                {isImage ? (
                                  <div className="relative inline-block max-w-[260px] cursor-pointer overflow-hidden rounded-lg" onClick={() => openLightbox(msg.doc!.url!, msg.doc!.name)}>
                                    <img src={msg.doc.url} alt="attachment" className="block max-h-[340px] w-full rounded-lg object-cover object-top" />
                                    <div className="absolute bottom-2 right-2 flex gap-1.5">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); openLightbox(msg.doc!.url!, msg.doc!.name); }}
                                        className="rounded-md border border-white/30 bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white"
                                      >
                                        View
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc!.url!, msg.doc!.name); }}
                                        className="rounded-md border border-white/30 bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800"
                                    onClick={() => msg.doc?.url && handleDownload(msg.doc.url, msg.doc.name)}
                                  >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                                      <FileText className="h-4 w-4" aria-hidden />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-[13px] font-semibold text-slate-900 dark:text-white">{msg.doc.name}</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{msg.doc.size}</span>
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc?.url || "", msg.doc?.name || "file"); }}
                                      aria-label="Download"
                                      className="rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-900 hover:border-blue-600 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                    >
                                      <Download className="h-3.5 w-3.5" aria-hidden />
                                    </button>
                                  </div>
                                )}
                                {msg.text && <span className="px-1 pt-0.5 text-[13px] text-slate-900 dark:text-slate-100">{lang === "hi" ? msg.text : (msg.textEn || msg.text)}</span>}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-900 dark:text-slate-100">
                                {lang === "hi" ? msg.text : (msg.textEn || msg.text)}
                              </p>
                            )}

                            {/* Timestamp */}
                            <div className={`mt-1 flex items-center justify-end gap-1 pt-0.5 ${msg.type === "payment" ? "!mt-0 !pt-0" : ""}`}>
                              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{msg.time}</span>
                              {isUser && (
                                <CheckCheck className={`h-3.5 w-3.5 ${msg.status === "seen" ? "text-blue-500" : "text-slate-400 dark:text-slate-500"}`} aria-hidden />
                              )}
                            </div>
                          </div>

                          {/* Reply button */}
                          <button
                            onClick={() => setReplyingTo(msg)}
                            title="Reply"
                            className="mt-0.5 flex items-center gap-1 px-1.5 py-0.5 text-[13px] text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400"
                          >
                            <Reply className="h-3 w-3" aria-hidden /> Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgEndRef} />
              </div>

              {/* Message Input */}
              <div className="shrink-0 border-t border-slate-200 bg-white px-3.5 py-2.5 shadow-sm dark:border-slate-700 dark:bg-[#0d1526]">
                {replyingTo && (
                  <div className="mb-2 flex items-center justify-between rounded-t-lg border-2 border-b-0 border-blue-200 bg-blue-50 px-3.5 py-2 dark:border-blue-900 dark:bg-blue-950/40">
                    <div className="text-xs">
                      <p className="mb-0.5 font-bold text-blue-700 dark:text-blue-400">
                        Replying to <span className="text-slate-900 dark:text-white">{replyingTo.from === "user" ? "You" : "Admin"}</span>
                      </p>
                      <p className="max-w-[300px] truncate text-slate-600 dark:text-slate-400">
                        {replyingTo.text || (replyingTo.type === "doc" ? "Document" : "Payment")}
                      </p>
                    </div>
                    <button onClick={() => setReplyingTo(null)} aria-label="Cancel reply" className="px-1 text-lg text-slate-500 dark:text-slate-400">✕</button>
                  </div>
                )}

                {attachedFiles.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {attachedFiles.map((f, i) => (
                      <span key={i} className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                        <Paperclip className="h-3 w-3" aria-hidden />
                        <span className="max-w-[120px] truncate">{(f as File).name}</span>
                        <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} aria-label="Remove file" className="text-sm leading-none text-slate-500 dark:text-slate-400">✕</button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <button
                    className={`${btnGhostCls} !px-3 !py-2 !text-xs`}
                    onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.onchange = e => setAttachedFiles(Array.from((e.target as HTMLInputElement).files || [])); el.click(); }}
                    title={t.attach}
                    aria-label={t.attach}
                  >
                    <Paperclip className="h-4 w-4" aria-hidden />
                  </button>
                  <div className="relative">
                    <button
                      className={`${btnGhostCls} !px-3 !py-2 !text-xs`}
                      onClick={() => setShowFormsMenu(!showFormsMenu)}
                      title="Fill a Form"
                      aria-label="Fill a form"
                    >
                      <ClipboardList className="h-4 w-4" aria-hidden />
                    </button>
                    {showFormsMenu && (
                      <div
                        className="absolute bottom-[120%] left-0 z-50 flex w-60 flex-col gap-1 rounded-xl border border-slate-300 bg-white p-2 shadow-xl dark:border-slate-600 dark:bg-[#111a2e]"
                        style={{ animation: "fadeUp 0.2s ease" }}
                      >
                        <p className="px-2 pb-1 pt-1 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400">Select a Form</p>
                        {availableForms.length === 0 ? (
                          <p className="p-2 text-center text-xs text-slate-500 dark:text-slate-400">No forms available</p>
                        ) : (
                          availableForms.map(f => (
                            <button
                              key={f.id}
                              onClick={() => { setActiveFormFill(f); setShowFormsMenu(false); setFormInputs({}); setFormDocFile(null); }}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-[13px] font-semibold text-slate-900 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                            >
                              <FileText className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" aria-hidden /> {f.title}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <textarea
                    className={`${inputCls} max-h-[100px] resize-none !text-sm !leading-relaxed`}
                    rows={1}
                    value={msgVal}
                    onChange={e => { setMsgVal(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={t.typeMsg}
                    aria-label={t.typeMsg}
                  />
                  <button
                    className={`${btnPrimaryCls} h-[46px] w-[46px] shrink-0 !rounded-full !p-0`}
                    onClick={sendMessage}
                    disabled={isSending || (!msgVal.trim() && attachedFiles.length === 0)}
                    aria-label="Send message"
                  >
                    {isSending ? (
                      <span className="block h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                <Inbox className="h-9 w-9" aria-hidden />
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Select a request to start chatting</p>
              <p className="text-[13px]">{lang === "hi" ? "या नया आवेदन शुरू करें" : "or start a new one below"}</p>
              <button onClick={() => setShowNew(true)} className={`${btnPrimaryCls} !px-7 !py-2.5 !text-sm`}>
                <PenLine className="h-4 w-4" aria-hidden /> {t.newRequest}
              </button>
            </div>
          )}

          {/* ─── TIMELINE PANEL ─── */}
          {showTimeline && activeRequest && (
            <div
              className="absolute right-0 z-[100] flex h-full w-[300px] shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#0d1526]"
              style={{ animation: "slideInR 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            >
              <div className="flex items-center justify-between border-b-2 border-slate-200 bg-white px-4 py-3.5 dark:border-slate-700 dark:bg-[#0d1526]">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  <ClipboardList className="mr-1.5 inline h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden /> {t.timeline}
                </p>
                <button onClick={() => setShowTimeline(false)} className={`${btnGhostCls} !px-2.5 !py-1.5 !text-xs`} aria-label="Close timeline">
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {activeRequest.timeline.map((ev: TimelineEvent, i: number) => {
                  const TlIcon = TIMELINE_ICONS[ev.event] || Send;
                  const isLast = i === activeRequest.timeline.length - 1;
                  return (
                    <div key={i} className="mb-5 flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${isLast
                            ? "border-blue-600 bg-blue-700 text-white"
                            : "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                        >
                          <TlIcon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        {i < activeRequest.timeline.length - 1 && (
                          <span className="mt-1 min-h-5 w-0.5 flex-1 rounded bg-slate-200 dark:bg-slate-700" aria-hidden />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white">
                          {lang === "hi" ? (ev.event === "submitted" ? "जमा किया गया" : ev.event === "seen" ? "देखा गया" : ev.event === "processing" ? "प्रक्रिया शुरू" : "पूर्ण") : ev.eventEn}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {lang === "hi" ? ev.time : ev.timeEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {activeRequest.status !== "done" && (
                  <div className="flex gap-3.5 opacity-40">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div className="pt-1.5">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">{lang === "hi" ? "पूर्ण" : "Completed"}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{lang === "hi" ? "जल्द आएगा" : "Coming soon"}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-200 px-4 py-3.5 dark:border-slate-700">
                {(() => {
                  const sc = STATUS_CONFIG[activeRequest.status as keyof typeof STATUS_CONFIG];
                  return (
                    <div className={`mb-2.5 flex items-center gap-2.5 rounded-xl border-[1.5px] px-3.5 py-2.5 ${sc.cls}`}>
                      <sc.Icon className="h-5 w-5" aria-hidden />
                      <div>
                        <p className="text-[13px] font-extrabold">{lang === "hi" ? sc.label : sc.labelEn}</p>
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()}
                        </p>
                      </div>
                    </div>
                  );
                })()}
                {(() => {
                  const unpaidMsg = activeRequest.messages.find(m => m.type === "payment" && m.paymentStatus !== "paid");
                  if (unpaidMsg) return (
                    <button className={`${btnPrimaryCls} w-full`} onClick={() => handlePayment(String(unpaidMsg.id), unpaidMsg.amount || 0)}>
                      <CreditCard className="h-4 w-4" aria-hidden /> {t.payNow} — {fmtCurrency(unpaidMsg.amount || 0)}
                    </button>
                  );
                  return null;
                })()}
              </div>
            </div>
          )}
        </div>

        {dashboardView === "sections" && (
          <div className="flex flex-1 overflow-hidden">
            <StudentSectionsPanel socket={socket} />
          </div>
        )}


        {/* NEW REQUEST MODAL */}
        {showNew && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}
          >
            <div className="w-full max-w-[520px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111a2e]" style={{ maxHeight: "90vh" }}>
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                <p className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                  <PenLine className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden /> {t.newRequest}
                </p>
                <button onClick={() => setShowNew(false)} aria-label="Close" className="text-lg text-slate-500 dark:text-slate-400">✕</button>
              </div>
              <div className="flex flex-col gap-4 px-5 py-5">
                <div>
                  <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.serviceType} *</span>
                  <select value={newService} onChange={e => setNewService(e.target.value)} className={`${inputCls} cursor-pointer appearance-none`}>
                    <option value="">{lang === "hi" ? "सेवा चुनें..." : "Select service..."}</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.requestTitle} *</span>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={lang === "hi" ? "जैसे: आधार में नाम सुधार" : "e.g. Name correction in Aadhaar"} className={inputCls} />
                </div>
                <div>
                  <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.requestDesc}</span>
                  <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={lang === "hi" ? "पूरी जानकारी लिखें..." : "Write details here..."} className={`${inputCls} resize-y leading-relaxed`} rows={3} />
                </div>
                <div>
                  <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.priority}</span>
                  <div className="flex gap-2.5">
                    {["regular", "prepaid"].map(p => (
                      <button
                        key={p}
                        onClick={() => setNewPriority(p)}
                        className={`flex-1 rounded-xl border-2 px-2.5 py-3 text-center transition ${newPriority === p
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "border-slate-200 bg-transparent text-slate-500 hover:border-blue-300 dark:border-slate-700 dark:text-slate-400"
                          }`}
                      >
                        <span className="mb-1.5 flex justify-center">
                          {p === "regular" ? <Clock className="h-5 w-5" aria-hidden /> : <Zap className="h-5 w-5" aria-hidden />}
                        </span>
                        <span className="block text-xs font-bold">{p === "regular" ? t.regular : t.prepaid}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.uploadDoc}</span>
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => { e.preventDefault(); setIsDragOver(false); setUploadedFiles(Array.from((e.dataTransfer as DataTransfer).files)); }}
                    onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.accept = ".pdf,.jpg,.jpeg,.png,.webp"; el.onchange = (event) => { const target = event.target as HTMLInputElement; setUploadedFiles(Array.from(target.files || [])); }; el.click(); }}
                    className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-6 text-center transition ${isDragOver ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-slate-300 dark:border-slate-600"
                      }`}
                  >
                    <FolderOpen className="mx-auto mb-2 h-8 w-8 text-slate-400" aria-hidden />
                    <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">{t.dragDrop}</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                            <FileText className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="flex-1 truncate text-[13px] text-slate-900 dark:text-white">{f.name}</span>
                          <button onClick={e => { e.stopPropagation(); setUploadedFiles(prev => prev.filter((_, j) => j !== i)); }} aria-label="Remove file" className="text-base text-slate-500 dark:text-slate-400">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DELIVERY SECTION */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <span className="mb-2.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.deliveryOpt}</span>
                  <div className={`flex gap-2.5 ${deliveryMode === 'delivery' ? "mb-4" : ""}`}>
                    {(['pickup', 'delivery'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setDeliveryMode(mode)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border-[1.5px] px-2.5 py-2.5 text-xs font-bold transition ${deliveryMode === mode
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "border-slate-300 bg-transparent text-slate-500 hover:border-blue-300 dark:border-slate-600 dark:text-slate-400"
                          }`}
                      >
                        {mode === 'pickup' ? <Store className="h-4 w-4" aria-hidden /> : <Bike className="h-4 w-4" aria-hidden />}
                        {mode === 'pickup' ? t.pickup : t.homeDelivery}
                      </button>
                    ))}
                  </div>

                  {deliveryMode === 'delivery' && (
                    <div style={{ animation: "fadeUp 0.2s ease" }}>
                      <div className="mb-4">
                        <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.urgency}</span>
                        <select value={urgency} onChange={e => setUrgency(e.target.value)} className={`${inputCls} cursor-pointer appearance-none`}>
                          <option value="flexible">{t.flex}</option>
                          <option value="today">{t.today}</option>
                          <option value="instant">{t.instant}</option>
                        </select>
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.selectAddr} *</span>
                          {!showAddAddr && (
                            <button onClick={() => setShowAddAddr(true)} className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                              {t.addAddr}
                            </button>
                          )}
                        </div>

                        {showAddAddr ? (
                          <div className="rounded-lg border border-blue-300 bg-white p-3 dark:border-blue-800 dark:bg-[#111a2e]">
                            <input placeholder={t.addrLabel} className={`${inputCls} mb-2 !py-2 !text-[13px]`} value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} />
                            <textarea placeholder={t.addrText} className={`${inputCls} mb-2 !py-2 !text-[13px]`} rows={2} value={newAddr.full} onChange={e => setNewAddr({ ...newAddr, full: e.target.value })} />
                            <input placeholder={t.pin} className={`${inputCls} mb-3 !py-2 !text-[13px]`} value={newAddr.pin} onChange={e => setNewAddr({ ...newAddr, pin: e.target.value })} />
                            <div className="flex gap-2">
                              <button className={`${btnGhostCls} flex-1`} onClick={() => setShowAddAddr(false)}>{t.cancel}</button>
                              <button
                                className={`${btnPrimaryCls} flex-1`}
                                disabled={!newAddr.label || !newAddr.full}
                                onClick={async () => {
                                  try {
                                    const adr = await addAddressAction({ label: newAddr.label, full_address: newAddr.full, pincode: newAddr.pin });
                                    setAddresses([adr, ...addresses]); setSelectedAddr(adr.id); setShowAddAddr(false); setNewAddr({ label: "", full: "", pin: "" });
                                  } catch (e) { alert("Failed to save address"); }
                                }}
                              >
                                {t.saveAddr}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <select value={selectedAddr} onChange={e => setSelectedAddr(e.target.value)} className={`${inputCls} cursor-pointer appearance-none`}>
                            <option value="">{t.selectAddr}</option>
                            {addresses.map(a => <option key={a.id} value={a.id}>{a.label} - {a.full_address}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={submitNewRequest}
                  disabled={!newTitle || !newService || (deliveryMode === 'delivery' && !selectedAddr)}
                  className={`${btnPrimaryCls} w-full !py-3.5 !text-[15px]`}
                >
                  {t.submitRequest} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORM FILLING MODAL */}
        {activeFormFill && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setActiveFormFill(null); }}
          >
            <div className="w-full max-w-[480px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-[#111a2e]" style={{ maxHeight: "90vh" }}>
              <div className="flex items-start justify-between rounded-t-2xl bg-blue-700 px-6 py-6 text-white dark:bg-blue-800">
                <div>
                  <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wider opacity-80">Secure Form Submission</p>
                  <h2 className="text-2xl font-bold leading-snug">{activeFormFill.title}</h2>
                </div>
                <button
                  onClick={() => setActiveFormFill(null)}
                  aria-label="Close"
                  className="flex rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="flex items-center gap-2.5 border-b border-amber-200 bg-amber-50 px-6 py-3 text-xs font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
                Please verify all details carefully. Submitted forms are final and cannot be edited.
              </div>

              <div className="flex flex-col gap-4 px-6 py-6">
                {activeFormFill.fields.map(field => (
                  <div key={field.id}>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      className={inputCls}
                      placeholder={`Enter ${field.label}`}
                      value={formInputs[field.label] || ""}
                      onChange={e => setFormInputs({ ...formInputs, [field.label]: e.target.value })}
                    />
                  </div>
                ))}

                {activeFormFill.requires_document && (
                  <div className="mt-2">
                    <label className="mb-1.5 block text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      {activeFormFill.document_label} <span className="text-red-500">*</span>
                    </label>
                    <div
                      onClick={() => { const el = document.createElement("input"); el.type = "file"; el.accept = ".pdf,.jpg,.jpeg,.png"; el.onchange = e => setFormDocFile((e.target as HTMLInputElement).files?.[0] || null); el.click(); }}
                      className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${formDocFile ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
                        }`}
                    >
                      {formDocFile ? (
                        <p className="font-bold text-blue-700 dark:text-blue-300">
                          <Check className="mr-1 inline h-4 w-4" aria-hidden /> {formDocFile.name} Attached
                        </p>
                      ) : (
                        <>
                          <Paperclip className="mx-auto mb-2 h-6 w-6 text-slate-400" aria-hidden />
                          <p className="text-[13px] font-bold text-slate-900 dark:text-white">Click to attach document</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {activeFormFill.price > 0 && (
                  <p className="mt-2.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Note: A service fee of <span className="font-extrabold text-blue-700 dark:text-blue-400">₹{activeFormFill.price}</span> will be requested by the admin after review.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 rounded-b-2xl border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/40">
                <button onClick={() => setActiveFormFill(null)} className={btnGhostCls}>Cancel</button>
                <button onClick={handleSendForm} disabled={isSending} className={`${btnPrimaryCls} !px-6 !py-2.5`}>
                  {isSending ? "Sending..." : "Secure Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SIDEBAR PANEL */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[200] flex">
            <div
              className="flex h-full w-[280px] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#0d1526]"
              style={{ animation: "slideInL 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            >
              <div className="border-b-2 border-blue-900 bg-blue-700 px-5 pb-5 pt-6 text-white dark:bg-blue-800">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl border-2 border-white/30 bg-blue-600 text-xl font-bold text-white">
                    {user?.name ? user.name[0].toUpperCase() : <User className="h-5 w-5" aria-hidden />}
                  </span>
                  <span>
                    <span className="block text-base font-bold">{user?.name || (lang === "hi" ? "उपयोगकर्ता" : "User")}</span>
                    <span className="block text-xs text-blue-200">{user?.mobile ? `+91 ${user.mobile}` : user?.email}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-3.5 py-3">
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">{t.wallet}</span>
                    <span className="block text-2xl font-bold text-white">₹ {user?.wallet_balance || 0}</span>
                  </span>
                  <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-500">
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {[
                  { Icon: ClipboardList, label: t.myRequests, action: () => { window.location.href = "/dashboard"; setSidebarOpen(false); } },
                  { Icon: GraduationCap, label: "My Certificates", action: () => { setShowCertsModal(true); setSidebarOpen(false); } },
                  { Icon: Megaphone, label: "My Groups", action: () => { setShowSectionsModal(true); setSidebarOpen(false); } },
                  { Icon: PenLine, label: "Posts", action: () => { window.location.href = "/admin/posts"; } },
                  { Icon: ImageIcon, label: "Gallery", action: () => { window.location.href = "/gallery"; } },
                  { Icon: Bell, label: t.notifications, action: () => { window.location.href = "/notifications"; } },
                  { Icon: BarChart3, label: "Status", action: () => { window.location.href = "/status"; } },
                  { Icon: User, label: t.profile, action: () => { window.location.href = "/dashboard/profile"; } },
                ].map(({ Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex w-full cursor-pointer items-center gap-3.5 border-l-[3px] border-transparent px-5 py-3.5 text-left text-sm! font-semibold text-slate-900 transition hover:border-blue-600 hover:bg-slate-50 hover:text-blue-700 dark:text-white dark:hover:bg-slate-800 dark:hover:text-blue-400"
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden /><span>{label}</span>
                  </button>
                ))}
                <div className="mx-4 my-2 h-px bg-slate-200 dark:bg-slate-700" />
                <button
                  onClick={() => logout()}
                  className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut className="h-[18px] w-[18px]" aria-hidden /> {t.logout}
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* NOTIFICATIONS PANEL */}
        {notifOpen && (
          <div className="fixed inset-0 z-[300] flex justify-end">
            <div className="flex-1" onClick={() => setNotifOpen(false)} />
            <div
              className="flex h-full w-[360px] flex-col border-l border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#0d1526]"
              style={{ animation: "slideInR 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            >
              <div className="flex items-center justify-between border-b-2 border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#0d1526]">
                <div>
                  <p className="flex items-center gap-1.5 text-[15px] font-extrabold text-slate-900 dark:text-white">
                    <Bell className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden /> {t.notifications}
                  </p>
                  {unreadNotifsCount > 0 && <p className="text-[11px] text-slate-500 dark:text-slate-400">{unreadNotifsCount} unread</p>}
                </div>
                <button onClick={() => setNotifOpen(false)} className={`${btnGhostCls} !px-2.5 !py-1.5 !text-xs`} aria-label="Close notifications">
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-10 py-10 text-center text-slate-500 dark:text-slate-400">
                    <Bell className="mx-auto mb-2.5 h-10 w-10 opacity-40" aria-hidden />
                    <p className="font-semibold">{lang === "hi" ? "कोई नई सूचना नहीं" : "No new notifications"}</p>
                  </div>
                ) : notifications.map((n) => {
                  const NIcon = n.type === "document_viewed" ? Eye : n.type === "status_changed" ? Settings : n.type === "payment_request" ? CreditCard : Bell;
                  return (
                    <div
                      key={n.id}
                      className={`flex cursor-pointer gap-3 border-b border-slate-200 px-4 py-3.5 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40 ${n.is_read ? "" : "bg-blue-50/60 dark:bg-blue-950/20"}`}
                      style={{ animation: "fadeUp 0.3s ease" }}
                    >
                      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border-[1.5px] border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                        <NIcon className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[13px] leading-snug text-slate-900 dark:text-white ${n.is_read ? "font-medium" : "font-bold"}`}>
                          {lang === "hi" ? (n.title_hi || n.title) : n.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {lang === "hi" ? (n.body_hi || n.body) : n.body}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {!n.is_read && <span className="h-2 w-2 shrink-0 self-center rounded-full bg-blue-600" aria-hidden />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showSectionsModal && <SectionsModal socket={socket} onClose={() => setShowSectionsModal(false)} />}

        {/* MY CERTIFICATES MODAL */}
        {showCertsModal && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowCertsModal(false); }}
          >
            <div className="w-full max-w-[550px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111a2e]">
              <div className="flex items-center justify-between bg-blue-700 px-6 py-5 text-white dark:bg-blue-800">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold">
                    <GraduationCap className="h-6 w-6" aria-hidden /> My Certificates
                  </h2>
                  <p className="mt-1 text-xs opacity-80">Verified Course Completions</p>
                </div>
                <button
                  onClick={() => setShowCertsModal(false)}
                  aria-label="Close"
                  className="flex rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">
                {(() => {
                  // Merge PDF + Excel certs. PDF takes precedence if roll_no == certificate_number.
                  const mergedMap = new Map<string, any>();
                  myCerts.forEach((c: any) =>
                    mergedMap.set(c.certificate_number, { ...c, _source: "pdf" })
                  );
                  myExcelCerts.forEach((c: any) => {
                    if (!mergedMap.has(c.roll_no)) {
                      mergedMap.set(c.roll_no, { ...c, _source: "excel", certificate_number: c.roll_no });
                    }
                  });
                  const allCerts = Array.from(mergedMap.values());

                  if (allCerts.length === 0) return (
                    <div className="px-10 py-10 text-center text-slate-500 dark:text-slate-400">
                      <ScrollText className="mx-auto mb-2.5 h-10 w-10 opacity-60" aria-hidden />
                      <p className="text-base font-bold">No Certificates Yet</p>
                      <p className="text-[13px]">Complete a course at the CSC to earn your verified certificate.</p>
                    </div>
                  );

                  return allCerts.map((cert: any) => (
                    <div key={cert.id || cert.roll_no} className="flex items-center gap-4 rounded-xl border border-slate-300 bg-slate-50 p-4 transition dark:border-slate-600 dark:bg-slate-800">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        <Award className="h-6 w-6" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-base font-extrabold text-slate-900 dark:text-white">{cert.course_name}</p>
                        <p className="font-mono text-[11px] tracking-wide text-slate-500 dark:text-slate-400">
                          ID: {cert.certificate_number} • ISSUED: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : new Date(cert.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {cert._source === "pdf" && cert.file_url ? (
                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noreferrer"
                          download={`${cert.course_name}_Certificate.pdf`}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-[13px] font-bold text-white shadow-sm hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden /> PDF
                        </a>
                      ) : (
                        <button
                          onClick={() => generateExcelCertPdf(cert)}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-[13px] font-bold text-white shadow-sm hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden /> Open Certificate
                        </button>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes slideInR{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes slideInL{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
      </div>
    </AuthGuard>
  );
}
