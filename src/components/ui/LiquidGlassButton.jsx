import { useRef, useCallback } from 'react'
import { useLenis } from 'lenis/react'

/**
 * LiquidGlassButton
 * ─────────────────────────────────────────────────────────────
 * A global, cinematic liquid-crimson glass capsule button.
 *
 * Visual Layers:
 * 1. Base glass with deep ruby/burgundy gradient & backdrop blur
 * 2. Convex top specular rim catching key light
 * 3. Fluid reactive core following cursor with subtle refraction
 * 4. Organic light-sweep highlight on hover
 * 5. High-contrast, crisp typography and directional arrow icon
 *
 * Variants:
 * - 'primary'   : Deep crimson liquid glass with rich illumination
 * - 'secondary' : Translucent obsidian glass with subtle crimson rim
 * - 'minimal'   : Ultra-sheer glass capsule with soft refraction
 *
 * Sizes:
 * - 'sm' : Navbar, badges, modal compact actions
 * - 'md' : Work cards, modal footer, standard CTAs
 * - 'lg' : Hero primary, conversion banners, enquiry submit
 */
export function LiquidGlassButton({
  as: Component,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon,
  iconPosition = 'right',
  disabled = false,
  target,
  rel,
  ariaLabel,
  ...restProps
}) {
  const buttonRef = useRef(null)
  const lenis = useLenis()
  const rafId = useRef(null)

  // Subtle pointer tracking for fluid refraction highlights
  const handlePointerMove = useCallback((e) => {
    // Only track fine pointer (mouse), disable on touch/coarse pointers
    if (e.pointerType === 'touch') return
    const el = buttonRef.current
    if (!el) return

    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
      el.style.setProperty('--pointer-x', `${x.toFixed(1)}%`)
      el.style.setProperty('--pointer-y', `${y.toFixed(1)}%`)
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    const el = buttonRef.current
    if (!el) return
    if (rafId.current) cancelAnimationFrame(rafId.current)
    el.style.setProperty('--pointer-x', '50%')
    el.style.setProperty('--pointer-y', '50%')
  }, [])

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    if (onClick) onClick(e)

    if (href && href.startsWith('#')) {
      e.preventDefault()
      if (lenis) {
        lenis.scrollTo(href, { duration: 1.4 })
      } else {
        const targetEl = document.querySelector(href)
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const Tag = Component || (href ? 'a' : 'button')
  const tagProps = href
    ? { href, target, rel: target === '_blank' ? (rel || 'noopener noreferrer') : rel }
    : { type: Tag === 'button' ? type : undefined, disabled }

  const combinedClasses = [
    'liquid-glass-btn',
    `liquid-glass-${variant}`,
    `liquid-glass-${size}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <Tag
      ref={buttonRef}
      className={combinedClasses}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...tagProps}
      {...restProps}
    >
      {/* 1. Curved top specular glass gloss dome (resting & active) */}
      <span className="liquid-glass-gloss" aria-hidden="true" />

      {/* 2. Convex 3D specular rim & fresnel edge */}
      <span className="liquid-glass-rim" aria-hidden="true" />

      {/* 3. Fluid liquid caustic core responsive to pointer */}
      <span className="liquid-glass-fluid" aria-hidden="true" />

      {/* 4. Organic liquid shimmer & light refraction sweep */}
      <span className="liquid-glass-caustic" aria-hidden="true" />

      {/* 4. Crisp button content & directional icon */}
      <span className="liquid-glass-content">
        {icon && iconPosition === 'left' && (
          <span className="liquid-glass-icon icon-left" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="liquid-glass-text">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="liquid-glass-icon icon-right" aria-hidden="true">
            {icon}
          </span>
        )}
      </span>
    </Tag>
  )
}

export default LiquidGlassButton
