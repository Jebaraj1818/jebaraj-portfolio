import { useEffect, useRef } from 'react'

/**
 * Lightweight canvas-based ambient particle system.
 * Particles drift slowly upward with subtle glow — cinematic starfield feel.
 * Opacity is driven externally via a CSS var or direct style updates.
 */
export function ParticleCanvas({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    let W = 0, H = 0
    const PARTICLE_COUNT = 90

    class Particle {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x = Math.random() * W
        this.y = initial ? Math.random() * H : H + 8
        this.r = Math.random() * 1.4 + 0.3
        this.vx = (Math.random() - 0.5) * 0.18
        this.vy = -(Math.random() * 0.32 + 0.08)
        // Cyan/white mix
        const isCyan = Math.random() > 0.35
        this.color = isCyan
          ? `rgba(${72 + Math.random() * 60 | 0}, ${230 + Math.random() * 25 | 0}, ${255}, ${Math.random() * 0.55 + 0.12})`
          : `rgba(255, 255, 255, ${Math.random() * 0.32 + 0.06})`
        this.glow = isCyan
      }
    }

    let particles = []

    function resize() {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * Math.min(window.devicePixelRatio, 2)
      canvas.height = H * Math.min(window.devicePixelRatio, 2)
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2))
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle())
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) p.reset()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        if (p.glow) {
          ctx.shadowBlur = 8
          ctx.shadowColor = 'rgba(0,229,255,0.55)'
        } else {
          ctx.shadowBlur = 0
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }
      animId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`particle-canvas ${className}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
