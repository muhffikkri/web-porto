import assert from 'node:assert/strict'
import {
  REACH,
  SCENE_Z,
  SLICE,
  TILT,
  entryZ,
  focus,
  slot,
} from '../src/lib/carousel.ts'

const N = 4
const z0 = entryZ(N)

// The arc is centred on the scene: the middle project is centred at the
// scene's own z, and each end sits symmetrically about it.
assert.equal(focus(N, SCENE_Z), (N - 1) / 2, 'arc is not centred on the scene')
const lastZ = entryZ(N) - (N - 1) * SLICE
assert.equal(entryZ(N) + lastZ, SCENE_Z * 2, 'arc ends are not symmetric about the scene')

// The camera meets project 1 first, and project N last.
assert.equal(focus(N, z0), 0, 'first project is not centred at the arc entry')
assert.ok(Math.abs(focus(N, z0 - SLICE * (N - 1))) - (N - 1) < 1e-9, 'last project centred at the end')

// Clamped at both ends so the carousel holds rather than running off.
assert.equal(focus(N, z0 + 500), 0, 'clamps before the entrance')
assert.equal(focus(N, z0 - SLICE * (N + 5)), N - 1, 'clamps past the end')
assert.equal(focus(1, z0), 0, 'a single project is always centred')

// Progress is monotonic: scrolling forward never moves focus backwards.
let prev = -1
for (let z = z0 + 40; z >= z0 - SLICE * (N + 2); z -= 1) {
  const f = focus(N, z)
  assert.ok(f >= prev, `focus went backwards at z=${z}`)
  prev = f
}

// Pure in z: the whole slot is a function of camera position alone, which is
// what makes scrolling back up land exactly where it started. Object.is
// because -0 and 0 are the same position but not the same value.
for (const z of [z0, z0 - 10, z0 - 30]) {
  const a = slot(1, N, z)
  const b = slot(1, N, z)
  for (const key of Object.keys(a)) {
    assert.ok(Object.is(a[key], b[key]), `${key} is not deterministic at z=${z}`)
  }
  // And the numeric fields are free of -0, which would leak into CSS.
  assert.ok(!Object.values(a).some((v) => Object.is(v, -0)), `-0 in slot at z=${z}`)
}

// The centred card is full size, upright, sharp and interactive.
const centred = slot(1, N, z0 - SLICE)
assert.equal(centred.offset, 0)
assert.equal(centred.scale, 1)
assert.equal(centred.tilt, 0)
assert.equal(centred.opacity, 1)
assert.equal(centred.blur, 0)
assert.equal(centred.centred, true)
assert.equal(centred.visible, true)

// Neighbours are smaller, tilted toward the centre, dimmer and deeper.
for (const [i, sign] of [
  [0, -1],
  [2, 1],
]) {
  const s = slot(i, N, z0 - SLICE)
  assert.ok(s.offset * sign > 0, 'offset sign is wrong for a neighbour')
  assert.ok(s.scale < 1, 'neighbour is not smaller')
  assert.ok(s.opacity < 1, 'neighbour is not dimmer')
  assert.ok(s.blur > 0, 'neighbour is not blurred')
  assert.ok(s.tilt * sign < 0, 'neighbour does not tilt toward the centre')
  assert.ok(Math.abs(s.tilt) <= TILT, 'tilt exceeds the maximum')
  assert.equal(s.centred, false)
}

// Tilt is antisymmetric: the arc curves the same way on both sides.
const left = slot(0, N, z0 - SLICE)
const right = slot(2, N, z0 - SLICE)
assert.equal(left.tilt, -right.tilt)
assert.equal(left.x, -right.x)

// Only nearby cards paint; the rest would overlap the readable one.
// On entry only the first card and its neighbour are within reach.
assert.equal(slot(0, N, z0).visible, true, 'the first card is not shown on entry')
assert.equal(slot(1, N, z0).visible, true, 'the next card should be in reach')
assert.equal(slot(N - 1, N, z0).visible, false, 'the far end of the arc is drawn on entry')
for (let i = 0; i < N; i++) {
  const s = slot(i, N, z0 - SLICE)
  assert.equal(s.visible, Math.abs(s.offset) <= REACH, `visibility wrong for ${i}`)
}

// Scale and opacity stay in range at the extremes.
for (let z = z0 + 60; z >= z0 - SLICE * (N + 3); z -= 3) {
  for (let i = 0; i < N; i++) {
    const s = slot(i, N, z)
    assert.ok(s.scale >= 0.6 && s.scale <= 1, `scale out of range: ${s.scale}`)
    assert.ok(s.opacity >= 0 && s.opacity <= 1, `opacity out of range: ${s.opacity}`)
    assert.ok(s.blur >= 0 && s.blur <= 4, `blur out of range: ${s.blur}`)
  }
}

// The scene must be long enough to hold the carousel.
assert.ok(entryZ(N) - SCENE_Z > 0, 'carousel runs backwards into the previous scene')
assert.equal(entryZ(1), SCENE_Z)

console.log('carousel ok')