'use client'

import React, { useCallback, useRef, useState } from 'react'

import type { AiAction } from '@/ai/types'

import { AiAssistPanelContent } from './AiAssistPanelContent'
import { AiFloatingPanel } from './AiFloatingPanel'
import { AiIconButton } from './AiIconButton'

type Props = {
  title?: string
  hint?: string
  actions: { action: AiAction; label: string }[]
  presets?: readonly string[]
  showCustomPrompt?: boolean
  disabled?: boolean
  streaming?: boolean
  activeAction?: AiAction | null
  customLabel?: string | null
  error?: string | null
  preview?: string | null
  originalText?: string
  applyLabel?: string
  triggerTitle?: string
  onAction: (action: AiAction) => Promise<void>
  onCustomSubmit?: (instruction: string) => Promise<void>
  onApply: () => void
  onCancelPreview: () => void
}

export function AiAssistPopup({
  title = 'AI 助手',
  hint,
  actions,
  presets,
  showCustomPrompt = true,
  disabled,
  streaming,
  activeAction,
  customLabel,
  error,
  preview,
  originalText = '',
  applyLabel,
  triggerTitle,
  onAction,
  onCustomSubmit,
  onApply,
  onCancelPreview,
}: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    if (streaming) return
    setOpen(false)
  }, [streaming])

  const handleApply = useCallback(() => {
    onApply()
    setOpen(false)
  }, [onApply])

  return (
    <>
      <AiIconButton
        ref={triggerRef}
        ariaLabel={triggerTitle ?? title}
        disabled={disabled}
        open={open}
        title={triggerTitle ?? title}
        onClick={() => setOpen((prev) => !prev)}
      />
      <AiFloatingPanel
        anchorRef={triggerRef}
        closeOnOutsideClick={!streaming}
        open={open}
        onClose={handleClose}
      >
        <AiAssistPanelContent
          actions={actions}
          activeAction={activeAction}
          applyLabel={applyLabel}
          customLabel={customLabel}
          disabled={disabled}
          error={error}
          hint={hint}
          originalText={originalText}
          presets={presets}
          preview={preview}
          showCustomPrompt={showCustomPrompt}
          streaming={streaming}
          title={title}
          onAction={(action) => void onAction(action)}
          onApply={handleApply}
          onCancel={onCancelPreview}
          onCustomSubmit={onCustomSubmit ?? (async () => undefined)}
        />
      </AiFloatingPanel>
    </>
  )
}
