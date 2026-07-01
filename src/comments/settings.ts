import config from '@payload-config'
import { getPayload } from 'payload'

import type { ResolvedCommentSettings } from '@/comments/types'

const DEFAULT_COMMENT_SETTINGS: ResolvedCommentSettings = {
  enabled: true,
  requireModeration: true,
  allowGuestComments: true,
  maxDepth: 3,
  allowOnPosts: true,
  allowOnPages: false,
}

export async function resolveCommentSettings(): Promise<ResolvedCommentSettings> {
  const payload = await getPayload({ config })

  let globalSettings: Record<string, unknown> | null = null

  try {
    globalSettings = (await payload.findGlobal({
      slug: 'comment-settings',
      depth: 0,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>
  } catch {
    globalSettings = null
  }

  if (!globalSettings) return DEFAULT_COMMENT_SETTINGS

  return {
    enabled: globalSettings.enabled !== false,
    requireModeration: globalSettings.requireModeration !== false,
    allowGuestComments: globalSettings.allowGuestComments !== false,
    maxDepth: (globalSettings.maxDepth as number | undefined) ?? DEFAULT_COMMENT_SETTINGS.maxDepth,
    allowOnPosts: globalSettings.allowOnPosts !== false,
    allowOnPages: globalSettings.allowOnPages === true,
  }
}

export function getDefaultCommentSettings(): ResolvedCommentSettings {
  return { ...DEFAULT_COMMENT_SETTINGS }
}
