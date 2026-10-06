import { PROFILE } from '../../data/profile'
import { SceneTitle } from '../ui/SceneTitle'

export function ContactScene() {
  return (
    <section className="panel panel--final" aria-labelledby="contact-heading">
      <div className="panel-center">
        <SceneTitle title="CONTACT" index="05" id="contact-heading" />
        <h3 className="contact-headline">LET&apos;S BUILD SOMETHING.</h3>
        <p className="contact-name">{PROFILE.name}</p>
        <ul className="contact-links">
          {PROFILE.channels.map((c) => (
            <li key={c.label}>
              <a href={c.href} target={c.external ? '_blank' : undefined} rel="noreferrer noopener">
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}