import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'

import { extractLexicalHeadings } from '@/ai/lexical/extractLexicalHeadings'

import { BlogArticleToc } from './BlogArticleToc'
import { BlogRichText } from './BlogRichText'

type Props = {
  content: DefaultTypedEditorState
  children?: React.ReactNode
}

export function BlogArticleBody({ content, children }: Props) {
  const tocHeadings = extractLexicalHeadings(content).filter(
    (heading) => heading.depth >= 2 && heading.depth <= 3,
  )

  return (
    <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8">
      <BlogArticleToc headings={tocHeadings} />
      <div
        className="flex-1 min-w-0 order-1 lg:order-2 doc-detail-body prose max-w-none prose-headings:font-semibold prose-img:rounded-xl markdown-body"
        style={{ fontSize: 'var(--text-sm)' }}
      >
        <BlogRichText data={content} enableGutter={false} headings={tocHeadings} />
        {children}
      </div>
    </div>
  )
}
