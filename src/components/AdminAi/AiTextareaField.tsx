'use client'

import React from 'react'
import { TextareaField, useDocumentInfo, useField } from '@payloadcms/ui'
import type { TextareaFieldClientComponent } from 'payload'

import type { AiAction } from '@/ai/types'

import { AiAssistPopup } from './AiAssistPopup'
import { AiFieldAssistLayout } from './AiFieldAssistLayout'
import { useAiFieldAssist } from './useAiFieldAssist'
import { useAiFieldContext } from './useAiFieldContext'

const DEFAULT_ACTIONS: { action: AiAction; label: string }[] = [
  { action: 'polish', label: '润色' },
  { action: 'expand', label: '扩写' },
  { action: 'shorten', label: '精简' },
]

const AiTextareaField: TextareaFieldClientComponent = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const { id, collectionSlug } = useDocumentInfo()
  const { title, contentPlain } = useAiFieldContext(field)
  const {
    preview,
    streaming,
    error,
    activeAction,
    activeLabel,
    handleAction,
    handleCustomPrompt,
    clearPreview,
  } = useAiFieldAssist({
    path,
    value,
    collectionSlug,
    docId: id,
    title,
    contentPlain,
  })

  const actions =
    (field?.admin?.custom?.aiActions as { action: AiAction; label: string }[] | undefined) ??
    DEFAULT_ACTIONS

  return (
    <AiFieldAssistLayout
      assist={
        <AiAssistPopup
          actions={actions}
          activeAction={activeAction}
          customLabel={activeLabel}
          disabled={!value?.trim()}
          error={error}
          originalText={value ?? ''}
          preview={preview}
          streaming={streaming}
          onAction={handleAction}
          onApply={() => {
            if (preview !== null) setValue(preview)
            clearPreview()
          }}
          onCancelPreview={clearPreview}
          onCustomSubmit={handleCustomPrompt}
        />
      }
    >
      <TextareaField {...props} />
    </AiFieldAssistLayout>
  )
}

export default AiTextareaField
