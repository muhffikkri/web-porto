import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChevronDownIcon } from './Icons.jsx'
import { profile } from '../content.js'
import { prefersReducedMotion, scrollTo } from '../lib/scroll.js'

const WORD = 'SYNCHRONIZING'
const STATES = ['SCANNING', 'ALIGNING', 'RESOLVING', 'SYNCHRONISED']

function jitter(seed) {
  const raw = Math.sin(seed * 127.1 + 3.7) * 43758.5453
  return raw - Math.floor(raw)
}

export function SyncScene() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const wordRef = useRef(null)
  const meterRef = useRef(null)
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const focusRef = useRef(null)
  const cueRef = useRef(null)
  const [readout, setReadout] = useState(STATES[0])

  useGSAP(() => {
    const stage = stageRef.current
    const chars = Array.from(wordRef.current.querySelectorAll('.sync-char'))
    const nameChars = Array.from(nameRef.current.querySelectorAll('.identity-char'))
    const meter = meterRef.current.querySelector('.sync-meter-fill')

    if (prefersReducedMotion()) {
      setReadout(STATES[3])
      gsap.set([stage, nameRef.current, roleRef.current, focusRef.current, cueRef.current], {
        opacity: 1,
        y: 0,
      })
      gsap.set(meter, { scaleX: 1 })
      gsap.set(wordRef.current, { display: 'none' })
      return
    }

    const timeline = gsap.timeline()

    timeline.set(chars, { opacity: 0 })
    timeline.to(chars, {
      opacity: 1,
      duration: 0.08,
      stagger: { each: 0.045, from: 'random' },
    }, 0.1)

    const flickers = [
      { at: 0.44, hold: 0.07, order: 'start' },
      { at: 0.72, hold: 0.05, order: 'end' },
      { at: 1.04, hold: 0.08, order: 'start' },
      { at: 1.3, hold: 0.05, order: 'end' },
      { at: 1.58, hold: 0.09, order: 'start' },
    ]

    flickers.forEach((flicker) => {
      timeline.to(chars, {
        opacity: () => 0.05 + jitter(flicker.at) * 0.5,
        duration: flicker.hold,
        stagger: { each: 0.02, from: flicker.order },
      }, flicker.at)
      timeline.to(chars, {
        opacity: 1,
        duration: flicker.hold,
        stagger: { each: 0.02, from: flicker.order === 'start' ? 'end' : 'start' },
      }, flicker.at + flicker.hold + 0.03)
    })

    timeline.to(chars, {
      opacity: 0,
      duration: 0.12,
      stagger: { each: 0.055, from: 'random' },
    }, 1.98)

    timeline.to(meter, { scaleX: 1, duration: 2.4, ease: 'power1.inOut' }, 0.15)

    timeline.call(() => setReadout(STATES[1]), null, 1.02)
    timeline.call(() => setReadout(STATES[2]), null, 1.82)
    timeline.call(() => setReadout(STATES[3]), null, 2.86)

    timeline.call(() => nameRef.current.classList.add('is-resolved'), null, 2.4)
    timeline.from(
      nameChars,
      { opacity: 0, yPercent: 70, duration: 0.5, stagger: 0.032, ease: 'power3.out' },
      2.42,
    )
    timeline.from(roleRef.current, { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' }, 2.96)
    timeline.from(focusRef.current, { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' }, 3.12)
    timeline.from(cueRef.current, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 3.54)
    timeline.set(wordRef.current, { visibility: 'hidden' }, 3.1)
  }, { scope: rootRef })

  return (
    <section className="sync" id="sync" ref={rootRef}>
      <div className="sync-stage" ref={stageRef}>
        <p className="sync-readout" aria-hidden="true">
          <span className="sync-dot" />
          {readout}
        </p>

        <div className="identity">
          <p className="sync-word" ref={wordRef} aria-hidden="true">
            {Array.from(WORD).map((character, index) => (
              <span className="sync-char" key={`${character}-${index}`}>
                {character}
              </span>
            ))}
          </p>
          <h1 className="identity-name" ref={nameRef}>
            <span className="identity-line" aria-hidden="true">
              {Array.from(profile.firstName.toUpperCase()).map((character, index) => (
                <span className="identity-char" key={`a-${index}`}>
                  {character}
                </span>
              ))}
            </span>
            <span className="identity-line">
              <span className="sr-only">{profile.firstName} </span>
              {Array.from(profile.lastName.toUpperCase()).map((character, index) => (
                <span className="identity-char" key={`b-${index}`} aria-hidden="true">
                  {character}
                </span>
              ))}
            </span>
          </h1>
          <p className="identity-role" ref={roleRef}>
            {profile.role}
          </p>
          <p className="identity-focus" ref={focusRef}>
            {profile.focus}
          </p>
        </div>

        <div className="sync-meter" ref={meterRef} aria-hidden="true">
          <span className="sync-meter-fill" />
        </div>
      </div>

      <button className="sync-cue" type="button" ref={cueRef} onClick={() => scrollTo('#profile')}>
        <span className="sync-cue-label">Scroll to profile</span>
        <span className="sync-cue-icon">
          <ChevronDownIcon size={18} />
        </span>
      </button>
    </section>
  )
}
