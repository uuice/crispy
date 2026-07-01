import { Button } from '@payloadcms/ui'
import { Card } from '@payloadcms/ui/elements/Card'
import { Locked } from '@payloadcms/ui/elements/Locked'
import { getGlobalData, getNavGroups, getVisibleEntities } from '@payloadcms/ui/shared'
import { EntityType, getAccessResults, type ClientUser, type StaticLabel, type WidgetServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { isCustomViewEntity, mergeCustomNavIntoGroups } from '@/admin-nav/mergeCustomNavIntoGroups'

import './index.scss'

const baseClass = 'collections'

function getEntityLabel(label: StaticLabel, language: string): string {
  if (typeof label === 'string') {
    return label
  }

  return label[language] ?? label.en ?? Object.values(label)[0] ?? ''
}

export async function AdminCollectionCards(props: WidgetServerProps) {
  const { i18n, payload, user } = props.req
  const { admin: adminRoute } = payload.config.routes
  const { t } = i18n

  const permissions = await getAccessResults({ req: props.req })
  const visibleEntities = getVisibleEntities({ req: props.req })
  const globalData = await getGlobalData(props.req)
  const navGroups = mergeCustomNavIntoGroups(
    getNavGroups(permissions, visibleEntities, payload.config, i18n),
  )

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrap`}>
        {navGroups.length === 0 ? (
          <p>no nav groups....</p>
        ) : (
          navGroups.map(({ entities, label }, groupIndex) => (
            <div className={`${baseClass}__group`} key={groupIndex}>
              <h2 className={`${baseClass}__label`}>{label}</h2>
              <ul className={`${baseClass}__card-list`}>
                {entities.map((entity, entityIndex) => {
                  if (isCustomViewEntity(entity)) {
                    const href = formatAdminURL({
                      adminRoute,
                      path: entity.path,
                    })
                    const title = entity.label

                    return (
                      <li key={entity.path}>
                        <Card
                          buttonAriaLabel={t('general:showAllLabel', {
                            label: title,
                          })}
                          href={href}
                          id={`card-custom-${entity.path.replace(/\//g, '-')}`}
                          title={title}
                          titleAs="h3"
                        />
                      </li>
                    )
                  }

                  const { slug, type, label: entityLabel } = entity
                  let title: string | undefined
                  let buttonAriaLabel: string | undefined
                  let createHREF: string | undefined
                  let href: string | undefined
                  let hasCreatePermission: boolean | undefined
                  let isLocked: boolean | null = null
                  let userEditing: ClientUser | null = null

                  if (type === EntityType.collection) {
                    title = getEntityLabel(entityLabel, i18n.language)
                    buttonAriaLabel = t('general:showAllLabel', {
                      label: title,
                    })
                    href = formatAdminURL({
                      adminRoute,
                      path: `/collections/${slug}`,
                    })
                    createHREF = formatAdminURL({
                      adminRoute,
                      path: `/collections/${slug}/create`,
                    })
                    hasCreatePermission = permissions?.collections?.[slug]?.create
                  }

                  if (type === EntityType.global) {
                    title = getEntityLabel(entityLabel, i18n.language)
                    buttonAriaLabel = t('general:editLabel', {
                      label: title,
                    })
                    href = formatAdminURL({
                      adminRoute,
                      path: `/globals/${slug}`,
                    })

                    const globalLockData = globalData.find((global) => global.slug === slug)
                    if (globalLockData) {
                      isLocked = globalLockData.data._isLocked
                      const editing = globalLockData.data._userEditing
                      userEditing =
                        editing && typeof editing === 'object' ? (editing as ClientUser) : null

                      const lockDuration = globalLockData.lockDuration ?? 0
                      const lastEditedAt = new Date(globalLockData.data?._lastEditedAt).getTime()
                      const lockDurationInMilliseconds = lockDuration * 1000
                      const lockExpirationTime = lastEditedAt + lockDurationInMilliseconds

                      if (Date.now() > lockExpirationTime) {
                        isLocked = false
                        userEditing = null
                      }
                    }
                  }

                  if (!href || !title || !buttonAriaLabel) {
                    return null
                  }

                  return (
                    <li key={slug}>
                      <Card
                        actions={
                          isLocked && userEditing && user?.id !== userEditing.id ? (
                            <Locked className={`${baseClass}__locked`} user={userEditing} />
                          ) : hasCreatePermission && type === EntityType.collection ? (
                            <Button
                              aria-label={t('general:createNewLabel', {
                                label: title,
                              })}
                              buttonStyle="icon-label"
                              el="link"
                              icon="plus"
                              iconStyle="with-border"
                              round
                              to={createHREF}
                            />
                          ) : undefined
                        }
                        buttonAriaLabel={buttonAriaLabel}
                        href={href}
                        id={`card-${slug}`}
                        title={title}
                        titleAs="h3"
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminCollectionCards
