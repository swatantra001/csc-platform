// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { adminDeleteCourseAction } from "@/app/actions/courses";
// import { useAuth } from "@/components/AuthProvider";

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
//     btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626",
//     modalOverlay: "rgba(15,23,42,0.55)", scrollThumb: "#bfdbfe",
//     toggleIcon: "🌙", toggleLabel: "Dark",
// 	pillBorder: "rgba(0,0,0,0.1)", pillBg: "rgba(255,255,255,0.9)", pillText: "#475569",
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
//     btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171",
//     modalOverlay: "rgba(0,0,0,0.85)", scrollThumb: "rgba(245,158,11,0.3)",
//     toggleIcon: "☀️", toggleLabel: "Light",
// 	pillBorder: "rgba(255,255,255,0.2)", pillBg: "rgba(255,255,255,0.05)", pillText: "rgba(255,255,255,0.7)",
//   },
// } as const;

// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/courses" : "http://localhost:3000/admin/courses", icon: "🎓", label: "Courses" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
// ];

// function buildCss(T: typeof THEMES.light): string {
//   return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans',sans-serif;}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
// .top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}
// .pill{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};text-transform:uppercase;}
// .pill.on{background:${T.accentLight};border-color:${T.accentBorder};color:${T.accent};}
// .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'DM Sans',sans-serif;}
// .btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
// .btn-p:hover{filter:brightness(1.08);transform:translateY(-1px);}
// .btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
// .btn-g:hover{border-color:${T.accentBorder};color:${T.accent};}
// .btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
// .tog{display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;}
// `;
// }

// function formatDate(d: string) {
//   if (!d) return "";
//   try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
//   catch { return d; }
// }

// export default function AdminCoursesClient({ initialCourses }: { initialCourses: any[] }) {
//   const [isDark, setIsDark] = useState(false);
//   const [courses, setCourses] = useState(initialCourses);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const router = useRouter();
//   const { user } = useAuth();

//   useEffect(() => {
//     const saved = localStorage.getItem("csc_theme");
//     if (saved) setIsDark(saved === "dark");
//     else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//   }, [user]);

//   const T = isDark ? THEMES.dark : THEMES.light;

//   const toggleTheme = () => {
//     const newDark = !isDark;
//     setIsDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

//   const handleDelete = async (id: string, title: string) => {
//     if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
//     setDeletingId(id);
//     try {
//       await adminDeleteCourseAction(id);
//       setCourses(courses.filter(c => c.id !== id));
//     } catch { alert("Failed to delete course."); }
//     finally { setDeletingId(null); }
//   };

//   const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans',sans-serif", transition: "background .25s, color .25s", paddingBottom: 60 }}>
//       <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

//       <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
//         <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//           <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
//             <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
//             <div>
//               <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
//                 Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em", fontFamily: "monospace" }}>ADMIN PANEL</div>
//             </div>
//           </a>
//           <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
//           <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
//             {NAV_LINKS.map(l => (
//               <a key={l.href} href={l.href} className="top-nav-link" style={l.label === "Courses" ? { background: "rgba(255,255,255,0.12)", color: "#fff" } : {}}>
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
//           <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: 12, fontWeight: 700 }}>Manage Courses</h1>
//           <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
//             Create and manage computer training courses, diploma programs, and certification batches.
//           </p>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <div style={{ maxWidth: 1200, margin: "-36px auto 32px", padding: "0 16px", position: "relative", zIndex: 10 }}>
//         <div className="card" style={{ padding: "12px 16px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
//           <div style={{ position: "relative", flex: 1, minWidth: 280, display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "0 14px" }}>
//             <span style={{ color: T.textMuted, marginRight: 10 }}>🔍</span>
//             <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
//               style={{ border: "none", background: "transparent", flex: 1, padding: "12px 0", color: T.textPrimary, outline: "none", fontSize: 14 }} />
//             {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}>✕</button>}
//           </div>
//           <Link href="/admin/courses/create" className="btn btn-p" style={{ textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14 }}>
//             <span style={{ fontSize: 18 }}>+</span> Create Course
//           </Link>
//         </div>
//       </div>

//       {/* Grid */}
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24, flex: 1 }}>
//         {filtered.map(course => {
//           const t = THEME_MAP[course.theme] || THEME_MAP.blue;
//           const bgImage = course.banner_url ? `url(${course.banner_url})` : `linear-gradient(135deg,${t.dark} 0%,${t.primary} 50%,${t.accent} 100%)`;
//           const seatPercent = Math.round((course.filled_seats / course.max_seats) * 100);

//           return (
//             <div key={course.id} className="card" style={{ borderRadius: 16, display: "flex", flexDirection: "column", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", position: "relative" }}
//               onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 25px -5px rgba(0,0,0,0.1)"; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.cardShadow; }}>
              
//               <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 6, background: course.is_published ? "rgba(16,185,129,0.9)" : "rgba(100,116,139,0.9)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
//                 <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
//                 {course.is_published ? "LIVE" : "DRAFT"}
//               </div>

//               <div style={{ height: 160, width: "100%", background: bgImage, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
//                 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) 100%)" }} />
//                 <span style={{ position: "relative", zIndex: 10, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase" }}>
//                   {course.category}
//                 </span>
//               </div>

//               <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//                   <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>⏱️ {course.duration}</span>
//                   <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>🗓️ {formatDate(course.start_date)}</span>
//                 </div>
//                 <h3 style={{ fontSize: 17, fontWeight: 800, color: T.textPrimary, lineHeight: 1.4, marginBottom: 8 }}>{course.title}</h3>
                
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
//                   <div style={{ textAlign: "center", padding: 8, background: T.accentLight, borderRadius: 8, border: `1px solid ${T.accentBorder}` }}>
//                     <div style={{ fontSize: 16, fontWeight: 800, color: T.accent }}>₹{course.fee}</div>
//                     <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Total Fee</div>
//                   </div>
//                   <div style={{ textAlign: "center", padding: 8, background: T.accentLight, borderRadius: 8, border: `1px solid ${T.accentBorder}` }}>
//                     <div style={{ fontSize: 16, fontWeight: 800, color: T.accent }}>₹{course.prebook_amount}</div>
//                     <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Pre-Book</div>
//                   </div>
//                   <div style={{ textAlign: "center", padding: 8, background: seatPercent > 80 ? "#fef2f2" : T.accentLight, borderRadius: 8, border: `1px solid ${seatPercent > 80 ? "#fecaca" : T.accentBorder}` }}>
//                     <div style={{ fontSize: 16, fontWeight: 800, color: seatPercent > 80 ? "#dc2626" : T.accent }}>{course.filled_seats}/{course.max_seats}</div>
//                     <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Seats</div>
//                   </div>
//                 </div>

//                 <div style={{ marginBottom: 12, background: T.inputBg, borderRadius: 6, height: 6, overflow: "hidden" }}>
//                   <div style={{ width: `${seatPercent}%`, height: "100%", background: seatPercent > 80 ? "#dc2626" : T.accent, borderRadius: 6, transition: "width 0.5s" }} />
//                 </div>

//                 <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 16, marginTop: "auto", display: "flex", gap: 12 }}>
//                   <button onClick={() => router.push(`/admin/courses/create?id=${course.id}`)} className="btn btn-g" style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10 }}>✏️ Edit</button>
//                   <button onClick={() => handleDelete(course.id, course.title)} disabled={deletingId === course.id} className="btn btn-d" style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10 }}>
//                     {deletingId === course.id ? "⏳..." : "🗑️ Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {filtered.length === 0 && (
//           <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 60, background: T.cardBg, borderRadius: 16, border: `1.5px dashed ${T.cardBorder}`, color: T.textMuted }}>
//             <div style={{ width: 64, height: 64, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🎓</div>
//             <h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No courses found</h3>
//             <p style={{ fontSize: 14 }}>Create your first course to get started.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

















"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminDeleteCourseAction, markAdmissionCompleteAction, revokeBookingAction } from "@/app/actions/courses";
import { useAuth } from "@/components/AuthProvider";

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

const THEMES = {
  light: {
    pageBg: "#f1f5f9", navBg: "#1e3a8a", navBottomBorder: "#3b82f6",
    navText: "rgba(255,255,255,0.65)", navTextHover: "#ffffff",
    navBrand: "#ffffff", navBrandAccent: "#93c5fd",
    cardBg: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
    textPrimary: "#1e293b", textSecondary: "#475569", textMuted: "#94a3b8",
    accent: "#2563eb", accentHover: "#1d4ed8", accentLight: "#eff6ff", accentBorder: "#bfdbfe",
    inputBg: "#f8fafc", inputBorder: "#e2e8f0", divider: "#e2e8f0",
    btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff",
    btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569",
    btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626",
    btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)", btnSuccessText: "#ffffff",
    btnWarningBg: "linear-gradient(135deg,#b45309,#d97706)", btnWarningText: "#ffffff",
    modalOverlay: "rgba(15,23,42,0.55)", scrollThumb: "#bfdbfe",
    toggleIcon: "🌙", toggleLabel: "Dark",
    pillBorder: "rgba(0,0,0,0.1)", pillBg: "rgba(255,255,255,0.9)", pillText: "#475569",
    validBg: "#f0fdf4", validBorder: "#86efac", validText: "#15803d",
    invalidBg: "#fef2f2", invalidBorder: "#fecaca", invalidText: "#dc2626",
    tableHeaderBg: "#f8fafc", tableRowHover: "#f1f5f9",
  },
  dark: {
    pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b",
    navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff",
    navBrand: "#ffffff", navBrandAccent: "#f59e0b",
    cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
    textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)",
    accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)",
    inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)", divider: "rgba(255,255,255,0.06)",
    btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000",
    btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)",
    btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171",
    btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)", btnSuccessText: "#ffffff",
    btnWarningBg: "linear-gradient(135deg,#92400e,#b45309)", btnWarningText: "#ffffff",
    modalOverlay: "rgba(0,0,0,0.85)", scrollThumb: "rgba(245,158,11,0.3)",
    toggleIcon: "☀️", toggleLabel: "Light",
    pillBorder: "rgba(255,255,255,0.2)", pillBg: "rgba(255,255,255,0.05)", pillText: "rgba(255,255,255,0.7)",
    validBg: "rgba(16,185,129,0.1)", validBorder: "rgba(16,185,129,0.3)", validText: "#34d399",
    invalidBg: "rgba(239,68,68,0.1)", invalidBorder: "rgba(239,68,68,0.3)", invalidText: "#f87171",
    tableHeaderBg: "rgba(255,255,255,0.03)", tableRowHover: "rgba(255,255,255,0.05)",
  },
} as const;

const NAV_LINKS = [
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/courses" : "http://localhost:3000/admin/courses", icon: "🎓", label: "Courses" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/verify" : "http://localhost:3000/admin/verify", icon: "🔍", label: "Verify" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
];

function buildCss(T: typeof THEMES.light): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
.serif{font-family:'DM Serif Display',serif;}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}
.pill{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};text-transform:uppercase;}
.pill.on{background:${T.accentLight};border-color:${T.accentBorder};color:${T.accent};}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'DM Sans',sans-serif;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover{filter:brightness(1.08);transform:translateY(-1px);}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{border-color:${T.accentBorder};color:${T.accent};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-s:hover{filter:brightness(1.08);}
.btn-w{background:${T.btnWarningBg};color:${T.btnWarningText};}
.tog{display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;}
.modal-overlay{position:fixed;inset:0;background:${T.modalOverlay};z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}
.modal-box{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:16px;box-shadow:${T.cardShadow};width:100%;max-width:900px;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;animation:fadeIn 0.3s ease;}
.detail-drawer{position:fixed;top:0;right:0;width:100%;max-width:480px;height:100vh;background:${T.cardBg};border-left:1px solid ${T.cardBorder};box-shadow:-8px 0 32px rgba(0,0,0,0.2);z-index:250;overflow-y:auto;animation:slideIn 0.3s ease;}
.table-container{overflow:auto;max-height:60vh;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{background:${T.tableHeaderBg};padding:12px 16px;text-align:left;font-weight:700;color:${T.textSecondary};font-size:11px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid ${T.divider};white-space:nowrap;}
td{padding:12px 16px;border-bottom:1px solid ${T.divider};color:${T.textPrimary};white-space:nowrap;}
tr:hover td{background:${T.tableRowHover};cursor:pointer;}
.status-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;text-transform:uppercase;}
.status-paid{background:${T.validBg};color:${T.validText};border:1px solid ${T.validBorder};}
.status-pending{background:#fef3c7;color:#92400e;border:1px solid #fde68a;}
.status-cancelled{background:${T.invalidBg};color:${T.invalidText};border:1px solid ${T.invalidBorder};}
.status-admitted{background:#dbeafe;color:#1e40af;border:1px solid #bfdbfe;}
`;
}

function formatDate(d: string) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
}

function formatDateTime(d: string) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return d; }
}

interface Booking {
  id: string;
  booking_code: string;
  payment_status: string;
  admission_status?: string | null;
  amount_paid: number;
  created_at: string;
  expires_at: string | null;
  user_id: string;
  users: {
    name: string | null;
    email: string | null;
    mobile: string | null;
  } | null;
}

export default function AdminCoursesClient({ initialCourses }: { initialCourses: any[] }) {
  const [isDark, setIsDark] = useState(false);
  const [courses, setCourses] = useState(initialCourses);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeModalCourse, setActiveModalCourse] = useState<any | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const T = isDark ? THEMES.dark : THEMES.light;

  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [user]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await adminDeleteCourseAction(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch { alert("Failed to delete course."); }
    finally { setDeletingId(null); }
  };

  const openStudentsModal = async (course: any) => {
    setActiveModalCourse(course);
    setBookingsLoading(true);
    setStatusFilter("all");
    try {
      const { data, error } = await fetch(`/api/admin/courses/${course.id}/bookings`).then(r => r.json());
      if (error) throw new Error(error);
      setBookings(data || []);
    } catch {
      // Fallback: empty state
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const closeModal = () => {
    setActiveModalCourse(null);
    setBookings([]);
    setSelectedBooking(null);
    setStatusFilter("all");
  };

  const filteredBookings = statusFilter === "all" 
    ? bookings 
    : bookings.filter(b => b.payment_status === statusFilter);

  const handleRevoke = async (bookingId: string) => {
    if (!window.confirm("Are you sure? This will permanently remove the student from this course and free up their seat.")) return;
    setActionLoading(bookingId);
    try {
      await revokeBookingAction(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      if (selectedBooking?.id === bookingId) setSelectedBooking(null);
      // Update seat count locally
      setCourses(prev => prev.map(c => 
        c.id === activeModalCourse?.id ? { ...c, filled_seats: Math.max(0, c.filled_seats - 1) } : c
      ));
    } catch (err: any) {
      alert(err.message || "Failed to revoke booking");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAdmitted = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await markAdmissionCompleteAction(bookingId);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, admission_status: "completed" } : b
      ));
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, admission_status: "completed" } : null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to mark admission");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans',sans-serif", transition: "background .25s, color .25s", paddingBottom: 60 }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

      {/* DETAIL DRAWER */}
      {selectedBooking && (
        <div className="detail-drawer" style={{ background: T.cardBg }}>
          <div style={{ padding: "24px", borderBottom: `1px solid ${T.divider}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Booking Details</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.textPrimary }}>{selectedBooking.booking_code}</div>
            </div>
            <button onClick={() => setSelectedBooking(null)} className="btn btn-g" style={{ padding: "6px 12px" }}>✕</button>
          </div>
          
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 12, background: selectedBooking.payment_status === "paid" ? T.validBg : T.invalidBg, border: `1px solid ${selectedBooking.payment_status === "paid" ? T.validBorder : T.invalidBorder}` }}>
              <div style={{ fontSize: 28 }}>{selectedBooking.payment_status === "paid" ? "✅" : "⚠️"}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: selectedBooking.payment_status === "paid" ? T.validText : T.invalidText }}>
                  {selectedBooking.payment_status === "paid" ? "Payment Verified" : "Payment " + selectedBooking.payment_status}
                </div>
                {selectedBooking.admission_status === "completed" && (
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>🎓 Admission Completed</div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <DetailRow label="Student Name" value={selectedBooking.users?.name || "N/A"} T={T as any} />
              <DetailRow label="Mobile" value={selectedBooking.users?.mobile || "N/A"} T={T as any} />
              <DetailRow label="Email" value={selectedBooking.users?.email || "N/A"} T={T as any} />
              <DetailRow label="Amount Paid" value={`₹${selectedBooking.amount_paid.toLocaleString("en-IN")}`} T={T as any} highlight />
              <DetailRow label="Booked On" value={formatDateTime(selectedBooking.created_at)} T={T as any} />
              {selectedBooking.expires_at && (
                <DetailRow label="Expires On" value={formatDateTime(selectedBooking.expires_at)} T={T as any} />
              )}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${T.divider}`, display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedBooking.payment_status === "paid" && selectedBooking.admission_status !== "completed" && (
                <button 
                  onClick={() => handleMarkAdmitted(selectedBooking.id)} 
                  disabled={actionLoading === selectedBooking.id}
                  className="btn btn-s"
                  style={{ width: "100%", justifyContent: "center", padding: 12, fontSize: 14 }}
                >
                  {actionLoading === selectedBooking.id ? "Processing..." : "✅ Mark Admission Complete"}
                </button>
              )}
              <button 
                onClick={() => handleRevoke(selectedBooking.id)} 
                disabled={actionLoading === selectedBooking.id}
                className="btn btn-d"
                style={{ width: "100%", justifyContent: "center", padding: 12, fontSize: 14 }}
              >
                {actionLoading === selectedBooking.id ? "Processing..." : "🗑️ Revoke Course from Student"}
              </button>
              <p style={{ fontSize: 11, color: T.textMuted, textAlign: "center", lineHeight: 1.5 }}>
                Revoking will delete this booking, refund the seat, and remove the student from this course permanently.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STUDENTS MODAL */}
      {activeModalCourse && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-box">
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.divider}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, marginBottom: 2 }}>{activeModalCourse.title}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.textPrimary }}>👨‍🎓 Students ({filteredBookings.length})</div>
              </div>
              <button onClick={closeModal} className="btn btn-g" style={{ padding: "6px 12px" }}>✕ Close</button>
            </div>

            {/* Filter Pills */}
            <div style={{ padding: "12px 24px", borderBottom: `1px solid ${T.divider}`, display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
              {["all", "paid", "pending", "cancelled"].map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`pill ${statusFilter === status ? "on" : ""}`}
                >
                  {status === "all" ? "All" : status}
                  {status !== "all" && (
                    <span style={{ marginLeft: 4, opacity: 0.7 }}>
                      ({bookings.filter(b => b.payment_status === status).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="table-container" style={{ flex: 1 }}>
              {bookingsLoading ? (
                <div style={{ padding: 60, textAlign: "center", color: T.textMuted }}>
                  <div style={{ width: 32, height: 32, border: `3px solid ${T.divider}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                  Loading students...
                </div>
              ) : filteredBookings.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", color: T.textMuted }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>No students found</div>
                  <div style={{ fontSize: 13 }}>{statusFilter === "all" ? "No bookings for this course yet." : `No ${statusFilter} bookings.`}</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Booking Code</th>
                      <th>Student</th>
                      <th>Mobile</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} onClick={() => setSelectedBooking(booking)}>
                        <td>
                          <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: T.accent, background: T.accentLight, padding: "2px 8px", borderRadius: 6 }}>
                            {booking.booking_code}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{booking.users?.name || "N/A"}</td>
                        <td className="mono" style={{ fontSize: 12 }}>{booking.users?.mobile || "N/A"}</td>
                        <td style={{ fontWeight: 700 }}>₹{booking.amount_paid.toLocaleString("en-IN")}</td>
                        <td>
                          <span className={`status-badge status-${booking.payment_status}`}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                            {booking.payment_status}
                            {booking.admission_status === "completed" && " 🎓"}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: T.textMuted }}>{formatDate(booking.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em", fontFamily: "monospace" }}>ADMIN PANEL</div>
            </div>
          </a>
          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
          <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="top-nav-link" style={l.label === "Courses" ? { background: "rgba(255,255,255,0.12)", color: "#fff" } : {}}>
                <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </nav>
          <button className="tog" onClick={toggleTheme}>
            <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: isDark ? "linear-gradient(135deg,#0f172a,#1e293b)" : "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "60px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: 12, fontWeight: 700 }}>Manage Courses</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Create and manage computer training courses, diploma programs, and certification batches.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ maxWidth: 1200, margin: "-36px auto 32px", padding: "0 16px", position: "relative", zIndex: 10 }}>
        <div className="card" style={{ padding: "12px 16px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 280, display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "0 14px" }}>
            <span style={{ color: T.textMuted, marginRight: 10 }}>🔍</span>
            <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: "none", background: "transparent", flex: 1, padding: "12px 0", color: T.textPrimary, outline: "none", fontSize: 14 }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}>✕</button>}
          </div>
          <Link href="/admin/courses/create" className="btn btn-p" style={{ textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14 }}>
            <span style={{ fontSize: 18 }}>+</span> Create Course
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24, flex: 1 }}>
        {filtered.map(course => {
          const t = THEME_MAP[course.theme] || THEME_MAP.blue;
          const bgImage = course.banner_url ? `url(${course.banner_url})` : `linear-gradient(135deg,${t.dark} 0%,${t.primary} 50%,${t.accent} 100%)`;
          const seatPercent = Math.round((course.filled_seats / course.max_seats) * 100);

          return (
            <div key={course.id} className="card" style={{ borderRadius: 16, display: "flex", flexDirection: "column", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", position: "relative" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 25px -5px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.cardShadow; }}>
              
              <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 6, background: course.is_published ? "rgba(16,185,129,0.9)" : "rgba(100,116,139,0.9)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
                {course.is_published ? "LIVE" : "DRAFT"}
              </div>

              <div style={{ height: 160, width: "100%", background: bgImage, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) 100%)" }} />
                <span style={{ position: "relative", zIndex: 10, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase" }}>
                  {course.category}
                </span>
              </div>

              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>⏱️ {course.duration}</span>
                  <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>🗓️ {formatDate(course.start_date)}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: T.textPrimary, lineHeight: 1.4, marginBottom: 8 }}>{course.title}</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div style={{ textAlign: "center", padding: 8, background: T.accentLight, borderRadius: 8, border: `1px solid ${T.accentBorder}` }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.accent }}>₹{course.fee}</div>
                    <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Total Fee</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 8, background: T.accentLight, borderRadius: 8, border: `1px solid ${T.accentBorder}` }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.accent }}>₹{course.prebook_amount}</div>
                    <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Pre-Book</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 8, background: seatPercent > 80 ? "#fef2f2" : T.accentLight, borderRadius: 8, border: `1px solid ${seatPercent > 80 ? "#fecaca" : T.accentBorder}` }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: seatPercent > 80 ? "#dc2626" : T.accent }}>{course.filled_seats}/{course.max_seats}</div>
                    <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Seats</div>
                  </div>
                </div>

                <div style={{ marginBottom: 12, background: T.inputBg, borderRadius: 6, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${seatPercent}%`, height: "100%", background: seatPercent > 80 ? "#dc2626" : T.accent, borderRadius: 6, transition: "width 0.5s" }} />
                </div>

                <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 16, marginTop: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => openStudentsModal(course)} className="btn btn-p" style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10, fontSize: 12 }}>
                    👨‍🎓 Students
                  </button>
                  <button onClick={() => router.push(`/admin/courses/create?id=${course.id}`)} className="btn btn-g" style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10, fontSize: 12 }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(course.id, course.title)} disabled={deletingId === course.id} className="btn btn-d" style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10, fontSize: 12 }}>
                    {deletingId === course.id ? "⏳..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 60, background: T.cardBg, borderRadius: 16, border: `1.5px dashed ${T.cardBorder}`, color: T.textMuted }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🎓</div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No courses found</h3>
            <p style={{ fontSize: 14 }}>Create your first course to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight, T }: { label: string; value: string; highlight?: boolean; T: typeof THEMES.light }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 12, color: T.textSecondary, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: highlight ? T.accent : T.textPrimary, fontWeight: highlight ? 700 : 600, textAlign: "right", wordBreak: "break-word", maxWidth: "60%" }}>
        {value}
      </span>
    </div>
  );
}