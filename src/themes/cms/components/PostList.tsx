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
  featured?: boolean
}

export function PostCard({ post, featured = false }: Props) {
  return (
    <article className={`cms-card ${featured ? 'cms-card--featured' : ''}`}>
      <div className="cms-card-accent" aria-hidden="true" />
      <div className="cms-card-body">
        <div className="cms-card-meta-row">
          {post.pubDate ? (
            <time className="cms-card-date" dateTime={post.pubDate}>
              {formatDate(post.pubDate)}
            </time>
          ) : null}
          {post.categories.length > 0 ? (
            <span className="cms-card-badge">{post.categories[0]}</span>
          ) : null}
        </div>
        <h3 className="cms-card-title">
          <Link href={post.url}>{post.title}</Link>
        </h3>
        {post.excerpt ? <p className="cms-card-excerpt">{post.excerpt}</p> : null}
        <Link className="cms-card-link" href={post.url}>
          阅读全文 →
        </Link>
      </div>
    </article>
  )
}

type ListProps = {
  posts: PostListItem[]
  columns?: 2 | 3
  featuredFirst?: boolean
}

export function PostList({ posts, columns = 2, featuredFirst = false }: ListProps) {
  return (
    <div className={`cms-card-grid cms-card-grid--${columns}`}>
      {posts.map((post, index) => (
        <PostCard featured={featuredFirst && index === 0} key={post.url} post={post} />
      ))}
    </div>
  )
}
