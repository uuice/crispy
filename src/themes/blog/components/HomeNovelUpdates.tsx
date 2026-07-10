import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getNovelsPath } from '@/utilities/frontendPaths'

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

export function HomeNovelUpdates({ chapters }: Props) {
  if (chapters.length === 0) return null

  return (
    <section className="space-y-5 mt-10 pt-8 border-t animate-in animate-in-delay-3" style={{ borderColor: 'var(--card-border)' }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="section-title m-0">{frontendLabels.novels.homeUpdates}</h2>
        <Link
          className="text-sm hover:opacity-80"
          href={getNovelsPath()}
          prefetch={false}
          style={{ color: 'var(--accent)' }}
        >
          {frontendLabels.novels.viewAll} →
        </Link>
      </div>
      <div className="section-card p-5 sm:p-6" style={{ borderRadius: 'var(--radius)' }}>
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
      </div>
    </section>
  )
}
