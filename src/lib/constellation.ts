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
 * Groups nearer the front of the scene. Every group must sit within NEAR of
 * the scene's centre, jitter included: past that the depth curve dims the
 * stars, and the deepest group would be gone by the time the scene is read.
 */
const GROUP_Z = [-4, -8, -12]
const GROUP_SCALE = [1, 0.82, 0.68]

/**
 * Lay the groups out on a shallow arc, nearest group in front and largest.
 * Even angular spacing across the arc keeps the constellation readable
 * instead of clumping.
 */
export function constellation(groups: SkillGroup[]): Star[] {
  const rand = mulberry32(0x51c1)
  const stars: Star[] = []

  groups.forEach((group, gi) => {
    const z = GROUP_Z[gi] ?? -18 - gi * 6
    const scale = GROUP_SCALE[gi] ?? 0.6
    const n = group.skills.length
    // Wider arc for groups in front and for larger groups, but never past the
    // viewport edge: the outermost star has to stay on screen.
    const spread = Math.min(38, (26 + gi * 4) * Math.min(1, Math.sqrt(9 / n)))

    group.skills.forEach((skill, i) => {
      // -1..1 across the arc.
      const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1
      stars.push({
        skill,
        group: group.label,
        x: t * spread + (rand() - 0.5) * 3,
        // Alternate above and below the centre line, and vary it a little.
        y: (i % 2 === 0 ? -1 : 1) * (5 + rand() * 9) - gi * 2,
        z: z + (rand() - 0.5) * 3,
        size: (13 + rand() * 5) * scale,
      })
    })
  })

  return stars
}