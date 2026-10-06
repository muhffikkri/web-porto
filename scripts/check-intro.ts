import assert from 'node:assert/strict'
import { resolveReveal, syncFrame, timelineReveal, INTRO_DURATION, SYNC_FRAMES } from '../src/lib/intro.ts'

// Clock alone: monotonic 0 -> 1 across the scripted duration.
assert.equal(timelineReveal(0), 0)
assert.equal(timelineReveal(INTRO_DURATION), 1)
assert.ok(timelineReveal(1000) > 0 && timelineReveal(1000) < 1, 'mid-sequence is partial')
assert.ok(timelineReveal(INTRO_DURATION * 2) === 1, 'clamps past the end')

// Scrolling skips the intro instead of locking the user through it.
assert.equal(resolveReveal(0, 0, false), 0)
assert.equal(resolveReveal(0, 0.03, false) > 0, true, 'scroll advances reveal')
assert.equal(resolveReveal(0, 0.06, false), 1, 'enough scroll skips fully')
assert.equal(resolveReveal(0, 0, true), 1, 'reduced motion skips the sequence')
assert.equal(resolveReveal(0, 0, true), 1, 'reduced motion ignores the clock')

// Reveal never decreases: the faster of clock and scroll wins.
for (let t = 0; t <= 2400; t += 40) {
  for (const p of [0, 0.02, 0.06, 0.4]) {
    const a = resolveReveal(t - 200, p, false)
    const b = resolveReveal(t, p, false)
    assert.ok(b >= a, `reveal went backwards at t=${t} p=${p}`)
  }
}

// Flicker is deterministic and always readable.
assert.equal(syncFrame(0), SYNC_FRAMES[0])
assert.equal(syncFrame(90), SYNC_FRAMES[1])
for (let t = 0; t < 3000; t += 37) assert.ok(SYNC_FRAMES.includes(syncFrame(t)))

console.log('intro ok')