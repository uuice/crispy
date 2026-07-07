import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { after } from 'next/server'

import { applyCrispyCacheHeaders } from '@/frontend-cache/headers'
import { internalApiUrl, withForwardedPublicHost } from '@/frontend-cache/internalFetch'
import { resolveLegacyFrontendRedirect } from '@/frontend-cache/legacyFrontendRedirects'
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
import {
  getThemePreviewQueryValue,
  isEditorUser,
  isFrontendThemeId,
  THEME_PREVIEW_REQUEST_HEADER,
} from '@/themes/preview.shared'
import type { FrontendThemeId } from '@/themes/definitions'
import { detectApiAuthType } from '@/utilities/detectApiAuthType'

const SKIP_PREFIXES = ['/api/internal/access-log', '/api/ai/', '/api/media/file', '/api/openapi']

type ThemePreviewContext = {
  themeId: FrontendThemeId
  requestHeaders: Headers
}

async function isEditorRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('payload-token')?.value
  if (!token) {
    return false
  }

  try {
    const response = await fetch(new URL('/api/users/me', request.url), {
      headers: { Authorization: `JWT ${token}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      return false
    }

    const data = (await response.json()) as { user?: { roles?: string[] | null } | null }
    return isEditorUser(data.user)
  } catch {
    return false
  }
}

async function resolveThemePreviewContext(request: NextRequest): Promise<ThemePreviewContext | null> {
  const queryTheme = getThemePreviewQueryValue(request)

  if (!isFrontendThemeId(queryTheme) || !(await isEditorRequest(request))) {
    return null
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(THEME_PREVIEW_REQUEST_HEADER, queryTheme)

  return { themeId: queryTheme, requestHeaders }
}

function withThemePreview(
  response: NextResponse,
  themePreview: ThemePreviewContext | null,
): NextResponse {
  if (!themePreview) {
    return response
  }

  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

function nextWithRequestHeaders(request: NextRequest, requestHeaders: Headers): NextResponse {
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

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
    const url = internalApiUrl('/api/internal/route-cache-touch', request.url)
    const response = await fetch(
      url,
      withForwardedPublicHost(request.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routePath: request.nextUrl.pathname,
          ttlSeconds: settings.pageRevalidateSeconds,
          cachingEnabled: settings.cachingEnabled,
          bypass,
        }),
        cache: 'no-store',
      }),
    )

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
    dataStatus: 'BYPASS',
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

  const captureUrl = internalApiUrl(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    request.url,
  )

  try {
    const pageResponse = await fetch(
      captureUrl,
      withForwardedPublicHost(request.url, {
        headers: {
          [CRISPY_CACHE_INTERNAL_HEADER]: secret,
          Accept: 'text/html',
        },
        cache: 'no-store',
      }),
    )

    if (!pageResponse.ok) return

    const html = await pageResponse.text()
    const storeUrl = internalApiUrl('/api/internal/route-cache-store', request.url)

    await fetch(
      storeUrl,
      withForwardedPublicHost(request.url, {
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
      }),
    )
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

function handleLegacyFrontendRedirect(request: NextRequest): NextResponse | null {
  const destination = resolveLegacyFrontendRedirect(request.nextUrl.pathname)
  if (!destination) return null

  const url = request.nextUrl.clone()
  url.pathname = destination
  return NextResponse.redirect(url, 301)
}

async function applyFrontendCacheHeaders(
  request: NextRequest,
  themePreview: ThemePreviewContext | null,
): Promise<NextResponse | null> {
  if (!isFrontendDocumentRequest(request)) {
    return null
  }

  if (isInternalCacheCaptureRequest(request)) {
    return themePreview ? nextWithRequestHeaders(request, themePreview.requestHeaders) : NextResponse.next()
  }

  const settings = await getMiddlewareCacheSettings(request.url)
  if (!settings.exposeCacheHeaders) {
    return themePreview
      ? nextWithRequestHeaders(request, themePreview.requestHeaders)
      : NextResponse.next()
  }

  const bypass = shouldBypassFrontendCache(request)
  const lookup = await resolveRouteCacheViaApi(request, settings, bypass)

  if ((lookup.status === 'HIT' || lookup.status === 'STALE') && lookup.html) {
    if (lookup.status === 'STALE' && !bypass && settings.cachingEnabled) {
      scheduleRouteHtmlCapture(request, settings)
    }

    return buildCachedHtmlResponse(request, lookup, settings)
  }

  const response = themePreview
    ? nextWithRequestHeaders(request, themePreview.requestHeaders)
    : NextResponse.next()
  applyCrispyCacheHeaders(response.headers, {
    pageStatus: lookup.status,
    dataStatus: 'BYPASS',
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
  const legacyRedirect = handleLegacyFrontendRedirect(request)
  if (legacyRedirect) {
    return legacyRedirect
  }

  const themePreview = await resolveThemePreviewContext(request)

  const frontendResponse = await applyFrontendCacheHeaders(request, themePreview)
  if (frontendResponse) {
    return withThemePreview(frontendResponse, themePreview)
  }

  const apiResponse = handleApiAccessLog(request)
  if (apiResponse) {
    return withThemePreview(apiResponse, themePreview)
  }

  return withThemePreview(NextResponse.next(), themePreview)
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
