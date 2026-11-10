

// "use client";

// import React, { useEffect, useRef, useState } from 'react'

// const CustomCursor = ({ isDark = false }) => {
//   const dotRef   = useRef(null)
//   const auraRef  = useRef(null)
//   const posRef   = useRef({ x: 0, y: 0 })
//   const auraPos  = useRef({ x: 0, y: 0 })
//   const rafRef   = useRef(null)
//   const [visible, setVisible] = useState(false)
//   const [clicked, setClicked] = useState(false)
//   const [hovered, setHovered] = useState(false)

//   // Theme colors
//   const auraBg = isDark
//     ? 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(217,119,6,0.08) 50%, transparent 70%)'
//     : 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(29,78,216,0.08) 50%, transparent 70%)'
//   const auraBgHover = isDark
//     ? 'radial-gradient(circle, rgba(245,158,11,0.22) 0%, rgba(217,119,6,0.10) 50%, transparent 70%)'
//     : 'radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(29,78,216,0.10) 50%, transparent 70%)'
//   const dotGrad = isDark
//     ? 'linear-gradient(135deg, #f59e0b, #d97706)'
//     : 'linear-gradient(135deg, #2563eb, #1d4ed8)'
//   const dotGradHover = isDark
//     ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
//     : 'linear-gradient(135deg, #3b82f6, #2563eb)'
//   const shadow = isDark
//     ? '0 0 8px rgba(245,158,11,0.7), 0 0 16px rgba(245,158,11,0.3)'
//     : '0 0 8px rgba(37,99,235,0.7), 0 0 16px rgba(37,99,235,0.3)'
//   const shadowHover = isDark
//     ? '0 0 10px rgba(245,158,11,0.8), 0 0 20px rgba(245,158,11,0.4)'
//     : '0 0 10px rgba(37,99,235,0.8), 0 0 20px rgba(37,99,235,0.4)'

//   useEffect(() => {
//     if (window.matchMedia('(pointer: coarse)').matches) return

//     const onMove = (e) => {
//       posRef.current = { x: e.clientX, y: e.clientY }
//       if (!visible) setVisible(true)
//     }
//     const onLeave  = () => setVisible(false)
//     const onEnter  = () => setVisible(true)
//     const onDown   = () => setClicked(true)
//     const onUp     = () => setClicked(false)
//     const onOver = (e) => {
//       const el = (e.target).closest('a, button, [role="button"], input, textarea, select, label')
//       setHovered(!!el)
//     }

//     window.addEventListener('mousemove',   onMove,  { passive: true })
//     document.addEventListener('mouseleave', onLeave)
//     document.addEventListener('mouseenter', onEnter)
//     window.addEventListener('mousedown',   onDown)
//     window.addEventListener('mouseup',     onUp)
//     window.addEventListener('mouseover',   onOver,  { passive: true })

//     const animate = () => {
//       auraPos.current.x += (posRef.current.x - auraPos.current.x) * 0.1
//       auraPos.current.y += (posRef.current.y - auraPos.current.y) * 0.1

//       if (dotRef.current) {
//         dotRef.current.style.transform = `translate(${posRef.current.x - 5}px, ${posRef.current.y - 5}px)`
//       }
//       if (auraRef.current) {
//         auraRef.current.style.transform = `translate(${auraPos.current.x - 60}px, ${auraPos.current.y - 60}px)`
//       }
//       rafRef.current = requestAnimationFrame(animate)
//     }
//     rafRef.current = requestAnimationFrame(animate)

//     return () => {
//       window.removeEventListener('mousemove',   onMove)
//       document.removeEventListener('mouseleave', onLeave)
//       document.removeEventListener('mouseenter', onEnter)
//       window.removeEventListener('mousedown',   onDown)
//       window.removeEventListener('mouseup',     onUp)
//       window.removeEventListener('mouseover',   onOver)
//       if (rafRef.current) cancelAnimationFrame(rafRef.current)
//     }
//   }, [])

//   if (!visible) return null

//   return (
//     <>
//       <div
//         ref={auraRef}
//         className='pointer-events-none fixed top-0 left-0 z-[9990] will-change-transform'
//         style={{
//           width: 120, height: 120,
//           borderRadius: '50%',
//           background: hovered ? auraBgHover : auraBg,
//           filter: 'blur(16px)',
//           transition: 'background 0.3s ease',
//           opacity: 0.9,
//         }}
//       />
//       <div
//         ref={dotRef}
//         className='pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform'
//         style={{
//           width: 10, height: 10,
//           borderRadius: '50%',
//           background: hovered ? dotGradHover : clicked ? '#ffffff' : dotGrad,
//           boxShadow: hovered ? shadowHover : shadow,
//           transform: `scale(${clicked ? 0.6 : hovered ? 1.6 : 1})`,
//           transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
//         }}
//       />
//     </>
//   )
// }

// export default CustomCursor











"use client";

/**
 * CustomCursor.jsx — REMOVED BY DESIGN for
 * D:\csc-platform\src\components\landing\components\CustomCursor.jsx
 *
 * Extension is .jsx, so this file is JSX. Same export and same props
 * as before: CustomCursor({ isDark }) — the parent LandingPage still
 * passes isDark, and this file accepts it so nothing breaks. But it
 * renders nothing. That is the whole redesign.
 *
 * WHY THERE IS NO "BETTER" CUSTOM CURSOR:
 * The standing brief for this site bans custom cursors outright, and
 * for good reason. The old component was a glowing dot and a blurred
 * aura that chased the mouse with a requestAnimationFrame loop running
 * on every frame, plus six window/document listeners, on every page
 * of a site whose visitors are mostly on phones and low-end desktops.
 * It replaced the cursor people already know how to use — including
 * people who rely on the system cursor — with a slower, laggy copy
 * of it. No version of it is professional; the professional choice
 * is the native cursor.
 *
 * WHAT WAS IN THE OLD FILE, FOR THE RECORD: a 10px gradient dot
 * (blue light / amber dark) with a glow shadow, a 120px blurred
 * radial-gradient aura that lagged behind the dot, states for
 * visible / clicked / hovered, and a pointer:coarse check that
 * skipped touch devices. None of it was content, data, or an
 * integration — nothing is lost by removing it.
 *
 * CLEAN-UP (do this when you drop the next file in):
 * 1. Delete this file and remove the import + <CustomCursor />
 *    from LandingPage. This stub exists only so the build does not
 *    break if you forget that step.
 * 2. Check globals.css / your global styles for `cursor: none` —
 *    if the old setup hid the native cursor, remove that rule, or
 *    the site will have no cursor at all once this component is gone.
 */

export default function CustomCursor({ isDark = false }) {
  // Intentionally renders nothing. isDark is accepted only so the
  // parent's existing <CustomCursor isDark={isDark} /> call still works.
  void isDark;
  return null;
}
