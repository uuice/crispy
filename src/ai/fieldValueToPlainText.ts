import { lexicalToPlainText } from '@/ai/lexical/toPlainText'

/** Best-effort plain text from a form field value (string or Lexical JSON). */
export function fieldValueToPlainText(value: unknown, maxLength = 8000): string {
  if (typeof value === 'string') {
    const text = value.replace(/\s+/g, ' ').trim()
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength)}…`
  }
  return lexicalToPlainText(value, maxLength)
}
