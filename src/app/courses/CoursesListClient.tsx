// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useAuth } from "@/components/AuthProvider";

// export interface CourseSummary {
//   id: string;
//   title: string;
//   title_hi: string;
//   short_desc: string;
//   category: string;
//   theme: string;
//   banner_url?: string;
//   duration: string;
//   duration_hi: string;
//   fee: number;
//   prebook_amount: number;
//   max_seats: number;
//   filled_seats: number;
//   start_date: string;
//   tags: string[];
//   certification?: string;
// }

// const THEME_MAP: Record<string, { primary: string; dark: string; light: string; accent: string }> = {
//   blue: { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", accent: "#3b82f6" },
//   green: { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", accent: "#22c55e" },
//   red: { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", accent: "#ef4444" },
//   orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", accent: "#f97316" },
//   purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", accent: "#8b5cf6" },
//   teal: { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", accent: "#14b8a6" },
//   indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", accent: "#6366f1" },
//   rose: { primary: "#be123c", dark: "#881337", light: "#fff1f2", accent: "#f43f5e" },
// };

// const THEMES = {
//   light: {
//     pageBg: "#f1f5f9", navBg: "#1e3a8a", navBottomBorder: "#3b82f6",
//     navText: "rgba(255,255,255,0.65)", navTextHover: "#ffffff",
//     navBrand: "#ffffff", navBrandAccent: "#93c5fd",
//     cardBg: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
//     textPrimary: "#1e293b", textSecondary: "#475569", textMuted: "#94a3b8",
//     accent: "#2563eb", accentHover: "#1d4ed8", accentLight: "#eff6ff", accentBorder: "#bfdbfe",
//     inputBg: "#f8fafc", inputBorder: "#e2e8f0", divider: "#e2e8f0",
//     btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff",
//     btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569",
//     pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#64748b",
//     pillActiveBg: "#dbeafe", pillActiveBorder: "#93c5fd", pillActiveText: "#1d4ed8",
//     toggleIcon: "🌙", toggleLabel: "Dark",
//   },
//   dark: {
//     pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b",
//     navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff",
//     navBrand: "#ffffff", navBrandAccent: "#f59e0b",
//     cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
//     textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)",
//     accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)",
//     inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)", divider: "rgba(255,255,255,0.06)",
//     btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000",
//     btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)",
//     pillBg: "rgba(255,255,255,0.03)", pillBorder: "rgba(255,255,255,0.08)", pillText: "rgba(255,255,255,0.4)",
//     pillActiveBg: "rgba(245,158,11,0.15)", pillActiveBorder: "rgba(245,158,11,0.4)", pillActiveText: "#f59e0b",
//     toggleIcon: "☀️", toggleLabel: "Light",
//   },
// } as const;

// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/courses" : "http://localhost:3000/courses", icon: "🎓", label: "Courses" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/delivery" : "http://localhost:3000/delivery", icon: "🚚", label: "Delivery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/verify" : "http://localhost:3000/verify", icon: "✅", label: "Verify Certificate" },
// ];

// const Ico = {
//   Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
//   X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
// };

// function buildCss(T: typeof THEMES.light): string {
//   return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans',sans-serif;}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.divider};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
// .top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
// .pill{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};text-transform:uppercase;}
// .pill:hover{border-color:${T.accent};color:${T.accent};}
// .pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}
// `;
// }

// function formatDate(d: string) {
//   if (!d) return "";
//   try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
//   catch { return d; }
// }

// export default function CoursesListClient({ courses }: { courses: CourseSummary[] }) {
//   const [isDark, setIsDark] = useState(false);
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   const T = isDark ? THEMES.dark : THEMES.light;
//   const { user } = useAuth();

//   useEffect(() => {
//     const saved = localStorage.getItem("csc_theme");
//     if (saved) setIsDark(saved === "dark");
//     else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//   }, [user]);

//   const toggleTheme = () => {
//     const newDark = !isDark;
//     setIsDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

//   const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];

//   const filtered = courses.filter(c => {
//     const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
//       c.short_desc?.toLowerCase().includes(search.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans',sans-serif", transition: "background .25s, color .25s" }}>
//       <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

//       <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
//         <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//           <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
//             <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
//             <div>
//               <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
//                 Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em", fontFamily: "monospace" }}>TRAINING CENTER</div>
//             </div>
//           </a>
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

//       {/* Hero */}
//       <div style={{ background: isDark ? "linear-gradient(135deg,#0f172a,#1e293b)" : "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "60px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
//         <div style={{ position: "relative", zIndex: 1 }}>
//           <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: 12, fontWeight: 700 }}>Computer Courses & Training</h1>
//           <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
//             Professional certification programs, diploma courses, and skill training at Srilal CSC, Shambhuganj, Jaunpur.
//           </p>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <div style={{ maxWidth: 1200, margin: "-24px auto 32px", padding: "0 16px", position: "relative", zIndex: 10 }}>
//         <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 12, boxShadow: T.cardShadow, padding: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
//           <div style={{ position: "relative", flex: 1, minWidth: 280, display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "0 14px" }}>
//             <span style={{ color: T.textMuted, marginRight: 10, display: "flex" }}><Ico.Search /></span>
//             <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
//               style={{ border: "none", background: "transparent", flex: 1, padding: "12px 0", color: T.textPrimary, outline: "none", fontSize: 14 }} />
//             {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", display: "flex" }}><Ico.X /></button>}
//           </div>
//           <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
//             {categories.map(cat => (
//               <button key={cat} className={`pill ${selectedCategory === cat ? "on" : ""}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Grid */}
//       <div style={{ maxWidth: 1200, margin: "0 auto 60px", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24, flex: 1 }}>
//         {filtered.length > 0 ? filtered.map(course => {
//           const t = THEME_MAP[course.theme] || THEME_MAP.blue;
//           const bgImage = course.banner_url ? `url(${course.banner_url})` : `linear-gradient(135deg,${t.dark} 0%,${t.primary} 50%,${t.accent} 100%)`;
//           const seatPercent = Math.round((course.filled_seats / course.max_seats) * 100);
//           const seatsLeft = course.max_seats - course.filled_seats;

//           return (
//             <Link href={`/courses/${course.id}`} key={course.id} style={{
//               background: T.cardBg, borderRadius: 16, overflow: "hidden", textDecoration: "none",
//               display: "flex", flexDirection: "column", boxShadow: T.cardShadow, border: `1px solid ${T.cardBorder}`,
//               transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", position: "relative", color: "inherit"
//             }}
//             onMouseEnter={e => {
//               e.currentTarget.style.transform = "translateY(-6px)";
//               e.currentTarget.style.boxShadow = isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
//               e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1";
//             }}
//             onMouseLeave={e => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow = T.cardShadow;
//               e.currentTarget.style.borderColor = T.cardBorder;
//             }}>
              
//               {/* Seat badge */}
//               <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 6, background: seatsLeft <= 3 ? "rgba(220,38,38,0.9)" : seatsLeft <= 5 ? "rgba(245,158,11,0.9)" : "rgba(16,185,129,0.9)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
//                 <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", animation: seatsLeft <= 3 ? "pulse 1.5s infinite" : "none" }} />
//                 {seatsLeft <= 0 ? "FULL" : `${seatsLeft} seats left`}
//               </div>

//               <div style={{ height: 160, width: "100%", background: bgImage, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
//                 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0) 100%)" }} />
//                 <span style={{ position: "relative", zIndex: 10, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                   {course.category}
//                 </span>
//               </div>

//               <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//                   <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>⏱️ {course.duration}</span>
//                   <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>🗓️ {formatDate(course.start_date)}</span>
//                 </div>
//                 <h3 style={{ fontSize: 17, fontWeight: 800, color: T.textPrimary, lineHeight: 1.4, marginBottom: 8 }}>{course.title}</h3>
//                 <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
//                   {course.short_desc}
//                 </p>

//                 {course.certification && (
//                   <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "6px 12px", background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 8, fontSize: 12, color: T.accent, fontWeight: 600 }}>
//                     <span>🏆</span> {course.certification}
//                   </div>
//                 )}

//                 {/* Progress bar */}
//                 <div style={{ marginBottom: 12 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textMuted, marginBottom: 4 }}>
//                     <span>Seat occupancy</span>
//                     <span>{course.filled_seats}/{course.max_seats}</span>
//                   </div>
//                   <div style={{ background: T.inputBg, borderRadius: 6, height: 6, overflow: "hidden" }}>
//                     <div style={{ width: `${seatPercent}%`, height: "100%", background: seatPercent > 80 ? "#dc2626" : seatPercent > 50 ? "#f59e0b" : T.accent, borderRadius: 6, transition: "width 0.5s" }} />
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div>
//                     <span className="serif" style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>₹{course.fee.toLocaleString("en-IN")}</span>
//                     <span style={{ fontSize: 11, color: T.textMuted, display: "block", marginTop: 2 }}>Pre-book: ₹{course.prebook_amount}</span>
//                   </div>
//                   <div style={{ padding: "8px 16px", borderRadius: 8, background: t.primary, color: "#fff", fontSize: 12, fontWeight: 700 }}>
//                     View Details →
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           );
//         }) : (
//           <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", background: T.cardBg, borderRadius: 16, border: `1.5px dashed ${T.cardBorder}`, color: T.textMuted }}>
//             <div style={{ width: 64, height: 64, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🎓</div>
//             <h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No courses found</h3>
//             <p style={{ fontSize: 14 }}>Try adjusting your search or category filter.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }












"use client";

/**
 * CoursesListClient.tsx — REDESIGNED for
 * D:\csc-platform\src\app\courses\CoursesListClient.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same props as
 * before: CoursesListClient({ courses }: { courses: CourseSummary[] }).
 *
 * DESIGN: a course catalogue — a navy header, a plain hero, a search
 * bar with category pills, and a grid of course cards. Every card has
 * the same shape: banner, seat badge, category, duration and start
 * date, title, two lines of description, certification if there is
 * one, seat occupancy, fee and pre-book amount, and a View Details
 * button. No gradients, no serif display font, no hover tricks that
 * rewrite styles in JS.
 *
 * KEPT, exactly as supplied:
 * - The CourseSummary interface and every field it carries.
 * - THEME_MAP (the 8 per-course theme colours from the database) —
 *   still used for the banner fallback and the View Details button,
 *   as solid colours, not gradients.
 * - The 9 nav links and their labels (Dashboard, Posts, Courses,
 *   Gallery, Notifications, Profile, Status, Delivery, Verify
 *   Certificate).
 * - Search (matches title and short_desc) and the category filter
 *   (categories derived from the courses themselves, "All" first).
 * - The seat badge logic (FULL, or N seats left; red at 3 or fewer,
 *   amber at 5 or fewer, green otherwise), the occupancy bar colours
 *   (>80% red, >50% amber, else blue), fee and pre-book amounts in
 *   Indian formatting, the certification strip, and the "No courses
 *   found" empty state.
 * - The theme state (localStorage csc_theme, system fallback) and
 *   the toggle — plus the `dark` class sync, so Tailwind `dark:`
 *   classes work.
 *
 * CHANGED, small and safe:
 * - Nav links were absolute URLs chosen by NODE_ENV (production
 *   https://srilalsahaj.co.in/... vs http://localhost:3000/...) —
 *   now relative routes (/dashboard, /posts, ...). Same destinations
 *   on every domain, one less place to break when the domain changes.
 * - Icons were emoji (📱 ✏️ 🎓 🖼️ 🔔 👤 📊 🚚 ✅ ⏱️ 🗓️ 🏆 🎓) —
 *   lucide icons now.
 * - The buildCss string is gone: the @import of Google Fonts, the
 *   global * { margin: 0; padding: 0 } reset (dangerous inside a
 *   component — it reset every page the component rendered on), the
 *   fadeIn keyframes, and the .pill / .top-nav-link / .serif classes
 *   are all Tailwind classes now.
 * - Card hover was onMouseEnter/onMouseLeave style mutation —
 *   Tailwind hover: classes now.
 * - The seat badge's pulsing dot referenced a `pulse` keyframe that
 *   does not exist in this file, so it never pulsed — the dot now
 *   uses Tailwind's built-in animate-pulse.
 * - The banner fallback was a 3-stop gradient — now the course
 *   theme's solid dark colour, with the real banner photo on top
 *   when there is one.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Calendar,
  Clock,
  GraduationCap,
  Image as ImageIcon,
  LayoutDashboard,
  Moon,
  PenLine,
  Search,
  Sun,
  Trophy,
  Truck,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export interface CourseSummary {
  id: string;
  title: string;
  title_hi: string;
  short_desc: string;
  category: string;
  theme: string;
  banner_url?: string;
  duration: string;
  duration_hi: string;
  fee: number;
  prebook_amount: number;
  max_seats: number;
  filled_seats: number;
  start_date: string;
  tags: string[];
  certification?: string;
}

// Per-course theme colours, from the database's `theme` field.
const THEME_MAP: Record<string, { primary: string; dark: string; light: string; accent: string }> = {
  blue: { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", accent: "#3b82f6" },
  green: { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", accent: "#22c55e" },
  red: { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", accent: "#ef4444" },
  orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", accent: "#f97316" },
  purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", accent: "#8b5cf6" },
  teal: { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", accent: "#14b8a6" },
  indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", accent: "#6366f1" },
  rose: { primary: "#be123c", dark: "#881337", light: "#fff1f2", accent: "#f43f5e" },
};

const NAV_LINKS = [
  { href: "/dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts", Icon: PenLine, label: "Posts" },
  { href: "/courses", Icon: GraduationCap, label: "Courses" },
  { href: "/galary", Icon: ImageIcon, label: "Gallery" },
  { href: "/notifications", Icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", Icon: User, label: "Profile" },
  { href: "/status", Icon: BarChart3, label: "Status" },
  { href: "/delivery", Icon: Truck, label: "Delivery" },
  { href: "/verify", Icon: BadgeCheck, label: "Verify Certificate" },
];

function formatDate(d: string) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
}

export default function CoursesListClient({ courses }: { courses: CourseSummary[] }) {
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, [user]);

  // Keep the local theme state in sync with the `dark` class so
  // Tailwind's dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.short_desc?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      {/* Header */}
      <header className="z-[100] shrink-0 border-b-2 border-blue-600 bg-[#0b2239] text-white shadow-md dark:border-blue-900">
        <div className="flex h-[54px] items-center gap-3.5 border-b border-white/10 px-5">
          <a href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-lg font-bold text-white">
              SJ
            </span>
            <span className="leading-none">
              <span className="block text-[17px] font-bold tracking-tight text-white">
                Srilal <span className="text-blue-300">CSC</span>
              </span>
              <span className="mt-0.5 block font-mono text-[9px] tracking-[0.1em] text-white/40">
                TRAINING CENTER
              </span>
            </span>
          </a>
          <span className="h-[26px] w-px shrink-0 bg-white/10" aria-hidden />
          <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label="App navigation">
            {NAV_LINKS.map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
              </a>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#1e3a8a] px-6 py-[60px] pb-20 text-center dark:bg-[#0d1526]">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Computer Courses &amp; Training
        </h1>
        <p className="mx-auto mt-3 max-w-[600px] text-base leading-relaxed text-white/85">
          Professional certification programs, diploma courses, and skill training at Srilal CSC, Shambhuganj, Jaunpur.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="relative z-10 mx-auto -mt-6 w-full max-w-[1200px] px-4">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#111a2e]">
          <div className="flex min-w-[280px] flex-1 items-center rounded-lg border border-slate-300 bg-slate-50 px-3.5 dark:border-slate-600 dark:bg-slate-800">
            <Search className="mr-2.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search courses"
              className="flex-1 border-none bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                  selectedCategory === cat
                    ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    : "border-slate-200 bg-slate-100 text-slate-500 hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto mb-[60px] mt-8 grid w-full max-w-[1200px] flex-1 grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? filtered.map(course => {
          const t = THEME_MAP[course.theme] || THEME_MAP.blue;
          const seatPercent = Math.round((course.filled_seats / course.max_seats) * 100);
          const seatsLeft = course.max_seats - course.filled_seats;

          return (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-[#111a2e] dark:hover:border-slate-600"
            >
              {/* Seat badge */}
              <div
                className={`absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur ${
                  seatsLeft <= 3 ? "bg-red-600/90" : seatsLeft <= 5 ? "bg-amber-500/90" : "bg-emerald-600/90"
                }`}
              >
                <span
                  aria-hidden
                  className={`inline-block h-1.5 w-1.5 rounded-full bg-white ${seatsLeft <= 3 ? "animate-pulse" : ""}`}
                />
                {seatsLeft <= 0 ? "FULL" : `${seatsLeft} seats left`}
              </div>

              <div className="relative flex h-40 w-full items-end p-4" style={{ background: t.dark }}>
                {course.banner_url && (
                  <img
                    src={course.banner_url}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <span className="relative z-10 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur">
                  {course.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden /> {formatDate(course.start_date)}
                  </span>
                </div>
                <h3 className="mb-2 text-[17px] font-extrabold leading-snug text-slate-900 dark:text-white">
                  {course.title}
                </h3>
                <p className="mb-4 flex-1 text-[13px] leading-relaxed text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden dark:text-slate-400">
                  {course.short_desc}
                </p>

                {course.certification && (
                  <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                    <Trophy className="h-3.5 w-3.5 shrink-0" aria-hidden /> {course.certification}
                  </div>
                )}

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Seat occupancy</span>
                    <span>{course.filled_seats}/{course.max_seats}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ${
                        seatPercent > 80 ? "bg-red-600" : seatPercent > 50 ? "bg-amber-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${seatPercent}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
                  <div>
                    <span className="text-[22px] font-bold text-blue-700 dark:text-blue-400">
                      ₹{course.fee.toLocaleString("en-IN")}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                      Pre-book: ₹{course.prebook_amount}
                    </span>
                  </div>
                  <span
                    className="flex items-center gap-1 rounded-lg px-4 py-2 text-xs font-bold text-white"
                    style={{ background: t.primary }}
                  >
                    View Details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          );
        }) : (
          <div className="col-span-full rounded-2xl border-[1.5px] border-dashed border-slate-300 bg-white px-5 py-[60px] text-center text-slate-500 dark:border-slate-700 dark:bg-[#111a2e] dark:text-slate-400">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              <GraduationCap className="h-7 w-7" aria-hidden />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">No courses found</h3>
            <p className="text-sm">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
