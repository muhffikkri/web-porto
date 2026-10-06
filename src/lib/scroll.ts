import { CAMERA_START, WORLD_LENGTH } from '../data/scenes'

/**
 * Single source of truth for the camera. Mutated every frame by Lenis,
 * read inside rAF loops. Never stored in React state on purpose.
 */
export const scroll = {
  progress: 0,
  velocity: 0,
  direction: 1 as 1 | -1,
}

export const cameraZ = () => CAMERA_START - scroll.progress * WORLD_LENGTH

/**
 * Signed distance from the camera to a world z.
 * Negative = still ahead of the camera, positive = already passed.
 */
export const distanceTo = (z: number) => z - cameraZ()