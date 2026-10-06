/**
 * Platform placement, as pure functions of camera distance.
 *
 * `d` is the signed distance from the camera to a platform's z:
 * negative = still ahead, positive = already passed, 0 = the camera is
 * standing on it.
 *
 * Everything here is a pure function of `d`, so the motion is fully
 * reversible with scroll and testable without a renderer.
 */

/** Surface height of a platform at rest. */
export const REST_Y = -3

/** Metres the platform drops per world unit of distance, either direction. */
export const SLOPE = 0.045

/** Beyond this distance the platform is parked at its lowest point. */
export const MAX_DROP_DISTANCE = 90

/** Distance at which a platform is fully opaque. */
export const SOLID_RANGE = 26

/** Distance at which a platform has faded out completely. */
export const FADE_RANGE = 95

/** Platforms closer than this to the camera are not worth drawing. */
export const CULL_RANGE = 130

/** Rest height when the camera is on it, falling away with distance. */
export function platformY(d: number) {
  return REST_Y - Math.min(Math.abs(d), MAX_DROP_DISTANCE) * SLOPE
}

/** Opaque near the camera, gone in the fog. */
export function platformOpacity(d: number) {
  const a = Math.abs(d)
  if (a <= SOLID_RANGE) return 0.85
  return Math.max(0, 0.85 * (1 - (a - SOLID_RANGE) / (FADE_RANGE - SOLID_RANGE)))
}

export function platformVisible(d: number) {
  return Math.abs(d) < CULL_RANGE
}