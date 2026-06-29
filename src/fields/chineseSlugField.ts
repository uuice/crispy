import { slugField } from 'payload'

import { createSlugifyFromTitleHook } from '@/hooks/slugifyFromTitle'

type SlugFieldOptions = NonNullable<Parameters<typeof slugField>[0]>

export function chineseSlugField(options: SlugFieldOptions = {}) {
  const fieldToUse = options.fieldToUse ?? 'title'

  return slugField({
    ...options,
    hooks: {
      ...options.hooks,
      beforeValidate: [
        createSlugifyFromTitleHook(fieldToUse),
        ...(options.hooks?.beforeValidate ?? []),
      ],
    },
  })
}
