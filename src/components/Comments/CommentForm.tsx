'use client'

import React, { useState } from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import type { ResolvedCommentSettings } from '@/comments/types'
import type { CommentTargetType } from '@/comments/types'
import type { User } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'

type CommentFormProps = {
  targetType: CommentTargetType
  targetId: number
  parentId?: number | null
  replyToName?: string | null
  settings: ResolvedCommentSettings
  currentUser?: User | null
  onCancel?: () => void
  onSubmitted?: (result: { status?: string }) => void
  compact?: boolean
}

export const CommentForm: React.FC<CommentFormProps> = ({
  targetType,
  targetId,
  parentId,
  replyToName,
  settings,
  currentUser,
  onCancel,
  onSubmitted,
  compact = false,
}) => {
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showGuestFields = !currentUser && settings.allowGuestComments
  const contentId = parentId ? `comment-content-${parentId}` : 'comment-content'

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!content.trim()) {
      setError(frontendLabels.comments.errorEmpty)
      return
    }

    if (showGuestFields && !guestName.trim()) {
      setError(frontendLabels.comments.errorGuestName)
      return
    }

    setIsSubmitting(true)

    try {
      const body: Record<string, unknown> = {
        content: content.trim(),
        targetType,
        [targetType]: targetId,
      }

      if (parentId) body.parent = parentId
      if (showGuestFields) {
        body.guestName = guestName.trim()
        if (guestEmail.trim()) body.guestEmail = guestEmail.trim()
      }

      const res = await fetch(`${getClientSideURL()}/api/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = (await res.json().catch(() => null)) as {
        doc?: { status?: string }
        errors?: { message?: string }[]
        message?: string
      } | null

      if (!res.ok) {
        const message =
          data?.errors?.[0]?.message || data?.message || frontendLabels.comments.errorGeneric
        setError(message)
        return
      }

      setContent('')
      setGuestName('')
      setGuestEmail('')
      setSuccess(
        settings.requireModeration || data?.doc?.status === 'pending'
          ? frontendLabels.comments.successPending
          : frontendLabels.comments.successApproved,
      )
      onCancel?.()
      onSubmitted?.({ status: data?.doc?.status })
    } catch {
      setError(frontendLabels.comments.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={compact ? 'comment-form mt-2' : 'comment-form'} onSubmit={handleSubmit}>
      {success ? <p className="comment-pending">{success}</p> : null}
      {error ? <p className="comment-error">{error}</p> : null}
      {replyToName ? (
        <p className="comment-replying">
          回复 {replyToName}
          {onCancel ? (
            <button className="comment-cancel-reply" onClick={onCancel} type="button">
              取消
            </button>
          ) : null}
        </p>
      ) : null}

      {showGuestFields ? (
        <>
          <div className="comment-form-row">
            <label className="comment-label" htmlFor={parentId ? `guest-name-${parentId}` : 'guest-name'}>
              昵称
            </label>
            <input
              className="comment-input"
              disabled={isSubmitting}
              id={parentId ? `guest-name-${parentId}` : 'guest-name'}
              maxLength={100}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="必填"
              required
              type="text"
              value={guestName}
            />
          </div>
          <div className="comment-form-row">
            <label className="comment-label" htmlFor={parentId ? `guest-email-${parentId}` : 'guest-email'}>
              邮箱
            </label>
            <input
              className="comment-input"
              disabled={isSubmitting}
              id={parentId ? `guest-email-${parentId}` : 'guest-email'}
              maxLength={200}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="选填"
              type="email"
              value={guestEmail}
            />
          </div>
        </>
      ) : null}

      <div className="comment-form-row">
        <label className="comment-label" htmlFor={contentId}>
          内容
        </label>
        <textarea
          className="comment-textarea"
          disabled={isSubmitting}
          id={contentId}
          maxLength={2000}
          onChange={(e) => setContent(e.target.value)}
          placeholder="必填"
          required
          rows={compact ? 3 : 3}
          value={content}
        />
      </div>

      <button className="comment-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? frontendLabels.comments.submitting : frontendLabels.comments.submit}
      </button>
    </form>
  )
}
