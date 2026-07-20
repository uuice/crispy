import type { PayloadRequest } from 'payload'

import { can } from '@/access/can'
import { canUseAiAgent } from '@/ai/agent/access'
import {
  buildUnsplashSearchQuery,
  isUnsplashStyleId,
  isUnsplashTopicId,
  parseUnsplashOrientation,
} from '@/unsplash/categories'
import { isUnsplashEnabled } from '@/unsplash/isEnabled'
import { parseUnsplashLimit, MAX_UNSPLASH_PAGE_SIZE } from '@/unsplash/parseLimit'
import { importUnsplashPhoto } from '@/unsplash/server/importPhoto'
import { searchUnsplashPhotos } from '@/unsplash/server/searchPhotos'

export type AgentStockImage = {
  photoId: string
  alt: string
  thumbUrl: string
  photographer: string
  downloadLocation: string
}

export type AgentStockSearchResult = {
  query: string
  topic: string
  style: string
  page: number
  limit: number
  total: number
  totalPages: number
  photos: AgentStockImage[]
  uiHint: string
}

const MAX_BATCH_IMPORT = 10

export async function assertAgentStockImageAccess(req: PayloadRequest): Promise<void> {
  if (!(await canUseAiAgent(req.user, req))) {
    throw new Error('无权使用 AI 助手')
  }

  if (!(await can(req.user, 'ai:use', req))) {
    throw new Error('仅具备 ai:use 可通过 AI 助手检索或导入图片')
  }

  if (!(await isUnsplashEnabled())) {
    throw new Error('Unsplash 未配置：请在「集成凭证」添加 Key，并在「集成设置」中选为 Active')
  }
}

export async function assertAgentStockImageImportAccess(req: PayloadRequest): Promise<void> {
  await assertAgentStockImageAccess(req)
  if (!(await can(req.user, 'media:create', req))) {
    throw new Error('仅具备 media:create 可通过 AI 助手导入图片到 media')
  }
}

/** Compact payload for LLM context — omits thumbUrl to save tokens. */
export function formatStockSearchForAgentLlm(result: AgentStockSearchResult) {
  return {
    query: result.query,
    topic: result.topic,
    style: result.style,
    page: result.page,
    limit: result.limit,
    returned: result.photos.length,
    total: result.total,
    photos: result.photos.map((photo, index) => ({
      index: index + 1,
      photoId: photo.photoId,
      alt: photo.alt,
      photographer: photo.photographer,
      downloadLocation: photo.downloadLocation,
    })),
    uiHint: result.uiHint,
  }
}

function parseStockPhotoInput(value: unknown): { photoId: string; downloadLocation: string; alt?: string } | null {
  if (!value || typeof value !== 'object') return null
  const photo = value as Record<string, unknown>
  const photoId = String(photo.photoId ?? '').trim()
  const downloadLocation = String(photo.downloadLocation ?? '').trim()
  const alt = photo.alt != null ? String(photo.alt) : undefined

  if (!photoId || !downloadLocation.startsWith('https://')) {
    return null
  }

  return { photoId, downloadLocation, alt }
}

export async function searchStockImagesForAgent(
  req: PayloadRequest,
  args: Record<string, unknown>,
): Promise<AgentStockSearchResult> {
  await assertAgentStockImageAccess(req)

  const keyword = args.keyword != null ? String(args.keyword) : ''
  const topicParam = args.topic != null ? String(args.topic) : 'all'
  const styleParam = args.style != null ? String(args.style) : 'all'
  const page = Math.max(1, Number.parseInt(String(args.page ?? '1'), 10) || 1)
  const limit = parseUnsplashLimit(args.limit, 8)
  const orientation = parseUnsplashOrientation(
    args.orientation != null ? String(args.orientation) : null,
  )

  if (!isUnsplashTopicId(topicParam)) {
    throw new Error(`无效主题：${topicParam}`)
  }

  if (!isUnsplashStyleId(styleParam)) {
    throw new Error(`无效风格：${styleParam}`)
  }

  const query = buildUnsplashSearchQuery(topicParam, styleParam, keyword)
  if (!query) {
    throw new Error('请指定主题、风格或关键词中的至少一项')
  }

  const data = await searchUnsplashPhotos({ query, page, limit, orientation })

  const photos: AgentStockImage[] = data.photos.map((photo) => ({
    photoId: photo.id,
    alt: photo.alt,
    thumbUrl: photo.thumbUrl,
    photographer: photo.photographer,
    downloadLocation: photo.downloadLocation,
  }))

  return {
    query,
    topic: topicParam,
    style: styleParam,
    page: data.page,
    limit: data.limit,
    total: data.total,
    totalPages: data.totalPages,
    photos,
    uiHint:
      '聊天 UI 已展示全部 returned 张缩略图。导入时直接用本结果中的 photoId + downloadLocation；勿声称「只展示部分」或反复说「查看详情」。多张导入用 import_stock_images，或让用户点击「加入图库」。',
  }
}

export async function importStockImageForAgent(
  req: PayloadRequest,
  args: Record<string, unknown>,
) {
  await assertAgentStockImageImportAccess(req)

  if (args.userConfirmed !== true) {
    throw new Error(
      '导入前需要用户明确确认。请先展示 search_stock_images 的结果并询问用户，待用户同意后再设 userConfirmed: true',
    )
  }

  const photo = parseStockPhotoInput(args)
  if (!photo) {
    throw new Error('photoId 与 downloadLocation 为必填，且 downloadLocation 须为 https URL')
  }

  const doc = await importUnsplashPhoto({
    payload: req.payload,
    req,
    input: photo,
  })

  return {
    imported: 1,
    mediaIds: [doc.id],
    items: [{ mediaId: doc.id, filename: doc.filename, alt: doc.alt, url: doc.url }],
  }
}

export async function importStockImagesForAgent(
  req: PayloadRequest,
  args: Record<string, unknown>,
) {
  await assertAgentStockImageImportAccess(req)

  if (args.userConfirmed !== true) {
    throw new Error(
      '批量导入前需要用户明确确认。请设 userConfirmed: true，并在 photos 中传入 search_stock_images 返回的条目',
    )
  }

  if (!Array.isArray(args.photos) || args.photos.length === 0) {
    throw new Error('photos 必须是非空数组')
  }

  if (args.photos.length > MAX_BATCH_IMPORT) {
    throw new Error(`单次最多导入 ${MAX_BATCH_IMPORT} 张，请分批调用`)
  }

  const items: Array<{ mediaId: string | number; filename?: string | null; alt?: string | null; url?: string | null }> = []

  for (const entry of args.photos) {
    const photo = parseStockPhotoInput(entry)
    if (!photo) {
      throw new Error('photos 中每项须含 photoId 与 downloadLocation（https）')
    }

    const doc = await importUnsplashPhoto({
      payload: req.payload,
      req,
      input: photo,
    })

    items.push({
      mediaId: doc.id,
      filename: doc.filename,
      alt: doc.alt,
      url: doc.url,
    })
  }

  return {
    imported: items.length,
    mediaIds: items.map((item) => item.mediaId),
    items,
  }
}

export { MAX_BATCH_IMPORT, MAX_UNSPLASH_PAGE_SIZE }
