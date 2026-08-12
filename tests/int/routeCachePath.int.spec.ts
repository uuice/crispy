import { describe, expect, it } from 'vitest'

import { buildRouteCachePath, routeCachePathname } from '@/frontend-cache/routeCachePath'

describe('routeCachePath', () => {
  it('keeps pathname when there is no meaningful query', () => {
    expect(buildRouteCachePath('/posts')).toBe('/posts')
    expect(buildRouteCachePath('/posts', '')).toBe('/posts')
    expect(buildRouteCachePath('/posts', '?theme_preview=kb')).toBe('/posts')
    expect(buildRouteCachePath('/posts', '?nocache=1&utm_source=x')).toBe('/posts')
  })

  it('includes sorted page query in cache identity', () => {
    expect(buildRouteCachePath('/posts', '?page=2')).toBe('/posts?page=2')
    expect(buildRouteCachePath('/posts', 'page=2&foo=1')).toBe('/posts?foo=1&page=2')
  })

  it('strips query for pathname helpers', () => {
    expect(routeCachePathname('/posts?page=2')).toBe('/posts')
    expect(routeCachePathname('/posts')).toBe('/posts')
  })
})
