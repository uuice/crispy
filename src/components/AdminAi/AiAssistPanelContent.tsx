'use client'

import React from 'react'

import type { AiAction } from '@/ai/types'

import { AiComparePreviewPanel, getAiActionLabel } from './AiComparePreviewPanel'
import { AiCustomPromptSection, FIELD_AI_PRESETS, LEXICAL_AI_PRESETS } from './AiCustomPromptSection'

type Props = {
  title?: string
  actions: { action: AiAction; label: string }[]
  presets?: readonly string[]
  disabled?: boolean
  streaming?: boolean
  activeAction?: AiAction | null
  customLabel?: string | null
  error?: string | null
  preview?: string | null
  originalText?: string
  onAction: (action: AiAction) => void
  onCustomSubmit: (instruction: string) => Promise<void>
  onApply: () => void
  onCancel: () => void
  applyLabel?: string
  hint?: string
  showCustomPrompt?: boolean
}

export function AiAssistPanelContent({
  title = 'AI 助手',
  actions,
  presets = FIELD_AI_PRESETS,
  disabled,
  streaming,
  activeAction,
  customLabel,
  error,
  preview,
  originalText = '',
  onAction,
  onCustomSubmit,
  onApply,
  onCancel,
  applyLabel = '应用',
  hint = '选择快捷操作，或在下方输入自定义指令。',
  showCustomPrompt = true,
}: Props) {
  return (
    <>
      <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px' }}>{title}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {actions.map(({ action, label }) => (
          <button
            className={
              activeAction === action
                ? 'btn btn--style-primary btn--size-small'
                : 'btn btn--style-secondary btn--size-small'
            }
            disabled={disabled || streaming}
            key={action}
            onClick={() => onAction(action)}
            type="button"
          >
            {streaming && activeAction === action ? '处理中…' : label}
          </button>
        ))}
      </div>
      {showCustomPrompt && (
        <AiCustomPromptSection
          disabled={disabled}
          loading={streaming && activeAction === 'custom'}
          presets={presets}
          onSubmit={onCustomSubmit}
        />
      )}
      {error && (
        <p style={{ color: 'var(--theme-error-500)', fontSize: '13px', marginTop: '10px' }}>{error}</p>
      )}
      {preview !== null && (
        <div style={{ marginTop: '12px' }}>
          <AiComparePreviewPanel
            applyLabel={applyLabel}
            originalText={originalText}
            resultText={preview ?? ''}
            streaming={streaming}
            title={
              activeAction
                ? `${getAiActionLabel(activeAction, customLabel)} 对比`
                : 'AI 对比'
            }
            onApply={onApply}
            onCancel={onCancel}
          />
        </div>
      )}
      {preview === null && !error && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-600)', marginTop: '10px' }}>{hint}</p>
      )}
    </>
  )
}

export { FIELD_AI_PRESETS, LEXICAL_AI_PRESETS }
