'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { AiIcon } from '@/components/AiIcon'
import { frontendLabels } from '@/i18n/frontend-labels'

import type { FrontendAssistantMessage } from './useFrontendAiAssistant'
import { useFrontendAiAssistant } from './useFrontendAiAssistant'

import './frontend-ai-assistant.scss'

const TOOL_LABELS: Record<string, string> = {
  search_content: frontendLabels.aiAssistant.searchContent,
  keyword_search: frontendLabels.aiAssistant.searchContent,
  list_content: frontendLabels.aiAssistant.listContent,
  get_content: frontendLabels.aiAssistant.getContent,
  semantic_search: frontendLabels.aiAssistant.semanticSearch,
}

function renderAssistantContent(content: string) {
  const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (!match) {
      return <React.Fragment key={index}>{part}</React.Fragment>
    }

    return (
      <Link href={match[2]} key={index}>
        {match[1]}
      </Link>
    )
  })
}

type PanelProps = {
  onClose: () => void
  messages: FrontendAssistantMessage[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

function ChatPanel({ onClose, messages, isLoading, sendMessage, clearMessages }: PanelProps) {
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      const text = input.trim()
      if (!text) return
      setInput('')
      await sendMessage(text)
    },
    [input, sendMessage],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void handleSubmit()
      }
    },
    [handleSubmit],
  )

  return (
    <div className="frontend-ai-assistant">
      <header className="frontend-ai-assistant__header">
        <div className="frontend-ai-assistant__title">
          <AiIcon />
          <span>{frontendLabels.aiAssistant.title}</span>
        </div>
        <div className="frontend-ai-assistant__actions">
          <button
            className="frontend-ai-assistant__action-btn"
            disabled={messages.length === 0 || isLoading}
            onClick={clearMessages}
            type="button"
          >
            {frontendLabels.aiAssistant.clear}
          </button>
          <button
            aria-label={frontendLabels.aiAssistant.close}
            className="frontend-ai-assistant__action-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>
      </header>

      <div ref={listRef} className="frontend-ai-assistant__messages">
        {messages.length === 0 ? (
          <div className="frontend-ai-assistant__empty">
            <p>{frontendLabels.aiAssistant.intro}</p>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>

      <form className="frontend-ai-assistant__input-area" onSubmit={handleSubmit}>
        <textarea
          className="frontend-ai-assistant__input"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={frontendLabels.aiAssistant.placeholder}
          rows={2}
          value={input}
        />
        <button
          className="frontend-ai-assistant__send"
          disabled={!input.trim() || isLoading}
          type="submit"
        >
          {frontendLabels.aiAssistant.send}
        </button>
      </form>
    </div>
  )
}

function MessageBubble({ message }: { message: FrontendAssistantMessage }) {
  return (
    <div className={`frontend-ai-assistant__message frontend-ai-assistant__message--${message.role}`}>
      {message.tools && message.tools.length > 0 ? (
        <div className="frontend-ai-assistant__tools">
          {message.tools.map((tool) => (
            <span
              className={`frontend-ai-assistant__tool frontend-ai-assistant__tool--${tool.status}`}
              key={tool.id}
            >
              {TOOL_LABELS[tool.name] ?? tool.name}
            </span>
          ))}
        </div>
      ) : null}
      {message.content ? (
        <div className="frontend-ai-assistant__bubble">
          {message.role === 'assistant'
            ? renderAssistantContent(message.content)
            : message.content}
        </div>
      ) : null}
      {message.loading ? (
        <div className="frontend-ai-assistant__bubble frontend-ai-assistant__bubble--loading">
          <span className="frontend-ai-assistant__dots">{frontendLabels.aiAssistant.thinking}</span>
        </div>
      ) : null}
    </div>
  )
}

export function FrontendAiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [available, setAvailable] = useState(false)
  const [mounted, setMounted] = useState(false)
  const chat = useFrontendAiAssistant()

  useEffect(() => {
    setMounted(true)
    void fetch('/api/ai/assistant')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { available?: boolean } | null) => {
        setAvailable(Boolean(data?.available))
      })
      .catch(() => setAvailable(false))
  }, [])

  if (!mounted || !available) return null

  return (
    <>
      {!isOpen ? (
        <button
          aria-label={frontendLabels.aiAssistant.open}
          className="frontend-ai-assistant-fab"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <AiIcon />
          <span>{frontendLabels.aiAssistant.title}</span>
        </button>
      ) : (
        <button
          aria-label={frontendLabels.aiAssistant.close}
          className="frontend-ai-assistant-backdrop"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      )}

      <div
        aria-hidden={!isOpen}
        className={`frontend-ai-assistant-drawer${isOpen ? ' frontend-ai-assistant-drawer--open' : ''}`}
      >
        {isOpen ? (
          <ChatPanel
            clearMessages={chat.clearMessages}
            isLoading={chat.isLoading}
            messages={chat.messages}
            onClose={() => setIsOpen(false)}
            sendMessage={chat.sendMessage}
          />
        ) : null}
      </div>
    </>
  )
}
