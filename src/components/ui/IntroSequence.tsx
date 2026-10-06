import { useEffect, useRef } from 'react'
import { scroll } from '../../lib/scroll'
import { intro, resolveReveal, syncFrame } from '../../lib/intro'

/**
 * The opening readout. Runs entirely in rAF and writes to the DOM, so the
 * intro never re-renders React and never blocks scrolling.
 */
export function IntroSequence({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLParagraphElement>(null)
  const meter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const start = performance.now()
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const elapsed = performance.now() - start
      intro.reveal = resolveReveal(elapsed, scroll.progress, reduced)

      const el = root.current
      if (!el) return

      // Once the sequence has resolved, stop painting it at all.
      if (intro.reveal >= 1) {
        el.style.visibility = 'hidden'
        return
      }
      el.style.visibility = 'visible'
      el.style.opacity = String(1 - intro.reveal)

      if (readout.current) readout.current.textContent = syncFrame(elapsed)
      if (meter.current) meter.current.style.transform = `scaleX(${intro.reveal})`
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      intro.reveal = 1
    }
  }, [reduced])

  return (
    <div ref={root} className="intro" aria-hidden="true">
      <p ref={readout} className="intro-readout">
        SYNCHRONIZING
      </p>
      <span className="intro-meter">
        <span ref={meter} className="intro-meter-fill" />
      </span>
    </div>
  )
}