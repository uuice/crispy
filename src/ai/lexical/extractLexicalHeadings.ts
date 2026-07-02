export type LexicalHeading = {
  depth: 2 | 3
  text: string
  slug: string
}

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

function extractText(node: LexicalNode): string {
  if (node.text) return node.text
  return (node.children || []).map(extractText).join('')
}

function slugifyHeading(text: string, usedSlugs: Map<string, number>): string {
  const base =
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fff-]/g, '') || 'section'

  const count = usedSlugs.get(base) ?? 0
  usedSlugs.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}

/** Extract h2/h3 headings from Payload Lexical editor state for blog TOC. */
export function extractLexicalHeadings(data: unknown): LexicalHeading[] {
  if (!data || typeof data !== 'object') return []

  const root = (data as { root?: LexicalNode }).root
  if (!root?.children) return []

  const headings: LexicalHeading[] = []
  const usedSlugs = new Map<string, number>()

  const walk = (node: LexicalNode) => {
    if (node.type === 'heading') {
      const tag = node.tag || 'h2'
      if (tag === 'h2' || tag === 'h3') {
        const text = extractText(node).trim()
        if (text) {
          headings.push({
            depth: tag === 'h3' ? 3 : 2,
            text,
            slug: slugifyHeading(text, usedSlugs),
          })
        }
      }
    }
    node.children?.forEach(walk)
  }

  walk(root)
  return headings
}
