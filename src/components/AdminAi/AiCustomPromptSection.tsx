'use client'

import React, { useCallback, useState } from 'react'

export const FIELD_AI_PRESETS = [
  '将中文翻译成英文',
  '修正错别字和语法错误',
  '改为更正式的书面语',
  '改为更口语化的表达',
] as const

export const LEXICAL_AI_PRESETS = [
  '将中文翻译成英文',
  '修正错别字和语法错误',
  '改为要点列表',
  '补充具体例子',
] as const

export const CODE_AI_PRESETS = [
  '添加英文注释',
  '重构并优化代码',
  '修复潜在 bug',
  '补充错误处理',
] as const

type Props = {
  disabled?: boolean
  loading?: boolean
  presets?: readonly string[]
  onSubmit: (instruction: string) => Promise<void>
}

export function AiCustomPromptSection({
  disabled,
  loading,
  presets = FIELD_AI_PRESETS,
  onSubmit,
}: Props) {
  const [instruction, setInstruction] = useState('')

  const handleSubmit = useCallback(async () => {
    const trimmed = instruction.trim()
    if (!trimmed) return
    await onSubmit(trimmed)
  }, [instruction, onSubmit])

  return (
    <div
      style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--theme-elevation-150)',
      }}
    >
      <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>自定义指令</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {presets.map((preset) => (
          <button
            className="btn btn--style-secondary btn--size-small"
            disabled={disabled || loading}
            key={preset}
            onClick={() => setInstruction(preset)}
            type="button"
          >
            {preset}
          </button>
        ))}
      </div>
      <textarea
        disabled={disabled || loading}
        onChange={(event) => setInstruction(event.target.value)}
        placeholder="描述修改需求，例如：把标题改成英文、修正错别字…"
        rows={2}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150)',
          fontSize: '13px',
          resize: 'vertical',
          marginBottom: '8px',
        }}
        value={instruction}
      />
      <button
        className="btn btn--style-primary btn--size-small"
        disabled={disabled || loading || !instruction.trim()}
        onClick={() => void handleSubmit()}
        type="button"
      >
        {loading ? '处理中…' : '执行自定义'}
      </button>
    </div>
  )
}
