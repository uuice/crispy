import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { internalApiUrl, withForwardedPublicHost } from '@/frontend-cache/internalFetch'

type RedirectMap = Record<string, string>

let cachedRedirects: RedirectMap | null = null
let cachedAt = 0

const REDIRECTS_TTL_MS = 60_000

export async function getMiddlewareRedirectMap(requestUrl: string): Promise<RedirectMap> {
  if (cachedRedirects && Date.now() - cachedAt < REDIRECTS_TTL_MS) {
    return cachedRedirects
  }

  try {
    const url = internalApiUrl('/api/internal/redirects', requestUrl)
    const response = await fetch(url, withForwardedPublicHost(requestUrl, { cache: 'no-store' }))
    if (!response.ok) throw new Error('redirects fetch failed')

    const data = (await response.json()) as { redirects?: RedirectMap }
    cachedRedirects = data.redirects ?? {}
    cachedAt = Date.now()
    return cachedRedirects
  } catch {
    return cachedRedirects ?? {}
  }
}

export async function handlePayloadRedirect(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return null
  }

  const redirects = await getMiddlewareRedirectMap(request.url)
  const destination = redirects[pathname]
  if (!destination) return null

  if (/^https?:\/\//i.test(destination)) {
    return NextResponse.redirect(destination, 301)
  }

  const url = request.nextUrl.clone()
  url.pathname = destination
  url.search = ''
  return NextResponse.redirect(url, 301)
}
