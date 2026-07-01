import type { NextRequest } from 'next/server'

import {
  DEFAULT_CACHE_SETTINGS,
  type ResolvedCacheSettings,
} from '@/frontend-cache/settings'

type MiddlewareCacheSettings = ResolvedCacheSettings & {
  exposeCacheHeaders: boolean
}

let cachedSettings: MiddlewareCacheSettings | null = null
let cachedAt = 0

const SETTINGS_TTL_MS = 60_000

export async function getMiddlewareCacheSettings(
  requestUrl: string,
): Promise<MiddlewareCacheSettings> {
  if (cachedSettings && Date.now() - cachedAt < SETTINGS_TTL_MS) {
    return cachedSettings
  }

  try {
    const url = new URL('/api/internal/cache-settings', requestUrl)
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) throw new Error('cache settings fetch failed')
    const data = (await response.json()) as MiddlewareCacheSettings
    cachedSettings = {
      cachingEnabled: data.cachingEnabled ?? DEFAULT_CACHE_SETTINGS.cachingEnabled,
      pageRevalidateSeconds:
        data.pageRevalidateSeconds ?? DEFAULT_CACHE_SETTINGS.pageRevalidateSeconds,
      dataCacheRevalidateSeconds:
        data.dataCacheRevalidateSeconds ?? DEFAULT_CACHE_SETTINGS.dataCacheRevalidateSeconds,
      exposeCacheHeaders: data.exposeCacheHeaders ?? true,
    }
    cachedAt = Date.now()
    return cachedSettings
  } catch {
    return {
      ...DEFAULT_CACHE_SETTINGS,
      exposeCacheHeaders: true,
    }
  }
}

export function shouldBypassFrontendCache(request: NextRequest): boolean {
  if (request.nextUrl.searchParams.has('nocache')) return true
  if (request.cookies.has('__prerender_bypass')) return true
  if (request.cookies.has('__next_preview_data')) return true
  return false
}

export function isFrontendDocumentRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin')) return false
  if (pathname.startsWith('/api')) return false
  if (pathname.startsWith('/_next')) return false
  if (pathname.includes('.')) return false
  return request.method === 'GET' || request.method === 'HEAD'
}
