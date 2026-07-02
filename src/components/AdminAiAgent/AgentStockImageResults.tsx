'use client'

import React, { useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import type { AgentStockImage } from '@/ai/agent/stockImages'

type Props = {
  photos: AgentStockImage[]
  query?: string
}

type ImportState = 'idle' | 'loading' | 'done' | 'error'

export function AgentStockImageResults({ photos, query }: Props) {
  const [states, setStates] = useState<Record<string, ImportState>>({})
  const [mediaIds, setMediaIds] = useState<Record<string, string | number>>({})

  const handleImport = useCallback(async (photo: AgentStockImage) => {
    setStates((current) => ({ ...current, [photo.photoId]: 'loading' }))

    try {
      const res = await fetch('/api/admin/unsplash/import', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoId: photo.photoId,
          downloadLocation: photo.downloadLocation,
          alt: photo.alt,
        }),
      })
      const data = (await res.json()) as { error?: string; doc?: { id?: string | number } }

      if (!res.ok) {
        throw new Error(data.error ?? '导入失败')
      }

      setStates((current) => ({ ...current, [photo.photoId]: 'done' }))
      if (data.doc?.id != null) {
        setMediaIds((current) => ({ ...current, [photo.photoId]: data.doc!.id! }))
      }
      toast.success(`已加入媒体库（ID: ${data.doc?.id ?? '—'}）`)
    } catch (error) {
      setStates((current) => ({ ...current, [photo.photoId]: 'error' }))
      toast.error(error instanceof Error ? error.message : '导入失败')
    }
  }, [])

  if (photos.length === 0) {
    return null
  }

  return (
    <div className="admin-ai-agent__stock-results">
      {query ? <p className="admin-ai-agent__stock-query">搜索：{query}</p> : null}
      <p className="admin-ai-agent__stock-hint">点击「加入图库」将图片导入 media 媒体库</p>
      <div className="admin-ai-agent__stock-grid">
        {photos.map((photo) => {
          const state = states[photo.photoId] ?? 'idle'
          const mediaId = mediaIds[photo.photoId]

          return (
            <div className="admin-ai-agent__stock-card" key={photo.photoId}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={photo.alt} className="admin-ai-agent__stock-thumb" src={photo.thumbUrl} />
              <div className="admin-ai-agent__stock-meta">
                <span className="admin-ai-agent__stock-alt" title={photo.alt}>
                  {photo.alt}
                </span>
                <span className="admin-ai-agent__stock-author">{photo.photographer}</span>
              </div>
              <button
                className="admin-ai-agent__stock-import"
                disabled={state === 'loading' || state === 'done'}
                onClick={() => void handleImport(photo)}
                type="button"
              >
                {state === 'loading'
                  ? '导入中…'
                  : state === 'done'
                    ? mediaId != null
                      ? `已加入 #${mediaId}`
                      : '已加入图库'
                    : state === 'error'
                      ? '重试导入'
                      : '加入图库'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
