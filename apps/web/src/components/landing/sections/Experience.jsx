"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useMemo, useRef, useState, useEffect } from 'react';

const experiences = [
    {
        type: "experience",
        role: "Block Operator & CSC Owner",
        company: "Shambhuganj CSC Center",
        duration: "2014 – Present",
        cgpa: "10+ Years",
        description: "Managing official block operations at Shambhuganj daily, while successfully running a dedicated CSC center in Shambhuganj from 9 AM to 9 PM with the help of 2 trusted employees.",
        icon: "🏛️",
        accentColor: "#1cd8d2",
        tags: ["Block Operations", "CSC Center", "Public Service", "Team Management"],
    },
    {
        type: "certification",
        role: "Authorized Banking Partner",
        company: "Digital Financial Services",
        duration: "Ongoing",
        cgpa: "Verified VLE",
        description: "Officially tied up with Fino Payment Bank, Airtel Payments Bank, and India Post Payment Bank (IPPB). Facilitating secure account openings, UPI transfers, and Aadhar-based cash withdrawals.",
        icon: "🏦",
        accentColor: "#f59e0b",
        tags: ["Fino Bank", "Airtel Bank", "IPPB", "AePS"],
    },
    {
        type: "infrastructure",
        role: "Digital Payment & Platform Admin",
        company: "Internal Systems",
        duration: "Platform Rollout",
        cgpa: "Razorpay Verified",
        description: "Managing a custom platform to streamline automated cash transactions using OCR technology. Includes comprehensive admin analytics, post creation, and real-time user request tracking.",
        icon: "💻",
        accentColor: "#1cd8d2",
        tags: ["OCR", "Razorpay", "Admin Dashboards", "Analytics"],
    },
    {
        type: "service",
        role: "E-Ticketing & Govt. Services",
        company: "IRCTC & e-District",
        duration: "Daily Operations",
        cgpa: "Authorized Agent",
        description: "Providing comprehensive e-governance services, government document processing, and utilizing an exclusive platform for authorized IRCTC e-rail ticket bookings for local residents.",
        icon: "🚆",
        accentColor: "#00bf8f",
        tags: ["IRCTC", "e-District", "Ticketing", "E-Governance"],
    },
];

const typeLabels = {
    experience: "Experience",
    certification: "Partnership",
    infrastructure: "Infrastructure",
    service: "Service",
};

// ─── ExperienceItem ───────────────────────────────────────────────────────────
function ExperienceItem({ exp, idx, start, end, scrollYProgress, layout }) {
    const scale = useTransform(scrollYProgress, [start, end], [0, 1]);
    const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
    // Even cards animate from above, odd from below — matches the visual direction
    const y = useTransform(scrollYProgress, [start, end], [idx % 2 === 0 ? 30 : -30, 0]);
    const x = useTransform(scrollYProgress, [start, end], [-24, 0]);

    const accent = exp.accentColor;

    if (layout === 'desktop') {
        return (
            <div className='relative flex flex-1 justify-center items-center min-w-0'>

                {/* Dot */}
                <motion.div
                    className="z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{
                        scale,
                        opacity,
                        backgroundColor: accent + '22',
                        border: `2px solid ${accent}`,
                        boxShadow: `0 0 0 6px ${accent}18, 0 0 16px ${accent}44`,
                    }}
                >
                    {exp.icon}
                </motion.div>

                {/* Connector stub */}
                <motion.div
                    className={`absolute ${idx % 2 === 0 ? '-top-10' : '-bottom-10'} w-[2px]`}
                    style={{ height: 40, opacity, backgroundColor: accent + '55' }}
                />

                {/* Card */}
                <motion.article
                    className={`absolute ${idx % 2 === 0 ? 'bottom-14' : 'top-14'}
                        rounded-2xl p-3 backdrop-blur-md`}
                    style={{
                        opacity,
                        y,
                        width: '280px',
                        background: `linear-gradient(135deg, ${accent}10, #0a0f1ecc)`,
                        border: `1px solid ${accent}30`,
                        boxShadow: `0 8px 32px ${accent}1a`,
                    }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                    <span
                        className="inline-block mb-2 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: accent + '18', color: accent }}
                    >
                        {typeLabels[exp.type]}
                    </span>

                    <h3 className="text-sm font-bold text-white leading-snug mb-0.5 break-words">
                        {exp.role}
                    </h3>
                    <p className="text-xs font-semibold mb-1" style={{ color: accent }}>
                        {exp.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 mb-2">
                        <span className="text-[11px] text-gray-500">{exp.duration}</span>
                        {exp.cgpa && (
                            <span className="text-[11px] font-semibold" style={{ color: accent }}>
                                · {exp.cgpa}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-400 text-[11px] leading-relaxed mb-3 break-words">
                        {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {exp.tags.map(t => (
                            <span
                                key={t}
                                className="text-[9px] px-1.5 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: accent + '15',
                                    color: accent,
                                    border: `1px solid ${accent}28`,
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.article>
            </div>
        );
    }

    // ── Mobile ────────────────────────────────────────────────────────────────
    return (
        <div className='relative flex items-center'>
            <motion.div
                className="absolute -left-[14px] top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{
                    scale,
                    opacity,
                    backgroundColor: accent + '22',
                    border: `2px solid ${accent}`,
                    boxShadow: `0 0 0 6px ${accent}18`,
                }}
            >
                {exp.icon}
            </motion.div>

            <motion.article
                className="rounded-2xl p-5 ml-12 shadow-lg w-[90vw] max-w-sm backdrop-blur-md"
                style={{
                    opacity,
                    x,
                    background: `linear-gradient(135deg, ${accent}10, #0a0f1ecc)`,
                    border: `1px solid ${accent}28`,
                }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
                <span
                    className="inline-block mb-1.5 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: accent + '18', color: accent }}
                >
                    {typeLabels[exp.type]}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug mb-0.5 break-words">
                    {exp.role}
                </h3>
                <p className="text-xs font-semibold mb-1 break-words" style={{ color: accent }}>
                    {exp.company}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 mb-2">
                    <span className="text-xs text-gray-500">{exp.duration}</span>
                    {exp.cgpa && (
                        <span className="text-xs font-semibold" style={{ color: accent }}>
                            · {exp.cgpa}
                        </span>
                    )}
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-2 break-words">
                    {exp.description}
                </p>
                <div className="flex flex-wrap gap-1">
                    {exp.tags.map(t => (
                        <span
                            key={t}
                            className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{
                                backgroundColor: accent + '15',
                                color: accent,
                                border: `1px solid ${accent}28`,
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </motion.article>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const Experience = () => {
    const sceneRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const SCENE_HEIGHT_VH = isMobile ? 160 * experiences.length : 130 * experiences.length;

    const { scrollYProgress } = useScroll({
        target: sceneRef,
        offset: ['start start', 'end end'],
    });

    const thresholds = useMemo(
        () => experiences.map((_, i) => (i + 1) / experiences.length),
        []
    );

    const lineSize = useTransform(scrollYProgress, v => `${v * 100}%`);
    const headerOpacity = useTransform(scrollYProgress, [0.35, 0.55], [1, 0]);

    return (
        <section id="experience" className='relative bg-black text-white'>
            {/* Ambient glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1cd8d2] opacity-[0.04] blur-[140px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#00bf8f] opacity-[0.04] blur-[140px]" />
            </div>

            {/* Scroll scene */}
            <div
                ref={sceneRef}
                style={{ height: `${SCENE_HEIGHT_VH}vh`, minHeight: '130vh' }}
                className='relative'
            >
                <div className='sticky top-0 h-screen flex flex-col'>

                    {/* Header */}
                    <motion.div
                        className="shrink-0 pt-1 pb-1 text-center"
                        style={{ opacity: headerOpacity }}
                    >
                        <span className="inline-block mb-1 text-xs font-bold tracking-widest uppercase text-emerald-400">
                            Career & Operations
                        </span>
                        <h2 className='text-4xl sm:text-5xl font-extrabold text-white mb-30'>
                            Professional{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#1cd8d2]'>
                                Journey
                            </span>
                        </h2>
                        {/* <p className="mt-1 text-sm text-gray-500">Operations · Banking Partners · Digital Services</p> */}
                    </motion.div>

                    {/* Content area */}
                    <div className='flex-1 flex justify-center items-center px-6 pb-25'>

                        {/* ── Desktop ── */}
                        {!isMobile && (
                            <div className='relative w-full max-w-6xl'>

                                {/* Progress track */}
                                <div className='relative h-[4px] bg-white/10 rounded-full'>
                                    <motion.div
                                        className='absolute left-0 top-0 h-[4px] rounded-full origin-left'
                                        style={{
                                            width: lineSize,
                                            background: 'linear-gradient(90deg, #1cd8d2, #00bf8f, #f59e0b)',
                                            boxShadow: '0 0 12px #1cd8d255',
                                        }}
                                    />
                                </div>

                                <div className='relative flex justify-between mt-0'>
                                    {experiences.map((exp, idx) => (
                                        <ExperienceItem
                                            key={idx}
                                            exp={exp}
                                            idx={idx}
                                            start={idx === 0 ? 0 : thresholds[idx - 1]}
                                            end={thresholds[idx]}
                                            scrollYProgress={scrollYProgress}
                                            layout="desktop"
                                        />
                                    ))}
                                </div>

                                {/* Year labels */}
                                <div className='flex justify-between mt-3'>
                                    {experiences.map((exp, idx) => (
                                        <div key={idx} className="flex flex-1 justify-center">
                                            <span className="text-[10px] text-gray-600">
                                                {exp.duration.split(' ')[0]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Mobile ── */}
                        {isMobile && (
                            <div className='relative w-full max-w-md'>
                                {/* Vertical track */}
                                <div className='absolute left-0 top-0 bottom-0 w-[4px] bg-white/10 rounded-full'>
                                    <motion.div
                                        className='absolute left-0 top-0 w-[4px] rounded-full origin-top'
                                        style={{
                                            height: lineSize,
                                            background: 'linear-gradient(180deg, #1cd8d2, #00bf8f, #f59e0b)',
                                            boxShadow: '0 0 10px #1cd8d255',
                                        }}
                                    />
                                </div>

                                <div className='relative flex flex-col gap-10 mt-6 pb-28'>
                                    {experiences.map((exp, idx) => (
                                        <ExperienceItem
                                            key={idx}
                                            exp={exp}
                                            idx={idx}
                                            start={idx === 0 ? 0 : thresholds[idx - 1]}
                                            end={thresholds[idx]}
                                            scrollYProgress={scrollYProgress}
                                            layout="mobile"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;