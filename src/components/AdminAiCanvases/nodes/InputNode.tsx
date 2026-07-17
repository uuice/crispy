'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import React from 'react'

import type { CanvasNodeData } from '@/ai/canvas/types'
import { useCanvasEditor } from '@/components/AdminAiCanvases/CanvasEditorContext'

export type TextInputFlowNode = Node<CanvasNodeData, 'textInput'>

export function TextInputNode({ id, data, selected }: NodeProps<TextInputFlowNode>) {
  const { updateNodeData } = useCanvasEditor()

  return (
    <div className={`ai-canvas-node ai-canvas-node--input${selected ? ' is-selected' : ''}`}>
      <div className="ai-canvas-node__title">{data.label || '输入'}</div>
      <textarea
        className="ai-canvas-node__textarea nodrag nopan nowheel"
        placeholder="在这里写要处理的文本…"
        rows={5}
        value={data.text ?? ''}
        onChange={(e) => updateNodeData(id, { text: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
