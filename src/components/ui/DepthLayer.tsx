import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { SCENES } from '../../data/scenes'
import { distanceTo, scroll } from '../../lib/scroll'
import { NEAR, PASS_FADE } from '../../lib/depth'
import { intro } from '../../lib/intro'

/** Falloff exponent. Higher keeps far panels fainter for longer. */
const FALLOFF = 3
import { HeroScene } from '../scenes/HeroScene'
import { AboutScene } from '../scenes/AboutScene'
import { SkillsScene } from '../scenes/SkillsScene'
import { ProjectsScene } from '../scenes/ProjectsScene'
import { ExperienceScene } from '../scenes/ExperienceScene'
import { ContactScene } from '../scenes/ContactScene'

const CONTENT = [HeroScene, AboutScene, SkillsScene, ProjectsScene, ExperienceScene, ContactScene]

/** CSS pixels of panel travel per world unit. */
const PX_PER_UNIT = 14
/**
 * Opacity for a scene panel.
 *
 * Within NEAR the scene the camera is travelling toward is fully legible, and
 * only past that does it fall off. A single distance curve would leave the
 * hero, which the camera starts ahead of, permanently dim.
 *
 * The passed side mirrors the approach: full for NEAR, then out by
 * PASS_FADE. Returning 1 for every passed panel left sections pinned at
 * full opacity for PASSED units after the camera left them, then popped.
 */
function sceneOpacity(d: number, span: number) {
  if (d > 0) {
    if (d >= PASS_FADE) return 0
    if (d <= NEAR) return 1
    return Math.max(0, 1 - (d - NEAR) / Math.max(1, PASS_FADE - NEAR)) ** FALLOFF
  }
  const a = -d
  if (a <= NEAR) return 1
  return Math.max(0, 1 - (a - NEAR) / Math.max(1, span - NEAR)) ** FALLOFF
}
/** Once a panel is this many units past the camera it has left the viewport. */
const PASSED = 26

/**
 * All portfolio text lives in one DOM layer under a single CSS perspective,
 * so panels depth-sort against each other the way the WebGL world does.
 * Crisp, selectable, and screen-reader accessible.
 */
export function DepthLayer() {
  return (
    <>
      {SCENES.map((scene, i) => {
        const Content = CONTENT[i]
        return (
          <DepthPanel key={scene.id} z={scene.z} id={scene.id} span={scene.span} gated={i === 0}>
            <Content />
          </DepthPanel>
        )
      })}
    </>
  )
}

export function DepthPanel({
  z,
  id,
  span = 20,
  gated,
  children,
}: {
  z: number
  id: string
  /** Distance ahead at which this panel has faded out. */
  span?: number
  /** Fades in with the opening sequence instead of on distance alone. */
  gated?: boolean
  children: ReactNode
}) {
  const panel = useRef<HTMLElement>(null)
  const body = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let raf = 0
    const place = () => {
      raf = requestAnimationFrame(place)
      const el = panel.current
      const content = body.current
      if (!el || !content) return

      const d = distanceTo(z)
      if (d > PASSED) {
        // Already travelled through the viewport.
        el.style.visibility = 'hidden'
        return
      }
      el.style.visibility = 'visible'

      // Signed translateZ: a panel ahead is pushed away, a panel the camera
      // has passed is pulled toward the viewer and grows past the screen.
      // Under reduced motion the panel does not move: the camera cuts.
      const tz = scroll.stepped ? 0 : d * PX_PER_UNIT
      el.style.transform = `translate3d(0, ${(d * PX_PER_UNIT) / 6}px, ${tz}px)`

      const fade = sceneOpacity(d, span)
      // Reduced motion cuts between scenes, so nothing slides or blurs into
      // place: the panel is simply there or it is not.
      if (scroll.stepped) {
        content.style.opacity = fade > 0.5 ? '1' : '0'
        content.style.filter = ''
        return
      }
      content.style.opacity = String(gated ? fade * intro.reveal : fade)
      const blur = -d > NEAR ? Math.min(5, (-d - NEAR) / 11) : 0
      content.style.filter = blur ? `blur(${blur}px)` : ''
    }
    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [z, span, gated])

  // transform on the section (so panels depth-sort), opacity and filter on the
  // inner wrapper. Putting either on the section would flatten its preserve-3d
  // and panels would paint in DOM order instead of by distance.
  return (
    <section id={id} ref={panel} className="depth-panel">
      <div ref={body} className="depth-panel-body">
        {children}
      </div>
    </section>
  )
}