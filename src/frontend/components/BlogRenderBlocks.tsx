import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { FaqBlock } from '@/blocks/FaqBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { RelatedPostsBlock } from '@/blocks/RelatedPosts/Block'
import { CMSLink } from '@/components/Link'

import { BlogRichText } from './BlogRichText'

const blockComponents = {
  archive: ArchiveBlock,
  cta: CallToActionBlock,
  faq: FaqBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  relatedPosts: RelatedPostsBlock,
}

export function BlogRenderBlocks({ blocks }: { blocks: Page['layout'][0][] }) {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        if (block.blockType === 'content') {
          return block.columns?.map((col, colIndex) => (
            <Fragment key={`${index}-${colIndex}`}>
              {col.richText ? <BlogRichText data={col.richText} enableGutter={false} /> : null}
              {col.enableLink && col.link ? <CMSLink {...col.link} /> : null}
            </Fragment>
          ))
        }

        const { blockType } = block
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]
          if (Block) {
            return (
              <div key={index}>
                {/* @ts-expect-error block props vary by type */}
                <Block {...block} disableInnerContainer />
              </div>
            )
          }
        }

        return null
      })}
    </Fragment>
  )
}
