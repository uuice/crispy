'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { frontendLabels } from '@/i18n/frontend-labels'
import type { ResolvedCommentSettings } from '@/comments/types'
import type { CommentTargetType } from '@/comments/types'
import type { User } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'

type CommentFormProps = {
  targetType: CommentTargetType
  targetId: number
  parentId?: number | null
  settings: ResolvedCommentSettings
  currentUser?: User | null
  onCancel?: () => void
  compact?: boolean
}

export const CommentForm: React.FC<CommentFormProps> = ({
  targetType,
  targetId,
  parentId,
  settings,
  currentUser,
  onCancel,
  compact = false,
}) => {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showGuestFields = !currentUser && settings.allowGuestComments

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
      router.refresh()
    } catch {
      setError(frontendLabels.comments.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? 'mt-3 space-y-3' : 'space-y-4 rounded-lg border border-border bg-card p-4 md:p-5'}
    >
      {!compact && (
        <p className="text-sm text-muted-foreground">
          {currentUser ? frontendLabels.comments.loginHint : frontendLabels.comments.guestHint}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor={parentId ? `comment-content-${parentId}` : 'comment-content'}>
          {frontendLabels.comments.content}
        </Label>
        <Textarea
          id={parentId ? `comment-content-${parentId}` : 'comment-content'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={frontendLabels.comments.contentPlaceholder}
          rows={compact ? 3 : 4}
          disabled={isSubmitting}
          required
        />
      </div>

      {showGuestFields && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={parentId ? `guest-name-${parentId}` : 'guest-name'}>
              {frontendLabels.comments.guestName}
            </Label>
            <Input
              id={parentId ? `guest-name-${parentId}` : 'guest-name'}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={frontendLabels.comments.guestNamePlaceholder}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={parentId ? `guest-email-${parentId}` : 'guest-email'}>
              {frontendLabels.comments.guestEmail}
            </Label>
            <Input
              id={parentId ? `guest-email-${parentId}` : 'guest-email'}
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder={frontendLabels.comments.guestEmailPlaceholder}
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? frontendLabels.comments.submitting : frontendLabels.comments.submit}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
            {frontendLabels.comments.cancelReply}
          </Button>
        )}
      </div>
    </form>
  )
}
