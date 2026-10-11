import { mulberry32 } from './rng.ts'
import type { SkillGroup } from '../data/skills.ts'

/**
 * Where a skill sits in the constellation, relative to its scene's centre.
 * Seeded so the constellation is identical on every load.
 */
export type Star = {
  skill: string
  group: string
  /** Lateral placement, percentage of viewport width. */
  x: number
  /** Vertical placement, percentage of viewport height. */
  y: number
  /** Depth into the scene, world units. Negative is deeper. */
  z: number
  /** Rendered size, px. */
  size: number
}

/**
 * Groups nearer the front of the scene, so the first group reads largest and
 * nearest. Every group sits within NEAR of the scene's centre, jitter
 * included: past that the depth curve dims the stars.
 */
const GROUP_Z = [-4, -8, -12]
const GROUP_SCALE = [1, 0.86, 0.72]

/** Horizontal half-width, kept clear of the viewport edge. */
const X_HALF = 40
/** Upper zone: from the top of the field down to just above the heading. */
const TOP = -28
const TOP_END = -6
/** Lower zone: below the heading down to the bottom of the field. */
const MID = 8
const BOTTOM = 28
/** Sub-percent drift, only enough to read as floating, never to collide. */
const JITTER = 2

/**
 * Scatter every skill as free-floating labels. Positions come from a jittered
 * grid whose size is derived from the skill count, so adding or removing
 * groups and skills just reflows the field: the grid grows to keep the labels
 * apart instead of crowding. The vertical gap between the two zones keeps the
 * scene's centred heading clear. The group only sets depth and size.
 */
export function constellation(groups: SkillGroup[]): Star[] {
  const rand = mulberry32(0x51c1)
  const flat: { skill: string; group: string; gi: number }[] = []
  groups.forEach((group, gi) =>
    group.skills.forEach((skill) => flat.push({ skill, group: group.label, gi })),
  )

  const n = flat.length
  // Columns grow with the list, but stay few enough that a label never meets
  // its neighbour: the gap between columns holds at 13% of the width or more.
  const cols = Math.max(3, Math.min(6, Math.round(Math.sqrt(n * 1.7))))
  const rows = Math.max(1, Math.ceil(n / cols))

  // Rows fill the upper zone and the lower zone; none land on the heading.
  const topRows = Math.ceil(rows / 2)
  const bottomRows = rows - topRows
  const rowY: number[] = []
  if (rows === 1) {
    rowY.push(-10)
  } else {
    for (let r = 0; r < topRows; r++) {
      rowY.push(topRows === 1 ? TOP : TOP + (r / (topRows - 1)) * (TOP_END - TOP))
    }
    for (let r = 0; r < bottomRows; r++) {
      rowY.push(bottomRows === 1 ? MID : MID + (r / (bottomRows - 1)) * (BOTTOM - MID))
    }
  }

  const xAt = (c: number) => -X_HALF + (cols === 1 ? 0 : (c / (cols - 1)) * X_HALF * 2)

  // One cell per skill, shuffled so the groups interleave rather than clump.
  const cells = Array.from({ length: rows * cols }, (_, i) => i)
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const t = cells[i]
    cells[i] = cells[j]
    cells[j] = t
  }

  return flat.map((item, i) => {
    const cell = cells[i]
    const row = Math.floor(cell / cols)
    const col = cell % cols
    const scale = GROUP_SCALE[item.gi] ?? 0.6
    return {
      skill: item.skill,
      group: item.group,
      x: xAt(col) + (rand() - 0.5) * JITTER * 2,
      y: rowY[row] + (rand() - 0.5) * JITTER * 2,
      z: (GROUP_Z[item.gi] ?? -18 - item.gi * 6) + (rand() - 0.5) * 2,
      size: (12 + rand() * 4) * scale,
    }
  })
}
