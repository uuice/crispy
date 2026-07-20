import type { GlobalConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { resetUnsplashKeyCache } from '@/unsplash/resolveUnsplashKey'

export const IntegrationSettings: GlobalConfig = {
  slug: 'integration-settings',
  label: adminLabels.integrationSettings,
  access: {
    read: requirePermission('settings:integration'),
    update: requirePermission('settings:integration'),
  },
  admin: {
    group: adminLabels.configGroup,
    description: '第三方集成 Active 层。Unsplash 切换即时生效，无需重启。',
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        resetUnsplashKeyCache()
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'activeUnsplash',
      type: 'relationship',
      relationTo: 'integration-credentials',
      label: adminLabels.activeUnsplash,
      filterOptions: {
        type: { equals: 'unsplash' },
        enabled: { equals: true },
      },
      admin: {
        description: '多套 Unsplash Key 中选一；未选则导入功能不可用',
      },
    },
  ],
}
