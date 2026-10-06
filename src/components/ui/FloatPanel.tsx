import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { PASS_FADE, offsetBlur, offsetOpacity, offsetTransform } from '../../lib/depth'
import { distanceTo, scroll } from '../../lib/scroll'

type Props = {
  /** World z of the owning scene. */
  sceneZ: number
  /** Offset into the scene, in world units. Negative is deeper down the corridor. */
  offsetZ?: number
  /**
   * Which margin of the viewport to sit in. Omit and pass `x` instead to place
   * freely, which is what the skill constellation needs.
   */
  side?: 'left' | 'right'
  /** Free horizontal placement as a percentage of the scene width. */
  x?: number
  /** Vertical placement as a percentage of the scene height. */
  y?: number
  children: ReactNode
  className?: string
}

/**
 * One floating panel inside a scene. It has its own z, so it approaches,
 * dims and passes on its own schedule rather than sharing the scene's.
 *
 * Placement is a viewport margin or a free percentage, never a percentage of
 * the centre, so panels do not all pile onto the scene's own text.
 */
export function FloatPanel({ sceneZ, offsetZ = 0, side, x, y = 0, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let raf = 0
    const place = () => {
      raf = requestAnimationFrame(place)
      const el = ref.current
      if (!el) return

      // Cull on the scene, not on the panel's own z: these panels are children
      // of the scene's own panel, so once that has faded out they are invisible
      // anyway. Culling any earlier would drop them while still readable, which
      // is what hid the skill constellation before its scene was ever centred.
      if (distanceTo(sceneZ) > PASS_FADE) {
        el.style.visibility = 'hidden'
        return
      }

      const d = distanceTo(sceneZ + offsetZ)
      const opacity = offsetOpacity(d)
      if (opacity < 0.01) {
        el.style.visibility = 'hidden'
        return
      }
      el.style.visibility = 'visible'
      el.style.opacity = String(opacity)
      // Reduced motion cuts between scenes: nothing slides or blurs into place.
      el.style.transform = scroll.stepped ? 'none' : offsetTransform(d)
      const blur = scroll.stepped ? 0 : offsetBlur(d)
      el.style.filter = blur ? `blur(${blur}px)` : ''
    }
    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [sceneZ, offsetZ])

  const place: CSSProperties =
    side === 'left'
      ? { left: 'clamp(1.5rem, 5vw, 5rem)', top: `${50 + y}%` }
      : side === 'right'
        ? { right: 'clamp(1.5rem, 5vw, 5rem)', top: `${50 + y}%` }
        : { left: `${50 + (x ?? 0)}%`, top: `${50 + y}%` }

  return (
    <div
      ref={ref}
      className={`float-panel ${side ? `float-panel--${side}` : 'float-panel--free'} ${className ?? ''}`}
      style={{ ...place, visibility: 'hidden' }}
    >
      {children}
    </div>
  )
}