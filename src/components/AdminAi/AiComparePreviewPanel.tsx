'use client'

import React from 'react'

import type { AiAction } from '@/ai/types'

type Props = {
  title?: string
  originalText: string
  resultText: string
  streaming?: boolean
  onApply: () => void
  onCancel: () => void
  applyLabel?: string
}

const boxStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid var(--theme-elevation-150)',
  fontSize: '13px',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.5,
  maxHeight: '160px',
  overflowY: 'auto',
}

export function AiComparePreviewPanel({
  title = 'AI 预览',
  originalText,
  resultText,
  streaming = false,
  onApply,
  onCancel,
  applyLabel = '应用',
}: Props) {
  return (
    <div>
      <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px' }}>
        {title}
        {streaming && (
          <span style={{ fontWeight: 400, marginLeft: '8px', opacity: 0.7 }}>生成中…</span>
        )}
      </p>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '12px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', opacity: 0.75 }}>原文</p>
          <div style={{ ...boxStyle, background: 'var(--theme-elevation-100)' }}>{originalText}</div>
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', opacity: 0.75 }}>AI 结果</p>
          <div style={{ ...boxStyle, background: 'var(--theme-elevation-50)', minHeight: '2.5em' }}>
            {resultText || (streaming ? '…' : '')}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          className="btn btn--style-primary btn--size-small"
          disabled={streaming || !resultText.trim()}
          onClick={onApply}
          type="button"
        >
          {applyLabel}
        </button>
        <button
          className="btn btn--style-secondary btn--size-small"
          disabled={streaming}
          onClick={onCancel}
          type="button"
        >
          取消
        </button>
      </div>
    </div>
  )
}

export const LEXICAL_AI_ACTIONS: { action: AiAction; label: string }[] = [
  { action: 'polish', label: '润色' },
  { action: 'expand', label: '扩写' },
  { action: 'shorten', label: '精简' },
  { action: 'rewrite', label: '改写' },
]

export function getAiActionLabel(action: AiAction): string {
  return LEXICAL_AI_ACTIONS.find((item) => item.action === action)?.label ?? action
}
