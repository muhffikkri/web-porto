import assert from 'node:assert/strict'
import {
  FADE_RANGE,
  MAX_DROP_DISTANCE,
  REST_Y,
  SLOPE,
  SOLID_RANGE,
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

// Opacity: solid under the camera, gone in the fog, never out of range.
assert.equal(platformOpacity(0), 0.85)
assert.equal(platformOpacity(SOLID_RANGE), 0.85)
assert.equal(platformOpacity(FADE_RANGE), 0)
assert.equal(platformOpacity(FADE_RANGE * 2), 0)
assert.ok(platformOpacity(-15) === platformOpacity(15))
let lastOpacity = Infinity
for (let d = 0; d < FADE_RANGE * 1.5; d += 2) {
  const o = platformOpacity(d)
  assert.ok(o >= 0 && o <= 0.85, `opacity out of range at d=${d}: ${o}`)
  assert.ok(o <= lastOpacity, `opacity rose again at d=${d}`)
  lastOpacity = o
}

assert.equal(platformVisible(0), true)
assert.equal(platformVisible(-120), true)
assert.equal(platformVisible(200), false)

console.log('platform ok')