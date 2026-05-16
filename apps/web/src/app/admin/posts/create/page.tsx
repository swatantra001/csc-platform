// "use client";

// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
//   KeyboardEvent,
// } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { adminCreatePostAction, adminUpdatePostAction, adminGetPostAction } from "@/app/actions/admin";

// // ─── TYPES ────────────────────────────────────────────────────────────────────
// interface ImportantDate {
//   label: string;
//   label_hi: string;
//   date: string;
//   is_bold: boolean;
// }
// interface VacancyRow {
//   post_name: string;
//   no_of_posts: number;
//   category: string;
// }
// interface EligibilityRow {
//   post_name: string;
//   criteria: string;
//   criteria_hi: string;
// }
// interface LinkRow {
//   label: string;
//   label_hi: string;
//   url: string;
//   is_active: boolean;
// }
// interface FaqRow {
//   question: string;
//   answer: string;
// }
// interface AlsoCheckRow {
//   label: string;
//   url: string;
// }
// type ToastType = "success" | "error" | "info";
// interface Toast {
//   id: number;
//   message: string;
//   type: ToastType;
// }

// // ─── CONSTANTS ────────────────────────────────────────────────────────────────
// const CATEGORIES = ["Latest Job", "Admit Card", "Result", "Admission", "Syllabus", "Answer Key", "Sarkari Yojana", "Police Jobs", "Railway Jobs", "Bank Jobs", "Teaching Jobs", "Defence Jobs", "State PSC", "SSC", "UPSC"];
// const THEMES = ["blue", "green", "red", "orange", "purple", "teal", "indigo", "rose"];
// const PAYMENT_MODES = ["Debit Card", "Credit Card", "Internet Banking", "IMPS", "Cash Card / Mobile Wallet", "UPI", "Net Banking"];
// const SELECTION_MODES = ["Written Exam", "CBT", "Descriptive", "Skill Test", "Interview", "Physical Test", "Document Verification", "Merit List", "Group Discussion"];

// const LLM_PROMPT = `You are a data extraction assistant for a Sarkari Job Portal. Based on the recruitment notification details I provide, generate a structured JSON object with ALL fields filled accurately.

// Return ONLY valid JSON with this exact structure (no markdown, no preamble, no code fences):

// {
//   "title": "Full English title of the post e.g. SSC Stenographer Recruitment 2026",
//   "title_hi": "Hindi title",
//   "short_desc": "2-3 sentence English description of the recruitment",
//   "organization": "Full name of the recruiting organization",
//   "organization_hi": "Organization name in Hindi",
//   "category": "One of: Latest Job, Admit Card, Result, Admission, Syllabus, Answer Key, Police Jobs, Railway Jobs, Bank Jobs, Teaching Jobs, Defence Jobs, State PSC, SSC, UPSC",
//   "theme": "One of: blue, green, red, orange, purple, teal, indigo, rose",
//   "service_cost": 0,
//   "total_posts": 0,
//   "post_date": "YYYY-MM-DD",
//   "tags": ["tag1", "tag2"],
//   "slug": "lowercase-hyphenated-slug-2026",
//   "whatsapp_link": "",
//   "telegram_link": "",
//   "important_dates": [
//     { "label": "Online Apply Start Date", "label_hi": "ऑनलाइन आवेदन शुरू", "date": "YYYY-MM-DD", "is_bold": true },
//     { "label": "Online Apply Last Date", "label_hi": "ऑनलाइन आवेदन अंतिम तिथि", "date": "YYYY-MM-DD", "is_bold": true },
//     { "label": "Last Date For Fee Payment", "label_hi": "शुल्क भुगतान अंतिम तिथि", "date": "YYYY-MM-DD", "is_bold": false },
//     { "label": "Exam Date", "label_hi": "परीक्षा तिथि", "date": "", "is_bold": false },
//     { "label": "Admit Card", "label_hi": "प्रवेश पत्र", "date": "", "is_bold": false },
//     { "label": "Result Date", "label_hi": "परिणाम तिथि", "date": "", "is_bold": false }
//   ],
//   "fee_general": 100,
//   "fee_sc_st": 0,
//   "fee_ph": 0,
//   "fee_payment_modes": ["Debit Card", "Credit Card", "Internet Banking", "IMPS", "UPI"],
//   "age_min": 18,
//   "age_max": "27 Years",
//   "age_as_on_date": "YYYY-MM-DD",
//   "age_relaxation": "Age relaxation as per government rules for reserved categories.",
//   "vacancy_details": [
//     { "post_name": "Post Name", "no_of_posts": 100, "category": "" }
//   ],
//   "eligibility": [
//     { "post_name": "Post Name", "criteria": "English eligibility criteria", "criteria_hi": "Hindi eligibility criteria" }
//   ],
//   "selection_process": ["CBT", "Skill Test", "Document Verification"],
//   "how_to_apply": "Step-by-step English instructions for applying online.",
//   "how_to_apply_hi": "Step-by-step Hindi instructions for applying online.",
//   "important_links": [
//     { "label": "Apply Online Link", "label_hi": "ऑनलाइन आवेदन करें", "url": "https://", "is_active": true },
//     { "label": "Download Official Notification", "label_hi": "आधिकारिक अधिसूचना डाउनलोड करें", "url": "https://", "is_active": true },
//     { "label": "Official Website", "label_hi": "आधिकारिक वेबसाइट", "url": "https://", "is_active": true }
//   ],
//   "faqs": [
//     { "question": "When will the online application start?", "answer": "The online application starts on [date]." },
//     { "question": "What is the last date to apply?", "answer": "The last date is [date]." },
//     { "question": "What is the age limit?", "answer": "Minimum [X] years, Maximum [Y] years." },
//     { "question": "What is the eligibility criteria?", "answer": "Candidates must have [qualification]." },
//     { "question": "What is the official website?", "answer": "The official website is [url]." }
//   ],
//   "also_check": [
//     { "label": "Related Post Name", "url": "https://" }
//   ]
// }

// Now generate the JSON for the following recruitment notification:
// [PASTE YOUR NOTIFICATION DETAILS HERE — job title, organization, dates, vacancies, eligibility, fee, links, etc.]`;

// const ONBOARDING = [
//   { icon: "🤖", title: "Step 1 – Copy the LLM Prompt", desc: 'Click "Copy LLM Prompt" at the top of this page. This copies a pre-built instruction for any AI like ChatGPT, Claude, or Gemini.' },
//   { icon: "📋", title: "Step 2 – Paste into your AI", desc: "Open your favourite AI assistant, paste the prompt, and add the raw recruitment notification details at the bottom where indicated." },
//   { icon: "✨", title: "Step 3 – Copy the JSON", desc: "The AI will return a clean JSON object with all fields filled accurately. Copy that entire JSON response." },
//   { icon: "⌨️", title: "Step 4 – Press Ctrl+V here!", desc: "Return to this page and press Ctrl+V (Cmd+V on Mac) anywhere. All form fields will instantly populate!" },
//   { icon: "🚀", title: "Step 5 – Review & Publish", desc: "Review the auto-filled fields, make any manual corrections, then click Publish Post. Done!" },
// ];

// const defaultForm = () => ({
//   title: "", title_hi: "", short_desc: "", theme: "blue", service_cost: 0,
//   category: "Latest Job", tags: [] as string[], slug: "", banner_url: "", is_published: true,
//   organization: "", organization_hi: "", total_posts: 0,
//   post_date: new Date().toISOString().split("T")[0],
//   important_dates: [] as ImportantDate[],
//   fee_general: 100, fee_sc_st: 0, fee_ph: 0,
//   fee_payment_modes: ["Debit Card", "Credit Card", "Internet Banking", "IMPS", "UPI"] as string[],
//   age_min: 18, age_max: "", age_as_on_date: "", age_relaxation: "",
//   vacancy_details: [] as VacancyRow[],
//   eligibility: [] as EligibilityRow[],
//   selection_process: [] as string[],
//   how_to_apply: "", how_to_apply_hi: "",
//   important_links: [] as LinkRow[],
//   faqs: [] as FaqRow[],
//   also_check: [] as AlsoCheckRow[],
//   whatsapp_link: "", telegram_link: "",
// });

// // ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
// function Section({ title, icon, children, accent = "blue" }: { title: string; icon: string; children: React.ReactNode; accent?: string }) {
//   const accents: Record<string, string> = {
//     blue: "from-blue-600 to-blue-400 border-blue-200",
//     green: "from-emerald-600 to-emerald-400 border-emerald-200",
//     orange: "from-orange-500 to-amber-400 border-orange-200",
//     purple: "from-violet-600 to-purple-400 border-purple-200",
//     red: "from-rose-600 to-red-400 border-rose-200",
//     teal: "from-teal-600 to-cyan-400 border-teal-200",
//   };
//   const cls = accents[accent] || accents.blue;
//   return (
//     <div className={`bg-white rounded-2xl border ${cls.split(" ")[2]} shadow-sm overflow-hidden mb-6`}>
//       <div className={`bg-gradient-to-r ${cls.split(" ")[0]} ${cls.split(" ")[1]} px-5 py-3 flex items-center gap-2`}>
//         <span className="text-xl">{icon}</span>
//         <h2 className="text-white font-bold text-sm tracking-wide uppercase">{title}</h2>
//       </div>
//       <div className="p-5 space-y-4">{children}</div>
//     </div>
//   );
// }

// // ─── FORM HELPERS ─────────────────────────────────────────────────────────────
// function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
//   return (
//     <div>
//       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
//       {children}
//       {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
//     </div>
//   );
// }

// const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-gray-50 hover:bg-white";
// const textarea = inp + " resize-none";

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// export default function AdminCreatePostPage() {
//   const router = useRouter();
//   const [form, setForm] = useState(defaultForm());
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [pasteFlash, setPasteFlash] = useState(false);
//   const [tagInput, setTagInput] = useState("");

//   // Onboarding state
//   const [onboardingStep, setOnboardingStep] = useState(0); // 0 = visible on step 0
//   const [showOnboarding, setShowOnboarding] = useState(true);
//   const [onboardingDismissed, setOnboardingDismissed] = useState(false);

//   const searchParams = useSearchParams();
//   const editId = searchParams.get("id"); // ✨ Check if we are in Edit Mode!
//   const [loadingEdit, setLoadingEdit] = useState(!!editId); // Show loading spinner if editing

//   // ── Toast helpers ──────────────────────────────────────────────────────────
//   const addToast = useCallback((message: string, type: ToastType = "info") => {
//     const id = Date.now();
//     setToasts((t) => [...t, { id, message, type }]);
//     setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
//   }, []);

//   // ── Onboarding ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const dismissed = localStorage.getItem("csc_post_onboarding_dismissed");
//     if (dismissed === "1") {
//       setShowOnboarding(false);
//       setOnboardingDismissed(true);
//     }
//   }, []);

//   // ✨ FETCH EXISTING POST FOR EDITING (Using Server Action)
//   useEffect(() => {
//     async function fetchPost() {
//       if (!editId) return;

//       try {
//         const data = await adminGetPostAction(editId);
//         if (data) {
//           applyParsedJson(data); // Auto-fills the entire form safely!
//         }
//       } catch (error) {
//         console.error(error);
//         addToast("Failed to load post for editing.", "error");
//       } finally {
//         setLoadingEdit(false);
//       }
//     }
//     fetchPost();
//   }, [editId]);

//   const dismissOnboarding = () => {
//     setShowOnboarding(false);
//     setOnboardingDismissed(true);
//     localStorage.setItem("csc_post_onboarding_dismissed", "1");
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

//   // ── Global Paste Handler ───────────────────────────────────────────────────
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const ev = e as ClipboardEvent;
//       (async () => {
//         const active = document.activeElement as HTMLElement;
//         const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");
//         if (isInput) return; // Let normal paste work in inputs

//         const text = ev.clipboardData?.getData("text/plain") || "";
//         if (!text.trim()) return;

//         // Try to detect JSON
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
//     setForm((prev) => ({
//       ...prev,
//       title: (parsed.title as string) || prev.title,
//       title_hi: (parsed.title_hi as string) || prev.title_hi,
//       short_desc: (parsed.short_desc as string) || prev.short_desc,
//       organization: (parsed.organization as string) || prev.organization,
//       organization_hi: (parsed.organization_hi as string) || prev.organization_hi,
//       category: (parsed.category as string) || prev.category,
//       theme: (parsed.theme as string) || prev.theme,
//       service_cost: Number(parsed.service_cost) || prev.service_cost,
//       total_posts: Number(parsed.total_posts) || prev.total_posts,
//       post_date: (parsed.post_date as string) || prev.post_date,
//       tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : prev.tags,
//       slug: (parsed.slug as string) || prev.slug,
//       banner_url: (parsed.banner_url as string) || prev.banner_url,
//       whatsapp_link: (parsed.whatsapp_link as string) || prev.whatsapp_link,
//       telegram_link: (parsed.telegram_link as string) || prev.telegram_link,
//       important_dates: Array.isArray(parsed.important_dates) ? (parsed.important_dates as ImportantDate[]) : prev.important_dates,
//       fee_general: Number(parsed.fee_general) ?? prev.fee_general,
//       fee_sc_st: Number(parsed.fee_sc_st) ?? prev.fee_sc_st,
//       fee_ph: Number(parsed.fee_ph) ?? prev.fee_ph,
//       fee_payment_modes: Array.isArray(parsed.fee_payment_modes) ? (parsed.fee_payment_modes as string[]) : prev.fee_payment_modes,
//       age_min: Number(parsed.age_min) || prev.age_min,
//       age_max: (parsed.age_max as string) || prev.age_max,
//       age_as_on_date: (parsed.age_as_on_date as string) || prev.age_as_on_date,
//       age_relaxation: (parsed.age_relaxation as string) || prev.age_relaxation,
//       vacancy_details: Array.isArray(parsed.vacancy_details) ? (parsed.vacancy_details as VacancyRow[]) : prev.vacancy_details,
//       eligibility: Array.isArray(parsed.eligibility) ? (parsed.eligibility as EligibilityRow[]) : prev.eligibility,
//       selection_process: Array.isArray(parsed.selection_process) ? (parsed.selection_process as string[]) : prev.selection_process,
//       how_to_apply: (parsed.how_to_apply as string) || prev.how_to_apply,
//       how_to_apply_hi: (parsed.how_to_apply_hi as string) || prev.how_to_apply_hi,
//       important_links: Array.isArray(parsed.important_links) ? (parsed.important_links as LinkRow[]) : prev.important_links,
//       faqs: Array.isArray(parsed.faqs) ? (parsed.faqs as FaqRow[]) : prev.faqs,
//       also_check: Array.isArray(parsed.also_check) ? (parsed.also_check as AlsoCheckRow[]) : prev.also_check,
//     }));
//   };

//   // ── Field updater ──────────────────────────────────────────────────────────
//   const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

//   // ── Array row updaters ─────────────────────────────────────────────────────
//   const updateRow = <T,>(key: string, idx: number, field: keyof T, val: unknown) => {
//     setForm((f) => {
//       const arr = [...(f[key as keyof typeof f] as T[])];
//       arr[idx] = { ...arr[idx], [field]: val };
//       return { ...f, [key]: arr };
//     });
//   };

//   const addRow = <T,>(key: string, template: T) => {
//     setForm((f) => ({ ...f, [key]: [...(f[key as keyof typeof f] as T[]), { ...template }] }));
//   };

//   const removeRow = (key: string, idx: number) => {
//     setForm((f) => {
//       const arr = [...(f[key as keyof typeof f] as unknown[])];
//       arr.splice(idx, 1);
//       return { ...f, [key]: arr };
//     });
//   };

//   // ── Tags ───────────────────────────────────────────────────────────────────
//   const addTag = () => {
//     const t = tagInput.trim();
//     if (t && !form.tags.includes(t)) {
//       set("tags", [...form.tags, t]);
//     }
//     setTagInput("");
//   };

//   const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag));

//   // ── Selection Process ──────────────────────────────────────────────────────
//   const toggleSelection = (mode: string) => {
//     if (form.selection_process.includes(mode)) {
//       set("selection_process", form.selection_process.filter((m) => m !== mode));
//     } else {
//       set("selection_process", [...form.selection_process, mode]);
//     }
//   };

//   // ── Payment Modes ──────────────────────────────────────────────────────────
//   const togglePayMode = (mode: string) => {
//     if (form.fee_payment_modes.includes(mode)) {
//       set("fee_payment_modes", form.fee_payment_modes.filter((m) => m !== mode));
//     } else {
//       set("fee_payment_modes", [...form.fee_payment_modes, mode]);
//     }
//   };

//   // ── Submit ─────────────────────────────────────────────────────────────────
//   const handleSubmit = async (publish: boolean) => {
//     if (!form.title.trim()) { addToast("Title is required.", "error"); return; }
//     if (!form.organization.trim()) { addToast("Organization is required.", "error"); return; }

//     setSubmitting(true);
//     try {
//       // await adminCreatePostAction({ ...form, is_published: publish });
//       // addToast(publish ? "Post published successfully! 🎉" : "Post saved as draft.", "success");
//       if (editId) {
//         // ✨ If we have an ID, Update!
//         await adminUpdatePostAction(editId, { ...form, is_published: publish });
//         addToast("Post updated successfully! 📝", "success");
//       } else {
//         // ✨ Otherwise, Create!
//         await adminCreatePostAction({ ...form, is_published: publish });
//         addToast(publish ? "Post published successfully! 🎉" : "Post saved as draft.", "success");
//       }
//       setTimeout(() => router.push("/admin/posts"), 1500);
//     } catch (err: unknown) {
//       addToast((err as Error).message || "Failed to create post.", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${pasteFlash ? "ring-4 ring-emerald-400 ring-inset" : ""}`}>

//       {/* ── Toast Stack ──────────────────────────────────────────────────── */}
//       <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-xs">
//         {toasts.map((t) => (
//           <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all animate-in slide-in-from-right ${t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-rose-500" : "bg-blue-500"}`}>
//             {t.message}
//           </div>
//         ))}
//       </div>

//       {/* ── Onboarding Overlay ────────────────────────────────────────────── */}
//       {showOnboarding && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
//             {/* Progress */}
//             <div className="h-1 bg-gray-100">
//               <div
//                 className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
//                 style={{ width: `${((onboardingStep + 1) / ONBOARDING.length) * 100}%` }}
//               />
//             </div>

//             <div className="p-8">
//               <div className="text-center mb-6">
//                 <div className="text-5xl mb-3">{ONBOARDING[onboardingStep].icon}</div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">{ONBOARDING[onboardingStep].title}</h3>
//                 <p className="text-gray-500 text-sm leading-relaxed">{ONBOARDING[onboardingStep].desc}</p>
//               </div>

//               {/* Step dots */}
//               <div className="flex justify-center gap-2 mb-6">
//                 {ONBOARDING.map((_, i) => (
//                   <button key={i} onClick={() => setOnboardingStep(i)}
//                     className={`w-2 h-2 rounded-full transition-all ${i === onboardingStep ? "bg-blue-500 w-6" : "bg-gray-200"}`}
//                   />
//                 ))}
//               </div>

//               <div className="flex gap-3">
//                 <button onClick={dismissOnboarding}
//                   className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition font-medium">
//                   Skip Instructions
//                 </button>
//                 {onboardingStep < ONBOARDING.length - 1 ? (
//                   <button onClick={() => setOnboardingStep((s) => s + 1)}
//                     className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition">
//                     Next →
//                   </button>
//                 ) : (
//                   <button onClick={dismissOnboarding}
//                     className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold hover:opacity-90 transition">
//                     Let's Go! 🚀
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Page Header ──────────────────────────────────────────────────── */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
//           <button onClick={() => router.back()}
//             className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
//             ← Back
//           </button>

//           <div className="flex-1 min-w-0">
//             <h1 className="font-bold text-gray-800 text-base leading-tight truncate">
//               {editId ? `Editing: ${form.title}` : (form.title || "New Post")}
//             </h1>
//             <p className="text-xs text-gray-400">{form.category} · {form.theme}</p>
//           </div>

//           <div className="flex items-center gap-2 flex-wrap">
//             {/* Re-show instructions */}
//             {onboardingDismissed && (
//               <button onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }}
//                 className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
//                 📖 Instructions
//               </button>
//             )}

//             {/* Copy LLM Prompt */}
//             <button onClick={copyPrompt}
//               className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:opacity-90 transition shadow-sm">
//               <span>🤖</span> Copy LLM Prompt
//             </button>

//             {/* Save Draft */}
//             <button onClick={() => handleSubmit(false)} disabled={submitting}
//               className="text-xs px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium disabled:opacity-50">
//               Save Draft
//             </button>

//             {/* Publish */}
//             <button onClick={() => handleSubmit(true)} disabled={submitting}
//               className="text-xs px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5">
//               {submitting ? (
//                 <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />{editId ? "Updating..." : "Publishing..."}</>
//               ) : (<>🚀 {editId ? "Update" : "Publish"}</>)}
//             </button>
//           </div>
//         </div>

//         {/* Paste hint bar */}
//         <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100 px-4 py-1.5 flex items-center gap-2">
//           <span className="text-emerald-600 text-xs font-medium">⌨️</span>
//           <p className="text-xs text-emerald-700">
//             <strong>Ctrl+V</strong> anywhere outside a text box to auto-populate all fields from AI JSON output
//           </p>
//           {pasteFlash && <span className="ml-auto text-xs font-bold text-emerald-600 animate-bounce">✅ Populated!</span>}
//         </div>
//       </div>

//       {/* ── Main Form ────────────────────────────────────────────────────── */}
//       <div className="max-w-5xl mx-auto px-4 py-6">

//         {/* ── SECTION 1: Basic Info ─────────────────────────────────────── */}
//         <Section title="Basic Information" icon="📰" accent="blue">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field label="Title (English) *">
//               <input className={inp} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="SSC Stenographer Recruitment 2026" />
//             </Field>
//             <Field label="Title (Hindi)">
//               <input className={inp} value={form.title_hi} onChange={(e) => set("title_hi", e.target.value)} placeholder="एसएससी स्टेनोग्राफर भर्ती 2026" />
//             </Field>
//             <Field label="Organization (English) *">
//               <input className={inp} value={form.organization} onChange={(e) => set("organization", e.target.value)} placeholder="Staff Selection Commission (SSC)" />
//             </Field>
//             <Field label="Organization (Hindi)">
//               <input className={inp} value={form.organization_hi} onChange={(e) => set("organization_hi", e.target.value)} placeholder="कर्मचारी चयन आयोग" />
//             </Field>
//             <Field label="Short Description" hint="Shown as subtitle on listing cards">
//               <textarea className={textarea} rows={3} value={form.short_desc} onChange={(e) => set("short_desc", e.target.value)} placeholder="SSC has released a notification for Stenographer Grade C & D posts..." />
//             </Field>
//             <div className="space-y-4">
//               <Field label="Category">
//                 <select className={inp} value={form.category} onChange={(e) => set("category", e.target.value)}>
//                   {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//                 </select>
//               </Field>
//               <Field label="Theme Color">
//                 <div className="flex gap-2 flex-wrap">
//                   {THEMES.map((t) => {
//                     const colors: Record<string, string> = { blue: "bg-blue-500", green: "bg-emerald-500", red: "bg-rose-500", orange: "bg-orange-500", purple: "bg-violet-500", teal: "bg-teal-500", indigo: "bg-indigo-500", rose: "bg-rose-400" };
//                     return (
//                       <button key={t} type="button" onClick={() => set("theme", t)}
//                         className={`w-8 h-8 rounded-full ${colors[t]} transition-all ${form.theme === t ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-60 hover:opacity-100"}`}
//                         title={t}
//                       />
//                     );
//                   })}
//                 </div>
//               </Field>
//             </div>
//             <Field label="Post Date">
//               <input type="date" className={inp} value={form.post_date} onChange={(e) => set("post_date", e.target.value)} />
//             </Field>
//             <Field label="Total Posts">
//               <input type="number" className={inp} value={form.total_posts} onChange={(e) => set("total_posts", Number(e.target.value))} min={0} />
//             </Field>
//             <Field label="Service Cost (₹)" hint="Amount charged to users if this is a paid service">
//               <input type="number" className={inp} value={form.service_cost} onChange={(e) => set("service_cost", Number(e.target.value))} min={0} />
//             </Field>
//             <Field label="URL Slug" hint="Auto-generated if left blank">
//               <input className={inp} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="ssc-stenographer-recruitment-2026" />
//             </Field>
//             <Field label="Banner Image URL" hint="Paste a direct image URL for the post banner">
//               <input className={inp} value={form.banner_url} onChange={(e) => set("banner_url", e.target.value)} placeholder="https://example.com/image.jpg" />
//             </Field>
//             <div className="md:col-span-2">
//               <Field label="Tags" hint="Press Enter or comma to add">
//                 <div className="flex flex-wrap gap-1.5 mb-2">
//                   {form.tags.map((tag) => (
//                     <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                       {tag}
//                       <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-blue-700 leading-none">×</button>
//                     </span>
//                   ))}
//                 </div>
//                 <input
//                   className={inp}
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
//                   placeholder="Type a tag and press Enter…"
//                 />
//               </Field>
//             </div>
//             <div className="flex items-center gap-3">
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" className="sr-only peer" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500" />
//               </label>
//               <span className="text-sm font-medium text-gray-700">Publish immediately</span>
//             </div>
//           </div>
//         </Section>

//         {/* ── SECTION 2: Important Dates ────────────────────────────────── */}
//         <Section title="Important Dates" icon="📅" accent="orange">
//           <div className="space-y-3">
//             {form.important_dates.map((row, i) => (
//               <div key={i} className="grid grid-cols-12 gap-2 items-start bg-orange-50 rounded-xl p-3">
//                 <div className="col-span-3">
//                   <input className={inp} placeholder="Label (EN)" value={row.label} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "label", e.target.value)} />
//                 </div>
//                 <div className="col-span-3">
//                   <input className={inp} placeholder="Label (HI)" value={row.label_hi} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "label_hi", e.target.value)} />
//                 </div>
//                 <div className="col-span-3">
//                   <input type="date" className={inp} value={row.date} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "date", e.target.value)} />
//                 </div>
//                 <div className="col-span-2 flex items-center gap-2 mt-1.5">
//                   <input type="checkbox" checked={row.is_bold} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "is_bold", e.target.checked)} className="accent-orange-500" />
//                   <span className="text-xs text-gray-500">Bold</span>
//                 </div>
//                 <div className="col-span-1 flex justify-end">
//                   <button onClick={() => removeRow("important_dates", i)} className="text-red-400 hover:text-red-600 text-lg font-bold leading-none mt-0.5">×</button>
//                 </div>
//               </div>
//             ))}
//             <button onClick={() => addRow("important_dates", { label: "", label_hi: "", date: "", is_bold: false })}
//               className="w-full py-2 rounded-xl border-2 border-dashed border-orange-200 text-orange-500 text-sm font-medium hover:bg-orange-50 transition">
//               + Add Date
//             </button>
//           </div>
//         </Section>

//         {/* ── SECTION 3: Application Fee ───────────────────────────────── */}
//         <Section title="Application Fee" icon="💰" accent="green">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Field label="General / OBC / EWS (₹)">
//               <input type="number" className={inp} value={form.fee_general} onChange={(e) => set("fee_general", Number(e.target.value))} min={0} />
//             </Field>
//             <Field label="SC / ST / Female (₹)">
//               <input type="number" className={inp} value={form.fee_sc_st} onChange={(e) => set("fee_sc_st", Number(e.target.value))} min={0} />
//             </Field>
//             <Field label="PH / Divyangjan (₹)">
//               <input type="number" className={inp} value={form.fee_ph} onChange={(e) => set("fee_ph", Number(e.target.value))} min={0} />
//             </Field>
//           </div>
//           <Field label="Payment Modes">
//             <div className="flex flex-wrap gap-2 mt-1">
//               {PAYMENT_MODES.map((m) => (
//                 <button key={m} type="button" onClick={() => togglePayMode(m)}
//                   className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${form.fee_payment_modes.includes(m) ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300"}`}>
//                   {m}
//                 </button>
//               ))}
//             </div>
//           </Field>
//         </Section>

//         {/* ── SECTION 4: Age Limit ─────────────────────────────────────── */}
//         <Section title="Age Limit" icon="🎂" accent="purple">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field label="Minimum Age (Years)">
//               <input type="number" className={inp} value={form.age_min} onChange={(e) => set("age_min", Number(e.target.value))} min={0} />
//             </Field>
//             <Field label="Maximum Age" hint='e.g. "27 Years" or "27 – 30 Years (Post Wise)"'>
//               <input className={inp} value={form.age_max} onChange={(e) => set("age_max", e.target.value)} placeholder="27 Years" />
//             </Field>
//             <Field label="Age as on Date">
//               <input type="date" className={inp} value={form.age_as_on_date} onChange={(e) => set("age_as_on_date", e.target.value)} />
//             </Field>
//             <Field label="Age Relaxation Note">
//               <input className={inp} value={form.age_relaxation} onChange={(e) => set("age_relaxation", e.target.value)} placeholder="As per govt. rules for reserved categories" />
//             </Field>
//           </div>
//         </Section>

//         {/* ── SECTION 5: Vacancy Details ───────────────────────────────── */}
//         <Section title="Vacancy Details" icon="📊" accent="blue">
//           <div className="space-y-3">
//             {form.vacancy_details.map((row, i) => (
//               <div key={i} className="grid grid-cols-12 gap-2 items-start bg-blue-50 rounded-xl p-3">
//                 <div className="col-span-5">
//                   <input className={inp} placeholder="Post Name" value={row.post_name} onChange={(e) => updateRow<VacancyRow>("vacancy_details", i, "post_name", e.target.value)} />
//                 </div>
//                 <div className="col-span-3">
//                   <input type="number" className={inp} placeholder="No. of Posts" value={row.no_of_posts} onChange={(e) => updateRow<VacancyRow>("vacancy_details", i, "no_of_posts", Number(e.target.value))} min={0} />
//                 </div>
//                 <div className="col-span-3">
//                   <input className={inp} placeholder="Category (optional)" value={row.category} onChange={(e) => updateRow<VacancyRow>("vacancy_details", i, "category", e.target.value)} />
//                 </div>
//                 <div className="col-span-1 flex justify-end">
//                   <button onClick={() => removeRow("vacancy_details", i)} className="text-red-400 hover:text-red-600 text-lg font-bold leading-none mt-1">×</button>
//                 </div>
//               </div>
//             ))}
//             <button onClick={() => addRow("vacancy_details", { post_name: "", no_of_posts: 0, category: "" })}
//               className="w-full py-2 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 text-sm font-medium hover:bg-blue-50 transition">
//               + Add Post
//             </button>
//           </div>
//         </Section>

//         {/* ── SECTION 6: Eligibility ───────────────────────────────────── */}
//         <Section title="Eligibility / Education Qualification" icon="🎓" accent="teal">
//           <div className="space-y-4">
//             {form.eligibility.map((row, i) => (
//               <div key={i} className="bg-teal-50 rounded-xl p-4 space-y-3 relative">
//                 <button onClick={() => removeRow("eligibility", i)}
//                   className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold leading-none">×</button>
//                 <Field label="Post Name">
//                   <input className={inp} value={row.post_name} onChange={(e) => updateRow<EligibilityRow>("eligibility", i, "post_name", e.target.value)} placeholder="e.g. Stenographer Grade C" />
//                 </Field>
//                 <Field label="Criteria (English)">
//                   <textarea className={textarea} rows={3} value={row.criteria} onChange={(e) => updateRow<EligibilityRow>("eligibility", i, "criteria", e.target.value)} placeholder="Candidates must have passed 10+2..." />
//                 </Field>
//                 <Field label="Criteria (Hindi)">
//                   <textarea className={textarea} rows={2} value={row.criteria_hi} onChange={(e) => updateRow<EligibilityRow>("eligibility", i, "criteria_hi", e.target.value)} placeholder="उम्मीदवारों को 12वीं पास होना चाहिए..." />
//                 </Field>
//               </div>
//             ))}
//             <button onClick={() => addRow("eligibility", { post_name: "", criteria: "", criteria_hi: "" })}
//               className="w-full py-2 rounded-xl border-2 border-dashed border-teal-200 text-teal-500 text-sm font-medium hover:bg-teal-50 transition">
//               + Add Eligibility Row
//             </button>
//           </div>
//         </Section>

//         {/* ── SECTION 7: Selection Process ─────────────────────────────── */}
//         <Section title="Mode of Selection" icon="🏆" accent="orange">
//           <Field label="Select all applicable stages">
//             <div className="flex flex-wrap gap-2 mt-1">
//               {SELECTION_MODES.map((m) => (
//                 <button key={m} type="button" onClick={() => toggleSelection(m)}
//                   className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${form.selection_process.includes(m) ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"}`}>
//                   {m}
//                 </button>
//               ))}
//             </div>
//             {form.selection_process.length > 0 && (
//               <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
//                 <span>Order:</span>
//                 {form.selection_process.map((s, i) => (
//                   <React.Fragment key={s}>
//                     <span className="text-orange-600 font-medium">{s}</span>
//                     {i < form.selection_process.length - 1 && <span>→</span>}
//                   </React.Fragment>
//                 ))}
//               </div>
//             )}
//           </Field>
//         </Section>

//         {/* ── SECTION 8: How to Apply ──────────────────────────────────── */}
//         <Section title="How to Apply" icon="📝" accent="blue">
//           <Field label="Instructions (English)">
//             <textarea className={textarea} rows={5} value={form.how_to_apply} onChange={(e) => set("how_to_apply", e.target.value)} placeholder="Step 1: Visit the official website...&#10;Step 2: Click on 'Apply Online'...&#10;Step 3: Fill in the application form..." />
//           </Field>
//           <Field label="Instructions (Hindi)">
//             <textarea className={textarea} rows={4} value={form.how_to_apply_hi} onChange={(e) => set("how_to_apply_hi", e.target.value)} placeholder="चरण 1: आधिकारिक वेबसाइट पर जाएं...&#10;चरण 2: 'ऑनलाइन आवेदन करें' पर क्लिक करें..." />
//           </Field>
//         </Section>

//         {/* ── SECTION 9: Important Links ───────────────────────────────── */}
//         <Section title="Important Links" icon="🔗" accent="purple">
//           <div className="space-y-3">
//             {form.important_links.map((row, i) => (
//               <div key={i} className="grid grid-cols-12 gap-2 items-start bg-purple-50 rounded-xl p-3">
//                 <div className="col-span-3">
//                   <input className={inp} placeholder="Label (EN)" value={row.label} onChange={(e) => updateRow<LinkRow>("important_links", i, "label", e.target.value)} />
//                 </div>
//                 <div className="col-span-3">
//                   <input className={inp} placeholder="Label (HI)" value={row.label_hi} onChange={(e) => updateRow<LinkRow>("important_links", i, "label_hi", e.target.value)} />
//                 </div>
//                 <div className="col-span-4">
//                   <input className={inp} placeholder="https://…" value={row.url} onChange={(e) => updateRow<LinkRow>("important_links", i, "url", e.target.value)} />
//                 </div>
//                 <div className="col-span-1 flex items-center gap-1 mt-1.5">
//                   <input type="checkbox" checked={row.is_active} onChange={(e) => updateRow<LinkRow>("important_links", i, "is_active", e.target.checked)} className="accent-purple-500" />
//                   <span className="text-xs text-gray-500">Live</span>
//                 </div>
//                 <div className="col-span-1 flex justify-end">
//                   <button onClick={() => removeRow("important_links", i)} className="text-red-400 hover:text-red-600 text-lg font-bold leading-none mt-0.5">×</button>
//                 </div>
//               </div>
//             ))}
//             <button onClick={() => addRow("important_links", { label: "", label_hi: "", url: "", is_active: true })}
//               className="w-full py-2 rounded-xl border-2 border-dashed border-purple-200 text-purple-500 text-sm font-medium hover:bg-purple-50 transition">
//               + Add Link
//             </button>
//           </div>
//         </Section>

//         {/* ── SECTION 10: FAQs ─────────────────────────────────────────── */}
//         <Section title="FAQ Section" icon="❓" accent="teal">
//           <div className="space-y-4">
//             {form.faqs.map((row, i) => (
//               <div key={i} className="bg-teal-50 rounded-xl p-4 space-y-2 relative">
//                 <button onClick={() => removeRow("faqs", i)}
//                   className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold leading-none">×</button>
//                 <Field label={`Q${i + 1} – Question`}>
//                   <input className={inp} value={row.question} onChange={(e) => updateRow<FaqRow>("faqs", i, "question", e.target.value)} placeholder="When will the online application start?" />
//                 </Field>
//                 <Field label="Answer">
//                   <textarea className={textarea} rows={2} value={row.answer} onChange={(e) => updateRow<FaqRow>("faqs", i, "answer", e.target.value)} placeholder="The online application starts on 24 April 2026." />
//                 </Field>
//               </div>
//             ))}
//             <button onClick={() => addRow("faqs", { question: "", answer: "" })}
//               className="w-full py-2 rounded-xl border-2 border-dashed border-teal-200 text-teal-500 text-sm font-medium hover:bg-teal-50 transition">
//               + Add FAQ
//             </button>
//           </div>
//         </Section>

//         {/* ── SECTION 11: Also Check ───────────────────────────────────── */}
//         <Section title="You May Also Check" icon="👀" accent="red">
//           <div className="space-y-3">
//             {form.also_check.map((row, i) => (
//               <div key={i} className="grid grid-cols-12 gap-2 items-start bg-rose-50 rounded-xl p-3">
//                 <div className="col-span-6">
//                   <input className={inp} placeholder="Post Name / Label" value={row.label} onChange={(e) => updateRow<AlsoCheckRow>("also_check", i, "label", e.target.value)} />
//                 </div>
//                 <div className="col-span-5">
//                   <input className={inp} placeholder="https://…" value={row.url} onChange={(e) => updateRow<AlsoCheckRow>("also_check", i, "url", e.target.value)} />
//                 </div>
//                 <div className="col-span-1 flex justify-end">
//                   <button onClick={() => removeRow("also_check", i)} className="text-red-400 hover:text-red-600 text-lg font-bold leading-none mt-1">×</button>
//                 </div>
//               </div>
//             ))}
//             <button onClick={() => addRow("also_check", { label: "", url: "" })}
//               className="w-full py-2 rounded-xl border-2 border-dashed border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 transition">
//               + Add Related Post
//             </button>
//           </div>
//         </Section>

//         {/* ── SECTION 12: Social Links ─────────────────────────────────── */}
//         <Section title="Social & Community Links" icon="📣" accent="green">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field label="WhatsApp Channel URL">
//               <input className={inp} value={form.whatsapp_link} onChange={(e) => set("whatsapp_link", e.target.value)} placeholder="https://whatsapp.com/channel/…" />
//             </Field>
//             <Field label="Telegram Channel URL">
//               <input className={inp} value={form.telegram_link} onChange={(e) => set("telegram_link", e.target.value)} placeholder="https://t.me/…" />
//             </Field>
//           </div>
//         </Section>

//         {/* ── Live JSON Preview ─────────────────────────────────────────── */}
//         <details className="bg-gray-900 rounded-2xl overflow-hidden mb-8">
//           <summary className="px-5 py-3 cursor-pointer text-gray-300 text-sm font-mono select-none hover:text-white">
//             🧩 JSON Preview (debug)
//           </summary>
//           <pre className="px-5 pb-5 text-xs text-green-400 overflow-auto max-h-96 leading-relaxed">
//             {JSON.stringify(form, null, 2)}
//           </pre>
//         </details>

//         {/* ── Bottom Submit Bar ────────────────────────────────────────── */}
//         <div className="flex gap-3 justify-end pb-10">
//           <button onClick={() => handleSubmit(false)} disabled={submitting}
//             className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium disabled:opacity-50">
//             Save as Draft
//           </button>
//           <button onClick={() => handleSubmit(true)} disabled={submitting}
//             className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg disabled:opacity-50 flex items-center gap-2 text-base">
//             {submitting ? (
//               <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Publishing…</>
//             ) : (<>🚀 Publish Post</>)}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




















"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  KeyboardEvent,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminCreatePostAction, adminUpdatePostAction, adminGetPostAction } from "@/app/actions/admin";
import { useAuth } from "@/components/AuthProvider";

// ─── TYPES (Preserved Exactly) ───────────────────────────────────────────────
interface ImportantDate {
  label: string;
  label_hi: string;
  date: string;
  is_bold: boolean;
}
interface VacancyRow {
  post_name: string;
  no_of_posts: number;
  category: string;
}
interface EligibilityRow {
  post_name: string;
  criteria: string;
  criteria_hi: string;
}
interface LinkRow {
  label: string;
  label_hi: string;
  url: string;
  is_active: boolean;
}
interface FaqRow {
  question: string;
  answer: string;
}
interface AlsoCheckRow {
  label: string;
  url: string;
}
type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// ─── CONSTANTS (Preserved Exactly) ───────────────────────────────────────────
const CATEGORIES = ["Latest Job", "Admit Card", "Result", "Admission", "Syllabus", "Answer Key", "Sarkari Yojana", "Police Jobs", "Railway Jobs", "Bank Jobs", "Teaching Jobs", "Defence Jobs", "State PSC", "SSC", "UPSC"];
const THEMES = ["blue", "green", "red", "orange", "purple", "teal", "indigo", "rose"];
const PAYMENT_MODES = ["Debit Card", "Credit Card", "Internet Banking", "IMPS", "Cash Card / Mobile Wallet", "UPI", "Net Banking"];
const SELECTION_MODES = ["Written Exam", "CBT", "Descriptive", "Skill Test", "Interview", "Physical Test", "Document Verification", "Merit List", "Group Discussion"];

const LLM_PROMPT = `You are a data extraction assistant for a Sarkari Job Portal. Based on the recruitment notification details I provide, generate a structured JSON object with ALL fields filled accurately.

Return ONLY valid JSON with this exact structure (no markdown, no preamble, no code fences):

{
  "title": "Full English title of the post e.g. SSC Stenographer Recruitment 2026",
  "title_hi": "Hindi title",
  "short_desc": "2-3 sentence English description of the recruitment",
  "organization": "Full name of the recruiting organization",
  "organization_hi": "Organization name in Hindi",
  "category": "One of: Latest Job, Admit Card, Result, Admission, Syllabus, Answer Key, Police Jobs, Railway Jobs, Bank Jobs, Teaching Jobs, Defence Jobs, State PSC, SSC, UPSC",
  "theme": "One of: blue, green, red, orange, purple, teal, indigo, rose",
  "service_cost": 0,
  "total_posts": 0,
  "post_date": "YYYY-MM-DD",
  "tags": ["tag1", "tag2"],
  "slug": "lowercase-hyphenated-slug-2026",
  "whatsapp_link": "",
  "telegram_link": "",
  "important_dates": [
    { "label": "Online Apply Start Date", "label_hi": "ऑनलाइन आवेदन शुरू", "date": "YYYY-MM-DD", "is_bold": true },
    { "label": "Online Apply Last Date", "label_hi": "ऑनलाइन आवेदन अंतिम तिथि", "date": "YYYY-MM-DD", "is_bold": true },
    { "label": "Last Date For Fee Payment", "label_hi": "शुल्क भुगतान अंतिम तिथि", "date": "YYYY-MM-DD", "is_bold": false },
    { "label": "Exam Date", "label_hi": "परीक्षा तिथि", "date": "", "is_bold": false },
    { "label": "Admit Card", "label_hi": "प्रवेश पत्र", "date": "", "is_bold": false },
    { "label": "Result Date", "label_hi": "परिणाम तिथि", "date": "", "is_bold": false }
  ],
  "fee_general": 100,
  "fee_sc_st": 0,
  "fee_ph": 0,
  "fee_payment_modes": ["Debit Card", "Credit Card", "Internet Banking", "IMPS", "UPI"],
  "age_min": 18,
  "age_max": "27 Years",
  "age_as_on_date": "YYYY-MM-DD",
  "age_relaxation": "Age relaxation as per government rules for reserved categories.",
  "vacancy_details": [
    { "post_name": "Post Name", "no_of_posts": 100, "category": "" }
  ],
  "eligibility": [
    { "post_name": "Post Name", "criteria": "English eligibility criteria", "criteria_hi": "Hindi eligibility criteria" }
  ],
  "selection_process": ["CBT", "Skill Test", "Document Verification"],
  "how_to_apply": "Step-by-step English instructions for applying online.",
  "how_to_apply_hi": "Step-by-step Hindi instructions for applying online.",
  "important_links": [
    { "label": "Apply Online Link", "label_hi": "ऑनलाइन आवेदन करें", "url": "https://", "is_active": true },
    { "label": "Download Official Notification", "label_hi": "आधिकारिक अधिसूचना डाउनलोड करें", "url": "https://", "is_active": true },
    { "label": "Official Website", "label_hi": "आधिकारिक वेबसाइट", "url": "https://", "is_active": true }
  ],
  "faqs": [
    { "question": "When will the online application start?", "answer": "The online application starts on [date]." },
    { "question": "What is the last date to apply?", "answer": "The last date is [date]." },
    { "question": "What is the age limit?", "answer": "Minimum [X] years, Maximum [Y] years." },
    { "question": "What is the eligibility criteria?", "answer": "Candidates must have [qualification]." },
    { "question": "What is the official website?", "answer": "The official website is [url]." }
  ],
  "also_check": [
    { "label": "Related Post Name", "url": "https://" }
  ]
}

Now generate the JSON for the following recruitment notification:
[PASTE YOUR NOTIFICATION DETAILS HERE — job title, organization, dates, vacancies, eligibility, fee, links, etc.]`;

const ONBOARDING = [
  { icon: "🤖", title: "Step 1 – Copy the LLM Prompt", desc: 'Click "Copy LLM Prompt" at the top of this page. This copies a pre-built instruction for any AI like ChatGPT, Claude, or Gemini.' },
  { icon: "📋", title: "Step 2 – Paste into your AI", desc: "Open your favourite AI assistant, paste the prompt, and add the raw recruitment notification details at the bottom where indicated." },
  { icon: "✨", title: "Step 3 – Copy the JSON", desc: "The AI will return a clean JSON object with all fields filled accurately. Copy that entire JSON response." },
  { icon: "⌨️", title: "Step 4 – Press Ctrl+V here!", desc: "Return to this page and press Ctrl+V (Cmd+V on Mac) anywhere. All form fields will instantly populate!" },
  { icon: "🚀", title: "Step 5 – Review & Publish", desc: "Review the auto-filled fields, make any manual corrections, then click Publish Post. Done!" },
];

const defaultForm = () => ({
  title: "", title_hi: "", short_desc: "", theme: "blue", service_cost: 0,
  category: "Latest Job", tags: [] as string[], slug: "", banner_url: "", is_published: true,
  organization: "", organization_hi: "", total_posts: 0,
  post_date: new Date().toISOString().split("T")[0],
  important_dates: [] as ImportantDate[],
  fee_general: 100, fee_sc_st: 0, fee_ph: 0,
  fee_payment_modes: ["Debit Card", "Credit Card", "Internet Banking", "IMPS", "UPI"] as string[],
  age_min: 18, age_max: "", age_as_on_date: "", age_relaxation: "",
  vacancy_details: [] as VacancyRow[],
  eligibility: [] as EligibilityRow[],
  selection_process: [] as string[],
  how_to_apply: "", how_to_apply_hi: "",
  important_links: [] as LinkRow[],
  faqs: [] as FaqRow[],
  also_check: [] as AlsoCheckRow[],
  whatsapp_link: "", telegram_link: "",
});

// ─── THEME TOKENS (Exact from Reference) ──────────────────────────────────────
const THEMES_TOKENS = {
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

type ThemeTokens = typeof THEMES_TOKENS.light;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
  X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Check: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
  Back: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>,
  Robot: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><circle cx="8" cy="15" r="1" /><circle cx="16" cy="15" r="1" /></svg>,
  Doc: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
};

// ─── NAV LINKS ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "http://localhost:3000/admin", label: "Admin", icon: "🏛️" },
  { href: "http://localhost:3000/admin/posts", label: "Posts", icon: "✏️" },
  { href: "http://localhost:3000/admin/galary", label: "Gallery", icon: "🖼️" },
  { href: "http://localhost:3000/admin/transactions", label: "Transactions", icon: "₹" },
  { href: "http://localhost:3000/dashboard/profile", label: "Profile", icon: "👤" },
];

// ─── CSS BUILDER ───────────────────────────────────────────────────────────────
function buildCss(T: ThemeTokens): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;background:${T.pageBg};color:${T.textPrimary};}
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
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-s:hover{filter:brightness(1.08);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

/* ── INPUT ── */
.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}
select.inp option{background:${T.modalBg};color:${T.inputText};}
textarea.inp{resize:vertical;min-height:80px;line-height:1.6;}

/* ── THEME TOGGLE ── */
.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

/* ── PILL / CHIP ── */
.pill{
  padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
  cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
  background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
}
.pill:hover{border-color:${T.accent};color:${T.accent};}
.pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

/* ── TAG ── */
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:${T.tagBg};color:${T.tagText};border:1px solid ${T.accentBorder};}

/* ── FORM ROW ── */
.form-row{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;align-items:start;}
.form-col-6{grid-column:span 6;}
.form-col-4{grid-column:span 4;}
.form-col-3{grid-column:span 3;}
.form-col-2{grid-column:span 2;}
.form-col-1{grid-column:span 1;}
@media(max-width:768px){.form-col-6,.form-col-4,.form-col-3,.form-col-2,.form-col-1{grid-column:span 12;}}

/* ── ANIMS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
`;
}

// ─── SECTION HEADER COMPONENT ────────────────────────────────────────────────
function SecHdr({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="sec-hdr">
      <span style={{ fontSize: "1.05rem" }}>{icon}</span>
      <span className="sec-hdr-txt">{label}</span>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function CreatePostContent() {
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES_TOKENS.dark : THEMES_TOKENS.light;

  const router = useRouter();
  const [form, setForm] = useState(defaultForm());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pasteFlash, setPasteFlash] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();


  // ── Toast helpers (Preserved) ──────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  // ── Onboarding (Preserved) ─────────────────────────────────────────────────
  useEffect(() => {
    const dismissed = localStorage.getItem("csc_post_onboarding_dismissed");
    if (dismissed === "1") {
      setShowOnboarding(false);
      setOnboardingDismissed(true);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [user]);


  // ── Fetch Edit Data (Preserved) ────────────────────────────────────────────
  useEffect(() => {
    async function fetchPost() {
      if (!editId) return;
      try {
        const data = await adminGetPostAction(editId);
        if (data) applyParsedJson(data);
      } catch (error) {
        console.error(error);
        addToast("Failed to load post for editing.", "error");
      } finally {
        setLoadingEdit(false);
      }
    }
    fetchPost();
  }, [editId]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    setOnboardingDismissed(true);
    localStorage.setItem("csc_post_onboarding_dismissed", "1");
  };

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark; setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  // ── Copy LLM Prompt (Preserved) ────────────────────────────────────────────
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(LLM_PROMPT);
      addToast("LLM Prompt copied! Now paste it into ChatGPT / Claude / Gemini.", "success");
    } catch {
      addToast("Failed to copy — please copy manually.", "error");
    }
  };

  // ── Global Paste Handler (Preserved) ───────────────────────────────────────
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
          addToast("✅ JSON pasted! All fields populated.", "success");
        } catch {
          // not valid JSON, ignore
        }
      })();
    };

    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, []);

  const applyParsedJson = (parsed: Record<string, unknown>) => {
    setForm((prev) => ({
      ...prev,
      title: (parsed.title as string) || prev.title,
      title_hi: (parsed.title_hi as string) || prev.title_hi,
      short_desc: (parsed.short_desc as string) || prev.short_desc,
      organization: (parsed.organization as string) || prev.organization,
      organization_hi: (parsed.organization_hi as string) || prev.organization_hi,
      category: (parsed.category as string) || prev.category,
      theme: (parsed.theme as string) || prev.theme,
      service_cost: Number(parsed.service_cost) || prev.service_cost,
      total_posts: Number(parsed.total_posts) || prev.total_posts,
      post_date: (parsed.post_date as string) || prev.post_date,
      tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : prev.tags,
      slug: (parsed.slug as string) || prev.slug,
      banner_url: (parsed.banner_url as string) || prev.banner_url,
      whatsapp_link: (parsed.whatsapp_link as string) || prev.whatsapp_link,
      telegram_link: (parsed.telegram_link as string) || prev.telegram_link,
      important_dates: Array.isArray(parsed.important_dates) ? (parsed.important_dates as ImportantDate[]) : prev.important_dates,
      fee_general: Number(parsed.fee_general) ?? prev.fee_general,
      fee_sc_st: Number(parsed.fee_sc_st) ?? prev.fee_sc_st,
      fee_ph: Number(parsed.fee_ph) ?? prev.fee_ph,
      fee_payment_modes: Array.isArray(parsed.fee_payment_modes) ? (parsed.fee_payment_modes as string[]) : prev.fee_payment_modes,
      age_min: Number(parsed.age_min) || prev.age_min,
      age_max: (parsed.age_max as string) || prev.age_max,
      age_as_on_date: (parsed.age_as_on_date as string) || prev.age_as_on_date,
      age_relaxation: (parsed.age_relaxation as string) || prev.age_relaxation,
      vacancy_details: Array.isArray(parsed.vacancy_details) ? (parsed.vacancy_details as VacancyRow[]) : prev.vacancy_details,
      eligibility: Array.isArray(parsed.eligibility) ? (parsed.eligibility as EligibilityRow[]) : prev.eligibility,
      selection_process: Array.isArray(parsed.selection_process) ? (parsed.selection_process as string[]) : prev.selection_process,
      how_to_apply: (parsed.how_to_apply as string) || prev.how_to_apply,
      how_to_apply_hi: (parsed.how_to_apply_hi as string) || prev.how_to_apply_hi,
      important_links: Array.isArray(parsed.important_links) ? (parsed.important_links as LinkRow[]) : prev.important_links,
      faqs: Array.isArray(parsed.faqs) ? (parsed.faqs as FaqRow[]) : prev.faqs,
      also_check: Array.isArray(parsed.also_check) ? (parsed.also_check as AlsoCheckRow[]) : prev.also_check,
    }));
  };

  // ── Field updater (Preserved) ──────────────────────────────────────────────
  const setField = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  // ── Array row updaters (Preserved) ─────────────────────────────────────────
  const updateRow = <T,>(key: string, idx: number, field: keyof T, val: unknown) => {
    setForm((f) => {
      const arr = [...(f[key as keyof typeof f] as T[])];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...f, [key]: arr };
    });
  };

  const addRow = <T,>(key: string, template: T) => {
    setForm((f) => ({ ...f, [key]: [...(f[key as keyof typeof f] as T[]), { ...template }] }));
  };

  const removeRow = (key: string, idx: number) => {
    setForm((f) => {
      const arr = [...(f[key as keyof typeof f] as unknown[])];
      arr.splice(idx, 1);
      return { ...f, [key]: arr };
    });
  };

  // ── Tags (Preserved) ───────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setField("tags", [...form.tags, t]);
    setTagInput("");
  };
  const removeTag = (tag: string) => setField("tags", form.tags.filter((t) => t !== tag));

  // ── Selection Process (Preserved) ──────────────────────────────────────────
  const toggleSelection = (mode: string) => {
    if (form.selection_process.includes(mode)) {
      setField("selection_process", form.selection_process.filter((m) => m !== mode));
    } else {
      setField("selection_process", [...form.selection_process, mode]);
    }
  };

  // ── Payment Modes (Preserved) ──────────────────────────────────────────────
  const togglePayMode = (mode: string) => {
    if (form.fee_payment_modes.includes(mode)) {
      setField("fee_payment_modes", form.fee_payment_modes.filter((m) => m !== mode));
    } else {
      setField("fee_payment_modes", [...form.fee_payment_modes, mode]);
    }
  };

  // ── Submit (Preserved) ─────────────────────────────────────────────────────
  const handleSubmit = async (publish: boolean) => {
    if (!form.title.trim()) { addToast("Title is required.", "error"); return; }
    if (!form.organization.trim()) { addToast("Organization is required.", "error"); return; }

    setSubmitting(true);
    try {
      if (editId) {
        await adminUpdatePostAction(editId, { ...form, is_published: publish });
        addToast("Post updated successfully! 📝", "success");
      } else {
        await adminCreatePostAction({ ...form, is_published: publish });
        addToast(publish ? "Post published successfully! 🎉" : "Post saved as draft.", "success");
      }
      setTimeout(() => router.push("/admin/posts"), 1500);
    } catch (err: unknown) {
      addToast((err as Error).message || "Failed to create post.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Theme color map for section accents ───────────────────────────────────
  const themeColors: Record<string, { grad: string; light: string; border: string; text: string }> = {
    blue: { grad: "linear-gradient(135deg,#1d4ed8,#2563eb)", light: T.accentLight, border: T.accentBorder, text: T.accent },
    green: { grad: "linear-gradient(135deg,#15803d,#16a34a)", light: isDark ? "rgba(21,128,61,0.15)" : "#f0fdf4", border: isDark ? "rgba(21,128,61,0.3)" : "#86efac", text: "#16a34a" },
    red: { grad: "linear-gradient(135deg,#b91c1c,#dc2626)", light: isDark ? "rgba(220,38,38,0.1)" : "#fef2f2", border: isDark ? "rgba(220,38,38,0.25)" : "#fecaca", text: "#dc2626" },
    orange: { grad: "linear-gradient(135deg,#c2410c,#f97316)", light: isDark ? "rgba(194,65,12,0.1)" : "#fff7ed", border: isDark ? "rgba(194,65,12,0.25)" : "#fed7aa", text: "#f97316" },
    purple: { grad: "linear-gradient(135deg,#7c3aed,#8b5cf6)", light: isDark ? "rgba(124,58,237,0.1)" : "#f5f3ff", border: isDark ? "rgba(124,58,237,0.25)" : "#c4b5fd", text: "#8b5cf6" },
    teal: { grad: "linear-gradient(135deg,#0f766e,#14b8a6)", light: isDark ? "rgba(15,118,110,0.1)" : "#f0fdfa", border: isDark ? "rgba(15,118,110,0.25)" : "#5eead4", text: "#14b8a6" },
    indigo: { grad: "linear-gradient(135deg,#4338ca,#6366f1)", light: isDark ? "rgba(67,56,202,0.1)" : "#eef2ff", border: isDark ? "rgba(67,56,202,0.25)" : "#a5b4fc", text: "#6366f1" },
    rose: { grad: "linear-gradient(135deg,#be123c,#f43f5e)", light: isDark ? "rgba(190,18,60,0.1)" : "#fff1f2", border: isDark ? "rgba(190,18,60,0.25)" : "#fda4af", text: "#f43f5e" },
  };

  const getTheme = (t: string) => themeColors[t] || themeColors.blue;

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s" }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
      `}</style>

      {/* Paste flash overlay */}
      {pasteFlash && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: isDark ? "rgba(245,158,11,0.15)" : "rgba(37,99,235,0.08)", border: `4px solid ${T.accent}`, pointerEvents: "none", animation: "fadeUp 0.3s ease" }} />
      )}

      {/* ── TOASTS ── */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#fff",
            background: t.type === "success" ? "linear-gradient(135deg,#15803d,#16a34a)" : t.type === "error" ? "linear-gradient(135deg,#b91c1c,#dc2626)" : T.btnPrimary,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)", animation: "fadeUp 0.3s ease", display: "flex", alignItems: "center", gap: 8
          }}>
            {t.type === "success" ? <Ico.Check /> : t.type === "error" ? <Ico.X /> : <Ico.Doc />}
            {t.message}
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════ */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                Shrilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>ADMIN PANEL</div>
            </div>
          </a>

          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(l => {
              const isActive = l.label === "Posts";
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
              <div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>EDITOR</div>
            </div>
          </div>
        </div>

        {/* Sub header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => router.back()} className="btn btn-g" style={{ fontSize: 12, padding: "6px 12px" }}>
              <Ico.Back /> Back
            </button>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{editId ? `Editing: ${form.title || "Untitled"}` : (form.title || "New Post")}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{form.category} · {form.theme}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {onboardingDismissed && (
              <button onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }} className="btn btn-g" style={{ fontSize: 12 }}>
                📖 Instructions
              </button>
            )}
            <button onClick={copyPrompt} className="btn btn-p" style={{ fontSize: 12, background: "linear-gradient(135deg,#7c3aed,#8b5cf6)" }}>
              <Ico.Robot /> Copy LLM Prompt
            </button>
            <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn btn-g" style={{ fontSize: 12 }}>
              Save Draft
            </button>
            <button onClick={() => handleSubmit(true)} disabled={submitting} className="btn btn-p" style={{ fontSize: 12 }}>
              {submitting ? <span style={{ width: 13, height: 13, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} /> : <Ico.Check />}
              {editId ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        {/* Paste hint bar */}
        <div style={{ background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, borderTop: `1px solid ${T.accentBorder}`, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: T.accent, fontSize: 12, fontWeight: 700 }}>⌨️</span>
          <p style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>
            <strong>Ctrl+V</strong> anywhere outside a text box to auto-populate all fields from AI JSON output
          </p>
          {pasteFlash && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: T.accent, animation: "pulse 1s infinite" }}>✅ Populated!</span>}
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          ONBOARDING MODAL
      ════════════════════════════════════════════════════════ */}
      {showOnboarding && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: T.modalOverlay, backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 16, width: "100%", maxWidth: 440, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", animation: "fadeUp 0.3s ease" }}>
            <div style={{ height: 3, background: T.divider }}>
              <div style={{ height: "100%", background: T.btnPrimary, width: `${((onboardingStep + 1) / ONBOARDING.length) * 100}%`, transition: "width 0.5s" }} />
            </div>
            <div style={{ padding: "32px 28px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{ONBOARDING[onboardingStep].icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>{ONBOARDING[onboardingStep].title}</h3>
                <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>{ONBOARDING[onboardingStep].desc}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
                {ONBOARDING.map((_, i) => (
                  <button key={i} onClick={() => setOnboardingStep(i)} style={{
                    width: i === onboardingStep ? 24 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer",
                    background: i === onboardingStep ? T.accent : T.divider, transition: "all 0.3s"
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={dismissOnboarding} className="btn btn-g" style={{ flex: 1, justifyContent: "center" }}>Skip</button>
                {onboardingStep < ONBOARDING.length - 1 ? (
                  <button onClick={() => setOnboardingStep(s => s + 1)} className="btn btn-p" style={{ flex: 1, justifyContent: "center" }}>Next →</button>
                ) : (
                  <button onClick={dismissOnboarding} className="btn btn-s" style={{ flex: 1, justifyContent: "center" }}>Let's Go! 🚀</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MAIN FORM
      ════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 60px" }}>

          {/* Loading State */}
          {loadingEdit && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, gap: 12 }}>
              <div style={{ width: 24, height: 24, border: `3px solid ${T.divider}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <span style={{ color: T.textMuted, fontSize: 14, fontWeight: 600 }}>Loading post data...</span>
            </div>
          )}

          {!loadingEdit && (
            <>

              {/* ── SECTION 1: Basic Info ── */}
              <div className="card">
                <SecHdr icon="📰" label="Basic Information" />
                <div style={{ padding: "20px" }}>
                  <div className="form-row" style={{ marginBottom: 16 }}>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Title (English) *</label>
                      <input className="inp" value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="SSC Stenographer Recruitment 2026" />
                    </div>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Title (Hindi)</label>
                      <input className="inp" value={form.title_hi} onChange={(e) => setField("title_hi", e.target.value)} placeholder="एसएससी स्टेनोग्राफर भर्ती 2026" />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginBottom: 16 }}>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Organization (English) *</label>
                      <input className="inp" value={form.organization} onChange={(e) => setField("organization", e.target.value)} placeholder="Staff Selection Commission (SSC)" />
                    </div>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Organization (Hindi)</label>
                      <input className="inp" value={form.organization_hi} onChange={(e) => setField("organization_hi", e.target.value)} placeholder="कर्मचारी चयन आयोग" />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginBottom: 16 }}>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Short Description</label>
                      <textarea className="inp" rows={3} value={form.short_desc} onChange={(e) => setField("short_desc", e.target.value)} placeholder="SSC has released a notification for Stenographer Grade C & D posts..." />
                      <p style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Shown as subtitle on listing cards</p>
                    </div>
                    <div className="form-col-6" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Category</label>
                        <select className="inp" value={form.category} onChange={(e) => setField("category", e.target.value)}>
                          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Theme Color</label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {THEMES.map((t) => {
                            const tc = getTheme(t);
                            return (
                              <button key={t} type="button" onClick={() => setField("theme", t)} title={t}
                                style={{
                                  width: 28, height: 28, borderRadius: "50%", border: form.theme === t ? `2px solid ${T.textPrimary}` : "2px solid transparent",
                                  background: tc.grad, cursor: "pointer", transition: "all 0.15s", transform: form.theme === t ? "scale(1.15)" : "scale(1)"
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-row" style={{ marginBottom: 16 }}>
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Post Date</label>
                      <input type="date" className="inp" value={form.post_date} onChange={(e) => setField("post_date", e.target.value)} />
                    </div>
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total Posts</label>
                      <input type="number" className="inp" value={form.total_posts} onChange={(e) => setField("total_posts", Number(e.target.value))} min={0} />
                    </div>
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Service Cost (₹)</label>
                      <input type="number" className="inp" value={form.service_cost} onChange={(e) => setField("service_cost", Number(e.target.value))} min={0} />
                    </div>
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>URL Slug</label>
                      <input className="inp" value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="ssc-stenographer-2026" />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginBottom: 16 }}>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Banner Image URL</label>
                      <input className="inp" value={form.banner_url} onChange={(e) => setField("banner_url", e.target.value)} placeholder="https://example.com/image.jpg" />
                    </div>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Tags</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                        {form.tags.map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                            <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", color: T.tagText, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                          </span>
                        ))}
                      </div>
                      <input className="inp" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                        placeholder="Type a tag and press Enter…" style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} checked={form.is_published} onChange={(e) => setField("is_published", e.target.checked)} />
                      <div style={{
                        width: 44, height: 24, borderRadius: 12, background: form.is_published ? T.accent : T.divider,
                        position: "relative", transition: "all 0.2s", cursor: "pointer"
                      }}>
                        <div style={{
                          position: "absolute", top: 2, left: form.is_published ? 22 : 2,
                          width: 20, height: 20, borderRadius: "50%", background: "#fff",
                          transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                        }} />
                      </div>
                    </label>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>Publish immediately</span>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Important Dates ── */}
              <div className="card">
                <SecHdr icon="📅" label="Important Dates" />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {form.important_dates.map((row, i) => {
                      const tc = getTheme("orange");
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: 10, alignItems: "start", background: tc.light, border: `1px solid ${tc.border}`, borderRadius: 10, padding: 12 }}>
                          <input className="inp" placeholder="Label (EN)" value={row.label} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "label", e.target.value)} style={{ fontSize: 12 }} />
                          <input className="inp" placeholder="Label (HI)" value={row.label_hi} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "label_hi", e.target.value)} style={{ fontSize: 12 }} />
                          <input type="date" className="inp" value={row.date} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "date", e.target.value)} style={{ fontSize: 12 }} />
                          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", paddingTop: 8 }}>
                            <input type="checkbox" checked={row.is_bold} onChange={(e) => updateRow<ImportantDate>("important_dates", i, "is_bold", e.target.checked)} style={{ accentColor: tc.text }} />
                            <span style={{ fontSize: 11, color: T.textSecondary, fontWeight: 600 }}>Bold</span>
                          </label>
                          <button onClick={() => removeRow("important_dates", i)} className="btn btn-d" style={{ padding: "6px 10px", fontSize: 12 }}><Ico.X /></button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addRow("important_dates", { label: "", label_hi: "", date: "", is_bold: false })}
                    className="btn btn-g" style={{ width: "100%", marginTop: 12, justifyContent: "center", borderStyle: "dashed", borderWidth: 2 }}>
                    <Ico.Plus /> Add Date
                  </button>
                </div>
              </div>

              {/* ── SECTION 3: Application Fee ── */}
              <div className="card">
                <SecHdr icon="💰" label="Application Fee" />
                <div style={{ padding: "20px" }}>
                  <div className="form-row" style={{ marginBottom: 16 }}>
                    <div className="form-col-4">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>General / OBC / EWS (₹)</label>
                      <input type="number" className="inp" value={form.fee_general} onChange={(e) => setField("fee_general", Number(e.target.value))} min={0} />
                    </div>
                    <div className="form-col-4">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>SC / ST / Female (₹)</label>
                      <input type="number" className="inp" value={form.fee_sc_st} onChange={(e) => setField("fee_sc_st", Number(e.target.value))} min={0} />
                    </div>
                    <div className="form-col-4">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>PH / Divyangjan (₹)</label>
                      <input type="number" className="inp" value={form.fee_ph} onChange={(e) => setField("fee_ph", Number(e.target.value))} min={0} />
                    </div>
                  </div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Payment Modes</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PAYMENT_MODES.map((m) => (
                      <button key={m} type="button" onClick={() => togglePayMode(m)}
                        className={`pill ${form.fee_payment_modes.includes(m) ? "on" : ""}`}
                        style={form.fee_payment_modes.includes(m) ? { background: isDark ? "rgba(21,128,61,0.15)" : "#dcfce7", borderColor: isDark ? "rgba(21,128,61,0.3)" : "#86efac", color: "#15803d" } : {}}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: Age Limit ── */}
              <div className="card">
                <SecHdr icon="🎂" label="Age Limit" />
                <div style={{ padding: "20px" }}>
                  <div className="form-row">
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Minimum Age</label>
                      <input type="number" className="inp" value={form.age_min} onChange={(e) => setField("age_min", Number(e.target.value))} min={0} />
                    </div>
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Maximum Age</label>
                      <input className="inp" value={form.age_max} onChange={(e) => setField("age_max", e.target.value)} placeholder='e.g. "27 Years"' />
                    </div>
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Age as on Date</label>
                      <input type="date" className="inp" value={form.age_as_on_date} onChange={(e) => setField("age_as_on_date", e.target.value)} />
                    </div>
                    <div className="form-col-3">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Age Relaxation</label>
                      <input className="inp" value={form.age_relaxation} onChange={(e) => setField("age_relaxation", e.target.value)} placeholder="As per govt. rules" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 5: Vacancy Details ── */}
              <div className="card">
                <SecHdr icon="📊" label="Vacancy Details" />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {form.vacancy_details.map((row, i) => {
                      const tc = getTheme("blue");
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 10, alignItems: "start", background: tc.light, border: `1px solid ${tc.border}`, borderRadius: 10, padding: 12 }}>
                          <input className="inp" placeholder="Post Name" value={row.post_name} onChange={(e) => updateRow<VacancyRow>("vacancy_details", i, "post_name", e.target.value)} style={{ fontSize: 12 }} />
                          <input type="number" className="inp" placeholder="Posts" value={row.no_of_posts} onChange={(e) => updateRow<VacancyRow>("vacancy_details", i, "no_of_posts", Number(e.target.value))} min={0} style={{ fontSize: 12 }} />
                          <input className="inp" placeholder="Category" value={row.category} onChange={(e) => updateRow<VacancyRow>("vacancy_details", i, "category", e.target.value)} style={{ fontSize: 12 }} />
                          <button onClick={() => removeRow("vacancy_details", i)} className="btn btn-d" style={{ padding: "6px 10px", fontSize: 12 }}><Ico.X /></button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addRow("vacancy_details", { post_name: "", no_of_posts: 0, category: "" })}
                    className="btn btn-g" style={{ width: "100%", marginTop: 12, justifyContent: "center", borderStyle: "dashed", borderWidth: 2 }}>
                    <Ico.Plus /> Add Post
                  </button>
                </div>
              </div>

              {/* ── SECTION 6: Eligibility ── */}
              <div className="card">
                <SecHdr icon="🎓" label="Eligibility / Education Qualification" />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {form.eligibility.map((row, i) => {
                      const tc = getTheme("teal");
                      return (
                        <div key={i} style={{ background: tc.light, border: `1px solid ${tc.border}`, borderRadius: 10, padding: 16, position: "relative" }}>
                          <button onClick={() => removeRow("eligibility", i)} className="btn btn-d" style={{ position: "absolute", top: 12, right: 12, padding: "4px 8px", fontSize: 11 }}><Ico.X /></button>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Post Name</label>
                            <input className="inp" value={row.post_name} onChange={(e) => updateRow<EligibilityRow>("eligibility", i, "post_name", e.target.value)} placeholder="e.g. Stenographer Grade C" style={{ fontSize: 12 }} />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Criteria (English)</label>
                            <textarea className="inp" rows={2} value={row.criteria} onChange={(e) => updateRow<EligibilityRow>("eligibility", i, "criteria", e.target.value)} placeholder="Candidates must have passed 10+2..." style={{ fontSize: 12 }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Criteria (Hindi)</label>
                            <textarea className="inp" rows={2} value={row.criteria_hi} onChange={(e) => updateRow<EligibilityRow>("eligibility", i, "criteria_hi", e.target.value)} placeholder="उम्मीदवारों को 12वीं पास होना चाहिए..." style={{ fontSize: 12 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addRow("eligibility", { post_name: "", criteria: "", criteria_hi: "" })}
                    className="btn btn-g" style={{ width: "100%", marginTop: 12, justifyContent: "center", borderStyle: "dashed", borderWidth: 2 }}>
                    <Ico.Plus /> Add Eligibility Row
                  </button>
                </div>
              </div>

              {/* ── SECTION 7: Selection Process ── */}
              <div className="card">
                <SecHdr icon="🏆" label="Mode of Selection" />
                <div style={{ padding: "20px" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Select all applicable stages</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {SELECTION_MODES.map((m) => (
                      <button key={m} type="button" onClick={() => toggleSelection(m)}
                        className={`pill ${form.selection_process.includes(m) ? "on" : ""}`}
                        style={form.selection_process.includes(m) ? { background: isDark ? "rgba(245,158,11,0.15)" : "#fff7ed", borderColor: isDark ? "rgba(245,158,11,0.4)" : "#fed7aa", color: "#f59e0b" } : {}}>
                        {m}
                      </button>
                    ))}
                  </div>
                  {form.selection_process.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 12, color: T.textSecondary }}>
                      <span style={{ fontWeight: 600 }}>Order:</span>
                      {form.selection_process.map((s, i) => (
                        <React.Fragment key={s}>
                          <span style={{ color: T.accent, fontWeight: 700 }}>{s}</span>
                          {i < form.selection_process.length - 1 && <span style={{ color: T.textMuted }}>→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── SECTION 8: How to Apply ── */}
              <div className="card">
                <SecHdr icon="📝" label="How to Apply" />
                <div style={{ padding: "20px" }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Instructions (English)</label>
                    <textarea className="inp" rows={4} value={form.how_to_apply} onChange={(e) => setField("how_to_apply", e.target.value)} placeholder="Step 1: Visit the official website...&#10;Step 2: Click on 'Apply Online'..." />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Instructions (Hindi)</label>
                    <textarea className="inp" rows={3} value={form.how_to_apply_hi} onChange={(e) => setField("how_to_apply_hi", e.target.value)} placeholder="चरण 1: आधिकारिक वेबसाइट पर जाएं..." />
                  </div>
                </div>
              </div>

              {/* ── SECTION 9: Important Links ── */}
              <div className="card">
                <SecHdr icon="🔗" label="Important Links" />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {form.important_links.map((row, i) => {
                      const tc = getTheme("purple");
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto auto", gap: 10, alignItems: "start", background: tc.light, border: `1px solid ${tc.border}`, borderRadius: 10, padding: 12 }}>
                          <input className="inp" placeholder="Label (EN)" value={row.label} onChange={(e) => updateRow<LinkRow>("important_links", i, "label", e.target.value)} style={{ fontSize: 12 }} />
                          <input className="inp" placeholder="Label (HI)" value={row.label_hi} onChange={(e) => updateRow<LinkRow>("important_links", i, "label_hi", e.target.value)} style={{ fontSize: 12 }} />
                          <input className="inp" placeholder="https://…" value={row.url} onChange={(e) => updateRow<LinkRow>("important_links", i, "url", e.target.value)} style={{ fontSize: 12 }} />
                          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", paddingTop: 8 }}>
                            <input type="checkbox" checked={row.is_active} onChange={(e) => updateRow<LinkRow>("important_links", i, "is_active", e.target.checked)} style={{ accentColor: tc.text }} />
                            <span style={{ fontSize: 11, color: T.textSecondary, fontWeight: 600 }}>Live</span>
                          </label>
                          <button onClick={() => removeRow("important_links", i)} className="btn btn-d" style={{ padding: "6px 10px", fontSize: 12 }}><Ico.X /></button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addRow("important_links", { label: "", label_hi: "", url: "", is_active: true })}
                    className="btn btn-g" style={{ width: "100%", marginTop: 12, justifyContent: "center", borderStyle: "dashed", borderWidth: 2 }}>
                    <Ico.Plus /> Add Link
                  </button>
                </div>
              </div>

              {/* ── SECTION 10: FAQs ── */}
              <div className="card">
                <SecHdr icon="❓" label="FAQ Section" />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {form.faqs.map((row, i) => {
                      const tc = getTheme("teal");
                      return (
                        <div key={i} style={{ background: tc.light, border: `1px solid ${tc.border}`, borderRadius: 10, padding: 16, position: "relative" }}>
                          <button onClick={() => removeRow("faqs", i)} className="btn btn-d" style={{ position: "absolute", top: 12, right: 12, padding: "4px 8px", fontSize: 11 }}><Ico.X /></button>
                          <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Q{i + 1} – Question</label>
                            <input className="inp" value={row.question} onChange={(e) => updateRow<FaqRow>("faqs", i, "question", e.target.value)} placeholder="When will the online application start?" style={{ fontSize: 12 }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Answer</label>
                            <textarea className="inp" rows={2} value={row.answer} onChange={(e) => updateRow<FaqRow>("faqs", i, "answer", e.target.value)} placeholder="The online application starts on 24 April 2026." style={{ fontSize: 12 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addRow("faqs", { question: "", answer: "" })}
                    className="btn btn-g" style={{ width: "100%", marginTop: 12, justifyContent: "center", borderStyle: "dashed", borderWidth: 2 }}>
                    <Ico.Plus /> Add FAQ
                  </button>
                </div>
              </div>

              {/* ── SECTION 11: Also Check ── */}
              <div className="card">
                <SecHdr icon="👀" label="You May Also Check" />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {form.also_check.map((row, i) => {
                      const tc = getTheme("red");
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 10, alignItems: "start", background: tc.light, border: `1px solid ${tc.border}`, borderRadius: 10, padding: 12 }}>
                          <input className="inp" placeholder="Post Name / Label" value={row.label} onChange={(e) => updateRow<AlsoCheckRow>("also_check", i, "label", e.target.value)} style={{ fontSize: 12 }} />
                          <input className="inp" placeholder="https://…" value={row.url} onChange={(e) => updateRow<AlsoCheckRow>("also_check", i, "url", e.target.value)} style={{ fontSize: 12 }} />
                          <button onClick={() => removeRow("also_check", i)} className="btn btn-d" style={{ padding: "6px 10px", fontSize: 12 }}><Ico.X /></button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addRow("also_check", { label: "", url: "" })}
                    className="btn btn-g" style={{ width: "100%", marginTop: 12, justifyContent: "center", borderStyle: "dashed", borderWidth: 2 }}>
                    <Ico.Plus /> Add Related Post
                  </button>
                </div>
              </div>

              {/* ── SECTION 12: Social Links ── */}
              <div className="card">
                <SecHdr icon="📣" label="Social & Community Links" />
                <div style={{ padding: "20px" }}>
                  <div className="form-row">
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>WhatsApp Channel URL</label>
                      <input className="inp" value={form.whatsapp_link} onChange={(e) => setField("whatsapp_link", e.target.value)} placeholder="https://whatsapp.com/channel/…" />
                    </div>
                    <div className="form-col-6">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Telegram Channel URL</label>
                      <input className="inp" value={form.telegram_link} onChange={(e) => setField("telegram_link", e.target.value)} placeholder="https://t.me/…" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── JSON Preview ── */}
              <details style={{ background: isDark ? "rgba(0,0,0,0.3)" : "#0f172a", borderRadius: 12, overflow: "hidden", marginBottom: 24, border: `1px solid ${T.cardBorder}` }}>
                <summary style={{ padding: "12px 18px", cursor: "pointer", color: T.textMuted, fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", userSelect: "none", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>🧩</span> JSON Preview (debug)
                </summary>
                <pre style={{ padding: "0 18px 18px", fontSize: 11, color: "#4ade80", overflow: "auto", maxHeight: 384, lineHeight: 1.6, fontFamily: "'JetBrains Mono',monospace" }}>
                  {JSON.stringify(form, null, 2)}
                </pre>
              </details>

              {/* ── Bottom Submit Bar ── */}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingBottom: 40 }}>
                <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn btn-g" style={{ padding: "10px 24px" }}>
                  Save as Draft
                </button>
                <button onClick={() => handleSubmit(true)} disabled={submitting} className="btn btn-p" style={{ padding: "10px 28px", fontSize: 14 }}>
                  {submitting ? (
                    <><span style={{ width: 14, height: 14, border: `2px solid ${T.textMuted}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} />Publishing…</>
                  ) : (<>🚀 {editId ? "Update Post" : "Publish Post"}</>)}
                </button>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}




// 2. Default export ko ek wrapper bana do jo Suspense use kare
export default function CreatePostPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
      <CreatePostContent />
    </Suspense>
  );
}