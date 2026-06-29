'use client'

import { useCallback } from 'react'

import type { AiAction, AiContext } from '@/ai/types'

import { consumeAiStream } from './consumeAiStream'

type CompleteOptions = {
  action: AiAction
  customPrompt?: string
  collection: string
  docId?: string | number
  fieldPath: string
  input: string
  context?: AiContext
}

type StreamCallbacks = {
  onChunk?: (chunk: string, fullText: string) => void
}

export function useAiComplete() {
  const runComplete = useCallback(
    async (options: CompleteOptions, callbacks?: StreamCallbacks): Promise<string> => {
      const res = await fetch('/api/ai/stream', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      })

      return consumeAiStream(res, callbacks?.onChunk)
    },
    [],
  )

  return { runComplete }
}
