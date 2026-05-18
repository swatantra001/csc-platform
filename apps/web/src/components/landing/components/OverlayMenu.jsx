"use client";
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { FiX } from 'react-icons/fi'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';


const navItems = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact']

const socials = [
  { Icon: FaGithub,   href: "https://github.com/swatantra001",                         label: "GitHub"   },
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/swatantra-maurya-52731727b/", label: "LinkedIn" },
  { Icon: FaXTwitter, href: "https://x.com/SMaury0",                                  label: "X"        },
]

const OverlayMenu = ({ isOpen, onClose }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const origin = isMobile ? '95% 8%' : '50% 8%'

   const { user, isLoggedIn, logout, loading: authLoading } = useAuth();
    const router = useRouter()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          className='fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden'
          style={{ backgroundColor: 'rgba(2, 6, 14, 0.97)', backdropFilter: 'blur(12px)' }}
        >
          {/* bg glow */}
          <div className='pointer-events-none absolute inset-0'>
            <div className='absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1cd8d2] opacity-[0.04] blur-[120px]' />
            <div className='absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#302b63] opacity-[0.10] blur-[120px]' />
          </div>

          {/* close button */}
          <motion.button
            onClick={onClose}
            aria-label='Close Menu'
            className='absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white bg-white/5 hover:bg-white/10 hover:border-[#1cd8d2]/40 transition-all duration-200'
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FiX size={18} />
          </motion.button>

          {/* name tag top-left */}
          <motion.div
            className='absolute top-6 left-6'
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className='text-sm font-bold text-white'>Swatantra Maurya</p>
            <p className='text-xs text-emerald-400'>B.Tech CSE · MNNIT</p>
          </motion.div>

          {/* nav links */}
          <ul className='relative z-10 flex flex-col items-center gap-2'>
            {navItems.map((item, i) => (
              <motion.li key={item}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.07, ease: 'easeOut' }}
              >
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={onClose}
                  className='group relative block text-4xl sm:text-5xl md:text-6xl font-extrabold text-white/80 hover:text-white transition-colors duration-200 py-1 px-2'
                >
                  {/* hover underline */}
                  <span className='absolute left-2 bottom-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 rounded-full bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f]' />
                  <span className='group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#1cd8d2] group-hover:to-[#00bf8f] transition-all duration-200'>
                    {item}
                  </span>
                </a>
              </motion.li>
            ))}
            {/* 2. ✨ THE NEW MOBILE LOGIN BUTTON ✨ */}
            <motion.button 
              onClick={() => {
                if (isLoggedIn) {
                  logout();
                } else {
                  router.push('/login');
                }
                onClose();
              }}
              whileHover={{ scale: 1.06, cursor: 'pointer' }}
              whileTap={{ scale: 0.96 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: navLinks.length * 0.1 }} // Animates in right after the last link
              className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xl font-bold text-black"
              style={{ background: 'linear-gradient(135deg, #1cd8d2 0%, #00bf8f 100%)', boxShadow: '0 0 20px rgba(28,216,210,0.35)', fontFamily: "'Syne', sans-serif" }}
            >
              {authLoading ? 'Loading...' : isLoggedIn ? (
                <span className='flex items-center gap-2'>Logout <LogOutIcon className='w-6 h-6' /></span>
              ) : (
                <span className='flex items-center gap-2'>Login <LogInIcon className='w-6 h-6' /></span>
              )}
            </motion.button>
          </ul>

          {/* bottom bar */}
          <motion.div
            className='absolute bottom-8 flex flex-col items-center gap-4'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            {/* socials */}
            <div className='flex gap-5 text-xl text-gray-500'>
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target='_blank' rel='noopener noreferrer'
                  aria-label={label}
                  className='hover:text-emerald-400 transition-colors duration-200'>
                  <Icon />
                </a>
              ))}
            </div>
            <p className='text-xs text-gray-600'>swatantram07@gmail.com</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OverlayMenu