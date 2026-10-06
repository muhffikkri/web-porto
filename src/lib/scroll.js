let instance = null

export function setScroller(next) {
  instance = next
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollTo(target) {
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
  if (instance) {
    instance.scrollTo(target, { behavior, duration: 1.1 })
    return
  }
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (node) node.scrollIntoView({ behavior, block: 'start' })
}
