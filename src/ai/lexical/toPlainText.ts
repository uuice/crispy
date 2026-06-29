type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

/** Extract plain text from Payload Lexical editor state (best-effort). */
export function lexicalToPlainText(data: unknown, maxLength = 8000): string {
  if (!data || typeof data !== 'object') return ''

  const root = (data as { root?: LexicalNode }).root
  if (!root) return ''

  const parts: string[] = []

  const walk = (node: LexicalNode) => {
    if (node.text) parts.push(node.text)
    node.children?.forEach(walk)
  }

  walk(root)

  const text = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}
