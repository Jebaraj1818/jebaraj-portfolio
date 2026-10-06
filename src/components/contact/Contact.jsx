import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LiquidGlassButton } from '../ui/LiquidGlassButton'

gsap.registerPlugin(ScrollTrigger)

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_details: '',
  })

  const [status, setStatus] = useState({
    loading: false,
    submitted: false,
    error: null,
  })

  const sectionRef = useRef(null)
  const directEmail = 'jebaraj1364@gmail.com'

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const kicker = section.querySelector('.contact-kicker')
    const titleMain = section.querySelector('.contact-title-main')
    const titleAccent = section.querySelector('.contact-title-accent')
    const desc = section.querySelector('.contact-desc')
    const formCol = section.querySelector('.contact-form-column')
    const sidebar = section.querySelector('.contact-sidebar')

    const ctx = gsap.context(() => {
      // ─────────────────────────────────────────────────────────────
      // INDEPENDENT, REPLAYABLE CONTACT EDITORIAL ENTRANCE ANIMATION
      // Triggered specifically by the Contact section itself.
      // Replays EVERY time the user enters/re-enters from top or bottom.
      // ─────────────────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'bottom 10%',
          toggleActions: 'restart reset restart reset',
        },
      })

      // 1. Small label fades and rises in with refined letter-spacing
      if (kicker) {
        tl.fromTo(
          kicker,
          { opacity: 0, y: 16, letterSpacing: '0.12em' },
          { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 0.55, ease: 'power2.out' }
        )
      }

      // 2. Main heading reveals cleanly through vertical mask
      if (titleMain) {
        tl.fromTo(
          titleMain,
          { y: '115%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.25'
        )
      }

      // 3. One crimson word/phrase reveals slightly afterward through mask
      if (titleAccent) {
        tl.fromTo(
          titleAccent,
          { y: '115%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.45'
        )
      }

      // 4. Supporting line appears with a subtle delayed rise
      if (desc) {
        tl.fromTo(
          desc,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.35'
        )
      }

      // 5. Form & Direct Contact area rise smoothly into position
      const panels = [formCol, sidebar].filter(Boolean)
      if (panels.length > 0) {
        tl.fromTo(
          panels,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
          '-=0.3'
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (status.error) {
      setStatus((prev) => ({ ...prev, error: null }))
    }
  }

  const validate = () => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      return 'Please provide your full name (at least 2 characters).'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      return 'Please provide a valid email address.'
    }
    const phoneClean = formData.phone.trim()
    const phoneRegex = /^\+?[0-9\s\-().]{7,25}$/
    if (!phoneClean || !phoneRegex.test(phoneClean)) {
      return 'Please provide a valid phone number (international format supported).'
    }
    if (!formData.project_details.trim() || formData.project_details.trim().length < 5) {
      return 'Please share a brief summary of your project details (at least 5 characters).'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setStatus({ loading: false, submitted: false, error: validationError })
      return
    }

    setStatus({ loading: true, submitted: false, error: null })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          project_details: formData.project_details.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.')
      }

      setStatus({ loading: false, submitted: true, error: null })
    } catch (err) {
      setStatus({
        loading: false,
        submitted: false,
        error: err.message || 'Unable to submit enquiry. Please check your connection and try again.',
      })
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      project_details: '',
    })
    setStatus({
      loading: false,
      submitted: false,
      error: null,
    })
  }

  return (
    <section id="contact" className="section-contact" ref={sectionRef}>
      <div className="section-container">

        {/* Section Header with Separate Masked Editorial Animation */}
        <div className="section-head contact-section-head">
          <div className="contact-kicker-mask">
            <div className="section-kicker contact-kicker">
              <span>GET IN TOUCH</span>
            </div>
          </div>

          <h2 className="section-title contact-title">
            <span className="contact-title-mask">
              <span className="contact-title-main">INITIATE A</span>
            </span>{' '}
            <span className="contact-title-mask">
              <span className="contact-title-accent title-highlight">CONVERSATION.</span>
            </span>
          </h2>

          <div className="contact-desc-mask">
            <p className="section-desc contact-desc">
              Tell me what you're building, your goals, or your timeline. I review every enquiry
              personally and respond with technical insights and next steps.
            </p>
          </div>
        </div>

        {/* Contact Layout */}
        <div className="contact-layout">

          {/* Left Column: Freelance Contact Form */}
          <div className="contact-form-column contact-seq-item">
            {status.submitted ? (
              <div className="form-success-box" role="status" aria-live="polite">
                <div className="success-icon" aria-hidden="true">✓</div>
                <h3 className="success-title">ENQUIRY SENT</h3>
                <p className="success-desc">
                  Thanks — I'll get back to you soon.
                </p>
                <LiquidGlassButton
                  variant="secondary"
                  size="md"
                  className="reset-form-btn"
                  onClick={handleReset}
                >
                  Send another message
                </LiquidGlassButton>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                {status.error && (
                  <div className="form-error-banner" role="alert">
                    <span className="error-icon" aria-hidden="true">!</span>
                    <span>{status.error}</span>
                  </div>
                )}

                {/* Row 1: Name and Email */}
                <div className="form-row form-row-two">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      NAME <span className="label-required">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      autoComplete="name"
                      disabled={status.loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      EMAIL <span className="label-required">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      autoComplete="email"
                      disabled={status.loading}
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number (Mandatory, International format) */}
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    PHONE NUMBER <span className="label-required">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="e.g. +1 555 019 2834 or +91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    disabled={status.loading}
                  />
                </div>

                {/* Row 3: Project Details (Main larger textarea) */}
                <div className="form-group">
                  <label htmlFor="project_details" className="form-label">
                    PROJECT DETAILS <span className="label-required">*</span>
                  </label>
                  <textarea
                    id="project_details"
                    name="project_details"
                    required
                    rows="5"
                    placeholder="Tell me what you're building, your goals, timeline, or anything you'd like to share."
                    value={formData.project_details}
                    onChange={handleChange}
                    className="form-textarea"
                    disabled={status.loading}
                  />
                </div>

                {/* Submit Action */}
                <LiquidGlassButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status.loading}
                  className="form-submit-btn"
                  icon={status.loading ? null : <span className="submit-arrow" aria-hidden="true">→</span>}
                >
                  {status.loading ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}
                </LiquidGlassButton>
              </form>
            )}
          </div>

          {/* Right Column: Minimal Direct Contact */}
          <div className="contact-sidebar contact-seq-item">
            <div className="direct-card">
              <span className="direct-kicker">DIRECT CONTACT</span>

              <div className="direct-email-wrapper">
                <span className="direct-email-label">DIRECT EMAIL</span>
                <span className="direct-email-address">{directEmail}</span>
              </div>

              <LiquidGlassButton
                href={`mailto:${directEmail}`}
                variant="secondary"
                size="md"
                className="direct-email-btn"
                icon={<span className="direct-email-arrow" aria-hidden="true">↗</span>}
              >
                EMAIL ME
              </LiquidGlassButton>

              {/* Direct Phone */}
              <div className="direct-email-wrapper">
                <span className="direct-email-label">DIRECT PHONE</span>
                <a href="tel:+919360589453" className="direct-email-address">
                  9360589453
                </a>
              </div>

              {/* Direct WhatsApp */}
              <div className="direct-whatsapp-block">
                <span className="direct-whatsapp-kicker">WHATSAPP</span>
                <LiquidGlassButton
                  href="/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                  className="whatsapp-chat-btn"
                  icon={<span className="direct-email-arrow" aria-hidden="true">↗</span>}
                  ariaLabel="Chat on WhatsApp"
                >
                  CHAT ON WHATSAPP
                </LiquidGlassButton>
              </div>

              <div className="direct-location-note">
                <span className="location-dot" aria-hidden="true" />
                <span>Tirunelveli, India</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
