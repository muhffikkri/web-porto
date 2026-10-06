import assert from 'node:assert/strict'
import { constellation } from '../src/lib/constellation.ts'
import { SKILL_GROUPS } from '../src/data/skills.ts'
import {
  offsetBlur,
  offsetOpacity,
  offsetTransform,
  distanceIn,
} from '../src/lib/depth.ts'

// --- constellation ---

const stars = constellation(SKILL_GROUPS)
const totalSkills = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0)
assert.equal(stars.length, totalSkills, 'every skill gets a star')
assert.equal(new Set(stars.map((s) => s.skill)).size, totalSkills, 'no duplicate skills')

// Deterministic: identical layout on every load.
const again = constellation(SKILL_GROUPS)
assert.deepEqual(
  stars.map((s) => [s.x, s.y, s.z, s.size]),
  again.map((s) => [s.x, s.y, s.z, s.size]),
  'constellation is not deterministic',
)

// The focused group must sit in front and read largest; deeper groups recede.
const core = stars.filter((s) => s.group === 'Core')
const engineering = stars.filter((s) => s.group === 'Engineering')
const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
assert.ok(avg(core.map((s) => s.z)) > avg(engineering.map((s) => s.z)), 'Core is not in front')
assert.ok(avg(core.map((s) => s.size)) > avg(engineering.map((s) => s.size)), 'Core is not largest')

// Nothing escapes the viewport: stars are placed as percentages, so they must
// stay inside a sane band or they drift off screen at narrow widths.
for (const s of stars) {
  assert.ok(Math.abs(s.x) <= 45, `x out of range: ${s.skill} at ${s.x}`)
  assert.ok(Math.abs(s.y) <= 30, `y out of range: ${s.skill} at ${s.y}`)
  assert.ok(s.size >= 6, `unreadably small: ${s.skill} at ${s.size}px`)
}

// No two stars in the same group collide on the same line.
for (const group of SKILL_GROUPS) {
  const inGroup = stars.filter((s) => s.group === group.label)
  const lines = new Map()
  for (const s of inGroup) {
    const key = Math.round(s.y / 4)
    if (lines.has(key)) {
      const prev = lines.get(key)
      assert.ok(Math.abs(prev - s.x) > 4, `overlap in ${group.label}: ${prev} vs ${s.x}`)
    }
    lines.set(key, s.x)
  }
}

// --- depth offsets ---

// Reversible: every offset output depends only on distance.
for (const d of [0, -5, -18, 12]) {
  assert.equal(offsetOpacity(d), offsetOpacity(d))
  assert.equal(offsetTransform(d), offsetTransform(d))
}

// Floating panels only ever approach. Past the camera the transform is held
// flat, so a panel can never scale up and sweep over its scene's text.
assert.equal(offsetTransform(0), offsetTransform(40), 'passed panels keep growing')
assert.notEqual(offsetTransform(-10), offsetTransform(10), 'approach still scales')

// Negative d = ahead of the camera, so that is what fades. Positive = passed.
assert.equal(offsetOpacity(0), 1)
assert.equal(offsetOpacity(-20), 0)
assert.equal(offsetOpacity(-40), 0)
assert.equal(offsetOpacity(20), 1, 'passed panels stay solid')

// Approaching the camera (d rising toward 0) opacity only ever increases.
let prev = -1
for (let d = -40; d <= 0; d += 2) {
  const o = offsetOpacity(d)
  assert.ok(o >= prev, `opacity fell again at d=${d}`)
  assert.ok(o >= 0 && o <= 1, `opacity out of range at d=${d}`)
  prev = o
}
assert.equal(prev, 1, 'opacity does not reach full at the camera')

// Blur only once genuinely far ahead, capped so it never smears.
assert.equal(offsetBlur(0), 0)
assert.equal(offsetBlur(-4), 0)
assert.ok(offsetBlur(-20) > 0)
assert.ok(offsetBlur(-1000) <= 5, 'blur is uncapped')

// Elements further into the scene are further ahead of the camera.
assert.ok(distanceIn(0, -10) < distanceIn(0, 0), 'deeper element is further away')
assert.ok(Math.abs(distanceIn(-70, -5) - distanceIn(-70, -5)) < 1e-9, 'distance is stable')

console.log('constellation ok')