
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "./AuthProvider";
// import { auth } from "@/lib/firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
// import { QRCodeSVG } from "qrcode.react";


// // ── Window extensions for Firebase ──────────────────────────────────────────
// declare global {
//   interface Window {
//     recaptchaVerifier: any;
//     grecaptcha: any;
//   }
// }

// type Lang = "hi" | "en";
// type LoginStep = "number" | "otp" | "password" | "set-password";
// type LoginMode = "otp" | "password";

// interface LoginModalProps {
//   lang: Lang;
//   dark: boolean;
//   onClose: () => void;
//   onSuccess: () => Promise<void>;
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // DUAL THEME TOKENS — Mutable type
// // ════════════════════════════════════════════════════════════════════════════════
// interface ThemeTokens {
//   pageBg: string; navBg: string; navBottomBorder: string;
//   navText: string; navTextHover: string; navBrand: string; navBrandAccent: string;
//   cardBg: string; cardBorder: string; cardShadow: string;
//   sectionGrad: string; sectionGradText: string;
//   textPrimary: string; textSecondary: string; textMuted: string;
//   accent: string; accentHover: string; accentLight: string; accentBorder: string;
//   inputBg: string; inputBorder: string; inputFocusBorder: string;
//   inputText: string; inputPlaceholder: string; divider: string;
//   pillBg: string; pillBorder: string; pillText: string;
//   pillActiveBg: string; pillActiveBorder: string; pillActiveText: string;
//   btnPrimary: string; btnPrimaryText: string; btnPrimaryGlow: string;
//   btnGhostBg: string; btnGhostBorder: string; btnGhostText: string;
//   btnGhostHoverBg: string; btnGhostHoverText: string;
//   btnDangerBg: string; btnDangerBorder: string; btnDangerText: string;
//   btnSuccessBg: string; btnSuccessText: string;
//   modalOverlay: string; modalBg: string; modalBorder: string;
//   scrollThumb: string; toggleIcon: string; toggleLabel: string;
// }

// const THEMES: Record<"light" | "dark", ThemeTokens> = {
//   light: {
//     pageBg: "#f1f5f9", navBg: "#1e3a8a", navBottomBorder: "#3b82f6",
//     navText: "rgba(255,255,255,0.65)", navTextHover: "#ffffff",
//     navBrand: "#ffffff", navBrandAccent: "#93c5fd",
//     cardBg: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
//     sectionGrad: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)", sectionGradText: "#ffffff",
//     textPrimary: "#1e293b", textSecondary: "#475569", textMuted: "#94a3b8",
//     accent: "#2563eb", accentHover: "#1d4ed8", accentLight: "#eff6ff", accentBorder: "#bfdbfe",
//     inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputFocusBorder: "#3b82f6",
//     inputText: "#1e293b", inputPlaceholder: "#94a3b8", divider: "#e2e8f0",
//     pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#64748b",
//     pillActiveBg: "#dbeafe", pillActiveBorder: "#93c5fd", pillActiveText: "#1d4ed8",
//     btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff",
//     btnPrimaryGlow: "rgba(37,99,235,0.35)",
//     btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569",
//     btnGhostHoverBg: "#eff6ff", btnGhostHoverText: "#2563eb",
//     btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626",
//     btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)", btnSuccessText: "#ffffff",
//     modalOverlay: "rgba(15,23,42,0.55)", modalBg: "#ffffff", modalBorder: "#e2e8f0",
//     scrollThumb: "#bfdbfe", toggleIcon: "🌙", toggleLabel: "Dark",
//   },
//   dark: {
//     pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b",
//     navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff",
//     navBrand: "#ffffff", navBrandAccent: "#f59e0b",
//     cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
//     sectionGrad: "linear-gradient(135deg,#b45309 0%,#d97706 100%)", sectionGradText: "#000000",
//     textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)",
//     accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)",
//     inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)", inputFocusBorder: "rgba(245,158,11,0.5)",
//     inputText: "#f1f5f9", inputPlaceholder: "rgba(255,255,255,0.25)", divider: "rgba(255,255,255,0.06)",
//     pillBg: "rgba(255,255,255,0.03)", pillBorder: "rgba(255,255,255,0.08)", pillText: "rgba(255,255,255,0.4)",
//     pillActiveBg: "rgba(245,158,11,0.15)", pillActiveBorder: "rgba(245,158,11,0.4)", pillActiveText: "#f59e0b",
//     btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000",
//     btnPrimaryGlow: "rgba(245,158,11,0.35)",
//     btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)",
//     btnGhostHoverBg: "rgba(245,158,11,0.1)", btnGhostHoverText: "#f59e0b",
//     btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171",
//     btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)", btnSuccessText: "#ffffff",
//     modalOverlay: "rgba(0,0,0,0.85)", modalBg: "#0f172a", modalBorder: "rgba(255,255,255,0.1)",
//     scrollThumb: "rgba(245,158,11,0.3)", toggleIcon: "☀️", toggleLabel: "Light",
//   },
// };

// const T = {
//   hi: {
//     welcome: "स्वागत है 🙏",
//     subtitle: "अपने खाते में लॉगिन करें",
//     identifier: "मोबाइल नंबर या ईमेल",
//     identPh: "10 अंकों का नंबर या ईमेल",
//     sendOtp: "OTP भेजें",
//     withPass: "पासवर्ड से",
//     withOtp: "OTP से लॉगिन",
//     orGoogle: "— या —",
//     google: "Google से लॉगिन करें",
//     enterOtp: "OTP दर्ज करें",
//     sentTo: (m: string) => `${m} पर OTP भेजा गया`,
//     change: "बदलें",
//     verify: "सत्यापित करें",
//     resend: "OTP दोबारा भेजें",
//     resendIn: (s: number) => `दोबारा भेजें (${s}s)`,
//     enterPass: "पासवर्ड दर्ज करें",
//     passLabel: "पासवर्ड",
//     passPh: "अपना पासवर्ड दर्ज करें",
//     forgotPass: "पासवर्ड भूल गए?",
//     login: "लॉगिन करें",
//     setPassTitle: "नया पासवर्ड सेट करें",
//     setPassNote: "भविष्य में आसान लॉगिन के लिए एक सुरक्षित पासवर्ड सेट करें।",
//     newPass: "नया पासवर्ड",
//     newPassPh: "न्यूनतम 6 अक्षर",
//     setPass: "पासवर्ड सहेजें",
//     skip: "अभी नहीं",
//     newUser: "नए उपयोगकर्ता? OTP द्वारा पंजीकरण स्वचालित है।",
//     sending: "भेज रहे हैं...",
//     verifying: "सत्यापित हो रहा है...",
//     loggingIn: "लॉगिन हो रहा है...",
//     error: "कुछ गलत हुआ। दोबारा प्रयास करें।",
//     mobileOtpSoon: "📱 मोबाइल OTP जल्द ही आ रहा है! कृपया ईमेल से लॉगिन करें।",
//   },
//   en: {
//     welcome: "Welcome 🙏",
//     subtitle: "Login to access your account",
//     identifier: "Mobile or Email",
//     identPh: "10-digit mobile or email address",
//     sendOtp: "Send OTP",
//     withPass: "With Password",
//     withOtp: "Login with OTP",
//     orGoogle: "— or —",
//     google: "Continue with Google",
//     enterOtp: "Enter OTP",
//     sentTo: (m: string) => `OTP sent to ${m}`,
//     change: "Change",
//     verify: "Verify OTP",
//     resend: "Resend OTP",
//     resendIn: (s: number) => `Resend in ${s}s`,
//     enterPass: "Enter your password",
//     passLabel: "Password",
//     passPh: "Enter your password",
//     forgotPass: "Forgot password?",
//     login: "Login",
//     setPassTitle: "Set a New Password",
//     setPassNote: "Set a secure password for easier future logins.",
//     newPass: "New password",
//     newPassPh: "Minimum 6 characters",
//     setPass: "Save Password",
//     skip: "Skip for now",
//     newUser: "New user? Registration is automatic.",
//     sending: "Sending...",
//     verifying: "Verifying...",
//     loggingIn: "Logging in...",
//     error: "Something went wrong. Please try again.",
//     mobileOtpSoon: "📱 Mobile OTP coming soon! Please use email login.",
//   },
// } as const;

// // ── Eye Icon SVGs ──────────────────────────────────────────
// const EyeOpen = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const EyeClosed = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
//     <line x1="1" y1="1" x2="23" y2="23" />
//   </svg>
// );

// export default function LoginModal({ lang, dark, onClose, onSuccess }: LoginModalProps) {
//   const t = T[lang];
//   const theme = dark ? THEMES.dark : THEMES.light;

//   const [step, setStep] = useState<LoginStep>("number");
//   const [mode, setMode] = useState<LoginMode>("password");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [newPass, setNewPass] = useState("");
//   const [timer, setTimer] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [isResettingPass, setIsResettingPass] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

//   const { isLoggedIn } = useAuth();

//   // ── DETECT IF INPUT IS EMAIL ──
//   const isEmail = identifier.includes("@") || /[a-zA-Z]/.test(identifier);
//   const isValidMobile = /^[6-9]\d{9}$/.test(identifier);
//   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
//   const isValidInput = isEmail ? isValidEmail : isValidMobile;

//   const [view, setView] = useState<"form" | "qr">("form");
//   const [qrSid, setQrSid] = useState("");
//   const [qrStatus, setQrStatus] = useState<"loading" | "active" | "expired">("loading");
//   const pollRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     return () => {
//       if (window.recaptchaVerifier) {
//         try { window.recaptchaVerifier.clear(); window.recaptchaVerifier = null; } catch (e) { }
//       }
//     };
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, []);

//   if (isLoggedIn && !isResettingPass) {
//     onSuccess().then(onClose);
//   }

//   useEffect(() => {
//     if (timer <= 0) return;
//     const id = setInterval(() => setTimer((v) => v - 1), 1000);
//     return () => clearInterval(id);
//   }, [timer]);

//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//         size: 'invisible', callback: () => { }
//       });
//     }
//   };

//   const initQr = async () => {
//     setQrStatus("loading");
//     setError("");
//     try {
//       const res = await fetch("/api/auth/qr-create", { method: "POST" });
//       const data = await res.json();
//       if (data.success) {
//         setQrSid(data.session_id);
//         setQrStatus("active");

//         if (pollRef.current) clearInterval(pollRef.current);
//         pollRef.current = setInterval(async () => {
//           const check = await fetch(`/api/auth/qr-check?sid=${data.session_id}`);
//           const c = await check.json();
//           if (c.success && c.token) {
//             if (pollRef.current) clearInterval(pollRef.current);
//             await fetch("/api/auth/set-session", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ token: c.token }),
//             });
//             await onSuccess();
//             onClose();
//           } else if (c.expired) {
//             if (pollRef.current) clearInterval(pollRef.current);
//             setQrStatus("expired");
//           }
//         }, 2000);
//       }
//     } catch {
//       setError("Failed to generate QR code");
//       setQrStatus("expired");
//     }
//   };

//   const handleOtpChange = (i: number, val: string) => {
//     const digit = val.replace(/\D/, "").slice(-1);
//     const next = [...otp];
//     next[i] = digit;
//     setOtp(next);
//     if (digit && i < 5) (document.getElementById(`otp-inp-${i + 1}`) as HTMLInputElement)?.focus();
//   };

//   const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
//     if (e.key === "Backspace" && !otp[i] && i > 0) (document.getElementById(`otp-inp-${i - 1}`) as HTMLInputElement)?.focus();
//     if (e.key === "Enter") handleVerify();
//   };

//   // ── SMART OTP SENDING ──
//   const handleSendOtp = async () => {
//     if (!isValidInput) { setError("Invalid mobile or email"); return; }

//     // ── MOBILE OTP COMING SOON CHECK ──
//     if (!isEmail) {
//       setError(t.mobileOtpSoon);
//       return;
//     }

//     setLoading(true); setError("");

//     try {
//       if (!isEmail) {
//         setupRecaptcha();
//         const appVerifier = window.recaptchaVerifier;
//         const formattedMobile = `+91${identifier}`;
//         const confirmation = await signInWithPhoneNumber(auth, formattedMobile, appVerifier);
//         setConfirmationResult(confirmation);
//       } else {
//         const res = await fetch("/api/auth/send-email-otp", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: identifier.toLowerCase() }),
//         });
//         const data = await res.json();
//         if (!data.success) throw new Error(data.message);
//       }

//       setStep("otp"); setTimer(30); setOtp(["", "", "", "", "", ""]);
//       setTimeout(() => (document.getElementById("otp-inp-0") as HTMLInputElement)?.focus(), 80);
//     } catch (err: any) {
//       setError(err.message || t.error);
//       if (!isEmail && window.recaptchaVerifier) {
//         window.recaptchaVerifier.render().then((wId: any) => { window.grecaptcha.reset(wId); });
//       }
//     }
//     setLoading(false);
//   };

//   // ── SMART OTP VERIFY ──
//   const handleVerify = async () => {
//     const otpStr = otp.join("");
//     if (otpStr.length !== 6) { setError("Enter all 6 digits"); return; }
//     setLoading(true); setError("");

//     try {
//       let res;
//       if (!isEmail) {
//         if (!confirmationResult) throw new Error("Please request OTP first.");
//         const result = await confirmationResult.confirm(otpStr);
//         const idToken = await result.user.getIdToken();
//         res = await fetch("/api/auth/verify-firebase", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idToken, mobile: identifier }),
//         });
//       } else {
//         res = await fetch("/api/auth/verify-email-otp", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: identifier.toLowerCase(), otp: otpStr }),
//         });
//       }

//       const data = await res.json();
//       if (!data.success) throw new Error(data.message);

//       if (isResettingPass || !data.user?.password_hash) {
//         setStep("set-password");
//       } else {
//         await onSuccess(); onClose();
//       }
//     } catch (err: any) {
//       setError(err.message || "Invalid OTP. Please try again.");
//     }
//     setLoading(false);
//   };

//   // ── UNIFIED PASSWORD LOGIN ──
//   const handlePasswordLogin = async () => {
//     if (!password) { setError("Enter your password"); return; }
//     setLoading(true); setError("");
//     try {
//       const res = await fetch("/api/auth/login-password", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ identifier: identifier.toLowerCase(), password }),
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (data.success) { await onSuccess(); onClose(); }
//       else { setError(data.message || t.error); }
//     } catch { setError(t.error); }
//     setLoading(false);
//   };

//   const handleForgotPassword = () => {
//     if (!isValidInput) { setError("Please enter your mobile or email above first."); return; }
//     setIsResettingPass(true); setMode("otp"); handleSendOtp();
//   };

//   const handleSetPassword = async (skip = false) => {
//     if (!skip && newPass.length < 6) { setError("Minimum 6 characters"); return; }
//     setLoading(true);
//     if (!skip) {
//       await fetch("/api/auth/set-password", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ password: newPass }), credentials: "include",
//       });
//     }
//     await onSuccess(); onClose();
//   };

//   const handleGoogleLogin = () => {
//     const from = window.location.pathname;
//     window.location.href = `/api/auth/google?from=${encodeURIComponent(from)}`;
//   };

//   // ── Shared input styles ──
//   const inputBaseStyle: React.CSSProperties = {
//     width: "100%",
//     padding: "14px 16px",
//     border: `1px solid ${theme.inputBorder}`,
//     borderRadius: 12,
//     background: theme.inputBg,
//     color: theme.inputText,
//     fontSize: "0.95rem",
//     fontFamily: "inherit",
//     transition: "all 0.2s",
//     outline: "none",
//     fontWeight: 500,
//   };

//   const inputFocusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
//     e.currentTarget.style.borderColor = theme.accent;
//     e.currentTarget.style.background = theme.modalBg;
//     e.currentTarget.style.boxShadow = `0 0 0 4px ${theme.accentBorder}`;
//   };

//   const inputBlurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
//     e.currentTarget.style.borderColor = theme.inputBorder;
//     e.currentTarget.style.background = theme.inputBg;
//     e.currentTarget.style.boxShadow = "none";
//   };

//   const btnPrimaryStyle: React.CSSProperties = {
//     background: theme.btnPrimary,
//     color: theme.btnPrimaryText,
//     width: "100%",
//     padding: 14,
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: "1rem",
//     border: "none",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     boxShadow: `0 4px 12px ${theme.btnPrimaryGlow}`,
//   };

//   const errorBoxStyle: React.CSSProperties = {
//     color: theme.btnDangerText,
//     fontSize: "0.85rem",
//     marginBottom: 16,
//     fontWeight: 600,
//     textAlign: "center",
//     background: theme.btnDangerBg,
//     border: `1px solid ${theme.btnDangerBorder}`,
//     padding: "8px",
//     borderRadius: 8,
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: theme.modalOverlay,
//         backdropFilter: "blur(8px)",
//         zIndex: 1000,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 16,
//         animation: "bgFadeIn 0.3s ease forwards",
//       }}
//       onClick={onClose}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
//         @keyframes bgFadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes modalPopUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
//       `}</style>

//       <div id="recaptcha-container" />

//       <div
//         style={{
//           background: theme.modalBg,
//           width: "100%",
//           maxWidth: 420,
//           borderRadius: 24,
//           overflow: "hidden",
//           position: "relative",
//           boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//           animation: "modalPopUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
//           fontFamily: "'DM Sans', 'Noto Sans Devanagari', sans-serif",
//           border: `1px solid ${theme.modalBorder}`,
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           title="Close"
//           style={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             background: "rgba(255,255,255,0.1)",
//             border: `1px solid rgba(255,255,255,0.2)`,
//             color: "#fff",
//             width: 36,
//             height: 36,
//             borderRadius: "50%",
//             fontSize: "1.2rem",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             transition: "all 0.2s",
//             zIndex: 10,
//           }}
//           onMouseEnter={(e) => {
//             (e.currentTarget as HTMLElement).style.background = "#ef4444";
//             (e.currentTarget as HTMLElement).style.borderColor = "#ef4444";
//             (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
//             (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
//             (e.currentTarget as HTMLElement).style.transform = "scale(1)";
//           }}
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div
//           style={{
//             background: theme.sectionGrad,
//             padding: "32px 28px 24px",
//             textAlign: "center",
//             position: "relative",
//             color: theme.sectionGradText,
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
//               backgroundSize: "24px 24px",
//             }}
//           />
//           <h2
//             style={{
//               fontFamily: "'DM Serif Display', serif",
//               fontSize: "2rem",
//               marginBottom: 6,
//               position: "relative",
//               color: theme.sectionGradText,
//             }}
//           >
//             Srilal CSC
//           </h2>
//           <p
//             style={{
//               color: dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)",
//               fontSize: "0.95rem",
//               fontWeight: 500,
//               position: "relative",
//             }}
//           >
//             {step === "number" ? t.subtitle : step === "otp" ? t.enterOtp : t.setPassTitle}
//           </p>
//         </div>

//         {/* Body */}
//         {/* Body */}
//         <div style={{ padding: 28, background: theme.modalBg }}>

//           {/* ── VIEW TOGGLE: Form | QR ── */}
//           <div
//             style={{
//               display: "flex",
//               background: theme.inputBg,
//               borderRadius: 12,
//               padding: 4,
//               marginBottom: 20,
//               border: `1px solid ${theme.inputBorder}`,
//             }}
//           >
//             <button
//               onClick={() => {
//                 setView("form");
//                 if (pollRef.current) clearInterval(pollRef.current);
//               }}
//               style={{
//                 flex: 1,
//                 padding: 10,
//                 borderRadius: 8,
//                 fontSize: "0.85rem",
//                 fontWeight: 700,
//                 textAlign: "center",
//                 cursor: "pointer",
//                 border: "none",
//                 fontFamily: "inherit",
//                 background: view === "form" ? theme.cardBg : "transparent",
//                 color: view === "form" ? theme.accent : theme.textMuted,
//                 boxShadow: view === "form" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
//               }}
//             >
//               ✉️ Form
//             </button>
//             <button
//               onClick={() => {
//                 setView("qr");
//                 if (!qrSid) initQr();
//               }}
//               style={{
//                 flex: 1,
//                 padding: 10,
//                 borderRadius: 8,
//                 fontSize: "0.85rem",
//                 fontWeight: 700,
//                 textAlign: "center",
//                 cursor: "pointer",
//                 border: "none",
//                 fontFamily: "inherit",
//                 background: view === "qr" ? theme.cardBg : "transparent",
//                 color: view === "qr" ? theme.accent : theme.textMuted,
//                 boxShadow: view === "qr" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
//               }}
//             >
//               📷 QR Code
//             </button>
//           </div>

//           {view === "qr" ? (
//             <div style={{ textAlign: "center", padding: "24px 0" }}>
//               {qrStatus === "loading" && (
//                 <p style={{ color: theme.textMuted, fontWeight: 500 }}>Generating QR…</p>
//               )}

//               {qrStatus === "active" && (
//                 <>
//                   <div
//                     style={{
//                       background: "#fff",
//                       padding: 12,
//                       borderRadius: 16,
//                       display: "inline-block",
//                       border: `1px solid ${theme.cardBorder}`,
//                     }}
//                   >
//                     <QRCodeSVG value={qrSid} size={200} level="M" includeMargin />
//                   </div>
//                   <p
//                     style={{
//                       marginTop: 16,
//                       color: theme.textSecondary,
//                       fontSize: "0.9rem",
//                       fontWeight: 500,
//                       lineHeight: 1.5,
//                     }}
//                   >
//                     Open <strong>Srilal CSC</strong> app → tap scanner → scan to login instantly
//                   </p>
//                 </>
//               )}

//               {qrStatus === "expired" && (
//                 <>
//                   <p style={{ color: theme.btnDangerText, marginBottom: 16, fontWeight: 600 }}>
//                     QR expired. Please refresh.
//                   </p>
//                   <button
//                     onClick={initQr}
//                     style={{
//                       ...btnPrimaryStyle,
//                       width: "auto",
//                       padding: "12px 24px",
//                     }}
//                   >
//                     Refresh QR
//                   </button>
//                 </>
//               )}
//             </div>
//           ) : (
//             <>


//               {/* ── STEP: MOBILE NUMBER ── */}
//               {step === "number" && (
//                 <>
//                   {/* Mode Toggle */}
//                   <div
//                     style={{
//                       display: "flex",
//                       background: theme.inputBg,
//                       borderRadius: 12,
//                       padding: 4,
//                       marginBottom: 20,
//                       border: `1px solid ${theme.inputBorder}`,
//                     }}
//                   >
//                     <button
//                       onClick={() => setMode("password")}
//                       style={{
//                         flex: 1,
//                         padding: 10,
//                         borderRadius: 8,
//                         fontSize: "0.85rem",
//                         fontWeight: 700,
//                         textAlign: "center",
//                         cursor: "pointer",
//                         transition: "all 0.2s",
//                         border: "none",
//                         fontFamily: "inherit",
//                         background: mode === "password" ? theme.cardBg : "transparent",
//                         color: mode === "password" ? theme.accent : theme.textMuted,
//                         boxShadow: mode === "password" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
//                       }}
//                     >
//                       🔒 {t.withPass}
//                     </button>
//                     <button
//                       onClick={() => setMode("otp")}
//                       style={{
//                         flex: 1,
//                         padding: 10,
//                         borderRadius: 8,
//                         fontSize: "0.85rem",
//                         fontWeight: 700,
//                         textAlign: "center",
//                         cursor: "pointer",
//                         transition: "all 0.2s",
//                         border: "none",
//                         fontFamily: "inherit",
//                         background: mode === "otp" ? theme.cardBg : "transparent",
//                         color: mode === "otp" ? theme.accent : theme.textMuted,
//                         boxShadow: mode === "otp" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
//                       }}
//                     >
//                       📱 {t.withOtp}
//                     </button>
//                   </div>

//                   {/* Identifier Input */}
//                   <div style={{ position: "relative", marginBottom: 16 }}>
//                     {!isEmail && identifier.length > 0 && (
//                       <span
//                         style={{
//                           position: "absolute",
//                           left: 16,
//                           top: "50%",
//                           transform: "translateY(-50%)",
//                           color: theme.textMuted,
//                           fontWeight: 600,
//                           fontSize: "0.95rem",
//                           userSelect: "none",
//                         }}
//                       >
//                         🇮🇳 +91
//                       </span>
//                     )}
//                     <input
//                       type={isEmail ? "email" : "text"}
//                       value={identifier}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         if (/^\d+$/.test(val) && val.length > 10) return;
//                         setIdentifier(val.trim()); setError("");
//                       }}
//                       onKeyDown={(e) => e.key === "Enter" && (mode === "password" ? handlePasswordLogin() : handleSendOtp())}
//                       placeholder={t.identPh}
//                       autoFocus
//                       style={{
//                         ...inputBaseStyle,
//                         paddingLeft: (!isEmail && identifier.length > 0) ? "76px" : "16px",
//                       }}
//                       onFocus={inputFocusStyle}
//                       onBlur={inputBlurStyle}
//                     />
//                   </div>

//                   {/* Password Input with Show/Hide */}
//                   {mode === "password" && (
//                     <>
//                       <div style={{ position: "relative", marginBottom: 12 }}>
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           value={password}
//                           onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                           placeholder={t.passPh}
//                           onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
//                           style={{
//                             ...inputBaseStyle,
//                             paddingRight: 48,
//                           }}
//                           onFocus={inputFocusStyle}
//                           onBlur={inputBlurStyle}
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           style={{
//                             position: "absolute",
//                             right: 12,
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             background: "none",
//                             border: "none",
//                             color: theme.textMuted,
//                             cursor: "pointer",
//                             padding: 4,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             transition: "color 0.2s",
//                             borderRadius: 6,
//                           }}
//                           onMouseEnter={(e) => {
//                             (e.currentTarget as HTMLElement).style.color = theme.accent;
//                             (e.currentTarget as HTMLElement).style.background = theme.accentLight;
//                           }}
//                           onMouseLeave={(e) => {
//                             (e.currentTarget as HTMLElement).style.color = theme.textMuted;
//                             (e.currentTarget as HTMLElement).style.background = "transparent";
//                           }}
//                           title={showPassword ? "Hide password" : "Show password"}
//                         >
//                           {showPassword ? <EyeClosed /> : <EyeOpen />}
//                         </button>
//                       </div>
//                       <div style={{ textAlign: "right", marginBottom: 20 }}>
//                         <button
//                           onClick={handleForgotPassword}
//                           style={{
//                             color: theme.accent,
//                             fontWeight: 700,
//                             cursor: "pointer",
//                             background: "none",
//                             border: "none",
//                             fontSize: "0.85rem",
//                             padding: 0,
//                           }}
//                         >
//                           {t.forgotPass}
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   {error && <div style={errorBoxStyle}>{error}</div>}

//                   {/* Action Button */}
//                   {mode === "password" ? (
//                     <button
//                       onClick={handlePasswordLogin}
//                       disabled={loading || !isValidInput || !password}
//                       style={{
//                         ...btnPrimaryStyle,
//                         opacity: loading || !isValidInput || !password ? 0.6 : 1,
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!loading && isValidInput && password) {
//                           (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
//                           (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 16px ${theme.btnPrimaryGlow}`;
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//                         (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${theme.btnPrimaryGlow}`;
//                       }}
//                     >
//                       {loading ? t.loggingIn : t.login}
//                     </button>
//                   ) : (
//                     <button
//                       onClick={handleSendOtp}
//                       disabled={loading || !isValidInput}
//                       style={{
//                         ...btnPrimaryStyle,
//                         opacity: loading || !isValidInput ? 0.6 : 1,
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!loading && isValidInput) {
//                           (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
//                           (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 16px ${theme.btnPrimaryGlow}`;
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//                         (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${theme.btnPrimaryGlow}`;
//                       }}
//                     >
//                       {loading ? t.sending : t.sendOtp}
//                     </button>
//                   )}

//                   {/* Divider */}
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       textAlign: "center",
//                       margin: "24px 0",
//                       color: theme.textMuted,
//                       fontSize: "0.85rem",
//                       fontWeight: 600,
//                     }}
//                   >
//                     <span style={{ flex: 1, height: 1, background: theme.divider }} />
//                     <span style={{ padding: "0 12px" }}>{t.orGoogle}</span>
//                     <span style={{ flex: 1, height: 1, background: theme.divider }} />
//                   </div>

//                   {/* Google Button */}
//                   <button
//                     onClick={handleGoogleLogin}
//                     style={{
//                       background: theme.cardBg,
//                       border: `1px solid ${theme.inputBorder}`,
//                       color: theme.textPrimary,
//                       width: "100%",
//                       padding: 12,
//                       borderRadius: 12,
//                       fontWeight: 700,
//                       fontSize: "0.95rem",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: 10,
//                       cursor: "pointer",
//                       transition: "all 0.2s",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
//                     }}
//                     onMouseEnter={(e) => {
//                       (e.currentTarget as HTMLElement).style.borderColor = theme.accentBorder;
//                       (e.currentTarget as HTMLElement).style.background = theme.inputBg;
//                       (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
//                     }}
//                     onMouseLeave={(e) => {
//                       (e.currentTarget as HTMLElement).style.borderColor = theme.inputBorder;
//                       (e.currentTarget as HTMLElement).style.background = theme.cardBg;
//                       (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//                     }}
//                   >
//                     <svg viewBox="0 0 24 24" width="20" height="20">
//                       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
//                       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                     </svg>
//                     {t.google}
//                   </button>

//                   {/* New User Note */}
//                   <div
//                     style={{
//                       marginTop: 24,
//                       textAlign: "center",
//                       fontSize: "0.8rem",
//                       color: theme.textMuted,
//                       fontWeight: 500,
//                     }}
//                   >
//                     {t.newUser}
//                   </div>
//                 </>
//               )}

//               {/* ── STEP: OTP ── */}
//               {step === "otp" && (
//                 <>
//                   <div
//                     style={{
//                       fontSize: "0.9rem",
//                       color: theme.textSecondary,
//                       marginBottom: 20,
//                       textAlign: "center",
//                     }}
//                   >
//                     {t.sentTo(identifier)}{" "}
//                     <button
//                       onClick={() => { setStep("number"); setError(""); }}
//                       style={{
//                         color: theme.accent,
//                         fontWeight: 700,
//                         cursor: "pointer",
//                         background: "none",
//                         border: "none",
//                         fontSize: "0.85rem",
//                         padding: 0,
//                       }}
//                     >
//                       {t.change}
//                     </button>
//                   </div>

//                   {/* OTP Grid */}
//                   <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
//                     {otp.map((v, i) => (
//                       <input
//                         key={i}
//                         id={`otp-inp-${i}`}
//                         value={v}
//                         onChange={(e) => handleOtpChange(i, e.target.value)}
//                         onKeyDown={(e) => handleOtpKeyDown(i, e)}
//                         maxLength={1}
//                         inputMode="numeric"
//                         autoFocus={i === 0}
//                         style={{
//                           width: 48,
//                           height: 56,
//                           border: `1px solid ${theme.inputBorder}`,
//                           borderRadius: 12,
//                           background: theme.inputBg,
//                           color: theme.inputText,
//                           fontSize: "1.5rem",
//                           fontWeight: 800,
//                           textAlign: "center",
//                           outline: "none",
//                           transition: "all 0.2s",
//                         }}
//                         onFocus={(e) => {
//                           e.currentTarget.style.borderColor = theme.accent;
//                           e.currentTarget.style.background = theme.modalBg;
//                           e.currentTarget.style.boxShadow = `0 0 0 4px ${theme.accentBorder}`;
//                         }}
//                         onBlur={(e) => {
//                           e.currentTarget.style.borderColor = theme.inputBorder;
//                           e.currentTarget.style.background = theme.inputBg;
//                           e.currentTarget.style.boxShadow = "none";
//                         }}
//                       />
//                     ))}
//                   </div>

//                   {error && <div style={errorBoxStyle}>{error}</div>}

//                   <button
//                     onClick={handleVerify}
//                     disabled={loading || otp.join("").length !== 6}
//                     style={{
//                       ...btnPrimaryStyle,
//                       marginBottom: 16,
//                       opacity: loading || otp.join("").length !== 6 ? 0.6 : 1,
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!loading && otp.join("").length === 6) {
//                         (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
//                         (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 16px ${theme.btnPrimaryGlow}`;
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//                       (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${theme.btnPrimaryGlow}`;
//                     }}
//                   >
//                     {loading ? t.verifying : t.verify}
//                   </button>

//                   <div
//                     style={{
//                       textAlign: "center",
//                       fontSize: "0.85rem",
//                       color: theme.textMuted,
//                     }}
//                   >
//                     {timer > 0 ? (
//                       <span>{t.resendIn(timer)}</span>
//                     ) : (
//                       <button
//                         onClick={handleSendOtp}
//                         style={{
//                           color: theme.accent,
//                           fontWeight: 700,
//                           cursor: "pointer",
//                           background: "none",
//                           border: "none",
//                           fontSize: "0.85rem",
//                           padding: 0,
//                         }}
//                       >
//                         {t.resend}
//                       </button>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* ── STEP: SET PASSWORD ── */}
//               {step === "set-password" && (
//                 <>
//                   <div
//                     style={{
//                       fontSize: "0.9rem",
//                       color: theme.textSecondary,
//                       lineHeight: 1.6,
//                       marginBottom: 20,
//                       textAlign: "center",
//                     }}
//                   >
//                     {t.setPassNote}
//                   </div>
//                   <input
//                     type="password"
//                     value={newPass}
//                     onChange={(e) => { setNewPass(e.target.value); setError(""); }}
//                     placeholder={t.newPassPh}
//                     onKeyDown={(e) => e.key === "Enter" && handleSetPassword(false)}
//                     style={{ ...inputBaseStyle, marginBottom: 16 }}
//                     onFocus={inputFocusStyle}
//                     onBlur={inputBlurStyle}
//                   />

//                   {error && <div style={errorBoxStyle}>{error}</div>}

//                   <button
//                     onClick={() => handleSetPassword(false)}
//                     disabled={loading}
//                     style={{
//                       ...btnPrimaryStyle,
//                       marginBottom: 12,
//                     }}
//                     onMouseEnter={(e) => {
//                       (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
//                       (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 16px ${theme.btnPrimaryGlow}`;
//                     }}
//                     onMouseLeave={(e) => {
//                       (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//                       (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${theme.btnPrimaryGlow}`;
//                     }}
//                   >
//                     {loading ? "..." : t.setPass}
//                   </button>
//                   {!isResettingPass && (
//                     <button
//                       onClick={() => handleSetPassword(true)}
//                       style={{
//                         background: "transparent",
//                         border: "none",
//                         color: theme.textMuted,
//                         width: "100%",
//                         padding: 12,
//                         borderRadius: 12,
//                         fontWeight: 700,
//                         fontSize: "0.95rem",
//                         cursor: "pointer",
//                         transition: "all 0.2s",
//                       }}
//                       onMouseEnter={(e) => {
//                         (e.currentTarget as HTMLElement).style.color = theme.accent;
//                         (e.currentTarget as HTMLElement).style.background = theme.accentLight;
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.currentTarget as HTMLElement).style.color = theme.textMuted;
//                         (e.currentTarget as HTMLElement).style.background = "transparent";
//                       }}
//                     >
//                       {t.skip}
//                     </button>
//                   )}
//                 </>
//               )}
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }













"use client";

/**
 * LoginModal.tsx — REDESIGNED for
 * D:\csc-platform\src\components\LoginModal.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same props as
 * before: LoginModal({ lang, dark, onClose, onSuccess }).
 *
 * DESIGN: a plain login dialog — one card, one accent, no gradients,
 * no serif display font, no dot pattern, no entrance animation. The
 * header is a title and a subtitle, not a gradient banner. The work
 * is all in the form: the identifier field, the password field, the
 * six OTP boxes, the QR tab, and the Google button, each readable at
 * a glance.
 *
 * KEPT, exactly as supplied — every line of auth logic:
 * - Steps: "number" | "otp" | "password" | "set-password". Modes:
 *   "otp" | "password". Views: "form" | "qr".
 * - Identifier detection: email if it contains "@" or any letter;
 *   mobile must match /^[6-9]\d{9}$/, email must match the email
 *   regex. Digits-only input capped at 10 characters, trimmed.
 * - OTP: six boxes, digits only, auto-advance, Backspace goes back,
 *   Enter verifies. 30-second resend timer.
 * - Email OTP: POST /api/auth/send-email-otp, then
 *   /api/auth/verify-email-otp. Password login: POST
 *   /api/auth/login-password. Forgot password: switches to OTP mode
 *   and sends an OTP. Set password: POST /api/auth/set-password,
 *   minimum 6 characters, skippable unless resetting.
 * - Google: redirect to /api/auth/google?from=<current path>.
 * - QR: POST /api/auth/qr-create, poll /api/auth/qr-check?sid=...
 *   every 2 seconds, on a token POST /api/auth/set-session, then
 *   onSuccess + onClose; on expiry show the expired state.
 * - Firebase phone auth (RecaptchaVerifier, signInWithPhoneNumber,
 *   confirmationResult, /api/auth/verify-firebase) and its cleanup
 *   effects — see the note below, they are kept but currently
 *   unreachable.
 * - The bilingual strings (hi / en) are kept byte-for-byte, including
 *   the copy's own emoji (🙏 in "Welcome", 📱 in the mobile-OTP
 *   message). Only emoji used as button icons became lucide icons.
 *
 * NOTES ON BEHAVIOUR — read before you ship:
 * 1. MOBILE OTP IS BLOCKED. handleSendOtp returns early with the
 *    "Mobile OTP coming soon" message for any non-email identifier,
 *    so the Firebase phone branch below it never runs. That is the
 *    original's behaviour, kept as-is — if mobile OTP is ready, delete
 *    that early return and the Firebase flow works.
 * 2. The logged-in check (`if (isLoggedIn && !isResettingPass)`)
 *    used to run during render, calling onSuccess().then(onClose)
 *    as a side effect of rendering. It now runs in a useEffect —
 *    same behaviour, correct timing.
 *
 * REMOVED: the duplicated 52-token THEMES object and ThemeTokens
 * interface (the same object was copied into AuthProvider and
 * LoginModal), every inline style object and every onMouseEnter /
 * onMouseLeave style mutation (focus and hover are Tailwind
 * focus:/hover: classes now), the @import of Google Fonts inside the
 * component (DM Serif Display, DM Sans, Noto Sans Devanagari — system
 * fonts render Devanagari natively), the gradient header with its dot
 * pattern, the serif "Srilal CSC" heading, the bgFadeIn/modalPopUp
 * keyframes, and the hand-drawn Eye SVGs (lucide Eye / EyeOff now).
 * The `dark` prop is still accepted and synced to the `dark` class
 * on <html>, like every other component — the modal itself uses
 * Tailwind `dark:` classes.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { QRCodeSVG } from "qrcode.react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  QrCode,
  Smartphone,
  X,
} from "lucide-react";

// ── Window extensions for Firebase ──────────────────────────────────────────
declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: any;
  }
}

type Lang = "hi" | "en";
type LoginStep = "number" | "otp" | "password" | "set-password";
type LoginMode = "otp" | "password";

interface LoginModalProps {
  lang: Lang;
  dark: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

// ── Bilingual copy — kept byte-for-byte from the original ──────────────────
const T = {
  hi: {
    welcome: "स्वागत है 🙏",
    subtitle: "अपने खाते में लॉगिन करें",
    identifier: "मोबाइल नंबर या ईमेल",
    identPh: "10 अंकों का नंबर या ईमेल",
    sendOtp: "OTP भेजें",
    withPass: "पासवर्ड से",
    withOtp: "OTP से लॉगिन",
    orGoogle: "— या —",
    google: "Google से लॉगिन करें",
    enterOtp: "OTP दर्ज करें",
    sentTo: (m: string) => `${m} पर OTP भेजा गया`,
    change: "बदलें",
    verify: "सत्यापित करें",
    resend: "OTP दोबारा भेजें",
    resendIn: (s: number) => `दोबारा भेजें (${s}s)`,
    enterPass: "पासवर्ड दर्ज करें",
    passLabel: "पासवर्ड",
    passPh: "अपना पासवर्ड दर्ज करें",
    forgotPass: "पासवर्ड भूल गए?",
    login: "लॉगिन करें",
    setPassTitle: "नया पासवर्ड सेट करें",
    setPassNote: "भविष्य में आसान लॉगिन के लिए एक सुरक्षित पासवर्ड सेट करें।",
    newPass: "नया पासवर्ड",
    newPassPh: "न्यूनतम 6 अक्षर",
    setPass: "पासवर्ड सहेजें",
    skip: "अभी नहीं",
    newUser: "नए उपयोगकर्ता? OTP द्वारा पंजीकरण स्वचालित है।",
    sending: "भेज रहे हैं...",
    verifying: "सत्यापित हो रहा है...",
    loggingIn: "लॉगिन हो रहा है...",
    error: "कुछ गलत हुआ। दोबारा प्रयास करें।",
    mobileOtpSoon: "📱 मोबाइल OTP जल्द ही आ रहा है! कृपया ईमेल से लॉगिन करें।",
  },
  en: {
    welcome: "Welcome 🙏",
    subtitle: "Login to access your account",
    identifier: "Mobile or Email",
    identPh: "10-digit mobile or email address",
    sendOtp: "Send OTP",
    withPass: "With Password",
    withOtp: "Login with OTP",
    orGoogle: "— or —",
    google: "Continue with Google",
    enterOtp: "Enter OTP",
    sentTo: (m: string) => `OTP sent to ${m}`,
    change: "Change",
    verify: "Verify OTP",
    resend: "Resend OTP",
    resendIn: (s: number) => `Resend in ${s}s`,
    enterPass: "Enter your password",
    passLabel: "Password",
    passPh: "Enter your password",
    forgotPass: "Forgot password?",
    login: "Login",
    setPassTitle: "Set a New Password",
    setPassNote: "Set a secure password for easier future logins.",
    newPass: "New password",
    newPassPh: "Minimum 6 characters",
    setPass: "Save Password",
    skip: "Skip for now",
    newUser: "New user? Registration is automatic.",
    sending: "Sending...",
    verifying: "Verifying...",
    loggingIn: "Logging in...",
    error: "Something went wrong. Please try again.",
    mobileOtpSoon: "📱 Mobile OTP coming soon! Please use email login.",
  },
} as const;

export default function LoginModal({ lang, dark, onClose, onSuccess }: LoginModalProps) {
  const t = T[lang];

  const [step, setStep] = useState<LoginStep>("number");
  const [mode, setMode] = useState<LoginMode>("password");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isResettingPass, setIsResettingPass] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const { isLoggedIn } = useAuth();

  // ── DETECT IF INPUT IS EMAIL ──
  const isEmail = identifier.includes("@") || /[a-zA-Z]/.test(identifier);
  const isValidMobile = /^[6-9]\d{9}$/.test(identifier);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const isValidInput = isEmail ? isValidEmail : isValidMobile;

  const [view, setView] = useState<"form" | "qr">("form");
  const [qrSid, setQrSid] = useState("");
  const [qrStatus, setQrStatus] = useState<"loading" | "active" | "expired">("loading");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Keep the parent's dark prop as the source of truth, and sync it
  // to the `dark` class so Tailwind's dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); window.recaptchaVerifier = null; } catch (e) { }
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Was a side effect during render in the original; same behaviour,
  // correct timing: if already logged in, finish and close.
  useEffect(() => {
    if (isLoggedIn && !isResettingPass) {
      onSuccess().then(onClose);
    }
  }, [isLoggedIn, isResettingPass, onSuccess, onClose]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((v) => v - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible', callback: () => { }
      });
    }
  };

  const initQr = async () => {
    setQrStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/qr-create", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setQrSid(data.session_id);
        setQrStatus("active");

        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
          const check = await fetch(`/api/auth/qr-check?sid=${data.session_id}`);
          const c = await check.json();
          if (c.success && c.token) {
            if (pollRef.current) clearInterval(pollRef.current);
            await fetch("/api/auth/set-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: c.token }),
            });
            await onSuccess();
            onClose();
          } else if (c.expired) {
            if (pollRef.current) clearInterval(pollRef.current);
            setQrStatus("expired");
          }
        }, 2000);
      }
    } catch {
      setError("Failed to generate QR code");
      setQrStatus("expired");
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) (document.getElementById(`otp-inp-${i + 1}`) as HTMLInputElement)?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) (document.getElementById(`otp-inp-${i - 1}`) as HTMLInputElement)?.focus();
    if (e.key === "Enter") handleVerify();
  };

  // ── SMART OTP SENDING ──
  const handleSendOtp = async () => {
    if (!isValidInput) { setError("Invalid mobile or email"); return; }

    // ── MOBILE OTP COMING SOON CHECK ──
    if (!isEmail) {
      setError(t.mobileOtpSoon);
      return;
    }

    setLoading(true); setError("");

    try {
      if (!isEmail) {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const formattedMobile = `+91${identifier}`;
        const confirmation = await signInWithPhoneNumber(auth, formattedMobile, appVerifier);
        setConfirmationResult(confirmation);
      } else {
        const res = await fetch("/api/auth/send-email-otp", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier.toLowerCase() }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
      }

      setStep("otp"); setTimer(30); setOtp(["", "", "", "", "", ""]);
      setTimeout(() => (document.getElementById("otp-inp-0") as HTMLInputElement)?.focus(), 80);
    } catch (err: any) {
      setError(err.message || t.error);
      if (!isEmail && window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((wId: any) => { window.grecaptcha.reset(wId); });
      }
    }
    setLoading(false);
  };

  // ── SMART OTP VERIFY ──
  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Enter all 6 digits"); return; }
    setLoading(true); setError("");

    try {
      let res;
      if (!isEmail) {
        if (!confirmationResult) throw new Error("Please request OTP first.");
        const result = await confirmationResult.confirm(otpStr);
        const idToken = await result.user.getIdToken();
        res = await fetch("/api/auth/verify-firebase", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, mobile: identifier }),
        });
      } else {
        res = await fetch("/api/auth/verify-email-otp", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier.toLowerCase(), otp: otpStr }),
        });
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (isResettingPass || !data.user?.password_hash) {
        setStep("set-password");
      } else {
        await onSuccess(); onClose();
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  // ── UNIFIED PASSWORD LOGIN ──
  const handlePasswordLogin = async () => {
    if (!password) { setError("Enter your password"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.toLowerCase(), password }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) { await onSuccess(); onClose(); }
      else { setError(data.message || t.error); }
    } catch { setError(t.error); }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    if (!isValidInput) { setError("Please enter your mobile or email above first."); return; }
    setIsResettingPass(true); setMode("otp"); handleSendOtp();
  };

  const handleSetPassword = async (skip = false) => {
    if (!skip && newPass.length < 6) { setError("Minimum 6 characters"); return; }
    setLoading(true);
    if (!skip) {
      await fetch("/api/auth/set-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPass }), credentials: "include",
      });
    }
    await onSuccess(); onClose();
  };

  const handleGoogleLogin = () => {
    const from = window.location.pathname;
    window.location.href = `/api/auth/google?from=${encodeURIComponent(from)}`;
  };

  // ── Shared Tailwind classes ──
  const inputCls =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:focus:ring-blue-950/60";
  const btnPrimaryCls =
    "w-full rounded-xl bg-blue-700 py-3.5 text-base font-bold text-white hover:bg-blue-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500";
  const segBtnCls = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-bold transition-colors ${
      active
        ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    }`;
  const errorCls =
    "mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-center text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.welcome}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-6 backdrop-blur-sm dark:bg-black/70"
      onClick={onClose}
      
    >
      <div id="recaptcha-container" />

      <div
        className="relative scroll-auto w-full h-[calc(100vh-50px)] max-w-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-white font-sans shadow-2xl dark:border-slate-700 dark:bg-[#111a2e]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          title="Close"
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition hover:bg-red-500 hover:text-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-500"
        >
          <X className="h-3 w-3" aria-hidden />
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 px-7 pb-3 pt-5 text-center dark:border-slate-700">
          <h2 className="text-xl font-medium text-slate-900 dark:text-white">Srilal CSC</h2>
          <p className="mt-1 text-[0.95rem] font-medium text-slate-500 dark:text-slate-400">
            {step === "number" ? t.subtitle : step === "otp" ? t.enterOtp : t.setPassTitle}
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-3">
          {/* ── VIEW TOGGLE: Form | QR ── */}
          <div className="mb-2 flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => {
                setView("form");
                if (pollRef.current) clearInterval(pollRef.current);
              }}
              className={segBtnCls(view === "form")}
            >
              <Mail className="h-3 w-3" aria-hidden /> Form
            </button>
            <button
              onClick={() => {
                setView("qr");
                if (!qrSid) initQr();
              }}
              className={segBtnCls(view === "qr")}
            >
              <QrCode className="h-3 w-3" aria-hidden /> QR Code
            </button>
          </div>

          {view === "qr" ? (
            <div className="py-2 text-center">
              {qrStatus === "loading" && (
                <p className="font-medium text-slate-500 dark:text-slate-400">Generating QR…</p>
              )}

              {qrStatus === "active" && (
                <>
                  <div className="inline-block rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700">
                    <QRCodeSVG value={qrSid} size={200} level="M" includeMargin />
                  </div>
                  <p className="mt-1 text-[0.9rem] font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                    Open <strong>Srilal CSC</strong> app → tap scanner → scan to login instantly
                  </p>
                </>
              )}

              {qrStatus === "expired" && (
                <>
                  <p className="mb-1 font-semibold text-red-600 dark:text-red-400">
                    QR expired. Please refresh.
                  </p>
                  <button onClick={initQr} className={`${btnPrimaryCls} w-auto px-6 py-2 text-sm`}>
                    Refresh QR
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* ── STEP: MOBILE NUMBER ── */}
              {step === "number" && (
                <>
                  {/* Mode Toggle */}
                  <div className="mb-2 flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
                    <button onClick={() => setMode("password")} className={segBtnCls(mode === "password")}>
                      <Lock className="h-3 w-3" aria-hidden /> {t.withPass}
                    </button>
                    <button onClick={() => setMode("otp")} className={segBtnCls(mode === "otp")}>
                      <Smartphone className="h-3 w-3" aria-hidden /> {t.withOtp}
                    </button>
                  </div>

                  {/* Identifier Input */}
                  <div className="relative mb-4">
                    {!isEmail && identifier.length > 0 && (
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-[0.95rem] font-semibold text-slate-500 dark:text-slate-400">
                        +91
                      </span>
                    )}
                    <input
                      type={isEmail ? "email" : "text"}
                      value={identifier}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d+$/.test(val) && val.length > 10) return;
                        setIdentifier(val.trim()); setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && (mode === "password" ? handlePasswordLogin() : handleSendOtp())}
                      placeholder={t.identPh}
                      autoFocus
                      className={`${inputCls} ${!isEmail && identifier.length > 0 ? "pl-[68px]" : ""}`}
                    />
                  </div>

                  {/* Password Input with Show/Hide */}
                  {mode === "password" && (
                    <>
                      <div className="relative mb-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          placeholder={t.passPh}
                          onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
                          className={`${inputCls} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Hide password" : "Show password"}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-400"
                        >
                          {showPassword ? <EyeOff className="h-3 w-3" aria-hidden /> : <Eye className="h-3 w-3" aria-hidden />}
                        </button>
                      </div>
                      <div className="mb-1 text-right">
                        <button
                          onClick={handleForgotPassword}
                          className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
                        >
                          {t.forgotPass}
                        </button>
                      </div>
                    </>
                  )}

                  {error && <div className={errorCls}>{error}</div>}

                  {/* Action Button */}
                  {mode === "password" ? (
                    <button
                      onClick={handlePasswordLogin}
                      disabled={loading || !isValidInput || !password}
                      className={btnPrimaryCls}
                    >
                      {loading ? t.loggingIn : t.login}
                    </button>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      disabled={loading || !isValidInput}
                      className={btnPrimaryCls}
                    >
                      {loading ? t.sending : t.sendOtp}
                    </button>
                  )}

                  {/* Divider */}
                  <div className="my-2 flex items-center text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    <span className="px-3">{t.orGoogle}</span>
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  </div>

                  {/* Google Button */}
                  <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-[0.95rem] font-bold text-slate-900 transition hover:border-blue-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-800 dark:hover:bg-slate-800/80"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t.google}
                  </button>

                  {/* New User Note */}
                  <p className="mt-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t.newUser}
                  </p>
                </>
              )}

              {/* ── STEP: OTP ── */}
              {step === "otp" && (
                <>
                  <p className="mb-2 text-center text-[0.9rem] text-slate-600 dark:text-slate-400">
                    {t.sentTo(identifier)}{" "}
                    <button
                      onClick={() => { setStep("number"); setError(""); }}
                      className="text-sm font-bold text-blue-700 hover:underline dark:text-blue-400"
                    >
                      {t.change}
                    </button>
                  </p>

                  {/* OTP Grid */}
                  <div className="mb-2 flex justify-center gap-2.5">
                    {otp.map((v, i) => (
                      <input
                        key={i}
                        id={`otp-inp-${i}`}
                        value={v}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        maxLength={1}
                        inputMode="numeric"
                        autoFocus={i === 0}
                        aria-label={`OTP digit ${i + 1}`}
                        className="h-14 w-12 rounded-xl border border-slate-300 bg-slate-50 text-center text-2xl font-extrabold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950/60"
                      />
                    ))}
                  </div>

                  {error && <div className={errorCls}>{error}</div>}

                  <button
                    onClick={handleVerify}
                    disabled={loading || otp.join("").length !== 6}
                    className={`${btnPrimaryCls} mb-4`}
                  >
                    {loading ? t.verifying : t.verify}
                  </button>

                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    {timer > 0 ? (
                      <span>{t.resendIn(timer)}</span>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
                      >
                        {t.resend}
                      </button>
                    )}
                  </p>
                </>
              )}

              {/* ── STEP: SET PASSWORD ── */}
              {step === "set-password" && (
                <>
                  <p className="mb-2 text-center text-[0.9rem] leading-relaxed text-slate-600 dark:text-slate-400">
                    {t.setPassNote}
                  </p>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => { setNewPass(e.target.value); setError(""); }}
                    placeholder={t.newPassPh}
                    onKeyDown={(e) => e.key === "Enter" && handleSetPassword(false)}
                    className={`${inputCls} mb-4`}
                  />

                  {error && <div className={errorCls}>{error}</div>}

                  <button
                    onClick={() => handleSetPassword(false)}
                    disabled={loading}
                    className={`${btnPrimaryCls} mb-3`}
                  >
                    {loading ? "..." : t.setPass}
                  </button>
                  {!isResettingPass && (
                    <button
                      onClick={() => handleSetPassword(true)}
                      className="w-full rounded-xl px-3 py-1 text-[0.95rem] font-bold text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-400"
                    >
                      {t.skip}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
