
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Group, PerspectiveCamera } from 'three'

type CameraRigProps = {
  progress: number
  velocity: number
  reduced: boolean
}

const WORLD_LENGTH = 200
const AMP_X = 0.8
const AMP_Y = 0.4
const ROT_AMPL = 0.002

export function CameraRig({ progress, velocity, reduced }: CameraRigProps) {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    (camera as PerspectiveCamera).fov = 65
    camera.near = 0.1
    camera.far = 1000
    camera.updateProjectionMatrix()
  }, [camera])

  useFrame((_, delta) => {
    if (!group.current || reduced) return
    const t = progress
    const baseZ = -t * WORLD_LENGTH
    const driftX = Math.sin(t * Math.PI * 2) * AMP_X
    const driftY = Math.cos(t * Math.PI * 1.5) * AMP_Y
    const rot = Math.sin(t * Math.PI) * ROT_AMPL * (1 + velocity * 0.0001)
    group.current.position.set(driftX, driftY, baseZ)
    group.current.rotation.set(0, rot, 0)
  })

  return <group ref={group} />
}
