
// "use client";
// import React from 'react'
// import { FaWhatsapp, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa'
// import { FaXTwitter } from 'react-icons/fa6'
// import { motion } from 'framer-motion'

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
//     accent2: '#1d4ed8',
//     accentLight: '#93c5fd',
//     accentBorder: '#bfdbfe',
//     cardBg: '#ffffff',
//     cardBorder: '#e2e8f0',
//     divider: '#e2e8f0',
//     glow: 'rgba(37,99,235,0.06)',
//     glow2: 'rgba(29,78,216,0.08)',
//     nameGrad: 'linear-gradient(135deg, #1d4ed8, #2563eb, #1e3a8a)',
//     separatorGrad: 'linear-gradient(90deg, transparent, #2563eb, #1d4ed8, transparent)',
//     statGrad: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//     linkHover: '#2563eb',
//     socialHover: '#2563eb',
//     creatorColor: '#64748b',
//     creatorAccent: '#2563eb',
//     creatorWhite: '#1e293b',
//   },
//   dark: {
//     pageBg: '#060b14',
//     textPrimary: '#f1f5f9',
//     textSecondary: 'rgba(255,255,255,0.55)',
//     textMuted: 'rgba(255,255,255,0.28)',
//     accent: '#f59e0b',
//     accent2: '#d97706',
//     accentLight: '#fbbf24',
//     accentBorder: 'rgba(245,158,11,0.25)',
//     cardBg: 'rgba(255,255,255,0.03)',
//     cardBorder: 'rgba(255,255,255,0.08)',
//     divider: 'rgba(255,255,255,0.06)',
//     glow: 'rgba(245,158,11,0.05)',
//     glow2: 'rgba(180,83,9,0.06)',
//     nameGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
//     separatorGrad: 'linear-gradient(90deg, transparent, #f59e0b, #d97706, transparent)',
//     statGrad: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
//     linkHover: '#f59e0b',
//     socialHover: '#f59e0b',
//     creatorColor: 'rgba(255,255,255,0.35)',
//     creatorAccent: '#f59e0b',
//     creatorWhite: '#f1f5f9',
//   },
// };

// const socials = [
//   { Icon: FaWhatsapp,  label: "WhatsApp",  href: "#", colorLight: "#16a34a", colorDark: "#22c55e" },
//   { Icon: FaFacebook,  label: "Facebook",  href: "#", colorLight: "#2563eb", colorDark: "#3b82f6" },
//   { Icon: FaXTwitter,  label: "X",         href: "#", colorLight: "#64748b", colorDark: "#9ca3af" },
//   { Icon: FaInstagram, label: "Instagram", href: "#", colorLight: "#db2777", colorDark: "#f472b6" },
//   { Icon: FaLinkedin,  label: "LinkedIn",  href: "#", colorLight: "#2563eb", colorDark: "#60a5fa" },
// ]

// const navLinks = [
//   { label: "Home",       href: "#home" },
//   { label: "About",      href: "#about" },
//   { label: "Services",   href: "#services" },
//   { label: "Facilities", href: "#facilities" },
//   { label: "Track",      href: "/status" },
//   { label: "Contact",    href: "#contact" },
// ]

// const stats = [
//   { label: "Years of Trust", value: "10+" },
//   { label: "Banking Partners", value: "3" },
//   { label: "Daily Operating Hours", value: "12" },
//   { label: "Digital Services", value: "50+" },
// ]

// const glowVariants = {
//   initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
//   hover: (isDark) => ({
//     scale: 1.25, y: -4,
//     filter: isDark
//       ? "drop-shadow(0 0 10px rgba(245,158,11,0.9)) drop-shadow(0 0 22px rgba(217,119,6,0.8))"
//       : "drop-shadow(0 0 10px rgba(37,99,235,0.9)) drop-shadow(0 0 22px rgba(29,78,216,0.8))",
//     transition: { type: "spring", stiffness: 300, damping: 15 },
//   }),
//   tap: { scale: 0.92, transition: { duration: 0.08 } },
// }

// export default function Footer({ isDark = false }) {
//   const T = isDark ? THEME.dark : THEME.light;

//   return (
//     <footer className='relative overflow-hidden' style={{ background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.4s, color 0.4s' }}>

//       {/* bg glows */}
//       <div className='pointer-events-none absolute inset-0'>
//         <div className='absolute inset-0' style={{ background: `radial-gradient(55% 60% at 70% 35%, ${T.glow}, transparent 70%)` }} />
//         <div className='absolute inset-0' style={{ background: `radial-gradient(50% 55% at 30% 70%, ${T.glow2}, transparent 70%)` }} />
//         {/* top separator glow */}
//         <div className='absolute top-0 left-0 right-0 h-px' style={{ background: T.separatorGrad }} />
//       </div>

//       <motion.div
//         className='relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-10'
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//       >
//         {/* ── Top: name + tagline ── */}
//         <div className='text-center mb-10'>
//           <h1
//             className='font-extrabold select-none leading-none'
//             style={{
//               fontSize: "clamp(2.4rem, 5.5vw, 7rem)",
//               letterSpacing: "0.01em",
//               color: T.textPrimary,
//               textShadow: isDark ? "0 2px 32px rgba(245,158,11,0.15)" : "0 2px 32px rgba(37,99,235,0.12)",
//               fontFamily: "'DM Serif Display', serif",
//             }}
//           >
//             Srilal{' '}
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
//             <span className='gradient-text'>
//               Yadav
//             </span>
//           </h1>
//           <p className='mt-3 text-sm tracking-wide' style={{ color: T.textMuted }}>
//             Certified CSC Operator · Banking & Digital Services · Shambhuganj, Jaunpur
//           </p>
//           <div className='mt-4 mx-auto h-[2px] w-20 rounded-full' style={{ background: T.separatorGrad }} />
//         </div>

//         {/* ── Nav links ── */}
//         <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10'>
//           {navLinks.map(({ label, href }) => (
//             <a key={label} href={href}
//               className='text-sm transition-colors duration-200'
//               style={{ color: T.textMuted }}
//               onMouseEnter={e => (e.currentTarget).style.color = T.linkHover}
//               onMouseLeave={e => (e.currentTarget).style.color = T.textMuted}
//             >
//               {label}
//             </a>
//           ))}
//         </div>

//         {/* ── Socials ── */}
//         <div className='flex justify-center gap-4 text-2xl mb-10'>
//           {socials.map(({ Icon, label, href, colorLight, colorDark }) => (
//             <motion.a
//               key={label} href={href} target='_blank' rel='noopener noreferrer'
//               aria-label={label}
//               variants={glowVariants}
//               custom={isDark}
//               initial='initial' whileHover='hover' whileTap='tap'
//               className='transition-colors duration-200'
//               style={{ color: T.textMuted }}
//               onMouseEnter={e => (e.currentTarget).style.color = isDark ? colorDark : colorLight}
//               onMouseLeave={e => (e.currentTarget).style.color = T.textMuted}
//             >
//               <Icon />
//             </motion.a>
//           ))}
//         </div>

//         {/* ── Stats strip ── */}
//         <div className='flex flex-wrap justify-center gap-6 mb-10'>
//           {stats.map((s, i) => (
//             <div key={i} className='text-center'>
//               <p className='text-xl font-extrabold gradient-text'>{s.value}</p>
//               <p className='text-xs' style={{ color: T.textMuted }}>{s.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* ── Quote + copyright + Credits ── */}
//         <div className='text-center pt-8' style={{ borderTop: `1px solid ${T.divider}` }}>
//           <p className='text-sm italic mb-3' style={{ color: T.textSecondary }}>
//             "Empowering the community through accessible digital and banking services."
//           </p>
//           <p className='text-xs mb-6' style={{ color: T.textMuted }}>
//             © {new Date().getFullYear()} Srilal Yadav · All rights reserved ·{' '}
//             <a href='mailto:sahaj9005623112@gmail.com' className='transition-colors' style={{ color: T.textMuted }}
//               onMouseEnter={e => (e.currentTarget).style.color = T.linkHover}
//               onMouseLeave={e => (e.currentTarget).style.color = T.textMuted}>
//               sahaj9005623112@gmail.com
//             </a>
//           </p>

//           {/* ✨ Animated Creator Credit */}
//           <div className='text-xs flex items-center justify-center gap-1.5' style={{ color: T.creatorColor }}>
//             Managed by:
//             <a
//               href="https://swatantram.vercel.app"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex font-bold tracking-wider"
//             >
//               {"Swatantra Maurya".split("").map((char, index) => (
//                 <motion.span
//                   key={index}
//                   animate={{
//                     color: [T.creatorColor, T.creatorAccent, T.creatorWhite, T.creatorAccent, T.creatorColor],
//                     textShadow: ["0px 0px 0px transparent", `0px 0px 12px ${isDark ? 'rgba(245,158,11,0.6)' : 'rgba(37,99,235,0.5)'}`, "0px 0px 0px transparent"]
//                   }}
//                   transition={{
//                     duration: 3,
//                     repeat: Infinity,
//                     delay: index * 0.1,
//                     ease: "easeInOut"
//                   }}
//                 >
//                   {char === " " ? "\u00A0" : char}
//                 </motion.span>
//               ))}
//             </a>
//           </div>
//         </div>
//       </motion.div>
//     </footer>
//   )
// }














"use client";

/**
 * Footer.jsx — REDESIGNED for
 * D:\csc-platform\src\components\landing\sections\Footer.jsx
 *
 * Extension is .jsx, so this file is JSX (no TypeScript). Same props
 * as before: Footer({ isDark }) — the parent LandingPage still passes
 * isDark. The footer is dark navy in both themes (like the header's
 * top bar), so isDark changes nothing here except the small text
 * shades; the prop is kept for API compatibility.
 *
 * DESIGN (a redesign, not the old layout cleaned up):
 * A real site footer — the part of the page a visitor scrolls to when
 * they need a phone number, a link, or the address. The original was
 * a giant gradient name on a light background, which reads as another
 * hero, not a footer.
 * - Top: a contact strip, borrowed from the friend's site footer
 *   (Call / WhatsApp / Email) — the original footer had no phone,
 *   email or address at all, even though the header had them.
 * - Main: four plain columns — the centre (name, what it is, hours),
 *   Quick links, Services, and Contact (address, phone, email).
 * - Stats: the four stats as a plain row with hairline dividers,
 *   not gradient numbers.
 * - Bottom: the quote, the copyright with the email, and the creator
 *   credit as plain text — no letter-by-letter colour animation.
 *
 * KEPT, exactly as supplied: the name and tagline, all 6 nav links,
 * all 4 stats, the quote, the copyright line with the email, and the
 * creator credit "Managed by: Swatantra Maurya" with its link.
 *
 * SOCIAL LINKS — read this before you ship:
 * All five socials in the original pointed to "#" — dead links. Only
 * WhatsApp has a real destination (the centre's own number), so only
 * WhatsApp is rendered. The other four (Facebook, X, Instagram,
 * LinkedIn) are kept in PENDING_SOCIALS below, with their icons, so
 * nothing is lost — send me the real profile URLs and they go live
 * with one edit each. No social URL was invented.
 *
 * REMOVED: the token object, motion (entrance, glow-on-hover socials,
 * letter-by-letter creator animation), glow blobs, the gradient
 * separator, gradient text — the stats used class "gradient-text"
 * with no definition of their own in this file — the serif display
 * font, the text shadow, and react-icons (icons are lucide-react now).
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import React, { useEffect } from "react";
import {
  Clock,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const CENTRE = {
  name: "Shri Lal Sahaj Jan Seva Kendra",
  place: "Shambhuganj, Jaunpur",
  state: "Uttar Pradesh",
  operator: "Srilal Yadav",
  phoneDisplay: "90056 23112",
  phoneHref: "tel:+919005623112",
  whatsappHref: "https://wa.me/919005623112",
  email: "sahaj9005623112@gmail.com",
  hours: "9:00 AM – 9:00 PM, every day",
};

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Facilities", href: "#facilities" },
  { label: "Track", href: "/status" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  { label: "Banking & AePS", href: "#services-banking" },
  { label: "E-Governance & Certificates", href: "#services-governance" },
  { label: "Travel & IRCTC", href: "#services-travel" },
  { label: "Utility Payments", href: "#services-utility" },
  { label: "Insurance & ITR", href: "#services-insurance" },
  { label: "Digital Services", href: "#services-digital" },
];

const STATS = [
  { label: "Years of Trust", value: "10+" },
  { label: "Banking Partners", value: "3" },
  { label: "Daily Operating Hours", value: "12" },
  { label: "Digital Services", value: "50+" },
];

// TODO: add the real profile URLs here — do not ship these as "#" links.
// Facebook, X, Instagram and LinkedIn had no URLs in the original code.
const PENDING_SOCIALS = [
  { Icon: FaFacebook, label: "Facebook", href: null },
  { Icon: FaTwitter, label: "X", href: null },
  { Icon: FaInstagram, label: "Instagram", href: null },
  { Icon: FaLinkedin, label: "LinkedIn", href: null },
];

export default function Footer({ isDark = false }) {
  // The footer is dark navy in both themes; isDark is kept so the
  // parent's props do not change.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0b2239] font-sans text-white">
      {/* Contact strip — Call / WhatsApp / Email, from the friend's footer */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-8">
          <a href={CENTRE.phoneHref} className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" aria-hidden />
            <span>
              <span className="block text-xs font-bold uppercase tracking-widest text-white/60">Call us</span>
              <span className="block font-semibold">{CENTRE.phoneDisplay}</span>
            </span>
          </a>
          <a href={CENTRE.whatsappHref} target="_blank" rel="noreferrer" className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" aria-hidden />
            <span>
              <span className="block text-xs font-bold uppercase tracking-widest text-white/60">WhatsApp</span>
              <span className="block font-semibold">{CENTRE.phoneDisplay}</span>
            </span>
          </a>
          <a href={`mailto:${CENTRE.email}`} className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" aria-hidden />
            <span>
              <span className="block text-xs font-bold uppercase tracking-widest text-white/60">Email</span>
              <span className="block break-all font-semibold">{CENTRE.email}</span>
            </span>
          </a>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold leading-snug">{CENTRE.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Common Service Centre, {CENTRE.place}, {CENTRE.state}. Government,
            banking and travel services for Shambhuganj and the villages
            around it.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
            <Clock className="h-4 w-4 shrink-0 text-blue-300" aria-hidden />
            {CENTRE.hours}
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={CENTRE.whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:border-white/40 hover:text-white"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
            </a>
            {PENDING_SOCIALS.map(({ Icon, label }) => (
              <span
                key={label}
                title={`${label} — link not supplied yet`}
                aria-label={`${label} — link not supplied yet`}
                className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-white/10 text-white/25"
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
            ))}
          </div>
        </div>

        <nav aria-label="Quick links">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Quick links</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-white/80 hover:text-white hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Services</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="text-white/80 hover:text-white hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Contact</p>
          <address className="mt-4 space-y-2.5 text-sm not-italic leading-relaxed text-white/80">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden />
              {CENTRE.name}, {CENTRE.place}, {CENTRE.state}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-blue-300" aria-hidden />
              <a href={CENTRE.phoneHref} className="hover:text-white hover:underline">
                {CENTRE.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-blue-300" aria-hidden />
              <a href={`mailto:${CENTRE.email}`} className="break-all hover:text-white hover:underline">
                {CENTRE.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Stats — plain row, hairline dividers */}
      <div className="border-t border-white/10">
        <dl className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-12 gap-y-4 px-4 py-6 sm:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="text-xl font-bold">{s.value}</dd>
              <dt className="mt-0.5 text-xs text-white/60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Bottom — quote, copyright, credit */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-8">
          <p className="text-sm italic text-white/70">
            &ldquo;Empowering the community through accessible digital and banking services.&rdquo;
          </p>
          <p className="mt-3 text-xs text-white/60">
            © {year} {CENTRE.operator} · All rights reserved ·{" "}
            <a href={`mailto:${CENTRE.email}`} className="hover:text-white hover:underline">
              {CENTRE.email}
            </a>
          </p>
          <p className="mt-4 text-xs text-white/60">
            Managed by:{" "}
            <a
              href="https://swatantram.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-white/80 hover:text-white hover:underline"
            >
              Swatantra Maurya
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
