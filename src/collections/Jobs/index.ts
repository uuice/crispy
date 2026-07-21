import type { CollectionConfig } from 'payload'

import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { requirePermission } from '@/access/can'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { adminLabels } from '@/i18n/admin-labels'
import { withAiRewriteFeatures, withAiTextField } from '@/fields/ai'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'

import { jobsReadAccess } from './access'
import { hideUnlessAnyPermission } from '@/access/adminHidden'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: adminLabels.jobs,
  access: {
    create: requirePermission('ops:manage'),
    delete: requirePermission('ops:manage'),
    read: jobsReadAccess,
    update: requirePermission('ops:manage'),
  },
  admin: {
    hidden: hideUnlessAnyPermission('ops:manage'),
    defaultColumns: ['title', 'location', 'employmentType', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.operationsGroup,
  },
  defaultSort: '-publishedAt',
  hooks: {
    beforeValidate: [createSanitizeLexicalHook(['description', 'requirements'])],
  },
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    }),
    chineseSlugField({
      position: 'sidebar',
    }),
    {
      name: 'department',
      type: 'text',
      label: adminLabels.department,
    },
    {
      name: 'location',
      type: 'text',
      label: adminLabels.location,
    },
    {
      name: 'employmentType',
      type: 'select',
      label: adminLabels.employmentType,
      defaultValue: 'full-time',
      options: [
        { label: adminLabels.employmentFullTime, value: 'full-time' },
        { label: adminLabels.employmentPartTime, value: 'part-time' },
        { label: adminLabels.employmentContract, value: 'contract' },
        { label: adminLabels.employmentIntern, value: 'intern' },
        { label: adminLabels.employmentRemote, value: 'remote' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'salary',
      type: 'text',
      label: adminLabels.salary,
      admin: {
        description: 'e.g. 15k–25k / month',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: adminLabels.jobDescription,
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) =>
          withAiRewriteFeatures([
            ...rootFeatures,
            FixedToolbarFeature(),
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          ]),
      }),
    },
    {
      name: 'requirements',
      type: 'richText',
      label: adminLabels.jobRequirements,
      editor: lexicalEditor({
        features: ({ rootFeatures }) =>
          withAiRewriteFeatures([
            ...rootFeatures,
            FixedToolbarFeature(),
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          ]),
      }),
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: adminLabels.publishedAt,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
