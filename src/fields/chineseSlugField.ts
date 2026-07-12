import { slugField } from 'payload'

import { createSlugifyFromTitleHook } from '@/hooks/slugifyFromTitle'
import { adminLabels } from '@/i18n/admin-labels'

type SlugFieldOptions = NonNullable<Parameters<typeof slugField>[0]>

type SlugFieldResult = ReturnType<typeof slugField> & {
  admin?: Record<string, unknown>
  fields?: Array<Record<string, unknown> & { name?: string; hooks?: { beforeValidate?: unknown[] } }>
}

type ChineseSlugFieldOptions = SlugFieldOptions & {
  admin?: Record<string, unknown>
}

export function chineseSlugField(options: ChineseSlugFieldOptions = {}) {
  const { admin, ...slugOptions } = options
  const fieldToUse = slugOptions.fieldToUse ?? 'title'
  const baseField = slugField(slugOptions) as SlugFieldResult
  const slugName = slugOptions.name ?? 'slug'
  const slugifyHook = createSlugifyFromTitleHook(fieldToUse)

  return {
    ...baseField,
    fields: (baseField.fields ?? []).map((field) => {
      if ('name' in field && field.name === slugName) {
        const slugSubField = field as {
          hooks?: { beforeValidate?: unknown[] }
        }

        return {
          ...field,
          label: adminLabels.slug,
          hooks: {
            ...(slugSubField.hooks ?? {}),
            beforeValidate: [slugifyHook, ...(slugSubField.hooks?.beforeValidate ?? [])],
          },
        }
      }
      return field
    }),
    admin: {
      ...(baseField.admin ?? {}),
      ...(admin ?? {}),
    },
  }
}
