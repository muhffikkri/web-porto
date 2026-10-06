/**
 * Device capability tiers.
 *
 * Read once at startup: the particle and fragment counts are baked into
 * buffer geometry, so they cannot change per frame without a rebuild. That
 * also means a resize across a tier boundary only takes effect on reload,
 * which is the right trade for avoiding a geometry rebuild mid-scroll.
 */

export type Tier = 'low' | 'mid' | 'high'

const MOBILE_BREAKPOINT = 720
const MID_BREAKPOINT = 1100

export type Quality = {
  tier: Tier
  /** Fragments in the corridor. */
  fragments: number
  /** Dust particles. */
  particles: number
  /** Device pixel ratio cap. */
  dpr: number
  /** Whether the WebGL corridor is drawn at all. */
  webgl: boolean
}

/** A small, conservative baseline that still reads as a corridor. */
const TIERS: Record<Tier, Omit<Quality, 'tier'>> = {
  low: { fragments: 18, particles: 200, dpr: 1, webgl: true },
  mid: { fragments: 40, particles: 550, dpr: 1.5, webgl: true },
  high: { fragments: 64, particles: 900, dpr: 1.75, webgl: true },
}

export function tierFor(width: number, cores: number): Tier {
  if (width < MOBILE_BREAKPOINT) return 'low'
  if (width < MID_BREAKPOINT || cores <= 4) return 'mid'
  return 'high'
}

export function qualityFor(width = window.innerWidth, cores = navigator.hardwareConcurrency ?? 4): Quality {
  const tier = tierFor(width, cores)
  return { tier, ...TIERS[tier] }
}

/** Whether this device can run the corridor at all. */
export function hasWebGL() {
  try {
    // three.js needs WebGL2; asking for anything else silently returns null
    // and the corridor would never be drawn.
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}