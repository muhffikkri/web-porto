import assert from 'node:assert/strict'
import {
  FADE_RANGE,
  MAX_DROP_DISTANCE,
  REST_Y,
  SLOPE,
  SOLID_RANGE,
  UNDERFOOT,
  platformOpacity,
  platformVisible,
  platformY,
} from '../src/lib/platform.ts'

// Rest height when the camera is standing on the platform.
assert.equal(platformY(0), REST_Y)

// Rises from below ahead of the camera, falls away behind it: both
// directions drop with distance, which is what sells the corridor.
assert.ok(platformY(-40) < REST_Y, 'platform ahead sits below rest')
assert.ok(platformY(40) < REST_Y, 'platform behind sinks below rest')
assert.equal(platformY(-40), platformY(40), 'drop is symmetric in distance')

// Monotonic: further away is never higher.
let prev = Infinity
for (let d = 0; d <= 200; d += 5) {
  const y = platformY(d)
  assert.ok(y <= prev, `height rose again at d=${d}`)
  prev = y
}
assert.ok(platformY(-100) === platformY(100), 'symmetric on both sides')
assert.ok(platformY(500) === platformY(-500), 'clamped far away')
assert.ok(platformY(1e6) === REST_Y - MAX_DROP_DISTANCE * SLOPE, 'drop is capped')

// Reversible: the curve only depends on |d|, so scrolling back is exact.
for (const d of [0, 7, 33, 88]) assert.equal(platformY(d), platformY(-d))

// Opacity: gone underfoot, solid at reading distance, gone in the fog.
assert.equal(platformOpacity(0), 0, 'slab directly under the camera fills the frame')
assert.equal(platformOpacity(UNDERFOOT), 0.85, 'not solid at reading distance')
assert.equal(platformOpacity(SOLID_RANGE), 0.85)
assert.equal(platformOpacity(FADE_RANGE), 0)
assert.equal(platformOpacity(FADE_RANGE * 2), 0)
assert.ok(platformOpacity(-15) === platformOpacity(15))

// Never out of range, and single-peaked: up to reading distance, then down.
for (let d = 0; d < FADE_RANGE * 1.5; d += 2) {
  const o = platformOpacity(d)
  assert.ok(o >= 0 && o <= 0.85, `opacity out of range at d=${d}: ${o}`)
}
let peak = 0
for (let d = 0; d <= SOLID_RANGE; d += 1) {
  const o = platformOpacity(d)
  assert.ok(o >= peak, `opacity fell before reading distance at d=${d}`)
  peak = o
}
for (let d = SOLID_RANGE; d < FADE_RANGE * 1.5; d += 2) {
  const o = platformOpacity(d)
  assert.ok(o <= peak, `opacity rose again at d=${d}`)
  peak = o
}

// d = 0 means the camera has reached the platform, which is still ahead.
assert.equal(platformVisible(0), true)
assert.equal(platformVisible(-100), true, 'inside the cull range')
assert.equal(platformVisible(-140), false, 'beyond the cull range')
assert.equal(platformVisible(200), false)
// Passed platforms must not draw: the camera would be inside them.
assert.equal(platformVisible(5), false, 'passed platform is still drawn')
assert.equal(platformVisible(-200), false, 'uncapped far platform is drawn')

console.log('platform ok')