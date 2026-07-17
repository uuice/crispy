'use client'

import { BrowseByFolderButton, Link, NavGroup, useConfig, useTranslation } from '@payloadcms/ui'
import { EntityType } from '@payloadcms/ui/shared'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import type { NavPreferences, StaticLabel } from 'payload'
import React, { Fragment, useMemo } from 'react'

import { isCustomViewEntity, type CrispyNavEntity, type CrispyNavGroup } from '@/admin-nav/mergeCustomNavIntoGroups'

const baseClass = 'nav'

function getEntityLabel(label: StaticLabel, language: string): string {
  if (typeof label === 'string') {
    return label
  }

  return label[language] ?? label.en ?? Object.values(label)[0] ?? ''
}

function isActivePath(pathname: string, href: string): boolean {
  return (
    pathname.startsWith(href) &&
    ['/', undefined].includes(pathname[href.length] as string | undefined)
  )
}

function getEntityHref(
  entity: CrispyNavEntity,
  adminRoute: string,
): string | null {
  if (isCustomViewEntity(entity)) {
    return formatAdminURL({ adminRoute, path: entity.path })
  }

  if (entity.type === EntityType.collection) {
    return formatAdminURL({
      adminRoute,
      path: `/collections/${entity.slug}`,
    })
  }

  if (entity.type === EntityType.global) {
    return formatAdminURL({
      adminRoute,
      path: `/globals/${entity.slug}`,
    })
  }

  return null
}

type Props = {
  groups: CrispyNavGroup[]
  navPreferences: NavPreferences | null
}

function renderNavLink({
  href,
  id,
  label,
  pathname,
}: {
  href: string
  id: string
  label: string
  pathname: string
}) {
  const isActive = isActivePath(pathname, href)

  const content = (
    <>
      {isActive && <div className={`${baseClass}__link-indicator`} />}
      <span className={`${baseClass}__link-label`}>{label}</span>
    </>
  )

  if (pathname === href) {
    return (
      <div className={`${baseClass}__link`} id={id}>
        {content}
      </div>
    )
  }

  return (
    <Link className={`${baseClass}__link`} href={href} id={id} prefetch={false}>
      {content}
    </Link>
  )
}

export function AdminNavClient({ groups, navPreferences }: Props) {
  const pathname = usePathname()
  const { config } = useConfig()
  const {
    admin: {
      routes: { browseByFolder: foldersRoute },
    },
    folders,
    routes: { admin: adminRoute },
  } = config
  const { i18n } = useTranslation()

  const folderURL = formatAdminURL({
    adminRoute,
    path: foldersRoute,
  })
  const viewingRootFolderView = pathname.startsWith(folderURL)

  const openByLabel = useMemo(() => {
    const map = new Map<string, boolean>()
    for (const group of groups) {
      const saved = navPreferences?.groups?.[group.label]?.open
      const containsActive = group.entities.some((entity) => {
        const href = getEntityHref(entity, adminRoute)
        return href ? isActivePath(pathname, href) : false
      })
      // Default collapsed; open only the group of the current page (until user toggles).
      map.set(group.label, typeof saved === 'boolean' ? saved : containsActive)
    }
    return map
  }, [adminRoute, groups, navPreferences, pathname])

  return (
    <>
      {typeof folders === 'object' && folders.browseByFolder && (
        <BrowseByFolderButton active={viewingRootFolderView} />
      )}
      {groups.map((group) => {
        const isOpen = openByLabel.get(group.label) ?? false
        return (
        <NavGroup
          // Remount when default/open intent changes so Payload NavGroup picks up isOpen.
          isOpen={isOpen}
          key={`${group.label}:${isOpen ? 'open' : 'closed'}`}
          label={group.label}
        >
          {group.entities.map((entity) => {
            if (isCustomViewEntity(entity)) {
              const href = formatAdminURL({
                adminRoute,
                path: entity.path,
              })

              return (
                <Fragment key={entity.path}>
                  {renderNavLink({
                    href,
                    id: `nav-custom-${entity.path.replace(/\//g, '-')}`,
                    label: entity.label,
                    pathname,
                  })}
                </Fragment>
              )
            }

            const { slug, type, label } = entity
            let href: string | undefined
            let id: string | undefined

            if (type === EntityType.collection) {
              href = formatAdminURL({
                adminRoute,
                path: `/collections/${slug}`,
              })
              id = `nav-${slug}`
            }

            if (type === EntityType.global) {
              href = formatAdminURL({
                adminRoute,
                path: `/globals/${slug}`,
              })
              id = `nav-global-${slug}`
            }

            if (!href || !id) {
              return null
            }

            const translatedLabel = getEntityLabel(label, i18n.language)

            return (
              <Fragment key={id}>
                {renderNavLink({
                  href,
                  id,
                  label: translatedLabel,
                  pathname,
                })}
              </Fragment>
            )
          })}
        </NavGroup>
        )
      })}
    </>
  )
}

export default AdminNavClient
