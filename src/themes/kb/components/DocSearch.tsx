'use client'

import Link from 'next/link'
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

export function DocSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openPanel()
      }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, openPanel])

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
          ...(d.categories || []),
          ...(d.tags || []),
        ]
          .join(' ')
          .toLowerCase()
        return words.every((w) => text.includes(w))
      })
      .slice(0, 12)
  }, [docs, query])

  return (
    <>
      <button
        aria-label="搜索文档"
        className="kb-search-trigger"
        onClick={openPanel}
        type="button"
      >
        <span className="kb-search-trigger-icon" aria-hidden>
          ⌕
        </span>
        <span className="kb-search-trigger-text">搜索文档…</span>
        <kbd className="kb-search-kbd">⌘K</kbd>
      </button>

      {open ? (
        <div className="kb-search-overlay" role="presentation">
          <button
            aria-label="关闭搜索"
            className="kb-search-backdrop"
            onClick={close}
            type="button"
          />
          <div aria-label="搜索文档" className="kb-search-panel" role="dialog">
            <input
              aria-label="搜索关键词"
              className="kb-search-input"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入关键词搜索文档…"
              ref={inputRef}
              type="search"
              value={query}
            />
            <ul className="kb-search-results">
              {matched === undefined ? (
                <li className="kb-search-empty">加载中…</li>
              ) : matched.length === 0 ? (
                <li className="kb-search-empty">未找到匹配文档</li>
              ) : (
                matched.map((doc) => (
                  <li key={doc.id}>
                    <Link className="kb-search-result" href={doc.url} onClick={close} prefetch={false}>
                      <span className="kb-search-result-title">{doc.title}</span>
                      {doc.excerpt ? (
                        <span className="kb-search-result-excerpt">{doc.excerpt}</span>
                      ) : null}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}
