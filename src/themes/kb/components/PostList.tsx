import Link from 'next/link'
import React from 'react'

import type { PostListItem } from '../data/types'

function formatDate(pubDate: string) {
  const date = new Date(pubDate)
  if (Number.isNaN(date.getTime())) return pubDate
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

type Props = {
  post: PostListItem
}

export function PostCard({ post }: Props) {
  return (
    <article className="kb-doc-card">
      <div className="kb-doc-card-body">
        <div className="kb-doc-card-meta">
          {post.categories.length > 0 ? (
            <span className="kb-doc-card-badge">{post.categories[0]}</span>
          ) : null}
          {post.pubDate ? (
            <time className="kb-doc-card-date" dateTime={post.pubDate}>
              {formatDate(post.pubDate)}
            </time>
          ) : null}
        </div>
        <h3 className="kb-doc-card-title">
          <Link href={post.url}>{post.title}</Link>
        </h3>
        {post.excerpt ? <p className="kb-doc-card-excerpt">{post.excerpt}</p> : null}
      </div>
    </article>
  )
}

type ListProps = {
  posts: PostListItem[]
  columns?: 1 | 2 | 3
}

export function PostList({ posts, columns = 1 }: ListProps) {
  return (
    <div className={`kb-doc-grid kb-doc-grid--${columns}`}>
      {posts.map((post) => (
        <PostCard key={post.url} post={post} />
      ))}
    </div>
  )
}
