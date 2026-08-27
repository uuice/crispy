import React from 'react'

import type { Link } from '@/payload-types'

import type { LinksPageData } from '../pages/links'
import { Banner } from '../components/Banner'

type Props = {
  data: LinksPageData
}

function LinkTarget({ entry }: { entry: Link }) {
  const target = entry.openInNewTab === false ? '_self' : '_blank'
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  return (
    <a
      className="terminal-item friend-link-item block py-3 px-3 transition-colors hover:bg-(--page-bg)"
      href={entry.url}
      rel={rel}
      style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
      target={target}
    >
      <span className="friend-link-item-title">{entry.title}</span>
      {entry.description ? (
        <span className="friend-link-item-desc">{entry.description}</span>
      ) : null}
      <span className="friend-link-item-url">{entry.url}</span>
    </a>
  )
}

export function LinksView({ data }: Props) {
  const { sections, totalCount } = data

  return (
    <>
      <Banner subtitle="交换链接、友链" title="友情链接" />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{totalCount}</strong> 个链接
          {sections.length > 1 ? (
            <>
              {' '}
              · <strong>{sections.length}</strong> 个分组
            </>
          ) : null}
        </p>
      </div>
      <div className="space-y-8">
        {sections.map((section, index) => (
          <section className="space-y-5" key={section.id ?? `ungrouped-${index}`}>
            <div className="animate-in" style={{ animationDelay: `${0.15 + index * 0.05}s` }}>
              <h2 className="section-title mb-1">{section.title}</h2>
              {section.description ? (
                <p className="code-label m-0">{section.description}</p>
              ) : null}
            </div>
            <div className="section-card border-0! bg-transparent! animate-in animate-in-delay-3">
              <ul className="post-list terminal-list m-0">
                {section.links.map((entry) => (
                  <li key={entry.id}>
                    <LinkTarget entry={entry} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
