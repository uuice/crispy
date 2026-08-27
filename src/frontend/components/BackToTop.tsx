'use client'

import React, { useCallback, useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      aria-label="返回顶部"
      className={`back-to-top back-to-top-cute-wrap fixed right-6 bottom-6 z-40 transition-opacity duration-200 inline-flex items-center gap-1${
        visible ? ' opacity-100' : ' opacity-0 pointer-events-none'
      }`}
      id="back-to-top"
      onClick={scrollToTop}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text)',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        padding: '0.4rem 0.65rem',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow)',
      }}
      type="button"
    >
      <span>返回顶部</span>
      <span aria-hidden="true" className="back-to-top-cute">
        ˖°
      </span>
    </button>
  )
}

export function FooterBackToTop() {
  const scrollToTop = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      className="transition-colors hover:opacity-80"
      id="footer-back-to-top"
      onClick={scrollToTop}
      style={{ color: 'var(--accent)', background: 'transparent', border: 'none', padding: 0 }}
      type="button"
    >
      返回顶部
    </button>
  )
}
