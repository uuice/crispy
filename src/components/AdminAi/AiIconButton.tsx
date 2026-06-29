'use client'

import React from 'react'

import { AiIcon } from './AiIcon'

type Props = {
  open?: boolean
  disabled?: boolean
  title?: string
  ariaLabel?: string
  onClick: () => void
}

export const AiIconButton = React.forwardRef<HTMLButtonElement, Props>(function AiIconButton(
  { open = false, disabled, title = 'AI 助手', ariaLabel = 'AI 助手', onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-expanded={open}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        flexShrink: 0,
        borderRadius: '6px',
        border: '1px solid var(--theme-elevation-150)',
        background: open ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-0)',
        color: 'var(--theme-text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
      }}
      title={title}
      type="button"
    >
      <AiIcon />
    </button>
  )
})
