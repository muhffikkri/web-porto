import { useRef } from 'react'
import { profile } from '../content.js'
import { useReveal } from '../hooks/useReveal.js'

export function Profile() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="band band-profile" id="profile" ref={ref}>
      <div className="shell band-grid">
        <aside className="band-aside" data-reveal>
          <p className="tag">
            <span className="tag-index">01</span>
            Profile
          </p>
          <ul className="ledger">
            {profile.ledger.map((item) => (
              <li className="ledger-row" key={item.label} data-reveal>
                <span className="ledger-value">{item.value}</span>
                <span className="ledger-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="band-main">
          <h2 className="band-title" data-reveal>
            {profile.statement}
          </h2>
          <p className="lede" data-reveal>
            {profile.bio}
          </p>
        </div>
      </div>
    </section>
  )
}
