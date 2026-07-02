import Link from 'next/link'
import React from 'react'

import holidayData from '@/data/holiday.json'
import type { BlogSidebarAuthor, BlogSidebarCategory, BlogSidebarTag } from '@/utilities/queryBlogData'

import { SidebarCountdown } from './SidebarCountdown'

type Props = {
  categories: BlogSidebarCategory[]
  tags: BlogSidebarTag[]
  author?: BlogSidebarAuthor
}

export function Sidebar({ categories, tags, author }: Props) {
  return (
    <aside className="space-y-6">
      <SidebarCountdown holidays={holidayData.holidays} />
      {categories.length > 0 && (
        <div className="section-card p-4 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <h3 className="section-title">分类</h3>
          <ul className="terminal-list-sidebar">
            {categories.map((c, i) => (
              <li key={c.id}>
                <Link href={c.url}>
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

      {author && (
        <div className="section-card p-4 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <h3 className="section-title">作者</h3>
          <p className="font-medium mt-1" style={{ color: 'var(--text)', fontSize: 'var(--text-sm)' }}>
            {author.title}
          </p>
          {author.excerpt ? (
            <p className="mt-1 line-clamp-2" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              {author.excerpt}
            </p>
          ) : null}
          <Link
            className="mt-3 inline-flex items-center gap-1 font-medium rounded px-2 py-1 text-sm transition-colors hover:bg-(--card-border)"
            href={author.url}
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            查看详情 →
          </Link>
        </div>
      )}
    </aside>
  )
}
