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
import { buildRouteCachePath } from '@/frontend-cache/routeCachePath'
import type { CrispyCacheStatus } from '@/frontend-cache/headers'
import { handlePayloadRedirect } from '@/redirects/middlewareRedirects'
import { applyPoweredByHeader } from '@/utilities/poweredByHeader'
import { FRONTEND_PATHNAME_HEADER } from '@/utilities/requestPathname'

function nextWithPathname(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(FRONTEND_PATHNAME_HEADER, request.nextUrl.pathname)
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
          routePath: buildRouteCachePath(request.nextUrl.pathname, request.nextUrl.search),
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
          [FRONTEND_PATHNAME_HEADER]: request.nextUrl.pathname,
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
          routePath: buildRouteCachePath(request.nextUrl.pathname, request.nextUrl.search),
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

async function applyFrontendCacheHeaders(request: NextRequest): Promise<NextResponse | null> {
  if (!isFrontendDocumentRequest(request)) {
    return null
  }

  if (isInternalCacheCaptureRequest(request)) {
    return nextWithPathname(request)
  }

  const settings = await getMiddlewareCacheSettings(request.url)
  if (!settings.exposeCacheHeaders) {
    return nextWithPathname(request)
  }

  const bypass = shouldBypassFrontendCache(request)
  const lookup = await resolveRouteCacheViaApi(request, settings, bypass)

  if ((lookup.status === 'HIT' || lookup.status === 'STALE') && lookup.html) {
    if (lookup.status === 'STALE' && !bypass && settings.cachingEnabled) {
      scheduleRouteHtmlCapture(request, settings)
    }

    return buildCachedHtmlResponse(request, lookup, settings)
  }

  const response = nextWithPathname(request)
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

export async function proxy(request: NextRequest) {
  const legacyRedirect = handleLegacyFrontendRedirect(request)
  if (legacyRedirect) {
    return applyPoweredByHeader(legacyRedirect)
  }

  const payloadRedirect = await handlePayloadRedirect(request)
  if (payloadRedirect) {
    return applyPoweredByHeader(payloadRedirect)
  }

  const frontendResponse = await applyFrontendCacheHeaders(request)
  if (frontendResponse) {
    return applyPoweredByHeader(frontendResponse)
  }

  return applyPoweredByHeader(nextWithPathname(request))
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
