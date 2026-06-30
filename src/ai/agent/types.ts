export type AgentChatRole = 'user' | 'assistant' | 'system' | 'tool'

export type AgentChatMessage = {
  role: AgentChatRole
  content: string
  /** Present on assistant messages that invoked tools */
  toolCalls?: AgentToolCall[]
  /** Present on tool result messages */
  toolCallId?: string
  name?: string
}

export type AgentToolCall = {
  id: string
  name: string
  arguments: string
}

export type AgentChatRequest = {
  messages: AgentChatMessage[]
  sessionId?: string | number
}

export type AgentStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'tool_start'; id: string; name: string; args: Record<string, unknown> }
  | { type: 'tool_result'; id: string; name: string; result: unknown }
  | { type: 'session'; sessionId: string | number }
  | { type: 'error'; error: string }
  | { type: 'done' }

export type AgentManagedCollection = {
  slug: string
  label: string
  description: string
}

export type AgentManagedGlobal = {
  slug: string
  label: string
  description: string
}
