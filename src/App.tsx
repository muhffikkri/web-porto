import { MemoryWorld } from './components/experience/MemoryWorld'
import { DepthLayer } from './components/ui/DepthLayer'
import { HUD } from './components/ui/HUD'
import { IntroSequence } from './components/ui/IntroSequence'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useReducedMotion } from './hooks/useReducedMotion'
import { WORLD_SCROLL_VH } from './data/scenes'
import { hasWebGL } from './lib/quality'

/**
 * Whether the experience is a corridor the camera travels, or a document that
 * scrolls. Read once: it decides the layout, not just the visuals.
 */
export function isCorridor() {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return window.innerWidth > 720
}

export default function App() {
  // Reduced motion first: it has to be on the store before scroll reads it.
  const reduced = useReducedMotion()
  const corridor = isCorridor()
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