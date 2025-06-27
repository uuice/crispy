import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { AvatarModule } from 'primeng/avatar'
import { MenuItem, ConfirmationService } from 'primeng/api'
import { NgClass } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { SettingsService } from '../services/settings.service'
import { DrawerModule } from 'primeng/drawer'
import { usePreset, updatePrimaryPalette, palette, updateSurfacePalette } from '@primeng/themes'
import { MenuModule } from 'primeng/menu'
import { AuthService } from '../services/auth.service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { FormsModule } from '@angular/forms'
import { SelectButtonModule } from 'primeng/selectbutton'
// Import preset themes
import Aura from '@primeng/themes/aura'
import nora from '@primeng/themes/nora'
import lara from '@primeng/themes/lara'
import material from '@primeng/themes/material'

@Component({
  selector: 'cs-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule,
    NgClass,
    RouterModule,
    DrawerModule,
    MenuModule,
    ConfirmDialogModule,
    FormsModule,
    SelectButtonModule
  ],
  providers: [ConfirmationService],
  template: `
    <p-confirm-dialog></p-confirm-dialog>
    <header class="header" [class.dark-mode]="settingsService.settings().darkMode">
      <div class="header-content">
        <div class="header-left">
          <span class="logo">Crispy</span>
        </div>
        <div class="header-right">
          <p-button
            [icon]="settingsService.settings().darkMode ? 'pi pi-sun' : 'pi pi-moon'"
            [rounded]="true"
            [text]="true"
            class="header-btn"
            (click)="toggleDarkMode()"
            [title]="settingsService.settings().darkMode ? '切换到亮色模式' : '切换到暗色模式'"
          ></p-button>
          <p-button
            icon="pi pi-palette"
            [rounded]="true"
            [text]="true"
            class="header-btn"
            (click)="drawerVisible = true"
            title="主题设置"
          ></p-button>
          <p-button
            icon="pi pi-desktop"
            [rounded]="true"
            [text]="true"
            class="header-btn"
            (click)="onFullscreen()"
          ></p-button>
          <p-button [rounded]="true" [text]="true" class="header-btn" (click)="onLang()">
            <i [ngClass]="['pi', 'pi-language']"></i>
          </p-button>
          <p-button
            icon="pi pi-bell"
            [text]="true"
            class="p-button-text header-btn"
            (click)="onNotify()"
          >
            @if (hasNotification) {
              <span class="dot"></span>
            }
          </p-button>
          <p-avatar
            image="/assets/avatar.png"
            shape="circle"
            size="large"
            class="header-avatar"
            (click)="userMenu.toggle($event)"
          ></p-avatar>
          <p-menu #userMenu [model]="userMenuItems" [popup]="true"></p-menu>
        </div>
      </div>
    </header>
    <p-drawer
      [(visible)]="drawerVisible"
      position="right"
      [modal]="true"
      [dismissible]="true"
      header="主题设置"
      [style]="{ width: '700px' }"
    >
      <div class="theme-settings">
        <!-- Dark Mode Section -->
        <div class="setting-section">
          <div class="label">暗黑模式</div>
          <p-selectButton
            [options]="darkModeOptions"
            [(ngModel)]="selectedDarkMode"
            optionLabel="label"
            optionValue="value"
            (onChange)="onDarkModeChange($event)"
            [style]="{ width: '100%' }"
          ></p-selectButton>
        </div>

        <!-- Preset Themes Section -->
        <div class="setting-section">
          <div class="label">预设主题</div>
          <p-selectButton
            [options]="presetOptions"
            [(ngModel)]="selectedPreset"
            optionLabel="label"
            optionValue="value"
            (onChange)="onPresetChange($event)"
            [style]="{ width: '100%' }"
          ></p-selectButton>
        </div>

        <div class="setting-section">
          <div class="label">Surface 配置</div>
          <div class="surface-color-options-row">
            @for (surfaceColor of surfaceColors; track surfaceColor.name) {
              <div
                class="surface-color-option"
                [class.selected]="surfaceColor.value === selectedSurfaceColor"
                (click)="selectSurfaceColor(surfaceColor.value)"
                [title]="surfaceColor.name"
              >
                <div
                  class="surface-color-preview"
                  [ngStyle]="{ background: surfaceColor.preview }"
                ></div>
                <span class="surface-color-name">{{ surfaceColor.name }}</span>
                @if (surfaceColor.value === selectedSurfaceColor) {
                  <i class="pi pi-check"></i>
                }
              </div>
            }
          </div>
        </div>

        <!-- Font Size Section -->
        <div class="setting-section">
          <div class="label">字体大小</div>
          <p-selectButton
            [options]="fontSizes"
            [(ngModel)]="selectedFontSize"
            optionLabel="label"
            optionValue="value"
            (onChange)="onFontSizeChange($event)"
            [style]="{ width: '100%' }"
          ></p-selectButton>
        </div>

        <!-- Color Categories -->
        @for (category of colorCategories; track category.name) {
          <div class="color-section">
            <div class="label">{{ category.name }}</div>
            <div class="color-row">
              @for (color of category.colors; track color.name) {
                <div
                  class="color-dot"
                  [ngStyle]="{ background: color.palette[500] }"
                  [class.selected]="color === selectedPrimary"
                  (click)="selectPrimary(color)"
                  [title]="color.name"
                >
                  @if (color === selectedPrimary) {
                    <i class="pi pi-check"></i>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </p-drawer>
  `,
  styles: [
    `
      .header {
        height: 60px;
        z-index: 1000;
        width: 100%;
        background: var(--p-content-background);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        border-bottom: 1px solid var(--p-content-border-color);
      }

      .header.dark-mode {
        background: var(--p-content-background);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .header-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
      }

      .header-left {
        display: flex;
        align-items: center;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .logo {
        font-size: 1.2rem;
        font-weight: 600;
        margin-right: 2rem;
        transition: color 0.3s ease;
      }

      .header-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
        border: 1px solid var(--p-content-border-color);
        background: var(--p-content-background);
        cursor: pointer;
        min-width: 40px;
        min-height: 40px;
      }

      .header-avatar {
        margin-left: 0.5rem;
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .header-avatar:hover {
        transform: scale(1.05);
      }

      .dot {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 8px;
        height: 8px;
        background: #2196f3;
        border-radius: 50%;
        display: inline-block;
      }

      .theme-settings {
        padding: 1.5rem 1rem 1rem 1rem;
      }

      .setting-section {
        margin-bottom: 2rem;
      }

      .color-section {
        margin-bottom: 1.5rem;
      }

      .label {
        font-weight: bold;
        margin: 1.5rem 0 1rem 0;
        font-size: 1.1rem;
        line-height: 1.1;
        letter-spacing: 0.01em;
        color: var(--p-text-color);
      }

      .surface-color-options-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0;
      }

      .surface-color-option {
        flex: 0 0 25%;
        max-width: 25%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        padding: 0.375rem 0;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background 0.18s;
        font-size: 0.9rem;
        line-height: 1.1;
        letter-spacing: 0.01em;
        text-align: center;
      }

      .surface-color-option.selected {
        background: rgba(33, 150, 243, 0.1);
      }

      .surface-color-preview {
        width: 1.125rem;
        height: 1.125rem;
        border-radius: 50%;
        border: 0.125rem solid transparent;
        box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.08);
        margin-right: 0.125rem;
        transition: border 0.2s;
      }

      .surface-color-option.selected .surface-color-preview {
        border-color: #2196f3;
        box-shadow: 0 0 0 0.125rem #2196f3;
      }

      .surface-color-name {
        font-size: 1.1rem;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
      }

      .color-row {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
      .color-dot {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition:
          box-shadow 0.2s,
          border-color 0.2s,
          transform 0.2s;
        position: relative;
      }
      .color-dot:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
        transform: scale(1.08);
        border-color: #43d572;
      }
      .color-dot.selected {
        box-shadow:
          0 0 0 3px #43d572,
          0 4px 16px rgba(0, 0, 0, 0.18);
        border-color: #43d572;
      }
      .color-dot i.pi {
        color: #fff;
        font-size: 1.3rem;
        font-weight: bold;
      }

      .p-selectbutton {
        margin-top: 0.5rem;
        width: 100%;
      }
      .p-selectbutton .p-button {
        font-size: 0.95rem;
        padding: 0.3rem 1.2rem;
      }
    `
  ]
})
export class HeaderComponent implements OnInit {
  @Input() menuItems: MenuItem[] = []
  @Output() sidebarToggle = new EventEmitter<void>()
  @Output() darkModeToggle = new EventEmitter<boolean>()
  hasNotification = true

  protected settingsService = inject(SettingsService)
  private authService = inject(AuthService)
  private router = inject(Router)
  private confirmationService = inject(ConfirmationService)

  drawerVisible = false
  userMenuItems: MenuItem[] = []

  // Surface configuration properties
  selectedSurfaceColor = 'zinc'

  // Surface color options with proper palettes
  surfaceColors = [
    { name: 'Zinc（白灰）', value: 'zinc', preview: '#fafafa' },
    { name: 'Gray（灰）', value: 'gray', preview: '#6b7280' },
    { name: 'Slate（深灰）', value: 'slate', preview: '#475569' },
    { name: 'Neutral（黑）', value: 'neutral', preview: '#171717' },
    { name: 'Stone（米色）', value: 'stone', preview: '#f5f5f4' },
    { name: 'Amber（象牙白）', value: 'amber', preview: '#fffbeb' },
    { name: 'Red（红）', value: 'red', preview: '#ef4444' },
    { name: 'Orange（橙）', value: 'orange', preview: '#f97316' },
    { name: 'Yellow（黄）', value: 'yellow', preview: '#eab308' },
    { name: 'Lime（柠檬绿）', value: 'lime', preview: '#84cc16' },
    { name: 'Green（绿）', value: 'green', preview: '#22c55e' },
    { name: 'Emerald（祖母绿）', value: 'emerald', preview: '#10b981' },
    { name: 'Teal（蓝绿）', value: 'teal', preview: '#14b8a6' },
    { name: 'Cyan（青）', value: 'cyan', preview: '#06b6d4' },
    { name: 'Sky（天蓝）', value: 'sky', preview: '#0ea5e9' },
    { name: 'Blue（蓝）', value: 'blue', preview: '#3b82f6' },
    { name: 'Indigo（靛蓝）', value: 'indigo', preview: '#6366f1' },
    { name: 'Violet（紫罗兰）', value: 'violet', preview: '#8b5cf6' },
    { name: 'Purple（紫）', value: 'purple', preview: '#a855f7' },
    { name: 'Fuchsia（紫红）', value: 'fuchsia', preview: '#d946ef' },
    { name: 'Pink（粉）', value: 'pink', preview: '#ec4899' },
    { name: 'Rose（玫红）', value: 'rose', preview: '#f43f5e' }
    // 你也可以根据 PrimeNG 主题文档继续扩展其它 token
  ]

  // Font size options from 12px to 20px (5 levels)
  fontSizes = [
    { value: 12, label: '极小 (12px)' },
    { value: 14, label: '小 (14px)' },
    { value: 16, label: '标准 (16px)' },
    { value: 18, label: '大 (18px)' },
    { value: 20, label: '极大 (20px)' }
  ]

  selectedFontSize: number = 16 // 默认值

  // Dark mode options
  darkModeOptions = [
    { value: false, label: '亮色模式' },
    { value: true, label: '暗色模式' }
  ]

  selectedDarkMode: boolean = false

  // Preset theme options
  presetOptions = [
    { value: 'lara', label: 'Lara' },
    { value: 'aura', label: 'Aura' },
    { value: 'nora', label: 'Nora' },
    { value: 'material', label: 'Material' },
    { value: 'custom', label: '自定义 Surface' }
  ]

  selectedPreset: string = 'lara'

  // Preset theme mappings
  presetThemes = {
    lara: lara,
    aura: Aura,
    nora: nora,
    material: material
  }

  // Generate all available color palettes using the palette method
  colorCategories = [
    {
      name: '基础色彩',
      colors: [
        { name: 'Green', palette: palette('#22c55e') },
        { name: 'Blue', palette: palette('#3b82f6') },
        { name: 'Purple', palette: palette('#a855f7') },
        { name: 'Red', palette: palette('#f43f5e') },
        { name: 'Orange', palette: palette('#f59e42') },
        { name: 'Yellow', palette: palette('#eab308') },
        { name: 'Pink', palette: palette('#ec4899') },
        { name: 'Gray', palette: palette('#6b7280') }
      ]
    },
    {
      name: 'Tailwind 标准色',
      colors: [
        { name: 'Red-500', palette: palette('#ef4444') },
        { name: 'Orange-500', palette: palette('#f97316') },
        { name: 'Amber-500', palette: palette('#f59e0b') },
        { name: 'Yellow-500', palette: palette('#eab308') },
        { name: 'Lime-500', palette: palette('#84cc16') },
        { name: 'Green-500', palette: palette('#22c55e') },
        { name: 'Emerald-500', palette: palette('#10b981') },
        { name: 'Teal-500', palette: palette('#14b8a6') },
        { name: 'Cyan-500', palette: palette('#06b6d4') },
        { name: 'Sky-500', palette: palette('#0ea5e9') },
        { name: 'Blue-500', palette: palette('#3b82f6') },
        { name: 'Indigo-500', palette: palette('#6366f1') },
        { name: 'Violet-500', palette: palette('#8b5cf6') },
        { name: 'Purple-500', palette: palette('#a855f7') },
        { name: 'Fuchsia-500', palette: palette('#d946ef') },
        { name: 'Pink-500', palette: palette('#ec4899') },
        { name: 'Rose-500', palette: palette('#f43f5e') }
      ]
    },
    {
      name: '宝石色彩',
      colors: [
        { name: 'Ruby', palette: palette('#dc2626') },
        { name: 'Sapphire', palette: palette('#2563eb') },
        { name: 'Emerald', palette: palette('#059669') },
        { name: 'Topaz', palette: palette('#d97706') },
        { name: 'Amethyst', palette: palette('#7c3aed') },
        { name: 'Garnet', palette: palette('#be123c') },
        { name: 'Aquamarine', palette: palette('#0891b2') },
        { name: 'Peridot', palette: palette('#65a30d') },
        { name: 'Opal', palette: palette('#f0f9ff') },
        { name: 'Jade', palette: palette('#047857') },
        { name: 'Turquoise', palette: palette('#0d9488') }
      ]
    },
    {
      name: '金属质感',
      colors: [
        { name: 'Gold', palette: palette('#ca8a04') },
        { name: 'Silver', palette: palette('#6b7280') },
        { name: 'Bronze', palette: palette('#92400e') },
        { name: 'Copper', palette: palette('#b45309') },
        { name: 'Platinum', palette: palette('#374151') },
        { name: 'Titanium', palette: palette('#4b5563') },
        { name: 'Steel', palette: palette('#6b7280') },
        { name: 'Iron', palette: palette('#374151') },
        { name: 'Carbon', palette: palette('#111827') },
        { name: 'Obsidian', palette: palette('#030712') }
      ]
    },
    {
      name: '自然色彩',
      colors: [
        { name: 'Ocean', palette: palette('#0891b2') },
        { name: 'Forest', palette: palette('#059669') },
        { name: 'Sunset', palette: palette('#ea580c') },
        { name: 'Berry', palette: palette('#be185d') },
        { name: 'Lavender', palette: palette('#7c3aed') },
        { name: 'Mint', palette: palette('#059669') },
        { name: 'Coral', palette: palette('#fb7185') },
        { name: 'Salmon', palette: palette('#fda4af') },
        { name: 'Peach', palette: palette('#fed7aa') },
        { name: 'Cream', palette: palette('#fef3c7') },
        { name: 'Ivory', palette: palette('#fefce8') },
        { name: 'Beige', palette: palette('#f5f5dc') },
        { name: 'Tan', palette: palette('#d2b48c') },
        { name: 'Khaki', palette: palette('#c3b091') },
        { name: 'Olive', palette: palette('#808000') }
      ]
    },
    {
      name: '经典色彩',
      colors: [
        { name: 'Navy', palette: palette('#1e3a8a') },
        { name: 'Maroon', palette: palette('#800000') },
        { name: 'Burgundy', palette: palette('#800020') },
        { name: 'Wine', palette: palette('#722f37') },
        { name: 'Plum', palette: palette('#8b4513') },
        { name: 'Eggplant', palette: palette('#614051') },
        { name: 'Charcoal', palette: palette('#36454f') },
        { name: 'Slate', palette: palette('#708090') },
        { name: 'Smoke', palette: palette('#848884') },
        { name: 'Ash', palette: palette('#b2beb5') },
        { name: 'Fog', palette: palette('#d3d3d3') },
        { name: 'Mist', palette: palette('#e6e6fa') },
        { name: 'Frost', palette: palette('#f0f8ff') },
        { name: 'Snow', palette: palette('#fffafa') },
        { name: 'Pearl', palette: palette('#f9fafb') },
        { name: 'Diamond', palette: palette('#ffffff') }
      ]
    }
  ]

  // Flatten all colors for backward compatibility
  primaryColors = this.colorCategories.flatMap((category) => category.colors)

  get selectedPrimary() {
    // Find the color object whose palette[500] matches the current primaryColor
    const current = this.settingsService.getPrimaryColor()
    return (
      this.primaryColors.find((c) => c.palette[500].toLowerCase() === current.toLowerCase()) ||
      this.primaryColors[0]
    )
  }

  selectPrimary(color: any) {
    this.settingsService.setPrimaryColor(color.palette[500])
  }

  selectFontSize(size: number) {
    this.settingsService.setFontSize(size)
  }

  // Surface configuration methods
  selectSurfaceColor(color: string) {
    this.selectedSurfaceColor = color
    this.applySurfaceConfiguration()
    // Clear preset theme when surface configuration is selected
    this.selectedPreset = 'custom'
    this.settingsService.setTheme('custom')
  }

  // 生成标准 token 名称的色阶对象
  private getSurfacePaletteByToken(token: string) {
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    const palette: Record<number, string> = {}
    for (const step of steps) {
      palette[step] = `{${token}.${step}}`
    }
    return palette
  }

  private applySurfaceConfiguration() {
    const selectedColor = this.surfaceColors.find((c) => c.value === this.selectedSurfaceColor)
    if (selectedColor) {
      const paletteByToken = this.getSurfacePaletteByToken(selectedColor.value)
      updateSurfacePalette(paletteByToken)
    }
    this.settingsService.setSurfaceConfig({
      color: this.selectedSurfaceColor
    })
  }

  onSettings() {}
  onFullscreen() {
    // Check if fullscreen is supported
    if (!document.fullscreenEnabled) {
      console.warn('Fullscreen is not supported in this browser')
      return
    }

    // Toggle fullscreen mode
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      // Exit fullscreen
      document.exitFullscreen().catch((err) => {
        console.error('Error attempting to exit fullscreen:', err)
      })
    }
  }
  onLang() {}
  onNotify() {}
  onUserMenu() {}

  toggleDarkMode(): void {
    this.settingsService.toggleDarkMode()
    this.darkModeToggle.emit(this.settingsService.settings().darkMode)
  }

  ngOnInit(): void {
    this.userMenuItems = [
      { label: '设置', icon: 'pi pi-cog', command: () => this.onSettings() },
      { separator: true },
      { label: '退出登录', icon: 'pi pi-power-off', command: () => this.logout() }
    ]

    // Initialize font size
    this.selectedFontSize = this.settingsService.getFontSize()

    // Initialize dark mode
    this.selectedDarkMode = this.settingsService.settings().darkMode

    // Initialize theme settings
    const currentTheme = this.settingsService.settings().theme || 'lara'
    this.selectedPreset = currentTheme

    // Initialize surface configuration from settings
    const surfaceConfig = this.settingsService.getSurfaceConfig()
    this.selectedSurfaceColor = surfaceConfig.color

    // Apply theme based on current setting
    if (['lara', 'aura', 'nora', 'material'].includes(currentTheme)) {
      // Apply preset theme
      const selectedTheme = this.presetThemes[currentTheme as keyof typeof this.presetThemes]
      if (selectedTheme) {
        usePreset(selectedTheme)
      }
    } else {
      // Apply surface configuration for custom theme
      this.applySurfaceConfiguration()
    }
  }

  logout(): void {
    this.confirmationService.confirm({
      message: '您确定要退出登录吗？',
      header: '退出登录',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '确定',
      rejectLabel: '取消',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.authService.logout()
        this.router.navigate(['/backstage/login'])
      }
    })
  }

  onFontSizeChange(event: any) {
    this.selectedFontSize = event.value
    this.settingsService.setFontSize(this.selectedFontSize)
  }

  onDarkModeChange(event: any) {
    this.selectedDarkMode = event.value
    this.settingsService.setDarkMode(this.selectedDarkMode)
  }

  onPresetChange(event: any) {
    this.selectedPreset = event.value

    if (this.selectedPreset === 'custom') {
      // Apply surface configuration for custom theme
      this.settingsService.setTheme('custom')
      this.applySurfaceConfiguration()
    } else {
      // Apply preset theme
      const selectedTheme = this.presetThemes[this.selectedPreset as keyof typeof this.presetThemes]
      if (selectedTheme) {
        usePreset(selectedTheme)
        this.settingsService.setTheme(this.selectedPreset)
        // Clear surface configuration when preset theme is selected
        this.selectedSurfaceColor = 'zinc' // Reset to default
        this.settingsService.setSurfaceConfig({ color: 'zinc' })
      }
    }
  }

  // Method to reapply surface configuration
  reapplySurfaceConfiguration() {
    this.applySurfaceConfiguration()
  }
}
