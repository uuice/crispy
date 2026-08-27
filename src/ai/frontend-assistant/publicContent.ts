import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { loadNavigationsPageData } from '@/frontend/data/navigations'
import {
  queryGalleries,
  queryJobs,
  queryPosts,
  querySidebarData,
} from '@/frontend/data/queries'
import {
  getCategoryPath,
  getGalleriesPath,
  getGalleryPath,
  getJobsPath,
  getLinksPath,
  getNovelChapterPath,
  getNovelCategoryPath,
  getNovelPath,
  getNovelsPath,
  getNovelTagPath,
  getPagePath,
  getPostPath,
  getPostsListPath,
  getTagPath,
} from '@/utilities/frontendPaths'
import { getCachedFriendLinkGroups, getCachedFriendLinks } from '@/utilities/getFriendLinks'
import { publishedNovelChaptersWhere } from '@/utilities/publishedContentWhere'

export const PUBLIC_CONTENT_TYPES = [
  'post',
  'page',
  'novel',
  'novel-chapter',
  'novel-category',
  'novel-tag',
  'category',
  'tag',
  'link',
  'link-group',
  'job',
  'gallery',
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
  novel: '小说',
  'novel-chapter': '小说章节',
  'novel-category': '小说分类',
  'novel-tag': '小说标签',
  category: '分类',
  tag: '标签',
  link: '友链',
  'link-group': '友链分组',
  job: '招聘',
  gallery: '图库',
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
    url: getGalleriesPath(),
    slug: 'galleries',
    excerpt: '站点精选相册',
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
    title: '小说',
    url: getNovelsPath(),
    slug: 'novels',
    excerpt: '长篇连载与章节阅读',
    keywords: ['小说', '连载', '章节'],
  },
]

export const loadPublicContentIndex = cache(async (): Promise<PublicContentHit[]> => {
  const payload = await getPayload({ config: configPromise })

  const [posts, pagesResult, sidebar, links, linkGroups, jobs, galleries, novelsResult, novelChaptersResult, novelCategoriesResult, novelTagsResult, navigation] =
    await Promise.all([
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
    queryGalleries(),
    payload.find({
      collection: 'novels',
      depth: 1,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true, genre: true, synopsis: true, categories: true, tags: true },
      where: { enabled: { equals: true } },
      sort: 'title',
    }),
    payload.find({
      collection: 'novel-chapters',
      depth: 1,
      limit: 2000,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true, meta: true, novel: true, categories: true, tags: true },
      where: publishedNovelChaptersWhere,
      sort: '-publishedAt',
    }),
    payload.find({
      collection: 'novel-categories',
      depth: 0,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true },
      sort: 'title',
    }),
    payload.find({
      collection: 'novel-tags',
      depth: 0,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true, description: true },
      sort: 'title',
    }),
    loadNavigationsPageData(),
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

  for (const novel of novelsResult.docs) {
    if (!novel.slug || !novel.title) continue
    const novelCategories = (novel.categories || [])
      .map((entry) => (typeof entry === 'object' && entry?.title ? entry.title : null))
      .filter(Boolean) as string[]
    const novelTags = (novel.tags || [])
      .map((entry) => (typeof entry === 'object' && entry?.title ? entry.title : null))
      .filter(Boolean) as string[]

    records.push({
      type: 'novel',
      title: novel.title,
      url: getNovelPath(novel.slug),
      slug: novel.slug,
      excerpt: novel.synopsis || undefined,
      keywords: ['小说', novel.genre, ...novelCategories, ...novelTags].filter(Boolean) as string[],
    })
  }

  for (const chapter of novelChaptersResult.docs) {
    if (!chapter.slug || !chapter.title) continue
    const novel = typeof chapter.novel === 'object' ? chapter.novel : null
    if (!novel?.slug || novel.enabled === false) continue

    const chapterCategories = (chapter.categories || [])
      .map((entry) => (typeof entry === 'object' && entry?.title ? entry.title : null))
      .filter(Boolean) as string[]
    const chapterTags = (chapter.tags || [])
      .map((entry) => (typeof entry === 'object' && entry?.title ? entry.title : null))
      .filter(Boolean) as string[]

    records.push({
      type: 'novel-chapter',
      title: chapter.title,
      url: getNovelChapterPath(novel.slug, chapter.slug),
      slug: `${novel.slug}/${chapter.slug}`,
      excerpt: chapter.meta?.description || novel.title,
      keywords: ['小说', '章节', novel.title, novel.genre, ...chapterCategories, ...chapterTags].filter(
        Boolean,
      ) as string[],
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

  for (const category of novelCategoriesResult.docs) {
    if (!category.slug || !category.title) continue
    records.push({
      type: 'novel-category',
      title: category.title,
      url: getNovelCategoryPath(category.slug),
      slug: category.slug,
      excerpt: '小说分类归档',
      keywords: ['小说', '分类', category.title],
    })
  }

  for (const tag of novelTagsResult.docs) {
    if (!tag.slug || !tag.title) continue
    records.push({
      type: 'novel-tag',
      title: tag.title,
      url: getNovelTagPath(tag.slug),
      slug: tag.slug,
      excerpt: tag.description || '小说标签归档',
      keywords: ['小说', '标签', tag.title],
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

  for (const gallery of galleries) {
    if (!gallery.slug) continue
    records.push({
      type: 'gallery',
      title: gallery.title,
      url: getGalleryPath(gallery.slug),
      slug: gallery.slug,
      excerpt: gallery.description || undefined,
      keywords: ['图库', '相册', '图片'],
    })
  }

  for (const category of navigation.categories) {
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

  if (type === 'novel') {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'novels',
      depth: 1,
      limit: 1,
      overrideAccess: false,
      where: {
        and: [{ slug: { equals: normalizedSlug } }, { enabled: { equals: true } }],
      },
    })
    const novel = result.docs[0]
    if (!novel?.slug || !novel.title) return null
    return {
      type: 'novel',
      title: novel.title,
      url: getNovelPath(novel.slug),
      slug: novel.slug,
      excerpt: novel.synopsis || undefined,
      genre: novel.genre,
      synopsis: novel.synopsis,
      writingStyle: novel.writingStyle,
      plotOutline: novel.plotOutline,
      categories: (novel.categories || [])
        .map((c) => (typeof c === 'object' && c?.title ? c.title : null))
        .filter(Boolean),
      tags: (novel.tags || [])
        .map((t) => (typeof t === 'object' && t?.title ? t.title : null))
        .filter(Boolean),
    }
  }

  if (type === 'novel-chapter') {
    const [novelSlug, chapterSlug] = normalizedSlug.split('/')
    if (!novelSlug || !chapterSlug) return null

    const payload = await getPayload({ config: configPromise })
    const novelResult = await payload.find({
      collection: 'novels',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      where: {
        and: [{ slug: { equals: novelSlug } }, { enabled: { equals: true } }],
      },
    })
    const novel = novelResult.docs[0]
    if (!novel?.slug) return null

    const chapterResult = await payload.find({
      collection: 'novel-chapters',
      depth: 1,
      limit: 1,
      overrideAccess: false,
      where: {
        and: [
          { slug: { equals: chapterSlug } },
          { _status: { equals: 'published' } },
          { novel: { equals: novel.id } },
        ],
      },
    })
    const chapter = chapterResult.docs[0]
    if (!chapter?.slug || !chapter.title) return null

    return {
      type: 'novel-chapter',
      title: chapter.title,
      url: getNovelChapterPath(novel.slug, chapter.slug),
      slug: `${novel.slug}/${chapter.slug}`,
      excerpt: chapter.meta?.description || undefined,
      novelTitle: novel.title,
      novelUrl: getNovelPath(novel.slug),
      categories: (chapter.categories || [])
        .map((c) => (typeof c === 'object' && c?.title ? c.title : null))
        .filter(Boolean),
      tags: (chapter.tags || [])
        .map((t) => (typeof t === 'object' && t?.title ? t.title : null))
        .filter(Boolean),
    }
  }

  if (type === 'novel-category' || type === 'novel-tag') {
    const collection = type === 'novel-category' ? 'novel-categories' : 'novel-tags'
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
      url: type === 'novel-category' ? getNovelCategoryPath(doc.slug) : getNovelTagPath(doc.slug),
      slug: doc.slug,
      description: 'description' in doc ? doc.description : undefined,
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
