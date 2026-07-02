import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { PostList } from '@/components/BlogSkin/PostList'
import { queryUserPage } from '@/utilities/queryFrontendData'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function UserPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const page = await queryUserPage(decodeURIComponent(slug))

  if (!page?.user?.name) notFound()

  return (
    <>
      <Banner title={page.user.name} />
      <article className="section-card p-6 md:p-10 markdown-body animate-in animate-in-delay-2">
        <PostList emptyMessage="该用户暂无文章" posts={page.posts} />
      </article>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const page = await queryUserPage(decodeURIComponent(slug))
  if (!page?.user?.name) return { title: '用户不存在' }
  return { title: page.user.name }
}
