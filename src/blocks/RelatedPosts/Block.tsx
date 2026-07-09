import type { RelatedPostsBlock as RelatedPostsBlockProps } from '@/payload-types'
import React from 'react'

import { RelatedPosts } from './Component'

type Props = RelatedPostsBlockProps & {
  className?: string
}

export const RelatedPostsBlock: React.FC<Props> = (props) => {
  const { className, docs, introContent } = props

  const populatedDocs = (docs || []).filter(
    (doc): doc is Exclude<typeof doc, number> => typeof doc === 'object' && doc !== null,
  )

  return (
    <RelatedPosts
      className={className}
      docs={populatedDocs}
      introContent={introContent || undefined}
    />
  )
}
