'use client'

import { useCallback, useState } from 'react'

import type { AiAction } from '@/ai/types'

import { useAiComplete } from './useAiComplete'

type Options = {
  path: string
  value?: string | null
  collectionSlug?: string | null
  docId?: string | number
  title?: string
  contentPlain?: string
}

export function useAiFieldAssist({
  path,
  value,
  collectionSlug,
  docId,
  title,
  contentPlain,
}: Options) {
  const { runComplete } = useAiComplete()
  const [preview, setPreview] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState<AiAction | null>(null)
  const [activeLabel, setActiveLabel] = useState<string | null>(null)

  const execute = useCallback(
    async (action: AiAction, customPrompt?: string) => {
      setError(null)
      setPreview('')
      setStreaming(true)
      setActiveAction(action)
      setActiveLabel(
        action === 'custom' ? customPrompt?.trim() || '自定义' : null,
      )

      try {
        await runComplete(
          {
            action,
            customPrompt,
            collection: collectionSlug ?? 'posts',
            docId,
            fieldPath: path,
            input: value ?? '',
            context: {
              title,
              contentPlain,
              locale: 'zh-CN',
            },
          },
          {
            onChunk: (_chunk, fullText) => setPreview(fullText),
          },
        )
      } catch (err) {
        setPreview(null)
        setActiveAction(null)
        setActiveLabel(null)
        setError(err instanceof Error ? err.message : 'AI 失败')
      } finally {
        setStreaming(false)
      }
    },
    [collectionSlug, contentPlain, docId, path, runComplete, title, value],
  )

  const handleAction = useCallback(
    async (action: AiAction) => execute(action),
    [execute],
  )

  const handleCustomPrompt = useCallback(
    async (instruction: string) => execute('custom', instruction),
    [execute],
  )

  const clearPreview = useCallback(() => {
    setPreview(null)
    setActiveAction(null)
    setActiveLabel(null)
  }, [])

  return {
    preview,
    streaming,
    error,
    activeAction,
    activeLabel,
    handleAction,
    handleCustomPrompt,
    clearPreview,
  }
}
