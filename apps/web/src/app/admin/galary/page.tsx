
"use client";

import { useState, useEffect } from "react";
import { uploadGalleryImageAction, deleteGalleryImageAction, getGalleryImagesAction } from "@/app/actions/admin";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

// ─── THEME TOKENS (Exact from Reference) ──────────────────────────────────────
const THEMES = {
	light: {
		pageBg: "#f1f5f9",
		navBg: "#1e3a8a",
		navBottomBorder: "#3b82f6",
		navText: "rgba(255,255,255,0.65)",
		navTextHover: "#ffffff",
		navActiveBg: "#3b82f6",
		navActiveText: "#ffffff",
		navBrand: "#ffffff",
		navBrandAccent: "#93c5fd",
		sidebarBg: "#ffffff",
		sidebarHeaderBg: "#f8fafc",
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
		rowHover: "#f8fafc",
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
		subTabHdrBg: "#f8fafc",
		subTabText: "#94a3b8",
		subTabActive: "#2563eb",
		subTabBorder: "#2563eb",
		tagBg: "#dbeafe",
		tagText: "#1d4ed8",
		scrollThumb: "#bfdbfe",
		modalOverlay: "rgba(15,23,42,0.55)",
		modalBg: "#ffffff",
		modalBorder: "#e2e8f0",
		toggleIcon: "🌙",
		toggleLabel: "Dark",
	},
	dark: {
		pageBg: "#060b14",
		navBg: "rgba(6,11,20,0.98)",
		navBottomBorder: "#f59e0b",
		navText: "rgba(255,255,255,0.45)",
		navTextHover: "#ffffff",
		navActiveBg: "rgba(245,158,11,0.18)",
		navActiveText: "#f59e0b",
		navBrand: "#ffffff",
		navBrandAccent: "#f59e0b",
		sidebarBg: "rgba(6,11,20,0.9)",
		sidebarHeaderBg: "rgba(255,255,255,0.02)",
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
		rowHover: "rgba(255,255,255,0.03)",
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
		subTabHdrBg: "rgba(6,11,20,0.6)",
		subTabText: "rgba(255,255,255,0.35)",
		subTabActive: "#f59e0b",
		subTabBorder: "#f59e0b",
		tagBg: "rgba(245,158,11,0.15)",
		tagText: "#f59e0b",
		scrollThumb: "rgba(245,158,11,0.3)",
		modalOverlay: "rgba(0,0,0,0.85)",
		modalBg: "#0f172a",
		modalBorder: "rgba(255,255,255,0.1)",
		toggleIcon: "☀️",
		toggleLabel: "Light",
	},
} as const;

type ThemeTokens = typeof THEMES.light;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
	Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
	Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
	X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
	Upload: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
	Trash: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>,
	Image: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
};

// ─── NAV LINKS ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
];

// ─── SECTION HEADER COMPONENT ────────────────────────────────────────────────
function SecHdr({ icon, label }: { icon: string; label: string }) {
	return (
		<div className="sec-hdr">
			<span style={{ fontSize: "1.05rem" }}>{icon}</span>
			<span className="sec-hdr-txt">{label}</span>
		</div>
	);
}

// ─── CSS BUILDER ───────────────────────────────────────────────────────────────
function buildCss(T: ThemeTokens): string {
	return `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
.serif{font-family:'DM Serif Display',serif;}
.mono{font-family:'JetBrains Mono',monospace;}

/* ── NAV LINK ── */
.top-nav-link{
  display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
  transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
.top-nav-link.on{background:${T.navActiveBg};color:${T.navActiveText};border-color:transparent;}

/* ── CARD ── */
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};margin-bottom:20px;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}
.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;
  font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;
  font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-d:hover{filter:brightness(.95);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

/* ── INPUT ── */
.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}

/* ── THEME TOGGLE ── */
.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

/* ── IMAGE GRID ── */
.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}
.img-card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};transition:all .3s;position:relative;}
.img-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,0.15);}
.img-card img{width:100%;height:200px;object-fit:cover;display:block;}
.img-card-footer{padding:14px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${T.divider};}

/* ── ANIMS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
`;
}

export default function AdminGalleryPage() {
	const [isDark, setIsDark] = useState(false);
	const T = isDark ? THEMES.dark : THEMES.light;

	const [images, setImages] = useState<any[]>([]);
	const [uploading, setUploading] = useState(false);

	const { user, isLoggedIn, logout, loading: authLoading } = useAuth();


	useEffect(() => {
		fetchImages();
	}, []);


	useEffect(() => {
		const savedTheme = localStorage.getItem("csc_theme");
		if (savedTheme) setIsDark(savedTheme === "dark");
		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, [user]);


	async function fetchImages() {
		try {
			const data = await getGalleryImagesAction();
			setImages(data);
		} catch (err) {
			console.error(err);
		}
	}

	// ─── HANDLERS ─── (Preserved Exactly)
	const toggleTheme = () => {
		const newDark = !isDark; setIsDark(newDark);
		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
	};

	const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setUploading(true);
		try {
			const formData = new FormData(e.currentTarget);
			await uploadGalleryImageAction(formData);
			await fetchImages();
			(e.target as HTMLFormElement).reset();
		} catch (err) {
			alert("Upload failed");
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async (id: string, url: string) => {
		if (!window.confirm("Delete this photo permanently?")) return;
		try {
			await deleteGalleryImageAction(id, url);
			await fetchImages();
		} catch (err) {
			alert("Delete failed");
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s" }}>
			<style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />
			<style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

			{/* ════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════ */}
			<header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
				<div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
					<a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
						<div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
						<div>
							<div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
								Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
							</div>
							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
						</div>
					</a>

					<div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

					<nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
						{NAV_LINKS.map(l => {
							const isActive = l.label === "Gallery";
							return (
								<a key={l.href} href={l.href} className={`top-nav-link ${isActive ? "on" : ""}`}>
									<span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
								</a>
							);
						})}
					</nav>

					<button className="tog" onClick={toggleTheme}>
						<span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
					</button>

					<div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
						<div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${T.accent},${T.accentHover})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11 }}>A</div>
						<div>
							<div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Admin</div>
							<div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>GALLERY</div>
						</div>
					</div>
				</div>
			</header>

			{/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
			<div style={{
				background: isDark
					? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
					: "linear-gradient(135deg, #1e3a8a 0%, #4338ca 100%)",
				padding: "60px 24px 80px",
				textAlign: "center",
				position: "relative",
				overflow: "hidden"
			}}>
				<div style={{
					position: "absolute", inset: 0,
					background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='white' opacity='0.06'/%3E%3C/svg%3E") repeat`
				}} />
				<div style={{ position: "relative", zIndex: 1 }}>
					<h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 12, lineHeight: 1.2 }}>
						Manage Work Gallery
					</h1>
					<p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
						Upload and organize photos of your successful applications and services.
					</p>
				</div>
			</div>

			{/* ════════════════════════════════════════════════════════
          CONTENT
      ════════════════════════════════════════════════════════ */}
			<div style={{ maxWidth: 1100, margin: "-40px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 10, flex: 1 }}>

				{/* Upload Card */}
				<div className="card">
					<SecHdr icon="📸" label="Upload New Photo" />
					<div style={{ padding: "20px" }}>
						<form onSubmit={handleUpload} style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
							<div style={{ flex: 1, minWidth: 200 }}>
								<label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Image Title</label>
								<input name="title" required className="inp" placeholder="e.g. Passport Applied Successfully" />
							</div>
							<div style={{ flex: 1, minWidth: 200 }}>
								<label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Choose File</label>
								<input name="file" type="file" required accept="image/*" className="inp" style={{ padding: "8px 14px" }} />
							</div>
							<button disabled={uploading} className="btn btn-p" style={{ padding: "10px 24px" }}>
								{uploading ? (
									<><span style={{ width: 14, height: 14, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} />Uploading…</>
								) : (
									<><Ico.Upload /> Upload Photo</>
								)}
							</button>
						</form>
					</div>
				</div>

				{/* Image Count */}
				<div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
						<Ico.Image /> {images.length} {images.length === 1 ? "Photo" : "Photos"}
					</span>
				</div>

				{/* Image Grid */}
				<div className="img-grid">
					{images.map((img, idx) => (
						<div key={img.id} className="img-card" style={{ animation: `fadeUp 0.5s ease ${idx * 0.05}s both` }}>
							<img src={img.url} alt={img.title} loading="lazy" />
							<div className="img-card-footer">
								<span style={{
									fontSize: "0.85rem",
									fontWeight: 700,
									color: T.textPrimary,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									flex: 1,
									marginRight: 8
								}}>
									{img.title}
								</span>
								<button
									onClick={() => handleDelete(img.id, img.url)}
									className="btn btn-d"
									style={{ fontSize: 11, padding: "6px 12px" }}
								>
									<Ico.Trash /> Delete
								</button>
							</div>
						</div>
					))}
				</div>

				{images.length === 0 && (
					<div style={{
						textAlign: "center",
						padding: "80px 24px",
						background: T.cardBg,
						borderRadius: 16,
						border: `1.5px dashed ${T.cardBorder}`,
						color: T.textMuted,
						animation: "fadeUp 0.5s ease"
					}}>
						<span style={{ fontSize: "3.5rem", display: "block", marginBottom: 16 }}>🖼️</span>
						<h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>No photos yet</h3>
						<p style={{ fontSize: "0.9rem", marginBottom: 20 }}>Upload your first work photo to showcase your services.</p>
					</div>
				)}
			</div>
		</div>
	);
}