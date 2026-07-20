import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { encryptedTextField } from '@/fields/encryptedText'
import { adminLabels } from '@/i18n/admin-labels'
import { defaultCollectionVersions } from '@/collections/defaults'
import { syncStorageRuntimeFile } from '@/storage/syncStorageRuntimeFile'

const syncRuntimeIfNeeded: CollectionAfterChangeHook = async ({ req }) => {
  try {
    await syncStorageRuntimeFile(req.payload)
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Failed to sync storage runtime file' })
  }
}

export const StorageTargets: CollectionConfig = {
  slug: 'storage-targets',
  labels: adminLabels.storageTargets,
  access: {
    create: requirePermission('catalog:secrets'),
    delete: requirePermission('catalog:secrets'),
    read: requirePermission('catalog:secrets'),
    update: requirePermission('catalog:secrets'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'bucket', 'region', 'enabled', 'updatedAt'],
    group: adminLabels.configGroup,
    description:
      'S3/OSS 存储目标 Catalog。在「存储设置」中选中一条为 Active。保存后需重启进程才能让上传插件切换目标。',
  },
  versions: defaultCollectionVersions,
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
      name: 'bucket',
      type: 'text',
      label: adminLabels.s3Bucket,
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'region',
          type: 'text',
          label: adminLabels.s3Region,
          defaultValue: 'us-east-1',
          admin: { width: '50%' },
        },
        {
          name: 'prefix',
          type: 'text',
          label: adminLabels.s3Prefix,
          defaultValue: 'media',
          admin: { width: '50%', description: '对象键前缀，默认 media' },
        },
      ],
    },
    {
      name: 'endpoint',
      type: 'text',
      label: adminLabels.s3Endpoint,
      admin: {
        description: '兼容 S3 的自定义 Endpoint（阿里云 OSS / MinIO 等）；留空用 AWS 默认',
      },
    },
    encryptedTextField({
      name: 'accessKeyId',
      label: adminLabels.s3AccessKeyId,
      required: true,
    }),
    encryptedTextField({
      name: 'secretAccessKey',
      label: adminLabels.s3SecretAccessKey,
      required: true,
    }),
    {
      name: 'forcePathStyle',
      type: 'checkbox',
      label: adminLabels.s3ForcePathStyle,
      defaultValue: true,
      admin: {
        description: '多数兼容 Endpoint 需开启 path-style',
      },
    },
    {
      name: 'publicBaseUrl',
      type: 'text',
      label: adminLabels.s3PublicBaseUrl,
      admin: {
        description: '对外访问 CDN/域名根，不含末尾 /',
      },
    },
    {
      name: 'virtualSizes',
      type: 'checkbox',
      label: adminLabels.s3VirtualSizes,
      defaultValue: true,
      admin: {
        description: 'OSS 虚拟尺寸（替代 Sharp）；关闭则回退本地处理策略',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
    },
  ],
}
