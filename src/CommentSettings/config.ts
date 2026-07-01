import type { GlobalConfig } from 'payload'

import { isEditor, isSuperAdmin } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'

import { revalidateCommentSettings } from './hooks/revalidateCommentSettings'

export const CommentSettings: GlobalConfig = {
  slug: 'comment-settings',
  label: adminLabels.commentSettings,
  access: {
    read: isEditor,
    update: isSuperAdmin,
  },
  admin: {
    group: adminLabels.systemGroup,
    description: '评论功能的全局开关与审核策略。',
  },
  hooks: {
    afterChange: [revalidateCommentSettings],
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.commentEnabled,
      defaultValue: true,
      admin: {
        description: '关闭后前台与 API 均不可创建新评论。',
      },
    },
    {
      name: 'requireModeration',
      type: 'checkbox',
      label: adminLabels.commentRequireModeration,
      defaultValue: true,
      admin: {
        description: '开启后新评论默认为「待审核」，需编辑审核后才公开显示。',
      },
    },
    {
      name: 'allowGuestComments',
      type: 'checkbox',
      label: adminLabels.commentAllowGuest,
      defaultValue: true,
    },
    {
      name: 'maxDepth',
      type: 'number',
      label: adminLabels.commentMaxDepth,
      defaultValue: 3,
      min: 1,
      max: 10,
      admin: {
        description: '嵌套回复的最大层级。',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'allowOnPosts',
          type: 'checkbox',
          label: adminLabels.commentAllowOnPosts,
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'allowOnPages',
          type: 'checkbox',
          label: adminLabels.commentAllowOnPages,
          defaultValue: false,
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
