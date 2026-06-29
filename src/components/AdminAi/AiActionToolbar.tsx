'use client'

import React, { useCallback, useState } from 'react'

import type { AiAction } from '@/ai/types'

type Props = {
  action: AiAction
  label: string
  disabled?: boolean
  onClick: () => Promise<void>
}

export function AiActionButton({ action, label, disabled, onClick }: Props) {
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    try {
      await onClick()
    } finally {
      setLoading(false)
    }
  }, [onClick])

  return (
    <button
      className="btn btn--style-secondary btn--size-small"
      disabled={disabled || loading}
      onClick={() => void handleClick()}
      type="button"
    >
      {loading ? '处理中…' : label}
    </button>
  )
}

type ToolbarProps = {
  actions: { action: AiAction; label: string }[]
  disabled?: boolean
  onAction: (action: AiAction) => Promise<void>
}

export function AiActionToolbar({ actions, disabled, onAction }: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map(({ action, label }) => (
        <AiActionButton
          action={action}
          disabled={disabled}
          key={action}
          label={label}
          onClick={() => onAction(action)}
        />
      ))}
    </div>
  )
}
