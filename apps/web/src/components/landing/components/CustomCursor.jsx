
"use client";


import React, { useEffect, useRef, useState } from 'react'

const CustomCursor = () => {
  const dotRef   = useRef(null)
  const auraRef  = useRef(null)
  const posRef   = useRef({ x: 0, y: 0 })
  const auraPos  = useRef({ x: 0, y: 0 })
  const rafRef   = useRef(null)
  const [visible, setVisible] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }
    const onLeave  = () => setVisible(false)
    const onEnter  = () => setVisible(true)
    const onDown   = () => setClicked(true)
    const onUp     = () => setClicked(false)

    // detect hovering interactive elements
    const onOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, label')
      setHovered(!!el)
    }

    window.addEventListener('mousemove',   onMove,  { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown',   onDown)
    window.addEventListener('mouseup',     onUp)
    window.addEventListener('mouseover',   onOver,  { passive: true })

    // smooth aura trailing animation
    const animate = () => {
      auraPos.current.x += (posRef.current.x - auraPos.current.x) * 0.1
      auraPos.current.y += (posRef.current.y - auraPos.current.y) * 0.1

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - 5}px, ${posRef.current.y - 5}px)`
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate(${auraPos.current.x - 60}px, ${auraPos.current.y - 60}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove',   onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mousedown',   onDown)
      window.removeEventListener('mouseup',     onUp)
      window.removeEventListener('mouseover',   onOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Trailing aura — large soft blob */}
      <div
        ref={auraRef}
        className='pointer-events-none fixed top-0 left-0 z-[9990] will-change-transform'
        style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: hovered
            ? 'radial-gradient(circle, rgba(0,191,143,0.18) 0%, rgba(28,216,210,0.08) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(28,216,210,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
          filter: 'blur(16px)',
          transition: 'background 0.3s ease',
          opacity: 0.9,
        }}
      />

      {/* Sharp dot cursor */}
      <div
        ref={dotRef}
        className='pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform'
        style={{
          width: 10, height: 10,
          borderRadius: '50%',
          background: hovered
            ? 'linear-gradient(135deg, #00bf8f, #1cd8d2)'
            : clicked
              ? '#ffffff'
              : 'linear-gradient(135deg, #1cd8d2, #6366f1)',
          boxShadow: hovered
            ? '0 0 10px rgba(0,191,143,0.8), 0 0 20px rgba(0,191,143,0.4)'
            : '0 0 8px rgba(28,216,210,0.7), 0 0 16px rgba(28,216,210,0.3)',
          transform: `scale(${clicked ? 0.6 : hovered ? 1.6 : 1})`,
          transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
        }}
      />
    </>
  )
}

export default CustomCursor