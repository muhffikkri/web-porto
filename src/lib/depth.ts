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

/** Opacity for an element `d` units from the camera. */
export function offsetOpacity(d: number) {
  if (d > 0) return 1
  return Math.max(0, 1 + d / FADE) ** FALLOFF
}

export function offsetBlur(d: number) {
  const ahead = -d
  return ahead > 4 ? Math.min(5, (ahead - 4) / 11) : 0
}

/** Past this the scene has been passed and should stop painting. */
export const OFFSET_CULL = -2

/** Signed distance from the camera to a z inside a scene. */
export const distanceIn = (sceneZ: number, offsetZ: number) => distanceTo(sceneZ + offsetZ)