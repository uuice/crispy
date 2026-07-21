import type { CollectionSlug, PayloadRequest, Where } from 'payload'

import type { EmbeddableCollection } from '@/ai/embeddings/constants'

import {
  assertAgentAuditLogAccess,
  assertAgentCacheAccess,
  assertAgentCollectionAccess,
  assertAgentGlobalAccess,
  assertAgentStatsAccess,
  canAgentAccessAnyPost,
  ownPostsWhere,
} from '@/ai/agent/access'
import {
  describeCollectionSchema,
  describeGlobalSchema,
} from '@/ai/agent/describeResource'
import {
  AGENT_COLLECTIONS,
  AGENT_GLOBALS,
  isAgentCollection,
  isAgentGlobal,
} from '@/ai/agent/resources'
import type { AuditLog, Config, PayloadQueryPreset } from '@/payload-types'
import type { AgentToolCall } from '@/ai/agent/types'
import { collectCollectionStats } from '@/admin-stats/collectCollectionStats'
import { runSemanticContentSearch } from '@/ai/embeddings/semanticSearch'
import { formatEmbeddingSearchHit } from '@/ai/embeddings/formatEmbeddingSearchHit'
import {
  prepareCanvasWriteData,
  sanitizeCanvasDocForAgent,
} from '@/ai/canvas/agentView'
import {
  getFrontendCacheSettings,
  listFrontendCache,
  purgeFrontendCache,
  updateFrontendCacheSettings,
} from '@/frontend-cache/cacheToolHandlers'
import { trashOrDeleteDocument, restoreTrashedDocument } from '@/utilities/trashOrDeleteDocument'
import { resolveAgentListSelect } from '@/ai/agent/listSelect'
import {
  formatStockSearchForAgentLlm,
  importStockImageForAgent,
  importStockImagesForAgent,
  searchStockImagesForAgent,
} from '@/ai/agent/stockImages'
import { bulkAddGalleryImages } from '@/utilities/bulkAddGalleryImages'
import {
  formatAgentPermissions,
  toAgentAuthzContext,
} from '@/ai/agent/formatPermissions'
import { getUserAuthz } from '@/access/authzCache'

type AgentGlobalSlug = keyof Config['globals']

/** Max JSON chars returned to the LLM per tool call (safety net after field pruning). */
export const MAX_RESULT_CHARS = 128_000

function sanitizeGlobalResult(slug: string, data: Record<string, unknown>): Record<string, unknown> {
  if (slug !== 'ai-settings') {
    return data
  }

  return {
    ...data,
    apiKeyNote:
      'API Key 在 llm-providers / integration-credentials / email-transports / storage-targets 中加密存储，不在 Global 明文保存',
    promptsNote: 'Prompt 模板见 Collection prompt-templates，不在 ai-settings 内嵌',
  }
}

function summarizeQueryPreset(preset: PayloadQueryPreset) {
  return {
    id: preset.id,
    title: preset.title,
    relatedCollection: preset.relatedCollection,
    isShared: preset.isShared,
    where: preset.where,
    columns: preset.columns,
    groupBy: preset.groupBy,
  }
}

function summarizeAuditLog(doc: AuditLog) {
  const changes = doc.changes
  let changesPreview: string | null = null

  if (changes !== undefined && changes !== null) {
    const json = JSON.stringify(changes)
    changesPreview =
      json.length > 200 ? `${json.slice(0, 200)}…（共 ${json.length} 字符）` : json
  }

  const user = doc.user
  const userSummary =
    user && typeof user === 'object'
      ? {
          id: (user as { id?: unknown }).id,
          email: (user as { email?: unknown }).email,
        }
      : user

  return {
    id: doc.id,
    collection: doc.collection,
    action: doc.action,
    documentId: doc.documentId,
    user: userSummary,
    createdAt: doc.createdAt,
    changesPreview,
  }
}

export type AgentToolDefinition = {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export const AGENT_TOOLS: AgentToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_my_permissions',
      description:
        '返回当前登录用户的角色 slug 与 Permission 列表（来自 authz-cache）。用户询问「我有什么权限/角色」时必须调用；勿臆测。',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_resources',
      description: '列出 AI 助手可管理的所有内容类型（Collections）和全局配置（Globals）',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'describe_resource',
      description:
        '查看某个内容类型（collection）或全局配置（global）的字段结构，create/update 前应先调用',
      parameters: {
        type: 'object',
        properties: {
          kind: {
            type: 'string',
            enum: ['collection', 'global'],
            description: '资源种类',
          },
          slug: { type: 'string', description: 'collection 或 global 的 slug' },
        },
        required: ['kind', 'slug'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'semantic_search',
      description:
        '按语义相似度搜索 posts/pages/novels/novel-chapters（需 Postgres + pgvector，且 AI 设置已选 Embedding 提供商）。返回 title、url、slug、docId、短 excerpt（非正文）；读全文用 get_document(collection, docId)。',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '自然语言搜索词' },
          collections: {
            type: 'array',
            items: { type: 'string', enum: ['posts', 'pages', 'novels', 'novel-chapters'] },
            description: '限定内容类型，默认 posts + pages + novels + novel-chapters',
          },
          limit: { type: 'number', description: '返回条数，默认 8，最大 25' },
          status: {
            type: 'string',
            description: '可选：published / draft，默认不过滤',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'find_documents',
      description:
        '查询/搜索某个内容类型下的文档列表（不含正文等大字段，详情用 get_document）；novel-chapters 的 slug 仅为章节段，须配合 where.novel；查回收站时设 trash: true',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '内容类型 slug，如 posts、pages' },
          where: {
            type: 'object',
            description: 'Payload where 查询条件（JSON 对象），可选',
          },
          trash: {
            type: 'boolean',
            description: '为 true 时仅查回收站（软删除）文档',
          },
          limit: { type: 'number', description: '返回条数，默认 10，最大 25' },
          page: { type: 'number', description: '页码，默认 1' },
          sort: { type: 'string', description: '排序字段，如 -createdAt' },
        },
        required: ['collection'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_document',
      description:
        '根据 ID 获取单个文档详情（含富文本正文；列表 find_documents 不含 content 等大字段）',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '内容类型 slug' },
          id: { type: ['string', 'number'], description: '文档 ID' },
          depth: { type: 'number', description: '关联深度，默认 1' },
        },
        required: ['collection', 'id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_document',
      description: '在某个内容类型下新建文档',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '内容类型 slug' },
          data: { type: 'object', description: '文档字段数据（JSON 对象）' },
        },
        required: ['collection', 'data'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_document',
      description: '更新已有文档的部分或全部字段',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '内容类型 slug' },
          id: { type: ['string', 'number'], description: '文档 ID' },
          data: { type: 'object', description: '要更新的字段（JSON 对象）' },
        },
        required: ['collection', 'id', 'data'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_document',
      description: '将指定文档移入回收站（软删除，可用 restore_document 恢复；media 不可删）',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '内容类型 slug' },
          id: { type: ['string', 'number'], description: '文档 ID' },
        },
        required: ['collection', 'id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'restore_document',
      description: '从回收站恢复软删除的文档（clear deletedAt）',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '内容类型 slug' },
          id: { type: ['string', 'number'], description: '文档 ID' },
        },
        required: ['collection', 'id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_site_stats',
      description:
        '读取各 Collection 内容统计（总数、回收站、草稿/已发布数），对应后台 /admin/stats',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_audit_logs',
      description:
        '查询审计日志（只读）。需 logs:read；可按 collection/action/documentId 过滤',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '可选，内容类型 slug，如 posts' },
          action: {
            type: 'string',
            enum: ['create', 'update', 'delete'],
            description: '可选，操作类型',
          },
          documentId: { type: 'string', description: '可选，文档 ID' },
          limit: { type: 'number', description: '返回条数，默认 10，最大 25' },
          page: { type: 'number', description: '页码，默认 1' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_frontend_cache',
      description:
        '查询前台 HTML 缓存：自动发现的 registry 路径列表（page.tsx/route.ts）、每项 DB 状态与过期状态（expiryStatus）、动态路由明细、dbStats 与 cache-settings（对应后台「缓存管理」）',
      parameters: {
        type: 'object',
        properties: {
          group: {
            type: 'string',
            enum: ['page', 'route', 'dynamic'],
            description: '可选，按分组过滤（含 dynamic 动态路由 pattern 条目）',
          },
          dynamicLimit: {
            type: 'number',
            description: '动态路由明细条数上限，默认 100，最大 500（group 为 dynamic 或未指定时返回）',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'purge_frontend_cache',
      description:
        '清除前台 DB 中的页面 HTML 缓存（内容变更不会自动失效，需手动清除）。支持 ids（registry id）、routePaths（具体 path）、expired: true（仅删过期）、或 all: true；操作前应向用户确认',
      parameters: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: '要清除的 registry 条目 id，如 auto-（首页）、auto-about、auto-s-slug（动态 pattern）',
          },
          routePaths: {
            type: 'array',
            items: { type: 'string' },
            description: '要清除的具体路由 path，如 /posts/hello-world（来自 dynamicRoutes）',
          },
          expired: {
            type: 'boolean',
            description: '为 true 时仅删除 expiresAt 已过的过期条目（等同后台「清除过期」）',
          },
          all: {
            type: 'boolean',
            description: '为 true 时清空全部 DB 前台缓存',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_cache_settings',
      description:
        '读取前台缓存设置（cache-settings）：是否启用 HTML 缓存、pageRevalidateSeconds（TTL 秒）、是否输出调试 Header',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_cache_settings',
      description:
        '更新前台缓存设置（cache-settings）。修改 TTL 或开关前向用户确认；至少传一个字段',
      parameters: {
        type: 'object',
        properties: {
          cachingEnabled: {
            type: 'boolean',
            description: '是否启用前台缓存',
          },
          pageRevalidateSeconds: {
            type: 'number',
            description: '页面 HTML 缓存 TTL（秒），≥0',
          },
          exposeCacheHeaders: {
            type: 'boolean',
            description: '是否输出 X-Crispy-* 缓存调试 Header',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_query_presets',
      description:
        '列出后台保存的查询预设（payload-query-presets），可按 relatedCollection 过滤；可将 where 复用到 find_documents',
      parameters: {
        type: 'object',
        properties: {
          relatedCollection: {
            type: 'string',
            description: '可选，限定关联的 collection slug，如 posts、pages',
          },
          limit: { type: 'number', description: '返回条数，默认 25，最大 50' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_stock_images',
      description:
        '从 Unsplash 检索可导入 media 媒体库的图片（需 Admin 集成设置 Active Unsplash）。返回 photoId、缩略图与 downloadLocation。用户说「N 张」时必须传 limit: N。展示结果后须询问用户要导入哪些；用户确认后再 import_stock_image，或让用户点击聊天中的「加入图库」按钮。',
      parameters: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: '可选，额外搜索关键词' },
          topic: {
            type: 'string',
            description:
              '主题：all、nature、business、people、technology、food、architecture、abstract',
          },
          style: {
            type: 'string',
            description:
              '风格：all、anime、manga、illustration、cartoon、watercolor、minimalist、vintage、cyberpunk、pixel、sketch、3d',
          },
          orientation: {
            type: 'string',
            enum: ['landscape', 'portrait', 'squarish'],
            description: '可选，图片比例',
          },
          limit: {
            type: 'number',
            description: '返回张数；用户要求 N 张时传 N，默认 10，最大 30',
          },
          page: { type: 'number', description: '页码，默认 1' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'import_stock_image',
      description:
        '将单张 Unsplash 图片导入 media。多图请优先 import_stock_images。userConfirmed 必须为 true。',
      parameters: {
        type: 'object',
        properties: {
          photoId: { type: 'string', description: 'search_stock_images 返回的 photoId' },
          downloadLocation: {
            type: 'string',
            description: 'search_stock_images 返回的 downloadLocation',
          },
          alt: { type: 'string', description: '可选，media 的 alt 文本' },
          userConfirmed: {
            type: 'boolean',
            description: '必须为 true，表示用户已明确确认导入',
          },
        },
        required: ['photoId', 'downloadLocation', 'userConfirmed'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'import_stock_images',
      description:
        '批量将多张 Unsplash 图片导入 media（单次最多 10 张）。photos 须来自最近一次 search_stock_images 的 photoId + downloadLocation。userConfirmed 必须为 true。',
      parameters: {
        type: 'object',
        properties: {
          photos: {
            type: 'array',
            description: '待导入图片列表',
            items: {
              type: 'object',
              properties: {
                photoId: { type: 'string' },
                downloadLocation: { type: 'string' },
                alt: { type: 'string' },
              },
              required: ['photoId', 'downloadLocation'],
            },
          },
          userConfirmed: {
            type: 'boolean',
            description: '必须为 true，表示用户已明确确认导入',
          },
        },
        required: ['photos', 'userConfirmed'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'bulk_add_gallery_images',
      description:
        '将已有 media ID 批量加入指定图库（galleries），自动创建 gallery-items；已在该图库中的图片会跳过。单次最多 50 张。',
      parameters: {
        type: 'object',
        properties: {
          galleryId: {
            type: ['string', 'number'],
            description: '目标图库 galleries 的文档 ID',
          },
          mediaIds: {
            type: 'array',
            description: 'media 文档 ID 列表',
            items: { type: ['string', 'number'] },
          },
        },
        required: ['galleryId', 'mediaIds'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_global',
      description:
        '读取全局配置（header、footer、site-settings、comment-settings、cache-settings、ai-settings、storage-settings、integration-settings、email-settings）',
      parameters: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Global slug' },
          depth: { type: 'number', description: '关联深度，默认 1' },
        },
        required: ['slug'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_global',
      description: '更新全局配置',
      parameters: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Global slug' },
          data: { type: 'object', description: '要更新的字段（JSON 对象）' },
        },
        required: ['slug', 'data'],
      },
    },
  },
]

function truncateResult(value: unknown): unknown {
  const json = JSON.stringify(value)
  if (json.length <= MAX_RESULT_CHARS) return value

  return {
    truncated: true,
    preview: json.slice(0, MAX_RESULT_CHARS),
    message: `结果过长已截断（共 ${json.length} 字符）`,
  }
}

function parseToolArgs(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    throw new Error('工具参数 JSON 解析失败')
  }
}

export async function executeAgentTool(
  req: PayloadRequest,
  toolCall: AgentToolCall,
): Promise<{ content: string; summary: unknown }> {
  const args = parseToolArgs(toolCall.arguments)
  let result: unknown

  switch (toolCall.name) {
    case 'get_my_permissions': {
      if (!req.user?.id) throw new Error('Unauthorized')
      const authz = await getUserAuthz(req.payload, req.user.id, req)
      result = formatAgentPermissions(toAgentAuthzContext(authz))
      break
    }

    case 'list_resources':
      result = { collections: AGENT_COLLECTIONS, globals: AGENT_GLOBALS }
      break

    case 'describe_resource': {
      const kind = String(args.kind ?? '')
      const slug = String(args.slug ?? '')
      if (kind === 'collection') {
        await assertAgentCollectionAccess(req, slug, 'read')
        result = describeCollectionSchema(req, slug)
      } else if (kind === 'global') {
        await assertAgentGlobalAccess(req, slug, 'read')
        result = describeGlobalSchema(req, slug)
      } else {
        throw new Error('kind 必须是 collection 或 global')
      }
      break
    }

    case 'semantic_search': {
      const query = String(args.query ?? '')
      const collections = Array.isArray(args.collections)
        ? (args.collections.filter(
            (c) => c === 'posts' || c === 'pages' || c === 'novels' || c === 'novel-chapters',
          ) as EmbeddableCollection[])
        : undefined
      const limit = Math.min(Math.max(Number(args.limit) || 8, 1), 25)
      const status = args.status != null ? String(args.status) : undefined

      const rows = await runSemanticContentSearch(req, query, {
        collections,
        limit: limit * 3,
        status,
      })

      const ownPostsOnly = !(await canAgentAccessAnyPost(req))
      const scoped = []
      for (const row of rows) {
        if (ownPostsOnly && row.collection === 'posts') {
          try {
            await assertAgentCollectionAccess(req, 'posts', 'read', row.docId)
          } catch {
            continue
          }
        }
        scoped.push(row)
        if (scoped.length >= limit) break
      }

      result = scoped.map(formatEmbeddingSearchHit)
      break
    }

    case 'find_documents': {
      const collection = String(args.collection ?? '')
      await assertAgentCollectionAccess(req, collection, 'read')
      const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 25)
      const page = Math.max(Number(args.page) || 1, 1)
      const trash = args.trash === true
      const listSelect = resolveAgentListSelect(collection)

      let where = args.where as Where | undefined
      if (collection === 'posts' && req.user && !(await canAgentAccessAnyPost(req))) {
        const own = ownPostsWhere(req.user.id)
        where = where ? ({ and: [where, own] } as Where) : own
      }

      const docs = await req.payload.find({
        collection: collection as CollectionSlug,
        where,
        limit,
        page,
        sort: (args.sort as string) || '-updatedAt',
        depth: 1,
        trash,
        overrideAccess: false,
        user: req.user,
        ...(listSelect ? { select: listSelect } : {}),
      })
      result = {
        totalDocs: docs.totalDocs,
        page: docs.page,
        totalPages: docs.totalPages,
        trash,
        docs: docs.docs,
      }
      break
    }

    case 'get_document': {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'read', id)
      const doc = await req.payload.findByID({
        collection: collection as CollectionSlug,
        id,
        depth: Math.min(Number(args.depth) || 1, 2),
        overrideAccess: false,
        user: req.user,
      })
      result =
        collection === 'ai-canvases' && doc && typeof doc === 'object'
          ? sanitizeCanvasDocForAgent(doc as unknown as Record<string, unknown>)
          : doc
      break
    }

    case 'create_document': {
      const collection = String(args.collection ?? '')
      await assertAgentCollectionAccess(req, collection, 'create')
      if (!args.data || typeof args.data !== 'object') {
        throw new Error('data 必须是对象')
      }
      const rawData = args.data as Record<string, unknown>
      const data =
        collection === 'ai-canvases' ? prepareCanvasWriteData(rawData, 'create') : rawData
      const created = await req.payload.create({
        collection: collection as CollectionSlug,
        data: data as never,
        overrideAccess: false,
        user: req.user,
      })
      result =
        collection === 'ai-canvases' && created && typeof created === 'object'
          ? sanitizeCanvasDocForAgent(created as unknown as Record<string, unknown>)
          : created
      break
    }

    case 'update_document': {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'update', id)
      if (!args.data || typeof args.data !== 'object') {
        throw new Error('data 必须是对象')
      }
      const rawData = args.data as Record<string, unknown>
      const data =
        collection === 'ai-canvases' ? prepareCanvasWriteData(rawData, 'update') : rawData
      const updated = await req.payload.update({
        collection: collection as CollectionSlug,
        id,
        data: data as never,
        overrideAccess: false,
        user: req.user,
      })
      result =
        collection === 'ai-canvases' && updated && typeof updated === 'object'
          ? sanitizeCanvasDocForAgent(updated as unknown as Record<string, unknown>)
          : updated
      break
    }

    case 'delete_document': {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'delete', id)
      result = await trashOrDeleteDocument({
        req,
        collection: collection as CollectionSlug,
        id,
      })
      break
    }

    case 'restore_document': {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'update', id)
      result = await restoreTrashedDocument({
        req,
        collection: collection as CollectionSlug,
        id,
      })
      break
    }

    case 'get_site_stats': {
      await assertAgentStatsAccess(req)
      result = await collectCollectionStats(req.payload, req)
      break
    }

    case 'list_audit_logs': {
      await assertAgentAuditLogAccess(req)
      const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 25)
      const page = Math.max(Number(args.page) || 1, 1)
      const filters: Where[] = []

      if (args.collection) {
        filters.push({ collection: { equals: String(args.collection) } })
      }
      if (args.action) {
        filters.push({ action: { equals: String(args.action) } })
      }
      if (args.documentId) {
        filters.push({ documentId: { equals: String(args.documentId) } })
      }

      const where = filters.length > 0 ? ({ and: filters } satisfies Where) : undefined

      const logs = await req.payload.find({
        collection: 'audit-logs',
        where,
        limit,
        page,
        sort: '-createdAt',
        depth: 1,
        overrideAccess: false,
        user: req.user,
      })

      result = {
        totalDocs: logs.totalDocs,
        page: logs.page,
        totalPages: logs.totalPages,
        docs: logs.docs.map((doc) => summarizeAuditLog(doc)),
      }
      break
    }

    case 'get_cache_settings': {
      await assertAgentCacheAccess(req)
      result = await getFrontendCacheSettings()
      break
    }

    case 'update_cache_settings': {
      await assertAgentCacheAccess(req)
      await assertAgentGlobalAccess(req, 'cache-settings', 'update')
      result = await updateFrontendCacheSettings(req, args)
      break
    }

    case 'list_frontend_cache': {
      await assertAgentCacheAccess(req)
      const cacheList = await listFrontendCache({
        group: args.group ? String(args.group) : undefined,
        dynamicLimit: args.dynamicLimit !== undefined ? Number(args.dynamicLimit) : undefined,
      })
      if (cacheList.dynamicRoutesNote) {
        cacheList.dynamicRoutesNote +=
          '；registry 每项 status 含 expiryStatus（valid/expiringSoon/expired/none）'
      }
      result = cacheList
      break
    }

    case 'purge_frontend_cache': {
      await assertAgentCacheAccess(req)
      result = await purgeFrontendCache({
        all: args.all === true,
        expired: args.expired === true,
        routePaths: Array.isArray(args.routePaths) ? args.routePaths.map(String) : undefined,
        ids: Array.isArray(args.ids) ? args.ids.map(String) : undefined,
      })
      break
    }

    case 'list_query_presets': {
      await assertAgentCollectionAccess(req, 'payload-query-presets', 'read')
      const relatedCollection = args.relatedCollection ? String(args.relatedCollection) : undefined
      const limit = Math.min(Math.max(Number(args.limit) || 25, 1), 50)
      const where = relatedCollection
        ? ({ relatedCollection: { equals: relatedCollection } } satisfies Where)
        : undefined

      const presets = await req.payload.find({
        collection: 'payload-query-presets',
        where,
        limit,
        sort: '-updatedAt',
        depth: 0,
        overrideAccess: false,
        user: req.user,
      })

      result = {
        totalDocs: presets.totalDocs,
        docs: presets.docs.map((doc) => summarizeQueryPreset(doc as PayloadQueryPreset)),
      }
      break
    }

    case 'get_global': {
      const slug = String(args.slug ?? '')
      await assertAgentGlobalAccess(req, slug, 'read')
      if (!isAgentGlobal(slug)) {
        throw new Error(`不支持的全局配置：${slug}`)
      }
      const globalDoc = await req.payload.findGlobal({
        slug: slug as AgentGlobalSlug,
        depth: Math.min(Number(args.depth) || 1, 2),
        overrideAccess: false,
        user: req.user,
      })
      result = sanitizeGlobalResult(slug, globalDoc as unknown as Record<string, unknown>)
      break
    }

    case 'update_global': {
      const slug = String(args.slug ?? '')
      await assertAgentGlobalAccess(req, slug, 'update')
      if (!isAgentGlobal(slug)) {
        throw new Error(`不支持的全局配置：${slug}`)
      }
      if (!args.data || typeof args.data !== 'object') {
        throw new Error('data 必须是对象')
      }
      result = await req.payload.updateGlobal({
        slug: slug as AgentGlobalSlug,
        data: args.data as Record<string, unknown>,
        overrideAccess: false,
        user: req.user,
      })
      break
    }

    case 'search_stock_images':
      result = await searchStockImagesForAgent(req, args)
      break

    case 'import_stock_image':
      result = await importStockImageForAgent(req, args)
      break

    case 'import_stock_images':
      result = await importStockImagesForAgent(req, args)
      break

    case 'bulk_add_gallery_images': {
      const galleryId = args.galleryId as string | number
      await assertAgentCollectionAccess(req, 'galleries', 'update', galleryId)
      await assertAgentCollectionAccess(req, 'gallery-items', 'create')
      const mediaIds = args.mediaIds
      if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
        throw new Error('mediaIds 必须是非空数组')
      }
      if (mediaIds.length > 50) {
        throw new Error('单次最多 50 张，请分批调用')
      }
      result = await bulkAddGalleryImages({
        payload: req.payload,
        galleryId,
        mediaIds,
        req,
      })
      break
    }

    default:
      throw new Error(`未知工具：${toolCall.name}`)
  }

  if (toolCall.name === 'search_stock_images') {
    const full = result as Awaited<ReturnType<typeof searchStockImagesForAgent>>
    return {
      content: JSON.stringify(formatStockSearchForAgentLlm(full)),
      summary: full,
    }
  }

  const truncated = truncateResult(result)
  return {
    content: JSON.stringify(truncated),
    summary: truncated,
  }
}
