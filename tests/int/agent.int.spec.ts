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

const mockEditor = {
  id: 2,
  roles: ['editor'],
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
    expect(result.summary.collections.some((c) => c.slug === 'redirects')).toBe(true)
    expect(result.summary.collections.some((c) => c.slug === 'forms')).toBe(true)
    expect(result.summary.collections.some((c) => c.slug === 'form-submissions')).toBe(true)
  })

  it('describeCollectionSchema returns fields for redirects', async () => {
    const req = await createLocalReq({}, payload)
    const schema = describeCollectionSchema(req, 'redirects') as {
      slug: string
      fields: { name: string }[]
    }

    expect(schema.slug).toBe('redirects')
    expect(schema.fields.some((f) => f.name === 'from')).toBe(true)
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

  it('update_cache_settings updates page TTL', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const before = (await executeAgentTool(req, {
      id: 'call-cache-before',
      name: 'get_cache_settings',
      arguments: '{}',
    })) as { summary: { pageRevalidateSeconds: number } }

    const nextTtl = before.summary.pageRevalidateSeconds === 3600 ? 7200 : 3600

    const updated = (await executeAgentTool(req, {
      id: 'call-cache-update',
      name: 'update_cache_settings',
      arguments: JSON.stringify({ pageRevalidateSeconds: nextTtl }),
    })) as { summary: { pageRevalidateSeconds: number } }

    expect(updated.summary.pageRevalidateSeconds).toBe(nextTtl)

    await executeAgentTool(req, {
      id: 'call-cache-restore',
      name: 'update_cache_settings',
      arguments: JSON.stringify({ pageRevalidateSeconds: before.summary.pageRevalidateSeconds }),
    })
  })

  it('update_cache_settings rejects empty payload', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)

    await expect(
      executeAgentTool(req, {
        id: 'call-cache-empty',
        name: 'update_cache_settings',
        arguments: '{}',
      }),
    ).rejects.toThrow(/至少提供一个/)
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
        dbStats: { total: number; expiredPending: number }
        entries: { id: string; status: { active: boolean } }[]
        dynamicRoutes: unknown[]
      }
    }

    expect(result.summary.entries.length).toBeGreaterThan(0)
    expect(typeof result.summary.dbStats.total).toBe('number')
    expect(typeof result.summary.dbStats.expiredPending).toBe('number')
    expect(Array.isArray(result.summary.dynamicRoutes)).toBe(true)
  })

  it('list_frontend_cache supports dynamic group filter', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-cache-dynamic',
      name: 'list_frontend_cache',
      arguments: JSON.stringify({ group: 'dynamic' }),
    })) as {
      summary: {
        entries: { group: string }[]
        dynamicRoutes: unknown[]
      }
    }

    expect(result.summary.entries.every((entry) => entry.group === 'dynamic')).toBe(true)
    expect(Array.isArray(result.summary.dynamicRoutes)).toBe(true)
  })

  it('purge_frontend_cache purges expired entries', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-cache-purge-expired',
      name: 'purge_frontend_cache',
      arguments: JSON.stringify({ expired: true }),
    })) as { summary: { ok: boolean; deleted: number; scope: string } }

    expect(result.summary.ok).toBe(true)
    expect(typeof result.summary.deleted).toBe('number')
    expect(result.summary.scope).toBe('expired')
  })

  it('get_site_stats returns collection rows', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-stats',
      name: 'get_site_stats',
      arguments: '{}',
    })) as { summary: { rows: { slug: string }[]; generatedAt: string } }

    expect(result.summary.rows.length).toBeGreaterThan(0)
    expect(typeof result.summary.generatedAt).toBe('string')
  })

  it('list_audit_logs returns log list for super-admin', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const result = (await executeAgentTool(req, {
      id: 'call-audit',
      name: 'list_audit_logs',
      arguments: '{}',
    })) as { summary: { docs: unknown[]; totalDocs: number } }

    expect(Array.isArray(result.summary.docs)).toBe(true)
    expect(typeof result.summary.totalDocs).toBe('number')
  })

  it('list_audit_logs rejects editor role', async () => {
    const req = await createLocalReq({ user: mockEditor }, payload)

    await expect(
      executeAgentTool(req, {
        id: 'call-audit-denied',
        name: 'list_audit_logs',
        arguments: '{}',
      }),
    ).rejects.toThrow(/审计日志仅超级管理员/)
  })

  it('blocks form-submissions create via agent', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)

    await expect(
      executeAgentTool(req, {
        id: 'call-form-create',
        name: 'create_document',
        arguments: JSON.stringify({
          collection: 'form-submissions',
          data: { form: 'test' },
        }),
      }),
    ).rejects.toThrow(/不可通过 AI 助手创建或修改/)
  })

  it('restore_document restores soft-deleted tag', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)
    const slug = `agent-restore-${Date.now()}`

    const created = await payload.create({
      collection: 'tags',
      data: { title: slug, slug },
      overrideAccess: true,
    })

    await executeAgentTool(req, {
      id: 'call-delete-tag',
      name: 'delete_document',
      arguments: JSON.stringify({ collection: 'tags', id: created.id }),
    })

    const trashed = (await executeAgentTool(req, {
      id: 'call-find-trash',
      name: 'find_documents',
      arguments: JSON.stringify({
        collection: 'tags',
        trash: true,
        where: { slug: { equals: slug } },
      }),
    })) as { summary: { docs: { id: number | string }[] } }

    expect(trashed.summary.docs.some((doc) => doc.id === created.id)).toBe(true)

    await executeAgentTool(req, {
      id: 'call-restore-tag',
      name: 'restore_document',
      arguments: JSON.stringify({ collection: 'tags', id: created.id }),
    })

    const active = await payload.findByID({
      collection: 'tags',
      id: created.id,
      overrideAccess: true,
    })

    expect(active.deletedAt).toBeFalsy()
  })
})
