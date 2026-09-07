'use client'

import { useAuth } from '@payloadcms/ui'
import React from 'react'
import { createPortal } from 'react-dom'

import { type AuthzUserShape, userHasPermissionSync } from '@/access/can'
import { AiIcon } from '@/components/AiIcon'
import { useIsClient } from '@/utilities/useIsClient'

import { useAdminAiAgent } from './AdminAiAgentContext'
import { AdminAiAgentChatPanel } from './AdminAiAgentChatPanel'
import './admin-ai-agent.scss'

export function AdminAiAgentWidget() {
  const { user } = useAuth()
  const { isOpen, setIsOpen, toggleOpen } = useAdminAiAgent()
  const mounted = useIsClient()

  if (!mounted) return null
  if (!userHasPermissionSync(user as AuthzUserShape, 'ai:use')) return null

  return createPortal(
    <>
      {!isOpen && (
        <button
          aria-label="打开 AI 内容助手"
          className="admin-ai-agent-rail"
          onClick={toggleOpen}
          type="button"
        >
          <AiIcon />
          <span className="admin-ai-agent-rail__label">AI 助手</span>
        </button>
      )}

      {isOpen && (
        <button
          aria-label="关闭 AI 内容助手"
          className="admin-ai-agent-backdrop"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      )}

      <div
        aria-hidden={!isOpen}
        className={`admin-ai-agent-drawer${isOpen ? ' admin-ai-agent-drawer--open' : ''}`}
      >
        <AdminAiAgentChatPanel onClose={() => setIsOpen(false)} variant="widget" />
      </div>
    </>,
    document.body,
  )
}

export default AdminAiAgentWidget
