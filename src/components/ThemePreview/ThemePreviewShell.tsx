import React, { Suspense } from 'react'

import type { FrontendThemeId } from '@/themes/definitions'

import { ThemePreviewProvider } from './ThemePreviewProvider'

type Props = {
  children: React.ReactNode
  themeId: FrontendThemeId | null
}

export function ThemePreviewShell({ children, themeId }: Props) {
  if (!themeId) {
    return children
  }

  return (
    <Suspense fallback={children}>
      <ThemePreviewProvider themeId={themeId}>{children}</ThemePreviewProvider>
    </Suspense>
  )
}
