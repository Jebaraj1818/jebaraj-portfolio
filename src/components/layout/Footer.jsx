import { useLenis } from 'lenis/react'
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa6'

export function Footer() {
  const lenis = useLenis()

  const directEmail = 'jebaraj1364@gmail.com'
  const directPhone = '9360589453'
  const whatsappUrl = '/whatsapp'
  const linkedinUrl = 'https://in.linkedin.com/in/jeba-raj-bb350a395'
  const githubUrl = 'https://github.com/Jebaraj1818'

  const navTo = (target) => {
    if (target === 'top' || target === '#hero') {
      if (lenis) lenis.scrollTo(0, { duration: 1.6 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4 })
    } else {
      const el = document.querySelector(target)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const quickLinks = [
    { label: 'Home', target: 'top' },
    { label: 'About', target: '#about' },
    { label: 'Work', target: '#work' },
    { label: 'Services', target: '#services' },
    { label: 'Skills', target: '#skills' },
    { label: 'Contact', target: '#contact' },
  ]

  const connectLinks = [
    {
      label: 'LinkedIn',
      url: linkedinUrl,
      icon: FaLinkedin,
      ariaLabel: 'Jeba Raj on LinkedIn',
    },
    {
      label: 'GitHub',
      url: githubUrl,
      icon: FaGithub,
      ariaLabel: 'Jeba Raj on GitHub',
    },
    {
      label: 'WhatsApp',
      url: whatsappUrl,
      icon: FaWhatsapp,
      ariaLabel: 'Contact Jeba Raj on WhatsApp',
    },
  ]

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-container">

        {/* ── Editorial Footer Main Layout (No Long Rectangle / Card) ── */}
        <div className="footer-editorial-layout">

          {/* ── Left Column: Brand, Role, Bio & Direct Contact Details ── */}
          <div className="footer-brand-col">
            <div className="footer-brand-identity">
              <span className="footer-brand-name">
                JEBARAJ<span className="brand-dot">.P</span>
              </span>
              <span className="footer-brand-role">
                Emerging Software Developer
              </span>
            </div>

            <p className="footer-brand-bio">
              Building practical software by combining business thinking, technology, and AI.
            </p>

            <div className="footer-contact-details">
              <div className="footer-contact-item">
                <span className="footer-field-label">EMAIL</span>
                <a
                  href={`mailto:${directEmail}`}
                  className="footer-field-value"
                  title="Send an email to Jebaraj"
                >
                  {directEmail}
                </a>
              </div>

              <div className="footer-contact-item">
                <span className="footer-field-label">PHONE</span>
                <a
                  href={`tel:+91${directPhone}`}
                  className="footer-field-value"
                  title="Call Jebaraj directly"
                >
                  {directPhone}
                </a>
              </div>
            </div>
          </div>

          {/* ── Right Area: Quick Navigation & Connect ────────────────── */}
          <div className="footer-nav-col">

            {/* Quick Links Column (2-Column Desktop Grid) */}
            <div className="footer-links-group footer-quick-links-group">
              <span className="footer-group-heading">QUICK LINKS</span>
              <ul className="footer-links-list footer-quick-links-grid">
                {quickLinks.map((link) => (
                  <li key={link.label} className="footer-quick-link-item">
                    <button
                      type="button"
                      className="footer-link-btn"
                      onClick={() => navTo(link.target)}
                    >
                      <span className="footer-link-text">{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect / Socials Column */}
            <div className="footer-links-group footer-connect-group">
              <span className="footer-group-heading">CONNECT</span>
              <ul className="footer-links-list footer-connect-list">
                {connectLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <li key={social.label} className="footer-connect-item">
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-editorial-link"
                        aria-label={social.ariaLabel}
                      >
                        <IconComponent className="social-icon" aria-hidden="true" />
                        <span className="social-text">{social.label}</span>
                        <span className="social-arrow" aria-hidden="true">↗</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

          </div>

        </div>

        {/* ── Bottom Bar: Minimal Copyright & Craft Line ─────────────── */}
        <div className="footer-bottom-bar">
          <span className="footer-copyright-text">
            © {new Date().getFullYear()} JEBARAJ.P. ALL RIGHTS RESERVED.
          </span>
          <span className="footer-craft-text">
            DESIGNED & ENGINEERED WITH CODE + CRAFT.
          </span>
        </div>

      </div>
    </footer>
  )
}
