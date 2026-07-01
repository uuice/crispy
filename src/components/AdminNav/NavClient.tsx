'use client'

import { BrowseByFolderButton, Link, NavGroup, useConfig, useTranslation } from '@payloadcms/ui'
import { EntityType } from '@payloadcms/ui/shared'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import type { NavPreferences, StaticLabel } from 'payload'
import React, { Fragment } from 'react'

import { isCustomViewEntity, type CrispyNavGroup } from '@/admin-nav/mergeCustomNavIntoGroups'

const baseClass = 'nav'

function getEntityLabel(label: StaticLabel, language: string): string {
  if (typeof label === 'string') {
    return label
  }

  return label[language] ?? label.en ?? Object.values(label)[0] ?? ''
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
  const isActive =
    pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length] as string | undefined)

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

  return (
    <>
      {typeof folders === 'object' && folders.browseByFolder && (
        <BrowseByFolderButton active={viewingRootFolderView} />
      )}
      {groups.map((group, key) => (
        <NavGroup
          isOpen={navPreferences?.groups?.[group.label]?.open}
          key={key}
          label={group.label}
        >
          {group.entities.map((entity, i) => {
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
      ))}
    </>
  )
}

export default AdminNavClient
