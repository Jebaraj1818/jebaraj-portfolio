import { Navbar } from './components/layout/Navbar'
import { CinematicLanding } from './components/landing/CinematicLanding'
import { About } from './components/about/About'
import { SelectedWork } from './components/work/SelectedWork'
import { Services } from './components/services/Services'
import { Skills } from './components/skills/Skills'
import { WorkWithMe } from './components/hire/WorkWithMe'
import { Contact } from './components/contact/Contact'
import { Footer } from './components/layout/Footer'
import { FloatingActions } from './components/ui/FloatingActions'

export default function App() {
  return (
    <div className="site-shell">
      {/* ── Fixed Navigation Bar ─────────────────────────────── */}
      <Navbar />

      <main id="main-content">
        {/* ── 00. Hero: Immediate Brand + Cinematic Scroll Video ── */}
        <CinematicLanding />

        {/* ── 01. About Jebaraj.P: Personal Introduction & Story ── */}
        <About />

        {/* ── 02. Selected Work: Case Studies & Projects ────────── */}
        <SelectedWork />

        {/* ── 03. Capabilities & Services: What I Build ──────────── */}
        <Services />

        {/* ── 04. Technical Stack & Skills ───────────────────────── */}
        <Skills />

        {/* ── 05. Work With Me: Freelance Process & Conversion ──── */}
        <WorkWithMe />

        {/* ── 06. Contact: Enquiry Form & Direct Details ────────── */}
        <Contact />
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <Footer />

      {/* ── Floating Controls: WhatsApp Orb & Scroll-to-Top ──── */}
      <FloatingActions />
    </div>
  )
}

