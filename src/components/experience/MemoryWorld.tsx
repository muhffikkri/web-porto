import { Canvas } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { FloatingFragments } from './FloatingFragments'
import { ParticleField } from './ParticleField'
import { Atmosphere } from './Atmosphere'
import { Platform } from './Platform'
import { SCENES } from '../../data/scenes'

export function MemoryWorld({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio, 1.75)}
      camera={{ fov: 62, near: 0.1, far: 400 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <CameraRig />
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 12, 8]} intensity={0.7} />
      <Atmosphere />
      <FloatingFragments reduced={reduced} />
      <ParticleField reduced={reduced} />
      {/* No platform at the hero: the camera already starts standing on it. */}
      {SCENES.slice(1).map((s) => (
        <Platform key={s.id} z={s.z} />
      ))}
    </Canvas>
  )
}