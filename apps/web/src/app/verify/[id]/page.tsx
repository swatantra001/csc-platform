
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { verifyCertificateAction } from "@/app/actions/certificates";

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════
type UserRole = "user" | "co_admin" | "main_admin";

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS — Exact reference match
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

    chatBg: "#f1f5f9",
    chatPattern: "radial-gradient(#2563eb14 1px,transparent 1px)",

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

    chatBg: "#080d17",
    chatPattern: "radial-gradient(rgba(245,158,11,0.018) 1px,transparent 1px)",

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
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
];

// ════════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════════
const Ico = {
  Search: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  ),
  X: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Download: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Alert: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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
// CSS GENERATOR
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

.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;
  font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;
  font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}

.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

@keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
`;
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function VerifyCertificatePage() {
  const params = useParams();
  const { user } = useAuth();

  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES.dark : THEMES.light;

  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certIdDisplay, setCertIdDisplay] = useState<string>("UNKNOWN");

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    localStorage.setItem("csc_theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Fetch certificate
  useEffect(() => {
    const fetchCert = async () => {
      const rawCertId =
        params?.id || params?.certId || params?.slug || params?.certNumber;
      const certId = rawCertId ? (rawCertId as string).toUpperCase() : null;
      setCertIdDisplay(certId || "UNKNOWN");

      if (!certId) {
        setLoading(false);
        return;
      }

      try {
        const data = await verifyCertificateAction(certId);
        setCert(data);
      } catch (e) {
        console.error(e);
        setCert(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [params]);

  const isVerified = !!cert;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.pageBg,
        color: T.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
        transition: "background .25s, color .25s",
        display: "flex",
        flexDirection: "column",
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
                VERIFICATION PORTAL
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
                {user?.name || "Guest"}
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
                {(user?.role || "PUBLIC")
                  .toString()
                  .replace("_", " ")
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          VERIFICATION CONTENT
      ════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          backgroundImage: T.chatPattern,
          backgroundSize: "28px 28px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                border: `3px solid ${T.divider}`,
                borderTopColor: T.accent,
                borderRadius: "50%",
                animation: "spin .7s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <div style={{ color: T.textMuted, fontSize: 14, fontWeight: 600 }}>
              Verifying certificate…
            </div>
          </div>
        ) : (
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 520,
              animation: "pop .35s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                height: 4,
                background: isVerified
                  ? isDark
                    ? "linear-gradient(90deg,#10b981,#059669)"
                    : "linear-gradient(90deg,#16a34a,#15803d)"
                  : isDark
                    ? "linear-gradient(90deg,#ef4444,#dc2626)"
                    : "linear-gradient(90deg,#f87171,#dc2626)",
              }}
            />

            <div style={{ padding: "40px 36px", textAlign: "center" }}>
              {/* Status Icon */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  background: isVerified
                    ? isDark
                      ? "rgba(16,185,129,0.12)"
                      : "#dcfce7"
                    : isDark
                      ? "rgba(239,68,68,0.12)"
                      : "#fee2e2",
                  border: `2px solid ${
                    isVerified
                      ? isDark
                        ? "rgba(16,185,129,0.3)"
                        : "#86efac"
                      : isDark
                        ? "rgba(239,68,68,0.3)"
                        : "#fecaca"
                  }`,
                  color: isVerified
                    ? isDark
                      ? "#34d399"
                      : "#15803d"
                    : isDark
                      ? "#f87171"
                      : "#dc2626",
                  transition: "all .3s",
                }}
              >
                {isVerified ? "✅" : "❌"}
              </div>

              {/* Title */}
              <h1
                className="serif"
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: T.textPrimary,
                  marginBottom: 10,
                  letterSpacing: "-0.5px",
                }}
              >
                {isVerified ? "Certificate Verified" : "Invalid Certificate"}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isVerified
                    ? isDark
                      ? "#34d399"
                      : "#15803d"
                    : isDark
                      ? "#f87171"
                      : "#dc2626",
                  marginBottom: 32,
                  maxWidth: 380,
                  marginLeft: "auto",
                  marginRight: "auto",
                  lineHeight: 1.5,
                }}
              >
                {isVerified
                  ? "This document is authentic and registered in our database."
                  : `We could not find a certificate matching the ID: ${certIdDisplay}. It may be forged or entered incorrectly.`}
              </p>

              {isVerified && (
                <>
                  {/* Details Card */}
                  <div
                    style={{
                      background: T.inputBg,
                      borderRadius: 12,
                      border: `1px solid ${T.inputBorder}`,
                      textAlign: "left",
                      overflow: "hidden",
                      marginBottom: 28,
                    }}
                  >
                    {[
                      {
                        label: "Issued To",
                        value: cert.student_name,
                        mono: false,
                      },
                      {
                        label: "Course",
                        value: cert.course_name,
                        mono: false,
                      },
                      {
                        label: "Issue Date",
                        value: new Date(cert.issue_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        ),
                        mono: false,
                      },
                      {
                        label: "Certificate ID",
                        value: cert.certificate_number,
                        mono: true,
                        accent: true,
                      },
                    ].map((row, i, arr) => (
                      <div
                        key={row.label}
                        style={{
                          padding: "16px 20px",
                          borderBottom:
                            i < arr.length - 1
                              ? `1px solid ${T.divider}`
                              : "none",
                          transition: "background .15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            isDark
                              ? "rgba(255,255,255,0.02)"
                              : "rgba(241,245,249,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: T.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: ".08em",
                            marginBottom: 5,
                          }}
                        >
                          {row.label}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: row.accent ? T.accent : T.textPrimary,
                            fontFamily: row.mono
                              ? "'JetBrains Mono', monospace"
                              : "'DM Sans', sans-serif",
                            letterSpacing: row.mono ? "0.02em" : "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {row.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View PDF Button */}
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", display: "inline-block" }}
                  >
                    <button className="btn btn-p" style={{ padding: "12px 28px", fontSize: 14 }}>
                      <Ico.Download /> View Original PDF
                    </button>
                  </a>
                </>
              )}

              {!isVerified && (
                <div style={{ marginTop: 8 }}>
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <button className="btn btn-g">← Back to Home</button>
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom security footer */}
            <div
              style={{
                padding: "14px 20px",
                background: T.sidebarHeaderBg,
                borderTop: `1px solid ${T.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: 700,
                color: T.textMuted,
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ fontSize: 13 }}>
                {isVerified ? <Ico.Shield /> : <Ico.Alert />}
              </span>
              {isVerified
                ? "Secured by Shrilal CSC Blockchain"
                : "Verification failed — document not found"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}