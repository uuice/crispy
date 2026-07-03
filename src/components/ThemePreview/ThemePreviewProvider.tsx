'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'

import type { FrontendThemeId } from '@/themes/definitions'
import { THEME_PREVIEW_QUERY_PARAM, withThemePreviewParam } from '@/themes/preview.shared'

type Props = {
  children: React.ReactNode
  themeId: FrontendThemeId | null
}

function shouldAugmentHref(href: string | null): href is string {
  if (!href || !href.startsWith('/')) {
    return false
  }

  if (href.startsWith('//') || href.startsWith('/admin') || href.startsWith('/api')) {
    return false
  }

  return !href.startsWith('/next/exit-theme-preview')
}

export function ThemePreviewProvider({ children, themeId }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const syncLocation = useCallback(() => {
    if (!themeId || typeof window === 'undefined') {
      return
    }

    const current = new URL(window.location.href)
    if (current.searchParams.get(THEME_PREVIEW_QUERY_PARAM) === themeId) {
      return
    }

    current.searchParams.set(THEME_PREVIEW_QUERY_PARAM, themeId)
    router.replace(`${current.pathname}${current.search}${current.hash}`)
  }, [router, themeId])

  useEffect(() => {
    syncLocation()
  }, [pathname, searchParams, syncLocation])

  useEffect(() => {
    if (!themeId) {
      return
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const anchor = (event.target as Element | null)?.closest('a')
      if (!anchor) {
        return
      }

      if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return
      }

      const href = anchor.getAttribute('href')
      if (!shouldAugmentHref(href) || href.includes(`${THEME_PREVIEW_QUERY_PARAM}=`)) {
        return
      }

      event.preventDefault()
      router.push(withThemePreviewParam(href, themeId))
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router, themeId])

  return <>{children}</>
}

export function useThemePreviewHref(href: string, themeId: FrontendThemeId | null | undefined): string {
  return withThemePreviewParam(href, themeId)
}
