
// "use client";
// import { useAuth } from "@/components/AuthProvider";
// import { useState, useEffect, useMemo } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Transaction {
//   id: string;
//   txId: string;
//   type: "credit" | "debit";
//   amount: string;
//   category: string;
//   operator: string;
//   senderName: string;
//   receiverName: string;
//   date: string;
//   time: string;
//   flags: any[];
// }

// interface HourlyData {
//   hour: string;
//   credit: number;
//   debit: number;
//   count: number;
// }

// function fmt(n: number): string { return n.toLocaleString("en-IN"); }
// function fmtShort(n: number): string { 
//   if(n >= 100000) return `₹${(n/100000).toFixed(1)}L`; 
//   if(n >= 1000) return `₹${(n/1000).toFixed(1)}K`; 
//   return `₹${n}`; 
// }

// // ─── THEME TOKENS (Exact from Reference) ──────────────────────────────────────
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
//     pillBg:            "#f1f5f9",
//     pillBorder:        "#e2e8f0",
//     pillText:          "#64748b",
//     pillActiveBg:      "#dbeafe",
//     pillActiveBorder:  "#93c5fd",
//     pillActiveText:    "#1d4ed8",
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
//     toggleIcon:        "🌙",
//     toggleLabel:       "Dark",
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
//     pillBg:            "rgba(255,255,255,0.03)",
//     pillBorder:        "rgba(255,255,255,0.08)",
//     pillText:          "rgba(255,255,255,0.4)",
//     pillActiveBg:      "rgba(245,158,11,0.15)",
//     pillActiveBorder:  "rgba(245,158,11,0.4)",
//     pillActiveText:    "#f59e0b",
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
//     toggleIcon:        "☀️",
//     toggleLabel:       "Light",
//   },
// } as const;

// type ThemeTokens = typeof THEMES.light;

// // ─── ICONS ────────────────────────────────────────────────────────────────────
// const Ico = {
//   Search:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
//   X:        () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
//   Check:    () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
//   Download: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
// };

// // ─── AVATAR ────────────────────────────────────────────────────────────────────
// function Avatar({ name, size = 40, isDark }: { name?: string | null; size?: number; isDark: boolean }) {
//   const ch = name?.charAt(0).toUpperCase() || "?";
//   const grad = isDark ? "linear-gradient(135deg,#334155,#1e293b)" : "linear-gradient(135deg,#64748b,#475569)";
//   return (
//     <div style={{ width: size, height: size, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.18)" }}>
//       {ch}
//     </div>
//   );
// }

// // ─── NAV LINKS ───────────────────────────────────────────────────────────────
// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
// ];

// // ─── SECTION HEADER ──────────────────────────────────────────────────────────
// function SecHdr({ icon, label }: { icon: string; label: string }) {
//   return (
//     <div className="sec-hdr">
//       <span style={{ fontSize: "1.05rem" }}>{icon}</span>
//       <span className="sec-hdr-txt">{label}</span>
//     </div>
//   );
// }

// // ─── CSS BUILDER ───────────────────────────────────────────────────────────────
// function buildCss(T: ThemeTokens): string {
//   return `
// @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
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
// .top-nav-link.on{background:${T.navActiveBg};color:${T.navActiveText};border-color:transparent;}

// /* ── SECTION TABS ── */
// .sec-tab{
//   display:flex;flex-direction:column;align-items:center;gap:4px;
//   padding:10px 22px;cursor:pointer;background:transparent;border:none;
//   border-bottom:2px solid transparent;color:${T.subTabText};
//   font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
//   transition:all .15s;font-family:'DM Sans',sans-serif;
// }
// .sec-tab.on{color:${T.subTabActive};border-bottom-color:${T.subTabBorder};}
// .sec-tab:hover:not(.on){color:${T.textSecondary};}

// /* ── CARD ── */
// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};margin-bottom:16px;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}
// .sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
// .sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

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

// /* ── FILTER CHIP / PILL ── */
// .pill{
//   padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
//   cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
//   background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
// }
// .pill:hover{border-color:${T.accent};color:${T.accent};}
// .pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

// /* ── TABLE ── */
// .data-table{width:100%;border-collapse:collapse;font-size:0.82rem;}
// .data-table th{background:${T.accentLight};color:${T.accent};font-weight:700;padding:10px 14px;text-align:left;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.4px;border-bottom:2px solid ${T.accentBorder};}
// .data-table td{padding:10px 14px;border-bottom:1px solid ${T.divider};color:${T.textSecondary};vertical-align:middle;}
// .data-table tr:last-child td{border-bottom:none;}
// .data-table tr:hover td{background:${T.rowHover};}
// .tx-row{cursor:pointer;transition:background 0.1s;}
// .tx-row.flagged td:first-child{border-left:3px solid #dc2626;}

// /* ── PROGRESS ── */
// .progress-track{height:6px;background:${T.divider};border-radius:3px;overflow:hidden;}
// .progress-fill{height:100%;background:${T.accent};border-radius:3px;animation:barGrow 1s cubic-bezier(0.16,1,0.3,1) both;transform-origin:left;}

// /* ── KPI ── */
// .kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px;}
// .kpi-card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;padding:20px;position:relative;overflow:hidden;transition:all 0.2s;box-shadow:${T.cardShadow};animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;}
// .kpi-card:hover{transform:translateY(-2px);border-color:${T.accentBorder};box-shadow:0 8px 24px rgba(0,0,0,0.08);}
// .kpi-label{font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${T.textMuted};margin-bottom:8px;font-family:'DM Sans',sans-serif;}
// .kpi-val{font-family:'DM Serif Display',serif;font-size:1.8rem;font-weight:700;line-height:1;margin-bottom:4px;letter-spacing:-0.02em;}
// .kpi-sub{font-size:0.75rem;color:${T.textSecondary};font-weight:500;}

// /* ── OPERATOR CARD ── */
// .op-card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;padding:20px;margin-bottom:12px;animation:fadeUp 0.4s ease both;transition:all 0.2s;}
// .op-card:hover{border-color:${T.accentBorder};box-shadow:0 4px 12px rgba(0,0,0,0.06);}
// .op-stat-box{background:${T.inputBg};border-radius:8px;padding:12px;text-align:center;border:1px solid ${T.inputBorder};}

// /* ── DRAWER ── */
// .drawer-overlay{position:fixed;inset:0;background:${T.modalOverlay};z-index:199;backdrop-filter:blur(2px);}
// .detail-drawer{position:fixed;right:0;top:0;bottom:0;width:360px;background:${T.modalBg};border-left:1px solid ${T.modalBorder};z-index:200;display:flex;flex-direction:column;animation:fadeUp 0.3s ease;box-shadow:-10px 0 30px rgba(0,0,0,0.2);}

// /* ── THEME TOGGLE ── */
// .tog{
//   display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
//   border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
//   color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
//   transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
// }
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

// /* ── ANIMS ── */
// @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
// @keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
// @keyframes drawLine{to{stroke-dashoffset:0}}
// @keyframes drawDonut{to{stroke-dashoffset:0}}
// @keyframes spin{to{transform:rotate(360deg)}}
// `;
// }

// // ─── Charts (Preserved Logic, Theme-Aware) ───────────────────────────────────
// function BarChart({ data, maxVal, color, height = 140, isDark }: { data: HourlyData[], maxVal: number, color: string, height?: number, isDark: boolean }) {
//   const w = 580; const bw = Math.floor(w / data.length) - 8;
//   const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
//   const textColor = isDark ? "rgba(255,255,255,0.4)" : "#64748b";

//   return (
//     <svg viewBox={`0 0 ${w} ${height + 30}`} style={{ width:"100%", overflow:"visible" }}>
//       <defs>
//         <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={color} stopOpacity="0.9" />
//           <stop offset="100%" stopColor={color} stopOpacity="0.2" />
//         </linearGradient>
//       </defs>
//       {[0.25, 0.5, 0.75, 1].map(f => (
//         <line key={f} x1={0} y1={height * (1 - f)} x2={w} y2={height * (1 - f)} stroke={gridColor} strokeWidth="1" strokeDasharray="4,4" />
//       ))}
//       {data.map((d: HourlyData, i: number) => {
//         const x = i * (w / data.length) + 4;
//         const ch = maxVal === 0 ? 0 : Math.max(2, Math.round((d.credit / maxVal) * height));
//         const dh = maxVal === 0 ? 0 : Math.max(2, Math.round((d.debit  / maxVal) * height));
//         return (
//           <g key={i}>
//             <rect x={x} y={height - ch} width={bw * 0.45} height={ch} fill="url(#barGrad)" rx="3" 
//                   style={{ transformOrigin: "bottom", animation: `barGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s both` }} />
//             <rect x={x + bw * 0.55} y={height - dh} width={bw * 0.45} height={dh} fill={gridColor} rx="3" 
//                   style={{ transformOrigin: "bottom", animation: `barGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04 + 0.1}s both` }} />
//             <text x={x + bw/2} y={height + 20} textAnchor="middle" fontSize="10" fill={textColor} fontFamily="'DM Sans',sans-serif">
//               {d.hour.slice(0,5)}
//             </text>
//           </g>
//         );
//       })}
//     </svg>
//   );
// }

// function LineChart({ data, color, height = 90, isDark }: { data: HourlyData[], color: string, height?: number, isDark: boolean }) {
//   const w = 580;
//   const maxCount = Math.max(...data.map(d => d.count), 1);
//   const pts = data.map((d: HourlyData, i: number) => ({ x: (i / (data.length - 1)) * w, y: height - (d.count / maxCount) * height * 0.85 - 5 }));

//   const path = pts.reduce((acc, p, i, a) => {
//     if (i === 0) return `M ${p.x},${p.y}`;
//     const cp1x = a[i - 1].x + (p.x - a[i - 1].x) / 2;
//     return `${acc} C ${cp1x},${a[i - 1].y} ${cp1x},${p.y} ${p.x},${p.y}`;
//   }, "");

//   const area = `${path} L${w},${height} L0,${height} Z`;

//   return (
//     <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", overflow: "visible" }}>
//       <defs>
//         <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={color} stopOpacity="0.15" />
//           <stop offset="100%" stopColor={color} stopOpacity="0" />
//         </linearGradient>
//       </defs>
//       <path d={area} fill="url(#lineAreaGrad)" style={{ animation: "fadeUp 1.5s ease-out forwards" }} />
//       <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
//             strokeDasharray="2000" strokeDashoffset="2000" style={{ animation: "drawLine 2s ease-in-out forwards" }} />
//       {pts.map((p, i) => (
//         <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={isDark ? "#0f172a" : "#fff"} stroke={color} strokeWidth="2" 
//                 style={{ animation: `fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${1 + (i * 0.1)}s both` }} />
//       ))}
//     </svg>
//   );
// }

// function MiniDonut({ credit, debit, color, size = 64, isDark }: { credit: number, debit: number, color: string, size?: number, isDark: boolean }) {
//   const total = credit + debit; 
//   const trackColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
//   if (!total) return <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={26} fill="none" stroke={trackColor} strokeWidth="10"/></svg>;

//   const cr = credit / total; 
//   const r = 26; const cx = size / 2; const cy = size / 2; const circ = 2 * Math.PI * r;

//   return (
//     <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
//       <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth="8"/>
//       <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
//               strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ} 
//               style={{ animation: `drawDonut 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards` }} />
//       <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round"
//               strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ} 
//               style={{ animation: `drawDonut 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards`, transformOrigin: "center", transform: `rotate(${cr * 360}deg)` }} />
//     </svg>
//   );
// }

// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function CSCNightAnalytics() {
//   const [isDark, setIsDark] = useState(false);
//   const T = isDark ? THEMES.dark : THEMES.light;

//   // ─── State (Preserved Exactly) ─────────────────────────────────────────────
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filterOp, setFilterOp] = useState("all");
//   const [filterCat, setFilterCat] = useState("all");
//   const [filterType, setFilterType] = useState("all");
//   const [filterFlag, setFilterFlag] = useState(false);
//   const [amtMin, setAmtMin] = useState("");
//   const [amtMax, setAmtMax] = useState("");
//   const [sortBy, setSortBy] = useState("time");
//   const [sortDir, setSortDir] = useState("desc");
//   const [searchQ, setSearchQ] = useState("");
//   const [activeView, setActiveView] = useState("overview"); 
//   const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

//   const { user, isLoggedIn, logout, loading: authLoading } = useAuth();


//   // ─── Semantic Colors (Data semantics, theme-independent) ───────────────────
//   const cr = "#2563eb";
//   const dr = "#dc2626";
//   const warn = "#c2410c";
//   const success = "#15803d";

//   // ─── FETCH (Preserved Exactly) ───────────────────────────────────────────────
//   useEffect(() => {
//     async function fetchAnalytics() {
//       try {
//         const res = await fetch("/api/admin/transactions?limit=500");
//         if (res.ok) {
//           const data = await res.json();
//           setTransactions(data.transactions || []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch analytics:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchAnalytics();
//   }, []);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("csc_theme");
//     if (savedTheme) setIsDark(savedTheme === "dark");
//     else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//   }, [user]);

//   // ─── CALCULATIONS (Preserved Exactly) ──────────────────────────────────────
//   const { HOURLY, OPERATOR_STATS, CAT_STATS, TOTAL_CREDIT, TOTAL_DEBIT, NET, FLAGGED, MAX_HOURLY } = useMemo(() => {
//     const getHour = (t: string) => parseInt((t || "00").split(":")[0], 10);
//     const hourly = Array.from({length: 12}, (_, i) => {
//       const h = i + 9;
//       const txs = transactions.filter(tx => getHour(tx.time) === h);
//       return {
//         hour: `${String(h).padStart(2, "0")}:00`,
//         credit: txs.filter(t => t.type === "credit").reduce((a,t) => a + parseFloat(t.amount || "0"), 0),
//         debit:  txs.filter(t => t.type === "debit").reduce((a,t) => a + parseFloat(t.amount || "0"), 0),
//         count:  txs.length
//       };
//     });

//     const ops = Array.from(new Set(transactions.map(t => t.operator || "Unknown")));
//     const opStats = ops.map(op => {
//       const txs = transactions.filter(t => t.operator === op);
//       return {
//         name: op,
//         avatar: op.split(" ").map(w => w[0]).join("").slice(0, 2),
//         total: txs.length,
//         credit: txs.filter(t => t.type === "credit").reduce((a,t) => a + parseFloat(t.amount || "0"), 0),
//         debit:  txs.filter(t => t.type === "debit").reduce((a,t) => a + parseFloat(t.amount || "0"), 0),
//         flagged: txs.filter(t => t.flags?.length > 0).length,
//         online: true 
//       };
//     }).sort((a,b) => b.total - a.total);

//     const cats = Array.from(new Set(transactions.map(t => t.category || "Other")));
//     const catStats = cats.map(cat => {
//       const txs = transactions.filter(t => t.category === cat);
//       return { name: cat, count: txs.length, volume: txs.reduce((a,t) => a + parseFloat(t.amount || "0"), 0) };
//     }).sort((a,b) => b.volume - a.volume);

//     const tCred = transactions.filter(t => t.type === "credit").reduce((a,t) => a + parseFloat(t.amount || "0"), 0);
//     const tDeb = transactions.filter(t => t.type === "debit").reduce((a,t) => a + parseFloat(t.amount || "0"), 0);
//     const tFlags = transactions.filter(t => t.flags?.length > 0).length;
//     const mHour = Math.max(...hourly.map(h => h.credit + h.debit), 1);

//     return { HOURLY: hourly, OPERATOR_STATS: opStats, CAT_STATS: catStats, TOTAL_CREDIT: tCred, TOTAL_DEBIT: tDeb, NET: tCred - tDeb, FLAGGED: tFlags, MAX_HOURLY: mHour };
//   }, [transactions]);

//   const filtered = useMemo(() => {
//     return transactions.filter(t => {
//       if (filterOp !== "all" && t.operator !== filterOp) return false;
//       if (filterCat !== "all" && t.category !== filterCat) return false;
//       if (filterType !== "all" && t.type !== filterType) return false;
//       if (filterFlag && (!t.flags || t.flags.length === 0)) return false;
//       if (amtMin && parseFloat(t.amount) < parseFloat(amtMin)) return false;
//       if (amtMax && parseFloat(t.amount) > parseFloat(amtMax)) return false;
//       if (searchQ) {
//         const q = searchQ.toLowerCase();
//         if (!(t.txId||"").toLowerCase().includes(q) && !(t.senderName||"").toLowerCase().includes(q) && !(t.receiverName||"").toLowerCase().includes(q)) return false;
//       }
//       return true;
//     }).sort((a, b) => {
//       let av = sortBy === "amount" ? parseFloat(a.amount || "0") : a.time;
//       let bv = sortBy === "amount" ? parseFloat(b.amount || "0") : b.time;
//       return sortDir === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
//     });
//   }, [transactions, filterOp, filterCat, filterType, filterFlag, amtMin, amtMax, searchQ, sortBy, sortDir]);

//   const filtCredit = filtered.filter(t=>t.type==="credit").reduce((a,t)=>a+parseFloat(t.amount||"0"),0);
//   const filtDebit  = filtered.filter(t=>t.type==="debit").reduce((a,t)=>a+parseFloat(t.amount||"0"),0);
//   const maxOpTotal = Math.max(...OPERATOR_STATS.map(o=>o.total), 1);

//   // ─── HANDLERS ─── (Preserved Exactly)
//   const toggleTheme = () => {
//     const newDark = !isDark; setIsDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

//   // ─── Loading State ─────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div style={{ background: T.pageBg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, transition: "background .25s" }}>
//         <div style={{ width: 40, height: 40, border: `3px solid ${T.divider}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s" }}>
//       <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />
//       <style>{`
//         @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
//         @keyframes drawLine{to{stroke-dashoffset:0}}
//         @keyframes drawDonut{to{stroke-dashoffset:0}}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
//       `}</style>

//       {/* ════════════════════════════════════════════════════════
//           HEADER
//       ════════════════════════════════════════════════════════ */}
//       <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
//         {/* Row 1 */}
//         <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//           <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
//             <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
//             <div>
//               <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
//                 Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
//             </div>
//           </a>

//           <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

//           <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
//             {NAV_LINKS.map(l => {
//               const isActive = l.label === "Transactions";
//               return (
//                 <a key={l.href} href={l.href} className={`top-nav-link ${isActive ? "on" : ""}`}>
//                   <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
//                 </a>
//               );
//             })}
//           </nav>

//           <button className="tog" onClick={toggleTheme}>
//             <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
//           </button>

//           <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
//             <Avatar name="Admin" size={28} isDark={isDark} />
//             <div>
//               <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Admin</div>
//               <div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>ANALYTICS</div>
//             </div>
//           </div>
//         </div>

//         {/* Row 2 — Section Tabs */}
//         <div style={{ display: "flex", paddingLeft: 8, background: "rgba(0,0,0,0.12)" }}>
//           {[
//             { id: "overview", icon: "📊", label: "Overview" },
//             { id: "transactions", icon: "📋", label: "Transactions" },
//             { id: "operators", icon: "👥", label: "Operators" },
//             { id: "reconcile", icon: "🔍", label: "Reconcile" }
//           ].map(tab => (
//             <button key={tab.id} className={`sec-tab ${activeView === tab.id ? "on" : ""}`} onClick={() => setActiveView(tab.id)}>
//               <span style={{ fontSize: 17 }}>{tab.icon}</span>{tab.label}
//             </button>
//           ))}
//         </div>
//       </header>

//       {/* ════════════════════════════════════════════════════════
//           BODY
//       ════════════════════════════════════════════════════════ */}
//       <div style={{ flex: 1, overflowY: "auto" }}>
//         <div style={{ maxWidth: 1150, margin: "0 auto", padding: "24px" }}>

//           {/* ── Sticky Filter Bar ── */}
//           <div className="card" style={{ marginBottom: 20, position: "sticky", top: 12, zIndex: 50, backdropFilter: "blur(8px)", background: isDark ? "rgba(6,11,20,0.85)" : "rgba(255,255,255,0.92)" }}>
//             <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
//               <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                 <button className={`pill ${filterType==="all"?"on":""}`} onClick={()=>setFilterType("all")}>ALL</button>
//                 <button className={`pill ${filterType==="credit"?"on":""}`} onClick={()=>setFilterType(t=>t==="credit"?"all":"credit")} style={{color:filterType==="credit"?cr:undefined,borderColor:filterType==="credit"?cr:undefined}}>▲ CREDIT</button>
//                 <button className={`pill ${filterType==="debit"?"on":""}`} onClick={()=>setFilterType(t=>t==="debit"?"all":"debit")} style={{color:filterType==="debit"?dr:undefined,borderColor:filterType==="debit"?dr:undefined}}>▼ DEBIT</button>
//                 <button className={`pill ${filterFlag?"on":""}`} onClick={()=>setFilterFlag(f=>!f)} style={{color:filterFlag?warn:undefined,borderColor:filterFlag?warn:undefined}}>⚠ FLAGGED</button>
//               </div>

//               <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
//                 <select value={filterOp} onChange={e=>setFilterOp(e.target.value)} className="inp" style={{ width: 140, padding: "7px 10px", fontSize: 12 }}>
//                   <option value="all">All Operators</option>
//                   {OPERATOR_STATS.map(o=><option key={o.name} value={o.name}>{o.name}</option>)}
//                 </select>

//                 <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className="inp" style={{ width: 140, padding: "7px 10px", fontSize: 12 }}>
//                   <option value="all">All Categories</option>
//                   {CAT_STATS.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
//                 </select>

//                 <div style={{display:"flex",alignItems:"center",gap:4}}>
//                   <span style={{fontSize:"0.75rem",color:T.textMuted,fontWeight:600}}>₹</span>
//                   <input value={amtMin} onChange={e=>setAmtMin(e.target.value)} placeholder="Min" className="inp" style={{width:70,padding:"7px 10px",fontSize:12}} />
//                   <span style={{fontSize:"0.75rem",color:T.textMuted}}>–</span>
//                   <input value={amtMax} onChange={e=>setAmtMax(e.target.value)} placeholder="Max" className="inp" style={{width:70,padding:"7px 10px",fontSize:12}} />
//                 </div>

//                 <div style={{position:"relative"}}>
//                   <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.inputPlaceholder}}><Ico.Search /></span>
//                   <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search TX ID, Name..." className="inp" style={{paddingLeft:30,width:180,fontSize:12,padding:"7px 10px 7px 30px"}} />
//                 </div>

//                 <span className="mono" style={{fontSize:11,color:T.textMuted,fontWeight:700}}>{filtered.length} / {transactions.length} TXN</span>
//               </div>
//             </div>
//           </div>

//           {/* ════ OVERVIEW ════ */}
//           {activeView === "overview" && (
//             <div>
//               <div className="kpi-grid">
//                 {[
//                   {label:"TOTAL CREDIT",val:fmtShort(filtCredit),full:`₹${fmt(filtCredit)}`,color:cr,icon:"▲"},
//                   {label:"TOTAL DEBIT", val:fmtShort(filtDebit), full:`₹${fmt(filtDebit)}`, color:dr,icon:"▼"},
//                   {label:"NET BALANCE", val:fmtShort(Math.abs(NET)), full:`₹${fmt(Math.abs(NET))}`, color:NET>=0?success:dr, icon:NET>=0?"↑":"↓", prefix:NET>=0?"":"-"},
//                   {label:"TRANSACTIONS",val:filtered.length, full:`${transactions.length} total`, color:T.textPrimary, icon:"#"},
//                   {label:"AVG TXN SIZE",val:fmtShort(Math.round((filtCredit+filtDebit)/(filtered.length||1))),full:"per transaction",color:T.textSecondary,icon:"≈"},
//                   {label:"FLAGGED",     val:FLAGGED, full:`${FLAGGED} need review`, color:warn, icon:"⚠"},
//                 ].map((k,i)=>(
//                   <div key={k.label} className="kpi-card" style={{animationDelay:`${i*0.06}s`}}>
//                     <div style={{position:"absolute",top:0,right:0,width:40,height:40,background:`${k.color}08`,borderRadius:"0 12px 0 40px"}}/>
//                     <div className="kpi-label">{k.label}</div>
//                     <div className="kpi-val" style={{color:k.color}}>{k.prefix}{k.val}</div>
//                     <div className="kpi-sub">{k.full}</div>
//                   </div>
//                 ))}
//               </div>

//               <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:16}}>
//                 <div className="card" style={{animationDelay:"0.1s"}}>
//                   <SecHdr icon="📊" label="Hourly Volume" />
//                   <div style={{padding:"16px 18px"}}>
//                     <div style={{display:"flex",gap:16,marginBottom:12,justifyContent:"flex-end"}}>
//                       <div style={{display:"flex",alignItems:"center",gap:5}}>
//                         <div style={{width:10,height:3,background:cr,borderRadius:1}}/>
//                         <span style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:600}}>Credit</span>
//                       </div>
//                       <div style={{display:"flex",alignItems:"center",gap:5}}>
//                         <div style={{width:10,height:3,background:T.divider,borderRadius:1}}/>
//                         <span style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:600}}>Debit</span>
//                       </div>
//                     </div>
//                     <BarChart data={HOURLY} maxVal={MAX_HOURLY} color={cr} isDark={isDark} />
//                   </div>
//                 </div>

//                 <div className="card" style={{animationDelay:"0.15s"}}>
//                   <SecHdr icon="🥧" label="Credit / Debit Split" />
//                   <div style={{padding:"16px 18px"}}>
//                     <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
//                       <div style={{position:"relative"}}>
//                         <MiniDonut credit={TOTAL_CREDIT} debit={TOTAL_DEBIT} color={cr} size={80} isDark={isDark}/>
//                         <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
//                           <span className="serif" style={{fontSize:12,color:T.textPrimary,fontWeight:700}}>{TOTAL_CREDIT+TOTAL_DEBIT > 0 ? Math.round(TOTAL_CREDIT/(TOTAL_CREDIT+TOTAL_DEBIT)*100) : 0}%</span>
//                         </div>
//                       </div>
//                       <div>
//                         <div style={{marginBottom:8}}>
//                           <div style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>Credit</div>
//                           <div className="serif" style={{fontSize:"1.2rem",fontWeight:700,color:cr}}>{fmtShort(TOTAL_CREDIT)}</div>
//                         </div>
//                         <div>
//                           <div style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>Debit</div>
//                           <div className="serif" style={{fontSize:"1.2rem",fontWeight:700,color:dr}}>{fmtShort(TOTAL_DEBIT)}</div>
//                         </div>
//                       </div>
//                     </div>
//                     <div style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:T.textMuted,marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>TX COUNT ACTIVITY</div>
//                     <LineChart data={HOURLY} color={T.accent} isDark={isDark} />
//                   </div>
//                 </div>
//               </div>

//               <div className="card" style={{animationDelay:"0.2s"}}>
//                 <SecHdr icon="📑" label="Volume by Category" />
//                 <div style={{padding:"16px 18px"}}>
//                   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
//                     {CAT_STATS.map(c=>(
//                       <div key={c.name}>
//                         <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
//                           <span style={{fontSize:"0.82rem",color:T.textPrimary,fontWeight:600}}>{c.name}</span>
//                           <span style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:700}}>{c.count} txn</span>
//                         </div>
//                         <div className="progress-track">
//                           <div className="progress-fill" style={{width:`${CAT_STATS[0]?.volume > 0 ? (c.volume/CAT_STATS[0].volume)*100 : 0}%`}}/>
//                         </div>
//                         <div className="serif" style={{fontSize:"0.75rem",color:cr,marginTop:4,fontWeight:700}}>{fmtShort(c.volume)}</div>
//                       </div>
//                     ))}
//                     {CAT_STATS.length === 0 && <div style={{color:T.textMuted, fontSize:"0.8rem"}}>No category data available</div>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ════ TRANSACTIONS ════ */}
//           {activeView === "transactions" && (
//             <div className="card">
//               <div style={{ background: T.accentLight, borderBottom: `2px solid ${T.accentBorder}`, padding: "12px 18px", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
//                 {[
//                   [`▲ ${fmtShort(filtCredit)}`,cr,"credit total"],
//                   [`▼ ${fmtShort(filtDebit)}`,dr,"debit total"],
//                   [`${filtered.length} txn`,T.textMuted,"matching"],
//                   [`${filtered.filter(t=>t.flags?.length>0).length} flagged`,warn,"need review"],
//                 ].map(([v,c,l])=>(
//                   <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
//                     <span className="serif" style={{fontSize:"0.85rem",fontWeight:700,color:c}}>{v}</span>
//                     <span style={{fontSize:"0.7rem",color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600}}>{l}</span>
//                   </div>
//                 ))}
//                 <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
//                   <span style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:700,textTransform:"uppercase"}}>Sort:</span>
//                   {[["time","Time"],["amount","Amount"]].map(([k,l])=>(
//                     <button key={k} onClick={()=>{ if(sortBy===k) setSortDir(d=>d==="asc"?"desc":"asc"); else setSortBy(k); }} className="pill" style={{color:sortBy===k?T.accent:T.textMuted,borderColor:sortBy===k?T.accent:T.pillBorder,background:sortBy===k?T.pillActiveBg:T.pillBg}}>
//                       {l} {sortBy===k?(sortDir==="desc"?"↓":"↑"):""}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div style={{overflow:"auto"}}>
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th className="sort-btn" onClick={()=>{setSortBy("time");setSortDir(d=>d==="asc"?"desc":"asc");}}>TIME {sortBy==="time"?(sortDir==="desc"?"↓":"↑"):""}</th>
//                       <th>TYPE</th>
//                       <th className="sort-btn" onClick={()=>{setSortBy("amount");setSortDir(d=>d==="asc"?"desc":"asc");}}>AMOUNT {sortBy==="amount"?(sortDir==="desc"?"↓":"↑"):""}</th>
//                       <th>CATEGORY</th>
//                       <th>SENDER</th>
//                       <th>RECEIVER</th>
//                       <th>TX ID</th>
//                       <th>OPERATOR</th>
//                       <th>FLAGS</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map((tx,i)=>(
//                       <tr key={tx.id} className={`tx-row ${tx.flags?.length>0?"flagged":""}`} onClick={()=>setSelectedTx(tx)}>
//                         <td><span style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:700}}>{i+1}</span></td>
//                         <td><span style={{fontSize:"0.78rem",color:T.textSecondary,fontWeight:500}}>{tx.time}</span></td>
//                         <td><span style={{fontSize:"0.72rem",fontWeight:800,color:tx.type==="credit"?cr:dr,textTransform:"uppercase",letterSpacing:"0.05em"}}>{tx.type==="credit"?"▲ CR":"▼ DR"}</span></td>
//                         <td><span className="serif" style={{fontSize:"0.9rem",fontWeight:700,color:tx.type==="credit"?cr:dr}}>₹{fmt(parseFloat(tx.amount||"0"))}</span></td>
//                         <td><span style={{fontSize:"0.78rem",color:T.textSecondary}}>{tx.category}</span></td>
//                         <td><span style={{fontSize:"0.78rem",color:T.textPrimary,fontWeight:600}}>{tx.senderName||"—"}</span></td>
//                         <td><span style={{fontSize:"0.78rem",color:T.textSecondary}}>{tx.receiverName||"—"}</span></td>
//                         <td><span className="mono" style={{fontSize:"0.68rem",color:T.textMuted}}>{(tx.txId||"—").slice(0,16)}…</span></td>
//                         <td><span style={{fontSize:"0.78rem",color:T.textSecondary}}>{(tx.operator||"Admin").split(" ")[0]}</span></td>
//                         <td>{tx.flags?.length>0?<span style={{fontSize:"0.85rem"}}>⚠️</span>:<span style={{color:T.divider,fontSize:"0.75rem"}}>—</span>}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {filtered.length===0 && <div style={{padding:40,textAlign:"center",color:T.textMuted,fontSize:"0.85rem",fontWeight:600}}>NO TRANSACTIONS MATCH FILTERS</div>}
//               </div>
//             </div>
//           )}

//           {/* ════ OPERATORS ════ */}
//           {activeView === "operators" && (
//             <div>
//               <div className="card" style={{marginBottom:16}}>
//                 <SecHdr icon="👥" label="Operator Performance — Today" />
//                 <div style={{padding:"16px 18px"}}>
//                   <div style={{fontSize:"0.85rem",color:T.textSecondary,marginBottom:16}}>Individual breakdown & accountability</div>

//                   {OPERATOR_STATS.map((op,i)=>(
//                     <div key={op.name} className="op-card" style={{animationDelay:`${i*0.08}s`}}>
//                       <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
//                         <div style={{textAlign:"center",flexShrink:0}}>
//                           <div style={{width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,fontFamily:"'DM Sans',sans-serif",flexShrink:0,background:i===0?T.accentLight:T.inputBg,border:`2px solid ${i===0?T.accent:T.inputBorder}`,color:i===0?T.accent:T.textMuted}}>{op.avatar}</div>
//                           <div style={{width:8,height:8,borderRadius:"50%",background:op.online?"#22c55e":T.textMuted,margin:"4px auto 0"}}/>
//                         </div>
//                         <div style={{flex:1}}>
//                           <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
//                             <div>
//                               <div style={{fontWeight:700,fontSize:"1rem",color:T.textPrimary,marginBottom:2}}>{op.name}
//                                 {i===0 && op.total>0 && <span style={{marginLeft:8,fontSize:"0.65rem",background:T.tagBg,border:`1px solid ${T.accentBorder}`,color:T.tagText,padding:"2px 8px",borderRadius:20,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase"}}>Top</span>}
//                               </div>
//                               <div style={{fontSize:"0.78rem",color:T.textSecondary}}>{op.online?"Online now":"Offline"} · {op.total} transactions handled</div>
//                             </div>
//                             <div style={{textAlign:"right"}}>
//                               {op.flagged>0&&<div style={{fontSize:"0.78rem",color:warn,fontWeight:700}}>⚠ {op.flagged} flagged</div>}
//                             </div>
//                           </div>
//                           <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
//                             {[
//                               ["CREDIT",fmtShort(op.credit),cr],
//                               ["DEBIT",fmtShort(op.debit),dr],
//                               ["NET",fmtShort(Math.abs(op.credit-op.debit)),op.credit>=op.debit?success:dr],
//                             ].map(([l,v,c])=>(
//                               <div key={l} className="op-stat-box">
//                                 <div style={{fontSize:"0.65rem",color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{l}</div>
//                                 <div className="serif" style={{fontSize:"1.1rem",fontWeight:700,color:c}}>{v}</div>
//                               </div>
//                             ))}
//                           </div>
//                           <div>
//                             <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
//                               <span style={{fontSize:"0.7rem",color:T.textMuted,fontWeight:600}}>Activity share</span>
//                               <span style={{fontSize:"0.7rem",color:T.textSecondary,fontWeight:700}}>{maxOpTotal > 0 ? Math.round(op.total/maxOpTotal*100) : 0}% of max</span>
//                             </div>
//                             <div className="progress-track">
//                               <div className="progress-fill" style={{width:`${maxOpTotal > 0 ? (op.total/maxOpTotal)*100 : 0}%`, background: i===0?T.accent:T.divider}}/>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ════ RECONCILE ════ */}
//           {activeView === "reconcile" && (
//             <div>
//               <div className="card" style={{marginBottom:16}}>
//                 <SecHdr icon="📋" label="Reconciliation Report" />
//                 <div style={{padding:"16px 18px"}}>
//                   <div style={{fontSize:"0.85rem",color:T.textSecondary,marginBottom:16}}>End-of-day mismatch analysis</div>

//                   <div className="kpi-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
//                     {[
//                       {label:"GROSS CREDIT",val:`₹${fmt(TOTAL_CREDIT)}`,color:cr,sub:`${transactions.filter(t=>t.type==="credit").length} transactions`},
//                       {label:"GROSS DEBIT", val:`₹${fmt(TOTAL_DEBIT)}`, color:dr, sub:`${transactions.filter(t=>t.type==="debit").length} transactions`},
//                       {label:"NET POSITION",val:`${NET>=0?"+":"−"}₹${fmt(Math.abs(NET))}`,color:NET>=0?success:dr,sub:NET>=0?"Surplus":"Deficit"},
//                     ].map(c=>(
//                       <div key={c.label} className="kpi-card">
//                         <div className="kpi-label">{c.label}</div>
//                         <div className="kpi-val" style={{color:c.color}}>{c.val}</div>
//                         <div className="kpi-sub">{c.sub}</div>
//                       </div>
//                     ))}
//                   </div>

//                   <div style={{marginTop:20}}>
//                     <div style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:T.textMuted,marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>Issues Requiring Attention</div>
//                     {transactions.filter(t=>t.flags?.length>0).length === 0 ? (
//                       <div style={{padding:20, background:isDark?"rgba(21,128,61,0.1)":"#f0fdf4", borderRadius:8, border:`1px solid ${isDark?"rgba(21,128,61,0.3)":"#dcfce7"}`, color:success, fontSize:"0.85rem", display:"flex", alignItems:"center", gap:8, fontWeight:600}}>
//                         <span style={{fontSize:16}}>✅</span> All transactions clean. No flags detected today.
//                       </div>
//                     ) : transactions.filter(t=>t.flags?.length>0).slice(0,5).map((tx, i)=>(
//                       <div key={tx.id} style={{background:isDark?"rgba(194,65,12,0.08)":"#fff7ed",border:`1px solid ${isDark?"rgba(194,65,12,0.25)":"#fed7aa"}`,borderRadius:8,padding:"12px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"flex-start", animation:`fadeUp 0.3s ease ${i*0.1}s both`}}>
//                         <span style={{fontSize:20,flexShrink:0}}>🚨</span>
//                         <div style={{flex:1}}>
//                           <div style={{display:"flex",justifyContent:"space-between"}}>
//                             <span style={{fontWeight:700,fontSize:"0.85rem",color:warn}}>Flagged Transaction — {tx.txId || tx.id.slice(0,8)}</span>
//                             <span className="serif" style={{fontSize:"0.8rem",color:dr,fontWeight:700}}>₹{fmt(parseFloat(tx.amount||"0"))}</span>
//                           </div>
//                           <div style={{fontSize:"0.78rem",color:isDark?"#fdba74":"#c2410c",marginTop:3}}>
//                             {tx.senderName||"Unknown"} → {tx.receiverName||"Unknown"} · {tx.time} · by {tx.operator}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div style={{display:"flex",gap:10,marginTop:20}}>
//                     {["⬇ Export CSV","⬇ Export PDF","📤 Send to WhatsApp"].map(label=>(
//                       <button key={label} className="btn btn-g" style={{fontSize:12}}>
//                         {label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── DETAIL DRAWER ── */}
//       {selectedTx && (
//         <>
//           <div className="drawer-overlay" onClick={()=>setSelectedTx(null)} />
//           <div className="detail-drawer">
//             <div style={{background:T.accentLight,borderBottom:`2px solid ${T.accentBorder}`,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
//               <span style={{fontSize:"0.85rem",color:T.accent,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>{selectedTx.txId || selectedTx.id.slice(0,8)}</span>
//               <button onClick={()=>setSelectedTx(null)} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:18,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background=T.rowHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><Ico.X /></button>
//             </div>
//             <div style={{flex:1,overflowY:"auto",padding:"18px"}}>
//               <div style={{background:selectedTx.type==="credit"?T.accentLight:isDark?"rgba(220,38,38,0.1)":"#fff1f2",border:`2px solid ${selectedTx.type==="credit"?T.accentBorder:isDark?"rgba(220,38,38,0.3)":"#fca5a5"}`,borderRadius:12,padding:"18px",marginBottom:18,textAlign:"center"}}>
//                 <div style={{fontSize:"0.72rem",color:T.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>{selectedTx.type.toUpperCase()}</div>
//                 <div className="serif" style={{fontSize:"2.2rem",fontWeight:900,color:selectedTx.type==="credit"?T.accent:dr,lineHeight:1}}>₹{fmt(parseFloat(selectedTx.amount||"0"))}</div>
//               </div>
//               {[
//                 ["TX ID",selectedTx.txId,"mono"],
//                 ["Time",selectedTx.time,"mono"],
//                 ["Category",selectedTx.category,""],
//                 ["Sender",selectedTx.senderName,""],
//                 ["Receiver",selectedTx.receiverName,""],
//                 ["Operator",selectedTx.operator,""],
//               ].map(([l,v,cls])=>(
//                 <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.divider}`}}>
//                   <span style={{fontSize:"0.78rem",color:T.textMuted,fontWeight:600}}>{l}</span>
//                   <span className={cls} style={{fontSize:"0.82rem",color:T.textPrimary,fontWeight:700,textAlign:"right",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",fontFamily:cls==="mono"?"'JetBrains Mono',monospace":"inherit"}}>{v || "—"}</span>
//                 </div>
//               ))}
//               {selectedTx.flags?.length>0 && (
//                 <div style={{marginTop:14,background:isDark?"rgba(194,65,12,0.08)":"#fff7ed",border:`1px solid ${isDark?"rgba(194,65,12,0.25)":"#fed7aa"}`,borderRadius:8,padding:"12px 14px"}}>
//                   <div style={{fontSize:"0.72rem",color:warn,fontWeight:800,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>⚠️ FLAGGED TRANSACTION</div>
//                   <div style={{fontSize:"0.8rem",color:isDark?"#fdba74":"#9a3412"}}>Marked for review. Verify with operator before settlement.</div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
















"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, useMemo } from "react";
import { adminGetAadharScansAction, adminDeleteAadharScanAction, adminDeleteAadharScansAction } from "@/app/actions/admin";

interface Transaction {
  id: string; txId: string; type: "credit" | "debit"; amount: string;
  category: string; operator: string; senderName: string; receiverName: string;
  date: string; time: string; flags: any[];
  _isAadhar?: boolean;
  _aadharData?: AadharScan;
}

interface AadharScan {
  id: string; user_id: string; operator_name: string; full_name: string;
  gender: string; dob: string; address: string; aadhar_number: string;
  last_4_digits: string; photo_base64: string; amount: number;
  is_verified: boolean; verification_note: string; raw_ocr_text: string;
  created_at: string;
}

interface HourlyData { hour: string; credit: number; debit: number; count: number; }

function fmt(n: number): string { return n.toLocaleString("en-IN"); }
function fmtShort(n: number): string {
  if (n >= 100000) return `Rs.${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `Rs.${(n / 1000).toFixed(1)}K`;
  return `Rs.${n}`;
}
function formatDate(d: string): string {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(d: string): string {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function maskAadhar(num: string): string {
  if (!num || num.length < 12) return num || "-";
  return `XXXX-XXXX-${num.slice(-4)}`;
}
function getDateRangeDays(days: number): Date {
  const d = new Date(); d.setDate(d.getDate() - days); d.setHours(0, 0, 0, 0); return d;
}

const THEMES = {
  light: {
    pageBg: "#f1f5f9", navBg: "#1e3a8a", navBottomBorder: "#3b82f6", navText: "rgba(255,255,255,0.65)", navTextHover: "#ffffff", navActiveBg: "#3b82f6", navActiveText: "#ffffff", navBrand: "#ffffff", navBrandAccent: "#93c5fd", cardBg: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 4px rgba(0,0,0,0.07)", sectionGrad: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)", sectionGradText: "#ffffff", textPrimary: "#1e293b", textSecondary: "#475569", textMuted: "#94a3b8", accent: "#2563eb", accentHover: "#1d4ed8", accentLight: "#eff6ff", accentBorder: "#bfdbfe", inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputFocusBorder: "#3b82f6", inputText: "#1e293b", inputPlaceholder: "#94a3b8", divider: "#e2e8f0", pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#64748b", pillActiveBg: "#dbeafe", pillActiveBorder: "#93c5fd", pillActiveText: "#1d4ed8", rowHover: "#f8fafc", btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff", btnPrimaryGlow: "rgba(37,99,235,0.35)", btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569", btnGhostHoverBg: "#eff6ff", btnGhostHoverText: "#2563eb", btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626", btnDangerHoverBg: "#fee2e2", btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)", btnSuccessText: "#ffffff", subTabHdrBg: "#f8fafc", subTabText: "#94a3b8", subTabActive: "#2563eb", subTabBorder: "#2563eb", tagBg: "#dbeafe", tagText: "#1d4ed8", scrollThumb: "#bfdbfe", modalOverlay: "rgba(15,23,42,0.55)", modalBg: "#ffffff", modalBorder: "#e2e8f0", toggleIcon: "🌙", toggleLabel: "Dark", aadharHighlight: "rgba(16,185,129,0.06)", aadharBorder: "rgba(16,185,129,0.2)", aadharText: "#059669",
  },
  dark: {
    pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b", navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff", navActiveBg: "rgba(245,158,11,0.18)", navActiveText: "#f59e0b", navBrand: "#ffffff", navBrandAccent: "#f59e0b", cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)", sectionGrad: "linear-gradient(135deg,#b45309 0%,#d97706 100%)", sectionGradText: "#000000", textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)", accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)", inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)", inputFocusBorder: "rgba(245,158,11,0.5)", inputText: "#f1f5f9", inputPlaceholder: "rgba(255,255,255,0.25)", divider: "rgba(255,255,255,0.06)", pillBg: "rgba(255,255,255,0.03)", pillBorder: "rgba(255,255,255,0.08)", pillText: "rgba(255,255,255,0.4)", pillActiveBg: "rgba(245,158,11,0.15)", pillActiveBorder: "rgba(245,158,11,0.4)", pillActiveText: "#f59e0b", rowHover: "rgba(255,255,255,0.03)", btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000", btnPrimaryGlow: "rgba(245,158,11,0.35)", btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)", btnGhostHoverBg: "rgba(245,158,11,0.1)", btnGhostHoverText: "#f59e0b", btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171", btnDangerHoverBg: "rgba(239,68,68,0.2)", btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)", btnSuccessText: "#ffffff", subTabHdrBg: "rgba(6,11,20,0.6)", subTabText: "rgba(255,255,255,0.35)", subTabActive: "#f59e0b", subTabBorder: "#f59e0b", tagBg: "rgba(245,158,11,0.15)", tagText: "#f59e0b", scrollThumb: "rgba(245,158,11,0.3)", modalOverlay: "rgba(0,0,0,0.85)", modalBg: "#0f172a", modalBorder: "rgba(255,255,255,0.1)", toggleIcon: "☀️", toggleLabel: "Light", aadharHighlight: "rgba(16,185,129,0.08)", aadharBorder: "rgba(16,185,129,0.25)", aadharText: "#34d399",
  },
} as const;

type ThemeTokens = typeof THEMES.light;

const Ico = {
  Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
  X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Trash: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>,
};

function Avatar({ name, size = 40, isDark }: { name?: string | null; size?: number; isDark: boolean }) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  const grad = isDark ? "linear-gradient(135deg,#334155,#1e293b)" : "linear-gradient(135deg,#64748b,#475569)";
  return <div style={{ width: size, height: size, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.18)" }}>{ch}</div>;
}

const NAV_LINKS = [
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
];

function SecHdr({ icon, label }: { icon: string; label: string }) {
  return <div className="sec-hdr"><span style={{ fontSize: "1.05rem" }}>{icon}</span><span className="sec-hdr-txt">{label}</span></div>;
}

function buildCss(T: ThemeTokens): string {
  return `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
.serif{font-family:'DM Serif Display',serif;}
.mono{font-family:'JetBrains Mono',monospace;}
.top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
.top-nav-link.on{background:${T.navActiveBg};color:${T.navActiveText};border-color:transparent;}
.sec-tab{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 22px;cursor:pointer;background:transparent;border:none;border-bottom:2px solid transparent;color:${T.subTabText};font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;transition:all .15s;font-family:'DM Sans',sans-serif;}
.sec-tab.on{color:${T.subTabActive};border-bottom-color:${T.subTabBorder};}
.sec-tab:hover:not(.on){color:${T.textSecondary};}
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};margin-bottom:16px;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}
.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-d:hover{background:${T.btnDangerHoverBg};filter:brightness(.95);}
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-s:hover{filter:brightness(1.08);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}
.inp{width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}
select.inp option{background:${T.modalBg};color:${T.inputText};}
.pill{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};text-transform:uppercase;}
.pill:hover{border-color:${T.accent};color:${T.accent};}
.pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}
.data-table{width:100%;border-collapse:collapse;font-size:0.82rem;}
.data-table th{background:${T.accentLight};color:${T.accent};font-weight:700;padding:10px 14px;text-align:left;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.4px;border-bottom:2px solid ${T.accentBorder};}
.data-table td{padding:10px 14px;border-bottom:1px solid ${T.divider};color:${T.textSecondary};vertical-align:middle;}
.data-table tr:last-child td{border-bottom:none;}
.data-table tr:hover td{background:${T.rowHover};}
.tx-row{cursor:pointer;transition:background 0.1s;}
.tx-row.flagged td:first-child{border-left:3px solid #dc2626;}
.aadhar-row{cursor:pointer;transition:background 0.1s;}
.aadhar-row td{background:${T.aadharHighlight};border-left:3px solid ${T.aadharBorder};}
.aadhar-row:hover td{background:${(isDark: Boolean) => isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)"}!important;}
.progress-track{height:6px;background:${T.divider};border-radius:3px;overflow:hidden;}
.progress-fill{height:100%;background:${T.accent};border-radius:3px;animation:barGrow 1s cubic-bezier(0.16,1,0.3,1) both;transform-origin:left;}
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px;}
.kpi-card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;padding:20px;position:relative;overflow:hidden;transition:all 0.2s;box-shadow:${T.cardShadow};animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;}
.kpi-card:hover{transform:translateY(-2px);border-color:${T.accentBorder};box-shadow:0 8px 24px rgba(0,0,0,0.08);}
.kpi-label{font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${T.textMuted};margin-bottom:8px;font-family:'DM Sans',sans-serif;}
.kpi-val{font-family:'DM Serif Display',serif;font-size:1.8rem;font-weight:700;line-height:1;margin-bottom:4px;letter-spacing:-0.02em;}
.kpi-sub{font-size:0.75rem;color:${T.textSecondary};font-weight:500;}
.op-card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;padding:20px;margin-bottom:12px;animation:fadeUp 0.4s ease both;transition:all 0.2s;}
.op-card:hover{border-color:${T.accentBorder};box-shadow:0 4px 12px rgba(0,0,0,0.06);}
.op-stat-box{background:${T.inputBg};border-radius:8px;padding:12px;text-align:center;border:1px solid ${T.inputBorder};}
.drawer-overlay{position:fixed;inset:0;background:${T.modalOverlay};z-index:199;backdrop-filter:blur(2px);}
.detail-drawer{position:fixed;right:0;top:0;bottom:0;width:420px;background:${T.modalBg};border-left:1px solid ${T.modalBorder};z-index:200;display:flex;flex-direction:column;animation:slideIn 0.3s ease;box-shadow:-10px 0 30px rgba(0,0,0,0.2);}
.tog{display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}
.hover-photo{position:fixed;z-index:300;pointer-events:none;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.4);border:2px solid ${T.accentBorder};overflow:hidden;animation:fadeUp 0.15s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes drawLine{to{stroke-dashoffset:0}}
@keyframes drawDonut{to{stroke-dashoffset:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;
}

function BarChart({ data, maxVal, color, height = 140, isDark }: { data: HourlyData[], maxVal: number, color: string, height?: number, isDark: boolean }) {
  const w = 580; const bw = Math.floor(w / data.length) - 8;
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const textColor = isDark ? "rgba(255,255,255,0.4)" : "#64748b";
  return (
    <svg viewBox={`0 0 ${w} ${height + 30}`} style={{ width: "100%", overflow: "visible" }}>
      <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.9" /><stop offset="100%" stopColor={color} stopOpacity="0.2" /></linearGradient></defs>
      {[0.25, 0.5, 0.75, 1].map(f => <line key={f} x1={0} y1={height * (1 - f)} x2={w} y2={height * (1 - f)} stroke={gridColor} strokeWidth="1" strokeDasharray="4,4" />)}
      {data.map((d, i) => {
        const x = i * (w / data.length) + 4;
        const ch = maxVal === 0 ? 0 : Math.max(2, Math.round((d.credit / maxVal) * height));
        const dh = maxVal === 0 ? 0 : Math.max(2, Math.round((d.debit / maxVal) * height));
        return <g key={i}>
          <rect x={x} y={height - ch} width={bw * 0.45} height={ch} fill="url(#barGrad)" rx="3" style={{ transformOrigin: "bottom", animation: `barGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s both` }} />
          <rect x={x + bw * 0.55} y={height - dh} width={bw * 0.45} height={dh} fill={gridColor} rx="3" style={{ transformOrigin: "bottom", animation: `barGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04 + 0.1}s both` }} />
          <text x={x + bw / 2} y={height + 20} textAnchor="middle" fontSize="10" fill={textColor} fontFamily="'DM Sans',sans-serif">{d.hour.slice(0, 5)}</text>
        </g>;
      })}
    </svg>
  );
}

function LineChart({ data, color, height = 90, isDark }: { data: HourlyData[], color: string, height?: number, isDark: boolean }) {
  const w = 580; const maxCount = Math.max(...data.map(d => d.count), 1);
  const pts = data.map((d, i) => ({ x: (i / (data.length - 1)) * w, y: height - (d.count / maxCount) * height * 0.85 - 5 }));
  const path = pts.reduce((acc, p, i, a) => { if (i === 0) return `M ${p.x},${p.y}`; const cp1x = a[i - 1].x + (p.x - a[i - 1].x) / 2; return `${acc} C ${cp1x},${a[i - 1].y} ${cp1x},${p.y} ${p.x},${p.y}`; }, "");
  const area = `${path} L${w},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", overflow: "visible" }}>
      <defs><linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill="url(#lineAreaGrad)" style={{ animation: "fadeUp 1.5s ease-out forwards" }} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2000" strokeDashoffset="2000" style={{ animation: "drawLine 2s ease-in-out forwards" }} />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={isDark ? "#0f172a" : "#fff"} stroke={color} strokeWidth="2" style={{ animation: `fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${1 + (i * 0.1)}s both` }} />)}
    </svg>
  );
}

function MiniDonut({ credit, debit, color, size = 64, isDark }: { credit: number, debit: number, color: string, size?: number, isDark: boolean }) {
  const total = credit + debit; const trackColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  if (!total) return <svg width={size} height={size}><circle cx={size / 2} cy={size / 2} r={26} fill="none" stroke={trackColor} strokeWidth="10" /></svg>;
  const cr = credit / total; const r = 26; const cx = size / 2; const cy = size / 2; const circ = 2 * Math.PI * r;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ} style={{ animation: `drawDonut 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards` }} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ} style={{ animation: `drawDonut 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards`, transformOrigin: "center", transform: `rotate(${cr * 360}deg)` }} />
    </svg>
  );
}

function AadharCard({ scan, totalAmount, isDark }: { scan: AadharScan; totalAmount: number; isDark: boolean }) {
  const T = isDark ? THEMES.dark : THEMES.light;
  return (
    <div style={{ width: 340, height: 215, borderRadius: 12, background: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" : "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`, boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif", flexShrink: 0, }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #f59e0b, #10b981, #3b82f6, #f59e0b)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite", }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px 6px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`, }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, }}>🇮🇳</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Government of India</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, letterSpacing: "0.05em" }}>Aadhaar</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 9, color: T.aadharText, fontWeight: 700, background: isDark ? "rgba(16,185,129,0.15)" : "#f0fdf4", padding: "2px 8px", borderRadius: 10, border: `1px solid ${T.aadharBorder}` }}>{scan.is_verified ? "VERIFIED" : "PENDING"}</div>
      </div>
      <div style={{ display: "flex", padding: "10px 14px", gap: 12 }}>
        <div style={{ width: 72, height: 90, borderRadius: 6, overflow: "hidden", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`, background: T.inputBg, flexShrink: 0, }}>
          {scan.photo_base64 ? <img src={scan.photo_base64} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, fontSize: 20 }}>👤</div>}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div><div style={{ fontSize: 8, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Name</div><div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, lineHeight: 1.3 }}>{scan.full_name || "-"}</div></div>
          <div style={{ display: "flex", gap: 12 }}>
            <div><div style={{ fontSize: 8, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>DOB</div><div style={{ fontSize: 10, fontWeight: 600, color: T.textSecondary }}>{scan.dob || "-"}</div></div>
            <div><div style={{ fontSize: 8, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Gender</div><div style={{ fontSize: 10, fontWeight: 600, color: T.textSecondary }}>{scan.gender || "-"}</div></div>
          </div>
          <div><div style={{ fontSize: 8, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Aadhaar Number</div><div className="mono" style={{ fontSize: 13, fontWeight: 800, color: T.textPrimary, letterSpacing: 2 }}>{maskAadhar(scan.aadhar_number)}</div></div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 14px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", }}>
        <div><div style={{ fontSize: 7, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Transferred</div><div className="serif" style={{ fontSize: 14, fontWeight: 900, color: T.aadharText }}>Rs.{fmt(totalAmount)}</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 7, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Operator</div><div style={{ fontSize: 9, fontWeight: 600, color: T.textSecondary }}>{scan.operator_name}</div></div>
      </div>
    </div>
  );
}

export default function CSCNightAnalytics() {
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES.dark : THEMES.light;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aadharScans, setAadharScans] = useState<AadharScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOp, setFilterOp] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterFlag, setFilterFlag] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "2days" | "7days" | "30days">("all");
  const [amtMin, setAmtMin] = useState("");
  const [amtMax, setAmtMax] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [sortDir, setSortDir] = useState("desc");
  const [searchQ, setSearchQ] = useState("");
  const [activeView, setActiveView] = useState("overview");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedAadhar, setSelectedAadhar] = useState<AadharScan | null>(null);
  const [hoveredAadhar, setHoveredAadhar] = useState<AadharScan | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAllFiltered, setSelectAllFiltered] = useState(false);
  const [aadharSearch, setAadharSearch] = useState("");
  const [aadharCardSearch, setAadharCardSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const { user } = useAuth();

  const cr = "#2563eb";
  const dr = "#dc2626";
  const warn = "#c2410c";
  const success = "#15803d";

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [txRes, aadharRes] = await Promise.all([
          fetch("/api/admin/transactions?limit=500"),
          adminGetAadharScansAction().catch(() => []),
        ]);
        if (txRes.ok) {
          const data = await txRes.json();
          setTransactions(data.transactions || []);
        }
        setAadharScans(aadharRes);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [user]);

  const matchesDateFilter = (dateStr: string): boolean => {
    if (dateFilter === "all") return true;
    const itemDate = new Date(dateStr);
    const cutoff = getDateRangeDays(
      dateFilter === "today" ? 0 :
        dateFilter === "2days" ? 2 :
          dateFilter === "7days" ? 7 : 30
    );
    return itemDate >= cutoff;
  };

  // Merge Aadhar scans into transaction stream
  const mergedTransactions = useMemo(() => {
    const aadharTxs: Transaction[] = aadharScans.map(a => ({
      id: `aadhar-${a.id}`,
      txId: a.aadhar_number || a.id,
      type: "credit",
      amount: String(a.amount || 0),
      category: "Aadhar",
      operator: a.operator_name || "Unknown",
      senderName: a.full_name || "Unknown",
      receiverName: a.operator_name || "Unknown",
      date: a.created_at,
      time: formatTime(a.created_at),
      flags: a.is_verified ? [] : [{ type: "unverified" }],
      _isAadhar: true,
      _aadharData: a,
    }));
    return [...transactions, ...aadharTxs];
  }, [transactions, aadharScans]);

  const { HOURLY, OPERATOR_STATS, CAT_STATS, TOTAL_CREDIT, TOTAL_DEBIT, NET, FLAGGED, MAX_HOURLY } = useMemo(() => {
    const getHour = (t: string) => parseInt((t || "00").split(":")[0], 10);
    const hourly = Array.from({ length: 12 }, (_, i) => {
      const h = i + 9;
      const txs = mergedTransactions.filter(tx => getHour(tx.time) === h);
      return { hour: `${String(h).padStart(2, "0")}:00`, credit: txs.filter(t => t.type === "credit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0), debit: txs.filter(t => t.type === "debit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0), count: txs.length };
    });
    const ops = Array.from(new Set(mergedTransactions.map(t => t.operator || "Unknown")));
    const opStats = ops.map(op => {
      const txs = mergedTransactions.filter(t => t.operator === op);
      return { name: op, avatar: op.split(" ").map(w => w[0]).join("").slice(0, 2), total: txs.length, credit: txs.filter(t => t.type === "credit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0), debit: txs.filter(t => t.type === "debit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0), flagged: txs.filter(t => t.flags?.length > 0).length, online: true };
    }).sort((a, b) => b.total - a.total);
    const cats = Array.from(new Set(mergedTransactions.map(t => t.category || "Other")));
    const catStats = cats.map(cat => { const txs = mergedTransactions.filter(t => t.category === cat); return { name: cat, count: txs.length, volume: txs.reduce((a, t) => a + parseFloat(t.amount || "0"), 0) }; }).sort((a, b) => b.volume - a.volume);
    const tCred = mergedTransactions.filter(t => t.type === "credit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0);
    const tDeb = mergedTransactions.filter(t => t.type === "debit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0);
    const tFlags = mergedTransactions.filter(t => t.flags?.length > 0).length;
    const mHour = Math.max(...hourly.map(h => h.credit + h.debit), 1);
    return { HOURLY: hourly, OPERATOR_STATS: opStats, CAT_STATS: catStats, TOTAL_CREDIT: tCred, TOTAL_DEBIT: tDeb, NET: tCred - tDeb, FLAGGED: tFlags, MAX_HOURLY: mHour };
  }, [mergedTransactions]);

  const filtered = useMemo(() => {
    return mergedTransactions.filter(t => {
      if (filterOp !== "all" && t.operator !== filterOp) return false;
      if (filterCat !== "all" && t.category !== filterCat) return false;
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterFlag && (!t.flags || t.flags.length === 0)) return false;
      if (amtMin && parseFloat(t.amount) < parseFloat(amtMin)) return false;
      if (amtMax && parseFloat(t.amount) > parseFloat(amtMax)) return false;
      if (dateFilter !== "all" && !matchesDateFilter(t.date)) return false;
      if (searchQ) { const q = searchQ.toLowerCase(); if (!(t.txId || "").toLowerCase().includes(q) && !(t.senderName || "").toLowerCase().includes(q) && !(t.receiverName || "").toLowerCase().includes(q)) return false; }
      return true;
    }).sort((a, b) => { let av = sortBy === "amount" ? parseFloat(a.amount || "0") : a.time; let bv = sortBy === "amount" ? parseFloat(b.amount || "0") : b.time; return sortDir === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1); });
  }, [mergedTransactions, filterOp, filterCat, filterType, filterFlag, amtMin, amtMax, searchQ, sortBy, sortDir, dateFilter]);

  const filteredAadhar = useMemo(() => {
    return aadharScans.filter(a => {
      if (dateFilter !== "all" && !matchesDateFilter(a.created_at)) return false;
      if (amtMin && a.amount < parseFloat(amtMin)) return false;
      if (amtMax && a.amount > parseFloat(amtMax)) return false;
      if (aadharSearch) { const q = aadharSearch.toLowerCase(); if (!(a.aadhar_number || "").includes(q) && !(a.full_name || "").toLowerCase().includes(q) && !(a.operator_name || "").toLowerCase().includes(q)) return false; }
      return true;
    }).sort((a, b) => { const av = sortBy === "amount" ? a.amount : new Date(a.created_at).getTime(); const bv = sortBy === "amount" ? b.amount : new Date(b.created_at).getTime(); return sortDir === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1); });
  }, [aadharScans, dateFilter, amtMin, amtMax, aadharSearch, sortBy, sortDir]);

  const aadharCardResults = useMemo(() => {
    if (!aadharCardSearch) return [];
    const q = aadharCardSearch.toLowerCase();
    return aadharScans.filter(a => (a.aadhar_number || "").includes(q) || (a.full_name || "").toLowerCase().includes(q));
  }, [aadharScans, aadharCardSearch]);

  const aadharTotals = useMemo(() => {
    const map = new Map<string, number>();
    aadharScans.forEach(a => { const key = a.aadhar_number || a.id; map.set(key, (map.get(key) || 0) + (a.amount || 0)); });
    return map;
  }, [aadharScans]);

  const filtCredit = filtered.filter(t => t.type === "credit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0);
  const filtDebit = filtered.filter(t => t.type === "debit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0);
  const maxOpTotal = Math.max(...OPERATOR_STATS.map(o => o.total), 1);

  const toggleTheme = () => { const newDark = !isDark; setIsDark(newDark); localStorage.setItem("csc_theme", newDark ? "dark" : "light"); };

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const handleSelectAllFiltered = () => {
    if (selectAllFiltered) { setSelectedRows(new Set()); setSelectAllFiltered(false); }
    else { const allIds = new Set(filteredAadhar.map(a => a.id)); setSelectedRows(allIds); setSelectAllFiltered(true); }
  };

  const handleDeleteAadhar = async (id: string) => {
    try { await adminDeleteAadharScanAction(id); setAadharScans(prev => prev.filter(a => a.id !== id)); setSelectedRows(prev => { const next = new Set(prev); next.delete(id); return next; }); setDeleteConfirm(null); }
    catch (err: any) { alert(err.message || "Delete failed"); }
  };

  const handleBulkDelete = async () => {
    try { const ids = Array.from(selectedRows); await adminDeleteAadharScansAction(ids); setAadharScans(prev => prev.filter(a => !selectedRows.has(a.id))); setSelectedRows(new Set()); setSelectAllFiltered(false); setBulkDeleteConfirm(false); }
    catch (err: any) { alert(err.message || "Bulk delete failed"); }
  };

  const handleMouseMove = (e: React.MouseEvent) => { setHoverPos({ x: e.clientX + 20, y: e.clientY - 100 }); };

  if (isLoading) {
    return <div style={{ background: T.pageBg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, transition: "background .25s" }}><div style={{ width: 40, height: 40, border: `3px solid ${T.divider}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s" }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}} @keyframes drawLine{to{stroke-dashoffset:0}} @keyframes drawDonut{to{stroke-dashoffset:0}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}} @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {hoveredAadhar?.photo_base64 && (
        <div className="hover-photo" style={{ left: hoverPos.x, top: hoverPos.y, width: 140, height: 175 }}>
          <img src={hoveredAadhar.photo_base64} alt="Aadhar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* HEADER */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>Srilal<span style={{ color: T.navBrandAccent }}>CSC</span></div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
            </div>
          </a>
          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
          <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(l => { const isActive = l.label === "Transactions"; return <a key={l.href} href={l.href} className={`top-nav-link ${isActive ? "on" : ""}`}><span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}</a>; })}
          </nav>
          <button className="tog" onClick={toggleTheme}><span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
            <Avatar name="Admin" size={28} isDark={isDark} />
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Admin</div><div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>ANALYTICS</div></div>
          </div>
        </div>
        <div style={{ display: "flex", paddingLeft: 8, background: "rgba(0,0,0,0.12)" }}>
          {[{ id: "overview", icon: "📊", label: "Overview" }, { id: "transactions", icon: "📋", label: "Transactions" }, { id: "operators", icon: "👥", label: "Operators" }, { id: "reconcile", icon: "🔍", label: "Reconcile" }, { id: "aadhar", icon: "🆔", label: "Aadhar" }].map(tab => (
            <button key={tab.id} className={`sec-tab ${activeView === tab.id ? "on" : ""}`} onClick={() => setActiveView(tab.id)}><span style={{ fontSize: 17 }}>{tab.icon}</span>{tab.label}</button>
          ))}
        </div>
      </header>

      {/* BODY */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1150, margin: "0 auto", padding: "24px" }}>

          {/* Sticky Filter Bar */}
          <div className="card" style={{ marginBottom: 20, position: "sticky", top: 12, zIndex: 50, backdropFilter: "blur(8px)", background: isDark ? "rgba(6,11,20,0.85)" : "rgba(255,255,255,0.92)" }}>
            <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button className={`pill ${filterType === "all" ? "on" : ""}`} onClick={() => setFilterType("all")}>ALL</button>
                <button className={`pill ${filterType === "credit" ? "on" : ""}`} onClick={() => setFilterType(t => t === "credit" ? "all" : "credit")} style={{ color: filterType === "credit" ? cr : undefined, borderColor: filterType === "credit" ? cr : undefined }}>▲ CREDIT</button>
                <button className={`pill ${filterType === "debit" ? "on" : ""}`} onClick={() => setFilterType(t => t === "debit" ? "all" : "debit")} style={{ color: filterType === "debit" ? dr : undefined, borderColor: filterType === "debit" ? dr : undefined }}>▼ DEBIT</button>
                <button className={`pill ${filterFlag ? "on" : ""}`} onClick={() => setFilterFlag(f => !f)} style={{ color: filterFlag ? warn : undefined, borderColor: filterFlag ? warn : undefined }}>⚠ FLAGGED</button>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {(["all", "today", "2days", "7days", "30days"] as const).map(d => (
                  <button key={d} className={`pill ${dateFilter === d ? "on" : ""}`} onClick={() => setDateFilter(d)} style={{ fontSize: 10, padding: "4px 10px" }}>{d === "all" ? "ALL TIME" : d === "today" ? "TODAY" : d === "2days" ? "2 DAYS" : d === "7days" ? "7 DAYS" : "30 DAYS"}</button>
                ))}
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select value={filterOp} onChange={e => setFilterOp(e.target.value)} className="inp" style={{ width: 140, padding: "7px 10px", fontSize: 12 }}>
                  <option value="all">All Operators</option>
                  {OPERATOR_STATS.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
                </select>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="inp" style={{ width: 140, padding: "7px 10px", fontSize: 12 }}>
                  <option value="all">All Categories</option>
                  {CAT_STATS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "0.75rem", color: T.textMuted, fontWeight: 600 }}>Rs.</span>
                  <input value={amtMin} onChange={e => setAmtMin(e.target.value)} placeholder="Min" className="inp" style={{ width: 70, padding: "7px 10px", fontSize: 12 }} />
                  <span style={{ fontSize: "0.75rem", color: T.textMuted }}>-</span>
                  <input value={amtMax} onChange={e => setAmtMax(e.target.value)} placeholder="Max" className="inp" style={{ width: 70, padding: "7px 10px", fontSize: 12 }} />
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search TX ID, Name..." className="inp" style={{ paddingLeft: 30, width: 180, fontSize: 12, padding: "7px 10px 7px 30px" }} />
                </div>
                <span className="mono" style={{ fontSize: 11, color: T.textMuted, fontWeight: 700 }}>{filtered.length} / {mergedTransactions.length} TXN</span>
              </div>
            </div>
          </div>

          {/* OVERVIEW */}
          {activeView === "overview" && (
            <div>
              <div className="kpi-grid">
                {[{ label: "TOTAL CREDIT", val: fmtShort(filtCredit), full: `Rs.${fmt(filtCredit)}`, color: cr, icon: "▲" }, { label: "TOTAL DEBIT", val: fmtShort(filtDebit), full: `Rs.${fmt(filtDebit)}`, color: dr, icon: "▼" }, { label: "NET BALANCE", val: fmtShort(Math.abs(NET)), full: `Rs.${fmt(Math.abs(NET))}`, color: NET >= 0 ? success : dr, icon: NET >= 0 ? "↑" : "↓", prefix: NET >= 0 ? "" : "-" }, { label: "TRANSACTIONS", val: filtered.length, full: `${mergedTransactions.length} total`, color: T.textPrimary, icon: "#" }, { label: "AVG TXN SIZE", val: fmtShort(Math.round((filtCredit + filtDebit) / (filtered.length || 1))), full: "per transaction", color: T.textSecondary, icon: "≈" }, { label: "FLAGGED", val: FLAGGED, full: `${FLAGGED} need review`, color: warn, icon: "⚠" }].map((k, i) => (
                  <div key={k.label} className="kpi-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 40, height: 40, background: `${k.color}08`, borderRadius: "0 12px 0 40px" }} />
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-val" style={{ color: k.color }}>{k.prefix}{k.val}</div>
                    <div className="kpi-sub">{k.full}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="card" style={{ animationDelay: "0.1s" }}>
                  <SecHdr icon="📊" label="Hourly Volume" />
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12, justifyContent: "flex-end" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 3, background: cr, borderRadius: 1 }} /><span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 600 }}>Credit</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 3, background: T.divider, borderRadius: 1 }} /><span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 600 }}>Debit</span></div>
                    </div>
                    <BarChart data={HOURLY} maxVal={MAX_HOURLY} color={cr} isDark={isDark} />
                  </div>
                </div>
                <div className="card" style={{ animationDelay: "0.15s" }}>
                  <SecHdr icon="🥧" label="Credit / Debit Split" />
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                      <div style={{ position: "relative" }}>
                        <MiniDonut credit={TOTAL_CREDIT} debit={TOTAL_DEBIT} color={cr} size={80} isDark={isDark} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="serif" style={{ fontSize: 12, color: T.textPrimary, fontWeight: 700 }}>{TOTAL_CREDIT + TOTAL_DEBIT > 0 ? Math.round(TOTAL_CREDIT / (TOTAL_CREDIT + TOTAL_DEBIT) * 100) : 0}%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ marginBottom: 8 }}><div style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Credit</div><div className="serif" style={{ fontSize: "1.2rem", fontWeight: 700, color: cr }}>{fmtShort(TOTAL_CREDIT)}</div></div>
                        <div><div style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Debit</div><div className="serif" style={{ fontSize: "1.2rem", fontWeight: 700, color: dr }}>{fmtShort(TOTAL_DEBIT)}</div></div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>TX COUNT ACTIVITY</div>
                    <LineChart data={HOURLY} color={T.accent} isDark={isDark} />
                  </div>
                </div>
              </div>
              <div className="card" style={{ animationDelay: "0.2s" }}>
                <SecHdr icon="📑" label="Volume by Category" />
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
                    {CAT_STATS.map(c => (
                      <div key={c.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                          <span style={{ fontSize: "0.82rem", color: T.textPrimary, fontWeight: 600 }}>{c.name}</span>
                          <span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 700 }}>{c.count} txn</span>
                        </div>
                        <div className="progress-track"><div className="progress-fill" style={{ width: `${CAT_STATS[0]?.volume > 0 ? (c.volume / CAT_STATS[0].volume) * 100 : 0}%` }} /></div>
                        <div className="serif" style={{ fontSize: "0.75rem", color: cr, marginTop: 4, fontWeight: 700 }}>{fmtShort(c.volume)}</div>
                      </div>
                    ))}
                    {CAT_STATS.length === 0 && <div style={{ color: T.textMuted, fontSize: "0.8rem" }}>No category data available</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRANSACTIONS */}
          {activeView === "transactions" && (
            <div className="card">
              <div style={{ background: T.accentLight, borderBottom: `2px solid ${T.accentBorder}`, padding: "12px 18px", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                {[[`▲ ${fmtShort(filtCredit)}`, cr, "credit total"], [`▼ ${fmtShort(filtDebit)}`, dr, "debit total"], [`${filtered.length} txn`, T.textMuted, "matching"], [`${filtered.filter(t => t.flags?.length > 0).length} flagged`, warn, "need review"]].map(([v, c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="serif" style={{ fontSize: "0.85rem", fontWeight: 700, color: c }}>{v}</span>
                    <span style={{ fontSize: "0.7rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{l}</span>
                  </div>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase" }}>Sort:</span>
                  {[["time", "Time"], ["amount", "Amount"]].map(([k, l]) => (
                    <button key={k} onClick={() => { if (sortBy === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else setSortBy(k); }} className="pill" style={{ color: sortBy === k ? T.accent : T.textMuted, borderColor: sortBy === k ? T.accent : T.pillBorder, background: sortBy === k ? T.pillActiveBg : T.pillBg }}>{l} {sortBy === k ? (sortDir === "desc" ? "↓" : "↑") : ""}</button>
                  ))}
                </div>
              </div>
              <div style={{ overflow: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>#</th><th className="sort-btn" onClick={() => { setSortBy("time"); setSortDir(d => d === "asc" ? "desc" : "asc"); }}>TIME {sortBy === "time" ? (sortDir === "desc" ? "↓" : "↑") : ""}</th><th>TYPE</th><th className="sort-btn" onClick={() => { setSortBy("amount"); setSortDir(d => d === "asc" ? "desc" : "asc"); }}>AMOUNT {sortBy === "amount" ? (sortDir === "desc" ? "↓" : "↑") : ""}</th><th>CATEGORY</th><th>SENDER</th><th>RECEIVER</th><th>TX ID</th><th>OPERATOR</th><th>FLAGS</th><th style={{ width: 60 }}>ACTIONS</th></tr></thead>
                  <tbody>
                    {filtered.map((tx, i) => <>
                      <tr
                        key={tx.id}
                        className={`tx-row ${tx.flags?.length > 0 ? "flagged" : ""} ${tx._isAadhar ? "aadhar-row" : ""}`}
                        onClick={() => tx._isAadhar ? setSelectedAadhar(tx._aadharData!) : setSelectedTx(tx)}
                        onMouseEnter={() => tx._aadharData && setHoveredAadhar(tx._aadharData)}
                        onMouseLeave={() => setHoveredAadhar(null)}
                        onMouseMove={handleMouseMove}
                      >
                        <td><span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 700 }}>{i + 1}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textSecondary, fontWeight: 500 }}>{tx.time}</span></td>
                        <td><span style={{ fontSize: "0.72rem", fontWeight: 800, color: tx.type === "credit" ? cr : dr, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tx.type === "credit" ? "▲ CR" : "▼ DR"}</span></td>
                        <td><span className="serif" style={{ fontSize: "0.9rem", fontWeight: 700, color: tx.type === "credit" ? cr : dr }}>Rs.{fmt(parseFloat(tx.amount || "0"))}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: tx._isAadhar ? T.aadharText : T.textSecondary, fontWeight: tx._isAadhar ? 700 : 400 }}>{tx.category}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textPrimary, fontWeight: 600 }}>{tx.senderName || "-"}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textSecondary }}>{tx.receiverName || "-"}</span></td>
                        <td><span className="mono" style={{ fontSize: "0.68rem", color: T.textMuted }}>{(tx.txId || "-").slice(0, 16)}...</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textSecondary }}>{(tx.operator || "Admin").split(" ")[0]}</span></td>
                        <td>{tx.flags?.length > 0 ? <span style={{ fontSize: "0.85rem" }}>⚠️</span> : <span style={{ color: T.divider, fontSize: "0.75rem" }}>-</span>}</td>
                        <td onClick={e => e.stopPropagation()}>
                          {tx._isAadhar && (
                            <button className="btn btn-d" onClick={() => setDeleteConfirm(tx._aadharData!.id)} style={{ fontSize: 10, padding: "4px 8px" }} title="Delete Aadhar record">
                              <Ico.Trash />
                            </button>
                          )}
                        </td>
                      </tr>
                    </>)}
                  </tbody>
                </table>
                {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: T.textMuted, fontSize: "0.85rem", fontWeight: 600 }}>NO TRANSACTIONS MATCH FILTERS</div>}
              </div>
            </div>
          )}

          {/* OPERATORS */}
          {activeView === "operators" && (
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <SecHdr icon="👥" label="Operator Performance - Today" />
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: "0.85rem", color: T.textSecondary, marginBottom: 16 }}>Individual breakdown & accountability</div>
                  {OPERATOR_STATS.map((op, i) => (
                    <div key={op.name} className="op-card" style={{ animationDelay: `${i * 0.08}s` }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{ textAlign: "center", flexShrink: 0 }}>
                          <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, fontFamily: "'DM Sans',sans-serif", flexShrink: 0, background: i === 0 ? T.accentLight : T.inputBg, border: `2px solid ${i === 0 ? T.accent : T.inputBorder}`, color: i === 0 ? T.accent : T.textMuted }}>{op.avatar}</div>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: op.online ? "#22c55e" : T.textMuted, margin: "4px auto 0" }} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "1rem", color: T.textPrimary, marginBottom: 2 }}>{op.name}{i === 0 && op.total > 0 && <span style={{ marginLeft: 8, fontSize: "0.65rem", background: T.tagBg, border: `1px solid ${T.accentBorder}`, color: T.tagText, padding: "2px 8px", borderRadius: 20, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>Top</span>}</div>
                              <div style={{ fontSize: "0.78rem", color: T.textSecondary }}>{op.online ? "Online now" : "Offline"} . {op.total} transactions handled</div>
                            </div>
                            <div style={{ textAlign: "right" }}>{op.flagged > 0 &&< div style={{ fontSize: "0.78rem", color: warn, fontWeight: 700 }}>⚠ {op.flagged} flagged</div>}</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
                          {[["CREDIT", fmtShort(op.credit), cr], ["DEBIT", fmtShort(op.debit), dr], ["NET", fmtShort(Math.abs(op.credit - op.debit)), op.credit >= op.debit ? success : dr]].map(([l, v, c]) => (
                            <div key={l} className="op-stat-box"><div style={{ fontSize: "0.65rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{l}</div><div className="serif" style={{ fontSize: "1.1rem", fontWeight: 700, color: c }}>{v}</div></div>
                          ))}
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 600 }}>Activity share</span>
                            <span style={{ fontSize: "0.7rem", color: T.textSecondary, fontWeight: 700 }}>{maxOpTotal > 0 ? Math.round(op.total / maxOpTotal * 100) : 0}% of max</span>
                          </div>
                          <div className="progress-track"><div className="progress-fill" style={{ width: `${maxOpTotal > 0 ? (op.total / maxOpTotal) * 100 : 0}%`, background: i === 0 ? T.accent : T.divider }} /></div>
                        </div>
                      </div>
                    </div>
                    </div>
                  ))}
              </div>
            </div>
            </div>
          )}

        {/* RECONCILE */}
        {activeView === "reconcile" && (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <SecHdr icon="📋" label="Reconciliation Report" />
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: "0.85rem", color: T.textSecondary, marginBottom: 16 }}>End-of-day mismatch analysis</div>
                <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  {[{ label: "GROSS CREDIT", val: `Rs.${fmt(TOTAL_CREDIT)}`, color: cr, sub: `${mergedTransactions.filter(t => t.type === "credit").length} transactions` }, { label: "GROSS DEBIT", val: `Rs.${fmt(TOTAL_DEBIT)}`, color: dr, sub: `${mergedTransactions.filter(t => t.type === "debit").length} transactions` }, { label: "NET POSITION", val: `${NET >= 0 ? "+" : "-"}Rs.${fmt(Math.abs(NET))}`, color: NET >= 0 ? success : dr, sub: NET >= 0 ? "Surplus" : "Deficit" }].map(c => (
                    <div key={c.label} className="kpi-card"><div className="kpi-label">{c.label}</div><div className="kpi-val" style={{ color: c.color }}>{c.val}</div><div className="kpi-sub">{c.sub}</div></div>
                  ))}
                </div>
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>Issues Requiring Attention</div>
                  {mergedTransactions.filter(t => t.flags?.length > 0).length === 0 ? (
                    <div style={{ padding: 20, background: isDark ? "rgba(21,128,61,0.1)" : "#f0fdf4", borderRadius: 8, border: `1px solid ${isDark ? "rgba(21,128,61,0.3)" : "#dcfce7"}`, color: success, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}><span style={{ fontSize: 16 }}>✅</span> All transactions clean. No flags detected today.</div>
                  ) : mergedTransactions.filter(t => t.flags?.length > 0).slice(0, 5).map((tx, i) => (
                    <div key={tx.id} style={{ background: isDark ? "rgba(194,65,12,0.08)" : "#fff7ed", border: `1px solid ${isDark ? "rgba(194,65,12,0.25)" : "#fed7aa"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start", animation: `fadeUp 0.3s ease ${i * 0.1}s both` }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: warn }}>Flagged Transaction - {tx.txId || tx.id.slice(0, 8)}</span>
                          <span className="serif" style={{ fontSize: "0.8rem", color: dr, fontWeight: 700 }}>Rs.{fmt(parseFloat(tx.amount || "0"))}</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: isDark ? "#fdba74" : "#c2410c", marginTop: 3 }}>{tx.senderName || "Unknown"} → {tx.receiverName || "Unknown"} . {tx.time} . by {tx.operator}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  {["⬇ Export CSV", "⬇ Export PDF", "📤 Send to WhatsApp"].map(label => <button key={label} className="btn btn-g" style={{ fontSize: 12 }}>{label}</button>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AADHAR */}
        {activeView === "aadhar" && (
          <div>
            {/* Aadhar Card Search */}
            <div className="card" style={{ marginBottom: 16 }}>
              <SecHdr icon="🆔" label="Aadhar Card Lookup" />
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                    <input
                      value={aadharCardSearch}
                      onChange={e => setAadharCardSearch(e.target.value)}
                      placeholder="Search by Aadhar number or name..."
                      className="inp"
                      style={{ paddingLeft: 36, fontSize: 14 }}
                    />
                  </div>
                  {aadharCardSearch && (
                    <button className="btn btn-g" onClick={() => setAadharCardSearch("")}><Ico.X /></button>
                  )}
                </div>

                {aadharCardSearch && aadharCardResults.length === 0 && (
                  <div style={{ textAlign: "center", padding: 20, color: T.textMuted, fontSize: "0.85rem" }}>No matching Aadhar records found</div>
                )}

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                  {(aadharCardSearch ? aadharCardResults : aadharScans.slice(0, 3)).map(a => (
                    <AadharCard
                      key={a.id}
                      scan={a}
                      totalAmount={aadharTotals.get(a.aadhar_number || a.id) || 0}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Aadhar Records Table */}
            <div className="card">
              <div style={{ background: T.aadharHighlight, borderBottom: `2px solid ${T.aadharBorder}`, padding: "12px 18px", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="serif" style={{ fontSize: "0.9rem", fontWeight: 700, color: T.aadharText }}>{filteredAadhar.length} AADHAR RECORDS</span>
                  <span style={{ fontSize: "0.7rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{aadharScans.length} total</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="serif" style={{ fontSize: "0.85rem", fontWeight: 700, color: cr }}>Rs.{fmtShort(filteredAadhar.reduce((a, s) => a + (s.amount || 0), 0))}</span>
                  <span style={{ fontSize: "0.7rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>total amount</span>
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                  {/* Select All */}
                  <button className="pill" onClick={handleSelectAllFiltered} style={{ fontSize: 10 }}>
                    {selectAllFiltered ? "DESELECT ALL" : "SELECT ALL FILTERED"}
                  </button>

                  {/* Bulk Delete */}
                  {selectedRows.size > 0 && (
                    <button className="btn btn-d" onClick={() => setBulkDeleteConfirm(true)} style={{ fontSize: 11, padding: "6px 12px" }}>
                      <Ico.Trash /> DELETE ({selectedRows.size})
                    </button>
                  )}

                  <span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase" }}>Sort:</span>
                  {[["time", "Time"], ["amount", "Amount"]].map(([k, l]) => (
                    <button key={k} onClick={() => { if (sortBy === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else setSortBy(k); }} className="pill" style={{ color: sortBy === k ? T.accent : T.textMuted, borderColor: sortBy === k ? T.accent : T.pillBorder, background: sortBy === k ? T.pillActiveBg : T.pillBg, fontSize: 10 }}>
                      {l} {sortBy === k ? (sortDir === "desc" ? "↓" : "↑") : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aadhar search within table */}
              <div style={{ padding: "10px 18px", borderBottom: `1px solid ${T.divider}` }}>
                <div style={{ position: "relative", maxWidth: 300 }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                  <input
                    value={aadharSearch}
                    onChange={e => setAadharSearch(e.target.value)}
                    placeholder="Filter Aadhar records..."
                    className="inp"
                    style={{ paddingLeft: 30, fontSize: 12, padding: "6px 10px 6px 30px" }}
                  />
                </div>
              </div>

              <div style={{ overflow: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}><input type="checkbox" checked={selectAllFiltered} onChange={handleSelectAllFiltered} style={{ cursor: "pointer" }} /></th>
                      <th>#</th>
                      <th>TIME</th>
                      <th>AADHAR NO</th>
                      <th>NAME</th>
                      <th>DOB</th>
                      <th>GENDER</th>
                      <th>AMOUNT</th>
                      <th>OPERATOR</th>
                      <th>STATUS</th>
                      <th style={{ width: 80 }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAadhar.map((a, i) => (
                      <tr
                        key={a.id}
                        className="aadhar-row"
                        onClick={() => setSelectedAadhar(a)}
                        onMouseEnter={() => setHoveredAadhar(a)}
                        onMouseLeave={() => setHoveredAadhar(null)}
                        onMouseMove={handleMouseMove}
                      >
                        <td onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedRows.has(a.id)}
                            onChange={() => handleRowSelect(a.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td><span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 700 }}>{i + 1}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textSecondary, fontWeight: 500 }}>{formatTime(a.created_at)}</span></td>
                        <td><span className="mono" style={{ fontSize: "0.82rem", fontWeight: 700, color: T.textPrimary }}>{maskAadhar(a.aadhar_number)}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textPrimary, fontWeight: 600 }}>{a.full_name || "-"}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textSecondary }}>{a.dob || "-"}</span></td>
                        <td><span style={{ fontSize: "0.72rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase" }}>{a.gender || "-"}</span></td>
                        <td><span className="serif" style={{ fontSize: "0.9rem", fontWeight: 700, color: cr }}>Rs.{fmt(a.amount || 0)}</span></td>
                        <td><span style={{ fontSize: "0.78rem", color: T.textSecondary }}>{a.operator_name}</span></td>
                        <td>
                          {a.is_verified ? (
                            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: success, background: isDark ? "rgba(21,128,61,0.15)" : "#f0fdf4", padding: "2px 8px", borderRadius: 10, border: `1px solid ${isDark ? "rgba(21,128,61,0.3)" : "#86efac"}` }}>✓ VERIFIED</span>
                          ) : (
                            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: warn, background: isDark ? "rgba(194,65,12,0.15)" : "#fff7ed", padding: "2px 8px", borderRadius: 10, border: `1px solid ${isDark ? "rgba(194,65,12,0.3)" : "#fed7aa"}` }}>⚠ PENDING</span>
                          )}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <button
                            className="btn btn-d"
                            onClick={() => setDeleteConfirm(a.id)}
                            style={{ fontSize: 10, padding: "4px 8px" }}
                            title="Delete (Main Admin only)"
                          >
                            <Ico.Trash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAadhar.length === 0 && (
                  <div style={{ padding: 40, textAlign: "center", color: T.textMuted, fontSize: "0.85rem", fontWeight: 600 }}>NO AADHAR RECORDS MATCH FILTERS</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div >

    {/* ── TX DETAIL DRAWER ── */ }
  {
    selectedTx && (
      <>
        <div className="drawer-overlay" onClick={() => setSelectedTx(null)} />
        <div className="detail-drawer">
          <div style={{ background: T.accentLight, borderBottom: `2px solid ${T.accentBorder}`, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "0.85rem", color: T.accent, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>{selectedTx.txId || selectedTx.id.slice(0, 8)}</span>
            <button onClick={() => setSelectedTx(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 18, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = T.rowHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Ico.X /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
            <div style={{ background: selectedTx.type === "credit" ? T.accentLight : isDark ? "rgba(220,38,38,0.1)" : "#fff1f2", border: `2px solid ${selectedTx.type === "credit" ? T.accentBorder : isDark ? "rgba(220,38,38,0.3)" : "#fca5a5"}`, borderRadius: 12, padding: "18px", marginBottom: 18, textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: T.textSecondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{selectedTx.type.toUpperCase()}</div>
              <div className="serif" style={{ fontSize: "2.2rem", fontWeight: 900, color: selectedTx.type === "credit" ? T.accent : dr, lineHeight: 1 }}>Rs.{fmt(parseFloat(selectedTx.amount || "0"))}</div>
            </div>
            {[["TX ID", selectedTx.txId, "mono"], ["Time", selectedTx.time, "mono"], ["Category", selectedTx.category, ""], ["Sender", selectedTx.senderName, ""], ["Receiver", selectedTx.receiverName, ""], ["Operator", selectedTx.operator, ""]].map(([l, v, cls]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.divider}` }}>
                <span style={{ fontSize: "0.78rem", color: T.textMuted, fontWeight: 600 }}>{l}</span>
                <span className={cls} style={{ fontSize: "0.82rem", color: T.textPrimary, fontWeight: 700, textAlign: "right", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", fontFamily: cls === "mono" ? "'JetBrains Mono',monospace" : "inherit" }}>{v || "-"}</span>
              </div>
            ))}
            {selectedTx.flags?.length > 0 && (
              <div style={{ marginTop: 14, background: isDark ? "rgba(194,65,12,0.08)" : "#fff7ed", border: `1px solid ${isDark ? "rgba(194,65,12,0.25)" : "#fed7aa"}`, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: "0.72rem", color: warn, fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠️ FLAGGED TRANSACTION</div>
                <div style={{ fontSize: "0.8rem", color: isDark ? "#fdba74" : "#9a3412" }}>Marked for review. Verify with operator before settlement.</div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  {/* ── AADHAR DETAIL DRAWER ── */ }
  {
    selectedAadhar && (
      <>
        <div className="drawer-overlay" onClick={() => setSelectedAadhar(null)} />
        <div className="detail-drawer">
          <div style={{ background: T.aadharHighlight, borderBottom: `2px solid ${T.aadharBorder}`, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "0.85rem", color: T.aadharText, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>AADHAR DETAIL</span>
            <button onClick={() => setSelectedAadhar(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 18, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = T.rowHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Ico.X /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
            {/* Photo */}
            {selectedAadhar.photo_base64 && (
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <img src={selectedAadhar.photo_base64} alt="Aadhar Photo" style={{ width: 140, height: 175, borderRadius: 8, objectFit: "cover", border: `2px solid ${T.aadharBorder}` }} />
              </div>
            )}

            {/* Aadhar Card Mini */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <AadharCard scan={selectedAadhar} totalAmount={aadharTotals.get(selectedAadhar.aadhar_number || selectedAadhar.id) || 0} isDark={isDark} />
            </div>

            <div style={{ background: isDark ? "rgba(16,185,129,0.08)" : "#f0fdf4", border: `2px solid ${T.aadharBorder}`, borderRadius: 12, padding: "18px", marginBottom: 18, textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: T.textSecondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>TRANSACTION AMOUNT</div>
              <div className="serif" style={{ fontSize: "2.2rem", fontWeight: 900, color: T.aadharText, lineHeight: 1 }}>Rs.{fmt(selectedAadhar.amount || 0)}</div>
            </div>

            {[["Aadhar Number", maskAadhar(selectedAadhar.aadhar_number), "mono"], ["Full Name", selectedAadhar.full_name, ""], ["Date of Birth", selectedAadhar.dob, ""], ["Gender", selectedAadhar.gender, ""], ["Address", selectedAadhar.address, ""], ["Last 4 Digits (QR)", selectedAadhar.last_4_digits, "mono"], ["Operator", selectedAadhar.operator_name, ""], ["Created At", formatDate(selectedAadhar.created_at) + " " + formatTime(selectedAadhar.created_at), "mono"]].map(([l, v, cls]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.divider}` }}>
                <span style={{ fontSize: "0.78rem", color: T.textMuted, fontWeight: 600 }}>{l}</span>
                <span className={cls} style={{ fontSize: "0.82rem", color: T.textPrimary, fontWeight: 700, textAlign: "right", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", fontFamily: cls === "mono" ? "'JetBrains Mono',monospace" : "inherit" }}>{v || "-"}</span>
              </div>
            ))}

            {selectedAadhar.raw_ocr_text && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: "0.72rem", color: T.textMuted, fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>RAW OCR TEXT</div>
                <div style={{ fontSize: "0.75rem", color: T.textSecondary, background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 8, padding: "10px 12px", maxHeight: 120, overflow: "auto", fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap" }}>{selectedAadhar.raw_ocr_text}</div>
              </div>
            )}

            {selectedAadhar.verification_note && (
              <div style={{ marginTop: 14, background: selectedAadhar.is_verified ? (isDark ? "rgba(21,128,61,0.1)" : "#f0fdf4") : (isDark ? "rgba(194,65,12,0.08)" : "#fff7ed"), border: `1px solid ${selectedAadhar.is_verified ? (isDark ? "rgba(21,128,61,0.3)" : "#dcfce7") : (isDark ? "rgba(194,65,12,0.25)" : "#fed7aa")}`, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: "0.72rem", color: selectedAadhar.is_verified ? success : warn, fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{selectedAadhar.is_verified ? "✓ VERIFICATION NOTE" : "⚠ VERIFICATION WARNING"}</div>
                <div style={{ fontSize: "0.8rem", color: isDark ? (selectedAadhar.is_verified ? "#86efac" : "#fdba74") : (selectedAadhar.is_verified ? "#15803d" : "#9a3412") }}>{selectedAadhar.verification_note}</div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  {/* ── DELETE CONFIRM MODAL ── */ }
  {
    deleteConfirm && (
      <>
        <div className="drawer-overlay" style={{ zIndex: 250 }} onClick={() => setDeleteConfirm(null)} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 16, padding: 24, zIndex: 251, minWidth: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>Confirm Delete</div>
          <div style={{ fontSize: "0.85rem", color: T.textSecondary, marginBottom: 20 }}>Are you sure you want to delete this Aadhar record? This action cannot be undone. Only Main Admin can perform this action.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-g" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button className="btn btn-d" onClick={() => handleDeleteAadhar(deleteConfirm)}>Delete</button>
          </div>
        </div>
      </>
    )
  }

  {/* ── BULK DELETE CONFIRM MODAL ── */ }
  {
    bulkDeleteConfirm && (
      <>
        <div className="drawer-overlay" style={{ zIndex: 250 }} onClick={() => setBulkDeleteConfirm(false)} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 16, padding: 24, zIndex: 251, minWidth: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>Confirm Bulk Delete</div>
          <div style={{ fontSize: "0.85rem", color: T.textSecondary, marginBottom: 20 }}>Are you sure you want to delete {selectedRows.size} selected Aadhar records? This action cannot be undone. Only Main Admin can perform this action.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-g" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
            <button className="btn btn-d" onClick={handleBulkDelete}>Delete {selectedRows.size} Records</button>
          </div>
        </div>
      </>
    )
  }
    </div >
  );
}