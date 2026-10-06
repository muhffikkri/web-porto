import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme.js'
import { scrollTo } from '../lib/scroll.js'
import { ArrowUpIcon, MoonIcon, SunIcon } from './Icons.jsx'

export function HudControls() {
  const { theme, toggleTheme } = useTheme()
  const [away, setAway] = useState(false)

  useEffect(() => {
    const sync = document.getElementById('sync')
    if (!sync) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setAway(!entry.isIntersecting),
      { rootMargin: '-10% 0px 0px 0px' },
    )
    observer.observe(sync)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <button
        className="hud-btn hud-theme"
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </button>

      <button
        className={`hud-btn hud-top${away ? ' is-on' : ''}`}
        type="button"
        onClick={() => scrollTo(0)}
        aria-label="Back to the synchronisation sequence"
        aria-hidden={!away}
        tabIndex={away ? 0 : -1}
      >
        <ArrowUpIcon size={20} />
      </button>
    </>
  )
}
