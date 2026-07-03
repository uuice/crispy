import React from 'react'

import type { LexicalHeading } from '@/ai/lexical/extractLexicalHeadings'

type Props = {
  headings: LexicalHeading[]
}

export function KbArticleToc({ headings }: Props) {
  if (headings.length === 0) return null

  return (
    <nav aria-label="目录" className="kb-article-toc">
      <div className="kb-article-toc-inner">
        <div className="kb-article-toc-title">本页目录</div>
        <ul>
          {headings.map((heading) => (
            <li className="kb-article-toc-item" key={heading.slug}>
              <a
                className={heading.depth === 3 ? 'kb-article-toc-depth-3' : undefined}
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
