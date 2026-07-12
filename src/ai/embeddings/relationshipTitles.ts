/** Extract display titles from populated or ID-only relationship arrays. */
export function relationshipTitles(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((entry) => {
      if (typeof entry === 'object' && entry && 'title' in entry) {
        const title = (entry as { title?: string | null }).title
        return typeof title === 'string' ? title.trim() : ''
      }
      return ''
    })
    .filter(Boolean)
}
