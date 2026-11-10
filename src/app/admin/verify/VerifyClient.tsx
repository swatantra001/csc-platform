// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/AuthProvider";
// import { markAdmissionCompleteAction, VerificationResult, verifyBookingByCodeAction } from "@/app/actions/courses";
// import { Html5Qrcode } from "html5-qrcode";

// const THEMES = {
// 	light: {
// 		pageBg: "#f1f5f9", navBg: "#1e3a8a", navBottomBorder: "#3b82f6",
// 		navText: "rgba(255,255,255,0.65)", navTextHover: "#ffffff",
// 		navBrand: "#ffffff", navBrandAccent: "#93c5fd",
// 		cardBg: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
// 		textPrimary: "#1e293b", textSecondary: "#475569", textMuted: "#94a3b8",
// 		accent: "#2563eb", accentHover: "#1d4ed8", accentLight: "#eff6ff", accentBorder: "#bfdbfe",
// 		inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputFocusBorder: "#3b82f6", inputPlaceholder: "#94a3b8",
// 		divider: "#e2e8f0",
// 		btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff",
// 		btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569",
// 		btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)", btnSuccessText: "#ffffff",
// 		btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626",
// 		btnWarningBg: "linear-gradient(135deg,#b45309,#d97706)", btnWarningText: "#ffffff",
// 		modalOverlay: "rgba(15,23,42,0.55)", toggleIcon: "🌙", toggleLabel: "Dark",
// 		validBg: "#f0fdf4", validBorder: "#86efac", validText: "#15803d",
// 		invalidBg: "#fef2f2", invalidBorder: "#fecaca", invalidText: "#dc2626",
// 	},
// 	dark: {
// 		pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b",
// 		navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff",
// 		navBrand: "#ffffff", navBrandAccent: "#f59e0b",
// 		cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
// 		textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)",
// 		accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)",
// 		inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)", inputFocusBorder: "rgba(245,158,11,0.5)", inputPlaceholder: "rgba(255,255,255,0.28)",
// 		divider: "rgba(255,255,255,0.06)",
// 		btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000",
// 		btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)",
// 		btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)", btnSuccessText: "#ffffff",
// 		btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171",
// 		btnWarningBg: "linear-gradient(135deg,#92400e,#b45309)", btnWarningText: "#ffffff",
// 		modalOverlay: "rgba(0,0,0,0.85)", toggleIcon: "☀️", toggleLabel: "Light",
// 		validBg: "rgba(16,185,129,0.1)", validBorder: "rgba(16,185,129,0.3)", validText: "#34d399",
// 		invalidBg: "rgba(239,68,68,0.1)", invalidBorder: "rgba(239,68,68,0.3)", invalidText: "#f87171",
// 	},
// } as const;

// const NAV_LINKS = [
// 	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
// 	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
// 	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/courses" : "http://localhost:3000/admin/courses", icon: "🎓", label: "Courses" },
// 	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/verify" : "http://localhost:3000/admin/verify", icon: "🔍", label: "Verify" },
// 	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
// 	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
// 	{ href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
// ];

// function buildCss(T: typeof THEMES.light): string {
// 	return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.divider};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// .mono{font-family:'JetBrains Mono',monospace;}
// @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
// @keyframes scan{0%{top:0}50%{top:100%}51%{top:0}100%{top:100%}}
// @keyframes pulse-ring{0%{transform:scale(0.8);opacity:1}100%{transform:scale(1.3);opacity:0}}
// @keyframes spin{to{transform:rotate(360deg)}}
// .top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
// .top-nav-link.on{background:rgba(255,255,255,0.12);color:#fff;}
// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}
// .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'DM Sans',sans-serif;}
// .btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
// .btn-p:hover{filter:brightness(1.08);transform:translateY(-1px);}
// .btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
// .btn-g:hover{border-color:${T.accentBorder};color:${T.accent};}
// .btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
// .btn-s:hover{filter:brightness(1.08);}
// .btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
// .btn-w{background:${T.btnWarningBg};color:${T.btnWarningText};}
// .inp{width:100%;padding:14px 18px;background:${T.inputBg};border:2px solid ${T.inputBorder};border-radius:12px;color:${T.textPrimary};font-size:16px;outline:none;transition:all .2s;font-family:'DM Sans',sans-serif;text-align:center;letter-spacing:2px;text-transform:uppercase;}
// .inp:focus{border-color:${T.inputFocusBorder};box-shadow:0 0 0 4px ${T.accentBorder};}
// .inp::placeholder{color:${T.inputPlaceholder};text-transform:none;letter-spacing:normal;}
// .scan-line{position:absolute;width:100%;height:2px;background:linear-gradient(90deg,transparent,${T.accent},transparent);animation:scan 2s linear infinite;pointer-events:none;}
// .tog{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};background:transparent;border:1px solid rgba(255,255,255,0.15);cursor:pointer;transition:all .15s;white-space:nowrap;}
// .tog:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
// .qr-overlay{position:fixed;inset:0;background:${T.modalOverlay};z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
// .qr-box{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:16px;box-shadow:${T.cardShadow};width:100%;max-width:420px;overflow:hidden;animation:fadeIn 0.3s ease;}
// .qr-header{padding:16px 20px;border-bottom:1px solid ${T.divider};display:flex;align-items:center;justify-content:space-between;}
// .qr-body{padding:20px;display:flex;flex-direction:column;align-items:center;gap:16px;}
// #qr-reader{width:100%;border-radius:12px;overflow:hidden;}
// #qr-reader video{border-radius:12px;}
// #qr-reader__dashboard_section_csr span{color:${T.textSecondary} !important;}
// #qr-reader__dashboard_section_swaplink{color:${T.accent} !important;}
// `;
// }

// export default function VerifyClient() {
// 	const [isDark, setIsDark] = useState(false);
// 	const [code, setCode] = useState("");
// 	const [verifying, setVerifying] = useState(false);
// 	const [result, setResult] = useState<VerificationResult | null>(null);
// 	const [markingComplete, setMarkingComplete] = useState(false);
// 	const [admissionMarked, setAdmissionMarked] = useState(false);
// 	const [isScanning, setIsScanning] = useState(false);
// 	const [scanError, setScanError] = useState<string | null>(null);
// 	const inputRef = useRef<HTMLInputElement>(null);
// 	const scannerRef = useRef<Html5Qrcode | null>(null);

// 	const T = isDark ? THEMES.dark : THEMES.light;
// 	const router = useRouter();
// 	const { user } = useAuth();

// 	useEffect(() => {
// 		const saved = localStorage.getItem("csc_theme");
// 		if (saved) setIsDark(saved === "dark");
// 		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
// 		inputRef.current?.focus();
// 	}, [user]);

// 	// Cleanup scanner on unmount
// 	useEffect(() => {
// 		return () => {
// 			if (scannerRef.current) {
// 				scannerRef.current.stop().catch(() => { });
// 				scannerRef.current = null;
// 			}
// 		};
// 	}, []);

// 	const toggleTheme = () => {
// 		const newDark = !isDark;
// 		setIsDark(newDark);
// 		localStorage.setItem("csc_theme", newDark ? "dark" : "light");
// 	};

// 	const verifyCode = useCallback(async (codeToVerify: string) => {
// 		if (!codeToVerify.trim()) return;
// 		setVerifying(true);
// 		setResult(null);
// 		setAdmissionMarked(false);
// 		try {
// 			const res = await verifyBookingByCodeAction(codeToVerify.trim());
// 			setResult(res);
// 			if (typeof window !== "undefined") {
// 				const audio = new Audio(res.valid ? "/sounds/success.mp3" : "/sounds/error.mp3");
// 				audio.play().catch(() => { });
// 			}
// 		} catch (err: any) {
// 			setResult({ valid: false, error: err.message || "Verification failed" });
// 		} finally {
// 			setVerifying(false);
// 			setTimeout(() => inputRef.current?.focus(), 100);
// 		}
// 	}, []);

// 	const handleVerify = async (e?: React.FormEvent) => {
// 		if (e) e.preventDefault();
// 		await verifyCode(code);
// 	};

// 	const handleMarkComplete = async () => {
// 		if (!result?.booking?.id) return;
// 		setMarkingComplete(true);
// 		try {
// 			await markAdmissionCompleteAction(result.booking.id);
// 			setAdmissionMarked(true);
// 		} catch (err: any) {
// 			alert(err.message || "Failed to mark admission");
// 		} finally {
// 			setMarkingComplete(false);
// 		}
// 	};

// 	const handleClear = () => {
// 		setCode("");
// 		setResult(null);
// 		setAdmissionMarked(false);
// 		setScanError(null);
// 		inputRef.current?.focus();
// 	};

// 	const handlePaste = (e: React.ClipboardEvent) => {
// 		const pasted = e.clipboardData.getData("text").trim().toUpperCase();
// 		if (pasted.length >= 6) {
// 			setCode(pasted);
// 			setTimeout(() => verifyCode(pasted), 50);
// 		}
// 	};

// 	const startScanner = async () => {
// 		setScanError(null);
// 		setIsScanning(true);
// 		// Small delay to ensure DOM element is rendered
// 		setTimeout(async () => {
// 			try {
// 				const scanner = new Html5Qrcode("qr-reader");
// 				scannerRef.current = scanner;
// 				await scanner.start(
// 					{ facingMode: "environment" },
// 					{ fps: 10, qrbox: { width: 250, height: 250 } },
// 					(decodedText) => {
// 						// Success
// 						let cleanCode = decodedText.trim().toUpperCase();
// 						// Parse JSON if applicable
// 						const parsed = JSON.parse(cleanCode);
// 						if (parsed && typeof parsed === "object" && parsed.BOOKINGCODE) {
// 							cleanCode = parsed.BOOKINGCODE;
// 						}
// 						setCode(cleanCode);
// 						stopScanner();
// 						setTimeout(() => verifyCode(cleanCode), 100);
// 					},
// 					() => {
// 						// Scan error (ignore continuous errors)
// 					}
// 				);
// 			} catch (err: any) {
// 				setScanError(err.message || "Could not start camera. Please allow camera permissions.");
// 				setIsScanning(false);
// 			}
// 		}, 100);
// 	};

// 	const stopScanner = async () => {
// 		if (scannerRef.current) {
// 			try {
// 				await scannerRef.current.stop();
// 			} catch { }
// 			scannerRef.current = null;
// 		}
// 		setIsScanning(false);
// 		setScanError(null);
// 	};

// 	const formatDate = (d: string) => {
// 		if (!d) return "N/A";
// 		try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
// 		catch { return d; }
// 	};

// 	return (
// 		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans',sans-serif", transition: "background .25s, color .25s" }}>
// 			<style dangerouslySetInnerHTML={{ __html: buildCss(T as typeof THEMES.light) }} />

// 			{/* QR SCANNER OVERLAY */}
// 			{isScanning && (
// 				<div className="qr-overlay" onClick={(e) => { if (e.target === e.currentTarget) stopScanner(); }}>
// 					<div className="qr-box">
// 						<div className="qr-header">
// 							<div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>📷 Scan QR Code</div>
// 							<button onClick={stopScanner} className="btn btn-d" style={{ padding: "6px 12px", fontSize: 12 }}>Close</button>
// 						</div>
// 						<div className="qr-body">
// 							<div id="qr-reader" style={{ width: "100%" }} />
// 							{scanError && (
// 								<div style={{ color: T.invalidText, fontSize: 13, textAlign: "center", fontWeight: 500 }}>
// 									{scanError}
// 								</div>
// 							)}
// 							<p style={{ fontSize: 11, color: T.textMuted, textAlign: "center" }}>
// 								Point your camera at the booking QR code. It will scan automatically.
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 			{/* HEADER */}
// 			<header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
// 				<div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
// 					<a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
// 						<div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
// 						<div>
// 							<div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
// 								Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
// 							</div>
// 							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMISSION VERIFY</div>
// 						</div>
// 					</a>
// 					<div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
// 					<nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
// 						{NAV_LINKS.map(l => (
// 							<a key={l.href} href={l.href} className={`top-nav-link ${l.label === "Verify" ? "on" : ""}`}>
// 								<span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
// 							</a>
// 						))}
// 					</nav>
// 					<button className="tog" onClick={toggleTheme}>
// 						<span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
// 					</button>
// 				</div>
// 			</header>

// 			{/* MAIN CONTENT */}
// 			<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 24 }}>

// 				{/* INPUT CARD */}
// 				<div className="card" style={{ width: "100%", maxWidth: 520, padding: "32px 28px", animation: "fadeIn 0.5s ease" }}>
// 					<div style={{ textAlign: "center", marginBottom: 24 }}>
// 						<div style={{ width: 56, height: 56, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>
// 							🔍
// 						</div>
// 						<h1 className="serif" style={{ fontSize: 24, marginBottom: 6, color: T.textPrimary }}>Verify Admission</h1>
// 						<p style={{ fontSize: 13, color: T.textMuted, maxWidth: 340, margin: "0 auto", lineHeight: 1.5 }}>
// 							Enter the booking code, scan the QR token, or paste from clipboard to verify admission status.
// 						</p>
// 					</div>

// 					<form onSubmit={handleVerify} style={{ position: "relative" }}>
// 						<input
// 							ref={inputRef}
// 							type="text"
// 							value={code}
// 							onChange={(e) => setCode(e.target.value.toUpperCase())}
// 							onPaste={handlePaste}
// 							placeholder="ENTER BOOKING CODE"
// 							className="inp"
// 							style={{ paddingRight: 50 }}
// 							disabled={verifying}
// 						/>
// 						{verifying && (
// 							<div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
// 								<div style={{ width: 18, height: 18, border: `2px solid ${T.inputBorder}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
// 							</div>
// 						)}
// 						<button
// 							type="submit"
// 							className="btn btn-p"
// 							disabled={verifying || !code.trim()}
// 							style={{ width: "100%", marginTop: 16, padding: "14px 24px", fontSize: 15, justifyContent: "center", opacity: verifying || !code.trim() ? 0.6 : 1 }}
// 						>
// 							{verifying ? "Verifying..." : "Verify Booking"}
// 						</button>
// 					</form>

// 					<div style={{ display: "flex", gap: 10, marginTop: 12 }}>
// 						<button
// 							onClick={startScanner}
// 							className="btn btn-p"
// 							disabled={isScanning}
// 							style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: 13 }}
// 						>
// 							📷 Scan QR Code
// 						</button>
// 						<button
// 							onClick={handleClear}
// 							className="btn btn-g"
// 							style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: 13 }}
// 						>
// 							Clear
// 						</button>
// 					</div>
// 				</div>

// 				{/* RESULT CARD */}
// 				{result && (
// 					<div
// 						className="card"
// 						style={{
// 							width: "100%",
// 							maxWidth: 520,
// 							padding: 0,
// 							animation: "fadeIn 0.4s ease",
// 							borderColor: result.valid ? T.validBorder : T.invalidBorder,
// 							background: result.valid ? T.validBg : T.invalidBg,
// 						}}
// 					>
// 						{/* Result Header */}
// 						<div style={{ padding: "20px 24px", borderBottom: `1px solid ${result.valid ? T.validBorder : T.invalidBorder}`, display: "flex", alignItems: "center", gap: 12 }}>
// 							<div style={{ width: 36, height: 36, borderRadius: 10, background: result.valid ? T.btnSuccessBg : T.btnDangerBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
// 								{result.valid ? "✅" : "❌"}
// 							</div>
// 							<div>
// 								<div style={{ fontSize: 15, fontWeight: 700, color: result.valid ? T.validText : T.invalidText }}>
// 									{result.valid ? "Booking Verified" : "Verification Failed"}
// 								</div>
// 								<div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
// 									{result.valid ? "Admission is valid and ready for completion" : result.error}
// 								</div>
// 							</div>
// 						</div>

// 						{/* Booking Details */}
// 						{result.booking && (
// 							<div style={{ padding: "20px 24px" }}>
// 								<div className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, marginBottom: 16 }}>
// 									Booking Information
// 								</div>

// 								<div style={{ display: "grid", gap: 12 }}>
// 									<DetailRow label="Booking Code" value={result.booking.booking_code} highlight mono T={T as typeof THEMES.light} />
// 									<DetailRow label="Payment Status" value={result.booking.payment_status} status T={T as typeof THEMES.light} />
// 									<DetailRow label="Amount Paid" value={`₹${result.booking.amount_paid.toLocaleString("en-IN")}`} T={T as typeof THEMES.light} />
// 									<DetailRow label="Booked On" value={formatDate(result.booking.created_at)} T={T as typeof THEMES.light} />
// 									{result.booking.expires_at && (
// 										<DetailRow label="Expires On" value={formatDate(result.booking.expires_at)} T={T as typeof THEMES.light} />
// 									)}
// 								</div>

// 								{/* Course Details */}
// 								{result.course && (
// 									<>
// 										<div style={{ height: 1, background: T.divider, margin: "20px 0" }} />
// 										<div className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, marginBottom: 16 }}>
// 											Course Details
// 										</div>
// 										<div style={{ display: "grid", gap: 12 }}>
// 											<DetailRow label="Course" value={result.course.title} T={T as typeof THEMES.light} />
// 											{result.course.title_hi && <DetailRow label="Course (HI)" value={result.course.title_hi} T={T as typeof THEMES.light} />}
// 											<DetailRow label="Fee" value={`₹${result.course.fee.toLocaleString("en-IN")}`} T={T as typeof THEMES.light} />
// 											<DetailRow label="Pre-book Amount" value={`₹${result.course.prebook_amount.toLocaleString("en-IN")}`} T={T as typeof THEMES.light} />
// 											<DetailRow label="Duration" value={result.course.duration} T={T as typeof THEMES.light} />
// 											{result.course.start_date && <DetailRow label="Start Date" value={formatDate(result.course.start_date)} T={T as typeof THEMES.light} />}
// 										</div>
// 									</>
// 								)}

// 								{/* User Details */}
// 								{result.user && (
// 									<>
// 										<div style={{ height: 1, background: T.divider, margin: "20px 0" }} />
// 										<div className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, marginBottom: 16 }}>
// 											Student Information
// 										</div>
// 										<div style={{ display: "grid", gap: 12 }}>
// 											<DetailRow label="Name" value={result.user.name || "N/A"} T={T as typeof THEMES.light} />
// 											<DetailRow label="Email" value={result.user.email || "N/A"} T={T as typeof THEMES.light} />
// 											<DetailRow label="Mobile" value={result.user.mobile || "N/A"} T={T as typeof THEMES.light} />
// 										</div>
// 									</>
// 								)}

// 								{result.valid && result.booking?.admission_status === "completed" && (
// 									<div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: T.validBg, border: `1px solid ${T.validBorder}`, textAlign: "center" }}>
// 										<div style={{ fontSize: 20, marginBottom: 4 }}>🎓</div>
// 										<div style={{ fontSize: 14, fontWeight: 700, color: T.validText }}>Already Admitted</div>
// 										<div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>This booking was already processed.</div>
// 									</div>
// 								)}

// 								{result.valid && result.booking?.admission_status !== "completed" && !admissionMarked && (
// 									<div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.validBorder}` }}>
// 										<button
// 											onClick={handleMarkComplete}
// 											disabled={markingComplete}
// 											className="btn btn-s"
// 											style={{ width: "100%", padding: "14px 24px", fontSize: 15, justifyContent: "center", opacity: markingComplete ? 0.7 : 1 }}
// 										>
// 											{markingComplete ? "Processing..." : "✅ Mark Admission Complete"}
// 										</button>
// 										<p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: T.textMuted }}>
// 											This will update the booking admission status and log the action.
// 										</p>
// 									</div>
// 								)}

// 								{admissionMarked && (
// 									<div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: T.validBg, border: `1px solid ${T.validBorder}`, textAlign: "center" }}>
// 										<div style={{ fontSize: 20, marginBottom: 4 }}>🎉</div>
// 										<div style={{ fontSize: 14, fontWeight: 700, color: T.validText }}>Admission Completed</div>
// 										<div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Booking status updated successfully.</div>
// 									</div>
// 								)}
// 							</div>
// 						)}
// 					</div>
// 				)}
// 			</div>

// 			{/* FOOTER */}
// 			<footer style={{ padding: "20px", textAlign: "center", borderTop: `1px solid ${T.divider}`, marginTop: "auto" }}>
// 				<p style={{ fontSize: 11, color: T.textMuted }}>© Srilal CSC Admin Portal. Secure verification system.</p>
// 			</footer>
// 		</div>
// 	);
// }

// // Helper component for detail rows
// function DetailRow({ label, value, highlight, mono, status, T }: { label: string; value: string; highlight?: boolean; mono?: boolean; status?: boolean; T: typeof THEMES.light }) {
// 	const statusColor = status
// 		? value === "paid" || value === "admitted"
// 			? T.validText
// 			: value === "pending"
// 				? "#d97706"
// 				: T.invalidText
// 		: undefined;

// 	return (
// 		<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
// 			<span style={{ fontSize: 12, color: T.textSecondary, fontWeight: 500 }}>{label}</span>
// 			<span
// 				style={{
// 					fontSize: 13,
// 					color: statusColor ? statusColor : highlight ? T.accent : T.textPrimary,
// 					fontWeight: highlight ? 700 : 600,
// 					fontFamily: mono ? "'JetBrains Mono',monospace" : "'DM Sans',sans-serif",
// 					textAlign: "right",
// 					wordBreak: "break-word",
// 					maxWidth: "60%",
// 				}}
// 			>
// 				{value}
// 			</span>
// 		</div>
// 	);
// }













// src/app/admin/verify/VerifyClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\verify\VerifyClient.tsx. No new file needed.
//
// KEPT (all logic exactly as supplied):
// - verifyCode (useCallback): verifyBookingByCodeAction(codeToVerify.trim())
//   -> setResult(res); plays /sounds/success.mp3 when res.valid, else
//   /sounds/error.mp3 (play failures swallowed); on throw, setResult
//   ({ valid: false, error: err.message || "Verification failed" }); finally
//   clears verifying and re-focuses the input after 100ms. Guards on empty
//   code, resets result + admissionMarked before each verify.
// - handleVerify (form submit, preventDefault -> verifyCode(code));
//   handleMarkComplete (markAdmissionCompleteAction(result.booking.id) ->
//   admissionMarked; alert(err.message || "Failed to mark admission") on
//   error); handleClear (clears code/result/admissionMarked/scanError,
//   re-focuses input); handlePaste (pasted text uppercased; length >= 6
//   sets the code and auto-verifies after 50ms).
// - QR scanner: Html5Qrcode("qr-reader") started after a 100ms timeout,
//   { facingMode: "environment" }, { fps: 10, qrbox: { width: 250,
//   height: 250 } }; stop-on-unmount cleanup effect; overlay click-outside
//   closes the scanner; scan errors while scanning are ignored; a failed
//   start sets scanError ("Could not start camera. Please allow camera
//   permissions.") and closes the overlay. On a successful scan the code is
//   trimmed + uppercased, set into the input, the scanner is stopped and
//   verifyCode runs after 100ms.
// - QR success callback: JSON.parse(cleanCode) is called UNCONDITIONALLY
//   (see FLAG 1) and, if the parsed value is an object with BOOKINGCODE,
//   that becomes the code. Kept byte-for-byte in behaviour.
// - Input card: centred uppercase code input (letter-spacing 2, auto-focus
//   on mount), placeholder "ENTER BOOKING CODE", spinner inside the input
//   while verifying, "Verify Booking" / "Verifying..." submit button,
//   "Scan QR Code" and "Clear" buttons, same intro copy ("Enter the booking
//   code, scan the QR token, or paste from clipboard to verify admission
//   status.").
// - Result card: header "Booking Verified" / "Verification Failed" with
//   subtext "Admission is valid and ready for completion" when valid, else
//   result.error; Booking Information (booking_code highlighted mono,
//   payment_status with status colour — paid/admitted green, pending amber
//   #d97706, anything else red — amount_paid in ₹ en-IN, Booked On,
//   Expires On only when present), Course Details (title, title_hi only
//   when present, fee, prebook_amount, duration, start_date only when
//   present), Student Information (name/email/mobile, "N/A" fallbacks);
//   "Already Admitted" panel when admission_status === "completed";
//   "Mark Admission Complete" button otherwise with the note "This will
//   update the booking admission status and log the action."; "Admission
//   Completed" panel after marking. formatDate (en-IN, day + short month +
//   year + hour + minute, "N/A" for empty, raw value on error).
// - DetailRow is still a separate component, but it no longer receives the
//   whole theme object T as a prop — that prop only existed to carry the
//   deleted THEMES tokens. Its label/value/highlight/mono/status behaviour
//   is unchanged (mechanical consequence of deleting THEMES, not a
//   behaviour change).
// - Header: brand "SrilalCSC" kept as supplied, subtitle "ADMISSION
//   VERIFY", NAV_LINKS made relative (7 links, no Analytics in this file):
//   /admin, /admin/posts, /admin/courses, /admin/verify, /admin/galary
//   (route spelling kept), /admin/forms, /admin/transactions; Verify is
//   the active link.
// - Footer: "© Srilal CSC Admin Portal. Secure verification system."
// - Theme: csc_theme localStorage, prefers-color-scheme fallback,
//   toggleTheme writes csc_theme, plus a dark-class sync effect on
//   document.documentElement. One deep-blue accent in both themes.
//
// REMOVED:
// - The whole THEMES object (incl. the blue-light / amber-dark accent
//   switch) and buildCss() (Google Fonts @import for DM Serif Display /
//   DM Sans / JetBrains Mono + a global * margin/padding reset + every
//   generated class); every inline style object; the Ico-less emoji icons
//   (🏛️ brand tile, 🔍, 📷, ✅/❌, 🎓, 🎉, 🌙/☀️ toggle) replaced by
//   lucide-react icons; all gradients (brand tile, primary/success/warning
//   buttons, result icon tiles).
// - The scan-line gradient bar and the pulse-ring / scan keyframes: they
//   were defined in buildCss but never applied to any element in the JSX,
//   so dropping them changes nothing on screen (see FLAG 3).
// - useRouter import and the `router` variable: created in the original
//   but never used anywhere (no router.push / router.back call exists in
//   the file). Dropped, no behaviour change.
// - NAV_LINKS no longer build absolute URLs from NODE_ENV
//   (https://srilalsahaj.co.in/... / http://localhost:3000/...);
//   they are plain relative links (see KEPT above).
// - The only remaining <style> block is a small third-party override for
//   the html5-qrcode widget (#qr-reader video rounding and its dashboard
//   text/link colours, plus one fadeIn keyframe). html5-qrcode injects its
//   own DOM, so those elements cannot be styled with Tailwind classes.
//   It contains no fonts, no global reset and no gradients.
//
// FLAGS (kept as supplied, not changed — need Swatantra's word):
// 1. UNGUARDED JSON.parse IN THE QR SCAN CALLBACK: on a successful scan
//    the code does `const parsed = JSON.parse(cleanCode)` with no
//    try/catch. A plain-text (non-JSON) QR code — e.g. a code that is just
//    "ABC123" — throws inside the html5-qrcode success callback, so the
//    BOOKINGCODE extraction only works for JSON QRs and plain-code QRs
//    likely break the scan flow (the code is never set and verify never
//    runs). Kept exactly as supplied; the safe fix is to wrap the parse
//    in try/catch and fall back to the raw text, but that changes
//    behaviour and was not applied.
// 2. The theme effect depends on [user], so it re-reads csc_theme and
//    re-focuses the input every time the auth user object changes. Kept
//    as supplied.
// 3. buildCss defined a `.scan-line` class with a `scan` keyframe and a
//    `pulse-ring` keyframe that no JSX element ever used. Both are gone
//    with buildCss; nothing on screen changes.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { markAdmissionCompleteAction, VerificationResult, verifyBookingByCodeAction } from "@/app/actions/courses";
import { Html5Qrcode } from "html5-qrcode";
import {
	Award,
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Image as ImageIcon,
  Landmark,
  Loader2,
  Moon,
  PartyPopper,
  PenLine,
  QrCode,
  SearchCheck,
  ShieldCheck,
  Sun,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";

const NAV_LINKS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/admin", icon: ShieldCheck, label: "Admin" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/posts", icon: PenLine, label: "Posts" },
  { href: "/admin/courses", icon: BookOpen, label: "Courses" },
  { href: "/admin/verify", icon: BadgeCheck, label: "Verify" },
  { href: "/admin/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/forms", icon: ClipboardList, label: "Forms" },
  { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
];

export default function VerifyClient() {
  const [isDark, setIsDark] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [admissionMarked, setAdmissionMarked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const { user } = useAuth();

  // ── Theme: stored choice wins, else system preference; focuses the input ──
  // Kept as supplied: this effect depends on [user] (see FLAG 2).
  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
    inputRef.current?.focus();
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => { });
        scannerRef.current = null;
      }
    };
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const verifyCode = useCallback(async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setVerifying(true);
    setResult(null);
    setAdmissionMarked(false);
    try {
      const res = await verifyBookingByCodeAction(codeToVerify.trim());
      setResult(res);
      if (typeof window !== "undefined") {
        const audio = new Audio(res.valid ? "/sounds/success.mp3" : "/sounds/error.mp3");
        audio.play().catch(() => { });
      }
    } catch (err: any) {
      setResult({ valid: false, error: err.message || "Verification failed" });
    } finally {
      setVerifying(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await verifyCode(code);
  };

  const handleMarkComplete = async () => {
    if (!result?.booking?.id) return;
    setMarkingComplete(true);
    try {
      await markAdmissionCompleteAction(result.booking.id);
      setAdmissionMarked(true);
    } catch (err: any) {
      alert(err.message || "Failed to mark admission");
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setResult(null);
    setAdmissionMarked(false);
    setScanError(null);
    inputRef.current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").trim().toUpperCase();
    if (pasted.length >= 6) {
      setCode(pasted);
      setTimeout(() => verifyCode(pasted), 50);
    }
  };

  const startScanner = async () => {
    setScanError(null);
    setIsScanning(true);
    // Small delay to ensure DOM element is rendered
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // Success
            let cleanCode = decodedText.trim().toUpperCase();
            // Parse JSON if applicable
            // FLAG 1 — kept as supplied: JSON.parse with no try/catch.
            // A plain-text (non-JSON) QR code throws here and the scan
            // flow breaks. Do not "fix" silently; see header.
            const parsed = JSON.parse(cleanCode);
            if (parsed && typeof parsed === "object" && parsed.BOOKINGCODE) {
              cleanCode = parsed.BOOKINGCODE;
            }
            setCode(cleanCode);
            stopScanner();
            setTimeout(() => verifyCode(cleanCode), 100);
          },
          () => {
            // Scan error (ignore continuous errors)
          }
        );
      } catch (err: any) {
        setScanError(err.message || "Could not start camera. Please allow camera permissions.");
        setIsScanning(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch { }
      scannerRef.current = null;
    }
    setIsScanning(false);
    setScanError(null);
  };

  const formatDate = (d: string) => {
    if (!d) return "N/A";
    try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return d; }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-[#0b1220] dark:text-slate-100">
      {/* html5-qrcode injects its own DOM, so its dashboard text/link colours
          and the video rounding need plain CSS (no fonts, no reset, no gradients). */}
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        #qr-reader{width:100%;border-radius:12px;overflow:hidden;}
        #qr-reader video{border-radius:12px;}
        #qr-reader__dashboard_section_csr span{color:#475569 !important;}
        .dark #qr-reader__dashboard_section_csr span{color:#94a3b8 !important;}
        #qr-reader__dashboard_section_swaplink{color:#1d4ed8 !important;}
        .dark #qr-reader__dashboard_section_swaplink{color:#60a5fa !important;}
      `}</style>

      {/* QR SCANNER OVERLAY */}
      {isScanning && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/55 p-5"
          onClick={(e) => { if (e.target === e.currentTarget) stopScanner(); }}
        >
          <div className="w-full max-w-[420px] animate-[fadeIn_0.3s_ease] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-slate-100">
                <Camera className="h-4 w-4 text-blue-700 dark:text-blue-400" /> Scan QR Code
              </div>
              <button
                onClick={stopScanner}
                className="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              >
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </div>
            <div className="flex flex-col items-center gap-4 p-5">
              <div id="qr-reader" className="w-full" />
              {scanError && (
                <div className="text-center text-[13px] font-medium text-red-700 dark:text-red-400">
                  {scanError}
                </div>
              )}
              <p className="text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                Point your camera at the booking QR code. It will scan automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="z-[100] shrink-0 border-b-[3px] border-blue-600 bg-[#0b2239] shadow-md dark:border-blue-500 dark:bg-[#081120]">
        <div className="flex h-[54px] items-center gap-3.5 border-b border-white/10 px-5">
          <a href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-600">
              <Landmark className="h-[17px] w-[17px]" />
            </div>
            <div>
              <div className="text-[17px] font-bold leading-none tracking-tight text-white">
                Srilal<span className="text-blue-400">CSC</span>
              </div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.1em] text-white/40">ADMISSION VERIFY</div>
            </div>
          </a>
          <span className="h-[26px] w-px shrink-0 bg-white/10" />
          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold transition-colors ${
                  l.label === "Verify"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <l.icon className="h-[13px] w-[13px]" /> {l.label}
              </a>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-white/15 bg-transparent px-3 py-1.5 text-xs! font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />} {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 flex-col items-center gap-6 px-5 py-10">

        {/* INPUT CARD */}
        <div className="w-full max-w-[520px] animate-[fadeIn_0.5s_ease] rounded-xl border border-slate-200 bg-white px-7 py-8 shadow-sm dark:border-white/10 dark:bg-[#111a2e]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-400">
              <SearchCheck className="h-6 w-6" />
            </div>
            <h1 className="mb-1.5 text-2xl font-bold text-slate-900 dark:text-slate-100">Verify Admission</h1>
            <p className="mx-auto max-w-[340px] text-[13px] leading-relaxed text-slate-400 dark:text-slate-500">
              Enter the booking code, scan the QR token, or paste from clipboard to verify admission status.
            </p>
          </div>

          <form onSubmit={handleVerify} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onPaste={handlePaste}
              placeholder="ENTER BOOKING CODE"
              disabled={verifying}
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-[18px] py-3.5 pr-[50px] text-center text-base uppercase tracking-[2px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
            {verifying && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="h-[18px] w-[18px] animate-spin text-blue-700 dark:text-blue-400" />
              </div>
            )}
            <button
              type="submit"
              disabled={verifying || !code.trim()}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {verifying ? "Verifying..." : "Verify Booking"}
            </button>
          </form>

          <div className="mt-3 flex gap-2.5">
            <button
              onClick={startScanner}
              disabled={isScanning}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <QrCode className="h-4 w-4" /> Scan QR Code
            </button>
            <button
              onClick={handleClear}
              className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:text-blue-400"
            >
              Clear
            </button>
          </div>
        </div>

        {/* RESULT CARD */}
        {result && (
          <div
            className={`w-full max-w-[520px] animate-[fadeIn_0.4s_ease] overflow-hidden rounded-xl border shadow-sm ${
              result.valid
                ? "border-green-300 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10"
                : "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
            }`}
          >
            {/* Result Header */}
            <div className={`flex items-center gap-3 border-b px-6 py-5 ${
              result.valid
                ? "border-green-300 dark:border-green-500/30"
                : "border-red-300 dark:border-red-500/30"
            }`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-white ${
                result.valid ? "bg-green-700 dark:bg-green-600" : "bg-red-600 dark:bg-red-500"
              }`}>
                {result.valid ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              </div>
              <div>
                <div className={`text-[15px] font-bold ${
                  result.valid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }`}>
                  {result.valid ? "Booking Verified" : "Verification Failed"}
                </div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {result.valid ? "Admission is valid and ready for completion" : result.error}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            {result.booking && (
              <div className="px-6 py-5">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
                  Booking Information
                </div>

                <div className="grid gap-3">
                  <DetailRow label="Booking Code" value={result.booking.booking_code} highlight mono />
                  <DetailRow label="Payment Status" value={result.booking.payment_status} status />
                  <DetailRow label="Amount Paid" value={`₹${result.booking.amount_paid.toLocaleString("en-IN")}`} />
                  <DetailRow label="Booked On" value={formatDate(result.booking.created_at)} />
                  {result.booking.expires_at && (
                    <DetailRow label="Expires On" value={formatDate(result.booking.expires_at)} />
                  )}
                </div>

                {/* Course Details */}
                {result.course && (
                  <>
                    <div className="my-5 h-px bg-slate-200 dark:bg-white/10" />
                    <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
                      Course Details
                    </div>
                    <div className="grid gap-3">
                      <DetailRow label="Course" value={result.course.title} />
                      {result.course.title_hi && <DetailRow label="Course (HI)" value={result.course.title_hi} />}
                      <DetailRow label="Fee" value={`₹${result.course.fee.toLocaleString("en-IN")}`} />
                      <DetailRow label="Pre-book Amount" value={`₹${result.course.prebook_amount.toLocaleString("en-IN")}`} />
                      <DetailRow label="Duration" value={result.course.duration} />
                      {result.course.start_date && <DetailRow label="Start Date" value={formatDate(result.course.start_date)} />}
                    </div>
                  </>
                )}

                {/* User Details */}
                {result.user && (
                  <>
                    <div className="my-5 h-px bg-slate-200 dark:bg-white/10" />
                    <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
                      Student Information
                    </div>
                    <div className="grid gap-3">
                      <DetailRow label="Name" value={result.user.name || "N/A"} />
                      <DetailRow label="Email" value={result.user.email || "N/A"} />
                      <DetailRow label="Mobile" value={result.user.mobile || "N/A"} />
                    </div>
                  </>
                )}

                {result.valid && result.booking?.admission_status === "completed" && (
                  <div className="mt-6 rounded-lg border border-green-300 bg-green-50 px-4 py-4 text-center dark:border-green-500/30 dark:bg-green-500/10">
                    <GraduationCap className="mx-auto mb-1 h-5 w-5 text-green-700 dark:text-green-400" />
                    <div className="text-sm font-bold text-green-700 dark:text-green-400">Already Admitted</div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">This booking was already processed.</div>
                  </div>
                )}

                {result.valid && result.booking?.admission_status !== "completed" && !admissionMarked && (
                  <div className={`mt-6 border-t pt-5 ${
                    result.valid ? "border-green-300 dark:border-green-500/30" : "border-red-300 dark:border-red-500/30"
                  }`}>
                    <button
                      onClick={handleMarkComplete}
                      disabled={markingComplete}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-700 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-70 dark:bg-green-600 dark:hover:bg-green-500"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {markingComplete ? "Processing..." : "Mark Admission Complete"}
                    </button>
                    <p className="mt-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500">
                      This will update the booking admission status and log the action.
                    </p>
                  </div>
                )}

                {admissionMarked && (
                  <div className="mt-6 rounded-lg border border-green-300 bg-green-50 px-4 py-4 text-center dark:border-green-500/30 dark:bg-green-500/10">
                    <PartyPopper className="mx-auto mb-1 h-5 w-5 text-green-700 dark:text-green-400" />
                    <div className="text-sm font-bold text-green-700 dark:text-green-400">Admission Completed</div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Booking status updated successfully.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 px-5 py-5 text-center dark:border-white/10">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">© Srilal CSC Admin Portal. Secure verification system.</p>
      </footer>
    </div>
  );
}

// Helper component for detail rows
function DetailRow({ label, value, highlight, mono, status }: { label: string; value: string; highlight?: boolean; mono?: boolean; status?: boolean }) {
  const statusClass = status
    ? value === "paid" || value === "admitted"
      ? "text-green-700 dark:text-green-400"
      : value === "pending"
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-700 dark:text-red-400"
    : undefined;

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={`max-w-[60%] break-words text-right text-[13px] font-semibold ${
          statusClass ?? (highlight ? "font-bold text-blue-700 dark:text-blue-400" : "text-slate-900 dark:text-slate-100")
        } ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
