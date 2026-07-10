'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type SearchDoc = {
  id: string
  title: string
  url: string
  excerpt?: string
  categories?: string[]
  tags?: string[]
  body?: string
}

export function BlogSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const loadStarted = useRef(false)

  const loadIndex = useCallback(() => {
    if (loadStarted.current) return
    loadStarted.current = true
    void fetch('/search-index.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((loaded: SearchDoc[]) => setDocs(Array.isArray(loaded) ? loaded : []))
      .catch(() => setDocs([]))
  }, [])

  const openPanel = useCallback(() => {
    setOpen(true)
    setQuery('')
    loadIndex()
  }, [loadIndex])

  const close = useCallback(() => setOpen(false), [])

  const matched = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term || docs === null) return undefined
    const words = term.split(/\s+/).filter(Boolean)
    return docs
      .filter((d) => {
        const text = [
          d.title || '',
          d.excerpt || '',
          d.body || '',
          (d.categories || []).join(' '),
          (d.tags || []).join(' '),
        ]
          .join(' ')
          .toLowerCase()
        return words.every((w) => text.includes(w))
      })
      .slice(0, 15)
  }, [docs, query])

  const openFirstMatch = useCallback(() => {
    const first = matched?.[0]
    if (!first?.url) return
    close()
    router.push(first.url)
  }, [close, matched, router])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [close, open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openPanel()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openPanel])

  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    if (!panel) return

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'))

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusable()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener('keydown', onKeyDown)
    return () => panel.removeEventListener('keydown', onKeyDown)
  }, [open])

  const term = query.trim()
  const showEmptyHint = !term
  const showNoMatch = Boolean(term && matched && matched.length === 0)
  const showList = Boolean(matched && matched.length > 0)

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-label="搜索"
        className="search-trigger inline-flex items-center justify-center min-h-9 min-w-9 shrink-0 rounded-md border px-1.5 py-1.5 transition-colors hover:bg-(--card-border)"
        onClick={openPanel}
        style={{
          borderColor: 'var(--card-border)',
          background: 'var(--card-bg)',
          color: 'var(--text-muted)',
        }}
        title="搜索 (Ctrl+K)"
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
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 search-overlay-terminal${open ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div
          ref={panelRef}
          aria-label="搜索文章"
          aria-modal="true"
          className="search-panel-terminal search-panel-cute"
          role="dialog"
        >
          <span aria-hidden="true" className="search-panel-cute-glyph">
            ✦ find · ✧
          </span>
          <div className="search-panel-header flex items-start justify-between gap-2">
            <div>
              <h2 className="search-panel-title" id="blog-search-title">
                搜索
              </h2>
              <p className="code-label mt-1 mb-2">输入关键词，回车打开第一条结果</p>
            </div>
            <button
              aria-label="关闭搜索"
              className="search-trigger inline-flex items-center justify-center min-h-8 min-w-8 shrink-0 rounded-md border p-1 transition-colors hover:bg-(--card-border)"
              onClick={close}
              style={{
                borderColor: 'var(--card-border)',
                background: 'var(--card-bg)',
                color: 'var(--text-muted)',
              }}
              title="关闭"
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="search-panel-input-wrap">
            <input
              aria-labelledby="blog-search-title"
              autoComplete="off"
              className="search-panel-input"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') close()
                if (e.key === 'Enter') {
                  e.preventDefault()
                  openFirstMatch()
                }
              }}
              placeholder="输入关键词"
              ref={inputRef}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                background: 'transparent',
                color: 'var(--text)',
                border: 'none',
                outline: 'none',
                flex: 1,
              }}
              type="search"
              value={query}
            />
          </div>
          <div className="search-results-terminal">
            {showEmptyHint ? <p className="code-label py-4">请输入关键词</p> : null}
            {showNoMatch ? <p className="code-label py-4">无匹配结果</p> : null}
            {showList && matched ? (
              <ul className="post-list terminal-list">
                {matched.map((item) => {
                  const categoryStr =
                    item.categories && item.categories.length
                      ? ` · 分类：${item.categories.join(', ')}`
                      : ''
                  const desc = (
                    item.excerpt ||
                    (item.body ? item.body.slice(0, 100) + (item.body.length > 100 ? '…' : '') : '')
                  ).trim()

                  return (
                    <li key={item.id}>
                      <article
                        className="post-card-cute section-card group"
                        style={{
                          borderLeft: 'none',
                          borderRadius: 0,
                          boxShadow: 'none',
                          margin: 0,
                          borderBottom: '1px solid var(--card-border)',
                          padding: '0.5rem 0.75rem',
                        }}
                      >
                        <Link
                          className="terminal-meta-line block transition-colors hover:text-(--accent)"
                          href={item.url}
                          onClick={close}
                          prefetch={false}
                        >
                          <span className="font-medium">{item.title || ''}</span>
                          <span className="meta-from">{categoryStr}</span>
                          {desc ? <span className="meta-desc"> {desc}</span> : null}
                        </Link>
                      </article>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
