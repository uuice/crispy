import type { CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'

export const AUDIT_LOG_SLUG = 'audit-logs' as const

export type AuditAction = 'create' | 'update' | 'delete'

export const AuditLogs: CollectionConfig = {
  slug: AUDIT_LOG_SLUG,
  labels: adminLabels.auditLogs,
  access: {
    create: () => false,
    delete: requirePermission('logs:read'),
    read: requirePermission('logs:read'),
    update: () => false,
  },
  admin: {
    defaultColumns: ['collection', 'action', 'documentId', 'user', 'createdAt'],
    useAsTitle: 'documentId',
    group: adminLabels.devGroup,
    description: 'Content change history. Entries are created automatically.',
  },
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    {
      name: 'collection',
      type: 'text',
      label: adminLabels.auditCollection,
      required: true,
      index: true,
    },
    {
      name: 'action',
      type: 'select',
      label: adminLabels.auditAction,
      required: true,
      options: [
        { label: adminLabels.auditCreate, value: 'create' },
        { label: adminLabels.auditUpdate, value: 'update' },
        { label: adminLabels.auditDelete, value: 'delete' },
      ],
      index: true,
    },
    {
      name: 'documentId',
      type: 'text',
      label: adminLabels.auditDocumentId,
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      label: adminLabels.auditUser,
      relationTo: 'users',
      index: true,
    },
    {
      name: 'changes',
      type: 'json',
      label: adminLabels.auditChanges,
      admin: {
        description: 'Snapshot or field-level diff for the operation.',
      },
    },
  ],
}
