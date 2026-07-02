'use client'

import React, { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Button,
  Drawer,
  DrawerToggler,
  Pill,
  TextInput,
  toast,
  useDrawerSlug,
} from '@payloadcms/ui'

import {
  UNSPLASH_ORIENTATIONS,
  UNSPLASH_STYLES,
  UNSPLASH_TOPICS,
  type UnsplashStyleId,
  type UnsplashTopicId,
} from '@/unsplash/categories'
import type { UnsplashOrientation, UnsplashPhoto, UnsplashSearchResponse } from '@/unsplash/types'

import './index.scss'

const DRAWER_SLUG = 'crispy-unsplash-import'

function isMediaListPath(pathname: string | null): boolean {
  return Boolean(pathname?.includes('/collections/media'))
}

function FilterPills<T extends string>({
  activeId,
  items,
  onChange,
}: {
  activeId: T
  items: ReadonlyArray<{ id: T; label: string }>
  onChange: (id: T) => void
}) {
  return (
    <div className="unsplash-import__filters">
      {items.map((item) => (
        <button
          className={
            item.id === activeId
              ? 'unsplash-import__filter is-active'
              : 'unsplash-import__filter'
          }
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function UnsplashImportDrawerContent({ onImported }: { onImported: () => void }) {
  const [query, setQuery] = useState('')
  const [topicId, setTopicId] = useState<UnsplashTopicId>('all')
  const [styleId, setStyleId] = useState<UnsplashStyleId>('anime')
  const [orientation, setOrientation] = useState<'' | UnsplashOrientation>('')
  const [page, setPage] = useState(1)
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [searching, setSearching] = useState(false)
  const [importingId, setImportingId] = useState<string | null>(null)

  const runSearch = useCallback(
    async (nextPage: number, append: boolean) => {
      setSearching(true)
      try {
        const params = new URLSearchParams({
          q: query.trim(),
          topic: topicId,
          style: styleId,
          page: String(nextPage),
        })
        if (orientation) {
          params.set('orientation', orientation)
        }

        const res = await fetch(`/api/admin/unsplash/search?${params.toString()}`, {
          credentials: 'include',
        })
        const data = (await res.json()) as UnsplashSearchResponse & { error?: string }

        if (!res.ok) {
          throw new Error(data.error ?? '搜索失败')
        }

        setPage(data.page)
        setTotalPages(data.totalPages)
        setPhotos((current) => (append ? [...current, ...data.photos] : data.photos))
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '搜索失败')
      } finally {
        setSearching(false)
      }
    },
    [orientation, query, styleId, topicId],
  )

  const handleSearch = useCallback(() => {
    void runSearch(1, false)
  }, [runSearch])

  const handleTopicChange = useCallback((nextTopicId: UnsplashTopicId) => {
    setTopicId(nextTopicId)
  }, [])

  const handleStyleChange = useCallback((nextStyleId: UnsplashStyleId) => {
    setStyleId(nextStyleId)
  }, [])

  const handleOrientationChange = useCallback((nextOrientation: '' | UnsplashOrientation) => {
    setOrientation(nextOrientation)
  }, [])

  const runSearchRef = useRef(runSearch)
  runSearchRef.current = runSearch

  useEffect(() => {
    void runSearchRef.current(1, false)
  }, [orientation, styleId, topicId])

  const handleImport = useCallback(
    async (photo: UnsplashPhoto) => {
      if (importingId) return

      setImportingId(photo.id)
      try {
        const res = await fetch('/api/admin/unsplash/import', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoId: photo.id,
            downloadLocation: photo.downloadLocation,
            alt: photo.alt,
          }),
        })
        const data = (await res.json()) as { error?: string }

        if (!res.ok) {
          throw new Error(data.error ?? '导入失败')
        }

        toast.success('已导入到媒体库')
        onImported()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '导入失败')
      } finally {
        setImportingId(null)
      }
    },
    [importingId, onImported],
  )

  return (
    <div className="unsplash-import">
      <div className="unsplash-import__section">
        <p className="unsplash-import__label">主题</p>
        <FilterPills activeId={topicId} items={UNSPLASH_TOPICS} onChange={handleTopicChange} />
      </div>

      <div className="unsplash-import__section">
        <p className="unsplash-import__label">风格</p>
        <FilterPills activeId={styleId} items={UNSPLASH_STYLES} onChange={handleStyleChange} />
      </div>

      <div className="unsplash-import__section">
        <p className="unsplash-import__label">比例</p>
        <FilterPills
          activeId={orientation}
          items={UNSPLASH_ORIENTATIONS}
          onChange={handleOrientationChange}
        />
      </div>

      <div className="unsplash-import__search">
        <TextInput
          path="unsplash-query"
          label="关键词（可选）"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleSearch()
            }
          }}
          value={query}
        />
        <Button buttonStyle="primary" disabled={searching} onClick={handleSearch} size="small">
          {searching ? '搜索中…' : '搜索'}
        </Button>
      </div>

      {photos.length > 0 ? (
        <>
          <div className="unsplash-import__grid">
            {photos.map((photo) => (
              <button
                className="unsplash-import__item"
                disabled={importingId === photo.id}
                key={photo.id}
                onClick={() => void handleImport(photo)}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={photo.alt} className="unsplash-import__thumb" src={photo.thumbUrl} />
                <span className="unsplash-import__credit">{photo.photographer}</span>
              </button>
            ))}
          </div>
          {page < totalPages ? (
            <div className="unsplash-import__more">
              <Button
                buttonStyle="secondary"
                disabled={searching}
                onClick={() => void runSearch(page + 1, true)}
                size="small"
              >
                加载更多
              </Button>
            </div>
          ) : null}
        </>
      ) : searching ? (
        <p className="unsplash-import__empty">正在搜索…</p>
      ) : (
        <p className="unsplash-import__empty">选择主题/风格或输入关键词后搜索。</p>
      )}
    </div>
  )
}

export function UnsplashImportPill() {
  const pathname = usePathname()
  const router = useRouter()
  const drawerSlug = useDrawerSlug(DRAWER_SLUG)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!isMediaListPath(pathname)) return

    void fetch('/api/admin/unsplash/status', { credentials: 'include' })
      .then((res) => res.json())
      .then((data: { enabled?: boolean }) => setEnabled(Boolean(data.enabled)))
      .catch(() => setEnabled(false))
  }, [pathname])

  if (!isMediaListPath(pathname) || !enabled) {
    return null
  }

  return (
    <>
      <DrawerToggler slug={drawerSlug}>
        <Pill className="unsplash-import__pill" pillStyle="light" size="small">
          Unsplash
        </Pill>
      </DrawerToggler>
      <Drawer slug={drawerSlug} title="从 Unsplash 导入">
        <UnsplashImportDrawerContent onImported={() => router.refresh()} />
      </Drawer>
    </>
  )
}
