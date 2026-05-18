
"use client";
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import React, { useMemo, useRef, useState, useEffect } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// THEME TOKENS
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
    trackBg: '#e2e8f0',
    trackGrad: 'linear-gradient(90deg, #2563eb, #1d4ed8, #3b82f6)',
    glow: 'rgba(37,99,235,0.08)',
    tagBg: 'rgba(37,99,235,0.08)',
    tagBorder: 'rgba(37,99,235,0.18)',
    dotGlow: 'rgba(37,99,235,0.20)',
    nameGrad: 'linear-gradient(135deg, #1d4ed8, #2563eb, #1e3a8a)',
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
    trackBg: 'rgba(255,255,255,0.08)',
    trackGrad: 'linear-gradient(90deg, #f59e0b, #d97706, #fbbf24)',
    glow: 'rgba(245,158,11,0.06)',
    tagBg: 'rgba(245,158,11,0.10)',
    tagBorder: 'rgba(245,158,11,0.20)',
    dotGlow: 'rgba(245,158,11,0.25)',
    nameGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════════════════════
const experiences = [
  {
    type: "experience",
    role: "Block Operator & CSC Owner",
    company: "Shambhuganj CSC Center",
    duration: "2014 – Present",
    cgpa: "10+ Years",
    description: "Managing official block operations at Shambhuganj daily, while successfully running a dedicated CSC center in Shambhuganj from 9 AM to 9 PM with the help of 2 trusted employees.",
    icon: "🏛️",
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
    tags: ["IRCTC", "e-District", "Ticketing", "E-Governance"],
  },
];

const typeLabels = {
  experience: "Experience",
  certification: "Partnership",
  infrastructure: "Infrastructure",
  service: "Service",
};

// ════════════════════════════════════════════════════════════════════════════════
// SINGLE CARD COMPONENT — uses useInView for scroll-triggered reveal
// ════════════════════════════════════════════════════════════════════════════════
function ExperienceCard({ exp, idx, isDark, isLast }) {
  const T = isDark ? THEME.dark : THEME.light;
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false, 
    margin: "-100px 0px -100px 0px" // triggers when element is 100px into viewport
  });

  const isEven = idx % 2 === 0;

  return (
    <div 
      ref={ref}
      className={`relative flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'} w-full max-w-5xl mx-auto`}
      style={{ minHeight: '280px' }}
    >
      {/* Left/Right content area */}
      <motion.div 
        className="flex-1 flex"
        initial={{ opacity: 0, x: isEven ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -60 : 60 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div 
          className={`w-full max-w-md ${isEven ? 'mr-auto' : 'ml-auto'}`}
        >
          {/* Card */}
          <div
            className="rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group"
            style={{
              background: isDark
                ? `linear-gradient(135deg, ${T.accentLight}, rgba(6,11,20,0.9))`
                : `linear-gradient(135deg, ${T.accentLight}, rgba(255,255,255,0.98))`,
              border: `1px solid ${T.accentBorder}`,
              boxShadow: `0 8px 32px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(37,99,235,0.08)'}`,
            }}
          >
            {/* Shine effect on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(105deg, transparent 40%, ${T.accent}08 50%, transparent 60%)`,
                transform: 'translateX(-100%)',
              }}
            />
            
            <span
              className="inline-block mb-2 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ backgroundColor: T.tagBg, color: T.accent, border: `1px solid ${T.tagBorder}` }}
            >
              {typeLabels[exp.type]}
            </span>

            <h3 className="text-base font-bold leading-snug mb-1 break-words" style={{ color: T.textPrimary, fontFamily: "'DM Serif Display', serif" }}>
              {exp.role}
            </h3>
            <p className="text-sm font-semibold mb-2" style={{ color: T.accent }}>
              {exp.company}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 mb-3">
              <span className="text-[11px] font-medium" style={{ color: T.textMuted }}>{exp.duration}</span>
              {exp.cgpa && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ 
                  background: T.tagBg, 
                  color: T.accent,
                  border: `1px solid ${T.tagBorder}`
                }}>
                  {exp.cgpa}
                </span>
              )}
            </div>
            <p className="text-[12px] leading-relaxed mb-4 break-words" style={{ color: T.textSecondary }}>
              {exp.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {exp.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: T.tagBg,
                    color: T.accent,
                    border: `1px solid ${T.tagBorder}`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Center timeline dot */}
      <div className="relative flex flex-col items-center self-stretch" style={{ width: 40, flexShrink: 0 }}>
        {/* Top line */}
        {idx > 0 && (
          <motion.div 
            className="w-[2px] flex-1 origin-top"
            style={{ background: T.trackBg }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        )}
        {idx === 0 && <div className="flex-1" />}
        
        {/* Dot */}
        <motion.div
          className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{
            backgroundColor: T.accentLight,
            border: `2.5px solid ${T.accent}`,
            boxShadow: `0 0 0 8px ${T.dotGlow}, 0 0 24px ${T.dotGlow}`,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 15 }}
        >
          {exp.icon}
        </motion.div>

        {/* Bottom line */}
        {!isLast && (
          <motion.div 
            className="w-[2px] flex-1 origin-top"
            style={{ background: T.trackBg }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        )}
        {isLast && <div className="flex-1" />}
      </div>

      {/* Empty side for balance */}
      <div className="flex-1 hidden lg:block" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// PROGRESS BAR — shows overall scroll progress through the section
// ════════════════════════════════════════════════════════════════════════════════
function ScrollProgress({ isDark }) {
  const T = isDark ? THEME.dark : THEME.light;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const scaleX = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="fixed top-0 left-0 right-0 z-40 h-1" style={{ opacity: 0 }}>
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          opacity,
          background: T.trackGrad,
          boxShadow: `0 0 10px ${T.dotGlow}`,
        }}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════════
export default function Experience({ isDark = false }) {
  const T = isDark ? THEME.dark : THEME.light;
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-50px" });

  return (
    <section 
      id="experience" 
      className='relative overflow-hidden py-20 lg:py-32'
      style={{ 
        background: T.pageBg, 
        color: T.textPrimary, 
        fontFamily: "'DM Sans', sans-serif",
        transition: 'background 0.4s, color 0.4s' 
      }}
    >
      <ScrollProgress isDark={isDark} />

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: T.glow }}
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: T.glow }}
          animate={{ 
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span 
            className="inline-block mb-3 text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full"
            style={{ 
              background: T.tagBg, 
              color: T.accent,
              border: `1px solid ${T.tagBorder}`
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Career & Operations
          </motion.span>
          
          <h2 
            className='text-4xl sm:text-5xl lg:text-6xl font-extrabold'
            style={{ fontFamily: "'DM Serif Display', serif", color: T.textPrimary }}
          >
            Professional{' '}
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
            <span 
              className="inline-block gradient-text"
            >
              Journey
            </span>
          </h2>
          
          <p className="mt-4 text-sm lg:text-base max-w-2xl mx-auto" style={{ color: T.textSecondary }}>
            A decade of dedicated public service, digital empowerment, and financial inclusion 
            at Shambhuganj CSC Center.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop: horizontal layout with alternating cards */}
          <div className="hidden lg:flex flex-col gap-0">
            {experiences.map((exp, idx) => (
              <ExperienceCard 
                key={idx} 
                exp={exp} 
                idx={idx} 
                isDark={isDark}
                isLast={idx === experiences.length - 1}
              />
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="lg:hidden flex flex-col gap-12">
            {experiences.map((exp, idx) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: false, margin: "-80px 0px" });
              const T = isDark ? THEME.dark : THEME.light;

              return (
                <motion.div
                  key={idx}
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Mobile card */}
                  <div className="relative pl-12">
                    {/* Vertical line */}
                    <div 
                      className="absolute left-[19px] top-0 bottom-0 w-[2px]"
                      style={{ 
                        background: idx === 0 
                          ? `linear-gradient(to bottom, transparent 20%, ${T.trackBg} 20%)`
                          : idx === experiences.length - 1
                            ? `linear-gradient(to bottom, ${T.trackBg} 80%, transparent 80%)`
                            : T.trackBg
                      }}
                    />
                    
                    {/* Dot */}
                    <motion.div
                      className="absolute left-2 top-1 w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{
                        backgroundColor: T.accentLight,
                        border: `2px solid ${T.accent}`,
                        boxShadow: `0 0 0 6px ${T.dotGlow}`,
                      }}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {exp.icon}
                    </motion.div>

                    <div
                      className="rounded-2xl p-5 backdrop-blur-md"
                      style={{
                        background: isDark
                          ? `linear-gradient(135deg, ${T.accentLight}, rgba(6,11,20,0.9))`
                          : `linear-gradient(135deg, ${T.accentLight}, rgba(255,255,255,0.98))`,
                        border: `1px solid ${T.accentBorder}`,
                        boxShadow: `0 8px 32px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(37,99,235,0.08)'}`,
                      }}
                    >
                      <span
                        className="inline-block mb-2 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: T.tagBg, color: T.accent, border: `1px solid ${T.tagBorder}` }}
                      >
                        {typeLabels[exp.type]}
                      </span>
                      <h3 className="text-sm font-bold leading-snug mb-1" style={{ color: T.textPrimary, fontFamily: "'DM Serif Display', serif" }}>
                        {exp.role}
                      </h3>
                      <p className="text-xs font-semibold mb-2" style={{ color: T.accent }}>
                        {exp.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 mb-2">
                        <span className="text-[11px]" style={{ color: T.textMuted }}>{exp.duration}</span>
                        {exp.cgpa && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ background: T.tagBg, color: T.accent }}>
                            {exp.cgpa}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed mb-3" style={{ color: T.textSecondary }}>
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {exp.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: T.tagBg, color: T.accent, border: `1px solid ${T.tagBorder}` }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20 lg:mt-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold"
            style={{
              background: T.tagBg,
              color: T.accent,
              border: `1px solid ${T.tagBorder}`,
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: T.accent }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: T.accent }}></span>
            </span>
            Currently serving the community at Shambhuganj CSC Center
          </div>
        </motion.div>
      </div>
    </section>
  );
}