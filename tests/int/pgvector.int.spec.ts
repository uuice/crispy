import { describe, expect, it, vi, afterEach } from 'vitest'

describe('isPgvectorEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns false when PGVECTOR_ENABLED=false', async () => {
    vi.stubEnv('PGVECTOR_ENABLED', 'false')
    vi.stubEnv('DATABASE_DRIVER', 'postgres')
    const { isPgvectorEnabled } = await import('@/database/pgvector')
    expect(isPgvectorEnabled()).toBe(false)
  })

  it('returns true when PGVECTOR_ENABLED is unset', async () => {
    delete process.env.PGVECTOR_ENABLED
    const { isPgvectorEnabled } = await import('@/database/pgvector')
    expect(isPgvectorEnabled()).toBe(true)
  })
})
