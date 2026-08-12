'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'

import { THEME_PREVIEW_QUERY_PARAM } from '@/themes/preview.shared'

export function ExitThemePreviewLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const href = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(THEME_PREVIEW_QUERY_PARAM)
    const query = params.toString()
    const redirect = `${pathname}${query ? `?${query}` : ''}`
    return `/next/exit-theme-preview?redirect=${encodeURIComponent(redirect)}`
  }, [pathname, searchParams])

  // Hard navigation avoids RSC soft-nav following a bad absolute redirect (e.g. https://0.0.0.0:3333/).
  return (
    <a className={className} href={href}>
      {children}
    </a>
  )
}
