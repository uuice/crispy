import type { NestedKeysStripped } from '@payloadcms/translations'

export type CustomTranslationsKeys = NestedKeysStripped<typeof customTranslations.zh>

export const customTranslations = {
  zh: {
    crispy: {
      siteSettings: '站点设置',
      welcomeDashboard: '欢迎使用 Crispy CMS',
    },
  },
  en: {
    crispy: {
      siteSettings: 'Site Settings',
      welcomeDashboard: 'Welcome to Crispy CMS',
    },
  },
}
