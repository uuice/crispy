import { getPagePath, getPostPath, getPostsListPath, getUserPath } from '../utilities/frontendPaths'

/** Permanent redirects from legacy public URLs to collection-aligned routes. */
export function resolveLegacyFrontendRedirect(pathname: string): string | null {
  if (pathname === '/archives') {
    return getPostsListPath()
  }

  if (pathname === '/about') {
    return getPagePath('about')
  }

  const archivesMatch = pathname.match(/^\/archives\/([^/]+)$/)
  if (archivesMatch) {
    return getPostPath(decodeURIComponent(archivesMatch[1]))
  }

  const authorsMatch = pathname.match(/^\/authors\/([^/]+)$/)
  if (authorsMatch) {
    return getUserPath(decodeURIComponent(authorsMatch[1]))
  }

  return null
}

export const legacyFrontendRedirectRules = [
  { source: '/archives', destination: getPostsListPath() },
  { source: '/archives/:slug', destination: '/posts/:slug' },
  { source: '/authors/:slug', destination: '/users/:slug' },
  { source: '/about', destination: getPagePath('about') },
] as const
