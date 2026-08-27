'use client'

import { Link, NavGroup, useAuth, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { type AuthzUserShape, userHasAnyPermissionSync } from '@/access/can'
import { CUSTOM_ADMIN_PAGES } from '@/ai/agent/customAdminPages'
import { adminLabels } from '@/i18n/admin-labels'

const baseClass = 'nav'

export function AdminAfterNavLinks() {
  const { user } = useAuth()
  const pathname = usePathname()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const items = CUSTOM_ADMIN_PAGES.filter(
    (page) => !page.anyOf?.length || userHasAnyPermissionSync(user as AuthzUserShape, page.anyOf),
  )

  if (items.length === 0) return null

  return (
    <NavGroup label={adminLabels.toolsGroup}>
      {items.map((page) => {
        const href = formatAdminURL({ adminRoute, path: page.path })
        const id = `nav-custom-${page.path.replace(/\//g, '-')}`
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        const label = (
          <>
            {isActive && <div className={`${baseClass}__link-indicator`} />}
            <span className={`${baseClass}__link-label`}>{page.label}</span>
          </>
        )

        if (pathname === href) {
          return (
            <div className={`${baseClass}__link`} id={id} key={page.path}>
              {label}
            </div>
          )
        }

        return (
          <Link className={`${baseClass}__link`} href={href} id={id} key={page.path} prefetch={false}>
            {label}
          </Link>
        )
      })}
    </NavGroup>
  )
}

export default AdminAfterNavLinks
