import Link from 'next/link'
import React from 'react'

import { getFrontendThemeDefinition } from '@/themes/definitions'
import { getThemePreviewIdFromHeaders } from '@/themes/preview.server'

export async function ThemePreviewBanner() {
  const previewId = await getThemePreviewIdFromHeaders()
  if (!previewId) return null

  const { label } = getFrontendThemeDefinition(previewId)

  return (
    <div
      className="bg-amber-400 text-amber-950 text-center text-sm py-2 px-4 border-b border-amber-500/40"
      role="status"
    >
      正在预览「{label}」主题，保存站点设置前不会替换线上主题。
      {' · '}
      <Link className="font-medium underline underline-offset-2 hover:opacity-80" href="/next/exit-theme-preview">
        退出预览
      </Link>
    </div>
  )
}
