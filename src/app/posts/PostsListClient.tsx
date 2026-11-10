
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useAuth } from "@/components/AuthProvider";

// // ─── TYPES ────────────────────────────────────────────────────────────────────
// export interface PostSummary {
// 	id: string;
// 	title: string;
// 	title_hi: string;
// 	short_desc: string;
// 	theme: string;
// 	category: string;
// 	total_posts: number;
// 	post_date: string;
// 	banner_url?: string;
// 	slug: string;
// }

// // ─── THEME CONFIG (per-post accent colours — data-driven, preserved) ─────────
// const THEME_MAP: Record<string, { primary: string; dark: string; light: string; badge: string; ring: string; btn: string; accent: string }> = {
// 	blue: { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", badge: "#dbeafe", ring: "#93c5fd", btn: "bg-blue-600 hover:bg-blue-700", accent: "#3b82f6" },
// 	green: { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", badge: "#dcfce7", ring: "#86efac", btn: "bg-green-600 hover:bg-green-700", accent: "#22c55e" },
// 	red: { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", badge: "#fee2e2", ring: "#fca5a5", btn: "bg-red-600 hover:bg-red-700", accent: "#ef4444" },
// 	orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", badge: "#fed7aa", ring: "#fdba74", btn: "bg-orange-600 hover:bg-orange-700", accent: "#f97316" },
// 	purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", badge: "#ede9fe", ring: "#c4b5fd", btn: "bg-violet-600 hover:bg-violet-700", accent: "#8b5cf6" },
// 	teal: { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", badge: "#ccfbf1", ring: "#5eead4", btn: "bg-teal-600 hover:bg-teal-700", accent: "#14b8a6" },
// 	indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", badge: "#e0e7ff", ring: "#a5b4fc", btn: "bg-indigo-600 hover:bg-indigo-700", accent: "#6366f1" },
// 	rose: { primary: "#be123c", dark: "#881337", light: "#fff1f2", badge: "#ffe4e6", ring: "#fda4af", btn: "bg-rose-600 hover:bg-rose-700", accent: "#f43f5e" },
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // DUAL THEME TOKENS
// // ════════════════════════════════════════════════════════════════════════════════
// const THEMES = {
// 	light: {
// 		pageBg: "#f1f5f9",
// 		navBg: "#1e3a8a",
// 		navBottomBorder: "#3b82f6",
// 		navText: "rgba(255,255,255,0.65)",
// 		navTextHover: "#ffffff",
// 		navBrand: "#ffffff",
// 		navBrandAccent: "#93c5fd",
// 		cardBg: "#ffffff",
// 		cardBorder: "#e2e8f0",
// 		cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
// 		sectionGrad: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
// 		sectionGradText: "#ffffff",
// 		textPrimary: "#1e293b",
// 		textSecondary: "#475569",
// 		textMuted: "#94a3b8",
// 		accent: "#2563eb",
// 		accentHover: "#1d4ed8",
// 		accentLight: "#eff6ff",
// 		accentBorder: "#bfdbfe",
// 		inputBg: "#f8fafc",
// 		inputBorder: "#e2e8f0",
// 		inputFocusBorder: "#3b82f6",
// 		inputText: "#1e293b",
// 		inputPlaceholder: "#94a3b8",
// 		divider: "#e2e8f0",
// 		pillBg: "#f1f5f9",
// 		pillBorder: "#e2e8f0",
// 		pillText: "#64748b",
// 		pillActiveBg: "#dbeafe",
// 		pillActiveBorder: "#93c5fd",
// 		pillActiveText: "#1d4ed8",
// 		btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)",
// 		btnPrimaryText: "#ffffff",
// 		btnPrimaryGlow: "rgba(37,99,235,0.35)",
// 		btnGhostBg: "#f1f5f9",
// 		btnGhostBorder: "#e2e8f0",
// 		btnGhostText: "#475569",
// 		btnGhostHoverBg: "#eff6ff",
// 		btnGhostHoverText: "#2563eb",
// 		btnDangerBg: "#fef2f2",
// 		btnDangerBorder: "#fecaca",
// 		btnDangerText: "#dc2626",
// 		btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)",
// 		btnSuccessText: "#ffffff",
// 		modalOverlay: "rgba(15,23,42,0.55)",
// 		modalBg: "#ffffff",
// 		modalBorder: "#e2e8f0",
// 		scrollThumb: "#bfdbfe",
// 		payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
// 		payPaidGrad: "linear-gradient(135deg,#15803d,#16a34a)",
// 		docIconBg: "#fef2f2",
// 		docIconBorder: "#fecaca",
// 		docIconColor: "#dc2626",
// 		toggleIcon: "🌙",
// 		toggleLabel: "Dark",
// 	},
// 	dark: {
// 		pageBg: "#060b14",
// 		navBg: "rgba(6,11,20,0.98)",
// 		navBottomBorder: "#f59e0b",
// 		navText: "rgba(255,255,255,0.45)",
// 		navTextHover: "#ffffff",
// 		navBrand: "#ffffff",
// 		navBrandAccent: "#f59e0b",
// 		cardBg: "rgba(255,255,255,0.03)",
// 		cardBorder: "rgba(255,255,255,0.08)",
// 		cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
// 		sectionGrad: "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
// 		sectionGradText: "#000000",
// 		textPrimary: "#f1f5f9",
// 		textSecondary: "rgba(255,255,255,0.55)",
// 		textMuted: "rgba(255,255,255,0.28)",
// 		accent: "#f59e0b",
// 		accentHover: "#d97706",
// 		accentLight: "rgba(245,158,11,0.08)",
// 		accentBorder: "rgba(245,158,11,0.25)",
// 		inputBg: "rgba(255,255,255,0.05)",
// 		inputBorder: "rgba(255,255,255,0.08)",
// 		inputFocusBorder: "rgba(245,158,11,0.5)",
// 		inputText: "#f1f5f9",
// 		inputPlaceholder: "rgba(255,255,255,0.25)",
// 		divider: "rgba(255,255,255,0.06)",
// 		pillBg: "rgba(255,255,255,0.03)",
// 		pillBorder: "rgba(255,255,255,0.08)",
// 		pillText: "rgba(255,255,255,0.4)",
// 		pillActiveBg: "rgba(245,158,11,0.15)",
// 		pillActiveBorder: "rgba(245,158,11,0.4)",
// 		pillActiveText: "#f59e0b",
// 		btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)",
// 		btnPrimaryText: "#000000",
// 		btnPrimaryGlow: "rgba(245,158,11,0.35)",
// 		btnGhostBg: "rgba(255,255,255,0.05)",
// 		btnGhostBorder: "rgba(255,255,255,0.1)",
// 		btnGhostText: "rgba(255,255,255,0.7)",
// 		btnGhostHoverBg: "rgba(245,158,11,0.1)",
// 		btnGhostHoverText: "#f59e0b",
// 		btnDangerBg: "rgba(239,68,68,0.1)",
// 		btnDangerBorder: "rgba(239,68,68,0.25)",
// 		btnDangerText: "#f87171",
// 		btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)",
// 		btnSuccessText: "#ffffff",
// 		modalOverlay: "rgba(0,0,0,0.85)",
// 		modalBg: "#0f172a",
// 		modalBorder: "rgba(255,255,255,0.1)",
// 		scrollThumb: "rgba(245,158,11,0.3)",
// 		payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
// 		payPaidGrad: "linear-gradient(135deg,#065f46,#047857)",
// 		docIconBg: "rgba(239,68,68,0.12)",
// 		docIconBorder: "rgba(239,68,68,0.28)",
// 		docIconColor: "#f87171",
// 		toggleIcon: "☀️",
// 		toggleLabel: "Light",
// 	},
// } as const;

// type ThemeTokens = typeof THEMES.light;

// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/delivery" : "http://localhost:3000/delivery", icon: "📦", label: "Delivery" },
// ];

// const Ico = {
// 	Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
// 	X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
// };

// function buildCss(T: ThemeTokens): string {
// 	return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans',sans-serif;}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// .mono{font-family:'JetBrains Mono',monospace;}

// @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
// @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}

// .top-nav-link{
//   display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
//   font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
//   transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
// }
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

// .pill{
//   padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
//   cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
//   background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
// }
// .pill:hover{border-color:${T.accent};color:${T.accent};}
// .pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

// .inp{
//   width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
//   border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
//   transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
// }
// .inp:focus{border-color:${T.inputFocusBorder};}
// .inp::placeholder{color:${T.inputPlaceholder};}

// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

// .sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
// .sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

// .tog{
//   display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
//   border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
//   color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
//   transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
// }
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}
// `;
// }

// function formatDate(d: string) {
// 	if (!d) return "";
// 	try {
// 		return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
// 	} catch { return d; }
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ════════════════════════════════════════════════════════════════════════════════
// export default function PostsListClient({ posts }: { posts: PostSummary[] }) {
// 	const [isDark, setIsDark] = useState(false);
// 	const [search, setSearch] = useState("");
// 	const [selectedCategory, setSelectedCategory] = useState("All");

// 	const T = isDark ? THEMES.dark : THEMES.light;

// 	const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

// 	useEffect(() => {
// 		const savedTheme = localStorage.getItem("csc_theme");
// 		if (savedTheme) setIsDark(savedTheme === "dark");
// 		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
// 	}, [user]);
// 	// Extract unique categories from the database for the filter buttons
// 	const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

// 	// ─── HANDLERS ─── (Preserved Exactly)
// 	const toggleTheme = () => {
// 		const newDark = !isDark; setIsDark(newDark);
// 		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
// 	};

// 	// Filter posts based on search and category
// 	const filteredPosts = posts.filter((p) => {
// 		const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
// 			p.short_desc?.toLowerCase().includes(search.toLowerCase());
// 		const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
// 		return matchesSearch && matchesCategory;
// 	});

// 	return (
// 		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: "background .25s, color .25s" }}>
// 			<style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

// 			{/* ════════════════════════════════════════════════════════
//           HEADER — deep indigo / amber
//       ════════════════════════════════════════════════════════ */}
// 			<header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
// 				<div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
// 					<a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
// 						<div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
// 						<div>
// 							<div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
// 								Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
// 							</div>
// 							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>OPPORTUNITIES</div>
// 						</div>
// 					</a>

// 					<div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

// 					<nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
// 						{NAV_LINKS.map((l) => (
// 							<a key={l.href} href={l.href} className="top-nav-link">
// 								<span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
// 							</a>
// 						))}
// 					</nav>

// 					<button className="tog" onClick={toggleTheme}>
// 						<span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
// 					</button>
// 				</div>
// 			</header>

// 			{/* ════════════════════════════════════════════════════════
//           HERO
//       ════════════════════════════════════════════════════════ */}
// 			<div style={{
// 				background: isDark
// 					? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
// 					: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
// 				padding: "60px 24px 80px",
// 				textAlign: "center",
// 				position: "relative",
// 				overflow: "hidden"
// 			}}>
// 				<div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
// 				<div style={{ position: "relative", zIndex: 1 }}>
// 					<h1 className="serif" style={{ color: "#ffffff", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 12, fontWeight: 700 }}>
// 						Latest Opportunities
// 					</h1>
// 					<p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
// 						Explore the newest government jobs, admissions, and scholarship forms verified by CSC Shambhuganj.
// 					</p>
// 				</div>
// 			</div>

// 			{/* ════════════════════════════════════════════════════════
//           FILTER BAR
//       ════════════════════════════════════════════════════════ */}
// 			<div style={{ maxWidth: 1200, margin: "-24px auto 32px", padding: "0 16px", position: "relative", zIndex: 10 }}>
// 				<div className="card" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
// 					<div style={{ position: "relative", flex: 1, minWidth: 280, display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "0 14px", transition: "all .2s" }}>
// 						<span style={{ color: T.inputPlaceholder, marginRight: 10, display: "flex" }}><Ico.Search /></span>
// 						<input
// 							type="text"
// 							className="inp"
// 							placeholder="Search by post name or keyword..."
// 							value={search}
// 							onChange={(e) => setSearch(e.target.value)}
// 							style={{ border: "none", background: "transparent", flex: 1, padding: "12px 0" }}
// 						/>
// 						{search && (
// 							<button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4, display: "flex" }}>
// 								<Ico.X />
// 							</button>
// 						)}
// 					</div>
// 					<div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
// 						{categories.map((cat) => (
// 							<button
// 								key={cat}
// 								className={`pill ${selectedCategory === cat ? "on" : ""}`}
// 								onClick={() => setSelectedCategory(cat)}
// 							>
// 								{cat}
// 							</button>
// 						))}
// 					</div>
// 				</div>
// 			</div>

// 			{/* ════════════════════════════════════════════════════════
//           POSTS GRID
//       ════════════════════════════════════════════════════════ */}
// 			<div style={{ maxWidth: 1200, margin: "0 auto 60px", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, flex: 1 }}>
// 				{filteredPosts.length > 0 ? (
// 					filteredPosts.map((post) => {
// 						const t = THEME_MAP[post.theme] || THEME_MAP.blue;
// 						const bgImage = post.banner_url
// 							? `url(${post.banner_url})`
// 							: `linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 50%, ${t.accent} 100%)`;

// 						return (
// 							<Link
// 								href={`/posts/${post.id}`}
// 								key={post.id}
// 								style={{
// 									background: T.cardBg,
// 									borderRadius: 16,
// 									overflow: "hidden",
// 									textDecoration: "none",
// 									display: "flex",
// 									flexDirection: "column",
// 									boxShadow: T.cardShadow,
// 									border: `1px solid ${T.cardBorder}`,
// 									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// 									position: "relative",
// 									color: "inherit",
// 								}}
// 								onMouseEnter={(e) => {
// 									const el = e.currentTarget;
// 									el.style.transform = "translateY(-6px)";
// 									el.style.boxShadow = isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
// 									el.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1";
// 								}}
// 								onMouseLeave={(e) => {
// 									const el = e.currentTarget;
// 									el.style.transform = "translateY(0)";
// 									el.style.boxShadow = T.cardShadow;
// 									el.style.borderColor = T.cardBorder;
// 								}}
// 							>
// 								{/* Thumbnail */}
// 								<div style={{ height: 160, width: "100%", background: bgImage, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
// 									<div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)" }} />
// 									<span style={{
// 										position: "relative",
// 										zIndex: 10,
// 										background: "rgba(255,255,255,0.15)",
// 										backdropFilter: "blur(8px)",
// 										border: "1px solid rgba(255,255,255,0.3)",
// 										color: "#fff",
// 										fontSize: 10,
// 										fontWeight: 800,
// 										padding: "4px 10px",
// 										borderRadius: 20,
// 										textTransform: "uppercase",
// 										letterSpacing: "0.5px",
// 									}}>
// 										{post.category}
// 									</span>
// 								</div>

// 								{/* Body */}
// 								<div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
// 									<div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
// 										<span style={{ color: t.primary }}>🗓️</span> {formatDate(post.post_date)}
// 									</div>
// 									<h3 style={{
// 										fontSize: 17,
// 										fontWeight: 800,
// 										color: T.textPrimary,
// 										lineHeight: 1.4,
// 										marginBottom: 8,
// 										display: "-webkit-box",
// 										WebkitLineClamp: 2,
// 										WebkitBoxOrient: "vertical",
// 										overflow: "hidden",
// 									}}>
// 										{post.title}
// 									</h3>
// 									<p style={{
// 										fontSize: 13,
// 										color: T.textSecondary,
// 										lineHeight: 1.6,
// 										marginBottom: 16,
// 										display: "-webkit-box",
// 										WebkitLineClamp: 2,
// 										WebkitBoxOrient: "vertical",
// 										overflow: "hidden",
// 										flex: 1,
// 									}}>
// 										{post.short_desc}
// 									</p>

// 									{/* Footer */}
// 									<div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// 										<div style={{ display: "flex", flexDirection: "column" }}>
// 											<span className="serif" style={{ fontSize: 20, fontWeight: 700, color: t.primary }}>
// 												{post.total_posts > 0 ? post.total_posts.toLocaleString("en-IN") : "N/A"}
// 											</span>
// 											<span style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Vacancies</span>
// 										</div>
// 										<div style={{
// 											padding: "8px 16px",
// 											borderRadius: 8,
// 											background: t.primary,
// 											color: "#fff",
// 											fontSize: 12,
// 											fontWeight: 700,
// 											transition: "filter 0.2s",
// 										}}>
// 											View Details →
// 										</div>
// 									</div>
// 								</div>
// 							</Link>
// 						);
// 					})
// 				) : (
// 					<div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", background: T.cardBg, borderRadius: 16, border: `1.5px dashed ${T.cardBorder}`, color: T.textMuted }}>
// 						<div style={{ width: 64, height: 64, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>📭</div>
// 						<h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No posts found</h3>
// 						<p style={{ fontSize: 14 }}>Try adjusting your search or category filter.</p>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }











"use client";

/**
 * PostsListClient.tsx — REDESIGNED for
 * D:\csc-platform\src\app\posts\PostsListClient.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same props as
 * before: PostsListClient({ posts }: { posts: PostSummary[] }).
 *
 * DESIGN: a jobs & admissions listing — a navy header, a plain hero,
 * a search bar with category pills, and a grid of post cards. Every
 * card has the same shape: banner (photo, or the post theme's solid
 * colour when there is no banner), category badge, date, title, two
 * lines of description, vacancy count, and a View Details button.
 * No gradients, no serif display font, no hover tricks that rewrite
 * styles in JS.
 *
 * KEPT, exactly as supplied:
 * - The PostSummary interface and every field it carries.
 * - THEME_MAP (the 8 per-post theme colours from the database) —
 *   still used for the banner fallback and the View Details button
 *   / vacancy count, as solid colours, not gradients.
 * - The 7 nav links and their labels (Dashboard, Posts, Gallery,
 *   Notifications, Profile, Status, Delivery); Posts is the active
 *   link on this page.
 * - Search (matches title and short_desc) and the category filter
 *   (categories derived from the posts themselves, "All" first).
 * - formatDate (en-IN, day + short month + year), card links to
 *   /posts/${post.id}, total_posts with "N/A" when 0, and the
 *   "No posts found" empty state.
 * - The theme state (localStorage csc_theme, system fallback) and
 *   the toggle — plus the `dark` class sync, so Tailwind `dark:`
 *   classes work. The theme effect keeps its [user] dependency
 *   as supplied.
 *
 * CHANGED:
 * - Nav links were absolute URLs chosen by NODE_ENV (production
 *   https://srilalsahaj.co.in/... vs http://localhost:3000/...) —
 *   now relative routes (/dashboard, /posts, ...). Same destinations
 *   on every domain, one less place to break when the domain changes.
 * - Icons were emoji (🏛️ 📱 ✏️ 🖼️ 🔔 👤 📊 📦 🗓️ 📭) — lucide
 *   icons now.
 * - The whole THEMES object, ThemeTokens type and buildCss() are
 *   gone: the Google Fonts @import, the global * { margin: 0;
 *   padding: 0 } reset (dangerous inside a component — it reset
 *   every page the component rendered on), the fadeIn/pop keyframes,
 *   and the .pill / .top-nav-link / .serif / .sec-hdr classes are
 *   all Tailwind classes now.
 * - Card hover was onMouseEnter/onMouseLeave style mutation —
 *   Tailwind hover: classes now.
 * - The hero was a two-stop gradient with a dotted pattern —
 *   now a solid navy band.
 * - The banner fallback was a 3-stop gradient — now the post
 *   theme's solid dark colour, with the real banner photo on top
 *   when there is one. The dark overlay on the banner is gone;
 *   the category badge sits on a solid translucent chip instead.
 *
 * FLAGGED (kept as supplied, not changed):
 * - useAuth is destructured (user, isLoggedIn, logout, authLoading)
 *   but none of it is used in the render — same as the original.
 *   The theme effect re-runs on every user change because of its
 *   [user] dependency, also as supplied.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  CalendarDays,
  Image as ImageIcon,
  Inbox,
  Landmark,
  LayoutDashboard,
  Moon,
  Package,
  PenLine,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
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

const NAV_LINKS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts", icon: PenLine, label: "Posts" },
  { href: "/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/status", icon: BarChart3, label: "Status" },
  { href: "/delivery", icon: Package, label: "Delivery" },
];

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

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, [user]);

  // Sync the `dark` class on <html> so Tailwind `dark:` variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      {/* ════════════════════════════════════════════════════════
          HEADER — navy in both themes
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b-[3px] border-blue-600 bg-[#0b2239] shadow-md dark:border-blue-500 dark:bg-[#081120]">
        <div className="flex h-14 items-center gap-3.5 border-b border-white/10 px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white">
              <Landmark size={17} />
            </span>
            <span>
              <span className="block text-[17px] font-bold leading-none tracking-tight text-white">
                Srilal<span className="text-blue-300">CSC</span>
              </span>
              <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.1em] text-white/40">
                OPPORTUNITIES
              </span>
            </span>
          </Link>

          <div className="h-[26px] w-px shrink-0 bg-white/10" />

          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon;
              const active = l.href === "/posts";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={13} /> {l.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-blue-400/40 bg-white/10 px-2 py-1 text-xs font-bold text-white/70 transition-colors hover:border-blue-400 hover:text-white"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />} {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <div className="bg-[#1e3a8a] px-6 pb-20 pt-[60px] text-center dark:bg-[#0b2239]">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Latest Opportunities
        </h1>
        <p className="mx-auto mt-3 max-w-[600px] text-base leading-relaxed text-white/85">
          Explore the newest government jobs, admissions, and scholarship forms verified by CSC Shambhuganj.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════
          FILTER BAR
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto -mt-6 mb-8 w-full max-w-[1200px] px-4">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111a2e]">
          <div className="flex min-w-[280px] flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3.5 transition-colors focus-within:border-blue-500 dark:border-slate-700 dark:bg-white/5">
            <Search size={14} className="mr-2.5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search by post name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full flex-1 border-0 focus:outline-none bg-transparent py-3 text-[13.5px] text-slate-900 placeholder:text-slate-400 dark:text-slate-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex cursor-pointer border-0 bg-transparent p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 cursor-pointer rounded-full border px-3 py-2 !text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  selectedCategory === cat
                    ? "border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-400"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:bg-white/5 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
                }`}
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
      <div className="mx-auto mb-[60px] grid w-full max-w-[1200px] flex-1 grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const t = THEME_MAP[post.theme] || THEME_MAP.blue;

            return (
              <Link
                href={`/posts/${post.id}`}
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-inherit no-underline shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-[#111a2e] dark:hover:border-slate-600"
              >
                {/* Thumbnail */}
                <div
                  className="relative flex h-40 w-full items-end bg-cover bg-center p-4"
                  style={post.banner_url ? { backgroundImage: `url(${post.banner_url})` } : { backgroundColor: t.dark }}
                >
                  <span className="relative z-10 rounded-full border border-white/30 bg-slate-900/60 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                    {post.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <CalendarDays size={13} style={{ color: t.primary }} /> {formatDate(post.post_date)}
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-[17px] font-extrabold leading-snug text-slate-900 dark:text-slate-100">
                    {post.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 flex-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {post.short_desc}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold" style={{ color: t.primary }}>
                        {post.total_posts > 0 ? post.total_posts.toLocaleString("en-IN") : "N/A"}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Vacancies</span>
                    </div>
                    <span
                      className="rounded-lg px-4 py-2 text-xs font-bold text-white transition group-hover:brightness-110"
                      style={{ backgroundColor: t.primary }}
                    >
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border-[1.5px] border-dashed border-slate-200 bg-white px-5 py-[60px] text-center text-slate-400 dark:border-slate-800 dark:bg-[#111a2e]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400">
              <Inbox size={28} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">No posts found</h3>
            <p className="text-sm">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
