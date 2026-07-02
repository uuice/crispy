import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { LexicalHeading } from '@/ai/lexical/extractLexicalHeadings'
import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { cn } from '@/utilities/ui'
import { getPagePath, getPostPath } from '@/utilities/frontendPaths'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = String(value.slug)
  if (relationTo === 'posts') return getPostPath(slug)
  return getPagePath(slug)
}

function createBlogConverters(headings: LexicalHeading[]): JSXConvertersFunction<NodeTypes> {
  let headingIndex = 0

  return ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const Tag = node.tag
      const slug = headings[headingIndex]?.slug
      headingIndex += 1
      return slug ? <Tag id={slug}>{children}</Tag> : <Tag>{children}</Tag>
    },
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
  })
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  headings?: LexicalHeading[]
} & React.HTMLAttributes<HTMLDivElement>

export function BlogRichText({ className, data, enableGutter = false, headings = [], ...rest }: Props) {
  return (
    <ConvertRichText
      converters={createBlogConverters(headings)}
      className={cn(
        'payload-richtext markdown-body',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
        },
        className,
      )}
      data={data}
      {...rest}
    />
  )
}
