"use client";

import { useState, useEffect, useRef } from "react";
import { getPublicRequestStatusAction } from "@/app/actions/status";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/AuthProvider";

const LiveDeliveryMap = dynamic(() => import("@/components/LiveDeliveryMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 400, width: "100%", background: "var(--skeleton)", borderRadius: 12, marginTop: 24, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontWeight: 700 }}>
      Loading Map Engine…
    </div>
  ),
});

type Lang = "hi" | "en";
type StatusKey = "submitted" | "seen" | "processing" | "done" | "payment_pending";

type TranslationLabels = Record<StatusKey, string>;

interface Translations {
  pageTitle: string;
  pageSub: string;
  inputLabel: string;
  inputPh: string;
  searchBtn: string;
  searching: string;
  notFound: string;
  notFoundSub: string;
  tryAgain: string;
  requestId: string;
  service: string;
  submittedOn: string;
  lastUpdate: string;
  assignedTo: string;
  timeline: string;
  paymentDue: string;
  payNote: string;
  payNow: string;
  callCenter: string;
  newRequest: string;
  loginForMore: string;
  statusLabels: TranslationLabels;
}

interface TimelineEvent {
  status: StatusKey;
  label: string;
  labelHi: string;
  time: string;
  actor: string;
  done: boolean;
  current: boolean;
}

interface RequestResult {
  id: string;
  service: string;
  serviceHi: string;
  userName: string;
  mobile: string;
  status: StatusKey;
  submittedAt: string;
  lastUpdated: string;
  assignedTo: string | null;
  paymentPending: boolean;
  paymentAmount?: number;
  delivery_status?: string;
  timeline: TimelineEvent[];
}

const COPY: Record<Lang, Translations> = {
  hi: {
    pageTitle: "आवेदन की स्थिति",
    pageSub: "अपने आवेदन की स्थिति मोबाइल नंबर या आवेदन ID से जानें",
    inputLabel: "मोबाइल नंबर या आवेदन ID",
    inputPh: "जैसे: 9876543210 या REQ-2025-001",
    searchBtn: "खोजें",
    searching: "खोज रहे हैं...",
    notFound: "कोई आवेदन नहीं मिला",
    notFoundSub: "कृपया सही मोबाइल नंबर या आवेदन ID दर्ज करें।",
    tryAgain: "दोबारा खोजें",
    requestId: "आवेदन ID",
    service: "सेवा",
    submittedOn: "जमा किया गया",
    lastUpdate: "अंतिम अपडेट",
    assignedTo: "सौंपा गया",
    timeline: "प्रगति",
    paymentDue: "भुगतान लंबित",
    payNote: "सेवा शुल्क का भुगतान करने के बाद आवेदन आगे बढ़ेगा।",
    payNow: "अभी भुगतान करें",
    callCenter: "सहायता के लिए संपर्क करें",
    newRequest: "नया आवेदन",
    loginForMore: "विस्तृत जानकारी के लिए लॉगिन करें",
    statusLabels: {
      submitted: "जमा किया गया",
      seen: "कार्यालय में प्राप्त",
      processing: "प्रक्रिया में",
      done: "पूर्ण",
      payment_pending: "भुगतान लंबित",
    },
  },
  en: {
    pageTitle: "Track Application Status",
    pageSub: "Check your application status using mobile number or application ID",
    inputLabel: "Mobile Number or Application ID",
    inputPh: "e.g. 9876543210 or REQ-2025-001",
    searchBtn: "Search",
    searching: "Searching...",
    notFound: "No application found",
    notFoundSub: "Please check your mobile number or application ID and try again.",
    tryAgain: "Search Again",
    requestId: "Application ID",
    service: "Service",
    submittedOn: "Submitted",
    lastUpdate: "Last Updated",
    assignedTo: "Handled By",
    timeline: "Progress",
    paymentDue: "Payment Pending",
    payNote: "Please complete the payment to proceed with your application.",
    payNow: "Pay Now",
    callCenter: "Contact for Help",
    newRequest: "New Application",
    loginForMore: "Login for detailed view",
    statusLabels: {
      submitted: "Submitted",
      seen: "Received at Office",
      processing: "In Progress",
      done: "Completed",
      payment_pending: "Payment Pending",
    },
  },
};

const THEMES = {
  light: {
    pageBg: "#f1f5f9",
    navBg: "#1e3a8a",
    navBottomBorder: "#3b82f6",
    navText: "rgba(255,255,255,0.65)",
    navTextHover: "#ffffff",
    navBrand: "#ffffff",
    navBrandAccent: "#93c5fd",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
    sectionGrad: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
    sectionGradText: "#ffffff",
    textPrimary: "#1e293b",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentLight: "#eff6ff",
    accentBorder: "#bfdbfe",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputFocusBorder: "#3b82f6",
    inputText: "#1e293b",
    inputPlaceholder: "#94a3b8",
    divider: "#e2e8f0",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#64748b",
    pillActiveBg: "#dbeafe",
    pillActiveBorder: "#93c5fd",
    pillActiveText: "#1d4ed8",
    btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    btnPrimaryText: "#ffffff",
    btnPrimaryGlow: "rgba(37,99,235,0.35)",
    btnGhostBg: "#f1f5f9",
    btnGhostBorder: "#e2e8f0",
    btnGhostText: "#475569",
    btnGhostHoverBg: "#eff6ff",
    btnGhostHoverText: "#2563eb",
    btnDangerBg: "#fef2f2",
    btnDangerBorder: "#fecaca",
    btnDangerText: "#dc2626",
    btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)",
    btnSuccessText: "#ffffff",
    modalOverlay: "rgba(15,23,42,0.55)",
    modalBg: "#ffffff",
    modalBorder: "#e2e8f0",
    scrollThumb: "#bfdbfe",
    payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
    payPaidGrad: "linear-gradient(135deg,#15803d,#16a34a)",
    docIconBg: "#fef2f2",
    docIconBorder: "#fecaca",
    docIconColor: "#dc2626",
    toggleIcon: "🌙",
    toggleLabel: "Dark",
  },
  dark: {
    pageBg: "#060b14",
    navBg: "rgba(6,11,20,0.98)",
    navBottomBorder: "#f59e0b",
    navText: "rgba(255,255,255,0.45)",
    navTextHover: "#ffffff",
    navBrand: "#ffffff",
    navBrandAccent: "#f59e0b",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
    sectionGrad: "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
    sectionGradText: "#000000",
    textPrimary: "#f1f5f9",
    textSecondary: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.28)",
    accent: "#f59e0b",
    accentHover: "#d97706",
    accentLight: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.08)",
    inputFocusBorder: "rgba(245,158,11,0.5)",
    inputText: "#f1f5f9",
    inputPlaceholder: "rgba(255,255,255,0.25)",
    divider: "rgba(255,255,255,0.06)",
    pillBg: "rgba(255,255,255,0.03)",
    pillBorder: "rgba(255,255,255,0.08)",
    pillText: "rgba(255,255,255,0.4)",
    pillActiveBg: "rgba(245,158,11,0.15)",
    pillActiveBorder: "rgba(245,158,11,0.4)",
    pillActiveText: "#f59e0b",
    btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)",
    btnPrimaryText: "#000000",
    btnPrimaryGlow: "rgba(245,158,11,0.35)",
    btnGhostBg: "rgba(255,255,255,0.05)",
    btnGhostBorder: "rgba(255,255,255,0.1)",
    btnGhostText: "rgba(255,255,255,0.7)",
    btnGhostHoverBg: "rgba(245,158,11,0.1)",
    btnGhostHoverText: "#f59e0b",
    btnDangerBg: "rgba(239,68,68,0.1)",
    btnDangerBorder: "rgba(239,68,68,0.25)",
    btnDangerText: "#f87171",
    btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)",
    btnSuccessText: "#ffffff",
    modalOverlay: "rgba(0,0,0,0.85)",
    modalBg: "#0f172a",
    modalBorder: "rgba(255,255,255,0.1)",
    scrollThumb: "rgba(245,158,11,0.3)",
    payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
    payPaidGrad: "linear-gradient(135deg,#065f46,#047857)",
    docIconBg: "rgba(239,68,68,0.12)",
    docIconBorder: "rgba(239,68,68,0.28)",
    docIconColor: "#f87171",
    toggleIcon: "☀️",
    toggleLabel: "Light",
  },
} as const;

type ThemeTokens = typeof THEMES.light;

const NAV_LINKS = [
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/delivery" : "http://localhost:3000/delivery", icon: "📦", label: "Delivery" },
];

const STATUS_CFG = {
  submitted: { color: "#d97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.3)", dot: "#f59e0b", label: "Submitted", icon: "📤" },
  seen: { color: "#2563eb", bg: "rgba(37,99,235,0.1)", border: "rgba(37,99,235,0.3)", dot: "#3b82f6", label: "Seen", icon: "👁️" },
  processing: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.3)", dot: "#8b5cf6", label: "Processing", icon: "⚙️" },
  done: { color: "#15803d", bg: "rgba(21,128,61,0.1)", border: "rgba(21,128,61,0.3)", dot: "#22c55e", label: "Done", icon: "✅" },
  payment_pending: { color: "#dc2626", bg: "rgba(220,38,38,0.1)", border: "rgba(220,38,38,0.3)", dot: "#ef4444", label: "Payment", icon: "💳" },
} as const;

const Ico = {
  Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
  X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Check: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
  Download: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Doc: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  Pay: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
  Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
};

function buildCss(T: ThemeTokens): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
.serif{font-family:'DM Serif Display',serif;}
.mono{font-family:'JetBrains Mono',monospace;}

@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes stampIn{from{opacity:0;transform:scale(1.4) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}

.top-nav-link{
  display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
  transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

.pill{
  padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
  cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
  background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
}
.pill:hover{border-color:${T.accent};color:${T.accent};}
.pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;
  font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;
  font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-d:hover{filter:brightness(.95);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}

.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

.pulse-dot{animation:pulse 2s ease-in-out infinite;}
`;
}

function SecHdr({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="sec-hdr">
      <span style={{ fontSize: "1.05rem" }}>{icon}</span>
      <span className="sec-hdr-txt">{label}</span>
    </div>
  );
}

export default function PublicStatusTracker() {
  const [lang, setLang] = useState<Lang>("en");
  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<RequestResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();


  const T = isDark ? THEMES.dark : THEMES.light;
  const t = COPY[lang];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    mq.addEventListener("change", (e) => setIsDark(e.matches));
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [user]);

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark; setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const handleSearch = async (q?: string) => {
    const searchQuery = (q || query).trim();
    if (!searchQuery) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setSearched(true);

    try {
      const found = await getPublicRequestStatusAction(searchQuery);
      setResult(found as any);
      setNotFound(!found);
    } catch (error) {
      console.error(error);
      setNotFound(true);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: "background .25s, color .25s" }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

      {/* ════════════════════════════════════════════════════════
          HEADER — deep indigo, consistent with Admin Panel
      ════════════════════════════════════════════════════════ */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>STATUS TRACKER</div>
            </div>
          </a>

          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="top-nav-link">
                <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button
              onClick={() => setLang(lang === "hi" ? "en" : "hi")}
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: T.navText, cursor: "pointer", fontWeight: 700, fontFamily: "inherit", transition: "all .15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T.navText; }}
            >
              {lang === "hi" ? "EN" : "हि"}
            </button>
            <button className="tog" onClick={toggleTheme}>
              <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <main style={{ flex: 1, overflowY: "auto", padding: "40px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeIn 0.4s ease" }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 18px" }}>
              🏛️
            </div>
            <h1 className="serif" style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, marginBottom: 10, lineHeight: 1.2 }}>
              {t.pageTitle}
            </h1>
            <p style={{ fontSize: 14, color: T.textSecondary, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              {t.pageSub}
            </p>
          </div>

          {/* Search Card */}
          <div className="card" style={{ marginBottom: 24, animation: "fadeIn 0.4s ease 0.1s both" }}>
            <div style={{ padding: "22px 24px" }}>
              <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 10 }}>
                {t.inputLabel}
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}>
                    <Ico.Search />
                  </span>
                  <input
                    ref={inputRef}
                    className="inp"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder={t.inputPh}
                    style={{ paddingLeft: 36 }}
                    autoFocus
                  />
                </div>
                <button className="btn btn-p" onClick={() => handleSearch()} disabled={loading || !query.trim()}>
                  {loading ? (
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  ) : (
                    <Ico.Search />
                  )}
                  {loading ? t.searching : t.searchBtn}
                </button>
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: T.textMuted }}>{lang === "hi" ? "उदाहरण:" : "Try:"}</span>
                {["REQ-2025-001", "REQ-2025-002", "REQ-2025-003"].map((s) => (
                  <button key={s} className="pill" onClick={() => { setQuery(s); handleSearch(s); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              RESULT
          ════════════════════════════════════════════════════════ */}
          {result && !loading && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>

              {/* Status Stamp */}
              {(() => {
                const st = STATUS_CFG[result.status];
                return (
                  <div className="card" style={{ marginBottom: 20, borderLeft: `4px solid ${st.color}` }}>
                    <div style={{ padding: "22px 24px", display: "flex", gap: 18, alignItems: "center" }}>
                      <div style={{ fontSize: 40, animation: "stampIn 0.4s ease", flexShrink: 0 }}>{st.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
                          {t.pageTitle}
                        </div>
                        <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: st.color, lineHeight: 1, marginBottom: 6 }}>
                          {t.statusLabels[result.status]}
                        </div>
                        <div style={{ fontSize: 12, color: T.textSecondary }}>
                          {lang === "hi" ? "अंतिम अपडेट:" : "Last updated:"} {result.lastUpdated}
                        </div>
                      </div>
                      <div style={{ padding: "5px 14px", borderRadius: 20, background: st.bg, border: `1px solid ${st.border}`, fontSize: 11, fontWeight: 800, color: st.color, letterSpacing: ".05em", textTransform: "uppercase", flexShrink: 0 }}>
                        {st.label}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Details Grid */}
              <div className="card" style={{ marginBottom: 20 }}>
                <SecHdr icon="📋" label={lang === "hi" ? "विवरण" : "Details"} />
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px 24px" }}>
                    {[
                      [t.requestId, result.id, true],
                      [t.service, lang === "hi" ? result.serviceHi : result.service, false],
                      [t.submittedOn, result.submittedAt, false],
                      result.assignedTo ? [t.assignedTo, result.assignedTo, false] : null,
                    ]
                      .filter(Boolean)
                      .map((row) => {
                        const [label, value, mono] = row as [string, string, boolean];
                        return (
                          <div key={label}>
                            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, marginBottom: 5 }}>
                              {label}
                            </div>
                            <div className={mono ? "mono" : undefined} style={{ fontSize: 13.5, color: T.textPrimary, fontWeight: 600, lineHeight: 1.4 }}>
                              {value}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Payment Banner */}
              {result.paymentPending && (
                <div style={{ background: T.payPendingGrad, borderRadius: 12, padding: "22px 24px", marginBottom: 20, color: "#fff", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      💳
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                        {t.paymentDue}
                      </div>
                      <div className="mono" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
                        ₹{result.paymentAmount?.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.85 }}>{t.payNote}</div>
                    </div>
                    <button style={{ background: "#fff", border: "none", borderRadius: 8, color: "#b45309", padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all .15s" }}>
                      {t.payNow}
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="card" style={{ marginBottom: 20 }}>
                <SecHdr icon="🕓" label={t.timeline} />
                <div style={{ padding: "24px 24px 8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {result.timeline.map((ev, i) => {
                      const st = STATUS_CFG[ev.status];
                      const isLast = i === result.timeline.length - 1;
                      return (
                        <div key={i} style={{ display: "flex", gap: 16 }}>
                          {/* Rail */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: ev.current ? st.color : ev.done ? st.bg : T.inputBg,
                                border: `2px solid ${ev.current ? st.color : ev.done ? st.color : T.divider}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                color: ev.current ? "#fff" : ev.done ? st.color : T.textMuted,
                                boxShadow: ev.current ? `0 0 0 4px ${st.color}25` : "none",
                                zIndex: 2,
                                transition: "all .2s",
                              }}
                            >
                              {ev.done ? (ev.current ? st.icon : <Ico.Check />) : "○"}
                            </div>
                            {!isLast && (
                              <div style={{ width: 2, flex: 1, minHeight: 24, background: ev.done ? st.color : T.divider, opacity: ev.done ? 0.25 : 0.12, marginTop: 4 }} />
                            )}
                          </div>

                          {/* Content */}
                          <div style={{ paddingBottom: isLast ? 0 : 24, flex: 1, paddingTop: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: ev.current ? 700 : 500, color: ev.current ? st.color : T.textPrimary, lineHeight: 1.3 }}>
                                  {lang === "hi" ? ev.labelHi : ev.label}
                                  {ev.current && (
                                    <span style={{ marginLeft: 8, fontSize: 9, background: st.color, color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: 800, letterSpacing: "0.06em", verticalAlign: "middle", display: "inline-block" }}>
                                      {lang === "hi" ? "अभी" : "NOW"}
                                    </span>
                                  )}
                                </div>
                                {ev.done && ev.actor !== "—" && (
                                  <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 4 }}>{ev.actor}</div>
                                )}
                              </div>
                              {ev.done && ev.time !== "—" && (
                                <span className="mono" style={{ fontSize: 11, color: T.textMuted, flexShrink: 0, marginLeft: 8 }}>
                                  {ev.time}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Live Map */}
              {result.delivery_status === "out_for_delivery" && (
                <div style={{ marginBottom: 20, animation: "fadeIn 0.5s ease" }}>
                  <LiveDeliveryMap requestId={result.id} />
                </div>
              )}

              {/* Footer Actions */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                <button
                  className="btn btn-g"
                  onClick={() => {
                    setResult(null);
                    setNotFound(false);
                    setSearched(false);
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                >
                  ← {t.tryAgain}
                </button>
                <a href="/?login=1" className="btn btn-p" style={{ textDecoration: "none" }}>
                  {t.loginForMore}
                </a>
                <a href="tel:+91XXXXXXXXXX" className="btn btn-s" style={{ textDecoration: "none", marginLeft: "auto" }}>
                  📞 {t.callCenter}
                </a>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              NOT FOUND
          ════════════════════════════════════════════════════════ */}
          {notFound && !loading && (
            <div className="card" style={{ textAlign: "center", padding: "56px 32px", animation: "fadeIn 0.3s ease" }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 18px" }}>
                📭
              </div>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>
                {t.notFound}
              </h3>
              <p style={{ fontSize: 14, color: T.textSecondary, marginBottom: 28, lineHeight: 1.7, maxWidth: 400, marginInline: "auto" }}>
                {t.notFoundSub}
              </p>
              <button
                className="btn btn-p"
                onClick={() => {
                  setNotFound(false);
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                {t.tryAgain}
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              EMPTY STATE
          ════════════════════════════════════════════════════════ */}
          {!searched && !loading && (
            <div className="card" style={{ textAlign: "center", padding: "48px 32px", animation: "fadeIn 0.4s ease 0.2s both" }}>
              <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
                {[
                  ["📋", lang === "hi" ? "रियल-टाइम अपडेट" : "Real-time Updates"],
                  ["🔒", lang === "hi" ? "लॉगिन की जरूरत नहीं" : "No Login Needed"],
                  ["📱", lang === "hi" ? "मोबाइल फ्रेंडली" : "Mobile Friendly"],
                ].map(([ic, lb]) => (
                  <div key={lb} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {ic}
                    </div>
                    <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: "0.03em" }}>{lb}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
                {lang === "hi"
                  ? "आवेदन की स्थिति जानने के लिए ऊपर अपना मोबाइल नंबर या आवेदन ID दर्ज करें। लॉगिन की आवश्यकता नहीं है।"
                  : "Enter your mobile number or application ID above to check status. No login required."}
              </p>
            </div>
          )}

          {/* Contact Footer */}
          <div className="card" style={{ marginTop: 32, textAlign: "center", padding: "24px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
              {lang === "hi" ? "सहायता के लिए" : "For assistance"}
            </div>
            <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>
              {lang === "hi" ? "जन सेवा केंद्र, बक्सा" : "Jan Seva Kendra, Shambhuganj"}
            </div>
            <div style={{ fontSize: 13, color: T.textSecondary }}>
              {lang === "hi" ? "सोम–शनि: सुबह 9 बजे – शाम 6 बजे" : "Mon–Sat: 9 AM – 6 PM"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}