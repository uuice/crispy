import React from 'react'

import type { LinksPageData } from '../pages/links'
import { PageHeader } from '../components/PageHeader'

type Props = { data: LinksPageData }

export function LinksView({ data }: Props) {
  const { links } = data

  return (
    <>
      <PageHeader
        eyebrow="Links"
        stats={<span className="cms-stat-pill">{links.length} 个链接</span>}
        subtitle="交换链接、合作伙伴与友站"
        title="友情链接"
      />
      <div className="cms-container cms-page-body">
        <ul className="cms-link-grid">
          {links.map((entry) => (
            <li className="cms-link-card" key={entry.id}>
              <a href={entry.url} rel="noopener noreferrer" target="_blank">
                <span className="cms-link-card-title">{entry.title}</span>
                {entry.description ? (
                  <span className="cms-link-card-desc">{entry.description}</span>
                ) : null}
                <span className="cms-link-card-url">{entry.url}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
