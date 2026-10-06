import { useFrame, useThree } from '@react-three/fiber'
import { cameraZ, scroll } from '../../lib/scroll'

/**
 * Deterministic sway, tied to scroll only. No idle motion, and no drift at
 * all under reduced motion, where the camera parks between scenes.
 */
const DRIFT_X = 0.9
const DRIFT_Y = 0.45
const DRIFT_ROT = 0.02

export function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    const z = cameraZ()
    if (scroll.stepped) {
      camera.position.set(0, 0, z)
      camera.rotation.set(0, 0, 0)
      return
    }
    const t = scroll.progress
    camera.position.set(Math.sin(t * Math.PI * 2) * DRIFT_X, Math.cos(t * Math.PI * 1.5) * DRIFT_Y, z)
    camera.rotation.set(
      Math.sin(t * Math.PI * 3) * DRIFT_ROT * 0.4,
      Math.sin(t * Math.PI) * DRIFT_ROT,
      0,
    )
  })

  return null
}

