
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
// DUAL THEME TOKENS — Exact match to reference
// ════════════════════════════════════════════════════════════════════════════════
const THEMES = {
  light: {
    pageBg: "#f1f5f9",
    navBg: "#1e3a8a",
    navBottomBorder: "#3b82f6",
    navText: "rgba(255,255,255,0.65)",
    navTextHover: "#ffffff",
    navActiveBg: "#3b82f6",
    navActiveText: "#ffffff",
    navBrand: "#ffffff",
    navBrandAccent: "#93c5fd",

    sidebarBg: "#ffffff",
    sidebarHeaderBg: "#f8fafc",

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

    rowHover: "#f8fafc",

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

    subTabHdrBg: "#f8fafc",
    subTabText: "#94a3b8",
    subTabActive: "#2563eb",
    subTabBorder: "#2563eb",

    tagBg: "#dbeafe",
    tagText: "#1d4ed8",
    scrollThumb: "#bfdbfe",

    modalOverlay: "rgba(15,23,42,0.55)",
    modalBg: "#ffffff",
    modalBorder: "#e2e8f0",

    teamCardBorder: "#e2e8f0",
    teamCardBg: "#ffffff",
    teamCardHover: "#f8fafc",

    statusDotBorder: "#ffffff",
    toggleIcon: "🌙",
    toggleLabel: "Dark",

    payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
    payPaidGrad: "linear-gradient(135deg,#15803d,#16a34a)",
    docIconBg: "#fef2f2",
    docIconBorder: "#fecaca",
    docIconColor: "#dc2626",
  },
  dark: {
    pageBg: "#060b14",
    navBg: "rgba(6,11,20,0.98)",
    navBottomBorder: "#f59e0b",
    navText: "rgba(255,255,255,0.45)",
    navTextHover: "#ffffff",
    navActiveBg: "rgba(245,158,11,0.18)",
    navActiveText: "#f59e0b",
    navBrand: "#ffffff",
    navBrandAccent: "#f59e0b",

    sidebarBg: "rgba(6,11,20,0.9)",
    sidebarHeaderBg: "rgba(255,255,255,0.02)",

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

    rowHover: "rgba(255,255,255,0.03)",

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

    subTabHdrBg: "rgba(6,11,20,0.6)",
    subTabText: "rgba(255,255,255,0.35)",
    subTabActive: "#f59e0b",
    subTabBorder: "#f59e0b",

    tagBg: "rgba(245,158,11,0.15)",
    tagText: "#f59e0b",
    scrollThumb: "rgba(245,158,11,0.3)",

    modalOverlay: "rgba(0,0,0,0.85)",
    modalBg: "#0f172a",
    modalBorder: "rgba(255,255,255,0.1)",

    teamCardBorder: "rgba(255,255,255,0.08)",
    teamCardBg: "rgba(255,255,255,0.03)",
    teamCardHover: "rgba(255,255,255,0.05)",

    statusDotBorder: "#060b14",
    toggleIcon: "☀️",
    toggleLabel: "Light",

    payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
    payPaidGrad: "linear-gradient(135deg,#065f46,#047857)",
    docIconBg: "rgba(239,68,68,0.12)",
    docIconBorder: "rgba(239,68,68,0.28)",
    docIconColor: "#f87171",
  },
} as const;

type ThemeTokens = typeof THEMES.light;

// ════════════════════════════════════════════════════════════════════════════════
// NAV LINKS
// ════════════════════════════════════════════════════════════════════════════════
const NAV_LINKS = [
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
];

// ════════════════════════════════════════════════════════════════════════════════
// ICONS (inline SVG)
// ════════════════════════════════════════════════════════════════════════════════
const Ico = {
  Search: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  ),
  Plus: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  X: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Robot: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9 13v2M15 13v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Doc: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════════
// AVATAR
// ════════════════════════════════════════════════════════════════════════════════
function Avatar({
  name,
  size = 40,
  role,
  isDark,
}: {
  name?: string | null;
  size?: number;
  role?: UserRole;
  isDark: boolean;
}) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  const grad =
    role === "main_admin"
      ? isDark
        ? "linear-gradient(135deg,#f59e0b,#d97706)"
        : "linear-gradient(135deg,#1d4ed8,#1e3a8a)"
      : role === "co_admin"
        ? isDark
          ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
          : "linear-gradient(135deg,#2563eb,#3b82f6)"
        : isDark
          ? "linear-gradient(135deg,#334155,#1e293b)"
          : "linear-gradient(135deg,#64748b,#475569)";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: grad,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
        border: "1.5px solid rgba(255,255,255,0.18)",
      }}
    >
      {ch}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ════════════════════════════════════════════════════════════════════════════════
function SecHdr({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="sec-hdr">
      <span style={{ fontSize: "1.05rem" }}>{icon}</span>
      <span className="sec-hdr-txt">{label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// GENERATED CSS
// ════════════════════════════════════════════════════════════════════════════════
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

.top-nav-link{
  display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
  transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

.sec-tab{
  display:flex;flex-direction:column;align-items:center;gap:4px;
  padding:10px 22px;cursor:pointer;background:transparent;border:none;
  border-bottom:2px solid transparent;color:${T.subTabText};
  font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  transition:all .15s;font-family:'DM Sans',sans-serif;
}
.sec-tab.on{color:${T.subTabActive};border-bottom-color:${T.subTabBorder};}
.sec-tab:hover:not(.on){color:${T.textSecondary};}

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
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-s:hover{filter:brightness(1.08);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}
select.inp option{background:${T.modalBg};color:${T.inputText};}

.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

.tcard{background:${T.teamCardBg};border:1px solid ${T.teamCardBorder};border-radius:12px;padding:20px;transition:all .2s;}
.tcard:hover{background:${T.teamCardHover};transform:translateY(-2px);box-shadow:${T.cardShadow};}

.modal-ov{position:fixed;inset:0;background:${T.modalOverlay};backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-bx{background:${T.modalBg};border:1px solid ${T.modalBorder};border-radius:14px;width:100%;max-width:460px;animation:pop .2s ease;box-shadow:0 30px 60px rgba(0,0,0,0.25);}

.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

@keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
`;
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
  const T = isDark ? THEMES.dark : THEMES.light;
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
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    localStorage.setItem("csc_theme", isDark ? "dark" : "light");
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
          alert(`✅ Imported "${parsed.title || "Form"}" with ${newFields.length} fields!`);
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
          alert(`✅ Imported ${newFields.length} fields from AI!`);
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

  // ── Helpers ───────────────────────────────────────────────────────────────
  const modalHdrStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "17px 22px",
    borderBottom: `1px solid ${T.divider}`,
  };
  const modalHdrTitle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: T.textPrimary,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'DM Serif Display', serif",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.pageBg,
        color: T.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
        transition: "background .25s, color .25s",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

      {/* ════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════ */}
      <header
        style={{
          background: T.navBg,
          borderBottom: `3px solid ${T.navBottomBorder}`,
          flexShrink: 0,
          zIndex: 100,
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
        }}
      >
        {/* Row 1 — brand + nav links + toggle + user */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 54,
            padding: "0 20px",
            gap: 14,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
              }}
            >
              🏛️
            </div>
            <div>
              <div
                className="serif"
                style={{
                  fontSize: 17,
                  color: T.navBrand,
                  letterSpacing: "-0.3px",
                  lineHeight: 1,
                }}
              >
                Shrilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: ".1em",
                }}
              >
                ADMIN PANEL
              </div>
            </div>
          </Link>

          <div
            style={{
              width: 1,
              height: 26,
              background: "rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          />

          {/* Nav links */}
          <nav
            style={{
              display: "flex",
              gap: 3,
              flex: 1,
              overflowX: "auto",
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="top-nav-link">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Theme toggle */}
          <button className="tog" onClick={() => setIsDark((d) => !d)}>
            <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
          </button>

          {/* User chip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "5px 12px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.15)",
              flexShrink: 0,
            }}
          >
            <Avatar
              name={user?.name}
              size={28}
              role={(user?.role as UserRole) || "user"}
              isDark={isDark}
            />
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                {user?.name || "Admin"}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  color: T.navBrandAccent,
                  marginTop: 2,
                  letterSpacing: ".07em",
                }}
              >
                {(user?.role || "ADMIN").toString().replace("_", " ").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1150, margin: "0 auto", padding: "28px" }}>
        {/* Header Card */}
        <div className="card" style={{ marginBottom: 22 }}>
          <SecHdr icon="📝" label="Form Builder" />
          <div
            style={{
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ color: T.textSecondary, fontSize: 13, margin: 0 }}>
              Create and manage structured forms for citizen services
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-g"
                onClick={() => {
                  setShowAIGuide(true);
                  setAiStep(1);
                }}
              >
                <Ico.Robot /> AI Auto-Generate
              </button>
              <button className="btn btn-p" onClick={openNewForm}>
                <Ico.Plus /> Create Form
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: T.textMuted,
              fontSize: 13,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 20,
                border: `2px solid ${T.divider}`,
                borderTopColor: T.accent,
                borderRadius: "50%",
                animation: "spin .7s linear infinite",
                marginRight: 10,
                verticalAlign: "middle",
              }}
            />
            Loading forms…
          </div>
        ) : forms.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 70,
              textAlign: "center",
              border: `1.5px dashed ${T.cardBorder}`,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
            <div
              className="serif"
              style={{ fontSize: 20, color: T.textPrimary, marginBottom: 8 }}
            >
              No Forms Found
            </div>
            <p style={{ color: T.textSecondary, fontSize: 14, margin: 0 }}>
              Create your first form to start collecting structured data in chats.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
              gap: 16,
            }}
          >
            {forms.map((f) => (
              <div
                key={f.id}
                className="tcard"
                style={{
                  borderColor: f.requires_document ? T.accentBorder : T.teamCardBorder,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      margin: 0,
                      color: T.textPrimary,
                      lineHeight: 1.3,
                      flex: 1,
                      paddingRight: 10,
                    }}
                  >
                    {f.title}
                  </h3>
                  <div
                    style={{
                      background: T.tagBg,
                      color: T.tagText,
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                      letterSpacing: ".02em",
                    }}
                  >
                    ₹{f.price}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 12,
                    color: T.textSecondary,
                    marginBottom: 18,
                    fontWeight: 600,
                  }}
                >
                  <span>📋 {f.fields?.length || 0} Fields</span>
                  {f.requires_document && (
                    <span style={{ color: isDark ? "#34d399" : "#059669" }}>
                      📎 Requires Doc
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 14,
                    borderTop: `1px solid ${T.divider}`,
                  }}
                >
                  <button
                    className="btn btn-g"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => openEditForm(f)}
                  >
                    <Ico.Edit /> Edit
                  </button>
                  <button
                    className="btn btn-d"
                    style={{ padding: "8px 12px" }}
                    onClick={() => handleDelete(f.id)}
                  >
                    <Ico.Trash />
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
          className="modal-ov"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAIGuide(false);
          }}
        >
          <div
            className="modal-bx"
            style={{ maxWidth: 500, overflow: "hidden" }}
          >
            <div
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #b45309, #d97706)"
                  : "linear-gradient(135deg, #d97706, #f59e0b)",
                padding: "20px 24px",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <Ico.Robot />{" "}
                  <span
                    style={{
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: 12,
                    }}
                  >
                    AI Assistant Guide
                  </span>
                </div>
                <h2
                  className="serif"
                  style={{ margin: 0, fontSize: 22, color: "#fff" }}
                >
                  {aiStep === 1
                    ? "Auto-Generate Forms"
                    : aiStep === 2
                      ? "Copy AI Prompt"
                      : "Paste & Populate"}
                </h2>
              </div>
              <button
                onClick={() => setShowAIGuide(false)}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                <Ico.X />
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                fontSize: 15,
                color: T.textPrimary,
                lineHeight: 1.6,
              }}
            >
              {aiStep === 1 && (
                <>
                  <p>
                    Building forms field-by-field can take time. You can use{" "}
                    <b>ChatGPT</b> or <b>Gemini</b> to instantly generate the
                    perfect fields for any CSC service.
                  </p>
                  <p style={{ marginTop: 10 }}>
                    We have prepared a special prompt for you. Just copy it,
                    paste it into your AI, and it will give you a formatted JSON
                    string.
                  </p>
                </>
              )}

              {aiStep === 2 && (
                <>
                  <p style={{ marginBottom: 12 }}>
                    Copy the prompt below and paste it into ChatGPT.{" "}
                    <b style={{ color: T.accent }}>
                      Don't forget to replace [INSERT SERVICE NAME HERE]
                    </b>{" "}
                    with your actual service.
                  </p>
                  <div style={{ position: "relative" }}>
                    <textarea
                      readOnly
                      value={AI_PROMPT}
                      style={{
                        width: "100%",
                        height: 160,
                        background: T.inputBg,
                        border: `1px solid ${T.inputBorder}`,
                        color: T.textSecondary,
                        padding: "12px",
                        borderRadius: 8,
                        fontSize: 13,
                        resize: "none",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(AI_PROMPT);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: copied ? "#10b981" : T.accent,
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {copied ? (
                        "✅ Copied!"
                      ) : (
                        <>
                          <Ico.Copy /> Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {aiStep === 3 && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ fontSize: 50, marginBottom: 16 }}>⌨️</div>
                  <h3
                    className="serif"
                    style={{ margin: "0 0 10px 0", color: T.textPrimary }}
                  >
                    Ready to Paste!
                  </h3>
                  <p style={{ color: T.textSecondary, marginBottom: 0 }}>
                    Once ChatGPT gives you the JSON, come back here, open the{" "}
                    <b>Create Form</b> window, and simply press{" "}
                    <b>Ctrl + V</b> anywhere on the screen.
                  </p>
                  <p
                    style={{
                      color: T.accent,
                      fontWeight: 700,
                      marginTop: 10,
                    }}
                  >
                    The fields will instantly populate!
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${T.divider}`,
                background: T.sidebarHeaderBg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: aiStep === s ? T.accent : T.divider,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {aiStep < 3 && (
                  <button
                    onClick={() => setShowAIGuide(false)}
                    style={{
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      color: T.textMuted,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Skip
                  </button>
                )}
                {aiStep > 1 && (
                  <button
                    className="btn btn-g"
                    onClick={() => setAiStep(aiStep - 1)}
                  >
                    Back
                  </button>
                )}
                {aiStep < 3 ? (
                  <button
                    className="btn btn-p"
                    onClick={() => setAiStep(aiStep + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-p"
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
          className="modal-ov"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="modal-bx"
            style={{ maxWidth: 640, maxHeight: "90vh", overflow: "hidden" }}
          >
            <div style={modalHdrStyle}>
              <div style={modalHdrTitle}>
                {editingForm ? "✏️ Edit Form" : "📝 Create New Form"}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: T.textMuted,
                  cursor: "pointer",
                  display: "flex",
                  padding: 4,
                }}
              >
                <Ico.X />
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                maxHeight: "calc(90vh - 140px)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Core Details */}
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 2 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 800,
                      color: T.textMuted,
                      textTransform: "uppercase",
                      marginBottom: 6,
                      letterSpacing: ".06em",
                    }}
                  >
                    Form Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Income Certificate Details"
                    className="inp"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 800,
                      color: T.textMuted,
                      textTransform: "uppercase",
                      marginBottom: 6,
                      letterSpacing: ".06em",
                    }}
                  >
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="inp"
                  />
                </div>
              </div>

              {/* Document Requirement */}
              <div
                style={{
                  background: T.inputBg,
                  padding: 16,
                  borderRadius: 10,
                  border: `1px solid ${T.inputBorder}`,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                    color: T.textPrimary,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={reqDoc}
                    onChange={(e) => setReqDoc(e.target.checked)}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: T.accent,
                      cursor: "pointer",
                    }}
                  />
                  Requires User to Upload a Document?
                </label>
                {reqDoc && (
                  <div style={{ marginTop: 12 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 800,
                        color: T.textMuted,
                        textTransform: "uppercase",
                        marginBottom: 6,
                        letterSpacing: ".06em",
                      }}
                    >
                      What document is required?
                    </label>
                    <input
                      value={docLabel}
                      onChange={(e) => setDocLabel(e.target.value)}
                      placeholder="e.g. Upload scanned Aadhar Card"
                      className="inp"
                    />
                  </div>
                )}
              </div>

              <div
                style={{
                  border: "none",
                  borderTop: `1px dashed ${T.divider}`,
                  margin: "4px 0",
                }}
              />

              {/* Dynamic Fields Builder */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: T.textPrimary,
                      letterSpacing: ".02em",
                    }}
                  >
                    Form Fields ({fields.length})
                  </label>
                  <button
                    className="btn btn-g"
                    onClick={addField}
                    style={{ fontSize: 12 }}
                  >
                    <Ico.Plus /> Add Field
                  </button>
                </div>

                {fields.length === 0 ? (
                  <div
                    style={{
                      padding: 28,
                      textAlign: "center",
                      background: T.inputBg,
                      borderRadius: 8,
                      border: `1.5px dashed ${T.inputBorder}`,
                      color: T.textMuted,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ marginBottom: 8, fontSize: 20 }}>📋</div>
                    <div style={{ marginBottom: 6 }}>No fields added yet.</div>
                    <div
                      style={{
                        color: T.accent,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      💡 Hint: Press <b>Ctrl + V</b> to paste AI-generated
                      fields!
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {fields.map((f, i) => (
                      <div
                        key={f.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: T.inputBg,
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${T.inputBorder}`,
                          transition: "all .15s",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            color: T.textMuted,
                            fontSize: 12,
                            minWidth: 22,
                            textAlign: "center",
                          }}
                        >
                          {i + 1}.
                        </div>
                        <input
                          value={f.label}
                          onChange={(e) =>
                            updateField(f.id, "label", e.target.value)
                          }
                          placeholder="Field Label (e.g. Father's Name)"
                          className="inp"
                          style={{ flex: 1, fontSize: 13 }}
                        />
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            color: T.textSecondary,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={f.required}
                            onChange={(e) =>
                              updateField(f.id, "required", e.target.checked)
                            }
                            style={{ accentColor: T.accent, cursor: "pointer" }}
                          />{" "}
                          Required
                        </label>
                        <button
                          onClick={() => removeField(f.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: T.btnDangerText,
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                            borderRadius: 6,
                            transition: "background .15s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              T.btnDangerBg;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "none";
                          }}
                        >
                          <Ico.Trash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${T.divider}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                background: T.sidebarHeaderBg,
                borderRadius: "0 0 14px 14px",
              }}
            >
              <button
                className="btn btn-g"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-p" onClick={handleSave}>
                {editingForm ? "Update Form" : "Save Form"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}