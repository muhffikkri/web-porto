import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Points } from 'three'
import { mulberry32 } from '../../lib/rng'
import { cameraZ } from '../../lib/scroll'

/** One repeating tile of dust. The group snaps to it so the field is endless. */
const TILE = 110
const SPREAD_X = 80
const SPREAD_Y = 40

export function ParticleField({
  reduced,
  count,
}: {
  reduced: boolean
  count: number
}) {
  const points = useRef<Points>(null)

  const positions = useMemo(() => {
    const rand = mulberry32(0xd15a)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * SPREAD_X
      arr[i * 3 + 1] = (rand() - 0.5) * SPREAD_Y
      arr[i * 3 + 2] = (rand() - 0.5) * TILE
    }
    return arr
  }, [count])

  useFrame(() => {
    const group = points.current
    if (!group) return
    group.position.z = Math.round(cameraZ() / TILE) * TILE
    group.position.y = reduced ? 0 : Math.sin(performance.now() * 0.00012) * 0.6
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  )
}
