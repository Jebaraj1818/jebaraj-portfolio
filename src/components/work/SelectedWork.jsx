import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProjectDetailModal } from './ProjectDetailModal'
import { LiquidGlassButton } from '../ui/LiquidGlassButton'

gsap.registerPlugin(ScrollTrigger)

/**
 * EXACTLY THREE REAL PROJECTS (No 4th project, no fake projects)
 * Real live deployments on Vercel with authentic captured screenshots.
 */
const PROJECTS = [
  {
    id: 'datamind-ai',
    num: '01',
    title: 'DataMind AI',
    descriptor: 'Universal Data Intelligence Platform',
    category: 'AI · Data Analytics · Full Stack',
    domain: 'datamind-ai-gamma.vercel.app',
    liveUrl: 'https://datamind-ai-gamma.vercel.app/',
    heroImage: '/projects/datamind/hero.png',
    keyTech: ['React · Vite', 'Python · Flask', 'Gemini AI', 'Pandas · NumPy'],
    shortDesc:
      'Automated data intelligence and profiling platform built with React, Vite, and Python/Flask. Ingests CSV datasets to generate statistical profiles, data-quality diagnostics, and intelligent chart recommendations, augmented by Google Gemini AI.',
    additionalImages: [
      {
        url: '/projects/datamind/features.png',
        label: 'Automated Data Profiling & Statistical Diagnostics',
      },
      {
        url: '/projects/datamind/analytics.png',
        label: 'Intelligent Visualization & Quality Metrics',
      },
    ],
    overview:
      'DataMind AI is an automated data intelligence and profiling platform built with a React and Vite frontend and a Python/Flask analytical backend. It ingests dataset-agnostic CSV files to automatically generate comprehensive statistical profiles, evaluate data quality, and recommend optimal visualizations, augmented by an AI dataset assistant powered by the Google Gemini API.',
    capabilities: [
      'Automatic data profiling and statistical distribution summary for arbitrary CSV datasets',
      'Data-quality analysis: missing-value detection, type inference, and outlier analysis',
      'Intelligent visualization engine with automatic chart type recommendations',
      'AI Dataset Assistant powered by Google Gemini API for natural-language dataset queries',
      'Correlation matrices, trend analysis, and categorical segmentation',
      'Automated executive PDF summary report generation with ReportLab',
      'Dataset-agnostic architecture deployed on Vercel with REST backend architecture',
    ],
    tech: [
      'Python',
      'Flask',
      'React',
      'Vite',
      'Google Gemini API',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'ReportLab',
      'REST APIs',
      'Vercel',
      'Git',
    ],
    accent: '#ff334b',
    visualTag: 'AI DATA PROFILING & GEMINI',
  },
  {
    id: 'doddle-bags',
    num: '02',
    title: 'Doddle Bags',
    descriptor: 'E-commerce Platform',
    category: 'Full Stack · E-commerce · Payments',
    domain: 'doddle-bags.vercel.app',
    liveUrl: 'https://doddle-bags.vercel.app/',
    heroImage: '/projects/doddle/hero.png',
    keyTech: ['Python · Flask', 'MySQL', 'Razorpay', 'JavaScript'],
    shortDesc:
      'Full-stack e-commerce system built for handcrafted bags and carry gear. Features responsive product discovery, persistent wishlist and cart, user authentication, multi-step checkout, and real-time Razorpay payment gateway integration.',
    additionalImages: [
      {
        url: '/projects/doddle/products.png',
        label: 'Curated Catalog & Category Filtering Engine',
      },
      {
        url: '/projects/doddle/details.png',
        label: 'Product Details, Specifications & Purchase Funnel',
      },
    ],
    overview:
      'Doddle Bags is a full-featured e-commerce platform engineered for handcrafted luxury bags and everyday carry gear. The system implements a complete customer shopping journey from responsive catalog discovery and wishlist management to multi-step checkout, real-time Razorpay payment integration, and administrative inventory management.',
    capabilities: [
      'Responsive e-commerce interface with instant product browsing and category filtering',
      'Customer registration, authentication, session management, and password recovery',
      'Persistent wishlist and dynamic shopping cart with live total calculations',
      'Multi-address delivery management and structured checkout funnel',
      'Secure online payment processing via Razorpay payment gateway integration',
      'Customer order management, order tracking, and automated confirmation notifications',
      'Admin dashboard with role-based authorization for catalog and inventory oversight',
      'Production security configurations, input sanitization, and SQL relational data modeling',
    ],
    tech: [
      'Python',
      'Flask',
      'MySQL',
      'JavaScript',
      'Razorpay',
      'HTML5 / CSS3',
      'REST APIs',
      'Vercel',
    ],
    accent: '#00e5ff',
    visualTag: 'COMMERCE ARCHITECTURE & RAZORPAY',
  },
  {
    id: 'transit-story',
    num: '03',
    title: 'The Transit Story',
    descriptor: 'Travel & Tour Experience Platform',
    category: 'Travel · Web Experience · Full Stack',
    domain: 'transit-story.vercel.app',
    liveUrl: 'https://transit-story.vercel.app/',
    heroImage: '/projects/transit/hero.png',
    keyTech: ['React · Vite', 'Modern CSS3', 'Itineraries', 'Vercel'],
    shortDesc:
      'Editorial travel and tour experience platform showcasing curated expeditions and destination discovery. Implements structured day-by-day itineraries, visual travel narratives, and mobile-first booking inquiry workflows.',
    additionalImages: [
      {
        url: '/projects/transit/journeys.png',
        label: 'Curated Tour Packages & Expedition Itineraries',
      },
      {
        url: '/projects/transit/experience.png',
        label: 'Destination Discovery & Cultural Storytelling',
      },
    ],
    overview:
      'The Transit Story is a curated travel and tour experience platform designed to inspire seamless journeys through visual destination discovery, editorial itinerary storytelling, and direct tour reservation flows. The interface presents immersive expedition packages with structured trip highlights, cultural narratives, and responsive mobile-first booking arrangements.',
    capabilities: [
      'Curated tour package showcase with destination highlights and difficulty ratings',
      'Editorial itinerary storytelling detailing day-by-day expedition schedules',
      'Interactive destination discovery with category-based trip filtering',
      'Direct tour booking and inquiry workflow for custom journey planning',
      'Fluid responsive layout optimized for mobile travel research and desktop exploration',
      'High-performance editorial layout with rich typography and micro-interactions',
    ],
    tech: [
      'React',
      'Vite',
      'JavaScript',
      'CSS3 Modern Layout',
      'Responsive Systems',
      'Vercel',
    ],
    accent: '#e0c068',
    visualTag: 'TRAVEL STORYTELLING & ITINERARIES',
  },
]

// Motion switch animation: scale(1.02) opacity(0) -> scale(1) opacity(1) -> scale(0.96) opacity(0)
const cardMotionVariants = {
  enter: (direction) => ({
    scale: 1.02,
    opacity: 0,
  }),
  center: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction) => ({
    scale: 0.96,
    opacity: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export function SelectedWork() {
  const sectionRef = useRef(null)
  const introRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [modalProject, setModalProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pointer drag/swipe tracking
  const pointerStartX = useRef(0)
  const pointerStartY = useRef(0)
  const isTracking = useRef(false)
  const isHorizontalGesture = useRef(null)

  const total = PROJECTS.length

  const goToProject = useCallback(
    (index) => {
      setDirection(index >= activeIndex ? 1 : -1)
      setActiveIndex((index + total) % total)
    },
    [activeIndex, total]
  )

  const nextProject = useCallback(() => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevProject = useCallback(() => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const openDetails = useCallback((project) => {
    setModalProject(project)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (isModalOpen) return
      if (e.key === 'ArrowRight') {
        nextProject()
      } else if (e.key === 'ArrowLeft') {
        prevProject()
      }
    },
    [isModalOpen, nextProject, prevProject]
  )

  // Drag / Swipe Pointer Handlers (Horizontal only; NEVER hijacks vertical scrolling)
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
          // Vertical movement: release tracking completely so vertical page scrolling flows naturally
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
      const threshold = 40
      if (deltaX < -threshold) {
        nextProject()
      } else if (deltaX > threshold) {
        prevProject()
      }
    }

    isHorizontalGesture.current = null
  }

  // Typographic entrance via Section-Scoped ScrollTrigger
  useEffect(() => {
    const introEl = introRef.current
    const sectionEl = sectionRef.current
    if (!introEl || !sectionEl) return

    const kicker = introEl.querySelector('.intro-meta-kicker')
    const wordSelected = introEl.querySelector('.word-selected')
    const wordWork = introEl.querySelector('.word-work')
    const statement = introEl.querySelector('.work-intro-statement')

    const ctx = gsap.context(() => {
      // Set strict initial idle states (completely hidden while About is in view)
      gsap.set(kicker, { opacity: 0, y: 16 })
      gsap.set(wordSelected, {
        yPercent: 115,
        opacity: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)',
      })
      gsap.set(wordWork, {
        yPercent: 115,
        opacity: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)',
      })
      gsap.set(statement, { opacity: 0, y: 18 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 75%',
          end: 'bottom top',
          toggleActions: 'restart reset restart reset',
        },
      })

      // Meta kicker reveals
      tl.to(
        kicker,
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: 0.5,
        }
      )
        // "SELECTED" reveals with upward clip-path mask
        .to(
          wordSelected,
          {
            yPercent: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            ease: 'power3.out',
            duration: 0.7,
          },
          '-=0.3'
        )
        // "WORK." follows closely with upward clip-path mask
        .to(
          wordWork,
          {
            yPercent: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            ease: 'power3.out',
            duration: 0.7,
          },
          '-=0.5'
        )
        // Supporting intro statement reveals
        .to(
          statement,
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.55,
          },
          '-=0.35'
        )
    }, sectionEl)

    return () => ctx.revert()
  }, [])

  const currentProject = PROJECTS[activeIndex]
  const prevProjectData = PROJECTS[(activeIndex - 1 + total) % total]
  const nextProjectData = PROJECTS[(activeIndex + 1) % total]

  return (
    <section
      id="work"
      className="selected-work"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Selected Work Section"
    >
      <div className="selected-work-container">
        {/* ═══════════════════════════════════════════════════════
           1. SECTION HEADER (KICKER, MEGA HEADING, SUBTITLE, TABS)
           ═══════════════════════════════════════════════════════ */}
        <div className="selected-work-header" ref={introRef}>
          <div className="intro-meta-kicker">
            <span className="intro-kicker-label">THE WORK</span>
          </div>

          <div className="work-mega-heading-wrap" aria-label="The Work">
            <div className="mega-word-mask">
              <h2 className="mega-word word-selected">THE</h2>
            </div>
            <div className="mega-word-mask">
              <h2 className="mega-word word-work">
                WORK<span className="mega-period">.</span>
              </h2>
            </div>
          </div>

          <div className="work-intro-statement">
            <p className="intro-statement-text">
              A selection of digital products and web experiences, built with intention from interface to implementation.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
           2. CENTERED VERTICAL GALLERY STAGE
           Active project strictly centered with 4:5 aspect ratio.
           Neighbors absolutely positioned without pushing center.
           ═══════════════════════════════════════════════════════ */}
        <div
          className="selected-work-gallery"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="gallery-stage">
            {/* Previous Neighbor (Absolute Left, Decorative & Clickable) */}
            <div
              className="gallery-neighbor neighbor-prev"
              onClick={prevProject}
              role="button"
              tabIndex={0}
              aria-label={`Previous project: ${prevProjectData.title}`}
            >
              <div className="neighbor-preview-card">
                <div className="neighbor-chrome">
                  <span className="n-dot" />
                  <span className="n-dot" />
                  <span className="n-dot" />
                </div>
                <div className="neighbor-img-wrap">
                  <img src={prevProjectData.heroImage} alt="" draggable={false} />
                </div>
                <div className="neighbor-caption">
                  <span className="n-arrow">←</span>
                  <span className="n-title">{prevProjectData.title}</span>
                </div>
              </div>
            </div>

            {/* Active Project Wrapper (Vertical 4:5 Portrait Mirror Frame) */}
            <div className="project-stage">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentProject.id}
                  className="active-project"
                  custom={direction}
                  variants={cardMotionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onClick={() => openDetails(currentProject)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${currentProject.title}`}
                >
                  <div className="vertical-mirror-frame">
                    {/* Ambient Glow */}
                    <div
                      className="mirror-ambient-glow"
                      style={{
                        background: `radial-gradient(circle at 50% 25%, ${currentProject.accent}24 0%, transparent 72%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* 1. Browser Chrome Header */}
                    <div className="mirror-chrome">
                      <div className="chrome-dots" aria-hidden="true">
                        <span className="c-dot red" />
                        <span className="c-dot yellow" />
                        <span className="c-dot green" />
                      </div>
                      <div className="chrome-url-bar">
                        <span className="chrome-lock">🔒</span>
                        <span className="chrome-url">https://{currentProject.domain}</span>
                      </div>
                      <div className="chrome-status">
                        <span className="chrome-live-chip">LIVE</span>
                      </div>
                    </div>

                    {/* 2. Real Screenshot Canvas (object-fit: contain - never distorted) */}
                    <div className="mirror-screenshot-canvas">
                      <img
                        src={currentProject.heroImage}
                        alt={`${currentProject.title} production screenshot`}
                        className="mirror-screenshot-img"
                        draggable={false}
                      />
                      <div className="mirror-reflection" aria-hidden="true" />
                    </div>

                    {/* 3. Portrait Frame Footer Strip */}
                    <div className="mirror-footer-meta">
                      <div className="mirror-meta-left">
                        <span
                          className="mirror-pulse-dot"
                          style={{ backgroundColor: currentProject.accent }}
                        />
                        <span className="mirror-visual-tag">{currentProject.visualTag}</span>
                      </div>
                      <div className="mirror-tech-tags">
                        {currentProject.keyTech.slice(0, 3).map((t) => (
                          <span key={t} className="mirror-tech-badge">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Neighbor (Absolute Right, Decorative & Clickable) */}
            <div
              className="gallery-neighbor neighbor-next"
              onClick={nextProject}
              role="button"
              tabIndex={0}
              aria-label={`Next project: ${nextProjectData.title}`}
            >
              <div className="neighbor-preview-card">
                <div className="neighbor-chrome">
                  <span className="n-dot" />
                  <span className="n-dot" />
                  <span className="n-dot" />
                </div>
                <div className="neighbor-img-wrap">
                  <img src={nextProjectData.heroImage} alt="" draggable={false} />
                </div>
                <div className="neighbor-caption">
                  <span className="n-title">{nextProjectData.title}</span>
                  <span className="n-arrow">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
             3. PROJECT DETAILS: TIGHT VERTICAL COMPOSITION
             IMAGE ↓ NUMBER ↓ TITLE ↓ DESCRIPTION ↓ ACTIONS ↓ ARROWS
             Centered without giant empty gaps.
             ═══════════════════════════════════════════════════════ */}
          <div className="gallery-project-details">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                className="details-content-wrap"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* 1. Project Title */}
                <h3 className="details-title">{currentProject.title}</h3>

                {/* 2. Actions: VIEW LIVE SITE & VIEW DETAILS */}
                <div className="details-actions">
                  <LiquidGlassButton
                    as="a"
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    className="btn-view-live"
                    icon={<span className="btn-arrow" aria-hidden="true">↗</span>}
                  >
                    VIEW LIVE SITE
                  </LiquidGlassButton>

                  <LiquidGlassButton
                    variant="secondary"
                    size="md"
                    className="btn-view-details"
                    onClick={() => openDetails(currentProject)}
                    icon={<span className="btn-plus" aria-hidden="true">+</span>}
                  >
                    VIEW DETAILS
                  </LiquidGlassButton>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 5. Centered Navigation Controls (Arrows & Progress Dots) */}
            <div className="gallery-nav-arrows">
              <button
                type="button"
                className="arrow-nav-btn prev-btn"
                onClick={prevProject}
                aria-label="Previous project"
              >
                ←
              </button>
              <div className="arrow-nav-dots" aria-hidden="true">
                {PROJECTS.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`nav-dot ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => goToProject(i)}
                    style={{
                      backgroundColor: i === activeIndex ? currentProject.accent : undefined,
                    }}
                    aria-label={`Go to ${p.title}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="arrow-nav-btn next-btn"
                onClick={nextProject}
                aria-label="Next project"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         PREMIUM PROJECT DETAIL MODAL
         ═══════════════════════════════════════════════════════ */}
      <ProjectDetailModal
        project={modalProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  )
}
