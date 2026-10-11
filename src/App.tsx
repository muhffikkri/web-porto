import { useEffect, useState } from 'react'
import { MemoryWorld } from './components/experience/MemoryWorld'
import { DepthLayer } from './components/ui/DepthLayer'
import { HUD } from './components/ui/HUD'
import { IntroSequence } from './components/ui/IntroSequence'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useReducedMotion, prefersReducedMotion } from './hooks/useReducedMotion'
import { WORLD_SCROLL_VH } from './data/scenes'
import { hasWebGL } from './lib/quality'

/**
 * Width at or below which the corridor becomes a plain scrolling document.
 * Must stay in step with the layout breakpoint in index.css.
 */
export const CORRIDOR_MIN_WIDTH = 720

/**
 * Whether the experience is a corridor the camera travels, or a document that
 * scrolls. Tablets keep the corridor; phones and reduced motion get the
 * document.
 */
export function isCorridor() {
  if (typeof window === 'undefined') return true
  if (prefersReducedMotion()) return false
  return window.innerWidth > CORRIDOR_MIN_WIDTH
}

/**
 * The corridor decision, kept in sync as the viewport changes. A phone
 * rotation or a resize across the breakpoint has to re-lay the page, not
 * leave it half corridor and half document.
 */
function useCorridor() {
  const [corridor, setCorridor] = useState(isCorridor)
  useEffect(() => {
    const update = () => setCorridor(isCorridor())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.addEventListener('resize', update)
    mq.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      mq.removeEventListener('change', update)
    }
  }, [])
  return corridor
}

export default function App() {
  // Reduced motion first: it has to be on the store before scroll reads it.
  const reduced = useReducedMotion()
  const corridor = useCorridor()
  useScrollProgress()

  return (
    <>
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      {hasWebGL() && <MemoryWorld reduced={reduced} />}
      {/* The camera rail. On a phone or with reduced motion the depth layer
          stops being a corridor and becomes a document, and then this would
          be a very long stretch of empty page, so it is not rendered. */}
      {corridor && (
        <div className="scroll-rail" style={{ height: `${WORLD_SCROLL_VH}vh` }} aria-hidden="true" />
      )}
      {/* Without WebGL the same markup becomes a normal scrolling document. */}
      <main className="depth-layer" id="content">
        <DepthLayer />
      </main>
      <div className="vignette" aria-hidden="true" />
      <IntroSequence reduced={reduced} />
      <HUD corridor={corridor} />
    </>
  )
}