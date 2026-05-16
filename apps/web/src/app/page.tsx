// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/components/AuthProvider"; // ADD THIS IMPORT

// // ─── Language strings ───────────────────────────────────────────────────────
// const T = {
//   hi: {
//     shopName: "श्रीलाल जन सेवा केंद्र",
//     shopSub: "Common Service Centre",
//     location: "शंभूगंज, जौनपुर — उत्तर प्रदेश",
//     blockOp: "ब्लॉक स्तरीय ऑपरेटर",
//     navServices: "सेवाएं",
//     navSchemes: "योजनाएं",
//     navTrack: "स्थिति जानें",
//     navContact: "संपर्क",
//     loginBtn: "लॉगिन करें",
//     heroTag: "सरकारी प्रमाणित केंद्र",
//     heroH1a: "आपकी सेवा में,",
//     heroH1b: "हमेशा तैयार।",
//     heroSub: "आधार, पैन, टिकट, पैसे ट्रांसफर — सभी सेवाएं एक छत के नीचे। अभी अपनी जरूरत बताएं।",
//     heroCTA: "अभी आवेदन करें",
//     heroTrack: "स्थिति ट्रैक करें",
//     servicesTitle: "हमारी सेवाएं",
//     servicesSub: "30+ सरकारी और वित्तीय सेवाएं उपलब्ध",
//     schemesTitle: "नई सरकारी योजनाएं",
//     schemesSub: "ताज़ा अपडेट और फॉर्म भरने की सुविधा",
//     trackTitle: "अपनी आवेदन की स्थिति जानें",
//     trackSub: "मोबाइल नंबर या आवेदन ID दर्ज करें",
//     trackPh: "मोबाइल नंबर / आवेदन ID",
//     trackBtn: "खोजें",
//     statsTitle: "हमारा अनुभव",
//     stat1: "ग्राहक",
//     stat2: "सेवाएं",
//     stat3: "जिले में रैंक",
//     stat4: "वर्षों से",
//     contactTitle: "संपर्क करें",
//     hours: "सोम–शनि: सुबह 9 बजे – शाम 9 बजे",
//     footer: "© 2026 श्रीलाल जन सेवा केंद्र, शंभूगंज| सभी अधिकार सुरक्षित।",
//     tickerLabel: "नोटिस:",
//     readMore: "विस्तार से पढ़ें →",
//     price: "शुल्क:",
//     new: "नया",
//     urgent: "जरूरी",
//   },
//   en: {
//     shopName: "Shreelal Jan Seva Kendra",
//     shopSub: "Common Service Centre",
//     location: "Shambhuganj, Jaunpur — Uttar Pradesh",
//     blockOp: "Block Level Operator",
//     navServices: "Services",
//     navSchemes: "Schemes",
//     navTrack: "Track Status",
//     navContact: "Contact",
//     loginBtn: "Login",
//     heroTag: "Government Certified Centre",
//     heroH1a: "At your service,",
//     heroH1b: "always ready.",
//     heroSub: "Aadhaar, PAN, tickets, money transfer — all services under one roof. Tell us what you need.",
//     heroCTA: "Apply Now",
//     heroTrack: "Track Status",
//     servicesTitle: "Our Services",
//     servicesSub: "30+ government & financial services available",
//     schemesTitle: "New Government Schemes",
//     schemesSub: "Latest updates and form filling assistance",
//     trackTitle: "Check Your Application Status",
//     trackSub: "Enter your mobile number or application ID",
//     trackPh: "Mobile Number / Application ID",
//     trackBtn: "Search",
//     statsTitle: "Our Track Record",
//     stat1: "Customers",
//     stat2: "Services",
//     stat3: "District Rank",
//     stat4: "Years Active",
//     contactTitle: "Contact Us",
//     hours: "Mon–Sat: 9 AM – 9 PM",
//     footer: "© 2026 Shreelal Jan Seva Kendra, Shambhuganj. All rights reserved.",
//     tickerLabel: "Notice:",
//     readMore: "Read more →",
//     price: "Fee:",
//     new: "New",
//     urgent: "Urgent",
//   },
// };

// const TICKER_ITEMS = [
//   "आधार अपडेट के लिए अब ऑनलाइन अपॉइंटमेंट उपलब्ध है",
//   "PM किसान सम्मान निधि — नया रजिस्ट्रेशन शुरू",
//   "जाति प्रमाण पत्र के लिए नया पोर्टल लॉन्च हुआ",
//   "Ayushman Bharat — नए कार्ड के लिए संपर्क करें",
//   "UP Scholarship Form 2026 — अंतिम तिथि 30 नवम्बर",
// ];

// const SERVICES = [
//   { icon: "🪪", hi: "आधार सेवाएं", en: "Aadhaar Services", price: "₹50–₹100", tag: null },
//   { icon: "🪙", hi: "पैन कार्ड", en: "PAN Card", price: "₹107", tag: null },
//   { icon: "🚂", hi: "रेल/बस टिकट", en: "Rail / Bus Ticket", price: "₹30", tag: null },
//   { icon: "💸", hi: "पैसे ट्रांसफर", en: "Money Transfer", price: "₹10/₹1000", tag: null },
//   { icon: "📋", hi: "जाति प्रमाण पत्र", en: "Caste Certificate", price: "₹50", tag: "new" },
//   { icon: "🏥", hi: "आयुष्मान कार्ड", en: "Ayushman Card", price: "नि:शुल्क", tag: "new" },
//   { icon: "🎓", hi: "छात्रवृत्ति फॉर्म", en: "Scholarship Form", price: "₹30", tag: "urgent" },
//   { icon: "🌾", hi: "PM किसान", en: "PM Kisan", price: "नि:शुल्क", tag: null },
//   { icon: "📄", hi: "पासपोर्ट सहायता", en: "Passport Help", price: "₹200", tag: null },
//   { icon: "🏦", hi: "बैंक खाता खोलें", en: "Open Bank Account", price: "नि:शुल्क", tag: null },
//   { icon: "📱", hi: "मोबाइल रिचार्ज", en: "Mobile Recharge", price: "₹10", tag: null },
//   { icon: "💡", hi: "बिजली बिल", en: "Electricity Bill", price: "₹15", tag: null },
// ];

// const SCHEMES = [
//   {
//     tag: "urgent",
//     hi_title: "UP छात्रवृत्ति 2026",
//     en_title: "UP Scholarship 2026",
//     hi_desc: "कक्षा 9 से स्नातक तक के छात्रों के लिए। अंतिम तिथि: 30 नवम्बर 2026।",
//     en_desc: "For students from Class 9 to Graduation. Last date: 30 Nov 2026.",
//     price: "₹30",
//     theme: "amber",
//   },
//   {
//     tag: "new",
//     hi_title: "PM Vishwakarma Yojana",
//     en_title: "PM Vishwakarma Yojana",
//     hi_desc: "कारीगरों और शिल्पकारों के लिए ₹3 लाख तक का ऋण और प्रशिक्षण।",
//     en_desc: "Loan up to ₹3 lakh and training for artisans and craftspeople.",
//     price: "नि:शुल्क",
//     theme: "green",
//   },
//   {
//     tag: null,
//     hi_title: "Ayushman Bharat — नया पंजीकरण",
//     en_title: "Ayushman Bharat — New Registration",
//     hi_desc: "₹5 लाख तक का मुफ्त इलाज। पात्रता जांचें और कार्ड बनवाएं।",
//     en_desc: "Free treatment up to ₹5 lakh. Check eligibility and get your card.",
//     price: "नि:शुल्क",
//     theme: "blue",
//   },
// ];

// // ─── Helper components ───────────────────────────────────────────────────────
// function TagBadge({ tag, lang }: { tag: string, lang: string }) {
//   if (!tag) return null;
//   const colors = {
//     new: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
//     urgent: { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" },
//   };
//   const c = colors[tag as "new" | "urgent"] as { bg: string, color: string, border: string };
//   const label = tag === "new" ? (lang === "hi" ? "नया" : "New") : (lang === "hi" ? "जरूरी" : "Urgent");
//   return (
//     <span style={{
//       fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
//       textTransform: "uppercase", background: c.bg, color: c.color,
//       border: `1px solid ${c.border}`, borderRadius: 4,
//       padding: "2px 7px", display: "inline-block",
//     }}>{label}</span>
//   );
// }

// // ─── Main component ──────────────────────────────────────────────────────────
// export default function CSCLanding() {
//   const [lang, setLang] = useState("en");
//   const [dark, setDark] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [tickerIdx, setTickerIdx] = useState(0);
//   const [trackVal, setTrackVal] = useState("");
//   const [loginOpen, setLoginOpen] = useState(false);
//   const [loginStep, setLoginStep] = useState("number"); // number | otp | password
//   const [loginMobile, setLoginMobile] = useState("");
//   const [loginOtp, setLoginOtp] = useState(["", "", "", "", "", ""]);
//   const [loginPass, setLoginPass] = useState("");
//   const [loginMode, setLoginMode] = useState("otp"); // otp | password
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [otpSent, setOtpSent] = useState(false);
//   const otpRefs = [
//     useRef<HTMLInputElement | null>(null),
//     useRef<HTMLInputElement | null>(null),
//     useRef<HTMLInputElement | null>(null),
//     useRef<HTMLInputElement | null>(null),
//     useRef<HTMLInputElement | null>(null),
//     useRef<HTMLInputElement | null>(null),
//   ];
//   const t = T[lang as "en" | "hi"] as typeof T["en"];

//   // 1. ADD THIS LINE: Pull openLogin (and user/logout if you want) from your provider
//   const { openLogin, isLoggedIn, logout, user } = useAuth();

//   // Dark mode from system
//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-color-scheme: dark)");
//     setDark(mq.matches);
//     mq.addEventListener("change", (e) => setDark(e.matches));
//   }, []);

//   // Ticker rotation
//   useEffect(() => {
//     const id = setInterval(() => setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length), 5000);
//     return () => clearInterval(id);
//   }, []);

//   // OTP countdown
//   useEffect(() => {
//     if (otpTimer <= 0) return;
//     const id = setInterval(() => setOtpTimer((t) => t - 1), 1000);
//     return () => clearInterval(id);
//   }, [otpTimer]);

//   const bg = dark ? "#0f0f0f" : "#fafaf7";
//   const surface = dark ? "#1a1a1a" : "#ffffff";
//   const surface2 = dark ? "#222222" : "#f4f2ed";
//   const border = dark ? "#2e2e2e" : "#e2ddd5";
//   const text = dark ? "#f0ede6" : "#1a1612";
//   const textMid = dark ? "#a09a90" : "#6b6259";
//   const textLight = dark ? "#6b6259" : "#a09a90";
//   const accent = "#c45c1a";     // saffron-burnt orange
//   const accentDark = "#a34a12";
//   const navy = "#1a3a5c";
//   const navyLight = dark ? "#2a5a8c" : "#1a3a5c";

//   const sendOtp = () => {
//     if (loginMobile.length !== 10) return;
//     setOtpSent(true);
//     setLoginStep("otp");
//     setOtpTimer(30);
//     setTimeout(() => otpRefs[0]?.current?.focus(), 100);
//   };

//   const handleOtpKey = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value.replace(/\D/g, "").slice(-1);
//     const next = [...loginOtp];
//     next[i] = val;
//     setLoginOtp(next);
//     if (val && i < 5) otpRefs[i + 1]?.current?.focus();
//     if (!val && i > 0 && (e.nativeEvent as InputEvent).inputType === "deleteContentBackward") {
//       otpRefs[i - 1]?.current?.focus();
//     }
//   };

//   const themeColors = { amber: { bg: dark ? "#2a1f08" : "#fffbf0", border: dark ? "#5c3d0a" : "#f0d090", accent: "#b07a10" }, green: { bg: dark ? "#0a1f0f" : "#f0fbf4", border: dark ? "#1a5c30" : "#90d0a0", accent: "#1a7a3a" }, blue: { bg: dark ? "#080f1f" : "#f0f5ff", border: dark ? "#0a2a5c" : "#90b0e0", accent: "#1a4a9c" } };

//   return (
//     <div style={{ background: bg, color: text, minHeight: "100vh", fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif", transition: "background 0.3s, color 0.3s" }}>

//       {/* Google Fonts */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         .csc-btn-primary {
//           background: ${accent}; color: #fff; border: none; border-radius: 6px;
//           padding: 11px 24px; font-size: 14px; font-weight: 600; cursor: pointer;
//           transition: background 0.2s, transform 0.1s; display: inline-flex; align-items: center; gap: 8px;
//         }
//         .csc-btn-primary:hover { background: ${accentDark}; transform: translateY(-1px); }
//         .csc-btn-primary:active { transform: translateY(0); }

//         .csc-btn-ghost {
//           background: transparent; color: ${text}; border: 1.5px solid ${border};
//           border-radius: 6px; padding: 10px 22px; font-size: 14px; font-weight: 500; cursor: pointer;
//           transition: border-color 0.2s, background 0.2s;
//         }
//         .csc-btn-ghost:hover { border-color: ${accent}; color: ${accent}; }

//         .csc-nav-link {
//           font-size: 14px; color: ${textMid}; text-decoration: none; padding: 6px 0;
//           border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s;
//           font-weight: 500;
//         }
//         .csc-nav-link:hover { color: ${accent}; border-bottom-color: ${accent}; }

//         .service-card {
//           background: ${surface}; border: 1px solid ${border}; border-radius: 10px;
//           padding: 18px 16px; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
//           display: flex; flex-direction: column; gap: 8px;
//         }
//         .service-card:hover {
//           transform: translateY(-3px); border-color: ${accent};
//           box-shadow: 0 6px 24px rgba(196,92,26,0.12);
//         }

//         .scheme-card {
//           border-radius: 12px; padding: 20px; cursor: pointer;
//           transition: transform 0.18s, box-shadow 0.18s;
//           border: 1px solid;
//         }
//         .scheme-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.08); }

//         .otp-box {
//           width: 44px; height: 52px; border: 1.5px solid ${border}; border-radius: 8px;
//           background: ${surface2}; color: ${text}; font-size: 20px; font-weight: 700;
//           text-align: center; outline: none; transition: border-color 0.2s;
//         }
//         .otp-box:focus { border-color: ${accent}; }

//         .csc-input {
//           width: 100%; padding: 11px 14px; border: 1.5px solid ${border}; border-radius: 8px;
//           background: ${surface2}; color: ${text}; font-size: 14px; outline: none;
//           transition: border-color 0.2s; font-family: inherit;
//         }
//         .csc-input:focus { border-color: ${accent}; }
//         .csc-input::placeholder { color: ${textLight}; }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .fade-up { animation: fadeUp 0.55s ease both; }
//         .fade-up-d1 { animation-delay: 0.1s; }
//         .fade-up-d2 { animation-delay: 0.22s; }
//         .fade-up-d3 { animation-delay: 0.34s; }
//         .fade-up-d4 { animation-delay: 0.46s; }

//         @keyframes ticker-in {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .ticker-text { animation: ticker-in 0.4s ease both; }

//         @keyframes shimmer {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }

//         .modal-backdrop {
//           position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 999;
//           display: flex; align-items: center; justify-content: center; padding: 16px;
//         }
//         .modal-box {
//           background: ${surface}; border: 1px solid ${border}; border-radius: 16px;
//           width: 100%; max-width: 380px; padding: 32px 28px; position: relative;
//           animation: fadeUp 0.3s ease;
//         }

//         .stat-num {
//           font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700;
//           color: ${accent}; line-height: 1;
//         }

//         .whatsapp-pill {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: #25d366; color: #fff; border-radius: 99px;
//           padding: 8px 18px; font-size: 13px; font-weight: 600; cursor: pointer;
//           border: none; transition: background 0.2s;
//         }
//         .whatsapp-pill:hover { background: #1da851; }

//         .divider-line {
//           height: 1px; background: ${border}; margin: 0;
//         }

//         /* Decorative corner marks — hand-drawn feel */
//         .corner-mark::before, .corner-mark::after {
//           content: ''; position: absolute; width: 16px; height: 16px;
//         }
//         .corner-mark::before { top: -1px; left: -1px; border-top: 2px solid ${accent}; border-left: 2px solid ${accent}; border-radius: 2px 0 0 0; }
//         .corner-mark::after { bottom: -1px; right: -1px; border-bottom: 2px solid ${accent}; border-right: 2px solid ${accent}; border-radius: 0 0 2px 0; }
//       `}</style>

//       {/* ── TICKER BAR ── */}
//       <div style={{ background: navy, color: "#fff", padding: "7px 0", overflow: "hidden" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 12 }}>
//           <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: accent, color: "#fff", padding: "2px 10px", borderRadius: 4, flexShrink: 0 }}>{t.tickerLabel}</span>
//           <span key={tickerIdx} className="ticker-text" style={{ fontSize: 13, color: "#e8dfc8", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{TICKER_ITEMS[tickerIdx]}</span>
//           <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
//             {TICKER_ITEMS.map((_, i) => (
//               <div key={i} onClick={() => setTickerIdx(i)} style={{ width: 6, height: 6, borderRadius: "50%", background: i === tickerIdx ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "background 0.2s" }} />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── NAVBAR ── */}
//       <nav style={{ background: surface, borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 64, gap: 32 }}>

//           {/* Logo */}
//           <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, flex: 1 }}>
//             <span style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 20, fontWeight: 700, color: accent, letterSpacing: "-0.01em" }}>{t.shopName}</span>
//             <span style={{ fontSize: 10, color: textLight, fontWeight: 500, letterSpacing: "0.04em" }}>{t.location}</span>
//           </div>

//           {/* Desktop nav */}
//           <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
//             {[[t.navServices, '#'], [t.navSchemes, '#'], [t.navTrack, 'status'], [t.navContact, '#']].map(([label, href]) => (
//               <a key={label} href={href} className="csc-nav-link">
//                 {label}
//               </a>
//             ))}
//           </div>

//           {/* Right controls */}
//           <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//             {/* Lang toggle */}
//             <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={{ background: surface2, border: `1px solid ${border}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: textMid, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
//               {lang === "hi" ? "EN" : "हि"}
//             </button>
//             {/* Dark toggle */}
//             <button onClick={() => setDark(!dark)} style={{ background: surface2, border: `1px solid ${border}`, borderRadius: 20, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
//               {dark ? "☀️" : "🌙"}
//             </button>
//             {/* LOGIN / LOGOUT BUTTON */}
//             {isLoggedIn ? (
//               <button className="csc-btn-ghost" onClick={logout} style={{ padding: "9px 20px", fontSize: 13 }}>
//                 {lang === "hi" ? "लॉगआउट" : "Logout"} ({user?.name?.split(' ')[0] || "User"})
//               </button>
//             ) : (
//               <button className="csc-btn-primary" onClick={openLogin} style={{ padding: "9px 20px", fontSize: 13 }}>
//                 {t.loginBtn}
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* ── HERO ── */}
//       <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 20px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
//         <div className="fade-up">
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dark ? "#1a2a1a" : "#e8f5e8", border: `1px solid ${dark ? "#2a5a2a" : "#90c890"}`, borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
//             <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2a9a2a", display: "inline-block" }}></span>
//             <span style={{ fontSize: 12, color: dark ? "#70c870" : "#1a6a1a", fontWeight: 600 }}>{t.heroTag}</span>
//           </div>

//           <h1 style={{ fontFamily: "'Noto Serif Devanagari', 'Playfair Display', serif", fontSize: 48, fontWeight: 700, lineHeight: 1.2, marginBottom: 8, color: text, letterSpacing: "-0.02em" }}>
//             {t.heroH1a}
//           </h1>
//           <h1 style={{ fontFamily: "'Noto Serif Devanagari', 'Playfair Display', serif", fontSize: 48, fontWeight: 700, lineHeight: 1.2, marginBottom: 24, color: accent, letterSpacing: "-0.02em" }}>
//             {t.heroH1b}
//           </h1>

//           <p style={{ fontSize: 16, color: textMid, lineHeight: 1.8, marginBottom: 32, maxWidth: 440 }}>{t.heroSub}</p>

//           <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//             {isLoggedIn ? (
//               <button className="csc-btn-primary" onClick={() => window.location.href = '/dashboard'}>
//                 <span>📋</span> {lang === "hi" ? "डैशबोर्ड पर जाएं" : "Go to Dashboard"}
//               </button>
//             ) : (
//               <button className="csc-btn-primary" onClick={openLogin}>
//                 <span>📋</span> {t.heroCTA}
//               </button>
//             )}
//             <button  className="csc-btn-ghost" onClick={() => window.location.href = 'status'}>
//               {t.heroTrack} →
//             </button>
//           </div>

//           {/* Quick trust badges */}
//           <div style={{ display: "flex", gap: 20, marginTop: 36, flexWrap: "wrap" }}>
//             {[["🏛️", lang === "hi" ? "CSC प्रमाणित" : "CSC Certified"], ["🔒", lang === "hi" ? "100% सुरक्षित" : "100% Secure"], ["⚡", lang === "hi" ? "त्वरित सेवा" : "Fast Service"]].map(([ic, lb]) => (
//               <div key={lb} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: textMid }}>
//                 <span>{ic}</span><span style={{ fontWeight: 500 }}>{lb}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Hero right — operator card */}
//         <div className="fade-up fade-up-d2">
//           <div style={{ position: "relative", background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 32, overflow: "hidden" }} className="corner-mark">
//             {/* Decorative pattern background */}
//             <div style={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, opacity: 0.04, backgroundImage: `repeating-linear-gradient(45deg, ${accent} 0, ${accent} 1px, transparent 0, transparent 50%)`, backgroundSize: "12px 12px" }}></div>

//             <div style={{ position: "relative" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
//                 <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${navy})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>👨‍💼</div>
//                 <div>
//                   <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 18, fontWeight: 700, color: text }}>
//                     {lang === "hi" ? "श्रीलाल जी" : "Shreelal Ji"}
//                   </div>
//                   <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{t.blockOp}</div>
//                   <div style={{ fontSize: 12, color: textLight }}>{t.location}</div>
//                 </div>
//               </div>

//               <div style={{ height: 1, background: border, marginBottom: 20 }}></div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
//                 {[
//                   ["12,000+", lang === "hi" ? "ग्राहक" : "Customers"],
//                   ["30+", lang === "hi" ? "सेवाएं" : "Services"],
//                   ["#2", lang === "hi" ? "जिले में रैंक" : "District Rank"],
//                   ["8+", lang === "hi" ? "वर्षों का अनुभव" : "Years Active"],
//                 ].map(([num, label]) => (
//                   <div key={label} style={{ background: surface2, borderRadius: 10, padding: "12px 14px" }}>
//                     <div className="stat-num" style={{ fontSize: 24 }}>{num}</div>
//                     <div style={{ fontSize: 11, color: textMid, marginTop: 2 }}>{label}</div>
//                   </div>
//                 ))}
//               </div>

//               <button className="whatsapp-pill" style={{ width: "100%", justifyContent: "center" }}>
//                 <span>💬</span>
//                 {lang === "hi" ? "WhatsApp पर संपर्क करें" : "Contact on WhatsApp"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── SERVICES ── */}
//       <section style={{ background: surface2, padding: "56px 0", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
//           <div style={{ marginBottom: 32 }}>
//             <h2 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 30, fontWeight: 700, color: text, marginBottom: 6 }}>{t.servicesTitle}</h2>
//             <p style={{ color: textMid, fontSize: 14 }}>{t.servicesSub}</p>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
//             {SERVICES.map((s, i) => (
//               <div key={i} className="service-card">
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <span style={{ fontSize: 28 }}>{s.icon}</span>
//                   <TagBadge tag={s.tag as "new" | "urgent"} lang={lang} />
//                 </div>
//                 <div style={{ fontWeight: 600, fontSize: 14, color: text, lineHeight: 1.3 }}>{lang === "hi" ? s.hi : s.en}</div>
//                 <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{t.price} {s.price}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── SCHEMES / POSTS ── */}
//       <section style={{ padding: "56px 0" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
//           <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
//             <div>
//               <h2 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 30, fontWeight: 700, color: text, marginBottom: 6 }}>{t.schemesTitle}</h2>
//               <p style={{ color: textMid, fontSize: 14 }}>{t.schemesSub}</p>
//             </div>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
//             {SCHEMES.map((sc, i) => {
//               const th = themeColors[sc.theme as "amber" | "green" | "blue"];
//               return (
//                 <div key={i} className="scheme-card" style={{ background: th.bg, borderColor: th.border }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
//                     <TagBadge tag={sc.tag as "new" | "urgent"} lang={lang} />
//                     <span style={{ fontSize: 11, color: th.accent, fontWeight: 700 }}>{t.price} {sc.price}</span>
//                   </div>
//                   <h3 style={{ fontSize: 17, fontWeight: 700, color: dark ? "#f0ede6" : "#1a1612", marginBottom: 8, fontFamily: "'Noto Serif Devanagari', serif" }}>{lang === "hi" ? sc.hi_title : sc.en_title}</h3>
//                   <p style={{ fontSize: 13, color: textMid, lineHeight: 1.7, marginBottom: 16 }}>{lang === "hi" ? sc.hi_desc : sc.en_desc}</p>
//                   <button style={{ background: "none", border: "none", color: th.accent, fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>{t.readMore}</button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ── STATUS TRACKER ── */}
//       <section style={{ background: navy, padding: "56px 0" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
//           <div>
//             <h2 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 28, fontWeight: 700, color: "#f0ede6", marginBottom: 8 }}>{t.trackTitle}</h2>
//             <p style={{ color: "#8a9ab0", fontSize: 14, marginBottom: 24 }}>{t.trackSub}</p>
//             <div style={{ display: "flex", gap: 8 }}>
//               <input className="csc-input" value={trackVal} onChange={e => setTrackVal(e.target.value)} placeholder={t.trackPh} style={{ background: "#1a2a3a", border: "1.5px solid #2a4a6a", color: "#f0ede6", flex: 1 }} />
//               <button className="csc-btn-primary" style={{ flexShrink: 0 }}>{t.trackBtn}</button>
//             </div>
//           </div>

//           {/* Steps visual */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {[
//               ["📤", lang === "hi" ? "आवेदन भेजा गया" : "Application Submitted", "done"],
//               ["👁️", lang === "hi" ? "देखा जा रहा है" : "Under Review", "done"],
//               ["⚙️", lang === "hi" ? "प्रक्रिया में" : "In Progress", "active"],
//               ["✅", lang === "hi" ? "पूर्ण" : "Completed", "pending"],
//             ].map(([ic, label, state]) => (
//               <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, opacity: state === "pending" ? 0.4 : 1 }}>
//                 <div style={{ width: 36, height: 36, borderRadius: "50%", background: state === "done" ? accent : state === "active" ? "#fff" : "#2a3a4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, border: state === "active" ? `2px solid ${accent}` : "none" }}>{ic}</div>
//                 <span style={{ color: state === "done" ? "#f0ede6" : state === "active" ? "#fff" : "#5a6a7a", fontSize: 14, fontWeight: state === "active" ? 700 : 400 }}>{label}</span>
//                 {state === "active" && <span style={{ fontSize: 11, background: accent, color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>LIVE</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CONTACT ── */}
//       <section style={{ padding: "56px 0", borderTop: `1px solid ${border}` }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
//           <h2 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 30, fontWeight: 700, color: text, marginBottom: 32 }}>{t.contactTitle}</h2>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
//             {[
//               ["📍", lang === "hi" ? "पता" : "Address", "शंभूगंज , जौनपुर\nउत्तर प्रदेश — 222001"],
//               ["📞", lang === "hi" ? "फ़ोन" : "Phone", "+91 98XXX XXXXX"],
//               ["🕐", lang === "hi" ? "समय" : "Hours", t.hours],
//               ["📧", lang === "hi" ? "ईमेल" : "Email", "csc.shrilal@gmail.com"],
//             ].map(([ic, label, val]) => (
//               <div key={label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 18px" }}>
//                 <div style={{ fontSize: 24, marginBottom: 10 }}>{ic}</div>
//                 <div style={{ fontSize: 12, color: textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
//                 <div style={{ fontSize: 14, color: text, lineHeight: 1.6, whiteSpace: "pre-line" }}>{val}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer style={{ background: dark ? "#0a0a0a" : "#1a1612", padding: "24px 20px", textAlign: "center" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//           <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 16, color: "#c8b89a", marginBottom: 6 }}>{t.shopName}</div>
//           <div style={{ fontSize: 12, color: "#6b5a48" }}>{t.footer}</div>
//         </div>
//       </footer>

//       {/* ── LOGIN MODAL ── */}
//       {loginOpen && (
//         <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setLoginOpen(false); }}>
//           <div className="modal-box">
//             <button onClick={() => setLoginOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: textMid }}>✕</button>

//             <div style={{ marginBottom: 24 }}>
//               <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 20, fontWeight: 700, color: text, marginBottom: 4 }}>
//                 {lang === "hi" ? "स्वागत है 🙏" : "Welcome 🙏"}
//               </div>
//               <div style={{ fontSize: 13, color: textMid }}>
//                 {loginStep === "number" ? (lang === "hi" ? "अपना मोबाइल नंबर दर्ज करें" : "Enter your mobile number") : loginMode === "otp" ? (lang === "hi" ? "OTP दर्ज करें" : "Enter OTP") : (lang === "hi" ? "पासवर्ड दर्ज करें" : "Enter your password")}
//               </div>
//             </div>

//             {loginStep === "number" && (
//               <>
//                 <div style={{ position: "relative", marginBottom: 16 }}>
//                   <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: textMid, fontSize: 14 }}>🇮🇳 +91</span>
//                   <input className="csc-input" value={loginMobile} onChange={e => setLoginMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" style={{ paddingLeft: 64 }} maxLength={10} />
//                 </div>

//                 {/* Mode toggle */}
//                 <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//                   {["otp", "password"].map(m => (
//                     <button key={m} onClick={() => setLoginMode(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${loginMode === m ? accent : border}`, background: loginMode === m ? (dark ? "#2a1508" : "#fff5f0") : "transparent", color: loginMode === m ? accent : textMid, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
//                       {m === "otp" ? (lang === "hi" ? "OTP से लॉगिन" : "Login with OTP") : (lang === "hi" ? "पासवर्ड से" : "With Password")}
//                     </button>
//                   ))}
//                 </div>

//                 {loginMode === "otp" ? (
//                   <>
//                     <button className="csc-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={sendOtp} disabled={loginMobile.length !== 10}>
//                       {lang === "hi" ? "OTP भेजें" : "Send OTP"}
//                     </button>
//                     <div style={{ textAlign: "center", margin: "12px 0", color: textLight, fontSize: 12 }}>— {lang === "hi" ? "या" : "or"} —</div>
//                     <button className="whatsapp-pill" style={{ width: "100%", justifyContent: "center", fontSize: 13 }} onClick={sendOtp}>
//                       💬 {lang === "hi" ? "WhatsApp पर OTP पाएं" : "Get OTP on WhatsApp"}
//                     </button>
//                   </>
//                 ) : (
//                   <button className="csc-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setLoginStep("password")} disabled={loginMobile.length !== 10}>
//                     {lang === "hi" ? "आगे बढ़ें" : "Continue"}
//                   </button>
//                 )}
//               </>
//             )}

//             {loginStep === "otp" && (
//               <>
//                 <div style={{ fontSize: 12, color: textMid, marginBottom: 16 }}>
//                   {lang === "hi" ? `+91 ${loginMobile} पर OTP भेजा गया` : `OTP sent to +91 ${loginMobile}`}
//                   <button onClick={() => { setLoginStep("number"); setOtpSent(false); }} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, marginLeft: 8, fontFamily: "inherit" }}>
//                     {lang === "hi" ? "बदलें" : "Change"}
//                   </button>
//                 </div>

//                 <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
//                   {loginOtp.map((v, i) => (
//                     <input key={i} ref={otpRefs[i]} className="otp-box" value={v} onChange={e => handleOtpKey(i, e)} maxLength={1} inputMode="numeric" />
//                   ))}
//                 </div>

//                 <button className="csc-btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}>
//                   {lang === "hi" ? "सत्यापित करें" : "Verify OTP"}
//                 </button>

//                 <div style={{ textAlign: "center", fontSize: 13, color: textMid }}>
//                   {otpTimer > 0 ? (
//                     <span>{lang === "hi" ? `दोबारा भेजें (${otpTimer}s)` : `Resend in ${otpTimer}s`}</span>
//                   ) : (
//                     <button onClick={() => setOtpTimer(30)} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>
//                       {lang === "hi" ? "OTP दोबारा भेजें" : "Resend OTP"}
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}

//             {loginStep === "password" && (
//               <>
//                 <div style={{ fontSize: 12, color: textMid, marginBottom: 12 }}>+91 {loginMobile}
//                   <button onClick={() => setLoginStep("number")} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, marginLeft: 8, fontFamily: "inherit" }}>Change</button>
//                 </div>
//                 <input className="csc-input" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder={lang === "hi" ? "पासवर्ड दर्ज करें" : "Enter password"} style={{ marginBottom: 8 }} />
//                 <div style={{ textAlign: "right", marginBottom: 16 }}>
//                   <button onClick={() => setLoginStep("otp")} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
//                     {lang === "hi" ? "पासवर्ड भूल गए?" : "Forgot password?"}
//                   </button>
//                 </div>
//                 <button className="csc-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
//                   {lang === "hi" ? "लॉगिन करें" : "Login"}
//                 </button>
//               </>
//             )}

//             <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: textLight }}>
//               {lang === "hi" ? "नए उपयोगकर्ता? OTP से पंजीकरण स्वचालित है।" : "New user? Registration is automatic with OTP."}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



















"use client";
import { useState, useEffect } from "react"; 

// Import your portfolio components
import CustomCursor from "@/components/landing/components/CustomCursor";
import Navbar from "@/components/landing/components/Navbar";
import IntroAnimation from "@/components/landing/components/IntroAnimation";
import ParticlesBackground from "@/components/landing/components/ParticlesBackground";

// Import your portfolio sections
import HomeSection from "@/components/landing/sections/Home";
import About from "@/components/landing/sections/About";
import Skills from "@/components/landing/sections/Skills";
import Projects from "@/components/landing/sections/Projects";
import Home from "@/components/landing/sections/Home";
import Experience from "@/components/landing/sections/Experience";
import Testimonials from "@/components/landing/sections/Testimonials";
import Contact from "@/components/landing/sections/Contact";
import Footer from "@/components/landing/sections/Footer";

export default function LandingPage() {
  const [introFinished, setIntroFinished] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // ✨ Check if the user already watched the intro during this browser session
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("csc_intro_played");
    if (hasPlayed) {
      setIntroFinished(true);
    }
    setIsChecking(false);
  }, []);

  // ✨ Save to session storage when the intro finishes
  const handleIntroFinish = () => {
    sessionStorage.setItem("csc_intro_played", "true");
    setIntroFinished(true);
  };

  // Prevent brief flashes while checking session storage
  if (isChecking) return <main className="bg-black min-h-screen"></main>;

  return (
    <main className="relative bg-black text-white min-h-screen">
      
      {/* ✨ Only render the intro if it hasn't finished yet */}
      {!introFinished && <IntroAnimation onFinish={handleIntroFinish} />}

      {introFinished && (
        <div className="z-10 relative animate-in fade-in duration-1000">
          <CustomCursor />
          {/* <ParticlesBackground/> */}
          <Navbar />
          <Home />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Testimonials />
          <Contact />
          <Footer />

          <div className="flex justify-center py-10">
            <a href="/dashboard" className="px-8 py-4 bg-[#1cd8d2] text-black rounded-lg font-bold text-xl hover:bg-orange-700 transition">
              Enter Jan Seva Kendra App →
            </a>
          </div>
        </div>
      )}
    </main>
  );
}