import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, MeshStandardMaterial } from 'three'
import { cameraZ } from '../../lib/scroll'
import { platformOpacity, platformVisible, platformY } from '../../lib/platform'
import { Avatar } from './Avatar'

type Props = {
  z: number
  width?: number
  depth?: number
}

/**
 * A matte slab marking a location in the corridor.
 *
 * The slab stays put in world space. What sells the movement is the camera
 * travelling past it, plus the slab rising from below as the camera
 * approaches and falling away behind it. Both are pure functions of camera
 * distance, so scrolling back up reverses them exactly.
 */
export function Platform({ z, width = 15, depth = 11 }: Props) {
  const group = useRef<Group>(null)
  const mat = useRef<MeshStandardMaterial>(null)

  useFrame(() => {
    const d = z - cameraZ()
    const g = group.current
    if (!g) return
    g.visible = platformVisible(d)
    if (!g.visible) return
    g.position.y = platformY(d)
    if (mat.current) mat.current.opacity = platformOpacity(d)
  })

  return (
    // y is set per frame from platformY(d), which is an absolute height.
    <group ref={group} position={[0, platformY(0), z]}>
      <mesh>
        <boxGeometry args={[width, 0.4, depth]} />
        <meshStandardMaterial ref={mat} color="#e9e7e2" roughness={1} metalness={0} transparent />
      </mesh>
      <Avatar />
    </group>
  )
}