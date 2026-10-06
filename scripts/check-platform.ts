import assert from 'node:assert/strict'
import {
  BLOCK_DEPTH,
  BLOCK_STEP,
  BLOCK_WIDTH,
  LIP,
  POOL,
  REST_Y,
  ROAD_FAR,
  ROAD_SOLID,
  blockY,
  blockZ,
  roadOpacity,
  roadVisible,
} from '../src/lib/platform.ts'
import { CAMERA_START, SCENES, WORLD_LENGTH } from '../src/data/scenes.ts'

// --- placement: a fixed grid the pool slides over ---

for (let camZ = 40; camZ > -WORLD_LENGTH - 60; camZ -= 7) {
  const seen = new Set<number>()
  for (let slot = 0; slot < POOL; slot++) {
    const z = blockZ(slot, camZ)
    assert.equal(Math.abs(z) % BLOCK_STEP, 0, `block ${z} is off the grid`)
    assert.ok(!seen.has(z), `two slots share z=${z}`)
    seen.add(z)
    if (slot > 0) assert.equal(blockZ(slot - 1, camZ) - z, BLOCK_STEP, 'slots step away')
  }
}

// A section always stands on a block.
for (const s of SCENES) assert.equal(Math.abs(s.z) % BLOCK_STEP, 0, `${s.id} is between blocks`)

// The blocks touch, so the road never opens a hole at the bottom edge, and
// the joints come from a stable alternating lip rather than from a gap.
assert.equal(BLOCK_DEPTH, BLOCK_STEP, 'blocks do not touch')
assert.equal(blockY(0), REST_Y)
assert.equal(blockY(BLOCK_STEP), REST_Y + LIP)
assert.equal(blockY(2 * BLOCK_STEP), REST_Y, 'the lip does not climb')
assert.equal(blockY(-BLOCK_STEP), blockY(BLOCK_STEP), 'parity is the same either way')

// --- opacity: solid underfoot, gone in the fog ---

assert.equal(roadOpacity(0), 0.9)
assert.equal(roadOpacity(6), 0.9, 'a block behind the camera is clipped, not faded')
assert.equal(roadOpacity(-ROAD_SOLID), 0.9)
assert.equal(roadOpacity(-ROAD_FAR), 0, 'a block enters at zero opacity')
assert.equal(roadOpacity(-ROAD_FAR - 5), 0)

let prev = Infinity
for (let a = 0; a <= ROAD_FAR + 10; a += 1) {
  const o = roadOpacity(-a)
  assert.ok(o >= 0 && o <= 0.9, `opacity out of range at ${a}: ${o}`)
  assert.ok(o <= prev + 1e-12, `opacity rose with distance at ${a}`)
  prev = o
}

// --- visibility ---

assert.equal(roadVisible(0), true)
assert.equal(roadVisible(-BLOCK_DEPTH / 2), true)
assert.equal(roadVisible(BLOCK_DEPTH / 2), false, 'a block fully behind still draws')
assert.equal(roadVisible(-ROAD_FAR), false, 'a block at zero opacity still draws')
assert.equal(roadVisible(-200), false)

// --- the pool swap is never seen ---

/** Blocks actually drawn at a camera z, with their opacity. */
function drawn(camZ: number) {
  const out = new Map<number, number>()
  for (let slot = 0; slot < POOL; slot++) {
    const z = blockZ(slot, camZ)
    const d = z - camZ
    if (roadVisible(d)) out.set(z, roadOpacity(d))
  }
  return out
}

// The bottom of the frame is at most this far ahead of the camera: the road
// surface sits REST_Y below it and the camera looks straight ahead.
const BOTTOM_REACH = (Math.abs(REST_Y) + 0.2) / Math.tan((62 / 2) * (Math.PI / 180))

let prevDrawn = drawn(CAMERA_START)
for (let p = 0; p <= 1; p += 0.0005) {
  const camZ = CAMERA_START - p * WORLD_LENGTH
  const cur = drawn(camZ)

  assert.ok(cur.size >= 2, `the road empties at camZ=${camZ.toFixed(2)}`)

  // A block joining the pool does so at zero opacity, so scrolling forwards
  // never shows a block popping in.
  for (const [z, o] of cur) {
    if (!prevDrawn.has(z)) assert.ok(o < 0.02, `block ${z} appeared at opacity ${o}`)
  }
  // The road must always reach the bottom edge of the viewport.
  for (const x of [0.2, 2, 4, BOTTOM_REACH - 0.05]) {
    const z = camZ - x
    const covered = [...cur.keys()].some((b) => Math.abs(b - z) <= BLOCK_DEPTH / 2)
    assert.ok(covered, `road misses the bottom edge at camZ=${camZ.toFixed(2)}, x=${x.toFixed(2)}`)
  }
  prevDrawn = cur
}

// --- sections are further apart than the corridor can read at once ---

for (let i = 0; i < SCENES.length - 1; i++) {
  const gap = SCENES[i].z - SCENES[i + 1].z
  assert.ok(gap >= (SCENES[i + 1].span ?? 20), `scenes ${i} and ${i + 1} overlap in view`)
  assert.ok(gap > 30, `scenes ${i} and ${i + 1} are only ${gap} apart`)
}

assert.ok(BLOCK_WIDTH >= 14, 'the road would not reach the bottom corners when the camera drifts')

console.log('platform ok')
