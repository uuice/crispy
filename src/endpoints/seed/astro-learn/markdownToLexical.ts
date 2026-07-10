import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { normalizeCodeBlockLanguage } from '@/blocks/Code/languages'

type LexicalChild = Record<string, unknown>

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_CODE = 16

function textNode(text: string, format = 0): LexicalChild {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function linkNode(url: string, children: LexicalChild[]): LexicalChild {
  return {
    type: 'link',
    children,
    direction: 'ltr',
    fields: {
      linkType: 'custom',
      newTab: url.startsWith('http'),
      url,
    },
    format: '',
    indent: 0,
    version: 3,
  }
}

function headingNode(tag: 'h1' | 'h2' | 'h3' | 'h4', children: LexicalChild[]): LexicalChild {
  return {
    type: 'heading',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    version: 1,
  }
}

function paragraphNode(children: LexicalChild[]): LexicalChild {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function listItemNode(children: LexicalChild[]): LexicalChild {
  return {
    type: 'listitem',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    value: 1,
    version: 1,
  }
}

function listNode(listType: 'bullet' | 'number', children: LexicalChild[]): LexicalChild {
  return {
    type: 'list',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    listType,
    start: 1,
    tag: listType === 'number' ? 'ol' : 'ul',
    version: 1,
  }
}

function codeBlockNode(code: string, language: string): LexicalChild {
  return {
    type: 'block',
    fields: {
      blockType: 'code',
      code,
      language: normalizeCodeLanguage(language),
    },
    format: '',
    version: 2,
  }
}

function normalizeCodeLanguage(language: string): string {
  return normalizeCodeBlockLanguage(language)
}

function parseInline(text: string): LexicalChild[] {
  const nodes: LexicalChild[] = []
  const pattern =
    /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, match.index)))
    }

    const token = match[0] ?? ''
    if (token.startsWith('`')) {
      nodes.push(textNode(token.slice(1, -1), FORMAT_CODE))
    } else if (token.startsWith('**') || token.startsWith('__')) {
      nodes.push(textNode(token.slice(2, -2), FORMAT_BOLD))
    } else if (token.startsWith('*') || token.startsWith('_')) {
      nodes.push(textNode(token.slice(1, -1), FORMAT_ITALIC))
    } else if (token.startsWith('![')) {
      const altMatch = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (altMatch) {
        nodes.push(textNode(`[image: ${altMatch[1] || 'image'}](${altMatch[2]})`))
      }
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        nodes.push(linkNode(linkMatch[2] ?? '', [textNode(linkMatch[1] ?? '')]))
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)))
  }

  return nodes.length > 0 ? nodes : [textNode('')]
}

function normalizeBody(body: string): string {
  return body.replace(/<!--\s*more\s*-->/gi, '').trim()
}

function isTableRow(line: string): boolean {
  return line.includes('|') && !/^\s*\|?\s*:?-{3,}/.test(line)
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?\s*:?-{3,}/.test(line)
}

export function markdownToLexical(markdown: string): DefaultTypedEditorState {
  const body = normalizeBody(markdown)
  const lines = body.split(/\r?\n/)
  const children: LexicalChild[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index] ?? ''
    index += 1

    if (!line.trim()) continue

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 2
      const tag = `h${Math.min(level, 4)}` as 'h1' | 'h2' | 'h3' | 'h4'
      children.push(headingNode(tag, parseInline(headingMatch[2] ?? '')))
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      children.push(paragraphNode([textNode('—')]))
      continue
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim()
      const codeLines: string[] = []
      while (index < lines.length && !(lines[index] ?? '').startsWith('```')) {
        codeLines.push(lines[index] ?? '')
        index += 1
      }
      if (index < lines.length) index += 1
      children.push(codeBlockNode(codeLines.join('\n'), language))
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (index <= lines.length) {
        const current = index === lines.length ? '' : (lines[index] ?? '')
        if (!/^\s*>\s?/.test(current) && current.trim() !== '') break
        if (/^\s*>\s?/.test(current)) {
          quoteLines.push(current.replace(/^\s*>\s?/, ''))
          index += 1
          continue
        }
        if (!current.trim()) {
          index += 1
          break
        }
        break
      }
      children.push(paragraphNode(parseInline(quoteLines.join(' '))))
      continue
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: LexicalChild[] = []
      const firstItemMatch = line.match(/^\s*[-*+]\s+(.+)$/)
      if (firstItemMatch) {
        items.push(listItemNode(parseInline(firstItemMatch[1] ?? '')))
      }
      while (index <= lines.length) {
        const current = index === lines.length ? '' : (lines[index] ?? '')
        const itemMatch = current.match(/^\s*[-*+]\s+(.+)$/)
        if (!itemMatch) break
        items.push(listItemNode(parseInline(itemMatch[1] ?? '')))
        index += 1
      }
      if (items.length > 0) {
        children.push(listNode('bullet', items))
        continue
      }
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: LexicalChild[] = []
      const firstItemMatch = line.match(/^\s*\d+\.\s+(.+)$/)
      if (firstItemMatch) {
        items.push(listItemNode(parseInline(firstItemMatch[1] ?? '')))
      }
      while (index <= lines.length) {
        const current = index === lines.length ? '' : (lines[index] ?? '')
        const itemMatch = current.match(/^\s*\d+\.\s+(.+)$/)
        if (!itemMatch) break
        items.push(listItemNode(parseInline(itemMatch[1] ?? '')))
        index += 1
      }
      if (items.length > 0) {
        children.push(listNode('number', items))
        continue
      }
    }

    if (isTableRow(line)) {
      const tableLines = [line]
      while (index < lines.length) {
        const next = lines[index] ?? ''
        if (!next.includes('|')) break
        tableLines.push(next)
        index += 1
      }

      for (const tableLine of tableLines) {
        if (isTableSeparator(tableLine)) continue
        const cells = tableLine
          .split('|')
          .map((cell) => cell.trim())
          .filter(Boolean)
        children.push(paragraphNode(parseInline(cells.join(' | '))))
      }
      continue
    }

    const paragraphLines = [line]
    while (index < lines.length) {
      const next = lines[index] ?? ''
      if (
        !next.trim() ||
        /^(#{1,4})\s+/.test(next) ||
        next.startsWith('```') ||
        /^\s*[-*+]\s+/.test(next) ||
        /^\s*\d+\.\s+/.test(next) ||
        /^\s*>\s?/.test(next) ||
        isTableRow(next)
      ) {
        break
      }
      paragraphLines.push(next)
      index += 1
    }

    children.push(paragraphNode(parseInline(paragraphLines.join(' '))))
  }

  if (children.length === 0) {
    children.push(paragraphNode([textNode('')]))
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  } as DefaultTypedEditorState
}
