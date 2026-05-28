"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { markAdmissionCompleteAction, VerificationResult, verifyBookingByCodeAction } from "@/app/actions/courses";
import { Html5Qrcode } from "html5-qrcode";

const THEMES = {
	light: {
		pageBg: "#f1f5f9", navBg: "#1e3a8a", navBottomBorder: "#3b82f6",
		navText: "rgba(255,255,255,0.65)", navTextHover: "#ffffff",
		navBrand: "#ffffff", navBrandAccent: "#93c5fd",
		cardBg: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
		textPrimary: "#1e293b", textSecondary: "#475569", textMuted: "#94a3b8",
		accent: "#2563eb", accentHover: "#1d4ed8", accentLight: "#eff6ff", accentBorder: "#bfdbfe",
		inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputFocusBorder: "#3b82f6", inputPlaceholder: "#94a3b8",
		divider: "#e2e8f0",
		btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff",
		btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569",
		btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)", btnSuccessText: "#ffffff",
		btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626",
		btnWarningBg: "linear-gradient(135deg,#b45309,#d97706)", btnWarningText: "#ffffff",
		modalOverlay: "rgba(15,23,42,0.55)", toggleIcon: "🌙", toggleLabel: "Dark",
		validBg: "#f0fdf4", validBorder: "#86efac", validText: "#15803d",
		invalidBg: "#fef2f2", invalidBorder: "#fecaca", invalidText: "#dc2626",
	},
	dark: {
		pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b",
		navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff",
		navBrand: "#ffffff", navBrandAccent: "#f59e0b",
		cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
		textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)",
		accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)",
		inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)", inputFocusBorder: "rgba(245,158,11,0.5)", inputPlaceholder: "rgba(255,255,255,0.28)",
		divider: "rgba(255,255,255,0.06)",
		btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000",
		btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)",
		btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)", btnSuccessText: "#ffffff",
		btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171",
		btnWarningBg: "linear-gradient(135deg,#92400e,#b45309)", btnWarningText: "#ffffff",
		modalOverlay: "rgba(0,0,0,0.85)", toggleIcon: "☀️", toggleLabel: "Light",
		validBg: "rgba(16,185,129,0.1)", validBorder: "rgba(16,185,129,0.3)", validText: "#34d399",
		invalidBg: "rgba(239,68,68,0.1)", invalidBorder: "rgba(239,68,68,0.3)", invalidText: "#f87171",
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
];

function buildCss(T: typeof THEMES.light): string {
	return `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.divider};border-radius:4px;}
.serif{font-family:'DM Serif Display',serif;}
.mono{font-family:'JetBrains Mono',monospace;}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes scan{0%{top:0}50%{top:100%}51%{top:0}100%{top:100%}}
@keyframes pulse-ring{0%{transform:scale(0.8);opacity:1}100%{transform:scale(1.3);opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
.top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
.top-nav-link.on{background:rgba(255,255,255,0.12);color:#fff;}
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'DM Sans',sans-serif;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover{filter:brightness(1.08);transform:translateY(-1px);}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{border-color:${T.accentBorder};color:${T.accent};}
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-s:hover{filter:brightness(1.08);}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-w{background:${T.btnWarningBg};color:${T.btnWarningText};}
.inp{width:100%;padding:14px 18px;background:${T.inputBg};border:2px solid ${T.inputBorder};border-radius:12px;color:${T.textPrimary};font-size:16px;outline:none;transition:all .2s;font-family:'DM Sans',sans-serif;text-align:center;letter-spacing:2px;text-transform:uppercase;}
.inp:focus{border-color:${T.inputFocusBorder};box-shadow:0 0 0 4px ${T.accentBorder};}
.inp::placeholder{color:${T.inputPlaceholder};text-transform:none;letter-spacing:normal;}
.scan-line{position:absolute;width:100%;height:2px;background:linear-gradient(90deg,transparent,${T.accent},transparent);animation:scan 2s linear infinite;pointer-events:none;}
.tog{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};background:transparent;border:1px solid rgba(255,255,255,0.15);cursor:pointer;transition:all .15s;white-space:nowrap;}
.tog:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
.qr-overlay{position:fixed;inset:0;background:${T.modalOverlay};z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.qr-box{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:16px;box-shadow:${T.cardShadow};width:100%;max-width:420px;overflow:hidden;animation:fadeIn 0.3s ease;}
.qr-header{padding:16px 20px;border-bottom:1px solid ${T.divider};display:flex;align-items:center;justify-content:space-between;}
.qr-body{padding:20px;display:flex;flex-direction:column;align-items:center;gap:16px;}
#qr-reader{width:100%;border-radius:12px;overflow:hidden;}
#qr-reader video{border-radius:12px;}
#qr-reader__dashboard_section_csr span{color:${T.textSecondary} !important;}
#qr-reader__dashboard_section_swaplink{color:${T.accent} !important;}
`;
}

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

	const T = isDark ? THEMES.dark : THEMES.light;
	const router = useRouter();
	const { user } = useAuth();

	useEffect(() => {
		const saved = localStorage.getItem("csc_theme");
		if (saved) setIsDark(saved === "dark");
		else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
		inputRef.current?.focus();
	}, [user]);

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
		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans',sans-serif", transition: "background .25s, color .25s" }}>
			<style dangerouslySetInnerHTML={{ __html: buildCss(T as typeof THEMES.light) }} />

			{/* QR SCANNER OVERLAY */}
			{isScanning && (
				<div className="qr-overlay" onClick={(e) => { if (e.target === e.currentTarget) stopScanner(); }}>
					<div className="qr-box">
						<div className="qr-header">
							<div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>📷 Scan QR Code</div>
							<button onClick={stopScanner} className="btn btn-d" style={{ padding: "6px 12px", fontSize: 12 }}>Close</button>
						</div>
						<div className="qr-body">
							<div id="qr-reader" style={{ width: "100%" }} />
							{scanError && (
								<div style={{ color: T.invalidText, fontSize: 13, textAlign: "center", fontWeight: 500 }}>
									{scanError}
								</div>
							)}
							<p style={{ fontSize: 11, color: T.textMuted, textAlign: "center" }}>
								Point your camera at the booking QR code. It will scan automatically.
							</p>
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
							<div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMISSION VERIFY</div>
						</div>
					</a>
					<div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
					<nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
						{NAV_LINKS.map(l => (
							<a key={l.href} href={l.href} className={`top-nav-link ${l.label === "Verify" ? "on" : ""}`}>
								<span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
							</a>
						))}
					</nav>
					<button className="tog" onClick={toggleTheme}>
						<span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
					</button>
				</div>
			</header>

			{/* MAIN CONTENT */}
			<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 24 }}>

				{/* INPUT CARD */}
				<div className="card" style={{ width: "100%", maxWidth: 520, padding: "32px 28px", animation: "fadeIn 0.5s ease" }}>
					<div style={{ textAlign: "center", marginBottom: 24 }}>
						<div style={{ width: 56, height: 56, borderRadius: 16, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>
							🔍
						</div>
						<h1 className="serif" style={{ fontSize: 24, marginBottom: 6, color: T.textPrimary }}>Verify Admission</h1>
						<p style={{ fontSize: 13, color: T.textMuted, maxWidth: 340, margin: "0 auto", lineHeight: 1.5 }}>
							Enter the booking code, scan the QR token, or paste from clipboard to verify admission status.
						</p>
					</div>

					<form onSubmit={handleVerify} style={{ position: "relative" }}>
						<input
							ref={inputRef}
							type="text"
							value={code}
							onChange={(e) => setCode(e.target.value.toUpperCase())}
							onPaste={handlePaste}
							placeholder="ENTER BOOKING CODE"
							className="inp"
							style={{ paddingRight: 50 }}
							disabled={verifying}
						/>
						{verifying && (
							<div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
								<div style={{ width: 18, height: 18, border: `2px solid ${T.inputBorder}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
							</div>
						)}
						<button
							type="submit"
							className="btn btn-p"
							disabled={verifying || !code.trim()}
							style={{ width: "100%", marginTop: 16, padding: "14px 24px", fontSize: 15, justifyContent: "center", opacity: verifying || !code.trim() ? 0.6 : 1 }}
						>
							{verifying ? "Verifying..." : "Verify Booking"}
						</button>
					</form>

					<div style={{ display: "flex", gap: 10, marginTop: 12 }}>
						<button
							onClick={startScanner}
							className="btn btn-p"
							disabled={isScanning}
							style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: 13 }}
						>
							📷 Scan QR Code
						</button>
						<button
							onClick={handleClear}
							className="btn btn-g"
							style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: 13 }}
						>
							Clear
						</button>
					</div>
				</div>

				{/* RESULT CARD */}
				{result && (
					<div
						className="card"
						style={{
							width: "100%",
							maxWidth: 520,
							padding: 0,
							animation: "fadeIn 0.4s ease",
							borderColor: result.valid ? T.validBorder : T.invalidBorder,
							background: result.valid ? T.validBg : T.invalidBg,
						}}
					>
						{/* Result Header */}
						<div style={{ padding: "20px 24px", borderBottom: `1px solid ${result.valid ? T.validBorder : T.invalidBorder}`, display: "flex", alignItems: "center", gap: 12 }}>
							<div style={{ width: 36, height: 36, borderRadius: 10, background: result.valid ? T.btnSuccessBg : T.btnDangerBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
								{result.valid ? "✅" : "❌"}
							</div>
							<div>
								<div style={{ fontSize: 15, fontWeight: 700, color: result.valid ? T.validText : T.invalidText }}>
									{result.valid ? "Booking Verified" : "Verification Failed"}
								</div>
								<div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
									{result.valid ? "Admission is valid and ready for completion" : result.error}
								</div>
							</div>
						</div>

						{/* Booking Details */}
						{result.booking && (
							<div style={{ padding: "20px 24px" }}>
								<div className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, marginBottom: 16 }}>
									Booking Information
								</div>

								<div style={{ display: "grid", gap: 12 }}>
									<DetailRow label="Booking Code" value={result.booking.booking_code} highlight mono T={T as typeof THEMES.light} />
									<DetailRow label="Payment Status" value={result.booking.payment_status} status T={T as typeof THEMES.light} />
									<DetailRow label="Amount Paid" value={`₹${result.booking.amount_paid.toLocaleString("en-IN")}`} T={T as typeof THEMES.light} />
									<DetailRow label="Booked On" value={formatDate(result.booking.created_at)} T={T as typeof THEMES.light} />
									{result.booking.expires_at && (
										<DetailRow label="Expires On" value={formatDate(result.booking.expires_at)} T={T as typeof THEMES.light} />
									)}
								</div>

								{/* Course Details */}
								{result.course && (
									<>
										<div style={{ height: 1, background: T.divider, margin: "20px 0" }} />
										<div className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, marginBottom: 16 }}>
											Course Details
										</div>
										<div style={{ display: "grid", gap: 12 }}>
											<DetailRow label="Course" value={result.course.title} T={T as typeof THEMES.light} />
											{result.course.title_hi && <DetailRow label="Course (HI)" value={result.course.title_hi} T={T as typeof THEMES.light} />}
											<DetailRow label="Fee" value={`₹${result.course.fee.toLocaleString("en-IN")}`} T={T as typeof THEMES.light} />
											<DetailRow label="Pre-book Amount" value={`₹${result.course.prebook_amount.toLocaleString("en-IN")}`} T={T as typeof THEMES.light} />
											<DetailRow label="Duration" value={result.course.duration} T={T as typeof THEMES.light} />
											{result.course.start_date && <DetailRow label="Start Date" value={formatDate(result.course.start_date)} T={T as typeof THEMES.light} />}
										</div>
									</>
								)}

								{/* User Details */}
								{result.user && (
									<>
										<div style={{ height: 1, background: T.divider, margin: "20px 0" }} />
										<div className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, marginBottom: 16 }}>
											Student Information
										</div>
										<div style={{ display: "grid", gap: 12 }}>
											<DetailRow label="Name" value={result.user.name || "N/A"} T={T as typeof THEMES.light} />
											<DetailRow label="Email" value={result.user.email || "N/A"} T={T as typeof THEMES.light} />
											<DetailRow label="Mobile" value={result.user.mobile || "N/A"} T={T as typeof THEMES.light} />
										</div>
									</>
								)}

								{result.valid && result.booking?.admission_status === "completed" && (
									<div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: T.validBg, border: `1px solid ${T.validBorder}`, textAlign: "center" }}>
										<div style={{ fontSize: 20, marginBottom: 4 }}>🎓</div>
										<div style={{ fontSize: 14, fontWeight: 700, color: T.validText }}>Already Admitted</div>
										<div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>This booking was already processed.</div>
									</div>
								)}

								{result.valid && result.booking?.admission_status !== "completed" && !admissionMarked && (
									<div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.validBorder}` }}>
										<button
											onClick={handleMarkComplete}
											disabled={markingComplete}
											className="btn btn-s"
											style={{ width: "100%", padding: "14px 24px", fontSize: 15, justifyContent: "center", opacity: markingComplete ? 0.7 : 1 }}
										>
											{markingComplete ? "Processing..." : "✅ Mark Admission Complete"}
										</button>
										<p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: T.textMuted }}>
											This will update the booking admission status and log the action.
										</p>
									</div>
								)}

								{admissionMarked && (
									<div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: T.validBg, border: `1px solid ${T.validBorder}`, textAlign: "center" }}>
										<div style={{ fontSize: 20, marginBottom: 4 }}>🎉</div>
										<div style={{ fontSize: 14, fontWeight: 700, color: T.validText }}>Admission Completed</div>
										<div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Booking status updated successfully.</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			{/* FOOTER */}
			<footer style={{ padding: "20px", textAlign: "center", borderTop: `1px solid ${T.divider}`, marginTop: "auto" }}>
				<p style={{ fontSize: 11, color: T.textMuted }}>© Srilal CSC Admin Portal. Secure verification system.</p>
			</footer>
		</div>
	);
}

// Helper component for detail rows
function DetailRow({ label, value, highlight, mono, status, T }: { label: string; value: string; highlight?: boolean; mono?: boolean; status?: boolean; T: typeof THEMES.light }) {
	const statusColor = status
		? value === "paid" || value === "admitted"
			? T.validText
			: value === "pending"
				? "#d97706"
				: T.invalidText
		: undefined;

	return (
		<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
			<span style={{ fontSize: 12, color: T.textSecondary, fontWeight: 500 }}>{label}</span>
			<span
				style={{
					fontSize: 13,
					color: statusColor ? statusColor : highlight ? T.accent : T.textPrimary,
					fontWeight: highlight ? 700 : 600,
					fontFamily: mono ? "'JetBrains Mono',monospace" : "'DM Sans',sans-serif",
					textAlign: "right",
					wordBreak: "break-word",
					maxWidth: "60%",
				}}
			>
				{value}
			</span>
		</div>
	);
}