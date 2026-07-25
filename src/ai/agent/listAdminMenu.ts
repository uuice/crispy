import { getNavGroups, getVisibleEntities } from '@payloadcms/ui/shared'
import { EntityType, getAccessResults, type PayloadRequest, type StaticLabel } from 'payload'
import { formatAdminURL } from 'payload/shared'

import type { AuthzUserShape } from '@/access/can'
import { getUserAuthz } from '@/access/authzCache'
import { CUSTOM_ADMIN_NAV_ITEMS } from '@/admin-nav/customItems'
import { isCustomViewEntity, mergeCustomNavIntoGroups } from '@/admin-nav/mergeCustomNavIntoGroups'
import type { Permission } from '@/access/permissions'
import { getServerSideURL } from '@/utilities/getURL'

export type AdminMenuItem = {
  type: 'collection' | 'global' | 'custom-view'
  label: string
  /** Collection / Global slug when applicable. */
  slug?: string
  /** Path relative to admin route (e.g. /collections/posts). */
  path: string
  /** Site-relative Admin href (e.g. /admin/collections/posts). Prefer this in Markdown links. */
  href: string
  /** Absolute Admin URL (serverURL + href). */
  url: string
  /** Custom views only: Permission any-of gate (omit = any Admin user). */
  requiredAnyOf?: Permission[]
}

export type AdminMenuGroup = {
  group: string
  items: AdminMenuItem[]
}

function resolveLabel(label: StaticLabel | string, language: string): string {
  if (typeof label === 'string') return label
  return label[language] ?? label.en ?? Object.values(label)[0] ?? ''
}

function buildAdminLinks(
  adminRoute: string,
  serverURL: string,
  path: `/${string}`,
): { href: string; url: string } {
  const href = formatAdminURL({ adminRoute, path })
  const url = formatAdminURL({ adminRoute, path, serverURL })
  return { href, url }
}

/**
 * Build the Admin sidebar menu for the current user (same visibility rules as AdminNav).
 * Attaches authz-cache permissions onto the user so admin.hidden + custom nav anyOf match the UI.
 */
export async function listAdminMenuForAgent(
  req: PayloadRequest,
  options?: { group?: string },
): Promise<{
  adminRoute: string
  serverURL: string
  groups: AdminMenuGroup[]
  note: string
}> {
  if (!req.user?.id) {
    throw new Error('Unauthorized')
  }

  const authz = await getUserAuthz(req.payload, req.user.id, req)
  // Attach authz so admin.hidden / custom nav anyOf match Admin UI (/me permissions).
  const userWithAuthz = {
    ...req.user,
    permissions: authz.permissions,
    roleSlugs: authz.roleSlugs,
  } as unknown as NonNullable<PayloadRequest['user']> & AuthzUserShape

  const reqWithAuthz: PayloadRequest = { ...req, user: userWithAuthz }
  const permissions = await getAccessResults({ req: reqWithAuthz })
  const visibleEntities = getVisibleEntities({ req: reqWithAuthz })
  const navGroups = mergeCustomNavIntoGroups(
    getNavGroups(permissions, visibleEntities, req.payload.config, req.i18n),
    userWithAuthz,
  )

  const { admin: adminRoute } = req.payload.config.routes
  const serverURL = getServerSideURL().replace(/\/$/, '')
  const language = req.i18n.language
  const customRequired = new Map(
    CUSTOM_ADMIN_NAV_ITEMS.map((item) => [item.path, item.anyOf] as const),
  )

  const groupFilter = options?.group?.trim().toLowerCase()

  const groups: AdminMenuGroup[] = []

  for (const navGroup of navGroups) {
    const groupLabel = resolveLabel(navGroup.label as StaticLabel, language)
    if (groupFilter && !groupLabel.toLowerCase().includes(groupFilter)) {
      continue
    }

    const items: AdminMenuItem[] = []

    for (const entity of navGroup.entities) {
      if (isCustomViewEntity(entity)) {
        const path = entity.path
        const links = buildAdminLinks(adminRoute, serverURL, path)
        const requiredAnyOf = customRequired.get(path)
        items.push({
          type: 'custom-view',
          label: entity.label,
          path,
          ...links,
          ...(requiredAnyOf?.length ? { requiredAnyOf } : {}),
        })
        continue
      }

      const label = resolveLabel(entity.label, language)
      if (entity.type === EntityType.collection) {
        const path = `/collections/${entity.slug}` as `/${string}`
        items.push({
          type: 'collection',
          label,
          slug: entity.slug,
          path,
          ...buildAdminLinks(adminRoute, serverURL, path),
        })
        continue
      }

      if (entity.type === EntityType.global) {
        const path = `/globals/${entity.slug}` as `/${string}`
        items.push({
          type: 'global',
          label,
          slug: entity.slug,
          path,
          ...buildAdminLinks(adminRoute, serverURL, path),
        })
      }
    }

    if (items.length > 0) {
      groups.push({ group: groupLabel, items })
    }
  }

  return {
    adminRoute,
    serverURL,
    groups,
    note:
      '仅返回当前用户可见入口。回复时必须用 Markdown 链接：[label](href) 或 [label](url)；href 为站内路径（推荐），url 为完整绝对地址。禁止自行拼接域名或省略 /admin。',
  }
}
