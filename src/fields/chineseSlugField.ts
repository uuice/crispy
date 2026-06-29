import { slugField } from 'payload'

import { createSlugifyFromTitleHook } from '@/hooks/slugifyFromTitle'

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

  return {
    ...baseField,
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
