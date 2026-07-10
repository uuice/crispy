import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'

import type { NovelSidebarData } from '../data/novelRoutes'

type Props = {
  data: NovelSidebarData
}

export function NovelSidebar({ data }: Props) {
  const { novelTitle, novelUrl, novelsUrl, chapters, currentChapterSlug } = data

  return (
    <aside className="novel-sidebar space-y-4">
      <div className="section-card p-4 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
        <p className="m-0 mb-3">
          <Link
            className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
            href={novelsUrl}
            prefetch={false}
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            ← 全部小说
          </Link>
        </p>
        <h2 className="section-title m-0">
          <Link className="hover:opacity-80" href={novelUrl} prefetch={false}>
            {novelTitle}
          </Link>
        </h2>
        <p className="code-label m-0 mt-2">共 {chapters.length} 章</p>
        <h3 className="section-title m-0 mt-4 mb-3">{frontendLabels.novels.chapterList}</h3>
        {chapters.length > 0 ? (
          <ol className="novel-chapter-list novel-sidebar-list terminal-list m-0 p-0 list-none">
            {chapters.map((chapter) => {
              const isActive = chapter.slug === currentChapterSlug

              return (
                <li key={chapter.slug}>
                  <Link
                    aria-current={isActive ? 'page' : undefined}
                    className={`novel-chapter-link${isActive ? ' novel-chapter-link--active' : ''}`}
                    href={chapter.url}
                    prefetch={false}
                  >
                    <span className="novel-chapter-index">{chapter.index}</span>
                    <span className="novel-chapter-title">{chapter.title}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="m-0 code-label">{frontendLabels.novels.noChapters}</p>
        )}
      </div>
    </aside>
  )
}
