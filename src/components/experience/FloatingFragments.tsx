import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { InstancedMesh } from 'three'
import { Object3D } from 'three'
import { mulberry32 } from '../../lib/rng'
import { cameraZ } from '../../lib/scroll'

/** Depth of one repeating tile of fragments. The camera wraps within it. */
const TILE = 90
const SPREAD_X = 70
const SPREAD_Y = 34

type Item = {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
  s: number
  bob: number
  spin: number
}

export function FloatingFragments({
  reduced,
  count,
}: {
  reduced: boolean
  count: number
}) {
  const boxes = useRef<InstancedMesh>(null)
  const planes = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const planeCount = Math.round(count * 0.7)

  const seeds = useMemo(() => {
    const rand = mulberry32(0x5eed)
    const build = (n: number): Item[] =>
      Array.from({ length: n }, () => ({
        x: (rand() - 0.5) * SPREAD_X,
        y: (rand() - 0.5) * SPREAD_Y,
        z: rand() * TILE,
        rx: rand() * Math.PI,
        ry: rand() * Math.PI,
        rz: rand() * Math.PI,
        s: 0.25 + rand() * 1.4,
        bob: rand() * Math.PI * 2,
        spin: (rand() - 0.5) * 0.06,
      }))
    return { boxes: build(count), planes: build(planeCount) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => {
    // Reduced motion: hold the fragments still. They stay in the corridor,
    // they just stop drifting.
    const dt = reduced ? 0 : delta
    place(boxes.current, seeds.boxes, dummy, dt)
    place(planes.current, seeds.planes, dummy, dt)
  })

  return (
    <>
      <instancedMesh ref={boxes} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 0.14, 0.14]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.9} transparent opacity={0.5} />
      </instancedMesh>
      <instancedMesh ref={planes} args={[undefined, undefined, planeCount]} frustumCulled={false}>
        <circleGeometry args={[0.5, 3]} />
        <meshBasicMaterial color="#dcdcdc" transparent opacity={0.3} side={2} />
      </instancedMesh>
    </>
  )
}

/** Wrap every fragment into the tile centred on the camera, so it never runs out. */
function place(mesh: InstancedMesh | null, items: Item[], dummy: Object3D, dt: number) {
  if (!mesh) return
  const cz = cameraZ()
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const z = (((cz - it.z) % TILE) + TILE) % TILE - TILE * 0.5
    // No clock-driven bob when reduced: dt is 0, so the fragments hold still.
    const t = dt === 0 ? 0 : performance.now() * 0.0004
    dummy.position.set(
      it.x + Math.sin(it.bob + t) * 0.5,
      it.y + Math.cos(it.bob * 1.3 + t) * 0.4,
      z,
    )
    dummy.rotation.set(it.rx + dt * it.spin, it.ry + dt * it.spin * 0.7, it.rz)
    dummy.scale.setScalar(it.s)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  }
  mesh.instanceMatrix.needsUpdate = true
}