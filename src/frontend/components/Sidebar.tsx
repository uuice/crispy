import Link from 'next/link'
import React from 'react'

import holidayData from '../data/holiday.json'
import type { SidebarAuthor, SidebarCategory, SidebarTag } from '../data/types'

import { SidebarCountdown } from './SidebarCountdown'

type Props = {
  categories: SidebarCategory[]
  tags: SidebarTag[]
  authors: SidebarAuthor[]
}

export function Sidebar({ categories, tags, authors }: Props) {
  return (
    <aside className="space-y-6">
      {categories.length > 0 && (
        <div className="section-card p-4 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <h3 className="section-title">分类</h3>
          <ul className="terminal-list-sidebar">
            {categories.map((c, i) => (
              <li key={c.id}>
                <Link href={c.url} prefetch={false}>
                  <span>{c.title}</span>
                  <span className={`sidebar-category-count chroma-tag--${i % 6}`}>{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div className="section-card p-4 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <h3 className="section-title">标签</h3>
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => (
              <li key={t.id}>
                <Link
                  className={`sidebar-tag-pill inline-flex items-center gap-1 px-2 py-1 rounded font-medium chroma-tag chroma-tag--${i % 6}`}
                  href={t.url}
                  prefetch={false}
                  style={{
                    background: 'transparent',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {t.title}
                  <span className="opacity-70">({t.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {authors.length > 0 && (
        <div className="section-card p-4 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <h3 className="section-title">作者</h3>
          <ul className="terminal-list-sidebar">
            {authors.map((author, i) => (
              <li key={author.id}>
                <Link href={author.url} prefetch={false}>
                  <span>{author.title}</span>
                  <span className={`sidebar-category-count chroma-tag--${i % 6}`}>{author.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <SidebarCountdown holidays={holidayData.holidays} />
    </aside>
  )
}
