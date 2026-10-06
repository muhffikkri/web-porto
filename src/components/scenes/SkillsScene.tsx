import { useMemo } from 'react'
import { SCENES } from '../../data/scenes'
import { SKILL_GROUPS } from '../../data/skills'
import { constellation } from '../../lib/constellation'
import { SceneTitle } from '../ui/SceneTitle'
import { FloatPanel } from '../ui/FloatPanel'

const Z = SCENES[2].z

export function SkillsScene() {
  const stars = useMemo(() => constellation(SKILL_GROUPS), [])

  return (
    <section className="panel panel--wide" aria-labelledby="skills-heading">
      <div className="panel-center">
        <SceneTitle title="SKILLS" index="02" id="skills-heading" />
        {/* The constellation is the visual; this list is what a screen reader
            and a search engine actually get. */}
        <ul className="skill-cloud" aria-label="Skills by group">
          {SKILL_GROUPS.map((group) => (
            <li key={group.label} className="sr-only">
              {group.label}: {group.skills.join(', ')}
            </li>
          ))}
        </ul>
      </div>

      {stars.map((star) => (
        <FloatPanel
          key={star.skill}
          sceneZ={Z}
          offsetZ={star.z}
          x={star.x}
          y={star.y}
          className="skill-star"
        >
          <span className="skill-label" style={{ fontSize: `${star.size}px` }}>
            {star.skill}
          </span>
        </FloatPanel>
      ))}
    </section>
  )
}