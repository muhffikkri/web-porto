/** Half the platform slab thickness, so the avatar stands on the surface. */
const SURFACE = 0.2

/**
 * Placeholder occupant: a person-shaped silhouette standing on the platform.
 *
 * Relative to the platform group, whose y already carries the rise and fall.
 * The group's origin is at the avatar's feet, so nothing sinks into the slab.
 * Swap the primitives for a real model later by replacing the meshes with
 * `<primitive object={gltf.scene} />` from useGLTF — the platform, corridor
 * and camera are unaffected.
 */
export function Avatar({ scale = 1 }: { scale?: number }) {
  return (
    <group position={[0, SURFACE, 0]} scale={scale}>
      <mesh position={[0, 0.83, 0]}>
        <capsuleGeometry args={[0.28, 1.1, 4, 12]} />
        <meshStandardMaterial color="#cfcdc7" roughness={1} metalness={0} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 1.71, 0]}>
        <sphereGeometry args={[0.21, 16, 12]} />
        <meshStandardMaterial color="#c6c4be" roughness={1} metalness={0} transparent opacity={0.75} />
      </mesh>
    </group>
  )
}