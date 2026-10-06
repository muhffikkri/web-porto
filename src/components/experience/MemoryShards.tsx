import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { InstancedMesh } from 'three'
import { Object3D, Shape, ShapeGeometry } from 'three'
import { mulberry32 } from '../../lib/rng'
import { cameraZ } from '../../lib/scroll'

/** Depth of one repeating tile of shards. The camera wraps within it. */
const TILE = 90
const SPREAD_X = 70
const SPREAD_Y = 34

/** Distinct broken-glass outlines the corridor is assembled from. */
const SHAPES = 3

type Item = {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
  /** Non-uniform per axis: a shard stretched once stays irregular at any angle. */
  sx: number
  sy: number
  bob: number
  spin: number
}

/**
 * Irregular flat polygon: broken-glass silhouette with an uneven radius per
 * vertex, so no two outlines read as the same shape. The ShapeGeometry keeps
 * UVs in shape space, which is the slot a memory image maps onto once photos
 * exist (then one mesh per shard, with the map on its material).
 */
function shardGeometry(seed: number, sides: number) {
  const rand = mulberry32(seed)
  const shape = new Shape()
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2
    const r = 0.3 + rand() * 0.55
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return new ShapeGeometry(shape)
}

export function MemoryShards({ reduced, count }: { reduced: boolean; count: number }) {
  const per = Math.max(1, Math.round(count / SHAPES))
  return (
    <>
      {Array.from({ length: SHAPES }, (_, i) => (
        <Shards
          key={i}
          seed={0x51a7 + i * 7919}
          sides={4 + (i % 3)}
          count={per}
          reduced={reduced}
        />
      ))}
    </>
  )
}

function Shards({
  seed,
  sides,
  count,
  reduced,
}: {
  seed: number
  sides: number
  count: number
  reduced: boolean
}) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const geometry = useMemo(() => shardGeometry(seed, sides), [seed, sides])
  const items = useMemo(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * SPREAD_X,
      y: (rand() - 0.5) * SPREAD_Y,
      z: rand() * TILE,
      rx: rand() * Math.PI,
      ry: rand() * Math.PI,
      rz: rand() * Math.PI,
      sx: 0.4 + rand() * 1.6,
      sy: 0.4 + rand() * 1.6,
      bob: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.06,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => {
    // Reduced motion: dt 0 freezes the tumble and bob in place.
    place(mesh.current, items, dummy, reduced ? 0 : delta)
  })

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}>
      {/* Cool grey against the warm paper corridor, so it reads as glass rather
          than paper; low roughness lets the directional light glint as the
          shards tumble. */}
      <meshStandardMaterial
        color="#d7dde1"
        roughness={0.22}
        metalness={0}
        transparent
        opacity={0.45}
        side={2}
      />
    </instancedMesh>
  )
}

/** Wrap every shard into the tile centred on the camera, so it never runs out. */
function place(mesh: InstancedMesh | null, items: Item[], dummy: Object3D, dt: number) {
  if (!mesh) return
  const cz = cameraZ()
  const t = dt === 0 ? 0 : performance.now() * 0.0004
  for (let i = 0; i < items.length; i++) {    const it = items[i]
    const z = cz + ((((it.z - cz) % TILE) + TILE) % TILE - TILE * 0.5)
    dummy.position.set(
      it.x + Math.sin(it.bob + t) * 0.5,
      it.y + Math.cos(it.bob * 1.3 + t) * 0.4,
      z,
    )
    dummy.rotation.set(it.rx + t * it.spin, it.ry + t * it.spin * 0.7, it.rz)
    dummy.scale.set(it.sx, it.sy, 1)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  }
  mesh.instanceMatrix.needsUpdate = true
}
