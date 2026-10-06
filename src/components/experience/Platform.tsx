import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, MeshStandardMaterial } from 'three'
import { cameraZ } from '../../lib/scroll'

type Props = {
  z: number
  width?: number
  depth?: number
}

/**
 * A matte slab marking a location in the corridor. It stays put in world space;
 * the camera travelling past it is what sells the movement.
 * Visible as a distant marker, gone by the time the camera stands on it.
 */
export function Platform({ z, width = 15, depth = 11 }: Props) {
  const mat = useRef<MeshStandardMaterial>(null)
  const mesh = useRef<Mesh>(null)

  useFrame(() => {
    const d = z - cameraZ()
    // Gone by the time the camera arrives; only the platform ahead reads.
    if (mat.current) mat.current.opacity = Math.max(0, Math.min(1, -d / 40)) * 0.7
    if (mesh.current) mesh.current.visible = d < 0 && -d < 130
  })

  return (
    <mesh ref={mesh} position={[0, -4.5, z]}>
      <boxGeometry args={[width, 0.4, depth]} />
      <meshStandardMaterial ref={mat} color="#e9e7e2" roughness={1} metalness={0} transparent />
    </mesh>
  )
}