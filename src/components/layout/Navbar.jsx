import { useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { LiquidGlassButton } from '../ui/LiquidGlassButton'

export function Navbar() {
  const lenis = useLenis()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-nav-active')
      lenis?.stop()
    } else {
      document.body.classList.remove('mobile-nav-active')
      lenis?.start()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('mobile-nav-active')
      lenis?.start()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen, lenis])

  const navTo = (hash) => {
    setMobileMenuOpen(false)
    document.body.classList.remove('mobile-nav-active')
    if (lenis) {
      lenis.start()
      lenis.scrollTo(hash, { duration: 1.4 })
    } else {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${mobileMenuOpen ? 'has-mobile-open' : ''}`}>
      <div className="nav-container">

        {/* Brand */}
        <button
          type="button"
          className="nav-brand"
          onClick={() => navTo('#hero')}
          aria-label="Jebaraj.P - Top"
        >
          <span className="brand-text">JEBARAJ</span>
          <span className="brand-dot">.P</span>
        </button>

        {/* Subtle Freelance Indicator */}
        <div className="nav-status" title="Current freelance capacity">
          <span className="status-ping" aria-hidden="true" />
          <span className="status-text">AVAILABLE FOR FREELANCE</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links" aria-label="Main menu">
          <button type="button" onClick={() => navTo('#about')}>
            <span>ABOUT</span>
          </button>
          <button type="button" onClick={() => navTo('#work')}>
            <span>WORK</span>
          </button>
          <button type="button" onClick={() => navTo('#services')}>
            <span>SERVICES</span>
          </button>
          <button type="button" onClick={() => navTo('#skills')}>
            <span>SKILLS</span>
          </button>
          <button type="button" onClick={() => navTo('#contact')}>
            <span>CONTACT</span>
          </button>
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="nav-actions">
          <LiquidGlassButton
            variant="primary"
            size="sm"
            className="nav-cta-btn"
            onClick={() => navTo('#contact')}
            icon={<span className="cta-arrow" aria-hidden="true">↗</span>}
          >
            WORK WITH ME
          </LiquidGlassButton>

          <button
            type="button"
            className={`nav-mobile-toggle ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span />
            <span />
          </button>
        </div>

      </div>

      {/* Mobile Menu Full-Screen Opaque Overlay */}
      <div
        className={`nav-mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
        id="mobile-nav-menu"
      >
        <nav className="mobile-menu-inner" aria-label="Mobile Navigation">
          <button type="button" onClick={() => navTo('#about')}>
            ABOUT
          </button>
          <button type="button" onClick={() => navTo('#work')}>
            WORK
          </button>
          <button type="button" onClick={() => navTo('#services')}>
            SERVICES
          </button>
          <button type="button" onClick={() => navTo('#skills')}>
            SKILLS
          </button>
          <button type="button" onClick={() => navTo('#contact')}>
            CONTACT
          </button>
        </nav>
      </div>
    </header>
  )
}
