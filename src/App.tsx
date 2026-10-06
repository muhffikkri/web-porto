import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Void } from './components/Void.jsx'
import { SyncScene } from './components/SyncScene.jsx'
import { Profile } from './components/Profile.jsx'
import { Work } from './components/Work.jsx'
import { Capabilities } from './components/Capabilities.jsx'
import { Contact } from './components/Contact.jsx'
import { SiteFooter } from './components/SiteFooter.jsx'
import { HudControls } from './components/HudControls.jsx'
import { prefersReducedMotion, setScroller } from './lib/scroll.js'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()

    if (prefersReducedMotion()) {
      window.addEventListener('load', refresh)
      return () => window.removeEventListener('load', refresh)
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    const tick = (time) => lenis.raf(time * 1000)

    setScroller(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    window.addEventListener('load', refresh)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh)
    }

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      setScroller(null)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#profile">
        Skip the synchronisation sequence
      </a>

      <Void />
      <HudControls />

      <main className="shell-main">
        <SyncScene />
        <Profile />
        <Work />
        <Capabilities />
        <Contact />
      </main>

      <SiteFooter />
    </>
  )
}
