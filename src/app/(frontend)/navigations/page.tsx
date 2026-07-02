import type { Metadata } from 'next'
import React from 'react'

import navigationData from '@/data/navigationWebsiteData.json'
import { Banner } from '@/components/BlogSkin/Banner'

export const revalidate = false

type NavSite = {
  id: string
  title: string
  description?: string
  url: string
}

type NavCategory = {
  id: string
  name: string
  description?: string
  websites: NavSite[]
}

const navCategories = (navigationData as { categories: NavCategory[] }).categories
const totalSites = navCategories.reduce((sum, c) => sum + c.websites.length, 0)

export default function NavigationsPage() {
  return (
    <>
      <Banner subtitle="精选前端文档与工具导航" title="类库导航" />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{totalSites}</strong> 个站点
        </p>
      </div>
      <section className="space-y-8">
        <h2 className="section-title animate-in animate-in-delay-2">按分类浏览</h2>
        <p className="code-label mb-6">点击站点将在新窗口打开</p>
        {navCategories.map((cat, i) => (
          <div
            className="section-card p-5 sm:p-6 animate-in nav-category-group"
            id={`nav-${cat.id}`}
            key={cat.id}
            style={{ animationDelay: `${0.1 + i * 0.05}s` }}
          >
            <h2 className="section-title">{cat.name}</h2>
            {cat.description ? <p className="code-label mb-1">{cat.description}</p> : null}
            <p className="code-label mb-3">{cat.websites.length} 个站点</p>
            <ul className="post-list terminal-list">
              {cat.websites.map((site) => (
                <li key={site.id}>
                  <a
                    className="terminal-item block transition-colors hover:text-(--accent)"
                    href={site.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="post-card-link">
                      <span className="post-card-link-title">{site.title}</span>
                      {site.description ? <span className="meta-desc"> · {site.description}</span> : null}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}

export const metadata: Metadata = {
  title: '类库导航',
}
