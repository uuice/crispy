import type { Block } from 'payload'

import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const RelatedPostsBlock: Block = {
  slug: 'relatedPosts',
  interfaceName: 'RelatedPostsBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      label: '引导内容',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: 'docs',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      required: true,
      label: '相关文章',
    },
  ],
  labels: {
    plural: '相关文章',
    singular: '相关文章',
  },
}
