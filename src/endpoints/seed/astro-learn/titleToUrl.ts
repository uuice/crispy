import { pinyin } from 'pinyin-pro'

/** Match astro-learn slug generation for migrated archive URLs. */
export function titleToUrl(title: string): string {
  if (!title) return 'untitled'

  if (/[\u4e00-\u9fa5]/.test(title)) {
    const segments = title.split(/([\u4e00-\u9fa5]+|[a-zA-Z0-9]+)/g).filter(Boolean)
    const parts = segments.map((segment) => {
      if (/[\u4e00-\u9fa5]/.test(segment)) {
        return pinyin(segment, { toneType: 'none', separator: '-' })
      }
      return segment.toLowerCase()
    })

    return (
      parts
        .join('-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase() || 'untitled'
    )
  }

  return (
    title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim() || 'untitled'
  )
}

export function resolveSlug(title: string, alias?: string | null): string {
  const seed = alias?.trim() || title
  return titleToUrl(seed)
}
