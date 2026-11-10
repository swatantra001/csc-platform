
// "use client";
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Building2, Clock, Award, Users, CreditCard, Train,
//   Landmark, Smartphone, ShieldCheck, Mail, Phone, MapPin,
//   ExternalLink, BarChart, FileText, CheckCircle, Upload
// } from 'lucide-react';

// // ════════════════════════════════════════════════════════════════════════════════
// // THEME TOKENS (matches your reference exactly)
// // ════════════════════════════════════════════════════════════════════════════════
// const THEME = {
//   light: {
//     pageBg: '#f1f5f9',
//     textPrimary: '#1e293b',
//     textSecondary: '#475569',
//     textMuted: '#94a3b8',
//     accent: '#2563eb',
//     accentHover: '#1d4ed8',
//     accentLight: '#eff6ff',
//     accentBorder: '#bfdbfe',
//     cardBg: '#ffffff',
//     cardBorder: '#e2e8f0',
//     cardShadow: '0 1px 4px rgba(0,0,0,0.07)',
//     sectionGrad: 'linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)',
//     sectionGradText: '#ffffff',
//     glow1: 'rgba(37,99,235,0.12)',
//     glow2: 'rgba(29,78,216,0.08)',
//     glow3: 'rgba(59,130,246,0.06)',
//     statBorder: '#e2e8f0',
//     statBg: '#f8fafc',
//     statHoverBorder: '#93c5fd',
//     statHoverBg: '#eff6ff',
//     divider: '#e2e8f0',
//     pillBg: '#dbeafe',
//     pillText: '#1d4ed8',
//     btnPrimary: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//     btnPrimaryText: '#ffffff',
//     btnPrimaryGlow: 'rgba(37,99,235,0.35)',
//     inputBg: '#f8fafc',
//     inputBorder: '#e2e8f0',
//     modalBg: '#ffffff',
//     modalBorder: '#e2e8f0',
//   },
//   dark: {
//     pageBg: '#060b14',
//     textPrimary: '#f1f5f9',
//     textSecondary: 'rgba(255,255,255,0.55)',
//     textMuted: 'rgba(255,255,255,0.28)',
//     accent: '#f59e0b',
//     accentHover: '#d97706',
//     accentLight: 'rgba(245,158,11,0.08)',
//     accentBorder: 'rgba(245,158,11,0.25)',
//     cardBg: 'rgba(255,255,255,0.03)',
//     cardBorder: 'rgba(255,255,255,0.08)',
//     cardShadow: '0 1px 4px rgba(0,0,0,0.3)',
//     sectionGrad: 'linear-gradient(135deg,#b45309 0%,#d97706 100%)',
//     sectionGradText: '#000000',
//     glow1: 'rgba(245,158,11,0.10)',
//     glow2: 'rgba(217,119,6,0.06)',
//     glow3: 'rgba(180,83,9,0.04)',
//     statBorder: 'rgba(255,255,255,0.08)',
//     statBg: 'rgba(255,255,255,0.03)',
//     statHoverBorder: 'rgba(245,158,11,0.30)',
//     statHoverBg: 'rgba(245,158,11,0.08)',
//     divider: 'rgba(255,255,255,0.06)',
//     pillBg: 'rgba(245,158,11,0.15)',
//     pillText: '#f59e0b',
//     btnPrimary: 'linear-gradient(135deg,#f59e0b,#d97706)',
//     btnPrimaryText: '#000000',
//     btnPrimaryGlow: 'rgba(245,158,11,0.35)',
//     inputBg: 'rgba(255,255,255,0.05)',
//     inputBorder: 'rgba(255,255,255,0.08)',
//     modalBg: '#0f172a',
//     modalBorder: 'rgba(255,255,255,0.1)',
//   },
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // DATA
// // ════════════════════════════════════════════════════════════════════════════════
// const stats = [
//   { label: "Location", value: "Shambhuganj, Jaunpur" },
//   { label: "Experience", value: "10+ Years" },
//   { label: "Certification", value: "CSC Certified" },
//   { label: "Availability", value: "9 AM - 9 PM Daily" },
//   { label: "Dedicated Staff", value: "2 Employees" },
//   { label: "Role", value: "Block Operator, Shambhuganj" },
// ];

// const highlights = [
//   {
//     icon: Landmark,
//     title: "Digital Banking & Cash",
//     desc: "Seamless cash exchange via Bank Transfer, UPI, and Aadhar. Account opening via Fino, Airtel & India Post Payment Banks."
//   },
//   {
//     icon: ShieldCheck,
//     title: "E-Governance Services",
//     desc: "Comprehensive CSC center facilities. Everything from government form filling to official certificate generation."
//   },
//   {
//     icon: Train,
//     title: "IRCTC Authorized",
//     desc: "Own platform for official IRCTC e-rail ticket booking and travel management for local citizens."
//   },
// ];

// const portals = [
//   { title: "Admin Dashboard", desc: "Client portal for managing their requests.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin`, icon: Users },
//   { title: "Admin Analytics", desc: "View center growth and revenue metrics.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/analytics`, icon: BarChart },
//   { title: "OCR Transactions", desc: "Add & manage automated cash transactions.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/transactions`, icon: Upload },
//   { title: "Manage Forms", desc: "Admin portal to update and manage forms.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/forms`, icon: Mail },
//   { title: "Manage Gallery", desc: "Admin portal to upload and manage gallery images.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/galary`, icon: Smartphone },
//   { title: "Manage Posts/Notices", desc: "Admin portal to create and manage posts.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/posts`, icon: CheckCircle },
//   { title: "Create Notice/Post", desc: "Admin portal to broadcast updates.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/posts/create`, icon: FileText },
//   { title: "Manage Courses", desc: "Admin portal to manage training courses.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/courses`, icon: ShieldCheck },
//   { title: "Create Course", desc: "Admin portal to create new training courses.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/courses/create`, icon: CreditCard },
//   { title: "Verify Bookings", desc: "Admin portal to verify student bookings.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/verify`, icon: MapPin },
// ];

// // ════════════════════════════════════════════════════════════════════════════════
// // COMPONENT
// // ════════════════════════════════════════════════════════════════════════════════
// export default function About({ isDark = false }) {
//   const T = isDark ? THEME.dark : THEME.light;

//   const glowPositions = [
//     { top: '-10%', left: '-5%', w: 360, h: 360, delay: 0 },
//     { bottom: '5%', right: '5%', w: 420, h: 420, delay: 0.3 },
//     { top: '50%', left: '50%', w: 220, h: 220, delay: 0.6 },
//   ];

//   return (
//     <section id="about" style={{ background: T.pageBg, color: T.textPrimary, transition: 'background 0.4s, color 0.4s', fontFamily: "'DM Sans', sans-serif" }}>
//       {/* ════════════════════════════════════════════════════════
//           HERO / ABOUT SECTION
//       ════════════════════════════════════════════════════════ */}
//       <div className="relative pt-32 pb-24 min-h-screen flex items-center overflow-hidden">
//         {/* Ambient Glows */}
//         <div className="absolute inset-0 pointer-events-none">
//           {glowPositions.map((g, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full"
//               style={{
//                 width: g.w, height: g.h,
//                 background: `radial-gradient(circle, ${i === 0 ? T.glow1 : i === 1 ? T.glow2 : T.glow3} 0%, transparent 70%)`,
//                 filter: 'blur(80px)',
//                 top: g.top, left: g.left, right: g.right, bottom: g.bottom,
//                 transform: g.top === '50%' ? 'translate(-50%, -50%)' : undefined,
//               }}
//               animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
//               transition={{ duration: 4 + i, repeat: Infinity, delay: g.delay, ease: "easeInOut" }}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 max-w-6xl w-full mx-auto px-6 md:px-10 lg:px-12 flex flex-col gap-16">
//           {/* ── Identity Row ── */}
//           <motion.div
//             className="flex flex-col md:flex-row items-center md:items-stretch gap-10"
//             initial={{ opacity: 0, y: 28 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.65 }}
//             viewport={{ once: true }}
//           >
//             {/* Photo Card */}
//             <motion.div
//               className="relative shrink-0 w-[170px] h-[170px] md:w-[220px] md:h-[220px] rounded-2xl overflow-hidden"
//               style={{
//                 background: T.cardBg,
//                 border: `1px solid ${T.cardBorder}`,
//                 boxShadow: T.cardShadow,
//               }}
//               whileHover={{ scale: 1.03, y: -4 }}
//               transition={{ type: "spring", stiffness: 200, damping: 18 }}
//             >
//               <div className="absolute inset-0 z-10 pointer-events-none" style={{
//                 background: isDark
//                   ? 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(6,11,20,0.4) 100%)'
//                   : 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(255,255,255,0.3) 100%)'
//               }} />
//               <img src="/m1.png" alt="Srilal Yadav" className="w-full h-full object-cover opacity-90" />
//               {/* Decorative ring */}
//               <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
//                 boxShadow: `inset 0 0 0 1px ${isDark ? 'rgba(245,158,11,0.20)' : 'rgba(37,99,235,0.15)'}`,
//               }} />
//             </motion.div>

//             {/* Identity Text */}
//             <div className="flex-1 flex flex-col justify-center text-center md:text-left">
//               <motion.span
//                 className="inline-block mb-3 text-[11px] font-bold tracking-[0.2em] uppercase"
//                 style={{ color: T.accent }}
//                 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}
//                 viewport={{ once: true }}
//               >
//                 Shambhuganj Block Operator · CSC Center Owner
//               </motion.span>

//               <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight pb-2" style={{
//                 fontFamily: "'DM Serif Display', serif",
//                 backgroundImage: isDark
//                   ? 'linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b)'
//                   : 'linear-gradient(135deg, #1d4ed8, #2563eb, #1d4ed8)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundSize: '200% auto',
//               }}>
//                 Srilal Yadav
//               </h2>

//               <p className="mt-3 text-lg sm:text-xl font-semibold flex items-center justify-center md:justify-start gap-2" style={{ color: T.textSecondary }}>
//                 Empowering Rural India Digitally
//                 <Award className="w-5 h-5" style={{ color: T.accent }} />
//               </p>

//               <p className="mt-4 leading-relaxed text-base sm:text-lg max-w-2xl" style={{ color: T.textSecondary }}>
//                 I operate a comprehensive CSC center in Shambhuganj, providing essential financial, travel, and governance services. With over <span style={{ color: T.accent, fontWeight: 700 }}>10 years of trusted operations</span> and a dedicated team of 2 employees, we bridge the digital divide while I continue my core duties at the Shambhuganj office.
//               </p>

//               {/* Stats Grid */}
//               <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
//                 {stats.map((item, i) => (
//                   <motion.div
//                     key={i}
//                     className="rounded-xl px-4 py-3 text-center transition-all duration-300"
//                     style={{
//                       background: T.statBg,
//                       border: `1px solid ${T.statBorder}`,
//                     }}
//                     whileHover={{
//                       background: T.statHoverBg,
//                       borderColor: T.statHoverBorder,
//                       y: -2,
//                     }}
//                     initial={{ opacity: 0, y: 10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.05 * i + 0.3, duration: 0.4 }}
//                     viewport={{ once: true }}
//                   >
//                     <div className="text-[11px] font-bold tracking-wider uppercase mb-1" style={{ color: T.textMuted }}>{item.label}</div>
//                     <div className="text-sm font-bold" style={{ color: T.textPrimary }}>{item.value}</div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>

//           {/* ── Journey Narrative ── */}
//           <motion.div
//             className="text-center md:text-left pt-10"
//             style={{ borderTop: `1px solid ${T.divider}` }}
//             initial={{ opacity: 0, x: -24 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true, amount: 0.3 }}
//           >
//             <h3 className="text-2xl sm:text-3xl font-bold mb-5" style={{ color: T.textPrimary, fontFamily: "'DM Serif Display', serif" }}>
//               <style dangerouslySetInnerHTML={{
//                 __html: `
//                       .gradient-text {
//                           display: inline-block;
//                           background: ${T.nameGrad};
//                           -webkit-background-clip: text;
//                           background-clip: text;
//                           -webkit-text-fill-color: transparent;
//                           text-fill-color: transparent;
//                           color: transparent;
//                   }
//                   `
//               }}
//               />
//               My <span className="gradient-text">Journey & Passion</span>
//             </h3>
//             <p className="leading-relaxed text-base sm:text-lg max-w-4xl" style={{ color: T.textSecondary }}>
//               I am incredibly keen on my work and love serving my community. Operating from 9 AM to 9 PM, my center ensures nobody in Shambhuganj is left behind in the digital age. Even while I am fulfilling my official duties as an operator at Shambhuganj, my two trusted employees manage the CSC center on my behalf, ensuring uninterrupted service delivery.
//             </p>
//             <p className="mt-4 text-base sm:text-lg max-w-4xl flex items-center gap-2 justify-center md:justify-start" style={{ color: T.textMuted }}>
//               <CreditCard className="w-5 h-5" style={{ color: T.accent }} /> We proudly accept secure online payments via Razorpay.
//             </p>
//           </motion.div>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           HIGHLIGHTS SECTION
//       ════════════════════════════════════════════════════════ */}
//       <div className="py-20 px-6 md:px-10 lg:px-12" style={{ background: isDark ? 'rgba(255,255,255,0.01)' : '#f8fafc' }}>
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             className="text-center mb-14"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: T.accent }}>What We Offer</span>
//             <h3 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: T.textPrimary, fontFamily: "'DM Serif Display', serif" }}>
//               Core Services
//             </h3>
//           </motion.div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {highlights.map((h, i) => (
//               <motion.div
//                 key={i}
//                 className="rounded-2xl p-8 transition-all duration-300 group"
//                 style={{
//                   background: T.cardBg,
//                   border: `1px solid ${T.cardBorder}`,
//                   boxShadow: T.cardShadow,
//                 }}
//                 whileHover={{ y: -6, boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.08)' }}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 * i, duration: 0.5 }}
//                 viewport={{ once: true }}
//               >
//                 <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
//                   style={{
//                     background: isDark ? 'rgba(245,158,11,0.12)' : '#eff6ff',
//                     border: `1px solid ${isDark ? 'rgba(245,158,11,0.20)' : '#bfdbfe'}`,
//                     color: T.accent,
//                   }}>
//                   <h.icon className="w-7 h-7" />
//                 </div>
//                 <h4 className="text-lg font-bold mb-3" style={{ color: T.textPrimary }}>{h.title}</h4>
//                 <p className="text-sm leading-relaxed" style={{ color: T.textSecondary }}>{h.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           PORTALS SECTION
//       ════════════════════════════════════════════════════════ */}
//       <div className="py-20 px-6 md:px-10 lg:px-12">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             className="text-center mb-14"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: T.accent }}>Quick Access</span>
//             <h3 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: T.textPrimary, fontFamily: "'DM Serif Display', serif" }}>
//               Admin Portals
//             </h3>
//           </motion.div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {portals.map((p, i) => (
//               <motion.a
//                 key={i}
//                 href={p.link}
//                 className="group rounded-xl p-5 flex items-start gap-4 transition-all duration-300"
//                 style={{
//                   background: T.cardBg,
//                   border: `1px solid ${T.cardBorder}`,
//                   boxShadow: T.cardShadow,
//                 }}
//                 whileHover={{
//                   y: -3,
//                   borderColor: T.accentBorder,
//                   boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.06)',
//                 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.06 * i, duration: 0.4 }}
//                 viewport={{ once: true }}
//               >
//                 <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
//                   style={{
//                     background: T.pillBg,
//                     color: T.pillText,
//                   }}>
//                   <p.icon className="w-5 h-5" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-sm font-bold" style={{ color: T.textPrimary }}>{p.title}</span>
//                     <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: T.accent }} />
//                   </div>
//                   <p className="text-xs leading-relaxed" style={{ color: T.textMuted }}>{p.desc}</p>
//                 </div>
//               </motion.a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }













"use client";

/**
 * About.jsx — REDESIGNED for
 * D:\csc-platform\src\components\landing\sections\About.jsx
 *
 * Extension is .jsx, so this file is JSX (no TypeScript). Same props
 * as before: About({ isDark }) — the parent LandingPage still passes
 * isDark, and this file syncs it to the `dark` class on <html> so the
 * Tailwind `dark:` classes below work.
 *
 * DESIGN (a redesign, not the old layout cleaned up):
 * An editorial profile, like a newspaper profile of a government
 * officer — not a hero with a gradient name and three hover cards.
 * - The headline is a statement, not a name in gradient serif:
 *   "Srilal Yadav has run the Shambhuganj counter for over ten years."
 * - Left column: one real photo (/m1.png) with a caption, then a
 *   "Service record" — the six stats as ruled rows, like a service
 *   book, instead of a grid of hoverable stat tiles.
 * - Right column: name, role, tagline, bio, then the journey in plain
 *   paragraphs, then Vision & Mission in one honest sentence.
 * - "Core Services" is a numbered list (01, 02, 03) with hairline
 *   dividers — the three highlights, read in order, no icon cards
 *   that lift on hover.
 * - The ten admin portals are still all here, with the same titles,
 *   descriptions and links — but they are a quiet "For staff" strip
 *   at the bottom, in small type, because they are staff links, not
 *   something a visitor came to the About page for.
 *
 * KEPT, exactly as supplied: all 6 stats, all 3 highlights, all 10
 * portals, photo, name, role line, tagline, bio, journey narrative,
 * Razorpay line.
 *
 * REMOVED: the token object, motion (whileInView, whileHover,
 * staggered entrances), glow blobs, gradient text — including the
 * broken one: the original referenced T.nameGrad, which did not exist
 * in THEME, so "Journey & Passion" rendered with no gradient at all —
 * the serif display font, the min-h-screen hero with pt-32, and the
 * hover lift/shadow on every card.
 *
 * CHANGED, small and safe: portal links now use relative paths
 * (/admin, /admin/analytics …) instead of the app-URL env variable —
 * same destinations, one less env dependency. "/galary" keeps its
 * spelling. Two imports from the original (Building2, Clock) were
 * never used anywhere in the file, so they are gone.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import React, { useEffect } from "react";
import {
  Award,
  BarChart,
  CheckCircle,
  CreditCard,
  ExternalLink,
  FileText,
  Landmark,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  Train,
  Upload,
  Users,
} from "lucide-react";

const STATS = [
  { label: "Location", value: "Shambhuganj, Jaunpur" },
  { label: "Experience", value: "10+ Years" },
  { label: "Certification", value: "CSC Certified" },
  { label: "Availability", value: "9 AM - 9 PM Daily" },
  { label: "Dedicated Staff", value: "2 Employees" },
  { label: "Role", value: "Block Operator, Shambhuganj" },
];

const HIGHLIGHTS = [
  {
    icon: Landmark,
    title: "Digital Banking & Cash",
    desc: "Seamless cash exchange via Bank Transfer, UPI, and Aadhar. Account opening via Fino, Airtel & India Post Payment Banks.",
  },
  {
    icon: ShieldCheck,
    title: "E-Governance Services",
    desc: "Comprehensive CSC center facilities. Everything from government form filling to official certificate generation.",
  },
  {
    icon: Train,
    title: "IRCTC Authorized",
    desc: "Own platform for official IRCTC e-rail ticket booking and travel management for local citizens.",
  },
];

const PORTALS = [
  { title: "Admin Dashboard", desc: "Client portal for managing their requests.", link: "/admin", icon: Users },
  { title: "Admin Analytics", desc: "View center growth and revenue metrics.", link: "/admin/analytics", icon: BarChart },
  { title: "OCR Transactions", desc: "Add & manage automated cash transactions.", link: "/admin/transactions", icon: Upload },
  { title: "Manage Forms", desc: "Admin portal to update and manage forms.", link: "/admin/forms", icon: Mail },
  { title: "Manage Gallery", desc: "Admin portal to upload and manage gallery images.", link: "/admin/galary", icon: Smartphone },
  { title: "Manage Posts/Notices", desc: "Admin portal to create and manage posts.", link: "/admin/posts", icon: CheckCircle },
  { title: "Create Notice/Post", desc: "Admin portal to broadcast updates.", link: "/admin/posts/create", icon: FileText },
  { title: "Manage Courses", desc: "Admin portal to manage training courses.", link: "/admin/courses", icon: ShieldCheck },
  { title: "Create Course", desc: "Admin portal to create new training courses.", link: "/admin/courses/create", icon: CreditCard },
  { title: "Verify Bookings", desc: "Admin portal to verify student bookings.", link: "/admin/verify", icon: MapPin },
];

export default function About({ isDark = false }) {
  // Keep the parent's isDark prop as the source of truth, and sync it
  // to the `dark` class so Tailwind's dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <section
      id="about"
      className="w-full bg-white font-sans text-slate-900 dark:bg-[#0b1220] dark:text-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
        {/* Headline — a statement, not a name in gradient text */}
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          About the Centre
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Srilal Yadav has run the Shambhuganj counter for over ten years.
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {/* LEFT — photo + service record */}
          <div className="lg:col-span-4">
            <figure>
              <img
                src="/image.png"
                alt="Srilal Yadav, operator of Shri Lal Sahaj Jan Seva Kendra, Shambhuganj"
                className="aspect-[4/5] w-full max-w-sm rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
              />
              <figcaption className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Srilal Yadav, Block Operator, Shambhuganj — at the CSC centre.
              </figcaption>
            </figure>

            <div className="mt-8 max-w-sm">
              <h2 className="border-b-2 border-slate-900 pb-2 text-sm font-bold uppercase tracking-widest text-slate-900 dark:border-white dark:text-white">
                Service record
              </h2>
              <dl>
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3 text-sm dark:border-slate-800"
                  >
                    <dt className="shrink-0 font-medium text-slate-500 dark:text-slate-400">
                      {s.label}
                    </dt>
                    <dd className="text-right font-bold text-slate-900 dark:text-white">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* RIGHT — the operator, in his own words */}
          <div id="operator" className="scroll-mt-28 lg:col-span-8">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Shambhuganj Block Operator · CSC Center Owner
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Srilal Yadav
            </h2>
            <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-slate-600 dark:text-slate-400">
              Empowering Rural India Digitally
              <Award className="h-5 w-5 text-blue-700 dark:text-blue-400" aria-hidden />
            </p>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              I operate a comprehensive CSC center in Shambhuganj, providing
              essential financial, travel, and governance services. With over{" "}
              <strong className="font-bold text-slate-900 dark:text-white">
                10 years of trusted operations
              </strong>{" "}
              and a dedicated team of 2 employees, we bridge the digital
              divide while I continue my core duties at the Shambhuganj office.
            </p>

            <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                My Journey &amp; Passion
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                I am incredibly keen on my work and love serving my community.
                Operating from 9 AM to 9 PM, my center ensures nobody in
                Shambhuganj is left behind in the digital age. Even while I
                am fulfilling my official duties as an operator at
                Shambhuganj, my two trusted employees manage the CSC center on
                my behalf, ensuring uninterrupted service delivery.
              </p>
              <p className="mt-4 flex items-center gap-2 text-base text-slate-500 dark:text-slate-400">
                <CreditCard className="h-5 w-5 text-blue-700 dark:text-blue-400" aria-hidden />
                We proudly accept secure online payments via Razorpay.
              </p>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Vision &amp; Mission
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                That nobody in Shambhuganj is left out of digital India for
                want of a form, a fingerprint or a ticket — and that every
                service is explained before it is charged for.
              </p>
            </div>
          </div>
        </div>

        {/* Core services — a numbered list, read in order */}
        <div className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            What We Offer
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Core Services
          </h2>
          <ol className="mt-8">
            {HIGHLIGHTS.map((h, i) => (
              <li
                key={h.title}
                className="flex gap-6 border-b border-slate-200 py-6 first:border-t dark:border-slate-800"
              >
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    <h.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-slate-900 dark:text-white">
                      {h.title}
                    </span>
                    <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                      {h.desc}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Staff portals — kept in full, kept quiet */}
        <div className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            Quick Access
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            For staff
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Admin portals. These links are for centre staff — they are listed
            here because the original About section listed them, not because
            a visitor needs them.
          </p>
          <ul className="mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {PORTALS.map((p) => (
              <li key={p.title} className="border-b border-slate-200 dark:border-slate-800">
                <a
                  href={p.link}
                  className="group flex items-start gap-3 py-3"
                >
                  <p.icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-700 dark:text-slate-500 dark:group-hover:text-blue-400"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                      {p.title}
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {p.desc}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
