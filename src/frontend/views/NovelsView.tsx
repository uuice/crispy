import Link from 'next/link'
import React from 'react'

import type { NovelsPageData } from '../pages/novels'
import { Banner } from '../components/Banner'
import { frontendLabels } from '@/i18n/frontend-labels'

type Props = {
  data: NovelsPageData
}

export function NovelsView({ data }: Props) {
  const { novels } = data

  return (
    <>
      <Banner subtitle={frontendLabels.novels.description} title={frontendLabels.novels.title} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{novels.length}</strong> 部长篇
          {' · '}
          <a
            className="hover:opacity-80"
            href="/novels/rss"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)' }}
            target="_blank"
          >
            {frontendLabels.novels.rss}
          </a>
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
              <p className="mt-4 mb-0">
                <Link
                  className="inline-flex items-center gap-1 font-medium text-sm transition-colors hover:opacity-80"
                  href={novel.url}
                  prefetch={false}
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                >
                  查看介绍 →
                </Link>
              </p>
            </article>
          ))
        ) : (
          <div className="section-card p-8 text-center animate-in animate-in-delay-2">
            <p className="m-0 code-label">{frontendLabels.novels.none}</p>
          </div>
        )}
      </section>
    </>
  )
}
