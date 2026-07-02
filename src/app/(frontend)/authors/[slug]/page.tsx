import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { PostList } from '@/components/BlogSkin/PostList'
import { queryBlogAuthorPage } from '@/utilities/queryBlogData'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function AuthorPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const page = await queryBlogAuthorPage(decodeURIComponent(slug))

  if (!page?.author?.name) notFound()

  return (
    <>
      <Banner title={page.author.name} />
      <article className="section-card p-6 md:p-10 markdown-body animate-in animate-in-delay-2">
        <PostList emptyMessage="该作者暂无文章" posts={page.posts} />
      </article>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const page = await queryBlogAuthorPage(decodeURIComponent(slug))
  if (!page?.author?.name) return { title: '作者不存在' }
  return { title: page.author.name }
}
