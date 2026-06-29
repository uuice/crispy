'use client'

import React from 'react'
import { CodeField, useDocumentInfo, useField } from '@payloadcms/ui'
import type { CodeFieldClientComponent } from 'payload'

import type { AiAction } from '@/ai/types'

import { AiAssistPopup } from './AiAssistPopup'
import { AiFieldAssistLayout } from './AiFieldAssistLayout'
import { CODE_AI_PRESETS } from './AiCustomPromptSection'
import { useAiFieldAssist } from './useAiFieldAssist'
import { useAiFieldContext } from './useAiFieldContext'

const DEFAULT_ACTIONS: { action: AiAction; label: string }[] = [
  { action: 'polish', label: '润色' },
  { action: 'expand', label: '扩写' },
  { action: 'shorten', label: '精简' },
]

const AiCodeField: CodeFieldClientComponent = (props) => {
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
          presets={CODE_AI_PRESETS}
          preview={preview}
          streaming={streaming}
          title="AI 代码助手"
          triggerTitle="AI 代码助手"
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
      <CodeField {...props} />
    </AiFieldAssistLayout>
  )
}

export default AiCodeField
