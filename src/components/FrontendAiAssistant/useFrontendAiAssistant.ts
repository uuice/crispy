'use client'

import { useCallback, useState } from 'react'

import type { AgentChatMessage } from '@/ai/agent/types'

import { consumeAgentStream } from '@/components/AdminAiAgent/consumeAgentStream'

export type FrontendAssistantToolActivity = {
  id: string
  name: string
  status: 'running' | 'done' | 'error'
}

export type FrontendAssistantMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  tools?: FrontendAssistantToolActivity[]
  loading?: boolean
}

let messageIdCounter = 0
function nextId(): string {
  messageIdCounter += 1
  return `fe-ai-${messageIdCounter}`
}

export function useFrontendAiAssistant() {
  const [messages, setMessages] = useState<FrontendAssistantMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isLoading) return

      setError(null)
      setIsLoading(true)

      const userMsg: FrontendAssistantMessage = { id: nextId(), role: 'user', content: trimmed }
      const assistantId = nextId()
      const assistantMsg: FrontendAssistantMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        tools: [],
        loading: true,
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])

      const history: AgentChatMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      try {
        const res = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        })

        await consumeAgentStream(res, {
          onText: (_chunk, fullText) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: fullText, loading: false } : m,
              ),
            )
          },
          onToolStart: (id, name) => {
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantId) return m
                const tools = [...(m.tools ?? []), { id, name, status: 'running' as const }]
                return { ...m, tools, loading: true }
              }),
            )
          },
          onToolResult: (id, _name, result) => {
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantId) return m
                const tools = (m.tools ?? []).map((t) =>
                  t.id === id && t.status === 'running'
                    ? {
                        ...t,
                        status: (result as { error?: string })?.error
                          ? ('error' as const)
                          : ('done' as const),
                      }
                    : t,
                )
                return { ...m, tools }
              }),
            )
          },
        })

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, loading: false } : m)),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : '发送失败'
        setError(message)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: message, loading: false } : m,
          ),
        )
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages],
  )

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
