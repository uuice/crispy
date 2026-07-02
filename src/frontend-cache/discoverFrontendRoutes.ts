import fs from 'node:fs'
import path from 'node:path'

import type { FrontendCacheEntry } from './registry'

const FRONTEND_APP_ROOT = path.join(process.cwd(), 'src/app/(frontend)')

/** Route segments excluded from auto-discovery (internal / non-document routes). */
const SKIP_SEGMENTS = new Set(['next', '(sitemaps)'])

function segmentToUrlPart(segment: string): string {
  if (segment.startsWith('[') && segment.endsWith(']')) {
    return `[${segment.slice(1, -1)}]`
  }
  return segment
}

function routePathToId(routePath: string): string {
  return `auto${routePath.replace(/\//g, '-').replace(/\[|\]/g, '')}`
}

function pushRouteEntry(
  entries: FrontendCacheEntry[],
  routePath: string,
  source: 'page' | 'route',
): void {
  const isDynamic = routePath.includes('[')

  entries.push({
    id: routePathToId(routePath),
    label: routePath,
    description:
      source === 'page'
        ? 'Auto-discovered from app/(frontend)/page.tsx'
        : 'Auto-discovered from app/(frontend)/route.ts',
    group: source === 'route' ? 'route' : isDynamic ? 'dynamic' : 'page',
    kind: 'path',
    target: routePath,
    pathMatch: isDynamic ? 'pattern' : 'exact',
    ...(routePath === '/' && source === 'page'
      ? {
          pathType: 'page' as const,
        }
      : {}),
  })
}

function walkRoutes(
  dir: string,
  urlPrefix: string,
  entries: FrontendCacheEntry[],
): void {
  if (!fs.existsSync(dir)) return

  const routePath = urlPrefix || '/'
  const hasPage = fs.existsSync(path.join(dir, 'page.tsx'))
  const hasRoute = fs.existsSync(path.join(dir, 'route.ts'))

  if (hasPage) {
    pushRouteEntry(entries, routePath, 'page')
  } else if (hasRoute) {
    pushRouteEntry(entries, routePath, 'route')
  }

  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue
    if (dirent.name.startsWith('(') && dirent.name !== '(frontend)') continue
    if (SKIP_SEGMENTS.has(dirent.name)) continue

    const urlPart = segmentToUrlPart(dirent.name)
    const nextPrefix = urlPrefix ? `${urlPrefix}/${urlPart}` : `/${urlPart}`
    walkRoutes(path.join(dir, dirent.name), nextPrefix, entries)
  }
}

/** Scan app/(frontend) for page.tsx and route.ts routes (server-only). */
export function discoverFrontendRouteEntries(): FrontendCacheEntry[] {
  const entries: FrontendCacheEntry[] = []
  walkRoutes(FRONTEND_APP_ROOT, '', entries)

  const byTarget = new Map<string, FrontendCacheEntry>()
  for (const entry of entries) {
    byTarget.set(entry.target, entry)
  }

  return [...byTarget.values()].sort((a, b) => a.target.localeCompare(b.target))
}

export function getDiscoveredExactRoutePaths(): Set<string> {
  return new Set(
    discoverFrontendRouteEntries()
      .filter((entry) => entry.kind === 'path' && (entry.pathMatch ?? 'exact') === 'exact')
      .map((entry) => entry.target),
  )
}
