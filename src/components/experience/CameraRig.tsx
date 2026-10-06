import { useFrame, useThree } from '@react-three/fiber'
import { cameraZ, scroll } from '../../lib/scroll'

/** Deterministic sway, tied to scroll only. No idle motion, no motion sickness. */
const DRIFT_X = 0.9
const DRIFT_Y = 0.45
const DRIFT_ROT = 0.02

export function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    const t = scroll.progress
    camera.position.set(
      Math.sin(t * Math.PI * 2) * DRIFT_X,
      Math.cos(t * Math.PI * 1.5) * DRIFT_Y,
      cameraZ(),
    )
    camera.rotation.set(
      Math.sin(t * Math.PI * 3) * DRIFT_ROT * 0.4,
      Math.sin(t * Math.PI) * DRIFT_ROT,
      0,
    )
  })

  return null
}