import React from 'react'

import type { HomePageData } from '../pages/home'
import { Banner } from '../components/Banner'
import { PostList } from '../components/PostList'

type Props = {
  data: HomePageData
}

export function HomeView({ data }: Props) {
  const { siteName, siteDescription, posts } = data

  return (
    <>
      <Banner subtitle={siteDescription} title={siteName} />
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
