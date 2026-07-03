import React from 'react'

import { PageHeader } from '../components/PageHeader'
import type { NavigationsPageData } from '../pages/navigations'

type Props = { data: NavigationsPageData }

export function NavigationsView({ data }: Props) {
  const { categories, totalSites } = data

  return (
    <>
      <PageHeader
        eyebrow="Directory"
        stats={<span className="cms-stat-pill">{totalSites} 个站点</span>}
        subtitle="精选前端文档与工具导航"
        title="类库导航"
      />
      <div className="cms-container cms-page-body">
        {categories.map((cat) => (
          <section className="cms-nav-category" id={`nav-${cat.id}`} key={cat.id}>
            <div className="cms-section-head">
              <div>
                <h2 className="cms-section-title">{cat.name}</h2>
                {cat.description ? <p className="cms-section-desc">{cat.description}</p> : null}
              </div>
              <span className="cms-stat-pill cms-stat-pill--muted">{cat.websites.length} 站点</span>
            </div>
            <ul className="cms-link-grid">
              {cat.websites.map((site) => (
                <li className="cms-link-card" key={site.id}>
                  <a href={site.url} rel="noopener noreferrer" target="_blank">
                    <span className="cms-link-card-title">{site.title}</span>
                    {site.description ? (
                      <span className="cms-link-card-desc">{site.description}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
