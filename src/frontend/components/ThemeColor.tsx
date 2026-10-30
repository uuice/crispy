'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_HUE = 250
const HUE_KEY = 'themeHue'
const SHOW_COVERS_KEY = 'showPostCovers'
const HUE_STEP = 5

function applyShowCovers(show: boolean) {
  if (show) document.documentElement.removeAttribute('data-show-covers')
  else document.documentElement.setAttribute('data-show-covers', 'off')
}

function normalizeHue(h: number): number | null {
  let n = Math.round(Number(h))
  if (Number.isNaN(n)) return null
  if (n < 0) n = 0
  if (n > 360) n = 360
  return Math.round(n / HUE_STEP) * HUE_STEP
}

export function ThemeColor() {
  const [open, setOpen] = useState(false)
  const [hue, setHue] = useState(DEFAULT_HUE)
  const [showCovers, setShowCovers] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  const applyHue = useCallback((value: number) => {
    const n = normalizeHue(value)
    if (n === null) return
    document.documentElement.style.setProperty('--hue', String(n))
    setHue(n)
  }, [])

  useEffect(() => {
    const show = localStorage.getItem(SHOW_COVERS_KEY) !== '0'
    applyShowCovers(show)

    const saved = localStorage.getItem(HUE_KEY)
    const h = saved === null ? null : parseInt(saved, 10)
    const n = h === null || Number.isNaN(h) || h < 0 || h > 360 ? null : normalizeHue(h)
    if (n !== null) document.documentElement.style.setProperty('--hue', String(n))

    const id = window.setTimeout(() => {
      setShowCovers(show)
      if (n !== null) setHue(n)
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDocClick = () => setOpen(false)
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  return (
    <div className="relative" id="theme-color-wrap">
      <button
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="主题色"
        className="search-trigger inline-flex items-center justify-center min-h-9 min-w-9 shrink-0 rounded-md border px-1.5 py-1.5 transition-colors hover:bg-(--card-border)"
        id="theme-color-btn"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        style={{
          borderColor: 'var(--card-border)',
          background: 'var(--card-bg)',
          color: 'var(--text-muted)',
        }}
        title="主题色"
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="4" x2="4" y1="21" y2="14" />
          <line x1="4" x2="4" y1="10" y2="3" />
          <line x1="12" x2="12" y1="21" y2="12" />
          <line x1="12" x2="12" y1="8" y2="3" />
          <line x1="20" x2="20" y1="21" y2="16" />
          <line x1="20" x2="20" y1="12" y2="3" />
          <line x1="2" x2="6" y1="14" y2="14" />
          <line x1="10" x2="14" y1="8" y2="8" />
          <line x1="18" x2="22" y1="16" y2="16" />
        </svg>
      </button>

      <div
        aria-label="主题色与缩略图"
        className={`absolute right-0 top-full mt-2 w-64 section-card p-4 z-50${open ? '' : ' hidden'}`}
        id="theme-color-panel"
        onClick={(e) => e.stopPropagation()}
        ref={panelRef}
        role="dialog"
        style={{
          borderRadius: 'var(--radius)',
          border: '1px solid var(--card-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="code-label">主题色相</span>
          <button
            aria-label="重置"
            className="p-1.5 rounded-lg transition-opacity hover:opacity-80"
            id="theme-color-reset"
            onClick={() => {
              applyHue(DEFAULT_HUE)
              localStorage.removeItem(HUE_KEY)
              document.documentElement.style.removeProperty('--hue')
            }}
            style={{ background: 'var(--card-border)', color: 'var(--accent)' }}
            type="button"
          >
            <span aria-hidden="true">↺</span>
          </button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input
            className="theme-hue-slider flex-1 h-3 rounded-full appearance-none cursor-pointer"
            id="theme-color-slider"
            max={360}
            min={0}
            onChange={(e) => {
              applyHue(Number(e.target.value))
              localStorage.setItem(HUE_KEY, e.target.value)
            }}
            step={HUE_STEP}
            style={{
              background: 'linear-gradient(to right,red,yellow,lime,cyan,blue,magenta,red)',
            }}
            type="range"
            value={hue}
          />
          <output
            className="shrink-0 min-w-12 h-7 px-2 rounded-lg flex items-center justify-center font-mono text-sm"
            id="theme-color-value"
            style={{ background: 'var(--card-border)', color: 'var(--text)' }}
          >
            {hue}
          </output>
        </div>
        <label className="mt-3 pt-3 border-t flex items-center justify-between gap-3 cursor-pointer" style={{ borderColor: 'var(--card-border)' }}>
          <span className="code-label">显示缩略图</span>
          <input
            checked={showCovers}
            className="size-4 accent-(--accent) cursor-pointer"
            id="theme-show-covers"
            onChange={(e) => {
              const show = e.target.checked
              applyShowCovers(show)
              setShowCovers(show)
              if (show) localStorage.removeItem(SHOW_COVERS_KEY)
              else localStorage.setItem(SHOW_COVERS_KEY, '0')
            }}
            type="checkbox"
          />
        </label>
      </div>
    </div>
  )
}
