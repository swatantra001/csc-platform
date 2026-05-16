// "use client";

// import { useState } from "react";
// import Link from "next/link";

// // ─── TYPES ────────────────────────────────────────────────────────────────────
// export interface PostSummary {
//   id: string;
//   title: string;
//   title_hi: string;
//   short_desc: string;
//   theme: string;
//   category: string;
//   total_posts: number;
//   post_date: string;
//   banner_url?: string;
//   slug: string;
// }

// // ─── THEME CONFIG ─────────────────────────────────────────────────────────────
// const THEME_MAP: Record<string, { primary: string; dark: string; light: string; badge: string; ring: string; btn: string; accent: string }> = {
//   blue:   { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", badge: "#dbeafe", ring: "#93c5fd", btn: "bg-blue-600 hover:bg-blue-700", accent: "#3b82f6" },
//   green:  { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", badge: "#dcfce7", ring: "#86efac", btn: "bg-green-600 hover:bg-green-700", accent: "#22c55e" },
//   red:    { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", badge: "#fee2e2", ring: "#fca5a5", btn: "bg-red-600 hover:bg-red-700", accent: "#ef4444" },
//   orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", badge: "#fed7aa", ring: "#fdba74", btn: "bg-orange-600 hover:bg-orange-700", accent: "#f97316" },
//   purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", badge: "#ede9fe", ring: "#c4b5fd", btn: "bg-violet-600 hover:bg-violet-700", accent: "#8b5cf6" },
//   teal:   { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", badge: "#ccfbf1", ring: "#5eead4", btn: "bg-teal-600 hover:bg-teal-700", accent: "#14b8a6" },
//   indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", badge: "#e0e7ff", ring: "#a5b4fc", btn: "bg-indigo-600 hover:bg-indigo-700", accent: "#6366f1" },
//   rose:   { primary: "#be123c", dark: "#881337", light: "#fff1f2", badge: "#ffe4e6", ring: "#fda4af", btn: "bg-rose-600 hover:bg-rose-700", accent: "#f43f5e" },
// };

// function formatDate(d: string) {
//   if (!d) return "";
//   try {
//     return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//   } catch { return d; }
// }

// export default function PostsListClient({ posts }: { posts: PostSummary[] }) {
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // Extract unique categories from the database for the filter buttons
//   const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

//   // Filter posts based on search and category
//   const filteredPosts = posts.filter((p) => {
//     const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
//                           p.short_desc?.toLowerCase().includes(search.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         body {
//           font-family: 'DM Sans', 'Noto Sans Devanagari', sans-serif;
//           background: #f1f5f9;
//           color: #1e293b;
//         }

//         /* ── TOP NAV ── */
//         .top-nav {
//           background: #0f172a;
//           padding: 10px 0;
//           border-bottom: 3px solid #3b82f6;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//         }
//         .nav-inner {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 16px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .nav-logo {
//           font-family: 'DM Serif Display', serif;
//           font-size: 1.5rem;
//           color: #fff;
//           text-decoration: none;
//           letter-spacing: -0.5px;
//         }
//         .nav-logo span { color: #3b82f6; }

//         /* ── HERO HEADER ── */
//         .list-hero {
//           background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
//           padding: 48px 16px;
//           text-align: center;
//           position: relative;
//           overflow: hidden;
//         }
//         .list-hero::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='white' opacity='0.05'/%3E%3C/svg%3E") repeat;
//         }
//         .list-hero h1 {
//           font-family: 'DM Serif Display', serif;
//           color: #fff;
//           font-size: clamp(2rem, 5vw, 3rem);
//           margin-bottom: 12px;
//           position: relative;
//         }
//         .list-hero p {
//           color: #cbd5e1;
//           font-size: 1.1rem;
//           max-width: 600px;
//           margin: 0 auto;
//           position: relative;
//         }

//         /* ── FILTER BAR ── */
//         .filter-container {
//           max-width: 1200px;
//           margin: -24px auto 32px;
//           padding: 0 16px;
//           position: relative;
//           z-index: 10;
//         }
//         .filter-bar {
//           background: #fff;
//           border-radius: 16px;
//           padding: 16px;
//           display: flex;
//           gap: 16px;
//           align-items: center;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.05);
//           border: 1px solid #e2e8f0;
//           flex-wrap: wrap;
//         }
//         .search-box {
//           flex: 1;
//           min-width: 280px;
//           display: flex;
//           align-items: center;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           border-radius: 12px;
//           padding: 0 16px;
//           transition: all 0.2s;
//         }
//         .search-box:focus-within { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
//         .search-input {
//           width: 100%;
//           padding: 14px 0;
//           border: none;
//           background: transparent;
//           outline: none;
//           font-family: inherit;
//           font-size: 0.95rem;
//           color: #1e293b;
//         }
//         .category-pills {
//           display: flex;
//           gap: 8px;
//           overflow-x: auto;
//           padding-bottom: 4px;
//           scrollbar-width: none;
//         }
//         .category-pills::-webkit-scrollbar { display: none; }
//         .cat-pill {
//           background: #f1f5f9;
//           color: #475569;
//           border: 1px solid #e2e8f0;
//           padding: 8px 16px;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 600;
//           cursor: pointer;
//           white-space: nowrap;
//           transition: all 0.2s;
//         }
//         .cat-pill:hover { background: #e2e8f0; }
//         .cat-pill.active { background: #1e293b; color: #fff; border-color: #1e293b; }

//         /* ── POSTS GRID ── */
//         .posts-grid {
//           max-width: 1200px;
//           margin: 0 auto 60px;
//           padding: 0 16px;
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//           gap: 24px;
//         }

//         /* ── CARD DESIGN ── */
//         .post-card {
//           background: #fff;
//           border-radius: 16px;
//           overflow: hidden;
//           text-decoration: none;
//           display: flex;
//           flex-direction: column;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.02);
//           border: 1px solid #e2e8f0;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           position: relative;
//         }
//         .post-card:hover {
//           transform: translateY(-6px);
//           box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
//           border-color: #cbd5e1;
//         }

//         /* Thumbnail */
//         .card-thumb {
//           height: 160px;
//           width: 100%;
//           background-size: cover;
//           background-position: center;
//           position: relative;
//           display: flex;
//           align-items: flex-end;
//           padding: 16px;
//         }
//         .card-overlay {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
//         }
//         .card-badge {
//           position: relative;
//           z-index: 10;
//           background: rgba(255,255,255,0.2);
//           backdrop-filter: blur(8px);
//           border: 1px solid rgba(255,255,255,0.4);
//           color: #fff;
//           font-size: 0.7rem;
//           font-weight: 700;
//           padding: 4px 10px;
//           border-radius: 20px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         /* Card Content */
//         .card-body {
//           padding: 20px;
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }
//         .card-date {
//           font-size: 0.75rem;
//           color: #64748b;
//           font-weight: 600;
//           margin-bottom: 8px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .card-title {
//           font-size: 1.15rem;
//           font-weight: 800;
//           color: #1e293b;
//           line-height: 1.4;
//           margin-bottom: 8px;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .card-desc {
//           font-size: 0.85rem;
//           color: #475569;
//           line-height: 1.6;
//           margin-bottom: 16px;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//           flex: 1;
//         }

//         /* Card Footer */
//         .card-footer {
//           border-top: 1px solid #f1f5f9;
//           padding-top: 16px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .card-stat {
//           display: flex;
//           flex-direction: column;
//         }
//         .stat-val { font-size: 1.1rem; font-weight: 800; font-family: 'DM Serif Display', serif; }
//         .stat-lbl { font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }

//         .card-btn {
//           padding: 8px 16px;
//           border-radius: 8px;
//           color: #fff;
//           font-size: 0.8rem;
//           font-weight: 700;
//           transition: filter 0.2s;
//         }
//         .post-card:hover .card-btn { filter: brightness(1.1); }

//         /* Empty State */
//         .empty-state {
//           grid-column: 1 / -1;
//           text-align: center;
//           padding: 60px 20px;
//           background: #fff;
//           border-radius: 16px;
//           border: 1px dashed #cbd5e1;
//           color: #64748b;
//         }
//       `}</style>

//       {/* ── TOP NAV ── */}
//       <nav className="top-nav">
//         <div className="nav-inner">
//           <Link href="/" className="nav-logo">Shrilal<span>CSC</span></Link>
//         </div>
//       </nav>

//       {/* ── HERO ── */}
//       <div className="list-hero">
//         <h1>Latest Opportunities</h1>
//         <p>Explore the newest government jobs, admissions, and scholarship forms verified by CSC Shambhuganj.</p>
//       </div>

//       {/* ── FILTER BAR ── */}
//       <div className="filter-container">
//         <div className="filter-bar">
//           <div className="search-box">
//             <span style={{ fontSize: '1.2rem', color: '#94a3b8', marginRight: '10px' }}>🔍</span>
//             <input 
//               type="text" 
//               className="search-input" 
//               placeholder="Search by post name or keyword..." 
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div className="category-pills">
//             {categories.map((cat) => (
//               <button 
//                 key={cat} 
//                 className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
//                 onClick={() => setSelectedCategory(cat)}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── POSTS GRID ── */}
//       <div className="posts-grid">
//         {filteredPosts.length > 0 ? (
//           filteredPosts.map((post) => {
//             const t = THEME_MAP[post.theme] || THEME_MAP.blue;

//             // If there's a banner, use it. Otherwise generate a gorgeous gradient based on theme color.
//             const bgImage = post.banner_url 
//               ? `url(${post.banner_url})` 
//               : `linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 50%, ${t.accent} 100%)`;

//             return (
//               <Link href={`/posts/${post.id}`} key={post.id} className="post-card">

//                 <div className="card-thumb" style={{ background: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
//                   <div className="card-overlay"></div>
//                   <span className="card-badge" style={{ borderColor: t.ring }}>{post.category}</span>
//                 </div>

//                 <div className="card-body">
//                   <div className="card-date">
//                     <span style={{ color: t.primary }}>🗓️</span> {formatDate(post.post_date)}
//                   </div>
//                   <h3 className="card-title">{post.title}</h3>
//                   <p className="card-desc">{post.short_desc}</p>

//                   <div className="card-footer">
//                     <div className="card-stat">
//                       <span className="stat-val" style={{ color: t.primary }}>
//                         {post.total_posts > 0 ? post.total_posts.toLocaleString("en-IN") : "N/A"}
//                       </span>
//                       <span className="stat-lbl">Vacancies</span>
//                     </div>
//                     <div className="card-btn" style={{ background: t.primary }}>
//                       View Details →
//                     </div>
//                   </div>
//                 </div>

//               </Link>
//             );
//           })
//         ) : (
//           <div className="empty-state">
//             <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📭</span>
//             <h2>No posts found</h2>
//             <p>Try adjusting your search or category filter.</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
















"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface PostSummary {
	id: string;
	title: string;
	title_hi: string;
	short_desc: string;
	theme: string;
	category: string;
	total_posts: number;
	post_date: string;
	banner_url?: string;
	slug: string;
}

// ─── THEME CONFIG (per-post accent colours — data-driven, preserved) ─────────
const THEME_MAP: Record<string, { primary: string; dark: string; light: string; badge: string; ring: string; btn: string; accent: string }> = {
	blue: { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", badge: "#dbeafe", ring: "#93c5fd", btn: "bg-blue-600 hover:bg-blue-700", accent: "#3b82f6" },
	green: { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", badge: "#dcfce7", ring: "#86efac", btn: "bg-green-600 hover:bg-green-700", accent: "#22c55e" },
	red: { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", badge: "#fee2e2", ring: "#fca5a5", btn: "bg-red-600 hover:bg-red-700", accent: "#ef4444" },
	orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", badge: "#fed7aa", ring: "#fdba74", btn: "bg-orange-600 hover:bg-orange-700", accent: "#f97316" },
	purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", badge: "#ede9fe", ring: "#c4b5fd", btn: "bg-violet-600 hover:bg-violet-700", accent: "#8b5cf6" },
	teal: { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", badge: "#ccfbf1", ring: "#5eead4", btn: "bg-teal-600 hover:bg-teal-700", accent: "#14b8a6" },
	indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", badge: "#e0e7ff", ring: "#a5b4fc", btn: "bg-indigo-600 hover:bg-indigo-700", accent: "#6366f1" },
	rose: { primary: "#be123c", dark: "#881337", light: "#fff1f2", badge: "#ffe4e6", ring: "#fda4af", btn: "bg-rose-600 hover:bg-rose-700", accent: "#f43f5e" },
};

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS
// ════════════════════════════════════════════════════════════════════════════════
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
  { href: "/status",            icon: "🌐", label: "Status"        },
  { href: "/notifications",      icon: "🔔", label: "Notifications"        },
  { href: "/galary",          icon: "🖼️", label: "Gallery"      },
  { href: "/dashboard",icon: "📊", label: "Dashboard" },
  { href: "/dashboard/profile",icon: "👤", label: "Profile"      },
];

const Ico = {
	Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
	X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
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
@keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}

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
`;
}

function formatDate(d: string) {
	if (!d) return "";
	try {
		return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
	} catch { return d; }
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function PostsListClient({ posts }: { posts: PostSummary[] }) {
	const [isDark, setIsDark] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

	const T = isDark ? THEMES.dark : THEMES.light;

	const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

	useEffect(() => {
		const savedTheme = localStorage.getItem("csc_theme");
		if (savedTheme) setIsDark(savedTheme === "dark");
		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, [user]);
	// Extract unique categories from the database for the filter buttons
	const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

	// ─── HANDLERS ─── (Preserved Exactly)
	const toggleTheme = () => {
		const newDark = !isDark; setIsDark(newDark);
		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
	};

	// Filter posts based on search and category
	const filteredPosts = posts.filter((p) => {
		const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
			p.short_desc?.toLowerCase().includes(search.toLowerCase());
		const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: "background .25s, color .25s" }}>
			<style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

			{/* ════════════════════════════════════════════════════════
          HEADER — deep indigo / amber
      ════════════════════════════════════════════════════════ */}
			<header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
				<div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
					<a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
						<div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
						<div>
							<div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
								Shrilal<span style={{ color: T.navBrandAccent }}>CSC</span>
							</div>
							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>OPPORTUNITIES</div>
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

					<button className="tog" onClick={toggleTheme}>
						<span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
					</button>
				</div>
			</header>

			{/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
			<div style={{
				background: isDark
					? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
					: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
				padding: "60px 24px 80px",
				textAlign: "center",
				position: "relative",
				overflow: "hidden"
			}}>
				<div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
				<div style={{ position: "relative", zIndex: 1 }}>
					<h1 className="serif" style={{ color: "#ffffff", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 12, fontWeight: 700 }}>
						Latest Opportunities
					</h1>
					<p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
						Explore the newest government jobs, admissions, and scholarship forms verified by CSC Shambhuganj.
					</p>
				</div>
			</div>

			{/* ════════════════════════════════════════════════════════
          FILTER BAR
      ════════════════════════════════════════════════════════ */}
			<div style={{ maxWidth: 1200, margin: "-24px auto 32px", padding: "0 16px", position: "relative", zIndex: 10 }}>
				<div className="card" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
					<div style={{ position: "relative", flex: 1, minWidth: 280, display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "0 14px", transition: "all .2s" }}>
						<span style={{ color: T.inputPlaceholder, marginRight: 10, display: "flex" }}><Ico.Search /></span>
						<input
							type="text"
							className="inp"
							placeholder="Search by post name or keyword..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{ border: "none", background: "transparent", flex: 1, padding: "12px 0" }}
						/>
						{search && (
							<button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4, display: "flex" }}>
								<Ico.X />
							</button>
						)}
					</div>
					<div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
						{categories.map((cat) => (
							<button
								key={cat}
								className={`pill ${selectedCategory === cat ? "on" : ""}`}
								onClick={() => setSelectedCategory(cat)}
							>
								{cat}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* ════════════════════════════════════════════════════════
          POSTS GRID
      ════════════════════════════════════════════════════════ */}
			<div style={{ maxWidth: 1200, margin: "0 auto 60px", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, flex: 1 }}>
				{filteredPosts.length > 0 ? (
					filteredPosts.map((post) => {
						const t = THEME_MAP[post.theme] || THEME_MAP.blue;
						const bgImage = post.banner_url
							? `url(${post.banner_url})`
							: `linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 50%, ${t.accent} 100%)`;

						return (
							<Link
								href={`/posts/${post.id}`}
								key={post.id}
								style={{
									background: T.cardBg,
									borderRadius: 16,
									overflow: "hidden",
									textDecoration: "none",
									display: "flex",
									flexDirection: "column",
									boxShadow: T.cardShadow,
									border: `1px solid ${T.cardBorder}`,
									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
									position: "relative",
									color: "inherit",
								}}
								onMouseEnter={(e) => {
									const el = e.currentTarget;
									el.style.transform = "translateY(-6px)";
									el.style.boxShadow = isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
									el.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1";
								}}
								onMouseLeave={(e) => {
									const el = e.currentTarget;
									el.style.transform = "translateY(0)";
									el.style.boxShadow = T.cardShadow;
									el.style.borderColor = T.cardBorder;
								}}
							>
								{/* Thumbnail */}
								<div style={{ height: 160, width: "100%", background: bgImage, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
									<div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)" }} />
									<span style={{
										position: "relative",
										zIndex: 10,
										background: "rgba(255,255,255,0.15)",
										backdropFilter: "blur(8px)",
										border: "1px solid rgba(255,255,255,0.3)",
										color: "#fff",
										fontSize: 10,
										fontWeight: 800,
										padding: "4px 10px",
										borderRadius: 20,
										textTransform: "uppercase",
										letterSpacing: "0.5px",
									}}>
										{post.category}
									</span>
								</div>

								{/* Body */}
								<div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
									<div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
										<span style={{ color: t.primary }}>🗓️</span> {formatDate(post.post_date)}
									</div>
									<h3 style={{
										fontSize: 17,
										fontWeight: 800,
										color: T.textPrimary,
										lineHeight: 1.4,
										marginBottom: 8,
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
									}}>
										{post.title}
									</h3>
									<p style={{
										fontSize: 13,
										color: T.textSecondary,
										lineHeight: 1.6,
										marginBottom: 16,
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
										flex: 1,
									}}>
										{post.short_desc}
									</p>

									{/* Footer */}
									<div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
										<div style={{ display: "flex", flexDirection: "column" }}>
											<span className="serif" style={{ fontSize: 20, fontWeight: 700, color: t.primary }}>
												{post.total_posts > 0 ? post.total_posts.toLocaleString("en-IN") : "N/A"}
											</span>
											<span style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Vacancies</span>
										</div>
										<div style={{
											padding: "8px 16px",
											borderRadius: 8,
											background: t.primary,
											color: "#fff",
											fontSize: 12,
											fontWeight: 700,
											transition: "filter 0.2s",
										}}>
											View Details →
										</div>
									</div>
								</div>
							</Link>
						);
					})
				) : (
					<div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", background: T.cardBg, borderRadius: 16, border: `1.5px dashed ${T.cardBorder}`, color: T.textMuted }}>
						<div style={{ width: 64, height: 64, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>📭</div>
						<h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No posts found</h3>
						<p style={{ fontSize: 14 }}>Try adjusting your search or category filter.</p>
					</div>
				)}
			</div>
		</div>
	);
}