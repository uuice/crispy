'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { CommentForm } from '@/components/Comments/CommentForm'
import { CommentList } from '@/components/Comments/CommentList'
import type { ResolvedCommentSettings } from '@/comments/types'
import type { CommentTargetType } from '@/comments/types'
import { frontendLabels } from '@/i18n/frontend-labels'
import type { User } from '@/payload-types'
import type { CommentTreeNode } from '@/utilities/buildCommentTree'

type Props = {
  targetType: CommentTargetType
  targetId: number
  settings: ResolvedCommentSettings
  currentUser?: User | null
}

export function CommentsSectionClient({
  targetType,
  targetId,
  settings,
  currentUser,
}: Props) {
  const [comments, setComments] = useState<CommentTreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = Boolean(currentUser) || settings.allowGuestComments

  const loadComments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        targetType,
        targetId: String(targetId),
      })
      const res = await fetch(`/api/comments/tree?${params.toString()}`, {
        cache: 'no-store',
        credentials: 'same-origin',
      })

      if (!res.ok) {
        throw new Error('Failed to load comments')
      }

      const data = (await res.json()) as { comments?: CommentTreeNode[] }
      setComments(Array.isArray(data.comments) ? data.comments : [])
    } catch {
      setError(frontendLabels.comments.errorLoad)
      setComments([])
    } finally {
      setLoading(false)
      setLoaded(true)
    }
  }, [targetId, targetType])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  const handleSubmitted = useCallback(
    (result: { status?: string }) => {
      if (result.status === 'approved') {
        void loadComments()
      }
    },
    [loadComments],
  )

  if (loaded && !canSubmit && comments.length === 0) {
    return null
  }

  return (
    <div aria-label={frontendLabels.comments.title} className="comment-block">
      <div className="comment-block-title">{frontendLabels.comments.title}</div>
      {loading && !loaded ? (
        <p className="comment-muted">{frontendLabels.comments.loading}</p>
      ) : null}
      {error ? <p className="comment-error">{error}</p> : null}
      {!loading || loaded ? (
        <CommentList
          comments={comments}
          currentUser={currentUser}
          onSubmitted={handleSubmitted}
          settings={settings}
          targetId={targetId}
          targetType={targetType}
        />
      ) : null}
      {canSubmit ? (
        <CommentForm
          currentUser={currentUser}
          onSubmitted={handleSubmitted}
          settings={settings}
          targetId={targetId}
          targetType={targetType}
        />
      ) : null}
    </div>
  )
}
