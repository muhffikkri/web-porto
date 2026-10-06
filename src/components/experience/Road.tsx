import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { cameraZ } from '../../lib/scroll'
import { BLOCK_STEP, POOL, blockY, roadOpacity } from '../../lib/platform'
import { Platform } from './Platform'
import { Avatar } from './Avatar'

/** Seconds for the figure to fade up once it is standing down the road. */
const SETTLE = 1.2

/** Base opacity of the figure, kept below the road so it reads as a shadow. */
const FIGURE = 0.75

export function Road() {
  return (
    <group>
      {Array.from({ length: POOL }, (_, slot) => (
        <Platform key={slot} slot={slot} />
      ))}
      <Walker />
    </group>
  )
}

/**
 * The figure standing further down the road.
 *
 * It is seated on a block of the pool rather than on a slot, because slots
 * are re-aimed on every swap while blocks stay put in the world: a figure on
 * a slot would jump a step every time the pool slides. When its own block
 * leaves the pool it is somewhere the camera cannot see it — passed behind,
 * or dropped off the far end in the fog — so it is reseated on the block
 * that just joined and fades up there.
 */
function Walker() {
  const group = useRef<Group>(null)
  const seat = useRef(NaN)
  const fade = useRef(0)

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const camZ = cameraZ()
    const step = Math.round(camZ / BLOCK_STEP)
    const near = step * BLOCK_STEP
    const far = (step - (POOL - 1)) * BLOCK_STEP
    const half = BLOCK_STEP / 2

    if (!Number.isFinite(seat.current) || seat.current < far - half || seat.current > near + half) {
      seat.current = far
      fade.current = 0
    }

    const target = roadOpacity(seat.current - camZ)
    const rate = Math.min(1, delta / SETTLE)
    fade.current =
      target >= fade.current
        ? Math.min(target, fade.current + rate)
        : Math.max(target, fade.current - rate)

    g.visible = fade.current > 0.01
    if (!g.visible) return
    g.position.set(0, blockY(seat.current), seat.current)
    g.traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | undefined
      if (m) m.opacity = FIGURE * fade.current
    })
  })

  // y follows the block it stands on; the slab's half-thickness is in Avatar.
  return (
    <group ref={group} position={[0, blockY(0), 0]} visible={false}>
      <Avatar />
    </group>
  )
}
