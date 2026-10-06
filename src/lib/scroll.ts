import { CAMERA_START, SCENES, WORLD_LENGTH } from '../data/scenes.ts'

/**
 * Single source of truth for the camera. Mutated every frame by Lenis,
 * read inside rAF loops. Never stored in React state on purpose.
 */
export const scroll = {
  progress: 0,
  velocity: 0,
  direction: 1 as 1 | -1,
  /**
   * When set, the camera parks between scenes instead of travelling
   * continuously. Every visual reads this, so the corridor changes character
   * together rather than one component at a time.
   */
  stepped: false,
}

const continuousCameraZ = () => CAMERA_START - scroll.progress * WORLD_LENGTH

/**
 * The camera z actually in effect. With reduced motion it parks on a scene
 * instead of travelling, so every visual that reads the camera agrees.
 */
export function cameraZ() {
  return scroll.stepped ? steppedCameraZ(scroll.progress) : continuousCameraZ()
}

/**
 * Signed distance from the camera to a world z.
 * Negative = still ahead of the camera, positive = already passed.
 */
export const distanceTo = (z: number) => z - cameraZ()

/**
 * Scroll progress at which the camera is centred on each scene. The last
 * scene sits at 1 so it is always reachable at the bottom of the scroll.
 */
export const SCENE_PROGRESS = SCENES.map((s) => (CAMERA_START - s.z) / WORLD_LENGTH)

/**
 * Camera z for reduced motion: park on the nearest scene rather than moving
 * through the corridor. Content still changes with scroll, it cuts instead
 * of travelling.
 */
export function steppedCameraZ(progress: number) {
  let index = 0
  let bestGap = Infinity
  for (let i = 0; i < SCENE_PROGRESS.length; i++) {
    const gap = Math.abs(SCENE_PROGRESS[i] - progress)
    if (gap < bestGap) {
      bestGap = gap
      index = i
    }
  }
  return SCENES[index].z
}

export { WORLD_LENGTH }