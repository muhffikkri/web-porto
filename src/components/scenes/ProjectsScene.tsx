import { useLayoutEffect, useRef, useState } from 'react'
import { PROJECTS, type Project } from '../../data/projects'
import { SCENES } from '../../data/scenes'
import { distanceTo, scroll } from '../../lib/scroll'
import { SceneTitle } from '../ui/SceneTitle'
import { ProjectCard } from '../ui/ProjectCard'
import { ProjectLightbox } from '../ui/ProjectLightbox'

const Z = SCENES[3].z

/** World units before the scene centre over which the title climbs. */
const RISE = 18
/** vh the title climbs: from the viewport centre to its resting height. */
const RISE_VH = 38

export function ProjectsScene() {
  const [open, setOpen] = useState<Project | null>(null)
  const head = useRef<HTMLDivElement>(null)
  const cards = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let raf = 0
    const place = () => {
      raf = requestAnimationFrame(place)
      const h = head.current
      if (!h) return
      const d = distanceTo(Z)
      // 0 with the scene still ahead, 1 once the camera reaches it. Coming from
      // skills, the title arrives centred and lifts as the reader scrolls on.
      const t = Math.max(0, Math.min(1, (d + RISE) / RISE))
      h.style.transform = scroll.stepped ? 'none' : `translateY(${-RISE_VH * t}vh)`
      if (cards.current) {
        // The carousel waits until the title has finished climbing, so the
        // section opens on its name rather than on a face of cards.
        cards.current.style.visibility = t > 0.75 ? 'visible' : 'hidden'
      }
    }
    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="panel panel--carousel" aria-label="Projects">
      {/* The heading sits above the arc. Inside the centred card it would
          land on top of the readable project. */}
      <div ref={head} className="carousel-head">
        <SceneTitle title="PROJECTS" index="03" id="projects-heading" />
      </div>

      {/* The cards are the visible carousel. This list is what a screen reader
          and a crawler get, so every project is reachable without the arc. */}
      <ol className="sr-only">
        {PROJECTS.map((p, i) => (
          <li key={p.id}>
            {i + 1}. {p.title}. {p.description} {p.tags.join(', ')}.
          </li>
        ))}
      </ol>

      {/* Grouped so the narrow layout can stack the cards instead of
          relying on absolute positioning. */}
      <div ref={cards} className="panel--cards">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} count={PROJECTS.length} onOpen={setOpen} />
        ))}
      </div>

      {open && <ProjectLightbox project={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
