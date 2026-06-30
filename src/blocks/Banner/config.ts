import type { Block } from 'payload'

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { withAiRewriteFeatures } from '@/fields/ai'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) =>
          withAiRewriteFeatures([...rootFeatures, FixedToolbarFeature()]),
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
