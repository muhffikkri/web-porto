import { SCENES } from '../data/scenes.ts'

/**
 * Milestone placement, as pure functions of the camera z.
 *
 * Milestones are spaced along the corridor rather than laid out on a surface:
 * the camera passes each one in turn, and the marker nearest the camera is
 * the one being read.
 */

/** World z of the scene the milestones belong to. */
export const SCENE_Z = SCENES[4].z

/** World units between milestones. */
export const GAP = 14

/**
 * World z of a milestone by its index. The sequence is centred on the scene
 * and the camera meets the earliest milestone first, so earlier milestones
 * sit at larger z.
 */
export function milestoneZ(index: number, count: number) {
  return SCENE_Z + ((count - 1) / 2 - index) * GAP
}

export type Marker = {
  index: number
  /** World z of this milestone. */
  z: number
  /** Signed distance from the camera, world units. */
  d: number
  /** Steps from the milestone being read, fractional. */
  offset: number
  scale: number
  opacity: number
  blur: number
  visible: boolean
  active: boolean
}

/** Where the camera sits within the milestone sequence, as a fraction. */
export function markerFocus(count: number, z: number) {
  if (count < 2) return 0
  const raw = (milestoneZ(0, count) - z) / GAP
  return Math.max(0, Math.min(count - 1, raw))
}

export function marker(index: number, count: number, cameraZ: number): Marker {
  const mz = milestoneZ(index, count)
  const d = mz - cameraZ
  const offset = index - markerFocus(count, cameraZ)
  const a = Math.abs(offset)

  return {
    index,
    z: mz,
    d,
    offset,
    scale: Math.max(0.65, 1 - a * 0.18),
    opacity: Math.max(0, 1 - a * 0.5),
    blur: a < 0.5 ? 0 : Math.min(3, (a - 0.5) * 2.4),
    // Only milestones the camera is approaching or standing at. One the
    // camera has passed is behind it and would render over the next.
    visible: d <= GAP / 2,
    active: a < 0.5,
  }
}