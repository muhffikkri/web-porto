import { PROJECTS } from '../../data/projects'
import { SceneTitle } from '../ui/SceneTitle'
import { ProjectCard } from '../ui/ProjectCard'

export function ProjectsScene() {
  return (
    <section className="panel panel--carousel" aria-label="Projects">
      {/* The heading sits above the arc. Inside the centred card it would
          land on top of the readable project. */}
      <div className="carousel-head">
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
      <div className="panel--cards">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} count={PROJECTS.length} />
        ))}
      </div>
    </section>
  )
}