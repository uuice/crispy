'use client'

import React from 'react'

type Props = {
  title?: string
  text: string
  streaming?: boolean
  onApply: () => void
  onCancel: () => void
  applyLabel?: string
}

export function AiPreviewPanel({
  title = 'AI 预览',
  text,
  streaming = false,
  onApply,
  onCancel,
  applyLabel = '应用',
}: Props) {
  return (
    <div
      style={{
        marginTop: '12px',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
        {title}
        {streaming && (
          <span style={{ fontWeight: 400, marginLeft: '8px', opacity: 0.7 }}>生成中…</span>
        )}
      </p>
      <p style={{ fontSize: '13px', whiteSpace: 'pre-wrap', marginBottom: '12px', minHeight: '1.5em' }}>
        {text || (streaming ? '…' : '')}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn btn--style-primary btn--size-small"
          disabled={streaming || !text.trim()}
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
