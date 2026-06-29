'use client'

import type { BaseSelection, LexicalEditor } from 'lexical'
import { $getSelection, $isRangeSelection, $setSelection } from 'lexical'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import type { ToolbarGroupItem } from '@payloadcms/richtext-lexical'

import type { AiAction } from '@/ai/types'
import { lexicalToPlainText } from '@/ai/lexical/toPlainText'

import {
  AiComparePreviewPanel,
  getAiActionLabel,
  LEXICAL_AI_ACTIONS,
} from '../AiComparePreviewPanel'
import { useAiComplete } from '../useAiComplete'

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

function AiIcon() {
  return (
    <svg aria-hidden fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5l1.2 3.6L13 6l-3.8 1.9L8 11.5 6.8 7.9 3 6l3.8-1.9L8 1.5z" fill="currentColor" />
      <path
        d="M12.5 9.5l.6 1.8 1.9.9-1.9.9-.6 1.8-.6-1.8-1.9-.9 1.9-.9.6-1.8z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}

export function AiRewriteToolbarButton({ editor, anchorElem }: Props) {
  const { id, collectionSlug } = useDocumentInfo()
  const { runComplete } = useAiComplete()
  const panelRef = useRef<HTMLDivElement>(null)
  const savedSelectionRef = useRef<BaseSelection | null>(null)
  const [open, setOpen] = useState(false)
  const [selectionText, setSelectionText] = useState('')
  const [activeAction, setActiveAction] = useState<AiAction | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

  const title = useFormFields(([fields]) => fields.title?.value as string | undefined)
  const content = useFormFields(([fields]) => fields.content?.value)
  const contentPlain = lexicalToPlainText(content)

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
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorElem.contains(target)) return
      setOpen(false)
      setPreview(null)
      setActiveAction(null)
      setError(null)
      savedSelectionRef.current = null
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [anchorElem, open])

  const runAction = useCallback(
    async (action: AiAction, selected: string) => {
      setActiveAction(action)
      setError(null)
      setPreview('')
      setStreaming(true)

      try {
        await runComplete(
          {
            action,
            collection: collectionSlug ?? 'posts',
            docId: id,
            fieldPath: 'content',
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
        setError(err instanceof Error ? err.message : 'AI 失败')
      } finally {
        setStreaming(false)
      }
    },
    [collectionSlug, contentPlain, id, runComplete, title],
  )

  const handleOpen = useCallback(() => {
    const selected = getSelectionText(editor).trim()
    if (!selected) return

    savedSelectionRef.current = captureSelection(editor)
    setSelectionText(selected)
    setPreview(null)
    setActiveAction(null)
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
    setError(null)
    savedSelectionRef.current = null
  }, [editor, preview])

  const closePanel = useCallback(() => {
    setOpen(false)
    setPreview(null)
    setActiveAction(null)
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
              <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px' }}>AI 选区助手</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: preview !== null ? '12px' : 0 }}>
                {LEXICAL_AI_ACTIONS.map(({ action, label }) => (
                  <button
                    className={
                      activeAction === action
                        ? 'btn btn--style-primary btn--size-small'
                        : 'btn btn--style-secondary btn--size-small'
                    }
                    disabled={streaming}
                    key={action}
                    onClick={() => void runAction(action, selectionText)}
                    type="button"
                  >
                    {streaming && activeAction === action ? '处理中…' : label}
                  </button>
                ))}
              </div>
              {error && (
                <p style={{ color: 'var(--theme-error-500)', fontSize: '13px', marginTop: '8px' }}>{error}</p>
              )}
              {preview !== null && (
                <AiComparePreviewPanel
                  applyLabel="替换选区"
                  originalText={selectionText}
                  resultText={preview}
                  streaming={streaming}
                  title={activeAction ? `${getAiActionLabel(activeAction)} 对比` : 'AI 对比'}
                  onApply={applyResult}
                  onCancel={closePanel}
                />
              )}
              {preview === null && !error && (
                <p style={{ fontSize: '12px', color: 'var(--theme-elevation-600)', marginTop: '8px' }}>
                  选择操作：润色、扩写、精简或改写当前选区。
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
