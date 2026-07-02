'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { toast } from '@payloadcms/ui'

import type { AgentStockImage } from '@/ai/agent/stockImages'

type Props = {
  photos: AgentStockImage[]
  query?: string
  limit?: number
}

type ImportState = 'idle' | 'loading' | 'done' | 'error'

async function importPhoto(photo: AgentStockImage): Promise<string | number> {
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

  if (data.doc?.id == null) {
    throw new Error('导入失败：未返回 media ID')
  }

  return data.doc.id
}

export function AgentStockImageResults({ photos, query, limit }: Props) {
  const [states, setStates] = useState<Record<string, ImportState>>({})
  const [mediaIds, setMediaIds] = useState<Record<string, string | number>>({})
  const [bulkLoading, setBulkLoading] = useState(false)

  const pendingPhotos = useMemo(
    () => photos.filter((photo) => (states[photo.photoId] ?? 'idle') !== 'done'),
    [photos, states],
  )

  const handleImport = useCallback(async (photo: AgentStockImage) => {
    setStates((current) => ({ ...current, [photo.photoId]: 'loading' }))

    try {
      const mediaId = await importPhoto(photo)
      setStates((current) => ({ ...current, [photo.photoId]: 'done' }))
      setMediaIds((current) => ({ ...current, [photo.photoId]: mediaId }))
      toast.success(`已加入媒体库（ID: ${mediaId}）`)
    } catch (error) {
      setStates((current) => ({ ...current, [photo.photoId]: 'error' }))
      toast.error(error instanceof Error ? error.message : '导入失败')
    }
  }, [])

  const handleImportAll = useCallback(async () => {
    if (bulkLoading || pendingPhotos.length === 0) return

    setBulkLoading(true)
    let success = 0

    try {
      for (const photo of pendingPhotos) {
        setStates((current) => ({ ...current, [photo.photoId]: 'loading' }))
        try {
          const mediaId = await importPhoto(photo)
          setStates((current) => ({ ...current, [photo.photoId]: 'done' }))
          setMediaIds((current) => ({ ...current, [photo.photoId]: mediaId }))
          success += 1
        } catch (error) {
          setStates((current) => ({ ...current, [photo.photoId]: 'error' }))
          toast.error(
            `${photo.alt || photo.photoId}：${error instanceof Error ? error.message : '导入失败'}`,
          )
        }
      }

      if (success > 0) {
        toast.success(`已导入 ${success} 张到媒体库`)
      }
    } finally {
      setBulkLoading(false)
    }
  }, [bulkLoading, pendingPhotos])

  if (photos.length === 0) {
    return null
  }

  return (
    <div className="admin-ai-agent__stock-results">
      <div className="admin-ai-agent__stock-header">
        <p className="admin-ai-agent__stock-query">
          {query ? `搜索：${query} · ` : ''}共 {photos.length} 张
          {limit != null && limit !== photos.length ? `（请求 ${limit} 张）` : ''}
        </p>
        {pendingPhotos.length > 1 ? (
          <button
            className="admin-ai-agent__stock-import-all"
            disabled={bulkLoading}
            onClick={() => void handleImportAll()}
            type="button"
          >
            {bulkLoading ? '批量导入中…' : `全部加入图库（${pendingPhotos.length}）`}
          </button>
        ) : null}
      </div>
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
                disabled={state === 'loading' || state === 'done' || bulkLoading}
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
