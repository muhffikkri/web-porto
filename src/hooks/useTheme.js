import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'mf-theme'
const VALID = ['light', 'dark']

function readCurrent() {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  return VALID.includes(attr) ? attr : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(readCurrent)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      void error
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f1013' : '#f2f0ea')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
