import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { after } from 'next/server'

import { applyCrispyCacheHeaders } from '@/frontend-cache/headers'
import {
  CRISPY_CACHE_INTERNAL_HEADER,
  getCrispyCacheInternalSecret,
  isValidCrispyCacheInternalHeader,
} from '@/frontend-cache/internalAuth'
import {
  getMiddlewareCacheSettings,
  isFrontendDocumentRequest,
  shouldBypassFrontendCache,
} from '@/frontend-cache/middlewareCache'
import type { CrispyCacheStatus } from '@/frontend-cache/headers'
import { detectApiAuthType } from '@/utilities/detectApiAuthType'

const SKIP_PREFIXES = ['/api/internal/access-log', '/api/ai/', '/api/media/file', '/api/openapi']

type RouteCacheLookupResult = {
  status: CrispyCacheStatus
  html?: string
  contentType?: string
  statusCode?: number
}

function shouldLogApiRequest(pathname: string): boolean {
  if (!pathname.startsWith('/api/')) return false
  return !SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function resolveClientIp(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null
  )
}

function isInternalCacheCaptureRequest(request: NextRequest): boolean {
  return isValidCrispyCacheInternalHeader(request.headers.get(CRISPY_CACHE_INTERNAL_HEADER))
}

async function resolveRouteCacheViaApi(
  request: NextRequest,
  settings: {
    pageRevalidateSeconds: number
    cachingEnabled: boolean
  },
  bypass: boolean,
): Promise<RouteCacheLookupResult> {
  try {
    const url = new URL('/api/internal/route-cache-touch', request.url)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routePath: request.nextUrl.pathname,
        ttlSeconds: settings.pageRevalidateSeconds,
        cachingEnabled: settings.cachingEnabled,
        bypass,
      }),
      cache: 'no-store',
    })

    if (!response.ok) return { status: 'BYPASS' }

    return (await response.json()) as RouteCacheLookupResult
  } catch {
    return { status: 'BYPASS' }
  }
}

function buildCachedHtmlResponse(
  request: NextRequest,
  lookup: RouteCacheLookupResult,
  settings: {
    pageRevalidateSeconds: number
    cachingEnabled: boolean
  },
): NextResponse {
  const statusCode = lookup.statusCode ?? 200
  const contentType = lookup.contentType ?? 'text/html; charset=utf-8'
  const body = request.method === 'HEAD' ? null : (lookup.html ?? '')

  const response = new NextResponse(body, {
    status: statusCode,
    headers: {
      'Content-Type': contentType,
    },
  })

  applyCrispyCacheHeaders(response.headers, {
    pageStatus: lookup.status,
    dataStatus: lookup.status,
    ttlSeconds: settings.pageRevalidateSeconds,
    cachingEnabled: settings.cachingEnabled,
  })

  return response
}

async function captureAndStoreRouteHtml(
  request: NextRequest,
  settings: {
    pageRevalidateSeconds: number
    cachingEnabled: boolean
  },
): Promise<void> {
  const secret = getCrispyCacheInternalSecret()
  if (!secret || !settings.cachingEnabled || settings.pageRevalidateSeconds <= 0) {
    return
  }

  const captureUrl = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, request.url)

  try {
    const pageResponse = await fetch(captureUrl, {
      headers: {
        [CRISPY_CACHE_INTERNAL_HEADER]: secret,
        Accept: 'text/html',
      },
      cache: 'no-store',
    })

    if (!pageResponse.ok) return

    const html = await pageResponse.text()
    const storeUrl = new URL('/api/internal/route-cache-store', request.url)

    await fetch(storeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [CRISPY_CACHE_INTERNAL_HEADER]: secret,
      },
      body: JSON.stringify({
        routePath: request.nextUrl.pathname,
        html,
        contentType: pageResponse.headers.get('content-type') ?? 'text/html; charset=utf-8',
        statusCode: pageResponse.status,
        ttlSeconds: settings.pageRevalidateSeconds,
        cachingEnabled: settings.cachingEnabled,
      }),
      cache: 'no-store',
    })
  } catch {
    // Best-effort cache population; never block page responses.
  }
}

function scheduleRouteHtmlCapture(
  request: NextRequest,
  settings: {
    pageRevalidateSeconds: number
    cachingEnabled: boolean
  },
): void {
  after(async () => {
    await captureAndStoreRouteHtml(request, settings)
  })
}

async function applyFrontendCacheHeaders(request: NextRequest): Promise<NextResponse | null> {
  if (!isFrontendDocumentRequest(request)) {
    return null
  }

  if (isInternalCacheCaptureRequest(request)) {
    return NextResponse.next()
  }

  const settings = await getMiddlewareCacheSettings(request.url)
  if (!settings.exposeCacheHeaders) {
    return NextResponse.next()
  }

  const bypass = shouldBypassFrontendCache(request)
  const lookup = await resolveRouteCacheViaApi(request, settings, bypass)

  if ((lookup.status === 'HIT' || lookup.status === 'STALE') && lookup.html) {
    if (lookup.status === 'STALE' && !bypass && settings.cachingEnabled) {
      scheduleRouteHtmlCapture(request, settings)
    }

    return buildCachedHtmlResponse(request, lookup, settings)
  }

  const response = NextResponse.next()
  applyCrispyCacheHeaders(response.headers, {
    pageStatus: lookup.status,
    dataStatus: lookup.status,
    ttlSeconds: settings.pageRevalidateSeconds,
    cachingEnabled: settings.cachingEnabled,
  })

  if (
    !bypass &&
    settings.cachingEnabled &&
    settings.pageRevalidateSeconds > 0 &&
    (lookup.status === 'MISS' || lookup.status === 'STALE')
  ) {
    scheduleRouteHtmlCapture(request, settings)
  }

  return response
}

function handleApiAccessLog(request: NextRequest): NextResponse | null {
  if (process.env.API_ACCESS_LOG_ENABLED === 'false') {
    return null
  }

  const { pathname, search } = request.nextUrl
  if (!shouldLogApiRequest(pathname)) {
    return null
  }

  const startedAt = Date.now()
  const response = NextResponse.next()

  after(async () => {
    const secret = process.env.ACCESS_LOG_SECRET || process.env.PAYLOAD_SECRET
    if (!secret) return

    const logUrl = new URL('/api/internal/access-log', request.url)

    try {
      await fetch(logUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-log-secret': secret,
        },
        body: JSON.stringify({
          method: request.method,
          path: `${pathname}${search}`,
          status: response.status || null,
          durationMs: Date.now() - startedAt,
          ip: resolveClientIp(request),
          userAgent: request.headers.get('user-agent'),
          referer: request.headers.get('referer'),
          authType: detectApiAuthType(request),
        }),
      })
    } catch {
      // Best-effort logging; never block API responses.
    }
  })

  return response
}

export async function middleware(request: NextRequest) {
  const frontendResponse = await applyFrontendCacheHeaders(request)
  if (frontendResponse) {
    return frontendResponse
  }

  const apiResponse = handleApiAccessLog(request)
  if (apiResponse) {
    return apiResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
