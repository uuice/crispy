import { fieldValueToPlainText } from '@/ai/fieldValueToPlainText'
import type { EmbeddableCollection } from '@/ai/embeddings/constants'

type DocLike = Record<string, unknown>

export function buildEmbeddableContentText(
  collection: EmbeddableCollection,
  doc: DocLike,
): string {
  const title = typeof doc.title === 'string' ? doc.title.trim() : ''
  const parts: string[] = []

  if (title) parts.push(title)

  if (collection === 'posts') {
    const content = fieldValueToPlainText(doc.content, 6000)
    if (content) parts.push(content)
    const metaDesc =
      typeof doc.meta === 'object' && doc.meta && 'description' in doc.meta
        ? String((doc.meta as { description?: string }).description ?? '').trim()
        : ''
    if (metaDesc) parts.push(metaDesc)
  }

  if (collection === 'pages') {
    const hero =
      typeof doc.hero === 'object' && doc.hero && 'richText' in doc.hero
        ? fieldValueToPlainText((doc.hero as { richText?: unknown }).richText, 6000)
        : ''
    if (hero) parts.push(hero)
    const metaDesc =
      typeof doc.meta === 'object' && doc.meta && 'description' in doc.meta
        ? String((doc.meta as { description?: string }).description ?? '').trim()
        : ''
    if (metaDesc) parts.push(metaDesc)
  }

  return parts.join('\n\n').trim()
}

export function buildEmbeddingExcerpt(text: string, maxLength = 240): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}…`
}
