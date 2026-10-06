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

/** Distance at which a platform has faded in from the fog. */
export const SOLID_RANGE = 26

/**
 * Distance at which a platform is fully faded. Underfoot it is out of frame:
 * the slab is 15 wide and 3 below the camera, so at a few units it covers the
 * lower half of the viewport and the avatar's head reaches the text.
 */
export const UNDERFOOT = 18

/** Distance at which a platform has faded out completely. */
export const FADE_RANGE = 95

/** Platforms closer than this to the camera are not worth drawing. */
export const CULL_RANGE = 130

/** Rest height when the camera is on it, falling away with distance. */
export function platformY(d: number) {
  return REST_Y - Math.min(Math.abs(d), MAX_DROP_DISTANCE) * SLOPE
}

/**
 * Solid at reading distance, gone underfoot and gone in the fog.
 *
 * Directly below the camera the slab fills the lower half of the frame and
 * the avatar's head pokes into the text, so it fades out as the camera
 * arrives rather than peaking there.
 */
export function platformOpacity(d: number) {
  const a = Math.abs(d)
  const near = Math.min(1, a / UNDERFOOT)
  const far = a <= SOLID_RANGE ? 1 : Math.max(0, 1 - (a - SOLID_RANGE) / (FADE_RANGE - SOLID_RANGE))
  return 0.85 * near * far
}

/**
 * Only ahead of the camera. A platform the camera has passed is between the
 * camera and the near plane, so it fills the frame with a grey slab.
 */
export function platformVisible(d: number) {
  return d <= 0 && -d < CULL_RANGE
}