/**
 * HeroCapabilities.jsx
 *
 * Cinematic capability moments designed as editorial title moments
 * inside the magical video sequence:
 *
 * 01 - PYTHON / DEVELOPMENT (Upper-left offset above the laptop)
 * 02 - FULL-STACK / APPLICATIONS (Upper-right offset framing portal)
 * 03 - DATA / ANALYTICS (Lower-left offset balancing the open book)
 * 04 - GENERATIVE / AI (Lower-right offset)
 * 05 - BUSINESS / TECHNOLOGY (Monumental center title card before portal climax)
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

  // ── MOMENT 01: PYTHON / DEVELOPMENT (0.18 - 0.30) ──────────────────────────
  // Upper-left above the floating laptop
  const m1 = layer.querySelector('.moment-1')
  if (m1) {
    if (p < 0.16 || p > 0.31) {
      m1.style.opacity = '0'
      m1.style.visibility = 'hidden'
    } else {
      m1.style.visibility = 'visible'
      const title = m1.querySelector('.cinematic-title')
      const meta = m1.querySelector('.moment-meta')

      if (p <= 0.27) {
        const enter = rng(p, 0.18, 0.22)
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
        const exit = rng(p, 0.27, 0.30)
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

  // ── MOMENT 02: FULL-STACK / APPLICATIONS (0.32 - 0.44) ──────────────────────
  // Upper-right framing the glowing portal
  const m2 = layer.querySelector('.moment-2')
  if (m2) {
    if (p < 0.30 || p > 0.45) {
      m2.style.opacity = '0'
      m2.style.visibility = 'hidden'
    } else {
      m2.style.visibility = 'visible'
      const title = m2.querySelector('.cinematic-title')
      const meta = m2.querySelector('.moment-meta')

      if (p <= 0.41) {
        const enter = rng(p, 0.32, 0.36)
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
        const exit = rng(p, 0.41, 0.44)
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

  // ── MOMENT 03: DATA / ANALYTICS (0.46 - 0.58) ───────────────────────
  // Lower-left offset balancing the open book
  const m3 = layer.querySelector('.moment-3')
  if (m3) {
    if (p < 0.44 || p > 0.59) {
      m3.style.opacity = '0'
      m3.style.visibility = 'hidden'
    } else {
      m3.style.visibility = 'visible'
      const title = m3.querySelector('.cinematic-title')
      const meta = m3.querySelector('.moment-meta')

      if (p <= 0.55) {
        const enter = rng(p, 0.46, 0.50)
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
        const exit = rng(p, 0.55, 0.58)
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

  // ── MOMENT 04: GENERATIVE / AI (0.60 - 0.72) ─────────────────────────
  // Lower-right offset
  const m4 = layer.querySelector('.moment-4')
  if (m4) {
    if (p < 0.58 || p > 0.73) {
      m4.style.opacity = '0'
      m4.style.visibility = 'hidden'
    } else {
      m4.style.visibility = 'visible'
      const title = m4.querySelector('.cinematic-title')
      const meta = m4.querySelector('.moment-meta')

      if (p <= 0.69) {
        const enter = rng(p, 0.60, 0.64)
        m4.style.opacity = String(enter)
        if (!isReduced) {
          const clipLeft = (1 - enter) * 100
          if (title) {
            title.style.clipPath = `inset(0 0 0 ${clipLeft.toFixed(1)}%)`
          }
          if (meta) {
            meta.style.opacity = String(enter)
          }
        }
      } else {
        const exit = rng(p, 0.69, 0.72)
        m4.style.opacity = String(1 - exit)
        if (!isReduced) {
          const clipRight = exit * 100
          if (title) {
            title.style.clipPath = `inset(0 ${clipRight.toFixed(1)}% 0 0)`
          }
        }
      }
    }
  }

  // ── MOMENT 05: BUSINESS / TECHNOLOGY (0.74 - 0.88) ─────────────────────
  // Center monumental title card before the camera enters the portal
  const m5 = layer.querySelector('.moment-5')
  if (m5) {
    if (p < 0.72 || p > 0.89) {
      m5.style.opacity = '0'
      m5.style.visibility = 'hidden'
    } else {
      m5.style.visibility = 'visible'
      const title = m5.querySelector('.cinematic-title')
      const meta = m5.querySelector('.moment-meta')

      if (p <= 0.84) {
        const enter = rng(p, 0.74, 0.78)
        m5.style.opacity = String(enter)
        if (meta) meta.style.opacity = String(enter)
      } else {
        const exit = rng(p, 0.84, 0.88)
        m5.style.opacity = String(1 - exit)
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
      {/* ── MOMENT 01: PYTHON / DEVELOPMENT ─────────────────────── */}
      <div className="hero-capability-moment moment-1" data-moment="1">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">PYTHON</span>
            <span className="title-line">DEVELOPMENT</span>
          </h2>
        </div>
      </div>

      {/* ── MOMENT 02: FULL-STACK / APPLICATIONS ─────────────────── */}
      <div className="hero-capability-moment moment-2" data-moment="2">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">FULL-STACK</span>
            <span className="title-line">APPLICATIONS</span>
          </h2>
        </div>
      </div>

      {/* ── MOMENT 03: DATA / ANALYTICS ──────────────────────────── */}
      <div className="hero-capability-moment moment-3" data-moment="3">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">DATA</span>
            <span className="title-line">ANALYTICS</span>
          </h2>
        </div>
      </div>

      {/* ── MOMENT 04: GENERATIVE / AI ───────────────────────────── */}
      <div className="hero-capability-moment moment-4" data-moment="4">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">GENERATIVE</span>
            <span className="title-line">AI</span>
          </h2>
        </div>
      </div>

      {/* ── MOMENT 05: BUSINESS / TECHNOLOGY ─────────────────────── */}
      <div className="hero-capability-moment moment-5" data-moment="5">
        <div className="moment-inner">
          <div className="moment-meta" />
          <h2 className="cinematic-title">
            <span className="title-line">BUSINESS</span>
            <span className="title-line">TECHNOLOGY</span>
          </h2>
        </div>
      </div>
    </div>
  )
}
