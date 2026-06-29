type LexicalNode = {
  type?: string
  fields?: {
    blockType?: string
    code?: string | null
    media?: unknown
    content?: unknown
  }
  children?: LexicalNode[]
}

function hasRichTextContent(content: unknown): boolean {
  if (!content || typeof content !== 'object') return false
  const root = (content as { root?: LexicalNode }).root
  if (!root?.children?.length) return false

  const walk = (nodes: LexicalNode[]): boolean => {
    for (const node of nodes) {
      if (node.type === 'text' && typeof (node as { text?: string }).text === 'string') {
        if ((node as { text?: string }).text?.trim()) return true
      }
      if (node.children?.length && walk(node.children)) return true
    }
    return false
  }

  return walk(root.children)
}

function isBlockNodeComplete(fields: NonNullable<LexicalNode['fields']>): boolean {
  switch (fields.blockType) {
    case 'code':
      return typeof fields.code === 'string' && fields.code.trim().length > 0
    case 'mediaBlock':
      return fields.media != null && fields.media !== ''
    case 'banner':
      return hasRichTextContent(fields.content)
    default:
      return true
  }
}

function sanitizeNodes(nodes: LexicalNode[]): LexicalNode[] {
  return nodes.flatMap((node) => {
    if (node.type === 'block') {
      const fields = node.fields
      if (!fields?.blockType || !isBlockNodeComplete(fields)) {
        return []
      }
      return [node]
    }

    if (node.children?.length) {
      return [{ ...node, children: sanitizeNodes(node.children) }]
    }

    return [node]
  })
}

/**
 * Remove incomplete Lexical block nodes (empty Code / Media / Banner) before validation.
 */
export function sanitizeLexicalBlocks<T>(content: T): T {
  if (!content || typeof content !== 'object') return content

  const root = (content as { root?: LexicalNode }).root
  if (!root?.children) return content

  return {
    ...(content as object),
    root: {
      ...root,
      children: sanitizeNodes(root.children),
    },
  } as T
}
