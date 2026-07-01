import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { dbCacheWithProbe } from '@/frontend-cache/unstableCacheWithProbe'

import type { CommentTargetType } from '@/comments/types'
import type { Comment } from '@/payload-types'
import { buildCommentTree, type CommentTreeNode } from '@/utilities/buildCommentTree'

type GetCommentsOptions = {
  targetType: CommentTargetType
  targetId: number | string
  page?: number
  limit?: number
  depth?: number
}

type GetCommentTreeOptions = {
  targetType: CommentTargetType
  targetId: number | string
  maxDepth?: number
  limit?: number
  depth?: number
}

async function fetchApprovedComments({
  targetType,
  targetId,
  page = 1,
  limit = 20,
  depth = 1,
}: GetCommentsOptions) {
  const payload = await getPayload({ config: configPromise })

  const targetField = targetType === 'post' ? 'post' : 'page'

  return payload.find({
    collection: 'comments',
    where: {
      and: [
        { targetType: { equals: targetType } },
        { [targetField]: { equals: targetId } },
        { status: { equals: 'approved' } },
        { parent: { exists: false } },
      ],
    },
    sort: '-createdAt',
    page,
    limit,
    depth,
    overrideAccess: true,
  })
}

async function fetchAllApprovedComments({
  targetType,
  targetId,
  limit = 200,
  depth = 1,
}: Omit<GetCommentTreeOptions, 'maxDepth'>): Promise<Comment[]> {
  const payload = await getPayload({ config: configPromise })
  const targetField = targetType === 'post' ? 'post' : 'page'

  const result = await payload.find({
    collection: 'comments',
    where: {
      and: [
        { targetType: { equals: targetType } },
        { [targetField]: { equals: targetId } },
        { status: { equals: 'approved' } },
      ],
    },
    sort: 'createdAt',
    limit,
    depth,
    overrideAccess: true,
  })

  return result.docs as Comment[]
}

export function getCachedComments(options: GetCommentsOptions) {
  const { targetType, targetId, page = 1, limit = 20, depth = 1 } = options
  const cacheKey = `comments_${targetType}_${targetId}_${page}_${limit}_${depth}`

  return dbCacheWithProbe(
    async () => fetchApprovedComments(options),
    [cacheKey],
    [`comments_${targetType}_${targetId}`, 'collection_comments'],
  )
}

export function getCachedCommentTree(options: GetCommentTreeOptions) {
  const { targetType, targetId, maxDepth = 3, limit = 200 } = options
  const cacheKey = `comments_tree_${targetType}_${targetId}_${maxDepth}_${limit}`

  return dbCacheWithProbe(
    async () => {
      const comments = await fetchAllApprovedComments({ targetType, targetId, limit })
      return buildCommentTree(comments, maxDepth)
    },
    [cacheKey],
    [`comments_${targetType}_${targetId}`, 'collection_comments'],
  )
}

export async function getApprovedComments(options: GetCommentsOptions) {
  return getCachedComments(options)()
}

export async function getApprovedCommentTree(
  options: GetCommentTreeOptions,
): Promise<CommentTreeNode[]> {
  return getCachedCommentTree(options)()
}
