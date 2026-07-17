import type { GlobalConfig } from 'payload'

import { isSuperAdmin } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { syncStorageRuntimeFile } from '@/storage/syncStorageRuntimeFile'

export const StorageSettings: GlobalConfig = {
  slug: 'storage-settings',
  label: adminLabels.storageSettings,
  access: {
    read: isSuperAdmin,
    update: isSuperAdmin,
  },
  admin: {
    group: adminLabels.configGroup,
    description:
      '存储 Active 层：选择 local 或 S3 目标。切换 S3 目标后请重启 Node 进程，上传插件才会切换凭证。',
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          // Use saved doc — findGlobal in the same request can still see pre-commit state.
          await syncStorageRuntimeFile(req.payload, doc)
        } catch (error) {
          req.payload.logger.error({ err: error, msg: 'Failed to sync storage runtime file' })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'mode',
      type: 'select',
      label: adminLabels.storageMode,
      defaultValue: 'local',
      options: [
        { label: '本地 public/media', value: 'local' },
        { label: 'S3 / OSS', value: 's3' },
      ],
      required: true,
    },
    {
      name: 'activeTarget',
      type: 'relationship',
      relationTo: 'storage-targets',
      label: adminLabels.activeStorageTarget,
      admin: {
        description:
          'mode=s3 时必选。保存后请重启进程（pm2 restart / 重新 dev）才能让上传插件切换凭证。',
        condition: (_, siblingData) => siblingData?.mode === 's3',
      },
    },
  ],
}
