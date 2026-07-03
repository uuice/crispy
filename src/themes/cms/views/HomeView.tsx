import Link from 'next/link'
import React from 'react'

import { getPostsListPath } from '@/utilities/frontendPaths'

import { PageHeader } from '../components/PageHeader'
import { PostList } from '../components/PostList'
import type { HomePageData } from '../pages/home'

type Props = { data: HomePageData }

export function HomeView({ data }: Props) {
  const { siteName, siteDescription, posts } = data
  const recent = posts.slice(0, 6)

  return (
    <>
      <PageHeader
        stats={
          <>
            <span className="cms-stat-pill">{posts.length} 篇内容</span>
            <Link className="cms-hero-cta" href={getPostsListPath()}>
              浏览全部
            </Link>
          </>
        }
        subtitle={siteDescription || '以结构化内容驱动品牌表达与业务增长'}
        title={siteName}
      />

      <div className="cms-container cms-page-body">
        <section className="cms-section">
          <div className="cms-section-head">
            <div>
              <p className="cms-eyebrow cms-eyebrow--dark">Latest</p>
              <h2 className="cms-section-title">最新发布</h2>
            </div>
            <Link className="cms-section-more" href={getPostsListPath()}>
              查看归档 →
            </Link>
          </div>
          {recent.length > 0 ? (
            <PostList columns={3} featuredFirst posts={recent} />
          ) : (
            <p className="cms-empty">暂无内容</p>
          )}
        </section>
      </div>
    </>
  )
}
