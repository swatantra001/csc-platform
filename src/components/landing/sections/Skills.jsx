
// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { motion, useMotionValue } from 'framer-motion';
// import {
//   Building2, Clock, Award, Users, CreditCard, Train,
//   Landmark, Smartphone, ShieldCheck, Mail, Phone, MapPin,
//   ExternalLink, BarChart, FileText, CheckCircle, Upload,
//   Fingerprint, Wallet, Banknote, UserCheck, ScrollText, FileCheck,
//   Plane, Bus, Car, Zap, Wifi, ShieldPlus, HeartPulse, Database, Monitor, Activity,
//   FileCheck2,
//   BarChart2,
//   FileTextIcon,
//   ScrollTextIcon,
//   CheckCircle2,
//   Users2Icon,
//   CheckCircle2Icon,
//   UploadIcon,
//   FileCheck2Icon,
//   BarChart2Icon,
//   ExternalLinkIcon,
//   SettingsIcon
// } from 'lucide-react';

// // ════════════════════════════════════════════════════════════════════════════════
// // THEME TOKENS (matches your reference exactly)
// // ════════════════════════════════════════════════════════════════════════════════
// const THEME = {
//   light: {
//     pageBg: '#f1f5f9',
//     sectionBg: '#f8fafc',
//     textPrimary: '#1e293b',
//     textSecondary: '#475569',
//     textMuted: '#94a3b8',
//     accent: '#2563eb',
//     accent2: '#1d4ed8',
//     accentLight: '#eff6ff',
//     accentBorder: '#bfdbfe',
//     cardBg: '#ffffff',
//     cardBorder: '#e2e8f0',
//     cardShadow: '0 1px 4px rgba(0,0,0,0.07)',
//     glow: 'rgba(37,99,235,0.08)',
//     glow2: 'rgba(29,78,216,0.06)',
//     divider: '#e2e8f0',
//     marqueeFade: 'linear-gradient(90deg, #f1f5f9 0%, transparent 15%, transparent 85%, #f1f5f9 100%)',
//     portalBg: '#ffffff',
//     portalBorder: '#e2e8f0',
//     portalHoverBorder: 'rgba(37,99,235,0.35)',
//     portalHoverBg: 'linear-gradient(135deg, rgba(37,99,235,0.05), transparent)',
//     liveBadge: 'rgba(37,99,235,0.08)',
//     liveText: '#2563eb',
//     liveDot: '#2563eb',
//     linkHover: '#2563eb',
//     fontSans: "'DM Sans', sans-serif",
//   },
//   dark: {
//     pageBg: '#060b14',
//     sectionBg: '#080d17',
//     textPrimary: '#f1f5f9',
//     textSecondary: 'rgba(255,255,255,0.55)',
//     textMuted: 'rgba(255,255,255,0.28)',
//     accent: '#f59e0b',
//     accent2: '#d97706',
//     accentLight: 'rgba(245,158,11,0.08)',
//     accentBorder: 'rgba(245,158,11,0.25)',
//     cardBg: 'rgba(255,255,255,0.03)',
//     cardBorder: 'rgba(255,255,255,0.08)',
//     cardShadow: '0 1px 4px rgba(0,0,0,0.3)',
//     glow: 'rgba(245,158,11,0.06)',
//     glow2: 'rgba(180,83,9,0.04)',
//     divider: 'rgba(255,255,255,0.06)',
//     marqueeFade: 'linear-gradient(90deg, #060b14 0%, transparent 15%, transparent 85%, #060b14 100%)',
//     portalBg: 'rgba(255,255,255,0.03)',
//     portalBorder: 'rgba(255,255,255,0.08)',
//     portalHoverBorder: 'rgba(245,158,11,0.35)',
//     portalHoverBg: 'linear-gradient(135deg, rgba(245,158,11,0.08), transparent)',
//     liveBadge: 'rgba(245,158,11,0.10)',
//     liveText: '#f59e0b',
//     liveDot: '#f59e0b',
//     linkHover: '#f59e0b',
//     fontSans: "'DM Sans', sans-serif'"
//   },
// };

// // ── Service Categories ──
// const categories = [
//   {
//     label: "Financial Services",
//     colorLight: "from-blue-500/10 to-indigo-500/10",
//     colorDark: "from-amber-500/10 to-orange-500/10",
//     borderLight: "border-blue-500/20",
//     borderDark: "border-amber-500/20",
//     accentLight: "#2563eb",
//     accentDark: "#f59e0b",
//     items: [
//       { icon: <Fingerprint size={18} />, name: "AePS (Aadhar ATM)" },
//       { icon: <Landmark size={18} />, name: "Account Opening" },
//       { icon: <Wallet size={18} />, name: "Money Transfer" },
//       { icon: <Banknote size={18} />, name: "Cash Withdrawal" },
//     ]
//   },
//   {
//     label: "E-Governance",
//     colorLight: "from-emerald-500/10 to-green-500/10",
//     colorDark: "from-emerald-500/10 to-green-500/10",
//     borderLight: "border-emerald-500/20",
//     borderDark: "border-emerald-500/20",
//     accentLight: "#10b981",
//     accentDark: "#10b981",
//     items: [
//       { icon: <FileText size={18} />, name: "PAN Card" },
//       { icon: <UserCheck size={18} />, name: "Voter ID" },
//       { icon: <ScrollText size={18} />, name: "Ration Card" },
//       { icon: <FileCheck size={18} />, name: "PM Kisan Samman" },
//     ]
//   },
//   {
//     label: "Travel & Transport",
//     colorLight: "from-violet-500/10 to-purple-500/10",
//     colorDark: "from-violet-500/10 to-purple-500/10",
//     borderLight: "border-violet-500/20",
//     borderDark: "border-violet-500/20",
//     accentLight: "#8b5cf6",
//     accentDark: "#a78bfa",
//     items: [
//       { icon: <Train size={18} />, name: "IRCTC Train Booking" },
//       { icon: <Plane size={18} />, name: "Flight Tickets" },
//       { icon: <Bus size={18} />, name: "Bus Booking" },
//       { icon: <Car size={18} />, name: "Vehicle Challan" },
//     ]
//   },
//   {
//     label: "Utility Payments",
//     colorLight: "from-orange-500/10 to-amber-500/10",
//     colorDark: "from-orange-500/10 to-amber-500/10",
//     borderLight: "border-orange-500/20",
//     borderDark: "border-orange-500/20",
//     accentLight: "#f59e0b",
//     accentDark: "#fbbf24",
//     items: [
//       { icon: <Zap size={18} />, name: "Electricity Bill" },
//       { icon: <Smartphone size={18} />, name: "Mobile Recharge" },
//       { icon: <Wifi size={18} />, name: "Broadband/DTH" },
//       { icon: <CreditCard size={18} />, name: "Credit Card Bill" },
//     ]
//   },
//   {
//     label: "Insurance & Taxes",
//     colorLight: "from-pink-500/10 to-rose-500/10",
//     colorDark: "from-pink-500/10 to-rose-500/10",
//     borderLight: "border-pink-500/20",
//     borderDark: "border-pink-500/20",
//     accentLight: "#ec4899",
//     accentDark: "#f472b6",
//     items: [
//       { icon: <ShieldCheck size={18} />, name: "Motor Insurance" },
//       { icon: <HeartPulse size={18} />, name: "Health Insurance" },
//       { icon: <ShieldPlus size={18} />, name: "Life Insurance" },
//       { icon: <FileText size={18} />, name: "ITR Filing" },
//     ]
//   },
//   {
//     label: "Digital Infrastructure",
//     colorLight: "from-sky-500/10 to-blue-500/10",
//     colorDark: "from-sky-500/10 to-blue-500/10",
//     borderLight: "border-sky-500/20",
//     borderDark: "border-sky-500/20",
//     accentLight: "#0ea5e9",
//     accentDark: "#38bdf8",
//     items: [
//       { icon: <Upload size={18} />, name: "OCR Processing" },
//       { icon: <Database size={18} />, name: "Admin Analytics" },
//       { icon: <Monitor size={18} />, name: "User Dashboards" },
//       { icon: <Activity size={18} />, name: "Live Status Tracking" },
//     ]
//   },
// ];

// // ── Flat List for Marquee ──
// const marqueeSkills = categories.flatMap(c => c.items);

// // ── Portals ──
// const portals = [
//   { title: "User Dashboard", desc: "Client portal for managing their requests.", link: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, icon: <Users2Icon /> },
//   { title: "Profile & Settings", desc: "Manage your profile and preferences.", link: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile`, icon: <SettingsIcon /> },
//   { title: "Request Status", desc: "Live tracking of user applications.", link: `${process.env.NEXT_PUBLIC_APP_URL}/status`, icon: <CheckCircle2Icon /> },
//   { title: "See all posts/notices", desc: "Browse latest updates and announcements.", link: `${process.env.NEXT_PUBLIC_APP_URL}/posts`, icon: <ScrollTextIcon /> },
//   { title: "See all courses", desc: "Browse available training courses.", link: `${process.env.NEXT_PUBLIC_APP_URL}/courses`, icon: <FileTextIcon /> },
//   { title: "See all galary images", desc: "Browse the galary of works.", link: `${process.env.NEXT_PUBLIC_APP_URL}/galary`, icon: <ExternalLinkIcon /> },
//   { title: "See all notifications", desc: "Browse latest notifications.", link: `${process.env.NEXT_PUBLIC_APP_URL}/notifications`, icon: <ExternalLinkIcon /> },
//   { title: "Assigned Deliveries", desc: "Track deliveries assigned to you.", link: `${process.env.NEXT_PUBLIC_APP_URL}/delivery`, icon: <ExternalLinkIcon /> },
// ];

// // ── Certifications ──
// const certifications = ["CSC VLE Certified", "Fino Payment Bank Partner", "Airtel Payments Bank", "India Post Payments Bank (IPPB)", "IRCTC Authorized Agent"];

// // ════════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ════════════════════════════════════════════════════════════════════════════════
// export default function Skills({ isDark = false }) {
//   const T = isDark ? THEME.dark : THEME.light;

//   // Marquee Refs and State
//   const sectionRef = useRef(null);
//   const trackRef = useRef(null);
//   const touchY = useRef(null);
//   const [dir, setDir] = useState(-1);
//   const [active, setActive] = useState(false);
//   const x = useMotionValue(0);

//   const repeated = [...marqueeSkills, ...marqueeSkills];

//   // Intersection Observer for Marquee Activation
//   useEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;
//     const io = new IntersectionObserver(([entry]) => {
//       setActive(entry.isIntersecting && entry.intersectionRatio > 0.1);
//     }, { threshold: [0.1] });
//     io.observe(el);
//     return () => io.disconnect();
//   }, []);

//   // Wheel/Touch controls for Marquee
//   useEffect(() => {
//     if (!active) return;
//     const onWheel = (e) => setDir(e.deltaY > 0 ? -1 : 1);
//     const onTouchStart = (e) => (touchY.current = e.touches[0].clientY);
//     const onTouchMove = (e) => {
//       if (touchY.current == null) return;
//       const delta = e.touches[0].clientY - touchY.current;
//       setDir(delta > 0 ? 1 : -1);
//       touchY.current = e.touches[0].clientY;
//     };
//     window.addEventListener("wheel", onWheel, { passive: true });
//     window.addEventListener("touchstart", onTouchStart, { passive: true });
//     window.addEventListener("touchmove", onTouchMove, { passive: true });
//     return () => {
//       window.removeEventListener("wheel", onWheel);
//       window.removeEventListener("touchstart", onTouchStart);
//       window.removeEventListener("touchmove", onTouchMove);
//     };
//   }, [active]);

//   // Animation Loop for Marquee
//   useEffect(() => {
//     let id;
//     let last = performance.now();
//     const SPEED = 65;
//     const tick = (now) => {
//       const dt = (now - last) / 1000;
//       last = now;
//       let next = x.get() + SPEED * dir * dt;
//       const loop = trackRef.current?.scrollWidth / 2 || 0;
//       if (loop) {
//         if (next <= -loop) next += loop;
//         else if (next >= 0) next -= loop;
//       }
//       x.set(next);
//       id = requestAnimationFrame(tick);
//     };
//     id = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(id);
//   }, [dir, x]);

//   return (
//     <div style={{ background: T.pageBg, color: T.textPrimary, fontFamily: T.fontSans, transition: 'background 0.4s, color 0.4s' }}>

//       {/* ════════════════════════════════════════════════════════
//           SERVICES / EXPERTISE SECTION
//       ════════════════════════════════════════════════════════ */}
//       <section ref={sectionRef} id="services" className="w-full py-24 flex flex-col items-center justify-center relative overflow-hidden"
//         style={{ borderTop: `1px solid ${T.divider}` }}>

//         {/* Ambient glows */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-1/4 left-0 w-[350px] h-[350px] rounded-full blur-[130px] animate-pulse"
//             style={{ background: `linear-gradient(135deg, ${T.accent2}, ${T.accent})`, opacity: 0.12 }} />
//           <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] rounded-full blur-[130px] animate-pulse delay-500"
//             style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, opacity: 0.12 }} />
//         </div>

//         {/* Section Header */}
//         <motion.h2
//           className="text-4xl sm:text-5xl font-extrabold z-10 text-center"
//           style={{ fontFamily: "'DM Serif Display', serif" }}
//           initial={{ opacity: 0, y: -30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//         >
//             <style dangerouslySetInnerHTML={{
//                                     __html: `
//                                             .gradient-text {
//                                                 display: inline-block;
//                                                 background: ${T.nameGrad};
//                                                 -webkit-background-clip: text;
//                                                 background-clip: text;
//                                                 -webkit-text-fill-color: transparent;
//                                                 text-fill-color: transparent;
//                                                 color: transparent;
//                                         }
//                                         `
//                                 }}
//                                 />
//           <span className="gradient-text">
//             Expertise & Services
//           </span>
//         </motion.h2>
//         <motion.p
//           className="mt-2 mb-12 text-base sm:text-lg z-10 text-center"
//           style={{ color: T.textSecondary }}
//           initial={{ opacity: 0, y: -10 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           viewport={{ once: true }}
//         >
//           Financial · E-Governance · Travel · Utilities
//         </motion.p>

//         {/* Category Grid */}
//         <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
//           {categories.map((cat, ci) => {
//             const accent = isDark ? cat.accentDark : cat.accentLight;
//             return (
//               <motion.div
//                 key={ci}
//                 className="rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
//                 style={{
//                   background: isDark
//                     ? `linear-gradient(135deg, ${cat.colorDark.split(' ')[1].replace('/10', '08')}, ${cat.colorDark.split(' ')[3]?.replace('/10', '05')})`
//                     : `linear-gradient(135deg, ${cat.colorLight.split(' ')[1].replace('/10', '08')}, ${cat.colorLight.split(' ')[3]?.replace('/10', '05')})`,
//                   border: `1px solid ${isDark ? cat.borderDark.replace('/20', '15') : cat.borderLight.replace('/20', '15')}`,
//                   boxShadow: T.cardShadow,
//                 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.07 * ci, duration: 0.5 }}
//                 viewport={{ once: true, amount: 0.2 }}
//               >
//                 <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>{cat.label}</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {cat.items.map((skill, si) => (
//                     <motion.div
//                       key={si}
//                       className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-200 cursor-default"
//                       style={{
//                         background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
//                         border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
//                         color: T.textSecondary,
//                       }}
//                       whileHover={{ scale: 1.06, borderColor: accent }}
//                     >
//                       <span style={{ color: accent }}>{skill.icon}</span>
//                       <span>{skill.name}</span>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Marquee Strip */}
//         <div className="relative w-full overflow-hidden z-10 py-4">
//           <div className="absolute left-0 top-0 h-full w-24 z-20 pointer-events-none" style={{ background: T.marqueeFade }} />
//           <div className="absolute right-0 top-0 h-full w-24 z-20 pointer-events-none" style={{ background: T.marqueeFade }} />

//           <motion.div
//             ref={trackRef}
//             style={{ x, whiteSpace: "nowrap", willChange: "transform" }}
//             className="flex gap-12 items-center"
//           >
//             {repeated.map((skill, i) => (
//               <div
//                 key={i}
//                 className="flex flex-col items-center gap-2 min-w-[120px] transition-colors duration-200 group"
//                 title={skill.name}
//               >
//                 <span className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110"
//                   style={{
//                     background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
//                     border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
//                     boxShadow: isDark ? '0 0 8px rgba(245,158,11,0.15)' : '0 0 8px rgba(37,99,235,0.10)',
//                   }}>
//                   {React.cloneElement(skill.icon, { size: 32, style: { color: isDark ? '#f59e0b' : '#2563eb' } })}
//                 </span>
//                 <p className="text-sm font-medium transition-colors duration-200 group-hover:text-white" style={{ color: T.textMuted }}>
//                   {skill.name}
//                 </p>
//               </div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Certifications */}
//         <motion.div
//           className="relative z-10 mt-16 flex flex-wrap justify-center gap-3 px-6 max-w-4xl"
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           viewport={{ once: true, amount: 0.3 }}
//         >
//           <p className="w-full text-center text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: T.accent }}>
//             Authorized Banking Partners & Certifications
//           </p>
//           {certifications.map((c, i) => (
//             <span key={i} className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
//               style={{
//                 background: isDark ? 'rgba(245,158,11,0.08)' : '#eff6ff',
//                 border: `1px solid ${isDark ? 'rgba(245,158,11,0.20)' : '#bfdbfe'}`,
//                 color: T.textSecondary,
//               }}>
//               {c}
//             </span>
//           ))}
//         </motion.div>
//       </section>

//       {/* ════════════════════════════════════════════════════════
//           PORTALS / INFRASTRUCTURE SECTION
//       ════════════════════════════════════════════════════════ */}
//       <section id="portals" className="relative py-24" style={{ background: T.sectionBg }}>
//         <div className="relative z-10 max-w-6xl w-full mx-auto px-6 md:px-10 lg:px-12">
//           <motion.div
//             initial={{ opacity: 0, y: 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6"
//           >
//             <div>
//               <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: T.textPrimary, fontFamily: "'DM Serif Display', serif" }}>
//                 Digital{' '}
//                 <span className="gradient-text">
//                   Infrastructure
//                 </span>
//               </h3>
//               <p className="max-w-xl" style={{ color: T.textSecondary }}>
//                 Custom platforms built to streamline our CSC operations, manage cash flow via OCR, and provide full transparency to our users.
//               </p>
//             </div>
//             <div className="px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2 flex-shrink-0"
//               style={{ background: T.liveBadge, border: `1px solid ${T.accentBorder}`, color: T.liveText }}>
//               <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.liveDot }} /> Live Local Environment
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {portals.map((portal, i) => (
//               <motion.a
//                 href={portal.link}
//                 target="_blank"
//                 rel="noreferrer"
//                 key={i}
//                 className="group flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
//                 style={{
//                   background: T.portalBg,
//                   border: `1px solid ${T.portalBorder}`,
//                   boxShadow: T.cardShadow,
//                 }}
//                 whileHover={{
//                   borderColor: T.portalHoverBorder,
//                   boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.06)',
//                 }}
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: i * 0.1 }}
//                 viewport={{ once: true }}
//               >
//                 <div>
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="p-3 rounded-xl transition-colors duration-300"
//                       style={{
//                         background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
//                         color: T.textMuted,
//                       }}>
//                       {React.cloneElement(portal.icon, { style: { color: isDark ? '#f59e0b' : '#2563eb' } })}
//                     </div>
//                     <ExternalLink className="w-5 h-5 transition-colors duration-200" style={{ color: T.textMuted }}
//                       onMouseEnter={e => (e.currentTarget).style.color = T.linkHover}
//                       onMouseLeave={e => (e.currentTarget).style.color = T.textMuted} />
//                   </div>
//                   <h4 className="text-lg font-bold mb-1 transition-colors duration-200" style={{ color: T.textPrimary }}>{portal.title}</h4>
//                   <p className="text-sm" style={{ color: T.textSecondary }}>{portal.desc}</p>
//                 </div>
//                 <div className="mt-6 text-xs font-mono truncate transition-colors duration-200" style={{ color: T.textMuted }}>
//                   {portal.link}
//                 </div>
//               </motion.a>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }














"use client";

/**
 * Skills.jsx — REDESIGNED for
 * D:\csc-platform\src\components\landing\sections\Skills.jsx
 *
 * Extension is .jsx, so this file is JSX (no TypeScript). Same props
 * as before: Skills({ isDark = false }) — the parent LandingPage still
 * passes isDark, and this file syncs it to the `dark` class on <html>
 * so the Tailwind `dark:` classes below work.
 *
 * DESIGN (a redesign, not the old layout cleaned up):
 * A service directory, not a showroom. The question a visitor has is
 * "do they do my thing?" — so the section is a list they can scan:
 * six categories, each a plain card with its four services as ruled
 * rows (icon + name), then the five certifications as a quiet strip,
 * then the eight user portals as a second grid. No motion, no
 * auto-playing strip, no hover tricks. The headline says what the
 * section is for: "Everything the counter does, in one list."
 *
 * KEPT, exactly as supplied: all 6 categories with all 24 services
 * (names and icons), all 5 certifications, all 8 user portals (title,
 * description, route), the section ids #services and #portals, and
 * the "Live Local Environment" badge. The per-category colours are
 * kept too, but only as the small label and icon colour — one
 * restrained use per category, not gradient card backgrounds.
 *
 * REMOVED:
 * - The marquee: a requestAnimationFrame loop that moved the 24
 *   services sideways, reversed direction on wheel/touch scroll, and
 *   listened to wheel/touch events on the whole window. It duplicated
 *   the grid below it and fought the page scroll. The grid is the
 *   list; the marquee added nothing.
 * - The token object, glow blobs, gradient text, the serif display
 *   font, and all the motion entrances/hover scale.
 * - The fragile background builder in the category cards
 *   (colorDark.split(' ')[1] ... [3] was undefined, so the second
 *   gradient stop was literally the word "undefined").
 *
 * BUGS FOUND IN THE ORIGINAL — flagging them, not just fixing:
 * 1. The heading "Expertise & Services" used class "gradient-text"
 *    with a <style> that read T.nameGrad — but THEME has no nameGrad
 *    in either theme, so the background was `undefined` and the text
 *    fill was set to transparent. The heading was invisible.
 * 2. The import list pulled in ~20 lucide names that were never
 *    used, including the *Icon suffixed aliases (FileCheck2Icon,
 *    BarChart2Icon, ...) alongside the plain names. Only the icons
 *    actually rendered are imported now.
 * 3. Portal links used process.env.NEXT_PUBLIC_APP_URL — they now
 *    use the same relative routes, and open in the same tab, because
 *    they are pages of this same app.
 *
 * CHANGED, small and safe: the portal label "See all galary images"
 * is spelled "Gallery images" now — the route stays /galary, because
 * that is the route's actual spelling in the app.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import React, { useEffect } from "react";
import {
  Activity,
  Banknote,
  Bus,
  Car,
  CheckCircle2,
  CreditCard,
  Database,
  ExternalLink,
  FileCheck,
  FileText,
  Fingerprint,
  HeartPulse,
  Landmark,
  Monitor,
  Plane,
  ScrollText,
  Settings,
  ShieldCheck,
  ShieldPlus,
  Smartphone,
  Train,
  Upload,
  UserCheck,
  Users,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";

const CATEGORIES = [
  {
    label: "Financial Services",
    accent: "#2563eb",
    items: [
      { Icon: Fingerprint, name: "AePS (Aadhar ATM)" },
      { Icon: Landmark, name: "Account Opening" },
      { Icon: Wallet, name: "Money Transfer" },
      { Icon: Banknote, name: "Cash Withdrawal" },
    ],
  },
  {
    label: "E-Governance",
    accent: "#059669",
    items: [
      { Icon: FileText, name: "PAN Card" },
      { Icon: UserCheck, name: "Voter ID" },
      { Icon: ScrollText, name: "Ration Card" },
      { Icon: FileCheck, name: "PM Kisan Samman" },
    ],
  },
  {
    label: "Travel & Transport",
    accent: "#7c3aed",
    items: [
      { Icon: Train, name: "IRCTC Train Booking" },
      { Icon: Plane, name: "Flight Tickets" },
      { Icon: Bus, name: "Bus Booking" },
      { Icon: Car, name: "Vehicle Challan" },
    ],
  },
  {
    label: "Utility Payments",
    accent: "#d97706",
    items: [
      { Icon: Zap, name: "Electricity Bill" },
      { Icon: Smartphone, name: "Mobile Recharge" },
      { Icon: Wifi, name: "Broadband/DTH" },
      { Icon: CreditCard, name: "Credit Card Bill" },
    ],
  },
  {
    label: "Insurance & Taxes",
    accent: "#db2777",
    items: [
      { Icon: ShieldCheck, name: "Motor Insurance" },
      { Icon: HeartPulse, name: "Health Insurance" },
      { Icon: ShieldPlus, name: "Life Insurance" },
      { Icon: FileText, name: "ITR Filing" },
    ],
  },
  {
    label: "Digital Infrastructure",
    accent: "#0284c7",
    items: [
      { Icon: Upload, name: "OCR Processing" },
      { Icon: Database, name: "Admin Analytics" },
      { Icon: Monitor, name: "User Dashboards" },
      { Icon: Activity, name: "Live Status Tracking" },
    ],
  },
];

const CERTIFICATIONS = [
  "CSC VLE Certified",
  "Fino Payment Bank Partner",
  "Airtel Payments Bank",
  "India Post Payments Bank (IPPB)",
  "IRCTC Authorized Agent",
];

const PORTALS = [
  { Icon: Users, title: "User Dashboard", desc: "Client portal for managing their requests.", link: "/dashboard" },
  { Icon: Settings, title: "Profile & Settings", desc: "Manage your profile and preferences.", link: "/dashboard/profile" },
  { Icon: CheckCircle2, title: "Request Status", desc: "Live tracking of user applications.", link: "/status" },
  { Icon: ScrollText, title: "See all posts/notices", desc: "Browse latest updates and announcements.", link: "/posts" },
  { Icon: FileText, title: "See all courses", desc: "Browse available training courses.", link: "/courses" },
  { Icon: ExternalLink, title: "Gallery images", desc: "Browse the gallery of works.", link: "/galary" },
  { Icon: ExternalLink, title: "See all notifications", desc: "Browse latest notifications.", link: "/notifications" },
  { Icon: ExternalLink, title: "Assigned Deliveries", desc: "Track deliveries assigned to you.", link: "/delivery" },
];

export default function Skills({ isDark = false }) {
  // Keep the parent's isDark prop as the source of truth, and sync it
  // to the `dark` class so Tailwind's dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="w-full bg-white font-sans text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      {/* ── Services ── */}
      <section id="services" className="w-full border-t border-slate-200 py-16 dark:border-slate-800 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
              Services
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything the counter does, in one list
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              Financial · E-Governance · Travel · Utilities — twenty-four
              services across six categories. If it is not on this list,
              ask at the counter: charges are told before payment.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#111a2e]"
              >
                <h3
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: cat.accent }}
                >
                  {cat.label}
                </h3>
                <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
                  {cat.items.map(({ Icon, name }) => (
                    <li key={name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                      <Icon className="h-[18px] w-[18px] shrink-0" style={{ color: cat.accent }} aria-hidden />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
              Authorized Banking Partners &amp; Certifications
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-3">
              {CERTIFICATIONS.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-medium text-slate-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-slate-300"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Portals ── */}
      <section id="portals" className="w-full bg-slate-50 py-16 dark:bg-[#0d1526] lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                Portals
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Digital infrastructure
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                Custom platforms built to streamline our CSC operations,
                manage cash flow via OCR, and provide full transparency to
                our users.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 font-mono text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden />
              Live Local Environment
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PORTALS.map(({ Icon, title, desc, link }) => (
              <a
                key={title}
                href={link}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300 dark:border-slate-700 dark:bg-[#111a2e] dark:hover:border-blue-800"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <span className="rounded-xl bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <ExternalLink
                      className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400"
                      aria-hidden
                    />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
                </div>
                <p className="mt-6 truncate font-mono text-xs text-slate-500 dark:text-slate-400">{link}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
