import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'

import { extractLexicalHeadings } from '@/ai/lexical/extractLexicalHeadings'

import { KbArticleToc } from './ArticleToc'
import { KbRichText } from './RichText'

type Props = {
  content: DefaultTypedEditorState
  children?: React.ReactNode
}

export function KbArticleBody({ content, children }: Props) {
  const tocHeadings = extractLexicalHeadings(content).filter(
    (heading) => heading.depth >= 2 && heading.depth <= 3,
  )

  return (
    <div className="kb-detail-body-wrap">
      <div className="kb-detail-body markdown-body">
        <KbRichText data={content} enableGutter={false} headings={tocHeadings} />
        {children}
      </div>
      <KbArticleToc headings={tocHeadings} />
    </div>
  )
}
