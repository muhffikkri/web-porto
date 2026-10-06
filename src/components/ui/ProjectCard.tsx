import { useLayoutEffect, useRef } from 'react'
import type { Project } from '../../data/projects'
import { slot, type Slot } from '../../lib/carousel'

type Props = {
  project: Project
  index: number
  count: number
}

/**
 * One project on the arc. A card the camera has passed is culled rather than
 * scaled up, otherwise it sweeps across the readable card in front of it.
 */
export function ProjectCard({ project, index, count }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let raf = 0
    const place = () => {
      raf = requestAnimationFrame(place)
      const el = root.current
      if (!el) return

      const s: Slot = slot(index, count)
      if (!s.visible) {
        el.style.visibility = 'hidden'
        return
      }
      el.style.visibility = 'visible'
      el.style.transform = `translate3d(${s.x}vw, 0, 0) rotateY(${s.tilt}deg) scale(${s.scale})`
      el.style.opacity = String(s.opacity)
      el.style.filter = s.blur ? `blur(${s.blur}px)` : ''
      el.style.pointerEvents = s.centred ? 'auto' : 'none'
      el.setAttribute('aria-hidden', String(!s.centred))
    }
    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [index, count])

  return (
    <div ref={root} className="project-card" style={{ visibility: 'hidden' }}>
      <article className="project-entry" aria-label={project.title}>
        <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <ul className="project-tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer noopener">
              Live Demo
            </a>
          )}
        </p>
      </article>
    </div>
  )
}