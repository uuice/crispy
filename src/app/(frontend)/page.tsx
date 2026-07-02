import type { Metadata } from 'next'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { PostList } from '@/components/BlogSkin/PostList'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { queryPosts } from '@/utilities/queryFrontendData'

export const revalidate = false

export default async function HomePage() {
  const [settings, posts] = await Promise.all([getCachedSiteSettings()(), queryPosts()])

  const siteName = settings.siteName || '博客'

  return (
    <>
      <Banner subtitle={settings.siteDescription || undefined} title={siteName} />
      <div className="intro-bubble intro-bubble-cute animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{posts.length}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="section-title animate-in animate-in-delay-2">最新文章</h2>
        <PostList posts={posts} />
      </section>
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()()
  return {
    title: settings.siteName || '博客',
    description: settings.siteDescription || undefined,
  }
}
