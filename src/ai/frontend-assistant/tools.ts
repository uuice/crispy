import type { PayloadRequest } from 'payload'

import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { resolveEmbeddingConfig } from '@/ai/embeddings/config'
import { runSemanticContentSearch } from '@/ai/embeddings/semanticSearch'
import type { AgentToolCall } from '@/ai/agent/types'

import { formatEmbeddingSearchHit } from '@/ai/embeddings/formatEmbeddingSearchHit'
import {
  parsePublicContentTypes,
  PUBLIC_CONTENT_TYPES,
  runGetPublicContent,
  runKeywordContentSearch,
  runListPublicContent,
  type PublicContentType,
} from './keywordSearch'

export type FrontendAssistantToolDefinition = {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

const CONTENT_TYPE_ENUM = [...PUBLIC_CONTENT_TYPES]

export const FRONTEND_ASSISTANT_TOOLS: FrontendAssistantToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'search_content',
      description:
        '按关键词搜索站内所有公开内容：文章、页面、小说、小说章节、小说分类/标签、博客分类/标签、友链、友链分组、招聘、图库、导航站点与站点栏目。',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '搜索关键词，多个词用空格分隔' },
          types: {
            type: 'array',
            items: { type: 'string', enum: CONTENT_TYPE_ENUM },
            description: '可选：限定内容类型',
          },
          limit: { type: 'number', description: '返回条数，默认 10，最大 25' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_content',
      description: '列出某一类型的公开内容目录，可按关键词过滤。适合浏览全部分类、标签、友链分组或友链等。',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: CONTENT_TYPE_ENUM,
            description: '内容类型',
          },
          query: { type: 'string', description: '可选：在目录中过滤关键词' },
          limit: { type: 'number', description: '返回条数，默认 20，最大 50' },
        },
        required: ['type'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_content',
      description:
        '按类型与 slug 获取单条公开内容元数据（标题、摘要、分类等，不含正文）。小说章节 slug 为 {novelSlug}/{chapterSlug}，如 gelou-jiuyaoshi/zoulang-jintou；读全文请引导用户打开返回的 url。',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['post', 'page', 'novel', 'novel-chapter', 'novel-category', 'novel-tag', 'category', 'tag', 'link', 'link-group', 'job', 'gallery-item', 'navigation'],
            description: '内容类型',
          },
          slug: {
            type: 'string',
            description:
              'slug 或唯一标识；novel-chapter 须传复合 slug（{novelSlug}/{chapterSlug}）；link/gallery-item 传数字 id',
          },
        },
        required: ['type', 'slug'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'semantic_search',
      description:
        '按语义相似度搜索已发布文章、页面、小说与章节（需 PostgreSQL pgvector）。返回 title、url、slug、短 excerpt（非正文）；novel-chapter 的 slug 为 {novelSlug}/{chapterSlug}，可传给 get_content 取元数据；读全文引导用户打开 url。',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '自然语言搜索词或问题' },
          collections: {
            type: 'array',
            items: { type: 'string', enum: ['posts', 'pages', 'novels', 'novel-chapters'] },
            description: '限定内容类型，默认 posts + pages + novels + novel-chapters',
          },
          limit: { type: 'number', description: '返回条数，默认 8，最大 15' },
        },
        required: ['query'],
      },
    },
  },
]

function parseToolArgs(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return { raw }
  }
}

function parseContentType(value: unknown): PublicContentType {
  const type = String(value ?? '')
  if (!(PUBLIC_CONTENT_TYPES as readonly string[]).includes(type)) {
    throw new Error(`type 必须是: ${PUBLIC_CONTENT_TYPES.join(', ')}`)
  }
  return type as PublicContentType
}

export async function executeFrontendAssistantTool(
  req: PayloadRequest,
  toolCall: AgentToolCall,
): Promise<{ content: string; summary: unknown }> {
  const args = parseToolArgs(toolCall.arguments)
  let result: unknown

  switch (toolCall.name) {
    case 'search_content':
    case 'keyword_search': {
      const query = String(args.query ?? '')
      const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 25)
      const types = parsePublicContentTypes(args.types)
      result = await runKeywordContentSearch(query, limit, types)
      break
    }

    case 'list_content': {
      const type = parseContentType(args.type)
      const query = args.query != null ? String(args.query) : undefined
      const limit = Math.min(Math.max(Number(args.limit) || 20, 1), 50)
      result = await runListPublicContent(type, { query, limit })
      break
    }

    case 'get_content': {
      const type = parseContentType(args.type)
      const slug = String(args.slug ?? '')
      if (!slug) {
        throw new Error('slug 不能为空')
      }
      result = await runGetPublicContent(type, slug)
      if (!result) {
        throw new Error('未找到对应内容')
      }
      break
    }

    case 'semantic_search': {
      const embedding = resolveEmbeddingConfig()
      if (!embedding.enabled) {
        throw new Error('语义搜索未启用，请改用 search_content')
      }

      const query = String(args.query ?? '')
      const collections = Array.isArray(args.collections)
        ? (args.collections.filter(
            (c) => c === 'posts' || c === 'pages' || c === 'novels' || c === 'novel-chapters',
          ) as EmbeddableCollection[])
        : undefined
      const limit = Math.min(Math.max(Number(args.limit) || 8, 1), 15)

      const rows = await runSemanticContentSearch(req, query, {
        collections,
        limit,
        status: 'published',
      })

      result = rows.map(formatEmbeddingSearchHit)
      break
    }

    default:
      throw new Error(`未知工具: ${toolCall.name}`)
  }

  const content = JSON.stringify(result, null, 2)
  return { content, summary: result }
}
