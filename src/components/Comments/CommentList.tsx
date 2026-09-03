'use client'

import React, { useState } from 'react'

import { CommentForm } from '@/components/Comments/CommentForm'
import { frontendLabels } from '@/i18n/frontend-labels'
import type { ResolvedCommentSettings } from '@/comments/types'
import type { CommentTargetType } from '@/comments/types'
import type { Comment, User } from '@/payload-types'
import { getCommentAuthorName, type CommentTreeNode } from '@/utilities/buildCommentTree'

function getCommentAuthorEmail(comment: Comment): string | undefined {
  if (comment.author && typeof comment.author === 'object') {
    return comment.author.email || undefined
  }
  return comment.guestEmail || undefined
}

function formatCommentDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type CommentItemProps = {
  comment: CommentTreeNode
  depth: number
  targetType: CommentTargetType
  targetId: number
  settings: ResolvedCommentSettings
  currentUser?: User | null
  maxDepth: number
  parentAuthorName?: string | null
  onSubmitted?: (result: { status?: string }) => void
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth,
  targetType,
  targetId,
  settings,
  currentUser,
  maxDepth,
  parentAuthorName,
  onSubmitted,
}) => {
  const [replyOpen, setReplyOpen] = useState(false)
  const canReply = depth < maxDepth
  const authorName = getCommentAuthorName(comment)
  const authorEmail = getCommentAuthorEmail(comment)

  return (
    <li className={`comment-thread${comment.parent ? ' comment-item-reply' : ''}`}>
      <div className="comment-item">
        <div className="comment-item-meta">
          {authorName}
          {authorEmail ? (
            <span className="comment-email">
              {' '}
              <span>&lt;</span>
              {authorEmail}
              <span>&gt;</span>
            </span>
          ) : null}
          {parentAuthorName ? <span className="comment-reply-to"> 回复 {parentAuthorName}</span> : null}
          <span className="comment-sep">·</span>
          <span className="comment-date">{formatCommentDate(comment.createdAt)}</span>
          {canReply ? (
            <button
              className="comment-reply-btn"
              onClick={() => setReplyOpen((open) => !open)}
              type="button"
            >
              {replyOpen ? frontendLabels.comments.cancelReply : frontendLabels.comments.reply}
            </button>
          ) : null}
        </div>
        <div className="comment-item-content">{comment.content}</div>
      </div>

      {replyOpen ? (
        <CommentForm
          compact
          currentUser={currentUser}
          onCancel={() => setReplyOpen(false)}
          onSubmitted={(result) => {
            onSubmitted?.(result)
            if (result.status === 'approved') {
              setReplyOpen(false)
            }
          }}
          parentId={comment.id}
          replyToName={authorName}
          settings={settings}
          targetId={targetId}
          targetType={targetType}
        />
      ) : null}

      {comment.replies.length > 0 ? (
        <ul className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              comment={reply}
              currentUser={currentUser}
              depth={depth + 1}
              key={reply.id}
              maxDepth={maxDepth}
              onSubmitted={onSubmitted}
              parentAuthorName={authorName}
              settings={settings}
              targetId={targetId}
              targetType={targetType}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

type CommentListProps = {
  comments: CommentTreeNode[]
  targetType: CommentTargetType
  targetId: number
  settings: ResolvedCommentSettings
  currentUser?: User | null
  onSubmitted?: (result: { status?: string }) => void
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  targetType,
  targetId,
  settings,
  currentUser,
  onSubmitted,
}) => {
  if (comments.length === 0) {
    return <p className="comment-muted">{frontendLabels.comments.empty}</p>
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          comment={comment}
          currentUser={currentUser}
          depth={1}
          key={comment.id}
          maxDepth={settings.maxDepth}
          onSubmitted={onSubmitted}
          settings={settings}
          targetId={targetId}
          targetType={targetType}
        />
      ))}
    </ul>
  )
}
