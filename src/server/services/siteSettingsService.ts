import { configService } from './configService'

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteKeywords: string
  siteLogo: string
  siteFavicon: string
  siteFooter: string
  allowRegistration: boolean
  defaultLanguage: string
  timezone: string
  dateFormat: string
  timeFormat: string
}

export class SiteSettingsService {
  /**
   * Get site settings from database
   */
  static async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      // Get site settings config by alias
      const siteSettingsConfig = await configService.getConfigByAlias('SITE_SETTINGS')
      if (!siteSettingsConfig || !siteSettingsConfig.value) {
        return null
      }

      // Parse the JSON value
      let siteSettings: SiteSettings
      try {
        siteSettings = JSON.parse(siteSettingsConfig.value)
      } catch (parseError) {
        console.error('Failed to parse site settings JSON:', parseError)
        return null
      }

      return siteSettings
    } catch (error) {
      console.error('Failed to get site settings:', error)
      return null
    }
  }

  /**
   * Generate meta tags HTML for SSR
   */
  static generateMetaTagsHtml(settings: SiteSettings | null): string {
    if (!settings) {
      return this.generateDefaultMetaTags()
    }

    const title = `${settings.siteName}`

    return `
      <title>${title}</title>
      <meta name="description" content="${settings.siteDescription}" />
      <meta name="keywords" content="${settings.siteKeywords}" />
      <meta name="author" content="UUICE" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${settings.siteDescription}" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="zh_CN" />
      ${settings.siteFavicon ? `<link rel="icon" type="image/x-icon" href="${settings.siteFavicon}" />` : ''}
    `.trim()
  }

  /**
   * Generate default meta tags when settings are not available
   */
  private static generateDefaultMetaTags(): string {
    return `
      <title>轻盈的鱼</title>
      <meta name="description" content="专注于前端开发的程序员，分享Vue、Angular、Node.js等技术栈的学习笔记和解决方案。记录工作中遇到的问题和解决方案，致力于构建现代化的响应式Web应用。" />
      <meta name="keywords" content="前端开发, Vue, Angular, Node.js, JavaScript, 学习笔记, 技术博客, 前端技术栈, 响应式设计, Web开发, 程序员, 前端工程师" />
      <meta name="author" content="UUICE" />
      <meta property="og:title" content="轻盈的鱼" />
      <meta property="og:description" content="专注于前端开发的程序员，分享Vue、Angular、Node.js等技术栈的学习笔记和解决方案。记录工作中遇到的问题和解决方案，致力于构建现代化的响应式Web应用。" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="zh_CN" />
    `.trim()
  }
}
