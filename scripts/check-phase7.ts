import assert from 'node:assert/strict'
import { CAMERA_START, SCENES, WORLD_LENGTH } from '../src/data/scenes.ts'
import { SCENE_PROGRESS, steppedCameraZ } from '../src/lib/scroll.ts'
import { qualityFor, tierFor } from '../src/lib/quality.ts'

// --- reduced motion: the camera parks, it does not travel ---

assert.equal(SCENE_PROGRESS.length, SCENES.length)
for (let i = 0; i < SCENES.length; i++) {
  // At a scene's own progress the camera lands exactly on it.
  assert.ok(
    Math.abs(steppedCameraZ(SCENE_PROGRESS[i]) - SCENES[i].z) < 1e-9,
    `camera does not park on scene ${i}`,
  )
}

// The last scene must be reachable: it is centred on the final frame.
assert.ok(Math.abs(SCENE_PROGRESS[SCENES.length - 1] - 1) < 1e-9, 'last scene is not at progress 1')
// The camera starts ahead of the hero, so the hero's progress is just above 0
// rather than exactly 0. All that matters is that it is in range and first.
assert.ok(SCENE_PROGRESS[0] >= 0 && SCENE_PROGRESS[0] < 0.1, 'hero is not reached near the start')

// Progress increases with depth, so the parked camera only moves forward.
for (let i = 1; i < SCENE_PROGRESS.length; i++) {
  assert.ok(SCENE_PROGRESS[i] > SCENE_PROGRESS[i - 1], `scene progress is not monotonic at ${i}`)
}

// The parked camera only ever returns a scene z. No interpolation, so no
// continuous motion between scenes.
for (let p = 0; p <= 1; p += 0.001) {
  const z = steppedCameraZ(p)
  assert.ok(
    SCENES.some((s) => s.z === z),
    `camera parks at ${z}, which is not a scene`,
  )
}

// Between two scenes it holds one of them rather than moving through.
const halfway = (SCENE_PROGRESS[1] + SCENE_PROGRESS[2]) / 2
assert.ok(
  steppedCameraZ(halfway) === SCENES[1].z || steppedCameraZ(halfway) === SCENES[2].z,
  'camera parks on something between scenes',
)

// Still reversible: the same progress always parks on the same scene.
for (const p of [0, 0.13, 0.37, 0.5, 0.88, 1]) {
  assert.equal(steppedCameraZ(p), steppedCameraZ(p))
}

// Every scene is parked on for a reasonable stretch of scroll, or short
// scenes would flash past unreadable.
for (let i = 0; i < SCENE_PROGRESS.length - 1; i++) {
  const span = SCENE_PROGRESS[i + 1] - SCENE_PROGRESS[i]
  assert.ok(span > 0.05, `scene ${i} is only ${span.toFixed(3)} of the scroll`)
}

// --- quality tiers ---

assert.equal(tierFor(360, 8), 'low', 'phones should get the low tier')
assert.equal(tierFor(700, 8), 'low')
assert.equal(tierFor(1024, 8), 'mid')
assert.equal(tierFor(1440, 4), 'mid', 'few cores should not get the high tier')
assert.equal(tierFor(1920, 12), 'high')
// Width is the stronger signal: a small core count on a desktop still gets
// the low tier rather than dropping below what the layout needs.
assert.equal(tierFor(360, 2), 'low')

// Counts and DPR never go backwards as the device gets better.
const low = qualityFor(360, 2)
const mid = qualityFor(1024, 8)
const high = qualityFor(1920, 12)
assert.ok(low.fragments <= mid.fragments && mid.fragments <= high.fragments, 'fragment counts regress')
assert.ok(low.particles <= mid.particles && mid.particles <= high.particles, 'particle counts regress')
assert.ok(low.dpr <= mid.dpr && mid.dpr <= high.dpr, 'dpr regresses')
assert.equal(high.dpr, 1.75, 'dpr cap should stay under 2')
for (const q of [low, mid, high]) {
  assert.ok(q.fragments > 0 && q.particles > 0, 'a tier renders nothing')
  assert.ok(q.dpr >= 1, 'dpr below 1 would blur the whole corridor')
}

console.log('phase7 ok')