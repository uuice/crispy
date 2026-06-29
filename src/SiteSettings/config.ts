import type { GlobalConfig } from 'payload'

import { DEFAULT_ADMIN_THEME_HUE } from '@/brand/admin-theme'
import { isEditor } from '@/access/roles'
import { anyone } from '@/access/anyone'
import { adminLabels } from '@/i18n/admin-labels'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: adminLabels.siteSettings,
  access: {
    read: anyone,
    update: isEditor,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: adminLabels.siteName,
      required: true,
      defaultValue: 'Crispy',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: adminLabels.siteDescription,
    },
    {
      name: 'logo',
      type: 'upload',
      label: adminLabels.logo,
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: adminLabels.socialLinks,
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: adminLabels.platform,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: '微博', value: 'weibo' },
            { label: '微信', value: 'wechat' },
            { label: '其他', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: adminLabels.url,
          required: true,
        },
      ],
    },
    {
      name: 'analyticsId',
      type: 'text',
      label: adminLabels.analyticsId,
      admin: {
        description: 'Google Analytics / Plausible ID',
      },
    },
    {
      name: 'enableRss',
      type: 'checkbox',
      label: adminLabels.enableRss,
      defaultValue: true,
    },
    {
      type: 'collapsible',
      label: adminLabels.adminAppearance,
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'adminThemeHue',
          type: 'number',
          label: adminLabels.adminThemeHue,
          defaultValue: DEFAULT_ADMIN_THEME_HUE,
          min: 0,
          max: 360,
          admin: {
            description:
              'OKLCH 色相 (0–360)。默认 41 为 Crispy 暖橙；保存后刷新 Admin 即可生效。例：0 红、120 绿、240 蓝。',
            step: 1,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
