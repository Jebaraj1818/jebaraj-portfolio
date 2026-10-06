import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { LiquidGlassButton } from '../ui/LiquidGlassButton'

gsap.registerPlugin(ScrollTrigger)

const PROCESS_STEPS = [
  {
    num: '01',
    label: 'DISCOVER',
    title: 'Scoping & Strategy',
    description: 'We align on business goals, design aesthetic, performance targets, and key deliverables to establish an unambiguous technical roadmap.',
    deliverables: 'Project brief · Technical specifications · Milestone schedule',
  },
  {
    num: '02',
    label: 'PLAN',
    title: 'Architecture & Design System',
    description: 'I architect the component structure, establish color and typographic tokens, and prototype core motion interactions to validate the flow early.',
    deliverables: 'Design token schema · Component hierarchy · Interactive prototypes',
  },
  {
    num: '03',
    label: 'BUILD',
    title: 'Development & Polish',
    description: 'Writing clean, modular production code with 60fps hardware-accelerated animations, responsive adaptation across 390px to 4K, and semantic accessibility.',
    deliverables: 'Production React codebase · Fluid motion integration · Cross-browser testing',
  },
  {
    num: '04',
    label: 'DELIVER',
    title: 'Deployment & Handover',
    description: 'Final production build deployed to edge infrastructure (Vercel/Netlify), speed audited for optimal Core Web Vitals, and complete Git repository handover.',
    deliverables: 'Live deployment · Clean Git repository · Documentation & launch support',
  },
]

export function WorkWithMe() {
  const lenis = useLenis()
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const lineRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)

  const scrollToContact = () => {
    if (lenis) {
      lenis.scrollTo('#contact', { duration: 1.4 })
    } else {
      const el = document.querySelector('#contact')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    const timeline = timelineRef.current
    const line = lineRef.current
    if (!section || !timeline || !line) return

    const head = section.querySelector('.section-head')
    const kicker = head?.querySelector('.section-kicker')
    const title = head?.querySelector('.section-title')
    const desc = head?.querySelector('.section-desc')

    // Section title entrance timeline
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom top',
        toggleActions: 'restart reset restart reset',
      },
    })

    if (kicker) {
      titleTl.fromTo(
        kicker,
        { opacity: 0, y: 14, letterSpacing: '0.28em' },
        { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.5, ease: 'power2.out' }
      )
    }

    if (title) {
      titleTl.fromTo(
        title,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.3'
      )
    }

    if (desc) {
      titleTl.fromTo(
        desc,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.35'
      )
    }

    const stepElements = timeline.querySelectorAll('.timeline-step-row')

    // Progressively draw timeline line as user scrolls through this section
    const stLine = ScrollTrigger.create({
      trigger: timeline,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        line.style.height = `${p * 100}%`

        // Activate step based on progress
        const currentIdx = Math.min(
          Math.floor(p * stepElements.length),
          stepElements.length - 1
        )
        setActiveStep(Math.max(0, currentIdx))
      },
    })

    return () => {
      titleTl.kill()
      stLine.kill()
    }
  }, [])

  return (
    <section id="hire" className="section-hire" ref={sectionRef}>
      <div className="section-container">

        {/* Section Header */}
        <div className="section-head">
          <div className="section-kicker">
            <span>FREELANCE PROCESS</span>
          </div>
          <h2 className="section-title">
            HOW WE <span className="title-highlight">COLLABORATE.</span>
          </h2>
          <p className="section-desc">
            A transparent, disciplined 4-stage workflow designed for clarity, momentum,
            and reliable delivery from initial concept to live release.
          </p>
        </div>

        {/* Progressive Drawing Timeline */}
        <div className="progressive-timeline-wrap" ref={timelineRef}>
          {/* Vertical Progress Line Track */}
          <div className="timeline-track-rail" aria-hidden="true">
            <div className="timeline-track-fill" ref={lineRef} />
          </div>

          <div className="timeline-steps-list">
            {PROCESS_STEPS.map((step, idx) => {
              const isCurrent = activeStep >= idx
              return (
                <div
                  key={step.num}
                  className={`timeline-step-row ${isCurrent ? 'is-active' : ''}`}
                >
                  {/* Step Node Marker */}
                  <div className="step-node-col" aria-hidden="true">
                    <div className="step-node-dot">
                      <span className="node-inner" />
                    </div>
                  </div>

                  {/* Step Content Card */}
                  <div className="step-content-card">
                    <div className="step-top-meta">
                      <span className="step-tag">{step.label}</span>
                    </div>

                    <h3 className="step-heading">{step.title}</h3>
                    <p className="step-desc">{step.description}</p>

                    <div className="step-deliverables-pill">
                      <span className="pill-label">OUTPUT:</span>
                      <span className="pill-text">{step.deliverables}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Final Conversion Action Banner */}
        <div className="hire-action-banner">
          <div className="banner-editorial-copy">
            <span className="banner-kicker">AVAILABLE FOR FREELANCE & CONTRACT</span>
            <h3 className="banner-main-headline">
              HAVE A PROJECT IN MIND? <br />
              <span className="title-highlight">LET'S BUILD IT.</span>
            </h3>
            <p className="banner-sub-text">
              Direct technical execution, thoughtful design craft, and reliable communication.
            </p>
          </div>

          <div className="banner-action-col">
            <LiquidGlassButton
              variant="primary"
              size="lg"
              className="banner-cta-button"
              onClick={scrollToContact}
              icon={<span className="cta-arrow-icon" aria-hidden="true">→</span>}
            >
              START A PROJECT
            </LiquidGlassButton>
          </div>
        </div>

      </div>
    </section>
  )
}
