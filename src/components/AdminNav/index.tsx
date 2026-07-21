import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import { NavHamburger, NavWrapper } from '@payloadcms/next/client'
import type { PayloadRequest, ServerProps } from 'payload'
import React from 'react'

import { getNavPrefs } from '@/admin-nav/getNavPrefs'
import { mergeCustomNavIntoGroups } from '@/admin-nav/mergeCustomNavIntoGroups'
import type { AuthzUserShape } from '@/access/can'

import { AdminHomeLink } from './AdminHomeLink'
import { AdminNavClient } from './NavClient'

const baseClass = 'nav'

type AdminNavProps = ServerProps & {
  req?: PayloadRequest
}

export async function AdminNav(props: AdminNavProps) {
  const {
    documentSubViewType,
    i18n,
    locale,
    params,
    payload,
    permissions,
    req,
    searchParams,
    user,
    viewType,
    visibleEntities,
  } = props

  if (!payload?.config || !permissions || !visibleEntities) {
    return null
  }

  const {
    admin: {
      components: { afterNav, beforeNav, beforeNavLinks, logout },
    },
    collections,
    globals,
  } = payload.config

  const groups = mergeCustomNavIntoGroups(
    groupNavItems(
      [
        ...collections
          .filter(({ slug }) => visibleEntities.collections.includes(slug))
          .map((collection) => ({
            type: EntityType.collection as const,
            entity: collection,
          })),
        ...globals
          .filter(({ slug }) => visibleEntities.globals.includes(slug))
          .map((global) => ({
            type: EntityType.global as const,
            entity: global,
          })),
      ],
      permissions,
      i18n,
    ),
    user as AuthzUserShape,
  )

  const navPreferences = req ? await getNavPrefs(req) : null

  const LogoutComponent = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedBeforeNav = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: beforeNav,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedBeforeNavLinks = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: beforeNavLinks,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedAfterNav = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: afterNav,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  return (
    <NavWrapper baseClass={baseClass}>
      {RenderedBeforeNav}
      <nav className={`${baseClass}__wrap`}>
        {RenderedBeforeNavLinks}
        <AdminNavClient groups={groups} navPreferences={navPreferences} />
        <AdminHomeLink />
        <div className={`${baseClass}__controls`}>{LogoutComponent}</div>
      </nav>
      {RenderedAfterNav}
      <div className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-content`}>
          <NavHamburger baseClass={baseClass} />
        </div>
      </div>
    </NavWrapper>
  )
}

export default AdminNav
