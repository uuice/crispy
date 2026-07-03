import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'

import { extractLexicalHeadings } from '@/ai/lexical/extractLexicalHeadings'

import { CmsArticleToc } from './ArticleToc'
import { CmsRichText } from './RichText'

type Props = {
  content: DefaultTypedEditorState
  children?: React.ReactNode
}

export function CmsArticleBody({ content, children }: Props) {
  const tocHeadings = extractLexicalHeadings(content).filter(
    (heading) => heading.depth >= 2 && heading.depth <= 3,
  )

  return (
    <div className="cms-detail-body-wrap">
      <CmsArticleToc headings={tocHeadings} />
      <div className="cms-detail-body markdown-body">
        <CmsRichText data={content} enableGutter={false} headings={tocHeadings} />
        {children}
      </div>
    </div>
  )
}
