'use client'

import React, { useCallback, useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setDark(next)
  }, [])

  return (
    <button
      aria-label={dark ? '切换浅色模式' : '切换深色模式'}
      className="cms-theme-toggle"
      onClick={toggle}
      type="button"
    >
      {dark ? '☀' : '☾'}
    </button>
  )
}
