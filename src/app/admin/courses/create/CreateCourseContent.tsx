// "use client";

// import React, { useState, useEffect, useCallback, KeyboardEvent, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { adminCreateCourseAction, adminUpdateCourseAction, adminGetCourseAction } from "@/app/actions/courses";
// import { useAuth } from "@/components/AuthProvider";

// // ─── TYPES ────────────────────────────────────────────────────────────────────
// interface SyllabusItem { topic: string; topic_hi: string; hours: number; }
// type ToastType = "success" | "error" | "info";
// interface Toast { id: number; message: string; type: ToastType; }

// // ─── CONSTANTS ────────────────────────────────────────────────────────────────
// const CATEGORIES = ["Computer Course", "Diploma", "Certification", "Typing", "Programming", "Hardware", "Networking", "Digital Marketing", "Tally", "Graphic Design"];
// const THEMES = ["blue", "green", "red", "orange", "purple", "teal", "indigo", "rose"];
// const DURATIONS = ["1 Month", "2 Months", "3 Months", "4 Months", "6 Months", "1 Year", "2 Years"];

// const LLM_PROMPT = `You are a data extraction assistant for a Computer Training Center portal. Based on the course details I provide, generate a structured JSON object with ALL fields filled accurately.

// Return ONLY valid JSON with this exact structure (no markdown, no preamble, no code fences):

// {
//   "title": "Full English title of the course e.g. Advanced Diploma in Computer Applications (ADCA)",
//   "title_hi": "Hindi title",
//   "short_desc": "2-3 sentence English description of the course",
//   "full_desc": "Detailed description covering what students will learn, career opportunities, and course outcomes",
//   "full_desc_hi": "Hindi detailed description",
//   "category": "One of: Computer Course, Diploma, Certification, Typing, Programming, Hardware, Networking, Digital Marketing, Tally, Graphic Design",
//   "theme": "One of: blue, green, red, orange, purple, teal, indigo, rose",
//   "duration": "e.g. 3 Months",
//   "duration_hi": "e.g. 3 महीने",
//   "fee": 5000,
//   "prebook_amount": 500,
//   "max_seats": 20,
//   "start_date": "YYYY-MM-DD",
//   "eligibility": "e.g. 10th Pass / 12th Pass / Graduate",
//   "eligibility_hi": "Hindi eligibility",
//   "certification": "e.g. NSQF Level 4 / ISO Certified / Government Recognized",
//   "certification_hi": "Hindi certification",
//   "tags": ["tag1", "tag2", "tag3"],
//   "syllabus": [
//     { "topic": "Computer Fundamentals", "topic_hi": "कंप्यूटर की बुनियादी जानकारी", "hours": 20 },
//     { "topic": "MS Office Suite", "topic_hi": "एमएस ऑफिस सूट", "hours": 40 },
//     { "topic": "Internet & Email", "topic_hi": "इंटरनेट और ईमेल", "hours": 15 }
//   ]
// }

// Now generate the JSON for the following course details:
// [PASTE YOUR COURSE DETAILS HERE — course name, duration, fee, topics, eligibility, etc.]`;

// const ONBOARDING = [
//   { icon: "🤖", title: "Step 1 – Copy the LLM Prompt", desc: 'Click "Copy LLM Prompt" at the top of this page. This copies a pre-built instruction for any AI like ChatGPT, Claude, or Gemini.' },
//   { icon: "📋", title: "Step 2 – Paste into your AI", desc: "Open your favourite AI assistant, paste the prompt, and add the raw course details at the bottom where indicated." },
//   { icon: "✨", title: "Step 3 – Copy the JSON", desc: "The AI will return a clean JSON object with all fields filled accurately. Copy that entire JSON response." },
//   { icon: "⌨️", title: "Step 4 – Press Ctrl+V here!", desc: "Return to this page and press Ctrl+V (Cmd+V on Mac) anywhere. All form fields will instantly populate!" },
//   { icon: "🚀", title: "Step 5 – Review & Publish", desc: "Review the auto-filled fields, make any manual corrections, then click Publish Course. Done!" },
// ];

// const THEMES_TOKENS = {
//   light: {
//     pageBg: "#f1f5f9", navBg: "#1e3a8a", navBottomBorder: "#3b82f6",
//     navText: "rgba(255,255,255,0.65)", navTextHover: "#ffffff", navActiveBg: "#3b82f6", navActiveText: "#ffffff",
//     navBrand: "#ffffff", navBrandAccent: "#93c5fd",
//     cardBg: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 4px rgba(0,0,0,0.07)",
//     sectionGrad: "linear-gradient(135deg,#1d4ed8,#2563eb)", sectionGradText: "#ffffff",
//     textPrimary: "#1e293b", textSecondary: "#475569", textMuted: "#94a3b8",
//     accent: "#2563eb", accentHover: "#1d4ed8", accentLight: "#eff6ff", accentBorder: "#bfdbfe",
//     inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputFocusBorder: "#3b82f6", inputText: "#1e293b", inputPlaceholder: "#94a3b8",
//     divider: "#e2e8f0", pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#64748b",
//     pillActiveBg: "#dbeafe", pillActiveBorder: "#93c5fd", pillActiveText: "#1d4ed8",
//     rowHover: "#f8fafc", tagBg: "#dbeafe", tagText: "#1d4ed8",
//     btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)", btnPrimaryText: "#ffffff", btnPrimaryGlow: "rgba(37,99,235,0.35)",
//     btnGhostBg: "#f1f5f9", btnGhostBorder: "#e2e8f0", btnGhostText: "#475569",
//     btnGhostHoverBg: "#eff6ff", btnGhostHoverText: "#2563eb",
//     btnDangerBg: "#fef2f2", btnDangerBorder: "#fecaca", btnDangerText: "#dc2626",
//     btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)", btnSuccessText: "#ffffff",
//     modalOverlay: "rgba(15,23,42,0.55)", modalBg: "#ffffff", modalBorder: "#e2e8f0",
//     scrollThumb: "#bfdbfe", toggleIcon: "🌙", toggleLabel: "Dark",
//   },
//   dark: {
//     pageBg: "#060b14", navBg: "rgba(6,11,20,0.98)", navBottomBorder: "#f59e0b",
//     navText: "rgba(255,255,255,0.45)", navTextHover: "#ffffff", navActiveBg: "rgba(245,158,11,0.18)", navActiveText: "#f59e0b",
//     navBrand: "#ffffff", navBrandAccent: "#f59e0b",
//     cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.08)", cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
//     sectionGrad: "linear-gradient(135deg,#b45309,#d97706)", sectionGradText: "#000000",
//     textPrimary: "#f1f5f9", textSecondary: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.28)",
//     accent: "#f59e0b", accentHover: "#d97706", accentLight: "rgba(245,158,11,0.08)", accentBorder: "rgba(245,158,11,0.25)",
//     inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)", inputFocusBorder: "rgba(245,158,11,0.5)",
//     inputText: "#f1f5f9", inputPlaceholder: "rgba(255,255,255,0.25)",
//     divider: "rgba(255,255,255,0.06)", pillBg: "rgba(255,255,255,0.03)", pillBorder: "rgba(255,255,255,0.08)",
//     pillText: "rgba(255,255,255,0.4)", pillActiveBg: "rgba(245,158,11,0.15)", pillActiveBorder: "rgba(245,158,11,0.4)", pillActiveText: "#f59e0b",
//     rowHover: "rgba(255,255,255,0.03)", tagBg: "rgba(245,158,11,0.15)", tagText: "#f59e0b",
//     btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)", btnPrimaryText: "#000000", btnPrimaryGlow: "rgba(245,158,11,0.35)",
//     btnGhostBg: "rgba(255,255,255,0.05)", btnGhostBorder: "rgba(255,255,255,0.1)", btnGhostText: "rgba(255,255,255,0.7)",
//     btnGhostHoverBg: "rgba(245,158,11,0.1)", btnGhostHoverText: "#f59e0b",
//     btnDangerBg: "rgba(239,68,68,0.1)", btnDangerBorder: "rgba(239,68,68,0.25)", btnDangerText: "#f87171",
//     btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)", btnSuccessText: "#ffffff",
//     modalOverlay: "rgba(0,0,0,0.85)", modalBg: "#0f172a", modalBorder: "rgba(255,255,255,0.1)",
//     scrollThumb: "rgba(245,158,11,0.3)", toggleIcon: "☀️", toggleLabel: "Light",
//   },
// } as const;

// type ThemeTokens = typeof THEMES_TOKENS.light;

// const NAV_LINKS = [
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin" : "http://localhost:3000/admin", icon: "👮", label: "Admin" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/posts" : "http://localhost:3000/admin/posts", icon: "✏️", label: "Posts" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/courses" : "http://localhost:3000/admin/courses", icon: "🎓", label: "Courses" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/galary" : "http://localhost:3000/admin/galary", icon: "🖼️", label: "Gallery" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/forms" : "http://localhost:3000/admin/forms", icon: "📋", label: "Forms" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/transactions" : "http://localhost:3000/admin/transactions", icon: "💳", label: "Transactions" },
//   { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/admin/analytics" : "http://localhost:3000/admin/analytics", icon: "📊", label: "Analytics" },
// ];

// const Ico = {
//   X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
//   Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
//   Check: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
//   Back: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>,
//   Robot: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><circle cx="8" cy="15" r="1" /><circle cx="16" cy="15" r="1" /></svg>,
//   Doc: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
// };

// function buildCss(T: ThemeTokens): string {
//   return `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
// body{font-family:'DM Sans',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
// ::-webkit-scrollbar{width:5px;height:5px;}
// ::-webkit-scrollbar-track{background:transparent;}
// ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
// .serif{font-family:'DM Serif Display',serif;}
// .mono{font-family:'JetBrains Mono',monospace;}
// @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
// @keyframes spin{to{transform:rotate(360deg)}}
// @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
// .top-nav-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;}
// .top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}
// .top-nav-link.on{background:${T.navActiveBg};color:${T.navActiveText};border-color:transparent;}
// .card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};margin-bottom:20px;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}
// .sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
// .sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}
// .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;}
// .btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
// .btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
// .btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
// .btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
// .btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
// .btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}
// .inp{width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;}
// .inp:focus{border-color:${T.inputFocusBorder};}
// .inp::placeholder{color:${T.inputPlaceholder};}
// select.inp option{background:${T.modalBg};color:${T.inputText};}
// textarea.inp{resize:vertical;min-height:80px;line-height:1.6;}
// .pill{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};text-transform:uppercase;}
// .pill:hover{border-color:${T.accent};color:${T.accent};}
// .pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}
// .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:${T.tagBg};color:${T.tagText};border:1px solid ${T.accentBorder};}
// .form-row{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;align-items:start;}
// .form-col-6{grid-column:span 6;}
// .form-col-4{grid-column:span 4;}
// .form-col-3{grid-column:span 3;}
// .form-col-2{grid-column:span 2;}
// @media(max-width:768px){.form-col-6,.form-col-4,.form-col-3,.form-col-2{grid-column:span 12;}}
// .tog{display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;}
// .tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}
// `;
// }

// function SecHdr({ icon, label }: { icon: string; label: string }) {
//   return (
//     <div className="sec-hdr">
//       <span style={{ fontSize: "1.05rem" }}>{icon}</span>
//       <span className="sec-hdr-txt">{label}</span>
//     </div>
//   );
// }

// const defaultForm = () => ({
//   title: "", title_hi: "", short_desc: "", full_desc: "", full_desc_hi: "",
//   category: "Computer Course", theme: "blue", banner_url: "", duration: "3 Months", duration_hi: "",
//   fee: 0, prebook_amount: 500, max_seats: 20, start_date: "",
//   syllabus: [] as SyllabusItem[], eligibility: "", eligibility_hi: "",
//   certification: "", certification_hi: "", tags: [] as string[],
//   is_published: false,
// });

// export default function CreateCourseContent() {
//   const [isDark, setIsDark] = useState(false);
//   const T = isDark ? THEMES_TOKENS.dark : THEMES_TOKENS.light;
//   const router = useRouter();
//   const [form, setForm] = useState(defaultForm());
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [tagInput, setTagInput] = useState("");
//   const [pasteFlash, setPasteFlash] = useState(false);

//   const [onboardingStep, setOnboardingStep] = useState(0);
//   const [showOnboarding, setShowOnboarding] = useState(true);
//   const [onboardingDismissed, setOnboardingDismissed] = useState(false);

//   const searchParams = useSearchParams();
//   const editId = searchParams.get("id");
//   const [loadingEdit, setLoadingEdit] = useState(!!editId);

//   const { user } = useAuth();

//   const addToast = useCallback((message: string, type: ToastType = "info") => {
//     const id = Date.now();
//     setToasts(t => [...t, { id, message, type }]);
//     setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
//   }, []);

//   // ── Onboarding ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const dismissed = localStorage.getItem("csc_course_onboarding_dismissed");
//     if (dismissed === "1") {
//       setShowOnboarding(false);
//       setOnboardingDismissed(true);
//     }
//   }, []);

//   useEffect(() => {
//     const saved = localStorage.getItem("csc_theme");
//     if (saved) setIsDark(saved === "dark");
//     else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//   }, [user]);

//   // ── Fetch Edit Data ──────────────────────────────────────────────────────
//   useEffect(() => {
//     async function fetchCourse() {
//       if (!editId) return;
//       try {
//         const data = await adminGetCourseAction(editId);
//         if (data) {
//           setForm({
//             title: data.title || "", title_hi: data.title_hi || "", short_desc: data.short_desc || "",
//             full_desc: data.full_desc || "", full_desc_hi: data.full_desc_hi || "",
//             category: data.category || "Computer Course", theme: data.theme || "blue",
//             banner_url: data.banner_url || "", duration: data.duration || "3 Months",
//             duration_hi: data.duration_hi || "", fee: data.fee || 0,
//             prebook_amount: data.prebook_amount || 500, max_seats: data.max_seats || 20,
//             start_date: data.start_date || "", syllabus: data.syllabus || [],
//             eligibility: data.eligibility || "", eligibility_hi: data.eligibility_hi || "",
//             certification: data.certification || "", certification_hi: data.certification_hi || "",
//             tags: data.tags || [], is_published: data.is_published || false,
//           });
//         }
//       } catch (err) {
//         addToast("Failed to load course for editing.", "error");
//       } finally {
//         setLoadingEdit(false);
//       }
//     }
//     fetchCourse();
//   }, [editId]);

//   const dismissOnboarding = () => {
//     setShowOnboarding(false);
//     setOnboardingDismissed(true);
//     localStorage.setItem("csc_course_onboarding_dismissed", "1");
//   };

//   // ─── HANDLERS ─────────────────────────────────────────────────────────────
//   const toggleTheme = () => {
//     const newDark = !isDark;
//     setIsDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

//   // ── Copy LLM Prompt ────────────────────────────────────────────────────────
//   const copyPrompt = async () => {
//     try {
//       await navigator.clipboard.writeText(LLM_PROMPT);
//       addToast("LLM Prompt copied! Now paste it into ChatGPT / Claude / Gemini.", "success");
//     } catch {
//       addToast("Failed to copy — please copy manually.", "error");
//     }
//   };

//   // ── Global Paste Handler ─────────────────────────────────────────────────
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const ev = e as ClipboardEvent;
//       (async () => {
//         const active = document.activeElement as HTMLElement;
//         const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");
//         if (isInput) return;

//         const text = ev.clipboardData?.getData("text/plain") || "";
//         if (!text.trim()) return;
//         const trimmed = text.trim();
//         if (!trimmed.startsWith("{")) return;

//         try {
//           const parsed = JSON.parse(trimmed);
//           applyParsedJson(parsed);
//           setPasteFlash(true);
//           setTimeout(() => setPasteFlash(false), 1500);
//           addToast("✅ JSON pasted! All fields populated.", "success");
//         } catch {
//           // not valid JSON, ignore
//         }
//       })();
//     };

//     document.addEventListener("paste", handler);
//     return () => document.removeEventListener("paste", handler);
//   }, []);

//   const applyParsedJson = (parsed: Record<string, unknown>) => {
//     setForm(prev => ({
//       ...prev,
//       title: (parsed.title as string) || prev.title,
//       title_hi: (parsed.title_hi as string) || prev.title_hi,
//       short_desc: (parsed.short_desc as string) || prev.short_desc,
//       full_desc: (parsed.full_desc as string) || prev.full_desc,
//       full_desc_hi: (parsed.full_desc_hi as string) || prev.full_desc_hi,
//       category: (parsed.category as string) || prev.category,
//       theme: (parsed.theme as string) || prev.theme,
//       duration: (parsed.duration as string) || prev.duration,
//       duration_hi: (parsed.duration_hi as string) || prev.duration_hi,
//       fee: Number(parsed.fee) || prev.fee,
//       prebook_amount: Number(parsed.prebook_amount) || prev.prebook_amount,
//       max_seats: Number(parsed.max_seats) || prev.max_seats,
//       start_date: (parsed.start_date as string) || prev.start_date,
//       eligibility: (parsed.eligibility as string) || prev.eligibility,
//       eligibility_hi: (parsed.eligibility_hi as string) || prev.eligibility_hi,
//       certification: (parsed.certification as string) || prev.certification,
//       certification_hi: (parsed.certification_hi as string) || prev.certification_hi,
//       tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : prev.tags,
//       syllabus: Array.isArray(parsed.syllabus) ? (parsed.syllabus as SyllabusItem[]) : prev.syllabus,
//       banner_url: (parsed.banner_url as string) || prev.banner_url,
//     }));
//   };

//   const setField = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

//   const updateSyllabus = (idx: number, field: keyof SyllabusItem, val: unknown) => {
//     setForm(f => {
//       const arr = [...f.syllabus];
//       arr[idx] = { ...arr[idx], [field]: val };
//       return { ...f, syllabus: arr };
//     });
//   };

//   const addSyllabus = () => setForm(f => ({ ...f, syllabus: [...f.syllabus, { topic: "", topic_hi: "", hours: 0 }] }));
//   const removeSyllabus = (idx: number) => setForm(f => ({ ...f, syllabus: f.syllabus.filter((_, i) => i !== idx) }));

//   const addTag = () => {
//     const t = tagInput.trim();
//     if (t && !form.tags.includes(t)) setField("tags", [...form.tags, t]);
//     setTagInput("");
//   };
//   const removeTag = (tag: string) => setField("tags", form.tags.filter(t => t !== tag));

//   const handleSubmit = async (publish: boolean) => {
//     if (!form.title.trim()) { addToast("Title is required.", "error"); return; }
//     if (!form.duration.trim()) { addToast("Duration is required.", "error"); return; }

//     setSubmitting(true);
//     try {
//       if (editId) {
//         await adminUpdateCourseAction(editId, { ...form, is_published: publish });
//         addToast("Course updated! 📝", "success");
//       } else {
//         await adminCreateCourseAction({ ...form, is_published: publish });
//         addToast(publish ? "Course published! 🎉" : "Saved as draft.", "success");
//       }
//       setTimeout(() => router.push("/admin/courses"), 1500);
//     } catch (err: any) {
//       addToast(err.message || "Failed to save course.", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const themeColors: Record<string, { grad: string }> = {
//     blue: { grad: "linear-gradient(135deg,#1d4ed8,#2563eb)" }, green: { grad: "linear-gradient(135deg,#15803d,#16a34a)" },
//     red: { grad: "linear-gradient(135deg,#b91c1c,#dc2626)" }, orange: { grad: "linear-gradient(135deg,#c2410c,#f97316)" },
//     purple: { grad: "linear-gradient(135deg,#7c3aed,#8b5cf6)" }, teal: { grad: "linear-gradient(135deg,#0f766e,#14b8a6)" },
//     indigo: { grad: "linear-gradient(135deg,#4338ca,#6366f1)" }, rose: { grad: "linear-gradient(135deg,#be123c,#f43f5e)" },
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s" }}>
//       <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />
//       <style>{`
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
//       `}</style>

//       {/* Paste flash overlay */}
//       {pasteFlash && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: isDark ? "rgba(245,158,11,0.15)" : "rgba(37,99,235,0.08)", border: `4px solid ${T.accent}`, pointerEvents: "none", animation: "fadeUp 0.3s ease" }} />
//       )}

//       {/* ── TOASTS ── */}
//       <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
//         {toasts.map(t => (
//           <div key={t.id} style={{
//             padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#fff",
//             background: t.type === "success" ? "linear-gradient(135deg,#15803d,#16a34a)" : t.type === "error" ? "linear-gradient(135deg,#b91c1c,#dc2626)" : T.btnPrimary,
//             boxShadow: "0 8px 24px rgba(0,0,0,0.15)", animation: "fadeUp 0.3s ease", display: "flex", alignItems: "center", gap: 8
//           }}>
//             {t.type === "success" ? <Ico.Check /> : t.type === "error" ? <Ico.X /> : <Ico.Doc />}
//             {t.message}
//           </div>
//         ))}
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           HEADER
//       ════════════════════════════════════════════════════════ */}
//       <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
//         <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//           <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
//             <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
//             <div>
//               <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
//                 Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
//               </div>
//               <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
//             </div>
//           </a>
//           <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
//           <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
//             {NAV_LINKS.map(l => (
//               <a key={l.href} href={l.href} className={`top-nav-link ${l.label === "Courses" ? "on" : ""}`}>
//                 <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
//               </a>
//             ))}
//           </nav>
//           <button className="tog" onClick={toggleTheme}>
//             <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
//           </button>
//           <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
//             <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${T.accent},${T.accentHover})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11 }}>A</div>
//             <div>
//               <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Admin</div>
//               <div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>EDITOR</div>
//             </div>
//           </div>
//         </div>

//         {/* Sub header bar */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(0,0,0,0.12)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <button onClick={() => router.back()} className="btn btn-g" style={{ fontSize: 12, padding: "6px 12px" }}>
//               <Ico.Back /> Back
//             </button>
//             <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)" }} />
//             <div>
//               <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{editId ? `Editing: ${form.title || "Untitled"}` : (form.title || "New Course")}</div>
//               <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{form.category} · {form.duration} · ₹{form.fee}</div>
//             </div>
//           </div>
//           <div style={{ display: "flex", gap: 8 }}>
//             {onboardingDismissed && (
//               <button onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }} className="btn btn-g" style={{ fontSize: 12 }}>
//                 📖 Instructions
//               </button>
//             )}
//             <button onClick={copyPrompt} className="btn btn-p" style={{ fontSize: 12, background: "linear-gradient(135deg,#7c3aed,#8b5cf6)" }}>
//               <Ico.Robot /> Copy LLM Prompt
//             </button>
//             <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn btn-g" style={{ fontSize: 12 }}>
//               Save Draft
//             </button>
//             <button onClick={() => handleSubmit(true)} disabled={submitting} className="btn btn-p" style={{ fontSize: 12 }}>
//               {submitting ? <span style={{ width: 13, height: 13, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} /> : <Ico.Check />}
//               {editId ? "Update" : "Publish"}
//             </button>
//           </div>
//         </div>

//         {/* Paste hint bar */}
//         <div style={{ background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, borderTop: `1px solid ${T.accentBorder}`, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ color: T.accent, fontSize: 12, fontWeight: 700 }}>⌨️</span>
//           <p style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>
//             <strong>Ctrl+V</strong> anywhere outside a text box to auto-populate all fields from AI JSON output
//           </p>
//           {pasteFlash && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: T.accent, animation: "pulse 1s infinite" }}>✅ Populated!</span>}
//         </div>
//       </header>

//       {/* ════════════════════════════════════════════════════════
//           ONBOARDING MODAL
//       ════════════════════════════════════════════════════════ */}
//       {showOnboarding && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 999, background: T.modalOverlay, backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
//           <div style={{ background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 16, width: "100%", maxWidth: 440, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", animation: "fadeUp 0.3s ease" }}>
//             <div style={{ height: 3, background: T.divider }}>
//               <div style={{ height: "100%", background: T.btnPrimary, width: `${((onboardingStep + 1) / ONBOARDING.length) * 100}%`, transition: "width 0.5s" }} />
//             </div>
//             <div style={{ padding: "32px 28px" }}>
//               <div style={{ textAlign: "center", marginBottom: 24 }}>
//                 <div style={{ fontSize: 48, marginBottom: 12 }}>{ONBOARDING[onboardingStep].icon}</div>
//                 <h3 style={{ fontSize: 18, fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>{ONBOARDING[onboardingStep].title}</h3>
//                 <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>{ONBOARDING[onboardingStep].desc}</p>
//               </div>
//               <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
//                 {ONBOARDING.map((_, i) => (
//                   <button key={i} onClick={() => setOnboardingStep(i)} style={{
//                     width: i === onboardingStep ? 24 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer",
//                     background: i === onboardingStep ? T.accent : T.divider, transition: "all 0.3s"
//                   }} />
//                 ))}
//               </div>
//               <div style={{ display: "flex", gap: 10 }}>
//                 <button onClick={dismissOnboarding} className="btn btn-g" style={{ flex: 1, justifyContent: "center" }}>Skip</button>
//                 {onboardingStep < ONBOARDING.length - 1 ? (
//                   <button onClick={() => setOnboardingStep(s => s + 1)} className="btn btn-p" style={{ flex: 1, justifyContent: "center" }}>Next →</button>
//                 ) : (
//                   <button onClick={dismissOnboarding} className="btn btn-s" style={{ flex: 1, justifyContent: "center" }}>Let's Go! 🚀</button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ════════════════════════════════════════════════════════
//           MAIN FORM
//       ════════════════════════════════════════════════════════ */}
//       <div style={{ flex: 1, overflowY: "auto" }}>
//         <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 60px" }}>
//           {loadingEdit && (
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, gap: 12 }}>
//               <div style={{ width: 24, height: 24, border: `3px solid ${T.divider}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
//               <span style={{ color: T.textMuted, fontSize: 14, fontWeight: 600 }}>Loading course data...</span>
//             </div>
//           )}

//           {!loadingEdit && (
//             <>
//               {/* ── SECTION 1: Basic Info ── */}
//               <div className="card">
//                 <SecHdr icon="🎓" label="Basic Information" />
//                 <div style={{ padding: 20 }}>
//                   <div className="form-row" style={{ marginBottom: 16 }}>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Course Title (English) *</label>
//                       <input className="inp" value={form.title} onChange={e => setField("title", e.target.value)} placeholder="Advanced Diploma in Computer Applications (ADCA)" />
//                     </div>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Course Title (Hindi)</label>
//                       <input className="inp" value={form.title_hi} onChange={e => setField("title_hi", e.target.value)} placeholder="कंप्यूटर एप्लिकेशन में एडवांस डिप्लोमा" />
//                     </div>
//                   </div>

//                   <div className="form-row" style={{ marginBottom: 16 }}>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Short Description</label>
//                       <textarea className="inp" rows={2} value={form.short_desc} onChange={e => setField("short_desc", e.target.value)} placeholder="Brief description for course cards..." />
//                     </div>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Category</label>
//                       <select className="inp" value={form.category} onChange={e => setField("category", e.target.value)}>
//                         {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="form-row" style={{ marginBottom: 16 }}>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Full Description (English)</label>
//                       <textarea className="inp" rows={4} value={form.full_desc} onChange={e => setField("full_desc", e.target.value)} placeholder="Detailed course description, what students will learn, career opportunities..." />
//                     </div>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Full Description (Hindi)</label>
//                       <textarea className="inp" rows={4} value={form.full_desc_hi} onChange={e => setField("full_desc_hi", e.target.value)} placeholder="विस्तृत पाठ्यक्रम विवरण..." />
//                     </div>
//                   </div>

//                   <div className="form-row" style={{ marginBottom: 16 }}>
//                     <div className="form-col-3">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Duration</label>
//                       <select className="inp" value={form.duration} onChange={e => setField("duration", e.target.value)}>
//                         {DURATIONS.map(d => <option key={d}>{d}</option>)}
//                       </select>
//                     </div>
//                     <div className="form-col-3">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Duration (Hindi)</label>
//                       <input className="inp" value={form.duration_hi} onChange={e => setField("duration_hi", e.target.value)} placeholder="e.g. 3 महीने" />
//                     </div>
//                     <div className="form-col-3">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Start Date</label>
//                       <input type="date" className="inp" value={form.start_date} onChange={e => setField("start_date", e.target.value)} />
//                     </div>
//                     <div className="form-col-3">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Theme Color</label>
//                       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                         {THEMES.map(t => (
//                           <button key={t} type="button" onClick={() => setField("theme", t)} title={t}
//                             style={{ width: 28, height: 28, borderRadius: "50%", border: form.theme === t ? `2px solid ${T.textPrimary}` : "2px solid transparent",
//                               background: themeColors[t]?.grad || themeColors.blue.grad, cursor: "pointer", transform: form.theme === t ? "scale(1.15)" : "scale(1)", transition: "all 0.15s" }} />
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="form-row" style={{ marginBottom: 16 }}>
//                     <div className="form-col-4">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total Fee (₹)</label>
//                       <input type="number" className="inp" value={form.fee} onChange={e => setField("fee", Number(e.target.value))} min={0} />
//                     </div>
//                     <div className="form-col-4">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Pre-Book Amount (₹) *</label>
//                       <input type="number" className="inp" value={form.prebook_amount} onChange={e => setField("prebook_amount", Number(e.target.value))} min={0} />
//                       <p style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>Non-refundable seat booking charge</p>
//                     </div>
//                     <div className="form-col-4">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Max Seats</label>
//                       <input type="number" className="inp" value={form.max_seats} onChange={e => setField("max_seats", Number(e.target.value))} min={1} />
//                     </div>
//                   </div>

//                   <div className="form-row" style={{ marginBottom: 16 }}>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Banner Image URL</label>
//                       <input className="inp" value={form.banner_url} onChange={e => setField("banner_url", e.target.value)} placeholder="https://example.com/course-banner.jpg" />
//                     </div>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Tags</label>
//                       <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
//                         {form.tags.map(tag => (
//                           <span key={tag} className="tag">
//                             {tag}
//                             <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", color: T.tagText, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
//                           </span>
//                         ))}
//                       </div>
//                       <input className="inp" value={tagInput} onChange={e => setTagInput(e.target.value)}
//                         onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
//                         placeholder="Type tag and press Enter..." style={{ fontSize: 12 }} />
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
//                       <input type="checkbox" style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} checked={form.is_published} onChange={e => setField("is_published", e.target.checked)} />
//                       <div style={{ width: 44, height: 24, borderRadius: 12, background: form.is_published ? T.accent : T.divider, position: "relative", transition: "all 0.2s", cursor: "pointer" }}>
//                         <div style={{ position: "absolute", top: 2, left: form.is_published ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
//                       </div>
//                     </label>
//                     <span style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>Publish immediately</span>
//                   </div>
//                 </div>
//               </div>

//               {/* ── SECTION 2: Eligibility & Certification ── */}
//               <div className="card">
//                 <SecHdr icon="📋" label="Eligibility & Certification" />
//                 <div style={{ padding: 20 }}>
//                   <div className="form-row" style={{ marginBottom: 16 }}>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Eligibility (English)</label>
//                       <input className="inp" value={form.eligibility} onChange={e => setField("eligibility", e.target.value)} placeholder="10th Pass / 12th Pass / Graduate" />
//                     </div>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Eligibility (Hindi)</label>
//                       <input className="inp" value={form.eligibility_hi} onChange={e => setField("eligibility_hi", e.target.value)} placeholder="दसवीं पास / बारहवीं पास" />
//                     </div>
//                   </div>
//                   <div className="form-row">
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Certification (English)</label>
//                       <input className="inp" value={form.certification} onChange={e => setField("certification", e.target.value)} placeholder="NSQF Level 4 / ISO Certified / Government Recognized" />
//                     </div>
//                     <div className="form-col-6">
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Certification (Hindi)</label>
//                       <input className="inp" value={form.certification_hi} onChange={e => setField("certification_hi", e.target.value)} placeholder="एनएसक्यूएफ स्तर 4" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ── SECTION 3: Syllabus ── */}
//               <div className="card">
//                 <SecHdr icon="📚" label="Course Syllabus" />
//                 <div style={{ padding: 20 }}>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                     {form.syllabus.map((item, i) => {
//                       const tc = themeColors[form.theme] || themeColors.blue;
//                       return (
//                         <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 80px auto", gap: 10, alignItems: "start", background: isDark ? "rgba(255,255,255,0.03)" : T.accentLight, border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : T.accentBorder}`, borderRadius: 10, padding: 12 }}>
//                           <input className="inp" placeholder="Topic (English)" value={item.topic} onChange={e => updateSyllabus(i, "topic", e.target.value)} style={{ fontSize: 12 }} />
//                           <input className="inp" placeholder="Topic (Hindi)" value={item.topic_hi} onChange={e => updateSyllabus(i, "topic_hi", e.target.value)} style={{ fontSize: 12 }} />
//                           <input type="number" className="inp" placeholder="Hrs" value={item.hours} onChange={e => updateSyllabus(i, "hours", Number(e.target.value))} min={0} style={{ fontSize: 12 }} />
//                           <button onClick={() => removeSyllabus(i)} className="btn btn-d" style={{ padding: "6px 10px", fontSize: 12 }}><Ico.X /></button>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <button onClick={addSyllabus} className="btn btn-g" style={{ width: "100%", marginTop: 12, justifyContent: "center", borderStyle: "dashed", borderWidth: 2 }}>
//                     <Ico.Plus /> Add Topic
//                   </button>
//                 </div>
//               </div>

//               {/* ── JSON Preview ── */}
//               <details style={{ background: isDark ? "rgba(0,0,0,0.3)" : "#0f172a", borderRadius: 12, overflow: "hidden", marginBottom: 24, border: `1px solid ${T.cardBorder}` }}>
//                 <summary style={{ padding: "12px 18px", cursor: "pointer", color: T.textMuted, fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", userSelect: "none", display: "flex", alignItems: "center", gap: 8 }}>
//                   <span>🧩</span> JSON Preview (debug)
//                 </summary>
//                 <pre style={{ padding: "0 18px 18px", fontSize: 11, color: "#4ade80", overflow: "auto", maxHeight: 384, lineHeight: 1.6, fontFamily: "'JetBrains Mono',monospace" }}>
//                   {JSON.stringify(form, null, 2)}
//                 </pre>
//               </details>

//               {/* ── Bottom Submit Bar ── */}
//               <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingBottom: 40 }}>
//                 <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn btn-g" style={{ padding: "10px 24px" }}>Save as Draft</button>
//                 <button onClick={() => handleSubmit(true)} disabled={submitting} className="btn btn-p" style={{ padding: "10px 28px", fontSize: 14 }}>
//                   {submitting ? (
//                     <><span style={{ width: 14, height: 14, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} />Publishing…</>
//                   ) : (<>🚀 {editId ? "Update Course" : "Publish Course"}</>)}
//                 </button>
//               </div>

//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }









// src/app/admin/courses/create/CreateCourseContent.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\courses\create\CreateCourseContent.tsx.
// No new file needed.
//
// KEPT (all logic and copy exactly as supplied):
// - LLM_PROMPT byte-for-byte (the full JSON-extraction prompt, including the
//   course JSON structure and the "[PASTE YOUR COURSE DETAILS HERE ...]" line).
// - ONBOARDING titles and descriptions byte-for-byte (5 steps). Only the icon
//   emoji in each step were replaced by lucide-react icons (Bot, ClipboardPaste,
//   Sparkles, Keyboard, Rocket) — the step text is unchanged.
// - CATEGORIES (10), THEMES course-theme names (blue, green, red, orange,
//   purple, teal, indigo, rose), DURATIONS (7), defaultForm values.
// - Edit mode: useSearchParams "id" -> adminGetCourseAction, form populated
//   field by field; submit via adminCreateCourseAction / adminUpdateCourseAction
//   then router.push("/admin/courses") after 1500ms.
// - Global paste handler: ignores paste inside INPUT/TEXTAREA/SELECT; if the
//   clipboard text starts with "{" and parses as JSON, applyParsedJson
//   populates the form, paste flash shows for 1500ms, toast is shown.
// - applyParsedJson field mapping (including banner_url), setField,
//   updateSyllabus / addSyllabus / removeSyllabus, addTag (Enter or comma) /
//   removeTag, publish toggle, JSON preview <details> with JSON.stringify(form, null, 2).
// - Copy LLM Prompt button (navigator.clipboard.writeText(LLM_PROMPT)) and its
//   success/error toasts; onboarding modal persisted via localStorage
//   "csc_course_onboarding_dismissed"; toasts auto-dismiss after 4000ms.
// - Validation toasts: "Title is required." / "Duration is required."
// - All form fields: title/title_hi, short_desc, full_desc/full_desc_hi,
//   category, theme, banner_url, duration/duration_hi, fee, prebook_amount,
//   max_seats, start_date, syllabus (topic/topic_hi/hours), eligibility/
//   eligibility_hi, certification/certification_hi, tags, is_published.
// - All placeholders and helper copy ("Non-refundable seat booking charge",
//   "Type tag and press Enter...", "Loading course data...", "JSON Preview (debug)").
// - Brand "SrilalCSC" as supplied (matches most other pages).
//
// REMOVED:
// - The whole THEMES_TOKENS object and ThemeTokens type; buildCss() (Google
//   Fonts @import + global * margin/padding reset); every inline style object
//   and <style> block; the custom Ico SVG icon set (replaced by lucide-react).
// - All gradients: section headers, primary/success buttons, toasts, theme
//   dots and the logo/avatar blocks are now solid colours. One accent in both
//   themes (deep blue) via Tailwind dark: classes; the old blue-light /
//   amber-dark accent switch is gone. The per-course theme colours survive
//   ONLY as solid dots in the theme picker (themeColors below holds one solid
//   colour per theme, not a gradient) — they identify a course theme, which is
//   data, not decoration.
// - Every emoji used as an icon (nav icons, section headers, onboarding icons,
//   paste-hint, JSON preview, publish button). Toast wording is unchanged
//   except the emoji characters were dropped ("Course published!" without the
//   party-popper, "JSON pasted! All fields populated." without the tick,
//   "Course updated!" without the memo, "Let's Go!" without the rocket).
// - NAV_LINKS absolute URLs (NODE_ENV production https://srilalsahaj.co.in/...
//   vs http://localhost:3000/...) are now relative links: /admin, /admin/posts,
//   /admin/courses, /admin/galary (kept "galary" spelling), /admin/forms,
//   /admin/transactions, /admin/analytics.
// - Dead code: the unused `Suspense` import, and the unused `tc` variable
//   computed inside the syllabus map (themeColors[form.theme] was computed
//   per row and never used).
// - The JSON preview code block stays dark in both themes on purpose: it is a
//   code viewer, not page chrome.
//
// FLAGS (kept as supplied, not changed — need Swatantra's word):
// 1. The paste-handler effect has an empty dependency array and closes over
//    the first render's applyParsedJson. It works today only because
//    applyParsedJson uses the functional setForm updater; if it ever reads
//    other state directly it will read stale values.
// 2. The theme effect re-runs on every `user` change ([user] dependency kept
//    as supplied), so it re-reads csc_theme whenever the auth user object
//    changes.
// 3. showOnboarding defaults to true, so the onboarding modal can flash
//    briefly on first paint before the localStorage check hides it.
// 4. handleSubmit clears `submitting` in `finally` immediately, while the
//    router.push("/admin/courses") happens 1500ms later — the buttons
//    re-enable during that window.
// 5. applyParsedJson uses Number(parsed.fee) || prev.fee (and the same for
//    prebook_amount / max_seats), so a pasted value of 0 falls back to the
//    previous value instead of 0.
// 6. The "Let's Go!" button in the original used class "btn-s", which was
//    never defined in buildCss — it rendered unstyled. Here it is a normal
//    primary button.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState, useEffect, useCallback, type KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminCreateCourseAction, adminUpdateCourseAction, adminGetCourseAction } from "@/app/actions/courses";
import { useAuth } from "@/components/AuthProvider";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Braces,
  Check,
  ChevronLeft,
  ClipboardList,
  ClipboardPaste,
  Copy,
  CreditCard,
  GraduationCap,
  Image as ImageIcon,
  Keyboard,
  Loader2,
  Moon,
  Plus,
  Rocket,
  Shield,
  Sparkles,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";

// ─── Types ───
interface SyllabusItem { topic: string; topic_hi: string; hours: number; }
type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }

// ─── Constants ───
const CATEGORIES = ["Computer Course", "Diploma", "Certification", "Typing", "Programming", "Hardware", "Networking", "Digital Marketing", "Tally", "Graphic Design"];
const THEMES = ["blue", "green", "red", "orange", "purple", "teal", "indigo", "rose"];
const DURATIONS = ["1 Month", "2 Months", "3 Months", "4 Months", "6 Months", "1 Year", "2 Years"];

const LLM_PROMPT = `You are a data extraction assistant for a Computer Training Center portal. Based on the course details I provide, generate a structured JSON object with ALL fields filled accurately.

Return ONLY valid JSON with this exact structure (no markdown, no preamble, no code fences):

{
  "title": "Full English title of the course e.g. Advanced Diploma in Computer Applications (ADCA)",
  "title_hi": "Hindi title",
  "short_desc": "2-3 sentence English description of the course",
  "full_desc": "Detailed description covering what students will learn, career opportunities, and course outcomes",
  "full_desc_hi": "Hindi detailed description",
  "category": "One of: Computer Course, Diploma, Certification, Typing, Programming, Hardware, Networking, Digital Marketing, Tally, Graphic Design",
  "theme": "One of: blue, green, red, orange, purple, teal, indigo, rose",
  "duration": "e.g. 3 Months",
  "duration_hi": "e.g. 3 महीने",
  "fee": 5000,
  "prebook_amount": 500,
  "max_seats": 20,
  "start_date": "YYYY-MM-DD",
  "eligibility": "e.g. 10th Pass / 12th Pass / Graduate",
  "eligibility_hi": "Hindi eligibility",
  "certification": "e.g. NSQF Level 4 / ISO Certified / Government Recognized",
  "certification_hi": "Hindi certification",
  "tags": ["tag1", "tag2", "tag3"],
  "syllabus": [
    { "topic": "Computer Fundamentals", "topic_hi": "कंप्यूटर की बुनियादी जानकारी", "hours": 20 },
    { "topic": "MS Office Suite", "topic_hi": "एमएस ऑफिस सूट", "hours": 40 },
    { "topic": "Internet & Email", "topic_hi": "इंटरनेट और ईमेल", "hours": 15 }
  ]
}

Now generate the JSON for the following course details:
[PASTE YOUR COURSE DETAILS HERE — course name, duration, fee, topics, eligibility, etc.]`;

// Onboarding step titles/descriptions byte-for-byte as supplied; only the
// icon emoji were replaced by lucide icons.
const ONBOARDING: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Bot, title: "Step 1 – Copy the LLM Prompt", desc: 'Click "Copy LLM Prompt" at the top of this page. This copies a pre-built instruction for any AI like ChatGPT, Claude, or Gemini.' },
  { icon: ClipboardPaste, title: "Step 2 – Paste into your AI", desc: "Open your favourite AI assistant, paste the prompt, and add the raw course details at the bottom where indicated." },
  { icon: Sparkles, title: "Step 3 – Copy the JSON", desc: "The AI will return a clean JSON object with all fields filled accurately. Copy that entire JSON response." },
  { icon: Keyboard, title: "Step 4 – Press Ctrl+V here!", desc: "Return to this page and press Ctrl+V (Cmd+V on Mac) anywhere. All form fields will instantly populate!" },
  { icon: Rocket, title: "Step 5 – Review & Publish", desc: "Review the auto-filled fields, make any manual corrections, then click Publish Course. Done!" },
];

const NAV_LINKS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/admin", icon: Shield, label: "Admin" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/posts", icon: BookOpen, label: "Posts" },
  { href: "/admin/courses", icon: GraduationCap, label: "Courses" },
  { href: "/admin/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/forms", icon: ClipboardList, label: "Forms" },
  { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

// Solid per-theme colours, used ONLY for the small theme-picker dots. A course
// theme is data (it identifies the course), so its colour is kept; the old
// linear-gradient values were replaced by the matching solid colour.
const themeColors: Record<string, string> = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  orange: "#f97316",
  purple: "#8b5cf6",
  teal: "#14b8a6",
  indigo: "#6366f1",
  rose: "#f43f5e",
};

// ─── Shared class strings ───
const inpCls =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[13.5px] text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400";
const labelCls =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400";
const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500";
const btnGhost =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400";
const btnDanger =
  "inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20";

function SecHdr({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
      <Icon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
      <span className="text-xs font-extrabold uppercase tracking-[0.07em] text-slate-800 dark:text-slate-100">{label}</span>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}

const defaultForm = () => ({
  title: "", title_hi: "", short_desc: "", full_desc: "", full_desc_hi: "",
  category: "Computer Course", theme: "blue", banner_url: "", duration: "3 Months", duration_hi: "",
  fee: 0, prebook_amount: 500, max_seats: 20, start_date: "",
  syllabus: [] as SyllabusItem[], eligibility: "", eligibility_hi: "",
  certification: "", certification_hi: "", tags: [] as string[],
  is_published: false,
});

export default function CreateCourseContent() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState(defaultForm());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [pasteFlash, setPasteFlash] = useState(false);

  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  const { user } = useAuth();

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  // ── Onboarding ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const dismissed = localStorage.getItem("csc_course_onboarding_dismissed");
    if (dismissed === "1") {
      setShowOnboarding(false);
      setOnboardingDismissed(true);
    }
  }, []);

  // Theme: stored csc_theme wins, else system preference. Kept as supplied
  // (re-runs on every `user` change — see FLAGS in the header comment).
  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, [user]);

  // Sync the `dark` class on <html> so Tailwind dark: variants apply.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // ── Fetch Edit Data ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchCourse() {
      if (!editId) return;
      try {
        const data = await adminGetCourseAction(editId);
        if (data) {
          setForm({
            title: data.title || "", title_hi: data.title_hi || "", short_desc: data.short_desc || "",
            full_desc: data.full_desc || "", full_desc_hi: data.full_desc_hi || "",
            category: data.category || "Computer Course", theme: data.theme || "blue",
            banner_url: data.banner_url || "", duration: data.duration || "3 Months",
            duration_hi: data.duration_hi || "", fee: data.fee || 0,
            prebook_amount: data.prebook_amount || 500, max_seats: data.max_seats || 20,
            start_date: data.start_date || "", syllabus: data.syllabus || [],
            eligibility: data.eligibility || "", eligibility_hi: data.eligibility_hi || "",
            certification: data.certification || "", certification_hi: data.certification_hi || "",
            tags: data.tags || [], is_published: data.is_published || false,
          });
        }
      } catch (err) {
        addToast("Failed to load course for editing.", "error");
      } finally {
        setLoadingEdit(false);
      }
    }
    fetchCourse();
  }, [editId]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    setOnboardingDismissed(true);
    localStorage.setItem("csc_course_onboarding_dismissed", "1");
  };

  // ─── Handlers ───
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  // ── Copy LLM Prompt ────────────────────────────────────────────────────────
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(LLM_PROMPT);
      addToast("LLM Prompt copied! Now paste it into ChatGPT / Claude / Gemini.", "success");
    } catch {
      addToast("Failed to copy — please copy manually.", "error");
    }
  };

  // ── Global Paste Handler ─────────────────────────────────────────────────
  // Kept as supplied, including the empty dependency array (see FLAGS).
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as ClipboardEvent;
      (async () => {
        const active = document.activeElement as HTMLElement;
        const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");
        if (isInput) return;

        const text = ev.clipboardData?.getData("text/plain") || "";
        if (!text.trim()) return;
        const trimmed = text.trim();
        if (!trimmed.startsWith("{")) return;

        try {
          const parsed = JSON.parse(trimmed);
          applyParsedJson(parsed);
          setPasteFlash(true);
          setTimeout(() => setPasteFlash(false), 1500);
          addToast("JSON pasted! All fields populated.", "success");
        } catch {
          // not valid JSON, ignore
        }
      })();
    };

    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, []);

  const applyParsedJson = (parsed: Record<string, unknown>) => {
    setForm(prev => ({
      ...prev,
      title: (parsed.title as string) || prev.title,
      title_hi: (parsed.title_hi as string) || prev.title_hi,
      short_desc: (parsed.short_desc as string) || prev.short_desc,
      full_desc: (parsed.full_desc as string) || prev.full_desc,
      full_desc_hi: (parsed.full_desc_hi as string) || prev.full_desc_hi,
      category: (parsed.category as string) || prev.category,
      theme: (parsed.theme as string) || prev.theme,
      duration: (parsed.duration as string) || prev.duration,
      duration_hi: (parsed.duration_hi as string) || prev.duration_hi,
      fee: Number(parsed.fee) || prev.fee,
      prebook_amount: Number(parsed.prebook_amount) || prev.prebook_amount,
      max_seats: Number(parsed.max_seats) || prev.max_seats,
      start_date: (parsed.start_date as string) || prev.start_date,
      eligibility: (parsed.eligibility as string) || prev.eligibility,
      eligibility_hi: (parsed.eligibility_hi as string) || prev.eligibility_hi,
      certification: (parsed.certification as string) || prev.certification,
      certification_hi: (parsed.certification_hi as string) || prev.certification_hi,
      tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : prev.tags,
      syllabus: Array.isArray(parsed.syllabus) ? (parsed.syllabus as SyllabusItem[]) : prev.syllabus,
      banner_url: (parsed.banner_url as string) || prev.banner_url,
    }));
  };

  const setField = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const updateSyllabus = (idx: number, field: keyof SyllabusItem, val: unknown) => {
    setForm(f => {
      const arr = [...f.syllabus];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...f, syllabus: arr };
    });
  };

  const addSyllabus = () => setForm(f => ({ ...f, syllabus: [...f.syllabus, { topic: "", topic_hi: "", hours: 0 }] }));
  const removeSyllabus = (idx: number) => setForm(f => ({ ...f, syllabus: f.syllabus.filter((_, i) => i !== idx) }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setField("tags", [...form.tags, t]);
    setTagInput("");
  };
  const removeTag = (tag: string) => setField("tags", form.tags.filter(t => t !== tag));

  const handleSubmit = async (publish: boolean) => {
    if (!form.title.trim()) { addToast("Title is required.", "error"); return; }
    if (!form.duration.trim()) { addToast("Duration is required.", "error"); return; }

    setSubmitting(true);
    try {
      if (editId) {
        await adminUpdateCourseAction(editId, { ...form, is_published: publish });
        addToast("Course updated!", "success");
      } else {
        await adminCreateCourseAction({ ...form, is_published: publish });
        addToast(publish ? "Course published!" : "Saved as draft.", "success");
      }
      setTimeout(() => router.push("/admin/courses"), 1500);
    } catch (err: any) {
      addToast(err.message || "Failed to save course.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const toastBg = (type: ToastType) =>
    type === "success"
      ? "bg-green-700"
      : type === "error"
        ? "bg-red-700"
        : "bg-blue-700";
  const toastIcon = (type: ToastType) =>
    type === "success" ? <Check className="h-3 w-3" /> : type === "error" ? <X className="h-3 w-3" /> : <Copy className="h-3 w-3" />;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800 transition-colors dark:bg-[#0b1220] dark:text-slate-100">
      {/* Paste flash overlay */}
      {pasteFlash && (
        <div className="pointer-events-none fixed inset-0 z-[9999] border-4 border-blue-700 bg-blue-700/10 dark:border-blue-400 dark:bg-blue-400/10" aria-hidden="true" />
      )}

      {/* ── Toasts ── */}
      <div className="fixed right-4 top-4 z-[1000] flex w-full max-w-xs flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold text-white shadow-lg ${toastBg(t.type)}`}>
            {toastIcon(t.type)}
            {t.message}
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <header className="z-[100] shrink-0 border-b-[3px] border-blue-600 bg-[#0b2239] shadow-md dark:border-blue-400 dark:bg-[#081120]">
        <div className="flex h-[54px] items-center gap-3.5 border-b border-white/10 px-5">
          <a href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] leading-none tracking-tight text-white">
                Srilal<span className="text-blue-300">CSC</span>
              </div>
              <div className="mt-0.5 font-mono text-[9px] tracking-[0.1em] text-white/40">ADMIN PANEL</div>
            </div>
          </a>
          <div className="h-[26px] w-px shrink-0 bg-white/10" />
          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold transition-colors ${
                  l.label === "Courses"
                    ? "bg-blue-600 text-white"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <l.icon className="h-3.5 w-3.5" /> {l.label}
              </a>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex items-center gap-2 rounded-full border-[1.5px] border-blue-300/40 bg-white/10 px-3.5 py-1.5 !text-xs font-bold text-white/70 transition-colors hover:border-blue-400 hover:text-white"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {isDark ? "Light" : "Dark"}
          </button>
          <div className="flex shrink-0 items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-[11px] font-bold text-white">A</div>
            <div>
              <div className="text-[13px] font-bold leading-none text-white">Admin</div>
              <div className="mt-0.5 font-mono text-[9px] tracking-[0.07em] text-blue-300">EDITOR</div>
            </div>
          </div>
        </div>

        {/* Sub header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-black/15 px-5 py-2.5">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className={`${btnGhost} !px-3 !py-1.5 !text-xs !text-blue-700 hover:!text-white dark:!border-white/20 dark:!bg-white/10`}>
              <ArrowLeft className="h-3.5 w-3.5 text-blue-700" /> Back
            </button>
            <div className="h-5 w-px bg-white/10" />
            <div>
              <div className="text-sm font-bold text-white">{editId ? `Editing: ${form.title || "Untitled"}` : (form.title || "New Course")}</div>
              <div className="mt-0.5 text-[11px] text-white/50">{form.category} · {form.duration} · ₹{form.fee}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {onboardingDismissed && (
              <button onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }} className={`${btnGhost} !px-3 !py-1.5 !text-xs !text-blue-700 hover:!text-white dark:!border-white/20 dark:!bg-white/10`}>
                <BookOpen className="h-3.5 w-3.5" /> Instructions
              </button>
            )}
            <button onClick={copyPrompt} className={`${btnPrimary} !px-3 !py-1.5 !text-xs`}>
              <Bot className="h-3.5 w-3.5" /> Copy LLM Prompt
            </button>
            <button onClick={() => handleSubmit(false)} disabled={submitting} className={`${btnGhost} !px-3 !py-1.5 !text-xs !text-blue-700 hover:!text-white dark:!border-white/20 dark:!bg-white/10`}>
              Save Draft
            </button>
            <button onClick={() => handleSubmit(true)} disabled={submitting} className={`${btnPrimary} !px-3 !py-1.5 !text-xs`}>
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3 w-3" />}
              {editId ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        {/* Paste hint bar */}
        <div className="flex items-center gap-2 border-t border-blue-300/40 bg-blue-50 px-5 py-2 dark:border-blue-500/25 dark:bg-blue-500/10">
          <Keyboard className="h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-400" />
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            <strong>Ctrl+V</strong> anywhere outside a text box to auto-populate all fields from AI JSON output
          </p>
          {pasteFlash && (
            <span className="ml-auto flex items-center gap-1 text-[11px] font-extrabold text-blue-700 dark:text-blue-400">
              <Check className="h-3 w-3" /> Populated!
            </span>
          )}
        </div>
      </header>

      {/* ── Onboarding modal ── */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/55 p-5">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="h-[3px] bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-blue-700 transition-all duration-500 dark:bg-blue-500"
                style={{ width: `${((onboardingStep + 1) / ONBOARDING.length) * 100}%` }}
              />
            </div>
            <div className="px-7 py-8">
              <div className="mb-6 text-center">
                {(() => {
                  const StepIcon = ONBOARDING[onboardingStep].icon;
                  return (
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      <StepIcon className="h-7 w-7" />
                    </div>
                  );
                })()}
                <h3 className="mb-2 text-lg font-extrabold text-slate-800 dark:text-slate-100">{ONBOARDING[onboardingStep].title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{ONBOARDING[onboardingStep].desc}</p>
              </div>
              <div className="mb-6 flex justify-center gap-1.5">
                {ONBOARDING.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setOnboardingStep(i)}
                    aria-label={`Go to step ${i + 1}`}
                    className={`h-1.5 rounded-full border-0 transition-all ${
                      i === onboardingStep ? "w-6 bg-blue-700 dark:bg-blue-500" : "w-1.5 bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2.5">
                <button onClick={dismissOnboarding} className={`${btnGhost} flex-1 justify-center`}>Skip</button>
                {onboardingStep < ONBOARDING.length - 1 ? (
                  <button onClick={() => setOnboardingStep(s => s + 1)} className={`${btnPrimary} flex-1 justify-center`}>
                    Next <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
                  </button>
                ) : (
                  <button onClick={dismissOnboarding} className={`${btnPrimary} flex-1 justify-center`}>Let&apos;s Go!</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main form ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[900px] px-6 pb-[60px] pt-7">
          {loadingEdit && (
            <div className="flex items-center justify-center gap-3 p-[60px]">
              <Loader2 className="h-6 w-6 animate-spin text-blue-700 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading course data...</span>
            </div>
          )}

          {!loadingEdit && (
            <>
              {/* ── Section 1: Basic Information ── */}
              <section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <SecHdr icon={GraduationCap} label="Basic Information" />
                <div className="p-5">
                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Course Title (English)" required>
                      <input className={inpCls} value={form.title} onChange={e => setField("title", e.target.value)} placeholder="Advanced Diploma in Computer Applications (ADCA)" />
                    </Field>
                    <Field label="Course Title (Hindi)">
                      <input className={inpCls} value={form.title_hi} onChange={e => setField("title_hi", e.target.value)} placeholder="कंप्यूटर एप्लिकेशन में एडवांस डिप्लोमा" />
                    </Field>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Short Description">
                      <textarea className={inpCls} rows={2} value={form.short_desc} onChange={e => setField("short_desc", e.target.value)} placeholder="Brief description for course cards..." />
                    </Field>
                    <Field label="Category">
                      <select className={inpCls} value={form.category} onChange={e => setField("category", e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Full Description (English)">
                      <textarea className={inpCls} rows={4} value={form.full_desc} onChange={e => setField("full_desc", e.target.value)} placeholder="Detailed course description, what students will learn, career opportunities..." />
                    </Field>
                    <Field label="Full Description (Hindi)">
                      <textarea className={inpCls} rows={4} value={form.full_desc_hi} onChange={e => setField("full_desc_hi", e.target.value)} placeholder="विस्तृत पाठ्यक्रम विवरण..." />
                    </Field>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Duration">
                      <select className={inpCls} value={form.duration} onChange={e => setField("duration", e.target.value)}>
                        {DURATIONS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Duration (Hindi)">
                      <input className={inpCls} value={form.duration_hi} onChange={e => setField("duration_hi", e.target.value)} placeholder="e.g. 3 महीने" />
                    </Field>
                    <Field label="Start Date">
                      <input type="date" className={inpCls} value={form.start_date} onChange={e => setField("start_date", e.target.value)} />
                    </Field>
                    <div>
                      <span className={labelCls}>Theme Color</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {THEMES.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setField("theme", t)}
                            title={t}
                            aria-label={`Theme ${t}`}
                            aria-pressed={form.theme === t}
                            className={`h-7 w-7 rounded-full transition-transform ${form.theme === t ? "scale-110 ring-2 ring-slate-800 ring-offset-2 dark:ring-slate-100 dark:ring-offset-slate-900" : ""}`}
                            style={{ backgroundColor: themeColors[t] || themeColors.blue }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field label="Total Fee (₹)">
                      <input type="number" className={inpCls} value={form.fee} onChange={e => setField("fee", Number(e.target.value))} min={0} />
                    </Field>
                    <div>
                      <Field label="Pre-Book Amount (₹)" required>
                        <input type="number" className={inpCls} value={form.prebook_amount} onChange={e => setField("prebook_amount", Number(e.target.value))} min={0} />
                      </Field>
                      <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Non-refundable seat booking charge</p>
                    </div>
                    <Field label="Max Seats">
                      <input type="number" className={inpCls} value={form.max_seats} onChange={e => setField("max_seats", Number(e.target.value))} min={1} />
                    </Field>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Banner Image URL">
                      <input className={inpCls} value={form.banner_url} onChange={e => setField("banner_url", e.target.value)} placeholder="https://example.com/course-banner.jpg" />
                    </Field>
                    <div>
                      <span className={labelCls}>Tags</span>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {form.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">
                            {tag}
                            <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`} className="cursor-pointer text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        className={`${inpCls} !text-xs`}
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                        placeholder="Type tag and press Enter..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.is_published}
                      aria-label="Publish immediately"
                      onClick={() => setField("is_published", !form.is_published)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${form.is_published ? "bg-blue-700 dark:bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form.is_published ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                    <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">Publish immediately</span>
                  </div>
                </div>
              </section>

              {/* ── Section 2: Eligibility & Certification ── */}
              <section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <SecHdr icon={ClipboardList} label="Eligibility & Certification" />
                <div className="p-5">
                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Eligibility (English)">
                      <input className={inpCls} value={form.eligibility} onChange={e => setField("eligibility", e.target.value)} placeholder="10th Pass / 12th Pass / Graduate" />
                    </Field>
                    <Field label="Eligibility (Hindi)">
                      <input className={inpCls} value={form.eligibility_hi} onChange={e => setField("eligibility_hi", e.target.value)} placeholder="दसवीं पास / बारहवीं पास" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Certification (English)">
                      <input className={inpCls} value={form.certification} onChange={e => setField("certification", e.target.value)} placeholder="NSQF Level 4 / ISO Certified / Government Recognized" />
                    </Field>
                    <Field label="Certification (Hindi)">
                      <input className={inpCls} value={form.certification_hi} onChange={e => setField("certification_hi", e.target.value)} placeholder="एनएसक्यूएफ स्तर 4" />
                    </Field>
                  </div>
                </div>
              </section>

              {/* ── Section 3: Course Syllabus ── */}
              <section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <SecHdr icon={BookOpen} label="Course Syllabus" />
                <div className="p-5">
                  <div className="flex flex-col gap-2.5">
                    {form.syllabus.map((item, i) => (
                      <div key={i} className="grid grid-cols-[2fr_1.5fr_80px_auto] items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                        <input className={`${inpCls} !text-xs`} placeholder="Topic (English)" value={item.topic} onChange={e => updateSyllabus(i, "topic", e.target.value)} />
                        <input className={`${inpCls} !text-xs`} placeholder="Topic (Hindi)" value={item.topic_hi} onChange={e => updateSyllabus(i, "topic_hi", e.target.value)} />
                        <input type="number" className={`${inpCls} !text-xs`} placeholder="Hrs" value={item.hours} onChange={e => updateSyllabus(i, "hours", Number(e.target.value))} min={0} />
                        <button onClick={() => removeSyllabus(i)} aria-label={`Remove topic ${i + 1}`} className={btnDanger}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addSyllabus} className={`${btnGhost} mt-3 w-full justify-center border-2 border-dashed`}>
                    <Plus className="h-3.5 w-3.5" /> Add Topic
                  </button>
                </div>
              </section>

              {/* ── JSON Preview ── */}
              <details className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 dark:border-slate-700">
                <summary className="flex cursor-pointer select-none items-center gap-2 px-[18px] py-3 font-mono text-xs font-semibold text-slate-400">
                  <Braces className="h-3.5 w-3.5" /> JSON Preview (debug)
                </summary>
                <pre className="max-h-96 overflow-auto px-[18px] pb-[18px] font-mono text-[11px] leading-relaxed text-green-400">
                  {JSON.stringify(form, null, 2)}
                </pre>
              </details>

              {/* ── Bottom submit bar ── */}
              <div className="flex justify-end gap-3 pb-10">
                <button onClick={() => handleSubmit(false)} disabled={submitting} className={`${btnGhost} px-6 py-2.5 !text-sm`}>
                  Save as Draft
                </button>
                <button onClick={() => handleSubmit(true)} disabled={submitting} className={`${btnPrimary} px-7 py-2.5 !text-sm`}>
                  {submitting ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing…</>
                  ) : (
                    <><Rocket className="h-3.5 w-3.5" /> {editId ? "Update Course" : "Publish Course"}</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
