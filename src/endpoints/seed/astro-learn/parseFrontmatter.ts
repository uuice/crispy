export type ParsedFrontmatter = Record<string, unknown>

export type ParsedMarkdownFile = {
  frontmatter: ParsedFrontmatter
  body: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export function parseMarkdownFile(raw: string): ParsedMarkdownFile {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) {
    return { frontmatter: {}, body: raw.trim() }
  }

  return {
    frontmatter: parseYamlFrontmatter(match[1] ?? ''),
    body: (match[2] ?? '').trim(),
  }
}

function parseYamlFrontmatter(source: string): ParsedFrontmatter {
  const result: ParsedFrontmatter = {}
  const lines = source.split(/\r?\n/)
  let index = 0

  while (index < lines.length) {
    const line = lines[index] ?? ''
    index += 1

    if (!line.trim() || line.trim().startsWith('#')) continue

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!keyMatch) continue

    const key = keyMatch[1] ?? ''
    const inlineValue = keyMatch[2] ?? ''

    if (inlineValue === '' || inlineValue === '|' || inlineValue === '>') {
      const listItems: string[] = []
      let hasList = false

      while (index < lines.length) {
        const next = lines[index] ?? ''
        const listMatch = next.match(/^\s+-\s+(.*)$/)
        if (!listMatch) break
        hasList = true
        listItems.push(unquoteYamlValue(listMatch[1] ?? ''))
        index += 1
      }

      if (hasList) {
        result[key] = listItems
        continue
      }

      result[key] = inlineValue === '' ? null : inlineValue
      continue
    }

    result[key] = parseScalar(inlineValue)
  }

  return result
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim()
  if (!trimmed || trimmed === 'null') return null
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (/^\[.*\]$/.test(trimmed)) {
    const inner = trimmed.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((part) => unquoteYamlValue(part.trim()))
  }
  return unquoteYamlValue(trimmed)
}

function unquoteYamlValue(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export function asBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value
  return fallback
}

export function parseDate(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString()
  if (typeof value !== 'string' || !value.trim()) return undefined

  const trimmed = value.trim()
  // astro-learn stores local times in Asia/Shanghai
  const normalized = trimmed.includes(' ')
    ? trimmed.replace(' ', 'T')
    : `${trimmed}T00:00:00`
  const withZone = /(?:Z|[+-]\d{2}:\d{2})$/.test(normalized)
    ? normalized
    : `${normalized}+08:00`

  const parsed = new Date(withZone)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString()
}
