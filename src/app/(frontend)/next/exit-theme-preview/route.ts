import { NextResponse } from 'next/server'

import {
  THEME_PREVIEW_COOKIE,
  THEME_PREVIEW_QUERY_PARAM,
} from '@/themes/preview.shared'

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirect') || '/'
  const destination = new URL(redirectTo, request.url)

  destination.searchParams.delete(THEME_PREVIEW_QUERY_PARAM)

  const response = NextResponse.redirect(destination)
  response.cookies.delete(THEME_PREVIEW_COOKIE)

  return response
}
