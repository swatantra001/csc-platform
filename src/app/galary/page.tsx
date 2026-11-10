
// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { getGalleryImagesAction } from "@/app/actions/admin";
// import Link from "next/link";
// import { useAuth } from "@/components/AuthProvider";

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
//   Home:     () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
//   Chevron:  () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
//   Close:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
//   Prev:     () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
//   Next:     () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
//   Image:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
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

// // ─── CSS BUILDER ───────────────────────────────────────────────────────────────
// function buildCss(T: ThemeTokens): string {
//   return `
// @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// .mono{font-family:'DM Sans',sans-serif;}

// /* ── NAV LINK ── */
// .top-nav-link{
//   display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
//   font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
//   transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
// }
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
// .top-nav-link.on{background:${T.navActiveBg};color:${T.navActiveText};border-color:transparent;}

// /* ── THEME TOGGLE ── */
// .tog{
//   display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
//   border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
//   color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
//   transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
// }
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

// /* ── GRID ITEM ── */
// .grid-item{aspect-ratio:4/3;border-radius:12px;overflow:hidden;cursor:pointer;position:relative;border:1px solid ${T.cardBorder};box-shadow:${T.cardShadow};transition:all .3s;}
// .grid-item:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,0.15);}
// .grid-item img{width:100%;height:100%;object-fit:cover;transition:transform .4s cubic-bezier(0.4,0,0.2,1);}
// .grid-item:hover img{transform:scale(1.08);}
// .grid-item-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.8),transparent);opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;padding:12px;}
// .grid-item:hover .grid-item-overlay{opacity:1;}

// /* ── LIGHTBOX ── */
// .lightbox-backdrop{position:fixed;inset:0;background:rgba(6,11,20,0.96);backdrop-filter:blur(12px);z-index:1000;display:flex;align-items:center;justify-content:center;}
// .lightbox-close{position:absolute;top:24px;right:24px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;width:44px;height:44px;border-radius:50%;font-size:1.2rem;cursor:pointer;transition:all .2s;z-index:1010;display:flex;align-items:center;justify-content:center;}
// .lightbox-close:hover{background:#dc2626;border-color:#dc2626;transform:scale(1.1);}
// .lightbox-content{position:relative;width:100%;max-width:1200px;height:80vh;display:flex;align-items:center;justify-content:center;padding:0 80px;}
// .lightbox-img-wrapper{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
// .lightbox-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.6);}
// .lightbox-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;width:56px;height:56px;border-radius:50%;font-size:1.2rem;cursor:pointer;transition:all .2s;z-index:1010;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
// .lightbox-btn:hover{background:#fff;color:#060b14;transform:translateY(-50%) scale(1.1);}
// .btn-prev{left:16px;}
// .btn-next{right:16px;}
// .lightbox-caption{position:absolute;bottom:-60px;left:0;right:0;text-align:center;color:#fff;}
// .lightbox-title{font-size:1.25rem;font-weight:700;margin-bottom:4px;font-family:'DM Serif Display',serif;}
// .lightbox-counter{font-size:0.85rem;color:${T.textMuted};font-weight:600;letter-spacing:1px;}

// /* ── FOOTER ── */
// .footer-bar{background:${T.navBg};border-top:3px solid ${T.navBottomBorder};padding:18px 0;text-align:center;color:rgba(255,255,255,0.5);font-size:0.75rem;}

// /* ── ANIMS ── */
// @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
// @keyframes spin{to{transform:rotate(360deg)}}
// `;
// }

// export default function PublicGallery() {
//   const [isDark, setIsDark] = useState(false);
//   const T = isDark ? THEMES.dark : THEMES.light;

//   const [images, setImages] = useState<any[]>([]);
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

//   	const { user, isLoggedIn, logout, loading: authLoading } = useAuth();
  

//   // ─── 1. FETCH IMAGES (Preserved) ───
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const data = await getGalleryImagesAction();
//         setImages(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetch();
//   }, []);

//   useEffect(() => {
// 		const savedTheme = localStorage.getItem("csc_theme");
// 		if (savedTheme) setIsDark(savedTheme === "dark");
// 		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
// 	}, [user]);

//   // ─── 2. AUTO-SLIDE LOGIC (Preserved) ───
//   useEffect(() => {
//     if (selectedIndex === null || images.length <= 1) return;
    
//     const timer = setInterval(() => {
//       setSelectedIndex((prev) => (prev! + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(timer);
//   }, [selectedIndex, images.length]);

//   // ─── 3. KEYBOARD CONTROLS (Preserved) ───
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (selectedIndex === null) return;
      
//       if (e.key === "Escape") {
//         setSelectedIndex(null);
//       } else if (e.key === "ArrowRight") {
//         setSelectedIndex((prev) => (prev! + 1) % images.length);
//       } else if (e.key === "ArrowLeft") {
//         setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [selectedIndex, images.length]);

//   if (images.length === 0) return (
//     <div style={{ 
//       minHeight: "100vh", 
//       background: T.pageBg, 
//       display: "flex", 
//       flexDirection: "column", 
//       alignItems: "center", 
//       justifyContent: "center",
//       color: T.textMuted,
//       transition: "background .25s"
//     }}>
//       <div style={{ 
//         width: 32, 
//         height: 32, 
//         border: `3px solid ${T.divider}`, 
//         borderTopColor: T.accent, 
//         borderRadius: "50%", 
//         animation: "spin 1s linear infinite",
//         marginBottom: 16 
//       }} />
//       <span style={{ fontWeight: 700, fontSize: 14 }}>Loading Gallery...</span>
//     </div>
//   );

//   // ─── HANDLERS ─── (Preserved Exactly)
// 	const toggleTheme = () => {
// 		const newDark = !isDark; setIsDark(newDark);
// 		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
// 	};

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s" }}>
//       <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />
//       <style>{`
//         @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes spin{to{transform:rotate(360deg)}}
//       `}</style>

//       {/* ════════════════════════════════════════════════════════
//           HEADER
//       ════════════════════════════════════════════════════════ */}
//       <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
//         <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//           <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
//             <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
//             <div>
//               <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
//                 Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>DIGITAL SEVA</div>
//             </div>
//           </Link>

//           <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

//           <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
//             {NAV_LINKS.map(l => (
//               <a key={l.href} href={l.href} className="top-nav-link">
//                 <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
//               </a>
//             ))}
//           </nav>

//           <button className="tog" onClick={toggleTheme}>
//             <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
//           </button>
//         </div>
//       </header>

//       {/* ════════════════════════════════════════════════════════
//           BREADCRUMB
//       ════════════════════════════════════════════════════════ */}
//       <div style={{ background: T.cardBg, borderBottom: `1px solid ${T.divider}`, padding: "8px 0" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.textMuted }}>
//           <Link href="/" style={{ color: T.accent, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
//             <Ico.Home /> Home
//           </Link>
//           <Ico.Chevron />
//           <span style={{ color: T.textSecondary, fontWeight: 600 }}>Work Portfolio</span>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           HERO
//       ════════════════════════════════════════════════════════ */}
//       <div style={{
//         background: isDark 
//           ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" 
//           : "linear-gradient(135deg, #1e3a8a 0%, #312e81 60%, #4338ca 100%)",
//         padding: "60px 24px 80px",
//         textAlign: "center",
//         position: "relative",
//         overflow: "hidden"
//       }}>
//         <div style={{
//           position: "absolute", inset: 0,
//           background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='white' opacity='0.06'/%3E%3C/svg%3E") repeat`
//         }} />
//         <div style={{ position: "relative", zIndex: 1 }}>
//           <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2rem, 4vw, 2.8rem)", marginBottom: 8, lineHeight: 1.2 }}>
//             Work Portfolio
//           </h1>
//           <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
//             A showcase of successful applications and services provided to our citizens.
//           </p>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           MAIN GRID
//       ════════════════════════════════════════════════════════ */}
//       <div style={{ maxWidth: 1100, margin: "-50px auto 60px", padding: "0 24px", position: "relative", zIndex: 10, flex: 1 }}>
//         <div style={{
//           background: T.cardBg,
//           borderRadius: 16,
//           padding: 24,
//           boxShadow: T.cardShadow,
//           border: `1px solid ${T.cardBorder}`,
//           animation: "fadeUp 0.5s ease"
//         }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
//             {images.map((img, i) => (
//               <div 
//                 key={img.id} 
//                 className="grid-item"
//                 onClick={() => setSelectedIndex(i)}
//                 style={{ animation: `fadeUp 0.5s ease ${i * 0.03}s both` }}
//               >
//                 <img src={img.url} alt={img.title} loading="lazy" />
//                 <div className="grid-item-overlay">
//                   <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                     {img.title}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           LIGHTBOX
//       ════════════════════════════════════════════════════════ */}
//       <AnimatePresence>
//         {selectedIndex !== null && (
//           <motion.div 
//             className="lightbox-backdrop"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <button className="lightbox-close" onClick={() => setSelectedIndex(null)} title="Close (Esc)">
//               <Ico.Close />
//             </button>

//             <div className="lightbox-content">
//               <button 
//                 className="lightbox-btn btn-prev" 
//                 onClick={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)}
//                 title="Previous (Left Arrow)"
//               >
//                 <Ico.Prev />
//               </button>

//               <div className="lightbox-img-wrapper">
//                 <AnimatePresence mode="wait">
//                   <motion.img
//                     key={images[selectedIndex].id}
//                     src={images[selectedIndex].url}
//                     alt={images[selectedIndex].title}
//                     className="lightbox-img"
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 1.05 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 </AnimatePresence>

//                 <div className="lightbox-caption">
//                   <h3 className="lightbox-title">{images[selectedIndex].title}</h3>
//                   <div className="lightbox-counter">
//                     {selectedIndex + 1} / {images.length} · Auto-sliding
//                   </div>
//                 </div>
//               </div>

//               <button 
//                 className="lightbox-btn btn-next" 
//                 onClick={() => setSelectedIndex((selectedIndex + 1) % images.length)}
//                 title="Next (Right Arrow)"
//               >
//                 <Ico.Next />
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ════════════════════════════════════════════════════════
//           FOOTER
//       ════════════════════════════════════════════════════════ */}
//       <div className="footer-bar">
//         <p>© 2026 Srilal CSC Center · Verified Portfolio</p>
//       </div>
//     </div>
//   );
// }

















// src/app/galary/page.tsx — Public gallery ("galary" route spelling kept as supplied)
// ─────────────────────────────────────────────────────────────────────────────
// KEPT: getGalleryImagesAction fetch; selectedIndex lightbox state; auto-slide
//   every 4000ms while the lightbox is open and >1 image; keyboard controls
//   (Escape closes, ArrowRight/ArrowLeft navigate with wrap-around); useAuth
//   destructuring (user, isLoggedIn, logout, authLoading) exactly as supplied;
//   theme effect reading localStorage "csc_theme" then prefers-color-scheme
//   (with its [user] dependency, as supplied); toggleTheme writing csc_theme;
//   breadcrumb Home / Work Portfolio; hero copy; footer copy
//   "© 2026 Srilal CSC Center · Verified Portfolio"; grid images use
//   img.url / img.title with loading="lazy"; lightbox caption + counter
//   "n / total · Auto-sliding".
// REMOVED: the whole THEMES object and ThemeTokens type; buildCss() (Google
//   Fonts @import + global * margin/padding reset + all theme CSS); every
//   inline style object and both <style> blocks; gradients (hero, brand mark,
//   grid overlay); the dotted-pattern background on the hero; serif display
//   type; framer-motion (motion / AnimatePresence) — the lightbox is now a
//   plain conditional render; emoji used as icons (🏛️ brand mark, nav icons)
//   — lucide icons instead; NODE_ENV production/localhost absolute URLs in
//   NAV_LINKS — relative routes only; staggered fadeUp entrance animation.
// FIXED: one accent in both themes (deep blue) via Tailwind dark: classes;
//   a dark-class sync effect on document.documentElement so dark: variants
//   work (requires darkMode: "class" in tailwind.config.js).
// FLAGGED (behaviour kept as supplied, see delivery note): when
//   images.length === 0 the page shows "Loading Gallery..." forever — there
//   is no empty-gallery state, so an empty gallery never resolves. The theme
//   effect also re-runs on every user change ([user] dependency, as supplied).
// No new file needed.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import { getGalleryImagesAction } from "@/app/actions/admin";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Image as ImageIcon,
  Landmark,
  LayoutDashboard,
  Loader2,
  Moon,
  Package,
  PenLine,
  Sun,
  User,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts", icon: PenLine, label: "Posts" },
  { href: "/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/status", icon: BarChart3, label: "Status" },
  { href: "/delivery", icon: Package, label: "Delivery" },
];

export default function PublicGallery() {
  const [isDark, setIsDark] = useState(false);

  const [images, setImages] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

  // ─── 1. FETCH IMAGES (Preserved) ───
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getGalleryImagesAction();
        setImages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
   	else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, [user]);

  // Sync the dark class so Tailwind dark: variants apply.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // ─── 2. AUTO-SLIDE LOGIC (Preserved) ───
  useEffect(() => {
    if (selectedIndex === null || images.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev! + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [selectedIndex, images.length]);

  // ─── 3. KEYBOARD CONTROLS (Preserved) ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev! + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  if (images.length === 0)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 text-slate-400 dark:bg-[#0b1220] dark:text-slate-500">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-700 dark:text-blue-400" aria-hidden="true" />
        <span className="text-sm font-bold">Loading Gallery...</span>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      {/* ════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 shrink-0 border-b-2 border-blue-600 bg-[#0b2239] shadow-md dark:border-blue-400 dark:bg-[#081120]">
        <div className="flex h-14 items-center gap-3.5 border-b border-white/10 px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-500">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[17px] font-bold leading-none tracking-tight text-white">
                Srilal<span className="text-blue-300">CSC</span>
              </span>
              <span className="mt-0.5 block text-[9px] tracking-[0.1em] text-white/40">
                DIGITAL SEVA
              </span>
            </span>
          </Link>

          <div className="h-6 w-px shrink-0 bg-white/10" aria-hidden="true" />

          <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white ${
                  l.href === "/galary" ? "bg-blue-600 text-white dark:bg-blue-500" : ""
                }`}
                aria-current={l.href === "/galary" ? "page" : undefined}
              >
                <l.icon className="h-3.5 w-3.5" aria-hidden="true" /> {l.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-blue-300/40 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/65 transition-colors hover:border-blue-400 hover:text-white"
          >
            {isDark ? (
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Moon className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          BREADCRUMB
      ════════════════════════════════════════════════════════ */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111a2e]">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-6 py-2 text-xs text-slate-400 dark:text-slate-500">
          <Link
            href="/"
            className="flex items-center gap-1 font-semibold text-blue-700 no-underline hover:underline dark:text-blue-400"
          >
            <Home className="h-3 w-3" aria-hidden="true" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="font-semibold text-slate-500 dark:text-slate-400">Work Portfolio</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <div className="bg-[#0b2239] px-6 py-14 text-center dark:bg-[#081120]">
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
          Work Portfolio
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-base leading-relaxed text-white/70">
          A showcase of successful applications and services provided to our citizens.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN GRID
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto -mt-8 w-full max-w-5xl flex-1 px-6 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111a2e] sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                aria-label={`Open photo: ${img.title}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-800 dark:focus-visible:outline-blue-400"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
                />
                <span className="absolute inset-0 flex items-end bg-slate-900/60 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="truncate text-sm font-bold text-white">{img.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          LIGHTBOX
      ════════════════════════════════════════════════════════ */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#060b14]/95"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${selectedIndex + 1} of ${images.length}: ${images[selectedIndex].title}`}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            title="Close (Esc)"
            aria-label="Close photo viewer"
            className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:scale-110 hover:bg-red-600 hover:border-red-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="relative flex h-[80vh] w-full max-w-6xl items-center justify-center px-20">
            <button
              type="button"
              onClick={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)}
              title="Previous (Left Arrow)"
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:scale-110 hover:bg-white hover:text-slate-900"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="relative flex h-full w-full items-center justify-center">
              <img
                key={images[selectedIndex].id}
                src={images[selectedIndex].url}
                alt={images[selectedIndex].title}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />

              <div className="absolute -bottom-14 left-0 right-0 text-center text-white">
                <h3 className="text-xl font-bold">{images[selectedIndex].title}</h3>
                <div className="mt-1 text-sm font-semibold text-slate-400">
                  {selectedIndex + 1} / {images.length} · Auto-sliding
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedIndex((selectedIndex + 1) % images.length)}
              title="Next (Right Arrow)"
              aria-label="Next photo"
              className="absolute right-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:scale-110 hover:bg-white hover:text-slate-900"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer className="border-t-2 border-blue-600 bg-[#0b2239] py-4 text-center text-xs text-white/50 dark:border-blue-400 dark:bg-[#081120]">
        <p>© 2026 Srilal CSC Center · Verified Portfolio</p>
      </footer>
    </div>
  );
}




