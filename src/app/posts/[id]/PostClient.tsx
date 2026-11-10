

// "use client";

// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { useAuth } from "@/components/AuthProvider";

// const SemanticBot = dynamic(() => import("./SemanticBot"), { ssr: false });

// interface ImportantDate { label: string; label_hi: string; date: string; is_bold: boolean; }
// interface VacancyRow { post_name: string; no_of_posts: number; category?: string; }
// interface EligibilityRow { post_name: string; criteria: string; criteria_hi: string; }
// interface LinkRow { label: string; label_hi: string; url: string; is_active: boolean; }
// interface FaqRow { question: string; answer: string; }
// interface AlsoCheckRow { label: string; url: string; }

// export interface DbPost {
// 	id: string;
// 	title: string;
// 	title_hi: string;
// 	short_desc: string;
// 	theme: string;
// 	service_cost: number;
// 	category: string;
// 	tags: string[];
// 	slug: string;
// 	banner_url?: string;
// 	is_published: boolean;
// 	organization: string;
// 	organization_hi: string;
// 	total_posts: number;
// 	post_date: string;
// 	important_dates: ImportantDate[];
// 	fee_general: number;
// 	fee_sc_st: number;
// 	fee_ph: number;
// 	fee_payment_modes: string[];
// 	age_min: number;
// 	age_max: string;
// 	age_as_on_date: string;
// 	age_relaxation: string;
// 	vacancy_details: VacancyRow[];
// 	eligibility: EligibilityRow[];
// 	selection_process: string[];
// 	how_to_apply: string;
// 	how_to_apply_hi: string;
// 	important_links: LinkRow[];
// 	faqs: FaqRow[];
// 	also_check: AlsoCheckRow[];
// 	whatsapp_link: string;
// 	telegram_link: string;
// 	created_at: string;
// 	updated_at: string;
// }

// const THEME_MAP: Record<string, { primary: string; dark: string; light: string; badge: string; ring: string; btn: string; accent: string }> = {
// 	blue: { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", badge: "#dbeafe", ring: "#93c5fd", btn: "bg-blue-600 hover:bg-blue-700", accent: "#3b82f6" },
// 	green: { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", badge: "#dcfce7", ring: "#86efac", btn: "bg-green-600 hover:bg-green-700", accent: "#22c55e" },
// 	red: { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", badge: "#fee2e2", ring: "#fca5a5", btn: "bg-red-600 hover:bg-red-700", accent: "#ef4444" },
// 	orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", badge: "#fed7aa", ring: "#fdba74", btn: "bg-orange-600 hover:bg-orange-700", accent: "#f97316" },
// 	purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", badge: "#ede9fe", ring: "#c4b5fd", btn: "bg-violet-600 hover:bg-violet-700", accent: "#8b5cf6" },
// 	teal: { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", badge: "#ccfbf1", ring: "#5eead4", btn: "bg-teal-600 hover:bg-teal-700", accent: "#14b8a6" },
// 	indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", badge: "#e0e7ff", ring: "#a5b4fc", btn: "bg-indigo-600 hover:bg-indigo-700", accent: "#6366f1" },
// 	rose: { primary: "#be123c", dark: "#881337", light: "#fff1f2", badge: "#ffe4e6", ring: "#fda4af", btn: "bg-rose-600 hover:bg-rose-700", accent: "#f43f5e" },
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // DUAL THEME TOKENS — Mutable type to avoid readonly conflicts
// // ════════════════════════════════════════════════════════════════════════════════
// interface ThemeTokens {
// 	pageBg: string;
// 	navBg: string;
// 	navBottomBorder: string;
// 	navText: string;
// 	navTextHover: string;
// 	navBrand: string;
// 	navBrandAccent: string;
// 	cardBg: string;
// 	cardBorder: string;
// 	cardShadow: string;
// 	sectionGrad: string;
// 	sectionGradText: string;
// 	textPrimary: string;
// 	textSecondary: string;
// 	textMuted: string;
// 	accent: string;
// 	accentHover: string;
// 	accentLight: string;
// 	accentBorder: string;
// 	inputBg: string;
// 	inputBorder: string;
// 	inputFocusBorder: string;
// 	inputText: string;
// 	inputPlaceholder: string;
// 	divider: string;
// 	pillBg: string;
// 	pillBorder: string;
// 	pillText: string;
// 	pillActiveBg: string;
// 	pillActiveBorder: string;
// 	pillActiveText: string;
// 	btnPrimary: string;
// 	btnPrimaryText: string;
// 	btnPrimaryGlow: string;
// 	btnGhostBg: string;
// 	btnGhostBorder: string;
// 	btnGhostText: string;
// 	btnGhostHoverBg: string;
// 	btnGhostHoverText: string;
// 	btnDangerBg: string;
// 	btnDangerBorder: string;
// 	btnDangerText: string;
// 	btnSuccessBg: string;
// 	btnSuccessText: string;
// 	modalOverlay: string;
// 	modalBg: string;
// 	modalBorder: string;
// 	scrollThumb: string;
// 	payPendingGrad: string;
// 	payPaidGrad: string;
// 	docIconBg: string;
// 	docIconBorder: string;
// 	docIconColor: string;
// 	toggleIcon: string;
// 	toggleLabel: string;
// }

// const THEMES: Record<"light" | "dark", ThemeTokens> = {
// 	light: {
// 		pageBg: "#f1f5f9",
// 		navBg: "#1e3a8a",
// 		navBottomBorder: "#3b82f6",
// 		navText: "rgba(255,255,255,0.65)",
// 		navTextHover: "#ffffff",
// 		navBrand: "#ffffff",
// 		navBrandAccent: "#93c5fd",
// 		cardBg: "#ffffff",
// 		cardBorder: "#e2e8f0",
// 		cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
// 		sectionGrad: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
// 		sectionGradText: "#ffffff",
// 		textPrimary: "#1e293b",
// 		textSecondary: "#475569",
// 		textMuted: "#94a3b8",
// 		accent: "#2563eb",
// 		accentHover: "#1d4ed8",
// 		accentLight: "#eff6ff",
// 		accentBorder: "#bfdbfe",
// 		inputBg: "#f8fafc",
// 		inputBorder: "#e2e8f0",
// 		inputFocusBorder: "#3b82f6",
// 		inputText: "#1e293b",
// 		inputPlaceholder: "#94a3b8",
// 		divider: "#e2e8f0",
// 		pillBg: "#f1f5f9",
// 		pillBorder: "#e2e8f0",
// 		pillText: "#64748b",
// 		pillActiveBg: "#dbeafe",
// 		pillActiveBorder: "#93c5fd",
// 		pillActiveText: "#1d4ed8",
// 		btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)",
// 		btnPrimaryText: "#ffffff",
// 		btnPrimaryGlow: "rgba(37,99,235,0.35)",
// 		btnGhostBg: "#f1f5f9",
// 		btnGhostBorder: "#e2e8f0",
// 		btnGhostText: "#475569",
// 		btnGhostHoverBg: "#eff6ff",
// 		btnGhostHoverText: "#2563eb",
// 		btnDangerBg: "#fef2f2",
// 		btnDangerBorder: "#fecaca",
// 		btnDangerText: "#dc2626",
// 		btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)",
// 		btnSuccessText: "#ffffff",
// 		modalOverlay: "rgba(15,23,42,0.55)",
// 		modalBg: "#ffffff",
// 		modalBorder: "#e2e8f0",
// 		scrollThumb: "#bfdbfe",
// 		payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
// 		payPaidGrad: "linear-gradient(135deg,#15803d,#16a34a)",
// 		docIconBg: "#fef2f2",
// 		docIconBorder: "#fecaca",
// 		docIconColor: "#dc2626",
// 		toggleIcon: "🌙",
// 		toggleLabel: "Dark",
// 	},
// 	dark: {
// 		pageBg: "#060b14",
// 		navBg: "rgba(6,11,20,0.98)",
// 		navBottomBorder: "#f59e0b",
// 		navText: "rgba(255,255,255,0.45)",
// 		navTextHover: "#ffffff",
// 		navBrand: "#ffffff",
// 		navBrandAccent: "#f59e0b",
// 		cardBg: "rgba(255,255,255,0.03)",
// 		cardBorder: "rgba(255,255,255,0.08)",
// 		cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
// 		sectionGrad: "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
// 		sectionGradText: "#000000",
// 		textPrimary: "#f1f5f9",
// 		textSecondary: "rgba(255,255,255,0.55)",
// 		textMuted: "rgba(255,255,255,0.28)",
// 		accent: "#f59e0b",
// 		accentHover: "#d97706",
// 		accentLight: "rgba(245,158,11,0.08)",
// 		accentBorder: "rgba(245,158,11,0.25)",
// 		inputBg: "rgba(255,255,255,0.05)",
// 		inputBorder: "rgba(255,255,255,0.08)",
// 		inputFocusBorder: "rgba(245,158,11,0.5)",
// 		inputText: "#f1f5f9",
// 		inputPlaceholder: "rgba(255,255,255,0.25)",
// 		divider: "rgba(255,255,255,0.06)",
// 		pillBg: "rgba(255,255,255,0.03)",
// 		pillBorder: "rgba(255,255,255,0.08)",
// 		pillText: "rgba(255,255,255,0.4)",
// 		pillActiveBg: "rgba(245,158,11,0.15)",
// 		pillActiveBorder: "rgba(245,158,11,0.4)",
// 		pillActiveText: "#f59e0b",
// 		btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)",
// 		btnPrimaryText: "#000000",
// 		btnPrimaryGlow: "rgba(245,158,11,0.35)",
// 		btnGhostBg: "rgba(255,255,255,0.05)",
// 		btnGhostBorder: "rgba(255,255,255,0.1)",
// 		btnGhostText: "rgba(255,255,255,0.7)",
// 		btnGhostHoverBg: "rgba(245,158,11,0.1)",
// 		btnGhostHoverText: "#f59e0b",
// 		btnDangerBg: "rgba(239,68,68,0.1)",
// 		btnDangerBorder: "rgba(239,68,68,0.25)",
// 		btnDangerText: "#f87171",
// 		btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)",
// 		btnSuccessText: "#ffffff",
// 		modalOverlay: "rgba(0,0,0,0.85)",
// 		modalBg: "#0f172a",
// 		modalBorder: "rgba(255,255,255,0.1)",
// 		scrollThumb: "rgba(245,158,11,0.3)",
// 		payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
// 		payPaidGrad: "linear-gradient(135deg,#065f46,#047857)",
// 		docIconBg: "rgba(239,68,68,0.12)",
// 		docIconBorder: "rgba(239,68,68,0.28)",
// 		docIconColor: "#f87171",
// 		toggleIcon: "☀️",
// 		toggleLabel: "Light",
// 	},
// };

// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/delivery" : "http://localhost:3000/delivery", icon: "📦", label: "Delivery" },
// ];

// const Ico = {
// 	Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
// 	X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // buildCss — takes isDark as parameter to avoid scope issues
// // ════════════════════════════════════════════════════════════════════════════════
// function buildCss(T: ThemeTokens, isDark: boolean): string {
// 	const disclaimerBg = isDark ? "rgba(245,158,11,0.08)" : "#fef9c3";
// 	const disclaimerBorder = isDark ? "rgba(245,158,11,0.2)" : "#fde68a";
// 	const disclaimerText = isDark ? "#fbbf24" : "#78350f";
// 	const disclaimerStrong = isDark ? "#f59e0b" : "#92400e";
// 	const ageRelaxBg = isDark ? "rgba(245,158,11,0.08)" : "#fefce8";
// 	const ageRelaxBorder = isDark ? "rgba(245,158,11,0.2)" : "#fde68a";
// 	const ageRelaxText = isDark ? "#fbbf24" : "#92400e";

// 	return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// .hi{font-family:'Noto Sans Devanagari',sans-serif;}
// .mono{font-family:'JetBrains Mono',monospace;}

// @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
// @keyframes stampIn{from{opacity:0;transform:scale(1.4) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
// @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}

// .top-nav-link{
//   display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
//   font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
//   transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
// }
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

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

// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

// .sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
// .sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

// .tog{
//   display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
//   border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
//   color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
//   transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
// }
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

// .data-table{width:100%;border-collapse:collapse;font-size:.82rem;}
// .data-table th{background:${T.accentLight};color:${T.accentHover};font-weight:700;padding:9px 14px;text-align:left;font-size:.75rem;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid ${T.accentBorder};}
// .data-table td{padding:9px 14px;border-bottom:1px solid ${T.divider};color:${T.textSecondary};vertical-align:top;}
// .data-table tr:last-child td{border-bottom:none;}
// .data-table tr:hover td{background:${T.inputBg};}
// .date-tba{color:${T.textMuted};font-style:italic;font-size:.78rem;}
// .bold-date{font-weight:700;color:${T.accent};}
// .highlight-row td{background:${T.accentLight} !important;font-weight:600;}

// .vacancy-table{width:100%;border-collapse:collapse;font-size:.82rem;}
// .vacancy-table th{background:${T.navBg};color:#fff;padding:9px 14px;text-align:left;font-size:.72rem;text-transform:uppercase;letter-spacing:.5px;}
// .vacancy-table td{padding:10px 14px;border-bottom:1px solid ${T.divider};vertical-align:middle;}
// .vacancy-table tr:last-child td{border-bottom:none;font-weight:700;background:${T.accentLight};}
// .vac-count{font-weight:800;font-size:1.1rem;color:${T.accent};font-family:'DM Serif Display',serif;}

// .faq-item{margin-bottom:8px;border-radius:9px;overflow:hidden;border:1px solid ${T.cardBorder};}
// .faq-q{width:100%;display:flex;align-items:center;gap:10px;padding:11px 14px;background:${T.inputBg};border:none;cursor:pointer;text-align:left;transition:all .2s;font-family:'DM Sans',sans-serif;}
// .faq-q:hover{background:${T.accentLight};}
// .faq-num{color:#fff;font-size:.65rem;font-weight:800;padding:3px 7px;border-radius:5px;flex-shrink:0;transition:background .2s;}
// .faq-qtext{font-size:.82rem;font-weight:600;color:${T.textPrimary};flex:1;line-height:1.4;}
// .faq-arrow{color:${T.textMuted};font-size:1rem;flex-shrink:0;transition:transform .25s;}
// .faq-a{background:${T.cardBg};border-top:1px solid ${T.divider};}
// .faq-a-inner{padding:12px 14px 12px 40px;font-size:.82rem;color:${T.textSecondary};line-height:1.65;}

// .also-check-list{display:flex;flex-direction:column;gap:6px;}
// .also-check-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:${T.inputBg};border:1px solid ${T.inputBorder};text-decoration:none;font-size:.78rem;color:${T.textPrimary};font-weight:600;transition:all .2s;}
// .also-check-item:hover{background:${T.accentLight};border-color:${T.accentBorder};color:${T.accent};}
// .also-check-dot{width:6px;height:6px;border-radius:50%;background:${T.accent};flex-shrink:0;}

// .tags-row{display:flex;flex-wrap:wrap;gap:6px;}
// .tag{background:${T.accentLight};color:${T.accent};font-size:.68rem;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.4px;}

// .disclaimer{background:${disclaimerBg};border:1px solid ${disclaimerBorder};border-radius:10px;padding:12px 16px;font-size:.75rem;color:${disclaimerText};line-height:1.6;margin-bottom:16px;}
// .disclaimer strong{color:${disclaimerStrong};}

// .step-bubble{background:${T.accent};color:#fff;font-size:.72rem;font-weight:700;padding:7px 14px;border-radius:20px;white-space:nowrap;}
// .step-arrow{color:${T.accent};font-size:1.1rem;font-weight:700;margin:0 4px;}
// .apply-steps{list-style:none;counter-reset:step;}
// .apply-step{counter-increment:step;display:flex;gap:12px;margin-bottom:12px;font-size:.83rem;color:${T.textSecondary};line-height:1.6;align-items:flex-start;}
// .apply-step::before{content:counter(step);min-width:26px;height:26px;background:${T.accent};color:#fff;font-weight:800;font-size:.75rem;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}

// .link-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:9px;border:1.5px solid ${T.inputBorder};background:${T.inputBg};transition:all .2s;text-decoration:none;}
// .link-row:hover{border-color:${T.accent};background:${T.accentLight};transform:translateX(4px);}
// .link-label{font-size:.82rem;font-weight:600;color:${T.textPrimary};}
// .link-label-hi{font-size:.7rem;color:${T.textMuted};font-family:'Noto Sans Devanagari',sans-serif;}
// .link-arrow{background:${T.accent};color:#fff;font-size:.7rem;font-weight:700;padding:4px 10px;border-radius:6px;white-space:nowrap;flex-shrink:0;}
// .link-inactive{opacity:.45;pointer-events:none;}
// .link-soon{background:${T.textMuted};font-size:.65rem;padding:3px 8px;border-radius:6px;color:#fff;}

// .fee-card{border:1.5px solid ${T.accentBorder};border-radius:10px;padding:12px;text-align:center;background:${T.accentLight};}
// .fee-amount{font-size:1.5rem;font-weight:800;color:${T.accent};font-family:'DM Serif Display',serif;display:block;}
// .fee-label{font-size:.7rem;color:${T.textMuted};font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
// .fee-free{font-size:1.2rem;color:#15803d;font-weight:800;}

// .age-box{border:1.5px solid ${T.accentBorder};border-radius:10px;padding:12px 14px;background:${T.accentLight};}
// .age-box-label{font-size:.68rem;color:${T.textMuted};text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:4px;}
// .age-box-val{font-size:1.05rem;font-weight:700;color:${T.accentHover};}
// .age-relaxation{margin-top:12px;background:${ageRelaxBg};border:1px solid ${ageRelaxBorder};border-radius:8px;padding:10px 14px;font-size:.8rem;color:${ageRelaxText};}

// .pay-chip{background:${T.inputBg};border:1px solid ${T.inputBorder};color:${T.textSecondary};font-size:.7rem;font-weight:600;padding:4px 10px;border-radius:20px;}

// .social-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;border-radius:9px;font-size:.8rem;font-weight:700;text-decoration:none;transition:all .2s;border:none;cursor:pointer;}
// .social-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.15);}
// .whatsapp-btn{background:#25d366;color:#fff;}
// .telegram-btn{background:#2aabee;color:#fff;}

// .elig-block{padding:14px;border-radius:10px;border:1.5px solid ${T.accentBorder};background:${T.accentLight};margin-bottom:10px;}
// .elig-post{font-weight:700;color:${T.accentHover};font-size:.85rem;margin-bottom:6px;}
// .elig-criteria{font-size:.82rem;color:${T.textSecondary};line-height:1.65;}

// .quick-table{width:100%;font-size:.78rem;border-collapse:collapse;}
// .quick-table tr{border-bottom:1px solid ${T.divider};}
// .quick-table tr:last-child{border-bottom:none;}
// .quick-table td{padding:7px 4px;vertical-align:top;}
// .quick-table td:first-child{color:${T.textMuted};font-weight:600;width:45%;}
// .quick-table td:last-child{color:${T.textPrimary};font-weight:700;}
// `;
// }

// function SecHdr({ icon, label }: { icon: string; label: string }) {
// 	return (
// 		<div className="sec-hdr">
// 			<span style={{ fontSize: "1.05rem" }}>{icon}</span>
// 			<span className="sec-hdr-txt">{label}</span>
// 		</div>
// 	);
// }

// function FaqItem({ faq, index, color, T }: { faq: FaqRow; index: number; color: string; T: ThemeTokens }) {
// 	const [open, setOpen] = useState(false);
// 	return (
// 		<div className="faq-item">
// 			<button className="faq-q" onClick={() => setOpen(!open)} style={{ borderLeft: `3px solid ${open ? color : T.divider}` }}>
// 				<span className="faq-num" style={{ background: open ? color : T.textMuted }}>Q{index + 1}</span>
// 				<span className="faq-qtext">{faq.question}</span>
// 				<span className="faq-arrow" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
// 			</button>
// 			{open && (
// 				<div className="faq-a">
// 					<div className="faq-a-inner">{faq.answer}</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

// function formatDate(d: string) {
// 	if (!d) return "To Be Announced";
// 	try {
// 		return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
// 	} catch { return d; }
// }

// export default function PostClient({ post: rawPost }: { post: DbPost }) {
// 	const [isDark, setIsDark] = useState(false);
// 	const [lang, setLang] = useState<"en" | "hi">("en");

// 	const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

// 	 useEffect(() => {
// 		const savedTheme = localStorage.getItem("csc_theme");
// 		if (savedTheme) setIsDark(savedTheme === "dark");
// 		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
// 	  }, [user]);

// 	    // ─── HANDLERS ─── (Preserved Exactly)
//   const toggleTheme = () => {
//     const newDark = !isDark; setIsDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

// 	const T = isDark ? THEMES.dark : THEMES.light;

// 	const post = {
// 		...rawPost,
// 		eligibility: Array.isArray(rawPost.eligibility) ? rawPost.eligibility : [],
// 		vacancy_details: Array.isArray(rawPost.vacancy_details) ? rawPost.vacancy_details : [],
// 		important_dates: Array.isArray(rawPost.important_dates) ? rawPost.important_dates : [],
// 		selection_process: Array.isArray(rawPost.selection_process) ? rawPost.selection_process : [],
// 		important_links: Array.isArray(rawPost.important_links) ? rawPost.important_links : [],
// 		faqs: Array.isArray(rawPost.faqs) ? rawPost.faqs : [],
// 		also_check: Array.isArray(rawPost.also_check) ? rawPost.also_check : [],
// 		tags: Array.isArray(rawPost.tags) ? rawPost.tags : [],
// 		fee_payment_modes: Array.isArray(rawPost.fee_payment_modes) ? rawPost.fee_payment_modes : [],
// 		age_max: rawPost.age_max || "N/A",
// 		age_min: rawPost.age_min || 0,
// 		fee_general: rawPost.fee_general || 0,
// 		fee_sc_st: rawPost.fee_sc_st || 0,
// 		fee_ph: rawPost.fee_ph || 0,
// 		total_posts: rawPost.total_posts || 0,
// 		service_cost: rawPost.service_cost || 0,
// 		short_desc: rawPost.short_desc || "Details will be updated soon.",
// 		organization: rawPost.organization || "Department",
// 		category: rawPost.category || "Latest Job"
// 	};

// 	const t = THEME_MAP[post.theme] || THEME_MAP.blue;


// 	const totalVacancy = post.vacancy_details.reduce((s, v) => s + Number(v.no_of_posts || 0), 0) || post.total_posts || 0;

// 	// FIX #2: Properly typed hero chips array
// 	const heroChips: Array<[string, string] | null> = [
// 		["📅", `Posted: ${formatDate(post.post_date)}`],
// 		["📋", `Total Posts: ${totalVacancy.toLocaleString("en-IN")}`],
// 		["💰", `Fee: ₹${post.fee_general} (Gen)`],
// 		post.service_cost > 0 ? ["🛎️", `Service: ₹${post.service_cost}`] : null,
// 	];

// 	return (
// 		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', 'Noto Sans Devanagari', sans-serif", transition: "background .25s, color .25s" }}>
// 			<style dangerouslySetInnerHTML={{ __html: buildCss(T, isDark) }} />

// 			{/* HEADER */}
// 			<header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
// 				<div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
// 					<a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
// 						<div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
// 						<div>
// 							<div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
// 								Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
// 							</div>
// 							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>RECRUITMENT</div>
// 						</div>
// 					</a>

// 					<div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

// 					<nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
// 						{NAV_LINKS.map((l) => (
// 							<a key={l.href} href={l.href} className="top-nav-link">
// 								<span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
// 							</a>
// 						))}
// 					</nav>

// 					<div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
// 						<div style={{ display: "flex", background: T.inputBg, borderRadius: 8, overflow: "hidden", border: `1px solid ${T.inputBorder}` }}>
// 							<button
// 								className={`pill ${lang === "en" ? "on" : ""}`}
// 								onClick={() => setLang("en")}
// 								style={{ borderRadius: "8px 0 0 8px", border: "none" }}
// 							>
// 								EN
// 							</button>
// 							<button
// 								className={`pill ${lang === "hi" ? "on" : ""}`}
// 								onClick={() => setLang("hi")}
// 								style={{ borderRadius: "0 8px 8px 0", border: "none" }}
// 							>
// 								हिं
// 							</button>
// 						</div>
// 						<button className="tog" onClick={toggleTheme}>
// 							<span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
// 						</button>
// 					</div>
// 				</div>
// 			</header>

// 			{/* BREADCRUMB */}
// 			<div style={{ background: T.cardBg, borderBottom: `1px solid ${T.divider}`, padding: "10px 0", fontSize: 12, color: T.textMuted }}>
// 				<div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 8 }}>
// 					<a href="/" style={{ color: T.accent, textDecoration: "none", fontWeight: 600 }}>Home</a>
// 					<span>›</span>
// 					<a href="#" style={{ color: T.accent, textDecoration: "none", fontWeight: 600 }}>{post.category}</a>
// 					<span>›</span>
// 					<span style={{ color: T.textPrimary }}>{post.title}</span>
// 				</div>
// 			</div>

// 			{/* HERO */}
// 			<div style={{ background: `linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 60%, ${t.accent}88 100%)`, padding: "32px 0 0", position: "relative", overflow: "hidden" }}>
// 				<div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
// 				<div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", position: "relative" }}>
// 					<div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, backdropFilter: "blur(4px)" }}>
// 						🔴 <span>Live</span> · {post.category}
// 					</div>
// 					<h1 className="serif" style={{ color: "#fff", fontSize: "clamp(1.4rem, 4vw, 2.1rem)", lineHeight: 1.25, marginBottom: 6 }}>
// 						{lang === "en" ? post.title : post.title_hi}
// 					</h1>
// 					<p className="hi" style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", marginBottom: 16 }}>
// 						{lang === "en" ? post.organization : post.organization_hi}
// 					</p>
// 					<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
// 						{heroChips.filter((chip): chip is [string, string] => chip !== null).map(([ic, txt], i) => (
// 							<div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: 12, padding: "5px 12px", borderRadius: 8, fontWeight: 500 }}>
// 								{ic} <span style={{ color: "#fff", fontWeight: 700 }}>{txt}</span>
// 							</div>
// 						))}
// 					</div>
// 					{post.tags.length > 0 && (
// 						<div className="tags-row" style={{ marginBottom: 16 }}>
// 							{post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
// 						</div>
// 					)}
// 				</div>
// 				<div style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 4 }}>
// 					<div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 4 }}>
// 						{[
// 							[totalVacancy.toLocaleString("en-IN"), "Total Vacancies"],
// 							[`₹${post.fee_general}`, "General Fee"],
// 							[`${post.age_min}–${post.age_max.split(" ")[0]}`, "Age Limit"],
// 							[post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)?.date ? formatDate(post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)!.date).replace(",", "") : "Announced", "Last Date"],
// 						].map(([val, lbl]) => (
// 							<div key={lbl} style={{ textAlign: "center", padding: "8px 4px" }}>
// 								<span className="serif" style={{ display: "block", fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{val}</span>
// 								<span style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 2, fontWeight: 600 }}>{lbl}</span>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>

// 			{/* STICKY CTA BAR */}
// 			<div style={{ background: T.cardBg, borderBottom: `2px solid ${T.accentLight}`, padding: "10px 0", position: "sticky", top: 0, zIndex: 100, boxShadow: T.cardShadow }}>
// 				<div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
// 					<div style={{ fontWeight: 700, fontSize: 14, color: T.textPrimary, flex: 1, minWidth: 180 }}>
// 						<span style={{ color: T.accent }}>{post.organization.length > 40 ? post.organization.substring(0, 40) + "…" : post.organization}</span>
// 					</div>
// 					<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
// 						<button className="btn btn-g">🔔 Notify Me</button>
// 						<a href={post.important_links.find(l => l.label.toLowerCase().includes("apply"))?.url || "#"} className="btn btn-p" target="_blank" rel="noopener noreferrer">
// 							✍️ Apply Online
// 						</a>
// 					</div>
// 				</div>
// 			</div>

// 			{/* PAGE BODY */}
// 			<div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 40px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start", flex: 1 }}>
// 				<main>

// 					{/* SHORT DESCRIPTION */}
// 					<div className="card" style={{ marginBottom: 16 }}>
// 						<div style={{ padding: "20px 24px" }}>
// 							<p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, borderLeft: `3px solid ${T.accent}`, paddingLeft: 12, margin: 0 }}>
// 								{post.short_desc}
// 							</p>
// 						</div>
// 					</div>

// 					{/* IMPORTANT DATES */}
// 					{post.important_dates.length > 0 && (
// 						<div className="card" style={{ marginBottom: 16 }}>
// 							<SecHdr icon="📅" label="Important Dates" />
// 							<div style={{ overflowX: "auto" }}>
// 								<table className="data-table">
// 									<thead>
// 										<tr>
// 											<th>Event</th>
// 											<th className="hi">कार्यक्रम</th>
// 											<th>Date</th>
// 										</tr>
// 									</thead>
// 									<tbody>
// 										{post.important_dates.map((d, i) => (
// 											<tr key={i} className={d.is_bold ? "highlight-row" : ""}>
// 												<td style={{ fontWeight: d.is_bold ? 700 : 400 }}>{d.label}</td>
// 												<td className="hi" style={{ fontSize: "0.78rem" }}>{d.label_hi}</td>
// 												<td>
// 													{d.date
// 														? <span className={d.is_bold ? "bold-date" : ""}>{formatDate(d.date)}</span>
// 														: <span className="date-tba">⏳ To Be Announced</span>
// 													}
// 												</td>
// 											</tr>
// 										))}
// 									</tbody>
// 								</table>
// 							</div>
// 						</div>
// 					)}

// 					{/* APPLICATION FEE */}
// 					<div className="card" style={{ marginBottom: 16 }}>
// 						<SecHdr icon="💰" label="Application Fee" />
// 						<div style={{ padding: "20px 24px" }}>
// 							<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
// 								<div className="fee-card">
// 									<span className="fee-amount">₹{post.fee_general}</span>
// 									<span className="fee-label">General / OBC / EWS</span>
// 								</div>
// 								<div className="fee-card">
// 									{post.fee_sc_st === 0 ? (
// 										<><span className="fee-free">FREE</span><span className="fee-label">SC / ST / Female</span></>
// 									) : (
// 										<><span className="fee-amount">₹{post.fee_sc_st}</span><span className="fee-label">SC / ST / Female</span></>
// 									)}
// 								</div>
// 								<div className="fee-card">
// 									{post.fee_ph === 0 ? (
// 										<><span className="fee-free">FREE</span><span className="fee-label">PwD / Divyangjan</span></>
// 									) : (
// 										<><span className="fee-amount">₹{post.fee_ph}</span><span className="fee-label">PwD / Divyangjan</span></>
// 									)}
// 								</div>
// 							</div>
// 							{post.fee_payment_modes.length > 0 && (
// 								<>
// 									<div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.5px" }}>Payment Modes</div>
// 									<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
// 										{post.fee_payment_modes.map(m => <span key={m} className="pay-chip">{m}</span>)}
// 									</div>
// 								</>
// 							)}
// 						</div>
// 					</div>

// 					{/* AGE LIMIT */}
// 					<div className="card" style={{ marginBottom: 16 }}>
// 						<SecHdr icon="🎂" label="Age Limit" />
// 						<div style={{ padding: "20px 24px" }}>
// 							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
// 								<div className="age-box">
// 									<div className="age-box-label">Minimum Age</div>
// 									<div className="age-box-val">{post.age_min} Years</div>
// 								</div>
// 								<div className="age-box">
// 									<div className="age-box-label">Maximum Age</div>
// 									<div className="age-box-val">{post.age_max}</div>
// 								</div>
// 								{post.age_as_on_date && (
// 									<div className="age-box" style={{ gridColumn: "1 / -1" }}>
// 										<div className="age-box-label">Age Calculated as on</div>
// 										<div className="age-box-val">{formatDate(post.age_as_on_date)}</div>
// 									</div>
// 								)}
// 							</div>
// 							{post.age_relaxation && (
// 								<div className="age-relaxation">
// 									<strong>⚠️ Age Relaxation:</strong> {post.age_relaxation}
// 								</div>
// 							)}
// 						</div>
// 					</div>

// 					{/* VACANCY DETAILS */}
// 					{post.vacancy_details.length > 0 && (
// 						<div className="card" style={{ marginBottom: 16 }}>
// 							<SecHdr icon="📊" label="Vacancy Details" />
// 							<div style={{ overflowX: "auto" }}>
// 								<table className="vacancy-table">
// 									<thead>
// 										<tr>
// 											<th>#</th>
// 											<th>Post Name</th>
// 											<th>Category</th>
// 											<th style={{ textAlign: "right" }}>Posts</th>
// 										</tr>
// 									</thead>
// 									<tbody>
// 										{post.vacancy_details.map((v, i) => (
// 											<tr key={i}>
// 												<td style={{ color: T.textMuted, fontWeight: 600, fontSize: "0.75rem" }}>{String(i + 1).padStart(2, "0")}</td>
// 												<td style={{ fontWeight: 600 }}>{v.post_name}</td>
// 												<td style={{ color: T.textMuted, fontSize: "0.78rem" }}>{v.category || "—"}</td>
// 												<td style={{ textAlign: "right" }}><span className="vac-count">{v.no_of_posts.toLocaleString("en-IN")}</span></td>
// 											</tr>
// 										))}
// 										<tr>
// 											<td colSpan={3} style={{ fontWeight: 800, textAlign: "right", paddingRight: 14 }}>Total Vacancies</td>
// 											<td style={{ textAlign: "right" }}><span className="vac-count">{totalVacancy.toLocaleString("en-IN")}</span></td>
// 										</tr>
// 									</tbody>
// 								</table>
// 							</div>
// 						</div>
// 					)}

// 					{/* ELIGIBILITY */}
// 					{post.eligibility.length > 0 && (
// 						<div className="card" style={{ marginBottom: 16 }}>
// 							<SecHdr icon="🎓" label="Eligibility / Education Qualification" />
// 							<div style={{ padding: "20px 24px" }}>
// 								{post.eligibility.map((e, i) => (
// 									<div key={i} className="elig-block">
// 										<div className="elig-post">📌 {e.post_name}</div>
// 										<div className="elig-criteria">
// 											{lang === "en" ? e.criteria : e.criteria_hi}
// 										</div>
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 					)}

// 					{/* SELECTION PROCESS */}
// 					{post.selection_process.length > 0 && (
// 						<div className="card" style={{ marginBottom: 16 }}>
// 							<SecHdr icon="🏆" label="Mode of Selection" />
// 							<div style={{ padding: "20px 24px" }}>
// 								<div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
// 									{post.selection_process.map((step, i) => (
// 										<div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
// 											<div className="step-bubble">{step}</div>
// 											{i < post.selection_process.length - 1 && <div className="step-arrow">→</div>}
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 						</div>
// 					)}

// 					{/* HOW TO APPLY */}
// 					{(post.how_to_apply || post.how_to_apply_hi) && (
// 						<div className="card" style={{ marginBottom: 16 }}>
// 							<SecHdr icon="📝" label="How to Apply" />
// 							<div style={{ padding: "20px 24px" }}>
// 								<ol className="apply-steps">
// 									{(lang === "en" ? post.how_to_apply : post.how_to_apply_hi)
// 										.split("\n")
// 										.filter(Boolean)
// 										.map((line, i) => {
// 											const cleaned = line.replace(/^Step\s*\d+[:.)]\s*/i, "").trim();
// 											return cleaned ? <li key={i} className="apply-step">{cleaned}</li> : null;
// 										})}
// 								</ol>
// 							</div>
// 						</div>
// 					)}

// 					{/* IMPORTANT LINKS */}
// 					{post.important_links.length > 0 && (
// 						<div className="card" style={{ marginBottom: 16 }}>
// 							<SecHdr icon="🔗" label="Important Links" />
// 							<div style={{ padding: "20px 24px" }}>
// 								<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
// 									{post.important_links.map((link, i) => (
// 										<a
// 											key={i}
// 											href={link.is_active ? link.url : undefined}
// 											target="_blank"
// 											rel="noopener noreferrer"
// 											className={`link-row ${!link.is_active ? "link-inactive" : ""}`}
// 										>
// 											<div>
// 												<div className="link-label">{link.label}</div>
// 												{link.label_hi && <div className="link-label-hi">{link.label_hi}</div>}
// 											</div>
// 											{link.is_active
// 												? <span className="link-arrow">Open ↗</span>
// 												: <span className="link-soon">Coming Soon</span>
// 											}
// 										</a>
// 									))}
// 								</div>
// 							</div>
// 						</div>
// 					)}

// 					{/* FAQs */}
// 					{post.faqs.length > 0 && (
// 						<div className="card" style={{ marginBottom: 16 }}>
// 							<SecHdr icon="❓" label="Frequently Asked Questions" />
// 							<div style={{ padding: "20px 24px" }}>
// 								{post.faqs.map((faq, i) => (
// 									<FaqItem key={i} faq={faq} index={i} color={t.primary} T={T} />
// 								))}
// 							</div>
// 						</div>
// 					)}

// 					{/* DISCLAIMER */}
// 					<div className="disclaimer">
// 						<strong>⚠️ Disclaimer:</strong> All information provided on this page is for informational purposes only. Candidates are advised to verify all details from the official notification before applying. This website is not affiliated with any government body. Always refer to the official website for authentic information.
// 					</div>

// 				</main>

// 				{/* SIDEBAR */}
// 				<aside style={{ position: "sticky", top: 70 }}>
// 					{/* QUICK INFO */}
// 					<div className="card" style={{ marginBottom: 14 }}>
// 						<SecHdr icon="ℹ️" label="Quick Information" />
// 						<div style={{ padding: 16 }}>
// 							<table className="quick-table">
// 								<tbody>
// 									<tr><td>Organization</td><td>{post.organization}</td></tr>
// 									<tr><td>Post Name</td><td>{post.title.replace(/recruitment\s*\d{4}/i, "").trim()}</td></tr>
// 									<tr><td>Category</td><td>{post.category}</td></tr>
// 									<tr><td>Total Posts</td><td>{totalVacancy.toLocaleString("en-IN")}</td></tr>
// 									<tr><td>Application Fee</td><td>₹{post.fee_general}</td></tr>
// 									<tr><td>Age Limit</td><td>{post.age_min}–{post.age_max}</td></tr>
// 									<tr><td>Post Date</td><td>{formatDate(post.post_date)}</td></tr>
// 									<tr>
// 										<td>Last Date</td>
// 										<td style={{ color: "#dc2626", fontWeight: 800 }}>
// 											{post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)
// 												? formatDate(post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)!.date)
// 												: "See above"}
// 										</td>
// 									</tr>
// 								</tbody>
// 							</table>
// 						</div>
// 					</div>

// 					{/* APPLY NOW */}
// 					<div className="card" style={{ marginBottom: 14 }}>
// 						<SecHdr icon="🚀" label="Apply Now" />
// 						<div style={{ padding: 16 }}>
// 							<a
// 								href={post.important_links.find(l => l.label.toLowerCase().includes("apply") && l.is_active)?.url || "#"}
// 								target="_blank"
// 								rel="noopener noreferrer"
// 								className="btn btn-p"
// 								style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: 12, borderRadius: 9 }}
// 							>
// 								✍️ Apply Online Now
// 							</a>
// 							<a
// 								href={post.important_links.find(l => l.label.toLowerCase().includes("notification") && l.is_active)?.url || "#"}
// 								target="_blank"
// 								rel="noopener noreferrer"
// 								className="btn btn-g"
// 								style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
// 							>
// 								📄 Download Notification
// 							</a>
// 						</div>
// 					</div>

// 					{/* SOCIAL */}
// 					{(post.whatsapp_link || post.telegram_link) && (
// 						<div className="card" style={{ marginBottom: 14 }}>
// 							<SecHdr icon="📣" label="Stay Updated" />
// 							<div style={{ padding: 16 }}>
// 								<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
// 									{post.whatsapp_link && (
// 										<a href={post.whatsapp_link} target="_blank" rel="noopener noreferrer" className="social-btn whatsapp-btn">
// 											<span>💬</span> Join WhatsApp Channel
// 										</a>
// 									)}
// 									{post.telegram_link && (
// 										<a href={post.telegram_link} target="_blank" rel="noopener noreferrer" className="social-btn telegram-btn">
// 											<span>✈️</span> Join Telegram Channel
// 										</a>
// 									)}
// 								</div>
// 							</div>
// 						</div>
// 					)}

// 					{/* ALSO CHECK */}
// 					{post.also_check.length > 0 && (
// 						<div className="card" style={{ marginBottom: 14 }}>
// 							<SecHdr icon="👀" label="You May Also Check" />
// 							<div style={{ padding: 16 }}>
// 								<div className="also-check-list">
// 									{post.also_check.map((item, i) => (
// 										<a key={i} href={item.url} className="also-check-item">
// 											<div className="also-check-dot" />
// 											{item.label}
// 										</a>
// 									))}
// 								</div>
// 							</div>
// 						</div>
// 					)}

// 				</aside>
// 			</div>

// 			{/* FOOTER */}
// 			<div style={{ background: T.navBg, padding: "18px 0", marginTop: 10, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
// 				<p>© 2026 SrilalCSC · All content sourced from official government notifications. For official information visit <a href="#" style={{ color: T.navBrandAccent, textDecoration: "none" }}>ssc.gov.in</a></p>
// 			</div>

// 			{/* SEMANTIC BOT */}
// 			<SemanticBot post={post} color={t.primary} isDark={isDark} />
// 		</div>
// 	);
// }














"use client";

/**
 * PostClient.tsx — REDESIGNED for
 * D:\csc-platform\src\app\posts\[id]\PostClient.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same props as
 * before: PostClient({ post }: { post: DbPost }).
 *
 * DESIGN: a recruitment notice page, not a dashboard — breadcrumb, a
 * solid-colour hero band carrying the facts (Live badge, chips, tags,
 * stat strip), a sticky apply bar, then the detail on the left
 * (description, dates, fee, age, vacancies, eligibility, selection,
 * how to apply, links, FAQs, disclaimer) and the help panel on the
 * right (quick information, apply now, WhatsApp/Telegram, also check).
 * One accent for all site chrome (deep blue, both themes); the post's
 * own theme colour from the database is used only where it identifies
 * the post — the hero band, the FAQ numbers and the SemanticBot.
 *
 * KEPT, exactly as supplied:
 * - The DbPost interface and every row interface (ImportantDate,
 *   VacancyRow, EligibilityRow, LinkRow, FaqRow, AlsoCheckRow).
 * - THEME_MAP (the 8 per-post theme colours from the database).
 * - All data normalisation: arrays defaulted to [], age_max "N/A",
 *   age_min / fees / total_posts / service_cost defaulted to 0,
 *   short_desc fallback "Details will be updated soon.", organization
 *   fallback "Department", category fallback "Latest Job".
 * - totalVacancy (sum of vacancy rows, else total_posts), heroChips
 *   (including the conditional service-cost chip), the last-date
 *   lookup, the EN / हिं toggle and every bilingual field.
 * - The 7 nav links and their labels; the theme state (localStorage
 *   csc_theme, system fallback, [user] effect dependency) and the
 *   toggle — plus the `dark` class sync.
 * - SemanticBot usage: <SemanticBot post={post} color={t.primary}
 *   isDark={isDark} />.
 * - All copy and all computed values: fee cards (FREE when 0),
 *   vacancy total row, age-as-on date, age relaxation note, the
 *   disclaimer text, the footer line.
 *
 * CHANGED:
 * - The THEMES object, ThemeTokens interface and buildCss() are gone
 *   (Google Fonts @import, global * reset, fadeIn/stampIn/pop
 *   keyframes, and the .data-table / .vacancy-table / .faq-* /
 *   .link-row / .fee-card / .age-box / .step-bubble / .elig-block /
 *   .quick-table / .tag / .disclaimer / .pay-chip / .social-btn
 *   classes are all Tailwind classes now).
 * - Icons were emoji (🏛️ 📅 💰 🎂 📊 🎓 🏆 📝 🔗 ❓ ⚠️ ℹ️ 🚀 📣 👀
 *   🔔 ✍️ 📄 💬 ✈️ 🗓️ 📋 🛎️ 🔴 ⏳ ○) — lucide icons now.
 * - The hero gradient is a solid band in the post's own dark theme
 *   colour; section headers are plain (lucide icon + uppercase
 *   label, no gradient); the sticky CTA bar is plain, no shadow.
 * - Nav links were absolute URLs chosen by NODE_ENV (production
 *   https://srilalsahaj.co.in/... vs http://localhost:3000/...) —
 *   now relative routes. Same destinations on every domain.
 * - FaqItem no longer takes the theme tokens; it uses Tailwind
 *   classes and the post colour only for its Q number.
 *
 * FLAGS (kept as supplied — see the report, needs Swatantra's word):
 * 1. The breadcrumb category link is href="#" — a dead link.
 * 2. The "Notify Me" button has no onClick — it does nothing.
 * 3. The Apply Online link falls back to href="#" when no apply
 *    link is found in the post's important links.
 * 4. The footer says to visit ssc.gov.in but the link is href="#".
 * 5. useAuth values (user, isLoggedIn, logout, authLoading) are
 *    destructured but never used in the render.
 *
 * No new file needed. The server page (src/app/posts/[id]/page.tsx)
 * is unchanged apart from the emoji in its error log lines.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Cake,
  Calendar,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Eye,
  FileText,
  GraduationCap,
  Hourglass,
  Info,
  Landmark,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Moon,
  Package,
  PenLine,
  Rocket,
  Send,
  Sun,
  Trophy,
  User,
  BarChart3,
  Image as ImageIcon,
  IndianRupee,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const SemanticBot = dynamic(() => import("./SemanticBot"), { ssr: false });

interface ImportantDate { label: string; label_hi: string; date: string; is_bold: boolean; }
interface VacancyRow { post_name: string; no_of_posts: number; category?: string; }
interface EligibilityRow { post_name: string; criteria: string; criteria_hi: string; }
interface LinkRow { label: string; label_hi: string; url: string; is_active: boolean; }
interface FaqRow { question: string; answer: string; }
interface AlsoCheckRow { label: string; url: string; }

export interface DbPost {
  id: string;
  title: string;
  title_hi: string;
  short_desc: string;
  theme: string;
  service_cost: number;
  category: string;
  tags: string[];
  slug: string;
  banner_url?: string;
  is_published: boolean;
  organization: string;
  organization_hi: string;
  total_posts: number;
  post_date: string;
  important_dates: ImportantDate[];
  fee_general: number;
  fee_sc_st: number;
  fee_ph: number;
  fee_payment_modes: string[];
  age_min: number;
  age_max: string;
  age_as_on_date: string;
  age_relaxation: string;
  vacancy_details: VacancyRow[];
  eligibility: EligibilityRow[];
  selection_process: string[];
  how_to_apply: string;
  how_to_apply_hi: string;
  important_links: LinkRow[];
  faqs: FaqRow[];
  also_check: AlsoCheckRow[];
  whatsapp_link: string;
  telegram_link: string;
  created_at: string;
  updated_at: string;
}

// ─── PER-POST THEME COLOURS (data-driven, from the post's `theme` field) ───
// Kept verbatim. The post's own colour identifies the post (hero band,
// FAQ numbers, SemanticBot); all site chrome uses the single deep-blue
// accent via Tailwind classes.
const THEME_MAP: Record<string, { primary: string; dark: string; light: string; badge: string; ring: string; btn: string; accent: string }> = {
  blue: { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", badge: "#dbeafe", ring: "#93c5fd", btn: "bg-blue-600 hover:bg-blue-700", accent: "#3b82f6" },
  green: { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", badge: "#dcfce7", ring: "#86efac", btn: "bg-green-600 hover:bg-green-700", accent: "#22c55e" },
  red: { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", badge: "#fee2e2", ring: "#fca5a5", btn: "bg-red-600 hover:bg-red-700", accent: "#ef4444" },
  orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", badge: "#fed7aa", ring: "#fdba74", btn: "bg-orange-600 hover:bg-orange-700", accent: "#f97316" },
  purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", badge: "#ede9fe", ring: "#c4b5fd", btn: "bg-violet-600 hover:bg-violet-700", accent: "#8b5cf6" },
  teal: { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", badge: "#ccfbf1", ring: "#5eead4", btn: "bg-teal-600 hover:bg-teal-700", accent: "#14b8a6" },
  indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", badge: "#e0e7ff", ring: "#a5b4fc", btn: "bg-indigo-600 hover:bg-indigo-700", accent: "#6366f1" },
  rose: { primary: "#be123c", dark: "#881337", light: "#fff1f2", badge: "#ffe4e6", ring: "#fda4af", btn: "bg-rose-600 hover:bg-rose-700", accent: "#f43f5e" },
};

const NAV_LINKS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts", icon: PenLine, label: "Posts" },
  { href: "/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/status", icon: BarChart3, label: "Status" },
  { href: "/delivery", icon: Package, label: "Delivery" },
];

// ─── SECTION HEADER (plain: lucide icon + uppercase label, no gradient) ───
function SecHdr({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3 dark:border-slate-700">
      <Icon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden />
      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">{label}</span>
    </div>
  );
}

// ─── FAQ ITEM (kept as a component, with its own open state) ───
function FaqItem({ faq, index, color }: { faq: FaqRow; index: number; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        className={`flex w-full items-center gap-2.5 bg-slate-50 px-3.5 py-2.5 text-left transition-colors hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-blue-950/40 ${open ? "border-l-[3px]" : "border-l-[3px] border-slate-200 dark:border-slate-700"}`}
        style={open ? { borderLeftColor: color } : undefined}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-extrabold text-white"
          style={{ background: open ? color : "#64748b" }}
        >
          Q{index + 1}
        </span>
        <span className="flex-1 text-[13px] font-semibold leading-snug text-slate-900 dark:text-slate-100">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="px-3.5 py-3 pl-10 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</div>
        </div>
      )}
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "To Be Announced";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  } catch { return d; }
}

export default function PostClient({ post: rawPost }: { post: DbPost }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");

  // FLAG 5: these values are destructured but never used in the render,
  // exactly as supplied.
  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();
  void isLoggedIn;
  void logout;
  void authLoading;
  void user;

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, [user]);

  // Keep the `dark` class on <html> in sync so Tailwind `dark:` variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark; setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const post = {
    ...rawPost,
    eligibility: Array.isArray(rawPost.eligibility) ? rawPost.eligibility : [],
    vacancy_details: Array.isArray(rawPost.vacancy_details) ? rawPost.vacancy_details : [],
    important_dates: Array.isArray(rawPost.important_dates) ? rawPost.important_dates : [],
    selection_process: Array.isArray(rawPost.selection_process) ? rawPost.selection_process : [],
    important_links: Array.isArray(rawPost.important_links) ? rawPost.important_links : [],
    faqs: Array.isArray(rawPost.faqs) ? rawPost.faqs : [],
    also_check: Array.isArray(rawPost.also_check) ? rawPost.also_check : [],
    tags: Array.isArray(rawPost.tags) ? rawPost.tags : [],
    fee_payment_modes: Array.isArray(rawPost.fee_payment_modes) ? rawPost.fee_payment_modes : [],
    age_max: rawPost.age_max || "N/A",
    age_min: rawPost.age_min || 0,
    fee_general: rawPost.fee_general || 0,
    fee_sc_st: rawPost.fee_sc_st || 0,
    fee_ph: rawPost.fee_ph || 0,
    total_posts: rawPost.total_posts || 0,
    service_cost: rawPost.service_cost || 0,
    short_desc: rawPost.short_desc || "Details will be updated soon.",
    organization: rawPost.organization || "Department",
    category: rawPost.category || "Latest Job",
  };

  const t = THEME_MAP[post.theme] || THEME_MAP.blue;

  const totalVacancy = post.vacancy_details.reduce((s, v) => s + Number(v.no_of_posts || 0), 0) || post.total_posts || 0;

  // Hero chips: icon + text (emoji in the original were icons, not copy).
  const heroChips: Array<{ icon: LucideIcon; text: string } | null> = [
    { icon: Calendar, text: `Posted: ${formatDate(post.post_date)}` },
    { icon: ClipboardList, text: `Total Posts: ${totalVacancy.toLocaleString("en-IN")}` },
    { icon: IndianRupee, text: `Fee: ₹${post.fee_general} (Gen)` },
    post.service_cost > 0 ? { icon: Bell, text: `Service: ₹${post.service_cost}` } : null,
  ];

  const lastDate = post.important_dates.find((d) => d.label.toLowerCase().includes("last date") && d.date);
  const applyLink = post.important_links.find((l) => l.label.toLowerCase().includes("apply"));
  const activeApplyLink = post.important_links.find((l) => l.label.toLowerCase().includes("apply") && l.is_active);
  const notificationLink = post.important_links.find((l) => l.label.toLowerCase().includes("notification") && l.is_active);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      {/* HEADER — navy in both themes */}
      <header className="sticky top-0 z-[100] border-b-[3px] border-blue-600 bg-[#0b2239] shadow-sm dark:border-blue-500 dark:bg-[#081120]">
        <div className="flex h-[54px] items-center gap-3.5 border-b border-white/10 px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-600">
              <Landmark className="h-4 w-4" aria-hidden />
            </span>
            <span>
              <span className="block text-[17px] font-bold leading-none tracking-tight text-white">
                Srilal<span className="text-blue-300">CSC</span>
              </span>
              <span className="mt-0.5 block font-mono text-[9px] tracking-[0.1em] text-white/40">RECRUITMENT</span>
            </span>
          </Link>

          <span className="h-[26px] w-px shrink-0 bg-white/10" aria-hidden />

          <nav className="flex flex-1 gap-0.5 overflow-x-auto" aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white"
              >
                <l.icon className="h-3.5 w-3.5" aria-hidden /> {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex overflow-hidden rounded-lg border border-white/15 bg-white/5">
              <button
                type="button"
                className={`rounded-l-lg px-3 py-1.5 !text-[11px] font-bold uppercase tracking-wide transition-colors ${lang === "en" ? "bg-blue-600 text-white" : "text-white/60 hover:text-white"}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`rounded-r-lg px-3 py-1.5 !text-[11px] font-bold uppercase tracking-wide transition-colors ${lang === "hi" ? "bg-blue-600 text-white" : "text-white/60 hover:text-white"}`}
                onClick={() => setLang("hi")}
              >
                हिं
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="flex items-center gap-1.5 rounded-full border-[1.5px] border-blue-300/40 bg-white/5 px-3.5 py-1.5 !text-xs font-bold text-white/70 transition-colors hover:border-blue-400 hover:text-white"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" aria-hidden /> : <Moon className="h-3.5 w-3.5" aria-hidden />}
              {isDark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="border-b border-slate-200 bg-white py-2.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-[#111a2e] dark:text-slate-400">
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 px-4">
          <Link href="/" className="font-semibold text-blue-700 no-underline dark:text-blue-400">Home</Link>
          <span aria-hidden>›</span>
          {/* FLAG 1: the category link is href="#" — a dead link, kept as supplied. */}
          <a href="#" className="font-semibold text-blue-700 no-underline dark:text-blue-400">{post.category}</a>
          <span aria-hidden>›</span>
          <span className="truncate text-slate-900 dark:text-slate-100">{post.title}</span>
        </div>
      </div>

      {/* HERO — solid band in the post's own dark theme colour */}
      <div className="pt-8 text-white" style={{ backgroundColor: t.dark }}>
        <div className="mx-auto max-w-[1100px] px-4">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden /> Live · {post.category}
          </span>
          <h1 className="mb-1.5 text-[clamp(1.4rem,4vw,2.1rem)] font-bold leading-tight">
            {lang === "en" ? post.title : post.title_hi}
          </h1>
          <p className="mb-4 text-[clamp(0.9rem,2.5vw,1.1rem)] text-white/75">
            {lang === "en" ? post.organization : post.organization_hi}
          </p>
          <div className="mb-5 flex flex-wrap gap-2.5">
            {heroChips.filter((chip): chip is { icon: LucideIcon; text: string } => chip !== null).map((chip, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
                <chip.icon className="h-3.5 w-3.5" aria-hidden />
                <span className="font-bold text-white">{chip.text}</span>
              </div>
            ))}
          </div>
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-1 border-t border-white/10 bg-black/25">
          <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-1 px-4 py-3.5 sm:grid-cols-4">
            {[
              [totalVacancy.toLocaleString("en-IN"), "Total Vacancies"],
              [`₹${post.fee_general}`, "General Fee"],
              [`${post.age_min}–${post.age_max.split(" ")[0]}`, "Age Limit"],
              [lastDate ? formatDate(lastDate.date).replace(",", "") : "Announced", "Last Date"],
            ].map(([val, lbl]) => (
              <div key={lbl} className="px-1 py-2 text-center">
                <span className="block text-2xl font-bold leading-none text-white">{val}</span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY CTA BAR */}
      <div className="sticky top-[54px] z-[100] border-b-2 border-blue-100 bg-white dark:border-blue-950 dark:bg-[#111a2e]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-2.5 px-4 py-2.5">
          <div className="min-w-[180px] flex-1 text-sm font-bold text-slate-900 dark:text-slate-100">
            <span className="text-blue-700 dark:text-blue-400">
              {post.organization.length > 40 ? post.organization.substring(0, 40) + "…" : post.organization}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* FLAG 2: "Notify Me" has no onClick — it does nothing, as supplied. */}
            <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 !text-[13px] font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400">
              <Bell className="h-3.5 w-3.5" aria-hidden /> Notify Me
            </button>
            <a
              href={applyLink?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 !text-[13px] font-semibold text-white no-underline transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <PenLine className="h-3.5 w-3.5" aria-hidden /> Apply Online
            </a>
          </div>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="mx-auto grid w-full max-w-[1100px] flex-1 items-start gap-5 px-4 py-5 lg:grid-cols-[1fr_320px]">
        <main>
          {/* SHORT DESCRIPTION */}
          <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
            <div className="px-6 py-5">
              <p className="m-0 border-l-[3px] border-blue-700 pl-3 text-sm leading-relaxed text-slate-600 dark:border-blue-500 dark:text-slate-300">
                {post.short_desc}
              </p>
            </div>
          </section>

          {/* IMPORTANT DATES */}
          {post.important_dates.length > 0 && (
            <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={CalendarDays} label="Important Dates" />
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      <th className="border-b-2 border-blue-200 bg-blue-50 px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">Event</th>
                      <th className="border-b-2 border-blue-200 bg-blue-50 px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">कार्यक्रम</th>
                      <th className="border-b-2 border-blue-200 bg-blue-50 px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.important_dates.map((d, i) => (
                      <tr key={i} className={d.is_bold ? "bg-blue-50 font-semibold dark:bg-blue-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}>
                        <td className={`border-b border-slate-200 px-3.5 py-2.5 text-slate-600 dark:border-slate-700 dark:text-slate-300 ${d.is_bold ? "font-bold" : ""}`}>{d.label}</td>
                        <td className="border-b border-slate-200 px-3.5 py-2.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">{d.label_hi}</td>
                        <td className="border-b border-slate-200 px-3.5 py-2.5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                          {d.date
                            ? <span className={d.is_bold ? "font-bold text-blue-700 dark:text-blue-400" : ""}>{formatDate(d.date)}</span>
                            : <span className="inline-flex items-center gap-1 text-xs italic text-slate-400"><Hourglass className="h-3 w-3" aria-hidden /> To Be Announced</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* APPLICATION FEE */}
          <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
            <SecHdr icon={IndianRupee} label="Application Fee" />
            <div className="px-6 py-5">
              <div className="mb-3.5 grid grid-cols-3 gap-2.5">
                <div className="rounded-lg border-[1.5px] border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-900 dark:bg-blue-950/40">
                  <span className="block text-2xl font-extrabold text-blue-700 dark:text-blue-400">₹{post.fee_general}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">General / OBC / EWS</span>
                </div>
                <div className="rounded-lg border-[1.5px] border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-900 dark:bg-blue-950/40">
                  {post.fee_sc_st === 0 ? (
                    <><span className="block text-xl font-extrabold text-green-700 dark:text-green-400">FREE</span><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">SC / ST / Female</span></>
                  ) : (
                    <><span className="block text-2xl font-extrabold text-blue-700 dark:text-blue-400">₹{post.fee_sc_st}</span><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">SC / ST / Female</span></>
                  )}
                </div>
                <div className="rounded-lg border-[1.5px] border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-900 dark:bg-blue-950/40">
                  {post.fee_ph === 0 ? (
                    <><span className="block text-xl font-extrabold text-green-700 dark:text-green-400">FREE</span><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">PwD / Divyangjan</span></>
                  ) : (
                    <><span className="block text-2xl font-extrabold text-blue-700 dark:text-blue-400">₹{post.fee_ph}</span><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">PwD / Divyangjan</span></>
                  )}
                </div>
              </div>
              {post.fee_payment_modes.length > 0 && (
                <>
                  <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Payment Modes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {post.fee_payment_modes.map((m) => (
                      <span key={m} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{m}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* AGE LIMIT */}
          <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
            <SecHdr icon={Cake} label="Age Limit" />
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border-[1.5px] border-blue-200 bg-blue-50 px-3.5 py-3 dark:border-blue-900 dark:bg-blue-950/40">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Minimum Age</div>
                  <div className="text-lg font-bold text-blue-800 dark:text-blue-300">{post.age_min} Years</div>
                </div>
                <div className="rounded-lg border-[1.5px] border-blue-200 bg-blue-50 px-3.5 py-3 dark:border-blue-900 dark:bg-blue-950/40">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Maximum Age</div>
                  <div className="text-lg font-bold text-blue-800 dark:text-blue-300">{post.age_max}</div>
                </div>
                {post.age_as_on_date && (
                  <div className="col-span-full rounded-lg border-[1.5px] border-blue-200 bg-blue-50 px-3.5 py-3 dark:border-blue-900 dark:bg-blue-950/40">
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Age Calculated as on</div>
                    <div className="text-lg font-bold text-blue-800 dark:text-blue-300">{formatDate(post.age_as_on_date)}</div>
                  </div>
                )}
              </div>
              {post.age_relaxation && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                  <strong>Age Relaxation:</strong> {post.age_relaxation}
                </div>
              )}
            </div>
          </section>

          {/* VACANCY DETAILS */}
          {post.vacancy_details.length > 0 && (
            <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={ClipboardList} label="Vacancy Details" />
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#0b2239] text-white dark:bg-[#081120]">
                      <th className="px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide">#</th>
                      <th className="px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide">Post Name</th>
                      <th className="px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide">Category</th>
                      <th className="px-3.5 py-2.5 text-right text-xs font-bold uppercase tracking-wide">Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.vacancy_details.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="border-b border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">{String(i + 1).padStart(2, "0")}</td>
                        <td className="border-b border-slate-200 px-3.5 py-2.5 font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">{v.post_name}</td>
                        <td className="border-b border-slate-200 px-3.5 py-2.5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">{v.category || "—"}</td>
                        <td className="border-b border-slate-200 px-3.5 py-2.5 text-right dark:border-slate-700"><span className="text-lg font-extrabold text-blue-700 dark:text-blue-400">{v.no_of_posts.toLocaleString("en-IN")}</span></td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50 dark:bg-blue-950/40">
                      <td colSpan={3} className="px-3.5 py-2.5 pr-3.5 text-right font-extrabold text-slate-900 dark:text-slate-100">Total Vacancies</td>
                      <td className="px-3.5 py-2.5 text-right"><span className="text-lg font-extrabold text-blue-700 dark:text-blue-400">{totalVacancy.toLocaleString("en-IN")}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ELIGIBILITY */}
          {post.eligibility.length > 0 && (
            <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={GraduationCap} label="Eligibility / Education Qualification" />
              <div className="px-6 py-5">
                {post.eligibility.map((e, i) => (
                  <div key={i} className="mb-2.5 rounded-lg border-[1.5px] border-blue-200 bg-blue-50 p-3.5 last:mb-0 dark:border-blue-900 dark:bg-blue-950/40">
                    <div className="mb-1.5 text-sm font-bold text-blue-800 dark:text-blue-300">{e.post_name}</div>
                    <div className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                      {lang === "en" ? e.criteria : e.criteria_hi}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SELECTION PROCESS */}
          {post.selection_process.length > 0 && (
            <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={Trophy} label="Mode of Selection" />
              <div className="px-6 py-5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.selection_process.map((step, i) => (
                    <div key={step} className="flex items-center gap-1.5">
                      <span className="whitespace-nowrap rounded-full bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-blue-600">{step}</span>
                      {i < post.selection_process.length - 1 && <ArrowRight className="h-4 w-4 font-bold text-blue-700 dark:text-blue-400" aria-hidden />}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* HOW TO APPLY */}
          {(post.how_to_apply || post.how_to_apply_hi) && (
            <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={PenLine} label="How to Apply" />
              <div className="px-6 py-5">
                <ol className="list-none">
                  {(lang === "en" ? post.how_to_apply : post.how_to_apply_hi)
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => {
                      const cleaned = line.replace(/^Step\s*\d+[:.)]\s*/i, "").trim();
                      return cleaned ? (
                        <li key={i} className="mb-3 flex items-start gap-3 text-[13px] leading-relaxed text-slate-600 last:mb-0 dark:text-slate-300">
                          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-extrabold text-white dark:bg-blue-600">{i + 1}</span>
                          <span className="pt-0.5">{cleaned}</span>
                        </li>
                      ) : null;
                    })}
                </ol>
              </div>
            </section>
          )}

          {/* IMPORTANT LINKS */}
          {post.important_links.length > 0 && (
            <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={ArrowUpRight} label="Important Links" />
              <div className="px-6 py-5">
                <div className="flex flex-col gap-2">
                  {post.important_links.map((link, i) => (
                    <a
                      key={i}
                      href={link.is_active ? link.url : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between gap-2.5 rounded-lg border-[1.5px] border-slate-200 bg-slate-50 px-3.5 py-2.5 no-underline transition-all hover:translate-x-1 hover:border-blue-700 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 ${!link.is_active ? "pointer-events-none opacity-45" : ""}`}
                    >
                      <span>
                        <span className="block text-[13px] font-semibold text-slate-900 dark:text-slate-100">{link.label}</span>
                        {link.label_hi && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{link.label_hi}</span>}
                      </span>
                      {link.is_active
                        ? <span className="shrink-0 rounded-md bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-blue-600">Open ↗</span>
                        : <span className="shrink-0 rounded-md bg-slate-400 px-2 py-1 text-[11px] font-semibold text-white">Coming Soon</span>
                      }
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQs */}
          {post.faqs.length > 0 && (
            <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={Info} label="Frequently Asked Questions" />
              <div className="px-6 py-5">
                {post.faqs.map((faq, i) => (
                  <FaqItem key={i} faq={faq} index={i} color={t.primary} />
                ))}
              </div>
            </section>
          )}

          {/* DISCLAIMER */}
          <div className="mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p className="m-0">
              <strong>Disclaimer:</strong> All information provided on this page is for informational purposes only. Candidates are advised to verify all details from the official notification before applying. This website is not affiliated with any government body. Always refer to the official website for authentic information.
            </p>
          </div>
        </main>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-[118px]">
          {/* QUICK INFORMATION */}
          <section className="mb-3.5 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
            <SecHdr icon={Info} label="Quick Information" />
            <div className="p-4">
              <table className="w-full border-collapse text-xs">
                <tbody>
                  {[
                    ["Organization", post.organization],
                    ["Post Name", post.title.replace(/recruitment\s*\d{4}/i, "").trim()],
                    ["Category", post.category],
                    ["Total Posts", totalVacancy.toLocaleString("en-IN")],
                    ["Application Fee", `₹${post.fee_general}`],
                    ["Age Limit", `${post.age_min}–${post.age_max}`],
                    ["Post Date", formatDate(post.post_date)],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-slate-200 last:border-b-0 dark:border-slate-700">
                      <td className="w-[45%] py-2 pr-1 align-top font-semibold text-slate-500 dark:text-slate-400">{label}</td>
                      <td className="py-2 font-bold text-slate-900 dark:text-slate-100">{value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="w-[45%] py-2 pr-1 align-top font-semibold text-slate-500 dark:text-slate-400">Last Date</td>
                    <td className="py-2 font-extrabold text-red-600 dark:text-red-400">
                      {lastDate ? formatDate(lastDate.date) : "See above"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* APPLY NOW */}
          <section className="mb-3.5 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
            <SecHdr icon={Rocket} label="Apply Now" />
            <div className="p-4">
              <a
                href={activeApplyLink?.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <PenLine className="h-4 w-4" aria-hidden /> Apply Online Now
              </a>
              <a
                href={notificationLink?.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-[13px] font-semibold text-slate-600 no-underline transition-colors hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
              >
                <FileText className="h-4 w-4" aria-hidden /> Download Notification
              </a>
            </div>
          </section>

          {/* SOCIAL */}
          {(post.whatsapp_link || post.telegram_link) && (
            <section className="mb-3.5 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={Megaphone} label="Stay Updated" />
              <div className="p-4">
                <div className="flex flex-col gap-2">
                  {post.whatsapp_link && (
                    <a href={post.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-3 py-2.5 text-[13px] font-bold text-white no-underline transition-all hover:-translate-y-0.5">
                      <MessageCircle className="h-4 w-4" aria-hidden /> Join WhatsApp Channel
                    </a>
                  )}
                  {post.telegram_link && (
                    <a href={post.telegram_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#2aabee] px-3 py-2.5 text-[13px] font-bold text-white no-underline transition-all hover:-translate-y-0.5">
                      <Send className="h-4 w-4" aria-hidden /> Join Telegram Channel
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ALSO CHECK */}
          {post.also_check.length > 0 && (
            <section className="mb-3.5 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111a2e]">
              <SecHdr icon={Eye} label="You May Also Check" />
              <div className="p-4">
                <div className="flex flex-col gap-1.5">
                  {post.also_check.map((item, i) => (
                    <a key={i} href={item.url} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-900 no-underline transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-400">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700 dark:bg-blue-500" aria-hidden />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="mt-2.5 bg-[#0b2239] py-4 text-center text-xs text-white/50 dark:bg-[#081120]">
        <p className="m-0">
          © 2026 SrilalCSC · All content sourced from official government notifications. For official information visit{" "}
          {/* FLAG 4: the footer link is href="#" — dead, kept as supplied. */}
          <a href="#" className="text-blue-300 no-underline">ssc.gov.in</a>
        </p>
      </footer>

      {/* SEMANTIC BOT */}
      <SemanticBot post={post} color={t.primary} isDark={isDark} />
    </div>
  );
}
