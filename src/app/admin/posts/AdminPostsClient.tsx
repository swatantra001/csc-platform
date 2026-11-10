
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { adminDeletePostAction } from "@/app/actions/admin";
// import { useAuth } from "@/components/AuthProvider";

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
// // DUAL THEME TOKENS — Mutable type to avoid readonly conflicts
// // ════════════════════════════════════════════════════════════════════════════════
// interface ThemeTokens {
// 	pageBg: string;
// 	navBg: string;
// 	navBottomBorder: string;
// 	navText: string;
// 	navTextHover: string;
// 	navBrand: string;
// 	navBrandAccent: string;
// 	cardBg: string;
// 	cardBorder: string;
// 	cardShadow: string;
// 	sectionGrad: string;
// 	sectionGradText: string;
// 	textPrimary: string;
// 	textSecondary: string;
// 	textMuted: string;
// 	accent: string;
// 	accentHover: string;
// 	accentLight: string;
// 	accentBorder: string;
// 	inputBg: string;
// 	inputBorder: string;
// 	inputFocusBorder: string;
// 	inputText: string;
// 	inputPlaceholder: string;
// 	divider: string;
// 	pillBg: string;
// 	pillBorder: string;
// 	pillText: string;
// 	pillActiveBg: string;
// 	pillActiveBorder: string;
// 	pillActiveText: string;
// 	btnPrimary: string;
// 	btnPrimaryText: string;
// 	btnPrimaryGlow: string;
// 	btnGhostBg: string;
// 	btnGhostBorder: string;
// 	btnGhostText: string;
// 	btnGhostHoverBg: string;
// 	btnGhostHoverText: string;
// 	btnDangerBg: string;
// 	btnDangerBorder: string;
// 	btnDangerText: string;
// 	btnSuccessBg: string;
// 	btnSuccessText: string;
// 	modalOverlay: string;
// 	modalBg: string;
// 	modalBorder: string;
// 	scrollThumb: string;
// 	toggleIcon: string;
// 	toggleLabel: string;
// }

// const THEMES: Record<"light" | "dark", ThemeTokens> = {
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
// 		toggleIcon: "☀️",
// 		toggleLabel: "Light",
// 	},
// };

// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
// ];

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

// .status-live{background:rgba(16,185,129,0.9);border:1px solid rgba(255,255,255,0.3);color:#fff;}
// .status-draft{background:rgba(100,116,139,0.9);border:1px solid rgba(255,255,255,0.3);color:#fff;}
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
// export default function AdminPostsClient({ initialPosts }: { initialPosts: any[] }) {
// 	const [isDark, setIsDark] = useState(false);
// 	const [posts, setPosts] = useState(initialPosts);
// 	const [deletingId, setDeletingId] = useState<string | null>(null);
// 	const [search, setSearch] = useState("");
// 	const router = useRouter();

// 	const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

// 	useEffect(() => {
// 		const savedTheme = localStorage.getItem("csc_theme");
// 		if (savedTheme) setIsDark(savedTheme === "dark");
// 		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
// 	}, [user]);

// 	const T = isDark ? THEMES.dark : THEMES.light;

// 	// ─── HANDLERS ─── (Preserved Exactly)
// 	const toggleTheme = () => {
// 		const newDark = !isDark; setIsDark(newDark);
// 		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
// 	};

// 	const handleDelete = async (id: string, title: string) => {
// 		if (!window.confirm(`Are you absolutely sure you want to delete "${title}"? This cannot be undone.`)) return;

// 		setDeletingId(id);
// 		try {
// 			await adminDeletePostAction(id);
// 			setPosts(posts.filter(p => p.id !== id));
// 		} catch (err) {
// 			alert("Failed to delete post.");
// 		} finally {
// 			setDeletingId(null);
// 		}
// 	};

// 	const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

// 	return (
// 		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: "background .25s, color .25s", paddingBottom: 60 }}>
// 			<style dangerouslySetInnerHTML={{ __html: buildCss(T) }} />

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
// 							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
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
// <div style={{
// 				background: isDark
// 					? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
// 					: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
// 				padding: "60px 24px 80px",
// 				textAlign: "center",
// 				position: "relative",
// 				overflow: "hidden"
// 			}}>				
// 			<div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
// 				<div style={{ position: "relative", zIndex: 1 }}>
// 					<h1 className="serif" style={{ color: "#FFFFFF", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 12, fontWeight: 700 }}>
// 						Manage Posts
// 					</h1>
// 					<p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
// 						Create, edit, or remove live posts from the portal. Changes reflect instantly.
// 					</p>
// 				</div>
// 			</div>=

// 			{/* ════════════════════════════════════════════════════════
//           FILTER & CREATE BAR
//       ════════════════════════════════════════════════════════ */}
// 			<div style={{ maxWidth: 1200, margin: "-36px auto 32px", padding: "0 16px", position: "relative", zIndex: 10 }}>
// 				<div className="card" style={{ padding: "12px 16px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
// 					<div style={{ position: "relative", flex: 1, minWidth: 280, display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "0 14px", transition: "all .2s" }}>
// 						<span style={{ color: T.inputPlaceholder, marginRight: 10, fontSize: 16 }}>🔍</span>
// 						<input
// 							type="text"
// 							className="inp"
// 							placeholder="Search by post name..."
// 							value={search}
// 							onChange={(e) => setSearch(e.target.value)}
// 							style={{ border: "none", background: "transparent", flex: 1, padding: "12px 0" }}
// 						/>
// 						{search && (
// 							<button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4, fontSize: 14 }}>
// 								✕
// 							</button>
// 						)}
// 					</div>
// 					<Link href="/admin/posts/create" className="btn btn-p" style={{ textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14 }}>
// 						<span style={{ fontSize: 18 }}>+</span> Create New Post
// 					</Link>
// 				</div>
// 			</div>

// 			{/* ════════════════════════════════════════════════════════
//           POSTS GRID
//       ════════════════════════════════════════════════════════ */}
// 			<div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, flex: 1 }}>
// 				{filteredPosts.map((post) => {
// 					const t = THEME_MAP[post.theme] || THEME_MAP.blue;
// 					const bgImage = post.banner_url ? `url(${post.banner_url})` : `linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 50%, ${t.accent} 100%)`;

// 					return (
// 						<div
// 							key={post.id}
// 							className="card"
// 							style={{
// 								borderRadius: 16,
// 								display: "flex",
// 								flexDirection: "column",
// 								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// 								position: "relative",
// 							}}
// 							onMouseEnter={(e) => {
// 								const el = e.currentTarget;
// 								el.style.transform = "translateY(-6px)";
// 								el.style.boxShadow = isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
// 								el.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1";
// 							}}
// 							onMouseLeave={(e) => {
// 								const el = e.currentTarget;
// 								el.style.transform = "translateY(0)";
// 								el.style.boxShadow = T.cardShadow;
// 								el.style.borderColor = T.cardBorder;
// 							}}
// 						>
// 							{/* Status Badge */}
// 							<div style={{
// 								position: "absolute",
// 								top: 16,
// 								right: 16,
// 								zIndex: 10,
// 								padding: "4px 12px",
// 								borderRadius: 20,
// 								fontSize: 11,
// 								fontWeight: 800,
// 								backdropFilter: "blur(8px)",
// 								display: "flex",
// 								alignItems: "center",
// 								gap: 6,
// 							}} className={post.is_published ? "status-live" : "status-draft"}>
// 								<span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
// 								{post.is_published ? "LIVE" : "DRAFT"}
// 							</div>

// 							{/* Thumbnail */}
// 							<div style={{ height: 160, width: "100%", background: bgImage, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
// 								<div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)" }} />
// 								<span style={{
// 									position: "relative",
// 									zIndex: 10,
// 									background: "rgba(255,255,255,0.15)",
// 									backdropFilter: "blur(8px)",
// 									border: "1px solid rgba(255,255,255,0.3)",
// 									color: "#fff",
// 									fontSize: 10,
// 									fontWeight: 700,
// 									padding: "4px 10px",
// 									borderRadius: 20,
// 									textTransform: "uppercase",
// 									letterSpacing: "0.5px",
// 								}}>
// 									{post.category}
// 								</span>
// 							</div>

// 							{/* Content */}
// 							<div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
// 								<div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, marginBottom: 8 }}>
// 									🗓️ Posted: {formatDate(post.post_date)}
// 								</div>
// 								<h3 style={{
// 									fontSize: 17,
// 									fontWeight: 800,
// 									color: T.textPrimary,
// 									lineHeight: 1.4,
// 									marginBottom: "auto",
// 									display: "-webkit-box",
// 									WebkitLineClamp: 2,
// 									WebkitBoxOrient: "vertical",
// 									overflow: "hidden",
// 								}}>
// 									{post.title}
// 								</h3>

// 								{/* Admin Actions */}
// 								<div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 16, marginTop: 16, display: "flex", gap: 12 }}>
// 									<button
// 										onClick={() => router.push(`/admin/posts/create?id=${post.id}`)}
// 										className="btn btn-g"
// 										style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10, fontSize: 13 }}
// 									>
// 										✏️ Edit
// 									</button>
// 									<button
// 										onClick={() => handleDelete(post.id, post.title)}
// 										disabled={deletingId === post.id}
// 										className="btn btn-d"
// 										style={{ flex: 1, justifyContent: "center", padding: 10, borderRadius: 10, fontSize: 13 }}
// 									>
// 										{deletingId === post.id ? "⏳..." : "🗑️ Delete"}
// 									</button>
// 								</div>
// 							</div>
// 						</div>
// 					);
// 				})}

// 				{filteredPosts.length === 0 && (
// 					<div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", background: T.cardBg, borderRadius: 16, border: `1.5px dashed ${T.cardBorder}`, color: T.textMuted }}>
// 						<div style={{ width: 64, height: 64, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>📭</div>
// 						<h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No posts found</h3>
// 						<p style={{ fontSize: 14 }}>You haven't created any posts matching that search yet.</p>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }













// src/app/admin/posts/AdminPostsClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\posts\AdminPostsClient.tsx.
// No new file needed.
//
// KEPT (all logic exactly as supplied):
// - THEME_MAP (8 post themes: blue, green, red, orange, purple, teal, indigo,
//   rose — primary / dark / light / badge / ring / btn / accent). The per-post
//   colours are data, not decoration: they identify the post, so the banner
//   fallback and the Edit/Delete button colours still come from them. The
//   `btn` values are the original Tailwind classes (e.g. "bg-blue-600
//   hover:bg-blue-700") and are used unchanged.
// - formatDate() (en-IN, day 2-digit, month short, year numeric; returns the
//   raw string on error, "" for an empty date).
// - Title-only search filter (case-insensitive substring on post.title).
// - handleDelete(id, title): window.confirm with the post title
//   ("Are you absolutely sure you want to delete ...? This cannot be
//   undone."), deletingId state, adminDeletePostAction(id), list filtered
//   locally on success, alert("Failed to delete post.") on error, deletingId
//   cleared in finally.
// - Hero copy verbatim: "Manage Posts" / "Create, edit, or remove live
//   posts from the portal. Changes reflect instantly."
// - Filter/create bar overlapping the hero by 36px: search input ("Search
//   by post name...") with a clear button, "Create New Post" link to
//   /admin/posts/create.
// - Cards: banner area (image when banner_url exists, otherwise the post's
//   theme colour), category chip, LIVE / DRAFT status badge, "Posted:
//   {date}", 2-line clamped title, Edit button ->
//   router.push(`/admin/posts/create?id=${post.id}`), Delete button (shows
//   "..." while that post is deleting).
// - Empty state copy verbatim: "No posts found" / "You haven't created any
//   posts matching that search yet."
// - Header: brand "SrilalCSC" + "ADMIN PANEL", the same 6 NAV_LINKS (Admin,
//   Posts, Gallery, Forms, Transactions, Analytics), theme toggle that reads
//   / writes localStorage key "csc_theme" with a prefers-color-scheme
//   fallback, plus a dark-class sync effect on document.documentElement so
//   Tailwind dark: variants work.
// - useAuth() destructure kept exactly as supplied (see FLAG 3).
// - Brand spelling "SrilalCSC" kept as supplied.
//
// REMOVED:
// - The whole THEMES object and ThemeTokens interface; buildCss() (Google
//   Fonts @import for DM Serif Display / DM Sans / JetBrains Mono, a global
//   * margin/padding reset, and every generated class: .top-nav-link, .pill,
//   .btn, .inp, .card, .sec-hdr, .tog, .status-live, .status-draft, plus the
//   fadeIn / pop keyframes); every inline style object and every
//   onMouseEnter / onMouseLeave style mutation (hover lift is now a Tailwind
//   hover: class); the .serif / .mono classes.
// - All gradients: the hero gradient (indigo light / slate dark), the radial
//   dot pattern over the hero, the banner gradient (theme dark -> primary ->
//   accent) and the black fade overlay on the banner. The banner fallback is
//   now one solid theme colour; the hero is a plain navy panel. The light /
//   dark amber accent switch is gone: one deep-blue accent in both themes
//   via Tailwind dark: classes; site chrome uses the navy header (#0b2239 /
//   dark #081120).
// - Every emoji used as an icon or in copy: nav icons, search, clear,
//   calendar, pencil, hourglass, trash, inbox — replaced with lucide-react
//   icons (Search, X, CalendarDays, Pencil, Trash2, Loader2, Inbox, Plus
//   and the nav icons).
// - NAV_LINKS no longer build absolute URLs from NODE_ENV
//   (https://srilalsahaj.co.in/... / http://localhost:3000/...); they are
//   plain relative links: /admin, /admin/posts, /admin/galary (route
//   spelling kept), /admin/forms, /admin/transactions, /admin/analytics.
// - FLAG 1 FIX (the one intentional change, see FLAGS below): a stray "="
//   character after the hero's closing </div> in the supplied file was
//   removed. It could not be intentional JSX.
//
// FLAGS (kept as supplied, not changed — need Swatantra's word):
// 1. STRAY "=" REMOVED — the supplied file had `</div>=` at line 366, right
//    after the hero section (the "=" sat between the hero </div> and the
//    FILTER & CREATE BAR comment). A stray "=" there would have rendered a
//    literal "=" on the page between the hero and the filter bar. It looks
//    like a paste artefact, not intentional JSX, so it was removed — but
//    please confirm it was not something meaningful in your file. If it was
//    intentional, say so and it goes back in.
// 2. The theme effect depends on [user], so it re-reads csc_theme every
//    time the auth user object changes. Kept as supplied.
// 3. useAuth() destructures isLoggedIn, logout and authLoading, but none of
//    the three is ever used in this file — only `user` is used (as the theme
//    effect's dependency). Kept as supplied; they can be dropped safely.
// 4. The search matches the title only — a post whose category or
//    organisation matches but whose title does not will not show up.
// 5. Deleting a post removes it from the local list only after the server
//    action resolves; there is no refetch, so a delete that succeeded on
//    the server but threw afterwards would leave the card on screen.
// 6. The banner <div> uses an inline backgroundImage style for post
//    banner_url values — that is data (a per-post image URL), not a theme
//    token, and there is no other way to render a dynamic image URL, so it
//    stays. Everything else is Tailwind classes.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminDeletePostAction } from "@/app/actions/admin";
import { useAuth } from "@/components/AuthProvider";
import {
	Award,
  BarChart3,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Image as ImageIcon,
  Inbox,
  Loader2,
  Moon,
  Pencil,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Sun,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";

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

const NAV_LINKS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/admin", icon: ShieldCheck, label: "Admin" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/posts", icon: PenLine, label: "Posts" },
  { href: "/admin/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/forms", icon: ClipboardList, label: "Forms" },
  { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

// ─── Shared class strings ───
const btnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap";
const btnG = `${btnBase} flex-1 bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-blue-500/10 dark:hover:text-blue-400`;
const btnD = `${btnBase} flex-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25`;

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

  // ── Theme: stored choice wins, else system preference; syncs `dark` on <html> ──
  // NOTE (FLAG 2): this effect depends on [user] as supplied, so it re-reads
  // csc_theme every time the auth user object changes.
  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
    <div className="flex min-h-screen flex-col bg-slate-100 pb-16 text-slate-900 transition-colors dark:bg-[#0b1220] dark:text-slate-100">
      {/* ════════════════════════════════════════════════════════
          HEADER — navy, same chrome as the other admin pages
      ════════════════════════════════════════════════════════ */}
      <header className="z-[100] shrink-0 border-b-[3px] border-blue-500 bg-[#0b2239] shadow-[0_2px_16px_rgba(0,0,0,0.18)] dark:border-blue-400 dark:bg-[#081120]">
        <div className="flex h-[54px] items-center gap-3.5 border-b border-white/10 px-5">
          <a href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-base font-bold text-white dark:bg-blue-600">
              S
            </div>
            <div>
              <div className="text-[17px] leading-none font-bold tracking-tight text-white">
                Srilal<span className="text-blue-300 dark:text-blue-400">CSC</span>
              </div>
              <div className="mt-0.5 text-[9px] tracking-[0.1em] text-white/40">ADMIN PANEL</div>
            </div>
          </a>

          <div className="h-[26px] w-px shrink-0 bg-white/15" />

          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon;
              const active = l.href === "/admin/posts";
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {l.label}
                </a>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex shrink-0 items-center gap-2 rounded-full border-[1.5px] border-blue-500/40 bg-white/10 px-3.5 py-1.5 !text-xs font-bold whitespace-nowrap text-white/70 transition-colors hover:border-blue-500 hover:text-white"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />} {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          HERO — plain navy panel, same copy as supplied
          (FLAG 1: the stray "=" after this section's closing </div> in the
          supplied file has been removed — see the header comment.)
      ════════════════════════════════════════════════════════ */}
      <div className="bg-[#0b2239] px-6 pt-[60px] pb-20 text-center dark:bg-[#081120]">
        <h1 className="mb-3 text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-white">
          Manage Posts
        </h1>
        <p className="mx-auto max-w-[600px] text-[17px] leading-relaxed text-white/85">
          Create, edit, or remove live posts from the portal. Changes reflect instantly.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════
          FILTER & CREATE BAR
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto -mt-9 mb-8 w-full max-w-[1200px] px-4">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 px-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] dark:border-white/10 dark:bg-[#111a2e]">
          <div className="flex min-w-[280px] flex-1 items-center rounded-[10px] border border-slate-200 bg-slate-50 px-3.5 transition-colors focus-within:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-blue-400">
            <Search className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search by post name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full flex-1 border-none bg-transparent py-3 text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Link
            href="/admin/posts/create"
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-blue-700 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white no-underline transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Plus className="h-[18px] w-[18px]" /> Create New Post
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          POSTS GRID
      ════════════════════════════════════════════════════════ */}
      <div className="mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 px-4">
        {filteredPosts.map((post) => {
          const t = THEME_MAP[post.theme] || THEME_MAP.blue;
          const isDeleting = deletingId === post.id;

          return (
            <div
              key={post.id}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl dark:border-white/10 dark:bg-[#111a2e] dark:hover:border-white/20 dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              {/* Status Badge */}
              <div
                className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur-sm ${
                  post.is_published ? "bg-emerald-600/90" : "bg-slate-500/90"
                }`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                {post.is_published ? "LIVE" : "DRAFT"}
              </div>

              {/* Thumbnail — banner image when present, else the post's solid theme colour */}
              <div
                className="relative flex h-40 w-full items-end bg-cover bg-center p-4"
                style={{
                  backgroundColor: t.primary,
                  ...(post.banner_url ? { backgroundImage: `url(${post.banner_url})` } : {}),
                }}
              >
                <span className="relative z-10 rounded-full border border-white/30 bg-black/40 px-2.5 py-1 text-[10px] font-bold tracking-[0.5px] text-white uppercase backdrop-blur-sm">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" /> Posted: {formatDate(post.post_date)}
                </div>
                <h3 className="mb-auto line-clamp-2 text-[17px] leading-snug font-extrabold text-slate-900 dark:text-slate-100">
                  {post.title}
                </h3>

                {/* Admin Actions */}
                <div className="mt-4 flex gap-3 border-t border-slate-200 pt-4 dark:border-white/10 !text-sm">
                  <button
                    onClick={() => router.push(`/admin/posts/create?id=${post.id}`)}
                    className={btnG}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={isDeleting}
                    className={btnD}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> ...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="col-span-full rounded-2xl border-[1.5px] border-dashed border-slate-200 bg-white px-6 py-[60px] text-center text-slate-400 dark:border-white/10 dark:bg-[#111a2e] dark:text-slate-500">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">No posts found</h3>
            <p className="text-sm">You haven&apos;t created any posts matching that search yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
