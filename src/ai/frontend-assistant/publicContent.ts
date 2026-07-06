import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import navigationData from '@/data/navigationWebsiteData.json'
import {
  queryGalleryItems,
  queryJobs,
  queryPosts,
  querySidebarData,
} from '@/themes/shared/data/queries'
import {
  getCategoryPath,
  getGalleryItemsPath,
  getJobsPath,
  getLinksPath,
  getPagePath,
  getPostPath,
  getPostsListPath,
  getTagPath,
} from '@/utilities/frontendPaths'
import { getCachedFriendLinkGroups, getCachedFriendLinks } from '@/utilities/getFriendLinks'

export const PUBLIC_CONTENT_TYPES = [
  'post',
  'page',
  'category',
  'tag',
  'link',
  'link-group',
  'job',
  'gallery-item',
  'navigation',
  'section',
] as const

export type PublicContentType = (typeof PUBLIC_CONTENT_TYPES)[number]

export type PublicContentHit = {
  type: PublicContentType
  title: string
  url: string
  slug?: string
  excerpt?: string
  keywords?: string[]
}

const TYPE_LABELS: Record<PublicContentType, string> = {
  post: '文章',
  page: '页面',
  category: '分类',
  tag: '标签',
  link: '友链',
  'link-group': '友链分组',
  job: '招聘',
  'gallery-item': '图库',
  navigation: '导航站点',
  section: '站点栏目',
}

const SECTION_PAGES: PublicContentHit[] = [
  {
    type: 'section',
    title: '全部文章',
    url: getPostsListPath(),
    slug: 'posts',
    excerpt: '浏览站点全部已发布文章',
    keywords: ['文章', '归档'],
  },
  {
    type: 'section',
    title: '友情链接',
    url: getLinksPath(),
    slug: 'links',
    excerpt: '友站与合作伙伴链接',
    keywords: ['友链', '链接'],
  },
  {
    type: 'section',
    title: '招聘职位',
    url: getJobsPath(),
    slug: 'jobs',
    excerpt: '查看在招岗位',
    keywords: ['招聘', '职位', '工作'],
  },
  {
    type: 'section',
    title: '图库',
    url: getGalleryItemsPath(),
    slug: 'gallery-items',
    excerpt: '站点精选图片展示',
    keywords: ['图库', '图片', '相册'],
  },
  {
    type: 'section',
    title: '类库导航',
    url: '/navigations',
    slug: 'navigations',
    excerpt: '精选网站导航目录',
    keywords: ['导航', '网站'],
  },
  {
    type: 'section',
    title: '小游戏',
    url: '/games',
    slug: 'games',
    excerpt: '站内互动小游戏',
    keywords: ['游戏'],
  },
]

export const loadPublicContentIndex = cache(async (): Promise<PublicContentHit[]> => {
  const payload = await getPayload({ config: configPromise })

  const [posts, pagesResult, sidebar, links, linkGroups, jobs, galleryItems] = await Promise.all([
    queryPosts(),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true, meta: true },
      where: { _status: { equals: 'published' } },
      sort: 'title',
    }),
    querySidebarData(),
    getCachedFriendLinks(),
    getCachedFriendLinkGroups(),
    queryJobs(),
    queryGalleryItems(),
  ])

  const records: PublicContentHit[] = [...SECTION_PAGES]

  for (const post of posts) {
    records.push({
      type: 'post',
      title: post.title,
      url: post.url,
      slug: post.url.split('/').pop(),
      excerpt: post.excerpt,
      keywords: [...post.categories, ...post.tags],
    })
  }

  for (const page of pagesResult.docs) {
    if (!page.slug || !page.title) continue
    records.push({
      type: 'page',
      title: page.title,
      url: getPagePath(page.slug),
      slug: page.slug,
      excerpt: page.meta?.description || undefined,
    })
  }

  for (const category of sidebar.categories) {
    records.push({
      type: 'category',
      title: category.title,
      url: category.url,
      slug: category.url.split('/').pop(),
      excerpt: `${category.count} 篇相关文章`,
      keywords: ['分类'],
    })
  }

  for (const tag of sidebar.tags) {
    records.push({
      type: 'tag',
      title: tag.title,
      url: tag.url,
      slug: tag.url.split('/').pop(),
      excerpt: `${tag.count} 篇相关文章`,
      keywords: ['标签'],
    })
  }

  for (const group of linkGroups) {
    records.push({
      type: 'link-group',
      title: group.title,
      url: getLinksPath(),
      slug: String(group.id),
      excerpt: group.description || undefined,
      keywords: ['友链', '分组', '链接'],
    })
  }

  for (const link of links) {
    const groupTitle =
      typeof link.group === 'object' && link.group && 'title' in link.group
        ? String(link.group.title)
        : undefined
    records.push({
      type: 'link',
      title: link.title,
      url: link.url,
      slug: String(link.id),
      excerpt: link.description || undefined,
      keywords: ['友链', '外链', ...(groupTitle ? [groupTitle] : [])],
    })
  }

  for (const job of jobs) {
    if (!job.title) continue
    records.push({
      type: 'job',
      title: job.title,
      url: getJobsPath(),
      slug: job.slug || String(job.id),
      excerpt: [job.department, job.location, job.employmentType, job.salary]
        .filter(Boolean)
        .join(' · '),
      keywords: ['招聘', job.department, job.location, job.employmentType].filter(
        Boolean,
      ) as string[],
    })
  }

  for (const item of galleryItems) {
    records.push({
      type: 'gallery-item',
      title: item.title,
      url: getGalleryItemsPath(),
      slug: String(item.id),
      excerpt: item.description || undefined,
      keywords: ['图库', '图片'],
    })
  }

  const navCategories = (navigationData as { categories: Array<{
    id: string
    name: string
    description?: string
    websites: Array<{ id: string; title: string; description?: string; url: string }>
  }> }).categories

  for (const category of navCategories) {
    for (const site of category.websites) {
      records.push({
        type: 'navigation',
        title: site.title,
        url: site.url,
        slug: site.id,
        excerpt: site.description || category.description || category.name,
        keywords: ['导航', category.name],
      })
    }
  }

  return records
})

function normalizeTypes(types: unknown): PublicContentType[] | undefined {
  if (!Array.isArray(types)) return undefined
  const allowed = new Set(PUBLIC_CONTENT_TYPES)
  const normalized = types.filter(
    (value): value is PublicContentType =>
      typeof value === 'string' && allowed.has(value as PublicContentType),
  )
  return normalized.length > 0 ? normalized : undefined
}

function buildSearchText(record: PublicContentHit): string {
  return [
    TYPE_LABELS[record.type],
    record.title,
    record.excerpt || '',
    record.slug || '',
    ...(record.keywords || []),
  ]
    .join(' ')
    .toLowerCase()
}

export async function searchPublicContent(
  query: string,
  options: { types?: PublicContentType[]; limit?: number } = {},
): Promise<PublicContentHit[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean)
  const limit = Math.min(Math.max(options.limit ?? 10, 1), 25)
  const types = options.types ? new Set(options.types) : null
  const index = await loadPublicContentIndex()

  return index
    .filter((record) => (types ? types.has(record.type) : true))
    .filter((record) => words.every((word) => buildSearchText(record).includes(word)))
    .slice(0, limit)
}

export async function listPublicContent(
  type: PublicContentType,
  options: { query?: string; limit?: number } = {},
): Promise<PublicContentHit[]> {
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 50)
  const index = await loadPublicContentIndex()
  const query = options.query?.trim().toLowerCase()

  let items = index.filter((record) => record.type === type)

  if (query) {
    const words = query.split(/\s+/).filter(Boolean)
    items = items.filter((record) => words.every((word) => buildSearchText(record).includes(word)))
  }

  return items.slice(0, limit)
}

export async function getPublicContent(
  type: PublicContentType,
  slug: string,
): Promise<PublicContentHit | Record<string, unknown> | null> {
  const normalizedSlug = decodeURIComponent(slug.trim())
  const index = await loadPublicContentIndex()

  const hit = index.find(
    (record) =>
      record.type === type &&
      (record.slug === normalizedSlug || record.title === normalizedSlug),
  )

  if (hit) {
    return hit
  }

  if (type === 'post') {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 1,
      overrideAccess: false,
      where: {
        and: [{ slug: { equals: normalizedSlug } }, { _status: { equals: 'published' } }],
      },
    })
    const post = result.docs[0]
    if (!post?.slug || !post.title) return null
    return {
      type: 'post',
      title: post.title,
      url: getPostPath(post.slug),
      slug: post.slug,
      excerpt: post.meta?.description || undefined,
      publishedAt: post.publishedAt,
      categories: (post.categories || [])
        .map((c) => (typeof c === 'object' && c?.title ? c.title : null))
        .filter(Boolean),
      tags: (post.tags || [])
        .map((t) => (typeof t === 'object' && t?.title ? t.title : null))
        .filter(Boolean),
    }
  }

  if (type === 'page') {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      where: {
        and: [{ slug: { equals: normalizedSlug } }, { _status: { equals: 'published' } }],
      },
    })
    const page = result.docs[0]
    if (!page?.slug || !page.title) return null
    return {
      type: 'page',
      title: page.title,
      url: getPagePath(page.slug),
      slug: page.slug,
      excerpt: page.meta?.description || undefined,
      updatedAt: page.updatedAt,
    }
  }

  if (type === 'category' || type === 'tag') {
    const collection = type === 'category' ? 'categories' : 'tags'
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 1,
      overrideAccess: false,
      where: { slug: { equals: normalizedSlug } },
    })
    const doc = result.docs[0]
    if (!doc?.slug || !doc.title) return null
    return {
      type,
      title: doc.title,
      url: type === 'category' ? getCategoryPath(doc.slug) : getTagPath(doc.slug),
      slug: doc.slug,
    }
  }

  return null
}

export function parsePublicContentTypes(value: unknown): PublicContentType[] | undefined {
  return normalizeTypes(value)
}

export function getPublicContentTypeLabel(type: PublicContentType): string {
  return TYPE_LABELS[type]
}
