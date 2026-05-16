// "use client";

// // ─── MOCK DATA (replace with your Supabase fetch) ─────────────────────────────
// // In production, fetch from: supabase.from("posts").select("*").eq("id", params.id).single()
// // and pass as props via generateStaticParams / server component.

// import { useState } from "react";

// // ─── TYPES ────────────────────────────────────────────────────────────────────
// interface ImportantDate { label: string; label_hi: string; date: string; is_bold: boolean; }
// interface VacancyRow { post_name: string; no_of_posts: number; category?: string; }
// interface EligibilityRow { post_name: string; criteria: string; criteria_hi: string; }
// interface LinkRow { label: string; label_hi: string; url: string; is_active: boolean; }
// interface FaqRow { question: string; answer: string; }
// interface AlsoCheckRow { label: string; url: string; }

// interface Post {
//   id: string;
//   title: string;
//   title_hi: string;
//   short_desc: string;
//   theme: string;
//   service_cost: number;
//   category: string;
//   tags: string[];
//   slug: string;
//   banner_url?: string;
//   is_published: boolean;
//   organization: string;
//   organization_hi: string;
//   total_posts: number;
//   post_date: string;
//   important_dates: ImportantDate[];
//   fee_general: number;
//   fee_sc_st: number;
//   fee_ph: number;
//   fee_payment_modes: string[];
//   age_min: number;
//   age_max: string;
//   age_as_on_date: string;
//   age_relaxation: string;
//   vacancy_details: VacancyRow[];
//   eligibility: EligibilityRow[];
//   selection_process: string[];
//   how_to_apply: string;
//   how_to_apply_hi: string;
//   important_links: LinkRow[];
//   faqs: FaqRow[];
//   also_check: AlsoCheckRow[];
//   whatsapp_link: string;
//   telegram_link: string;
//   created_at: string;
//   updated_at: string;
// }

// // ─── DEMO POST ─────────────────────────────────────────────────────────────────
// const DEMO_POST: Post = {
//   id: "demo-1",
//   title: "SSC Stenographer Grade C & D Recruitment 2026",
//   title_hi: "एसएससी स्टेनोग्राफर ग्रेड C & D भर्ती 2026",
//   short_desc: "Staff Selection Commission (SSC) has released the official notification for Stenographer Grade C & D Recruitment 2026. Eligible candidates with 10+2 qualification can apply online through the official website before the last date.",
//   theme: "blue",
//   service_cost: 149,
//   category: "SSC",
//   tags: ["SSC", "Stenographer", "Grade C", "Grade D", "10+2"],
//   slug: "ssc-stenographer-2026",
//   banner_url: "",
//   is_published: true,
//   organization: "Staff Selection Commission (SSC)",
//   organization_hi: "कर्मचारी चयन आयोग (SSC)",
//   total_posts: 2006,
//   post_date: "2026-04-01",
//   important_dates: [
//     { label: "Notification Release", label_hi: "अधिसूचना जारी", date: "2026-04-01", is_bold: true },
//     { label: "Online Apply Start", label_hi: "ऑनलाइन आवेदन शुरू", date: "2026-04-10", is_bold: true },
//     { label: "Last Date to Apply", label_hi: "आवेदन अंतिम तिथि", date: "2026-05-10", is_bold: true },
//     { label: "Fee Payment Last Date", label_hi: "शुल्क भुगतान अंतिम तिथि", date: "2026-05-11", is_bold: false },
//     { label: "Correction Window", label_hi: "संशोधन विंडो", date: "2026-05-14", is_bold: false },
//     { label: "Exam Date (CBT)", label_hi: "परीक्षा तिथि (CBT)", date: "", is_bold: false },
//     { label: "Admit Card Release", label_hi: "प्रवेश पत्र", date: "", is_bold: false },
//     { label: "Result Declaration", label_hi: "परिणाम तिथि", date: "", is_bold: false },
//   ],
//   fee_general: 100,
//   fee_sc_st: 0,
//   fee_ph: 0,
//   fee_payment_modes: ["Debit Card", "Credit Card", "Internet Banking", "UPI", "Net Banking"],
//   age_min: 18,
//   age_max: "30 Years (Grade C) / 27 Years (Grade D)",
//   age_as_on_date: "2026-08-01",
//   age_relaxation: "OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years | Ex-Servicemen: as per rules.",
//   vacancy_details: [
//     { post_name: "Stenographer Grade C", no_of_posts: 506, category: "All Categories" },
//     { post_name: "Stenographer Grade D", no_of_posts: 1500, category: "All Categories" },
//   ],
//   eligibility: [
//     { post_name: "Both Grade C & D", criteria: "Candidates must have passed 12th Standard (10+2 equivalent) from a recognized Board or University. Candidates must possess a speed of 100 w.p.m. in Stenography (English or Hindi) for Grade C, and 80 w.p.m. for Grade D.", criteria_hi: "उम्मीदवारों को किसी मान्यता प्राप्त बोर्ड या विश्वविद्यालय से 12वीं (10+2) पास होना चाहिए। ग्रेड C के लिए आशुलिपि में 100 शब्द प्रति मिनट और ग्रेड D के लिए 80 शब्द प्रति मिनट की गति होनी चाहिए।" },
//   ],
//   selection_process: ["CBT", "Skill Test", "Document Verification"],
//   how_to_apply: "Step 1: Visit the official SSC website at ssc.gov.in\nStep 2: Click on 'Apply' and then select 'Stenographer Grade C & D'\nStep 3: Register if you're a new user, or login if already registered\nStep 4: Fill the online application form carefully\nStep 5: Upload required documents (photo, signature)\nStep 6: Pay the application fee online\nStep 7: Submit the form and take a printout for reference",
//   how_to_apply_hi: "चरण 1: आधिकारिक SSC वेबसाइट ssc.gov.in पर जाएं\nचरण 2: 'Apply' पर क्लिक करें और 'Stenographer Grade C & D' चुनें\nचरण 3: नए उपयोगकर्ता हैं तो पंजीकरण करें, या लॉगिन करें\nचरण 4: ऑनलाइन आवेदन फॉर्म ध्यान से भरें\nचरण 5: आवश्यक दस्तावेज अपलोड करें (फोटो, हस्ताक्षर)\nचरण 6: ऑनलाइन आवेदन शुल्क का भुगतान करें\nचरण 7: फॉर्म सबमिट करें और संदर्भ के लिए प्रिंटआउट लें",
//   important_links: [
//     { label: "Apply Online", label_hi: "ऑनलाइन आवेदन करें", url: "https://ssc.gov.in", is_active: true },
//     { label: "Download Official Notification", label_hi: "आधिकारिक अधिसूचना डाउनलोड करें", url: "https://ssc.gov.in/notice", is_active: true },
//     { label: "Download Syllabus PDF", label_hi: "सिलेबस PDF डाउनलोड करें", url: "https://ssc.gov.in/syllabus", is_active: true },
//     { label: "Official Website", label_hi: "आधिकारिक वेबसाइट", url: "https://ssc.gov.in", is_active: true },
//   ],
//   faqs: [
//     { question: "When does the online application start for SSC Stenographer 2026?", answer: "The online application for SSC Stenographer Grade C & D 2026 starts on 10th April 2026." },
//     { question: "What is the last date to apply for SSC Stenographer 2026?", answer: "The last date to submit the online application is 10th May 2026." },
//     { question: "What is the application fee for SSC Stenographer 2026?", answer: "The application fee is ₹100 for General/OBC/EWS candidates. SC/ST/Female/PwD candidates are exempted from fee payment." },
//     { question: "What is the age limit for SSC Stenographer 2026?", answer: "For Grade C: 18–30 years. For Grade D: 18–27 years. Age is calculated as on 01 August 2026. Relaxation applicable for reserved categories." },
//     { question: "What is the educational qualification required?", answer: "Candidates must have passed 12th Standard (10+2) from a recognized Board or University along with the required stenography speed." },
//   ],
//   also_check: [
//     { label: "SSC CGL Recruitment 2026", url: "#" },
//     { label: "SSC CHSL Recruitment 2026", url: "#" },
//     { label: "SSC MTS Recruitment 2026", url: "#" },
//     { label: "SSC GD Constable 2026", url: "#" },
//   ],
//   whatsapp_link: "https://whatsapp.com/channel/example",
//   telegram_link: "https://t.me/example",
//   created_at: "2026-04-01T10:00:00Z",
//   updated_at: "2026-04-01T10:00:00Z",
// };

// // ─── THEME CONFIG ─────────────────────────────────────────────────────────────
// const THEME_MAP: Record<string, { primary: string; dark: string; light: string; badge: string; ring: string; btn: string; accent: string }> = {
//   blue:   { primary: "#1d4ed8", dark: "#1e3a8a", light: "#eff6ff", badge: "#dbeafe", ring: "#93c5fd", btn: "bg-blue-600 hover:bg-blue-700", accent: "#3b82f6" },
//   green:  { primary: "#15803d", dark: "#14532d", light: "#f0fdf4", badge: "#dcfce7", ring: "#86efac", btn: "bg-green-600 hover:bg-green-700", accent: "#22c55e" },
//   red:    { primary: "#b91c1c", dark: "#7f1d1d", light: "#fff1f2", badge: "#fee2e2", ring: "#fca5a5", btn: "bg-red-600 hover:bg-red-700", accent: "#ef4444" },
//   orange: { primary: "#c2410c", dark: "#7c2d12", light: "#fff7ed", badge: "#fed7aa", ring: "#fdba74", btn: "bg-orange-600 hover:bg-orange-700", accent: "#f97316" },
//   purple: { primary: "#7c3aed", dark: "#4c1d95", light: "#f5f3ff", badge: "#ede9fe", ring: "#c4b5fd", btn: "bg-violet-600 hover:bg-violet-700", accent: "#8b5cf6" },
//   teal:   { primary: "#0f766e", dark: "#134e4a", light: "#f0fdfa", badge: "#ccfbf1", ring: "#5eead4", btn: "bg-teal-600 hover:bg-teal-700", accent: "#14b8a6" },
//   indigo: { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", badge: "#e0e7ff", ring: "#a5b4fc", btn: "bg-indigo-600 hover:bg-indigo-700", accent: "#6366f1" },
//   rose:   { primary: "#be123c", dark: "#881337", light: "#fff1f2", badge: "#ffe4e6", ring: "#fda4af", btn: "bg-rose-600 hover:bg-rose-700", accent: "#f43f5e" },
// };

// function formatDate(d: string) {
//   if (!d) return "To Be Announced";
//   try {
//     return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
//   } catch { return d; }
// }

// // ─── SECTION HEADER ───────────────────────────────────────────────────────────
// function SectionHeader({ icon, title, color }: { icon: string; title: string; color: string }) {
//   return (
//     <div className="section-header" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
//       <span className="section-icon">{icon}</span>
//       <h2 className="section-title">{title}</h2>
//     </div>
//   );
// }

// // ─── FAQ ITEM ─────────────────────────────────────────────────────────────────
// function FaqItem({ faq, index, color }: { faq: FaqRow; index: number; color: string }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className={`faq-item ${open ? "open" : ""}`}>
//       <button className="faq-q" onClick={() => setOpen(!open)} style={{ borderLeft: `3px solid ${open ? color : "#e5e7eb"}` }}>
//         <span className="faq-num" style={{ background: open ? color : "#6b7280" }}>Q{index + 1}</span>
//         <span className="faq-qtext">{faq.question}</span>
//         <span className="faq-arrow" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
//       </button>
//       {open && (
//         <div className="faq-a">
//           <div className="faq-a-inner">{faq.answer}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// export default function PostDetailPage({ post = DEMO_POST }: { post?: Post }) {
//   const t = THEME_MAP[post.theme] || THEME_MAP.blue;
//   const [lang, setLang] = useState<"en" | "hi">("en");

//   const totalVacancy = post.vacancy_details.reduce((s, v) => s + v.no_of_posts, 0);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         body {
//           font-family: 'DM Sans', 'Noto Sans Devanagari', sans-serif;
//           background: #f1f5f9;
//           color: #1e293b;
//           line-height: 1.6;
//         }

//         /* ── TOP NAV ── */
//         .top-nav {
//           background: ${t.dark};
//           padding: 10px 0;
//           border-bottom: 3px solid ${t.accent};
//         }
//         .nav-inner {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 16px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           flex-wrap: wrap;
//           gap: 8px;
//         }
//         .nav-logo {
//           font-family: 'DM Serif Display', serif;
//           font-size: 1.5rem;
//           color: #fff;
//           text-decoration: none;
//           letter-spacing: -0.5px;
//         }
//         .nav-logo span { color: ${t.accent}; }
//         .nav-links { display: flex; gap: 6px; flex-wrap: wrap; }
//         .nav-link {
//           color: #cbd5e1;
//           text-decoration: none;
//           font-size: 0.75rem;
//           padding: 4px 10px;
//           border-radius: 20px;
//           transition: all 0.2s;
//           font-weight: 500;
//         }
//         .nav-link:hover { background: rgba(255,255,255,0.15); color: #fff; }
//         .nav-link.active { background: ${t.accent}; color: #fff; }

//         /* ── BREADCRUMB ── */
//         .breadcrumb {
//           background: #fff;
//           border-bottom: 1px solid #e2e8f0;
//           padding: 8px 0;
//           font-size: 0.75rem;
//           color: #64748b;
//         }
//         .breadcrumb-inner {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 16px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .breadcrumb a { color: ${t.primary}; text-decoration: none; }
//         .breadcrumb a:hover { text-decoration: underline; }

//         /* ── HERO ── */
//         .hero {
//           background: linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 60%, ${t.accent}88 100%);
//           padding: 28px 0 0;
//           position: relative;
//           overflow: hidden;
//         }
//         .hero::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='white' opacity='0.06'/%3E%3C/svg%3E") repeat;
//         }
//         .hero-inner {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 16px;
//           position: relative;
//         }
//         .hero-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           background: rgba(255,255,255,0.15);
//           border: 1px solid rgba(255,255,255,0.3);
//           color: #fff;
//           font-size: 0.7rem;
//           font-weight: 700;
//           padding: 4px 12px;
//           border-radius: 20px;
//           text-transform: uppercase;
//           letter-spacing: 0.8px;
//           margin-bottom: 12px;
//           backdrop-filter: blur(4px);
//         }
//         .hero-title {
//           font-family: 'DM Serif Display', serif;
//           font-size: clamp(1.4rem, 4vw, 2.1rem);
//           color: #fff;
//           line-height: 1.25;
//           margin-bottom: 6px;
//         }
//         .hero-title-hi {
//           font-family: 'Noto Sans Devanagari', sans-serif;
//           font-size: clamp(0.9rem, 2.5vw, 1.1rem);
//           color: rgba(255,255,255,0.75);
//           margin-bottom: 14px;
//         }
//         .hero-meta {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           margin-bottom: 20px;
//         }
//         .hero-chip {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           background: rgba(255,255,255,0.12);
//           border: 1px solid rgba(255,255,255,0.2);
//           color: rgba(255,255,255,0.9);
//           font-size: 0.75rem;
//           padding: 5px 12px;
//           border-radius: 8px;
//           font-weight: 500;
//         }
//         .hero-chip strong { color: #fff; }

//         /* ── STAT STRIP ── */
//         .stat-strip {
//           background: rgba(0,0,0,0.25);
//           backdrop-filter: blur(8px);
//           border-top: 1px solid rgba(255,255,255,0.1);
//           margin-top: 4px;
//         }
//         .stat-strip-inner {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 14px 16px;
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//           gap: 4px;
//         }
//         .stat-item {
//           text-align: center;
//           padding: 8px 4px;
//         }
//         .stat-val {
//           display: block;
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: #fff;
//           line-height: 1;
//           font-family: 'DM Serif Display', serif;
//         }
//         .stat-label {
//           display: block;
//           font-size: 0.65rem;
//           color: rgba(255,255,255,0.6);
//           text-transform: uppercase;
//           letter-spacing: 0.6px;
//           margin-top: 2px;
//           font-weight: 600;
//         }
//         .stat-divider { width: 1px; background: rgba(255,255,255,0.15); }

//         /* ── APPLY CTA BUTTONS ── */
//         .cta-bar {
//           background: #fff;
//           border-bottom: 2px solid ${t.light};
//           padding: 10px 0;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
//         }
//         .cta-inner {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 16px;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           flex-wrap: wrap;
//           justify-content: space-between;
//         }
//         .cta-title {
//           font-weight: 700;
//           font-size: 0.85rem;
//           color: #1e293b;
//           flex: 1;
//           min-width: 180px;
//         }
//         .cta-title span { color: ${t.primary}; }
//         .cta-btns { display: flex; gap: 8px; flex-wrap: wrap; }
//         .btn-apply {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           background: ${t.primary};
//           color: #fff;
//           font-weight: 700;
//           font-size: 0.8rem;
//           padding: 9px 20px;
//           border-radius: 8px;
//           text-decoration: none;
//           border: none;
//           cursor: pointer;
//           transition: all 0.2s;
//           white-space: nowrap;
//         }
//         .btn-apply:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 12px ${t.accent}55; }
//         .btn-notify {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           background: transparent;
//           color: ${t.primary};
//           font-weight: 600;
//           font-size: 0.8rem;
//           padding: 8px 16px;
//           border-radius: 8px;
//           border: 2px solid ${t.primary};
//           cursor: pointer;
//           transition: all 0.2s;
//           white-space: nowrap;
//         }
//         .btn-notify:hover { background: ${t.light}; }
//         .lang-toggle {
//           display: flex;
//           background: #f1f5f9;
//           border-radius: 8px;
//           overflow: hidden;
//           border: 1px solid #e2e8f0;
//         }
//         .lang-btn {
//           padding: 6px 12px;
//           font-size: 0.72rem;
//           font-weight: 700;
//           border: none;
//           cursor: pointer;
//           transition: all 0.2s;
//           background: transparent;
//           color: #64748b;
//         }
//         .lang-btn.active { background: ${t.primary}; color: #fff; }

//         /* ── LAYOUT ── */
//         .page-body {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 20px 16px 40px;
//           display: grid;
//           grid-template-columns: 1fr 320px;
//           gap: 20px;
//           align-items: start;
//         }
//         @media (max-width: 768px) {
//           .page-body { grid-template-columns: 1fr; }
//           .sidebar { order: -1; }
//         }

//         /* ── CARD ── */
//         .card {
//           background: #fff;
//           border-radius: 12px;
//           overflow: hidden;
//           margin-bottom: 16px;
//           border: 1px solid #e2e8f0;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.06);
//         }
//         .section-header {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 12px 18px;
//         }
//         .section-icon { font-size: 1.1rem; }
//         .section-title {
//           font-size: 0.85rem;
//           font-weight: 800;
//           color: #fff;
//           text-transform: uppercase;
//           letter-spacing: 0.6px;
//         }
//         .card-body { padding: 16px 18px; }

//         /* ── SHORT DESC ── */
//         .short-desc {
//           color: #475569;
//           font-size: 0.875rem;
//           line-height: 1.7;
//           border-left: 3px solid ${t.accent};
//           padding-left: 12px;
//           margin: 0;
//         }

//         /* ── TABLE ── */
//         .data-table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 0.82rem;
//         }
//         .data-table th {
//           background: ${t.light};
//           color: ${t.dark};
//           font-weight: 700;
//           padding: 9px 14px;
//           text-align: left;
//           font-size: 0.75rem;
//           text-transform: uppercase;
//           letter-spacing: 0.4px;
//           border-bottom: 2px solid ${t.ring};
//         }
//         .data-table td {
//           padding: 9px 14px;
//           border-bottom: 1px solid #f1f5f9;
//           color: #374151;
//           vertical-align: top;
//         }
//         .data-table tr:last-child td { border-bottom: none; }
//         .data-table tr:hover td { background: #f8fafc; }
//         .date-tba {
//           color: #94a3b8;
//           font-style: italic;
//           font-size: 0.78rem;
//         }
//         .bold-date { font-weight: 700; color: ${t.primary}; }
//         .highlight-row td { background: ${t.light} !important; font-weight: 600; }

//         /* ── FEE CARDS ── */
//         .fee-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 10px;
//           margin-bottom: 14px;
//         }
//         @media (max-width: 500px) { .fee-grid { grid-template-columns: 1fr; } }
//         .fee-card {
//           border: 1.5px solid ${t.ring};
//           border-radius: 10px;
//           padding: 12px;
//           text-align: center;
//           background: ${t.light};
//         }
//         .fee-amount {
//           font-size: 1.5rem;
//           font-weight: 800;
//           color: ${t.primary};
//           font-family: 'DM Serif Display', serif;
//           display: block;
//         }
//         .fee-label { font-size: 0.7rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
//         .fee-free { font-size: 1.2rem; color: #15803d; font-weight: 800; }
//         .payment-modes { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
//         .pay-chip {
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           color: #475569;
//           font-size: 0.7rem;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 20px;
//         }

//         /* ── AGE ── */
//         .age-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
//         @media (max-width: 480px) { .age-grid { grid-template-columns: 1fr; } }
//         .age-box {
//           border: 1.5px solid ${t.ring};
//           border-radius: 10px;
//           padding: 12px 14px;
//           background: ${t.light};
//         }
//         .age-box-label { font-size: 0.68rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 4px; }
//         .age-box-val { font-size: 1.05rem; font-weight: 700; color: ${t.dark}; }
//         .age-relaxation {
//           margin-top: 12px;
//           background: #fefce8;
//           border: 1px solid #fde68a;
//           border-radius: 8px;
//           padding: 10px 14px;
//           font-size: 0.8rem;
//           color: #92400e;
//         }

//         /* ── VACANCY ── */
//         .vacancy-table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 0.82rem;
//         }
//         .vacancy-table th {
//           background: ${t.dark};
//           color: #fff;
//           padding: 9px 14px;
//           text-align: left;
//           font-size: 0.72rem;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }
//         .vacancy-table td {
//           padding: 10px 14px;
//           border-bottom: 1px solid #f1f5f9;
//           vertical-align: middle;
//         }
//         .vacancy-table tr:last-child td { border-bottom: none; font-weight: 700; background: ${t.light}; }
//         .vac-count {
//           font-weight: 800;
//           font-size: 1.1rem;
//           color: ${t.primary};
//           font-family: 'DM Serif Display', serif;
//         }

//         /* ── ELIGIBILITY ── */
//         .elig-block {
//           padding: 14px;
//           border-radius: 10px;
//           border: 1.5px solid ${t.ring};
//           background: ${t.light};
//           margin-bottom: 10px;
//         }
//         .elig-post { font-weight: 700; color: ${t.dark}; font-size: 0.85rem; margin-bottom: 6px; }
//         .elig-criteria { font-size: 0.82rem; color: #374151; line-height: 1.65; }

//         /* ── SELECTION PROCESS ── */
//         .selection-steps {
//           display: flex;
//           align-items: center;
//           flex-wrap: wrap;
//           gap: 0;
//         }
//         .step-item {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .step-bubble {
//           background: ${t.primary};
//           color: #fff;
//           font-size: 0.72rem;
//           font-weight: 700;
//           padding: 7px 14px;
//           border-radius: 20px;
//           white-space: nowrap;
//         }
//         .step-arrow {
//           color: ${t.accent};
//           font-size: 1.1rem;
//           font-weight: 700;
//           margin: 0 4px;
//         }

//         /* ── HOW TO APPLY ── */
//         .apply-steps { list-style: none; counter-reset: step; }
//         .apply-step {
//           counter-increment: step;
//           display: flex;
//           gap: 12px;
//           margin-bottom: 12px;
//           font-size: 0.83rem;
//           color: #374151;
//           line-height: 1.6;
//           align-items: flex-start;
//         }
//         .apply-step::before {
//           content: counter(step);
//           min-width: 26px;
//           height: 26px;
//           background: ${t.primary};
//           color: #fff;
//           font-weight: 800;
//           font-size: 0.75rem;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//           margin-top: 1px;
//         }

//         /* ── IMPORTANT LINKS ── */
//         .links-grid { display: flex; flex-direction: column; gap: 8px; }
//         .link-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 10px;
//           padding: 10px 14px;
//           border-radius: 9px;
//           border: 1.5px solid #e2e8f0;
//           background: #f8fafc;
//           transition: all 0.2s;
//           text-decoration: none;
//         }
//         .link-row:hover { border-color: ${t.accent}; background: ${t.light}; transform: translateX(4px); }
//         .link-label { font-size: 0.82rem; font-weight: 600; color: #1e293b; }
//         .link-label-hi { font-size: 0.7rem; color: #64748b; font-family: 'Noto Sans Devanagari', sans-serif; }
//         .link-arrow {
//           background: ${t.primary};
//           color: #fff;
//           font-size: 0.7rem;
//           font-weight: 700;
//           padding: 4px 10px;
//           border-radius: 6px;
//           white-space: nowrap;
//           flex-shrink: 0;
//         }
//         .link-inactive { opacity: 0.45; pointer-events: none; }
//         .link-soon { background: #94a3b8; font-size: 0.65rem; padding: 3px 8px; border-radius: 6px; color: #fff; }

//         /* ── FAQs ── */
//         .faq-item { margin-bottom: 8px; border-radius: 9px; overflow: hidden; border: 1px solid #e2e8f0; }
//         .faq-q {
//           width: 100%;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 11px 14px;
//           background: #f8fafc;
//           border: none;
//           cursor: pointer;
//           text-align: left;
//           transition: all 0.2s;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .faq-q:hover { background: ${t.light}; }
//         .faq-num {
//           color: #fff;
//           font-size: 0.65rem;
//           font-weight: 800;
//           padding: 3px 7px;
//           border-radius: 5px;
//           flex-shrink: 0;
//           transition: background 0.2s;
//         }
//         .faq-qtext { font-size: 0.82rem; font-weight: 600; color: #1e293b; flex: 1; line-height: 1.4; }
//         .faq-arrow { color: #64748b; font-size: 1rem; flex-shrink: 0; transition: transform 0.25s; }
//         .faq-a { background: #fff; border-top: 1px solid #f1f5f9; }
//         .faq-a-inner { padding: 12px 14px 12px 40px; font-size: 0.82rem; color: #475569; line-height: 1.65; }

//         /* ── SIDEBAR ── */
//         .sidebar { position: sticky; top: 60px; }
//         .sidebar-card {
//           background: #fff;
//           border-radius: 12px;
//           overflow: hidden;
//           margin-bottom: 14px;
//           border: 1px solid #e2e8f0;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.06);
//         }
//         .sidebar-header {
//           background: ${t.primary};
//           color: #fff;
//           font-size: 0.75rem;
//           font-weight: 800;
//           text-transform: uppercase;
//           letter-spacing: 0.6px;
//           padding: 10px 14px;
//           display: flex;
//           align-items: center;
//           gap: 7px;
//         }
//         .sidebar-body { padding: 14px; }

//         /* ── QUICK INFO TABLE ── */
//         .quick-table { width: 100%; font-size: 0.78rem; border-collapse: collapse; }
//         .quick-table tr { border-bottom: 1px solid #f1f5f9; }
//         .quick-table tr:last-child { border-bottom: none; }
//         .quick-table td { padding: 7px 4px; vertical-align: top; }
//         .quick-table td:first-child { color: #64748b; font-weight: 600; width: 45%; }
//         .quick-table td:last-child { color: #1e293b; font-weight: 700; }

//         /* ── SOCIAL BUTTONS ── */
//         .social-btns { display: flex; flex-direction: column; gap: 8px; }
//         .social-btn {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           padding: 10px;
//           border-radius: 9px;
//           font-size: 0.8rem;
//           font-weight: 700;
//           text-decoration: none;
//           transition: all 0.2s;
//           border: none;
//           cursor: pointer;
//         }
//         .social-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
//         .whatsapp-btn { background: #25d366; color: #fff; }
//         .telegram-btn { background: #2aabee; color: #fff; }

//         /* ── ALSO CHECK ── */
//         .also-check-list { display: flex; flex-direction: column; gap: 6px; }
//         .also-check-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 10px;
//           border-radius: 8px;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           text-decoration: none;
//           font-size: 0.78rem;
//           color: #1e293b;
//           font-weight: 600;
//           transition: all 0.2s;
//         }
//         .also-check-item:hover { background: ${t.light}; border-color: ${t.accent}; color: ${t.primary}; }
//         .also-check-dot { width: 6px; height: 6px; border-radius: 50%; background: ${t.accent}; flex-shrink: 0; }

//         /* ── TAGS ── */
//         .tags-row { display: flex; flex-wrap: wrap; gap: 6px; }
//         .tag {
//           background: ${t.badge};
//           color: ${t.primary};
//           font-size: 0.68rem;
//           font-weight: 700;
//           padding: 4px 10px;
//           border-radius: 20px;
//           text-transform: uppercase;
//           letter-spacing: 0.4px;
//         }

//         /* ── FOOTER BAR ── */
//         .footer-bar {
//           background: ${t.dark};
//           padding: 18px 0;
//           margin-top: 10px;
//           text-align: center;
//           color: rgba(255,255,255,0.5);
//           font-size: 0.75rem;
//         }
//         .footer-bar a { color: ${t.accent}; text-decoration: none; }

//         /* ── DISCLAIMER ── */
//         .disclaimer {
//           background: #fef9c3;
//           border: 1px solid #fde68a;
//           border-radius: 10px;
//           padding: 12px 16px;
//           font-size: 0.75rem;
//           color: #78350f;
//           line-height: 1.6;
//           margin-bottom: 16px;
//         }
//         .disclaimer strong { color: #92400e; }

//         /* ── SCROLLBAR ── */
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-track { background: #f1f5f9; }
//         ::-webkit-scrollbar-thumb { background: ${t.accent}; border-radius: 3px; }
//       `}</style>

//       {/* ── TOP NAV ── */}
//       <nav className="top-nav">
//         <div className="nav-inner">
//           <a href="/" className="nav-logo">Shrilal<span>CSC</span></a>
//           <div className="nav-links">
//             {["Latest Job", "Admit Card", "Result", "Syllabus", "Answer Key", "Admission"].map(c => (
//               <a key={c} href="#" className={`nav-link ${c === post.category ? "active" : ""}`}>{c}</a>
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* ── BREADCRUMB ── */}
//       <div className="breadcrumb">
//         <div className="breadcrumb-inner">
//           <a href="/">Home</a> ›
//           <a href="#">{post.category}</a> ›
//           <span>{post.title}</span>
//         </div>
//       </div>

//       {/* ── HERO ── */}
//       <div className="hero">
//         <div className="hero-inner">
//           <div className="hero-badge">
//             🔴 <span>Live</span> · {post.category}
//           </div>
//           <h1 className="hero-title">{lang === "en" ? post.title : post.title_hi}</h1>
//           <p className="hero-title-hi">{lang === "en" ? post.organization : post.organization_hi}</p>
//           <div className="hero-meta">
//             <div className="hero-chip">📅 <span>Posted: <strong>{formatDate(post.post_date)}</strong></span></div>
//             <div className="hero-chip">📋 <span>Total Posts: <strong>{totalVacancy.toLocaleString("en-IN")}</strong></span></div>
//             <div className="hero-chip">💰 <span>Fee: <strong>₹{post.fee_general} (Gen)</strong></span></div>
//             {post.service_cost > 0 && (
//               <div className="hero-chip">🛎️ <span>Service: <strong>₹{post.service_cost}</strong></span></div>
//             )}
//           </div>
//           {post.tags.length > 0 && (
//             <div className="tags-row" style={{ marginBottom: 16 }}>
//               {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
//             </div>
//           )}
//         </div>
//         <div className="stat-strip">
//           <div className="stat-strip-inner">
//             <div className="stat-item">
//               <span className="stat-val">{totalVacancy.toLocaleString("en-IN")}</span>
//               <span className="stat-label">Total Vacancies</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-val">₹{post.fee_general}</span>
//               <span className="stat-label">General Fee</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-val">{post.age_min}–{post.age_max.split(" ")[0]}</span>
//               <span className="stat-label">Age Limit</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-val">{post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)?.date ? formatDate(post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)!.date).replace(",", "") : "Announced"}</span>
//               <span className="stat-label">Last Date</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── STICKY CTA BAR ── */}
//       <div className="cta-bar">
//         <div className="cta-inner">
//           <div className="cta-title">
//             <span>{post.organization.length > 40 ? post.organization.substring(0, 40) + "…" : post.organization}</span>
//           </div>
//           <div className="cta-btns">
//             <div className="lang-toggle">
//               <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
//               <button className={`lang-btn ${lang === "hi" ? "active" : ""}`} onClick={() => setLang("hi")}>हिं</button>
//             </div>
//             <button className="btn-notify">🔔 Notify Me</button>
//             <a href={post.important_links.find(l => l.label.toLowerCase().includes("apply"))?.url || "#"} className="btn-apply" target="_blank" rel="noopener noreferrer">
//               ✍️ Apply Online
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* ── PAGE BODY ── */}
//       <div className="page-body">

//         {/* ═══════════════ LEFT COLUMN ═══════════════ */}
//         <main>

//           {/* SHORT DESCRIPTION */}
//           <div className="card">
//             <div className="card-body">
//               <p className="short-desc">{post.short_desc}</p>
//             </div>
//           </div>

//           {/* IMPORTANT DATES */}
//           {post.important_dates.length > 0 && (
//             <div className="card">
//               <SectionHeader icon="📅" title="Important Dates" color={t.primary} />
//               <div style={{ overflowX: "auto" }}>
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Event</th>
//                       <th style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>कार्यक्रम</th>
//                       <th>Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {post.important_dates.map((d, i) => (
//                       <tr key={i} className={d.is_bold ? "highlight-row" : ""}>
//                         <td style={{ fontWeight: d.is_bold ? 700 : 400 }}>{d.label}</td>
//                         <td style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "0.78rem" }}>{d.label_hi}</td>
//                         <td>
//                           {d.date
//                             ? <span className={d.is_bold ? "bold-date" : ""}>{formatDate(d.date)}</span>
//                             : <span className="date-tba">⏳ To Be Announced</span>
//                           }
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* APPLICATION FEE */}
//           <div className="card">
//             <SectionHeader icon="💰" title="Application Fee" color={t.primary} />
//             <div className="card-body">
//               <div className="fee-grid">
//                 <div className="fee-card">
//                   <span className="fee-amount">₹{post.fee_general}</span>
//                   <span className="fee-label">General / OBC / EWS</span>
//                 </div>
//                 <div className="fee-card">
//                   {post.fee_sc_st === 0 ? (
//                     <><span className="fee-amount fee-free">FREE</span><span className="fee-label">SC / ST / Female</span></>
//                   ) : (
//                     <><span className="fee-amount">₹{post.fee_sc_st}</span><span className="fee-label">SC / ST / Female</span></>
//                   )}
//                 </div>
//                 <div className="fee-card">
//                   {post.fee_ph === 0 ? (
//                     <><span className="fee-amount fee-free">FREE</span><span className="fee-label">PwD / Divyangjan</span></>
//                   ) : (
//                     <><span className="fee-amount">₹{post.fee_ph}</span><span className="fee-label">PwD / Divyangjan</span></>
//                   )}
//                 </div>
//               </div>
//               {post.fee_payment_modes.length > 0 && (
//                 <>
//                   <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.5px" }}>Payment Modes</div>
//                   <div className="payment-modes">
//                     {post.fee_payment_modes.map(m => <span key={m} className="pay-chip">{m}</span>)}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* AGE LIMIT */}
//           <div className="card">
//             <SectionHeader icon="🎂" title="Age Limit" color={t.primary} />
//             <div className="card-body">
//               <div className="age-grid">
//                 <div className="age-box">
//                   <div className="age-box-label">Minimum Age</div>
//                   <div className="age-box-val">{post.age_min} Years</div>
//                 </div>
//                 <div className="age-box">
//                   <div className="age-box-label">Maximum Age</div>
//                   <div className="age-box-val">{post.age_max}</div>
//                 </div>
//                 {post.age_as_on_date && (
//                   <div className="age-box" style={{ gridColumn: "1 / -1" }}>
//                     <div className="age-box-label">Age Calculated as on</div>
//                     <div className="age-box-val">{formatDate(post.age_as_on_date)}</div>
//                   </div>
//                 )}
//               </div>
//               {post.age_relaxation && (
//                 <div className="age-relaxation">
//                   <strong>⚠️ Age Relaxation:</strong> {post.age_relaxation}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* VACANCY DETAILS */}
//           {post.vacancy_details.length > 0 && (
//             <div className="card">
//               <SectionHeader icon="📊" title="Vacancy Details" color={t.primary} />
//               <div style={{ overflowX: "auto" }}>
//                 <table className="vacancy-table">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Post Name</th>
//                       <th>Category</th>
//                       <th style={{ textAlign: "right" }}>Posts</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {post.vacancy_details.map((v, i) => (
//                       <tr key={i}>
//                         <td style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.75rem" }}>{String(i + 1).padStart(2, "0")}</td>
//                         <td style={{ fontWeight: 600 }}>{v.post_name}</td>
//                         <td style={{ color: "#64748b", fontSize: "0.78rem" }}>{v.category || "—"}</td>
//                         <td style={{ textAlign: "right" }}><span className="vac-count">{v.no_of_posts.toLocaleString("en-IN")}</span></td>
//                       </tr>
//                     ))}
//                     <tr>
//                       <td colSpan={3} style={{ fontWeight: 800, textAlign: "right", paddingRight: 14 }}>Total Vacancies</td>
//                       <td style={{ textAlign: "right" }}><span className="vac-count">{totalVacancy.toLocaleString("en-IN")}</span></td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* ELIGIBILITY */}
//           {post.eligibility.length > 0 && (
//             <div className="card">
//               <SectionHeader icon="🎓" title="Eligibility / Education Qualification" color={t.primary} />
//               <div className="card-body">
//                 {post.eligibility.map((e, i) => (
//                   <div key={i} className="elig-block">
//                     <div className="elig-post">📌 {e.post_name}</div>
//                     <div className="elig-criteria">
//                       {lang === "en" ? e.criteria : e.criteria_hi}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* SELECTION PROCESS */}
//           {post.selection_process.length > 0 && (
//             <div className="card">
//               <SectionHeader icon="🏆" title="Mode of Selection" color={t.primary} />
//               <div className="card-body">
//                 <div className="selection-steps">
//                   {post.selection_process.map((step, i) => (
//                     <div key={step} className="step-item">
//                       <div className="step-bubble">{step}</div>
//                       {i < post.selection_process.length - 1 && <div className="step-arrow">→</div>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* HOW TO APPLY */}
//           {(post.how_to_apply || post.how_to_apply_hi) && (
//             <div className="card">
//               <SectionHeader icon="📝" title="How to Apply" color={t.primary} />
//               <div className="card-body">
//                 <ol className="apply-steps">
//                   {(lang === "en" ? post.how_to_apply : post.how_to_apply_hi)
//                     .split("\n")
//                     .filter(Boolean)
//                     .map((line, i) => {
//                       const cleaned = line.replace(/^Step\s*\d+[:.)]\s*/i, "").trim();
//                       return cleaned ? <li key={i} className="apply-step">{cleaned}</li> : null;
//                     })}
//                 </ol>
//               </div>
//             </div>
//           )}

//           {/* IMPORTANT LINKS */}
//           {post.important_links.length > 0 && (
//             <div className="card">
//               <SectionHeader icon="🔗" title="Important Links" color={t.primary} />
//               <div className="card-body">
//                 <div className="links-grid">
//                   {post.important_links.map((link, i) => (
//                     <a
//                       key={i}
//                       href={link.is_active ? link.url : undefined}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className={`link-row ${!link.is_active ? "link-inactive" : ""}`}
//                     >
//                       <div>
//                         <div className="link-label">{link.label}</div>
//                         {link.label_hi && <div className="link-label-hi">{link.label_hi}</div>}
//                       </div>
//                       {link.is_active
//                         ? <span className="link-arrow">Open ↗</span>
//                         : <span className="link-soon">Coming Soon</span>
//                       }
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* FAQs */}
//           {post.faqs.length > 0 && (
//             <div className="card">
//               <SectionHeader icon="❓" title="Frequently Asked Questions" color={t.primary} />
//               <div className="card-body">
//                 {post.faqs.map((faq, i) => (
//                   <FaqItem key={i} faq={faq} index={i} color={t.primary} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* DISCLAIMER */}
//           <div className="disclaimer">
//             <strong>⚠️ Disclaimer:</strong> All information provided on this page is for informational purposes only. Candidates are advised to verify all details from the official notification before applying. This website is not affiliated with any government body. Always refer to the official website for authentic information.
//           </div>

//         </main>

//         {/* ═══════════════ SIDEBAR ═══════════════ */}
//         <aside className="sidebar">

//           {/* QUICK INFO */}
//           <div className="sidebar-card">
//             <div className="sidebar-header">ℹ️ Quick Information</div>
//             <div className="sidebar-body">
//               <table className="quick-table">
//                 <tbody>
//                   <tr><td>Organization</td><td>{post.organization}</td></tr>
//                   <tr><td>Post Name</td><td>{post.title.replace(/recruitment\s*\d{4}/i, "").trim()}</td></tr>
//                   <tr><td>Category</td><td>{post.category}</td></tr>
//                   <tr><td>Total Posts</td><td>{totalVacancy.toLocaleString("en-IN")}</td></tr>
//                   <tr><td>Application Fee</td><td>₹{post.fee_general}</td></tr>
//                   <tr><td>Age Limit</td><td>{post.age_min}–{post.age_max}</td></tr>
//                   <tr><td>Post Date</td><td>{formatDate(post.post_date)}</td></tr>
//                   <tr>
//                     <td>Last Date</td>
//                     <td style={{ color: "#b91c1c", fontWeight: 800 }}>
//                       {post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)
//                         ? formatDate(post.important_dates.find(d => d.label.toLowerCase().includes("last date") && d.date)!.date)
//                         : "See above"}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* APPLY NOW BLOCK */}
//           <div className="sidebar-card">
//             <div className="sidebar-header">🚀 Apply Now</div>
//             <div className="sidebar-body">
//               <a
//                 href={post.important_links.find(l => l.label.toLowerCase().includes("apply") && l.is_active)?.url || "#"}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="btn-apply"
//                 style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem", padding: "12px", borderRadius: 9 }}
//               >
//                 ✍️ Apply Online Now
//               </a>
//               <a
//                 href={post.important_links.find(l => l.label.toLowerCase().includes("notification") && l.is_active)?.url || "#"}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, padding: "10px", borderRadius: 9, border: `2px solid ${t.primary}`, color: t.primary, fontWeight: 700, fontSize: "0.8rem", textDecoration: "none", background: t.light, transition: "all 0.2s" }}
//               >
//                 📄 Download Notification
//               </a>
//             </div>
//           </div>

//           {/* SOCIAL */}
//           {(post.whatsapp_link || post.telegram_link) && (
//             <div className="sidebar-card">
//               <div className="sidebar-header">📣 Stay Updated</div>
//               <div className="sidebar-body">
//                 <div className="social-btns">
//                   {post.whatsapp_link && (
//                     <a href={post.whatsapp_link} target="_blank" rel="noopener noreferrer" className="social-btn whatsapp-btn">
//                       <span>💬</span> Join WhatsApp Channel
//                     </a>
//                   )}
//                   {post.telegram_link && (
//                     <a href={post.telegram_link} target="_blank" rel="noopener noreferrer" className="social-btn telegram-btn">
//                       <span>✈️</span> Join Telegram Channel
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ALSO CHECK */}
//           {post.also_check.length > 0 && (
//             <div className="sidebar-card">
//               <div className="sidebar-header">👀 You May Also Check</div>
//               <div className="sidebar-body">
//                 <div className="also-check-list">
//                   {post.also_check.map((item, i) => (
//                     <a key={i} href={item.url} className="also-check-item">
//                       <div className="also-check-dot" />
//                       {item.label}
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//         </aside>
//       </div>

//       {/* FOOTER */}
//       <div className="footer-bar">
//         <p>© 2026 ShrilalCSC · All content sourced from official government notifications. For official information visit <a href="#">ssc.gov.in</a></p>
//       </div>
//     </>
//   );
// }













import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase"; 
import PostClient from "./PostClient";
import type { DbPost } from "./PostClient";

// ─── DYNAMIC SEO METADATA ───
export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Await params to support Next.js 15+ perfectly
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .select("title, short_desc, banner_url")
    .eq("id", postId)
    .single();

  if (error || !post) {
    return { title: "Post Not Found | CSC Shambhuganj" };
  }

  return {
    title: `${post.title} | CSC Shambhuganj`,
    description: post.short_desc,
    openGraph: {
      title: post.title,
      description: post.short_desc,
      images: post.banner_url ? [post.banner_url] : [],
    }
  };
}

// ─── SERVER COMPONENT DATA FETCH ───
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  // 1. Fetch the data directly from the Supabase database
  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", postId) 
    .single();

  // 2. If the ID is wrong or blocked, log the exact error to your terminal
  if (error || !post) {
    console.error("🚨 POST FETCH FAILED FOR ID:", postId);
    console.error("🚨 SUPABASE ERROR:", error?.message || "No data returned");
    notFound(); 
  }

  // 3. Pass the fetched database row into your beautiful Client Component
  return <PostClient post={post as DbPost} />;
}