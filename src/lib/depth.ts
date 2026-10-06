import { distanceTo } from './scroll.ts'

/**
 * Placement for a sub-element that lives at its own z inside a scene.
 *
 * A scene's panels are not all at the scene's centre: some sit ahead in the
 * corridor, some off to the side. Each gets its own z, and therefore its own
 * distance from the camera, so it fades and grows on its own schedule.
 *
 * `d` is the distance from the camera, signed the same way as everywhere else:
 * negative = ahead, positive = passed.
 */
export type Offset = { x: number; y: number; z: number }

export const PX_PER_UNIT = 14

/** CSS pixels of travel per world unit, matching the scene panels. */
export const FADE = 20
export const FALLOFF = 3

/**
 * Transform for a floating panel `d` units from the camera.
 *
 * Only the approach counts: a panel shrinks as it comes up the corridor and
 * reaches full size as the camera reaches it. Past that it is culled rather
 * than scaled up, because a panel growing past the viewer sweeps over the
 * text it is supposed to sit beside.
 */
export function offsetTransform(d: number) {
  const clamped = Math.min(d, 0)
  return `translate3d(0, ${(clamped * PX_PER_UNIT) / 6}px, ${clamped * PX_PER_UNIT}px)`
}

/**
 * Opacity for an element `d` units from the camera.
 *
 * Two-part, not one curve. Within `NEAR` the element is fully legible
 * whatever its distance, because the camera is arriving at it and it has to
 * read on arrival. Past that it falls away into the distance.
 *
 * A pure distance curve gets this wrong at the start of the journey: the hero
 * sits CAMERA_START units ahead of the camera at scroll 0, so a curve that
 * fades with distance leaves the opening title permanently dim.
 */
export function offsetOpacity(d: number, span = FADE) {
  if (d > 0) return 1
  const a = -d
  if (a <= NEAR) return 1
  return Math.max(0, 1 - (a - NEAR) / Math.max(1, span - NEAR)) ** FALLOFF
}

export function offsetBlur(d: number) {
  const ahead = -d
  return ahead > NEAR ? Math.min(5, (ahead - NEAR) / 11) : 0
}

/** Distance within which an element is fully legible and sharp. */
export const NEAR = 14

/**
 * Units past the camera at which a passed scene has faded out completely.
 * Shared by the scene panels and the float panels inside them, so children
 * are only dropped once their parent is already invisible.
 */
export const PASS_FADE = 24

/** Signed distance from the camera to a z inside a scene. */
export const distanceIn = (sceneZ: number, offsetZ: number) => distanceTo(sceneZ + offsetZ)