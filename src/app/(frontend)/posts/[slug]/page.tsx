import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ArticleCopyright } from '@/components/BlogSkin/ArticleCopyright'
import { BlogArticleBody } from '@/components/BlogSkin/BlogArticleBody'
import { CommentsSection } from '@/components/Comments'
import { getPostPath, getPostsListPath } from '@/utilities/frontendPaths'
import { queryPostBySlug } from '@/utilities/queryFrontendData'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug(decodedSlug)

  if (!post) notFound()

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  const categories = (post.categories || [])
    .map((c) => (typeof c === 'object' && c?.title ? c.title : null))
    .filter(Boolean) as string[]

  const tags = (post.tags || [])
    .map((t) => (typeof t === 'object' && t?.title ? t.title : null))
    .filter(Boolean) as string[]

  const articleUrl = getPostPath(decodedSlug)

  return (
    <>
      <p className="mb-4 animate-in animate-in-delay-1">
        <Link
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors hover:bg-(--card-border)"
          href={getPostsListPath()}
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          ← 返回文章列表
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const post = await queryPostBySlug(decodeURIComponent(slug))
  if (!post) return { title: '文章不存在' }
  return {
    title: post.title,
    description: post.meta?.description || undefined,
  }
}

export async function generateStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}
