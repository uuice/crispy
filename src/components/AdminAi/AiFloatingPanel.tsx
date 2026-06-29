'use client'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PANEL_WIDTH = 420
const GAP = 8
const VIEWPORT_PADDING = 12

function computePanelPosition(
  anchorEl: HTMLElement,
  panelEl: HTMLElement | null,
): React.CSSProperties {
  const rect = anchorEl.getBoundingClientRect()
  const width = Math.min(PANEL_WIDTH, window.innerWidth - VIEWPORT_PADDING * 2)
  const panelHeight = panelEl?.offsetHeight ?? 280

  let top = rect.bottom + GAP
  let left = rect.left + rect.width / 2 - width / 2
  left = Math.max(VIEWPORT_PADDING, Math.min(left, window.innerWidth - width - VIEWPORT_PADDING))

  if (top + panelHeight > window.innerHeight - VIEWPORT_PADDING) {
    top = rect.top - panelHeight - GAP
  }
  top = Math.max(VIEWPORT_PADDING, top)

  return {
    position: 'fixed',
    top,
    left,
    width,
    zIndex: 10000,
    maxHeight: `calc(100vh - ${VIEWPORT_PADDING * 2}px)`,
    overflowY: 'auto',
  }
}

const panelShellStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-elevation-0)',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
}

type Props = {
  open: boolean
  anchorRef: React.RefObject<HTMLElement | null>
  onClose: () => void
  closeOnOutsideClick?: boolean
  children: React.ReactNode
}

export function AiFloatingPanel({
  open,
  anchorRef,
  onClose,
  closeOnOutsideClick = true,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

  const reposition = useCallback(() => {
    if (!anchorRef.current) return
    setPanelStyle(computePanelPosition(anchorRef.current, panelRef.current))
  }, [anchorRef])

  useLayoutEffect(() => {
    if (!open) return
    reposition()
  }, [open, children, reposition])

  useEffect(() => {
    if (!open) return

    const handleReposition = () => reposition()
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open, reposition])

  useEffect(() => {
    if (!open || !closeOnOutsideClick) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [anchorRef, closeOnOutsideClick, onClose, open])

  if (!open) return null

  return createPortal(
    <div ref={panelRef} style={panelStyle}>
      <div style={panelShellStyle}>{children}</div>
    </div>,
    document.body,
  )
}
