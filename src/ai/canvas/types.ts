/** Persisted React Flow graph for ai-canvases. */

/** Avoid RF built-in type name `input` — use `textInput`. */
export type CanvasNodeType = 'textInput' | 'prompt' | 'input'

export type CanvasNodeData = {
  label?: string
  /** Free text for input nodes. */
  text?: string
  /** prompt-templates id for prompt nodes. */
  promptId?: string | number | null
  /** Last run output (prompt nodes). */
  lastOutput?: string
}

export type CanvasGraphNode = {
  id: string
  type: CanvasNodeType
  position: { x: number; y: number }
  data: CanvasNodeData
}

export type CanvasGraphEdge = {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}

export type CanvasGraph = {
  nodes: CanvasGraphNode[]
  edges: CanvasGraphEdge[]
  viewport?: { x: number; y: number; zoom: number }
}

export function normalizeNodeType(type: string | undefined): 'textInput' | 'prompt' {
  if (type === 'prompt') return 'prompt'
  // legacy `input` + current `textInput`
  return 'textInput'
}

export function emptyCanvasGraph(): CanvasGraph {
  return {
    nodes: [
      {
        id: 'input-1',
        type: 'textInput',
        position: { x: 80, y: 120 },
        data: { label: '输入', text: '' },
      },
      {
        id: 'prompt-1',
        type: 'prompt',
        position: { x: 420, y: 120 },
        data: { label: 'Prompt', promptId: null },
      },
    ],
    edges: [{ id: 'e-input-1-prompt-1', source: 'input-1', target: 'prompt-1' }],
    viewport: { x: 0, y: 0, zoom: 1 },
  }
}

export function isCanvasGraph(value: unknown): value is CanvasGraph {
  if (!value || typeof value !== 'object') return false
  const g = value as CanvasGraph
  return Array.isArray(g.nodes) && Array.isArray(g.edges)
}
