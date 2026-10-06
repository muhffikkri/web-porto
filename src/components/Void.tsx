import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { floatingFragments } from '../content.js'

const DESKTOP = [
  { id: 'frag-a', x: -980, y: -520, z: -1500 },
  { id: 'frag-b', x: 860, y: -430, z: -1500 },
  { id: 'frag-c', x: -1120, y: 560, z: -1150 },
  { id: 'frag-d', x: 1050, y: 480, z: -1150 },
  { id: 'frag-e', x: -700, y: 700, z: -700 },
  { id: 'frag-f', x: 620, y: -680, z: -700 },
]

const MOBILE = [
  { id: 'frag-a', x: -455, y: 250, z: -1000 },
  { id: 'frag-b', x: 455, y: -320, z: -1000 },
  { id: 'frag-e', x: 0, y: 500, z: -820 },
]

const SWAY = [
  { duration: 9.4, distance: 12, tilt: 1.1 },
  { duration: 11.2, distance: -15, tilt: -0.9 },
  { duration: 8.1, distance: 9, tilt: 1.4 },
  { duration: 12.6, distance: -11, tilt: -1.2 },
  { duration: 10.3, distance: 13, tilt: 0.8 },
  { duration: 9.9, distance: -10, tilt: -1.3 },
]

export function Void() {
  const rootRef = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add(
      {
        wide: '(min-width: 900px)',
        narrow: '(max-width: 899px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { wide, reduce } = context.conditions
        const root = rootRef.current
        const burst = root.querySelector('[data-burst]')
        const rings = root.querySelector('[data-rings]')
        const floor = root.querySelector('[data-floor]')
        const plane = wide ? DESKTOP : MOBILE
        const perspective = wide ? 1200 : 900
        const base = wide ? 210 : 132
        const share = wide ? 0.45 : 0.4
        const cap = wide ? 560 : 380

        gsap.to(root, {
          perspective: perspective + 800,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        })

        plane.forEach((slot) => {
          const node = root.querySelector(`[data-slot="${slot.id}"]`)
          if (!node) return
          const reach = Math.min(Math.abs(slot.z) * share, cap)
          gsap.set(node, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            width: base * (1 + Math.abs(slot.z) / perspective),
            xPercent: -50,
            yPercent: -50,
            opacity: 1,
          })
          if (reduce) return
          gsap.to(node, {
            z: slot.z + reach,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          const sway = SWAY[DESKTOP.findIndex((entry) => entry.id === slot.id)]
          gsap.to(node, {
            keyframes: [
              { yPercent: -50, rotation: 0, y: slot.y - sway.distance, duration: sway.duration / 2 },
              { yPercent: -50, rotation: sway.tilt, y: slot.y + sway.distance, duration: sway.duration / 2 },
            ],
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        })

        const burstFrom = wide ? -2600 : -2200
        const burstTo = wide ? -1400 : -1250
        const ringsFrom = wide ? -3000 : -2600
        const ringsTo = wide ? -1800 : -1550
        const floorFrom = wide ? -3200 : -2800
        const floorTo = wide ? -1200 : -900

        if (burst) gsap.set(burst, { z: burstFrom })
        if (rings) gsap.set(rings, { z: ringsFrom })
        if (floor) gsap.set(floor, { z: floorFrom })

        if (reduce) {
          if (burst) gsap.set(burst, { z: burstTo })
          if (rings) gsap.set(rings, { z: ringsTo })
          if (floor) gsap.set(floor, { z: floorTo })
          return
        }

        if (burst) {
          gsap.to(burst, {
            z: burstTo,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
        }
        if (rings) {
          gsap.to(rings, {
            z: ringsTo,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
        }
        if (floor) {
          gsap.to(floor, {
            z: floorTo,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
        }
      },
    )

    return () => media.revert()
  }, { scope: rootRef })

  return (
    <div className="void" ref={rootRef} aria-hidden="true">
      <div className="void-floor" data-floor />
      <div className="void-burst" data-burst />
      <div className="void-rings" data-rings />
      <div className="void-frags">
        {floatingFragments.map((fragment) => (
          <article className="frag" key={fragment.id} data-slot={fragment.id}>
            <span className="frag-corner" />
            <p className="frag-label">{fragment.label}</p>
            <span className="frag-ticks">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </article>
        ))}
      </div>
    </div>
  )
}
