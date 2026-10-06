export type SceneConfig = {
  id: string
  title: string
  z: number
  label?: string
  /**
   * How far ahead of the camera this scene stays legible, in world units.
   * Scenes that span more corridor need a wider span: the projects carousel
   * occupies several slices, so it has to stay readable across all of them.
   */
  span?: number
}

/**
 * Scene centres. Spacing is deliberately wider than the corridor's legible
 * span so only one scene is ever reading, and every z is a multiple of the
 * road's BLOCK_STEP so a section always stands on a block.
 */
export const SCENES: SceneConfig[] = [
  { id: 'hero', title: 'MUHAMMAD FIKRI', label: 'INTRO', z: 0, span: 36 },
  { id: 'about', title: '01 / ABOUT', label: 'ABOUT', z: -36, span: 24 },
  { id: 'skills', title: '02 / SKILLS', label: 'SKILLS', z: -84, span: 26 },
  { id: 'projects', title: '03 / PROJECTS', label: 'PROJECTS', z: -144, span: 31 },
  { id: 'experience', title: '04 / EXPERIENCE', label: 'EXPERIENCE', z: -216, span: 24 },
  // Contact is centred at the very end of the scroll, so it needs a wide span
  // to be readable on approach. Nothing follows it to compete with.
  { id: 'contact', title: '05 / CONTACT', label: 'CONTACT', z: -300, span: 84 },
]

/** Where the camera sits at scroll 0, ahead of the first scene. */
export const CAMERA_START = 10

/** How far the camera travels from first scene to last. */
export const WORLD_LENGTH = CAMERA_START - SCENES[SCENES.length - 1].z

/** Viewport heights of scrolling allotted to each scene. */
export const SCROLL_VH_PER_SCENE = 264

/** Total document height, in vh. Gives Lenis something to scroll. */
export const WORLD_SCROLL_VH = SCENES.length * SCROLL_VH_PER_SCENE