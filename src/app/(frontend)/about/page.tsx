import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { BlogRenderBlocks } from '@/components/BlogSkin/BlogRenderBlocks'
import { CommentsSection } from '@/components/Comments'
import { queryBlogPageBySlug } from '@/utilities/queryBlogData'

export const revalidate = false

export default async function AboutPage() {
  const page = await queryBlogPageBySlug('about')

  if (!page) redirect('/')

  return (
    <>
      <Banner subtitle={page.meta?.description || undefined} title="关于" />
      <article className="section-card p-6 md:p-10 markdown-body animate-in animate-in-delay-2">
        <BlogRenderBlocks blocks={page.layout || []} />
        <CommentsSection targetId={page.id} targetType="page" />
      </article>
    </>
  )
}

export const metadata: Metadata = {
  title: '关于',
}
