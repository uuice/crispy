import type { Block } from 'payload'

import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { withAiRewriteFeatures } from '@/fields/ai'

export const Faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      label: '问答条目',
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          label: '问题',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          label: '回答',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) =>
              withAiRewriteFeatures([
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
              ]),
          }),
        },
      ],
    },
  ],
  labels: {
    plural: '常见问题',
    singular: '常见问题',
  },
}
