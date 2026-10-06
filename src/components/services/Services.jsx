import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * EXACTLY SIX CORE SERVICES
 * Visual-first marketing representations with dedicated imagery.
 */
const SERVICES_DATA = [
  {
    id: 'web-development',
    num: '01',
    title: 'WEB DEVELOPMENT',
    label: 'Full-Stack Engineering',
    tagline: 'High-performance web apps built with modern React, Next.js & robust architectures.',
    image: '/images/services/web-development.webp',
    isLight: true,
  },
  {
    id: 'portfolio-design',
    num: '02',
    title: 'PORTFOLIO DESIGN',
    label: 'Creative Direction & Personal Brand',
    tagline: 'Distinctive personal websites with bespoke editorial design and cinematic interaction.',
    image: '/images/services/portfolio-design.webp',
    isLight: false,
  },
  {
    id: 'ats-resumes',
    num: '03',
    title: 'ATS-FRIENDLY RESUMES',
    label: 'Executive Career Products',
    tagline: 'Cleanly structured, machine-parseable resumes engineered to pass recruiter algorithms.',
    image: '/images/services/ats-resumes.webp',
    isLight: false,
  },
  {
    id: 'ecommerce',
    num: '04',
    title: 'E-COMMERCE WEBSITES',
    label: 'Custom Storefronts & Checkout',
    tagline: 'Complete online stores featuring seamless catalogs, cart flows & Razorpay integration.',
    image: '/images/services/ecommerce.webp',
    isLight: false,
  },
  {
    id: 'digital-solutions',
    num: '05',
    title: 'DIGITAL SOLUTIONS',
    label: 'Custom Systems & Automation',
    tagline: 'Bespoke software systems, workflow pipelines, and tailored business integrations.',
    image: '/images/services/digital-solutions.webp',
    isLight: false,
  },
  {
    id: 'admin-panels',
    num: '06',
    title: 'BUSINESS ADMIN PANELS',
    label: 'Enterprise Control Dashboards',
    tagline: 'Secure operational portals with live analytics, data tables, and management controls.',
    image: '/images/services/admin-panels.webp',
    isLight: false,
  },
]

/**
 * Helper to compute 3D fan/arc layout transforms based on circular offset
 * Refined perspective geometry: preserves recognizable, sharp artwork without trapezoidal distortion
 */
function getFanTransform(offset, isMobile) {
  if (isMobile) {
    if (offset === 0) {
      return {
        x: 0,
        y: 0,
        rotateZ: 0,
        rotateY: 0,
        scale: 1,
        zIndex: 10,
        opacity: 1,
        pointerEvents: 'auto',
      }
    }
    if (offset === -1) {
      return {
        x: -94,
        y: 10,
        rotateZ: -4,
        rotateY: 6,
        scale: 0.84,
        zIndex: 8,
        opacity: 0.82,
        pointerEvents: 'auto',
      }
    }
    if (offset === 1) {
      return {
        x: 94,
        y: 10,
        rotateZ: 4,
        rotateY: -6,
        scale: 0.84,
        zIndex: 8,
        opacity: 0.82,
        pointerEvents: 'auto',
      }
    }
    if (offset === -2) {
      return {
        x: -168,
        y: 24,
        rotateZ: -8,
        rotateY: 10,
        scale: 0.70,
        zIndex: 6,
        opacity: 0.45,
        pointerEvents: 'auto',
      }
    }
    if (offset === 2) {
      return {
        x: 168,
        y: 24,
        rotateZ: 8,
        rotateY: -10,
        scale: 0.70,
        zIndex: 6,
        opacity: 0.45,
        pointerEvents: 'auto',
      }
    }
    return {
      x: 0,
      y: 45,
      rotateZ: 0,
      rotateY: 0,
      scale: 0.55,
      zIndex: 2,
      opacity: 0,
      pointerEvents: 'none',
    }
  }

  // Desktop Fan Geometry - Shallow, natural arc with crisp, legible poster transforms
  if (offset === 0) {
    return {
      x: 0,
      y: 0,
      rotateZ: 0,
      rotateY: 0,
      scale: 1.05,
      zIndex: 10,
      opacity: 1,
      pointerEvents: 'auto',
    }
  }
  if (offset === -1) {
    return {
      x: -245,
      y: 16,
      rotateZ: -6,
      rotateY: 8,
      scale: 0.90,
      zIndex: 8,
      opacity: 0.88,
      pointerEvents: 'auto',
    }
  }
  if (offset === 1) {
    return {
      x: 245,
      y: 16,
      rotateZ: 6,
      rotateY: -8,
      scale: 0.90,
      zIndex: 8,
      opacity: 0.88,
      pointerEvents: 'auto',
    }
  }
  if (offset === -2) {
    return {
      x: -440,
      y: 44,
      rotateZ: -12,
      rotateY: 14,
      scale: 0.78,
      zIndex: 6,
      opacity: 0.70,
      pointerEvents: 'auto',
    }
  }
  if (offset === 2) {
    return {
      x: 440,
      y: 44,
      rotateZ: 12,
      rotateY: -14,
      scale: 0.78,
      zIndex: 6,
      opacity: 0.70,
      pointerEvents: 'auto',
    }
  }
  // Offset 3 (apex/back position)
  return {
    x: 0,
    y: 80,
    rotateZ: 0,
    rotateY: 0,
    scale: 0.6,
    zIndex: 2,
    opacity: 0,
    pointerEvents: 'none',
  }
}

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef(null)
  const headerRef = useRef(null)

  const total = SERVICES_DATA.length

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Editorial header entrance animation with masked reveal sequence
  useEffect(() => {
    const section = sectionRef.current
    const header = headerRef.current
    if (!section || !header) return

    const kicker = header.querySelector('.services-meta-kicker')
    const wordWhatI = header.querySelector('.word-what-i')
    const wordBuild = header.querySelector('.word-build')
    const introText = header.querySelector('.services-section-intro')

    const ctx = gsap.context(() => {
      // 1. Entrance timeline triggered as the section enters the viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'bottom top',
          toggleActions: 'restart reset restart reset',
        },
      })

      // Step 1: Section label subtle reveal & tracking settle
      tl.fromTo(
        kicker,
        {
          opacity: 0,
          y: 14,
          letterSpacing: '0.36em',
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.24em',
          duration: 0.6,
          ease: 'power2.out',
        }
      )
        // Step 2: "WHAT I" vertical masked reveal
        .fromTo(
          wordWhatI,
          {
            yPercent: 120,
            opacity: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)',
          },
          {
            yPercent: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            duration: 0.85,
            ease: 'power3.out',
          },
          '-=0.25'
        )
        // Step 3: "BUILD." enters a fraction later with tracking compression & clip-path reveal
        .fromTo(
          wordBuild,
          {
            yPercent: 115,
            opacity: 0,
            scale: 0.96,
            letterSpacing: '0.04em',
            clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)',
          },
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            letterSpacing: '-0.055em',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.55'
        )
        // Step 4: Subtitle rises and fades in smoothly afterward
        .fromTo(
          introText,
          {
            opacity: 0,
            y: 16,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
          },
          '-=0.35'
        )

      // 2. Extremely subtle scroll-linked parallax micro-motion
      gsap.to(header, {
        y: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const nextService = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevService = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Drag / Swipe Pointer Tracking (Horizontal ONLY - Never hijacks vertical scroll)
  const pointerStartX = useRef(0)
  const pointerStartY = useRef(0)
  const isTracking = useRef(false)
  const isHorizontalGesture = useRef(null)

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    pointerStartX.current = e.clientX
    pointerStartY.current = e.clientY
    isTracking.current = true
    isHorizontalGesture.current = null
  }

  const handlePointerMove = (e) => {
    if (!isTracking.current) return
    const deltaX = e.clientX - pointerStartX.current
    const deltaY = e.clientY - pointerStartY.current

    if (isHorizontalGesture.current === null) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
          isHorizontalGesture.current = true
        } else {
          // Vertical movement dominates: release tracking completely so native page scrolling proceeds
          isHorizontalGesture.current = false
          isTracking.current = false
        }
      }
    }
  }

  const handlePointerUp = (e) => {
    if (!isTracking.current) return
    isTracking.current = false

    if (isHorizontalGesture.current === true) {
      const deltaX = e.clientX - pointerStartX.current
      const threshold = 35
      if (deltaX < -threshold) {
        nextService()
      } else if (deltaX > threshold) {
        prevService()
      }
    }
    isHorizontalGesture.current = null
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      nextService()
    } else if (e.key === 'ArrowLeft') {
      prevService()
    }
  }

  const currentService = SERVICES_DATA[activeIndex]

  return (
    <section
      id="services"
      className="section-services"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Capabilities and Services Gallery"
    >
      <div className="services-container">
        {/* Editorial Section Header */}
        <div className="services-section-header" ref={headerRef}>
          <div className="services-meta-kicker">
            <span className="kicker-label">CAPABILITIES</span>
          </div>

          <h2 className="services-title-wrap" aria-label="What I Build.">
            <span className="title-word-mask mask-what-i">
              <span className="title-word word-what-i">WHAT I</span>
            </span>
            <span className="title-word-mask mask-build">
              <span className="title-word word-build">
                BUILD<span className="title-period">.</span>
              </span>
            </span>
          </h2>

          <p className="services-section-intro">
            Digital products, websites and systems built for real-world use.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
           CINEMATIC SERVICE FAN GALLERY
           Arranged along a shallow half-circle arc in 3D perspective
           ═══════════════════════════════════════════════════════ */}
        <div
          className="service-fan-wrapper"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="service-fan-stage">
            {SERVICES_DATA.map((service, idx) => {
              // Calculate circular offset from activeIndex: [-2, -1, 0, 1, 2, 3]
              let offset = idx - activeIndex
              while (offset > 3) offset -= total
              while (offset < -2) offset += total

              const transform = getFanTransform(offset, isMobile)
              const isActive = offset === 0

              return (
                <motion.div
                  key={service.id}
                  className={`fan-service-card ${isActive ? 'is-active' : ''} ${service.isLight ? 'is-light-theme' : 'is-dark-theme'}`}
                  animate={{
                    x: transform.x,
                    y: transform.y,
                    rotateZ: transform.rotateZ,
                    rotateY: transform.rotateY,
                    scale: transform.scale,
                    opacity: transform.opacity,
                    zIndex: transform.zIndex,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    pointerEvents: transform.pointerEvents,
                  }}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${service.title} - ${service.label}`}
                >
                  <div className="card-visual-wrapper">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="card-visual-img"
                      draggable={false}
                      loading="eager"
                      decoding="async"
                      width="1856"
                      height="2304"
                    />

                    {/* Clean Banner Soft Scrim for Typographic Legibility */}
                    <div className="card-scrim-gradient" aria-hidden="true" />

                    {/* Top Meta Indicator */}
                    <div className="card-meta-header">
                      <span className="card-status-dot" aria-hidden="true" />
                    </div>

                    {/* Integrated Service Title & Minimal Subtitle */}
                    <div className="card-content-footer">
                      <span className="card-category-label">{service.label}</span>
                      <h3 className="card-service-title">{service.title}</h3>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
           ACTIVE SERVICE TAGLINE / READOUT
           Clean transition without numerical/navigation controls
           ═══════════════════════════════════════════════════════ */}
        <div className="fan-controls-panel">
          <div className="active-service-readout">
            <span className="readout-tagline">{currentService.tagline}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
