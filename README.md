# Jebaraj.P — Cinematic Portfolio Landing V1

This is the first landing-only prototype for the cinematic portfolio.

## What is implemented

- React + Vite
- GSAP + ScrollTrigger for the pinned cinematic scroll timeline
- Lenis for smooth scrolling
- Motion for React (formerly Framer Motion) for UI micro-interactions
- Flow-generated environment reference used as the current visual base
- Scroll-driven portal/ring reveal and JEBARAJ.P identity reveal
- Mobile responsive treatment
- Reduced-motion fallback

## Run

Requires a current Node.js version compatible with Vite.

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Important next step

The current `public/hero-world.jpg` is a still extracted from the approved Flow visual. It is intentionally used as a placeholder for the cinematic frame sequence.

When the final Flow video is available, convert/extract it into a frame sequence and replace the background layer with a canvas renderer. The GSAP timeline can then scrub the exact video frame from scroll position.

## 21st.dev

21st is being treated as a copy-owned component source rather than a runtime dependency. Later UI pieces (navigation, buttons, project interactions, etc.) can be pulled from 21st and adapted to this design system.

## Taste Skill

No Taste Skill was available in the current tool environment, so this prototype uses the design direction established in the conversation: graphite/black + cyan with restrained violet, cinematic depth, architectural scale and minimal UI.
