import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { PostList } from '@/components/BlogSkin/PostList'
import { queryBlogPostsByTagSlug } from '@/utilities/queryBlogData'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function TagPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const { tag, posts } = await queryBlogPostsByTagSlug(decodeURIComponent(slug))

  if (!tag) notFound()

  return (
    <>
      <Banner subtitle={posts.length ? `共 ${posts.length} 篇` : undefined} title={`标签: ${tag.title}`} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{posts.length}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="section-title animate-in animate-in-delay-2">{tag.title}</h2>
        <PostList emptyMessage="该标签下暂无文章" posts={posts} />
      </section>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const { tag } = await queryBlogPostsByTagSlug(decodeURIComponent(slug))
  if (!tag) return { title: '标签不存在' }
  return { title: `标签: ${tag.title}` }
}

export async function generateStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return tags.docs.map(({ slug }) => ({ slug }))
}
