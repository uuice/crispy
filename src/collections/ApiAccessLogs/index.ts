import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'

export const API_ACCESS_LOG_SLUG = 'api-access-logs' as const

export const ApiAccessLogs: CollectionConfig = {
  slug: API_ACCESS_LOG_SLUG,
  labels: adminLabels.apiAccessLogs,
  access: {
    create: () => false,
    delete: isSuperAdmin,
    read: isSuperAdmin,
    update: () => false,
  },
  admin: {
    defaultColumns: ['method', 'path', 'status', 'durationMs', 'authType', 'createdAt'],
    useAsTitle: 'path',
    group: adminLabels.systemGroup,
    description: 'REST / GraphQL API request history (written by middleware).',
  },
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    {
      name: 'method',
      type: 'text',
      label: adminLabels.apiMethod,
      required: true,
      index: true,
    },
    {
      name: 'path',
      type: 'text',
      label: adminLabels.apiPath,
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'number',
      label: adminLabels.apiStatus,
      admin: {
        description: 'HTTP status when available; may be empty for middleware-only timing.',
      },
    },
    {
      name: 'durationMs',
      type: 'number',
      label: adminLabels.apiDurationMs,
    },
    {
      name: 'ip',
      type: 'text',
      label: adminLabels.apiIp,
      index: true,
    },
    {
      name: 'userAgent',
      type: 'text',
      label: adminLabels.apiUserAgent,
    },
    {
      name: 'referer',
      type: 'text',
      label: adminLabels.apiReferer,
    },
    {
      name: 'authType',
      type: 'select',
      label: adminLabels.apiAuthType,
      options: [
        { label: adminLabels.apiAuthNone, value: 'none' },
        { label: adminLabels.apiAuthSession, value: 'session' },
        { label: adminLabels.apiAuthApiKey, value: 'api-key' },
        { label: adminLabels.apiAuthBearer, value: 'bearer' },
      ],
      defaultValue: 'none',
      index: true,
    },
  ],
}
