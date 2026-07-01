import { AsyncLocalStorage } from 'async_hooks'

import type { CrispyCacheStatus } from '@/frontend-cache/headers'

type DataCacheProbeState = {
  misses: number
  hits: number
}

const dataCacheProbeStorage = new AsyncLocalStorage<DataCacheProbeState>()

export function runWithDataCacheProbe<T>(fn: () => T): T {
  return dataCacheProbeStorage.run({ misses: 0, hits: 0 }, fn)
}

export async function runWithDataCacheProbeAsync<T>(fn: () => Promise<T>): Promise<T> {
  return dataCacheProbeStorage.run({ misses: 0, hits: 0 }, fn)
}

export function recordDataCacheMiss(): void {
  const store = dataCacheProbeStorage.getStore()
  if (store) store.misses += 1
}

export function recordDataCacheHit(): void {
  const store = dataCacheProbeStorage.getStore()
  if (store) store.hits += 1
}

export function resolveDataCacheStatus(): CrispyCacheStatus {
  const store = dataCacheProbeStorage.getStore()
  if (!store) return 'BYPASS'
  if (store.misses === 0 && store.hits === 0) return 'BYPASS'
  if (store.misses === 0) return 'HIT'
  if (store.hits === 0) return 'MISS'
  return 'STALE'
}

export function getDataCacheProbeCounts(): { hits: number; misses: number } {
  const store = dataCacheProbeStorage.getStore()
  return { hits: store?.hits ?? 0, misses: store?.misses ?? 0 }
}
