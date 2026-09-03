import React from 'react'

import { CommentsSectionClient } from '@/components/Comments/CommentsSectionClient'
import { resolveCommentSettings } from '@/comments/settings'
import type { CommentTargetType } from '@/comments/types'
import { getOptionalMeUser } from '@/utilities/getOptionalMeUser'

type CommentsSectionProps = {
  targetType: CommentTargetType
  targetId: number
}

export async function CommentsSection({ targetType, targetId }: CommentsSectionProps) {
  const settings = await resolveCommentSettings()

  if (!settings.enabled) return null
  if (targetType === 'post' && !settings.allowOnPosts) return null
  if (targetType === 'page' && !settings.allowOnPages) return null

  const currentUser = await getOptionalMeUser()

  return (
    <CommentsSectionClient
      currentUser={currentUser}
      settings={settings}
      targetId={targetId}
      targetType={targetType}
    />
  )
}
