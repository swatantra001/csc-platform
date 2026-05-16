// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { adminDeletePostAction } from "@/app/actions/admin";

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

// export default function AdminPostsClient({ initialPosts }: { initialPosts: any[] }) {
//   const [posts, setPosts] = useState(initialPosts);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const router = useRouter();

//   const handleDelete = async (id: string, title: string) => {
//     if (!window.confirm(`Are you absolutely sure you want to delete "${title}"? This cannot be undone.`)) return;

//     setDeletingId(id);
//     try {
//       await adminDeletePostAction(id);
//       setPosts(posts.filter(p => p.id !== id));
//     } catch (err) {
//       alert("Failed to delete post.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div className="admin-page-override">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

//         /* Override typical admin dashboard padding/background to match client side perfectly */
//         .admin-page-override {
//           margin: -24px; 
//           background: #f1f5f9;
//           min-height: 100vh;
//           font-family: 'DM Sans', sans-serif;
//           color: #1e293b;
// 		  padding-bottom: 60px; /* ✨ FIX: Forces the white background to stretch to the very bottom */
//         }

//         /* ── HERO HEADER ── */
//         .list-hero {
//           background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
//           padding: 60px 16px 80px;
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

//         /* ── FILTER BAR WITH CREATE BUTTON ── */
//         .filter-container {
//           max-width: 1200px;
//           margin: -36px auto 32px;
//           padding: 0 16px;
//           position: relative;
//           z-index: 10;
//         }
//         .filter-bar {
//           background: #fff;
//           border-radius: 16px;
//           padding: 12px 16px;
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
//         .btn-create {
//           background: #1e293b;
//           color: #fff;
//           padding: 12px 24px;
//           border-radius: 12px;
//           font-weight: 700;
//           text-decoration: none;
//           transition: all 0.2s;
//           white-space: nowrap;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .btn-create:hover { background: #0f172a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

//         /* ── POSTS GRID ── */
//         .posts-grid {
//           max-width: 1200px;
//           margin: 0 auto; /* ✨ FIX: Removed the 60px bottom margin to stop margin collapse */
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
//         .status-badge {
//           position: absolute;
//           top: 16px;
//           right: 16px;
//           z-index: 10;
//           padding: 4px 12px;
//           border-radius: 20px;
//           font-size: 0.7rem;
//           font-weight: 800;
//           color: #fff;
//           backdrop-filter: blur(8px);
//           border: 1px solid rgba(255,255,255,0.3);
//           display: flex;
//           align-items: center;
//           gap: 6px;
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
//         }
//         .card-title {
//           font-size: 1.15rem;
//           font-weight: 800;
//           color: #1e293b;
//           line-height: 1.4;
//           margin-bottom: auto;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         /* Edit / Delete Footer */
//         .card-actions {
//           border-top: 1px solid #f1f5f9;
//           padding-top: 16px;
//           margin-top: 16px;
//           display: flex;
//           gap: 12px;
//         }
//         .btn-action {
//           flex: 1;
//           padding: 10px;
//           border-radius: 10px;
//           font-weight: 700;
//           font-size: 0.85rem;
//           text-align: center;
//           cursor: pointer;
//           transition: all 0.2s;
//           border: none;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//         }
//         .btn-edit { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
//         .btn-edit:hover { background: #3b82f6; color: #fff; }
//         .btn-delete { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
//         .btn-delete:hover { background: #ef4444; color: #fff; }
//         .btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

//       `}</style>

//       {/* ── HERO ── */}
//       <div className="list-hero">
//         <h1>Manage Posts</h1>
//         <p>Create, edit, or remove live posts from the portal. Changes reflect instantly.</p>
//       </div>

//       {/* ── FILTER & CREATE BAR ── */}
//       <div className="filter-container">
//         <div className="filter-bar">
//           <div className="search-box">
//             <span style={{ fontSize: '1.2rem', color: '#94a3b8', marginRight: '10px' }}>🔍</span>
//             <input 
//               type="text" 
//               className="search-input" 
//               placeholder="Search by post name..." 
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <Link href="/admin/posts/create" className="btn-create">
//             <span style={{ fontSize: "1.2rem" }}>+</span> Create New Post
//           </Link>
//         </div>
//       </div>

//       {/* ── POSTS GRID ── */}
//       <div className="posts-grid">
//         {filteredPosts.map((post) => {
//           const t = THEME_MAP[post.theme] || THEME_MAP.blue;
//           const bgImage = post.banner_url ? `url(${post.banner_url})` : `linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 50%, ${t.accent} 100%)`;

//           return (
//             <div key={post.id} className="post-card">

//               {/* Published/Draft Status Badge */}
//               <div className="status-badge" style={{ background: post.is_published ? "rgba(16, 185, 129, 0.9)" : "rgba(100, 116, 139, 0.9)" }}>
//                 <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }}></span>
//                 {post.is_published ? "LIVE" : "DRAFT"}
//               </div>

//               {/* Thumbnail */}
//               <div className="card-thumb" style={{ background: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
//                 <div className="card-overlay"></div>
//                 <span className="card-badge" style={{ borderColor: t.ring }}>{post.category}</span>
//               </div>

//               {/* Content */}
//               <div className="card-body">
//                 <div className="card-date">
//                   🗓️ Posted: {formatDate(post.post_date)}
//                 </div>
//                 <h3 className="card-title">{post.title}</h3>

//                 {/* Admin Actions */}
//                 <div className="card-actions">
//                   <button 
//                     onClick={() => router.push(`/admin/posts/create?id=${post.id}`)}
//                     className="btn-action btn-edit"
//                   >
//                     ✏️ Edit
//                   </button>
//                   <button 
//                     onClick={() => handleDelete(post.id, post.title)}
//                     disabled={deletingId === post.id}
//                     className="btn-action btn-delete"
//                   >
//                     {deletingId === post.id ? "⏳..." : "🗑️ Delete"}
//                   </button>
//                 </div>
//               </div>

//             </div>
//           );
//         })}

//         {filteredPosts.length === 0 && (
//           <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", background: "#fff", borderRadius: 16, border: "1px dashed #cbd5e1", color: "#64748b" }}>
//             <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📭</span>
//             <h2>No posts found</h2>
//             <p>You haven't created any posts matching that search yet.</p>
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
import { adminDeletePostAction } from "@/app/actions/admin";
import { useAuth } from "@/components/AuthProvider";

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
// DUAL THEME TOKENS — Mutable type to avoid readonly conflicts
// ════════════════════════════════════════════════════════════════════════════════
interface ThemeTokens {
	pageBg: string;
	navBg: string;
	navBottomBorder: string;
	navText: string;
	navTextHover: string;
	navBrand: string;
	navBrandAccent: string;
	cardBg: string;
	cardBorder: string;
	cardShadow: string;
	sectionGrad: string;
	sectionGradText: string;
	textPrimary: string;
	textSecondary: string;
	textMuted: string;
	accent: string;
	accentHover: string;
	accentLight: string;
	accentBorder: string;
	inputBg: string;
	inputBorder: string;
	inputFocusBorder: string;
	inputText: string;
	inputPlaceholder: string;
	divider: string;
	pillBg: string;
	pillBorder: string;
	pillText: string;
	pillActiveBg: string;
	pillActiveBorder: string;
	pillActiveText: string;
	btnPrimary: string;
	btnPrimaryText: string;
	btnPrimaryGlow: string;
	btnGhostBg: string;
	btnGhostBorder: string;
	btnGhostText: string;
	btnGhostHoverBg: string;
	btnGhostHoverText: string;
	btnDangerBg: string;
	btnDangerBorder: string;
	btnDangerText: string;
	btnSuccessBg: string;
	btnSuccessText: string;
	modalOverlay: string;
	modalBg: string;
	modalBorder: string;
	scrollThumb: string;
	toggleIcon: string;
	toggleLabel: string;
}

const THEMES: Record<"light" | "dark", ThemeTokens> = {
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
		toggleIcon: "☀️",
		toggleLabel: "Light",
	},
};

const NAV_LINKS = [
	{ href: "/admin", icon: "🛡", label: "Admin" },
	{ href: "/admin/posts", icon: "✏", label: "Posts" },
	{ href: "/admin/galary", icon: "🖼", label: "Gallery" },
	{ href: "/admin/transactions", icon: "₹", label: "Transactions" },
	{ href: "/dashboard/profile", icon: "👤", label: "Profile" },
];

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

.status-live{background:rgba(16,185,129,0.9);border:1px solid rgba(255,255,255,0.3);color:#fff;}
.status-draft{background:rgba(100,116,139,0.9);border:1px solid rgba(255,255,255,0.3);color:#fff;}
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
export default function AdminPostsClient({ initialPosts }: { initialPosts: any[] }) {
	const [isDark, setIsDark] = useState(false);
	const [posts, setPosts] = useState(initialPosts);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const router = useRouter();

	const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

	useEffect(() => {
		const savedTheme = localStorage.getItem("csc_theme");
		if (savedTheme) setIsDark(savedTheme === "dark");
		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, [user]);

	const T = isDark ? THEMES.dark : THEMES.light;

	// ─── HANDLERS ─── (Preserved Exactly)
	const toggleTheme = () => {
		const newDark = !isDark; setIsDark(newDark);
		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
	};

	const handleDelete = async (id: string, title: string) => {
		if (!window.confirm(`Are you absolutely sure you want to delete "${title}"? This cannot be undone.`)) return;

		setDeletingId(id);
		try {
			await adminDeletePostAction(id);
			setPosts(posts.filter(p => p.id !== id));
		} catch (err) {
			alert("Failed to delete post.");
		} finally {
			setDeletingId(null);
		}
	};

	const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

	return (
		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: "background .25s, color .25s", paddingBottom: 60 }}>
			<style dangerouslySetInnerHTML={{ __html: buildCss(T) }} />

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
							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
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
					<h1 className="serif" style={{ color: "#FFFFFF", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 12, fontWeight: 700 }}>
						Manage Posts
					</h1>
					<p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
						Create, edit, or remove live posts from the portal. Changes reflect instantly.
					</p>
				</div>
			</div>=

			{/* ════════════════════════════════════════════════════════
          FILTER & CREATE BAR
      ════════════════════════════════════════════════════════ */}
			<div style={{ maxWidth: 1200, margin: "-36px auto 32px", padding: "0 16px", position: "relative", zIndex: 10 }}>
				<div className="card" style={{ padding: "12px 16px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
					<div style={{ position: "relative", flex: 1, minWidth: 280, display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "0 14px", transition: "all .2s" }}>
						<span style={{ color: T.inputPlaceholder, marginRight: 10, fontSize: 16 }}>🔍</span>
						<input
							type="text"
							className="inp"
							placeholder="Search by post name..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{ border: "none", background: "transparent", flex: 1, padding: "12px 0" }}
						/>
						{search && (
							<button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4, fontSize: 14 }}>
								✕
							</button>
						)}
					</div>
					<Link href="/admin/posts/create" className="btn btn-p" style={{ textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14 }}>
						<span style={{ fontSize: 18 }}>+</span> Create New Post
					</Link>
				</div>
			</div>

			{/* ════════════════════════════════════════════════════════
          POSTS GRID
      ════════════════════════════════════════════════════════ */}
			<div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, flex: 1 }}>
				{filteredPosts.map((post) => {
					const t = THEME_MAP[post.theme] || THEME_MAP.blue;
					const bgImage = post.banner_url ? `url(${post.banner_url})` : `linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 50%, ${t.accent} 100%)`;

					return (
						<div
							key={post.id}
							className="card"
							style={{
								borderRadius: 16,
								display: "flex",
								flexDirection: "column",
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								position: "relative",
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
							{/* Status Badge */}
							<div style={{
								position: "absolute",
								top: 16,
								right: 16,
								zIndex: 10,
								padding: "4px 12px",
								borderRadius: 20,
								fontSize: 11,
								fontWeight: 800,
								backdropFilter: "blur(8px)",
								display: "flex",
								alignItems: "center",
								gap: 6,
							}} className={post.is_published ? "status-live" : "status-draft"}>
								<span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
								{post.is_published ? "LIVE" : "DRAFT"}
							</div>

							{/* Thumbnail */}
							<div style={{ height: 160, width: "100%", background: bgImage, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
								<div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)" }} />
								<span style={{
									position: "relative",
									zIndex: 10,
									background: "rgba(255,255,255,0.15)",
									backdropFilter: "blur(8px)",
									border: "1px solid rgba(255,255,255,0.3)",
									color: "#fff",
									fontSize: 10,
									fontWeight: 700,
									padding: "4px 10px",
									borderRadius: 20,
									textTransform: "uppercase",
									letterSpacing: "0.5px",
								}}>
									{post.category}
								</span>
							</div>

							{/* Content */}
							<div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
								<div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, marginBottom: 8 }}>
									🗓️ Posted: {formatDate(post.post_date)}
								</div>
								<h3 style={{
									fontSize: 17,
									fontWeight: 800,
									color: T.textPrimary,
									lineHeight: 1.4,
									marginBottom: "auto",
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
								}}>
									{post.title}
								</h3>

								{/* Admin Actions */}
								<div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 16, marginTop: 16, display: "flex", gap: 12 }}>
									<button
										onClick={() => router.push(`/admin/posts/create?id=${post.id}`)}
										className="btn btn-g"
										style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10, fontSize: 13 }}
									>
										✏️ Edit
									</button>
									<button
										onClick={() => handleDelete(post.id, post.title)}
										disabled={deletingId === post.id}
										className="btn btn-d"
										style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10, fontSize: 13 }}
									>
										{deletingId === post.id ? "⏳..." : "🗑️ Delete"}
									</button>
								</div>
							</div>
						</div>
					);
				})}

				{filteredPosts.length === 0 && (
					<div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", background: T.cardBg, borderRadius: 16, border: `1.5px dashed ${T.cardBorder}`, color: T.textMuted }}>
						<div style={{ width: 64, height: 64, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>📭</div>
						<h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No posts found</h3>
						<p style={{ fontSize: 14 }}>You haven't created any posts matching that search yet.</p>
					</div>
				)}
			</div>
		</div>
	);
}