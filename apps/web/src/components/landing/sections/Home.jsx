import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, CreditCard, LayoutDashboard, ShieldCheck, Activity, Send } from 'lucide-react';

// --- Self-Contained Particle Background ---
const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
            draw() {
                ctx.fillStyle = 'rgba(28, 216, 210, 0.3)';
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
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

// --- Main Components ---
const quickLinks = [
    { Icon: Phone, label: "Call Now", href: "tel:6388964291" },
    { Icon: Mail, label: "Email", href: "mailto:shrilalyadav@gmail.com" },
    { Icon: MapPin, label: "Location", href: "#" },
    { Icon: Globe, label: "Website", href: "#" },
];

const glowVariants = {
    initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
    hover: {
        scale: 1.25, y: -4,
        filter: "drop-shadow(0 0 10px rgba(28, 216, 210, 0.95)) drop-shadow(0 0 22px rgba(0,191,143,0.85))",
        transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    tap: { scale: 0.93, y: 0, transition: { duration: 0.08 } }
};

const Badge = ({ children, delay = 0 }) => (
    <motion.span
        className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-emerald-400 backdrop-blur-sm'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4 }}
    >
        {children}
    </motion.span>
);

export default function App() {
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
        <section id='home' className='w-full min-h-screen relative bg-black overflow-hidden font-sans'>
            <ParticlesBackground />

            {/* Background glows */}
            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute -top-32 -left-32 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[520px] max-h-[520px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-25 md:opacity-15 blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse' />
                <div className='absolute bottom-0 right-0 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[520px] max-h-[520px] rounded-full bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] opacity-25 md:opacity-15 blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse delay-700' />
                <div className='absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-[#00bf8f] opacity-5 blur-[100px]' />
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
                            <Badge delay={0.1}>📍 Shambhuganj, Jaunpur</Badge>
                            <Badge delay={0.2}>🏆 10+ Years Trust</Badge>
                            <Badge delay={0.3}>✅ CSC Certified</Badge>
                            <Badge delay={0.4}>🛡️ Razorpay Verified</Badge>
                        </motion.div>

                        {/* Typewriter role */}
                        <motion.div
                            className='mb-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide min-h-[1.8em]'
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f]'>
                                {roles[index].substring(0, subIndex)}
                            </span>
                            <span
                                className='inline-block w-[2px] ml-0.5 bg-emerald-400 animate-pulse align-middle'
                                style={{ height: "1em" }}
                            />
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9 }}
                        >
                            <span className='text-gray-400 font-medium text-2xl sm:text-3xl md:text-4xl block mb-1'>Welcome to</span>
                            <span className='text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl lg:whitespace-nowrap drop-shadow-lg'>
                                Shrilal{' '}
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63]'>
                                    Yadav
                                </span>
                            </span>
                        </motion.h1>

                        {/* Bio */}
                        <motion.p
                            className='mt-5 text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed'
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Empowering rural connectivity with comprehensive <span className='text-emerald-400 font-medium'>CSC services, secure digital banking, and IRCTC ticketing.</span> Operated daily by a dedicated team bridging the gap between you and digital India.
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
                                className='group relative px-7 py-3 rounded-full font-semibold text-base text-white overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2'
                                style={{ background: "linear-gradient(135deg, #1cd8d2, #00bf8f, #302b63)" }}
                            >
                                <LayoutDashboard size={20} className='relative z-10' />
                                <span className='relative z-10'>User Dashboard</span>
                                <span className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full' />
                            </a>
                            <a
                                href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/transactions`}
                                className='group px-7 py-3 rounded-full text-base font-semibold text-black bg-white hover:bg-emerald-50 shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2'
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
                                    initial='initial'
                                    whileHover='hover'
                                    whileTap='tap'
                                    className='text-gray-400 hover:text-emerald-400 p-2 transition-colors duration-200'
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(28,216,210,0.08)_0%,transparent_60%)] pointer-events-none" />

                    <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">

                        {/* Orbital Ring 1 - Outer */}
                        <motion.div 
                            animate={{ rotateZ: 360 }} 
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
                            className="absolute w-[90%] h-[90%] border border-cyan-500/20 rounded-full border-t-cyan-400/80 border-l-cyan-400/30 shadow-[0_0_30px_rgba(28,216,210,0.15)]" 
                        />
                        
                        {/* Orbital Ring 2 - Middle (Counter-rotating) */}
                        <motion.div 
                            animate={{ rotateZ: -360 }} 
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                            className="absolute w-[65%] h-[65%] border-2 border-emerald-500/10 rounded-full border-b-emerald-400/60 border-r-emerald-400/30" 
                        />

                        {/* Simulated 3D Core Rings */}
                        <motion.div 
                            animate={{ rotateX: 360, rotateY: 180 }} 
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
                            className="absolute w-[45%] h-[45%] border border-cyan-300/40 rounded-full shadow-[inset_0_0_20px_rgba(0,191,143,0.3)]" 
                        />
                        <motion.div 
                            animate={{ rotateX: -360, rotateY: -180 }} 
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                            className="absolute w-[35%] h-[35%] border border-emerald-300/40 rounded-full" 
                        />

                        {/* Central Glowing Polygon Core */}
                        <div className="absolute w-28 h-28 bg-gradient-to-br from-[#1cd8d2]/20 to-[#302b63]/40 border border-emerald-400/50 rotate-45 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(0,191,143,0.3)]">
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} 
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
                                className="w-16 h-16 bg-cyan-400 rounded-full blur-[25px]" 
                            />
                            <Activity size={40} className="absolute text-cyan-200 -rotate-45 drop-shadow-[0_0_10px_rgba(28,216,210,1)]" />
                        </div>

                        {/* Floating UI Panel 1: Smart Banking (Top Left) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50, y: -20 }} 
                            animate={{ opacity: 1, x: 0, y: 0 }} 
                            transition={{ delay: 0.6, duration: 0.8 }} 
                            className="absolute top-[12%] left-[2%] w-52 p-3.5 bg-black/50 backdrop-blur-md border border-emerald-500/30 rounded-xl overflow-hidden group shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                <CreditCard size={14} /> 
                                <span className="text-[11px] font-bold tracking-widest uppercase">Smart Banking</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full mb-2 overflow-hidden">
                                <motion.div className="h-full bg-emerald-400" animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                            </div>
                            <div className="font-mono text-[10px] text-cyan-200/80">TXN SECURE: AES-256</div>
                        </motion.div>

                        {/* Floating UI Panel 2: CSC Portal Node (Right Side) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: 0.9, duration: 0.8 }} 
                            className="absolute top-[40%] -right-[5%] w-60 p-4 bg-black/50 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-lg border-r-cyan-400 border-r-2"
                        >
                            <div className="flex items-center justify-between text-cyan-400 mb-3">
                                <span className="text-[11px] font-bold tracking-widest">CSC PORTAL NODE</span>
                                <Globe size={14} className="animate-pulse" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-[9px] text-gray-400 tracking-wider">UPTIME</div>
                                    <div className="font-mono text-sm text-emerald-300">99.98%</div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="text-[9px] text-gray-400 tracking-wider">LATENCY</div>
                                    <div className="font-mono text-sm text-cyan-300">12ms</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating UI Panel 3: Security / Network (Bottom Left) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 1.2, duration: 0.8 }} 
                            className="absolute bottom-[15%] left-[8%] w-64 p-3 bg-black/40 backdrop-blur-md border border-[#302b63] rounded-xl flex items-center gap-3 border-l-emerald-400 border-l-2 shadow-lg"
                        >
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-300 tracking-wider uppercase">Network Integrity</div>
                                <div className="text-xs font-mono text-cyan-400 mt-0.5">SYNCED & ENCRYPTED</div>
                            </div>
                        </motion.div>

                        {/* SVG Connecting Lines to tie it together */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-[-1]">
                            {/* Note: Coordinates are approximations for a 550x550 box to draw lines behind panels */}
                            <path d="M 275 275 L 120 120" stroke="#1cd8d2" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                            <path d="M 275 275 L 450 275" stroke="#00bf8f" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                            <path d="M 275 275 L 180 430" stroke="#302b63" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                        </svg>

                    </div>
                </div>
            </div>
        </section>
    );
}