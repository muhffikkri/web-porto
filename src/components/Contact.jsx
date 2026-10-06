import { useRef } from 'react'
import { availability, channels } from '../content.js'
import { useReveal } from '../hooks/useReveal.js'

export function Contact() {
  const ref = useRef(null)
  useReveal(ref, { y: 22 })

  return (
    <section className="band band-contact" id="contact" ref={ref}>
      <div className="shell contact-grid">
        <div className="contact-intro" data-reveal>
          <p className="tag">
            <span className="tag-index">04</span>
            Contact
          </p>
          <h2 className="band-title">{availability}</h2>
        </div>

        <ul className="channels">
          {channels.map((channel) => {
            const external = channel.href.startsWith('http')
            return (
              <li key={channel.label} data-reveal>
                <a
                  className="channel"
                  data-reveal
                  href={channel.href}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                >
                  <span className="channel-label">{channel.label}</span>
                  <span className="channel-value">{channel.value}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
