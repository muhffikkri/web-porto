import type Lenis from 'lenis'

/**
 * The live Lenis instance, kept here so a modal can hold the page still while
 * it is open. Null before the scroll hook mounts or after it unmounts.
 */
let instance: Lenis | null = null

export function setLenis(next: Lenis | null) {
  instance = next
}

/** Pause or resume the smoothed scroll behind an overlay. */
export function lockScroll(lock: boolean) {
  if (!instance) return
  if (lock) instance.stop()
  else instance.start()
}
