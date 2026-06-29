'use client'

import React, { useCallback, useState } from 'react'
import { TextField, useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

import type { AiAction } from '@/ai/types'
import { lexicalToPlainText } from '@/ai/lexical/toPlainText'

import { AiActionToolbar } from './AiActionToolbar'
import { AiPreviewPanel } from './AiPreviewPanel'
import { useAiComplete } from './useAiComplete'

const DEFAULT_ACTIONS: { action: AiAction; label: string }[] = [
  { action: 'polish', label: '润色' },
  { action: 'expand', label: '扩写' },
  { action: 'shorten', label: '精简' },
]

const AiTextField: TextFieldClientComponent = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const { runComplete } = useAiComplete()
  const { id, collectionSlug } = useDocumentInfo()
  const [preview, setPreview] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = useFormFields(([fields]) => fields.title?.value as string | undefined)
  const content = useFormFields(([fields]) => fields.content?.value)

  const actions =
    (field?.admin?.custom?.aiActions as { action: AiAction; label: string }[] | undefined) ??
    DEFAULT_ACTIONS

  const handleAction = useCallback(
    async (action: AiAction) => {
      setError(null)
      setPreview('')
      setStreaming(true)

      try {
        await runComplete(
          {
            action,
            collection: collectionSlug ?? 'posts',
            docId: id,
            fieldPath: path,
            input: value ?? '',
            context: {
              title,
              contentPlain: lexicalToPlainText(content),
              locale: 'zh-CN',
            },
          },
          {
            onChunk: (_chunk, fullText) => setPreview(fullText),
          },
        )
      } catch (err) {
        setPreview(null)
        setError(err instanceof Error ? err.message : 'AI 失败')
      } finally {
        setStreaming(false)
      }
    },
    [collectionSlug, content, id, path, runComplete, title, value],
  )

  return (
    <div>
      <TextField {...props} />
      <AiActionToolbar actions={actions} disabled={!value?.trim() || streaming} onAction={handleAction} />
      {error && <p style={{ color: 'var(--theme-error-500)', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
      {preview !== null && (
        <AiPreviewPanel
          streaming={streaming}
          text={preview}
          onApply={() => {
            setValue(preview)
            setPreview(null)
          }}
          onCancel={() => setPreview(null)}
        />
      )}
    </div>
  )
}

export default AiTextField
