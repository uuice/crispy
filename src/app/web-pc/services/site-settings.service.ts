import {
  Injectable,
  signal,
  WritableSignal,
  inject,
  PLATFORM_ID,
  TransferState,
  makeStateKey
} from '@angular/core'
import { isPlatformServer } from '@angular/common'
import { HttpService, ApiResponse } from './http.service'

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteKeywords: string
  siteLogo: string
  siteFavicon: string
  siteFooter: string
  allowRegistration: boolean
  allowComment: boolean
  commentAudit: boolean
  defaultLanguage: string
  timezone: string
  dateFormat: string
  timeFormat: string
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private httpService = inject(HttpService)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)

  // TransferState key
  private readonly SITE_SETTINGS_KEY = makeStateKey<SiteSettings>('siteSettings')

  // Signal for reactive state management
  private _siteSettings: WritableSignal<SiteSettings | null> = signal(null)

  // Loading state
  private _loading = signal(false)

  constructor() {
    this.loadSiteSettings()
  }

  /**
   * Get site settings as a signal (readonly)
   */
  get siteSettings() {
    return this._siteSettings.asReadonly()
  }

  /**
   * Get loading state as a signal
   */
  get loading() {
    return this._loading.asReadonly()
  }

  /**
   * Load site settings from API or TransferState
   */
  loadSiteSettings(): void {
    // Check if data exists in TransferState
    const cachedSettings = this.transferState.get(this.SITE_SETTINGS_KEY, null)
    if (cachedSettings) {
      this._siteSettings.set(cachedSettings)
      return
    }

    // If no cached data, load from API
    this._loading.set(true)
    this.httpService
      .get<ApiResponse<SiteSettings>>('/api/content/configs/site-settings')
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this._siteSettings.set(response.data)

            // Store in TransferState on server-side
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(this.SITE_SETTINGS_KEY, response.data)
            }
          }
          this._loading.set(false)
        },
        error: (err) => {
          console.error('Failed to load site settings:', err)
          // Set default settings on error
          this._siteSettings.set({
            siteName: '轻盈的鱼',
            siteDescription:
              '专注于前端开发的程序员，分享Vue、Angular、Node.js等技术栈的学习笔记和解决方案。',
            siteKeywords: '前端开发, Vue, Angular, Node.js, JavaScript, 学习笔记, 技术博客',
            siteLogo: '',
            siteFavicon: '',
            siteFooter: '',
            allowRegistration: false,
            allowComment: true,
            commentAudit: true,
            defaultLanguage: 'zh-CN',
            timezone: 'Asia/Shanghai',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss'
          })
          this._loading.set(false)
        }
      })
  }

  /**
   * Get site name
   */
  getSiteName(): string {
    return this._siteSettings()?.siteName || '轻盈的鱼'
  }

  /**
   * Get site description
   */
  getSiteDescription(): string {
    return (
      this._siteSettings()?.siteDescription ||
      '专注于前端开发的程序员，分享Vue、Angular、Node.js等技术栈的学习笔记和解决方案。'
    )
  }

  /**
   * Get site keywords
   */
  getSiteKeywords(): string {
    return (
      this._siteSettings()?.siteKeywords ||
      '前端开发, Vue, Angular, Node.js, JavaScript, 学习笔记, 技术博客'
    )
  }

  /**
   * Get site logo
   */
  getSiteLogo(): string {
    return this._siteSettings()?.siteLogo || ''
  }

  /**
   * Get site favicon
   */
  getSiteFavicon(): string {
    return this._siteSettings()?.siteFavicon || '/favicon.ico'
  }

  /**
   * Get site footer
   */
  getSiteFooter(): string {
    return this._siteSettings()?.siteFooter || ''
  }

  /**
   * Check if registration is allowed
   */
  isRegistrationAllowed(): boolean {
    return this._siteSettings()?.allowRegistration || false
  }

  /**
   * Check if comments are allowed
   */
  isCommentAllowed(): boolean {
    return this._siteSettings()?.allowComment || false
  }

  /**
   * Check if comment audit is enabled
   */
  isCommentAuditEnabled(): boolean {
    return this._siteSettings()?.commentAudit || false
  }

  /**
   * Get default language
   */
  getDefaultLanguage(): string {
    return this._siteSettings()?.defaultLanguage || 'zh-CN'
  }

  /**
   * Get timezone
   */
  getTimezone(): string {
    return this._siteSettings()?.timezone || 'Asia/Shanghai'
  }

  /**
   * Get date format
   */
  getDateFormat(): string {
    return this._siteSettings()?.dateFormat || 'YYYY-MM-DD'
  }

  /**
   * Get time format
   */
  getTimeFormat(): string {
    return this._siteSettings()?.timeFormat || 'HH:mm:ss'
  }
}
