import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { after } from 'next/server'

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

export function middleware(request: NextRequest) {
  if (process.env.API_ACCESS_LOG_ENABLED === 'false') {
    return NextResponse.next()
  }

  const { pathname, search } = request.nextUrl
  if (!shouldLogApiRequest(pathname)) {
    return NextResponse.next()
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

export const config = {
  matcher: ['/api/:path*'],
}
