'use client'

import React, { useState } from 'react'

import { CommentForm } from '@/components/Comments/CommentForm'
import { Button } from '@/components/ui/button'
import { frontendLabels } from '@/i18n/frontend-labels'
import type { ResolvedCommentSettings } from '@/comments/types'
import type { CommentTargetType } from '@/comments/types'
import type { User } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getCommentAuthorName, type CommentTreeNode } from '@/utilities/buildCommentTree'

type CommentItemProps = {
  comment: CommentTreeNode
  depth: number
  targetType: CommentTargetType
  targetId: number
  settings: ResolvedCommentSettings
  currentUser?: User | null
  maxDepth: number
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth,
  targetType,
  targetId,
  settings,
  currentUser,
  maxDepth,
}) => {
  const [replyOpen, setReplyOpen] = useState(false)
  const canReply = depth < maxDepth

  return (
    <li className="group">
      <article className="rounded-lg border border-border/60 bg-card/50 px-4 py-3">
        <header className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-medium text-foreground">{getCommentAuthorName(comment)}</span>
          <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
            {formatDateTime(comment.createdAt)}
          </time>
        </header>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {comment.content}
        </p>
        {canReply && (
          <div className="mt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={() => setReplyOpen((open) => !open)}
            >
              {replyOpen ? frontendLabels.comments.cancelReply : frontendLabels.comments.reply}
            </Button>
          </div>
        )}
        {replyOpen && (
          <CommentForm
            targetType={targetType}
            targetId={targetId}
            parentId={comment.id}
            settings={settings}
            currentUser={currentUser}
            onCancel={() => setReplyOpen(false)}
            compact
          />
        )}
      </article>

      {comment.replies.length > 0 && (
        <ul className="mt-3 space-y-3 border-l border-border/60 pl-4 ml-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              targetType={targetType}
              targetId={targetId}
              settings={settings}
              currentUser={currentUser}
              maxDepth={maxDepth}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

type CommentListProps = {
  comments: CommentTreeNode[]
  targetType: CommentTargetType
  targetId: number
  settings: ResolvedCommentSettings
  currentUser?: User | null
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  targetType,
  targetId,
  settings,
  currentUser,
}) => {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">{frontendLabels.comments.empty}</p>
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          depth={1}
          targetType={targetType}
          targetId={targetId}
          settings={settings}
          currentUser={currentUser}
          maxDepth={settings.maxDepth}
        />
      ))}
    </ul>
  )
}
