
"use client";
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'

const IntroAnimation = ({ onFinish }) => {
  const greetings = useMemo(() => [
    "Hello",       // English
    "नमस्ते",       // Hindi
    "Hola",        // Spanish
    "Bonjour",     // French
    "Ciao",        // Italian
    "Olá",         // Portuguese
    "Привет",      // Russian
    "Merhaba",     // Turkish
    "Hej",         // Swedish
    "Hallo",       // German
    "Salam",       // Arabic
    "こんにちは",   // Japanese
  ], [])

  const [index,   setIndex]   = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (index < greetings.length - 1) {
      const id = setInterval(() => setIndex(i => i + 1), 160)
      return () => clearInterval(id)
    } else {
      const t = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(t)
    }
  }, [index, greetings.length])

  // progress fraction
  const progress = (index + 1) / greetings.length

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden'
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* bg glow that shifts color */}
          <motion.div
            className='absolute inset-0 pointer-events-none'
            animate={{
              background: [
                'radial-gradient(ellipse at center, rgba(28,216,210,0.08) 0%, transparent 70%)',
                'radial-gradient(ellipse at center, rgba(0,191,143,0.08) 0%, transparent 70%)',
                'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
          />

          {/* greeting text */}
          <motion.h1
            key={index}
            className='relative z-10 font-extrabold text-center select-none'
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              background: 'linear-gradient(135deg, #1cd8d2, #00bf8f, #e2e8f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 40px rgba(28,216,210,0.3))',
            }}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.14 }}
          >
            {greetings[index]}
          </motion.h1>

          {/* lang label */}
          <motion.p
            key={`sub-${index}`}
            className='relative z-10 mt-4 text-sm text-gray-600 tracking-widest uppercase'
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          >
            {['English','Hindi','Spanish','French','Italian','Portuguese','Russian','Turkish','Swedish','German','Arabic','Japanese'][index]}
          </motion.p>

          {/* progress bar */}
          <div className='absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-[2px] rounded-full bg-white/10'>
            <motion.div
              className='h-full rounded-full'
              style={{ background: 'linear-gradient(90deg, #1cd8d2, #00bf8f)' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IntroAnimation