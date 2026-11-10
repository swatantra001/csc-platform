
// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useAuth } from "@/components/AuthProvider";
// import {
//   getFormsAction,
//   createFormAction,
//   updateFormAction,
//   deleteFormAction,
// } from "@/app/actions/forms";

// // ════════════════════════════════════════════════════════════════════════════════
// // TYPES
// // ════════════════════════════════════════════════════════════════════════════════
// interface FormField {
//   id: string;
//   label: string;
//   required: boolean;
// }
// interface DbForm {
//   id: string;
//   title: string;
//   price: number;
//   requires_document: boolean;
//   document_label: string | null;
//   fields: FormField[];
//   created_at: string;
// }

// type UserRole = "user" | "co_admin" | "main_admin";

// // ════════════════════════════════════════════════════════════════════════════════
// // DUAL THEME TOKENS — Exact match to reference
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

//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#64748b",
//     pillActiveBg: "#dbeafe",
//     pillActiveBorder: "#93c5fd",
//     pillActiveText: "#1d4ed8",

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

//     pillBg: "rgba(255,255,255,0.03)",
//     pillBorder: "rgba(255,255,255,0.08)",
//     pillText: "rgba(255,255,255,0.4)",
//     pillActiveBg: "rgba(245,158,11,0.15)",
//     pillActiveBorder: "rgba(245,158,11,0.4)",
//     pillActiveText: "#f59e0b",

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
// // NAV LINKS
// // ════════════════════════════════════════════════════════════════════════════════
// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
// ];

// // ════════════════════════════════════════════════════════════════════════════════
// // ICONS (inline SVG)
// // ════════════════════════════════════════════════════════════════════════════════
// const Ico = {
//   Search: () => (
//     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <circle cx="11" cy="11" r="7" />
//       <path d="M21 21l-4-4" />
//     </svg>
//   ),
//   Plus: () => (
//     <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//       <line x1="12" y1="5" x2="12" y2="19" />
//       <line x1="5" y1="12" x2="19" y2="12" />
//     </svg>
//   ),
//   X: () => (
//     <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//       <line x1="18" y1="6" x2="6" y2="18" />
//       <line x1="6" y1="6" x2="18" y2="18" />
//     </svg>
//   ),
//   Edit: () => (
//     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
//       <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
//     </svg>
//   ),
//   Trash: () => (
//     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <polyline points="3 6 5 6 21 6" />
//       <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
//     </svg>
//   ),
//   ChevronLeft: () => (
//     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//       <polyline points="15 18 9 12 15 6" />
//     </svg>
//   ),
//   Robot: () => (
//     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <path
//         d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9 13v2M15 13v2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   ),
//   Copy: () => (
//     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
//       <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
//     </svg>
//   ),
//   Doc: () => (
//     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
//       <polyline points="14 2 14 8 20 8" />
//       <line x1="16" y1="13" x2="8" y2="13" />
//       <line x1="16" y1="17" x2="8" y2="17" />
//     </svg>
//   ),
//   Check: () => (
//     <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//       <polyline points="20 6 9 17 4 12" />
//     </svg>
//   ),
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // AVATAR
// // ════════════════════════════════════════════════════════════════════════════════
// function Avatar({
//   name,
//   size = 40,
//   role,
//   isDark,
// }: {
//   name?: string | null;
//   size?: number;
//   role?: UserRole;
//   isDark: boolean;
// }) {
//   const ch = name?.charAt(0).toUpperCase() || "?";
//   const grad =
//     role === "main_admin"
//       ? isDark
//         ? "linear-gradient(135deg,#f59e0b,#d97706)"
//         : "linear-gradient(135deg,#1d4ed8,#1e3a8a)"
//       : role === "co_admin"
//         ? isDark
//           ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
//           : "linear-gradient(135deg,#2563eb,#3b82f6)"
//         : isDark
//           ? "linear-gradient(135deg,#334155,#1e293b)"
//           : "linear-gradient(135deg,#64748b,#475569)";
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         borderRadius: "50%",
//         background: grad,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "#fff",
//         fontWeight: 700,
//         fontSize: size * 0.38,
//         flexShrink: 0,
//         border: "1.5px solid rgba(255,255,255,0.18)",
//       }}
//     >
//       {ch}
//     </div>
//   );
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // SECTION HEADER
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
// // GENERATED CSS
// // ════════════════════════════════════════════════════════════════════════════════
// function buildCss(T: ThemeTokens): string {
//   return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans',sans-serif;}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// .mono{font-family:'JetBrains Mono',monospace;}

// .top-nav-link{
//   display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
//   font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
//   transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
// }
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

// .sec-tab{
//   display:flex;flex-direction:column;align-items:center;gap:4px;
//   padding:10px 22px;cursor:pointer;background:transparent;border:none;
//   border-bottom:2px solid transparent;color:${T.subTabText};
//   font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
//   transition:all .15s;font-family:'DM Sans',sans-serif;
// }
// .sec-tab.on{color:${T.subTabActive};border-bottom-color:${T.subTabBorder};}
// .sec-tab:hover:not(.on){color:${T.textSecondary};}

// .pill{
//   padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
//   cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
//   background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
// }
// .pill:hover{border-color:${T.accent};color:${T.accent};}
// .pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

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

// .inp{
//   width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
//   border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
//   transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
// }
// .inp:focus{border-color:${T.inputFocusBorder};}
// .inp::placeholder{color:${T.inputPlaceholder};}
// select.inp option{background:${T.modalBg};color:${T.inputText};}

// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

// .sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
// .sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

// .tcard{background:${T.teamCardBg};border:1px solid ${T.teamCardBorder};border-radius:12px;padding:20px;transition:all .2s;}
// .tcard:hover{background:${T.teamCardHover};transform:translateY(-2px);box-shadow:${T.cardShadow};}

// .modal-ov{position:fixed;inset:0;background:${T.modalOverlay};backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
// .modal-bx{background:${T.modalBg};border:1px solid ${T.modalBorder};border-radius:14px;width:100%;max-width:460px;animation:pop .2s ease;box-shadow:0 30px 60px rgba(0,0,0,0.25);}

// .tog{
//   display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
//   border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
//   color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
//   transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
// }
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

// @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
// @keyframes spin{to{transform:rotate(360deg)}}
// `;
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // AI PROMPT
// // ════════════════════════════════════════════════════════════════════════════════
// const AI_PROMPT = `I am building an application form for [INSERT SERVICE NAME HERE] at my Jan Seva Kendra (CSC) in India.
// Give me a suitable form title, an estimated service price in INR, and a list of all required fields to collect from the citizen.
// Output ONLY a raw JSON object. No markdown, no explanations, no formatting.
// Format:
// {
//   "title": "Perfect Title for the Form",
//   "price": 50,
//   "fields": [
//     {"label": "Applicant Full Name", "required": true},
//     {"label": "Date of Birth", "required": true}
//   ]
// }`;

// // ════════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ════════════════════════════════════════════════════════════════════════════════
// export default function AdminFormsPage() {
//   const [isDark, setIsDark] = useState(false);
//   const T = isDark ? THEMES.dark : THEMES.light;
//   const { user } = useAuth();

//   const [forms, setForms] = useState<DbForm[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingForm, setEditingForm] = useState<DbForm | null>(null);

//   // AI Tutorial State
//   const [showAIGuide, setShowAIGuide] = useState(false);
//   const [aiStep, setAiStep] = useState(1);
//   const [copied, setCopied] = useState(false);

//   // Form State
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState<number>(0);
//   const [reqDoc, setReqDoc] = useState(false);
//   const [docLabel, setDocLabel] = useState("");
//   const [fields, setFields] = useState<FormField[]>([]);

//   // Theme persistence
//   useEffect(() => {
//     const saved = localStorage.getItem("csc_theme");
//     if (saved) setIsDark(saved === "dark");
//     else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("csc_theme", isDark ? "dark" : "light");
//   }, [isDark]);

//   useEffect(() => {
//     loadForms();
//   }, []);

//   const loadForms = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getFormsAction();
//       setForms(data as unknown as DbForm[]);
//     } catch (e) {
//       console.error("Failed to load forms", e);
//     }
//     setIsLoading(false);
//   };

//   // AI Paste Listener
//   useEffect(() => {
//     const handlePaste = (e: ClipboardEvent) => {
//       if (!isModalOpen) return;
//       try {
//         const text = e.clipboardData?.getData("text");
//         if (!text) return;
//         const parsed = JSON.parse(text);

//         if (
//           parsed &&
//           typeof parsed === "object" &&
//           !Array.isArray(parsed) &&
//           parsed.fields &&
//           Array.isArray(parsed.fields)
//         ) {
//           e.preventDefault();
//           if (parsed.title) setTitle(parsed.title);
//           if (parsed.price !== undefined) setPrice(Number(parsed.price));

//           const newFields = parsed.fields.map((f: any) => ({
//             id: `f_${Date.now()}_${Math.random()}`,
//             label: f.label,
//             required: !!f.required,
//           }));
//           setFields((prev) => [...prev, ...newFields]);
//           alert(`✅ Imported "${parsed.title || "Form"}" with ${newFields.length} fields!`);
//         } else if (
//           Array.isArray(parsed) &&
//           parsed.length > 0 &&
//           parsed[0].label !== undefined
//         ) {
//           e.preventDefault();
//           const newFields = parsed.map((f: any) => ({
//             id: `f_${Date.now()}_${Math.random()}`,
//             label: f.label,
//             required: !!f.required,
//           }));
//           setFields((prev) => [...prev, ...newFields]);
//           alert(`✅ Imported ${newFields.length} fields from AI!`);
//         }
//       } catch {
//         /* not JSON */
//       }
//     };
//     document.addEventListener("paste", handlePaste);
//     return () => document.removeEventListener("paste", handlePaste);
//   }, [isModalOpen]);

//   const openNewForm = () => {
//     setEditingForm(null);
//     setTitle("");
//     setPrice(0);
//     setReqDoc(false);
//     setDocLabel("");
//     setFields([]);
//     setIsModalOpen(true);
//   };

//   const openEditForm = (f: DbForm) => {
//     setEditingForm(f);
//     setTitle(f.title);
//     setPrice(f.price);
//     setReqDoc(f.requires_document);
//     setDocLabel(f.document_label || "");
//     setFields(f.fields || []);
//     setIsModalOpen(true);
//   };

//   const addField = () =>
//     setFields([...fields, { id: `f_${Date.now()}`, label: "", required: false }]);
//   const removeField = (id: string) => setFields(fields.filter((f) => f.id !== id));
//   const updateField = (id: string, key: keyof FormField, val: any) =>
//     setFields(fields.map((f) => (f.id === id ? { ...f, [key]: val } : f)));

//   const handleSave = async () => {
//     if (!title.trim()) return alert("Title is required!");
//     if (reqDoc && !docLabel.trim())
//       return alert("Document label is required if document is requested!");

//     const payload = {
//       title,
//       price,
//       requires_document: reqDoc,
//       document_label: reqDoc ? docLabel : null,
//       fields,
//     };

//     try {
//       if (editingForm) await updateFormAction(editingForm.id, payload);
//       else await createFormAction(payload);
//       setIsModalOpen(false);
//       loadForms();
//     } catch (e: any) {
//       alert(e.message);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this form?")) return;
//     try {
//       await deleteFormAction(id);
//       loadForms();
//     } catch (e: any) {
//       alert(e.message);
//     }
//   };

//   // ── Helpers ───────────────────────────────────────────────────────────────
//   const modalHdrStyle: React.CSSProperties = {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "17px 22px",
//     borderBottom: `1px solid ${T.divider}`,
//   };
//   const modalHdrTitle: React.CSSProperties = {
//     fontSize: 16,
//     fontWeight: 700,
//     color: T.textPrimary,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     fontFamily: "'DM Serif Display', serif",
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: T.pageBg,
//         color: T.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//         transition: "background .25s, color .25s",
//       }}
//     >
//       <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

//       {/* ════════════════════════════════════════════════════════
//           HEADER
//       ════════════════════════════════════════════════════════ */}
//       <header
//         style={{
//           background: T.navBg,
//           borderBottom: `3px solid ${T.navBottomBorder}`,
//           flexShrink: 0,
//           zIndex: 100,
//           boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
//         }}
//       >
//         {/* Row 1 — brand + nav links + toggle + user */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             height: 54,
//             padding: "0 20px",
//             gap: 14,
//             borderBottom: "1px solid rgba(255,255,255,0.07)",
//           }}
//         >
//           {/* Brand */}
//           <Link
//             href="/"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               textDecoration: "none",
//               flexShrink: 0,
//             }}
//           >
//             <div
//               style={{
//                 width: 34,
//                 height: 34,
//                 background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`,
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 17,
//               }}
//             >
//               🏛️
//             </div>
//             <div>
//               <div
//                 className="serif"
//                 style={{
//                   fontSize: 17,
//                   color: T.navBrand,
//                   letterSpacing: "-0.3px",
//                   lineHeight: 1,
//                 }}
//               >
//                 Shrilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div
//                 className="mono"
//                 style={{
//                   fontSize: 9,
//                   color: "rgba(255,255,255,0.35)",
//                   letterSpacing: ".1em",
//                 }}
//               >
//                 ADMIN PANEL
//               </div>
//             </div>
//           </Link>

//           <div
//             style={{
//               width: 1,
//               height: 26,
//               background: "rgba(255,255,255,0.12)",
//               flexShrink: 0,
//             }}
//           />

//           {/* Nav links */}
//           <nav
//             style={{
//               display: "flex",
//               gap: 3,
//               flex: 1,
//               overflowX: "auto",
//             }}
//           >
//             {NAV_LINKS.map((l) => (
//               <Link key={l.href} href={l.href} className="top-nav-link">
//                 {l.label}
//               </Link>
//             ))}
//           </nav>

//           {/* Theme toggle */}
//           <button className="tog" onClick={() => setIsDark((d) => !d)}>
//             <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
//           </button>

//           {/* User chip */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 9,
//               padding: "5px 12px",
//               background: "rgba(255,255,255,0.1)",
//               borderRadius: 9,
//               border: "1px solid rgba(255,255,255,0.15)",
//               flexShrink: 0,
//             }}
//           >
//             <Avatar
//               name={user?.name}
//               size={28}
//               role={(user?.role as UserRole) || "user"}
//               isDark={isDark}
//             />
//             <div>
//               <div
//                 style={{
//                   fontSize: 13,
//                   fontWeight: 700,
//                   color: "#fff",
//                   lineHeight: 1,
//                 }}
//               >
//                 {user?.name || "Admin"}
//               </div>
//               <div
//                 className="mono"
//                 style={{
//                   fontSize: 9,
//                   color: T.navBrandAccent,
//                   marginTop: 2,
//                   letterSpacing: ".07em",
//                 }}
//               >
//                 {(user?.role || "ADMIN").toString().replace("_", " ").toUpperCase()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ════════════════════════════════════════════════════════
//           MAIN CONTENT
//       ════════════════════════════════════════════════════════ */}
//       <div style={{ maxWidth: 1150, margin: "0 auto", padding: "28px" }}>
//         {/* Header Card */}
//         <div className="card" style={{ marginBottom: 22 }}>
//           <SecHdr icon="📝" label="Form Builder" />
//           <div
//             style={{
//               padding: "14px 18px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 12,
//             }}
//           >
//             <p style={{ color: T.textSecondary, fontSize: 13, margin: 0 }}>
//               Create and manage structured forms for citizen services
//             </p>
//             <div style={{ display: "flex", gap: 10 }}>
//               <button
//                 className="btn btn-g"
//                 onClick={() => {
//                   setShowAIGuide(true);
//                   setAiStep(1);
//                 }}
//               >
//                 <Ico.Robot /> AI Auto-Generate
//               </button>
//               <button className="btn btn-p" onClick={openNewForm}>
//                 <Ico.Plus /> Create Form
//               </button>
//             </div>
//           </div>
//         </div>

//         {isLoading ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: 60,
//               color: T.textMuted,
//               fontSize: 13,
//             }}
//           >
//             <span
//               style={{
//                 display: "inline-block",
//                 width: 20,
//                 height: 20,
//                 border: `2px solid ${T.divider}`,
//                 borderTopColor: T.accent,
//                 borderRadius: "50%",
//                 animation: "spin .7s linear infinite",
//                 marginRight: 10,
//                 verticalAlign: "middle",
//               }}
//             />
//             Loading forms…
//           </div>
//         ) : forms.length === 0 ? (
//           <div
//             className="card"
//             style={{
//               padding: 70,
//               textAlign: "center",
//               border: `1.5px dashed ${T.cardBorder}`,
//             }}
//           >
//             <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
//             <div
//               className="serif"
//               style={{ fontSize: 20, color: T.textPrimary, marginBottom: 8 }}
//             >
//               No Forms Found
//             </div>
//             <p style={{ color: T.textSecondary, fontSize: 14, margin: 0 }}>
//               Create your first form to start collecting structured data in chats.
//             </p>
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
//               gap: 16,
//             }}
//           >
//             {forms.map((f) => (
//               <div
//                 key={f.id}
//                 className="tcard"
//                 style={{
//                   borderColor: f.requires_document ? T.accentBorder : T.teamCardBorder,
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                     marginBottom: 14,
//                   }}
//                 >
//                   <h3
//                     style={{
//                       fontSize: 16,
//                       fontWeight: 800,
//                       margin: 0,
//                       color: T.textPrimary,
//                       lineHeight: 1.3,
//                       flex: 1,
//                       paddingRight: 10,
//                     }}
//                   >
//                     {f.title}
//                   </h3>
//                   <div
//                     style={{
//                       background: T.tagBg,
//                       color: T.tagText,
//                       padding: "4px 10px",
//                       borderRadius: 20,
//                       fontSize: 12,
//                       fontWeight: 800,
//                       flexShrink: 0,
//                       letterSpacing: ".02em",
//                     }}
//                   >
//                     ₹{f.price}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 12,
//                     fontSize: 12,
//                     color: T.textSecondary,
//                     marginBottom: 18,
//                     fontWeight: 600,
//                   }}
//                 >
//                   <span>📋 {f.fields?.length || 0} Fields</span>
//                   {f.requires_document && (
//                     <span style={{ color: isDark ? "#34d399" : "#059669" }}>
//                       📎 Requires Doc
//                     </span>
//                   )}
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 8,
//                     paddingTop: 14,
//                     borderTop: `1px solid ${T.divider}`,
//                   }}
//                 >
//                   <button
//                     className="btn btn-g"
//                     style={{ flex: 1, justifyContent: "center" }}
//                     onClick={() => openEditForm(f)}
//                   >
//                     <Ico.Edit /> Edit
//                   </button>
//                   <button
//                     className="btn btn-d"
//                     style={{ padding: "8px 12px" }}
//                     onClick={() => handleDelete(f.id)}
//                   >
//                     <Ico.Trash />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           AI GUIDE MODAL
//       ════════════════════════════════════════════════════════ */}
//       {showAIGuide && (
//         <div
//           className="modal-ov"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) setShowAIGuide(false);
//           }}
//         >
//           <div
//             className="modal-bx"
//             style={{ maxWidth: 500, overflow: "hidden" }}
//           >
//             <div
//               style={{
//                 background: isDark
//                   ? "linear-gradient(135deg, #b45309, #d97706)"
//                   : "linear-gradient(135deg, #d97706, #f59e0b)",
//                 padding: "20px 24px",
//                 color: "#fff",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start",
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     marginBottom: 4,
//                   }}
//                 >
//                   <Ico.Robot />{" "}
//                   <span
//                     style={{
//                       fontWeight: 800,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.05em",
//                       fontSize: 12,
//                     }}
//                   >
//                     AI Assistant Guide
//                   </span>
//                 </div>
//                 <h2
//                   className="serif"
//                   style={{ margin: 0, fontSize: 22, color: "#fff" }}
//                 >
//                   {aiStep === 1
//                     ? "Auto-Generate Forms"
//                     : aiStep === 2
//                       ? "Copy AI Prompt"
//                       : "Paste & Populate"}
//                 </h2>
//               </div>
//               <button
//                 onClick={() => setShowAIGuide(false)}
//                 style={{
//                   background: "rgba(0,0,0,0.2)",
//                   border: "none",
//                   color: "#fff",
//                   cursor: "pointer",
//                   padding: 6,
//                   borderRadius: "50%",
//                   display: "flex",
//                 }}
//               >
//                 <Ico.X />
//               </button>
//             </div>

//             <div
//               style={{
//                 padding: "24px",
//                 fontSize: 15,
//                 color: T.textPrimary,
//                 lineHeight: 1.6,
//               }}
//             >
//               {aiStep === 1 && (
//                 <>
//                   <p>
//                     Building forms field-by-field can take time. You can use{" "}
//                     <b>ChatGPT</b> or <b>Gemini</b> to instantly generate the
//                     perfect fields for any CSC service.
//                   </p>
//                   <p style={{ marginTop: 10 }}>
//                     We have prepared a special prompt for you. Just copy it,
//                     paste it into your AI, and it will give you a formatted JSON
//                     string.
//                   </p>
//                 </>
//               )}

//               {aiStep === 2 && (
//                 <>
//                   <p style={{ marginBottom: 12 }}>
//                     Copy the prompt below and paste it into ChatGPT.{" "}
//                     <b style={{ color: T.accent }}>
//                       Don't forget to replace [INSERT SERVICE NAME HERE]
//                     </b>{" "}
//                     with your actual service.
//                   </p>
//                   <div style={{ position: "relative" }}>
//                     <textarea
//                       readOnly
//                       value={AI_PROMPT}
//                       style={{
//                         width: "100%",
//                         height: 160,
//                         background: T.inputBg,
//                         border: `1px solid ${T.inputBorder}`,
//                         color: T.textSecondary,
//                         padding: "12px",
//                         borderRadius: 8,
//                         fontSize: 13,
//                         resize: "none",
//                         fontFamily: "'JetBrains Mono', monospace",
//                       }}
//                     />
//                     <button
//                       onClick={() => {
//                         navigator.clipboard.writeText(AI_PROMPT);
//                         setCopied(true);
//                         setTimeout(() => setCopied(false), 2000);
//                       }}
//                       style={{
//                         position: "absolute",
//                         top: 10,
//                         right: 10,
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 6,
//                         background: copied ? "#10b981" : T.accent,
//                         color: "#fff",
//                         border: "none",
//                         padding: "6px 12px",
//                         borderRadius: 6,
//                         fontSize: 12,
//                         fontWeight: 700,
//                         cursor: "pointer",
//                         transition: "all 0.2s",
//                       }}
//                     >
//                       {copied ? (
//                         "✅ Copied!"
//                       ) : (
//                         <>
//                           <Ico.Copy /> Copy Prompt
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </>
//               )}

//               {aiStep === 3 && (
//                 <div style={{ textAlign: "center", padding: "10px 0" }}>
//                   <div style={{ fontSize: 50, marginBottom: 16 }}>⌨️</div>
//                   <h3
//                     className="serif"
//                     style={{ margin: "0 0 10px 0", color: T.textPrimary }}
//                   >
//                     Ready to Paste!
//                   </h3>
//                   <p style={{ color: T.textSecondary, marginBottom: 0 }}>
//                     Once ChatGPT gives you the JSON, come back here, open the{" "}
//                     <b>Create Form</b> window, and simply press{" "}
//                     <b>Ctrl + V</b> anywhere on the screen.
//                   </p>
//                   <p
//                     style={{
//                       color: T.accent,
//                       fontWeight: 700,
//                       marginTop: 10,
//                     }}
//                   >
//                     The fields will instantly populate!
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div
//               style={{
//                 padding: "16px 24px",
//                 borderTop: `1px solid ${T.divider}`,
//                 background: T.sidebarHeaderBg,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div style={{ display: "flex", gap: 6 }}>
//                 {[1, 2, 3].map((s) => (
//                   <div
//                     key={s}
//                     style={{
//                       width: 8,
//                       height: 8,
//                       borderRadius: "50%",
//                       background: aiStep === s ? T.accent : T.divider,
//                     }}
//                   />
//                 ))}
//               </div>
//               <div style={{ display: "flex", gap: 10 }}>
//                 {aiStep < 3 && (
//                   <button
//                     onClick={() => setShowAIGuide(false)}
//                     style={{
//                       padding: "8px 16px",
//                       background: "none",
//                       border: "none",
//                       color: T.textMuted,
//                       fontWeight: 700,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Skip
//                   </button>
//                 )}
//                 {aiStep > 1 && (
//                   <button
//                     className="btn btn-g"
//                     onClick={() => setAiStep(aiStep - 1)}
//                   >
//                     Back
//                   </button>
//                 )}
//                 {aiStep < 3 ? (
//                   <button
//                     className="btn btn-p"
//                     onClick={() => setAiStep(aiStep + 1)}
//                   >
//                     Next
//                   </button>
//                 ) : (
//                   <button
//                     className="btn btn-p"
//                     onClick={() => {
//                       setShowAIGuide(false);
//                       openNewForm();
//                     }}
//                   >
//                     Start Creating
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ════════════════════════════════════════════════════════
//           FORM BUILDER MODAL
//       ════════════════════════════════════════════════════════ */}
//       {isModalOpen && (
//         <div
//           className="modal-ov"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) setIsModalOpen(false);
//           }}
//         >
//           <div
//             className="modal-bx"
//             style={{ maxWidth: 640, maxHeight: "90vh", overflow: "hidden" }}
//           >
//             <div style={modalHdrStyle}>
//               <div style={modalHdrTitle}>
//                 {editingForm ? "✏️ Edit Form" : "📝 Create New Form"}
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   color: T.textMuted,
//                   cursor: "pointer",
//                   display: "flex",
//                   padding: 4,
//                 }}
//               >
//                 <Ico.X />
//               </button>
//             </div>

//             <div
//               style={{
//                 padding: "24px",
//                 overflowY: "auto",
//                 maxHeight: "calc(90vh - 140px)",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 20,
//               }}
//             >
//               {/* Core Details */}
//               <div style={{ display: "flex", gap: 16 }}>
//                 <div style={{ flex: 2 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: 11,
//                       fontWeight: 800,
//                       color: T.textMuted,
//                       textTransform: "uppercase",
//                       marginBottom: 6,
//                       letterSpacing: ".06em",
//                     }}
//                   >
//                     Form Title
//                   </label>
//                   <input
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="e.g. Income Certificate Details"
//                     className="inp"
//                   />
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: 11,
//                       fontWeight: 800,
//                       color: T.textMuted,
//                       textTransform: "uppercase",
//                       marginBottom: 6,
//                       letterSpacing: ".06em",
//                     }}
//                   >
//                     Price (₹)
//                   </label>
//                   <input
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(Number(e.target.value))}
//                     className="inp"
//                   />
//                 </div>
//               </div>

//               {/* Document Requirement */}
//               <div
//                 style={{
//                   background: T.inputBg,
//                   padding: 16,
//                   borderRadius: 10,
//                   border: `1px solid ${T.inputBorder}`,
//                 }}
//               >
//                 <label
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     fontWeight: 700,
//                     cursor: "pointer",
//                     fontSize: 14,
//                     color: T.textPrimary,
//                   }}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={reqDoc}
//                     onChange={(e) => setReqDoc(e.target.checked)}
//                     style={{
//                       width: 18,
//                       height: 18,
//                       accentColor: T.accent,
//                       cursor: "pointer",
//                     }}
//                   />
//                   Requires User to Upload a Document?
//                 </label>
//                 {reqDoc && (
//                   <div style={{ marginTop: 12 }}>
//                     <label
//                       style={{
//                         display: "block",
//                         fontSize: 11,
//                         fontWeight: 800,
//                         color: T.textMuted,
//                         textTransform: "uppercase",
//                         marginBottom: 6,
//                         letterSpacing: ".06em",
//                       }}
//                     >
//                       What document is required?
//                     </label>
//                     <input
//                       value={docLabel}
//                       onChange={(e) => setDocLabel(e.target.value)}
//                       placeholder="e.g. Upload scanned Aadhar Card"
//                       className="inp"
//                     />
//                   </div>
//                 )}
//               </div>

//               <div
//                 style={{
//                   border: "none",
//                   borderTop: `1px dashed ${T.divider}`,
//                   margin: "4px 0",
//                 }}
//               />

//               {/* Dynamic Fields Builder */}
//               <div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 12,
//                   }}
//                 >
//                   <label
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 800,
//                       color: T.textPrimary,
//                       letterSpacing: ".02em",
//                     }}
//                   >
//                     Form Fields ({fields.length})
//                   </label>
//                   <button
//                     className="btn btn-g"
//                     onClick={addField}
//                     style={{ fontSize: 12 }}
//                   >
//                     <Ico.Plus /> Add Field
//                   </button>
//                 </div>

//                 {fields.length === 0 ? (
//                   <div
//                     style={{
//                       padding: 28,
//                       textAlign: "center",
//                       background: T.inputBg,
//                       borderRadius: 8,
//                       border: `1.5px dashed ${T.inputBorder}`,
//                       color: T.textMuted,
//                       fontSize: 13,
//                     }}
//                   >
//                     <div style={{ marginBottom: 8, fontSize: 20 }}>📋</div>
//                     <div style={{ marginBottom: 6 }}>No fields added yet.</div>
//                     <div
//                       style={{
//                         color: T.accent,
//                         fontWeight: 600,
//                         fontSize: 12,
//                       }}
//                     >
//                       💡 Hint: Press <b>Ctrl + V</b> to paste AI-generated
//                       fields!
//                     </div>
//                   </div>
//                 ) : (
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: 10,
//                     }}
//                   >
//                     {fields.map((f, i) => (
//                       <div
//                         key={f.id}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 12,
//                           background: T.inputBg,
//                           padding: 12,
//                           borderRadius: 8,
//                           border: `1px solid ${T.inputBorder}`,
//                           transition: "all .15s",
//                         }}
//                       >
//                         <div
//                           style={{
//                             fontWeight: 800,
//                             color: T.textMuted,
//                             fontSize: 12,
//                             minWidth: 22,
//                             textAlign: "center",
//                           }}
//                         >
//                           {i + 1}.
//                         </div>
//                         <input
//                           value={f.label}
//                           onChange={(e) =>
//                             updateField(f.id, "label", e.target.value)
//                           }
//                           placeholder="Field Label (e.g. Father's Name)"
//                           className="inp"
//                           style={{ flex: 1, fontSize: 13 }}
//                         />
//                         <label
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 6,
//                             fontSize: 12,
//                             fontWeight: 700,
//                             color: T.textSecondary,
//                             cursor: "pointer",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={f.required}
//                             onChange={(e) =>
//                               updateField(f.id, "required", e.target.checked)
//                             }
//                             style={{ accentColor: T.accent, cursor: "pointer" }}
//                           />{" "}
//                           Required
//                         </label>
//                         <button
//                           onClick={() => removeField(f.id)}
//                           style={{
//                             background: "none",
//                             border: "none",
//                             color: T.btnDangerText,
//                             cursor: "pointer",
//                             padding: 4,
//                             display: "flex",
//                             borderRadius: 6,
//                             transition: "background .15s",
//                           }}
//                           onMouseEnter={(e) => {
//                             (e.currentTarget as HTMLElement).style.background =
//                               T.btnDangerBg;
//                           }}
//                           onMouseLeave={(e) => {
//                             (e.currentTarget as HTMLElement).style.background =
//                               "none";
//                           }}
//                         >
//                           <Ico.Trash />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div
//               style={{
//                 padding: "16px 24px",
//                 borderTop: `1px solid ${T.divider}`,
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 12,
//                 background: T.sidebarHeaderBg,
//                 borderRadius: "0 0 14px 14px",
//               }}
//             >
//               <button
//                 className="btn btn-g"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button className="btn btn-p" onClick={handleSave}>
//                 {editingForm ? "Update Form" : "Save Form"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }












// src/app/admin/forms/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\forms\page.tsx. No new file needed.
//
// KEPT (all logic exactly as supplied):
// - Types FormField {id, label, required}, DbForm {id, title, price,
//   requires_document, document_label, fields, created_at}, UserRole.
// - Server actions getFormsAction / createFormAction / updateFormAction /
//   deleteFormAction; loadForms() on mount (isLoading true while fetching,
//   errors only console.error'd, as supplied).
// - Create/edit modal: openNewForm resets all form state, openEditForm fills
//   it from the form; handleSave alerts "Title is required!" and "Document
//   label is required if document is requested!", payload {title, price,
//   requires_document, document_label: reqDoc ? docLabel : null, fields},
//   updateFormAction(editingForm.id, payload) or createFormAction(payload),
//   then close + reload; errors alert(e.message). handleDelete uses
//   confirm("Are you sure you want to delete this form?") then
//   deleteFormAction then reload.
// - Field add/remove/update: addField id `f_${Date.now()}`, paste-imported
//   ids `f_${Date.now()}_${Math.random()}`.
// - AI_PROMPT constant VERBATIM (form-generation prompt, title/price/fields
//   JSON, "[INSERT SERVICE NAME HERE]").
// - Global paste listener: only acts when isModalOpen; parses clipboard
//   JSON — an object with a fields array sets title/price and appends fields,
//   a bare array of {label, ...} appends fields; success alerts kept word
//   for word (emoji character dropped only). Non-JSON paste is silently
//   ignored, as supplied.
// - AI Guide modal: 3 steps (aiStep 1-3, showAIGuide, copied with 2s reset;
//   step 2 shows AI_PROMPT in a readOnly textarea with a Copy button; step 3's
//   primary button closes the guide and calls openNewForm(); Skip shown only
//   when aiStep < 3, Back when > 1, step dots). All step copy byte-for-byte
//   except emoji characters.
// - Header: brand "ShrilalCSC" + "ADMIN PANEL", user chip uses the real
//   useAuth().user (name + role formatted, "_" replaced with a space,
//   uppercased). NAV_LINKS 6 links, now relative, Forms marked active.
// - Form cards grid: title, ₹price tag, "N Fields", "Requires Doc" (green)
//   when requires_document (that card also gets an accent border), Edit
//   (flex-1) + Delete icon buttons. Empty state "No Forms Found" with its
//   sub-copy. Loading spinner "Loading forms…".
// - Theme: csc_theme localStorage read with [] deps, prefers-color-scheme
//   fallback, plus a dark-class sync effect on document.documentElement.
// - Avatar and SecHdr helpers (Avatar now takes no isDark prop — its solid
//   colour comes from the role via Tailwind classes; SecHdr takes a lucide
//   icon component instead of an emoji string).
//
// REMOVED:
// - The whole THEMES object and ThemeTokens type; buildCss() (Google Fonts
//   @import for DM Serif Display / DM Sans / JetBrains Mono + a global *
//   margin/padding reset + every generated class); every inline style object
//   (incl. modalHdrStyle / modalHdrTitle); the Ico inline-SVG set.
//   Ico.Search, Ico.ChevronLeft, Ico.Doc and Ico.Check were defined in the
//   original but never used anywhere — dropped, not replaced.
// - All gradients (brand tile, section header, AI guide header, buttons,
//   avatars), glow/shadow decoration, the pop / spin keyframes (spin is now
//   Tailwind's animate-spin). The light/dark accent switch is gone: one
//   deep-blue accent in both themes via Tailwind dark: classes; site chrome
//   uses the navy header (#0b2239 / dark #081120).
// - Every emoji used as an icon or in alert/copy (temple, memo, page,
//   clipboard, paperclip, pencil, checkmark, keyboard, light-bulb and the
//   NAV_LINKS icon strings) → lucide.
// - NAV_LINKS no longer build absolute URLs from NODE_ENV
//   (https://srilalsahaj.co.in/... / http://localhost:3000/...); they are
//   plain relative links: /admin, /admin/posts, /admin/galary, /admin/forms,
//   /admin/transactions, /admin/analytics.
//
// FLAGS (kept as supplied, not changed — need Swatantra's word):
// 1. The second theme effect writes csc_theme on EVERY isDark change
//    including first mount — and it runs with the initial isDark=false
//    before the read effect's setIsDark takes effect, so a stored "dark"
//    is briefly overwritten with "light" and only corrected on the
//    re-render. Kept as supplied.
// 2. The Save button has no in-flight / disabled state, so a double-click
//    on "Save Form" / "Update Form" can submit the same form twice.
// 3. The Copy Prompt button sets "Copied!" without awaiting
//    navigator.clipboard.writeText — if the clipboard write is denied,
//    it still says Copied.
// 4. The paste handler silently ignores anything that is not JSON in one
//    of the two shapes above (the catch swallows the error), so a paste
//    from AI in any other format does nothing with no message.
// 5. Clearing the Price input sets price to 0 (Number("") === 0) and
//    handleSave does no price validation — a form can be saved at ₹0.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  getFormsAction,
  createFormAction,
  updateFormAction,
  deleteFormAction,
} from "@/app/actions/forms";
import {
  Award,
  BarChart3,
  Bot,
  Check,
  ClipboardList,
  Copy,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Keyboard,
  Landmark,
  Lightbulb,
  Moon,
  Paperclip,
  Pencil,
  PenLine,
  Plus,
  ShieldCheck,
  Sun,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════
interface FormField {
  id: string;
  label: string;
  required: boolean;
}
interface DbForm {
  id: string;
  title: string;
  price: number;
  requires_document: boolean;
  document_label: string | null;
  fields: FormField[];
  created_at: string;
}

type UserRole = "user" | "co_admin" | "main_admin";

// ════════════════════════════════════════════════════════════════════════════════
// NAV LINKS (relative — the original built absolute URLs from NODE_ENV)
// ════════════════════════════════════════════════════════════════════════════════
const NAV_LINKS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/admin", icon: ShieldCheck, label: "Admin" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/posts", icon: PenLine, label: "Posts" },
  { href: "/admin/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/forms", icon: ClipboardList, label: "Forms" },
  { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

// ─── Shared class strings ───
const btnBase =
  "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap";
const btnP = `${btnBase} bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500`;
const btnG = `${btnBase} bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-blue-500/10 dark:hover:text-blue-400`;
const btnD = `${btnBase} bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25`;
const inpCls =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13.5px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400";
const lblCls =
  "mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500";

// ─── Avatar (solid colour by role, no gradient) ───
function Avatar({
  name,
  size = 40,
  role,
}: {
  name?: string | null;
  size?: number;
  role?: UserRole;
}) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  const bg =
    role === "main_admin"
      ? "bg-blue-800 dark:bg-blue-600"
      : role === "co_admin"
        ? "bg-blue-600 dark:bg-blue-500"
        : "bg-slate-500 dark:bg-slate-600";
  return (
    <div
      className={`${bg} flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-1 ring-white/20`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {ch}
    </div>
  );
}

// ─── Section header (plain navy strip, no gradient) ───
function SecHdr({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-[#0b2239] px-4 py-3 dark:bg-[#081120]">
      <Icon className="h-4 w-4 text-blue-400" />
      <span className="text-xs font-extrabold uppercase tracking-wider text-white">
        {label}
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// AI PROMPT
// ════════════════════════════════════════════════════════════════════════════════
const AI_PROMPT = `I am building an application form for [INSERT SERVICE NAME HERE] at my Jan Seva Kendra (CSC) in India.
Give me a suitable form title, an estimated service price in INR, and a list of all required fields to collect from the citizen.
Output ONLY a raw JSON object. No markdown, no explanations, no formatting.
Format:
{
  "title": "Perfect Title for the Form",
  "price": 50,
  "fields": [
    {"label": "Applicant Full Name", "required": true},
    {"label": "Date of Birth", "required": true}
  ]
}`;

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function AdminFormsPage() {
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();

  const [forms, setForms] = useState<DbForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<DbForm | null>(null);

  // AI Tutorial State
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const [copied, setCopied] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [reqDoc, setReqDoc] = useState(false);
  const [docLabel, setDocLabel] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("csc_theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setIsLoading(true);
    try {
      const data = await getFormsAction();
      setForms(data as unknown as DbForm[]);
    } catch (e) {
      console.error("Failed to load forms", e);
    }
    setIsLoading(false);
  };

  // AI Paste Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isModalOpen) return;
      try {
        const text = e.clipboardData?.getData("text");
        if (!text) return;
        const parsed = JSON.parse(text);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed) &&
          parsed.fields &&
          Array.isArray(parsed.fields)
        ) {
          e.preventDefault();
          if (parsed.title) setTitle(parsed.title);
          if (parsed.price !== undefined) setPrice(Number(parsed.price));

          const newFields = parsed.fields.map((f: any) => ({
            id: `f_${Date.now()}_${Math.random()}`,
            label: f.label,
            required: !!f.required,
          }));
          setFields((prev) => [...prev, ...newFields]);
          alert(`Imported "${parsed.title || "Form"}" with ${newFields.length} fields!`);
        } else if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed[0].label !== undefined
        ) {
          e.preventDefault();
          const newFields = parsed.map((f: any) => ({
            id: `f_${Date.now()}_${Math.random()}`,
            label: f.label,
            required: !!f.required,
          }));
          setFields((prev) => [...prev, ...newFields]);
          alert(`Imported ${newFields.length} fields from AI!`);
        }
      } catch {
        /* not JSON */
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [isModalOpen]);

  const openNewForm = () => {
    setEditingForm(null);
    setTitle("");
    setPrice(0);
    setReqDoc(false);
    setDocLabel("");
    setFields([]);
    setIsModalOpen(true);
  };

  const openEditForm = (f: DbForm) => {
    setEditingForm(f);
    setTitle(f.title);
    setPrice(f.price);
    setReqDoc(f.requires_document);
    setDocLabel(f.document_label || "");
    setFields(f.fields || []);
    setIsModalOpen(true);
  };

  const addField = () =>
    setFields([...fields, { id: `f_${Date.now()}`, label: "", required: false }]);
  const removeField = (id: string) => setFields(fields.filter((f) => f.id !== id));
  const updateField = (id: string, key: keyof FormField, val: any) =>
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: val } : f)));

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required!");
    if (reqDoc && !docLabel.trim())
      return alert("Document label is required if document is requested!");

    const payload = {
      title,
      price,
      requires_document: reqDoc,
      document_label: reqDoc ? docLabel : null,
      fields,
    };

    try {
      if (editingForm) await updateFormAction(editingForm.id, payload);
      else await createFormAction(payload);
      setIsModalOpen(false);
      loadForms();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    try {
      await deleteFormAction(id);
      loadForms();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 transition-colors dark:bg-[#0b1220] dark:text-slate-100">
      {/* ════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════ */}
      <header className="z-[100] shrink-0 border-b-[3px] border-blue-600 bg-[#0b2239] shadow-[0_2px_16px_rgba(0,0,0,0.18)] dark:bg-[#081120] dark:border-blue-500">
        {/* Row 1 — brand + nav links + toggle + user */}
        <div className="flex h-[54px] items-center gap-3.5 border-b border-white/10 px-5">
          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-600">
              <Landmark className="h-[17px] w-[17px]" />
            </div>
            <div>
              <div className="text-[17px] leading-none tracking-tight text-white">
                Shrilal<span className="text-blue-400">CSC</span>
              </div>
              <div className="mt-0.5 text-[9px] tracking-[0.1em] text-white/35">
                ADMIN PANEL
              </div>
            </div>
          </Link>

          <div className="h-[26px] w-px shrink-0 bg-white/10" />

          {/* Nav links */}
          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold transition-colors ${
                  l.label === "Forms"
                    ? "bg-blue-600 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark((d) => !d)}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-blue-500/40 bg-white/10 px-3.5 py-1.5 !text-xs font-bold text-white/70 transition-colors hover:border-blue-500 hover:text-white"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {isDark ? "Light" : "Dark"}
          </button>

          {/* User chip */}
          <div className="flex shrink-0 items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5">
            <Avatar
              name={user?.name}
              size={28}
              role={(user?.role as UserRole) || "user"}
            />
            <div>
              <div className="text-[13px] font-bold leading-none text-white">
                {user?.name || "Admin"}
              </div>
              <div className="mt-0.5 text-[9px] tracking-wider text-blue-400">
                {(user?.role || "ADMIN").toString().replace("_", " ").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-[1150px] p-7">
        {/* Header Card */}
        <div className="mb-[22px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.07)] dark:border-white/10 dark:bg-[#111a2e] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
          <SecHdr icon={ClipboardList} label="Form Builder" />
          <div className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-3.5">
            <p className="m-0 text-[13px] text-slate-500 dark:text-slate-400">
              Create and manage structured forms for citizen services
            </p>
            <div className="flex gap-2.5 !text-sm">
              <button
                className={btnG}
                onClick={() => {
                  setShowAIGuide(true);
                  setAiStep(1);
                }}
              >
                <Bot className="h-4 w-4" /> AI Auto-Generate
              </button>
              <button className={btnP} onClick={openNewForm}>
                <Plus className="h-[13px] w-[13px]" /> Create Form
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-[60px] text-center text-[13px] text-slate-400 dark:text-slate-500">
            <span className="mr-2.5 inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700 align-middle dark:border-white/10 dark:border-t-blue-400" />
            Loading forms…
          </div>
        ) : forms.length === 0 ? (
          <div className="rounded-xl border-[1.5px] border-dashed border-slate-200 bg-white px-4 py-[70px] text-center dark:border-white/10 dark:bg-[#111a2e]">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <div className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">
              No Forms Found
            </div>
            <p className="m-0 text-sm text-slate-500 dark:text-slate-400">
              Create your first form to start collecting structured data in chats.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-4">
            {forms.map((f) => (
              <div
                key={f.id}
                className={`rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 dark:bg-[#111a2e] ${
                  f.requires_document
                    ? "border-blue-300 dark:border-blue-500/40"
                    : "border-slate-200 dark:border-white/10"
                }`}
              >
                <div className="mb-3.5 flex items-start justify-between">
                  <h3 className="m-0 flex-1 pr-2.5 text-base font-extrabold leading-snug text-slate-800 dark:text-slate-100">
                    {f.title}
                  </h3>
                  <div className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-extrabold tracking-wide text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                    ₹{f.price}
                  </div>
                </div>

                <div className="mb-[18px] flex gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <ClipboardList className="h-3.5 w-3.5" /> {f.fields?.length || 0} Fields
                  </span>
                  {f.requires_document && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Paperclip className="h-3.5 w-3.5" /> Requires Doc
                    </span>
                  )}
                </div>

                <div className="flex gap-2 border-t border-slate-200 pt-3.5 dark:border-white/10 !text-sm">
                  <button
                    className={`${btnG} flex-1 justify-center`}
                    onClick={() => openEditForm(f)}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    className={`${btnD} px-3`}
                    onClick={() => handleDelete(f.id)}
                    aria-label={`Delete ${f.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          AI GUIDE MODAL
      ════════════════════════════════════════════════════════ */}
      {showAIGuide && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAIGuide(false);
          }}
        >
          <div className="w-full max-w-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-[#111a2e]">
            <div className="flex items-start justify-between bg-[#0b2239] px-6 py-5 text-white dark:bg-[#081120]">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Bot className="h-4 w-4" />{" "}
                  <span className="text-xs font-extrabold uppercase tracking-wide">
                    AI Assistant Guide
                  </span>
                </div>
                <h2 className="m-0 text-[22px] font-bold text-white">
                  {aiStep === 1
                    ? "Auto-Generate Forms"
                    : aiStep === 2
                      ? "Copy AI Prompt"
                      : "Paste & Populate"}
                </h2>
              </div>
              <button
                onClick={() => setShowAIGuide(false)}
                aria-label="Close AI guide"
                className="flex rounded-full bg-black/20 p-1.5 text-white transition-colors hover:bg-black/30"
              >
                <X className="h-[13px] w-[13px]" />
              </button>
            </div>

            <div className="p-6 text-[15px] leading-relaxed text-slate-800 dark:text-slate-100">
              {aiStep === 1 && (
                <>
                  <p>
                    Building forms field-by-field can take time. You can use{" "}
                    <b>ChatGPT</b> or <b>Gemini</b> to instantly generate the
                    perfect fields for any CSC service.
                  </p>
                  <p className="mt-2.5">
                    We have prepared a special prompt for you. Just copy it,
                    paste it into your AI, and it will give you a formatted JSON
                    string.
                  </p>
                </>
              )}

              {aiStep === 2 && (
                <>
                  <p className="mb-3">
                    Copy the prompt below and paste it into ChatGPT.{" "}
                    <b className="text-blue-700 dark:text-blue-400">
                      Don&apos;t forget to replace [INSERT SERVICE NAME HERE]
                    </b>{" "}
                    with your actual service.
                  </p>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={AI_PROMPT}
                      className="h-40 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[13px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(AI_PROMPT);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className={`absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-white transition-colors ${
                        copied
                          ? "bg-emerald-600"
                          : "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {aiStep === 3 && (
                <div className="py-2.5 text-center">
                  <Keyboard className="mx-auto mb-4 h-[50px] w-[50px] text-slate-300 dark:text-slate-600" />
                  <h3 className="mb-2.5 text-lg font-bold text-slate-800 dark:text-slate-100">
                    Ready to Paste!
                  </h3>
                  <p className="mb-0 text-slate-500 dark:text-slate-400">
                    Once ChatGPT gives you the JSON, come back here, open the{" "}
                    <b>Create Form</b> window, and simply press{" "}
                    <b>Ctrl + V</b> anywhere on the screen.
                  </p>
                  <p className="mt-2.5 font-bold text-blue-700 dark:text-blue-400">
                    The fields will instantly populate!
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-2 rounded-full ${
                      aiStep === s
                        ? "bg-blue-700 dark:bg-blue-500"
                        : "bg-slate-200 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2.5 !text-sm">
                {aiStep < 3 && (
                  <button
                    onClick={() => setShowAIGuide(false)}
                    className="px-4 py-2 font-bold text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    Skip
                  </button>
                )}
                {aiStep > 1 && (
                  <button className={btnG} onClick={() => setAiStep(aiStep - 1)}>
                    Back
                  </button>
                )}
                {aiStep < 3 ? (
                  <button className={btnP} onClick={() => setAiStep(aiStep + 1)}>
                    Next
                  </button>
                ) : (
                  <button
                    className={btnP}
                    onClick={() => {
                      setShowAIGuide(false);
                      openNewForm();
                    }}
                  >
                    Start Creating
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          FORM BUILDER MODAL
      ════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-[640px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between border-b border-slate-200 px-[22px] py-[17px] dark:border-white/10">
              <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
                {editingForm ? (
                  <>
                    <Pencil className="h-4 w-4" /> Edit Form
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" /> Create New Form
                  </>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close form builder"
                className="flex p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-[13px] w-[13px]" />
              </button>
            </div>

            <div className="flex max-h-[calc(90vh-140px)] flex-col gap-5 overflow-y-auto p-6">
              {/* Core Details */}
              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className={lblCls} htmlFor="form-title">
                    Form Title
                  </label>
                  <input
                    id="form-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Income Certificate Details"
                    className={inpCls}
                  />
                </div>
                <div className="flex-1">
                  <label className={lblCls} htmlFor="form-price">
                    Price (₹)
                  </label>
                  <input
                    id="form-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className={inpCls}
                  />
                </div>
              </div>

              {/* Document Requirement */}
              <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                  <input
                    type="checkbox"
                    checked={reqDoc}
                    onChange={(e) => setReqDoc(e.target.checked)}
                    className="h-[18px] w-[18px] cursor-pointer accent-blue-700 dark:accent-blue-500"
                  />
                  Requires User to Upload a Document?
                </label>
                {reqDoc && (
                  <div className="mt-3">
                    <label className={lblCls} htmlFor="doc-label">
                      What document is required?
                    </label>
                    <input
                      id="doc-label"
                      value={docLabel}
                      onChange={(e) => setDocLabel(e.target.value)}
                      placeholder="e.g. Upload scanned Aadhar Card"
                      className={inpCls}
                    />
                  </div>
                )}
              </div>

              <div className="my-1 border-t border-dashed border-slate-200 dark:border-white/10" />

              {/* Dynamic Fields Builder */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[13px] font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                    Form Fields ({fields.length})
                  </label>
                  <button className={`${btnG} text-xs`} onClick={addField}>
                    <Plus className="h-[13px] w-[13px]" /> Add Field
                  </button>
                </div>

                {fields.length === 0 ? (
                  <div className="rounded-lg border-[1.5px] border-dashed border-slate-200 bg-slate-50 px-4 py-7 text-center text-[13px] text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">
                    <ClipboardList className="mx-auto mb-2 h-5 w-5" />
                    <div className="mb-1.5">No fields added yet.</div>
                    <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                      <span className="inline-flex items-center gap-1">
                        <Lightbulb className="h-3.5 w-3.5" /> Hint: Press <b>Ctrl + V</b> to
                        paste AI-generated fields!
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {fields.map((f, i) => (
                      <div
                        key={f.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="min-w-[22px] text-center text-xs font-extrabold text-slate-400 dark:text-slate-500">
                          {i + 1}.
                        </div>
                        <input
                          value={f.label}
                          onChange={(e) =>
                            updateField(f.id, "label", e.target.value)
                          }
                          placeholder="Field Label (e.g. Father's Name)"
                          className={`${inpCls} flex-1 !text-[13px]`}
                        />
                        <label className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs font-bold text-slate-500 dark:text-slate-400">
                          <input
                            type="checkbox"
                            checked={f.required}
                            onChange={(e) =>
                              updateField(f.id, "required", e.target.checked)
                            }
                            className="cursor-pointer accent-blue-700 dark:accent-blue-500"
                          />{" "}
                          Required
                        </label>
                        <button
                          onClick={() => removeField(f.id)}
                          aria-label={`Remove field ${i + 1}`}
                          className="flex rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
              <button className={btnG} onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className={btnP} onClick={handleSave}>
                {editingForm ? "Update Form" : "Save Form"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
