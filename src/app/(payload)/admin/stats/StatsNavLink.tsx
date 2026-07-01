'use client'

import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import React from 'react'

const STATS_PATH = '/admin/stats'

export function StatsNavLink() {
  const pathname = usePathname()
  const isActive = pathname === STATS_PATH || pathname.startsWith(`${STATS_PATH}/`)

  return (
    <Link
      className={`nav__link${isActive ? ' active' : ''}`}
      href={STATS_PATH}
      prefetch={false}
    >
      内容统计
    </Link>
  )
}

export default StatsNavLink
