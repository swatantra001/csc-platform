
"use client";
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, CreditCard, LayoutDashboard, ShieldCheck, Activity, Send } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════════
// THEME TOKENS (matches your reference exactly)
// ════════════════════════════════════════════════════════════════════════════════
const THEME = {
    light: {
        pageBg: '#f1f5f9',
        textPrimary: '#1e293b',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
        accent: '#2563eb',
        accent2: '#1d4ed8',
        accentLight: '#eff6ff',
        accentBorder: '#bfdbfe',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        cardShadow: '0 1px 4px rgba(0,0,0,0.07)',
        glow1: 'rgba(37,99,235,0.10)',
        glow2: 'rgba(29,78,216,0.06)',
        glow3: 'rgba(59,130,246,0.04)',
        particle: 'rgba(37,99,235,0.25)',
        badgeBg: '#eff6ff',
        badgeBorder: '#bfdbfe',
        badgeText: '#1d4ed8',
        nameGrad: 'linear-gradient(135deg, #1d4ed8, #2563eb, #1e3a8a)',
        typewriterGrad: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        btnPrimary: 'linear-gradient(135deg, #2563eb, #1d4ed8, #1e3a8a)',
        btnSecondaryBg: '#ffffff',
        btnSecondaryText: '#1e293b',
        btnSecondaryBorder: '#e2e8f0',
        btnSecondaryHover: '#eff6ff',
        socialColor: '#94a3b8',
        socialHover: '#2563eb',
        hologramRing: 'rgba(37,99,235,0.15)',
        hologramRingStrong: 'rgba(37,99,235,0.60)',
        hologramCore: 'rgba(37,99,235,0.20)',
        panelBg: 'rgba(255,255,255,0.70)',
        panelBorder: 'rgba(37,99,235,0.20)',
        panelText: '#2563eb',
        panelText2: '#1d4ed8',
        panelAccent: '#3b82f6',
        lineColor: '#93c5fd',
    },
    dark: {
        pageBg: '#060b14',
        textPrimary: '#f1f5f9',
        textSecondary: 'rgba(255,255,255,0.55)',
        textMuted: 'rgba(255,255,255,0.28)',
        accent: '#f59e0b',
        accent2: '#d97706',
        accentLight: 'rgba(245,158,11,0.08)',
        accentBorder: 'rgba(245,158,11,0.25)',
        cardBg: 'rgba(255,255,255,0.03)',
        cardBorder: 'rgba(255,255,255,0.08)',
        cardShadow: '0 1px 4px rgba(0,0,0,0.3)',
        glow1: 'rgba(245,158,11,0.08)',
        glow2: 'rgba(217,119,6,0.05)',
        glow3: 'rgba(180,83,9,0.03)',
        particle: 'rgba(245,158,11,0.20)',
        badgeBg: 'rgba(245,158,11,0.10)',
        badgeBorder: 'rgba(245,158,11,0.20)',
        badgeText: '#f59e0b',
        nameGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
        typewriterGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        btnPrimary: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
        btnSecondaryBg: 'rgba(255,255,255,0.05)',
        btnSecondaryText: '#f1f5f9',
        btnSecondaryBorder: 'rgba(255,255,255,0.10)',
        btnSecondaryHover: 'rgba(245,158,11,0.10)',
        socialColor: 'rgba(255,255,255,0.35)',
        socialHover: '#f59e0b',
        hologramRing: 'rgba(245,158,11,0.12)',
        hologramRingStrong: 'rgba(245,158,11,0.50)',
        hologramCore: 'rgba(245,158,11,0.15)',
        panelBg: 'rgba(6,11,20,0.60)',
        panelBorder: 'rgba(245,158,11,0.20)',
        panelText: '#f59e0b',
        panelText2: '#fbbf24',
        panelAccent: '#fbbf24',
        lineColor: 'rgba(245,158,11,0.30)',
    },
};

// ════════════════════════════════════════════════════════════════════════════════
// Self-Contained Particle Background (Theme-Aware)
// ════════════════════════════════════════════════════════════════════════════════
const ParticlesBackground = ({ isDark = false }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const particleColor = isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(37, 99, 235, 0.20)';

        class Particle {
            x; y; vx; vy; size;
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
            draw() {
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = Array.from({ length: 50 }, () => new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

// ════════════════════════════════════════════════════════════════════════════════
// DATA & VARIANTS
// ════════════════════════════════════════════════════════════════════════════════
const quickLinks = [
    { Icon: Phone, label: "Call Now", href: "tel:9005623112" },
    { Icon: Mail, label: "Email", href: "mailto:sahaj9005623112@gmail.com" },
    { Icon: MapPin, label: "Location", href: "#" },
    { Icon: Globe, label: "Website", href: "#" },
];

const glowVariants = {
    initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
    hover: (isDark) => ({
        scale: 1.25, y: -4,
        filter: isDark
            ? "drop-shadow(0 0 10px rgba(245,158,11,0.9)) drop-shadow(0 0 22px rgba(217,119,6,0.8))"
            : "drop-shadow(0 0 10px rgba(37,99,235,0.9)) drop-shadow(0 0 22px rgba(29,78,216,0.8))",
        transition: { type: "spring", stiffness: 300, damping: 15 }
    }),
    tap: { scale: 0.93, y: 0, transition: { duration: 0.08 } }
};

const Badge = ({ children, delay = 0, isDark = false }) => {
    const T = isDark ? THEME.dark : THEME.light;
    return (
        <motion.span
            className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm'
            style={{ background: T.badgeBg, border: `1px solid ${T.badgeBorder}`, color: T.badgeText }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
        >
            {children}
        </motion.span>
    );
};

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function Home({ isDark = false }) {
    const T = isDark ? THEME.dark : THEME.light;

    const roles = useMemo(() => [
        "Certified CSC Operator",
        "Fino & Airtel Bank Merchant",
        "IRCTC Authorized Agent",
        "Digital Services Expert",
    ], []);

    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = roles[index];
        const timeout = setTimeout(() => {
            if (!deleting && subIndex < current.length) setSubIndex(v => v + 1);
            else if (!deleting && subIndex === current.length) setTimeout(() => setDeleting(true), 1400);
            else if (deleting && subIndex > 0) setSubIndex(v => v - 1);
            else if (deleting && subIndex === 0) {
                setDeleting(false);
                setIndex(p => (p + 1) % roles.length);
                setSubIndex(0);
            }
        }, deleting ? 35 : 55);
        return () => clearTimeout(timeout);
    }, [index, subIndex, deleting, roles]);

    return (
        <section id='home' className='w-full min-h-screen relative overflow-hidden' style={{ background: T.pageBg, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.4s' }}>
            <ParticlesBackground isDark={isDark} />

            {/* Background glows */}
            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute -top-32 -left-32 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[520px] max-h-[520px] rounded-full opacity-20 md:opacity-12 blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse'
                    style={{ background: `linear-gradient(135deg, ${T.accent2}, ${T.accent}, ${T.accent2})` }} />
                <div className='absolute bottom-0 right-0 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[520px] max-h-[520px] rounded-full opacity-20 md:opacity-12 blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse delay-700'
                    style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accent2}, ${T.accent})` }} />
                <div className='absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full blur-[100px]'
                    style={{ background: T.accent, opacity: 0.04 }} />
            </div>

            <div className='relative z-10 h-full min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 pb-12 lg:pb-0'>

                {/* LEFT: Text content */}
                <div className='flex flex-col justify-center h-full pt-20 lg:pt-0 text-center lg:text-left'>
                    <div className='w-full lg:pr-16 mx-auto max-w-3xl'>

                        {/* Badges row */}
                        <motion.div
                            className='flex flex-wrap gap-2 justify-center lg:justify-start mb-5 mt-15'
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge delay={0.1} isDark={isDark}>📍 Shambhuganj, Jaunpur</Badge>
                            <Badge delay={0.2} isDark={isDark}>🏆 10+ Years Trust</Badge>
                            <Badge delay={0.3} isDark={isDark}>✅ CSC Certified</Badge>
                            <Badge delay={0.4} isDark={isDark}>🛡️ Razorpay Verified</Badge>
                        </motion.div>

                        {/* Typewriter role */}
                        <motion.div
                            className='mb-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide min-h-[1.8em]'
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <style dangerouslySetInnerHTML={{
                                    __html: `
                                            .gradient-text {
                                                display: inline-block;
                                                background: ${T.nameGrad};
                                                -webkit-background-clip: text;
                                                background-clip: text;
                                                -webkit-text-fill-color: transparent;
                                                text-fill-color: transparent;
                                                color: transparent;
                                        }
                                        `
                                }}
                                />
                            <span className='gradient-text'>
                                {roles[index].substring(0, subIndex)}
                            </span>
                            <span
                                className='inline-block w-[2px] ml-0.5 animate-pulse align-middle'
                                style={{ height: "1em", background: T.accent }}
                            />
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9 }}
                        >
                            <span className='font-medium text-2xl sm:text-3xl md:text-4xl block mb-1' style={{ color: T.textMuted }}>Welcome to</span>
                            <span className='font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl lg:whitespace-nowrap' style={{
                                color: T.textPrimary,
                                textShadow: isDark ? '0 2px 32px rgba(245,158,11,0.12)' : '0 2px 32px rgba(37,99,235,0.10)',
                                fontFamily: "'DM Serif Display', serif",
                            }}>
                                Srilal{' '}
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                            .gradient-text {
                                                display: inline-block;
                                                background: ${T.nameGrad};
                                                -webkit-background-clip: text;
                                                background-clip: text;
                                                -webkit-text-fill-color: transparent;
                                                text-fill-color: transparent;
                                                color: transparent;
                                        }
                                        `
                                }}
                                />

                                <span className="gradient-text">Yadav</span>
                            </span>
                        </motion.h1>

                        {/* Bio */}
                        <motion.p
                            className='mt-5 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed'
                            style={{ color: T.textSecondary }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Empowering rural connectivity with comprehensive <span style={{ color: T.accent, fontWeight: 600 }}>CSC services, secure digital banking, and IRCTC ticketing.</span> Operated daily by a dedicated team bridging the gap between you and digital India.
                        </motion.p>

                        {/* Primary Portal Actions */}
                        <motion.div
                            className='mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.55 }}
                        >
                            <a
                                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                                className='group relative px-7 py-3 rounded-full font-semibold text-base overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2'
                                style={{ background: T.btnPrimary, color: isDark ? '#000' : '#fff' }}
                            >
                                <LayoutDashboard size={20} className='relative z-10' />
                                <span className='relative z-10'>User Dashboard</span>
                                <span className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full' />
                            </a>
                            <a
                                href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/transactions`}
                                className='group px-7 py-3 rounded-full text-base font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2'
                                style={{
                                    background: T.btnSecondaryBg,
                                    color: T.btnSecondaryText,
                                    border: `1px solid ${T.btnSecondaryBorder}`,
                                }}
                                onMouseEnter={e => (e.currentTarget).style.background = T.btnSecondaryHover}
                                onMouseLeave={e => (e.currentTarget).style.background = T.btnSecondaryBg}
                            >
                                <ShieldCheck size={20} />
                                <span>OCR Transaction</span>
                            </a>
                        </motion.div>

                        {/* Socials / Contact Icons */}
                        <motion.div
                            className='mt-8 flex gap-3 text-2xl md:text-3xl justify-center lg:justify-start'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.85 }}
                        >
                            {quickLinks.map(({ Icon, label, href }) => (
                                <motion.a
                                    href={href}
                                    key={label}
                                    aria-label={label}
                                    variants={glowVariants}
                                    custom={isDark}
                                    initial='initial'
                                    whileHover='hover'
                                    whileTap='tap'
                                    className='p-2 transition-colors duration-200'
                                    style={{ color: T.socialColor }}
                                    onMouseEnter={e => (e.currentTarget).style.color = T.socialHover}
                                    onMouseLeave={e => (e.currentTarget).style.color = T.socialColor}
                                >
                                    <Icon />
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT: Complex Holographic Futuristic UI */}
                <div className='relative hidden lg:flex items-center justify-center w-full h-full min-h-[600px]'>

                    {/* Deep background glow for the hologram */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: `radial-gradient(circle_at_center, ${T.hologramCore} 0%, transparent 60%)`
                    }} />

                    <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">

                        {/* Orbital Ring 1 - Outer */}
                        <motion.div
                            animate={{ rotateZ: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[90%] h-[90%] border rounded-full"
                            style={{
                                borderColor: T.hologramRing,
                                borderTopColor: T.hologramRingStrong,
                                borderLeftColor: isDark ? 'rgba(245,158,11,0.25)' : 'rgba(37,99,235,0.20)',
                                boxShadow: `0 0 30px ${T.hologramRing}`,
                            }}
                        />

                        {/* Orbital Ring 2 - Middle (Counter-rotating) */}
                        <motion.div
                            animate={{ rotateZ: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[65%] h-[65%] border-2 rounded-full"
                            style={{
                                borderColor: isDark ? 'rgba(245,158,11,0.08)' : 'rgba(37,99,235,0.08)',
                                borderBottomColor: isDark ? 'rgba(245,158,11,0.40)' : 'rgba(37,99,235,0.35)',
                                borderRightColor: isDark ? 'rgba(245,158,11,0.20)' : 'rgba(37,99,235,0.18)',
                            }}
                        />

                        {/* Simulated 3D Core Rings */}
                        <motion.div
                            animate={{ rotateX: 360, rotateY: 180 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[45%] h-[45%] border rounded-full"
                            style={{
                                borderColor: isDark ? 'rgba(245,158,11,0.30)' : 'rgba(37,99,235,0.25)',
                                boxShadow: `inset 0 0 20px ${isDark ? 'rgba(245,158,11,0.15)' : 'rgba(37,99,235,0.12)'}`,
                            }}
                        />
                        <motion.div
                            animate={{ rotateX: -360, rotateY: -180 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[35%] h-[35%] border rounded-full"
                            style={{ borderColor: isDark ? 'rgba(245,158,11,0.25)' : 'rgba(37,99,235,0.20)' }}
                        />

                        {/* Central Glowing Polygon Core */}
                        <div className="absolute w-28 h-28 border rotate-45 backdrop-blur-md flex items-center justify-center"
                            style={{
                                background: isDark
                                    ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(6,11,20,0.5))'
                                    : 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(255,255,255,0.4))',
                                borderColor: isDark ? 'rgba(245,158,11,0.40)' : 'rgba(37,99,235,0.30)',
                                boxShadow: `0 0 50px ${isDark ? 'rgba(245,158,11,0.20)' : 'rgba(37,99,235,0.15)'}`,
                            }}>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 rounded-full blur-[25px]"
                                style={{ background: T.accent }}
                            />
                            <Activity size={40} className="absolute -rotate-45" style={{
                                color: isDark ? '#fbbf24' : '#93c5fd',
                                filter: `drop-shadow(0 0 10px ${isDark ? 'rgba(245,158,11,0.8)' : 'rgba(37,99,235,0.6)'})`,
                            }} />
                        </div>

                        {/* Floating UI Panel 1: Smart Banking (Top Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, y: -20 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="absolute top-[12%] left-[2%] w-52 p-3.5 backdrop-blur-md rounded-xl overflow-hidden group shadow-lg"
                            style={{ background: T.panelBg, border: `1px solid ${T.panelBorder}` }}
                        >
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                                style={{ background: `linear-gradient(90deg, ${T.accentLight}, transparent)` }} />
                            <div className="flex items-center gap-2 mb-2" style={{ color: T.panelText }}>
                                <CreditCard size={14} />
                                <span className="text-[11px] font-bold tracking-widest uppercase">Smart Banking</span>
                            </div>
                            <div className="w-full h-1 rounded-full mb-2 overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}>
                                <motion.div className="h-full" style={{ background: T.accent }} animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                            </div>
                            <div className="font-mono text-[10px]" style={{ color: T.panelText2 }}>TXN SECURE: AES-256</div>
                        </motion.div>

                        {/* Floating UI Panel 2: CSC Portal Node (Right Side) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="absolute top-[40%] -right-[5%] w-60 p-4 backdrop-blur-md rounded-xl shadow-lg"
                            style={{ background: T.panelBg, border: `1px solid ${T.panelBorder}`, borderRight: `2px solid ${T.accent}` }}
                        >
                            <div className="flex items-center justify-between mb-3" style={{ color: T.panelText }}>
                                <span className="text-[11px] font-bold tracking-widest">CSC PORTAL NODE</span>
                                <Globe size={14} className="animate-pulse" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-[9px] tracking-wider" style={{ color: T.textMuted }}>UPTIME</div>
                                    <div className="font-mono text-sm" style={{ color: T.panelAccent }}>99.98%</div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="text-[9px] tracking-wider" style={{ color: T.textMuted }}>LATENCY</div>
                                    <div className="font-mono text-sm" style={{ color: T.panelText2 }}>12ms</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating UI Panel 3: Security / Network (Bottom Left) */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="absolute bottom-[15%] left-[8%] w-64 p-3 backdrop-blur-md rounded-xl flex items-center gap-3 shadow-lg"
                            style={{
                                background: T.panelBg,
                                border: `1px solid ${T.panelBorder}`,
                                borderLeft: `2px solid ${T.accent}`,
                            }}
                        >
                            <div className="p-2 rounded-lg" style={{
                                background: isDark ? 'rgba(245,158,11,0.10)' : 'rgba(37,99,235,0.08)',
                                color: T.panelText,
                                border: `1px solid ${isDark ? 'rgba(245,158,11,0.15)' : 'rgba(37,99,235,0.12)'}`,
                            }}>
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold tracking-wider uppercase" style={{ color: T.textSecondary }}>Network Integrity</div>
                                <div className="text-xs font-mono mt-0.5" style={{ color: T.panelText2 }}>SYNCED & ENCRYPTED</div>
                            </div>
                        </motion.div>

                        {/* SVG Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-[-1]">
                            <path d="M 275 275 L 120 120" stroke={T.lineColor} strokeWidth="1" strokeDasharray="4 4" fill="none" />
                            <path d="M 275 275 L 450 275" stroke={T.lineColor} strokeWidth="1" strokeDasharray="4 4" fill="none" />
                            <path d="M 275 275 L 180 430" stroke={T.lineColor} strokeWidth="1" strokeDasharray="4 4" fill="none" />
                        </svg>

                    </div>
                </div>
            </div>
        </section>
    );
}