import type { PayloadRequest } from 'payload'

import { hasRole } from '@/access/roles'
import { canUseAiAgent } from '@/ai/agent/access'
import {
  buildUnsplashSearchQuery,
  isUnsplashStyleId,
  isUnsplashTopicId,
  parseUnsplashOrientation,
} from '@/unsplash/categories'
import { isUnsplashEnabled } from '@/unsplash/isEnabled'
import { importUnsplashPhoto } from '@/unsplash/server/importPhoto'
import { searchUnsplashPhotos } from '@/unsplash/server/searchPhotos'

export type AgentStockImage = {
  photoId: string
  alt: string
  thumbUrl: string
  photographer: string
  downloadLocation: string
}

export function assertAgentStockImageAccess(req: PayloadRequest): void {
  if (!canUseAiAgent(req.user)) {
    throw new Error('无权使用 AI 助手')
  }

  if (!hasRole(req.user, ['super-admin', 'editor', 'author'])) {
    throw new Error('仅作者及以上可通过 AI 助手检索或导入图片')
  }

  if (!isUnsplashEnabled()) {
    throw new Error('Unsplash 未配置，请在环境变量中设置 UNSPLASH_ACCESS_KEY')
  }
}

export async function searchStockImagesForAgent(req: PayloadRequest, args: Record<string, unknown>) {
  assertAgentStockImageAccess(req)

  const keyword = args.keyword != null ? String(args.keyword) : ''
  const topicParam = args.topic != null ? String(args.topic) : 'all'
  const styleParam = args.style != null ? String(args.style) : 'all'
  const page = Math.max(1, Number.parseInt(String(args.page ?? '1'), 10) || 1)
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

  const data = await searchUnsplashPhotos({ query, page, orientation })

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
    total: data.total,
    totalPages: data.totalPages,
    photos,
    uiHint:
      '向用户展示搜索结果并询问要导入哪些图片；用户可在聊天缩略图上点击「加入图库」，或明确回复后再调用 import_stock_image（userConfirmed: true）',
  }
}

export async function importStockImageForAgent(
  req: PayloadRequest,
  args: Record<string, unknown>,
) {
  assertAgentStockImageAccess(req)

  if (args.userConfirmed !== true) {
    throw new Error(
      '导入前需要用户明确确认。请先展示 search_stock_images 的结果并询问用户，待用户同意后再设 userConfirmed: true',
    )
  }

  const photoId = String(args.photoId ?? '').trim()
  const downloadLocation = String(args.downloadLocation ?? '').trim()
  const alt = args.alt != null ? String(args.alt) : undefined

  if (!photoId || !downloadLocation.startsWith('https://')) {
    throw new Error('photoId 与 downloadLocation 为必填，且 downloadLocation 须为 https URL')
  }

  const doc = await importUnsplashPhoto({
    payload: req.payload,
    req,
    input: { photoId, downloadLocation, alt },
  })

  return {
    imported: true,
    mediaId: doc.id,
    filename: doc.filename,
    alt: doc.alt,
    url: doc.url,
  }
}
