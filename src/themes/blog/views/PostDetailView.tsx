import Link from 'next/link'
import React from 'react'

import { CommentsSection } from '@/components/Comments'
import { getPostsListPath } from '@/utilities/frontendPaths'

import type { PostDetailPageData } from '../pages/postDetail'
import { ArticleCopyright } from '../components/ArticleCopyright'
import { BlogArticleBody } from '../components/BlogArticleBody'

type Props = {
  data: PostDetailPageData
}

export function PostDetailView({ data }: Props) {
  const { post, dateStr, categories, tags, articleUrl } = data

  return (
    <>
      <p className="mb-4 animate-in animate-in-delay-1">
        <Link
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors hover:bg-(--card-border)"
          href={getPostsListPath()}
          prefetch={false}
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          ← 返回归档
        </Link>
      </p>
      <article className="section-card animate-in animate-in-delay-2">
        <header
          className="px-6 md:px-10 pt-6 pb-5 border-b"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <h1
            className="font-bold mb-2"
            style={{
              color: 'var(--text)',
              fontSize: 'var(--text-xl)',
              fontFamily: 'var(--font-mono)',
              margin: 0,
            }}
          >
            {post.title}
          </h1>
          <p className="doc-detail-meta flex flex-wrap items-center gap-x-4 gap-y-1">
            {dateStr ? (
              <span>
                <span aria-label="日期" className="doc-detail-meta-label">
                  日期：
                </span>
                {dateStr}
              </span>
            ) : null}
            {categories.length ? (
              <span>
                <span aria-label="分类" className="doc-detail-meta-label">
                  分类：
                </span>
                {categories.join(', ')}
              </span>
            ) : null}
            {tags.length ? (
              <span className="flex items-center gap-1.5 flex-wrap">
                <span aria-label="标签" className="doc-detail-meta-label">
                  标签：
                </span>
                {tags.map((t, i) => (
                  <span className={`doc-detail-meta-tag chroma-tag chroma-tag--${i % 6}`} key={t}>
                    {t}
                  </span>
                ))}
              </span>
            ) : null}
          </p>
        </header>
        <BlogArticleBody content={post.content}>
          <ArticleCopyright articleUrl={articleUrl} publishDate={dateStr} />
          <CommentsSection targetId={post.id} targetType="post" />
        </BlogArticleBody>
      </article>
    </>
  )
}
