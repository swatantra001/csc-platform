
// "use client";
// import React, { useEffect, useMemo, useState, useRef } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Mail, Phone, MapPin, Globe, CreditCard, LayoutDashboard, ShieldCheck, Activity, Send, TrendingUp, Hash, FileCode, Package2, Upload, CheckCircle, Smartphone, Download, Sparkles, X, Package, AlertCircle } from 'lucide-react';
// import { supabase } from '@/lib/supabase';
// import { createGitHubRelease } from '@/app/actions/releases';
// import { useAuth } from '@/components/AuthProvider';

// // ════════════════════════════════════════════════════════════════════════════════
// // THEME TOKENS (matches your reference exactly)
// // ════════════════════════════════════════════════════════════════════════════════
// const THEME = {
//     light: {
//         pageBg: '#f1f5f9',
//         textPrimary: '#1e293b',
//         textSecondary: '#475569',
//         textMuted: '#94a3b8',
//         accent: '#2563eb',
//         accent2: '#1d4ed8',
//         accentLight: '#eff6ff',
//         accentBorder: '#bfdbfe',
//         cardBg: '#ffffff',
//         cardBorder: '#e2e8f0',
//         cardShadow: '0 1px 4px rgba(0,0,0,0.07)',
//         glow1: 'rgba(37,99,235,0.10)',
//         glow2: 'rgba(29,78,216,0.06)',
//         glow3: 'rgba(59,130,246,0.04)',
//         particle: 'rgba(37,99,235,0.25)',
//         badgeBg: '#eff6ff',
//         badgeBorder: '#bfdbfe',
//         badgeText: '#1d4ed8',
//         nameGrad: 'linear-gradient(135deg, #1d4ed8, #2563eb, #1e3a8a)',
//         typewriterGrad: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//         btnPrimary: 'linear-gradient(135deg, #2563eb, #1d4ed8, #1e3a8a)',
//         btnSecondaryBg: '#ffffff',
//         btnSecondaryText: '#1e293b',
//         btnSecondaryBorder: '#e2e8f0',
//         btnSecondaryHover: '#eff6ff',
//         socialColor: '#94a3b8',
//         socialHover: '#2563eb',
//         hologramRing: 'rgba(37,99,235,0.15)',
//         hologramRingStrong: 'rgba(37,99,235,0.60)',
//         hologramCore: 'rgba(37,99,235,0.20)',
//         panelBg: 'rgba(255,255,255,0.70)',
//         panelBorder: 'rgba(37,99,235,0.20)',
//         panelText: '#2563eb',
//         panelText2: '#1d4ed8',
//         panelAccent: '#3b82f6',
//         lineColor: '#93c5fd',
//     },
//     dark: {
//         pageBg: '#060b14',
//         textPrimary: '#f1f5f9',
//         textSecondary: 'rgba(255,255,255,0.55)',
//         textMuted: 'rgba(255,255,255,0.28)',
//         accent: '#f59e0b',
//         accent2: '#d97706',
//         accentLight: 'rgba(245,158,11,0.08)',
//         accentBorder: 'rgba(245,158,11,0.25)',
//         cardBg: 'rgba(255,255,255,0.03)',
//         cardBorder: 'rgba(255,255,255,0.08)',
//         cardShadow: '0 1px 4px rgba(0,0,0,0.3)',
//         glow1: 'rgba(245,158,11,0.08)',
//         glow2: 'rgba(217,119,6,0.05)',
//         glow3: 'rgba(180,83,9,0.03)',
//         particle: 'rgba(245,158,11,0.20)',
//         badgeBg: 'rgba(245,158,11,0.10)',
//         badgeBorder: 'rgba(245,158,11,0.20)',
//         badgeText: '#f59e0b',
//         nameGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
//         typewriterGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
//         btnPrimary: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
//         btnSecondaryBg: 'rgba(255,255,255,0.05)',
//         btnSecondaryText: '#f1f5f9',
//         btnSecondaryBorder: 'rgba(255,255,255,0.10)',
//         btnSecondaryHover: 'rgba(245,158,11,0.10)',
//         socialColor: 'rgba(255,255,255,0.35)',
//         socialHover: '#f59e0b',
//         hologramRing: 'rgba(245,158,11,0.12)',
//         hologramRingStrong: 'rgba(245,158,11,0.50)',
//         hologramCore: 'rgba(245,158,11,0.15)',
//         panelBg: 'rgba(6,11,20,0.60)',
//         panelBorder: 'rgba(245,158,11,0.20)',
//         panelText: '#f59e0b',
//         panelText2: '#fbbf24',
//         panelAccent: '#fbbf24',
//         lineColor: 'rgba(245,158,11,0.30)',
//     },
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // Self-Contained Particle Background (Theme-Aware)
// // ════════════════════════════════════════════════════════════════════════════════
// const ParticlesBackground = ({ isDark = false }) => {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;
//         let animationFrameId;
//         let particles = [];

//         const resize = () => {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//         };

//         const particleColor = isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(37, 99, 235, 0.20)';

//         class Particle {
//             constructor() {
//                 this.x = Math.random() * canvas.width;
//                 this.y = Math.random() * canvas.height;
//                 this.vx = (Math.random() - 0.5) * 0.5;
//                 this.vy = (Math.random() - 0.5) * 0.5;
//                 this.size = Math.random() * 2;
//             }
//             update() {
//                 this.x += this.vx; this.y += this.vy;
//                 if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
//                 if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
//             }
//             draw() {
//                 ctx.fillStyle = particleColor;
//                 ctx.beginPath();
//                 ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//                 ctx.fill();
//             }
//         }

//         const init = () => {
//             resize();
//             particles = Array.from({ length: 50 }, () => new Particle());
//         };

//         const animate = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             particles.forEach(p => { p.update(); p.draw(); });
//             animationFrameId = requestAnimationFrame(animate);
//         };

//         window.addEventListener('resize', resize);
//         init();
//         animate();

//         return () => {
//             window.removeEventListener('resize', resize);
//             cancelAnimationFrame(animationFrameId);
//         };
//     }, [isDark]);

//     return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // DATA & VARIANTS
// // ════════════════════════════════════════════════════════════════════════════════
// const quickLinks = [
//     { Icon: Phone, label: "Call Now", href: "tel:9005623112" },
//     { Icon: Mail, label: "Email", href: "mailto:sahaj9005623112@gmail.com" },
//     { Icon: MapPin, label: "Location", href: "#" },
//     { Icon: Globe, label: "Website", href: "#" },
// ];

// const glowVariants = {
//     initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
//     hover: (isDark) => ({
//         scale: 1.25, y: -4,
//         filter: isDark
//             ? "drop-shadow(0 0 10px rgba(245,158,11,0.9)) drop-shadow(0 0 22px rgba(217,119,6,0.8))"
//             : "drop-shadow(0 0 10px rgba(37,99,235,0.9)) drop-shadow(0 0 22px rgba(29,78,216,0.8))",
//         transition: { type: "spring", stiffness: 300, damping: 15 }
//     }),
//     tap: { scale: 0.93, y: 0, transition: { duration: 0.08 } }
// };

// const Badge = ({ children, delay = 0, isDark = false }) => {
//     const T = isDark ? THEME.dark : THEME.light;
//     return (
//         <motion.span
//             className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm'
//             style={{ background: T.badgeBg, border: `1px solid ${T.badgeBorder}`, color: T.badgeText }}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay, duration: 0.4 }}
//         >
//             {children}
//         </motion.span>
//     );
// };

// // ════════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ════════════════════════════════════════════════════════════════════════════════
// export default function Home({ isDark = false }) {
//     const T = isDark ? THEME.dark : THEME.light;

//     const roles = useMemo(() => [
//         "Certified CSC Operator",
//         "Fino & Airtel Bank Merchant",
//         "IRCTC Authorized Agent",
//         "Digital Services Expert",
//     ], []);

//     const [index, setIndex] = useState(0);
//     const [subIndex, setSubIndex] = useState(0);
//     const [deleting, setDeleting] = useState(false);

//     useEffect(() => {
//         const current = roles[index];
//         const timeout = setTimeout(() => {
//             if (!deleting && subIndex < current.length) setSubIndex(v => v + 1);
//             else if (!deleting && subIndex === current.length) setTimeout(() => setDeleting(true), 1400);
//             else if (deleting && subIndex > 0) setSubIndex(v => v - 1);
//             else if (deleting && subIndex === 0) {
//                 setDeleting(false);
//                 setIndex(p => (p + 1) % roles.length);
//                 setSubIndex(0);
//             }
//         }, deleting ? 35 : 55);
//         return () => clearTimeout(timeout);
//     }, [index, subIndex, deleting, roles]);

//     return (
//         <section id='home' className='w-full min-h-screen relative overflow-hidden' style={{ background: T.pageBg, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.4s' }}>
//             <ParticlesBackground isDark={isDark} />

//             {/* Background glows */}
//             <div className='absolute inset-0 pointer-events-none'>
//                 <div className='absolute -top-32 -left-32 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[520px] max-h-[520px] rounded-full opacity-20 md:opacity-12 blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse'
//                     style={{ background: `linear-gradient(135deg, ${T.accent2}, ${T.accent}, ${T.accent2})` }} />
//                 <div className='absolute bottom-0 right-0 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[520px] max-h-[520px] rounded-full opacity-20 md:opacity-12 blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse delay-700'
//                     style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accent2}, ${T.accent})` }} />
//                 <div className='absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full blur-[100px]'
//                     style={{ background: T.accent, opacity: 0.04 }} />
//             </div>

//             <div className='relative z-10 h-full min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 pb-12 lg:pb-0'>

//                 {/* LEFT: Text content */}
//                 <div className='flex flex-col justify-center h-full pt-20 lg:pt-0 text-center lg:text-left'>
//                     <div className='w-full lg:pr-16 mx-auto max-w-3xl'>

//                         {/* Badges row */}
//                         <motion.div
//                             className='flex flex-wrap gap-2 justify-center lg:justify-start mb-5 mt-15'
//                             initial={{ opacity: 0, y: -10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <Badge delay={0.1} isDark={isDark}>📍 Shambhuganj, Jaunpur</Badge>
//                             <Badge delay={0.2} isDark={isDark}>🏆 10+ Years Trust</Badge>
//                             <Badge delay={0.3} isDark={isDark}>✅ CSC Certified</Badge>
//                             <Badge delay={0.4} isDark={isDark}>🛡️ Razorpay Verified</Badge>
//                         </motion.div>

//                         {/* Typewriter role */}
//                         <motion.div
//                             className='mb-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide min-h-[1.8em]'
//                             initial={{ opacity: 0, y: 12 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6 }}
//                         >
//                             <style dangerouslySetInnerHTML={{
//                                 __html: `
//                                     .gradient-text {
//                                         display: inline-block;
//                                         background: ${T.nameGrad};
//                                         -webkit-background-clip: text;
//                                         background-clip: text;
//                                         -webkit-text-fill-color: transparent;
//                                         text-fill-color: transparent;
//                                         color: transparent;
//                                     }
//                                 `
//                             }}
//                             />
//                             <span className='gradient-text'>
//                                 {roles[index].substring(0, subIndex)}
//                             </span>
//                             <span
//                                 className='inline-block w-[2px] ml-0.5 animate-pulse align-middle'
//                                 style={{ height: "1em", background: T.accent }}
//                             />
//                         </motion.div>

//                         {/* Name */}
//                         <motion.h1
//                             className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'
//                             initial={{ opacity: 0, y: 40 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.9 }}
//                         >
//                             <span className='font-medium text-2xl sm:text-3xl md:text-4xl block mb-1' style={{ color: T.textMuted }}>Welcome to</span>
//                             <span className='font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl lg:whitespace-nowrap' style={{
//                                 color: T.textPrimary,
//                                 textShadow: isDark ? '0 2px 32px rgba(245,158,11,0.12)' : '0 2px 32px rgba(37,99,235,0.10)',
//                                 fontFamily: "'DM Serif Display', serif",
//                             }}>
//                                 Srilal{' '}
//                                 <style dangerouslySetInnerHTML={{
//                                     __html: `
//                                         .gradient-text {
//                                             display: inline-block;
//                                             background: ${T.nameGrad};
//                                             -webkit-background-clip: text;
//                                             background-clip: text;
//                                             -webkit-text-fill-color: transparent;
//                                             text-fill-color: transparent;
//                                             color: transparent;
//                                         }
//                                     `
//                                 }}
//                                 />
//                                 <span className="gradient-text">Yadav</span>
//                             </span>
//                         </motion.h1>

//                         {/* Bio */}
//                         <motion.p
//                             className='mt-5 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed'
//                             style={{ color: T.textSecondary }}
//                             initial={{ opacity: 0, y: 30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6, delay: 0.3 }}
//                         >
//                             Empowering rural connectivity with comprehensive <span style={{ color: T.accent, fontWeight: 600 }}>CSC services, secure digital banking, and IRCTC ticketing.</span> Operated daily by a dedicated team bridging the gap between you and digital India.
//                         </motion.p>

//                         {/* Primary Portal Actions */}
//                         <motion.div
//                             className='mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4'
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.7, delay: 0.55 }}
//                         >
//                             <a
//                                 href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
//                                 className='group relative px-7 py-3 rounded-full font-semibold text-base overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2'
//                                 style={{ background: T.btnPrimary, color: isDark ? '#000' : '#fff' }}
//                             >
//                                 <LayoutDashboard size={20} className='relative z-10' />
//                                 <span className='relative z-10'>User Dashboard</span>
//                                 <span className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full' />
//                             </a>
//                             <a
//                                 href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/transactions`}
//                                 className='group px-7 py-3 rounded-full text-base font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2'
//                                 style={{
//                                     background: T.btnSecondaryBg,
//                                     color: T.btnSecondaryText,
//                                     border: `1px solid ${T.btnSecondaryBorder}`,
//                                 }}
//                                 onMouseEnter={e => (e.currentTarget).style.background = T.btnSecondaryHover}
//                                 onMouseLeave={e => (e.currentTarget).style.background = T.btnSecondaryBg}
//                             >
//                                 <ShieldCheck size={20} />
//                                 <span>OCR Transaction</span>
//                             </a>
//                         </motion.div>

//                         {/* Socials / Contact Icons */}
//                         <motion.div
//                             className='mt-8 flex gap-3 text-2xl md:text-3xl justify-center lg:justify-start'
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.8, delay: 0.85 }}
//                         >
//                             {quickLinks.map(({ Icon, label, href }) => (
//                                 <motion.a
//                                     href={href}
//                                     key={label}
//                                     aria-label={label}
//                                     variants={glowVariants}
//                                     custom={isDark}
//                                     initial='initial'
//                                     whileHover='hover'
//                                     whileTap='tap'
//                                     className='p-2 transition-colors duration-200'
//                                     style={{ color: T.socialColor }}
//                                     onMouseEnter={e => (e.currentTarget).style.color = T.socialHover}
//                                     onMouseLeave={e => (e.currentTarget).style.color = T.socialColor}
//                                 >
//                                     <Icon />
//                                 </motion.a>
//                             ))}
//                         </motion.div>

//                         <AdminApkUploader isDark={isDark} />
//                     </div>
//                 </div>

//                 {/* RIGHT: Complex Holographic Futuristic UI */}
//                 <div className='relative hidden lg:flex items-center justify-center w-full h-full min-h-[600px]'>

//                     {/* Deep background glow for the hologram */}
//                     <div className="absolute inset-0 pointer-events-none" style={{
//                         background: `radial-gradient(circle_at_center, ${T.hologramCore} 0%, transparent 60%)`
//                     }} />

//                     <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">

//                         {/* Orbital Ring 1 - Outer */}
//                         <motion.div
//                             animate={{ rotateZ: 360 }}
//                             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
//                             className="absolute w-[90%] h-[90%] border rounded-full"
//                             style={{
//                                 borderColor: T.hologramRing,
//                                 borderTopColor: T.hologramRingStrong,
//                                 borderLeftColor: isDark ? 'rgba(245,158,11,0.25)' : 'rgba(37,99,235,0.20)',
//                                 boxShadow: `0 0 30px ${T.hologramRing}`,
//                             }}
//                         />

//                         {/* Orbital Ring 2 - Middle (Counter-rotating) */}
//                         <motion.div
//                             animate={{ rotateZ: -360 }}
//                             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//                             className="absolute w-[65%] h-[65%] border-2 rounded-full"
//                             style={{
//                                 borderColor: isDark ? 'rgba(245,158,11,0.08)' : 'rgba(37,99,235,0.08)',
//                                 borderBottomColor: isDark ? 'rgba(245,158,11,0.40)' : 'rgba(37,99,235,0.35)',
//                                 borderRightColor: isDark ? 'rgba(245,158,11,0.20)' : 'rgba(37,99,235,0.18)',
//                             }}
//                         />

//                         {/* Simulated 3D Core Rings */}
//                         <motion.div
//                             animate={{ rotateX: 360, rotateY: 180 }}
//                             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
//                             className="absolute w-[45%] h-[45%] border rounded-full"
//                             style={{
//                                 borderColor: isDark ? 'rgba(245,158,11,0.30)' : 'rgba(37,99,235,0.25)',
//                                 boxShadow: `inset 0 0 20px ${isDark ? 'rgba(245,158,11,0.15)' : 'rgba(37,99,235,0.12)'}`,
//                             }}
//                         />
//                         <motion.div
//                             animate={{ rotateX: -360, rotateY: -180 }}
//                             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                             className="absolute w-[35%] h-[35%] border rounded-full"
//                             style={{ borderColor: isDark ? 'rgba(245,158,11,0.25)' : 'rgba(37,99,235,0.20)' }}
//                         />

//                         {/* Central Glowing Polygon Core */}
//                         <div className="absolute w-28 h-28 border rotate-45 backdrop-blur-md flex items-center justify-center"
//                             style={{
//                                 background: isDark
//                                     ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(6,11,20,0.5))'
//                                     : 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(255,255,255,0.4))',
//                                 borderColor: isDark ? 'rgba(245,158,11,0.40)' : 'rgba(37,99,235,0.30)',
//                                 boxShadow: `0 0 50px ${isDark ? 'rgba(245,158,11,0.20)' : 'rgba(37,99,235,0.15)'}`,
//                             }}>
//                             <motion.div
//                                 animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
//                                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
//                                 className="w-16 h-16 rounded-full blur-[25px]"
//                                 style={{ background: T.accent }}
//                             />
//                             <Activity size={40} className="absolute -rotate-45" style={{
//                                 color: isDark ? '#fbbf24' : '#93c5fd',
//                                 filter: `drop-shadow(0 0 10px ${isDark ? 'rgba(245,158,11,0.8)' : 'rgba(37,99,235,0.6)'})`,
//                             }} />
//                         </div>

//                         {/* Floating UI Panel 1: Smart Banking (Top Left) */}
//                         <motion.div
//                             initial={{ opacity: 0, x: -50, y: -20 }}
//                             animate={{ opacity: 1, x: 0, y: 0 }}
//                             transition={{ delay: 0.6, duration: 0.8 }}
//                             className="absolute top-[12%] left-[2%] w-52 p-3.5 backdrop-blur-md rounded-xl overflow-hidden group shadow-lg"
//                             style={{ background: T.panelBg, border: `1px solid ${T.panelBorder}` }}
//                         >
//                             <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
//                                 style={{ background: `linear-gradient(90deg, ${T.accentLight}, transparent)` }} />
//                             <div className="flex items-center gap-2 mb-2" style={{ color: T.panelText }}>
//                                 <CreditCard size={14} />
//                                 <span className="text-[11px] font-bold tracking-widest uppercase">Smart Banking</span>
//                             </div>
//                             <div className="w-full h-1 rounded-full mb-2 overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}>
//                                 <motion.div className="h-full" style={{ background: T.accent }} animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
//                             </div>
//                             <div className="font-mono text-[10px]" style={{ color: T.panelText2 }}>TXN SECURE: AES-256</div>
//                         </motion.div>

//                         {/* Floating UI Panel 2: CSC Portal Node (Right Side) */}
//                         <motion.div
//                             initial={{ opacity: 0, x: 50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.9, duration: 0.8 }}
//                             className="absolute top-[40%] -right-[5%] w-60 p-4 backdrop-blur-md rounded-xl shadow-lg"
//                             style={{ background: T.panelBg, border: `1px solid ${T.panelBorder}`, borderRight: `2px solid ${T.accent}` }}
//                         >
//                             <div className="flex items-center justify-between mb-3" style={{ color: T.panelText }}>
//                                 <span className="text-[11px] font-bold tracking-widest">CSC PORTAL NODE</span>
//                                 <Globe size={14} className="animate-pulse" />
//                             </div>
//                             <div className="flex justify-between items-end">
//                                 <div className="space-y-1">
//                                     <div className="text-[9px] tracking-wider" style={{ color: T.textMuted }}>UPTIME</div>
//                                     <div className="font-mono text-sm" style={{ color: T.panelAccent }}>99.98%</div>
//                                 </div>
//                                 <div className="space-y-1 text-right">
//                                     <div className="text-[9px] tracking-wider" style={{ color: T.textMuted }}>LATENCY</div>
//                                     <div className="font-mono text-sm" style={{ color: T.panelText2 }}>12ms</div>
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Floating UI Panel 3: Security / Network (Bottom Left) */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 50 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 1.2, duration: 0.8 }}
//                             className="absolute bottom-[15%] left-[8%] w-64 p-3 backdrop-blur-md rounded-xl flex items-center gap-3 shadow-lg"
//                             style={{
//                                 background: T.panelBg,
//                                 border: `1px solid ${T.panelBorder}`,
//                                 borderLeft: `2px solid ${T.accent}`,
//                             }}
//                         >
//                             <div className="p-2 rounded-lg" style={{
//                                 background: isDark ? 'rgba(245,158,11,0.10)' : 'rgba(37,99,235,0.08)',
//                                 color: T.panelText,
//                                 border: `1px solid ${isDark ? 'rgba(245,158,11,0.15)' : 'rgba(37,99,235,0.12)'}`,
//                             }}>
//                                 <ShieldCheck size={18} />
//                             </div>
//                             <div>
//                                 <div className="text-[10px] font-bold tracking-wider uppercase" style={{ color: T.textSecondary }}>Network Integrity</div>
//                                 <div className="text-xs font-mono mt-0.5" style={{ color: T.panelText2 }}>SYNCED & ENCRYPTED</div>
//                             </div>
//                         </motion.div>

//                         {/* SVG Connecting Lines */}
//                         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-[-1]">
//                             <path d="M 275 275 L 120 120" stroke={T.lineColor} strokeWidth="1" strokeDasharray="4 4" fill="none" />
//                             <path d="M 275 275 L 450 275" stroke={T.lineColor} strokeWidth="1" strokeDasharray="4 4" fill="none" />
//                             <path d="M 275 275 L 180 430" stroke={T.lineColor} strokeWidth="1" strokeDasharray="4 4" fill="none" />
//                         </svg>

//                     </div>
//                 </div>
//             </div>
//             <AppDownloadBanner isDark={isDark} />
//         </section>
//     );
// }

// function AdminApkUploader({ isDark }) {
//     const { user } = useAuth();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [versions, setVersions] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [major, setMajor] = useState('1');
//     const [minor, setMinor] = useState('0');
//     const [patch, setPatch] = useState('0');
//     const [file, setFile] = useState(null);
//     const [releaseNotes, setReleaseNotes] = useState('');
//     const [uploadProgress, setUploadProgress] = useState(0);

//     const T = isDark ? {
//         bg: 'rgba(245,158,11,0.05)',
//         border: 'rgba(245,158,11,0.2)',
//         accent: '#f59e0b',
//         text: '#f1f5f9',
//         muted: 'rgba(255,255,255,0.4)',
//     } : {
//         bg: 'rgba(37,99,235,0.03)',
//         border: 'rgba(37,99,235,0.15)',
//         accent: '#2563eb',
//         text: '#1e293b',
//         muted: '#64748b',
//     };

//     useEffect(() => {
//         if (user?.email === 'rm0644320@gmail.com') {
//             setIsAdmin(true);
//             fetchVersions();
//         }
//     }, [user]);

//     const fetchVersions = async () => {
//         const { data } = await supabase
//             .from('app_versions')
//             .select('*')
//             .order('created_at', { ascending: false })
//             .limit(5);
//         if (data) setVersions(data);
//     };

//     const handleFileSelect = (e) => {
//         const selected = e.target.files?.[0];
//         if (selected && selected.name.endsWith('.apk')) {
//             setFile(selected);
//             const match = selected.name.match(/v?(\d+)\.(\d+)\.(\d+)/);
//             if (match) {
//                 setMajor(match[1]);
//                 setMinor(match[2]);
//                 setPatch(match[3]);
//             }
//         }
//     };

//     const handleUpload = async () => {
//         if (!file) return;
//         setLoading(true);
//         setUploadProgress(30);

//         try {
//             const versionString = `${major}.${minor}.${patch}`;
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("version", versionString);
//             formData.append("releaseNotes", releaseNotes || `Version ${versionString} release`);

//             await createGitHubRelease(formData);

//             setFile(null);
//             setReleaseNotes('');
//             setUploadProgress(100);
//             await fetchVersions();
//             setTimeout(() => setUploadProgress(0), 2000);
//         } catch (err) {
//             alert('Upload failed: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getUpdateType = (v, prev) => {
//         if (!prev) return 'initial';
//         if (v.major_version > prev.major_version) return 'major';
//         if (v.minor_version > prev.minor_version) return 'minor';
//         return 'patch';
//     };

//     if (!isAdmin) return null;

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8 }}
//             className="mt-8 rounded-2xl border overflow-hidden"
//             style={{
//                 background: T.bg,
//                 borderColor: T.border,
//             }}
//         >
//             {/* Header */}
//             <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: T.border }}>
//                 <Package2 size={20} style={{ color: T.accent }} />
//                 <div>
//                     <h3 className="font-bold text-sm" style={{ color: T.accent }}>
//                         App Release Manager
//                     </h3>
//                     <p className="text-xs" style={{ color: T.muted }}>
//                         Upload new APK versions for OTA distribution
//                     </p>
//                 </div>
//             </div>

//             <div className="p-5 space-y-5">
//                 {/* Version Inputs */}
//                 <div>
//                     <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
//                         Version Number
//                     </label>
//                     <div className="grid grid-cols-3 gap-3">
//                         {[
//                             { label: 'Major', value: major, setter: setMajor, icon: TrendingUp },
//                             { label: 'Minor', value: minor, setter: setMinor, icon: Hash },
//                             { label: 'Patch', value: patch, setter: setPatch, icon: FileCode },
//                         ].map((field) => (
//                             <div key={field.label} className="relative">
//                                 <field.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
//                                 <input
//                                     type="number"
//                                     min="0"
//                                     value={field.value}
//                                     onChange={(e) => field.setter(e.target.value)}
//                                     className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-mono font-bold border outline-none focus:ring-2 transition-all"
//                                     style={{
//                                         background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
//                                         borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
//                                         color: T.text,
//                                     }}
//                                     placeholder={field.label}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <p className="text-[10px] mt-1.5" style={{ color: T.muted }}>
//                         Major = forced update, Minor = recommended, Patch = optional
//                     </p>
//                 </div>

//                 {/* Release Notes */}
//                 <div>
//                     <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
//                         Release Notes
//                     </label>
//                     <textarea
//                         value={releaseNotes}
//                         onChange={(e) => setReleaseNotes(e.target.value)}
//                         placeholder="What's new in this version..."
//                         rows={2}
//                         className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 resize-none transition-all"
//                         style={{
//                             background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
//                             borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
//                             color: T.text,
//                         }}
//                     />
//                 </div>

//                 {/* File Upload */}
//                 <div>
//                     <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
//                         APK File
//                     </label>
//                     <label className="block cursor-pointer">
//                         <input
//                             type="file"
//                             accept=".apk"
//                             onChange={handleFileSelect}
//                             className="hidden"
//                         />
//                         <div className={`
//                             px-4 py-4 rounded-xl border-2 border-dashed text-center transition-all
//                             ${file ? 'border-solid' : ''}
//                         `}
//                             style={{
//                                 borderColor: file ? T.accent : (isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'),
//                                 background: file ? (isDark ? 'rgba(245,158,11,0.05)' : 'rgba(37,99,235,0.03)') : 'transparent',
//                             }}>
//                             {file ? (
//                                 <div className="flex items-center justify-center gap-2">
//                                     <CheckCircle size={18} style={{ color: T.accent }} />
//                                     <span className="text-sm font-medium" style={{ color: T.accent }}>
//                                         {file.name}
//                                     </span>
//                                     <span className="text-xs" style={{ color: T.muted }}>
//                                         ({(file.size / 1024 / 1024).toFixed(1)} MB)
//                                     </span>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-1">
//                                     <Upload size={24} className="mx-auto" style={{ color: T.muted }} />
//                                     <span className="text-sm font-medium block" style={{ color: T.text }}>
//                                         Click to select APK file
//                                     </span>
//                                     <span className="text-xs block" style={{ color: T.muted }}>
//                                         Must be a signed release APK
//                                     </span>
//                                 </div>
//                             )}
//                         </div>
//                     </label>
//                 </div>

//                 {/* Progress */}
//                 <AnimatePresence>
//                     {uploadProgress > 0 && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: 'auto' }}
//                             exit={{ opacity: 0, height: 0 }}
//                         >
//                             <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
//                                 <motion.div
//                                     className="h-full rounded-full"
//                                     style={{ background: T.accent }}
//                                     initial={{ width: 0 }}
//                                     animate={{ width: `${uploadProgress}%` }}
//                                     transition={{ duration: 0.3 }}
//                                 />
//                             </div>
//                             <p className="text-xs text-center mt-1" style={{ color: T.muted }}>
//                                 {uploadProgress === 100 ? 'Upload complete!' : 'Uploading...'}
//                             </p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Upload Button */}
//                 <button
//                     onClick={handleUpload}
//                     disabled={!file || loading}
//                     className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     style={{
//                         background: T.accent,
//                         color: isDark ? '#000' : '#fff',
//                         boxShadow: `0 4px 20px ${isDark ? 'rgba(245,158,11,0.3)' : 'rgba(37,99,235,0.25)'}`,
//                     }}
//                 >
//                     {loading ? (
//                         <>
//                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                             Processing...
//                         </>
//                     ) : (
//                         <>
//                             <Upload size={16} />
//                             Release v{major}.{minor}.{patch}
//                         </>
//                     )}
//                 </button>

//                 {/* Version History */}
//                 {versions.length > 0 && (
//                     <div className="pt-4 border-t" style={{ borderColor: T.border }}>
//                         <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: T.muted }}>
//                             Recent Releases
//                         </h4>
//                         <div className="space-y-2">
//                             {versions.map((v, i) => {
//                                 const type = getUpdateType(v, versions[i + 1]);
//                                 const typeColors = {
//                                     major: '#ef4444',
//                                     minor: '#f59e0b',
//                                     patch: '#22c55e',
//                                     initial: '#64748b',
//                                 };

//                                 return (
//                                     <div
//                                         key={v.id}
//                                         className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
//                                         style={{
//                                             background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
//                                         }}
//                                     >
//                                         <span
//                                             className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
//                                             style={{
//                                                 background: `${typeColors[type]}20`,
//                                                 color: typeColors[type],
//                                             }}
//                                         >
//                                             {type}
//                                         </span>
//                                         <span className="text-sm font-mono font-bold" style={{ color: T.text }}>
//                                             v{v.version_string}
//                                         </span>
//                                         <span className="text-xs ml-auto" style={{ color: T.muted }}>
//                                             {new Date(v.created_at).toLocaleDateString()}
//                                         </span>
//                                         <a
//                                             href={v.apk_url}
//                                             download
//                                             className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
//                                             style={{ color: T.accent }}
//                                         >
//                                             <Globe size={14} />
//                                         </a>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </motion.div>
//     );
// }

// function AppDownloadBanner({ isDark }) {
//     const [version, setVersion] = useState(null);
//     const [dismissed, setDismissed] = useState(false);
//     const [isMobile, setIsMobile] = useState(false);

//     const T = isDark ? {
//         bg: 'rgba(6,11,20,0.95)',
//         border: 'rgba(245,158,11,0.3)',
//         accent: '#f59e0b',
//         text: '#f1f5f9',
//         muted: 'rgba(255,255,255,0.4)',
//         glow: 'rgba(245,158,11,0.2)',
//     } : {
//         bg: 'rgba(255,255,255,0.95)',
//         border: 'rgba(37,99,235,0.2)',
//         accent: '#2563eb',
//         text: '#1e293b',
//         muted: '#64748b',
//         glow: 'rgba(37,99,235,0.15)',
//     };

//     useEffect(() => {
//         const checkMobile = () => {
//             setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
//         };
//         checkMobile();

//         const fetchVersion = async () => {
//             const { data } = await supabase
//                 .from('app_versions')
//                 .select('version_string, apk_url, release_notes')
//                 .order('created_at', { ascending: false })
//                 .limit(1)
//                 .single();
//             if (data) setVersion(data);
//         };
//         fetchVersion();

//         const dismissedAt = localStorage.getItem('apk_banner_dismissed');
//         if (dismissedAt && Date.now() - parseInt(dismissedAt) < 24 * 60 * 60 * 1000) {
//             setDismissed(true);
//         }
//     }, []);

//     const handleDismiss = () => {
//         setDismissed(true);
//         localStorage.setItem('apk_banner_dismissed', Date.now().toString());
//     };

//     if (!version || dismissed) return null;

//     return (
//         <AnimatePresence>
//             <motion.div
//                 initial={{ y: 100, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: 100, opacity: 0 }}
//                 transition={{ delay: 1.5, type: 'spring', damping: 20 }}
//                 className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:w-[420px]"
//             >
//                 <div
//                     className="relative rounded-2xl p-4 shadow-2xl backdrop-blur-xl border overflow-hidden"
//                     style={{
//                         background: T.bg,
//                         borderColor: T.border,
//                         boxShadow: `0 8px 32px ${T.glow}`,
//                     }}
//                 >
//                     {/* Animated top line */}
//                     <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
//                         <motion.div
//                             animate={{ x: ['-100%', '100%'] }}
//                             transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
//                             className="w-full h-full"
//                             style={{
//                                 background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
//                             }}
//                         />
//                     </div>

//                     <div className="flex items-start gap-3">
//                         {/* Pulsing New badge */}
//                         <div className="flex-shrink-0">
//                             <motion.div
//                                 animate={{ scale: [1, 1.15, 1] }}
//                                 transition={{ duration: 2, repeat: Infinity }}
//                                 className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
//                                 style={{
//                                     background: `${T.accent}20`,
//                                     color: T.accent,
//                                     border: `1px solid ${T.accent}40`,
//                                 }}
//                             >
//                                 <Sparkles size={12} />
//                                 NEW
//                             </motion.div>
//                         </div>

//                         <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium leading-relaxed" style={{ color: T.text }}>
//                                 For smoother experience, install the latest version of{' '}
//                                 <span className="font-bold" style={{ color: T.accent }}>
//                                     Jan Seva Kendra App
//                                 </span>
//                                 {' — '}
//                                 <span className="font-mono font-bold" style={{ color: T.accent }}>
//                                     v{version.version_string}
//                                 </span>
//                             </p>

//                             <div className="flex items-center gap-3 mt-3">
//                                 <a
//                                     href={version.apk_url}
//                                     download
//                                     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
//                                     style={{
//                                         background: `linear-gradient(135deg, ${T.accent}, ${isDark ? '#d97706' : '#1d4ed8'})`,
//                                         color: '#fff',
//                                         boxShadow: `0 4px 20px ${T.glow}`,
//                                     }}
//                                 >
//                                     <Download size={16} />
//                                     Download APK
//                                 </a>

//                                 <span className="flex items-center gap-1 text-xs" style={{ color: T.muted }}>
//                                     <Smartphone size={12} />
//                                     Android only
//                                 </span>
//                             </div>
//                         </div>

//                         <button
//                             onClick={handleDismiss}
//                             className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
//                             style={{ color: T.muted }}
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 </div>
//             </motion.div>
//         </AnimatePresence>
//     );
// }








"use client";

/**
 * Home.jsx — REDESIGNED hero for
 * D:\csc-platform\src\components\landing\sections\Home.jsx
 *
 * Extension is .jsx, so this file is JSX (no TypeScript). Same props
 * as before: Home({ isDark }) — the parent LandingPage still passes
 * isDark, and this file syncs it to the `dark` class on <html> so the
 * Tailwind `dark:` classes below work.
 *
 * DESIGN (this is a redesign, not the old layout cleaned up):
 * A working government service counter, not a startup landing page.
 * - The headline is what the visitor gets, not the operator's name:
 *   "Government and banking services, without the trip to the city."
 *   The name and credentials sit underneath it, small, where they belong.
 * - The centre of the page is a ledger: "Most people come for" — four
 *   rows, each naming the task AND what to bring, so nobody makes a
 *   second trip. That list is the design; there is no icon-card grid.
 * - The right side is one real photo plus a counter card built like a
 *   receipt: hours, phone, WhatsApp, email, operator, each on its own
 *   ruled line, and the rule "charge told before payment".
 * - Hairline borders do the structuring, not shadows. One blue accent.
 *   One photo. Nothing moves on its own. Type is system sans, large.
 *
 * KEPT, exactly as supplied: all 4 roles (as a credentials line), bio
 * copy, both buttons (User Dashboard, OCR Transaction — now relative
 * links /dashboard and /admin/transactions), all 4 quick links (as a
 * contact line, not floating icons), AdminApkUploader (full logic:
 * Supabase app_versions, GitHub release, version inputs, release
 * notes, APK file, progress, version history with major/minor/patch/
 * initial type), AppDownloadBanner (full logic: latest version from
 * Supabase, 24-hour dismiss, Android only).
 *
 * REMOVED (visuals only): token object, canvas particles, glow blobs,
 * typewriter, gradient text, serif display font, orbital rings,
 * floating panels, motion library, fake panel numbers.
 *
 * NAVBAR CONTENT: the menu content (from the friend's site, adapted
 * to a CSC centre) lives in a new shared file, src/lib/siteNav.js —
 * see ~/workspace/your_files/siteNav.js. Navbar.jsx will use it when
 * you send that file next. Home.jsx does not duplicate the navbar.
 *
 * No other new file is needed for this one. Add the photo:
 * /public/images/centre-entrance.jpg. Setup: tailwind.config.js ->
 * darkMode: "class".
 */

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileCode,
  FileText,
  Fingerprint,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  Package2,
  Phone,
  ShieldCheck,
  Smartphone,
  Train,
  TrendingUp,
  Upload,
  X,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createGitHubRelease } from "@/app/actions/releases";
import { useAuth } from "@/components/AuthProvider";

const ADMIN_EMAIL = "rm0644320@gmail.com"; // from your code — TODO: server-side role check

const CREDENTIALS =
  "Certified CSC Operator · Fino & Airtel Bank Merchant · IRCTC Authorized Agent · Digital Services Expert";

const MOST_VISITED = [
  {
    Icon: Fingerprint,
    title: "AePS cash withdrawal",
    bring: "Aadhaar card — fingerprint taken at the counter",
    href: "#services-banking",
  },
  {
    Icon: FileText,
    title: "PAN card — apply or correct",
    bring: "Aadhaar card and the mobile number linked to it",
    href: "#services-governance",
  },
  {
    Icon: Train,
    title: "Train ticket — IRCTC",
    bring: "Names, ages and an ID proof for every passenger",
    href: "#services-travel",
  },
  {
    Icon: Zap,
    title: "Electricity bill",
    bring: "Your bill, or the consumer number",
    href: "#services-utility",
  },
];

const STATS = [
  { value: "10+ years", label: "Serving Shambhuganj" },
  { value: "50+", label: "Services at one counter" },
  { value: "3", label: "Banking partners" },
  { value: "9 AM – 9 PM", label: "Open every day" },
];

export default function Home({ isDark = false }) {
  // Keep the parent's isDark prop as the source of truth, and sync it
  // to the `dark` class so Tailwind's dark: variants work.

  const {user} = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);



  const hour = new Date().getHours();
  const isOpenNow = hour >= 9 && hour < 21;

  return (
    <section
      id="home"
      className="w-full bg-white font-sans text-slate-900 dark:bg-[#0b1220] dark:text-slate-100"
    >
      {/* Eyebrow strip — where, and whether it is open */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-[13px] sm:px-8">
          <p className="font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Common Service Centre — Shambhuganj, Jaunpur, Uttar Pradesh
          </p>
          <p className="inline-flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${isOpenNow ? "bg-green-600" : "bg-amber-500"}`}
            />
            {isOpenNow ? "Open now" : "Closed now"} · 9:00 AM – 9:00 PM, every day
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 py-12 sm:px-8 lg:grid-cols-12 lg:py-16">
        {/* LEFT — 7 columns: the promise, then the ledger */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.4rem]">
            Government and banking services, without the trip to the city.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Shri Lal Sahaj Jan Seva Kendra in Shambhuganj does the CSC work,
            the banking and the train tickets — in person, in your language,
            and with a receipt for every payment. Run by Srilal Yadav, Block
            Operator, with two staff at the counter.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            {CREDENTIALS}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              See what you can get done
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="/status"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Track your request
            </a>
            <a
              href="tel:+919005623112"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
            >
              <Phone className="h-4 w-4" aria-hidden />
              90056 23112
            </a>
          </div>

          {/* The ledger — most people come for these four things */}
          <div className="mt-12">
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-slate-900 pb-3 dark:border-white">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Most people come for
              </h2>
              <a
                href="#services"
                className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
              >
                All 50+ services →
              </a>
            </div>
            <ul>
              {MOST_VISITED.map(({ Icon, title, bring, href }) => (
                <li key={title} className="border-b border-slate-200 dark:border-slate-800">
                  <a href={href} className="group flex items-center gap-4 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
                        Bring: {bring}
                      </span>
                    </span>
                    <ChevronRight
                      className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-700 dark:text-slate-600 dark:group-hover:text-blue-400"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Not sure what a form needs? Call first — the staff will tell you
              what to bring, before you pay anything.
            </p>
          </div>

          {/* Portal actions, kept from the original */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={`${user?.role === "user" ? "/dashboard" : "/admin"}`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              User Dashboard
            </a>
            <a
              href="/admin/transactions"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              OCR Transaction
            </a>
          </div>

          <AdminApkUploader isDark={isDark} />
        </div>

        {/* RIGHT — 5 columns: one photo, one counter card */}
        <div className="lg:col-span-5">
          <figure>
            <img
              src="/images/centre-entrance.jpg"
              alt="Entrance of Shri Lal Sahaj Jan Seva Kendra, Shambhuganj, Jaunpur"
              className="aspect-[4/3] w-full rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
            />
            <figcaption className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              The centre, Shambhuganj — the banking and document counters are
              inside, to the left of the entrance.
            </figcaption>
          </figure>

          {/* Counter card — built like a receipt */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white">At the counter</h2>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span
                  aria-hidden
                  className={`h-2 w-2 rounded-full ${isOpenNow ? "bg-green-600" : "bg-amber-500"}`}
                />
                {isOpenNow ? "Open now" : "Closed now"}
              </span>
            </div>
            <dl>
              {[
                { term: "Hours", value: "9:00 AM – 9:00 PM, every day", Icon: Clock },
                { term: "Phone", value: "90056 23112", Icon: Phone, href: "tel:+919005623112" },
                { term: "WhatsApp", value: "90056 23112", Icon: MessageCircle, href: "https://wa.me/919005623112" },
                { term: "Email", value: "sahaj9005623112@gmail.com", Icon: Mail, href: "mailto:sahaj9005623112@gmail.com" },
                { term: "Visit", value: "Shambhuganj, Jaunpur, UP", Icon: MapPin, href: "#contact" },
              ].map(({ term, value, Icon, href }) => (
                <div
                  key={term}
                  className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 text-sm last:border-b-0 dark:border-slate-700"
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden />
                  <dt className="w-20 shrink-0 font-medium text-slate-500 dark:text-slate-400">{term}</dt>
                  <dd className="min-w-0 flex-1 font-semibold text-slate-900 dark:text-white">
                    {href ? (
                      <a href={href} className="break-all hover:text-blue-700 hover:underline dark:hover:text-blue-400">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="flex items-start gap-2 border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-400">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" aria-hidden />
              Charge told before payment. Receipt for every payment. Two staff
              work here with Srilal Yadav, so work continues while he is on
              block duty.
            </p>
          </div>
        </div>
      </div>

      {/* Stat strip — plain text, hairline dividers, no cards */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col border-l-2 border-blue-700 pl-4 dark:border-blue-500">
              <dt className="order-2 mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</dt>
              <dd className="order-1 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <AppDownloadBanner isDark={isDark} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Admin APK uploader — same logic as supplied, plain card UI.         */
/* ------------------------------------------------------------------ */

function AdminApkUploader({ isDark }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [major, setMajor] = useState("1");
  const [minor, setMinor] = useState("0");
  const [patch, setPatch] = useState("0");
  const [file, setFile] = useState(null);
  const [releaseNotes, setReleaseNotes] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      setIsAdmin(true);
      fetchVersions();
    }
  }, [user]);

  const fetchVersions = async () => {
    const { data } = await supabase
      .from("app_versions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setVersions(data);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith(".apk")) {
      setFile(selected);
      const match = selected.name.match(/v?(\d+)\.(\d+)\.(\d+)/);
      if (match) {
        setMajor(match[1]);
        setMinor(match[2]);
        setPatch(match[3]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setUploadProgress(30);
    try {
      const versionString = `${major}.${minor}.${patch}`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("version", versionString);
      formData.append("releaseNotes", releaseNotes || `Version ${versionString} release`);
      await createGitHubRelease(formData);
      setFile(null);
      setReleaseNotes("");
      setUploadProgress(100);
      await fetchVersions();
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUpdateType = (v, prev) => {
    if (!prev) return "initial";
    if (v.major_version > prev.major_version) return "major";
    if (v.minor_version > prev.minor_version) return "minor";
    return "patch";
  };

  if (!isAdmin) return null;

  const typeColors = {
    major: "#ef4444",
    minor: "#f59e0b",
    patch: "#22c55e",
    initial: "#64748b",
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white text-left dark:border-slate-700 dark:bg-[#111a2e]">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <Package2 className="h-5 w-5 text-blue-700 dark:text-blue-400" aria-hidden />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">App Release Manager</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Upload new APK versions for OTA distribution</p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Version Number
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Major", value: major, setter: setMajor, Icon: TrendingUp },
              { label: "Minor", value: minor, setter: setMinor, Icon: Hash },
              { label: "Patch", value: patch, setter: setPatch, Icon: FileCode },
            ].map((field) => (
              <div key={field.label} className="relative">
                <field.Icon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  aria-label={field.label}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 font-mono text-sm font-bold text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Major = forced update, Minor = recommended, Patch = optional
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Release Notes
          </label>
          <textarea
            value={releaseNotes}
            onChange={(e) => setReleaseNotes(e.target.value)}
            placeholder="What's new in this version..."
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            APK File
          </label>
          <label className="block cursor-pointer">
            <input type="file" accept=".apk" onChange={handleFileSelect} className="hidden" />
            <div className="rounded-xl border-2 border-dashed border-slate-300 px-4 py-4 text-center dark:border-slate-600">
              {file ? (
                <span className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                  <CheckCircle className="h-4 w-4" aria-hidden />
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              ) : (
                <span className="block">
                  <Upload className="mx-auto h-6 w-6 text-slate-400" aria-hidden />
                  <span className="mt-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Click to select APK file
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Must be a signed release APK
                  </span>
                </span>
              )}
            </div>
          </label>
        </div>

        {uploadProgress > 0 && (
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-700 transition-all dark:bg-blue-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
              {uploadProgress === 100 ? "Upload complete!" : "Uploading..."}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Upload className="h-4 w-4" aria-hidden />
          {loading ? "Processing..." : `Release v${major}.${minor}.${patch}`}
        </button>

        {versions.length > 0 && (
          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recent Releases
            </h4>
            <ul className="space-y-2">
              {versions.map((v, i) => {
                const type = getUpdateType(v, versions[i + 1]);
                return (
                  <li
                    key={v.id}
                    className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60"
                  >
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{ background: `${typeColors[type]}20`, color: typeColors[type] }}
                    >
                      {type}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      v{v.version_string}
                    </span>
                    <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                      {new Date(v.created_at).toLocaleDateString()}
                    </span>
                    <a
                      href={v.apk_url}
                      download
                      aria-label={`Download v${v.version_string}`}
                      className="text-blue-700 dark:text-blue-400"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App download banner — same logic as supplied, plain card UI.        */
/* ------------------------------------------------------------------ */

function AppDownloadBanner({ isDark }) {
  const [version, setVersion] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchVersion = async () => {
      const { data } = await supabase
        .from("app_versions")
        .select("version_string, apk_url, release_notes")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setVersion(data);
    };
    fetchVersion();

    const dismissedAt = localStorage.getItem("apk_banner_dismissed");
    if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 24 * 60 * 60 * 1000) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("apk_banner_dismissed", Date.now().toString());
  };

  if (!version || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:w-[420px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-[#111a2e]">
        <div className="flex items-start gap-3">
          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            NEW
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              For a smoother experience, install the latest version of{" "}
              <strong>Jan Seva Kendra App</strong> —{" "}
              <span className="font-mono font-bold">v{version.version_string}</span>
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={version.apk_url}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <Download className="h-4 w-4" aria-hidden />
                Download APK
              </a>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Smartphone className="h-3.5 w-3.5" aria-hidden />
                Android only
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
