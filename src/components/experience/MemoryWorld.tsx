import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Preload, PerspectiveCamera, Stats } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { FloatingFragments } from './FloatingFragments'
import { ParticleField } from './ParticleField'
import { Atmosphere } from './Atmosphere'
import { Platform } from './Platform'
import { HeroScene } from '../scenes/HeroScene'
import { AboutScene } from '../scenes/AboutScene'
import { SkillsScene } from '../scenes/SkillsScene'
import { ProjectsScene } from '../scenes/ProjectsScene'
import { ExperienceScene } from '../scenes/ExperienceScene'
import { ContactScene } from '../scenes/ContactScene'
import { SCENES } from '../../data/scenes'

type Props = {
  progress: number
  velocity: number
  reduced: boolean
}

export function MemoryWorld({ progress, velocity, reduced }: Props) {
  return (
    <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }} dpr={Math.min(window.devicePixelRatio, 2)} style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <CameraRig progress={progress} velocity={velocity} reduced={reduced} />
      <Suspense fallback={null}>
        <Environment preset="warehouse" environmentIntensity={0.4} />
        <FloatingFragments progress={progress} reduced={reduced} />
        <ParticleField reduced={reduced} />
        <Atmosphere />
        <Platform z={SCENES[1].z} progress={progress} />
        <Platform z={SCENES[2].z} progress={progress} />
        <Platform z={SCENES[3].z} progress={progress} />
        <Platform z={SCENES[4].z} progress={progress} />
        <Platform z={SCENES[5].z} progress={progress} />
        <HeroScene z={SCENES[0].z} progress={progress} reduced={reduced} />
        <AboutScene z={SCENES[1].z} progress={progress} reduced={reduced} />
        <SkillsScene z={SCENES[2].z} progress={progress} reduced={reduced} />
        <ProjectsScene z={SCENES[3].z} progress={progress} reduced={reduced} />
        <ExperienceScene z={SCENES[4].z} progress={progress} reduced={reduced} />
        <ContactScene z={SCENES[5].z} progress={progress} reduced={reduced} />
      </Suspense>
      <Preload all />
      {(import.meta as any).env?.DEV ? <Stats /> : null}
    </Canvas>
  )
}
