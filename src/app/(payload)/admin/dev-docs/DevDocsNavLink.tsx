'use client'

import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import React from 'react'

const DEV_DOCS_PATH = '/admin/dev-docs'

export function DevDocsNavLink() {
  const pathname = usePathname()
  const isActive = pathname === DEV_DOCS_PATH || pathname.startsWith(`${DEV_DOCS_PATH}/`)

  return (
    <Link
      className={`nav__link${isActive ? ' active' : ''}`}
      href={DEV_DOCS_PATH}
      prefetch={false}
    >
      二次开发文档
    </Link>
  )
}

export default DevDocsNavLink
