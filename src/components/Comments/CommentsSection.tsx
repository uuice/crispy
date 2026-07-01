import React from 'react'

import { CommentForm } from '@/components/Comments/CommentForm'
import { CommentList } from '@/components/Comments/CommentList'
import { resolveCommentSettings } from '@/comments/settings'
import type { CommentTargetType } from '@/comments/types'
import { frontendLabels } from '@/i18n/frontend-labels'
import { getApprovedCommentTree } from '@/utilities/getComments'
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

  const [comments, currentUser] = await Promise.all([
    getApprovedCommentTree({
      targetType,
      targetId,
      maxDepth: settings.maxDepth,
    }),
    getOptionalMeUser(),
  ])

  const canSubmit = Boolean(currentUser) || settings.allowGuestComments
  if (!canSubmit && comments.length === 0) return null

  return (
    <section
      className="mt-12 max-w-[48rem] mx-auto border-t border-border pt-10"
      aria-label={frontendLabels.comments.title}
    >
      <h2 className="mb-6 text-xl font-semibold tracking-tight">{frontendLabels.comments.title}</h2>

      <div className="mb-8">
        <CommentList
          comments={comments}
          targetType={targetType}
          targetId={targetId}
          settings={settings}
          currentUser={currentUser}
        />
      </div>

      {canSubmit && (
        <CommentForm
          targetType={targetType}
          targetId={targetId}
          settings={settings}
          currentUser={currentUser}
        />
      )}
    </section>
  )
}
