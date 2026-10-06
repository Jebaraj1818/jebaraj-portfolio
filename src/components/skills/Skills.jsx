import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  SiReact,
  SiJavascript,
  SiPython,
  SiFlask,
  SiMysql,
  SiGreensock,
  SiGooglegemini,
  SiGithub,
} from 'react-icons/si'

gsap.registerPlugin(ScrollTrigger)

/**
 * EXACTLY 8 VERIFIED PRIMARY TECHNOLOGIES WITH AUTHENTIC LOGOS
 * Sourced directly from Jebaraj's GitHub profile (@Jebaraj1818),
 * live project production stacks (DataMind AI, Doddle Bags), and portfolio codebase.
 */
const TECHNOLOGIES = [
  {
    id: 'react',
    name: 'React',
    shortName: 'React',
    icon: SiReact,
    brandColor: '#61DAFB',
    category: 'FRONTEND',
    detail: 'Component architecture, state synchronization, and reactive UI.',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    shortName: 'JavaScript',
    icon: SiJavascript,
    brandColor: '#F7DF1E',
    category: 'CORE LANGUAGE',
    detail: 'Modern ES6+ syntax, asynchronous flows, and DOM choreography.',
  },
  {
    id: 'python',
    name: 'Python',
    shortName: 'Python',
    icon: SiPython,
    brandColor: '#387EB8',
    category: 'BACKEND / DATA',
    detail: 'Data processing pipelines, analytical routines, and server logic.',
  },
  {
    id: 'flask',
    name: 'Flask',
    shortName: 'Flask',
    icon: SiFlask,
    brandColor: '#E8ECEF',
    category: 'BACKEND',
    detail: 'Lightweight REST API endpoints, routing, and microservices.',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    shortName: 'MySQL',
    icon: SiMysql,
    brandColor: '#00758F',
    category: 'DATABASE',
    detail: 'Relational schema design, transactions, and data modeling.',
  },
  {
    id: 'gsap',
    name: 'GSAP',
    shortName: 'GSAP',
    icon: SiGreensock,
    brandColor: '#88CE02',
    category: 'MOTION',
    detail: 'Scroll-linked timelines, physics-based motion, and cinematic reveals.',
  },
  {
    id: 'gemini-ai',
    name: 'Google Gemini',
    shortName: 'Gemini AI',
    icon: SiGooglegemini,
    brandColor: '#4E82EE',
    category: 'INTELLIGENCE',
    detail: 'LLM dataset profiling, intelligent diagnostics, and prompt pipelines.',
  },
  {
    id: 'git-github',
    name: 'Git / GitHub',
    shortName: 'Git / GitHub',
    icon: SiGithub,
    brandColor: '#F05032',
    category: 'TOOLING',
    detail: 'Branch discipline, version control, and collaborative deployment.',
  },
]

/**
 * Orbital geometry radii calculator:
 * Desktop: perfectly circular orbit ~52-56vw wide, bounded to 680-720px total diameter (radius 325px at 1440px).
 * Mobile: exact unchanged 120px / 108px elliptical orbit.
 */
const getOrbitRadii = (width) => {
  if (width <= 768) {
    return { rx: 120, ry: 108 }
  }
  const targetDiameter = Math.min(Math.max(width * 0.52, 520), 710)
  const r = Math.round((targetDiameter - 60) / 2)
  return { rx: r, ry: r }
}

export function Skills() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const nodeRefs = useRef([])
  const angleRef = useRef(0)
  const activeIdxRef = useRef(0)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [pulseCore, setPulseCore] = useState(false)
  const [radii, setRadii] = useState(() =>
    typeof window !== 'undefined' ? getOrbitRadii(window.innerWidth) : { rx: 325, ry: 325 }
  )
  const radiiRef = useRef(radii)

  // Track responsive breakpoint and desktop radii
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      const mobile = w <= 768
      setIsMobile(mobile)
      const newRadii = getOrbitRadii(w)
      radiiRef.current = newRadii
      setRadii(newRadii)
    }
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ─────────────────────────────────────────────────────────────
  // 1. INDEPENDENT SECTION-SCOPED TITLE ENTRANCE ANIMATION
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const header = headerRef.current
    const section = sectionRef.current
    if (!header || !section) return

    const kicker = header.querySelector('.tech-section-kicker')
    const words = header.querySelectorAll('.tech-word')
    const stackWord = header.querySelector('.word-stack')
    const subtitle = header.querySelector('.tech-subtitle')

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
        { opacity: 0, y: -12, letterSpacing: '0.12em' },
        { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 0.5, ease: 'power3.out' }
      )
    }

    if (words.length > 0) {
      titleTl.fromTo(
        words,
        { y: '115%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power4.out' },
        '-=0.25'
      )
    }

    if (stackWord) {
      titleTl.fromTo(
        stackWord,
        { color: 'inherit' },
        { color: '#ff334b', duration: 0.45, ease: 'power2.out' },
        '-=0.2'
      )
    }

    if (subtitle) {
      titleTl.fromTo(
        subtitle,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        '-=0.25'
      )
    }

    return () => {
      titleTl.kill()
    }
  }, [])

  // ─────────────────────────────────────────────────────────────
  // 2. CONTINUOUS SLOW AUTOMATIC ORBIT ROTATION (38s full cycle)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let animId
    let lastTime = performance.now()
    const totalNodes = TECHNOLOGIES.length // 8 nodes
    const step = 360 / totalNodes // 45 deg
    const duration = 38000 // 38 seconds for a calm, graceful revolution
    const speed = 360 / duration // deg per ms

    const updateFrame = (now) => {
      const delta = now - lastTime
      lastTime = now

      // Dynamic responsive radii
      const { rx, ry } = radiiRef.current

      // Increment rotation angle clockwise
      angleRef.current = (angleRef.current + delta * speed) % 360
      const currentAngle = angleRef.current

      // Calculate which node is currently nearest to front (90deg / bottom)
      const rawActive = Math.round(currentAngle / step) % totalNodes
      const curActive = (rawActive + totalNodes) % totalNodes

      // Update activeIndex state only when the active node changes (every ~4.7s)
      if (curActive !== activeIdxRef.current) {
        activeIdxRef.current = curActive
        setActiveIndex(curActive)
        setPulseCore(true)
        setTimeout(() => setPulseCore(false), 450)
      }

      // Directly apply high-performance GPU transforms to each of the 8 node elements
      for (let i = 0; i < totalNodes; i++) {
        const el = nodeRefs.current[i]
        if (!el) continue

        // Base angle: node 0 starts at 90deg (front/active)
        const nodeAngle = (90 - i * step + currentAngle) % 360
        const normAngle = (nodeAngle + 360) % 360
        const rad = (normAngle * Math.PI) / 180

        const x = rx * Math.cos(rad)
        const y = ry * Math.sin(rad)

        // Depth factor d: 1 at front (90deg), 0 at back (270deg)
        const d = (1 + Math.sin(rad)) / 2

        const s = isMobile ? 0.88 + 0.20 * d : 0.86 + 0.22 * d
        const op = 0.80 + 0.20 * d
        const isAct = i === curActive

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(2)})`
        el.style.opacity = op.toFixed(2)
        el.style.zIndex = isAct ? 50 : Math.round(10 + 30 * d)

        if (isAct) {
          el.classList.add('is-active')
        } else {
          el.classList.remove('is-active')
        }
      }

      animId = requestAnimationFrame(updateFrame)
    }

    animId = requestAnimationFrame(updateFrame)
    return () => cancelAnimationFrame(animId)
  }, [isMobile])

  // Click a node to smoothly rotate it to the front
  const handleNodeClick = useCallback((targetIndex) => {
    const totalNodes = TECHNOLOGIES.length
    const step = 360 / totalNodes
    const targetAngle = targetIndex * step

    gsap.to(angleRef, {
      current: targetAngle,
      duration: 0.9,
      ease: 'power3.out',
    })
  }, [])

  const activeTech = TECHNOLOGIES[activeIndex] || TECHNOLOGIES[0]
  const radiusX = radii.rx
  const radiusY = radii.ry
  // Stage height strictly calculated to fully enclose complete orbital circle, nodes, and labels
  const stageHeight = Math.round((radiusY + (isMobile ? 48 : 72)) * 2)

  return (
    <section id="skills" className="tech-orbital-section" ref={sectionRef} aria-label="Technology and Stack">
      <div className="section-container tech-section-container">

        {/* ── Section Header (Completely outside and ABOVE the orbit) ── */}
        <div className="tech-stage-header" ref={headerRef}>
          <div className="tech-section-kicker">
            <span className="kicker-label">TECHNOLOGY</span>
          </div>

          <h2 className="tech-main-heading">
            <span className="heading-mask">
              <span className="tech-word">THE</span>{' '}
              <span className="tech-word word-stack">STACK</span>
            </span>
            <span className="heading-mask">
              <span className="tech-word">BEHIND</span>{' '}
              <span className="tech-word">THE</span>{' '}
              <span className="tech-word">WORK.</span>
            </span>
          </h2>

          <p className="tech-subtitle">
            The core technical engine powering modern web experiences, backend architectures, and AI integrations.
          </p>
        </div>

        {/* ── Dedicated Breathing Space between Title and Orbit ── */}
        <div className="tech-breathing-space" aria-hidden="true" />

        {/* ── Dedicated Orbit Stage ── */}
        <div
          className="tech-orbital-system"
          style={{ height: `${stageHeight}px` }}
          aria-label="Interactive Radial Technology Orbit"
        >

          {/* SVG Orbital Technical Rings */}
          <svg
            className="orbital-rings-svg"
            viewBox={`-${radiusX + 45} -${radiusY + 45} ${(radiusX + 45) * 2} ${(radiusY + 45) * 2}`}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="techCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff334b" stopOpacity="0.16" />
                <stop offset="65%" stopColor="#0a0d14" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#010204" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="techActiveArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff334b" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ff334b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff334b" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Ambient Background Energy Disc */}
            <circle cx="0" cy="0" r={radiusX * 0.85} fill="url(#techCenterGlow)" />

            {/* Outer Subtle Dash Reference Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx={radiusX + 22}
              ry={radiusY + 20}
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />

            {/* Primary Technical Orbital Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx={radiusX}
              ry={radiusY}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
            />

            {/* Front Highlight Arc */}
            <path
              d={`M -${radiusX * 0.65} ${radiusY * 0.76} A ${radiusX} ${radiusY} 0 0 0 ${radiusX * 0.65} ${radiusY * 0.76}`}
              fill="none"
              stroke="url(#techActiveArc)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Cardinal Technical Tick Marks */}
            <line x1={-radiusX} y1="0" x2={-radiusX + 7} y2="0" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="1" />
            <line x1={radiusX - 7} y1="0" x2={radiusX} y2="0" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="1" />
            <line x1="0" y1={-radiusY} x2="0" y2={-radiusY + 7} stroke="rgba(255, 255, 255, 0.28)" strokeWidth="1" />
            <line x1="0" y1={radiusY - 9} x2="0" y2={radiusY} stroke="#ff334b" strokeWidth="1.5" />
          </svg>

          {/* Central Digital Stack Core (Minimal abstract technical center, no personal name) */}
          <div
            className={`tech-digital-core ${pulseCore ? 'is-pulsing' : ''}`}
            aria-label="Central Technical Core"
          >
            <div className="core-inner-glow" />
            <div className="core-concentric-ring" />
            <div className="core-reticle-ring" />
            <div className="core-badge">
              <span className="core-beacon" aria-hidden="true" />
              <span className="core-kicker">TECH STACK</span>
            </div>
          </div>

          {/* Exactly 8 Orbiting Technology Nodes with Authentic Brand Logos */}
          <div className="tech-nodes-layer">
            {TECHNOLOGIES.map((tech, index) => {
              const Icon = tech.icon
              return (
                <button
                  key={tech.id}
                  ref={(el) => (nodeRefs.current[index] = el)}
                  type="button"
                  className="tech-orbit-node"
                  onClick={() => handleNodeClick(index)}
                  aria-label={`${tech.name} — ${tech.category}`}
                >
                  <span className="node-aura" aria-hidden="true" />
                  <div className="node-circle">
                    <Icon className="node-tech-logo" style={{ color: tech.brandColor }} aria-hidden="true" />
                  </div>
                  <div className="node-label-wrap">
                    <span className="node-name">{tech.shortName}</span>
                  </div>
                </button>
              )
            })}
          </div>

        </div>

        {/* ── Active Detail Readout (Flow element positioned cleanly BELOW the entire orbit) ── */}
        <div className="tech-active-readout" aria-live="polite">
          <div className="readout-category-row">
            <span className="readout-pill">{activeTech.category}</span>
          </div>
          <div className="readout-tech-name">{activeTech.name}</div>
          <p className="readout-tech-detail">{activeTech.detail}</p>
        </div>

      </div>
    </section>
  )
}
