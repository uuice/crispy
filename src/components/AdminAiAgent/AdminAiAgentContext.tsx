'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useAiAgentChat } from './useAiAgentChat'

type ChatState = ReturnType<typeof useAiAgentChat>

type AdminAiAgentContextValue = ChatState & {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleOpen: () => void
}

const AdminAiAgentContext = createContext<AdminAiAgentContextValue | null>(null)

export function AdminAiAgentContextProvider({ children }: { children: React.ReactNode }) {
  const chat = useAiAgentChat()
  const [isOpen, setIsOpen] = useState(false)
  const wasOpenRef = useRef(false)
  const toggleOpen = useCallback(() => setIsOpen((open) => !open), [])

  // Refresh history when the floating drawer opens (covers post-login / stale list).
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      void chat.refreshSessions()
    }
    wasOpenRef.current = isOpen
  }, [isOpen, chat.refreshSessions])

  return (
    <AdminAiAgentContext.Provider value={{ ...chat, isOpen, setIsOpen, toggleOpen }}>
      {children}
    </AdminAiAgentContext.Provider>
  )
}

export function useAdminAiAgent(): AdminAiAgentContextValue {
  const ctx = useContext(AdminAiAgentContext)
  if (!ctx) {
    throw new Error('useAdminAiAgent must be used within AdminAiAgentContextProvider')
  }
  return ctx
}
