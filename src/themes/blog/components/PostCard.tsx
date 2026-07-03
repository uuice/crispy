import Link from 'next/link'
import React from 'react'

import type { PostListItem } from '../data/types'

type Props = PostListItem

export function PostCard({ title, url, excerpt = '', pubDate, categories = [], tags = [] }: Props) {
  const dateStr = new Date(pubDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <article className="post-card-cute section-card group" style={{ borderRadius: 'var(--radius)' }}>
      <Link
        className="post-card-link block px-4 py-3 transition-colors hover:text-(--accent)"
        href={url}
      >
        <p className="post-card-title-line m-0 mt-1 font-mono text-sm">{title}</p>
        <p className="post-card-meta-line m-0 mt-0.5 font-mono text-xs">
          发布于 {dateStr}
          {categories.length ? (
            <>
              <span className="post-card-sep">·</span>分类：{categories.join(', ')}
            </>
          ) : null}
          {tags.length ? (
            <>
              <span className="post-card-sep">·</span>
              <span>标签：</span>{' '}
              {tags.map((tag, i) => (
                <span className={`chroma-tag chroma-tag--${i % 6}`} key={tag}>
                  {tag}
                </span>
              ))}
            </>
          ) : null}
        </p>
        {excerpt ? <p className="post-card-excerpt-line m-0 mt-1 font-mono text-xs">{excerpt}</p> : null}
      </Link>
    </article>
  )
}
