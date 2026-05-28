
"use client";
import React from 'react'
import { FaWhatsapp, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { motion } from 'framer-motion'

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
    accentLight: '#93c5fd',
    accentBorder: '#bfdbfe',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    divider: '#e2e8f0',
    glow: 'rgba(37,99,235,0.06)',
    glow2: 'rgba(29,78,216,0.08)',
    nameGrad: 'linear-gradient(135deg, #1d4ed8, #2563eb, #1e3a8a)',
    separatorGrad: 'linear-gradient(90deg, transparent, #2563eb, #1d4ed8, transparent)',
    statGrad: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    linkHover: '#2563eb',
    socialHover: '#2563eb',
    creatorColor: '#64748b',
    creatorAccent: '#2563eb',
    creatorWhite: '#1e293b',
  },
  dark: {
    pageBg: '#060b14',
    textPrimary: '#f1f5f9',
    textSecondary: 'rgba(255,255,255,0.55)',
    textMuted: 'rgba(255,255,255,0.28)',
    accent: '#f59e0b',
    accent2: '#d97706',
    accentLight: '#fbbf24',
    accentBorder: 'rgba(245,158,11,0.25)',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.06)',
    glow: 'rgba(245,158,11,0.05)',
    glow2: 'rgba(180,83,9,0.06)',
    nameGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
    separatorGrad: 'linear-gradient(90deg, transparent, #f59e0b, #d97706, transparent)',
    statGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    linkHover: '#f59e0b',
    socialHover: '#f59e0b',
    creatorColor: 'rgba(255,255,255,0.35)',
    creatorAccent: '#f59e0b',
    creatorWhite: '#f1f5f9',
  },
};

const socials = [
  { Icon: FaWhatsapp,  label: "WhatsApp",  href: "#", colorLight: "#16a34a", colorDark: "#22c55e" },
  { Icon: FaFacebook,  label: "Facebook",  href: "#", colorLight: "#2563eb", colorDark: "#3b82f6" },
  { Icon: FaXTwitter,  label: "X",         href: "#", colorLight: "#64748b", colorDark: "#9ca3af" },
  { Icon: FaInstagram, label: "Instagram", href: "#", colorLight: "#db2777", colorDark: "#f472b6" },
  { Icon: FaLinkedin,  label: "LinkedIn",  href: "#", colorLight: "#2563eb", colorDark: "#60a5fa" },
]

const navLinks = [
  { label: "Home",       href: "#home" },
  { label: "About",      href: "#about" },
  { label: "Services",   href: "#services" },
  { label: "Facilities", href: "#facilities" },
  { label: "Track",      href: "/status" },
  { label: "Contact",    href: "#contact" },
]

const stats = [
  { label: "Years of Trust", value: "10+" },
  { label: "Banking Partners", value: "3" },
  { label: "Daily Operating Hours", value: "12" },
  { label: "Digital Services", value: "50+" },
]

const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
  hover: (isDark) => ({
    scale: 1.25, y: -4,
    filter: isDark
      ? "drop-shadow(0 0 10px rgba(245,158,11,0.9)) drop-shadow(0 0 22px rgba(217,119,6,0.8))"
      : "drop-shadow(0 0 10px rgba(37,99,235,0.9)) drop-shadow(0 0 22px rgba(29,78,216,0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  }),
  tap: { scale: 0.92, transition: { duration: 0.08 } },
}

export default function Footer({ isDark = false }) {
  const T = isDark ? THEME.dark : THEME.light;

  return (
    <footer className='relative overflow-hidden' style={{ background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.4s, color 0.4s' }}>

      {/* bg glows */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute inset-0' style={{ background: `radial-gradient(55% 60% at 70% 35%, ${T.glow}, transparent 70%)` }} />
        <div className='absolute inset-0' style={{ background: `radial-gradient(50% 55% at 30% 70%, ${T.glow2}, transparent 70%)` }} />
        {/* top separator glow */}
        <div className='absolute top-0 left-0 right-0 h-px' style={{ background: T.separatorGrad }} />
      </div>

      <motion.div
        className='relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-10'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* ── Top: name + tagline ── */}
        <div className='text-center mb-10'>
          <h1
            className='font-extrabold select-none leading-none'
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 7rem)",
              letterSpacing: "0.01em",
              color: T.textPrimary,
              textShadow: isDark ? "0 2px 32px rgba(245,158,11,0.15)" : "0 2px 32px rgba(37,99,235,0.12)",
              fontFamily: "'DM Serif Display', serif",
            }}
          >
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
            <span className='gradient-text'>
              Yadav
            </span>
          </h1>
          <p className='mt-3 text-sm tracking-wide' style={{ color: T.textMuted }}>
            Certified CSC Operator · Banking & Digital Services · Shambhuganj, Jaunpur
          </p>
          <div className='mt-4 mx-auto h-[2px] w-20 rounded-full' style={{ background: T.separatorGrad }} />
        </div>

        {/* ── Nav links ── */}
        <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10'>
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href}
              className='text-sm transition-colors duration-200'
              style={{ color: T.textMuted }}
              onMouseEnter={e => (e.currentTarget).style.color = T.linkHover}
              onMouseLeave={e => (e.currentTarget).style.color = T.textMuted}
            >
              {label}
            </a>
          ))}
        </div>

        {/* ── Socials ── */}
        <div className='flex justify-center gap-4 text-2xl mb-10'>
          {socials.map(({ Icon, label, href, colorLight, colorDark }) => (
            <motion.a
              key={label} href={href} target='_blank' rel='noopener noreferrer'
              aria-label={label}
              variants={glowVariants}
              custom={isDark}
              initial='initial' whileHover='hover' whileTap='tap'
              className='transition-colors duration-200'
              style={{ color: T.textMuted }}
              onMouseEnter={e => (e.currentTarget).style.color = isDark ? colorDark : colorLight}
              onMouseLeave={e => (e.currentTarget).style.color = T.textMuted}
            >
              <Icon />
            </motion.a>
          ))}
        </div>

        {/* ── Stats strip ── */}
        <div className='flex flex-wrap justify-center gap-6 mb-10'>
          {stats.map((s, i) => (
            <div key={i} className='text-center'>
              <p className='text-xl font-extrabold gradient-text'>{s.value}</p>
              <p className='text-xs' style={{ color: T.textMuted }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Quote + copyright + Credits ── */}
        <div className='text-center pt-8' style={{ borderTop: `1px solid ${T.divider}` }}>
          <p className='text-sm italic mb-3' style={{ color: T.textSecondary }}>
            "Empowering the community through accessible digital and banking services."
          </p>
          <p className='text-xs mb-6' style={{ color: T.textMuted }}>
            © {new Date().getFullYear()} Srilal Yadav · All rights reserved ·{' '}
            <a href='mailto:sahaj9005623112@gmail.com' className='transition-colors' style={{ color: T.textMuted }}
              onMouseEnter={e => (e.currentTarget).style.color = T.linkHover}
              onMouseLeave={e => (e.currentTarget).style.color = T.textMuted}>
              sahaj9005623112@gmail.com
            </a>
          </p>

          {/* ✨ Animated Creator Credit */}
          <div className='text-xs flex items-center justify-center gap-1.5' style={{ color: T.creatorColor }}>
            Managed by:
            <a
              href="https://swatantram.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-bold tracking-wider"
            >
              {"Swatantra Maurya".split("").map((char, index) => (
                <motion.span
                  key={index}
                  animate={{
                    color: [T.creatorColor, T.creatorAccent, T.creatorWhite, T.creatorAccent, T.creatorColor],
                    textShadow: ["0px 0px 0px transparent", `0px 0px 12px ${isDark ? 'rgba(245,158,11,0.6)' : 'rgba(37,99,235,0.5)'}`, "0px 0px 0px transparent"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}