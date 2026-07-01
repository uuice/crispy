import { slugField } from 'payload'

import { createSlugifyFromTitleHook } from '@/hooks/slugifyFromTitle'
import { adminLabels } from '@/i18n/admin-labels'

type SlugFieldOptions = NonNullable<Parameters<typeof slugField>[0]>

type SlugFieldResult = ReturnType<typeof slugField> & {
  admin?: Record<string, unknown>
  hooks?: { beforeValidate?: unknown[] }
}

type ChineseSlugFieldOptions = SlugFieldOptions & {
  admin?: Record<string, unknown>
}

export function chineseSlugField(options: ChineseSlugFieldOptions = {}) {
  const { admin, ...slugOptions } = options
  const fieldToUse = slugOptions.fieldToUse ?? 'title'
  const baseField = slugField(slugOptions) as SlugFieldResult
  const slugName = slugOptions.name ?? 'slug'

  return {
    ...baseField,
    fields: (baseField.fields ?? []).map((field) => {
      if ('name' in field && field.name === slugName) {
        return { ...field, label: adminLabels.slug }
      }
      return field
    }),
    admin: {
      ...(baseField.admin ?? {}),
      ...(admin ?? {}),
    },
    hooks: {
      ...(baseField.hooks ?? {}),
      beforeValidate: [
        createSlugifyFromTitleHook(fieldToUse),
        ...(baseField.hooks?.beforeValidate ?? []),
      ],
    },
  }
}
