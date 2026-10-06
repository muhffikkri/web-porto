import { useRef } from 'react'
import { capabilities } from '../content.js'
import { useReveal } from '../hooks/useReveal.js'

export function Capabilities() {
  const ref = useRef(null)
  useReveal(ref, { y: 20, stagger: 0.08 })

  return (
    <section className="band band-cap" id="capabilities" ref={ref}>
      <div className="shell">
        <header className="band-head">
          <p className="tag" data-reveal>
            <span className="tag-index">03</span>
            Capabilities
          </p>
          <h2 className="band-title" data-reveal>
            What I reach for.
          </h2>
        </header>

        <div className="cap-grid">
          {capabilities.map((group) => (
            <div className="cap" key={group.title} data-reveal>
              <h3 className="cap-title">{group.title}</h3>
              <ul className="cap-list">
                {group.items.map((item) => (
                  <li key={item} data-reveal>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
