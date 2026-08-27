'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import { isNovelFrontendPath } from '../data/novelRoutes'

type Props = {
  children: React.ReactNode
}

/** Hide the default blog sidebar on all novel routes (list + reader). */
export function BlogSidebarShell({ children }: Props) {
  const pathname = usePathname()

  if (isNovelFrontendPath(pathname)) {
    return null
  }

  return <>{children}</>
}
