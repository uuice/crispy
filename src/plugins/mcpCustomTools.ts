import type { MCPPluginConfig } from '@payloadcms/plugin-mcp'
import type { CollectionSlug, PayloadRequest } from 'payload'
import { z } from 'zod'

import {
  assertAgentCacheAccess,
  assertAgentCollectionAccess,
  assertAgentGlobalAccess,
} from '@/ai/agent/access'
import { describeCollectionSchema, describeGlobalSchema } from '@/ai/agent/describeResource'
import { runScopedSemanticContentSearch } from '@/ai/agent/scopeSemanticSearch'
import {
  getFrontendCacheSettings,
  listFrontendCache,
  parseCacheSettingsUpdate,
  purgeFrontendCache,
  updateFrontendCacheSettings,
} from '@/frontend-cache/cacheToolHandlers'
import { restoreTrashedDocument } from '@/utilities/trashOrDeleteDocument'

type McpCustomTool = NonNullable<NonNullable<MCPPluginConfig['mcp']>['tools']>[number]

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
      await assertAgentCacheAccess(req)
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
      '清除前台 DB 页面 HTML 缓存。支持 ids、routePaths、expired: true，或 all: true（须同时 confirm: true）；内容变更后需手动清除',
    parameters: {
      ids: z.array(z.string()).optional(),
      routePaths: z.array(z.string()).optional(),
      expired: z.boolean().optional(),
      all: z.boolean().optional(),
      confirm: z.boolean().optional(),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      await assertAgentCacheAccess(req)
      if (args.all === true && args.confirm !== true) {
        throw new Error('清空全部前台缓存须传 confirm: true（请先向用户确认）')
      }
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
      await assertAgentCacheAccess(req)
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
      await assertAgentCacheAccess(req)
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
    name: 'describe_resource',
    description:
      '查看某个 collection 或 global 的字段结构（create/update 前应先调用）。含小说章节 slug、发布状态等 hints。',
    parameters: {
      kind: z.enum(['collection', 'global']),
      slug: z.string(),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      const kind = String(args.kind ?? '')
      const slug = String(args.slug ?? '')
      if (kind === 'collection') {
        await assertAgentCollectionAccess(req, slug, 'read')
        return mcpTextResult(describeCollectionSchema(req, slug))
      }
      if (kind === 'global') {
        await assertAgentGlobalAccess(req, slug, 'read')
        return mcpTextResult(describeGlobalSchema(req, slug))
      }
      throw new Error('kind 必须是 collection 或 global')
    },
  },
  {
    name: 'semantic_search',
    description:
      '按语义相似度搜索 posts/pages/novels/novel-chapters（需 Postgres + pgvector，且 Admin「AI 设置」已选 Embedding 提供商）。返回 title、url、slug、docId、短 excerpt（非正文）；读全文用 find + get 对应 collection 文档。',
    parameters: {
      query: z.string(),
      collections: z
        .array(z.enum(['posts', 'pages', 'novels', 'novel-chapters']))
        .optional(),
      limit: z.number().optional(),
      status: z.string().optional(),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest, _extra: unknown) => {
      const query = String(args.query ?? '')
      const collections = Array.isArray(args.collections)
        ? args.collections.filter(
            (c): c is 'posts' | 'pages' | 'novels' | 'novel-chapters' =>
              c === 'posts' ||
              c === 'pages' ||
              c === 'novels' ||
              c === 'novel-chapters',
          )
        : undefined
      const limit = Math.min(Math.max(Number(args.limit) || 8, 1), 25)
      const status = args.status != null ? String(args.status) : undefined

      const rows = await runScopedSemanticContentSearch(req, {
        query,
        collections,
        limit,
        status,
      })
      return mcpTextResult(rows)
    },
  },
]
