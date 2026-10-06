import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, Fog } from 'three'
import { scroll } from '../../lib/scroll'
import { brighten, fogFar } from '../../lib/atmosphere'

const BG = '#f4f3ef'
const END = '#ffffff'

export function Atmosphere() {
  const { scene } = useThree()
  const start = useRef(new Color(BG))
  const end = useRef(new Color(END))

  useEffect(() => {
    scene.background = start.current
    scene.fog = new Fog(start.current.getHex(), 20, fogFar(0))
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])

  // Lighter air at the end of the corridor, and the far end coming into view.
  useFrame(() => {
    const b = brighten(scroll.progress)
    const bg = scene.background as Color
    bg.copy(start.current).lerp(end.current, b)
    const fog = scene.fog as Fog | null
    if (fog) {
      fog.color.copy(bg)
      fog.far = fogFar(b)
    }
  })

  return null
}