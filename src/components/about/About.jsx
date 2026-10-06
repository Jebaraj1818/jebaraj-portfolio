import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

export function About() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const headerRef = useRef(null)
  const titleRef = useRef(null)
  const posterRef = useRef(null)

  // Moment refs for 4 sequential scrub story stages
  const moment1Ref = useRef(null)
  const moment2Ref = useRef(null)
  const moment3Ref = useRef(null)
  const moment4Ref = useRef(null)

  const lenis = useLenis()

  const handleContactClick = (e) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo('#contact', { duration: 1.4 })
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const header = headerRef.current
    const title = titleRef.current
    const poster = posterRef.current
    const m1 = moment1Ref.current
    const m2 = moment2Ref.current
    const m3 = moment3Ref.current
    const m4 = moment4Ref.current

    if (!section || !track || !header || !title || !poster || !m1 || !m2 || !m3 || !m4) return

    const mm = gsap.matchMedia()

    // ─────────────────────────────────────────────────────────────
    // 1. INDEPENDENT EDITORIAL TITLE MASKED REVEAL (Section Entrance)
    // ─────────────────────────────────────────────────────────────
    const label = section.querySelector('.about-header-label')
    const wordIm = title.querySelector('.word-im')
    const wordJeba = title.querySelector('.word-jeba')
    const wordRaj = title.querySelector('.word-raj')
    const titleSub = title.querySelector('.about-sub-label')

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom top',
        toggleActions: 'restart reset restart reset',
      },
    })

    if (label) {
      titleTl.fromTo(
        label,
        { opacity: 0, y: -12, letterSpacing: '0.14em' },
        { opacity: 1, y: 0, letterSpacing: '0.24em', duration: 0.5, ease: 'power3.out' }
      )
    }

    if (wordIm) {
      titleTl.fromTo(
        wordIm,
        { y: '120%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.65, ease: 'power4.out' },
        '-=0.25'
      )
    }

    if (wordJeba) {
      titleTl.fromTo(
        wordJeba,
        { y: '120%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.7, ease: 'power4.out' },
        '-=0.45'
      )
    }

    if (wordRaj) {
      titleTl.fromTo(
        wordRaj,
        { y: '125%', opacity: 0, letterSpacing: '-0.02em' },
        { y: '0%', opacity: 1, letterSpacing: '-0.04em', duration: 0.75, ease: 'power4.out' },
        '-=0.5'
      )
    }

    if (titleSub) {
      titleTl.fromTo(
        titleSub,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
    }

    // ─────────────────────────────────────────────────────────────
    // 2. FULL-STORY 3D CONTAINER + DISCRETE STORY MOMENTS TIMELINE
    // ─────────────────────────────────────────────────────────────
    mm.add(
      {
        isDesktop: '(min-width: 769px)',
        isMobile: '(max-width: 768px)',
      },
      (context) => {
        const { isDesktop } = context.conditions

        // Clear any stale transforms from previous mounts / HMR
        gsap.set([m1, m2, m3, m4], { clearProps: 'transform' })

        if (isDesktop) {
          // ─────────────────────────────────────────────────────────
          // DESKTOP: 4 CALIBRATED MOMENTS ACROSS 0..100 SCRUB
          // ─────────────────────────────────────────────────────────
          const startRotateX = 20
          const startScale = 1.05
          const targetTranslateY = -75
          const perspectiveVal = 1050

          // Strict initial states: Only Moment 1 is visible in center; all others placed below masked viewport
          gsap.set(m1, { autoAlpha: 1, yPercent: 0, y: 0 })
          gsap.set([m2, m3, m4], { autoAlpha: 0, yPercent: 125, y: 0 })

          const masterTl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })

          // A. 3D Container Transform (Spans 0 to 100 continuously)
          masterTl.fromTo(
            poster,
            {
              rotateX: startRotateX,
              scale: startScale,
              y: 0,
              transformPerspective: perspectiveVal,
              transformOrigin: 'center top',
            },
            {
              rotateX: 0,
              scale: 1,
              y: targetTranslateY,
              ease: 'none',
              duration: 100,
            },
            0
          )

          // B. Title Header Gentle Recede & Fade (10 to 30)
          masterTl.to(
            header,
            {
              y: -45,
              scale: 0.92,
              opacity: 0,
              ease: 'power1.out',
              duration: 20,
            },
            10
          )

          // C. Physical Upward Typography Flow Through Masked Viewport

          // ── MOMENT 1: BUSINESS FIRST. TECHNOLOGY NEXT. (Hold 0 -> 20, Upward Exit 20 -> 28)
          masterTl
            .to(
              m1,
              {
                yPercent: -6,
                y: 0,
                ease: 'none',
                duration: 20,
              },
              0
            )
            .to(
              m1,
              {
                yPercent: -125,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 8,
              },
              20
            )

          // ── MOMENT 2: FROM IDEAS TO WORKING PRODUCTS (Enters 28 -> 36, Holds 36 -> 54, Upward Exit 54 -> 62)
          masterTl
            .fromTo(
              m2,
              { autoAlpha: 0, yPercent: 125, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 8,
              },
              28
            )
            .to(
              m2,
              {
                yPercent: -6,
                y: 0,
                ease: 'none',
                duration: 18,
              },
              36
            )
            .to(
              m2,
              {
                yPercent: -125,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 8,
              },
              54
            )

          // ── MOMENT 3: PYTHON. FULL-STACK. DATA. AI. (Enters 62 -> 70, Holds 70 -> 84, Upward Exit 84 -> 92)
          masterTl
            .fromTo(
              m3,
              { autoAlpha: 0, yPercent: 125, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 8,
              },
              62
            )
            .to(
              m3,
              {
                yPercent: -6,
                y: 0,
                ease: 'none',
                duration: 14,
              },
              70
            )
            .to(
              m3,
              {
                yPercent: -125,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 8,
              },
              84
            )

          // ── MOMENT 4: BUILDING TOWARD SOMETHING BIGGER (Enters 92 -> 96, Holds Settled 96 -> 100)
          masterTl.fromTo(
            m4,
            { autoAlpha: 0, yPercent: 120, y: 0 },
            {
              autoAlpha: 1,
              yPercent: 0,
              y: 0,
              ease: 'power2.out',
              duration: 4,
            },
            92
          )
        } else {
          // ─────────────────────────────────────────────────────────
          // MOBILE: 4 DISCRETE STORY MOMENTS ACROSS FULL SCROLL RANGE
          // ─────────────────────────────────────────────────────────
          const startRotateX = 12
          const startScale = 1.02
          const targetTranslateY = -15
          const perspectiveVal = 800

          // Strict initial states: Only Moment 1 is visible in center; all others placed below masked viewport
          gsap.set(m1, { autoAlpha: 1, yPercent: 0, y: 0 })
          gsap.set([m2, m3, m4], { autoAlpha: 0, yPercent: 100, y: 0 })

          const masterTl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              snap: {
                snapTo: [0, 0.333, 0.667, 1],
                directional: false,
                duration: { min: 0.2, max: 0.45 },
                delay: 0.05,
                ease: 'power2.out',
              },
              invalidateOnRefresh: true,
            },
          })

          // A. 3D Container Transform (Spans 0 to 100 continuously)
          masterTl.fromTo(
            poster,
            {
              rotateX: startRotateX,
              scale: startScale,
              y: 0,
              transformPerspective: perspectiveVal,
              transformOrigin: 'center top',
            },
            {
              rotateX: 0,
              scale: 1,
              y: targetTranslateY,
              ease: 'none',
              duration: 100,
            },
            0
          )

          // B. Title Header Gentle Recede & Fade (2 to 14)
          masterTl.to(
            header,
            {
              y: -18,
              scale: 0.95,
              opacity: 0,
              ease: 'power1.out',
              duration: 12,
            },
            2
          )

          // C. Calibrated Discrete Story Moments (4 discrete slides centered at snap points: 0, 0.333, 0.667, 1)

          // ── TRANSITION 1 -> 2 (Hold Slide 1: 0..12 | Transition: 12..24 | Settle Slide 2: 24..45)
          masterTl
            .to(
              m1,
              {
                yPercent: -100,
                autoAlpha: 0,
                ease: 'power2.inOut',
                duration: 12,
              },
              12
            )
            .fromTo(
              m2,
              { autoAlpha: 0, yPercent: 100, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.inOut',
                duration: 12,
                immediateRender: false,
              },
              12
            )

          // ── TRANSITION 2 -> 3 (Hold Slide 2: 24..45 | Transition: 45..57 | Settle Slide 3: 57..78)
          masterTl
            .to(
              m2,
              {
                yPercent: -100,
                autoAlpha: 0,
                ease: 'power2.inOut',
                duration: 12,
              },
              45
            )
            .fromTo(
              m3,
              { autoAlpha: 0, yPercent: 100, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.inOut',
                duration: 12,
                immediateRender: false,
              },
              45
            )

          // ── TRANSITION 3 -> 4 (Hold Slide 3: 57..78 | Transition: 78..90 | Settle Slide 4: 90..100)
          masterTl
            .to(
              m3,
              {
                yPercent: -100,
                autoAlpha: 0,
                ease: 'power2.inOut',
                duration: 12,
              },
              78
            )
            .fromTo(
              m4,
              { autoAlpha: 0, yPercent: 100, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.inOut',
                duration: 12,
                immediateRender: false,
              },
              78
            )
        }
      }
    )

    return () => {
      titleTl.kill()
      mm.revert()
    }
  }, [])

  return (
    <section id="about" className="about-cinematic-section" ref={sectionRef}>
      {/* Tall Scroll Track (Drives 1:1 Scrub Across All Moments and 3D Rotation) */}
      <div className="about-scroll-track" ref={trackRef}>
        
        {/* Sticky Viewport Stage: Pinned perfectly in viewport while track scrolls */}
        <div className="about-sticky-stage">
          
          {/* ── 1. Independent Editorial Title Header ───────────── */}
          <div className="about-editorial-header" ref={headerRef}>
            <div className="about-header-label">
              <span className="label-title">ABOUT / JEBARAJ.P</span>
            </div>

            <h2 className="about-masked-title" ref={titleRef}>
              <div className="title-mask-line title-mask-main">
                <span className="title-word word-im">I'M </span>
                <span className="title-word word-jeba">JEBA </span>
                <span className="title-word word-raj title-accent">RAJ.</span>
              </div>
              <div className="title-mask-line title-mask-sub">
                <span className="about-sub-label">
                  EMERGING SOFTWARE DEVELOPER
                </span>
              </div>
            </h2>
          </div>

          {/* ── 2. The 3D Vertical Digital Poster / Editorial Object ── */}
          <div className="about-3d-stage">
            <div className="about-poster-object" ref={posterRef}>
              
              {/* Minimal Editorial Corner Registration Marks (No fake browser dots) */}
              <span className="poster-corner corner-tl" aria-hidden="true" />
              <span className="poster-corner corner-tr" aria-hidden="true" />
              <span className="poster-corner corner-bl" aria-hidden="true" />
              <span className="poster-corner corner-br" aria-hidden="true" />

              {/* Minimal Editorial Top Frame Border: ONLY JEBARAJ.P and AVAILABLE FOR FREELANCE */}
              <div className="poster-editorial-rail">
                <span className="rail-brand">JEBARAJ.P</span>
                <div className="rail-status">
                  <span className="rail-status-dot" />
                  <span className="rail-status-text">AVAILABLE FOR FREELANCE</span>
                </div>
              </div>

              {/* Story Stage: Houses all 4 continuous visual narrative moments */}
              <div className="poster-story-stage">
                
                {/* ── SLIDE 01: BUSINESS FIRST. TECHNOLOGY NEXT. ─────────────── */}
                <div className="story-moment moment-identity" ref={moment1Ref}>
                  <div className="moment-kicker">FOUNDATION</div>
                  <h3 className="moment-lead-statement">
                    "BUSINESS FIRST. <span className="text-accent-crimson">TECHNOLOGY NEXT</span>."
                  </h3>
                  <p className="moment-sub-lead">
                    I'm a <strong className="text-accent-warm">BBA student</strong> who became increasingly interested in how technology can solve real business problems.
                  </p>
                  <div className="moment-rule" />
                  <div className="moment-meta-row">
                    <span className="meta-tag">BUSINESS EDUCATION</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">TECHNOLOGY THINKING</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">PRACTICAL APPLICATIONS</span>
                  </div>
                </div>

                {/* ── SLIDE 02: FROM IDEAS TO WORKING PRODUCTS ─────────────── */}
                <div className="story-moment moment-philosophy" ref={moment2Ref}>
                  <div className="moment-kicker">APPLICATIONS</div>
                  <h3 className="moment-lead-statement">
                    FROM IDEAS TO <span className="text-accent-crimson">WORKING PRODUCTS</span>.
                  </h3>
                  <p className="moment-body-editorial">
                    I enjoy turning practical problems into applications — from e-commerce platforms to analytics dashboards and AI-powered tools.
                  </p>
                  <div className="moment-rule" />
                  <div className="moment-meta-row">
                    <span className="meta-tag">DODDLE BAGS</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">SMART BUSINESS INTELLIGENCE</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">THE TRANSIT STORY</span>
                  </div>
                </div>

                {/* ── SLIDE 03: PYTHON. FULL-STACK. DATA. AI. ── */}
                <div className="story-moment moment-keywords" ref={moment3Ref}>
                  <div className="moment-kicker">PRIMARY TECHNICAL FOCUS</div>
                  <div className="moment-oversized-keywords">
                    <div className="keyword-row">PYTHON<span className="keyword-accent">.</span></div>
                    <div className="keyword-row">FULL-STACK<span className="keyword-accent">.</span></div>
                    <div className="keyword-row keyword-highlight">DATA &amp; AI<span className="keyword-accent">.</span></div>
                  </div>
                  <p className="moment-body-editorial keywords-support">
                    My current focus is building a strong foundation in <span className="text-accent-warm">Python, Flask, React, JavaScript, SQL, Bootstrap, Data Analytics and Generative AI</span>.
                  </p>
                </div>

                {/* ── SLIDE 04: BUILDING TOWARD SOMETHING BIGGER ── */}
                <div className="story-moment moment-freelance" ref={moment4Ref}>
                  <div className="freelance-live-badge">
                    <span className="live-badge-dot" />
                    <span className="live-badge-txt">CAREER VISION</span>
                  </div>

                  <h3 className="moment-freelance-title">
                    BUILDING TOWARD <span className="text-accent-crimson">SOMETHING BIGGER</span>.
                  </h3>

                  <p className="moment-body-editorial freelance-desc">
                    My goal is to become a developer who understands both the business problem and the technology behind the solution.
                  </p>

                  <p className="moment-sub-lead" style={{ marginBottom: '16px', fontSize: '14px' }}>
                    Building scalable applications, exploring AI, and creating products that solve meaningful problems.
                  </p>

                  <div className="moment-meta-row" style={{ justifyContent: 'center', marginBottom: '22px' }}>
                    <span className="meta-tag" style={{ color: 'var(--text)', fontWeight: '700', letterSpacing: '0.2em' }}>
                      BUSINESS <span style={{ color: 'var(--crimson)' }}>×</span> TECHNOLOGY <span style={{ color: 'var(--crimson)' }}>×</span> AI
                    </span>
                  </div>

                  {/* Social / Portfolio Links */}
                  <div className="moment-action-row">
                    <a
                      href="https://github.com/Jebaraj1818"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-action-pill"
                    >
                      <span>GitHub Profile</span>
                      <span className="pill-arrow" aria-hidden="true">↗</span>
                    </a>

                    <a
                      href="https://in.linkedin.com/in/jeba-raj-bb350a395"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-action-pill"
                    >
                      <span>LinkedIn</span>
                      <span className="pill-arrow" aria-hidden="true">↗</span>
                    </a>

                    <a
                      href="#contact"
                      onClick={handleContactClick}
                      className="editorial-action-pill pill-primary"
                    >
                      <span>Work With Me</span>
                      <span className="pill-arrow-right" aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
