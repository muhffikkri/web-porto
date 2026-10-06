import { useEffect } from 'react'
import Lenis from 'lenis'
import { scroll } from '../lib/scroll'
import { CAMERA_START, SCENES, WORLD_LENGTH } from '../data/scenes'

/** Scroll offset that puts the camera exactly on a scene. */
export function scrollTargetFor(sceneId: string) {
  const scene = SCENES.find((s) => s.id === sceneId)
  if (!scene) return 0
  const p = (CAMERA_START - scene.z) / WORLD_LENGTH
  return p * (document.body.scrollHeight - window.innerHeight)
}

export function useScrollProgress() {
  useEffect(() => {
    // Under reduced motion there is nothing to smooth: the camera cuts between
    // scenes, so the easing would only add lag between what is read and shown.
    const lenis = new Lenis({
      duration: scroll.stepped ? 0 : 1.1,
      smoothWheel: !scroll.stepped,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    })

    // Deep link: #projects jumps the camera straight to that scene.
    const hash = window.location.hash.slice(1)
    if (hash) {
      const top = scrollTargetFor(hash)
      if (top > 0) {
        window.scrollTo(0, top)
        lenis.scrollTo(top, { immediate: true })
      }
    }

    let raf = 0
    let lastScroll = 0

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick)
      lenis.raf(time * 1000)
      const limit = lenis.limit ?? 1
      scroll.progress = Math.min(1, Math.max(0, lenis.scroll / limit))
      scroll.velocity = lenis.scroll - lastScroll
      if (scroll.velocity !== 0) scroll.direction = scroll.velocity > 0 ? 1 : -1
      lastScroll = lenis.scroll
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}