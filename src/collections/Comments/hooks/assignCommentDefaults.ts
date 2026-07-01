import type { CollectionBeforeValidateHook } from 'payload'

import { resolveCommentSettings } from '@/comments/settings'
import type { CommentTargetType } from '@/comments/types'

type CommentData = {
  targetType?: CommentTargetType | null
  post?: number | string | null
  page?: number | string | null
  parent?: number | string | null
  author?: number | string | null
  guestName?: string | null
  guestEmail?: string | null
  status?: string | null
  ipAddress?: string | null
}

export const assignCommentDefaults: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (!data) return data

  const settings = await resolveCommentSettings()
  const next = { ...data } as CommentData

  if (operation === 'create') {
    if (!next.status) {
      next.status = settings.requireModeration ? 'pending' : 'approved'
    }

    const forwarded = req.headers.get('x-forwarded-for')
    next.ipAddress = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null

    if (req.user) {
      next.author = req.user.id
      next.guestName = null
      next.guestEmail = null
    } else if (!next.guestName?.trim()) {
      throw new Error('Guest comments require a display name.')
    }
  }

  const targetType = next.targetType ?? 'post'
  if (targetType === 'post' && !next.post) {
    throw new Error('Post is required for post comments.')
  }
  if (targetType === 'page' && !next.page) {
    throw new Error('Page is required for page comments.')
  }

  if (targetType === 'post' && !settings.allowOnPosts) {
    throw new Error('Comments on posts are disabled.')
  }
  if (targetType === 'page' && !settings.allowOnPages) {
    throw new Error('Comments on pages are disabled.')
  }

  return next
}

export const validateCommentDepth: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data?.parent) return data

  const settings = await resolveCommentSettings()
  const payload = req.payload

  let depth = 1
  let currentParentId = data.parent as number | string

  while (depth <= settings.maxDepth) {
    const parent = await payload.findByID({
      collection: 'comments',
      id: currentParentId,
      depth: 0,
      overrideAccess: true,
    })

    if (!parent?.parent) break

    depth += 1
    currentParentId = parent.parent as number | string
  }

  if (depth >= settings.maxDepth) {
    throw new Error(`Comment nesting exceeds max depth of ${settings.maxDepth}.`)
  }

  return data
}
