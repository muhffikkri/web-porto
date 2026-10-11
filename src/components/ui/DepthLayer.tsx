import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { SCENES } from '../../data/scenes'
import { distanceTo, scroll } from '../../lib/scroll'
import { NEAR, PASS_TAIL } from '../../lib/depth'
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
 * The passed side mirrors the approach: full for `hold`, then out by
 * PASS_TAIL. A scene whose content plays out down the corridor (the carousel)
 * sets a long hold, so the panel stays fully lit until the last piece has had
 * its moment. Returning 1 for every passed panel pinned sections at full
 * opacity indefinitely, so a hold is always paired with a fade tail.
 */
function sceneOpacity(d: number, span: number, hold: number) {
  if (d > 0) {
    const end = hold + PASS_TAIL
    if (d >= end) return 0
    if (d <= hold) return 1
    return Math.max(0, 1 - (d - hold) / Math.max(1, PASS_TAIL)) ** FALLOFF
  }
  const a = -d
  if (a <= NEAR) return 1
  return Math.max(0, 1 - (a - NEAR) / Math.max(1, span - NEAR)) ** FALLOFF
}

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
          <DepthPanel
            key={scene.id}
            z={scene.z}
            id={scene.id}
            span={scene.span}
            hold={scene.hold}
            gated={i === 0}
          >
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
  hold = NEAR,
  gated,
  children,
}: {
  z: number
  id: string
  /** Distance ahead at which this panel has faded out. */
  span?: number
  /**
   * Distance past the camera the panel stays fully lit. A hold longer than
   * NEAR also pins the panel centred, so it stands still while the camera
   * travels on and its content (the carousel) plays in place.
   */
  hold?: number
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
      // A held panel is culled only once its own fade has run out, which for a
      // long hold is well past the next scene.
      if (d >= hold + PASS_TAIL) {
        // Already travelled through the viewport.
        el.style.visibility = 'hidden'
        return
      }
      el.style.visibility = 'visible'

      // A held panel stands still (pinned) until its hold ends, then drifts
      // away and fades. Without a hold it travels the corridor as before.
      const pinned = hold > NEAR
      const travel = pinned && d > 0 ? Math.max(0, d - hold) : d

      // Signed translateZ: a panel ahead is pushed away, a panel the camera
      // has passed is pulled toward the viewer and grows past the screen.
      // Under reduced motion the panel does not move: the camera cuts.
      const tz = scroll.stepped ? 0 : travel * PX_PER_UNIT
      el.style.transform = `translate3d(0, ${(travel * PX_PER_UNIT) / 6}px, ${tz}px)`

      const fade = sceneOpacity(d, span, hold)
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