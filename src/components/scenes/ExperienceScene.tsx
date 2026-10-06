import { useLayoutEffect, useRef } from 'react'
import { SCENES } from '../../data/scenes'
import { MILESTONES, type Milestone } from '../../data/experience'
import { marker } from '../../lib/milestones'
import { cameraZ } from '../../lib/scroll'
import { SceneTitle } from '../ui/SceneTitle'

const Z = SCENES[4].z

export function ExperienceScene() {
  return (
    <section className="panel" aria-label="Experience">
      <div className="panel-center">
        <SceneTitle title="EXPERIENCE" index="04" id="experience-heading" />
      </div>

      <ol className="sr-only">
        {MILESTONES.map((m) => (
          <li key={m.id}>
            {m.period}. {m.role}, {m.org}. {m.detail}
          </li>
        ))}
      </ol>

      {MILESTONES.map((m, i) => (
        <Milestone key={m.id} milestone={m} index={i} count={MILESTONES.length} />
      ))}
    </section>
  )
}

function Milestone({
  milestone: m,
  index,
  count,
}: {
  milestone: Milestone
  index: number
  count: number
}) {
  const ref = useRef<HTMLLIElement>(null)

  useLayoutEffect(() => {
    let raf = 0
    const place = () => {
      raf = requestAnimationFrame(place)
      const el = ref.current
      if (!el) return

      const s = marker(index, count, cameraZ())
      if (!s.visible) {
        el.style.visibility = 'hidden'
        return
      }
      el.style.visibility = 'visible'
      el.style.transform = `translate3d(0, 0, ${Math.min(s.d, 0) * 14}px) scale(${s.scale})`
      el.style.opacity = String(s.opacity)
      el.style.filter = s.blur ? `blur(${s.blur}px)` : ''
    }
    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [index, count])

  return (
    <li
      ref={ref}
      className="milestone"
      style={{ left: `${50 + m.x}%`, top: `${50 + m.y}%`, visibility: 'hidden' }}
      data-scene={`milestone-${index}`}
    >
      <span className="milestone-period">{m.period}</span>
      <h3 className="milestone-role">{m.role}</h3>
      <span className="milestone-org">{m.org}</span>
      <p className="milestone-detail">{m.detail}</p>
      <span className="sr-only">Milestone {index + 1} of {count}</span>
    </li>
  )
}

export { Z }