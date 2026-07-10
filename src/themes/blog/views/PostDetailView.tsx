import Link from 'next/link'
import React from 'react'

import { CommentsSection } from '@/components/Comments'
import { getCategoryPath, getPostsListPath, getTagPath } from '@/utilities/frontendPaths'

import type { PostDetailPageData } from '../pages/postDetail'
import { ArticleCopyright } from '../components/ArticleCopyright'
import { BlogArticleBody } from '../components/BlogArticleBody'
import { JsonLd } from '../components/JsonLd'
import { buildArticleJsonLd, getPostOgImageUrl } from '../seo'

type Props = {
  data: PostDetailPageData
}

export function PostDetailView({ data }: Props) {
  const { post, dateStr, categories, tags, articleUrl, authorName } = data
  const jsonLd = buildArticleJsonLd({
    title: post.title,
    description: post.meta?.description || undefined,
    path: articleUrl,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    imageUrl: getPostOgImageUrl(post),
    authorName,
  })

  return (
    <>
      <JsonLd data={jsonLd} />
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
                <span className="doc-detail-meta-label">日期：</span>
                <time dateTime={post.publishedAt || undefined}>{dateStr}</time>
              </span>
            ) : null}
            {categories.length ? (
              <span className="flex items-center gap-1.5 flex-wrap">
                <span className="doc-detail-meta-label">分类：</span>
                {categories.map((category, index) => (
                  <React.Fragment key={category.slug}>
                    {index > 0 ? <span aria-hidden="true">,</span> : null}
                    <Link
                      className="hover:opacity-80"
                      href={getCategoryPath(category.slug)}
                      prefetch={false}
                      style={{ color: 'var(--accent)' }}
                    >
                      {category.title}
                    </Link>
                  </React.Fragment>
                ))}
              </span>
            ) : null}
            {tags.length ? (
              <span className="flex items-center gap-1.5 flex-wrap">
                <span className="doc-detail-meta-label">标签：</span>
                {tags.map((tag, index) => (
                  <Link
                    className={`doc-detail-meta-tag chroma-tag chroma-tag--${index % 6} hover:opacity-80`}
                    href={getTagPath(tag.slug)}
                    key={tag.slug}
                    prefetch={false}
                  >
                    {tag.title}
                  </Link>
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
