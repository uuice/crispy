import type { CollectionConfig } from 'payload'

import { adminLabels } from '@/i18n/admin-labels'

import {
  commentsCreateAccess,
  commentsDeleteAccess,
  commentsReadAccess,
  commentsUpdateAccess,
} from './access'
import { assignCommentDefaults, validateCommentDepth } from './hooks/assignCommentDefaults'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: adminLabels.comments,
  access: {
    create: commentsCreateAccess,
    delete: commentsDeleteAccess,
    read: commentsReadAccess,
    update: commentsUpdateAccess,
  },
  admin: {
    defaultColumns: ['content', 'targetType', 'status', 'author', 'guestName', 'createdAt'],
    useAsTitle: 'content',
    group: adminLabels.operationsGroup,
    description: '文章与单页的用户评论，支持嵌套回复与审核。',
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeValidate: [assignCommentDefaults, validateCommentDepth],
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      label: adminLabels.commentContent,
      required: true,
    },
    {
      name: 'targetType',
      type: 'select',
      label: adminLabels.commentTargetType,
      required: true,
      defaultValue: 'post',
      options: [
        { label: adminLabels.posts.singular, value: 'post' },
        { label: adminLabels.pages.singular, value: 'page' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      label: adminLabels.posts.singular,
      relationTo: 'posts',
      admin: {
        condition: (_, siblingData) => siblingData?.targetType === 'post',
        position: 'sidebar',
      },
    },
    {
      name: 'page',
      type: 'relationship',
      label: adminLabels.pages.singular,
      relationTo: 'pages',
      admin: {
        condition: (_, siblingData) => siblingData?.targetType === 'page',
        position: 'sidebar',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      label: adminLabels.commentParent,
      relationTo: 'comments',
      admin: {
        position: 'sidebar',
        description: '留空表示顶级评论。',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: adminLabels.commentStatus,
      required: true,
      defaultValue: 'pending',
      options: [
        { label: adminLabels.commentStatusPending, value: 'pending' },
        { label: adminLabels.commentStatusApproved, value: 'approved' },
        { label: adminLabels.commentStatusRejected, value: 'rejected' },
        { label: adminLabels.commentStatusSpam, value: 'spam' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      label: adminLabels.commentAuthor,
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.author),
      },
      access: {
        update: () => false,
      },
    },
    {
      name: 'guestName',
      type: 'text',
      label: adminLabels.commentGuestName,
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.author,
      },
    },
    {
      name: 'guestEmail',
      type: 'email',
      label: adminLabels.commentGuestEmail,
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.author,
        description: '仅管理员可见，不会在前台展示。',
      },
      access: {
        read: ({ req: { user } }) => Boolean(user),
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: adminLabels.commentIpAddress,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      access: {
        read: ({ req: { user } }) => Boolean(user),
        update: () => false,
      },
    },
  ],
}
