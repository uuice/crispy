import Link from 'next/link'
import React from 'react'

import type { NovelListItem } from '../data/types'
import { Banner } from '../components/Banner'
import { PaginationNav } from '../components/PaginationNav'
import type { PaginationMeta } from '../pagination'

type Props = {
  title: string
  subtitle?: string
  novels: NovelListItem[]
  pagination: PaginationMeta
  basePath: string
  emptyMessage: string
}

export function NovelTaxonomyDetailView({
  title,
  subtitle,
  novels,
  pagination,
  basePath,
  emptyMessage,
}: Props) {
  return (
    <>
      <Banner subtitle={subtitle} title={title} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{pagination.totalDocs}</strong> 部相关小说
        </p>
      </div>
      <section className="space-y-4">
        {novels.length > 0 ? (
          novels.map((novel, index) => (
            <article
              className="section-card section-card-interactive p-5 sm:p-6 animate-in"
              key={novel.slug}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <h2 className="content-title m-0">
                <Link className="hover:opacity-80" href={novel.url} prefetch={false}>
                  {novel.title}
                </Link>
              </h2>
              <p className="code-label flex flex-wrap gap-x-3 gap-y-1 mt-2 mb-3">
                {novel.genre ? <span>题材：{novel.genre}</span> : null}
                <span>章节：{novel.chapterCount}</span>
              </p>
              {novel.synopsis ? (
                <p className="m-0 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {novel.synopsis}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <div className="section-card p-8 text-center animate-in animate-in-delay-2">
            <p className="m-0 code-label">{emptyMessage}</p>
          </div>
        )}
      </section>
      <PaginationNav basePath={basePath} pagination={pagination} />
    </>
  )
}
