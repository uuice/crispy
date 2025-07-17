import { Injectable, signal, WritableSignal } from '@angular/core'
import { palette, updatePrimaryPalette, usePreset } from '@primeng/themes'
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs'
import { HttpService } from './http.service'

export interface AppSettings {
  darkMode: boolean
  sidebarCollapsed: boolean
  language: string
  theme: string
  compactMode: boolean
  /** 主色（primary color），如 #22c55e */
  primaryColor?: string
  /** 字体大小，如 16 */
  fontSize?: number
  surfaceConfig?: { color: string }
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'backstage_settings'

  // Signal for reactive state management
  private _settings: WritableSignal<AppSettings> = signal(this.loadSettings())

  // BehaviorSubject for traditional Observable pattern
  private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings())

  constructor(private httpService: HttpService) {
    this.applySettings(this._settings())
  }

  /**
   * Get settings as a signal
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

    // Apply dark mode
    if (newSettings.darkMode) {
      document.documentElement.classList.add('app-dark')
    } else {
      document.documentElement.classList.remove('app-dark')
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

    // Apply dark mode
    if (enabled) {
      document.documentElement.classList.add('app-dark')
    } else {
      document.documentElement.classList.remove('app-dark')
    }

    this.updateSettings(newSettings)
  }

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebarCollapsed(): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      sidebarCollapsed: !currentSettings.sidebarCollapsed
    }

    // Apply sidebar collapsed state
    if (newSettings.sidebarCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed')
    } else {
      document.documentElement.classList.remove('sidebar-collapsed')
    }

    this.updateSettings(newSettings)
  }

  /**
   * Set sidebar collapsed state
   */
  setSidebarCollapsed(collapsed: boolean): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      sidebarCollapsed: collapsed
    }

    // Apply sidebar collapsed state
    if (collapsed) {
      document.documentElement.classList.add('sidebar-collapsed')
    } else {
      document.documentElement.classList.remove('sidebar-collapsed')
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

    // Apply theme attribute
    document.body.setAttribute('data-theme', theme)

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

    // Apply theme attribute
    document.body.setAttribute('data-theme', themeName)

    // Apply preset theme
    if (['lara', 'aura', 'nora', 'material'].includes(themeName)) {
      this.loadPresetTheme(themeName).then((presetTheme) => {
        if (presetTheme) {
          usePreset(presetTheme)
          // Apply surface configuration after preset theme
          this.applySurfaceConfiguration()
          this.applyPrimaryColor(currentSettings.primaryColor)
        }
      })
    }

    this.updateSettings(newSettings)
  }

  /**
   * Toggle compact mode
   */
  toggleCompactMode(): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      compactMode: !currentSettings.compactMode
    }

    // Apply compact mode
    if (newSettings.compactMode) {
      document.documentElement.classList.add('compact-mode')
    } else {
      document.documentElement.classList.remove('compact-mode')
    }

    this.updateSettings(newSettings)
  }

  /**
   * Reset settings to default
   */
  resetSettings(): void {
    const defaultSettings: AppSettings = {
      darkMode: false,
      sidebarCollapsed: false,
      language: 'zh-CN',
      theme: 'lara',
      compactMode: false,
      primaryColor: '#22c55e',
      fontSize: 14
    }
    this.updateSettings(defaultSettings)
  }

  /**
   * Update settings and persist to localStorage
   */
  private updateSettings(newSettings: AppSettings): void {
    this._settings.set(newSettings)
    this.settingsSubject.next(newSettings)
    this.saveSettings(newSettings)
    // this.applySettings(newSettings)
  }

  /**
   * Apply settings to DOM and CSS (only for initialization)
   */
  private applySettings(settings: AppSettings): void {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('app-dark')
    } else {
      document.documentElement.classList.remove('app-dark')
    }

    // Apply sidebar collapsed state
    if (settings.sidebarCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed')
    } else {
      document.documentElement.classList.remove('sidebar-collapsed')
    }

    // Apply compact mode
    if (settings.compactMode) {
      document.documentElement.classList.add('compact-mode')
    } else {
      document.documentElement.classList.remove('compact-mode')
    }

    // Apply theme attribute
    document.body.setAttribute('data-theme', settings.theme)

    // Apply font size
    const fontSize = settings.fontSize || 16
    document.documentElement.style.fontSize = `${fontSize}px`

    // Apply preset theme if it's one of the supported presets
    if (settings.theme && ['lara', 'aura', 'nora', 'material'].includes(settings.theme)) {
      try {
        // Import and apply preset theme
        this.loadPresetTheme(settings.theme).then((presetTheme) => {
          if (presetTheme) {
            usePreset(presetTheme)
            // Apply surface configuration after preset theme
            this.applySurfaceConfiguration()
            // Apply primary color after surface configuration to ensure it takes precedence
            this.applyPrimaryColor(settings.primaryColor)
          }
        })
      } catch (e) {
        // Ignore in SSR environment
        console.warn('Failed to apply preset theme:', e)
      }
    } else {
      // If no preset theme, just apply surface configuration and primary color
      this.applySurfaceConfiguration()
      this.applyPrimaryColor(settings.primaryColor)
    }
  }

  /**
   * Apply primary color
   */
  private applyPrimaryColor(color?: string): void {
    if (color) {
      updatePrimaryPalette(palette(color))
    }
  }

  /**
   * Load preset theme dynamically
   */
  private async loadPresetTheme(themeName: string): Promise<any> {
    try {
      switch (themeName) {
        case 'lara':
          return (await import('@primeng/themes/lara')).default
        case 'aura':
          return (await import('@primeng/themes/aura')).default
        case 'nora':
          return (await import('@primeng/themes/nora')).default
        case 'material':
          return (await import('@primeng/themes/material')).default
        default:
          return null
      }
    } catch (error) {
      console.warn(`Failed to load preset theme ${themeName}:`, error)
      return null
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          darkMode: parsed.darkMode ?? false,
          sidebarCollapsed: parsed.sidebarCollapsed ?? false,
          language: parsed.language ?? 'zh-CN',
          theme: parsed.theme ?? 'lara',
          compactMode: parsed.compactMode ?? false,
          primaryColor: parsed.primaryColor ?? '#22c55e',
          fontSize: parsed.fontSize ?? 14,
          surfaceConfig: parsed.surfaceConfig ?? {
            color: 'zinc'
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error)
    }

    // Return default settings
    return {
      darkMode: false,
      sidebarCollapsed: false,
      language: 'zh-CN',
      theme: 'lara',
      compactMode: false,
      primaryColor: '#22c55e',
      fontSize: 14,
      surfaceConfig: {
        color: 'zinc'
      }
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error)
    }
  }

  /**
   * Export settings as JSON
   */
  exportSettings(): string {
    return JSON.stringify(this._settings(), null, 2)
  }

  /**
   * Import settings from JSON
   */
  importSettings(json: string): boolean {
    try {
      const settings = JSON.parse(json)
      if (this.validateSettings(settings)) {
        this.updateSettings(settings)
        return true
      }
    } catch (error) {
      console.warn('Failed to import settings:', error)
    }
    return false
  }

  /**
   * Validate settings object
   */
  private validateSettings(settings: any): settings is AppSettings {
    return (
      typeof settings === 'object' &&
      typeof settings.darkMode === 'boolean' &&
      typeof settings.sidebarCollapsed === 'boolean' &&
      typeof settings.language === 'string' &&
      typeof settings.theme === 'string' &&
      typeof settings.compactMode === 'boolean' &&
      (settings.primaryColor === undefined || typeof settings.primaryColor === 'string') &&
      (settings.fontSize === undefined || typeof settings.fontSize === 'number') &&
      (settings.surfaceConfig === undefined || typeof settings.surfaceConfig.color === 'string')
    )
  }

  /**
   * Set primary color (theme main color)
   */
  setPrimaryColor(color: string): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      primaryColor: color
    }

    // Apply primary color
    updatePrimaryPalette(palette(color))
    this.updateSettings(newSettings)
  }

  /**
   * Get primary color
   */
  getPrimaryColor(): string {
    return this._settings().primaryColor || '#22c55e'
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

    // Apply font size
    const fontSize = size || 16
    document.documentElement.style.fontSize = `${fontSize}px`

    this.updateSettings(newSettings)
  }

  /**
   * Get font size
   */
  getFontSize(): number {
    return this._settings().fontSize || 14
  }

  /**
   * Set Surface configuration with immediate application
   */
  setSurfaceConfig(config: { color: string }): void {
    const currentSettings = this._settings()
    const newSettings = {
      ...currentSettings,
      surfaceConfig: config
    }

    this.updateSettings(newSettings)
    // Apply surface configuration immediately
    this.applySurfaceConfiguration()
  }

  /**
   * Get Surface configuration
   */
  getSurfaceConfig(): { color: string } {
    return (
      this._settings().surfaceConfig || {
        color: 'zinc'
      }
    )
  }

  /**
   * Apply surface configuration
   */
  applySurfaceConfiguration(): void {
    const surfaceConfig = this.getSurfaceConfig()
    if (surfaceConfig && surfaceConfig.color && surfaceConfig.color !== 'zinc') {
      try {
        import('@primeng/themes').then((mod) => {
          if (mod.updateSurfacePalette) {
            const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            const palette: Record<number, string> = {}
            for (const step of steps) {
              palette[step] = `{${surfaceConfig.color}.${step}}`
            }
            mod.updateSurfacePalette(palette)
          }
        })
      } catch (e) {
        // Ignore in SSR environment
        console.warn('Failed to apply surface configuration:', e)
      }
    }
  }

  /**
   * Load configuration by alias
   * @param alias Configuration alias
   * @returns Promise with configuration data
   */
  async loadConfigByAlias(alias: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(`/api/admin/configs/alias/${alias}`)
      )
      if (response?.success && response.data) {
        return JSON.parse(response.data.value)
      }
      return null
    } catch (error) {
      console.error(`Failed to load config by alias ${alias}:`, error)
      return null
    }
  }

  /**
   * Save configuration by alias
   * @param alias Configuration alias
   * @param title Configuration title
   * @param data Configuration data
   * @returns Promise with save result
   */
  async saveConfigByAlias(alias: string, title: string, data: any): Promise<boolean> {
    try {
      const configValue = JSON.stringify(data)

      // Use upsert endpoint - insert if not exists, update if exists
      await firstValueFrom(
        this.httpService.post<any>('/api/admin/configs/upsert', {
          title,
          alias,
          value: configValue
        })
      )

      return true
    } catch (error) {
      console.error(`Failed to save config by alias ${alias}:`, error)
      return false
    }
  }
}
