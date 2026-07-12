import { fieldValueToPlainText } from '@/ai/fieldValueToPlainText'
import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { relationshipTitles } from '@/ai/embeddings/relationshipTitles'

type DocLike = Record<string, unknown>

export function buildEmbeddableContentText(
  collection: EmbeddableCollection,
  doc: DocLike,
): string {
  const title = typeof doc.title === 'string' ? doc.title.trim() : ''
  const parts: string[] = []

  if (title) parts.push(title)

  if (collection === 'posts' || collection === 'novel-chapters') {
    const content = fieldValueToPlainText(doc.content, 6000)
    if (content) parts.push(content)
    const metaDesc =
      typeof doc.meta === 'object' && doc.meta && 'description' in doc.meta
        ? String((doc.meta as { description?: string }).description ?? '').trim()
        : ''
    if (metaDesc) parts.push(metaDesc)
    const categoryLabels = relationshipTitles(doc.categories)
    const tagLabels = relationshipTitles(doc.tags)
    if (categoryLabels.length) parts.push(categoryLabels.join('、'))
    if (tagLabels.length) parts.push(tagLabels.join('、'))
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

  if (collection === 'novels') {
    for (const field of [
      'synopsis',
      'writingStyle',
      'worldBuilding',
      'constraints',
      'plotOutline',
      'genre',
      'currentProgress',
    ] as const) {
      const value = typeof doc[field] === 'string' ? doc[field].trim() : ''
      if (value) parts.push(value)
    }

    const categoryLabels = relationshipTitles(doc.categories)
    const tagLabels = relationshipTitles(doc.tags)
    if (categoryLabels.length) parts.push(categoryLabels.join('、'))
    if (tagLabels.length) parts.push(tagLabels.join('、'))

    const characters = Array.isArray(doc.characters) ? doc.characters : []
    for (const character of characters) {
      if (!character || typeof character !== 'object') continue
      const record = character as Record<string, unknown>
      const name = typeof record.name === 'string' ? record.name.trim() : ''
      const role = typeof record.role === 'string' ? record.role.trim() : ''
      const personality = typeof record.personality === 'string' ? record.personality.trim() : ''
      const notes = typeof record.notes === 'string' ? record.notes.trim() : ''
      const line = [name, role, personality, notes].filter(Boolean).join(' · ')
      if (line) parts.push(line)
    }
  }

  return parts.join('\n\n').trim()
}

export function buildEmbeddingExcerpt(text: string, maxLength = 240): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}…`
}
