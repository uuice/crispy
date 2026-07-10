import type { MCPPluginConfig } from '@payloadcms/plugin-mcp'
import type { CollectionSlug, PayloadRequest } from 'payload'
import { z } from 'zod'

import { hasRole } from '@/access/roles'
import {
  assertAgentCacheAccess,
  assertAgentCollectionAccess,
  assertAgentGlobalAccess,
} from '@/ai/agent/access'
import { runSemanticContentSearch } from '@/ai/embeddings/semanticSearch'
import {
  getFrontendCacheSettings,
  listFrontendCache,
  parseCacheSettingsUpdate,
  purgeFrontendCache,
  updateFrontendCacheSettings,
} from '@/frontend-cache/cacheToolHandlers'
import type { User } from '@/payload-types'
import { restoreTrashedDocument } from '@/utilities/trashOrDeleteDocument'

type McpCustomTool = NonNullable<NonNullable<MCPPluginConfig['mcp']>['tools']>[number]

function assertMcpCacheAccess(req: PayloadRequest): void {
  if (!req.user || !('roles' in req.user)) {
    throw new Error('未授权')
  }

  if (!hasRole(req.user as User, ['super-admin', 'editor'])) {
    throw new Error('仅管理员和编辑可通过 MCP 管理前台缓存')
  }
}

function mcpTextResult(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  }
}

/** Custom MCP tools aligned with Admin AI Agent (beyond auto-generated collection/global tools). */
export const mcpCustomTools: McpCustomTool[] = [
  {
    name: 'list_frontend_cache',
    description:
      '查询前台 HTML 缓存：registry 路径列表、DB 状态、动态路由明细、cache-settings（对应 /admin/cache）',
    parameters: {
      group: z.enum(['page', 'route', 'dynamic']).optional(),
      dynamicLimit: z.number().optional(),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      assertMcpCacheAccess(req)
      const result = await listFrontendCache({
        group: args.group ? String(args.group) : undefined,
        dynamicLimit: args.dynamicLimit !== undefined ? Number(args.dynamicLimit) : undefined,
      })
      return mcpTextResult(result)
    },
  },
  {
    name: 'purge_frontend_cache',
    description:
      '清除前台 DB 页面 HTML 缓存。支持 ids、routePaths、expired: true 或 all: true；内容变更后需手动清除',
    parameters: {
      ids: z.array(z.string()).optional(),
      routePaths: z.array(z.string()).optional(),
      expired: z.boolean().optional(),
      all: z.boolean().optional(),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      assertMcpCacheAccess(req)
      const result = await purgeFrontendCache({
        all: args.all === true,
        expired: args.expired === true,
        routePaths: Array.isArray(args.routePaths) ? args.routePaths.map(String) : undefined,
        ids: Array.isArray(args.ids) ? args.ids.map(String) : undefined,
      })
      return mcpTextResult(result)
    },
  },
  {
    name: 'get_cache_settings',
    description: '读取 cache-settings：HTML 缓存开关、TTL 秒数、是否输出调试 Header',
    parameters: {},
    handler: async (_args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      assertMcpCacheAccess(req)
      return mcpTextResult(await getFrontendCacheSettings())
    },
  },
  {
    name: 'update_cache_settings',
    description:
      '更新 cache-settings：cachingEnabled、pageRevalidateSeconds、exposeCacheHeaders（至少提供一个字段）',
    parameters: {
      cachingEnabled: z.boolean().optional(),
      pageRevalidateSeconds: z.number().optional(),
      exposeCacheHeaders: z.boolean().optional(),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      assertMcpCacheAccess(req)
      await assertAgentGlobalAccess(req, 'cache-settings', 'update')
      parseCacheSettingsUpdate(args)
      const result = await updateFrontendCacheSettings(req, args)
      return mcpTextResult(result)
    },
  },
  {
    name: 'restore_document',
    description:
      '从回收站恢复软删除的文档（clear deletedAt）。查回收站用 Find 对应 Collection 并设 trash 条件',
    parameters: {
      collection: z.string(),
      id: z.union([z.string(), z.number()]),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'update', id)
      const result = await restoreTrashedDocument({
        req,
        collection: collection as CollectionSlug,
        id,
      })
      return mcpTextResult(result)
    },
  },
  {
    name: 'semantic_search',
    description:
      '按语义相似度搜索 posts/pages（需 PostgreSQL pgvector + Embedding API Key）。适合自然语言查找内容',
    parameters: {
      query: z.string(),
      collections: z.array(z.enum(['posts', 'pages'])).optional(),
      limit: z.number().optional(),
      status: z.string().optional(),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      const query = String(args.query ?? '')
      const collections = Array.isArray(args.collections)
        ? (args.collections.filter((c) => c === 'posts' || c === 'pages') as ('posts' | 'pages')[])
        : undefined
      const limit = Math.min(Math.max(Number(args.limit) || 8, 1), 25)
      const status = args.status != null ? String(args.status) : undefined

      const result = await runSemanticContentSearch(req, query, {
        collections,
        limit,
        status,
      })
      return mcpTextResult(result)
    },
  },
]
