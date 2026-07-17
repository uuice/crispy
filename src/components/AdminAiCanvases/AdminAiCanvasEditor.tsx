'use client'

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type OnSelectionChangeParams,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  normalizeNodeType,
  type CanvasGraph,
  type CanvasNodeData,
} from '@/ai/canvas/types'
import { CanvasEditorProvider } from '@/components/AdminAiCanvases/CanvasEditorContext'
import { TextInputNode, type TextInputFlowNode } from '@/components/AdminAiCanvases/nodes/InputNode'
import {
  PromptNode,
  type PromptFlowNode,
  type PromptOption,
} from '@/components/AdminAiCanvases/nodes/PromptNode'

type FlowNode = TextInputFlowNode | PromptFlowNode

function toFlowNodes(graph: CanvasGraph): Node[] {
  return graph.nodes.map((n) => ({
    id: n.id,
    type: normalizeNodeType(n.type),
    position: n.position,
    data: n.data,
  }))
}

function toFlowEdges(graph: CanvasGraph): Edge[] {
  return graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
  }))
}

function toPersistedGraph(
  nodes: Node[],
  edges: Edge[],
  viewport?: { x: number; y: number; zoom: number },
): CanvasGraph {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: normalizeNodeType(n.type),
      position: n.position,
      data: (n.data ?? {}) as CanvasNodeData,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    })),
    viewport,
  }
}

const nodeTypes = {
  textInput: TextInputNode,
  prompt: PromptNode,
}

type Props = {
  canvasId: string
  initialTitle: string
  initialGraph: CanvasGraph
  onBack: () => void
  onDeleted: () => void
}

function AdminAiCanvasEditorInner({
  canvasId,
  initialTitle,
  initialGraph,
  onBack,
  onDeleted,
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(initialGraph))
  const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(initialGraph))
  const [prompts, setPrompts] = useState<PromptOption[]>([])
  const [saving, setSaving] = useState(false)
  const [runningNodeId, setRunningNodeId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const rfRef = useRef<ReactFlowInstance<Node, Edge> | null>(null)
  const idCounter = useRef(0)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(
          '/api/prompt-templates?limit=100&depth=0&where[enabled][equals]=true',
          { credentials: 'include' },
        )
        if (!res.ok) return
        const data = (await res.json()) as {
          docs?: Array<{ id: string | number; title?: string; action?: string }>
        }
        setPrompts(
          (data.docs ?? []).map((d) => ({
            id: d.id,
            title: d.title || `Prompt #${d.id}`,
            action: d.action || 'custom',
          })),
        )
      } catch {
        // ignore
      }
    })()
  }, [])

  const updateNodeData = useCallback(
    (nodeId: string, patch: Partial<CanvasNodeData>) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n)),
      )
    },
    [setNodes],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: `e-${connection.source}-${connection.target}-${Date.now()}`,
          },
          eds,
        ),
      )
    },
    [setEdges],
  )

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedIds(params.nodes.map((n) => n.id))
  }, [])

  const addNode = useCallback(
    (type: 'textInput' | 'prompt') => {
      idCounter.current += 1
      const id = `${type}-${Date.now()}-${idCounter.current}`
      const position = { x: 120 + idCounter.current * 24, y: 80 + idCounter.current * 24 }
      const data: CanvasNodeData =
        type === 'textInput' ? { label: '输入', text: '' } : { label: 'Prompt', promptId: null }
      setNodes((prev) => [...prev, { id, type, position, data }])
    },
    [setNodes],
  )

  const deleteSelected = useCallback(() => {
    if (!selectedIds.length) return
    setNodes((prev) => prev.filter((n) => !selectedIds.includes(n.id)))
    setEdges((prev) =>
      prev.filter((e) => !selectedIds.includes(e.source) && !selectedIds.includes(e.target)),
    )
    setSelectedIds([])
  }, [selectedIds, setEdges, setNodes])

  const save = useCallback(async () => {
    setSaving(true)
    setStatus(null)
    try {
      const viewport = rfRef.current?.getViewport()
      const graph = toPersistedGraph(nodes, edges, viewport)
      const res = await fetch(`/api/ai/canvases/${canvasId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, graph }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error || '保存失败')
      setStatus('已保存')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }, [canvasId, edges, nodes, title])

  const runNode = useCallback(
    async (nodeId: string) => {
      setRunningNodeId(nodeId)
      setStatus(null)
      try {
        const viewport = rfRef.current?.getViewport()
        const graph = toPersistedGraph(nodes, edges, viewport)
        await fetch(`/api/ai/canvases/${canvasId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, graph }),
        })

        const res = await fetch(`/api/ai/canvases/${canvasId}/run`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodeId }),
        })
        const data = (await res.json()) as {
          error?: string
          canvas?: { graph: CanvasGraph }
          providerName?: string
          model?: string
        }
        if (!res.ok) throw new Error(data.error || '运行失败')
        if (data.canvas?.graph) {
          setNodes(toFlowNodes(data.canvas.graph))
          setEdges(toFlowEdges(data.canvas.graph))
        }
        setStatus(`运行完成 · ${data.providerName ?? ''} / ${data.model ?? ''}`)
      } catch (error) {
        setStatus(error instanceof Error ? error.message : '运行失败')
      } finally {
        setRunningNodeId(null)
      }
    },
    [canvasId, edges, nodes, setEdges, setNodes, title],
  )

  const removeCanvas = useCallback(async () => {
    if (!window.confirm('确定删除这个画布？')) return
    const res = await fetch(`/api/ai/canvases/${canvasId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setStatus(data.error || '删除失败')
      return
    }
    onDeleted()
  }, [canvasId, onDeleted])

  const editorValue = useMemo(
    () => ({
      prompts,
      runningNodeId,
      updateNodeData,
      runNode: (nodeId: string) => {
        void runNode(nodeId)
      },
    }),
    [prompts, runningNodeId, runNode, updateNodeData],
  )

  return (
    <CanvasEditorProvider value={editorValue}>
      <div className="ai-canvas-editor">
        <p className="ai-canvas-editor__howto">
          用法：在左侧「输入」框写文本 → 右侧「Prompt」选模板 → 点「运行」→ 点「保存」。可用连线把多个节点串起来。
        </p>
        <header className="ai-canvas-editor__toolbar">
          <button type="button" className="ai-canvas-btn" onClick={onBack}>
            ← 返回列表
          </button>
          <input
            className="ai-canvas-editor__title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="画布标题"
          />
          <button type="button" className="ai-canvas-btn" onClick={() => addNode('textInput')}>
            + 输入
          </button>
          <button type="button" className="ai-canvas-btn" onClick={() => addNode('prompt')}>
            + Prompt
          </button>
          <button
            type="button"
            className="ai-canvas-btn"
            disabled={!selectedIds.length}
            onClick={deleteSelected}
          >
            删除选中
          </button>
          <button
            type="button"
            className="ai-canvas-btn ai-canvas-btn--primary"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? '保存中…' : '保存'}
          </button>
          <button
            type="button"
            className="ai-canvas-btn ai-canvas-btn--danger"
            onClick={() => void removeCanvas()}
          >
            删除画布
          </button>
          {status ? <span className="ai-canvas-editor__status">{status}</span> : null}
        </header>
        <div className="ai-canvas-editor__stage">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onInit={(instance) => {
              rfRef.current = instance
              if (initialGraph.viewport) {
                instance.setViewport(initialGraph.viewport)
              } else {
                instance.fitView({ padding: 0.2 })
              }
            }}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            proOptions={{ hideAttribution: true }}
            nodesDraggable
            nodesConnectable
            elementsSelectable
          >
            <Background gap={16} />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
      </div>
    </CanvasEditorProvider>
  )
}

export function AdminAiCanvasEditor(props: Props) {
  return (
    <ReactFlowProvider>
      <AdminAiCanvasEditorInner {...props} />
    </ReactFlowProvider>
  )
}
