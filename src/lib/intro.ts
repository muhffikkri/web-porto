/**
 * Opening sequence state. Like the scroll store, mutated every frame and
 * read outside React so the intro never triggers a re-render.
 */
export const intro = {
  /** 0 = still synchronizing, 1 = fully revealed. */
  reveal: 0,
}

/** Nominal length of the scripted sequence, in ms. */
export const INTRO_DURATION = 2000

/** Scroll progress at which the intro is considered skipped. */
export const INTRO_SCROLL_SKIP = 0.06

/**
 * Reveal amount from the clock alone. Eases out near the end so the name
 * settles rather than snapping in.
 */
export function timelineReveal(elapsed: number) {
  const t = Math.max(0, Math.min(1, elapsed / INTRO_DURATION))
  return t * t * (3 - 2 * t)
}

/**
 * Reveal is the faster of the clock and the scrollbar. Scrolling immediately
 * skips the intro instead of locking the user through it.
 */
export function resolveReveal(elapsed: number, progress: number, reduced: boolean) {
  if (reduced) return 1
  const byTime = timelineReveal(elapsed)
  const byScroll = Math.min(1, progress / INTRO_SCROLL_SKIP)
  return Math.max(byTime, byScroll)
}

/** The flicker readout shown while reveal is low. */
export const SYNC_FRAMES = [
  'SYNCHRONIZING',
  'SYNCHRONIZI_',
  'SYNCHRONIZING',
  'SYNC',
  'SYNCHRONIZING',
  'SYNC_',
  'SYNCHRONIZING',
]

/** Which readout to show at a given elapsed time. Deterministic, no RNG. */
export function syncFrame(elapsed: number) {
  return SYNC_FRAMES[Math.floor(elapsed / 90) % SYNC_FRAMES.length]
}