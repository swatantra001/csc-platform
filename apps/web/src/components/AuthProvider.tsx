// "use client";
// // components/AuthProvider.tsx
// // Global auth context — wraps the entire app
// // Provides: user, login status, login modal trigger, logout

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   type ReactNode,
// } from "react";
// import { useRouter } from "next/navigation";

// // ── Types ──────────────────────────────────────────────────────────────────
// export type UserRole = "user" | "co_admin" | "main_admin";
// export type Lang     = "hi" | "en";

// export interface AuthUser {
//   id: string;
//   mobile: string;
//   name: string | null;
//   role: UserRole;
//   wallet_balance: number;
//   preferred_lang: Lang;
//   position_label: string | null;
// }

// type LoginStep  = "number" | "otp" | "password" | "set-password";
// type LoginMode  = "otp" | "password";
// type OtpChannel = "sms" | "whatsapp";

// interface AuthContextType {
//   user: AuthUser | null;
//   loading: boolean;
//   isLoggedIn: boolean;
//   isAdmin: boolean;
//   isMainAdmin: boolean;
//   lang: Lang;
//   setLang: (l: Lang) => void;
//   openLogin: () => void;
//   closeLogin: () => void;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
//   // Login modal state (consumed by LoginModal component)
//   loginOpen: boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export function useAuth(): AuthContextType {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
//   return ctx;
// }

// // ── Provider ───────────────────────────────────────────────────────────────
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser]           = useState<AuthUser | null>(null);
//   const [loading, setLoading]     = useState(true);
//   const [loginOpen, setLoginOpen] = useState(false);
//   const [lang, setLangState]      = useState<Lang>("hi");
//   const router = useRouter();

//   // Fetch current user on mount
//   const refreshUser = useCallback(async () => {
//     try {
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       if (res.ok) {
//         const data = await res.json();
//         setUser(data.user ?? null);
//         if (data.user?.preferred_lang) setLangState(data.user.preferred_lang);
//       } else {
//         setUser(null);
//       }
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     refreshUser();
//     // Also read lang from cookie for unauthenticated users
//     const cookieLang = document.cookie.match(/csc_lang=([^;]+)/)?.[1] as Lang | undefined;
//     if (cookieLang) setLangState(cookieLang);
//   }, [refreshUser]);

//   const setLang = useCallback((l: Lang) => {
//     setLangState(l);
//     document.cookie = `csc_lang=${l};path=/;max-age=${60 * 60 * 24 * 365}`;
//     // Also persist for logged-in users
//     if (user) {
//       fetch("/api/user/update-lang", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ lang: l }),
//         credentials: "include",
//       }).catch(() => {});
//     }
//   }, [user]);

//   const logout = useCallback(async () => {
//     await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
//     setUser(null);
//     router.push("/");
//   }, [router]);

//   const openLogin  = useCallback(() => setLoginOpen(true),  []);
//   const closeLogin = useCallback(() => setLoginOpen(false), []);

//   const value: AuthContextType = {
//     user,
//     loading,
//     isLoggedIn:   !!user,
//     isAdmin:      user?.role === "co_admin" || user?.role === "main_admin",
//     isMainAdmin:  user?.role === "main_admin",
//     lang,
//     setLang,
//     openLogin,
//     closeLogin,
//     logout,
//     refreshUser,
//     loginOpen,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//       {/* Login modal is rendered here so it's available from anywhere */}
//       {loginOpen && <LoginModal onClose={closeLogin} onSuccess={refreshUser} lang={lang} />}
//     </AuthContext.Provider>
//   );
// }

// // ── Login Modal ────────────────────────────────────────────────────────────
// // Full OTP + Password + Set-Password flow, all in one modal
// interface LoginModalProps {
//   onClose: () => void;
//   onSuccess: () => Promise<void>;
//   lang: Lang;
// }

// const T = {
//   hi: {
//     welcome: "स्वागत है 🙏",
//     enterMobile: "अपना मोबाइल नंबर दर्ज करें",
//     enterOtp: "OTP दर्ज करें",
//     enterPass: "पासवर्ड दर्ज करें",
//     setPass: "नया पासवर्ड सेट करें",
//     sendOtp: "OTP भेजें",
//     waOtp: "WhatsApp पर OTP पाएं",
//     verifyOtp: "OTP सत्यापित करें",
//     loginPass: "लॉगिन करें",
//     setPassBtn: "पासवर्ड सेट करें",
//     skip: "अभी नहीं",
//     forgotPass: "पासवर्ड भूल गए?",
//     resend: "OTP दोबारा भेजें",
//     resendIn: (s: number) => `दोबारा भेजें (${s}s)`,
//     otpSentTo: (m: string) => `+91 ${m} पर OTP भेजा गया`,
//     change: "बदलें",
//     withOtp: "OTP से लॉगिन",
//     withPass: "पासवर्ड से",
//     newUser: "नए उपयोगकर्ता? OTP से पंजीकरण स्वचालित है।",
//     passPrompt: "लॉगिन को आसान बनाने के लिए पासवर्ड सेट करें (वैकल्पिक)",
//     mobilePh: "10 अंकों का मोबाइल नंबर",
//     passPh: "पासवर्ड दर्ज करें (न्यूनतम 6 अंक)",
//     continue: "आगे बढ़ें",
//     loggingIn: "लॉगिन हो रहा है...",
//     sending: "भेज रहे हैं...",
//     verifying: "सत्यापित हो रहा है...",
//   },
//   en: {
//     welcome: "Welcome 🙏",
//     enterMobile: "Enter your mobile number",
//     enterOtp: "Enter OTP",
//     enterPass: "Enter password",
//     setPass: "Set a new password",
//     sendOtp: "Send OTP",
//     waOtp: "Get OTP on WhatsApp",
//     verifyOtp: "Verify OTP",
//     loginPass: "Login",
//     setPassBtn: "Set Password",
//     skip: "Skip for now",
//     forgotPass: "Forgot password?",
//     resend: "Resend OTP",
//     resendIn: (s: number) => `Resend in ${s}s`,
//     otpSentTo: (m: string) => `OTP sent to +91 ${m}`,
//     change: "Change",
//     withOtp: "Login with OTP",
//     withPass: "With Password",
//     newUser: "New user? Registration is automatic with OTP.",
//     passPrompt: "Set a password for easier future logins (optional)",
//     mobilePh: "10-digit mobile number",
//     passPh: "Enter password (min 6 characters)",
//     continue: "Continue",
//     loggingIn: "Logging in...",
//     sending: "Sending...",
//     verifying: "Verifying...",
//   },
// };

// function LoginModal({ onClose, onSuccess, lang }: LoginModalProps) {
//   const t = T[lang];
//   const [step, setStep]         = useState<LoginStep>("number");
//   const [mode, setMode]         = useState<LoginMode>("otp");
//   const [mobile, setMobile]     = useState("");
//   const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
//   const [password, setPassword] = useState("");
//   const [newPass, setNewPass]   = useState("");
//   const [timer, setTimer]       = useState(0);
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState("");
//   const [devOtp, setDevOtp]     = useState(""); // dev only
//   const otpRefs = Array.from({ length: 6 }, () => useState<HTMLInputElement | null>(null));

//   useEffect(() => {
//     if (timer <= 0) return;
//     const id = setInterval(() => setTimer((t) => t - 1), 1000);
//     return () => clearInterval(id);
//   }, [timer]);

//   const handleSendOtp = async (channel: OtpChannel = "sms") => {
//     if (!/^[6-9]\d{9}$/.test(mobile)) {
//       setError("Invalid mobile number");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobile, channel }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setStep("otp");
//         setTimer(30);
//         setOtp(["", "", "", "", "", ""]);
//         if (data.devOtp) setDevOtp(data.devOtp); // show in dev
//       } else {
//         setError(data.message);
//       }
//     } catch {
//       setError("Network error. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const otpStr = otp.join("");
//     if (otpStr.length !== 6) { setError("Enter all 6 digits"); return; }
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobile, otp: otpStr }),
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (data.success) {
//         // If new user (no name), offer to set password
//         if (!data.user?.name) {
//           setStep("set-password");
//         } else {
//           await onSuccess();
//           onClose();
//         }
//       } else {
//         setError(data.message);
//       }
//     } catch {
//       setError("Network error. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordLogin = async () => {
//     if (!password) { setError("Enter your password"); return; }
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/auth/login-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobile, password }),
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (data.success) {
//         await onSuccess();
//         onClose();
//       } else {
//         setError(data.message);
//       }
//     } catch {
//       setError("Network error. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSetPassword = async (skip = false) => {
//     if (!skip && newPass.length < 6) { setError("Minimum 6 characters"); return; }
//     if (!skip) {
//       setLoading(true);
//       try {
//         await fetch("/api/auth/set-password", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ password: newPass }),
//           credentials: "include",
//         });
//       } catch {}
//       setLoading(false);
//     }
//     await onSuccess();
//     onClose();
//   };

//   const handleOtpInput = (i: number, val: string) => {
//     const digit = val.replace(/\D/, "").slice(-1);
//     const next = [...otp];
//     next[i] = digit;
//     setOtp(next);
//     if (digit && i < 5) {
//       (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Backspace" && !otp[i] && i > 0) {
//       (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
//     }
//     if (e.key === "Enter") handleVerifyOtp();
//   };

//   // Colors (matches landing page palette)
//   const accent  = "#c45c1a";
//   const navy    = "#1a3a5c";
//   const surface = "#fafaf7";
//   const border  = "#e2ddd5";
//   const textCol = "#1a1612";
//   const textMid = "#6b6259";
//   const textLt  = "#a09a90";
//   const successGreen = "#25d366";

//   const inputStyle: React.CSSProperties = {
//     width: "100%", padding: "11px 14px",
//     border: `1.5px solid ${border}`, borderRadius: 8,
//     background: surface, color: textCol,
//     fontSize: 14, outline: "none",
//     fontFamily: "inherit", transition: "border-color 0.2s",
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes modalIn { from{opacity:0;transform:translateY(12px) scale(0.98);} to{opacity:1;transform:translateY(0) scale(1);} }
//         @keyframes bgIn    { from{opacity:0;} to{opacity:1;} }
//         .modal-input:focus { border-color: ${accent} !important; }
//         .modal-input::placeholder { color: ${textLt}; }
//         .wa-btn { background: ${successGreen}; border:none; border-radius:8px; color:#fff; padding:10px 16px; font-size:13px; font-weight:700; cursor:pointer; width:100%; display:flex;align-items:center;justify-content:center;gap:8px; font-family:inherit; transition:background 0.15s; }
//         .wa-btn:hover { background:#1da851; }
//         .primary-btn { background:${accent}; border:none; border-radius:8px; color:#fff; padding:12px; font-size:14px; font-weight:700; cursor:pointer; width:100%; font-family:inherit; transition:background 0.15s; }
//         .primary-btn:hover { background:#a34a12; }
//         .primary-btn:disabled { background:#d0c0b0; cursor:not-allowed; }
//         .ghost-btn { background:transparent; border:1.5px solid ${border}; border-radius:8px; color:${textMid}; padding:10px; font-size:13px; font-weight:600; cursor:pointer; width:100%; font-family:inherit; transition:all 0.15s; }
//         .ghost-btn:hover { border-color:${accent}; color:${accent}; }
//         .mode-btn { flex:1; padding:9px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.15s; border:1.5px solid; }
//         .otp-inp { width:44px; height:52px; border:1.5px solid ${border}; border-radius:8px; background:${surface}; color:${textCol}; font-size:20px; font-weight:700; text-align:center; outline:none; transition:border-color 0.2s; font-family:inherit; }
//         .otp-inp:focus { border-color:${accent}; }
//         .link-btn { background:none; border:none; color:${accent}; cursor:pointer; font-size:13px; font-weight:700; font-family:inherit; padding:0; }
//         .link-btn:disabled { color:${textLt}; cursor:default; }
//       `}</style>

//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
//           zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
//           padding: 16, animation: "bgIn 0.2s ease",
//         }}
//       >
//         {/* Modal box */}
//         <div
//           onClick={(e) => e.stopPropagation()}
//           style={{
//             background: "#fff", borderRadius: 16, width: "100%", maxWidth: 380,
//             padding: "32px 28px", position: "relative",
//             animation: "modalIn 0.25s ease",
//             boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//             fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
//           }}
//         >
//           {/* Close */}
//           <button
//             onClick={onClose}
//             style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: textMid }}
//           >✕</button>

//           {/* Header */}
//           <div style={{ marginBottom: 24 }}>
//             <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 22, fontWeight: 700, color: textCol, marginBottom: 4 }}>
//               {t.welcome}
//             </div>
//             <div style={{ fontSize: 13, color: textMid }}>
//               {step === "number"   ? t.enterMobile :
//                step === "otp"     ? t.enterOtp :
//                step === "password"? t.enterPass :
//                t.setPass}
//             </div>
//           </div>

//           {/* ── STEP: NUMBER ── */}
//           {step === "number" && (
//             <>
//               <div style={{ position: "relative", marginBottom: 14 }}>
//                 <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: textMid, fontSize: 14, userSelect: "none" }}>🇮🇳 +91</span>
//                 <input
//                   className="modal-input"
//                   style={{ ...inputStyle, paddingLeft: 70 }}
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   value={mobile}
//                   onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
//                   placeholder={t.mobilePh}
//                   onKeyDown={(e) => e.key === "Enter" && mode === "otp" && handleSendOtp()}
//                   autoFocus
//                 />
//               </div>

//               {/* Mode toggle */}
//               <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//                 {(["otp", "password"] as LoginMode[]).map((m) => (
//                   <button
//                     key={m}
//                     onClick={() => setMode(m)}
//                     className="mode-btn"
//                     style={{
//                       background: mode === m ? "#fff5f0" : "transparent",
//                       borderColor: mode === m ? accent : border,
//                       color: mode === m ? accent : textMid,
//                     }}
//                   >
//                     {m === "otp" ? t.withOtp : t.withPass}
//                   </button>
//                 ))}
//               </div>

//               {error && <div style={{ color: "#c0392b", fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{error}</div>}

//               {mode === "otp" ? (
//                 <>
//                   <button
//                     className="primary-btn"
//                     onClick={() => handleSendOtp("sms")}
//                     disabled={loading || mobile.length !== 10}
//                     style={{ marginBottom: 10 }}
//                   >
//                     {loading ? t.sending : t.sendOtp}
//                   </button>
//                   <div style={{ textAlign: "center", fontSize: 12, color: textLt, marginBottom: 10 }}>
//                     — {lang === "hi" ? "या" : "or"} —
//                   </div>
//                   <button className="wa-btn" onClick={() => handleSendOtp("whatsapp")} disabled={loading || mobile.length !== 10}>
//                     💬 {t.waOtp}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <div style={{ position: "relative", marginBottom: 14 }}>
//                     <input
//                       className="modal-input"
//                       style={inputStyle}
//                       type="password"
//                       value={password}
//                       onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                       placeholder={t.passPh}
//                       onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
//                     />
//                   </div>
//                   <div style={{ textAlign: "right", marginBottom: 14 }}>
//                     <button className="link-btn" onClick={() => { setMode("otp"); handleSendOtp("sms"); }}>
//                       {t.forgotPass}
//                     </button>
//                   </div>
//                   <button
//                     className="primary-btn"
//                     onClick={handlePasswordLogin}
//                     disabled={loading}
//                   >
//                     {loading ? t.loggingIn : t.loginPass}
//                   </button>
//                 </>
//               )}

//               <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: textLt }}>{t.newUser}</div>
//             </>
//           )}

//           {/* ── STEP: OTP ── */}
//           {step === "otp" && (
//             <>
//               <div style={{ fontSize: 12, color: textMid, marginBottom: 14 }}>
//                 {t.otpSentTo(mobile)}{" "}
//                 <button className="link-btn" onClick={() => { setStep("number"); setError(""); }}>{t.change}</button>
//               </div>

//               {/* Dev OTP hint */}
//               {devOtp && (
//                 <div style={{ background: "#f0faf0", border: "1px solid #90d090", borderRadius: 6, padding: "6px 12px", marginBottom: 12, fontSize: 12, color: "#1a6a1a" }}>
//                   🔧 Dev OTP: <strong>{devOtp}</strong>
//                 </div>
//               )}

//               {/* 6-box OTP input */}
//               <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
//                 {otp.map((v, i) => (
//                   <input
//                     key={i}
//                     id={`otp-${i}`}
//                     className="otp-inp"
//                     value={v}
//                     onChange={(e) => handleOtpInput(i, e.target.value)}
//                     onKeyDown={(e) => handleOtpKeyDown(i, e)}
//                     maxLength={1}
//                     inputMode="numeric"
//                     autoFocus={i === 0}
//                   />
//                 ))}
//               </div>

//               {error && <div style={{ color: "#c0392b", fontSize: 12, marginBottom: 10, fontWeight: 600, textAlign: "center" }}>{error}</div>}

//               <button
//                 className="primary-btn"
//                 onClick={handleVerifyOtp}
//                 disabled={loading || otp.join("").length !== 6}
//                 style={{ marginBottom: 12 }}
//               >
//                 {loading ? t.verifying : t.verifyOtp}
//               </button>

//               <div style={{ textAlign: "center", fontSize: 13, color: textMid }}>
//                 {timer > 0 ? (
//                   <span style={{ color: textLt }}>{t.resendIn(timer)}</span>
//                 ) : (
//                   <button className="link-btn" onClick={() => handleSendOtp("sms")}>{t.resend}</button>
//                 )}
//               </div>
//             </>
//           )}

//           {/* ── STEP: SET PASSWORD (optional, after first OTP login) ── */}
//           {step === "set-password" && (
//             <>
//               <div style={{ fontSize: 12, color: textMid, marginBottom: 16, lineHeight: 1.6 }}>{t.passPrompt}</div>
//               <input
//                 className="modal-input"
//                 style={{ ...inputStyle, marginBottom: 14 }}
//                 type="password"
//                 value={newPass}
//                 onChange={(e) => { setNewPass(e.target.value); setError(""); }}
//                 placeholder={t.passPh}
//                 onKeyDown={(e) => e.key === "Enter" && handleSetPassword(false)}
//               />
//               {error && <div style={{ color: "#c0392b", fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{error}</div>}
//               <button className="primary-btn" onClick={() => handleSetPassword(false)} disabled={loading} style={{ marginBottom: 10 }}>
//                 {loading ? "..." : t.setPassBtn}
//               </button>
//               <button className="ghost-btn" onClick={() => handleSetPassword(true)}>{t.skip}</button>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }















// "use client";
// // components/AuthProvider.tsx
// // Global auth context — wraps the entire app
// // Imports LoginModal (separate file) — no embedded modal here

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   type ReactNode,
// } from "react";
// import { useRouter } from "next/navigation";
// import LoginModal from "./LoginModal";

// // ── Types ──────────────────────────────────────────────────────────────────
// export type UserRole = "user" | "co_admin" | "main_admin";
// export type Lang     = "hi" | "en";

// export interface AuthUser {
//   id:             string;
//   mobile:         string | null;
//   email:          string | null;
//   name:           string | null;
//   role:           UserRole;
//   wallet_balance: number;
//   preferred_lang: Lang;
//   position_label: string | null;
//   created_at:    string;
// }

// interface AuthContextType {
//   user:          AuthUser | null;
//   loading:       boolean;
//   isLoggedIn:    boolean;
//   isAdmin:       boolean;
//   isMainAdmin:   boolean;
//   lang:          Lang;
//   dark:          boolean;
//   setLang:       (l: Lang) => void;
//   setDark:       (d: boolean) => void;
//   openLogin:     () => void;
//   closeLogin:    () => void;
//   logout:        () => Promise<void>;
//   refreshUser:   () => Promise<void>;
//   loginOpen:     boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export function useAuth(): AuthContextType {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
//   return ctx;
// }

// // ── Provider ───────────────────────────────────────────────────────────────
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser]           = useState<AuthUser | null>(null);
//   const [loading, setLoading]     = useState(true);
//   const [loginOpen, setLoginOpen] = useState(false);
//   const [lang, setLangState]      = useState<Lang>("en");
//   const [dark, setDarkState]      = useState(false);
//   const router = useRouter();

//   // ── Read theme + lang from cookies / system on mount ──────────────────
//   useEffect(() => {
//     // Dark mode — system preference first, then cookie override
//     const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const cookieTheme = document.cookie.match(/csc_theme=([^;]+)/)?.[1];
//     const isDark = cookieTheme ? cookieTheme === "dark" : sysDark;
//     setDarkState(isDark);
//     document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

//     // Lang — cookie first, then "en" default
//     const cookieLang = document.cookie.match(/csc_lang=([^;]+)/)?.[1] as Lang | undefined;
//     if (cookieLang === "hi" || cookieLang === "en") setLangState(cookieLang);

//     // Listen for system dark mode changes
//     const mq = window.matchMedia("(prefers-color-scheme: dark)");
//     const handler = (e: MediaQueryListEvent) => {
//       // Only follow system if user hasn't set a manual preference
//       if (!document.cookie.match(/csc_theme=/)) {
//         setDarkState(e.matches);
//         document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
//       }
//     };
//     mq.addEventListener("change", handler);
//     return () => mq.removeEventListener("change", handler);
//   }, []);

//   // ── Check URL for login trigger (e.g. /?login=1 from redirects) ───────
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     if (params.get("login") === "1") {
//       setLoginOpen(true);
//       // Remove the param from URL without reload
//       const url = new URL(window.location.href);
//       url.searchParams.delete("login");
//       window.history.replaceState({}, "", url.toString());
//     }
//     // Show error from Google OAuth failure
//     const error = params.get("error");
//     if (error) {
//       console.warn("[Auth] OAuth error:", error);
//       setLoginOpen(true);
//       const url = new URL(window.location.href);
//       url.searchParams.delete("error");
//       window.history.replaceState({}, "", url.toString());
//     }
//   }, []);

//   // ── Fetch current user from JWT cookie ────────────────────────────────
//   const refreshUser = useCallback(async () => {
//     try {
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       if (res.ok) {
//         const data = await res.json();
//         const u = data.user ?? null;
//         setUser(u);
//         if (u?.preferred_lang) setLangState(u.preferred_lang as Lang);
//       } else {
//         setUser(null);
//       }
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     refreshUser();
//   }, [refreshUser]);

//   // ── Setters ───────────────────────────────────────────────────────────
//   const setLang = useCallback((l: Lang) => {
//     setLangState(l);
//     // Persist in cookie (365 days)
//     document.cookie = `csc_lang=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
//     // Persist in DB for logged-in users
//     fetch("/api/user/profile", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ preferred_lang: l }),
//       credentials: "include",
//     }).catch(() => {});
//   }, []);

//   const setDark = useCallback((d: boolean) => {
//     setDarkState(d);
//     document.documentElement.setAttribute("data-theme", d ? "dark" : "light");
//     document.cookie = `csc_theme=${d ? "dark" : "light"};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
//   }, []);

//   const logout = useCallback(async () => {
//     await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
//     setUser(null);
//     router.push("/");
//   }, [router]);

//   const openLogin  = useCallback(() => setLoginOpen(true),  []);
//   const closeLogin = useCallback(() => setLoginOpen(false), []);

//   const value: AuthContextType = {
//     user,
//     loading,
//     isLoggedIn:   !!user,
//     isAdmin:      user?.role === "co_admin" || user?.role === "main_admin",
//     isMainAdmin:  user?.role === "main_admin",
//     lang,
//     dark,
//     setLang,
//     setDark,
//     openLogin,
//     closeLogin,
//     logout,
//     refreshUser,
//     loginOpen,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//       {loginOpen && (
//         <LoginModal
//           lang={lang}
//           dark={dark}
//           onClose={closeLogin}
//           onSuccess={refreshUser}
//         />
//       )}
//     </AuthContext.Provider>
//   );
// }



















"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";

// ── Types ──────────────────────────────────────────────────────────────────
export type UserRole = "user" | "co_admin" | "main_admin";
export type Lang     = "hi" | "en";

export interface AuthUser {
  id:             string;
  mobile:         string | null;
  email:          string | null;
  name:           string | null;
  role:           UserRole;
  wallet_balance: number;
  preferred_lang: Lang;
  position_label: string | null;
  created_at:    string;
}

interface AuthContextType {
  user:          AuthUser | null;
  loading:       boolean;
  isLoggedIn:    boolean;
  isAdmin:       boolean;
  isMainAdmin:   boolean;
  lang:          Lang;
  dark:          boolean;
  setLang:       (l: Lang) => void;
  setDark:       (d: boolean) => void;
  openLogin:     () => void;
  closeLogin:    () => void;
  logout:        () => Promise<void>;
  refreshUser:   () => Promise<void>;
  loginOpen:     boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS — Mutable type
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
    pageBg:            "#f1f5f9",
    navBg:             "#1e3a8a",
    navBottomBorder:   "#3b82f6",
    navText:           "rgba(255,255,255,0.65)",
    navTextHover:      "#ffffff",
    navBrand:          "#ffffff",
    navBrandAccent:    "#93c5fd",
    cardBg:            "#ffffff",
    cardBorder:        "#e2e8f0",
    cardShadow:        "0 1px 4px rgba(0,0,0,0.07)",
    sectionGrad:       "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
    sectionGradText:   "#ffffff",
    textPrimary:       "#1e293b",
    textSecondary:     "#475569",
    textMuted:         "#94a3b8",
    accent:            "#2563eb",
    accentHover:       "#1d4ed8",
    accentLight:       "#eff6ff",
    accentBorder:      "#bfdbfe",
    inputBg:           "#f8fafc",
    inputBorder:       "#e2e8f0",
    inputFocusBorder:  "#3b82f6",
    inputText:         "#1e293b",
    inputPlaceholder:  "#94a3b8",
    divider:           "#e2e8f0",
    pillBg:            "#f1f5f9",
    pillBorder:        "#e2e8f0",
    pillText:          "#64748b",
    pillActiveBg:      "#dbeafe",
    pillActiveBorder:  "#93c5fd",
    pillActiveText:    "#1d4ed8",
    btnPrimary:        "linear-gradient(135deg,#2563eb,#1d4ed8)",
    btnPrimaryText:    "#ffffff",
    btnPrimaryGlow:    "rgba(37,99,235,0.35)",
    btnGhostBg:        "#f1f5f9",
    btnGhostBorder:    "#e2e8f0",
    btnGhostText:      "#475569",
    btnGhostHoverBg:   "#eff6ff",
    btnGhostHoverText: "#2563eb",
    btnDangerBg:       "#fef2f2",
    btnDangerBorder:   "#fecaca",
    btnDangerText:     "#dc2626",
    btnSuccessBg:      "linear-gradient(135deg,#15803d,#16a34a)",
    btnSuccessText:    "#ffffff",
    modalOverlay:      "rgba(15,23,42,0.55)",
    modalBg:           "#ffffff",
    modalBorder:       "#e2e8f0",
    scrollThumb:       "#bfdbfe",
    toggleIcon:        "🌙",
    toggleLabel:       "Dark",
  },
  dark: {
    pageBg:            "#060b14",
    navBg:             "rgba(6,11,20,0.98)",
    navBottomBorder:   "#f59e0b",
    navText:           "rgba(255,255,255,0.45)",
    navTextHover:      "#ffffff",
    navBrand:          "#ffffff",
    navBrandAccent:    "#f59e0b",
    cardBg:            "rgba(255,255,255,0.03)",
    cardBorder:        "rgba(255,255,255,0.08)",
    cardShadow:        "0 1px 4px rgba(0,0,0,0.3)",
    sectionGrad:       "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
    sectionGradText:   "#000000",
    textPrimary:       "#f1f5f9",
    textSecondary:     "rgba(255,255,255,0.55)",
    textMuted:         "rgba(255,255,255,0.28)",
    accent:            "#f59e0b",
    accentHover:       "#d97706",
    accentLight:       "rgba(245,158,11,0.08)",
    accentBorder:      "rgba(245,158,11,0.25)",
    inputBg:           "rgba(255,255,255,0.05)",
    inputBorder:       "rgba(255,255,255,0.08)",
    inputFocusBorder:  "rgba(245,158,11,0.5)",
    inputText:         "#f1f5f9",
    inputPlaceholder:  "rgba(255,255,255,0.25)",
    divider:           "rgba(255,255,255,0.06)",
    pillBg:            "rgba(255,255,255,0.03)",
    pillBorder:        "rgba(255,255,255,0.08)",
    pillText:          "rgba(255,255,255,0.4)",
    pillActiveBg:      "rgba(245,158,11,0.15)",
    pillActiveBorder:  "rgba(245,158,11,0.4)",
    pillActiveText:    "#f59e0b",
    btnPrimary:        "linear-gradient(135deg,#f59e0b,#d97706)",
    btnPrimaryText:    "#000000",
    btnPrimaryGlow:    "rgba(245,158,11,0.35)",
    btnGhostBg:        "rgba(255,255,255,0.05)",
    btnGhostBorder:    "rgba(255,255,255,0.1)",
    btnGhostText:      "rgba(255,255,255,0.7)",
    btnGhostHoverBg:   "rgba(245,158,11,0.1)",
    btnGhostHoverText: "#f59e0b",
    btnDangerBg:       "rgba(239,68,68,0.1)",
    btnDangerBorder:   "rgba(239,68,68,0.25)",
    btnDangerText:     "#f87171",
    btnSuccessBg:      "linear-gradient(135deg,#10b981,#059669)",
    btnSuccessText:    "#ffffff",
    modalOverlay:      "rgba(0,0,0,0.85)",
    modalBg:           "#0f172a",
    modalBorder:       "rgba(255,255,255,0.1)",
    scrollThumb:       "rgba(245,158,11,0.3)",
    toggleIcon:        "☀️",
    toggleLabel:       "Light",
  },
};

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<AuthUser | null>(null);
  const [loading, setLoading]     = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [lang, setLangState]      = useState<Lang>("en");
  const [dark, setDarkState]      = useState(false);
  const router = useRouter();

  // ── Read theme + lang from cookies / system on mount ──────────────────
  useEffect(() => {
    // Dark mode — system preference first, then cookie override
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const cookieTheme = document.cookie.match(/csc_theme=([^;]+)/)?.[1];
    const isDark = cookieTheme ? cookieTheme === "dark" : sysDark;
    setDarkState(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

    // Lang — cookie first, then "en" default
    const cookieLang = document.cookie.match(/csc_lang=([^;]+)/)?.[1] as Lang | undefined;
    if (cookieLang === "hi" || cookieLang === "en") setLangState(cookieLang);

    // Listen for system dark mode changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't set a manual preference
      if (!document.cookie.match(/csc_theme=/)) {
        setDarkState(e.matches);
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Check URL for login trigger (e.g. /?login=1 from redirects) ───────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      setLoginOpen(true);
      // Remove the param from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url.toString());
    }
    // Show error from Google OAuth failure
    const error = params.get("error");
    if (error) {
      console.warn("[Auth] OAuth error:", error);
      setLoginOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // ── Fetch current user from JWT cookie ────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const u = data.user ?? null;
        setUser(u);
        if (u?.preferred_lang) setLangState(u.preferred_lang as Lang);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ── Setters ───────────────────────────────────────────────────────────
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // Persist in cookie (365 days)
    document.cookie = `csc_lang=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    // Persist in DB for logged-in users
    fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferred_lang: l }),
      credentials: "include",
    }).catch(() => {});
  }, []);

  const setDark = useCallback((d: boolean) => {
    setDarkState(d);
    document.documentElement.setAttribute("data-theme", d ? "dark" : "light");
    document.cookie = `csc_theme=${d ? "dark" : "light"};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/");
  }, [router]);

  const openLogin  = useCallback(() => setLoginOpen(true),  []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const value: AuthContextType = {
    user,
    loading,
    isLoggedIn:   !!user,
    isAdmin:      user?.role === "co_admin" || user?.role === "main_admin",
    isMainAdmin:  user?.role === "main_admin",
    lang,
    dark,
    setLang,
    setDark,
    openLogin,
    closeLogin,
    logout,
    refreshUser,
    loginOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {loginOpen && (
        <LoginModal
          lang={lang}
          dark={dark}
          onClose={closeLogin}
          onSuccess={refreshUser}
        />
      )}
    </AuthContext.Provider>
  );
}