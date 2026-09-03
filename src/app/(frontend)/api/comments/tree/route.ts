import { NextResponse } from 'next/server'

import { resolveCommentSettings } from '@/comments/settings'
import type { CommentTargetType } from '@/comments/types'
import { getApprovedCommentTree } from '@/utilities/getComments'

export const dynamic = 'force-dynamic'

function parseTargetType(value: string | null): CommentTargetType | null {
  if (value === 'post' || value === 'page') return value
  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const targetType = parseTargetType(searchParams.get('targetType'))
  const targetIdRaw = searchParams.get('targetId')
  const targetId = targetIdRaw ? Number(targetIdRaw) : NaN

  if (!targetType || !Number.isFinite(targetId) || targetId <= 0) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
  }

  const settings = await resolveCommentSettings()
  if (!settings.enabled) {
    return NextResponse.json({ comments: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }
  if (targetType === 'post' && !settings.allowOnPosts) {
    return NextResponse.json({ comments: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }
  if (targetType === 'page' && !settings.allowOnPages) {
    return NextResponse.json({ comments: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }

  const comments = await getApprovedCommentTree({
    targetType,
    targetId,
    maxDepth: settings.maxDepth,
  })

  return NextResponse.json({ comments }, { headers: { 'Cache-Control': 'no-store' } })
}
