import React from 'react'

import type { Link } from '@/payload-types'

import type { LinksPageData } from '../pages/links'
import { PageHeader } from '../components/PageHeader'

type Props = { data: LinksPageData }

function LinkCard({ entry }: { entry: Link }) {
  const target = entry.openInNewTab === false ? '_self' : '_blank'
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  return (
    <a href={entry.url} rel={rel} target={target}>
      <span className="cms-link-card-title">{entry.title}</span>
      {entry.description ? <span className="cms-link-card-desc">{entry.description}</span> : null}
      <span className="cms-link-card-url">{entry.url}</span>
    </a>
  )
}

export function LinksView({ data }: Props) {
  const { sections, totalCount } = data

  return (
    <>
      <PageHeader
        eyebrow="Links"
        stats={
          <span className="cms-stat-pill">
            {totalCount} 个链接
            {sections.length > 1 ? ` · ${sections.length} 组` : ''}
          </span>
        }
        subtitle="交换链接、合作伙伴与友站"
        title="友情链接"
      />
      <div className="cms-container cms-page-body space-y-10">
        {sections.map((section, index) => (
          <section key={section.id ?? `ungrouped-${index}`}>
            <div className="cms-section-head mb-4">
              <div>
                <h2 className="cms-section-title">{section.title}</h2>
                {section.description ? (
                  <p className="cms-section-desc">{section.description}</p>
                ) : null}
              </div>
              <span className="cms-stat-pill cms-stat-pill--muted">{section.links.length} 链接</span>
            </div>
            <ul className="cms-link-grid">
              {section.links.map((entry) => (
                <li className="cms-link-card" key={entry.id}>
                  <LinkCard entry={entry} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
