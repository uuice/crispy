import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { encryptedTextField } from '@/fields/encryptedText'
import { adminLabels } from '@/i18n/admin-labels'
import { syncEmailRuntimeFile } from '@/email/syncEmailRuntimeFile'

const syncRuntimeIfNeeded: CollectionAfterChangeHook = async ({ req }) => {
  try {
    await syncEmailRuntimeFile(req.payload)
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Failed to sync email runtime file' })
  }
}

export const EmailTransports: CollectionConfig = {
  slug: 'email-transports',
  labels: adminLabels.emailTransports,
  access: {
    create: requirePermission('catalog:secrets'),
    delete: requirePermission('catalog:secrets'),
    read: requirePermission('catalog:secrets'),
    update: requirePermission('catalog:secrets'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'enabled', 'updatedAt'],
    group: adminLabels.configGroup,
    description:
      '邮件通道 Catalog（Resend / SMTP）。在「邮件设置」中选中一条为 Active。保存后需重启进程才能切换发信通道。',
  },
  versions: false,
  trash: true,
  hooks: {
    afterChange: [syncRuntimeIfNeeded],
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
      label: adminLabels.emailTransportType,
      required: true,
      defaultValue: 'resend',
      options: [
        { label: 'Resend', value: 'resend' },
        { label: 'SMTP / Nodemailer', value: 'smtp' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    encryptedTextField({
      name: 'apiKey',
      label: adminLabels.apiKey,
      admin: {
        description: 'Resend API Key',
        condition: (_, siblingData) => siblingData?.type === 'resend',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { type?: string } }) => {
        if (siblingData?.type === 'resend' && (!value || String(value).trim() === '')) {
          return 'Resend 需要 API Key'
        }
        return true
      },
    }),
    {
      name: 'smtpHost',
      type: 'text',
      label: adminLabels.smtpHost,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'smtp',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { type?: string } }) => {
        if (siblingData?.type === 'smtp' && (!value || String(value).trim() === '')) {
          return 'SMTP 需要 Host'
        }
        return true
      },
    },
    {
      type: 'row',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'smtp',
      },
      fields: [
        {
          name: 'smtpPort',
          type: 'number',
          label: adminLabels.smtpPort,
          defaultValue: 587,
          admin: { width: '50%' },
        },
        {
          name: 'smtpSecure',
          type: 'checkbox',
          label: adminLabels.smtpSecure,
          defaultValue: false,
          admin: {
            width: '50%',
            description: '465 端口通常需开启；587 用 STARTTLS 时关闭',
          },
        },
      ],
    },
    {
      name: 'smtpUser',
      type: 'text',
      label: adminLabels.smtpUser,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'smtp',
      },
    },
    encryptedTextField({
      name: 'smtpPass',
      label: adminLabels.smtpPass,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'smtp',
        description: 'SMTP 密码（加密存储）',
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
