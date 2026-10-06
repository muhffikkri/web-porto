import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '../lib/scroll.js'

export function useReveal(scopeRef, options = {}) {
  const {
    targets = '[data-reveal]',
    duration = 0.8,
    stagger = 0.1,
    start = 'top 80%',
    delay = 0,
    ease = 'power2.out',
  } = options

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const nodes = gsap.utils.toArray(targets, scopeRef.current)
      if (!nodes.length) return
      gsap.to(nodes, {
        scale: 1,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: scopeRef.current,
          start,
          toggleActions: 'play none none reverse',
        },
      })
    },
    { scope: scopeRef },
  )
}
