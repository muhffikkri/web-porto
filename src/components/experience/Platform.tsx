import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, MeshStandardMaterial } from 'three'
import { cameraZ } from '../../lib/scroll'
import {
  BLOCK_DEPTH,
  BLOCK_WIDTH,
  blockY,
  blockZ,
  roadOpacity,
  roadVisible,
} from '../../lib/platform'

/**
 * One block of the road.
 *
 * It holds a slot in a pool of POOL blocks that slides with the camera: the
 * slot's world z is recomputed each frame, so between pool swaps the block
 * sits still in the world and it is the camera that moves past it. On a swap
 * the block that leaves is behind the camera and the one that joins is at
 * zero opacity, so nothing appears to jump.
 */
export function Platform({ slot }: { slot: number }) {
  const group = useRef<Group>(null)
  const mat = useRef<MeshStandardMaterial>(null)

  useFrame(() => {
    const g = group.current
    if (!g) return
    const camZ = cameraZ()
    const z = blockZ(slot, camZ)
    const d = z - camZ
    g.visible = roadVisible(d)
    if (!g.visible) return
    g.position.set(0, blockY(z), z)
    if (mat.current) mat.current.opacity = roadOpacity(d)
  })

  return (
    // y and z are set per frame: the block is fixed in the world, the pool
    // around it is what moves.
    <group ref={group} position={[0, blockY(blockZ(slot, cameraZ())), blockZ(slot, cameraZ())]}>
      <mesh>
        <boxGeometry args={[BLOCK_WIDTH, 0.4, BLOCK_DEPTH]} />
        <meshStandardMaterial ref={mat} color="#e9e7e2" roughness={1} metalness={0} transparent />
      </mesh>
    </group>
  )
}
