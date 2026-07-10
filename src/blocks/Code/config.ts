import type { Block } from 'payload'

import { withAiCodeField } from '@/fields/ai'

import { CODE_BLOCK_LANGUAGES } from './languages'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [...CODE_BLOCK_LANGUAGES],
    },
    withAiCodeField({
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    }),
  ],
}
