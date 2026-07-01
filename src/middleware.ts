import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { after } from 'next/server'

import { applyCrispyCacheHeaders } from '@/frontend-cache/headers'
import {
  getMiddlewareCacheSettings,
  isFrontendDocumentRequest,
  shouldBypassFrontendCache,
} from '@/frontend-cache/middlewareCache'
import type { CrispyCacheStatus } from '@/frontend-cache/headers'
import { detectApiAuthType } from '@/utilities/detectApiAuthType'

const SKIP_PREFIXES = ['/api/internal/access-log', '/api/ai/', '/api/media/file', '/api/openapi']

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

async function touchRouteCacheViaApi(
  request: NextRequest,
  settings: {
    pageRevalidateSeconds: number
    cachingEnabled: boolean
  },
  bypass: boolean,
): Promise<CrispyCacheStatus> {
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

    if (!response.ok) return 'BYPASS'

    const data = (await response.json()) as { status?: CrispyCacheStatus }
    return data.status ?? 'BYPASS'
  } catch {
    return 'BYPASS'
  }
}

async function applyFrontendCacheHeaders(request: NextRequest): Promise<NextResponse | null> {
  if (!isFrontendDocumentRequest(request)) {
    return null
  }

  const settings = await getMiddlewareCacheSettings(request.url)
  if (!settings.exposeCacheHeaders) {
    return NextResponse.next()
  }

  const bypass = shouldBypassFrontendCache(request)
  const pageStatus = await touchRouteCacheViaApi(request, settings, bypass)

  const response = NextResponse.next()
  applyCrispyCacheHeaders(response.headers, {
    pageStatus,
    dataStatus: pageStatus,
    ttlSeconds: settings.pageRevalidateSeconds,
    cachingEnabled: settings.cachingEnabled,
  })

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
