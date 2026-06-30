import type { Block } from 'payload'

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { withAiRewriteFeatures } from '@/fields/ai'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
      admin: {
        description: 'Optional block caption. Falls back to the media item caption when empty.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) =>
          withAiRewriteFeatures([...rootFeatures, FixedToolbarFeature()]),
      }),
    },
  ],
}
