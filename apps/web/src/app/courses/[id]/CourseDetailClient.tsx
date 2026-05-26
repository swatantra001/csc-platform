"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createCourseBookingAction, verifyCoursePaymentAction, getUserBookingStatusAction } from "@/app/actions/courses";
import Script from "next/script";

export interface DbCourse {
  id: string;
  title: string;
  title_hi: string;
  short_desc: string;
  full_desc: string;
  full_desc_hi: string;
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
  syllabus: Array<{ topic: string; topic_hi: string; hours: number }>;
  eligibility: string;
  eligibility_hi: string;
  certification: string;
  certification_hi: string;
  tags: string[];
  is_published: boolean;
}

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
    divider: "#e2e8f0", inputBg: "#f8fafc", inputBorder: "#e2e8f0",
    btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff",
    btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569",
    btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)", btnSuccessText: "#ffffff",
    btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626",
    modalOverlay: "rgba(15,23,42,0.55)", modalBg: "#ffffff", modalBorder: "#e2e8f0",
    toggleIcon: "🌙", toggleLabel: "Dark",
	sectionGrad: "linear-gradient(135deg,#1d4ed8,#2563eb)", sectionGradText: "#fff",
  },
  dark: {
    pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b",
    navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff",
    navBrand: "#ffffff", navBrandAccent: "#f59e0b",
    cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
    textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)",
    accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)",
    divider: "rgba(255,255,255,0.06)", inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)",
    btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000",
    btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)",
    btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)", btnSuccessText: "#ffffff",
    btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171",
    modalOverlay: "rgba(0,0,0,0.85)", modalBg: "#0f172a", modalBorder: "rgba(255,255,255,0.1)",
    toggleIcon: "☀️", toggleLabel: "Light",
	sectionGrad: "linear-gradient(135deg,#7c3aed,#4c1d95)", sectionGradText: "#fff",
  },
} as const;

const NAV_LINKS = [
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/courses" : "http://localhost:3000/courses", icon: "🎓", label: "Courses" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
];

function buildCss(T: typeof THEMES.light, isDark: boolean): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.divider};border-radius:4px;}
.serif{font-family:'DM Serif Display',serif;}
.hi{font-family:'Noto Sans Devanagari',sans-serif;}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}
.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad || "linear-gradient(135deg,#1d4ed8,#2563eb)"};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText || "#fff"};text-transform:uppercase;letter-spacing:.07em;}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'DM Sans',sans-serif;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover{filter:brightness(1.08);transform:translateY(-1px);}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{border-color:${T.accentBorder};color:${T.accent};}
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.syllabus-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;background:${isDark ? "rgba(255,255,255,0.03)" : T.accentLight};border:1px solid ${isDark ? "rgba(255,255,255,0.08)" : T.accentBorder};margin-bottom:6px;}
.syllabus-hours{margin-left:auto;font-size:11px;color:${T.textMuted};font-weight:600;background:${isDark ? "rgba(255,255,255,0.08)" : "#fff"};padding:2px 8px;border-radius:10px;}
.fee-card{border:1.5px solid ${T.accentBorder};border-radius:10px;padding:14px;text-align:center;background:${T.accentLight};}
.fee-amount{font-size:1.6rem;font-weight:800;color:${T.accent};font-family:'DM Serif Display',serif;display:block;}
.fee-label{font-size:.7rem;color:${T.textMuted};font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
.tooltip{position:relative;}
.tooltip:hover .tooltip-text{visibility:visible;opacity:1;}
.tooltip-text{visibility:hidden;opacity:0;position:absolute;bottom:120%;left:50%;transform:translateX(-50%);background:${isDark ? "#0f172a" : "#1e293b"};color:#fff;padding:10px 14px;border-radius:8px;font-size:12px;line-height:1.5;width:280px;box-shadow:0 8px 24px rgba(0,0,0,0.2);transition:opacity 0.2s;z-index:100;}
.tooltip-text::after{content:"";position:absolute;top:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:${isDark ? "#0f172a" : "#1e293b"} transparent transparent transparent;}
`;
}

function SecHdr({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="sec-hdr">
      <span style={{ fontSize: "1.05rem" }}>{icon}</span>
      <span className="sec-hdr-txt">{label}</span>
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "To Be Announced";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }); }
  catch { return d; }
}

export default function CourseDetailClient({ course }: { course: DbCourse }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const T = isDark ? THEMES.dark : THEMES.light;
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [user]);

  // Check booking status
  useEffect(() => {
    if (!isLoggedIn || !course.id) return;
    getUserBookingStatusAction(course.id).then(res => {
      if (res.booked && res.booking) {
        setIsBooked(true);
        setBookingCode(res.booking.booking_code);
        setQrUrl(res.booking.qr_code_url || "");
      }
    });
  }, [isLoggedIn, course.id]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const handlePrebook = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    setProcessing(true);
    try {
      const res = await createCourseBookingAction(course.id, course.prebook_amount);
      if (!res.success) {
        alert(res.error || "Failed to initiate booking");
        setProcessing(false);
        return;
      }

      // Load Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.order?.amount,
        currency: res.order?.currency,
        name: "Srilal CSC",
        description: `Pre-booking: ${course.title}`,
        order_id: res.order?.id,
        handler: async function (response: any) {
          const verifyRes = await verifyCoursePaymentAction(
            res.bookingId,
            course.id,
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          if (verifyRes.success) {
            setIsBooked(true);
            setBookingCode(verifyRes.bookingCode);
            setQrUrl(verifyRes.qrCodeUrl || "");
            setShowSuccessModal(true);
          } else {
            alert(verifyRes.error || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: isDark ? "#f59e0b" : "#2563eb" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const t = THEME_MAP[course.theme] || THEME_MAP.blue;
  const bgImage = course.banner_url ? `url(${course.banner_url})` : `linear-gradient(135deg,${t.dark} 0%,${t.primary} 60%,${t.accent}88 100%)`;
  const seatPercent = Math.round((course.filled_seats / course.max_seats) * 100);
  const seatsLeft = course.max_seats - course.filled_seats;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', 'Noto Sans Devanagari', sans-serif", transition: "background .25s, color .25s" }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any, isDark) }} />

      {/* HEADER */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em", fontFamily: "monospace" }}>TRAINING CENTER</div>
            </div>
          </a>
          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
          <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="top-nav-link">
                <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", background: T.inputBg, borderRadius: 8, overflow: "hidden", border: `1px solid ${T.inputBorder}` }}>
              <button className={`pill ${lang === "en" ? "on" : ""}`} onClick={() => setLang("en")} style={{ borderRadius: "8px 0 0 8px", border: "none" }}>EN</button>
              <button className={`pill ${lang === "hi" ? "on" : ""}`} onClick={() => setLang("hi")} style={{ borderRadius: "0 8px 8px 0", border: "none" }}>हिं</button>
            </div>
            <button className="tog" onClick={toggleTheme}>
              <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
            </button>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{ background: T.cardBg, borderBottom: `1px solid ${T.divider}`, padding: "10px 0", fontSize: 12, color: T.textMuted }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <a href="/" style={{ color: T.accent, textDecoration: "none", fontWeight: 600 }}>Home</a>
          <span>›</span>
          <a href="/courses" style={{ color: T.accent, textDecoration: "none", fontWeight: 600 }}>Courses</a>
          <span>›</span>
          <span style={{ color: T.textPrimary }}>{lang === "en" ? course.title : course.title_hi}</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: bgImage, padding: "32px 0 0", position: "relative", overflow: "hidden", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.4) 100%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, backdropFilter: "blur(4px)" }}>
            🔴 <span>Live</span> · {course.category}
          </div>
          <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(1.4rem, 4vw, 2.1rem)", lineHeight: 1.25, marginBottom: 6 }}>
            {lang === "en" ? course.title : course.title_hi}
          </h1>
          <p className="hi" style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", marginBottom: 16 }}>
            {course.duration}{course.duration_hi ? ` (${course.duration_hi})` : ""}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {[
              ["⏱️", `Duration: ${course.duration}`],
              ["💰", `Fee: ₹${course.fee.toLocaleString("en-IN")}`],
              ["🎓", `Pre-book: ₹${course.prebook_amount}`],
              seatsLeft <= 3 ? ["🔥", `Only ${seatsLeft} seats left!`] : ["👥", `${seatsLeft} seats available`],
            ].map(([ic, txt], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: 12, padding: "5px 12px", borderRadius: 8, fontWeight: 500 }}>
                {ic} <span style={{ color: "#fff", fontWeight: 700 }}>{txt}</span>
              </div>
            ))}
          </div>
          {course.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {course.tags.map(tag => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.4px", backdropFilter: "blur(4px)" }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 4 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 4 }}>
            {[
              [course.fee.toLocaleString("en-IN"), "Total Fee (₹)"],
              [course.prebook_amount.toString(), "Pre-Book (₹)"],
              [course.duration, "Duration"],
              [course.max_seats.toString(), "Total Seats"],
              [course.filled_seats.toString(), "Booked"],
              [formatDate(course.start_date).replace(/,/g, ""), "Starts"],
            ].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "center", padding: "8px 4px" }}>
                <span className="serif" style={{ display: "block", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{val}</span>
                <span style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 2, fontWeight: 600 }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY CTA BAR */}
      <div style={{ background: T.cardBg, borderBottom: `2px solid ${T.accentLight}`, padding: "10px 0", position: "sticky", top: 0, zIndex: 100, boxShadow: T.cardShadow }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.textPrimary, flex: 1, minWidth: 180 }}>
            <span style={{ color: T.accent }}>{course.title.length > 40 ? course.title.substring(0, 40) + "…" : course.title}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {isBooked ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 8, fontSize: 13, color: T.accent, fontWeight: 700 }}>
                  <span>✅</span> Seat Pre-Booked
                </div>
                <a href="#booking-details" className="btn btn-p" style={{ textDecoration: "none", fontSize: 13 }}>
                  📍 Visit Center
                </a>
              </>
            ) : seatsLeft <= 0 ? (
              <button disabled className="btn btn-g" style={{ opacity: 0.5, cursor: "not-allowed", fontSize: 13 }}>
                ❌ Seats Full
              </button>
            ) : (
              <div className="tooltip">
                <button onClick={handlePrebook} disabled={processing} className="btn btn-p" style={{ fontSize: 13, position: "relative" }}>
                  {processing ? <span style={{ width: 14, height: 14, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> : "🎟️"}
                  {processing ? " Processing..." : " Pre-Book Seat"}
                </button>
                <div className="tooltip-text">
                  <strong>₹{course.prebook_amount} non-refundable</strong> initial charge for booking your seat at the center. After payment, you'll receive an email with a QR code and booking code. Bring this to the center for physical admission. Remaining fee (₹{course.fee - course.prebook_amount}) payable at center.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAGE BODY */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 40px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start", flex: 1 }}>
        <main>

          {/* DESCRIPTION */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, borderLeft: `3px solid ${T.accent}`, paddingLeft: 12, margin: 0 }}>
                {lang === "en" ? course.full_desc || course.short_desc : course.full_desc_hi || course.short_desc}
              </p>
            </div>
          </div>

          {/* ELIGIBILITY & CERTIFICATION */}
          <div className="card" style={{ marginBottom: 16 }}>
            <SecHdr icon="📋" label="Eligibility & Certification" />
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ padding: 14, borderRadius: 10, border: `1.5px solid ${T.accentBorder}`, background: T.accentLight }}>
                  <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 6 }}>Eligibility</div>
                  <div style={{ fontSize: 14, color: T.textPrimary, fontWeight: 600, lineHeight: 1.5 }}>
                    {lang === "en" ? course.eligibility || "Not specified" : course.eligibility_hi || course.eligibility || "Not specified"}
                  </div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, border: `1.5px solid ${T.accentBorder}`, background: T.accentLight }}>
                  <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 6 }}>Certification</div>
                  <div style={{ fontSize: 14, color: T.textPrimary, fontWeight: 600, lineHeight: 1.5 }}>
                    {lang === "en" ? course.certification || "Course Completion Certificate" : course.certification_hi || course.certification || "पाठ्यक्रम पूर्णता प्रमाण पत्र"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SYLLABUS */}
          {course.syllabus?.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <SecHdr icon="📚" label="Course Syllabus" />
              <div style={{ padding: "20px 24px" }}>
                {course.syllabus.map((item, i) => (
                  <div key={i} className="syllabus-item">
                    <span style={{ color: T.accent, fontWeight: 700, fontSize: 12, minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{item.topic}</div>
                      {item.topic_hi && <div className="hi" style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{item.topic_hi}</div>}
                    </div>
                    {item.hours > 0 && <span className="syllabus-hours">{item.hours} hrs</span>}
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: "10px 14px", background: isDark ? "rgba(255,255,255,0.03)" : T.accentLight, borderRadius: 8, border: `1px solid ${T.accentBorder}`, textAlign: "center" }}>
                  <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
                    Total: {course.syllabus.reduce((s, item) => s + (item.hours || 0), 0)} hours of training
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SEAT AVAILABILITY */}
          <div className="card" style={{ marginBottom: 16 }}>
            <SecHdr icon="👥" label="Seat Availability" />
            <div style={{ padding: "20px 24px" }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>
                  <span>{course.filled_seats} booked</span>
                  <span>{course.max_seats} total</span>
                </div>
                <div style={{ background: T.inputBg, borderRadius: 8, height: 12, overflow: "hidden" }}>
                  <div style={{
                    width: `${seatPercent}%`,
                    height: "100%",
                    background: seatPercent >= 90 ? "#dc2626" : seatPercent >= 70 ? "#f59e0b" : `linear-gradient(90deg, ${t.primary}, ${t.accent})`,
                    borderRadius: 8,
                    transition: "width 0.5s ease"
                  }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div className="fee-card">
                  <span className="fee-amount" style={{ fontSize: "1.3rem" }}>{course.max_seats}</span>
                  <span className="fee-label">Total Seats</span>
                </div>
                <div className="fee-card">
                  <span className="fee-amount" style={{ fontSize: "1.3rem", color: T.accent }}>{course.filled_seats}</span>
                  <span className="fee-label">Booked</span>
                </div>
                <div className="fee-card" style={{ borderColor: seatsLeft <= 3 ? "#fecaca" : T.accentBorder, background: seatsLeft <= 3 ? "#fef2f2" : T.accentLight }}>
                  <span className="fee-amount" style={{ fontSize: "1.3rem", color: seatsLeft <= 3 ? "#dc2626" : T.accent }}>{seatsLeft}</span>
                  <span className="fee-label">Available</span>
                </div>
              </div>
              {seatsLeft <= 3 && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 12, color: "#dc2626", fontWeight: 600, textAlign: "center" }}>
                  ⚠️ Hurry! Only {seatsLeft} seat{seatsLeft > 1 ? "s" : ""} remaining. Book now to secure your spot.
                </div>
              )}
            </div>
          </div>

          {/* DISCLAIMER */}
          <div style={{ padding: "14px 18px", background: isDark ? "rgba(245,158,11,0.08)" : "#fef9c3", border: `1px solid ${isDark ? "rgba(245,158,11,0.2)" : "#fde68a"}`, borderRadius: 10, fontSize: 12, color: isDark ? "#fbbf24" : "#78350f", lineHeight: 1.6, marginBottom: 16 }}>
            <strong>⚠️ Disclaimer:</strong> The pre-booking amount of ₹{course.prebook_amount} is <strong>non-refundable</strong>. This amount is adjusted against your total course fee of ₹{course.fee}. You must visit the center within 7 days of booking with your QR code and original documents to complete admission. Srilal CSC reserves the right to cancel bookings if documents are not verified in time.
          </div>

        </main>

        {/* SIDEBAR */}
        <aside style={{ position: "sticky", top: 70 }}>

          {/* FEE BREAKDOWN */}
          <div className="card" style={{ marginBottom: 14 }}>
            <SecHdr icon="💰" label="Fee Breakdown" />
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.divider}` }}>
                  <span style={{ fontSize: 13, color: T.textSecondary }}>Total Course Fee</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary }}>₹{course.fee.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.divider}` }}>
                  <span style={{ fontSize: 13, color: T.textSecondary }}>Pre-Booking (Now)</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.accent }}>₹{course.prebook_amount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
                  <span style={{ fontSize: 13, color: T.textSecondary }}>Balance at Center</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary }}>₹{(course.fee - course.prebook_amount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING ACTION */}
          <div className="card" style={{ marginBottom: 14 }}>
            <SecHdr icon="🎟️" label={isBooked ? "Your Booking" : "Pre-Book Now"} />
            <div style={{ padding: 16 }}>
              {isBooked ? (
                <div id="booking-details">
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 8 }}>Booking Code</div>
                    <div style={{ fontSize: 1.8, fontWeight: 800, color: T.accent, fontFamily: "monospace", letterSpacing: 2, padding: "10px 16px", background: T.accentLight, borderRadius: 8, border: `2px dashed ${T.accentBorder}` }}>
                      {bookingCode}
                    </div>
                  </div>
                  {qrUrl && (
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <img src={qrUrl} alt="Booking QR" style={{ width: 180, height: 180, borderRadius: 12, border: `2px solid ${T.accentBorder}` }} />
                      <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>Show this QR at the center</p>
                    </div>
                  )}
                  <div style={{ padding: 12, background: T.accentLight, borderRadius: 8, border: `1px solid ${T.accentBorder}`, fontSize: 12, color: T.accent, lineHeight: 1.6 }}>
                    <strong>✅ Next Steps:</strong><br />
                    1. Visit Srilal CSC, Shambhuganj<br />
                    2. Bring this QR code & Aadhaar<br />
                    3. Pay balance ₹{(course.fee - course.prebook_amount).toLocaleString("en-IN")}<br />
                    4. Complete physical admission
                  </div>
                  <a href="https://maps.google.com/?q=Shambhuganj,Jaunpur" target="_blank" rel="noopener noreferrer" className="btn btn-p" style={{ width: "100%", justifyContent: "center", marginTop: 12, textDecoration: "none" }}>
                    📍 Get Directions
                  </a>
                </div>
              ) : seatsLeft <= 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>😔</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>All Seats Booked</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>Check back later or browse other courses</div>
                </div>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 4 }}>Pre-Booking Amount</div>
                    <div className="serif" style={{ fontSize: "2.5rem", fontWeight: 700, color: T.accent }}>₹{course.prebook_amount}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Non-refundable • Adjusts against total fee</div>
                  </div>
                  <div className="tooltip" style={{ width: "100%" }}>
                    <button onClick={handlePrebook} disabled={processing} className="btn btn-p" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>
                      {processing ? <span style={{ width: 16, height: 16, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> : "🎟️"}
                      {processing ? " Processing..." : " Pre-Book My Seat"}
                    </button>
                    <div className="tooltip-text" style={{ width: 260 }}>
                      <strong>₹{course.prebook_amount} non-refundable</strong> charge to reserve your seat. You'll receive an email with QR code after payment. Bring it to center for admission.
                    </div>
                  </div>
                  <div style={{ marginTop: 10, padding: "10px 12px", background: T.inputBg, borderRadius: 8, fontSize: 11, color: T.textMuted, lineHeight: 1.5, textAlign: "center" }}>
                    Balance <strong>₹{(course.fee - course.prebook_amount).toLocaleString("en-IN")}</strong> payable at center during admission
                  </div>
                </>
              )}
            </div>
          </div>

          {/* QUICK INFO */}
          <div className="card" style={{ marginBottom: 14 }}>
            <SecHdr icon="ℹ️" label="Quick Info" />
            <div style={{ padding: 16 }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Category", course.category],
                    ["Duration", course.duration],
                    ["Total Fee", `₹${course.fee.toLocaleString("en-IN")}`],
                    ["Start Date", formatDate(course.start_date)],
                    ["Seats", `${course.filled_seats}/${course.max_seats} booked`],
                    ["Certification", course.certification || "Certificate Provided"],
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: `1px solid ${T.divider}` }}>
                      <td style={{ padding: "8px 0", color: T.textMuted, fontWeight: 600, fontSize: 12 }}>{label}</td>
                      <td style={{ padding: "8px 0", color: T.textPrimary, fontWeight: 700, textAlign: "right", fontSize: 12 }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </aside>
      </div>

      {/* FOOTER */}
      <div style={{ background: T.navBg, padding: "18px 0", marginTop: 10, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
        <p>© 2026 Srilal CSC · NSQF Certified Training Center · Shambhuganj, Jaunpur, UP</p>
      </div>

      {/* LOGIN PROMPT MODAL */}
      {showLoginPrompt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: T.modalOverlay, backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 16, width: "100%", maxWidth: 400, padding: 32, textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>Login Required</h3>
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
              Please login to pre-book your seat. We need your email to send the booking confirmation and QR code.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowLoginPrompt(false)} className="btn btn-g" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
              <a href="/login?redirect=/courses/${course.id}" className="btn btn-p" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>Login Now</a>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: T.modalOverlay, backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 16, width: "100%", maxWidth: 420, padding: 32, textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>Seat Pre-Booked!</h3>
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>
              Your booking code <strong style={{ color: T.accent }}>{bookingCode}</strong> has been sent to your email with the QR code.
            </p>
            {qrUrl && (
              <div style={{ marginBottom: 16 }}>
                <img src={qrUrl} alt="QR Code" style={{ width: 160, height: 160, borderRadius: 12, border: `2px solid ${T.accentBorder}` }} />
              </div>
            )}
            <div style={{ padding: 12, background: T.accentLight, borderRadius: 8, border: `1px solid ${T.accentBorder}`, fontSize: 12, color: T.accent, lineHeight: 1.6, marginBottom: 16, textAlign: "left" }}>
              <strong>📍 Next Steps:</strong><br />
              1. Check your email for QR code<br />
              2. Visit Srilal CSC, Shambhuganj within 7 days<br />
              3. Bring Aadhaar & pay balance ₹{(course.fee - course.prebook_amount).toLocaleString("en-IN")}
            </div>
            <button onClick={() => setShowSuccessModal(false)} className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>
              Got it! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}