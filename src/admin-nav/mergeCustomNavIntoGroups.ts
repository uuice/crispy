import type { NavGroupType } from '@payloadcms/ui/shared'

import type { AuthzUserShape } from '@/access/can'
import { userHasAnyPermissionSync } from '@/access/can'
import { ADMIN_NAV_GROUP_ORDER, CUSTOM_ADMIN_NAV_ITEMS } from './customItems'

export type CustomViewNavEntity = {
  label: string
  path: `/${string}`
  type: 'custom-view'
}

export type CrispyNavEntity = NavGroupType['entities'][number] | CustomViewNavEntity

export type CrispyNavGroup = {
  entities: CrispyNavEntity[]
  label: string
}

export function isCustomViewEntity(entity: CrispyNavEntity): entity is CustomViewNavEntity {
  return 'type' in entity && entity.type === 'custom-view'
}

function sortNavGroups(groups: CrispyNavGroup[]): CrispyNavGroup[] {
  const rank = new Map(ADMIN_NAV_GROUP_ORDER.map((label, index) => [label, index]))
  return [...groups].sort((a, b) => {
    const ai = rank.get(a.label) ?? 1000
    const bi = rank.get(b.label) ?? 1000
    if (ai !== bi) return ai - bi
    return a.label.localeCompare(b.label, 'zh')
  })
}

export function mergeCustomNavIntoGroups(
  groups: NavGroupType[],
  user?: AuthzUserShape,
): CrispyNavGroup[] {
  const merged: CrispyNavGroup[] = groups.map((group) => ({
    label: group.label,
    entities: [...group.entities],
  }))

  for (const item of CUSTOM_ADMIN_NAV_ITEMS) {
    if (item.anyOf?.length && !userHasAnyPermissionSync(user, item.anyOf)) {
      continue
    }

    const group = merged.find((entry) => entry.label === item.group)

    if (!group) {
      merged.push({
        label: item.group,
        entities: [
          {
            label: item.label,
            path: item.path,
            type: 'custom-view',
          },
        ],
      })
      continue
    }

    group.entities.push({
      label: item.label,
      path: item.path,
      type: 'custom-view',
    })
  }

  return sortNavGroups(merged).filter((group) => group.entities.length > 0)
}
