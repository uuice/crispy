'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { $isRangeSelection } from 'lexical'

import { AiRewriteToolbarButton } from '../AiRewriteToolbarButton'

export const AiRewriteFeatureClient = createClientFeature({
  toolbarInline: {
    groups: [
      {
        type: 'buttons',
        key: 'aiRewrite',
        order: 100,
        items: [
          {
            key: 'aiRewrite',
            label: 'AI 助手',
            Component: AiRewriteToolbarButton,
            isEnabled: ({ selection }) => {
              if (!$isRangeSelection(selection) || selection.isCollapsed()) return false
              return selection.getTextContent().trim().length > 0
            },
          },
        ],
      },
    ],
  },
})
