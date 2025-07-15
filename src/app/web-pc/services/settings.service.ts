import { Injectable, signal, WritableSignal, inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { palette, updatePrimaryPalette, usePreset } from '@primeng/themes'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpService } from './http.service'

export interface AppSettings {
  darkMode: boolean
  sidebarCollapsed: boolean
  language: string
  theme: string
  compactMode: boolean
  /** Primary color, e.g. #22c55e */
  primaryColor?: string
  /** Font size, e.g. 16 */
  fontSize?: number
  surfaceConfig?: { color: string }
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'webpc_settings'

  // Signal for reactive state management
  private _settings: WritableSignal<AppSettings> = signal(this.loadSettings())

  // BehaviorSubject for Observable pattern
  private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings())

  // Inject platform id for SSR/browser detection
  private platformId = inject(PLATFORM_ID)

  constructor(private httpService: HttpService) {
    this.applySettings(this._settings())
  }

  /**
   * Get settings as a signal (readonly)
   */
  get settings() {
    return this._settings.asReadonly()
  }

  /**
   * Get settings as an Observable
   */
  get settings$(): Observable<AppSettings> {
    return this.settingsSubject.asObservable()
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      darkMode: !currentSettings.darkMode
    }
    if (isPlatformBrowser(this.platformId)) {
      if (newSettings.darkMode) {
        document.documentElement.classList.add('app-dark')
      } else {
        document.documentElement.classList.remove('app-dark')
      }
    }
    this.updateSettings(newSettings)
  }

  /**
   * Set dark mode state
   */
  setDarkMode(enabled: boolean): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      darkMode: enabled
    }
    if (isPlatformBrowser(this.platformId)) {
      if (enabled) {
        document.documentElement.classList.add('app-dark')
      } else {
        document.documentElement.classList.remove('app-dark')
      }
    }
    this.updateSettings(newSettings)
  }

  /**
   * Set language
   */
  setLanguage(language: string): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      language
    }
    this.updateSettings(newSettings)
  }

  /**
   * Set theme
   */
  setTheme(theme: string): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      theme
    }
    if (isPlatformBrowser(this.platformId)) {
      document.body.setAttribute('data-theme', theme)
    }
    this.updateSettings(newSettings)
  }

  /**
   * Set preset theme with surface configuration
   */
  setPresetTheme(themeName: string): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      theme: themeName
    }
    if (isPlatformBrowser(this.platformId)) {
      document.body.setAttribute('data-theme', themeName)
      if (['lara', 'aura', 'nora', 'material'].includes(themeName)) {
        this.loadPresetTheme(themeName).then((presetTheme) => {
          if (presetTheme) {
            usePreset(presetTheme)
            this.applySurfaceConfiguration()
            this.applyPrimaryColor(currentSettings.primaryColor)
          }
        })
      }
    }
    this.updateSettings(newSettings)
  }

  /**
   * Set font size
   */
  setFontSize(size: number): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      fontSize: size
    }
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.style.fontSize = `${size}px`
    }
    this.updateSettings(newSettings)
  }

  /**
   * Get font size
   */
  getFontSize(): number {
    return this._settings().fontSize || 16
  }

  /**
   * Set primary color
   */
  setPrimaryColor(color: string): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      primaryColor: color
    }
    this.applyPrimaryColor(color)
    this.updateSettings(newSettings)
  }

  /**
   * Get primary color
   */
  getPrimaryColor(): string {
    return this._settings().primaryColor || '#22c55e'
  }

  /**
   * Set surface config
   */
  setSurfaceConfig(config: { color: string }): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      surfaceConfig: config
    }
    this.updateSettings(newSettings)
    this.applySurfaceConfiguration()
  }

  /**
   * Get surface config
   */
  getSurfaceConfig(): { color: string } {
    return this._settings().surfaceConfig || { color: 'zinc' }
  }

  /**
   * Apply surface configuration (browser only)
   */
  applySurfaceConfiguration(): void {
    if (isPlatformBrowser(this.platformId)) {
      const config = this.getSurfaceConfig()
      document.body.setAttribute('data-surface', config.color)
    }
  }

  /**
   * Reset all settings
   */
  resetSettings(): void {
    const defaultSettings: AppSettings = {
      darkMode: false,
      sidebarCollapsed: false,
      language: 'zh-CN',
      theme: 'lara',
      compactMode: false,
      primaryColor: '#22c55e',
      fontSize: 16,
      surfaceConfig: { color: 'zinc' }
    }
    this.updateSettings(defaultSettings)
    this.applySettings(defaultSettings)
  }

  /**
   * Update settings and persist
   */
  private updateSettings(newSettings: AppSettings): void {
    this._settings.set(newSettings)
    this.settingsSubject.next(newSettings)
    this.saveSettings(newSettings)
    this.applySettings(newSettings)
  }

  /**
   * Apply settings to DOM (browser only)
   */
  private applySettings(settings: AppSettings): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only run DOM operations in browser
      if (settings.darkMode) {
        document.documentElement.classList.add('app-dark')
      } else {
        document.documentElement.classList.remove('app-dark')
      }
      document.body.setAttribute('data-theme', settings.theme)
      document.documentElement.style.fontSize = `${settings.fontSize || 16}px`
      this.applySurfaceConfiguration()
      this.applyPrimaryColor(settings.primaryColor)
    }
  }

  /**
   * Apply primary color to theme (browser only)
   */
  private applyPrimaryColor(color?: string): void {
    if (isPlatformBrowser(this.platformId) && color) {
      updatePrimaryPalette(palette(color))
      document.documentElement.style.setProperty('--p-primary-color', color)
    }
  }

  /**
   * Load preset theme
   */
  private async loadPresetTheme(themeName: string): Promise<any> {
    // You can implement dynamic import for theme files if needed
    // For now, just return null
    return null
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): AppSettings {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.SETTINGS_KEY)
        if (raw) {
          return JSON.parse(raw)
        }
      }
    } catch (e) {
      // Ignore
    }
    return {
      darkMode: false,
      sidebarCollapsed: false,
      language: 'zh-CN',
      theme: 'lara',
      compactMode: false,
      primaryColor: '#22c55e',
      fontSize: 16,
      surfaceConfig: { color: 'zinc' }
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(settings: AppSettings): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    }
  }
}
