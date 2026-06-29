import { pinyin } from 'pinyin-pro'

const CHINESE_SEGMENT = /[\u4e00-\u9fff]+/g

/** Convert a title (Chinese / English mix) to a URL-safe slug. */
export function slugifyFromTitle(title: string): string {
  const normalized = title.trim()
  if (!normalized) return ''

  const withPinyin = normalized.replace(CHINESE_SEGMENT, (segment) =>
    pinyin(segment, { toneType: 'none', separator: '-' }),
  )

  return withPinyin
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
