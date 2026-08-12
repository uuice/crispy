import { NextResponse } from 'next/server'

import {
  THEME_PREVIEW_COOKIE,
  THEME_PREVIEW_QUERY_PARAM,
} from '@/themes/preview.shared'
import { resolvePublicRequestOrigin } from '@/utilities/publicOrigin'

/** Only allow same-origin relative paths (block open redirects). */
function sanitizeRedirectPath(redirectTo: string): string {
  if (!redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return '/'
  }

  try {
    const url = new URL(redirectTo, 'http://preview.local')
    url.searchParams.delete(THEME_PREVIEW_QUERY_PARAM)
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const redirectPath = sanitizeRedirectPath(url.searchParams.get('redirect') || '/')

  // Never build redirects from request.url when the process listens on 0.0.0.0 —
  // behind reverse proxies that origin leaks to the browser (https://0.0.0.0:3333/).
  const destination = new URL(redirectPath, `${resolvePublicRequestOrigin(request)}/`)

  const response = NextResponse.redirect(destination)
  // Clear legacy preview cookie from older builds
  response.cookies.delete(THEME_PREVIEW_COOKIE)

  return response
}
