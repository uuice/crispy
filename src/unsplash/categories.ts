import type { UnsplashOrientation } from '@/unsplash/types'

export type UnsplashTopicId =
  | 'all'
  | 'nature'
  | 'business'
  | 'people'
  | 'technology'
  | 'food'
  | 'architecture'
  | 'abstract'

export type UnsplashStyleId =
  | 'all'
  | 'anime'
  | 'manga'
  | 'illustration'
  | 'cartoon'
  | 'watercolor'
  | 'minimalist'
  | 'vintage'
  | 'cyberpunk'
  | 'pixel'
  | 'sketch'
  | '3d'

/** @deprecated Use UnsplashTopicId */
export type UnsplashCategoryId = UnsplashTopicId

export type { UnsplashOrientation }

export type UnsplashTopic = {
  id: UnsplashTopicId
  label: string
  query: string
}

export type UnsplashStyle = {
  id: UnsplashStyleId
  label: string
  query: string
}

export type UnsplashOrientationOption = {
  id: '' | UnsplashOrientation
  label: string
}

export const UNSPLASH_TOPICS: UnsplashTopic[] = [
  { id: 'all', label: '全部', query: '' },
  { id: 'nature', label: '自然', query: 'nature landscape' },
  { id: 'business', label: '商业', query: 'business office' },
  { id: 'people', label: '人物', query: 'people portrait' },
  { id: 'technology', label: '科技', query: 'technology' },
  { id: 'food', label: '美食', query: 'food' },
  { id: 'architecture', label: '建筑', query: 'architecture building' },
  { id: 'abstract', label: '抽象', query: 'abstract texture' },
]

export const UNSPLASH_STYLES: UnsplashStyle[] = [
  { id: 'all', label: '全部风格', query: '' },
  { id: 'anime', label: '动漫', query: 'anime style art' },
  { id: 'manga', label: '漫画', query: 'manga comic illustration' },
  { id: 'illustration', label: '插画', query: 'digital illustration artwork' },
  { id: 'cartoon', label: '卡通', query: 'cartoon illustration colorful' },
  { id: 'watercolor', label: '水彩', query: 'watercolor painting art' },
  { id: 'minimalist', label: '极简', query: 'minimalist clean design' },
  { id: 'vintage', label: '复古', query: 'vintage retro film aesthetic' },
  { id: 'cyberpunk', label: '赛博朋克', query: 'cyberpunk neon futuristic' },
  { id: 'pixel', label: '像素', query: 'pixel art retro game' },
  { id: 'sketch', label: '素描', query: 'pencil sketch drawing' },
  { id: '3d', label: '3D', query: '3d render abstract art' },
]

/** @deprecated Use UNSPLASH_TOPICS */
export const UNSPLASH_CATEGORIES = UNSPLASH_TOPICS

export const UNSPLASH_ORIENTATIONS: UnsplashOrientationOption[] = [
  { id: '', label: '全部比例' },
  { id: 'landscape', label: '横图' },
  { id: 'portrait', label: '竖图' },
  { id: 'squarish', label: '方图' },
]

const TOPIC_IDS = new Set(UNSPLASH_TOPICS.map((item) => item.id))
const STYLE_IDS = new Set(UNSPLASH_STYLES.map((item) => item.id))

export function isUnsplashTopicId(value: string): value is UnsplashTopicId {
  return TOPIC_IDS.has(value as UnsplashTopicId)
}

/** @deprecated Use isUnsplashTopicId */
export function isUnsplashCategoryId(value: string): value is UnsplashCategoryId {
  return isUnsplashTopicId(value)
}

export function isUnsplashStyleId(value: string): value is UnsplashStyleId {
  return STYLE_IDS.has(value as UnsplashStyleId)
}

export function isUnsplashOrientation(value: string): value is UnsplashOrientation {
  return value === 'landscape' || value === 'portrait' || value === 'squarish'
}

export function parseUnsplashOrientation(value: string | null): UnsplashOrientation | undefined {
  if (!value || !isUnsplashOrientation(value)) return undefined
  return value
}

export function buildUnsplashSearchQuery(
  topicId: UnsplashTopicId,
  styleId: UnsplashStyleId,
  keyword: string,
): string {
  const topic = UNSPLASH_TOPICS.find((item) => item.id === topicId)
  const style = UNSPLASH_STYLES.find((item) => item.id === styleId)
  const parts: string[] = []

  if (topic && topic.id !== 'all' && topic.query) {
    parts.push(topic.query)
  }

  if (style && style.id !== 'all' && style.query) {
    parts.push(style.query)
  }

  const trimmedKeyword = keyword.trim()
  if (trimmedKeyword) {
    parts.push(trimmedKeyword)
  }

  return parts.join(' ').trim()
}
