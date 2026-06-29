import type { Block } from 'payload'

import { withAiCodeField } from '@/fields/ai'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: 'Typescript',
          value: 'typescript',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'CSS',
          value: 'css',
        },
      ],
    },
    withAiCodeField({
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    }),
  ],
}
