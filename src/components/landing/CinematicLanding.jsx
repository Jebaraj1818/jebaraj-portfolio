import { useEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { VideoScrubber } from './VideoScrubber'
import { HeroCapabilities, updateCapabilities } from './HeroCapabilities'
import { LiquidGlassButton } from '../ui/LiquidGlassButton'

gsap.registerPlugin(ScrollTrigger)

/**
 * SCRUB-OPTIMIZED HERO VIDEO (All-Intra I-frames for instantaneous seeking)
 * Path: public/vedio/hero-world-scrub.mp4
 * (Original locked master preserved at public/vedio/hero-world.mp4)
 */
const VIDEO_SRC_DESKTOP = '/vedio/hero-world-scrub.mp4'
const VIDEO_SRC_MOBILE  = '/vedio/hero-world-mobile-scrub.mp4'

/** Returns true when the viewport width is ≤ 768 px */
function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
}

/**
 * Pinned hero length in viewport heights.
 * 6.5 provides an ideal, responsive scrub rhythm for the 10-second sequence.
 */
const SCROLL_VH = 6.5

/* Math helpers */
function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi) }
function rng(p, lo, hi) { return clamp((p - lo) / (hi - lo), 0, 1) }

export function CinematicLanding() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const stRef = useRef(null)
  const lenis = useLenis()

  // Responsive video source — portrait mp4 on mobile, scrub-optimised on desktop
  const [videoSrc, setVideoSrc] = useState(() =>
    isMobileViewport() ? VIDEO_SRC_MOBILE : VIDEO_SRC_DESKTOP
  )

  // Re-evaluate on viewport resize (e.g. DevTools responsive toggle)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => {
      setVideoSrc(e.matches ? VIDEO_SRC_MOBILE : VIDEO_SRC_DESKTOP)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Single authoritative video-time controller
  const targetTimeRef = useRef(0)
  const rafIdRef = useRef(null)

  /**
   * Applies subtle, non-intrusive UI transitions linked to scroll.
   * - Hero identity is visible immediately at 0% and transitions into capabilities
   * - Four cinematic capability moments reveal in the negative space around the magical portal
   * - Portal transition cue appears near 90-100% as the camera enters the portal
   */
  const applyUIProgress = useCallback((p, root) => {
    const heroContent = root.querySelector('.hero-brand-content')
    const scrollHint  = root.querySelector('.hero-scroll-hint')
    const progTrack   = root.querySelector('.hero-progress-bar span')

    // Progress bar indicator
    if (progTrack) {
      progTrack.style.transform = `translateY(${p * 280}%)`
      progTrack.style.opacity = p > 0.01 ? '1' : '0.4'
    }

    // Hero brand identity: opening film credit strongest at 0.00-0.08, clears by 0.16
    if (heroContent) {
      const fadeOut = rng(p, 0.02, 0.16)
      heroContent.style.opacity = String(1 - fadeOut)
      heroContent.style.transform = `translateY(-${fadeOut * 24}px)`
      heroContent.style.pointerEvents = p < 0.10 ? 'auto' : 'none'
    }

    if (scrollHint) {
      const fadeOut = rng(p, 0.005, 0.08)
      scrollHint.style.opacity = String(1 - fadeOut)
    }

    // Synchronize the four cinematic capability moments
    updateCapabilities(p, root)
  }, [])

  /**
   * Unthrottled RAF sync loop.
   * With the all-intra I-frame encode, arbitrary seeking is instantaneous.
   * Directly sets video.currentTime = targetTime on each animation frame.
   */
  const updateVideoFrame = useCallback(() => {
    const video = videoRef.current
    if (video && isFinite(video.duration) && video.duration > 0) {
      if (!video.paused) {
        video.pause()
      }

      const target = targetTimeRef.current
      if (Math.abs(target - video.currentTime) > 0.002) {
        try {
          video.currentTime = target
        } catch (e) {
          // ignore aborted seeks
        }
      }
    }

    rafIdRef.current = requestAnimationFrame(updateVideoFrame)
  }, [])

  const handleVideoReady = useCallback(({ duration, video }) => {
    if (video) video.pause()
    if (stRef.current) {
      const initialTime = clamp(stRef.current.progress, 0, 1) * duration
      targetTimeRef.current = initialTime
      try {
        video.currentTime = initialTime
      } catch (e) {}
      ScrollTrigger.refresh()
    } else if (video) {
      targetTimeRef.current = 0
      try {
        video.currentTime = 0
      } catch (e) {}
    }
  }, [])

  const scrollToSection = (hash) => {
    if (lenis) {
      lenis.scrollTo(hash, { duration: 1.4 })
    } else {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Start continuous RAF video update loop
  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(updateVideoFrame)
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [updateVideoFrame])

  // ScrollTrigger Setup
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    applyUIProgress(0, section)

    const ctx = gsap.context(() => {
      const isMobile = isMobileViewport()
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: isMobile
          ? () => `+=${Math.round(window.innerHeight * SCROLL_VH)}`
          : `+=${SCROLL_VH * 100}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: isMobile ? 0 : 1,
        fastScrollEnd: true,
        preventOverlaps: true,
        onUpdate(self) {
          const video = videoRef.current
          const dur = video?.duration
          if (dur && isFinite(dur) && dur > 0) {
            targetTimeRef.current = clamp(self.progress, 0, 1) * dur
          }
          applyUIProgress(self.progress, section)
        },
      })

      stRef.current = st

      const video = videoRef.current
      if (video && video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
        const initialTime = clamp(st.progress, 0, 1) * video.duration
        targetTimeRef.current = initialTime
        try {
          video.currentTime = initialTime
        } catch (e) {}
      }
    }, sectionRef)

    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 0
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth !== prevWidth) {
        prevWidth = window.innerWidth
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ctx.revert()
    }
  }, [applyUIProgress])

  return (
    <section className="landing" ref={sectionRef} id="hero">

      {/* ── Locked Hero Video Scrubber (responsive: portrait on mobile) ── */}
      <div className="world-video-wrap" aria-hidden="true">
        <VideoScrubber
          ref={videoRef}
          src={videoSrc}
          onReady={handleVideoReady}
        />
      </div>

      {/* ── Hero Vignette for Text Contrast ─────────────────────── */}
      <div className="hero-atmosphere-veil" aria-hidden="true" />

      {/* ── Immediate Identity: Opening Film Credit ───────────── */}
      <div className="hero-brand-content">
        <div className="hero-credit-role">
          <span>FREELANCE DEVELOPER</span>
          <span className="role-sep" aria-hidden="true">•</span>
          <span>DIGITAL EXPERIENCE DESIGNER</span>
        </div>

        <h1 className="hero-brand-name">
          JEBARAJ<span className="brand-dot">.P</span>
        </h1>

        <p className="hero-statement">
          Building websites, digital products and interactive experiences.
        </p>

        <div className="hero-cta-group">
          <LiquidGlassButton
            variant="primary"
            size="lg"
            className="hero-btn hero-btn-primary"
            onClick={() => scrollToSection('#work')}
            icon={<span className="btn-icon" data-dir="down" aria-hidden="true">↓</span>}
          >
            VIEW MY WORK
          </LiquidGlassButton>

          <LiquidGlassButton
            variant="secondary"
            size="lg"
            className="hero-btn hero-btn-secondary"
            onClick={() => scrollToSection('#contact')}
            icon={<span className="btn-icon" data-dir="right" aria-hidden="true">→</span>}
          >
            WORK WITH ME
          </LiquidGlassButton>
        </div>
      </div>

      {/* ── Four Cinematic Capability Moments ────────────────────── */}
      <HeroCapabilities />

      {/* ── Scroll To Explore Hint ─────────────────────────────── */}
      <div className="hero-scroll-hint">
        <span className="hint-label">SCROLL TO EXPLORE THE WORLD</span>
        <span className="hint-arrow" aria-hidden="true">↓</span>
      </div>

      {/* ── Right-Side Scroll Progress Track ────────────────────── */}
      <div className="hero-progress-bar" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
