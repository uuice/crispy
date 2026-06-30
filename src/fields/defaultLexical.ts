import type { TextFieldSingleValidation } from 'payload'
import {
  defaultEditorFeatures,
  lexicalEditor,
  LinkFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

const linkFeature = LinkFeature({
  enabledCollections: ['pages', 'posts'],
  fields: ({ defaultFields }) => {
    const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
      if ('name' in field && field.name === 'url') return false
      return true
    })

    return [
      ...defaultFieldsWithoutUrl,
      {
        name: 'url',
        type: 'text',
        admin: {
          condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
        },
        label: ({ t }) => t('fields:enterURL'),
        required: true,
        validate: ((value, options) => {
          if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
            return true // no validation needed, as no url should exist for internal links
          }
          return value ? true : 'URL is required'
        }) as TextFieldSingleValidation,
      },
    ]
  },
})

export const defaultLexical = lexicalEditor({
  features: [
    ...defaultEditorFeatures.filter((feature) => feature.key !== 'link'),
    linkFeature,
  ],
})
