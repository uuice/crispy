import type { Payload, PayloadRequest } from 'payload'

import { markdownToLexical } from './markdownToLexical'
import { loadMigratedManifest, slugifyTag } from './importContent'
import type { MigratedComment, MigratedManifest } from './types'

type SeedContext = {
  disableRevalidate: boolean
  skipEmbeddingSync: boolean
}

type CategoryMap = Map<string, number>
type TagMap = Map<string, number>
type PostMap = Map<string, number>
type CommentMap = Map<string, number>

export async function seedFromAstroLearn({
  payload,
  req,
  authorId,
  seedContext,
}: {
  payload: Payload
  req: PayloadRequest
  authorId: number
  seedContext: SeedContext
}): Promise<void> {
  const manifest = loadMigratedManifest()

  payload.logger.info(
    `— Seeding astro-learn migrated content (${manifest.posts.length} posts, ${manifest.pages.length} pages)...`,
  )

  const categoryMap = await seedCategories(payload, req, manifest, seedContext)
  const tagMap = await seedTags(payload, req, manifest, seedContext)
  const postMap = await seedPosts(payload, req, manifest, authorId, categoryMap, tagMap, seedContext)
  await seedPages(payload, req, manifest, seedContext)
  await seedLinks(payload, req, manifest, seedContext)
  await seedComments(payload, req, manifest, postMap, seedContext)

  await payload.updateGlobal({
    slug: 'site-settings',
    depth: 0,
    context: seedContext,
    data: {
      siteName: manifest.siteSetting.siteName,
      siteDescription: manifest.siteSetting.siteDescription,
      enableRss: true,
      adminThemeHue: 41.116,
      recordSettings: manifest.siteSetting.recordSettings,
    },
  })
}

async function seedCategories(
  payload: Payload,
  req: PayloadRequest,
  manifest: MigratedManifest,
  seedContext: SeedContext,
): Promise<CategoryMap> {
  const map: CategoryMap = new Map()

  for (const title of manifest.categories) {
    const doc = await payload.create({
      collection: 'categories',
      req,
      depth: 0,
      context: seedContext,
      data: {
        title,
        slug: title.toLowerCase(),
      },
    })
    map.set(title, doc.id)
  }

  return map
}

async function seedTags(
  payload: Payload,
  req: PayloadRequest,
  manifest: MigratedManifest,
  seedContext: SeedContext,
): Promise<TagMap> {
  const map: TagMap = new Map()
  const slugToId: TagMap = new Map()

  for (const title of manifest.tags) {
    const slug = slugifyTag(title)
    const existingId = slugToId.get(slug)
    if (existingId != null) {
      map.set(title, existingId)
      continue
    }

    const doc = await payload.create({
      collection: 'tags',
      req,
      depth: 0,
      context: seedContext,
      data: {
        title,
        slug,
      },
    })
    map.set(title, doc.id)
    slugToId.set(slug, doc.id)
  }

  return map
}

async function seedPosts(
  payload: Payload,
  req: PayloadRequest,
  manifest: MigratedManifest,
  authorId: number,
  categoryMap: CategoryMap,
  tagMap: TagMap,
  seedContext: SeedContext,
): Promise<PostMap> {
  const map: PostMap = new Map()

  for (const post of manifest.posts) {
    if (!post.published) continue

    const doc = await payload.create({
      collection: 'posts',
      req,
      depth: 0,
      context: seedContext,
      overrideAccess: true,
      data: {
        title: post.title,
        slug: post.slug,
        _status: 'published',
        publishedAt: post.publishedAt,
        authors: [authorId],
        categories: post.categories
          .map((title) => categoryMap.get(title))
          .filter((id): id is number => id != null),
        tags: post.tags.map((title) => tagMap.get(title)).filter((id): id is number => id != null),
        content: markdownToLexical(post.body),
        meta: post.excerpt
          ? {
              description: post.excerpt,
            }
          : undefined,
      },
    })

    await applyMigratedTimestamps(payload, req, 'posts', doc.id, {
      createdAt: post.publishedAt,
      updatedAt: post.updatedAt ?? post.publishedAt,
      publishedAt: post.publishedAt,
    })

    map.set(post.slug, doc.id)
  }

  return map
}

async function seedPages(
  payload: Payload,
  req: PayloadRequest,
  manifest: MigratedManifest,
  seedContext: SeedContext,
): Promise<void> {
  for (const page of manifest.pages) {
    if (!page.published) continue

    const doc = await payload.create({
      collection: 'pages',
      req,
      depth: 0,
      context: seedContext,
      overrideAccess: true,
      data: {
        title: page.title === 'about' ? '关于' : page.title,
        slug: page.slug,
        _status: 'published',
        publishedAt: page.publishedAt,
        hero: {
          type: 'none',
        },
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: markdownToLexical(page.body),
              },
            ],
          },
        ],
        meta: page.excerpt
          ? {
              description: page.excerpt,
            }
          : undefined,
      },
    })

    await applyMigratedTimestamps(payload, req, 'pages', doc.id, {
      createdAt: page.publishedAt,
      updatedAt: page.updatedAt ?? page.publishedAt,
      publishedAt: page.publishedAt,
    })
  }
}

async function seedLinks(
  payload: Payload,
  req: PayloadRequest,
  manifest: MigratedManifest,
  seedContext: SeedContext,
): Promise<void> {
  const defaultGroup = await payload.create({
    collection: 'link-groups',
    req,
    depth: 0,
    context: seedContext,
    overrideAccess: true,
    data: {
      title: '友链',
      description: '站点友情链接',
      sort: 0,
      enabled: true,
    },
  })

  await Promise.all(
    manifest.links.map((link, index) =>
      payload.create({
        collection: 'links',
        req,
        depth: 0,
        context: seedContext,
        overrideAccess: true,
        data: {
          title: link.title,
          url: link.url,
          description: link.description,
          group: defaultGroup.id,
          sort: index,
          enabled: true,
          openInNewTab: true,
        },
      }),
    ),
  )
}

async function seedComments(
  payload: Payload,
  req: PayloadRequest,
  manifest: MigratedManifest,
  postMap: PostMap,
  seedContext: SeedContext,
): Promise<void> {
  const commentMap: CommentMap = new Map()
  const pending = [...manifest.comments]
  const maxPasses = pending.length + 1
  let pass = 0
  const maxDepth = 3

  while (pending.length > 0 && pass < maxPasses) {
    pass += 1
    const remaining: MigratedComment[] = []

    for (const comment of pending) {
      const postId = postMap.get(comment.postSlug)
      if (!postId || !comment.content.trim()) continue

      let parentId = comment.parentLegacyId ? commentMap.get(comment.parentLegacyId) : undefined
      if (comment.parentLegacyId && !parentId) {
        remaining.push(comment)
        continue
      }

      if (parentId != null) {
        parentId = await clampCommentParent(payload, parentId, maxDepth)
      }

      const doc = await payload.create({
        collection: 'comments',
        req,
        depth: 0,
        context: seedContext,
        overrideAccess: true,
        data: {
          content: comment.content,
          targetType: 'post',
          post: postId,
          parent: parentId,
          status: comment.status,
          guestName: comment.author,
          guestEmail: comment.email,
        },
      })

      commentMap.set(comment.legacyId, doc.id)
    }

    if (remaining.length === pending.length) break
    pending.splice(0, pending.length, ...remaining)
  }
}

async function clampCommentParent(
  payload: Payload,
  parentId: number,
  maxDepth: number,
): Promise<number> {
  const chain: number[] = [parentId]

  while (chain.length < maxDepth) {
    const current = chain[chain.length - 1]
    const parent = await payload.findByID({
      collection: 'comments',
      id: current,
      depth: 0,
      overrideAccess: true,
    })

    if (!parent?.parent) break
    chain.push(parent.parent as number)
  }

  return chain[Math.min(chain.length, maxDepth - 1) - 1] ?? parentId
}

async function applyMigratedTimestamps(
  payload: Payload,
  req: PayloadRequest,
  collection: 'posts' | 'pages',
  id: number | string,
  timestamps: { createdAt?: string; updatedAt?: string; publishedAt?: string },
): Promise<void> {
  const data: Record<string, string> = {}
  if (timestamps.createdAt) data.createdAt = timestamps.createdAt
  if (timestamps.updatedAt) data.updatedAt = timestamps.updatedAt
  if (timestamps.publishedAt) data.publishedAt = timestamps.publishedAt
  if (Object.keys(data).length === 0) return

  await payload.db.updateOne({
    collection,
    id,
    data,
    req,
  })
}

export function getMigratedAuthorProfile(): { bio: string; bioDetail: ReturnType<typeof markdownToLexical> } {
  const manifest = loadMigratedManifest()
  return {
    bio: manifest.author.excerpt ?? 'Vue · Angular · Node.js · 前端开发',
    bioDetail: markdownToLexical(manifest.author.body),
  }
}
