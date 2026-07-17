'use client'

import React, { createContext, useContext } from 'react'

import type { CanvasNodeData } from '@/ai/canvas/types'
import type { PromptOption } from '@/components/AdminAiCanvases/nodes/PromptNode'

export type CanvasEditorContextValue = {
  prompts: PromptOption[]
  runningNodeId: string | null
  updateNodeData: (nodeId: string, patch: Partial<CanvasNodeData>) => void
  runNode: (nodeId: string) => void
}

const CanvasEditorContext = createContext<CanvasEditorContextValue | null>(null)

export function CanvasEditorProvider({
  value,
  children,
}: {
  value: CanvasEditorContextValue
  children: React.ReactNode
}) {
  return <CanvasEditorContext.Provider value={value}>{children}</CanvasEditorContext.Provider>
}

export function useCanvasEditor(): CanvasEditorContextValue {
  const ctx = useContext(CanvasEditorContext)
  if (!ctx) throw new Error('useCanvasEditor must be used within CanvasEditorProvider')
  return ctx
}
