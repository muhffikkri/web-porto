import { MemoryWorld } from './components/experience/MemoryWorld'
import { HUD } from './components/ui/HUD'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useReducedMotion } from './hooks/useReducedMotion'

export default function App() {
  const { progress, velocity } = useScrollProgress()
  const reduced = useReducedMotion()

  return (
    <>
      <MemoryWorld progress={progress} velocity={velocity}  reduced={reduced} />
      <HUD progress={progress} />
    </>
  )
}
