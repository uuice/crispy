'use client'

import React, { useCallback, useEffect, useState } from 'react'

import type { CanvasGraph } from '@/ai/canvas/types'
import { AdminAiCanvasEditor } from '@/components/AdminAiCanvases/AdminAiCanvasEditor'
import '@/components/AdminAiCanvases/admin-ai-canvases.scss'

type CanvasSummary = {
  id: string | number
  title: string
  updatedAt: string
}

type CanvasDoc = CanvasSummary & { graph: CanvasGraph }

function readCanvasIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('id')
}

function setCanvasIdInUrl(id: string | null) {
  const url = new URL(window.location.href)
  if (id) url.searchParams.set('id', id)
  else url.searchParams.delete('id')
  window.history.replaceState({}, '', url.toString())
}

export function AdminAiCanvasesApp() {
  const [canvases, setCanvases] = useState<CanvasSummary[]>([])
  const [active, setActive] = useState<CanvasDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const loadList = useCallback(async () => {
    const res = await fetch('/api/ai/canvases', { credentials: 'include' })
    const data = (await res.json()) as { canvases?: CanvasSummary[]; error?: string }
    if (!res.ok) throw new Error(data.error || '加载失败')
    setCanvases(data.canvases ?? [])
  }, [])

  const openCanvas = useCallback(async (id: string | number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/ai/canvases/${id}`, { credentials: 'include' })
      const data = (await res.json()) as { canvas?: CanvasDoc; error?: string }
      if (!res.ok || !data.canvas) throw new Error(data.error || '打开失败')
      setActive(data.canvas)
      setCanvasIdInUrl(String(data.canvas.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '打开失败')
      setActive(null)
      setCanvasIdInUrl(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        await loadList()
        const id = readCanvasIdFromUrl()
        if (id) await openCanvas(id)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    })()
  }, [loadList, openCanvas])

  const createCanvas = useCallback(async () => {
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/canvases', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = (await res.json()) as { canvas?: CanvasDoc; error?: string }
      if (!res.ok || !data.canvas) throw new Error(data.error || '创建失败')
      await loadList()
      setActive(data.canvas)
      setCanvasIdInUrl(String(data.canvas.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败')
    } finally {
      setCreating(false)
    }
  }, [loadList])

  const backToList = useCallback(() => {
    setActive(null)
    setCanvasIdInUrl(null)
    void loadList()
  }, [loadList])

  if (active) {
    return (
      <AdminAiCanvasEditor
        key={String(active.id)}
        canvasId={String(active.id)}
        initialTitle={active.title}
        initialGraph={active.graph}
        onBack={backToList}
        onDeleted={backToList}
      />
    )
  }

  return (
    <div className="ai-canvas-list">
      <div className="ai-canvas-list__header">
        <p className="ai-canvas-list__intro">
          按账号隔离：你只能看到自己的画布；可创建多份。每个 Prompt 节点可绑模板并运行（走 resolveLlmClient）。
        </p>
        <button
          type="button"
          className="ai-canvas-btn ai-canvas-btn--primary"
          disabled={creating}
          onClick={() => void createCanvas()}
        >
          {creating ? '创建中…' : '新建画布'}
        </button>
      </div>

      {error ? <p className="ai-canvas-list__error">{error}</p> : null}
      {loading ? <p className="ai-canvas-list__empty">加载中…</p> : null}

      {!loading && !canvases.length ? (
        <p className="ai-canvas-list__empty">还没有画布，点「新建画布」开始。</p>
      ) : null}

      <ul className="ai-canvas-list__items">
        {canvases.map((c) => (
          <li key={String(c.id)}>
            <button type="button" className="ai-canvas-list__item" onClick={() => void openCanvas(c.id)}>
              <span className="ai-canvas-list__item-title">{c.title}</span>
              <span className="ai-canvas-list__item-meta">
                更新于 {new Date(c.updatedAt).toLocaleString('zh-CN')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
