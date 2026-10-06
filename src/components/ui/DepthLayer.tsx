import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { SCENES } from '../../data/scenes'
import { distanceTo } from '../../lib/scroll'
import { HeroScene } from '../scenes/HeroScene'
import { AboutScene } from '../scenes/AboutScene'
import { SkillsScene } from '../scenes/SkillsScene'
import { ProjectsScene } from '../scenes/ProjectsScene'
import { ExperienceScene } from '../scenes/ExperienceScene'
import { ContactScene } from '../scenes/ContactScene'

const CONTENT = [HeroScene, AboutScene, SkillsScene, ProjectsScene, ExperienceScene, ContactScene]

/** CSS pixels of panel travel per world unit. */
const PX_PER_UNIT = 14
/** World units at which a panel has faded out completely. */
const FADE = 75
/** World units behind the camera after which a panel stops painting. */
const CULL_BEHIND = 18

/**
 * All portfolio text lives in one DOM layer under a single CSS perspective,
 * so panels depth-sort against each other the way the WebGL world does.
 * Crisp, selectable, and screen-reader accessible.
 */
export function DepthLayer() {
  return (
    <div className="depth-layer">
      {SCENES.map((scene, i) => {
        const Content = CONTENT[i]
        return (
          <DepthPanel key={scene.id} z={scene.z} id={scene.id}>
            <Content />
          </DepthPanel>
        )
      })}
    </div>
  )
}

export function DepthPanel({
  z,
  id,
  children,
}: {
  z: number
  id: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let raf = 0
    const place = () => {
      raf = requestAnimationFrame(place)
      const el = ref.current
      if (!el) return

      const d = distanceTo(z)
      if (d > CULL_BEHIND) {
        el.style.visibility = 'hidden'
        return
      }
      el.style.visibility = 'visible'
      const ad = Math.abs(d)
      el.style.transform = `translate3d(0, ${(d * PX_PER_UNIT) / 6}px, ${-ad * PX_PER_UNIT}px)`
      el.style.opacity = String(Math.max(0, Math.min(1, 1 - ad / FADE)))
      el.style.filter = ad > 4 ? `blur(${Math.min(5, (ad - 4) / 11)}px)` : ''
    }
    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [z])

  // No inline style: React must not fight the rAF loop that owns visibility.
  return (
    <section id={id} ref={ref} className="depth-panel">
      {children}
    </section>
  )
}