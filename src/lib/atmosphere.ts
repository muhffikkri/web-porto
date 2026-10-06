/**
 * The corridor brightens toward the far end, so reaching the contact scene
 * feels like arriving rather than running out of content.
 *
 * Pure functions of scroll progress, so the atmosphere component only has to
 * read a number.
 */

/** Scroll progress at which the corridor starts and finishes brightening. */
export const BRIGHTEN_START = 0.72
export const BRIGHTEN_END = 0.96

/** Fog reach at the start of the corridor and at its brightest. */
export const FOG_FAR = 150
export const FOG_FAR_BRIGHT = 220

/** 0 = corridor colour, 1 = the bright end of the corridor. */
export function brighten(progress: number) {
  const t = (progress - BRIGHTEN_START) / (BRIGHTEN_END - BRIGHTEN_START)
  return Math.min(1, Math.max(0, t))
}

/** Distance the fog reaches at a given brightness. */
export function fogFar(brightness: number) {
  return FOG_FAR + brightness * (FOG_FAR_BRIGHT - FOG_FAR)
}

