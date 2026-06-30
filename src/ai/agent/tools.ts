import type { CollectionSlug, PayloadRequest, Where } from 'payload'

import {
  assertAgentCollectionAccess,
  assertAgentGlobalAccess,
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
import type { Config } from '@/payload-types'
import type { AgentToolCall } from '@/ai/agent/types'
import { runSemanticContentSearch } from '@/ai/embeddings/semanticSearch'

type AgentGlobalSlug = keyof Config['globals']

const MAX_RESULT_CHARS = 12_000

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
        '按语义相似度搜索 posts/pages 内容（需 PostgreSQL pgvector）。适合自然语言查找相关文章或页面。',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '自然语言搜索词' },
          collections: {
            type: 'array',
            items: { type: 'string', enum: ['posts', 'pages'] },
            description: '限定内容类型，默认 posts + pages',
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
      description: '查询/搜索某个内容类型下的文档列表',
      parameters: {
        type: 'object',
        properties: {
          collection: { type: 'string', description: '内容类型 slug，如 posts、pages' },
          where: {
            type: 'object',
            description: 'Payload where 查询条件（JSON 对象），可选',
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
      description: '根据 ID 获取单个文档详情',
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
      description: '删除指定文档（media 不可删除）',
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
      name: 'get_global',
      description: '读取全局配置（header、footer、site-settings）',
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
        await assertAgentGlobalAccess(req)
        result = describeGlobalSchema(req, slug)
      } else {
        throw new Error('kind 必须是 collection 或 global')
      }
      break
    }

    case 'semantic_search': {
      const query = String(args.query ?? '')
      const collections = Array.isArray(args.collections)
        ? (args.collections.filter((c) => c === 'posts' || c === 'pages') as (
            | 'posts'
            | 'pages'
          )[])
        : undefined
      const limit = Math.min(Math.max(Number(args.limit) || 8, 1), 25)
      const status = args.status != null ? String(args.status) : undefined

      result = await runSemanticContentSearch(req, query, {
        collections,
        limit,
        status,
      })
      break
    }

    case 'find_documents': {
      const collection = String(args.collection ?? '')
      await assertAgentCollectionAccess(req, collection, 'read')
      const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 25)
      const page = Math.max(Number(args.page) || 1, 1)
      const docs = await req.payload.find({
        collection: collection as CollectionSlug,
        where: args.where as Where | undefined,
        limit,
        page,
        sort: (args.sort as string) || '-updatedAt',
        depth: 1,
        overrideAccess: false,
        user: req.user,
      })
      result = {
        totalDocs: docs.totalDocs,
        page: docs.page,
        totalPages: docs.totalPages,
        docs: docs.docs,
      }
      break
    }

    case 'get_document': {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'read', id)
      result = await req.payload.findByID({
        collection: collection as CollectionSlug,
        id,
        depth: Math.min(Number(args.depth) || 1, 2),
        overrideAccess: false,
        user: req.user,
      })
      break
    }

    case 'create_document': {
      const collection = String(args.collection ?? '')
      await assertAgentCollectionAccess(req, collection, 'create')
      if (!args.data || typeof args.data !== 'object') {
        throw new Error('data 必须是对象')
      }
      result = await req.payload.create({
        collection: collection as CollectionSlug,
        // Dynamic data shape from AI tool arguments
        data: args.data as never,
        overrideAccess: false,
        user: req.user,
      })
      break
    }

    case 'update_document': {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'update', id)
      if (!args.data || typeof args.data !== 'object') {
        throw new Error('data 必须是对象')
      }
      result = await req.payload.update({
        collection: collection as CollectionSlug,
        id,
        data: args.data as never,
        overrideAccess: false,
        user: req.user,
      })
      break
    }

    case 'delete_document': {
      const collection = String(args.collection ?? '')
      const id = args.id as string | number
      await assertAgentCollectionAccess(req, collection, 'delete', id)
      result = await req.payload.delete({
        collection: collection as CollectionSlug,
        id,
        overrideAccess: false,
        user: req.user,
      })
      break
    }

    case 'get_global': {
      const slug = String(args.slug ?? '')
      await assertAgentGlobalAccess(req)
      if (!isAgentGlobal(slug)) {
        throw new Error(`不支持的全局配置：${slug}`)
      }
      result = await req.payload.findGlobal({
        slug: slug as AgentGlobalSlug,
        depth: Math.min(Number(args.depth) || 1, 2),
        overrideAccess: false,
        user: req.user,
      })
      break
    }

    case 'update_global': {
      const slug = String(args.slug ?? '')
      await assertAgentGlobalAccess(req)
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

    default:
      throw new Error(`未知工具：${toolCall.name}`)
  }

  const truncated = truncateResult(result)
  return {
    content: JSON.stringify(truncated),
    summary: truncated,
  }
}
