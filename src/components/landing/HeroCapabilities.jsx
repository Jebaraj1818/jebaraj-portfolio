/**
 * HeroCapabilities.jsx
 *
 * Cinematic capability moments designed as editorial title moments
 * inside the magical video sequence:
 *
 * 01 - WEB DEVELOPMENT (Upper-left offset above the laptop)
 * 02 - DIGITAL EXPERIENCES (Upper-right offset framing portal)
 * 03 - E-COMMERCE SYSTEMS (Lower-left offset balancing the open book)
 * 04 - DIGITAL SOLUTIONS (Monumental title card before portal climax)
 *
 * Uses controlled asymmetry, vast negative space breathing room,
 * and pure editorial titles without explanatory SaaS sentences.
 */

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max)
}

function rng(p, lo, hi) {
  return clamp((p - lo) / (hi - lo), 0, 1)
}

/**
 * Updates capability typography styling based on the existing hero scroll progress (0 to 1).
 * Completely synchronized with ScrollTrigger with intentional quiet breathing gaps between titles.
 */
export function updateCapabilities(p, root) {
  const layer = root.querySelector('.hero-capability-layer')
  if (!layer) return

  const isReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ── MOMENT 01: WEB DEVELOPMENT (0.22 - 0.34) ──────────────────────────
  // Negative space: Upper-left above the floating laptop
  const m1 = layer.querySelector('.moment-1')
  if (m1) {
    if (p < 0.20 || p > 0.35) {
      m1.style.opacity = '0'
      m1.style.visibility = 'hidden'
    } else {
      m1.style.visibility = 'visible'
      const title = m1.querySelector('.cinematic-title')
      const meta = m1.querySelector('.moment-meta')

      if (p <= 0.31) {
        // Entrance: clip-path inset(100% 0 0 0) -> inset(0), translateY(20px) -> 0
        const enter = rng(p, 0.22, 0.25)
        m1.style.opacity = String(enter)
        if (!isReduced) {
          const y = (1 - enter) * 20
          const clip = (1 - enter) * 100
          if (title) {
            title.style.clipPath = `inset(${clip.toFixed(1)}% 0 0 0)`
            title.style.transform = `translateY(${y.toFixed(1)}px)`
          }
          if (meta) {
            meta.style.opacity = String(enter)
            meta.style.transform = `translateY(${y.toFixed(1)}px)`
          }
        }
      } else {
        // Exit: fast dissolution upward into darkness
        const exit = rng(p, 0.31, 0.34)
        m1.style.opacity = String(1 - exit)
        if (!isReduced) {
          const y = -exit * 20
          const clip = exit * 100
          if (title) {
            title.style.clipPath = `inset(0 0 ${clip.toFixed(1)}% 0)`
            title.style.transform = `translateY(${y.toFixed(1)}px)`
          }
        }
      }
    }
  }

  // ── MOMENT 02: DIGITAL EXPERIENCES (0.40 - 0.52) ──────────────────────
  // Negative space: Upper-right framing the glowing portal
  const m2 = layer.querySelector('.moment-2')
  if (m2) {
    if (p < 0.38 || p > 0.53) {
      m2.style.opacity = '0'
      m2.style.visibility = 'hidden'
    } else {
      m2.style.visibility = 'visible'
      const title = m2.querySelector('.cinematic-title')
      const meta = m2.querySelector('.moment-meta')

      if (p <= 0.49) {
        // Horizontal mask reveal while remaining almost still, subtle letter-spacing
        const enter = rng(p, 0.40, 0.43)
        m2.style.opacity = String(enter)
        if (!isReduced) {
          const clipLeft = (1 - enter) * 100
          const tracking = (1 - enter) * 0.04
          if (title) {
            title.style.clipPath = `inset(0 0 0 ${clipLeft.toFixed(1)}%)`
            title.style.letterSpacing = `calc(-0.045em + ${tracking.toFixed(3)}em)`
          }
          if (meta) {
            meta.style.opacity = String(enter)
          }
        }
      } else {
        // Exit: gentle horizontal mask close
        const exit = rng(p, 0.49, 0.52)
        m2.style.opacity = String(1 - exit)
        if (!isReduced) {
          const clipRight = exit * 100
          if (title) {
            title.style.clipPath = `inset(0 ${clipRight.toFixed(1)}% 0 0)`
          }
        }
      }
    }
  }

  // ── MOMENT 03: E-COMMERCE SYSTEMS (0.58 - 0.70) ───────────────────────
  // Negative space: Lower-left offset balancing the open book
  const m3 = layer.querySelector('.moment-3')
  if (m3) {
    if (p < 0.56 || p > 0.71) {
      m3.style.opacity = '0'
      m3.style.visibility = 'hidden'
    } else {
      m3.style.visibility = 'visible'
      const title = m3.querySelector('.cinematic-title')
      const meta = m3.querySelector('.moment-meta')

      if (p <= 0.67) {
        // Tracking contraction: letter-spacing 0.08em -> -0.02em into focus
        const enter = rng(p, 0.58, 0.61)
        m3.style.opacity = String(enter)
        if (!isReduced) {
          const trackVal = 0.08 - enter * 0.115
          if (title) {
            title.style.letterSpacing = `${trackVal.toFixed(3)}em`
          }
          if (meta) {
            meta.style.opacity = String(enter)
          }
        }
      } else {
        // Exit: subtle expansion and clean fade
        const exit = rng(p, 0.67, 0.70)
        m3.style.opacity = String(1 - exit)
        if (!isReduced) {
          const trackVal = -0.035 + exit * 0.05
          if (title) {
            title.style.letterSpacing = `${trackVal.toFixed(3)}em`
          }
        }
      }
    }
  }

  // ── MOMENT 04: DIGITAL SOLUTIONS (0.76 - 0.88) ─────────────────────────
  // Center monumental title card before the camera enters the portal
  const m4 = layer.querySelector('.moment-4')
  if (m4) {
    if (p < 0.74 || p > 0.89) {
      m4.style.opacity = '0'
      m4.style.visibility = 'hidden'
    } else {
      m4.style.visibility = 'visible'
      const title = m4.querySelector('.cinematic-title')
      const meta = m4.querySelector('.moment-meta')

      if (p <= 0.85) {
        // Slow, confident title appearance
        const enter = rng(p, 0.76, 0.80)
        m4.style.opacity = String(enter)
        if (meta) meta.style.opacity = String(enter)
      } else {
        // Disappearing cleanly as the portal vortex consumes the frame
        const exit = rng(p, 0.85, 0.88)
        m4.style.opacity = String(1 - exit)
        if (!isReduced && title) {
          const scale = 1.0 + exit * 0.03
          title.style.transform = `scale(${scale.toFixed(3)})`
        }
      }
    }
  }
}

export function HeroCapabilities() {
  return (
    <div className="hero-capability-layer" aria-hidden="true">
      {/* ── WEB DEVELOPMENT ─────────────────────────────────────── */}
      <div className="hero-capability-moment moment-1" data-moment="1">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">WEB</span>
            <span className="title-line">DEVELOPMENT</span>
          </h2>
        </div>
      </div>

      {/* ── DIGITAL EXPERIENCES ─────────────────────────────────── */}
      <div className="hero-capability-moment moment-2" data-moment="2">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">DIGITAL</span>
            <span className="title-line">EXPERIENCES</span>
          </h2>
        </div>
      </div>

      {/* ── E-COMMERCE SYSTEMS ───────────────────────────────────── */}
      <div className="hero-capability-moment moment-3" data-moment="3">
        <div className="moment-inner">
          <div className="moment-meta">
            <span className="moment-tag">COMMERCE / SYSTEMS</span>
          </div>
          <h2 className="cinematic-title">
            <span className="title-line">E-COMMERCE</span>
            <span className="title-line">SYSTEMS</span>
          </h2>
        </div>
      </div>

      {/* ── DIGITAL SOLUTIONS ───────────────────────────────────── */}
      <div className="hero-capability-moment moment-4" data-moment="4">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">DIGITAL</span>
            <span className="title-line">SOLUTIONS</span>
          </h2>
        </div>
      </div>
    </div>
  )
}
