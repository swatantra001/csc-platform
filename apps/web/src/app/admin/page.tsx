
"use client";

import React, { useState, useEffect, useRef, useCallback, type ClipboardEvent, type DragEvent } from "react";
import { supabase } from "@/lib/supabase";
import { uploadChatFileAction } from "@/app/actions/storage";
import { io, Socket } from "socket.io-client";
import { useDeliveryBroadcaster } from "@/hooks/useDeliveryBroadcaster"; // ✨ Import the GPS Broadcaster Hook
import {
  adminGetRequestsAction, adminGetChatAction, adminSendMessageAction, adminUpdateReqStatusAction,
  adminAssignReqAction, adminCreateNewChatAction, adminSearchUsersAction, adminGetTeamAction,
  adminUpdateUserRoleAction, adminGetPostsAction, adminCreatePostAction, adminDeletePostAction,
  adminDeleteRequestsAction, getAdminProfileAction, adminUpdateDeliveryStatusAction,
  adminAssignDeliveryBoyAction
} from "@/app/actions/admin";
import { useAuth } from "@/components/AuthProvider";
import CertificateGenerator from "@/components/admin/CertificateGenerator";
import BulkCertificateGenerator from "@/components/admin/BulkCertificateGenerator";
import { AuthGuard } from "@/components/AuthGuard";

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════
type UserRole = "user" | "co_admin" | "main_admin";
type RequestStatus = "pending" | "seen" | "processing" | "payment_pending" | "done" | "cancelled";
type MessageType = "text" | "doc" | "payment" | "voice" | "form";

interface DbUser { id: string; mobile: string; name: string | null; role: UserRole; position_label: string | null; active: boolean; wallet_balance: number; }
interface DbRequest {
  id: string; user_id: string; service: string; title: string; description: string | null; status: RequestStatus; priority: string; assigned_to: string | null; payment_status: "na" | "pending" | "paid"; payment_amount: number; delivery_type?: 'pickup' | 'delivery'; urgency?: 'instant' | 'today' | '2_days' | 'flexible';
  delivery_status?: 'na' | 'pending' | 'out_for_delivery' | 'delivered'; address?: DbAddress; created_at: string; updated_at: string; users?: DbUser; assignee?: DbUser;
  request_messages?: DbMessage[]; // ✨ ADD ONLY THIS LINE
  _unread?: boolean; // ✨ ADD THIS FLAG
  delivery_boy_id?: string | null; // ✨ ADD THIS
}
interface DbMessage { id: string; request_id: string; sender_id: string; sender_role: UserRole; message_type: MessageType; content: string | null; doc_name: string | null; doc_url: string | null; doc_size: string | null; is_result_doc: boolean; payment_amount: number | null; payment_status?: string; reply_to_id: string | null; created_at: string; users?: DbUser; reply_to_msg?: DbMessage; }
interface DbDocument { id: string; request_id: string; file_name: string; file_size: string; file_type: string; is_sensitive: boolean; is_result: boolean; created_at: string; file_url: string; }
interface DbPost { id: string; theme: string; title: string; short_desc: string | null; service_cost: number; is_published: boolean; view_count: number; created_at: string; users?: DbUser; }
interface DbAddress { id: string; label: string; full_address: string; pincode: string; lat?: number; lng?: number; }

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS
// Light  → matches PostClient white/indigo aesthetic exactly
// Dark   → our previous navy/amber design
// ════════════════════════════════════════════════════════════════════════════════
const THEMES = {
  light: {
    // Page & structure
    pageBg: "#f1f5f9",
    navBg: "#1e3a8a",           // deep indigo — PostClient hero dark
    navBottomBorder: "#3b82f6",           // blue accent bar
    navText: "rgba(255,255,255,0.65)",
    navTextHover: "#ffffff",
    navActiveBg: "#3b82f6",
    navActiveText: "#ffffff",
    navBrand: "#ffffff",
    navBrandAccent: "#93c5fd",           // light-blue accent on brand

    sidebarBg: "#ffffff",
    sidebarHeaderBg: "#f8fafc",

    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    cardShadow: "0 1px 4px rgba(0,0,0,0.07)",

    // Section gradient headers inside cards — PostClient style
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

    chatBg: "#f1f5f9",
    chatPattern: "radial-gradient(#2563eb14 1px,transparent 1px)",
    bubbleAdminBg: "#dbeafe",
    bubbleAdminBorder: "#bfdbfe",
    bubbleAdminText: "#1e293b",
    bubbleUserBg: "#ffffff",
    bubbleUserBorder: "#e2e8f0",
    bubbleUserText: "#1e293b",
    bubbleMeta: "rgba(0,0,0,0.35)",

    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#64748b",
    pillActiveBg: "#dbeafe",
    pillActiveBorder: "#93c5fd",
    pillActiveText: "#1d4ed8",

    chatRowActiveBg: "#eff6ff",
    chatRowActiveBorder: "#2563eb",
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

    // pay card colours
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

    chatBg: "#080d17",
    chatPattern: "radial-gradient(rgba(245,158,11,0.018) 1px,transparent 1px)",
    bubbleAdminBg: "rgba(245,158,11,0.12)",
    bubbleAdminBorder: "rgba(245,158,11,0.22)",
    bubbleAdminText: "#f1f5f9",
    bubbleUserBg: "rgba(255,255,255,0.05)",
    bubbleUserBorder: "rgba(255,255,255,0.08)",
    bubbleUserText: "#f1f5f9",
    bubbleMeta: "rgba(255,255,255,0.3)",

    pillBg: "rgba(255,255,255,0.03)",
    pillBorder: "rgba(255,255,255,0.08)",
    pillText: "rgba(255,255,255,0.4)",
    pillActiveBg: "rgba(245,158,11,0.15)",
    pillActiveBorder: "rgba(245,158,11,0.4)",
    pillActiveText: "#f59e0b",

    chatRowActiveBg: "rgba(245,158,11,0.08)",
    chatRowActiveBorder: "#f59e0b",
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
// UTILS
// ════════════════════════════════════════════════════════════════════════════════
function useDebounce<T>(value: T, delay: number): T {
  const [v, setV] = useState<T>(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}
const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtBytes = (b: number) => { if (!b) return "0 B"; const k = 1024, s = ["B", "KB", "MB", "GB"], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + " " + s[i]; };
const isImg = (name: string | null) => !!name?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

// ════════════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ════════════════════════════════════════════════════════════════════════════════
const STATUS_CFG = {
  pending: { color: "#d97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.3)", dot: "#f59e0b", label: "Pending" },
  seen: { color: "#2563eb", bg: "rgba(37,99,235,0.1)", border: "rgba(37,99,235,0.3)", dot: "#3b82f6", label: "Seen" },
  processing: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.3)", dot: "#8b5cf6", label: "Processing" },
  payment_pending: { color: "#dc2626", bg: "rgba(220,38,38,0.1)", border: "rgba(220,38,38,0.3)", dot: "#ef4444", label: "Payment" },
  done: { color: "#15803d", bg: "rgba(21,128,61,0.1)", border: "rgba(21,128,61,0.3)", dot: "#22c55e", label: "Done" },
  cancelled: { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", dot: "#9ca3af", label: "Cancelled" },
} as const;

const NAV_LINKS = [
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/courses" : "http://localhost:3000/admin/courses", icon: "📬", label: "Courses" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/verify" : "http://localhost:3000/admin/verify", icon: "✅", label: "Verify Course" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
];

// ════════════════════════════════════════════════════════════════════════════════
// ICONS (inline SVG)
// ════════════════════════════════════════════════════════════════════════════════
const Ico = {
  Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
  Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Send: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Attach: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>,
  Pay: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
  Check: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
  DblChk: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 6 7 17 2 12" /><polyline points="22 6 11 17 7 13" /></svg>,
  Reply: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 00-4-4H4" /></svg>,
  Download: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Doc: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  Team: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  Post: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  ZoomIn: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
};

// ════════════════════════════════════════════════════════════════════════════════
// AVATAR
// ════════════════════════════════════════════════════════════════════════════════
function Avatar({ name, size = 40, role, isDark }: { name?: string | null; size?: number; role?: UserRole; isDark: boolean }) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  const grad =
    role === "main_admin" ? (isDark ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#1d4ed8,#1e3a8a)")
      : role === "co_admin" ? (isDark ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "linear-gradient(135deg,#2563eb,#3b82f6)")
        : (isDark ? "linear-gradient(135deg,#334155,#1e293b)" : "linear-gradient(135deg,#64748b,#475569)");
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.18)" }}>
      {ch}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// LIGHTBOX
// ════════════════════════════════════════════════════════════════════════════════
function Lightbox({ src, name, onClose }: { src: string; name: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const dl = async () => {
    try {
      const r = await fetch(src); const b = await r.blob();
      const u = URL.createObjectURL(b); const a = document.createElement("a");
      a.href = u; a.download = name; document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(u);
    } catch { window.open(src, "_blank"); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.96)", backdropFilter: "blur(14px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "lbIn .2s ease" }}>
      <style>{`@keyframes lbIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 10 }}>
        <button onClick={e => { e.stopPropagation(); dl(); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 16px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
          <Ico.Download /> Download
        </button>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: 9, borderRadius: 8, cursor: "pointer", display: "flex" }}><Ico.X /></button>
      </div>
      <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{name}</div>
      <img src={src} alt={name} onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// GENERATED CSS (theme-aware) — regenerated every time theme flips
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

/* ── NAV LINK ── */
.top-nav-link{
  display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
  transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

/* ── SECTION TABS ── */
.sec-tab{
  display:flex;flex-direction:column;align-items:center;gap:4px;
  padding:10px 22px;cursor:pointer;background:transparent;border:none;
  border-bottom:2px solid transparent;color:${T.subTabText};
  font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  transition:all .15s;font-family:'DM Sans',sans-serif;
}
.sec-tab.on{color:${T.subTabActive};}
.sec-tab:hover:not(.on){color:${T.textSecondary};}

/* ── CHAT ROW ── */
.chat-row{
  padding:13px 14px;cursor:pointer;border-bottom:1px solid ${T.divider};
  transition:background .12s;display:flex;gap:12px;align-items:center;position:relative;
}
.chat-row:hover{background:${T.rowHover};}
.chat-row.active{background:${T.chatRowActiveBg};border-left:3px solid ${T.chatRowActiveBorder};}

/* ── FILTER PILLS ── */
.pill{
  padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
  cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
  background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
}
.pill:hover{border-color:${T.accent};color:${T.accent};}
.pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

/* ── BUTTONS ── */
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

/* ── INPUT ── */
.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}
select.inp option{background:${T.modalBg};color:${T.inputText};}

/* ── CARD ── */
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

/* ── SECTION HEADER (gradient) inside card ── */
.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

/* ── BUBBLE ── */
.bubble{max-width:80%; min-width:80%; padding:10px 13px;border-radius:13px;position:relative;animation:bub .2s ease;}
.b-admin{background:${T.bubbleAdminBg};border:1px solid ${T.bubbleAdminBorder};color:${T.bubbleAdminText};border-radius:13px 13px 3px 13px;}
.b-user{background:${T.bubbleUserBg};border:1px solid ${T.bubbleUserBorder};color:${T.bubbleUserText};border-radius:13px 13px 13px 3px;}

/* ── REPLY HOVER ── */
.msgrow:hover .rep-btn{opacity:1;}
.rep-btn{opacity:0;transition:opacity .15s;}

/* ── TEAM CARD ── */
.tcard{background:${T.teamCardBg};border:1px solid ${T.teamCardBorder};border-radius:12px;padding:20px;transition:all .2s;}
.tcard:hover{background:${T.teamCardHover};transform:translateY(-2px);box-shadow:${T.cardShadow};}

/* ── POST CARD ── */
.pcard{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;padding:20px 22px;display:flex;align-items:flex-start;gap:16px;transition:all .2s;}
.pcard:hover{background:${T.teamCardHover};}

/* ── MODAL ── */
.modal-ov{position:fixed;inset:0;background:${T.modalOverlay};backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-bx{background:${T.modalBg};border:1px solid ${T.modalBorder};border-radius:14px;width:100%;max-width:460px;animation:pop .2s ease;box-shadow:0 30px 60px rgba(0,0,0,0.25);}

/* ── DRAG OVERLAY ── */
.drag-ov{position:absolute;inset:0;background:${T.accentLight};border:2px dashed ${T.accent};border-radius:10px;margin:12px;z-index:50;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}

/* ── DOC BUBBLE ── */
.doc-bub{display:flex;align-items:center;gap:11px;background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:9px;padding:11px 13px;margin-top:4px;}

/* ── THEME TOGGLE ── */
.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

/* ── PULSE ── */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.pulse-dot{animation:pulse 2s ease-in-out infinite;}

/* ── ANIMS ── */
@keyframes bub{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
`;
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION HEADER COMPONENT
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
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function CSCAdminPanel() {
  // DEFAULT = LIGHT (white) theme
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES.dark : THEMES.light;

  const [activeTab, setActiveTab] = useState<"requests" | "team" | "post">("requests");
  const [currentUser, setCurrentUser] = useState<DbUser | null>(null);

  // Queue
  const [requests, setRequests] = useState<DbRequest[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | RequestStatus>("all");
  const [searchQ, setSearchQ] = useState("");
  const dSearch = useDebounce(searchQ, 500);

  // Chat
  const [selectedReq, setSelectedReq] = useState<DbRequest | null>(null);
  const [sidePanel, setSidePanel] = useState<"chat" | "docs" | "delivery">("chat");
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [documents, setDocuments] = useState<DbDocument[]>([]);

  // ✨ Delivery State
  const [activeDeliveryReqId, setActiveDeliveryReqId] = useState<string | null>(null);
  // Add this near your other states (around line 190)
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [certUser, setCertUser] = useState<DbUser | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // 2. Add this state near your other modals (around line 200)
  const [showDeliverySearch, setShowDeliverySearch] = useState(false);

  // ✨ ACTIVATE GPS BROADCASTER WHEN A DELIVERY STARTS
  useDeliveryBroadcaster(activeDeliveryReqId || "", !!activeDeliveryReqId);

  // Input
  const [replyText, setReplyText] = useState("");
  const [replyAmount, setReplyAmount] = useState("");
  const [showPayBar, setShowPayBar] = useState(false);
  const [replyingTo, setReplyingTo] = useState<DbMessage | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Lightbox
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);

  const msgEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [showAssign, setShowAssign] = useState(false);
  const [showMarkDone, setShowMarkDone] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearchQ, setUserSearchQ] = useState("");
  const dUserSearch = useDebounce(userSearchQ, 400);
  const [userSearchResults, setUserSearchResults] = useState<DbUser[]>([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Team
  const [teamMembers, setTeamMembers] = useState<DbUser[]>([]);
  const [teamSearch, setTeamSearch] = useState("");

  // Bulk select
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedReqIds, setSelectedReqIds] = useState<string[]>([]);

  const [socket, setSocket] = useState<Socket | null>(null);
  const isMainAdmin = currentUser?.role === "main_admin";

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✨ FIX 1: Track unread IDs safely so the DB refresh doesn't wipe them out
  const [unreadIds, setUnreadIds] = useState<string[]>([]);

  // Create a ref for selectedReq so the background socket always knows what you are looking at
  const selectedReqRef = useRef<DbRequest | null>(null);
  useEffect(() => { selectedReqRef.current = selectedReq; }, [selectedReq]);

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();


  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try { const u = await getAdminProfileAction(); if (u) setCurrentUser(u as unknown as DbUser); else window.location.href = "/"; }
      catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => {
    // Pre-load the audio so the browser trusts it
    if (typeof window !== "undefined") {
      audioRef.current = new Audio('/notify.mp3');
    }
  }, []);


  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [user]);

  // ── Queue ─────────────────────────────────────────────────────────────────
  const fetchQueue = useCallback(async () => {
    try { const d = await adminGetRequestsAction(filterStatus, dSearch); setRequests(d as unknown as DbRequest[] || []); }
    catch (e) { console.error(e); } finally { setIsLoadingQueue(false); }
  }, [filterStatus, dSearch]);

  useEffect(() => {
    const s = io(); setSocket(s);
    s.on("refresh_queue", () => fetchQueue());
    fetchQueue();
    return () => { s.disconnect(); };
  }, [fetchQueue]);

  // ── Chat ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedReq || !socket) return;
    socket.emit("join_chat", selectedReq.id);
    (async () => {
      try {
        const { messages: msgs, documents: docs } = await adminGetChatAction(selectedReq.id);
        const enriched = (msgs as unknown as DbMessage[]).map(m => ({ ...m, reply_to_msg: m.reply_to_id ? (msgs as unknown as DbMessage[]).find(o => o.id === m.reply_to_id) : undefined }));
        setMessages(enriched);
        setDocuments(docs as unknown as DbDocument[]);
        if (selectedReq.status === "pending") {
          await adminUpdateReqStatusAction(selectedReq.id, "seen");
          setRequests(p => p.map(r => r.id === selectedReq.id ? { ...r, status: "seen" } : r));
          socket.emit("trigger_queue_refresh");
        }
      } catch (e) { console.error(e); }
    })();
    const handleNew = (m: DbMessage) => {
      setMessages(p => {
        // ✨ FIX 2: Security check! Ignore messages that belong to a different chat room
        if (m.request_id !== selectedReq.id) return p; if (p.some(x => x.id === m.id)) return p; const rep = m.reply_to_id ? p.find(o => o.id === m.reply_to_id) : undefined; return [...p, { ...m, reply_to_msg: rep }];
      });
    };
    socket.on("new_message", handleNew);
    return () => { socket.off("new_message", handleNew); };
  }, [selectedReq, socket]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sidePanel]);

  useEffect(() => {
    //if (activeTab === "team") 
    adminGetTeamAction().then(r => setTeamMembers(r as unknown as DbUser[])).catch(console.error);
  }, [activeTab]);

  useEffect(() => {
    if (dUserSearch.length > 2) adminSearchUsersAction(dUserSearch).then(r => setUserSearchResults(r as unknown as DbUser[])).catch(console.error);
    else setUserSearchResults([]);
  }, [dUserSearch]);

  useEffect(() => {
    if (!socket || !currentUser) return;
    const h = async () => { alert("Your role was updated. Please log in again."); await supabase.auth.signOut(); window.location.href = "/"; };
    socket.on(`logout_command_${currentUser.id}`, h);
    return () => { socket.off(`logout_command_${currentUser.id}`, h); };
  }, [socket, currentUser]);

  // ✨ REAL-TIME DESKTOP NOTIFICATIONS (SOCKET.IO)
  useEffect(() => {
    if (!currentUser || !socket) return;

    const handleNewAlert = (newMsg: any) => {
      // Only notify if the sender is NOT the admin
      if (newMsg.sender_id !== currentUser.id) {

        // 1. Play sound safely using the pre-loaded ref
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Reset to start
          audioRef.current.play().catch(err => console.log("Audio blocked. Click 'Enable Alerts'.", err));
        }

        // 2. Show Desktop Popup (Best practice: Only show if they are on another tab!)
        if (Notification.permission === "granted") {
          // ✨ FIX: Dynamically pull the user's name from the socket payload
          const senderName = newMsg.users?.name || "Citizen";

          const notif = new Notification(`New Message from ${senderName}`, {
            body: newMsg.content || "📎 Sent a new attachment or form",
            icon: "/favicon.ico"
          });

          // Clicking the notification brings the Admin back to the tab!
          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        }

        // 3. INSTANT PREVIEW INJECTION
        setRequests((prev: DbRequest[]) => {
          const updated = prev.map(req => {
            if (req.id === newMsg.request_id) {
              const existingMsgs = req.request_messages || [];

              // ✨ If Admin is actively staring at this exact chat, DO NOT mark it as unread!
              const isCurrentlyViewing = selectedReq?.id === req.id && !document.hidden;

              return {
                ...req,
                updated_at: newMsg.created_at,
                request_messages: [...existingMsgs, newMsg],
                _unread: !isCurrentlyViewing // ✨ Marks it green ONLY if you are looking away
              };
            }
            return req;
          });
          return updated.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        });

        // ✨ FIX 1: Safely track the unread dot
        if (selectedReqRef.current?.id !== newMsg.request_id) {
          setUnreadIds(prev => prev.includes(newMsg.request_id) ? prev : [...prev, newMsg.request_id]);
        }

        fetchQueue();
      }
    };

    socket.on("global_message_alert", handleNewAlert);
    return () => { socket.off("global_message_alert", handleNewAlert); };
  }, [currentUser, socket, fetchQueue]);



  // ── Actions ───────────────────────────────────────────────────────────────
  const updateRole = async (uid: string, role: UserRole) => { try { await adminUpdateUserRoleAction(uid, role); setTeamMembers(p => p.map(u => u.id === uid ? { ...u, role } : u)); socket?.emit("force_logout_user", uid); } catch (e: unknown) { alert("Failed: " + (e as Error).message); } };
  const removeCoAdmin = async (uid: string) => { if (!confirm("Revoke admin access?")) return; try { await adminUpdateUserRoleAction(uid, "user"); setTeamMembers(p => p.filter(u => u.id !== uid)); socket?.emit("force_logout_user", uid); } catch (e: unknown) { alert("Failed: " + (e as Error).message); } };
  const assignTo = async (aid: string, aname: string) => { if (!selectedReq) return; try { await adminAssignReqAction(selectedReq.id, aid); setRequests(p => p.map(r => r.id === selectedReq.id ? { ...r, assigned_to: aid, assignee: { name: aname } as DbUser } : r)); setSelectedReq(p => p ? { ...p, assigned_to: aid, assignee: { name: aname } as DbUser } : p); setShowAssign(false); } catch (e: unknown) { alert("Assign failed: " + (e as Error).message); } };
  const changeStatus = async (st: RequestStatus) => { if (!selectedReq) return; try { await adminUpdateReqStatusAction(selectedReq.id, st); setRequests(p => p.map(r => r.id === selectedReq.id ? { ...r, status: st } : r)); setSelectedReq(p => p ? { ...p, status: st } : p); setShowMarkDone(false); } catch (e: unknown) { alert((e as Error).message); } };
  const handleBulkDelete = async () => { if (!selectedReqIds.length) return; if (!confirm(`Delete ${selectedReqIds.length} requests permanently?`)) return; try { await adminDeleteRequestsAction(selectedReqIds); setSelectedReqIds([]); setIsSelectMode(false); if (selectedReq && selectedReqIds.includes(selectedReq.id)) setSelectedReq(null); fetchQueue(); socket?.emit("trigger_queue_refresh"); } catch (e: unknown) { alert("Delete failed: " + (e as Error).message); } };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setPendingFiles(p => [...p, ...Array.from(e.target.files!)]); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files) setPendingFiles(p => [...p, ...Array.from(e.dataTransfer.files)]); };
  const dlFile = async (url: string, filename: string) => { try { const r = await fetch(url); const b = await r.blob(); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u); } catch { window.open(url, "_blank"); } };
  const startNewChat = async (u: DbUser) => { setIsCreatingChat(true); try { const d = await adminCreateNewChatAction(u.id); setShowNewChat(false); setUserSearchQ(""); setActiveTab("requests"); setRequests(p => [d as unknown as DbRequest, ...p]); setSelectedReq(d as unknown as DbRequest); } catch (e: unknown) { alert((e as Error).message); } finally { setIsCreatingChat(false); } };

  const assignDeliveryAgent = async (u: DbUser) => {
    if (!selectedReq) return;
    try {
      await adminAssignDeliveryBoyAction(selectedReq.id, u.id);
      const updatedReq = { ...selectedReq, delivery_boy_id: u.id, delivery_status: "pending" as any };
      setSelectedReq(updatedReq);
      setRequests(prev => prev.map(r => r.id === selectedReq.id ? updatedReq : r));
      setShowDeliverySearch(false);
      alert(`✅ Assigned to ${u.name}`);
      socket?.emit("trigger_queue_refresh");
    } catch (e: any) { alert(e.message); }
  };

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark; setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  // ✨ NEW: Delivery Handlers
  const handleDeliveryUpdate = async (status: 'out_for_delivery' | 'delivered' | 'pending') => {
    if (!selectedReq) return;
    try {
      await adminUpdateDeliveryStatusAction(selectedReq.id, status);

      // Update local state
      const updatedReq = { ...selectedReq, delivery_status: status };
      setSelectedReq(updatedReq);
      setRequests(prev => prev.map(r => r.id === selectedReq.id ? updatedReq : r));

      // Toggle Broadcaster
      if (status === 'out_for_delivery') {
        setActiveDeliveryReqId(selectedReq.id);
      } else {
        setActiveDeliveryReqId(null);
      }

      // Tell client to refresh map
      socket?.emit("trigger_queue_refresh");
    } catch (error: any) {
      alert("Delivery update failed: " + error.message);
    }
  };

  const sendReply = async (type: MessageType = "text") => {
    if (!selectedReq || !currentUser) return;
    if (type === "text" && !replyText.trim() && !pendingFiles.length) return;
    setIsSending(true);
    try {
      const uDocs: { name: string; url: string; size: string }[] = [];
      for (const f of pendingFiles) {
        const fd = new FormData(); fd.append("file", f); fd.append("requestId", selectedReq.id);
        const res = await uploadChatFileAction(fd); if (!res.success) throw new Error(res.error);
        uDocs.push({ name: res.name || f.name, url: res.url, size: fmtBytes(f.size) });
      }
      if (replyText.trim() || type === "payment") {
        const db = { request_id: selectedReq.id, message_type: type, content: type === "text" ? replyText.trim() : null, payment_amount: type === "payment" ? Number(replyAmount) : null, is_result_doc: false, reply_to_id: replyingTo?.id || null };
        const sk = { ...db, id: `t-${Date.now()}`, sender_id: currentUser.id, sender_role: currentUser.role, created_at: new Date().toISOString(), users: { name: currentUser.name, role: currentUser.role } };
        await adminSendMessageAction(db); socket?.emit("send_message", sk); socket?.emit("trigger_queue_refresh");
      }
      for (const doc of uDocs) {
        const db = { request_id: selectedReq.id, message_type: "doc" as MessageType, doc_name: doc.name, doc_url: doc.url, doc_size: doc.size, is_result_doc: false, reply_to_id: replyingTo?.id || null };
        const sk = { ...db, id: `td-${Date.now()}-${Math.random()}`, sender_id: currentUser.id, sender_role: currentUser.role, created_at: new Date().toISOString(), users: { name: currentUser.name, role: currentUser.role } };
        await adminSendMessageAction(db); socket?.emit("send_message", sk); socket?.emit("trigger_queue_refresh");
      }
      setReplyText(""); setReplyAmount(""); setShowPayBar(false); setReplyingTo(null); setPendingFiles([]);
    } catch (e: unknown) { alert("Send failed: " + (e as Error).message); }
    finally { setIsSending(false); }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const inp = (extra: React.CSSProperties = {}) => ({ ...extra } as React.CSSProperties);
  const modalHdrStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "17px 22px", borderBottom: `1px solid ${T.divider}` };
  const modalHdrTitle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: T.textPrimary, display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Serif Display', serif" };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <AuthGuard allowedRoles={["co_admin", "main_admin"]}>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s" }}>
        <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

        {lightbox && <Lightbox src={lightbox.src} name={lightbox.name} onClose={() => setLightbox(null)} />}

        {/* ════════════════════════════════════════════════════════
          HEADER — navy indigo in both themes (like PostClient nav)
      ════════════════════════════════════════════════════════ */}
        <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>

          {/* Row 1 — brand + nav links + toggle + user */}
          <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

            {/* Brand — PostClient style "SrilalCSC" */}
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
              <div>
                <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                  Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
                </div>
                <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
              </div>
            </a>

            <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />


            <div style={{ display: "flex", paddingLeft: 8, background: "rgba(0,0,0,0.12)" }}>
              {[{ id: "requests", icon: "💬", label: "Support Chats" }, { id: "team", icon: "👥", label: "Team" }].map(tab => (
                <button key={tab.id} className={`sec-tab ${activeTab === tab.id ? "on" : ""}`} onClick={() => setActiveTab(tab.id as "requests" | "team" | "post")}>
                  <span style={{ fontSize: 17 }}>{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>

            <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

            {/* Nav links */}
            <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
              {NAV_LINKS.map(l => (
                <a key={l.href} href={l.href} className="top-nav-link">
                  <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
                </a>
              ))}
            </nav>

            {/* ✨ UNLOCKS BROWSER SOUND & NOTIFICATIONS */}
            {typeof window !== 'undefined' && Notification.permission !== "granted" && (
              <button
                onClick={() => {
                  Notification.requestPermission().then(perm => {
                    if (perm === "granted") {
                      new Audio('/notify.mp3').play().catch(() => { }); // Unblocks browser audio policy
                      alert("✅ Notifications & Sounds Enabled!");
                    }
                  });
                }}
                style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#10b981", padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                🔕 Enable Alerts
              </button>
            )}


            {/* ✨ BULK EXCEL UPLOAD BUTTON */}
            <button
              onClick={() => setShowBulkUpload(true)}
              style={{
                background: isDark ? "rgba(245,158,11,0.15)" : "rgba(37,99,235,0.1)",
                border: `1px solid ${isDark ? "#f59e0b" : "#2563eb"}`,
                color: isDark ? "#f59e0b" : "#2563eb",
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? "rgba(245,158,11,0.25)" : "rgba(37,99,235,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? "rgba(245,158,11,0.15)" : "rgba(37,99,235,0.1)";
              }}
            >
              📊 Bulk Upload
            </button>

            {/* Theme toggle */}
            <button className="tog" onClick={toggleTheme}>
              <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
            </button>

            {/* User chip */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
              <Avatar name={currentUser?.name} size={28} role={currentUser?.role} isDark={isDark} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{currentUser?.name || "Admin"}</div>
                <div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>{currentUser?.role?.replace("_", " ").toUpperCase()}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════
          BODY
      ════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* ──────────────────────────────────────────────────
            REQUESTS TAB
        ────────────────────────────────────────────────── */}
          {activeTab === "requests" && (
            <>
              {/* SIDEBAR */}
              <div style={{ width: 360, borderRight: `1px solid ${T.divider}`, display: "flex", flexDirection: "column", background: T.sidebarBg, flexShrink: 0, boxShadow: isDark ? "none" : "2px 0 8px rgba(0,0,0,0.04)" }}>

                {/* Sidebar header */}
                <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.divider}`, background: T.sidebarHeaderBg }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                      <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search chats…" className="inp" style={{ paddingLeft: 33 }} />
                    </div>
                    <button className="btn btn-g" style={{ fontSize: 12, padding: "7px 11px" }} onClick={() => { setIsSelectMode(!isSelectMode); setSelectedReqIds([]); }}>
                      {isSelectMode ? "Cancel" : "Select"}
                    </button>
                  </div>

                  {!isSelectMode ? (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {["all", "pending", "processing", "done", "payment_pending"].map(s => (
                        <button key={s} className={`pill ${filterStatus === s ? "on" : ""}`} onClick={() => setFilterStatus(s as "all" | RequestStatus)}>
                          {s === "payment_pending" ? "Payment" : s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button className="btn btn-d" style={{ width: "100%", justifyContent: "center", opacity: selectedReqIds.length ? 1 : .4 }} onClick={handleBulkDelete} disabled={!selectedReqIds.length}>
                      Delete {selectedReqIds.length ? `(${selectedReqIds.length})` : "selected"}
                    </button>
                  )}
                </div>

                {/* Chat list */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {isLoadingQueue ? (
                    <div style={{ padding: 40, textAlign: "center", color: T.textMuted, fontSize: 13 }}>Loading…</div>
                  ) : !requests.length ? (
                    <div style={{ padding: 60, textAlign: "center", color: T.textMuted, fontSize: 13 }}>No chats found.</div>
                  ) : requests.map(req => {
                    const cfg = STATUS_CFG[req.status] || STATUS_CFG.pending;
                    const isActive = selectedReq?.id === req.id;

                    // ✨ WhatsApp Logic
                    const lastMsg = req.request_messages?.[req.request_messages.length - 1];
                    // ✨ FIX 1: Read from our safe unreadIds array!
                    const isUnreadActual = (unreadIds.includes(req.id) || req.status === "pending") && !isActive;

                    let previewText = "No messages yet";
                    if (lastMsg) {
                      if (lastMsg.message_type === "text") previewText = lastMsg.content || "";
                      else if (lastMsg.message_type === "form") previewText = "📝 Form Submitted";
                      else if (lastMsg.message_type === "payment") previewText = "💳 Payment Request";
                      else if (lastMsg.doc_url) previewText = "📎 Document Attached";
                    }

                    return (
                      <div key={req.id} className={`chat-row ${isActive ? "active" : ""}`}
                        onClick={() => { if (isSelectMode) setSelectedReqIds(p => p.includes(req.id) ? p.filter(i => i !== req.id) : [...p, req.id]); else { setSelectedReq(req); setUnreadIds(prev => prev.filter(id => id !== req.id)); } }}>
                        {isSelectMode && <input type="checkbox" readOnly checked={selectedReqIds.includes(req.id)} style={{ accentColor: "#ef4444", flexShrink: 0 }} />}
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <Avatar name={req.users?.name} size={42} role="user" isDark={isDark} />
                          <span className={req.status === "pending" ? "pulse-dot" : ""} style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: cfg.dot, border: `2px solid ${T.sidebarBg}` }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.users?.name || "Citizen"}</span>
                            {/* ✨ Time of Last Message */}
                            <span style={{ fontSize: 11, color: isUnreadActual ? "#10b981" : T.textMuted, fontWeight: isUnreadActual ? 700 : 500, flexShrink: 0, marginLeft: 8 }}>
                              {lastMsg ? fmtTime(lastMsg.created_at) : fmtTime(req.updated_at)}
                            </span>                        </div>
                          <div style={{ fontSize: 12, color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <span style={{ color: T.accent, fontWeight: 700 }}>{req.service}</span>
                            <span style={{ margin: "0 4px", opacity: .4 }}>·</span>{req.title}
                          </div>
                          {/* ✨ WhatsApp-Style Last Message Preview */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{
                              fontSize: 13,
                              color: isUnreadActual ? T.textPrimary : T.textMuted,
                              fontWeight: isUnreadActual ? 600 : 400,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              flex: 1,
                              paddingRight: 10
                            }}>
                              {previewText}
                            </div>

                            {/* ✨ Green Unread Dot */}
                            {isUnreadActual && (
                              <div style={{ width: 10, height: 10, background: "#10b981", borderRadius: "50%", flexShrink: 0, boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)" }} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.divider}`, background: T.sidebarHeaderBg }}>
                  <button className="btn btn-p" style={{ width: "100%", justifyContent: "center", borderRadius: 9, padding: "10px" }} onClick={() => setShowNewChat(true)}>
                    <Ico.Plus /> New Chat
                  </button>
                </div>
              </div>

              {/* CHAT PANEL */}
              {selectedReq ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.chatBg, position: "relative" }}
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}>

                  {isDragOver && (
                    <div className="drag-ov">
                      <div style={{ textAlign: "center", color: T.accent }}>
                        <div style={{ fontSize: 38, marginBottom: 8 }}>📎</div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>Drop files to attach</div>
                      </div>
                    </div>
                  )}

                  {/* Chat header */}
                  <div style={{ background: isDark ? "rgba(6,11,20,0.98)" : T.cardBg, borderBottom: `1px solid ${T.divider}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ position: "relative" }}>
                        <Avatar name={selectedReq.users?.name} size={40} isDark={isDark} />
                        <span style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: STATUS_CFG[selectedReq.status]?.dot || "#9ca3af", border: `2px solid ${isDark ? "#060b14" : T.cardBg}` }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>{selectedReq.users?.name || "Citizen"}</div>
                        <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 1 }}>
                          {selectedReq.service}{selectedReq.users?.mobile && <><span style={{ margin: "0 5px", opacity: .4 }}>·</span>{selectedReq.users.mobile}</>}
                          {selectedReq.assignee?.name && <span style={{ marginLeft: 8, color: T.accent, fontWeight: 600 }}>→ {selectedReq.assignee.name}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ padding: "4px 11px", borderRadius: 20, background: STATUS_CFG[selectedReq.status]?.bg, border: `1px solid ${STATUS_CFG[selectedReq.status]?.border}`, fontSize: 11, fontWeight: 800, color: STATUS_CFG[selectedReq.status]?.color, letterSpacing: ".05em" }}>
                        {STATUS_CFG[selectedReq.status]?.label || selectedReq.status}
                      </div>
                      {selectedReq.status !== "done" && <button className="btn btn-s" style={{ fontSize: 12 }} onClick={() => setShowMarkDone(true)}><Ico.Check /> Resolve</button>}
                    </div>
                  </div>

                  {/* Sub tabs */}
                  <div style={{ display: "flex", borderBottom: `1px solid ${T.divider}`, background: T.subTabHdrBg, paddingLeft: 10 }}>
                    {["chat", "docs", "delivery"].map(tb => (
                      <button key={tb} style={{ padding: "11px 18px", fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", background: "transparent", border: "none", color: sidePanel === tb ? T.subTabActive : T.subTabText, borderBottom: `2px solid ${sidePanel === tb ? T.subTabBorder : "transparent"}`, transition: "all .15s", fontFamily: "'DM Sans',sans-serif" }} onClick={() => setSidePanel(tb as "chat" | "docs" | "delivery")}>
                        {tb === "chat" ? "💬 Messages" : tb === "docs" ? `📁 Documents (${documents.length})` : "🛵 Delivery"}
                      </button>
                    ))}
                  </div>

                  {/* ── MESSAGES ── */}
                  {sidePanel === "chat" && (
                    <>
                      <div style={{ flex: 1, overflowY: "auto", padding: "22px 6%", display: "flex", flexDirection: "column", gap: 4, backgroundImage: T.chatPattern, backgroundSize: "28px 28px" }}>
                        {messages.map(msg => {
                          const isAdmin = msg.sender_role !== "user";
                          return (
                            <div key={msg.id} className="msgrow" style={{ display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-end" : "flex-start", marginBottom: 8 }}>
                              {!isAdmin && <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 4, marginBottom: 3 }}>{msg.users?.name || "Citizen"}</span>}
                              {isAdmin && msg.users?.name !== currentUser?.name && <span style={{ fontSize: 11, color: T.accent, marginRight: 4, marginBottom: 3, fontWeight: 600 }}>~ {msg.users?.name}</span>}

                              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: isAdmin ? "row-reverse" : "row" }}>
                                <div className={`bubble ${isAdmin ? "b-admin" : "b-user"}`}>

                                  {/* Reply preview */}
                                  {msg.reply_to_msg && (
                                    <div style={{ background: isDark ? "rgba(0,0,0,0.2)" : T.accentLight, borderLeft: `3px solid ${T.accent}`, borderRadius: "0 6px 6px 0", padding: "6px 10px", marginBottom: 8 }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 2 }}>{msg.reply_to_msg.users?.name || "User"}</div>
                                      <div style={{ fontSize: 12, color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.reply_to_msg.content || (msg.reply_to_msg.message_type === "doc" ? "📄 Document" : "💳 Payment")}</div>
                                    </div>
                                  )}

                                  {/* Payment */}
                                  {msg.message_type === "payment" && (
                                    <div style={{ width: "100%", boxSizing: "border-box", background: msg.payment_status === "paid" ? T.payPaidGrad : T.payPendingGrad, borderRadius: 8, padding: "14px", color: "#fff", position: "relative", overflow: "hidden", marginTop: 4 }}>
                                      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

                                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                          {msg.payment_status === "paid" ? <Ico.Check /> : <Ico.Pay />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontSize: 10, opacity: 0.9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                            {msg.payment_status === "paid" ? "Payment Received" : "Payment Requested"}
                                          </div>
                                          <div className="mono" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1, marginTop: 2 }}>
                                            {fmtCurrency(msg.payment_amount || 0)}
                                          </div>
                                        </div>
                                      </div>

                                      {msg.payment_status === "paid" ? (
                                        <div style={{ fontSize: 11, background: "rgba(255,255,255,0.18)", padding: "6px 10px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700 }}>✅ Verified · Razorpay</div>
                                      ) : (
                                        <div style={{ fontSize: 12, opacity: .85 }}>Awaiting payment from user</div>
                                      )}
                                    </div>
                                  )}

                                  {/* ✨ ADMIN FORM BUBBLE WITH 1-CLICK COPY */}
                                  {msg.message_type === "form" && (
                                    <div style={{ minWidth: 280, background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc", border: `1px solid ${T.accentBorder}`, borderRadius: 11, padding: "16px", margin: "4px 0", width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                                      <div style={{ display: "flex", gap: 10, alignItems: "center", borderBottom: `1px dashed ${T.divider}`, paddingBottom: 12, marginBottom: 16 }}>
                                        <div style={{ background: T.accentLight, padding: "8px 10px", borderRadius: 8, fontSize: 18 }}>📝</div>
                                        <div style={{ flex: 1 }}>
                                          {/* ✨ Now it pulls the title from the joined forms table */}
                                          <div style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>{(msg as any).forms?.title || (msg as any).form_title || "User Form Submission"}</div>                                        <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ready to Process</div>
                                        </div>
                                      </div>

                                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {(msg as any).form_data && Object.entries((msg as any).form_data).map(([key, val]) => (
                                          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                              <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, textTransform: "uppercase" }}>{key}</div>

                                              {/* ✨ 1-Click Copy Button with Toast Effect */}
                                              <button
                                                onClick={() => {
                                                  navigator.clipboard.writeText(String(val));
                                                  const uniqueId = msg.id + key;
                                                  setCopiedId(uniqueId);
                                                  setTimeout(() => setCopiedId(null), 2000); // Resets after 2s
                                                }}
                                                style={{
                                                  background: copiedId === (msg.id + key) ? T.btnSuccessBg : T.accentLight,
                                                  border: `1px solid ${copiedId === (msg.id + key) ? "transparent" : T.accentBorder}`,
                                                  color: copiedId === (msg.id + key) ? "#fff" : T.accent,
                                                  fontSize: 10, fontWeight: 800, cursor: "pointer", padding: "3px 8px", borderRadius: 4, transition: "all 0.2s"
                                                }}
                                                onMouseEnter={e => { if (copiedId !== (msg.id + key)) e.currentTarget.style.background = T.accentBorder }}
                                                onMouseLeave={e => { if (copiedId !== (msg.id + key)) e.currentTarget.style.background = T.accentLight }}
                                              >
                                                {copiedId === (msg.id + key) ? "✅ Copied" : "📋 Copy"}
                                              </button>
                                            </div>
                                            <div style={{ fontSize: 14, color: T.textPrimary, fontWeight: 600, background: isDark ? "rgba(0,0,0,0.2)" : "#fff", padding: "8px 12px", borderRadius: 6, border: `1px solid ${T.inputBorder}`, userSelect: "all" }}>
                                              {String(val)}
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Document Attachment */}
                                      {msg.doc_url && (
                                        <div onClick={() => dlFile(msg.doc_url!, msg.doc_name || "document")} style={{ marginTop: 16, background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = T.accent} onMouseLeave={e => e.currentTarget.style.borderColor = T.inputBorder}>
                                          <span style={{ fontSize: 18 }}>📎</span>
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.doc_name}</div>
                                            <div style={{ fontSize: 11, color: T.textMuted }}>{msg.doc_size}</div>
                                          </div>
                                          <span style={{ fontSize: 18, color: T.textMuted }}>⬇</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Document */}
                                  {msg.message_type === "doc" && (
                                    <div>
                                      {isImg(msg.doc_name) ? (
                                        <div style={{ position: "relative", display: "inline-block", maxWidth: 260 }}>
                                          <img src={msg.doc_url || ""} alt={msg.doc_name || "img"} style={{ width: "100%", maxHeight: 340, borderRadius: 8, display: "block", cursor: "pointer", objectFit: "cover", objectPosition: "top center", border: `1px solid ${T.divider}` }} onClick={() => setLightbox({ src: msg.doc_url || "", name: msg.doc_name || "image" })} />
                                          <button onClick={() => dlFile(msg.doc_url || "", msg.doc_name || "file")} style={{ position: "absolute", bottom: 7, right: 7, background: "rgba(0,0,0,0.65)", border: "none", color: "#fff", cursor: "pointer", padding: 7, borderRadius: 6, display: "flex" }}><Ico.Download /></button>
                                        </div>
                                      ) : (
                                        <div className="doc-bub">
                                          <div style={{ width: 36, height: 36, borderRadius: 8, background: T.docIconBg, border: `1px solid ${T.docIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.docIconColor }}><Ico.Doc /></div>
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.textPrimary }}>{msg.doc_name}</div>
                                            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{msg.doc_size}</div>
                                          </div>
                                          <button onClick={() => dlFile(msg.doc_url || "", msg.doc_name || "file")} style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary, cursor: "pointer", padding: 8, borderRadius: 6, display: "flex", flexShrink: 0 }}><Ico.Download /></button>
                                        </div>
                                      )}
                                      {msg.content && <div style={{ fontSize: 14, marginTop: 6, lineHeight: 1.5, color: isAdmin ? T.bubbleAdminText : T.bubbleUserText }}>{msg.content}</div>}
                                    </div>
                                  )}

                                  {/* Text */}
                                  {msg.message_type === "text" && (
                                    <div style={{ fontSize: 14, lineHeight: 1.6, color: isAdmin ? T.bubbleAdminText : T.bubbleUserText, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</div>
                                  )}

                                  {/* Time + tick */}
                                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 5, marginTop: 5 }}>
                                    <span style={{ fontSize: 10, color: T.bubbleMeta }}>{fmtTime(msg.created_at)}</span>
                                    {isAdmin && <span style={{ color: "#2563eb" }}><Ico.DblChk /></span>}
                                  </div>
                                </div>

                                {/* Reply button */}
                                <button className="rep-btn btn btn-g" style={{ padding: 6, borderRadius: 7, flexShrink: 0 }} onClick={() => setReplyingTo(msg)} title="Reply"><Ico.Reply /></button>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={msgEndRef} />
                      </div>

                      {/* ── INPUT BAR ── */}
                      <div style={{ background: isDark ? "rgba(6,11,20,0.98)" : T.cardBg, borderTop: `1px solid ${T.divider}`, padding: "10px 18px", flexShrink: 0, boxShadow: isDark ? "none" : "0 -1px 6px rgba(0,0,0,0.05)" }}>

                        {/* Reply preview strip */}
                        {replyingTo && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.accentLight, borderLeft: `3px solid ${T.accent}`, padding: "7px 11px", borderRadius: "7px 7px 0 0", marginBottom: 1, gap: 10 }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 2 }}>↩ {replyingTo.users?.name || "User"}</div>
                              <div style={{ fontSize: 12, color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{replyingTo.content || (replyingTo.message_type === "doc" ? "📄 Document" : "💳 Payment")}</div>
                            </div>
                            <button onClick={() => setReplyingTo(null)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 3, display: "flex", flexShrink: 0 }}><Ico.X /></button>
                          </div>
                        )}

                        {/* Pending files */}
                        {pendingFiles.length > 0 && (
                          <div style={{ display: "flex", gap: 7, padding: "7px 0", overflowX: "auto", marginBottom: 4 }}>
                            {pendingFiles.map((f, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: T.inputBg, padding: "5px 9px", borderRadius: 6, border: `1px solid ${T.inputBorder}`, flexShrink: 0 }}>
                                <span style={{ color: T.textMuted }}><Ico.Doc /></span>
                                <span style={{ fontSize: 12, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.textPrimary }}>{f.name}</span>
                                <button onClick={() => setPendingFiles(p => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: T.btnDangerText, cursor: "pointer", padding: 0, display: "flex" }}><Ico.X /></button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Payment amount bar */}
                        {showPayBar && (
                          <div style={{ display: "flex", gap: 8, alignItems: "center", background: T.accentLight, border: `1px solid ${T.accentBorder}`, padding: "9px 13px", borderRadius: "7px 7px 0 0", marginBottom: 1 }}>
                            <span style={{ color: T.accent, fontWeight: 800, fontSize: 17 }}>₹</span>
                            <input value={replyAmount} onChange={e => setReplyAmount(e.target.value.replace(/\D/g, ""))} placeholder="Enter amount…" className="inp" style={{ width: 150, fontWeight: 700, fontSize: 15, background: "transparent", border: "none", padding: "3px 0", color: T.inputText }} />
                            <button className="btn btn-p" style={{ fontSize: 12 }} onClick={() => sendReply("payment")}>Send Payment Link</button>
                            <button className="btn btn-g" style={{ padding: "6px 9px" }} onClick={() => setShowPayBar(false)}><Ico.X /></button>
                          </div>
                        )}

                        {/* Main input row */}
                        <div style={{ display: "flex", gap: 9, alignItems: "center", background: T.inputBg, borderRadius: (replyingTo || pendingFiles.length || showPayBar) ? "0 0 11px 11px" : "11px", border: `1px solid ${T.inputBorder}`, padding: "7px 13px" }}>
                          <input type="file" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleFileSelect} />
                          <button onClick={() => fileInputRef.current?.click()} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4, display: "flex", transition: "color .15s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.accent; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.textMuted; }}><Ico.Attach /></button>
                          <button onClick={() => setShowPayBar(!showPayBar)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4, display: "flex", transition: "color .15s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.accent; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.textMuted; }}><Ico.Pay /></button>
                          <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply("text"); } }} placeholder="Type a message…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: T.inputText, padding: "5px 0", fontFamily: "'DM Sans',sans-serif" }} />
                          <button onClick={() => sendReply("text")} disabled={isSending || (!replyText.trim() && !pendingFiles.length)}
                            style={{ width: 34, height: 34, borderRadius: "50%", background: (!replyText.trim() && !pendingFiles.length) ? T.inputBg : T.btnPrimary, border: `1px solid ${(!replyText.trim() && !pendingFiles.length) ? T.inputBorder : "transparent"}`, color: (!replyText.trim() && !pendingFiles.length) ? T.textMuted : T.btnPrimaryText, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}>
                            {isSending ? <span style={{ width: 13, height: 13, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} /> : <Ico.Send />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── DOCS PANEL ── */}
                  {sidePanel === "docs" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                      {!documents.length ? (
                        <div style={{ padding: 60, textAlign: "center", color: T.textMuted, fontSize: 13 }}>No documents uploaded.</div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 14 }}>
                          {documents.map(doc => (
                            <div key={doc.id} className="card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: 13 }}>
                              <div style={{ width: 42, height: 42, borderRadius: 9, background: T.docIconBg, border: `1px solid ${T.docIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.docIconColor }}><Ico.Doc /></div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3, color: T.textPrimary }}>{doc.file_name}</div>
                                <div style={{ fontSize: 11, color: T.textMuted }}>{doc.file_size} · {fmtDate(doc.created_at)}</div>
                              </div>
                              <button onClick={() => dlFile(doc.file_url, doc.file_name)} style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary, cursor: "pointer", padding: 9, borderRadius: 7, display: "flex" }}><Ico.Download /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── ✨ NEW: DELIVERY TAB ── */}
                  {sidePanel === "delivery" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", justifyContent: "center" }}>
                      <div style={{ width: "100%", maxWidth: 500, background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: T.cardShadow }}>
                        <div style={{ background: T.sectionGrad, padding: "16px 20px", color: T.sectionGradText, fontWeight: 700, fontSize: 16, display: "flex", gap: 10, alignItems: "center" }}>
                          <span>📦</span> Delivery Management
                        </div>

                        <div style={{ padding: 20 }}>
                          {selectedReq.delivery_type !== "delivery" ? (
                            <div style={{ textAlign: "center", padding: "30px 0", color: T.textMuted }}>
                              <div style={{ fontSize: 40, marginBottom: 10 }}>🏪</div>
                              <div style={{ fontWeight: 600, fontSize: 15, color: T.textPrimary }}>Store Pickup Request</div>
                              <p style={{ fontSize: 13, marginTop: 4 }}>This citizen will collect their documents at the CSC.</p>
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                              {/* Destination */}
                              <div style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, padding: 14, borderRadius: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Destination</div>
                                <div style={{ fontWeight: 700, color: T.textPrimary, fontSize: 15, marginBottom: 2 }}>{selectedReq.address?.label || "Home"}</div>
                                <div style={{ color: T.textSecondary, fontSize: 14 }}>{selectedReq.address?.full_address}</div>
                                <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 4, fontWeight: 600 }}>PIN: {selectedReq.address?.pincode}</div>
                              </div>

                              {/* Urgency */}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.divider}`, paddingBottom: 16 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary }}>Urgency Level</span>
                                <span style={{
                                  padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                                  background: selectedReq.urgency === 'instant' ? T.docIconBg : T.accentLight,
                                  color: selectedReq.urgency === 'instant' ? T.docIconColor : T.accent
                                }}>
                                  {selectedReq.urgency?.replace("_", " ")}
                                </span>
                              </div>

                              {/* ✨ NEW: Assignment Section */}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.divider}`, paddingBottom: 16 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary }}>Assigned Agent</span>
                                {selectedReq.delivery_boy_id ? (
                                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Assigned ✅</span>
                                    <button onClick={() => setShowDeliverySearch(true)} className="btn btn-g" style={{ padding: "4px 8px", fontSize: 11 }}>Re-assign</button>
                                  </div>
                                ) : (
                                  <button onClick={() => { setUserSearchQ(""); setShowDeliverySearch(true); }} className="btn btn-p" style={{ padding: "6px 12px", fontSize: 12 }}>
                                    Assign Agent
                                  </button>
                                )}
                              </div>

                              {/* Delivery Actions (Hide if no agent assigned) */}
                              {selectedReq.delivery_boy_id && (
                                <div style={{ marginTop: 10 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, marginBottom: 10, textTransform: "uppercase" }}>Actions</div>

                                  {selectedReq.delivery_status === 'pending' && (
                                    <button onClick={() => handleDeliveryUpdate('out_for_delivery')} className="btn btn-p" style={{ width: "100%", padding: "14px", justifyContent: "center", fontSize: 15 }}>
                                      🛵 Start Live Delivery
                                    </button>
                                  )}

                                  {selectedReq.delivery_status === 'out_for_delivery' && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                      <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: 14, borderRadius: 10, color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", animation: "pulse 1.5s infinite" }}></span>
                                        Broadcasting Live GPS Location...
                                      </div>
                                      <div style={{ display: "flex", gap: 10 }}>
                                        <button onClick={() => handleDeliveryUpdate('pending')} className="btn btn-g" style={{ flex: 1, justifyContent: "center" }}>
                                          🛑 Stop Tracking
                                        </button>
                                        <button onClick={() => handleDeliveryUpdate('delivered')} className="btn btn-s" style={{ flex: 2, justifyContent: "center" }}>
                                          ✅ Mark Delivered
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {selectedReq.delivery_status === 'delivered' && (
                                    <div style={{ textAlign: "center", padding: "20px", color: "#15803d", background: T.btnSuccessBg, borderRadius: 10, fontWeight: 700 }}>
                                      🎉 Successfully Delivered
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state */
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, background: isDark ? "rgba(6,11,20,0.5)" : T.pageBg }}>
                  <div style={{ width: 72, height: 72, borderRadius: 18, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>💬</div>
                  <div className="serif" style={{ fontSize: 20, color: T.textSecondary }}>CSC Shambhuganj Admin</div>
                  <div style={{ fontSize: 13, color: T.textMuted }}>Select a chat to view messages</div>
                </div>
              )}
            </>
          )}

          {/* ──────────────────────────────────────────────────
            TEAM TAB
        ────────────────────────────────────────────────── */}
          {activeTab === "team" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "28px", background: T.pageBg }}>
              <div style={{ maxWidth: 1150, margin: "0 auto" }}>
                {/* Header card */}
                <div className="card" style={{ marginBottom: 22 }}>
                  <SecHdr icon="👥" label="Team & User Management" />
                  <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <p style={{ color: T.textSecondary, fontSize: 13 }}>Manage roles and system access for all registered users</p>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                      <input value={teamSearch} onChange={e => setTeamSearch(e.target.value)} placeholder="Search name or mobile…" className="inp" style={{ paddingLeft: 33, width: 260 }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 16 }}>
                  {teamMembers
                    .filter(u => !teamSearch || u.name?.toLowerCase().includes(teamSearch.toLowerCase()) || u.mobile?.includes(teamSearch))
                    .map(user => (
                      <div key={user.id} className="tcard" style={{ borderColor: user.role === "main_admin" ? T.accent : user.role === "co_admin" ? T.accentBorder : T.teamCardBorder }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
                          <Avatar name={user.name} size={50} role={user.role} isDark={isDark} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: T.textPrimary, marginBottom: 4 }}>{user.name || "Unknown"}</div>
                            <div className="mono" style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".08em", color: user.role === "main_admin" ? T.accent : user.role === "co_admin" ? "#2563eb" : T.textMuted }}>
                              {user.role === "main_admin" ? "🏛️ MAIN ADMIN" : user.role === "co_admin" ? "🛡️ CO-ADMIN" : "👤 CITIZEN"}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 16, padding: "8px 12px", background: T.inputBg, borderRadius: 7, border: `1px solid ${T.inputBorder}` }}>
                          <span className="mono">{user.mobile}</span>
                        </div>
                        {/* ✨ ADD THIS CERTIFICATE BUTTON */}
                        <button
                          className="btn btn-g"
                          style={{ width: "100%", justifyContent: "center", marginBottom: isMainAdmin && user.id !== currentUser?.id ? 10 : 0 }}
                          onClick={() => setCertUser(user)}
                        >
                          🎓 Issue Certificate
                        </button>
                        {isMainAdmin && user.id !== currentUser?.id && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <select className="inp" style={{ flex: 1, padding: "8px 11px", fontSize: 13 }} value={user.role} onChange={e => updateRole(user.id, e.target.value as UserRole)}>
                              <option value="user">Citizen (User)</option>
                              <option value="co_admin">Co-Admin</option>
                              <option value="main_admin">Main Admin</option>
                            </select>
                            {user.role !== "user" && <button className="btn btn-d" style={{ padding: "8px 11px" }} onClick={() => removeCoAdmin(user.id)} title="Revoke"><Ico.X /></button>}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════
          CERTIFICATE GENERATOR MODAL
      ════════════════════════════════════════════════════════ */}
        {certUser && (
          <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setCertUser(null); }}>
            <div className="modal-bx" style={{ maxWidth: 500, padding: 0, overflow: "hidden", background: T.modalBg }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${T.divider}`, background: T.sidebarHeaderBg }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.textPrimary }}>🎓 Certificate Center</div>
                <button onClick={() => setCertUser(null)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}><Ico.X /></button>
              </div>
              <div style={{ padding: 20 }}>
                {/* Renders the tool targeting the selected user */}
                <CertificateGenerator targetUserId={certUser.id} targetUserName={certUser.name || "Student"} isDark={isDark} />            </div>
            </div>
          </div>
        )}



        {/* ════════════════════════════════════════════════════════
          BULK EXCEL UPLOAD MODAL
      ════════════════════════════════════════════════════════ */}
        {showBulkUpload && (
          <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowBulkUpload(false); }}>
            <div className="modal-bx" style={{ maxWidth: 900, maxHeight: "90vh", overflow: "auto", padding: 0, background: T.modalBg }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${T.divider}`, background: T.sidebarHeaderBg }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.textPrimary }}>📊 Bulk Certificate Upload</div>
                <button onClick={() => setShowBulkUpload(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}><Ico.X /></button>
              </div>
              <div style={{ padding: 24 }}>
                <BulkCertificateGenerator isDark={isDark} />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════ */}

        {/* New Chat */}
        {showNewChat && (
          <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowNewChat(false); }}>
            <div className="modal-bx" style={{ maxWidth: 420 }}>
              <div style={modalHdrStyle}>
                <div style={modalHdrTitle}>💬 New Chat</div>
                <button onClick={() => setShowNewChat(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}><Ico.X /></button>
              </div>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ position: "relative", marginBottom: 14 }}>
                  <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                  <input value={userSearchQ} onChange={e => setUserSearchQ(e.target.value)} placeholder="Search by name or mobile…" className="inp" style={{ paddingLeft: 33 }} autoFocus />
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {userSearchResults.map(u => (
                    <div key={u.id} onClick={() => startNewChat(u)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 9, cursor: "pointer", transition: "background .15s", marginBottom: 3 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.accentLight; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <Avatar name={u.name} size={38} isDark={isDark} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{u.name || "Unknown"}</div>
                        <div className="mono" style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{u.mobile}</div>
                      </div>
                    </div>
                  ))}
                  {dUserSearch.length > 2 && !userSearchResults.length && <div style={{ padding: 22, textAlign: "center", color: T.textMuted, fontSize: 13 }}>No users found.</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Agent Search Modal */}
        {showDeliverySearch && (
          <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowDeliverySearch(false); }}>
            <div className="modal-bx" style={{ maxWidth: 460 }}>
              <div style={modalHdrStyle}>
                <div style={modalHdrTitle}>🛵 Assign Delivery Agent</div>
                <button onClick={() => setShowDeliverySearch(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}><Ico.X /></button>
              </div>

              <div style={{ padding: "18px 22px" }}>
                <div style={{ position: "relative", marginBottom: 14 }}>
                  <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                  <input value={userSearchQ} onChange={e => setUserSearchQ(e.target.value)} placeholder="Search agent by name or mobile…" className="inp" style={{ paddingLeft: 33 }} autoFocus />
                </div>

                <div style={{ maxHeight: 350, overflowY: "auto", paddingRight: 4 }}>
                  {(() => {
                    // ✨ Determine which list to show based on search input
                    const displayUsers = userSearchQ.length > 2
                      ? userSearchResults
                      : teamMembers.filter(u => !userSearchQ || u.name?.toLowerCase().includes(userSearchQ.toLowerCase()) || u.mobile?.includes(userSearchQ));

                    // ✨ "Not Found" State
                    if (displayUsers.length === 0) {
                      return (
                        <div style={{ padding: "30px 20px", textAlign: "center", color: T.textMuted }}>
                          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary }}>No users found</div>
                          <div style={{ fontSize: 13, marginTop: 4 }}>We couldn't find anyone matching "{userSearchQ}"</div>
                        </div>
                      );
                    }

                    // ✨ Render User List with Roles
                    return displayUsers.map(u => (
                      <div key={u.id} onClick={() => assignDeliveryAgent(u)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", borderRadius: 9, cursor: "pointer", transition: "all .15s", marginBottom: 6, border: `1px solid ${T.divider}` }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.accentLight; (e.currentTarget as HTMLElement).style.borderColor = T.accentBorder; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = T.divider; }}>

                        <Avatar name={u.name} size={42} role={u.role} isDark={isDark} />

                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary }}>{u.name || "Unknown User"}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <div className="mono" style={{ fontSize: 11, color: T.textSecondary }}>{u.mobile || "No Mobile"}</div>

                            {/* ✨ Show Exact Roles clearly */}
                            <div className="mono" style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".05em", color: u.role === "main_admin" ? T.accent : u.role === "co_admin" ? "#2563eb" : T.textMuted }}>
                              {u.role === "main_admin" ? "🏛️ MAIN ADMIN" : u.role === "co_admin" ? "🛡️ CO-ADMIN" : "👤 CITIZEN"}
                            </div>
                          </div>
                        </div>

                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign */}
        {showAssign && (
          <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowAssign(false); }}>
            <div className="modal-bx" style={{ maxWidth: 380 }}>
              <div style={modalHdrStyle}>
                <div style={modalHdrTitle}>👥 Assign Operator</div>
                <button onClick={() => setShowAssign(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}><Ico.X /></button>
              </div>
              <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 7 }}>
                {teamMembers.filter(m => m.role !== "user").map(op => (
                  <div key={op.id} onClick={() => assignTo(op.id, op.name || "")}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 9, cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.accentLight; (e.currentTarget as HTMLElement).style.borderColor = T.accentBorder; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.inputBg; (e.currentTarget as HTMLElement).style.borderColor = T.inputBorder; }}>
                    <Avatar name={op.name} size={36} role={op.role} isDark={isDark} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.textPrimary }}>{op.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: op.role === "main_admin" ? T.accent : "#2563eb", marginTop: 2 }}>{op.role.replace("_", " ").toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resolve */}
        {showMarkDone && selectedReq && (
          <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowMarkDone(false); }}>
            <div className="modal-bx" style={{ maxWidth: 360, textAlign: "center", padding: "44px 30px" }}>
              <div style={{ fontSize: 52, marginBottom: 18 }}>✅</div>
              <div className="serif" style={{ fontSize: 22, color: T.textPrimary, marginBottom: 8 }}>Mark as Resolved?</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 28, lineHeight: 1.6 }}>The citizen will be notified that their request is complete.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-s" style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: 14 }} onClick={() => changeStatus("done")}>Yes, Resolve</button>
                <button className="btn btn-g" style={{ padding: "12px 20px" }} onClick={() => setShowMarkDone(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </AuthGuard>
  );
}