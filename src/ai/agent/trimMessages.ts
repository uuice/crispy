import type { AgentChatMessage } from '@/ai/agent/types'

/** Max user/assistant turns sent to the LLM (excluding system prompt). */
export const MAX_AGENT_HISTORY_MESSAGES = 24

/** Truncate a single message body to avoid blowing context on huge tool summaries. */
export const MAX_AGENT_MESSAGE_CHARS = 8_000

export function trimAgentMessageContent(content: string): string {
  const trimmed = content.trim()
  if (trimmed.length <= MAX_AGENT_MESSAGE_CHARS) return trimmed
  return `${trimmed.slice(0, MAX_AGENT_MESSAGE_CHARS)}…（已截断，共 ${trimmed.length} 字符）`
}

/** Keep the most recent turns; always preserve the latest user message. */
export function trimAgentMessages(messages: AgentChatMessage[]): AgentChatMessage[] {
  const conversational = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ ...m, content: trimAgentMessageContent(m.content) }))

  if (conversational.length <= MAX_AGENT_HISTORY_MESSAGES) {
    return conversational
  }

  return conversational.slice(-MAX_AGENT_HISTORY_MESSAGES)
}
