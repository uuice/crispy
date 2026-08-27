import React from 'react'

import type { PostsPageData } from '../pages/posts'
import { Banner } from '../components/Banner'
import { PaginationNav } from '../components/PaginationNav'
import { PostCard } from '../components/PostCard'
import { getPostsListPath } from '@/utilities/frontendPaths'

type Props = {
  data: PostsPageData
}

export function PostsView({ data }: Props) {
  const { groups, pagination } = data

  return (
    <>
      <Banner subtitle="按时间查看文章" title="归档" />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{pagination.totalDocs}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-8">
        {groups.length === 0 ? (
          <div className="section-card p-8 text-center animate-in animate-in-delay-3">
            <p className="m-0 code-label">暂时还没有文章</p>
          </div>
        ) : (
          groups.map(([ym, list], i) => (
            <div
              className="section-card p-5 sm:p-6 animate-in archive-group"
              key={ym}
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <h2 className="content-title">{ym}</h2>
              <p className="code-label mb-3">{list.length} 篇文章</p>
              <ul className="post-list terminal-list">
                {list.map((entry) => (
                  <li key={entry.url}>
                    <PostCard {...entry} />
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
      <PaginationNav basePath={getPostsListPath()} pagination={pagination} />
    </>
  )
}
