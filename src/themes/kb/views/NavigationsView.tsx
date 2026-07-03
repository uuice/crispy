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
        stats={<span className="kb-stat-pill">{totalSites} 个站点</span>}
        subtitle="精选前端文档与工具导航"
        title="类库导航"
      />
      <div className="kb-container kb-page-body">
        {categories.map((cat) => (
          <section className="kb-nav-category" id={`nav-${cat.id}`} key={cat.id}>
            <div className="kb-section-head">
              <div>
                <h2 className="kb-section-title">{cat.name}</h2>
                {cat.description ? <p className="kb-section-desc">{cat.description}</p> : null}
              </div>
              <span className="kb-stat-pill kb-stat-pill--muted">{cat.websites.length} 站点</span>
            </div>
            <ul className="kb-link-grid">
              {cat.websites.map((site) => (
                <li className="kb-link-card" key={site.id}>
                  <a href={site.url} rel="noopener noreferrer" target="_blank">
                    <span className="kb-link-card-title">{site.title}</span>
                    {site.description ? (
                      <span className="kb-link-card-desc">{site.description}</span>
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
