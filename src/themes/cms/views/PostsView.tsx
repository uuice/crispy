import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'

import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostList'
import type { PostsPageData } from '../pages/posts'

type Props = { data: PostsPageData }

export function PostsView({ data }: Props) {
  const { posts, groups } = data

  return (
    <>
      <PageHeader
        eyebrow="Archive"
        stats={<span className="cms-stat-pill">{posts.length} 篇内容</span>}
        subtitle={frontendLabels.posts.description}
        title={frontendLabels.posts.title}
      />

      <div className="cms-container cms-page-body">
        {groups.map(([ym, list]) => (
          <section className="cms-timeline-group" key={ym}>
            <div className="cms-timeline-marker">
              <span className="cms-timeline-date">{ym}</span>
              <span className="cms-timeline-count">{list.length} 篇</span>
            </div>
            <div className="cms-card-grid cms-card-grid--1">
              {list.map((entry) => (
                <PostCard key={entry.url} post={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
