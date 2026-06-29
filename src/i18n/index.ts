import { en } from 'payload/i18n/en'
import { zh } from 'payload/i18n/zh'

import { customTranslations } from './custom-translations'

export const i18nConfig = {
  fallbackLanguage: 'zh' as const,
  supportedLanguages: { en, zh },
  translations: customTranslations,
}
