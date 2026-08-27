import React from 'react'

import type { HomePageData } from '../pages/home'
import { Banner } from '../components/Banner'
import { HomeNovelUpdates } from '../components/HomeNovelUpdates'
import { PostList } from '../components/PostList'

type Props = {
  data: HomePageData
}

export function HomeView({ data }: Props) {
  const { siteName, siteDescription, posts, totalPosts, latestNovelChapters } = data

  return (
    <>
      <Banner subtitle={siteDescription} title={siteName} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{totalPosts}</strong> 篇博客文章
          {totalPosts > posts.length ? (
            <>
              ，首页展示最近 <strong>{posts.length}</strong> 篇
            </>
          ) : null}
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="section-title animate-in animate-in-delay-2">最新文章</h2>
        <PostList posts={posts} />
      </section>
      <HomeNovelUpdates chapters={latestNovelChapters} />
    </>
  )
}
