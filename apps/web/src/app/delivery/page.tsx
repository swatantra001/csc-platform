"use client"

import React, { useState, useEffect } from "react";
import { getMyDeliveryQueueAction, updateMyDeliveryStatusAction } from "@/app/actions/requests";
import { useAuth } from "@/components/AuthProvider";
import { useDeliveryBroadcaster } from "@/hooks/useDeliveryBroadcaster";
import { io, Socket } from "socket.io-client";

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS — Exact match from reference
// ════════════════════════════════════════════════════════════════════════════════
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
		cardBg: "#ffffff",
		cardBorder: "#e2e8f0",
		cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
		cardShadowHover: "0 8px 24px rgba(0,0,0,0.08)",
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
		btnWarningBg: "#fffbeb",
		btnWarningBorder: "#fde68a",
		btnWarningText: "#b45309",
		statusPending: { color: "#d97706", bg: "#fef3c7", border: "#fde68a", dot: "#f59e0b", label: "Pending" },
		statusOut: { color: "#15803d", bg: "#dcfce7", border: "#86efac", dot: "#22c55e", label: "Out for Delivery" },
		statusDelivered: { color: "#2563eb", bg: "#dbeafe", border: "#93c5fd", dot: "#3b82f6", label: "Delivered" },
		statusPaused: { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb", dot: "#9ca3af", label: "Paused" },
		toggleIcon: "🌙",
		toggleLabel: "Dark",
		scrollThumb: "#bfdbfe",
		modalOverlay: "rgba(15,23,42,0.55)",
		modalBg: "#ffffff",
		modalBorder: "#e2e8f0",
		tagBg: "#dbeafe",
		tagText: "#1d4ed8",
		livePulse: "#22c55e",
		livePulseBg: "#dcfce7",
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
		cardBg: "rgba(255,255,255,0.03)",
		cardBorder: "rgba(255,255,255,0.08)",
		cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
		cardShadowHover: "0 8px 24px rgba(0,0,0,0.4)",
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
		btnWarningBg: "rgba(245,158,11,0.1)",
		btnWarningBorder: "rgba(245,158,11,0.25)",
		btnWarningText: "#fbbf24",
		statusPending: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", dot: "#fbbf24", label: "Pending" },
		statusOut: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", dot: "#34d399", label: "Out for Delivery" },
		statusDelivered: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", dot: "#60a5fa", label: "Delivered" },
		statusPaused: { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.3)", dot: "#9ca3af", label: "Paused" },
		toggleIcon: "☀️",
		toggleLabel: "Light",
		scrollThumb: "rgba(245,158,11,0.3)",
		modalOverlay: "rgba(0,0,0,0.85)",
		modalBg: "#0f172a",
		modalBorder: "rgba(255,255,255,0.1)",
		tagBg: "rgba(245,158,11,0.15)",
		tagText: "#f59e0b",
		livePulse: "#34d399",
		livePulseBg: "rgba(52,211,153,0.1)",
	},
} as const;

type ThemeTokens = typeof THEMES.light;

// ════════════════════════════════════════════════════════════════════════════════
// NAV LINKS
// ════════════════════════════════════════════════════════════════════════════════
const NAV_LINKS = [
	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/delivery" : "http://localhost:3000/delivery", icon: "📦", label: "Delivery" },
];
// ════════════════════════════════════════════════════════════════════════════════
// ICONS (inline SVG)
// ════════════════════════════════════════════════════════════════════════════════
const Ico = {
	Delivery: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0z" /><path d="M19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
	Call: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>,
	Start: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
	Pause: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>,
	Done: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
	Pin: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
	Doc: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
	Moon: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>,
	Sun: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
	User: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
	Signal: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
	Empty: () => <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
};

// ════════════════════════════════════════════════════════════════════════════════
// AVATAR
// ════════════════════════════════════════════════════════════════════════════════
function Avatar({ name, size = 40, isDark }: { name?: string | null; size?: number; isDark: boolean }) {
	const ch = name?.charAt(0).toUpperCase() || "?";
	const grad = isDark ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#1d4ed8,#1e3a8a)";
	return (
		<div style={{ width: size, height: size, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.18)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
			{ch}
		</div>
	);
}

// ════════════════════════════════════════════════════════════════════════════════
// GENERATED CSS
// ════════════════════════════════════════════════════════════════════════════════
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

/* ── NAV LINK ── */
.top-nav-link{
  display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
  transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

/* ── CARD ── */
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:14px;overflow:hidden;box-shadow:${T.cardShadow};transition:all .2s ease;}
.card:hover{box-shadow:${T.cardShadowHover};transform:translateY(-1px);}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:10px;
  font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;border:none;
  font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;justify-content:center;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-d:hover{filter:brightness(.95);}
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-s:hover{filter:brightness(1.08);}
.btn-w{background:${T.btnWarningBg};color:${T.btnWarningText};border:1px solid ${T.btnWarningBorder};}
.btn-w:hover{filter:brightness(.95);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

/* ── PILL ── */
.pill{
  padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
  cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
  background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
}
.pill:hover{border-color:${T.accent};color:${T.accent};}
.pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

/* ── ANIMS ── */
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.15)}}
@keyframes live-pulse{0%,100%{box-shadow:0 0 0 0 ${T.livePulse}40}50%{box-shadow:0 0 0 8px ${T.livePulse}00}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.slide-up{animation:slideUp .4s ease forwards;}
`;
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ════════════════════════════════════════════════════════════════════════════════
function SecHdr({ icon, label, T }: { icon: string; label: string; T: ThemeTokens }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 18px", background: T.sectionGrad, borderRadius: "14px 14px 0 0" }}>
			<span style={{ fontSize: "1.1rem" }}>{icon}</span>
			<span style={{ fontSize: ".75rem", fontWeight: 800, color: T.sectionGradText, textTransform: "uppercase", letterSpacing: ".07em", fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
		</div>
	);
}

// ════════════════════════════════════════════════════════════════════════════════
// STATUS BADGE
// ════════════════════════════════════════════════════════════════════════════════
function StatusBadge({ status, T }: { status: string; T: ThemeTokens }) {
	let cfg: { bg: string; border: string; color: string; dot: string; label: string } = T.statusPending;
	if (status === "out_for_delivery") cfg = T.statusOut;
	else if (status === "delivered") cfg = T.statusDelivered;
	else if (status === "paused") cfg = T.statusPaused;

	return (
		<div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 11, fontWeight: 800, color: cfg.color, letterSpacing: ".04em", textTransform: "uppercase" }}>
			<span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
			{cfg.label}
		</div>
	);
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function DeliveryAgentPortal() {
	// DEFAULT = LIGHT theme
	const [isDark, setIsDark] = useState(false);
	const T = isDark ? THEMES.dark : THEMES.light;

	const [queue, setQueue] = useState<any[]>([]);
	const [activeDeliveryId, setActiveDeliveryId] = useState<string | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "out_for_delivery" | "delivered">("all");
	const { user, isLoggedIn, loading } = useAuth();

	// ✨ THIS HOOK MAGICALLY BROADCASTS GPS WHEN ACTIVE!
	useDeliveryBroadcaster(activeDeliveryId || "", !!activeDeliveryId);

	const fetchQueue = async () => {
		try {
			const data = await getMyDeliveryQueueAction();
			setQueue(data);
			const active = data.find((d: any) => d.delivery_status === "out_for_delivery");
			if (active) setActiveDeliveryId(active.id);
		} catch (e) { console.error(e); }
	};

	useEffect(() => {
		if (!loading && !isLoggedIn) window.location.href = "/?login=1";
		if (isLoggedIn) fetchQueue();
	}, [isLoggedIn, loading]);

	useEffect(() => {
		const s = io();
		setSocket(s);
		s.on("refresh_queue", fetchQueue);
		return () => { s.disconnect(); };
	}, []);

	useEffect(() => {
		const savedTheme = localStorage.getItem("csc_theme");
		if (savedTheme) setIsDark(savedTheme === "dark");
		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, [user]);

	const handleUpdateStatus = async (reqId: string, status: string) => {
		try {
			await updateMyDeliveryStatusAction(reqId, status);
			if (status === "out_for_delivery") setActiveDeliveryId(reqId);
			else setActiveDeliveryId(null);
			socket?.emit("trigger_queue_refresh");
			fetchQueue();
		} catch (e: any) { alert(e.message); }
	};

	// ─── HANDLERS ─── (Preserved Exactly)
	const toggleTheme = () => {
		const newDark = !isDark; setIsDark(newDark);
		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
	};


	const filteredQueue = queue.filter(d => filterStatus === "all" || d.delivery_status === filterStatus);

	const stats = {
		total: queue.length,
		pending: queue.filter(d => d.delivery_status === "pending").length,
		out: queue.filter(d => d.delivery_status === "out_for_delivery").length,
		delivered: queue.filter(d => d.delivery_status === "delivered").length,
	};

	if (loading || !user) return null;

	return (
		<div style={{ minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans',sans-serif", transition: "background .25s, color .25s" }}>
			<style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

			{/* ════════════════════════════════════════════════════════
          HEADER — Dual-row navy indigo navbar
      ════════════════════════════════════════════════════════ */}
			<header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)", position: "sticky", top: 0 }}>

				{/* Row 1 — brand + nav links + toggle + user */}
				<div style={{ display: "flex", alignItems: "center", height: 56, padding: "0 22px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

					{/* Brand */}
					<a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
						<div style={{ width: 36, height: 36, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
							<Ico.Delivery />
						</div>
						<div>
							<div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
								Delivery<span style={{ color: T.navBrandAccent }}>Pro</span>
							</div>
							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>AGENT PORTAL</div>
						</div>
					</a>

					<div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

					{/* Nav links */}
					<nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
						{NAV_LINKS.map(l => (
							<a key={l.href} href={l.href} className="top-nav-link">
								<span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
							</a>
						))}
					</nav>

					{/* Theme toggle */}
					<button
						onClick={toggleTheme}
						style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${T.accentBorder}`, background: "rgba(255,255,255,0.08)", color: T.navText, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}
						onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.navBottomBorder; (e.currentTarget as HTMLElement).style.color = T.navTextHover; }}
						onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.accentBorder; (e.currentTarget as HTMLElement).style.color = T.navText; }}
					>
						<span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
					</button>

					{/* User chip */}
					<div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
						<Avatar name={user?.name} size={28} isDark={isDark} />
						<div>
							<div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{user?.name || "Agent"}</div>
							<div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>DELIVERY AGENT</div>
						</div>
					</div>
				</div>

				{/* Row 2 — section title bar */}
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 22px", background: "rgba(0,0,0,0.12)" }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<span style={{ fontSize: 18 }}>🛵</span>
						<span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: ".04em", textTransform: "uppercase" }}>Delivery Queue</span>
					</div>
					<div style={{ display: "flex", gap: 6 }}>
						{[
							{ key: "all", label: "All", count: stats.total },
							{ key: "pending", label: "Pending", count: stats.pending },
							{ key: "out_for_delivery", label: "Active", count: stats.out },
							{ key: "delivered", label: "Done", count: stats.delivered },
						].map(s => (
							<button
								key={s.key}
								className={`pill ${filterStatus === s.key ? "on" : ""}`}
								onClick={() => setFilterStatus(s.key as any)}
							>
								{s.label} <span style={{ opacity: 0.6, marginLeft: 3 }}>({s.count})</span>
							</button>
						))}
					</div>
				</div>
			</header>

			{/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
			<main style={{ padding: "28px", maxWidth: 900, margin: "0 auto" }}>

				{/* Stats cards row */}
				<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
					{[
						{ label: "Total", value: stats.total, icon: "📦", color: T.accent },
						{ label: "Pending", value: stats.pending, icon: "⏳", color: "#d97706" },
						{ label: "Active", value: stats.out, icon: "🛵", color: "#16a34a" },
						{ label: "Delivered", value: stats.delivered, icon: "✅", color: "#2563eb" },
					].map((stat, i) => (
						<div key={i} className="card" style={{ padding: "18px", display: "flex", alignItems: "center", gap: 14, animationDelay: `${i * 80}ms` }}>
							<div style={{ width: 44, height: 44, borderRadius: 12, background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc", border: `1px solid ${T.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
								{stat.icon}
							</div>
							<div>
								<div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>{stat.label}</div>
								<div style={{ fontSize: 26, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
							</div>
						</div>
					))}
				</div>

				{/* Queue header */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
					<div>
						<div className="serif" style={{ fontSize: 22, color: T.textPrimary, marginBottom: 3 }}>Your Deliveries</div>
						<div style={{ fontSize: 13, color: T.textSecondary }}>Manage and track all your assigned deliveries</div>
					</div>
					<button
						onClick={fetchQueue}
						className="btn btn-g"
						style={{ fontSize: 12 }}
					>
						🔄 Refresh
					</button>
				</div>

				{/* Empty state */}
				{filteredQueue.length === 0 ? (
					<div className="card" style={{ padding: 70, textAlign: "center", animation: "slideUp .4s ease" }}>
						<div style={{ width: 80, height: 80, borderRadius: 20, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: T.accent }}>
							<Ico.Empty />
						</div>
						<div className="serif" style={{ fontSize: 20, color: T.textPrimary, marginBottom: 8 }}>No deliveries found</div>
						<div style={{ fontSize: 14, color: T.textMuted }}>All caught up! New assignments will appear here.</div>
					</div>
				) : (
					<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
						{filteredQueue.map((req, idx) => {
							const isOut = req.delivery_status === "out_for_delivery";
							const isDelivered = req.delivery_status === "delivered";
							const isPending = req.delivery_status === "pending";

							return (
								<div
									key={req.id}
									className="card slide-up"
									style={{
										animationDelay: `${idx * 60}ms`,
										borderLeft: isOut ? `4px solid ${T.statusOut.dot}` : isDelivered ? `4px solid ${T.statusDelivered.dot}` : `4px solid ${T.statusPending.dot}`,
										position: "relative",
										overflow: "visible",
									}}
								>
									{/* Live GPS badge */}
									{isOut && (
										<div
											style={{
												position: "absolute",
												top: -10,
												right: 18,
												display: "flex",
												alignItems: "center",
												gap: 6,
												padding: "5px 12px",
												borderRadius: 20,
												background: T.livePulseBg,
												border: `1px solid ${T.statusOut.border}`,
												fontSize: 11,
												fontWeight: 800,
												color: T.statusOut.color,
												letterSpacing: ".04em",
												textTransform: "uppercase",
												animation: "live-pulse 2s ease-in-out infinite",
												zIndex: 10,
											}}
										>
											<span style={{ width: 7, height: 7, borderRadius: "50%", background: T.livePulse, display: "inline-block", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
											<Ico.Signal /> Live GPS
										</div>
									)}

									<div style={{ padding: "22px 24px" }}>
										{/* Top row: Avatar + Name + Status + Call */}
										<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
											<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
												<Avatar name={req.users?.name} size={48} isDark={isDark} />
												<div>
													<div style={{ fontWeight: 800, fontSize: 16, color: T.textPrimary, marginBottom: 4 }}>{req.users?.name || "Citizen"}</div>
													<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
														<StatusBadge status={req.delivery_status} T={T as any} />
														<span className="mono" style={{ fontSize: 11, color: T.textMuted }}>#{req.id?.slice(-6).toUpperCase()}</span>
													</div>
												</div>
											</div>
											<a
												href={`tel:${req.users?.mobile}`}
												className="btn btn-g"
												style={{ fontSize: 12, padding: "8px 14px", textDecoration: "none" }}
											>
												<Ico.Call /> Call
											</a>
										</div>

										{/* Details grid */}
										<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 20, padding: "14px 16px", background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", borderRadius: 10, border: `1px solid ${T.divider}` }}>
											<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
												<span style={{ fontSize: 16 }}><Ico.Doc /></span>
												<div>
													<div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 2 }}>Document</div>
													<div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{req.title}</div>
												</div>
											</div>
											<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
												<span style={{ fontSize: 16 }}><Ico.Pin /></span>
												<div>
													<div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 2 }}>Address</div>
													<div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{req.address?.full_address}</div>
													<div className="mono" style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>PIN: {req.address?.pincode}</div>
												</div>
											</div>
										</div>

										{/* Action buttons */}
										<div style={{ display: "flex", gap: 10 }}>
											{isPending && (
												<button
													onClick={() => handleUpdateStatus(req.id, "out_for_delivery")}
													disabled={!!activeDeliveryId}
													className="btn btn-p"
													style={{ flex: 1, padding: "12px 20px", fontSize: 14 }}
												>
													<Ico.Start /> {activeDeliveryId ? "Another Active" : "Start Delivery"}
												</button>
											)}

											{isOut && (
												<>
													<button
														onClick={() => handleUpdateStatus(req.id, "pending")}
														className="btn btn-w"
														style={{ flex: 1, padding: "12px 20px", fontSize: 14 }}
													>
														<Ico.Pause /> Pause
													</button>
													<button
														onClick={() => handleUpdateStatus(req.id, "delivered")}
														className="btn btn-s"
														style={{ flex: 2, padding: "12px 20px", fontSize: 14 }}
													>
														<Ico.Done /> Mark Delivered
													</button>
												</>
											)}

											{isDelivered && (
												<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: T.statusDelivered.bg, border: `1px solid ${T.statusDelivered.border}`, borderRadius: 10, color: T.statusDelivered.color, fontSize: 13, fontWeight: 700 }}>
													<Ico.Done /> Successfully Delivered
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</main>
		</div>
	);
}