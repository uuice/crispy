import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'

import type { NovelChapterPageData } from '../pages/novelChapter'
import { BlogArticleBody } from '../components/BlogArticleBody'

type Props = {
  data: NovelChapterPageData
}

export function NovelChapterView({ data }: Props) {
  const { novelTitle, novelUrl, novelsUrl, chapter, chapters, chapterIndex, prev, next, dateStr } = data

  return (
    <>
      <nav aria-label="小说章节导航" className="mb-4 animate-in animate-in-delay-1">
        <p className="m-0 flex flex-wrap items-center gap-2 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
          <Link className="hover:opacity-80" href={novelsUrl} prefetch={false} style={{ color: 'var(--accent)' }}>
            小说
          </Link>
          <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>
            /
          </span>
          <Link className="hover:opacity-80" href={novelUrl} prefetch={false} style={{ color: 'var(--accent)' }}>
            {novelTitle}
          </Link>
          <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>
            /
          </span>
          <span style={{ color: 'var(--text-muted)' }}>第 {chapterIndex} 章</span>
        </p>
      </nav>

      <article className="section-card animate-in animate-in-delay-2">
        <header
          className="px-6 md:px-10 pt-6 pb-5 border-b"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <p className="code-label m-0 mb-2">
            第 {chapterIndex} 章 / 共 {chapters.length} 章
          </p>
          <h1
            className="font-bold mb-2"
            style={{
              color: 'var(--text)',
              fontSize: 'var(--text-xl)',
              fontFamily: 'var(--font-mono)',
              margin: 0,
            }}
          >
            {chapter.title}
          </h1>
          {dateStr ? (
            <p className="doc-detail-meta m-0">
              <span className="doc-detail-meta-label">更新：</span>
              <time dateTime={chapter.publishedAt || undefined}>{dateStr}</time>
            </p>
          ) : null}
        </header>

        {chapter.content ? (
          <BlogArticleBody content={chapter.content} />
        ) : (
          <div className="p-6 md:p-10">
            <p className="m-0 code-label">{frontendLabels.novels.emptyChapter}</p>
          </div>
        )}

        <footer
          className="novel-chapter-nav px-6 md:px-10 py-5 border-t flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: 'var(--card-border)' }}
        >
          {prev ? (
            <Link
              className="blog-pagination-link"
              href={prev.url}
              prefetch={false}
              rel="prev"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span className="blog-pagination-link blog-pagination-link--disabled">← 上一章</span>
          )}
          <Link
            className="blog-pagination-link"
            href={novelUrl}
            prefetch={false}
            style={{ color: 'var(--accent)' }}
          >
            目录
          </Link>
          {next ? (
            <Link
              className="blog-pagination-link"
              href={next.url}
              prefetch={false}
              rel="next"
            >
              {next.title} →
            </Link>
          ) : (
            <span className="blog-pagination-link blog-pagination-link--disabled">下一章 →</span>
          )}
        </footer>
      </article>
    </>
  )
}
