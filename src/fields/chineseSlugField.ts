import { slugField, type Field, type FieldHook } from 'payload'

import { createSlugifyFromTitleHook } from '@/hooks/slugifyFromTitle'
import { adminLabels } from '@/i18n/admin-labels'
import { slugifyFromTitle } from '@/utilities/slugifyTitle'

type SlugFieldOptions = NonNullable<Parameters<typeof slugField>[0]>
type SlugifyFn = NonNullable<SlugFieldOptions['slugify']>

type ChineseSlugFieldOptions = SlugFieldOptions & {
  admin?: Record<string, unknown>
}

function existingBeforeValidateHooks(field: Field): FieldHook[] {
  if (!('hooks' in field) || !field.hooks?.beforeValidate) return []
  return field.hooks.beforeValidate
}

/** Payload default slugify strips CJK; use pinyin so Chinese titles produce valid slugs. */
const chineseSlugify: SlugifyFn = ({ valueToSlugify }) => {
  if (typeof valueToSlugify !== 'string') return undefined
  const slug = slugifyFromTitle(valueToSlugify)
  return slug || undefined
}

export function chineseSlugField(options: ChineseSlugFieldOptions = {}): Field {
  const { admin, slugify: slugifyOverride, ...slugOptions } = options
  const fieldToUse = slugOptions.fieldToUse ?? slugOptions.useAsSlug ?? 'title'
  const baseField = slugField({
    ...slugOptions,
    slugify: slugifyOverride ?? chineseSlugify,
  })
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
