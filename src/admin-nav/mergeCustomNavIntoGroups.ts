import type { NavGroupType } from '@payloadcms/ui/shared'

import { CUSTOM_ADMIN_NAV_ITEMS } from './customItems'

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

export function mergeCustomNavIntoGroups(groups: NavGroupType[]): CrispyNavGroup[] {
  const merged: CrispyNavGroup[] = groups.map((group) => ({
    label: group.label,
    entities: [...group.entities],
  }))

  for (const item of CUSTOM_ADMIN_NAV_ITEMS) {
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

  return merged
}
