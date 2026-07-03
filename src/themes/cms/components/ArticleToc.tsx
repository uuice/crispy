import React from 'react'

import type { LexicalHeading } from '@/ai/lexical/extractLexicalHeadings'

type Props = {
  headings: LexicalHeading[]
}

export function CmsArticleToc({ headings }: Props) {
  if (headings.length === 0) return null

  return (
    <nav aria-label="目录" className="cms-article-toc">
      <div className="cms-article-toc-inner">
        <div className="cms-article-toc-title">目录</div>
        <ul>
          {headings.map((heading) => (
            <li className="cms-article-toc-item" key={heading.slug}>
              <a
                className={heading.depth === 3 ? 'cms-article-toc-depth-3' : undefined}
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
