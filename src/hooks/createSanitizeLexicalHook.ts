import type { CollectionBeforeValidateHook } from 'payload'

import { sanitizeLexicalBlocks } from '@/hooks/sanitizeLexicalBlocks'

function setByPath(data: Record<string, unknown>, path: string, value: unknown) {
  const segments = path.split('.')
  let current: Record<string, unknown> = data
  for (let i = 0; i < segments.length - 1; i += 1) {
    const key = segments[i]!
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  current[segments[segments.length - 1]!] = value
}

function getByPath(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, data)
}

/** Sanitize Lexical rich text fields before validation (removes empty blocks). */
export function createSanitizeLexicalHook(
  fieldPaths: string[],
): CollectionBeforeValidateHook {
  return ({ data }) => {
    if (!data || typeof data !== 'object') return data

    const record = data as Record<string, unknown>
    for (const path of fieldPaths) {
      const value = getByPath(record, path)
      if (value) {
        setByPath(record, path, sanitizeLexicalBlocks(value))
      }
    }
    return data
  }
}
