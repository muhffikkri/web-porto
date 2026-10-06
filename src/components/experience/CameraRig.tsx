import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { cameraZ, scroll } from '../../lib/scroll'

/**
 * Deterministic sway, tied to scroll only. No idle motion, and no drift at
 * all under reduced motion, where the camera parks between scenes.
 */
const DRIFT_X = 0.9
const DRIFT_Y = 0.45
const DRIFT_ROT = 0.02

/** How far the viewpoint leans toward the cursor, and how fast it gets there. */
const POV_X = 1.6
const POV_Y = 0.9
const POV_LOOK = 0.05
const POV_LERP = 6

export function CameraRig() {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  // Passive: the cursor steers the camera but never blocks the page.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pointer.current
      p.tx = (e.clientX / window.innerWidth) * 2 - 1
      p.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const z = cameraZ()
    if (scroll.stepped) {
      camera.position.set(0, 0, z)
      camera.rotation.set(0, 0, 0)
      return
    }
    const p = pointer.current
    // Frame-rate independent approach, so 30fps and 144fps feel the same.
    const k = 1 - Math.exp(-delta * POV_LERP)
    p.x += (p.tx - p.x) * k
    p.y += (p.ty - p.y) * k
    const t = scroll.progress
    camera.position.set(
      Math.sin(t * Math.PI * 2) * DRIFT_X + p.x * POV_X,
      Math.cos(t * Math.PI * 1.5) * DRIFT_Y - p.y * POV_Y,
      z,
    )
    camera.rotation.set(
      Math.sin(t * Math.PI * 3) * DRIFT_ROT * 0.4 - p.y * POV_LOOK,
      Math.sin(t * Math.PI) * DRIFT_ROT - p.x * POV_LOOK,
      0,
    )
  })

  return null
}
