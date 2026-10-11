import { PROJECTS } from './projects.ts'

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
  /**
   * World units past its centre the scene stays fully legible (and pinned)
   * before it begins to fade. Defaults to NEAR. A scene whose content plays
   * out across the corridor sets a long hold, so it stays lit until every
   * part of that content has had its moment.
   */
  hold?: number
}

/** Camera travel between one centred project and the next, in world units. */
export const PROJECT_SLICE = 10

/**
 * World units past the projects centre the carousel runs. The projects scene
 * holds for exactly this long, so every project gets its centred moment and
 * the headline stays on screen until the last slide has been read.
 */
export const PROJECT_HOLD = (PROJECTS.length - 1) * PROJECT_SLICE

/**
 * Scene centres. Spacing is deliberately wider than the corridor's legible
 * span so only one scene is ever reading, and every z is a multiple of the
 * road's BLOCK_STEP so a section always stands on a block.
 *
 * Projects holds for its whole carousel (PROJECT_HOLD), and every later scene
 * sits deep enough that the hold is fully faded before it arrives.
 */
export const SCENES: SceneConfig[] = [
  { id: 'hero', title: 'MUHAMMAD FIKRI', label: 'INTRO', z: 0, span: 36 },
  { id: 'about', title: '01 / ABOUT', label: 'ABOUT', z: -36, span: 24 },
  { id: 'skills', title: '02 / SKILLS', label: 'SKILLS', z: -84, span: 26 },
  { id: 'projects', title: '03 / PROJECTS', label: 'PROJECTS', z: -144, span: 40, hold: PROJECT_HOLD },
  { id: 'experience', title: '04 / EXPERIENCE', label: 'EXPERIENCE', z: -252, span: 24 },
  // Contact is centred at the very end of the scroll, so it needs a wide span
  // to be readable on approach. Nothing follows it to compete with.
  { id: 'contact', title: '05 / CONTACT', label: 'CONTACT', z: -348, span: 84 },
]

/** Where the camera sits at scroll 0, ahead of the first scene. */
export const CAMERA_START = 10

/** How far the camera travels from first scene to last. */
export const WORLD_LENGTH = CAMERA_START - SCENES[SCENES.length - 1].z

/** Viewport heights of scrolling per world unit of camera travel. */
export const SCROLL_VH_PER_UNIT = 5.1

/** Total document height, in vh. Gives Lenis something to scroll. */
export const WORLD_SCROLL_VH = Math.round(WORLD_LENGTH * SCROLL_VH_PER_UNIT)
