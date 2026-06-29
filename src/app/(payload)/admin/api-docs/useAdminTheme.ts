'use client'

import { useEffect, useState } from 'react'

export type AdminTheme = 'light' | 'dark'

function readAdminTheme(): AdminTheme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

/** Sync with Payload Admin theme (html[data-theme]). */
export function useAdminTheme(): AdminTheme {
  const [theme, setTheme] = useState<AdminTheme>('light')

  useEffect(() => {
    setTheme(readAdminTheme())

    const observer = new MutationObserver(() => {
      setTheme(readAdminTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return theme
}
