import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'

import type { PostsPageData } from '../pages/posts'
import { Banner } from '../components/Banner'
import { PostCard } from '../components/PostCard'

type Props = {
  data: PostsPageData
}

export function PostsView({ data }: Props) {
  const { posts, groups } = data

  return (
    <>
      <Banner subtitle={frontendLabels.posts.description} title={frontendLabels.posts.title} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{posts.length}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-8">
        {groups.map(([ym, list], i) => (
          <div
            className="section-card p-5 sm:p-6 animate-in archive-group"
            key={ym}
            style={{ animationDelay: `${0.1 + i * 0.05}s` }}
          >
            <h2 className="section-title">{ym}</h2>
            <p className="code-label mb-3">{list.length} 篇文章</p>
            <ul className="post-list terminal-list">
              {list.map((entry) => (
                <li key={entry.url}>
                  <PostCard {...entry} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}
