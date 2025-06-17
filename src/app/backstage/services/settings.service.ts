import { Injectable, signal, WritableSignal } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

export interface AppSettings {
  darkMode: boolean
  sidebarCollapsed: boolean
  language: string
  theme: string
  compactMode: boolean
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

  constructor() {
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
      theme: 'default',
      compactMode: false
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
    this.applySettings(newSettings)
  }

  /**
   * Apply settings to DOM and CSS
   */
  private applySettings(settings: AppSettings): void {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('app-dark')
    } else {
      document.documentElement.classList.remove('app-dark')
    }

    // Apply compact mode
    if (settings.compactMode) {
      document.documentElement.classList.add('compact-mode')
    } else {
      document.documentElement.classList.remove('compact-mode')
    }

    // Apply theme
    document.body.setAttribute('data-theme', settings.theme)
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
          theme: parsed.theme ?? 'default',
          compactMode: parsed.compactMode ?? false
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
      theme: 'default',
      compactMode: false
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
      typeof settings.compactMode === 'boolean'
    )
  }
}
