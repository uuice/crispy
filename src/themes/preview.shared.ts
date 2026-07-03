import type { NextRequest } from 'next/server'

import { FRONTEND_THEME_IDS, type FrontendThemeId } from './definitions'

export const THEME_PREVIEW_QUERY_PARAM = 'theme_preview'
export const THEME_PREVIEW_REQUEST_HEADER = 'x-crispy-theme-preview'
export const THEME_PREVIEW_COOKIE = 'crispy_theme_preview'
export const THEME_PREVIEW_COOKIE_MAX_AGE = 60 * 60

export function isFrontendThemeId(value: string | null | undefined): value is FrontendThemeId {
  return value != null && (FRONTEND_THEME_IDS as readonly string[]).includes(value)
}

export function hasThemePreviewQuery(request: NextRequest): boolean {
  return request.nextUrl.searchParams.has(THEME_PREVIEW_QUERY_PARAM)
}

export function getThemePreviewQueryValue(request: NextRequest): string | null {
  return request.nextUrl.searchParams.get(THEME_PREVIEW_QUERY_PARAM)
}

export function getThemePreviewCookieValue(request: NextRequest): FrontendThemeId | null {
  const value = request.cookies.get(THEME_PREVIEW_COOKIE)?.value
  return isFrontendThemeId(value) ? value : null
}

export function hasThemePreviewCookie(request: NextRequest): boolean {
  return getThemePreviewCookieValue(request) != null
}

export function isThemePreviewActive(request: NextRequest): boolean {
  return hasThemePreviewQuery(request) || hasThemePreviewCookie(request)
}

export function buildThemePreviewUrl(themeId: FrontendThemeId, baseUrl: string): string {
  const url = new URL(baseUrl || 'http://preview.local/')
  url.searchParams.set(THEME_PREVIEW_QUERY_PARAM, themeId)
  return `${url.pathname}${url.search}`
}

/** Append preview query to an internal frontend path while in preview mode. */
export function withThemePreviewParam(
  href: string,
  themeId: FrontendThemeId | null | undefined,
): string {
  if (!themeId || !href) {
    return href
  }

  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return href
  }

  if (href.startsWith('/admin') || href.startsWith('/api') || href.startsWith('/next/exit-theme-preview')) {
    return href
  }

  const hashIndex = href.indexOf('#')
  const pathAndQuery = hashIndex >= 0 ? href.slice(0, hashIndex) : href
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : ''

  const url = new URL(pathAndQuery || '/', 'http://preview.local')
  if (url.searchParams.get(THEME_PREVIEW_QUERY_PARAM) === themeId) {
    return href
  }

  url.searchParams.set(THEME_PREVIEW_QUERY_PARAM, themeId)
  return `${url.pathname}${url.search}${hash}`
}

export function isEditorUser(user: { roles?: string[] | null } | null | undefined): boolean {
  const roles = user?.roles ?? []
  return roles.some((role) => role === 'super-admin' || role === 'editor')
}
