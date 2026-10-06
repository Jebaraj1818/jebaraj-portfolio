import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ReactLenis, useLenis } from 'lenis/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import App from './App'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })
if (typeof window !== 'undefined') {
  window.ScrollTrigger = ScrollTrigger
  window.gsap = gsap
}

/**
 * Bridges Lenis smooth scroll with GSAP ScrollTrigger via GSAP's ticker.
 * Ensures Lenis RAF and ScrollTrigger updates occur in the same unified frame.
 */
function LenisScrollTriggerSync() {
  const lenis = useLenis((lenisInstance) => {
    ScrollTrigger.update()
  })

  useEffect(() => {
    if (!lenis) return

    function update(time) {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    if (typeof window !== 'undefined') {
      window.__lenis = lenis
    }

    return () => {
      gsap.ticker.remove(update)
    }
  }, [lenis])

  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactLenis
      root
      autoRaf={false}
      options={{
        lerp: 0.08,
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      <LenisScrollTriggerSync />
      <App />
    </ReactLenis>
  </React.StrictMode>
)
