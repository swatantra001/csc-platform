// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// // ── Theme (matches your existing verify page) ──
// const THEMES = {
//   light: {
//     pageBg: "#f1f5f9",
//     navBg: "#1e3a8a",
//     navBottomBorder: "#3b82f6",
//     navBrand: "#ffffff",
//     navBrandAccent: "#93c5fd",
//     textPrimary: "#1e293b",
//     textSecondary: "#475569",
//     textMuted: "#94a3b8",
//     accent: "#2563eb",
//     accentHover: "#1d4ed8",
//     accentLight: "#eff6ff",
//     accentBorder: "#bfdbfe",
//     cardBg: "#ffffff",
//     cardBorder: "#e2e8f0",
//     cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
//     inputBg: "#f8fafc",
//     inputBorder: "#e2e8f0",
//     inputFocusBorder: "#3b82f6",
//     inputText: "#1e293b",
//     inputPlaceholder: "#94a3b8",
//     divider: "#e2e8f0",
//     btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)",
//     btnPrimaryText: "#ffffff",
//     btnGhostBg: "#f1f5f9",
//     btnGhostBorder: "#e2e8f0",
//     btnGhostText: "#475569",
//     btnGhostHoverBg: "#eff6ff",
//     btnGhostHoverText: "#2563eb",
//     modalOverlay: "rgba(15,23,42,0.55)",
//   },
//   dark: {
//     pageBg: "#060b14",
//     navBg: "rgba(6,11,20,0.98)",
//     navBottomBorder: "#f59e0b",
//     navBrand: "#ffffff",
//     navBrandAccent: "#f59e0b",
//     textPrimary: "#f1f5f9",
//     textSecondary: "rgba(255,255,255,0.55)",
//     textMuted: "rgba(255,255,255,0.28)",
//     accent: "#f59e0b",
//     accentHover: "#d97706",
//     accentLight: "rgba(245,158,11,0.08)",
//     accentBorder: "rgba(245,158,11,0.25)",
//     cardBg: "rgba(255,255,255,0.03)",
//     cardBorder: "rgba(255,255,255,0.08)",
//     cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
//     inputBg: "rgba(255,255,255,0.05)",
//     inputBorder: "rgba(255,255,255,0.08)",
//     inputFocusBorder: "rgba(245,158,11,0.5)",
//     inputText: "#f1f5f9",
//     inputPlaceholder: "rgba(255,255,255,0.25)",
//     divider: "rgba(255,255,255,0.06)",
//     btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)",
//     btnPrimaryText: "#000000",
//     btnGhostBg: "rgba(255,255,255,0.05)",
//     btnGhostBorder: "rgba(255,255,255,0.1)",
//     btnGhostText: "rgba(255,255,255,0.7)",
//     btnGhostHoverBg: "rgba(245,158,11,0.1)",
//     btnGhostHoverText: "#f59e0b",
//     modalOverlay: "rgba(0,0,0,0.85)",
//   },
// } as const;

// type ThemeTokens = typeof THEMES.light;

// export default function VerifyLandingPage() {
//   const router = useRouter();
//   const [isDark, setIsDark] = useState(false);
//   const T = isDark ? THEMES.dark : THEMES.light;

//   const [manualId, setManualId] = useState("");
//   const [scanning, setScanning] = useState(false);
//   const [scanError, setScanError] = useState<string | null>(null);
//   const scannerRef = useRef<any>(null);
//   const qrRegionId = "qr-reader-region";

//   useEffect(() => {
//     const saved = localStorage.getItem("csc_theme");
//     if (saved) setIsDark(saved === "dark");
//     else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//   }, []);

//   const toggleTheme = () => {
//     const next = !isDark;
//     setIsDark(next);
//     localStorage.setItem("csc_theme", next ? "dark" : "light");
//   };

//   const stopScan = useCallback(async () => {
//     try {
//       await scannerRef.current?.stop();
//     } catch {}
//     scannerRef.current = null;
//     setScanning(false);
//     setScanError(null);
//   }, []);

//   const startScan = useCallback(async () => {
//     setScanError(null);
//     setScanning(true);
//     try {
//       const { Html5Qrcode } = await import("html5-qrcode");
//       const scanner = new Html5Qrcode(qrRegionId);
//       scannerRef.current = scanner;

//       await scanner.start(
//         { facingMode: "environment" },
//         { fps: 10, qrbox: { width: 250, height: 250 } },
//         (decodedText: string) => {
//           // Extract ID from URL like https://.../verify/CSC-123 or plain CSC-123
//           const match = decodedText.match(/verify\/([^/?\s]+)/);
//           const id = match ? match[1] : decodedText.trim();
//           stopScan();
//           if (id) router.push(`/verify/${id}`);
//         },
//         () => {}
//       );
//     } catch (e: any) {
//       setScanError(e?.message || "Could not start camera");
//       setScanning(false);
//     }
//   }, [router, stopScan]);

//   const handleManualSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const id = manualId.trim().toUpperCase();
//     if (!id) return;
//     router.push(`/verify/${id}`);
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: T.pageBg,
//         color: T.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//         transition: "background .25s, color .25s",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* ── HEADER ── */}
//       <header
//         style={{
//           background: T.navBg,
//           borderBottom: `3px solid ${T.navBottomBorder}`,
//           flexShrink: 0,
//           boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
//         }}
//       >
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
//                 style={{
//                   fontSize: 17,
//                   color: T.navBrand,
//                   letterSpacing: "-0.3px",
//                   lineHeight: 1,
//                   fontFamily: "'DM Serif Display',serif",
//                 }}
//               >
//                 Shrilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div
//                 style={{
//                   fontSize: 9,
//                   color: "rgba(255,255,255,0.35)",
//                   letterSpacing: ".1em",
//                   fontFamily: "'JetBrains Mono',monospace",
//                 }}
//               >
//                 VERIFICATION PORTAL
//               </div>
//             </div>
//           </Link>

//           <div style={{ flex: 1 }} />

//           <button
//             onClick={toggleTheme}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 7,
//               padding: "6px 14px",
//               borderRadius: 20,
//               border: `1.5px solid ${T.accentBorder}`,
//               background: "rgba(255,255,255,0.08)",
//               color: isDark ? "rgba(255,255,255,0.7)" : "#475569",
//               fontSize: 12,
//               fontWeight: 700,
//               cursor: "pointer",
//               fontFamily: "'DM Sans',sans-serif",
//             }}
//           >
//             <span style={{ fontSize: 14 }}>{isDark ? "☀️" : "🌙"}</span>
//             {isDark ? "Light" : "Dark"}
//           </button>
//         </div>
//       </header>

//       {/* ── CONTENT ── */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "40px 20px",
//         }}
//       >
//         <div
//           style={{
//             width: "100%",
//             maxWidth: 480,
//             background: T.cardBg,
//             border: `1px solid ${T.cardBorder}`,
//             borderRadius: 14,
//             boxShadow: T.cardShadow,
//             overflow: "hidden",
//             animation: "pop .35s ease",
//           }}
//         >
//           {/* Top accent bar */}
//           <div
//             style={{
//               height: 4,
//               background: isDark
//                 ? "linear-gradient(90deg,#f59e0b,#d97706)"
//                 : "linear-gradient(90deg,#2563eb,#1d4ed8)",
//             }}
//           />

//           <div style={{ padding: "36px 32px" }}>
//             <h1
//               style={{
//                 fontSize: 24,
//                 fontWeight: 700,
//                 color: T.textPrimary,
//                 marginBottom: 6,
//                 fontFamily: "'DM Serif Display',serif",
//                 textAlign: "center",
//               }}
//             >
//               Verify Certificate
//             </h1>
//             <p
//               style={{
//                 fontSize: 14,
//                 color: T.textSecondary,
//                 textAlign: "center",
//                 marginBottom: 28,
//               }}
//             >
//               Authenticate certificates issued by Srilal Sahaj Janseva Kendra
//             </p>

//             {/* ── Option 1: QR Scan ── */}
//             <div
//               style={{
//                 border: `1px solid ${T.divider}`,
//                 borderRadius: 12,
//                 padding: 20,
//                 marginBottom: 16,
//                 background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: scanning ? 14 : 0,
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 700,
//                       color: T.textPrimary,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                   >
//                     <span style={{ fontSize: 20 }}>📷</span> Scan QR Code
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 12,
//                       color: T.textMuted,
//                       marginTop: 3,
//                     }}
//                   >
//                     Point your camera at the certificate QR
//                   </div>
//                 </div>
//                 {!scanning ? (
//                   <button
//                     onClick={startScan}
//                     style={{
//                       padding: "8px 16px",
//                       borderRadius: 8,
//                       border: "none",
//                       background: T.btnPrimary,
//                       color: T.btnPrimaryText,
//                       fontWeight: 700,
//                       fontSize: 13,
//                       cursor: "pointer",
//                       fontFamily: "'DM Sans',sans-serif",
//                     }}
//                   >
//                     Start Camera
//                   </button>
//                 ) : (
//                   <button
//                     onClick={stopScan}
//                     style={{
//                       padding: "8px 16px",
//                       borderRadius: 8,
//                       border: `1px solid ${T.divider}`,
//                       background: T.btnGhostBg,
//                       color: T.btnGhostText,
//                       fontWeight: 700,
//                       fontSize: 13,
//                       cursor: "pointer",
//                       fontFamily: "'DM Sans',sans-serif",
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>

//               {scanning && (
//                 <div
//                   style={{
//                     borderRadius: 10,
//                     overflow: "hidden",
//                     border: `2px solid ${T.accentBorder}`,
//                   }}
//                 >
//                   <div id={qrRegionId} style={{ width: "100%", minHeight: 300 }} />
//                 </div>
//               )}

//               {scanError && (
//                 <div
//                   style={{
//                     marginTop: 10,
//                     padding: 10,
//                     borderRadius: 8,
//                     background: isDark
//                       ? "rgba(239,68,68,0.12)"
//                       : "#fee2e2",
//                     color: isDark ? "#f87171" : "#dc2626",
//                     fontSize: 13,
//                     fontWeight: 600,
//                   }}
//                 >
//                   ⚠️ {scanError}
//                 </div>
//               )}
//             </div>

//             {/* ── Divider ── */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 margin: "20px 0",
//               }}
//             >
//               <div
//                 style={{ flex: 1, height: 1, background: T.divider }}
//               />
//               <span
//                 style={{
//                   fontSize: 12,
//                   fontWeight: 700,
//                   color: T.textMuted,
//                   textTransform: "uppercase",
//                   letterSpacing: ".08em",
//                 }}
//               >
//                 or
//               </span>
//               <div
//                 style={{ flex: 1, height: 1, background: T.divider }}
//               />
//             </div>

//             {/* ── Option 2: Manual ID ── */}
//             <form onSubmit={handleManualSubmit}>
//               <label
//                 style={{
//                   fontSize: 11,
//                   fontWeight: 800,
//                   color: T.textMuted,
//                   textTransform: "uppercase",
//                   letterSpacing: ".07em",
//                   marginBottom: 8,
//                   display: "block",
//                 }}
//               >
//                 Enter Certificate ID
//               </label>
//               <input
//                 value={manualId}
//                 onChange={(e) => setManualId(e.target.value.toUpperCase())}
//                 placeholder="e.g. CSC-123456-789"
//                 style={{
//                   width: "100%",
//                   padding: "12px 14px",
//                   borderRadius: 8,
//                   background: T.inputBg,
//                   border: `1px solid ${T.inputBorder}`,
//                   color: T.inputText,
//                   fontSize: 14,
//                   outline: "none",
//                   fontFamily: "'JetBrains Mono',monospace",
//                   letterSpacing: "0.03em",
//                   marginBottom: 14,
//                   boxSizing: "border-box",
//                 }}
//                 onFocus={(e) =>
//                   (e.currentTarget.style.borderColor = T.inputFocusBorder)
//                 }
//                 onBlur={(e) =>
//                   (e.currentTarget.style.borderColor = T.inputBorder)
//                 }
//               />
//               <button
//                 type="submit"
//                 disabled={!manualId.trim()}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: 8,
//                   border: "none",
//                   background: T.btnPrimary,
//                   color: T.btnPrimaryText,
//                   fontWeight: 800,
//                   fontSize: 14,
//                   cursor: manualId.trim() ? "pointer" : "not-allowed",
//                   opacity: manualId.trim() ? 1 : 0.5,
//                   fontFamily: "'DM Sans',sans-serif",
//                 }}
//               >
//                 Verify Certificate
//               </button>
//             </form>
//           </div>

//           {/* Footer */}
//           <div
//             style={{
//               padding: "14px 20px",
//               borderTop: `1px solid ${T.divider}`,
//               textAlign: "center",
//               fontSize: 11,
//               fontWeight: 700,
//               color: T.textMuted,
//               letterSpacing: ".05em",
//               textTransform: "uppercase",
//             }}
//           >
//             Secured by Shrilal CSC Verification Network
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
//       `}</style>
//     </div>
//   );
// }









// src/app/verify/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the standing Jan Seva Kendra brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\verify\page.tsx. No new file needed.
//
// KEPT (logic exactly as supplied):
//   - useRouter; manualId state (uppercased on input); scanning / scanError /
//     scannerRef / qrRegionId ("qr-reader-region").
//   - startScan: dynamic import of "html5-qrcode", Html5Qrcode, facingMode
//     "environment", fps 10, qrbox 250x250; on decode the id is extracted with
//     /verify\/([^/?\s]+)/ (or the plain decoded text), then stopScan() and
//     router.push(`/verify/${id}`); on error scanError is set and scanning stops.
//   - stopScan (try/catch around scanner.stop()); handleManualSubmit (trim +
//     uppercase, router.push(`/verify/${id}`)).
//   - Theme state from localStorage "csc_theme", then prefers-color-scheme;
//     toggleTheme writes "csc_theme".
//   - Header brand + theme toggle; card with top accent bar, "Verify
//     Certificate" heading, "Authenticate certificates issued by Srilal Sahaj
//     Janseva Kendra" sub, QR scan option (Start Camera / Cancel, scanner
//     region min-height 300, error box), "or" divider, manual ID form (label,
//     mono input, placeholder "e.g. CSC-123456-789", submit disabled when
//     empty), footer "Secured by Shrilal CSC Verification Network".
//   - Brand text "ShrilalCSC" kept EXACTLY as supplied (see FLAG 1 below).
//
// REMOVED:
//   - The whole THEMES object and ThemeTokens type; every inline style object;
//     the <style> block (pop keyframe); all gradients (brand mark, top accent
//     bar, primary buttons); the Google Fonts / DM Serif / JetBrains Mono
//     styling (system sans + Tailwind font-mono for the ID input).
//   - Emoji used as icons (🏛️ 📷 ⚠️) -> lucide-react (Landmark, QrCode,
//     AlertTriangle, Sun, Moon).
//
// CHANGED (design only):
//   - One accent in both themes (deep blue) via Tailwind dark: classes;
//     navy header #0b2239 in light, #081120 in dark. Added a dark-class sync
//     effect on document.documentElement (needs darkMode: "class" in
//     tailwind.config.js, as with the other app pages).
//   - Plain card: hairline border, solid blue top accent bar, no entrance
//     animation (the pop keyframe is gone; only plain transitions remain).
//
// FLAG 1 (kept as supplied, not silently "fixed"): the brand in this file
//   reads "ShrilalCSC" while every other page reads "SrilalCSC". One of them
//   is a typo — Swatantra's call which spelling is right.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Landmark, Sun, Moon, QrCode, AlertTriangle } from "lucide-react";

export default function VerifyLandingPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  const [manualId, setManualId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const qrRegionId = "qr-reader-region";

  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, []);

  // Sync the `dark` class so Tailwind `dark:` variants apply.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 transition-colors dark:bg-[#0b1220] dark:text-slate-200">
      {/* ── HEADER ── */}
      <header className="shrink-0 border-b-2 border-blue-700 bg-[#0b2239] shadow-sm dark:border-blue-500 dark:bg-[#081120]">
        <div className="flex h-14 items-center gap-3.5 border-b border-white/10 px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-600">
              <Landmark size={17} aria-hidden />
            </span>
            <span>
              <span className="block text-[17px] font-bold leading-none tracking-tight text-white">
                Shrilal<span className="text-blue-300">CSC</span>
              </span>
              <span className="mt-1 block font-mono text-[9px] tracking-[0.1em] text-white/40">
                VERIFICATION PORTAL
              </span>
            </span>
          </Link>

          <div className="flex-1" />

          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-blue-200/40 bg-white/10 px-3.5 py-1.5 !text-xs font-bold text-white/70 transition hover:border-blue-400 hover:text-white"
          >
            {isDark ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[480px] overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111a2e]">
          {/* Top accent bar */}
          <div className="h-1 bg-blue-700 dark:bg-blue-500" aria-hidden />

          <div className="px-8 py-9">
            <h1 className="mb-1.5 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
              Verify Certificate
            </h1>
            <p className="mb-7 text-center text-sm text-slate-600 dark:text-slate-400">
              Authenticate certificates issued by Srilal Sahaj Janseva Kendra
            </p>

            {/* ── Option 1: QR Scan ── */}
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-white/[0.02]">
              <div className={`flex items-center justify-between ${scanning ? "mb-3.5" : ""}`}>
                <div>
                  <div className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-slate-100">
                    <QrCode size={20} aria-hidden className="text-blue-700 dark:text-blue-400" />
                    Scan QR Code
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Point your camera at the certificate QR
                  </div>
                </div>
                {!scanning ? (
                  <button
                    onClick={startScan}
                    className="shrink-0 cursor-pointer rounded-lg border-none bg-blue-700 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    Start Camera
                  </button>
                ) : (
                  <button
                    onClick={stopScan}
                    className="shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-[13px] font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-white/5 dark:text-slate-300 dark:hover:text-blue-400"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {scanning && (
                <div className="overflow-hidden rounded-[10px] border-2 border-blue-200 dark:border-blue-500/40">
                  <div id={qrRegionId} className="min-h-[300px] w-full" />
                </div>
              )}

              {scanError && (
                <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-red-50 px-2.5 py-2.5 text-[13px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertTriangle size={16} aria-hidden className="mt-0.5 shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}
            </div>

            {/* ── Divider ── */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                or
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* ── Option 2: Manual ID ── */}
            <form onSubmit={handleManualSubmit}>
              <label
                htmlFor="certificate-id"
                className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.07em] text-slate-500 dark:text-slate-400"
              >
                Enter Certificate ID
              </label>
              <input
                id="certificate-id"
                value={manualId}
                onChange={(e) => setManualId(e.target.value.toUpperCase())}
                placeholder="e.g. CSC-123456-789"
                className="mb-3.5 w-full box-border rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 font-mono text-sm tracking-[0.03em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100 dark:focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!manualId.trim()}
                className="w-full cursor-pointer rounded-lg border-none bg-blue-700 px-3 py-3 text-sm font-extrabold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Verify Certificate
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400 dark:border-slate-800 dark:text-slate-500">
            Secured by Shrilal CSC Verification Network
          </div>
        </div>
      </div>
    </div>
  );
}
