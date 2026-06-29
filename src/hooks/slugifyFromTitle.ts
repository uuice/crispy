import type { FieldHook } from 'payload'

import { slugifyFromTitle } from '@/utilities/slugifyTitle'

export function createSlugifyFromTitleHook(fieldToUse = 'title'): FieldHook {
  return ({ value, data, siblingData }) => {
    if (typeof value === 'string' && value.trim()) {
      return value
    }

    const source =
      (data?.[fieldToUse] as string | undefined) ??
      (siblingData?.[fieldToUse] as string | undefined)

    if (typeof source !== 'string' || !source.trim()) {
      return value
    }

    return slugifyFromTitle(source)
  }
}

export const slugifyFromTitleHook = createSlugifyFromTitleHook()
