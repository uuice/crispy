import { slugField, type Field, type FieldHook } from 'payload'

import { createSlugifyFromTitleHook } from '@/hooks/slugifyFromTitle'
import { adminLabels } from '@/i18n/admin-labels'

type SlugFieldOptions = NonNullable<Parameters<typeof slugField>[0]>

type SlugFieldResult = ReturnType<typeof slugField>

type ChineseSlugFieldOptions = SlugFieldOptions & {
  admin?: Record<string, unknown>
}

function existingBeforeValidateHooks(field: Field): FieldHook[] {
  if (!('hooks' in field) || !field.hooks?.beforeValidate) return []
  return field.hooks.beforeValidate
}

export function chineseSlugField(options: ChineseSlugFieldOptions = {}): Field {
  const { admin, ...slugOptions } = options
  const fieldToUse = slugOptions.fieldToUse ?? 'title'
  const baseField = slugField(slugOptions) as SlugFieldResult
  const slugName = slugOptions.name ?? 'slug'
  const slugifyHook = createSlugifyFromTitleHook(fieldToUse)

  return {
    ...baseField,
    fields: (baseField.fields ?? []).map((field) => {
      if ('name' in field && field.name === slugName) {
        return {
          ...field,
          label: adminLabels.slug,
          hooks: {
            ...('hooks' in field ? field.hooks : undefined),
            beforeValidate: [slugifyHook, ...existingBeforeValidateHooks(field)],
          },
        }
      }
      return field
    }),
    admin: {
      ...(baseField.admin ?? {}),
      ...(admin ?? {}),
    },
  } as Field
}
