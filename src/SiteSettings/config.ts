import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { isEditor } from '@/access/roles'
import { DEFAULT_ADMIN_THEME_HUE } from '@/brand/admin-theme'
import { adminLabels } from '@/i18n/admin-labels'
import { getFrontendThemeSelectOptions } from '@/themes/definitions'

import { purgeCacheOnSiteSettingsChange } from './hooks/purgeCacheOnSiteSettingsChange'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: adminLabels.siteSettings,
  admin: {
    group: adminLabels.configGroup,
  },
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
      name: 'showNovelUpdatesOnHome',
      type: 'checkbox',
      label: adminLabels.showNovelUpdatesOnHome,
      defaultValue: false,
      admin: {
        description: adminLabels.showNovelUpdatesOnHomeHint,
      },
    },
    {
      name: 'recordSettings',
      type: 'group',
      label: adminLabels.recordSettings,
      fields: [
        {
          name: 'icpNumber',
          type: 'text',
          label: adminLabels.icpNumber,
          admin: {
            description: '如：浙ICP备13002567号-4',
          },
        },
        {
          name: 'icpLink',
          type: 'text',
          label: adminLabels.icpLink,
          defaultValue: 'https://beian.miit.gov.cn/',
        },
        {
          name: 'policeNumber',
          type: 'text',
          label: adminLabels.policeNumber,
        },
        {
          name: 'policeLink',
          type: 'text',
          label: adminLabels.policeLink,
        },
        {
          name: 'recordText',
          type: 'text',
          label: adminLabels.recordText,
        },
        {
          name: 'showRecord',
          type: 'checkbox',
          label: adminLabels.showRecord,
          defaultValue: true,
        },
      ],
    },
    {
      name: 'frontendTheme',
      type: 'select',
      label: adminLabels.frontendTheme,
      defaultValue: 'blog',
      options: getFrontendThemeSelectOptions(),
      admin: {
        hidden: true,
      },
    },
    {
      name: 'frontendThemePicker',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/FrontendThemePreview/FrontendThemeField',
        },
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
  hooks: {
    afterChange: [purgeCacheOnSiteSettingsChange],
  },
}
