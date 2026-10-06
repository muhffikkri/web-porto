import { useRef } from 'react'
import { entries } from '../content.js'
import { useReveal } from '../hooks/useReveal.js'

export function Work() {
  const ref = useRef(null)
  useReveal(ref, { y: 30, stagger: 0.09 })

  return (
    <section className="band band-work" id="work" ref={ref}>
      <div className="shell">
        <header className="band-head">
          <p className="tag" data-reveal>
            <span className="tag-index">02</span>
            Selected work
          </p>
          <h2 className="band-title" data-reveal>
            Three systems, each one built end to end.
          </h2>
        </header>

        <ol className="entries">
          {entries.map((entry, index) => (
            <li className="entry" key={entry.id} data-reveal>
              <p className="entry-index">{String(index + 1).padStart(2, '0')}</p>
              <div className="entry-body">
                <h3 className="entry-title">{entry.title}</h3>
                <p className="entry-desc">{entry.description}</p>
                <ul className="entry-tags">
                  {entry.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <p className="entry-meta">{entry.category}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
