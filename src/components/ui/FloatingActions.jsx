import { useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa6'

export function FloatingActions() {
  const lenis = useLenis()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      // Reveal scroll-to-top only after visitor has scrolled past ~550px
      setShowScrollTop(scrollY > 550)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <aside className="floating-actions" aria-label="Floating quick actions">
      {/* ── Scroll-to-Top Button (Smoked Glass + Subtle Crimson Rim) ── */}
      <button
        type="button"
        className={`floating-scroll-top ${showScrollTop ? 'is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        tabIndex={showScrollTop ? 0 : -1}
      >
        <FaArrowUp className="scroll-top-arrow" aria-hidden="true" />
      </button>

      {/* ── Fiery Crimson Energy Orb (Floating WhatsApp) ───────────── */}
      <a
        href="/whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-orb"
        aria-label="Chat on WhatsApp"
      >
        {/* Layer 1: Ambient outer flame glow / pulse */}
        <span className="orb-fire-aura" aria-hidden="true" />
        {/* Layer 2: Conic rotating fiery refraction sweep */}
        <span className="orb-fire-swirl" aria-hidden="true" />
        {/* Layer 3: Deep crimson / magma energy core */}
        <span className="orb-fire-core" aria-hidden="true" />
        {/* Layer 4: Convex glass specular rim Catching light */}
        <span className="orb-fire-specular" aria-hidden="true" />
        {/* Center: Recognizable White WhatsApp Icon */}
        <span className="orb-icon-wrapper" aria-hidden="true">
          <FaWhatsapp className="whatsapp-icon" />
        </span>
        {/* Desktop Hover Tooltip */}
        <span className="orb-tooltip" role="tooltip">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  )
}
