import { Canvas } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { MemoryShards } from './MemoryShards'
import { ParticleField } from './ParticleField'
import { Atmosphere } from './Atmosphere'
import { Road } from './Road'
import { qualityFor } from '../../lib/quality'

/**
 * Read once: the fragment and particle counts are baked into buffer geometry,
 * so they cannot change without a rebuild mid-scroll.
 */
const QUALITY = qualityFor()

export function MemoryWorld({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={QUALITY.dpr}
      camera={{ fov: 62, near: 0.1, far: 400 }}
      gl={{ antialias: QUALITY.tier !== 'low', powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <CameraRig />
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 12, 8]} intensity={0.7} />
      <Atmosphere />
      <MemoryShards reduced={reduced} count={QUALITY.fragments} />
      <ParticleField reduced={reduced} count={QUALITY.particles} />
      <Road />
    </Canvas>
  )
}