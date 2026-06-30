export type StoredAgentToolActivity = {
  id?: string
  name: string
  status: 'running' | 'done' | 'error'
  args?: Record<string, unknown>
  result?: unknown
}

export type StoredAgentMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  tools?: StoredAgentToolActivity[]
  createdAt: string
}

export type AiChatSessionSummary = {
  id: string | number
  title: string
  lastMessageAt: string
  updatedAt: string
  messageCount: number
}

export type AiChatSessionDetail = AiChatSessionSummary & {
  messages: StoredAgentMessage[]
}

export function storedMessageToDisplay(msg: StoredAgentMessage) {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    tools: msg.tools?.map((t, index) => ({
      id: t.id ?? `legacy-tool-${index}`,
      name: t.name,
      status: t.status === 'running' ? ('done' as const) : t.status,
      args: t.args,
      result: t.result,
    })),
  }
}
