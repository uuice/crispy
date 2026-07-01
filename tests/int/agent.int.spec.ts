import { getPayload, createLocalReq, type Payload } from 'payload'
import config from '@/payload.config'
import { beforeAll, describe, expect, it } from 'vitest'

import { assertAgentCollectionAccess } from '@/ai/agent/access'
import { describeCollectionSchema } from '@/ai/agent/describeResource'
import { executeAgentTool } from '@/ai/agent/tools'
import type { User } from '@/payload-types'

let payload: Payload

const mockSuperAdmin = {
  id: 1,
  roles: ['super-admin'],
} as User

describe('AI agent', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('describeCollectionSchema returns fields for posts', async () => {
    const req = await createLocalReq({}, payload)
    const schema = describeCollectionSchema(req, 'posts') as {
      slug: string
      fields: { name: string }[]
    }

    expect(schema.slug).toBe('posts')
    expect(schema.fields.some((f) => f.name === 'title')).toBe(true)
  })

  it('executeAgentTool rejects unsupported collections', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)

    await expect(
      executeAgentTool(req, {
        id: 'call-test',
        name: 'find_documents',
        arguments: JSON.stringify({ collection: 'users' }),
      }),
    ).rejects.toThrow(/不支持的内容类型/)
  })

  it('assertAgentCollectionAccess blocks media delete', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)

    await expect(assertAgentCollectionAccess(req, 'media', 'delete', 1)).rejects.toThrow(
      /不允许通过 AI 助手删除/,
    )
  })

  it('list_resources includes cache-settings and query presets', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-list',
      name: 'list_resources',
      arguments: '{}',
    })) as { summary: { globals: { slug: string }[]; collections: { slug: string }[] } }

    expect(result.summary.globals.some((g) => g.slug === 'cache-settings')).toBe(true)
    expect(result.summary.globals.some((g) => g.slug === 'ai-settings')).toBe(true)
    expect(result.summary.collections.some((c) => c.slug === 'payload-query-presets')).toBe(true)
  })

  it('get_cache_settings returns normalized cache config', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-cache',
      name: 'get_cache_settings',
      arguments: '{}',
    })) as { summary: { cachingEnabled: boolean; pageRevalidateSeconds: number } }

    expect(typeof result.summary.cachingEnabled).toBe('boolean')
    expect(typeof result.summary.pageRevalidateSeconds).toBe('number')
  })

  it('list_query_presets returns preset list', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-presets',
      name: 'list_query_presets',
      arguments: '{}',
    })) as { summary: { docs: unknown[]; totalDocs: number } }

    expect(Array.isArray(result.summary.docs)).toBe(true)
    expect(typeof result.summary.totalDocs).toBe('number')
  })

  it('list_frontend_cache returns registry entries and stats', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-cache-list',
      name: 'list_frontend_cache',
      arguments: '{}',
    })) as {
      summary: {
        dbStats: { total: number }
        entries: { id: string; status: { active: boolean } }[]
      }
    }

    expect(result.summary.entries.length).toBeGreaterThan(0)
    expect(typeof result.summary.dbStats.total).toBe('number')
  })
})
