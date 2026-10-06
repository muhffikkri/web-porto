import { useEffect, useState } from 'react'
import { scroll } from '../lib/scroll'

const QUERY = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

/**
 * Reduced motion, mirrored onto the scroll store.
 *
 * The flag lives in the store rather than only in React because the corridor
 * is driven from rAF loops outside React's tree: the camera, the panels, the
 * carousel and the atmosphere all read `scroll.stepped`. Mirroring it here
 * means one toggle changes all of them at once.
 */
export const useReducedMotion = () => {
  // Set during the first render, not in an effect: the scroll hook runs on
  // mount and needs to know whether to smooth.
  const [reduced, setReduced] = useState(() => {
    const initial = prefersReducedMotion()
    scroll.stepped = initial
    return initial
  })

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const handler = () => {
      setReduced(mq.matches)
      scroll.stepped = mq.matches
    }
    mq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
      scroll.stepped = false
    }
  }, [])

  return reduced
}