import Link from 'next/link'
import React from 'react'

import { getPostsListPath } from '@/utilities/frontendPaths'

import { PageHeader } from '../components/PageHeader'
import { PostList } from '../components/PostList'
import type { HomePageData } from '../pages/home'

type Props = { data: HomePageData }

export function HomeView({ data }: Props) {
  const { siteName, siteDescription, posts, categories } = data
  const recent = posts.slice(0, 8)
  const topCategories = categories.slice(0, 6)

  return (
    <>
      <PageHeader
        eyebrow="Knowledge Base"
        stats={<span className="kb-stat-pill">{posts.length} 篇文档</span>}
        subtitle={siteDescription || '产品文档、使用指南与常见问题'}
        title={siteName}
      />

      <div className="kb-page-body">
        {topCategories.length > 0 ? (
          <section className="kb-section">
            <div className="kb-section-head">
              <h2 className="kb-section-title">浏览分类</h2>
            </div>
            <div className="kb-category-grid">
              {topCategories.map((item) => (
                <Link className="kb-category-card" href={item.url} key={item.id} prefetch={false}>
                  <span className="kb-category-card-title">{item.title}</span>
                  <span className="kb-category-card-count">{item.count} 篇</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="kb-section">
          <div className="kb-section-head">
            <h2 className="kb-section-title">最近更新</h2>
            <Link className="kb-section-more" href={getPostsListPath()} prefetch={false}>
              查看全部 →
            </Link>
          </div>
          {recent.length > 0 ? (
            <PostList columns={1} posts={recent} />
          ) : (
            <p className="kb-empty">暂无文档</p>
          )}
        </section>
      </div>
    </>
  )
}
