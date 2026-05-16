"use client";
import React, { useEffect, useRef } from 'react'

const ParticlesBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    let mouse = { x: null, y: null, radius: 140 }
    let animationId

    const COLORS = [
      'rgba(28, 216, 210,',   // teal
      'rgba(0, 191, 143,',    // emerald
      'rgba(99, 102, 241,',   // indigo
      'rgba(168, 85, 247,',   // purple
      'rgba(255, 255, 255,',  // white
    ]
    const COUNT = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 14000))
    const MAX_DIST = 130
    const MOUSE_REPEL = 100

    class Particle {
      constructor() { this.reset(true) }

      reset(randomY = false) {
        this.x       = Math.random() * canvas.width
        this.y       = randomY ? Math.random() * canvas.height : canvas.height + 10
        this.baseX   = this.x
        this.baseY   = this.y
        this.radius  = Math.random() * 1.8 + 0.4
        this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)]
        this.opacity = Math.random() * 0.5 + 0.2
        this.speedX  = (Math.random() - 0.5) * 0.35
        this.speedY  = (Math.random() - 0.5) * 0.35
        this.pulse   = Math.random() * Math.PI * 2   // phase for pulsing
        this.pulseSpeed = 0.012 + Math.random() * 0.018
      }

      draw() {
        const glow = this.radius * 3
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glow)
        grad.addColorStop(0,   `${this.colorBase}${this.opacity})`)
        grad.addColorStop(0.5, `${this.colorBase}${this.opacity * 0.4})`)
        grad.addColorStop(1,   `${this.colorBase}0)`)
        ctx.beginPath()
        ctx.arc(this.x, this.y, glow, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
        // solid core
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${this.colorBase}${Math.min(this.opacity + 0.3, 1)})`
        ctx.fill()
      }

      update() {
        this.pulse += this.pulseSpeed
        this.opacity = 0.15 + Math.abs(Math.sin(this.pulse)) * 0.45

        // mouse repel
        if (mouse.x !== null) {
          const dx = this.x - mouse.x
          const dy = this.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_REPEL) {
            const force = (MOUSE_REPEL - dist) / MOUSE_REPEL
            this.x += (dx / dist) * force * 2.5
            this.y += (dy / dist) * force * 2.5
          } else {
            // drift back to base
            this.x += (this.baseX - this.x) * 0.03
            this.y += (this.baseY - this.y) * 0.03
          }
        }

        this.baseX += this.speedX
        this.baseY += this.speedY

        if (this.baseX < 0) this.baseX = canvas.width
        if (this.baseX > canvas.width) this.baseX = 0
        if (this.baseY < 0) this.baseY = canvas.height
        if (this.baseY > canvas.height) this.baseY = 0

        this.draw()
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18
            // blend colors of the two particles
            ctx.beginPath()
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, `${a.colorBase}${alpha})`)
            grad.addColorStop(1, `${b.colorBase}${alpha})`)
            ctx.strokeStyle = grad
            ctx.lineWidth = 0.6
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    function drawMouseAura() {
      if (mouse.x === null) return
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius)
      grad.addColorStop(0,   'rgba(28,216,210,0.06)')
      grad.addColorStop(0.5, 'rgba(0,191,143,0.03)')
      grad.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particles = Array.from({ length: COUNT }, () => new Particle())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawMouseAura()
      drawConnections()
      particles.forEach(p => p.update())
      animationId = requestAnimationFrame(animate)
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onMouseLeave = () => { mouse.x = null; mouse.y = null }
    const onTouchMove  = (e) => {
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }

    resize()
    window.addEventListener('resize',     resize)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchmove',  onTouchMove, { passive: true })
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize',     resize)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className='fixed top-0 left-0 w-full h-full pointer-events-none z-0'
    />
  )
}

export default ParticlesBackground