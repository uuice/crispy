import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/access/roles'
import { encryptedTextField } from '@/fields/encryptedText'
import { adminLabels } from '@/i18n/admin-labels'
import { defaultCollectionVersions } from '@/collections/defaults'
import { resetUnsplashKeyCache } from '@/unsplash/resolveUnsplashKey'

const resetCacheIfNeeded: CollectionAfterChangeHook = () => {
  resetUnsplashKeyCache()
}

export const IntegrationCredentials: CollectionConfig = {
  slug: 'integration-credentials',
  labels: adminLabels.integrationCredentials,
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isSuperAdmin,
    update: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'enabled', 'updatedAt'],
    group: adminLabels.configGroup,
    description: '第三方集成凭证 Catalog（Unsplash 等）。在「集成设置」中多选一启用。',
  },
  versions: defaultCollectionVersions,
  trash: true,
  hooks: {
    afterChange: [resetCacheIfNeeded],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      label: adminLabels.integrationType,
      required: true,
      defaultValue: 'unsplash',
      options: [{ label: 'Unsplash', value: 'unsplash' }],
      admin: {
        position: 'sidebar',
      },
    },
    encryptedTextField({
      name: 'apiKey',
      label: adminLabels.apiKey,
      required: true,
      admin: {
        description: 'Access Key / API Key（加密存储）',
      },
    }),
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
    },
  ],
}
