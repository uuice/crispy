import type { GlobalConfig } from 'payload'

import { isSuperAdmin } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { syncEmailRuntimeFile } from '@/email/syncEmailRuntimeFile'

export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  label: adminLabels.emailSettings,
  access: {
    read: isSuperAdmin,
    update: isSuperAdmin,
  },
  admin: {
    group: adminLabels.configGroup,
    description:
      '邮件 Active 层：选择发信通道与默认发件人。切换通道后请重启 Node 进程，邮件适配器才会生效。',
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          // Use saved doc — findGlobal in the same request can still see pre-commit state.
          await syncEmailRuntimeFile(req.payload, doc)
        } catch (error) {
          req.payload.logger.error({ err: error, msg: 'Failed to sync email runtime file' })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'activeTransport',
      type: 'relationship',
      relationTo: 'email-transports',
      label: adminLabels.activeEmailTransport,
      filterOptions: {
        enabled: { equals: true },
      },
      admin: {
        description: '多套通道中选一；未选则不发信。改后需重启。',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fromAddress',
          type: 'email',
          label: adminLabels.emailFromAddress,
          admin: {
            width: '50%',
            description: '默认发件地址；空则 noreply@example.com',
          },
        },
        {
          name: 'fromName',
          type: 'text',
          label: adminLabels.emailFromName,
          admin: {
            width: '50%',
            description: '默认发件名称；空则 Crispy CMS',
          },
        },
      ],
    },
    {
      name: 'formDefaultToEmail',
      type: 'email',
      label: adminLabels.formDefaultToEmail,
      admin: {
        description: '表单未配置收件人时的默认邮箱。改后需重启。',
      },
    },
    {
      name: 'overrideRecipient',
      type: 'email',
      label: adminLabels.emailOverrideRecipient,
      admin: {
        description: '测试用：所有外发邮件重定向到此地址。改后需重启。',
      },
    },
  ],
}
