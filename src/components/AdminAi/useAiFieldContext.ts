'use client'

import { useMemo } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

import { getCollectionAiProfile } from '@/ai/collectionProfiles'
import { fieldValueToPlainText } from '@/ai/fieldValueToPlainText'

export type AiFieldCustomConfig = {
  contentFieldPaths?: string | string[]
  titleFieldPath?: string
}

/** Minimal field shape for reading admin.custom in client field components. */
export type AiFieldLike = {
  admin?: {
    custom?: unknown
  }
}

export function getAiFieldCustom(field?: AiFieldLike): AiFieldCustomConfig {
  const custom = field?.admin?.custom
  if (!custom || typeof custom !== 'object') return {}
  return custom as AiFieldCustomConfig
}

function normalizePaths(paths?: string | string[]): string[] {
  if (!paths) return []
  return Array.isArray(paths) ? paths : [paths]
}

export function useAiFieldContext(field?: AiFieldLike) {
  const { collectionSlug } = useDocumentInfo()
  const custom = getAiFieldCustom(field)
  const profile = getCollectionAiProfile(collectionSlug)

  const contentFieldPaths = useMemo(() => {
    const fromCustom = normalizePaths(custom.contentFieldPaths)
    if (fromCustom.length) return fromCustom
    return profile?.contentFields ?? ['content']
  }, [custom.contentFieldPaths, profile?.contentFields])

  const titleFieldPath = custom.titleFieldPath ?? 'title'

  const title = useFormFields(([fields]) => fields[titleFieldPath]?.value as string | undefined)

  const contentValues = useFormFields(([fields]) =>
    contentFieldPaths.map((path) => fields[path]?.value),
  )

  const contentPlain = useMemo(
    () =>
      contentFieldPaths
        .map((path, index) => {
          const text = fieldValueToPlainText(contentValues[index])
          if (!text) return ''
          return contentFieldPaths.length > 1 ? `[${path}]\n${text}` : text
        })
        .filter(Boolean)
        .join('\n\n'),
    [contentFieldPaths, contentValues],
  )

  return {
    collectionSlug,
    profile,
    titleFieldPath,
    title,
    contentFieldPaths,
    contentPlain,
  }
}
