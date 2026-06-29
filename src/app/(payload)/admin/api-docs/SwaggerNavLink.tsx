'use client'

import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import React from 'react'

const SWAGGER_PATH = '/admin/api-docs'

export function SwaggerNavLink() {
  const pathname = usePathname()
  const isActive = pathname === SWAGGER_PATH || pathname.startsWith(`${SWAGGER_PATH}/`)

  return (
    <Link
      className={`nav__link${isActive ? ' active' : ''}`}
      href={SWAGGER_PATH}
      prefetch={false}
    >
      Swagger API
    </Link>
  )
}

export default SwaggerNavLink
