"use client";
import React from 'react'
import { FaWhatsapp, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { motion } from 'framer-motion'

const socials = [
  { Icon: FaWhatsapp,  label: "WhatsApp",  href: "#", color: "#25D366" },
  { Icon: FaFacebook,  label: "Facebook",  href: "#", color: "#60a5fa" },
  { Icon: FaXTwitter,  label: "X",         href: "#", color: "#9ca3af" },
  { Icon: FaInstagram, label: "Instagram", href: "#", color: "#f472b6" },
  { Icon: FaLinkedin,  label: "LinkedIn",  href: "#", color: "#38bdf8" },
]

const navLinks = [
  { label: "Home",       href: "#home" },
  { label: "About",      href: "#about" },
  { label: "Services",   href: "#services" }, 
  { label: "Facilities", href: "#facilities" },
  { label: "Track",      href: "/status" }, 
  { label: "Contact",    href: "#contact" },
]

const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
  hover: {
    scale: 1.25, y: -4,
    filter: "drop-shadow(0 0 10px rgba(28,216,210,0.9)) drop-shadow(0 0 22px rgba(0,191,143,0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.92, transition: { duration: 0.08 } },
}

const Footer = () => {
  return (
    <footer className='relative overflow-hidden bg-black text-white'>

      {/* bg glows */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute inset-0 bg-[radial-gradient(55%_60%_at_70%_35%,rgba(28,216,210,0.06),transparent_70%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(50%_55%_at_30%_70%,rgba(0,191,143,0.08),transparent_70%)]' />
        {/* top separator glow */}
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1cd8d2]/20 to-transparent' />
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
            className='font-extrabold text-white select-none leading-none'
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 7rem)",
              letterSpacing: "0.01em",
              textShadow: "0 2px 32px rgba(28,216,210,0.18)",
            }}
          >
            Shrilal{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63]'>
              Yadav
            </span>
          </h1>
          <p className='mt-3 text-gray-500 text-sm tracking-wide'>
            Certified CSC Operator · Banking & Digital Services · Shambhuganj, Jaunpur
          </p>
          <div className='mt-4 mx-auto h-[2px] w-20 rounded-full bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63]' />
        </div>

        {/* ── Nav links ── */}
        <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10'>
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href}
              className='text-sm text-gray-500 hover:text-emerald-400 transition-colors duration-200'>
              {label}
            </a>
          ))}
        </div>

        {/* ── Socials ── */}
        <div className='flex justify-center gap-4 text-2xl mb-10'>
          {socials.map(({ Icon, label, href, color }) => (
            <motion.a
              key={label} href={href} target='_blank' rel='noopener noreferrer'
              aria-label={label}
              variants={glowVariants} initial='initial' whileHover='hover' whileTap='tap'
              className='text-gray-500 transition-colors duration-200'
              style={{ ['--hover-color']: color }}
            >
              <Icon />
            </motion.a>
          ))}
        </div>

        {/* ── Stats strip ── */}
        <div className='flex flex-wrap justify-center gap-6 mb-10'>
          {[
            { label: "Years of Trust", value: "10+" },
            { label: "Banking Partners", value: "3" }, 
            { label: "Daily Operating Hours", value: "12" }, 
            { label: "Digital Services", value: "50+" },
          ].map((s, i) => (
            <div key={i} className='text-center'>
              <p className='text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f]'>{s.value}</p>
              <p className='text-xs text-gray-600'>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Quote + copyright + Credits ── */}
        <div className='text-center border-t border-white/5 pt-8'>
          <p className='text-gray-500 text-sm italic mb-3'>
            "Empowering the community through accessible digital and banking services."
          </p>
          <p className='text-xs text-gray-600 mb-6'>
            © {new Date().getFullYear()} Shrilal Yadav · All rights reserved ·{' '}
            <a href='mailto:shrilalyadav@gmail.com' className='hover:text-emerald-400 transition-colors'>shrilalyadav@gmail.com</a>
          </p>
          
          {/* ✨ Animated Creator Credit */}
          <div className='text-xs text-gray-600 flex items-center justify-center gap-1.5'>
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
                    color: ["#4b5563", "#1cd8d2", "#ffffff", "#1cd8d2", "#4b5563"],
                    textShadow: ["0px 0px 0px transparent", "0px 0px 12px rgba(28,216,210,0.8)", "0px 0px 0px transparent"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.1, // This creates the sequential wave effect!
                    ease: "easeInOut"
                  }}
                >
                  {/* Preserve spaces properly */}
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

export default Footer