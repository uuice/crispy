import type { NextRequest } from 'next/server'

import type { Permission } from '@/access/permissions'
import { extractRoleSlugs } from '@/access/roles'

import { FRONTEND_THEME_IDS, type FrontendThemeId } from './definitions'

export const THEME_PREVIEW_QUERY_PARAM = 'theme_preview'
export const THEME_PREVIEW_REQUEST_HEADER = 'x-crispy-theme-preview'
export const THEME_PREVIEW_COOKIE = 'crispy_theme_preview'
export const THEME_PREVIEW_COOKIE_MAX_AGE = 60 * 60

/** Permissions that allow ?theme_preview= (aligned with site/content editor access). */
export const THEME_PREVIEW_PERMISSIONS: Permission[] = [
  'settings:site',
  'pages:manage',
  'ops:manage',
]

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
  return hasThemePreviewQuery(request)
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

  if (
    href.startsWith('/admin') ||
    href.startsWith('/api') ||
    href.startsWith('/next/exit-theme-preview')
  ) {
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

type AuthzUserShape =
  | {
      permissions?: string[] | null
      roles?: unknown
    }
  | null
  | undefined

/** Prefer authz permissions from /me; fall back to system role slugs. */
export function canUseThemePreview(user: AuthzUserShape): boolean {
  const permissions = user?.permissions
  if (Array.isArray(permissions) && permissions.length > 0) {
    return THEME_PREVIEW_PERMISSIONS.some((permission) => permissions.includes(permission))
  }

  return isEditorUser(user)
}

/** @deprecated Prefer canUseThemePreview (permission-based). */
export function isEditorUser(user: AuthzUserShape): boolean {
  const roles = extractRoleSlugs(user)
  return roles.some((role) => role === 'super-admin' || role === 'editor')
}
