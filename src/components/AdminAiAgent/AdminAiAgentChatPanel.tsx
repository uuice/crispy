'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { AiIcon } from '@/components/AdminAi/AiIcon'

import type { AgentDisplayMessage } from './useAiAgentChat'
import { useAdminAiAgent } from './AdminAiAgentContext'
import { AgentStockImageResults } from './AgentStockImageResults'
import type { AgentStockImage } from '@/ai/agent/stockImages'
import './admin-ai-agent.scss'

const TOOL_LABELS: Record<string, string> = {
  list_resources: '列出资源',
  describe_resource: '查看字段结构',
  semantic_search: '语义搜索',
  find_documents: '查询文档',
  get_document: '获取详情',
  create_document: '新建文档',
  update_document: '更新文档',
  delete_document: '删除文档',
  search_stock_images: '检索图片',
  import_stock_image: '导入图片',
  get_global: '读取全局配置',
  update_global: '更新全局配置',
}

function toolLabel(name: string): string {
  return TOOL_LABELS[name] ?? name
}

type ChatPanelProps = {
  variant?: 'widget' | 'page'
  onClose?: () => void
}

export function AdminAiAgentChatPanel({ variant = 'widget', onClose }: ChatPanelProps) {
  const {
    messages,
    sessionId,
    sessions,
    isLoading,
    isLoadingSessions,
    sendMessage,
    loadSession,
    startNewSession,
    deleteSession,
    formatSessionTime,
  } = useAdminAiAgent()
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(variant === 'page')
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

  const handleDeleteSession = useCallback(
    async (id: string | number, e: React.MouseEvent) => {
      e.stopPropagation()
      if (!window.confirm('确定删除这条会话记录？')) return
      try {
        await deleteSession(id)
      } catch {
        window.alert('删除失败')
      }
    },
    [deleteSession],
  )

  return (
    <div className={`admin-ai-agent-layout admin-ai-agent-layout--${variant}`}>
      {(variant === 'page' || showHistory) && (
        <aside className="admin-ai-agent-sidebar">
          <div className="admin-ai-agent-sidebar__header">
            <span>历史会话</span>
            <button
              className="admin-ai-agent__action-btn"
              disabled={isLoading}
              onClick={startNewSession}
              type="button"
            >
              新对话
            </button>
          </div>
          <div className="admin-ai-agent-sidebar__list">
            {isLoadingSessions && sessions.length === 0 && (
              <p className="admin-ai-agent-sidebar__empty">加载中…</p>
            )}
            {!isLoadingSessions && sessions.length === 0 && (
              <p className="admin-ai-agent-sidebar__empty">暂无历史会话</p>
            )}
            {sessions.map((session) => (
              <button
                key={String(session.id)}
                className={`admin-ai-agent-sidebar__item${
                  sessionId === session.id ? ' admin-ai-agent-sidebar__item--active' : ''
                }`}
                onClick={() => void loadSession(session.id)}
                type="button"
              >
                <span className="admin-ai-agent-sidebar__item-title">{session.title}</span>
                <span className="admin-ai-agent-sidebar__item-meta">
                  {formatSessionTime(session.lastMessageAt)} · {session.messageCount} 条
                </span>
                <span
                  aria-label="删除会话"
                  className="admin-ai-agent-sidebar__item-delete"
                  onClick={(e) => void handleDeleteSession(session.id, e)}
                  role="button"
                  tabIndex={0}
                >
                  ✕
                </span>
              </button>
            ))}
          </div>
        </aside>
      )}

      <div className={`admin-ai-agent admin-ai-agent--${variant}`}>
        <header className="admin-ai-agent__header">
          <div className="admin-ai-agent__title">
            <AiIcon />
            <span>AI 内容助手</span>
          </div>
          <div className="admin-ai-agent__actions">
            {variant === 'widget' && (
              <button
                className="admin-ai-agent__action-btn"
                onClick={() => setShowHistory((v) => !v)}
                type="button"
              >
                {showHistory ? '隐藏历史' : '历史'}
              </button>
            )}
            <button
              className="admin-ai-agent__action-btn"
              disabled={isLoading}
              onClick={startNewSession}
              title="开始新对话"
              type="button"
            >
              新对话
            </button>
            {onClose && (
              <button
                className="admin-ai-agent__action-btn"
                onClick={onClose}
                title="关闭面板（保留当前对话）"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        <div ref={listRef} className="admin-ai-agent__messages">
          {messages.length === 0 && (
            <div className="admin-ai-agent__empty">
              <p>你好！我是 Crispy CMS 的全局 AI 助手。</p>
              <p>对话会自动保存，可在左侧查看历史会话。</p>
              <ul>
                <li>列出最近发布的 5 篇文章</li>
                <li>把某篇文章的标题改为「…」</li>
                <li>新建一个标签「前端」</li>
                <li>查看站点设置中的站点名称</li>
                <li>帮我找 5 张赛博朋克风格的横图，我看中了再加到媒体</li>
              </ul>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        <form className="admin-ai-agent__input-area" onSubmit={handleSubmit}>
          <textarea
            className="admin-ai-agent__input"
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入指令，例如：列出所有分类…"
            rows={variant === 'page' ? 3 : 2}
            value={input}
          />
          <button
            className="admin-ai-agent__send"
            disabled={isLoading || !input.trim()}
            type="submit"
          >
            {isLoading ? '处理中…' : '发送'}
          </button>
        </form>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: AgentDisplayMessage }) {
  return (
    <div className={`admin-ai-agent__message admin-ai-agent__message--${message.role}`}>
      {message.tools && message.tools.length > 0 && (
        <div className="admin-ai-agent__tools">
          {message.tools.map((tool) => (
            <div
              key={tool.id ?? `${tool.name}-${tool.status}`}
              className={`admin-ai-agent__tool admin-ai-agent__tool--${tool.status}`}
            >
              <span className="admin-ai-agent__tool-icon">
                {tool.status === 'running' ? '⏳' : tool.status === 'error' ? '✗' : '✓'}
              </span>
              <span>{toolLabel(tool.name)}</span>
            </div>
          ))}
        </div>
      )}
      {message.tools?.map((tool) => {
        if (tool.name !== 'search_stock_images' || tool.status !== 'done' || !tool.result) {
          return null
        }

        const result = tool.result as {
          photos?: AgentStockImage[]
          query?: string
          error?: string
        }

        if (result.error || !result.photos?.length) {
          return null
        }

        return (
          <AgentStockImageResults
            key={`stock-${tool.id}`}
            photos={result.photos}
            query={result.query}
          />
        )
      })}
      {message.content && (
        <div className="admin-ai-agent__bubble">
          {message.content.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}
      {message.loading && !message.content && (
        <div className="admin-ai-agent__bubble admin-ai-agent__bubble--loading">
          <span className="admin-ai-agent__dots">思考中</span>
        </div>
      )}
    </div>
  )
}

export default AdminAiAgentChatPanel
