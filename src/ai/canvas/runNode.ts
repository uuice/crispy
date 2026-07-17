import { renderPromptTemplate } from '@/ai/promptRenderer'
import { openAiChatCompletion } from '@/ai/providers/openaiCompatible'
import { resolveLlmClient } from '@/ai/resolveLlmClient'
import type { CanvasGraph, CanvasGraphNode } from '@/ai/canvas/types'

function collectUpstreamText(graph: CanvasGraph, nodeId: string): string {
  const incoming = graph.edges.filter((e) => e.target === nodeId)
  const parts: string[] = []

  for (const edge of incoming) {
    const source = graph.nodes.find((n) => n.id === edge.source)
    if (!source) continue
    if (source.type === 'textInput' || source.type === 'input') {
      if (source.data.text?.trim()) parts.push(source.data.text.trim())
    } else if (source.type === 'prompt' && source.data.lastOutput?.trim()) {
      parts.push(source.data.lastOutput.trim())
    }
  }

  return parts.join('\n\n')
}

/**
 * Run a prompt node on the canvas using Catalog + Override via resolveLlmClient.
 * Returns updated graph with lastOutput written on the target node.
 */
export async function runCanvasPromptNode(args: {
  graph: CanvasGraph
  nodeId: string
}): Promise<{ graph: CanvasGraph; output: string; model: string; providerName: string }> {
  const node = args.graph.nodes.find((n) => n.id === args.nodeId)
  if (!node) throw new Error('节点不存在')
  if (node.type !== 'prompt') throw new Error('只能运行 Prompt 节点')
  if (!node.data.promptId) throw new Error('请先为节点选择 Prompt 模板')

  const input = collectUpstreamText(args.graph, args.nodeId)
  if (!input.trim()) {
    throw new Error('上游没有输入文本：请填写输入节点或先运行上游 Prompt')
  }

  const client = await resolveLlmClient({
    purpose: 'canvas',
    promptId: node.data.promptId,
  })

  if (!client.enabled) {
    throw new Error(client.disabledReason ?? 'AI 未启用')
  }

  const template = client.template
  if (!template) {
    throw new Error('未找到 Prompt 模板')
  }

  if (template.outputFormat === 'json') {
    throw new Error('画布 MVP 暂不支持 JSON 输出模板，请换文本类 Prompt')
  }

  const variables = {
    field: input,
    selection: undefined,
    instruction: '',
    context: { contentPlain: input },
  }

  const result = await openAiChatCompletion({
    baseUrl: client.baseUrl,
    apiKey: client.apiKey,
    model: client.model,
    temperature: client.temperature,
    maxTokens: client.maxTokens,
    messages: [
      { role: 'system', content: renderPromptTemplate(template.systemPrompt, variables) },
      { role: 'user', content: renderPromptTemplate(template.userPrompt, variables) },
    ],
  })

  const nodes: CanvasGraphNode[] = args.graph.nodes.map((n) =>
    n.id === args.nodeId
      ? { ...n, data: { ...n.data, lastOutput: result.content } }
      : n,
  )

  return {
    graph: { ...args.graph, nodes },
    output: result.content,
    model: client.model,
    providerName: client.providerName,
  }
}
