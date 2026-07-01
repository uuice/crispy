'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { adminLabels } from '@/i18n/admin-labels'

const baseClass = 'nav'

export function AdminHomeLink() {
  const pathname = usePathname()
  const { config } = useConfig()
  const { admin: adminRoute } = config.routes
  const href = formatAdminURL({ adminRoute, path: '' })
  const isActive = pathname === href || pathname === adminRoute

  const content = (
    <>
      {isActive && <div className={`${baseClass}__link-indicator`} />}
      <span className={`${baseClass}__link-label`}>{adminLabels.adminHome}</span>
    </>
  )

  return (
    <div className={`${baseClass}__home`}>
      {isActive ? (
        <div className={`${baseClass}__link`} id="nav-admin-home">
          {content}
        </div>
      ) : (
        <Link className={`${baseClass}__link`} href={href} id="nav-admin-home" prefetch={false}>
          {content}
        </Link>
      )}
    </div>
  )
}

export default AdminHomeLink
