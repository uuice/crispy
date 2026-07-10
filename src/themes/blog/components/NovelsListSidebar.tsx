import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'

import type { LatestNovelChapterItem } from '../data/types'

type Props = {
  chapters: LatestNovelChapterItem[]
}

function formatDate(value?: string): string | null {
  if (!value) return null
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function NovelsListSidebar({ chapters }: Props) {
  return (
    <aside className="novel-sidebar space-y-4">
      <div className="section-card p-4 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
        <h2 className="section-title m-0 mb-3">{frontendLabels.novels.latestChapters}</h2>
        {chapters.length > 0 ? (
          <ol className="novel-latest-list m-0 p-0 list-none">
            {chapters.map((chapter) => {
              const dateStr = formatDate(chapter.publishedAt)

              return (
                <li key={chapter.url}>
                  <div className="novel-latest-item">
                    <Link className="novel-latest-title" href={chapter.url} prefetch={false}>
                      {chapter.title}
                    </Link>
                    <p className="novel-latest-meta">
                      <Link className="novel-latest-novel" href={chapter.novelUrl} prefetch={false}>
                        {chapter.novelTitle}
                      </Link>
                      {dateStr ? <time dateTime={chapter.publishedAt}>{dateStr}</time> : null}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="m-0 code-label">{frontendLabels.novels.noLatestChapters}</p>
        )}
      </div>
    </aside>
  )
}
