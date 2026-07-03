import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { isEditor } from '@/access/roles'
import { DEFAULT_ADMIN_THEME_HUE } from '@/brand/admin-theme'
import { adminLabels } from '@/i18n/admin-labels'
import { getFrontendThemeSelectOptions } from '@/themes/definitions'

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
      name: 'frontendTheme',
      type: 'select',
      label: adminLabels.frontendTheme,
      defaultValue: 'blog',
      options: getFrontendThemeSelectOptions(),
      admin: {
        position: 'sidebar',
        description: '切换主题后请在「缓存管理」清除前台 HTML 缓存。',
      },
    },
    {
      name: 'adminThemeHue',
      type: 'number',
      label: adminLabels.adminThemeHue,
      defaultValue: DEFAULT_ADMIN_THEME_HUE,
      admin: {
        hidden: true,
      },
    },
  ],
}
