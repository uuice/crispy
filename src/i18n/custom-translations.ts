import { pluginTranslationsEn, pluginTranslationsZh } from './plugin-translations'

export const customTranslations = {
  zh: {
    ...pluginTranslationsZh,
    crispy: {
      siteSettings: '站点设置',
      welcomeDashboard: '欢迎使用 Crispy CMS',
    },
  },
  en: {
    ...pluginTranslationsEn,
    crispy: {
      siteSettings: 'Site Settings',
      welcomeDashboard: 'Welcome to Crispy CMS',
    },
  },
}
