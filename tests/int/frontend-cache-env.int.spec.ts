import { describe, expect, it, vi, afterEach } from 'vitest'

import {
  applyDevHtmlCacheEnvOverride,
  parseDevHtmlCacheEnvOverride,
} from '@/frontend-cache/envOverrides'
import { DEFAULT_CACHE_SETTINGS } from '@/frontend-cache/settings'

describe('frontend cache env overrides', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('ignores override in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('CRISPY_FRONTEND_HTML_CACHE', 'false')

    expect(parseDevHtmlCacheEnvOverride()).toBeNull()
    expect(
      applyDevHtmlCacheEnvOverride({
        ...DEFAULT_CACHE_SETTINGS,
        cachingEnabled: true,
      }).cachingEnabled,
    ).toBe(true)
  })

  it('forces cache on/off in development', () => {
    vi.stubEnv('NODE_ENV', 'development')

    vi.stubEnv('CRISPY_FRONTEND_HTML_CACHE', 'false')
    expect(parseDevHtmlCacheEnvOverride()).toBe(false)

    vi.stubEnv('CRISPY_FRONTEND_HTML_CACHE', 'true')
    expect(
      applyDevHtmlCacheEnvOverride({
        ...DEFAULT_CACHE_SETTINGS,
        cachingEnabled: false,
      }).cachingEnabled,
    ).toBe(true)
  })
})
