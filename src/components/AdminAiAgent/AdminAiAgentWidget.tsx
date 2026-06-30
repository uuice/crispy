'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'

import { AiIcon } from '@/components/AdminAi/AiIcon'

import { AdminAiAgentChatPanel } from './AdminAiAgentChatPanel'
import './admin-ai-agent.scss'

export function AdminAiAgentWidget() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <>
      {!open && (
        <button
          aria-label="打开 AI 内容助手"
          className="admin-ai-agent-fab"
          onClick={() => setOpen(true)}
          type="button"
        >
          <AiIcon />
          <span>AI 助手</span>
        </button>
      )}

      {open && (
        <div className="admin-ai-agent-widget">
          <AdminAiAgentChatPanel onClose={() => setOpen(false)} variant="widget" />
        </div>
      )}
    </>,
    document.body,
  )
}

export default AdminAiAgentWidget
