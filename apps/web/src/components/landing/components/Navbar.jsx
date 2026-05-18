
"use client";
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useAuth } from '@/components/AuthProvider';
import { LogInIcon, LogOutIcon } from 'lucide-react';

// ── THEME TOKENS (matches your reference exactly) ───────────────────────────
const NAV_THEME = {
  light: {
    navBgScrolled: 'rgba(30,58,138,0.96)',
    navBorder: 'rgba(59,130,246,0.20)',
    accent: '#2563eb',
    accent2: '#1d4ed8',
    accentLight: '#93c5fd',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.70)',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    glow: '0 0 20px rgba(37,99,235,0.35)',
    overlayBg: 'rgba(15,23,42,0.96)',
    menuHover: '#2563eb',
    toggleBorder: 'rgba(147,197,253,0.35)',
    toggleBg: 'rgba(59,130,246,0.12)',
    toggleIcon: '🌙',
    fontSans: "'DM Sans', sans-serif",
  },
  dark: {
    navBgScrolled: 'rgba(6,11,20,0.98)',
    navBorder: 'rgba(245,158,11,0.12)',
    accent: '#f59e0b',
    accent2: '#d97706',
    accentLight: '#f59e0b',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.50)',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    glow: '0 0 20px rgba(245,158,11,0.35)',
    overlayBg: 'rgba(0,0,0,0.92)',
    menuHover: '#f59e0b',
    toggleBorder: 'rgba(245,158,11,0.30)',
    toggleBg: 'rgba(245,158,11,0.10)',
    toggleIcon: '☀️',
    fontSans: "'DM Sans', sans-serif",
  }
};

const navLinks = ['Galary', 'Services', 'Posts', 'Contact']

// ── Icons ───────────────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

// ── OverlayMenu ─────────────────────────────────────────────────────────────
const OverlayMenu = ({ isOpen, onClose, isLoggedIn, logout, authLoading, isDark }) => {
  const T = isDark ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] backdrop-blur-xl flex flex-col items-center justify-center"
          style={{ background: T.overlayBg }}
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-full transition-colors"
            style={{ color: '#fff', background: 'rgba(255,255,255,0.06)' }}
          >
            <CloseIcon />
          </button>

          <nav className="flex flex-col gap-8 text-center">
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href={link === "Galary" || link === "Posts" ? `${process.env.NEXT_PUBLIC_APP_URL}/${link.toLowerCase()}` : `#${link.toLowerCase()}`}
                onClick={onClose}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-4xl font-bold transition-colors"
                style={{ fontFamily: T.fontSans, color: '#fff' }}
                onMouseEnter={e => (e.currentTarget).style.color = T.menuHover}
                onMouseLeave={e => (e.currentTarget).style.color = '#fff'}
              >
                {link}
              </motion.a>
            ))}
            <motion.a
              onClick={() => {
                if (isLoggedIn) logout();
                onClose();
              }}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
              whileHover={{ scale: 1.06, cursor: 'pointer' }}
              whileTap={{ scale: 0.96 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: navLinks.length * 0.1 }}
              className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xl font-bold"
              style={{ background: T.gradient, boxShadow: T.glow, color: isDark ? '#000' : '#fff', fontFamily: T.fontSans }}
            >
              {authLoading ? 'Loading...' : isLoggedIn ? (
                <span className='flex items-center gap-2'>Logout <LogOutIcon className='w-6 h-6' /></span>
              ) : (
                <span className='flex items-center gap-2'>Login <LogInIcon className='w-6 h-6' /></span>
              )}
            </motion.a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── SLogo ───────────────────────────────────────────────────────────────────
const SLogo = ({ size = 32, isDark }) => {
  const gradId = isDark ? 'nb-grad-dark' : 'nb-grad-light';
  const c1 = isDark ? '#f59e0b' : '#2563eb';
  const c2 = isDark ? '#d97706' : '#1d4ed8';

  return (
    <svg width={size} height={size} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="nb-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="halo" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="bloom" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="bloom" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="50%" stopColor={c2} />
          <stop offset="100%" stopColor={c1} />
        </linearGradient>
      </defs>
      <g filter="url(#nb-glow)" opacity="0.7">
        <path d="M 352,108 C 320,78 258,64 205,72 C 152,80 112,108 104,150 C 94,196 120,232 165,254 L 240,282 C 300,304 338,332 335,372 C 332,412 292,438 245,444 C 198,450 152,438 108,416" fill="none" stroke={`url(#${gradId})`} strokeWidth="30" strokeLinecap="butt" strokeLinejoin="round" />
        <path d="M 326,130 C 300,106 247,95 202,102 C 158,109 126,132 120,168 C 112,207 135,238 174,258 L 242,284 C 296,305 328,332 325,366 C 322,400 286,423 244,428 C 202,433 160,422 122,402" fill="none" stroke={`url(#${gradId})`} strokeWidth="13" strokeLinecap="butt" strokeLinejoin="round" />
      </g>
      <path d="M 352,108 C 320,78 258,64 205,72 C 152,80 112,108 104,150 C 94,196 120,232 165,254 L 240,282 C 300,304 338,332 335,372 C 332,412 292,438 245,444 C 198,450 152,438 108,416" fill="none" stroke="white" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="round" />
      <path d="M 326,130 C 300,106 247,95 202,102 C 158,109 126,132 120,168 C 112,207 135,238 174,258 L 242,284 C 296,305 328,332 325,366 C 322,400 286,423 244,428 C 202,433 160,422 122,402" fill="none" stroke="white" strokeWidth="13" strokeLinecap="butt" strokeLinejoin="round" />
    </svg>
  )
}

// ── BrandLogo ─────────────────────────────────────────────────────────────────
const BrandLogo = ({ isDark }) => {
  const [hovered, setHovered] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 300, damping: 25 })
  const sy = useSpring(my, { stiffness: 300, damping: 25 })
  const T = isDark ? NAV_THEME.dark : NAV_THEME.light;

  const handleMove = (e) => {
    if (!hovered) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mx.set((e.clientX - cx) * 0.25)
    my.set((e.clientY - cy) * 0.25)
  }

  return (
    <a href="#home" className="flex items-center gap-2 select-none" onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); mx.set(0); my.set(0); }} onMouseMove={handleMove}>
      <motion.div style={{ x: sx, y: sy }} whileHover={{ scale: 1.12 }} className="relative flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full"
          style={{
            width: 44, height: 44,
            background: isDark
              ? 'conic-gradient(from 0deg, #f59e0b, #d97706, transparent, #f59e0b)'
              : 'conic-gradient(from 0deg, #2563eb, #1d4ed8, transparent, #2563eb)',
            padding: 1.5,
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
          }}
        />
        <div className="relative z-10 flex items-center justify-center" style={{ width: 38, height: 38 }}>
          <SLogo size={28} isDark={isDark} />
        </div>
      </motion.div>
      <motion.div style={{ x: sx, y: sy }} className="hidden sm:flex flex-col leading-none">
        <div className="flex items-baseline overflow-hidden">
          {'Srilal'.split('').map((char, i) => (
            <motion.span key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.04 * i + 0.1, duration: 0.4 }} className="inline-block font-bold text-[1.25rem]" style={{ fontFamily: "'DM Serif Display', serif", color: '#fff' }}>
              {char}
            </motion.span>
          ))}
        </div>
        <div className="relative overflow-hidden h-[15px] -mt-[1px]">
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.6, duration: 0.6 }} className="absolute left-0 top-1 h-[1.5px] rounded-full" style={{ background: T.gradient }} />
          <span className="text-[0.55rem] tracking-[0.20em] font-semibold uppercase block pt-[6px] font-mono" style={{ color: T.accentLight }}>CSC CENTER</span>
        </div>
      </motion.div>
    </a>
  )
}

const Navbar = ({ isDark, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

  const T = isDark ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <>
      <motion.nav
        animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3"
        style={{
          //background: scrolled ? T.navBgScrolled : 'transparent',
          // backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          // borderBottom: scrolled ? `1px solid ${T.navBorder}` : 'none',
          background: T.navBgScrolled,
          backdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: `1px solid ${T.navBorder}`,
          transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        }}
      >
        <BrandLogo isDark={isDark} />

        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link, i) => (
            <motion.a
              key={link}
              href={link === "Galary" || link === "Posts" ? `${process.env.NEXT_PUBLIC_APP_URL}/${link.toLowerCase()}` : `#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i + 0.3 }}
              className="relative px-4 py-2 text-sm rounded-lg transition-colors group"
              style={{ color: T.textMuted, fontFamily: T.fontSans }}
              onMouseEnter={e => (e.currentTarget).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget).style.color = T.textMuted}
            >
              {link}
              <span className="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: T.gradient }} />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* ✨ THEME TOGGLE ✨ */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: '#fff',
              border: `1.5px solid ${T.toggleBorder}`,
              background: T.toggleBg,
            }}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            <span style={{ fontSize: 15 }}>{T.toggleIcon}</span>
          </motion.button>

          <motion.button onClick={() => setMenuOpen(true)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} className="p-2 rounded-lg transition-colors" style={{ color: '#fff' }}>
            <MenuIcon />
          </motion.button>

          <motion.a
            onClick={() => { if (isLoggedIn) logout(); }}
            href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
            whileHover={{ scale: 1.06, cursor: 'pointer' }}
            whileTap={{ scale: 0.96 }}
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
            style={{ background: T.gradient, boxShadow: T.glow, color: isDark ? '#000' : '#fff', fontFamily: T.fontSans }}
          >
            {authLoading ? 'Loading...' : isLoggedIn ? <span className='flex gap-2'>Logout <LogOutIcon className='w-5 h-5' /></span> : <span className='flex gap-2'>Login <LogInIcon className='w-5 h-5' /></span>}
          </motion.a>
        </div>
      </motion.nav>

      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isLoggedIn={isLoggedIn} logout={logout} authLoading={authLoading} isDark={isDark} />
    </>
  )
}

export default Navbar;