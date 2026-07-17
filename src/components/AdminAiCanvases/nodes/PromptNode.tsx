'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import React from 'react'

import type { CanvasNodeData } from '@/ai/canvas/types'
import { useCanvasEditor } from '@/components/AdminAiCanvases/CanvasEditorContext'

export type PromptOption = { id: string | number; title: string; action: string }

export type PromptFlowNode = Node<CanvasNodeData, 'prompt'>

export function PromptNode({ id, data, selected }: NodeProps<PromptFlowNode>) {
  const { prompts, runningNodeId, updateNodeData, runNode } = useCanvasEditor()
  const running = runningNodeId === id

  return (
    <div className={`ai-canvas-node ai-canvas-node--prompt${selected ? ' is-selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="ai-canvas-node__title">{data.label || 'Prompt'}</div>
      <select
        className="ai-canvas-node__select nodrag nopan"
        value={data.promptId != null ? String(data.promptId) : ''}
        onChange={(e) => updateNodeData(id, { promptId: e.target.value || null })}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <option value="">选择 Prompt 模板…</option>
        {prompts.map((p) => (
          <option key={String(p.id)} value={String(p.id)}>
            {p.title} ({p.action})
          </option>
        ))}
      </select>
      <button
        type="button"
        className="ai-canvas-node__run nodrag nopan"
        disabled={running || !data.promptId}
        onClick={() => runNode(id)}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {running ? '运行中…' : '运行'}
      </button>
      {data.lastOutput ? (
        <pre className="ai-canvas-node__output nowheel">{data.lastOutput}</pre>
      ) : (
        <p className="ai-canvas-node__hint">运行后输出显示在这里</p>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
