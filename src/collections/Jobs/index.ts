import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { isEditor } from '../../access/roles'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { adminLabels } from '@/i18n/admin-labels'

import { jobsReadAccess } from './access'
import { revalidateJob, revalidateJobDelete } from './hooks/revalidateJob'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: adminLabels.jobs,
  access: {
    create: isEditor,
    delete: isEditor,
    read: jobsReadAccess,
    update: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'location', 'employmentType', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.operationsGroup,
  },
  defaultSort: '-publishedAt',
  hooks: {
    afterChange: [revalidateJob],
    afterDelete: [revalidateJobDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
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
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'requirements',
      type: 'richText',
      label: adminLabels.jobRequirements,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          InlineToolbarFeature(),
        ],
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
