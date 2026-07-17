import { emptyCanvasGraph, isCanvasGraph, type CanvasGraph } from '@/ai/canvas/types'

/** Summarize graph for Agent responses — never dump full React Flow JSON. */
export function summarizeCanvasGraph(graph: unknown): {
  nodeCount: number
  edgeCount: number
  nodeTypes: string[]
  hasPromptBound: boolean
} {
  if (!isCanvasGraph(graph)) {
    return { nodeCount: 0, edgeCount: 0, nodeTypes: [], hasPromptBound: false }
  }
  const types = [...new Set(graph.nodes.map((n) => n.type || 'unknown'))]
  const hasPromptBound = graph.nodes.some(
    (n) => n.type === 'prompt' && n.data?.promptId != null && n.data.promptId !== '',
  )
  return {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    nodeTypes: types,
    hasPromptBound,
  }
}

export function sanitizeCanvasDocForAgent(
  doc: Record<string, unknown>,
): Record<string, unknown> {
  const { graph, ...rest } = doc
  return {
    ...rest,
    graphSummary: summarizeCanvasGraph(graph),
    editorUrl: '/admin/ai-canvases',
    note: '节点图请在 Admin「运营 → AI 画布」编辑；Agent 不返回/不修改 graph',
  }
}

/** Agent create/update payload: only title (+ default graph on create). */
export function prepareCanvasWriteData(
  data: Record<string, unknown>,
  operation: 'create' | 'update',
): Record<string, unknown> {
  const title = typeof data.title === 'string' ? data.title.trim() : undefined
  if (operation === 'create') {
    if (!title) {
      throw new Error('创建画布需要 title')
    }
    return {
      title,
      graph: emptyCanvasGraph() as CanvasGraph,
    }
  }

  const out: Record<string, unknown> = {}
  if (title) out.title = title
  if (Object.keys(out).length === 0) {
    throw new Error('画布更新仅支持 title；节点图请在 /admin/ai-canvases 编辑')
  }
  return out
}
