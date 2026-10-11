import { mulberry32 } from './rng.ts'
import type { SkillGroup } from '../data/skills.ts'

/**
 * Where a skill sits in the constellation, relative to its scene's centre.
 * Seeded so the constellation is identical on every load.
 */
export type Star = {
  skill: string
  group: string
  /** Lateral placement, fraction of viewport width. */
  x: number
  /** Vertical placement, fraction of viewport height. */
  y: number
  /** Depth into the scene, world units. Negative is deeper. */
  z: number
  /** Rendered size, px. */
  size: number
}

/**
 * Each group reads as its own horizontal band, stacked so the groups never
 * share a band and the labels cannot overlap. The bands sit clear of the
 * centre line the scene's heading occupies, and above the vertical middle:
 * a full spread of three rows also lifts the whole constellation.
 */
const GROUP_Y = [-26, -8, 12]

/**
 * Groups nearer the front of the scene. Every group must sit within NEAR of
 * the scene's centre, jitter included: past that the depth curve dims the
 * stars, and the deepest group would be gone by the time the scene is read.
 */
const GROUP_Z = [-4, -8, -12]
const GROUP_SCALE = [1, 0.86, 0.72]

/** Rows a group is split into once it is too long to read as a single band. */
const ROW_LIMIT = 6

/** Vertical gap between the rows of one split group, percent of height. */
const ROW_GAP = 8

/**
 * Lay each group out as one or two evenly spaced rows. Even spacing across
 * the row, rather than an arc with jitter, is what keeps the labels from
 * colliding: the only randomness left is a sub-percent drift.
 */
export function constellation(groups: SkillGroup[]): Star[] {
  const rand = mulberry32(0x51c1)
  const stars: Star[] = []

  groups.forEach((group, gi) => {
    const z = GROUP_Z[gi] ?? -18 - gi * 6
    const scale = GROUP_SCALE[gi] ?? 0.6
    const baseY = GROUP_Y[gi] ?? 0
    const n = group.skills.length

    const perRow = n > ROW_LIMIT ? Math.ceil(n / 2) : n
    const rows = Math.ceil(n / perRow)
    // Wider bands for larger groups, but never past the viewport edge: the
    // outermost label has to stay on screen.
    const spread = Math.min(40, 24 + n * 2)

    group.skills.forEach((skill, i) => {
      const row = Math.floor(i / perRow)
      const inRow = Math.min(perRow, n - row * perRow)
      const col = i % perRow
      // -1..1 across the row.
      const t = inRow === 1 ? 0 : (col / (inRow - 1)) * 2 - 1

      stars.push({
        skill,
        group: group.label,
        x: t * spread + (rand() - 0.5) * 2,
        y: baseY + (row - (rows - 1) / 2) * ROW_GAP,
        z: z + (rand() - 0.5) * 2,
        size: (12 + rand() * 4) * scale,
      })
    })
  })

  return stars
}
