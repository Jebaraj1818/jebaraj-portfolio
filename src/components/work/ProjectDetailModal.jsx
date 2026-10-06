import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLenis } from 'lenis/react'
import { LiquidGlassButton } from '../ui/LiquidGlassButton'

export function ProjectDetailModal({ project, isOpen, onClose }) {
  const lenis = useLenis()
  const scrollableRef = useRef(null)

  // Lock body scroll and Lenis when modal is open, and handle Escape key
  useEffect(() => {
    if (!isOpen) return

    // 1. Record current background scroll position
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0

    // 2. Stop Lenis smooth scroll
    const activeLenis = lenis || (typeof window !== 'undefined' ? window.__lenis : null)
    if (activeLenis) {
      activeLenis.stop()
    }

    // 3. Lock document and body scrolling
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverscroll = document.body.style.overscrollBehavior
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'

    // 4. Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      // Restore styles
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overscrollBehavior = originalBodyOverscroll
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll

      // Resume Lenis and restore exact scroll position
      if (activeLenis) {
        activeLenis.start()
        activeLenis.scrollTo(scrollY, { immediate: true })
      } else {
        window.scrollTo(0, scrollY)
      }

      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.update()
      }

      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, lenis])

  // Reset scroll position of modal content to top whenever opened
  useEffect(() => {
    if (isOpen && scrollableRef.current) {
      scrollableRef.current.scrollTop = 0
    }
  }, [isOpen, project])

  if (!project) return null

  // Forward wheel events over the header to the scrollable body
  const handleTopBarWheel = (e) => {
    e.stopPropagation()
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop += e.deltaY
    }
  }

  const handleModalWheel = (e) => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="project-modal-root"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          data-lenis-prevent
          onWheel={handleModalWheel}
        >
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClose}
            data-lenis-prevent
          />

          {/* Modal Container */}
          <div
            className="modal-scroll-wrapper"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            data-lenis-prevent
          >
            <motion.div
              className="modal-content-panel"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
            >
              {/* Header Bar - decorative project number removed */}
              <div className="modal-top-bar" onWheel={handleTopBarWheel}>
                <div className="modal-header-left">
                  <div className="modal-title-group">
                    <h3 id="modal-title" className="modal-main-title">{project.title}</h3>
                    <p className="modal-subtitle">{project.category} · {project.descriptor}</p>
                  </div>
                </div>

                <div className="modal-header-actions">
                  <LiquidGlassButton
                    as="a"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="sm"
                    className="modal-live-btn"
                    icon={<span className="cta-arrow" aria-hidden="true">↗</span>}
                  >
                    VIEW LIVE SITE
                  </LiquidGlassButton>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close project details"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body with Internal Scroll */}
              <div
                ref={scrollableRef}
                className="modal-body-scrollable"
                data-lenis-prevent
              >
                {/* Featured Hero Screenshot */}
                <div className="modal-hero-image-wrap">
                  <img
                    src={project.heroImage}
                    alt={`${project.title} live interface preview`}
                    className="modal-hero-image"
                    loading="lazy"
                  />
                  <div className="modal-image-caption">
                    <span className="caption-dot" style={{ backgroundColor: project.accent }} />
                    <span className="caption-text">LIVE PRODUCTION INTERFACE · {project.liveUrl}</span>
                  </div>
                </div>

                {/* Section: Project Overview */}
                <div className="modal-section">
                  <h4 className="modal-section-heading">PROJECT OVERVIEW</h4>
                  <p className="modal-overview-text">{project.overview}</p>
                </div>

                {/* Section: Core Verified Capabilities */}
                <div className="modal-section">
                  <h4 className="modal-section-heading">VERIFIED CAPABILITIES & ARCHITECTURE</h4>
                  <ul className="modal-capabilities-list">
                    {project.capabilities.map((cap, i) => (
                      <li key={i} className="capability-item">
                        <span className="capability-bullet" style={{ color: project.accent }}>—</span>
                        <span className="capability-text">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section: Technology Stack */}
                <div className="modal-section">
                  <h4 className="modal-section-heading">TECHNOLOGY STACK</h4>
                  <div className="modal-tech-tags">
                    {project.tech.map((t) => (
                      <span key={t} className="modal-tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section: Additional Real Screenshots */}
                {project.additionalImages && project.additionalImages.length > 0 && (
                  <div className="modal-section">
                    <h4 className="modal-section-heading">INTERFACE ARTIFACTS & WORKFLOW SCREENS</h4>
                    <div className="modal-gallery-grid">
                      {project.additionalImages.map((img, i) => (
                        <div key={i} className="gallery-artifact-card">
                          <img
                            src={img.url}
                            alt={img.label}
                            className="artifact-image"
                            loading="lazy"
                          />
                          <div className="artifact-label-bar">
                            <span className="artifact-dot" style={{ backgroundColor: project.accent }} />
                            <span className="artifact-label">{img.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer CTA */}
                <div className="modal-footer-cta">
                  <div className="footer-cta-info">
                    <span className="footer-cta-title">EXPLORE THE LIVE APPLICATION</span>
                    <span className="footer-cta-url">{project.liveUrl}</span>
                  </div>
                  <div className="footer-cta-buttons">
                    <LiquidGlassButton
                      as="a"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      size="md"
                      className="modal-footer-live-btn"
                      icon={<span aria-hidden="true">↗</span>}
                    >
                      LAUNCH LIVE SITE
                    </LiquidGlassButton>
                    <LiquidGlassButton
                      variant="secondary"
                      size="md"
                      className="modal-footer-close-btn"
                      onClick={onClose}
                    >
                      CLOSE
                    </LiquidGlassButton>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
