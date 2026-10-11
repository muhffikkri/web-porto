import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../../data/projects'
import { lockScroll } from '../../lib/smooth'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * The project detail view: one card blown up over the corridor, its image
 * enlarged with a lighthouse glow behind it, and the full description.
 *
 * Rendered through a portal because it opens from inside the depth layer,
 * whose 3D transform would otherwise trap a fixed overlay inside the panel.
 */
export function ProjectLightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const card = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opened = document.activeElement as HTMLElement | null
    lockScroll(true)
    close.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      // Keep Tab inside the dialog while it is open.
      const nodes = card.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!nodes || nodes.length === 0) return
      const list = Array.from(nodes)
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
      opened?.focus?.()
    }
  }, [onClose])

  const text = project.detail ?? project.description

  return createPortal(
    <div className="lightbox" role="presentation" onClick={onClose}>
      {/* The lighthouse: a warm glow with a slow sweep behind the card, so the
          opened project is the one lit thing on screen. */}
      <div className="lightbox-scrim" aria-hidden="true">
        <span className="lightbox-glow" />
        <span className="lightbox-beam" />
      </div>

      <div
        ref={card}
        className="lightbox-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={close} className="lightbox-close" type="button" onClick={onClose}>
          Close
        </button>

        {project.image && (
          <div className="lightbox-image">
            <img src={`/project-screenshots/${project.image}`} alt={`${project.title} screenshot`} />
          </div>
        )}

        <div className="lightbox-body">
          <h3 className="lightbox-title" id="lightbox-title">
            {project.title}
          </h3>
          {project.tags.length > 0 && (
            <ul className="lightbox-tags">
              {project.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <p className="lightbox-desc">{text}</p>
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
        </div>
      </div>
    </div>,
    document.body,
  )
}
