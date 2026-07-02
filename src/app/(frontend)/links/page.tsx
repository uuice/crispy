import type { Metadata } from 'next'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { queryBlogFriendLinks } from '@/utilities/queryBlogData'

export const revalidate = false

export default async function LinksPage() {
  const links = await queryBlogFriendLinks()

  return (
    <>
      <Banner subtitle="交换链接、友链" title="友情链接" />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{links.length}</strong> 个链接
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="section-title animate-in animate-in-delay-2">友链列表</h2>
        <p className="code-label mb-3">{links.length} 个链接</p>
        <div className="section-card border-0! bg-transparent! overflow-hidden animate-in animate-in-delay-3">
          <ul className="post-list terminal-list">
            {links.map((entry) => (
              <li key={entry.id}>
                <a
                  className="terminal-item block py-2 px-3 transition-colors hover:bg-(--page-bg)"
                  href={entry.url}
                  rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
                  target="_blank"
                >
                  <div className="terminal-meta-line">
                    <span className="font-medium">{entry.title}</span>
                    {entry.description ? (
                      <span className="meta-from"> type=&quot;{entry.description}&quot;</span>
                    ) : null}
                    <span className="meta-desc"> → {entry.url}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export const metadata: Metadata = {
  title: '友情链接',
}
