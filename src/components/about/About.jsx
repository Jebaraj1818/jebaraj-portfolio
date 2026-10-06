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

  // Moment refs for sequential scrub timeline
  const moment1Ref = useRef(null)
  const moment2Ref = useRef(null)
  const moment3Ref = useRef(null)
  const moment4Ref = useRef(null)
  const moment5Ref = useRef(null)

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
    const m5 = moment5Ref.current

    if (!section || !track || !header || !title || !poster || !m1 || !m2 || !m3 || !m4 || !m5) return

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
        gsap.set([m1, m2, m3, m4, m5], { clearProps: 'transform' })

        if (isDesktop) {
          // ─────────────────────────────────────────────────────────
          // DESKTOP: 100% UNCHANGED EXISTING IMPLEMENTATION
          // ─────────────────────────────────────────────────────────
          const startRotateX = 20
          const startScale = 1.05
          const targetTranslateY = -75
          const perspectiveVal = 1050

          // Strict initial states: Only Moment 1 is visible in center; all others placed below masked viewport
          gsap.set(m1, { autoAlpha: 1, yPercent: 0, y: 0 })
          gsap.set([m2, m3, m4, m5], { autoAlpha: 0, yPercent: 125, y: 0 })

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
          // Each moment holds clearly readable, drifts upward with scroll,
          // and fully travels upward behind the top mask before the next moment enters from below.

          // ── MOMENT 1: IDENTITY (Hold 0 -> 16, Upward Exit 16 -> 24)
          masterTl
            .to(
              m1,
              {
                yPercent: -6,
                y: 0,
                ease: 'none',
                duration: 16,
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
              16
            )

          // ── MOMENT 2: PHILOSOPHY (Enters 28 -> 35, Holds 35 -> 46, Upward Exit 46 -> 53)
          masterTl
            .fromTo(
              m2,
              { autoAlpha: 0, yPercent: 125, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 7,
              },
              28
            )
            .to(
              m2,
              {
                yPercent: -6,
                y: 0,
                ease: 'none',
                duration: 11,
              },
              35
            )
            .to(
              m2,
              {
                yPercent: -125,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 7,
              },
              46
            )

          // ── MOMENT 3: 3 PILLARS (Enters 57 -> 64, Holds 64 -> 74, Upward Exit 74 -> 81)
          masterTl
            .fromTo(
              m3,
              { autoAlpha: 0, yPercent: 125, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 7,
              },
              57
            )
            .to(
              m3,
              {
                yPercent: -6,
                y: 0,
                ease: 'none',
                duration: 10,
              },
              64
            )
            .to(
              m3,
              {
                yPercent: -125,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 7,
              },
              74
            )

          // ── MOMENT 4: WHAT I BUILD (Enters 85 -> 90, Holds 90 -> 94.5, Upward Exit 94.5 -> 97.2)
          masterTl
            .fromTo(
              m4,
              { autoAlpha: 0, yPercent: 125, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 5,
              },
              85
            )
            .to(
              m4,
              {
                yPercent: -5,
                y: 0,
                ease: 'none',
                duration: 4.5,
              },
              90
            )
            .to(
              m4,
              {
                yPercent: -125,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 2.7,
              },
              94.5
            )

          // ── MOMENT 5: FREELANCE DIRECTION (Enters 98 -> 99.2, Holds Settled 99.2 -> 100)
          masterTl.fromTo(
            m5,
            { autoAlpha: 0, yPercent: 120, y: 0 },
            {
              autoAlpha: 1,
              yPercent: 0,
              y: 0,
              ease: 'power2.out',
              duration: 1.2,
            },
            98
          )
        } else {
          // ─────────────────────────────────────────────────────────
          // MOBILE: COMPLETE FULL-RANGE STORY PROGRESSION
          // 5 discrete moments mapped evenly across full scroll range
          // ─────────────────────────────────────────────────────────
          const startRotateX = 12
          const startScale = 1.02
          const targetTranslateY = -15
          const perspectiveVal = 800

          // Strict initial states: Only Moment 1 is visible in center; all others placed below masked viewport
          gsap.set(m1, { autoAlpha: 1, yPercent: 0, y: 0 })
          gsap.set([m2, m3, m4, m5], { autoAlpha: 0, yPercent: 115, y: 0 })

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

          // B. Title Header Gentle Recede & Fade (4 to 16)
          masterTl.to(
            header,
            {
              y: -18,
              scale: 0.95,
              opacity: 0,
              ease: 'power1.out',
              duration: 12,
            },
            4
          )

          // C. Discrete Story Moments (Seamless sequential flow, no center collision, no black voids)

          // ── MOMENT 1: IDENTITY (0 to 20.5)
          masterTl
            .to(
              m1,
              {
                yPercent: -5,
                y: 0,
                ease: 'none',
                duration: 15,
              },
              0
            )
            .to(
              m1,
              {
                yPercent: -110,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 5.5,
              },
              15
            )

          // ── MOMENT 2: PHILOSOPHY (19.5 to 40.5)
          masterTl
            .fromTo(
              m2,
              { autoAlpha: 0, yPercent: 110, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 5,
              },
              19.5
            )
            .to(
              m2,
              {
                yPercent: -5,
                y: 0,
                ease: 'none',
                duration: 10.5,
              },
              24.5
            )
            .to(
              m2,
              {
                yPercent: -110,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 5.5,
              },
              35
            )

          // ── MOMENT 3: CORE DISCIPLINES (39.5 to 60.5)
          masterTl
            .fromTo(
              m3,
              { autoAlpha: 0, yPercent: 110, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 5,
              },
              39.5
            )
            .to(
              m3,
              {
                yPercent: -5,
                y: 0,
                ease: 'none',
                duration: 10.5,
              },
              44.5
            )
            .to(
              m3,
              {
                yPercent: -110,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 5.5,
              },
              55
            )

          // ── MOMENT 4: WEB FOCUS (59.5 to 80.5)
          masterTl
            .fromTo(
              m4,
              { autoAlpha: 0, yPercent: 110, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 5,
              },
              59.5
            )
            .to(
              m4,
              {
                yPercent: -5,
                y: 0,
                ease: 'none',
                duration: 10.5,
              },
              64.5
            )
            .to(
              m4,
              {
                yPercent: -110,
                y: 0,
                autoAlpha: 0,
                ease: 'power1.in',
                duration: 5.5,
              },
              75
            )

          // ── MOMENT 5: FREELANCE & ACTIONS (79.5 to 100)
          masterTl
            .fromTo(
              m5,
              { autoAlpha: 0, yPercent: 110, y: 0 },
              {
                autoAlpha: 1,
                yPercent: 0,
                y: 0,
                ease: 'power2.out',
                duration: 5,
              },
              79.5
            )
            .to(
              m5,
              {
                yPercent: -2,
                y: 0,
                ease: 'none',
                duration: 15.5,
              },
              84.5
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
                  FREELANCE DEVELOPER &amp; DIGITAL EXPERIENCE DESIGNER
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

              {/* Story Stage: Houses all 5 continuous visual narrative moments */}
              <div className="poster-story-stage">
                
                {/* ── MOMENT 01: IDENTITY & INTRO ─────────────── */}
                <div className="story-moment moment-identity" ref={moment1Ref}>
                  <div className="moment-kicker">IDENTITY</div>
                  <h3 className="moment-lead-statement">
                    "I work independently as a freelance developer and <span className="text-accent-crimson">digital experience designer</span>."
                  </h3>
                  <p className="moment-sub-lead">
                    Based in <strong className="text-accent-warm">Tirunelveli, Tamil Nadu, India</strong> — partnering directly with ambitious founders, studios, and product teams across the globe to craft high-impact digital work.
                  </p>
                  <div className="moment-rule" />
                  <div className="moment-meta-row">
                    <span className="meta-tag">FOUNDATION: DESIGN + CODE</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">INDEPENDENT CRAFT</span>
                  </div>
                </div>

                {/* ── MOMENT 02: CRAFT PHILOSOPHY ─────────────── */}
                <div className="story-moment moment-philosophy" ref={moment2Ref}>
                  <div className="moment-kicker">CRAFT PHILOSOPHY</div>
                  <h3 className="moment-lead-statement">
                    "<span className="text-accent-offwhite">Design and development</span> sit together in my <span className="text-accent-crimson">craft</span>."
                  </h3>
                  <p className="moment-body-editorial">
                    I don't separate interface aesthetics from engineering logic. Thoughtful visual direction, <span className="text-accent-cyan">fluid motion</span>, and rock-solid architecture work as one coherent medium from the very first line of code.
                  </p>
                  <div className="moment-rule" />
                  <div className="moment-meta-row">
                    <span className="meta-tag">PRECISION TYPOGRAPHY</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">PERFORMANCE FIRST</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">CLEAN ARCHITECTURE</span>
                  </div>
                </div>

                {/* ── MOMENT 03: OVERSIZED TYPOGRAPHIC KEYWORDS ── */}
                <div className="story-moment moment-keywords" ref={moment3Ref}>
                  <div className="moment-kicker">CORE DISCIPLINES</div>
                  <div className="moment-oversized-keywords">
                    <div className="keyword-row">DESIGN<span className="keyword-accent">.</span></div>
                    <div className="keyword-row">DEVELOPMENT<span className="keyword-accent">.</span></div>
                    <div className="keyword-row keyword-highlight">DIGITAL EXPERIENCES<span className="keyword-accent">.</span></div>
                  </div>
                  <p className="moment-body-editorial keywords-support">
                    Bespoke digital systems crafted with intention — eliminating bloated templates and generic layouts in favor of <span className="text-accent-warm">fluid performance</span> and custom craft.
                  </p>
                </div>

                {/* ── MOMENT 04: WHAT I BUILD / WEB FOCUS ─────── */}
                <div className="story-moment moment-direction" ref={moment4Ref}>
                  <div className="moment-kicker">WEB FOCUS</div>
                  <h3 className="moment-headline-massive">
                    I BUILD FOR THE <span className="text-accent-crimson">WEB</span><span className="title-accent">.</span>
                  </h3>
                  <p className="moment-body-editorial large-lead">
                    From responsive brand websites and interactive portfolios to bespoke <span className="text-accent-offwhite">full-stack applications</span> and custom digital platforms — engineered for <span className="text-accent-cyan">speed</span>, utility, and lasting impact.
                  </p>
                  <div className="moment-rule" />
                  <div className="moment-meta-row">
                    <span className="meta-tag">FRONTEND FLUIDITY</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">FULL-STACK SYSTEMS</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-tag">CUSTOM DIGITAL BUILDS</span>
                  </div>
                </div>

                {/* ── MOMENT 05: FREELANCE AVAILABILITY & DIRECT CONTACT */}
                <div className="story-moment moment-freelance" ref={moment5Ref}>
                  <div className="freelance-live-badge">
                    <span className="live-badge-dot" />
                    <span className="live-badge-txt">STATUS: OPEN FOR SELECT CLIENT COMMISSIONS</span>
                  </div>

                  <h3 className="moment-freelance-title">
                    AVAILABLE FOR <span className="text-accent-crimson">FREELANCE WORK</span> &amp; DIRECT DIGITAL BUILDS.
                  </h3>

                  <p className="moment-body-editorial freelance-desc">
                    Whether you have a flagship website to launch, an interactive product to build, or a custom web experience to bring to life — I work directly with you from discovery to deployment.
                  </p>

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
                      <span>Start a Project</span>
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
