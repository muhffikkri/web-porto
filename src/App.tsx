import { MemoryWorld } from './components/experience/MemoryWorld'
import { DepthLayer } from './components/ui/DepthLayer'
import { HUD } from './components/ui/HUD'
import { IntroSequence } from './components/ui/IntroSequence'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useReducedMotion } from './hooks/useReducedMotion'
import { WORLD_SCROLL_VH } from './data/scenes'

export default function App() {
  useScrollProgress()
  const reduced = useReducedMotion()

  return (
    <>
      <MemoryWorld reduced={reduced} />
      {/* The scrollbar is the camera rail. This div is the only thing that gives it length. */}
      <div className="scroll-rail" style={{ height: `${WORLD_SCROLL_VH}vh` }} aria-hidden="true" />
      <DepthLayer />
      <div className="vignette" aria-hidden="true" />
      <IntroSequence reduced={reduced} />
      <HUD />
    </>
  )
}