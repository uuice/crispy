'use client'

import { useAuth } from '@payloadcms/ui'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { AgentChatMessage } from '@/ai/agent/types'
import type { AiChatSessionSummary } from '@/ai/agent/sessionTypes'
import { storedMessageToDisplay } from '@/ai/agent/sessionTypes'

import { consumeAgentStream } from './consumeAgentStream'

export type AgentToolActivity = {
  id: string
  name: string
  status: 'running' | 'done' | 'error'
  args?: Record<string, unknown>
  result?: unknown
}

export type AgentDisplayMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  tools?: AgentToolActivity[]
  loading?: boolean
}

let messageIdCounter = 0
function nextId(): string {
  messageIdCounter += 1
  return `msg-local-${messageIdCounter}`
}

function formatSessionTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function useAiAgentChat() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [messages, setMessages] = useState<AgentDisplayMessage[]>([])
  const [sessionId, setSessionId] = useState<string | number | null>(null)
  const [sessions, setSessions] = useState<AiChatSessionSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Avoid treating a failed pre-login fetch as a successful empty list. */
  const sessionsFetchedForUserRef = useRef<string | number | null>(null)

  const refreshSessions = useCallback(async () => {
    if (!userId) {
      setSessions([])
      sessionsFetchedForUserRef.current = null
      return
    }

    setIsLoadingSessions(true)
    try {
      const res = await fetch('/api/ai/agent/sessions', { credentials: 'include' })
      if (!res.ok) {
        // Keep previous list on transient errors after a successful fetch.
        if (sessionsFetchedForUserRef.current !== userId) {
          setSessions([])
        }
        return
      }
      const data = (await res.json()) as { sessions: AiChatSessionSummary[] }
      setSessions(data.sessions ?? [])
      sessionsFetchedForUserRef.current = userId
    } catch {
      if (sessionsFetchedForUserRef.current !== userId) {
        setSessions([])
      }
    } finally {
      setIsLoadingSessions(false)
    }
  }, [userId])

  // Providers mount on the login page too; re-fetch once auth user is available.
  useEffect(() => {
    void refreshSessions()
  }, [refreshSessions])

  const loadSession = useCallback(async (id: string | number) => {
    setError(null)
    setIsLoadingSession(true)
    setMessages([])
    setSessionId(id)
    try {
      const res = await fetch(`/api/ai/agent/sessions/${id}`, { credentials: 'include' })
      if (!res.ok) {
        throw new Error('加载会话失败')
      }
      const data = (await res.json()) as {
        session: { id: string | number; messages: Parameters<typeof storedMessageToDisplay>[0][] }
      }
      setSessionId(data.session.id)
      setMessages(data.session.messages.map((m) => storedMessageToDisplay(m)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载会话失败')
      setMessages([])
    } finally {
      setIsLoadingSession(false)
    }
  }, [])

  const startNewSession = useCallback(() => {
    setSessionId(null)
    setMessages([])
    setError(null)
  }, [])

  const deleteSession = useCallback(
    async (id: string | number) => {
      const res = await fetch(`/api/ai/agent/sessions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('删除会话失败')
      }
      if (String(sessionId) === String(id)) {
        startNewSession()
      }
      await refreshSessions()
    },
    [refreshSessions, sessionId, startNewSession],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isLoading) return

      setError(null)
      setIsLoading(true)

      const userMsg: AgentDisplayMessage = { id: nextId(), role: 'user', content: trimmed }
      const assistantId = nextId()
      const assistantMsg: AgentDisplayMessage = {
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

      let activeSessionId = sessionId

      try {
        const res = await fetch('/api/ai/agent', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: activeSessionId ?? undefined,
            messages: history,
          }),
        })

        await consumeAgentStream(res, {
          onSession: (id) => {
            activeSessionId = id
            setSessionId(id)
          },
          onText: (_chunk, fullText) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: fullText, loading: false } : m,
              ),
            )
          },
          onToolStart: (id, name, args) => {
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantId) return m
                const tools = [...(m.tools ?? []), { id, name, status: 'running' as const, args }]
                return { ...m, tools, loading: true }
              }),
            )
          },
          onToolResult: (id, name, result) => {
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
                        result,
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
        await refreshSessions()
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
    [isLoading, messages, refreshSessions, sessionId],
  )

  return {
    messages,
    sessionId,
    sessions,
    isLoading,
    isLoadingSession,
    isLoadingSessions,
    error,
    sendMessage,
    loadSession,
    startNewSession,
    deleteSession,
    refreshSessions,
    formatSessionTime,
  }
}
