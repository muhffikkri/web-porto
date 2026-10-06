import { SCENES } from '../data/scenes.ts'
import { cameraZ } from './scroll.ts'

/**
 * The project carousel: projects arranged along a shallow arc, with the
 * camera travelling through them so scrolling moves which one is centred.
 *
 * Everything is a pure function of the camera z. That is what makes the
 * carousel reversible and testable without a renderer.
 */

/** Depth of corridor one project occupies. */
export const SLICE = 13

/** Lateral gap between neighbours on the arc, as a percentage of viewport width. */
export const SPACING = 27

/** Rotation applied to a card one step off centre, in degrees. */
export const TILT = 13

/** Cards further than this many steps from centre stop painting. */
export const REACH = 2.4

export const SCENE_Z = SCENES[3].z

/**
 * Z of the first project: the one the camera meets on entering the scene.
 * Later projects sit deeper down the corridor.
 */
/**
 * Z of the first project: the one the camera meets on entering the scene.
 * Later projects sit deeper down the corridor.
 *
 * The arc is centred on the scene rather than starting at it, so the middle
 * project reaches full opacity when the camera is at the scene's z. Starting
 * the arc at the scene would leave every project but the last permanently
 * half-faded.
 */
export function entryZ(count: number) {
  return SCENE_Z + ((count - 1) * SLICE) / 2
}

/**
 * Which project is centred, as a fraction. 0 at the scene entrance, count-1
 * at its far end. Clamped, so the first and last projects hold centre at the
 * ends of the range instead of running off.
 */
export function focus(count: number, z = cameraZ()) {
  if (count < 2) return 0
  const raw = (entryZ(count) - z) / SLICE
  return Math.max(0, Math.min(count - 1, raw))
}

/** Everything the carousel needs to place and style one project. */
export type Slot = {
  /** Steps from centre: 0 centred, negative ahead, positive passed. */
  offset: number
  /** Lateral placement, percentage of viewport width. */
  x: number
  scale: number
  /** Rotation in degrees, so sides angle toward the centre. */
  tilt: number
  opacity: number
  blur: number
  visible: boolean
  centred: boolean
}

export function slot(index: number, count: number, z = cameraZ()): Slot {
  // `|| 0` normalises -0, which would otherwise reach the CSS transform as
  // `rotateY(0deg)` vs `-0deg` and break value comparisons.
  const offset = index - focus(count, z) || 0
  const a = Math.abs(offset)

  return {
    offset,
    x: offset * SPACING,
    // Centred is full size; sides recede quickly.
    scale: Math.max(0.6, 1 - a * 0.16),
    tilt: -offset * TILT || 0,
    opacity: Math.max(0, 1 - a * 0.55),
    blur: a < 0.5 ? 0 : Math.min(3, (a - 0.5) * 2.2),
    visible: a <= REACH,
    centred: a < 0.5,
  }
}