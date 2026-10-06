import assert from 'node:assert/strict'
import { GAP, SCENE_Z, marker, markerFocus, milestoneZ } from '../src/lib/milestones.ts'
import { brighten, fogFar, BRIGHTEN_END, BRIGHTEN_START } from '../src/lib/atmosphere.ts'

const N = 3
const first = milestoneZ(0, N)
const last = milestoneZ(N - 1, N)

// The sequence is centred on its scene, like the carousel.
assert.equal(first + last, SCENE_Z * 2, 'milestones are not symmetric about the scene')
assert.ok(first > SCENE_Z, 'the first milestone should be nearer than the scene')
assert.ok(last < SCENE_Z, 'the last milestone should be deeper than the scene')
assert.equal(milestoneZ(0, N) - milestoneZ(1, N), GAP, 'milestones are not evenly spaced')
assert.equal(milestoneZ(0, 1), SCENE_Z, 'a lone milestone should sit on the scene')

// The camera reads them in order, one at a time.
assert.equal(markerFocus(N, first), 0, 'first milestone not active on entry')
assert.equal(markerFocus(N, last), N - 1, 'last milestone not active at the end')
assert.equal(markerFocus(1, first), 0, 'a lone milestone is not always active')

let prev = -1
for (let z = first + 30; z >= last - 30; z -= 1) {
  const f = markerFocus(N, z)
  assert.ok(f >= prev, `focus went backwards at z=${z}`)
  prev = f
}

// Each milestone is fully legible exactly when the camera reaches it.
for (let i = 0; i < N; i++) {
  const s = marker(i, N, milestoneZ(i, N))
  assert.equal(s.offset, 0, `milestone ${i} is not centred on its own z`)
  assert.equal(s.scale, 1)
  assert.equal(s.opacity, 1)
  assert.equal(s.blur, 0)
  assert.equal(s.active, true)
  assert.equal(s.visible, true, `milestone ${i} is hidden at its own z`)
}

// One the camera has passed must not paint: it is behind the camera and
// would otherwise render over whatever comes next.
// The camera travels toward -z, so a milestone ahead has a larger z and d < 0.
for (let i = 0; i < N; i++) {
  const mz = milestoneZ(i, N)
  assert.ok(marker(i, N, mz - GAP * 2).d > 0, 'a milestone behind reads as ahead')
  assert.equal(marker(i, N, mz).visible, true, 'not visible at its own z')
  assert.equal(marker(i, N, mz - GAP * 2).visible, false, 'a passed milestone is still drawn')
  // Culled as soon as it is behind the camera, not merely out of reach.
  assert.equal(marker(i, N, mz - GAP * 0.25).visible, true, 'culled while still ahead')
  assert.equal(marker(i, N, mz - GAP * 0.75).visible, false, 'still drawn after being passed')
}

// The next milestone is already fading in as the current one is read.
const second = marker(1, N, milestoneZ(0, N))
assert.ok(second.opacity > 0 && second.opacity < 1, 'the next milestone is not approaching')
assert.ok(second.blur > 0, 'the next milestone is not blurred yet')

// Ranges hold across the whole sequence and beyond it.
for (let z = first + 60; z >= last - 60; z -= 2) {
  for (let i = 0; i < N; i++) {
    const s = marker(i, N, z)
    assert.ok(s.scale >= 0.65 && s.scale <= 1, `scale out of range: ${s.scale}`)
    assert.ok(s.opacity >= 0 && s.opacity <= 1, `opacity out of range: ${s.opacity}`)
    assert.ok(s.blur >= 0 && s.blur <= 3, `blur out of range: ${s.blur}`)
  }
}

// --- brightening toward the end of the corridor ---

assert.equal(brighten(0), 0, 'the corridor is bright at the start')
assert.equal(brighten(BRIGHTEN_START), 0)
assert.equal(brighten(BRIGHTEN_END), 1)
assert.equal(brighten(1), 1, 'the corridor is not fully bright at the end')
assert.ok(brighten(BRIGHTEN_START - 0.1) === 0, 'brightens before the contact scene')
let lastB = -1
for (let p = 0; p <= 1; p += 0.01) {
  const b = brighten(p)
  assert.ok(b >= lastB, `brightness dipped at ${p}`)
  assert.ok(b >= 0 && b <= 1, `brightness out of range at ${p}: ${b}`)
  lastB = b
}
assert.ok(fogFar(0) < fogFar(1), 'the far wall never comes into view')

console.log('experience ok')