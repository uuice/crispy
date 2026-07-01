'use client'

import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import React from 'react'

const CACHE_PATH = '/admin/cache'

export function CacheNavLink() {
  const pathname = usePathname()
  const isActive = pathname === CACHE_PATH || pathname.startsWith(`${CACHE_PATH}/`)

  return (
    <Link
      className={`nav__link${isActive ? ' active' : ''}`}
      href={CACHE_PATH}
      prefetch={false}
    >
      缓存管理
    </Link>
  )
}

export default CacheNavLink
