import React from 'react'

import type { LexicalHeading } from '@/ai/lexical/extractLexicalHeadings'

type Props = {
  headings: LexicalHeading[]
}

export function BlogArticleToc({ headings }: Props) {
  if (headings.length === 0) return null

  return (
    <nav aria-label="目录" className="lg:w-48 shrink-0 order-2 lg:order-1 animate-in animate-in-delay-2">
      <div className="doc-detail-toc doc-detail-toc-animated sticky top-24">
        <div className="doc-detail-toc-title">目录</div>
        <ul>
          {headings.map((heading, index) => (
            <li
              className="doc-detail-toc-item"
              key={heading.slug}
              style={{ animationDelay: `${0.08 + index * 0.04}s` }}
            >
              <a
                className={heading.depth === 3 ? 'toc-depth-3' : undefined}
                href={`#${heading.slug}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
