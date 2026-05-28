"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Theme (matches your existing verify page) ──
const THEMES = {
  light: {
    pageBg: "#f1f5f9",
    navBg: "#1e3a8a",
    navBottomBorder: "#3b82f6",
    navBrand: "#ffffff",
    navBrandAccent: "#93c5fd",
    textPrimary: "#1e293b",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentLight: "#eff6ff",
    accentBorder: "#bfdbfe",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputFocusBorder: "#3b82f6",
    inputText: "#1e293b",
    inputPlaceholder: "#94a3b8",
    divider: "#e2e8f0",
    btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    btnPrimaryText: "#ffffff",
    btnGhostBg: "#f1f5f9",
    btnGhostBorder: "#e2e8f0",
    btnGhostText: "#475569",
    btnGhostHoverBg: "#eff6ff",
    btnGhostHoverText: "#2563eb",
    modalOverlay: "rgba(15,23,42,0.55)",
  },
  dark: {
    pageBg: "#060b14",
    navBg: "rgba(6,11,20,0.98)",
    navBottomBorder: "#f59e0b",
    navBrand: "#ffffff",
    navBrandAccent: "#f59e0b",
    textPrimary: "#f1f5f9",
    textSecondary: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.28)",
    accent: "#f59e0b",
    accentHover: "#d97706",
    accentLight: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.08)",
    inputFocusBorder: "rgba(245,158,11,0.5)",
    inputText: "#f1f5f9",
    inputPlaceholder: "rgba(255,255,255,0.25)",
    divider: "rgba(255,255,255,0.06)",
    btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)",
    btnPrimaryText: "#000000",
    btnGhostBg: "rgba(255,255,255,0.05)",
    btnGhostBorder: "rgba(255,255,255,0.1)",
    btnGhostText: "rgba(255,255,255,0.7)",
    btnGhostHoverBg: "rgba(245,158,11,0.1)",
    btnGhostHoverText: "#f59e0b",
    modalOverlay: "rgba(0,0,0,0.85)",
  },
} as const;

type ThemeTokens = typeof THEMES.light;

export default function VerifyLandingPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES.dark : THEMES.light;

  const [manualId, setManualId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const qrRegionId = "qr-reader-region";

  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("csc_theme", next ? "dark" : "light");
  };

  const stopScan = useCallback(async () => {
    try {
      await scannerRef.current?.stop();
    } catch {}
    scannerRef.current = null;
    setScanning(false);
    setScanError(null);
  }, []);

  const startScan = useCallback(async () => {
    setScanError(null);
    setScanning(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(qrRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          // Extract ID from URL like https://.../verify/CSC-123 or plain CSC-123
          const match = decodedText.match(/verify\/([^/?\s]+)/);
          const id = match ? match[1] : decodedText.trim();
          stopScan();
          if (id) router.push(`/verify/${id}`);
        },
        () => {}
      );
    } catch (e: any) {
      setScanError(e?.message || "Could not start camera");
      setScanning(false);
    }
  }, [router, stopScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = manualId.trim().toUpperCase();
    if (!id) return;
    router.push(`/verify/${id}`);
  };

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
      {/* ── HEADER ── */}
      <header
        style={{
          background: T.navBg,
          borderBottom: `3px solid ${T.navBottomBorder}`,
          flexShrink: 0,
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
                style={{
                  fontSize: 17,
                  color: T.navBrand,
                  letterSpacing: "-0.3px",
                  lineHeight: 1,
                  fontFamily: "'DM Serif Display',serif",
                }}
              >
                Shrilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: ".1em",
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                VERIFICATION PORTAL
              </div>
            </div>
          </Link>

          <div style={{ flex: 1 }} />

          <button
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 14px",
              borderRadius: 20,
              border: `1.5px solid ${T.accentBorder}`,
              background: "rgba(255,255,255,0.08)",
              color: isDark ? "rgba(255,255,255,0.7)" : "#475569",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <span style={{ fontSize: 14 }}>{isDark ? "☀️" : "🌙"}</span>
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: T.cardBg,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: 14,
            boxShadow: T.cardShadow,
            overflow: "hidden",
            animation: "pop .35s ease",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              height: 4,
              background: isDark
                ? "linear-gradient(90deg,#f59e0b,#d97706)"
                : "linear-gradient(90deg,#2563eb,#1d4ed8)",
            }}
          />

          <div style={{ padding: "36px 32px" }}>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: T.textPrimary,
                marginBottom: 6,
                fontFamily: "'DM Serif Display',serif",
                textAlign: "center",
              }}
            >
              Verify Certificate
            </h1>
            <p
              style={{
                fontSize: 14,
                color: T.textSecondary,
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              Authenticate certificates issued by Srilal Sahaj Janseva Kendra
            </p>

            {/* ── Option 1: QR Scan ── */}
            <div
              style={{
                border: `1px solid ${T.divider}`,
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
                background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: scanning ? 14 : 0,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.textPrimary,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>📷</span> Scan QR Code
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.textMuted,
                      marginTop: 3,
                    }}
                  >
                    Point your camera at the certificate QR
                  </div>
                </div>
                {!scanning ? (
                  <button
                    onClick={startScan}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: T.btnPrimary,
                      color: T.btnPrimaryText,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Start Camera
                  </button>
                ) : (
                  <button
                    onClick={stopScan}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: `1px solid ${T.divider}`,
                      background: T.btnGhostBg,
                      color: T.btnGhostText,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {scanning && (
                <div
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    border: `2px solid ${T.accentBorder}`,
                  }}
                >
                  <div id={qrRegionId} style={{ width: "100%", minHeight: 300 }} />
                </div>
              )}

              {scanError && (
                <div
                  style={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 8,
                    background: isDark
                      ? "rgba(239,68,68,0.12)"
                      : "#fee2e2",
                    color: isDark ? "#f87171" : "#dc2626",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  ⚠️ {scanError}
                </div>
              )}
            </div>

            {/* ── Divider ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "20px 0",
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: T.divider }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                or
              </span>
              <div
                style={{ flex: 1, height: 1, background: T.divider }}
              />
            </div>

            {/* ── Option 2: Manual ID ── */}
            <form onSubmit={handleManualSubmit}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Enter Certificate ID
              </label>
              <input
                value={manualId}
                onChange={(e) => setManualId(e.target.value.toUpperCase())}
                placeholder="e.g. CSC-123456-789"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: T.inputBg,
                  border: `1px solid ${T.inputBorder}`,
                  color: T.inputText,
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: "0.03em",
                  marginBottom: 14,
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = T.inputFocusBorder)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = T.inputBorder)
                }
              />
              <button
                type="submit"
                disabled={!manualId.trim()}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "none",
                  background: T.btnPrimary,
                  color: T.btnPrimaryText,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: manualId.trim() ? "pointer" : "not-allowed",
                  opacity: manualId.trim() ? 1 : 0.5,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Verify Certificate
              </button>
            </form>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "14px 20px",
              borderTop: `1px solid ${T.divider}`,
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: ".05em",
              textTransform: "uppercase",
            }}
          >
            Secured by Shrilal CSC Verification Network
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
      `}</style>
    </div>
  );
}