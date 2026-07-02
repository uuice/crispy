import {
  purgeAllFrontendCacheEntries,
  purgeDbCacheByRoutePath,
  purgeDbCacheByRoutePattern,
} from '@/frontend-cache/dbCache'
import type { FrontendCacheEntry } from '@/frontend-cache/registry'

export type PurgeCacheResult = {
  id: string
  label: string
  kind: FrontendCacheEntry['kind']
  target: string
  success: boolean
  deleted?: number
}

export async function purgeCacheEntry(entry: FrontendCacheEntry): Promise<PurgeCacheResult> {
  try {
    const deleted =
      entry.pathMatch === 'pattern'
        ? await purgeDbCacheByRoutePattern(entry.target)
        : await purgeDbCacheByRoutePath(entry.target)

    return {
      id: entry.id,
      label: entry.label,
      kind: entry.kind,
      target: entry.target,
      success: true,
      deleted,
    }
  } catch {
    return {
      id: entry.id,
      label: entry.label,
      kind: entry.kind,
      target: entry.target,
      success: false,
      deleted: 0,
    }
  }
}

export async function purgeCacheEntries(entries: FrontendCacheEntry[]): Promise<PurgeCacheResult[]> {
  return Promise.all(entries.map(purgeCacheEntry))
}

export async function purgeAllRegisteredCache(): Promise<number> {
  return purgeAllFrontendCacheEntries()
}
