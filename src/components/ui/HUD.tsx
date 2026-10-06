import { useEffect, useRef } from 'react'
import { SCENES } from '../../data/scenes'
import { cameraZ, scroll } from '../../lib/scroll'
import { scrollTargetFor } from '../../hooks/useScrollProgress'

/** DOM overlay: stays selectable, accessible, and out of the draw budget. */
export function HUD({ corridor }: { corridor: boolean }) {
  const counter = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const items = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    // In flow there is no camera to report on, so there is nothing to loop.
    if (!corridor) return

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const idx = activeScene()
      if (counter.current) {
        counter.current.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(SCENES.length).padStart(2, '0')}`
      }
      if (bar.current) bar.current.style.transform = `scaleY(${scroll.progress})`
      for (let i = 0; i < items.current.length; i++) {
        const el = items.current[i]
        if (el) el.dataset.active = String(i === idx)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [corridor])

  return (
    <div className="hud">
      <p className="hud-memory">
        <span className="sr-only">Current scene: </span>
        MEMORY <span ref={counter}>01 / 06</span>
      </p>

      <nav className="hud-nav" aria-label="Scenes">
        {SCENES.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            ref={(el) => {
              items.current[i] = el
            }}
            onClick={(e) => {
              e.preventDefault()
              // Align the camera with this scene's z.
              window.scrollTo({ top: scrollTargetFor(s.id), behavior: 'smooth' })
            }}
          >
            <span>{String(i).padStart(2, '0')}</span> {s.label}
          </a>
        ))}
      </nav>

      <span className="hud-track" aria-hidden="true">
        <span ref={bar} className="hud-track-fill" />
      </span>
    </div>
  )
}

/** Index of the scene the camera has most recently entered. */
function activeScene() {
  const z = cameraZ()
  let idx = 0
  for (let i = 0; i < SCENES.length; i++) {
    if (z <= SCENES[i].z) idx = i
  }
  return Math.min(idx, SCENES.length - 1)
}