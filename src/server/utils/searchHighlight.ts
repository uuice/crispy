import { escapeRegExp } from 'lodash'

export function highlightText(text: string, keyword: string): string {
  if (!text || !keyword) return text
  const pattern = keyword.split(/\s+/).filter(Boolean).map(escapeRegExp).join('|')
  return text.replace(new RegExp(pattern, 'gi'), (match) => `<mark>${match}</mark>`)
}

export function withSearchHighlight<T extends object>(
  items: T[],
  keyword: string,
  fields: (keyof T & string)[]
): Array<T & { _highlight: Record<string, string> }> {
  return items.map((item) => ({
    ...item,
    _highlight: Object.fromEntries(
      fields.map((field) => [field, highlightText(String((item as Record<string, unknown>)[field] ?? ''), keyword)])
    )
  }))
}
