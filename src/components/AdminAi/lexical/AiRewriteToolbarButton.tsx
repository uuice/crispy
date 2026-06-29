'use client'

import type { BaseSelection, LexicalEditor } from 'lexical'
import { $getSelection, $isRangeSelection, $setSelection } from 'lexical'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDocumentInfo } from '@payloadcms/ui'
import { useEditorConfigContext } from '@payloadcms/richtext-lexical/client'
import type { ToolbarGroupItem } from '@payloadcms/richtext-lexical'

import type { AiAction } from '@/ai/types'

import { AiAssistPanelContent, LEXICAL_AI_PRESETS } from '../AiAssistPanelContent'
import { AiIcon } from '../AiIcon'
import { LEXICAL_AI_ACTIONS } from '../AiComparePreviewPanel'
import { useAiComplete } from '../useAiComplete'
import { useAiFieldContext } from '../useAiFieldContext'

type Props = {
  editor: LexicalEditor
  anchorElem: HTMLElement
  item: ToolbarGroupItem
}

const PANEL_WIDTH = 440
const GAP = 10

function getSelectionText(editor: LexicalEditor): string {
  let text = ''
  editor.getEditorState().read(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      text = selection.getTextContent()
    }
  })
  return text
}

function captureSelection(editor: LexicalEditor): BaseSelection | null {
  let saved: BaseSelection | null = null
  editor.getEditorState().read(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      saved = selection.clone()
    }
  })
  return saved
}

function getSelectionRect(): DOMRect | null {
  const nativeSelection = window.getSelection()
  if (!nativeSelection || nativeSelection.rangeCount === 0 || nativeSelection.isCollapsed) {
    return null
  }
  return nativeSelection.getRangeAt(0).getBoundingClientRect()
}

function getInlineToolbarRect(anchorElem: HTMLElement): DOMRect | null {
  const toolbar = anchorElem.querySelector('.inline-toolbar-popup')
  if (!toolbar) return null
  const rect = toolbar.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return null
  return rect
}

function computePanelPosition(anchorElem: HTMLElement, panelHeight: number): React.CSSProperties {
  const viewportPadding = 12
  const width = Math.min(PANEL_WIDTH, window.innerWidth - viewportPadding * 2)

  const toolbarRect = getInlineToolbarRect(anchorElem)
  const selectionRect = getSelectionRect()
  const anchorRect = toolbarRect ?? selectionRect

  if (!anchorRect) {
    return {
      position: 'fixed',
      top: viewportPadding,
      left: viewportPadding,
      width,
      zIndex: 10000,
      maxHeight: `calc(100vh - ${viewportPadding * 2}px)`,
      overflowY: 'auto',
    }
  }

  let top = anchorRect.bottom + GAP
  let left = anchorRect.left + anchorRect.width / 2 - width / 2
  left = Math.max(viewportPadding, Math.min(left, window.innerWidth - width - viewportPadding))

  if (top + panelHeight > window.innerHeight - viewportPadding) {
    top = anchorRect.top - panelHeight - GAP
  }
  if (top < viewportPadding) {
    top = Math.min(anchorRect.bottom + GAP, window.innerHeight - panelHeight - viewportPadding)
  }
  top = Math.max(viewportPadding, top)

  return {
    position: 'fixed',
    top,
    left,
    width,
    zIndex: 10000,
    maxHeight: `calc(100vh - ${viewportPadding * 2}px)`,
    overflowY: 'auto',
  }
}

export function AiRewriteToolbarButton({ editor, anchorElem }: Props) {
  const { id, collectionSlug } = useDocumentInfo()
  const { fieldProps } = useEditorConfigContext()
  const { runComplete } = useAiComplete()
  const { title, contentPlain } = useAiFieldContext()
  const fieldPath = fieldProps.path
  const panelRef = useRef<HTMLDivElement>(null)
  const savedSelectionRef = useRef<BaseSelection | null>(null)
  const [open, setOpen] = useState(false)
  const [selectionText, setSelectionText] = useState('')
  const [activeAction, setActiveAction] = useState<AiAction | null>(null)
  const [customLabel, setCustomLabel] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

  const repositionPanel = useCallback(() => {
    if (!panelRef.current) return
    setPanelStyle(computePanelPosition(anchorElem, panelRef.current.offsetHeight))
  }, [anchorElem])

  useLayoutEffect(() => {
    if (!open) return
    repositionPanel()
  }, [open, preview, streaming, activeAction, error, repositionPanel])

  useEffect(() => {
    if (!open) return

    const handleReposition = () => repositionPanel()
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    const scroller = anchorElem.parentElement
    scroller?.addEventListener('scroll', handleReposition)

    return () => {
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
      scroller?.removeEventListener('scroll', handleReposition)
    }
  }, [anchorElem, open, repositionPanel])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (streaming) return
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorElem.contains(target)) return
      setOpen(false)
      setPreview(null)
      setActiveAction(null)
      setCustomLabel(null)
      setError(null)
      savedSelectionRef.current = null
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [anchorElem, open, streaming])

  const runAction = useCallback(
    async (action: AiAction, selected: string, customPrompt?: string) => {
      setActiveAction(action)
      setCustomLabel(action === 'custom' ? customPrompt?.trim() || '自定义' : null)
      setError(null)
      setPreview('')
      setStreaming(true)

      try {
        await runComplete(
          {
            action,
            customPrompt,
            collection: collectionSlug ?? 'posts',
            docId: id,
            fieldPath,
            input: selected,
            context: {
              title,
              selection: selected,
              contentPlain,
              locale: 'zh-CN',
            },
          },
          {
            onChunk: (_chunk: string, fullText: string) => setPreview(fullText),
          },
        )
      } catch (err) {
        setPreview(null)
        setCustomLabel(null)
        setError(err instanceof Error ? err.message : 'AI 失败')
      } finally {
        setStreaming(false)
      }
    },
    [collectionSlug, contentPlain, fieldPath, id, runComplete, title],
  )

  const handleOpen = useCallback(() => {
    const selected = getSelectionText(editor).trim()
    if (!selected) return

    savedSelectionRef.current = captureSelection(editor)
    setSelectionText(selected)
    setPreview(null)
    setActiveAction(null)
    setCustomLabel(null)
    setError(null)
    setOpen(true)
  }, [editor])

  const applyResult = useCallback(() => {
    if (!preview?.trim()) return

    editor.update(() => {
      const saved = savedSelectionRef.current
      if (saved) {
        $setSelection(saved.clone())
      }
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selection.insertText(preview)
      }
    })

    setOpen(false)
    setPreview(null)
    setActiveAction(null)
    setCustomLabel(null)
    setError(null)
    savedSelectionRef.current = null
  }, [editor, preview])

  const closePanel = useCallback(() => {
    setOpen(false)
    setPreview(null)
    setActiveAction(null)
    setCustomLabel(null)
    setError(null)
    savedSelectionRef.current = null
  }, [])

  return (
    <>
      <button
        aria-label="AI 选区助手"
        className="toolbar-popup__button toolbar-popup__button-aiRewrite"
        onClick={handleOpen}
        onMouseDown={(e) => e.preventDefault()}
        title="AI 选区助手"
        type="button"
      >
        <AiIcon />
      </button>
      {open &&
        createPortal(
          <div ref={panelRef} style={panelStyle}>
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--theme-elevation-150)',
                background: 'var(--theme-elevation-0)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
              }}
            >
              <AiAssistPanelContent
                actions={LEXICAL_AI_ACTIONS}
                activeAction={activeAction}
                applyLabel="替换选区"
                customLabel={customLabel}
                disabled={!selectionText.trim()}
                error={error}
                originalText={selectionText}
                presets={LEXICAL_AI_PRESETS}
                preview={preview}
                streaming={streaming}
                title="AI 选区助手"
                onAction={(action) => void runAction(action, selectionText)}
                onApply={applyResult}
                onCancel={closePanel}
                onCustomSubmit={(instruction) => runAction('custom', selectionText, instruction)}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
