import { describe, expect, it } from 'vitest'

import {
  MAX_AGENT_HISTORY_MESSAGES,
  MAX_AGENT_MESSAGE_CHARS,
  trimAgentMessageContent,
  trimAgentMessages,
} from '@/ai/agent/trimMessages'

describe('trimAgentMessages', () => {
  it('truncates oversized message bodies', () => {
    const long = 'x'.repeat(MAX_AGENT_MESSAGE_CHARS + 100)
    const result = trimAgentMessageContent(long)
    expect(result.length).toBeLessThan(long.length)
    expect(result).toContain('已截断')
  })

  it('keeps only the most recent turns', () => {
    const messages = Array.from({ length: MAX_AGENT_HISTORY_MESSAGES + 5 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `message-${i}`,
    }))

    const trimmed = trimAgentMessages(messages)
    expect(trimmed).toHaveLength(MAX_AGENT_HISTORY_MESSAGES)
    expect(trimmed[0]?.content).toBe(`message-${5}`)
    expect(trimmed.at(-1)?.content).toBe(`message-${MAX_AGENT_HISTORY_MESSAGES + 4}`)
  })
})
