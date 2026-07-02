'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { NavItem } from '@/utilities/queryFrontendData'

type Props = {
  menu: NavItem[]
}

export function MobileNav({ menu }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const setNavOpen = useCallback((next: boolean) => {
    setOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setNavOpen])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const drawer = (
    <div
      aria-hidden={!open}
      className="mobile-nav-root lg:hidden fixed inset-0 z-40"
      data-open={open ? 'true' : 'false'}
      id="mobile-nav-root"
    >
      <button
        aria-label="关闭菜单"
        className="mobile-nav-backdrop absolute inset-0 bg-black/40 opacity-0"
        id="mobile-nav-backdrop"
        onClick={() => setNavOpen(false)}
        tabIndex={-1}
        type="button"
      />
      <aside
        aria-label="主导航"
        className="mobile-nav-panel absolute top-0 right-0 flex h-full w-[min(20rem,88vw)] max-w-full flex-col border-l shadow-lg"
        id="mobile-nav-panel"
        style={{
          background: 'var(--header-bg)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b px-4 py-3 shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <p
            className="m-0 flex items-center gap-1.5 flex-wrap"
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            导航菜单
          </p>
          <button
            aria-label="关闭菜单"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors hover:opacity-90"
            id="mobile-nav-close"
            onClick={() => setNavOpen(false)}
            style={{
              fontSize: 'var(--text-lg)',
              lineHeight: 1,
              color: 'var(--text)',
              borderColor: 'var(--card-border)',
              background: 'var(--card-bg)',
            }}
            type="button"
          >
            ×
          </button>
        </div>
        <nav aria-label="主导航" className="mobile-nav-links flex flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-3 min-h-0">
          {menu.map((item) => (
            <Link
              className="nav-link-cute flex items-center gap-2 rounded-md px-3 py-3 shrink-0"
              href={item.url}
              key={item.url + item.title}
              onClick={() => setNavOpen(false)}
              style={{
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
              }}
              target={item.target || '_self'}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  )

  return (
    <>
      <button
        aria-controls="mobile-nav-panel"
        aria-expanded={open}
        aria-label="打开菜单"
        className="search-trigger lg:hidden inline-flex items-center justify-center min-h-9 min-w-9 shrink-0 rounded-md border px-1.5 py-1.5 transition-colors hover:bg-(--card-border)"
        id="mobile-nav-open"
        onClick={(e) => {
          e.stopPropagation()
          setNavOpen(true)
        }}
        style={{
          borderColor: 'var(--card-border)',
          background: 'var(--card-bg)',
          color: 'var(--text-muted)',
        }}
        title="菜单"
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
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  )
}
