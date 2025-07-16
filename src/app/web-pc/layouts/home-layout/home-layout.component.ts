import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MenubarModule } from 'primeng/menubar'
import { ButtonModule } from 'primeng/button'
import { AvatarModule } from 'primeng/avatar'
import { BadgeModule } from 'primeng/badge'
import { InputTextModule } from 'primeng/inputtext'
import { RippleModule } from 'primeng/ripple'
import { TooltipModule } from 'primeng/tooltip'
import { MenuItem } from 'primeng/api'
import { SettingsService } from '../../services/settings.service'
import { DrawerModule } from 'primeng/drawer'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'cs-home-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    InputTextModule,
    RippleModule,
    TooltipModule,
    DrawerModule,
    SelectButtonModule,
    FormsModule
  ],
  template: `
    <div class="home-layout">
      <header class="header">
        <p-menubar [model]="menuItems" class="custom-menubar">
          <ng-template pTemplate="start">
            <a routerLink="/" class="logo-link">
              <span class="logo">Crispy</span>
            </a>
          </ng-template>
          <ng-template pTemplate="end">
            <div class="header-actions">
              <p-button
                [icon]="settingsService.settings().darkMode ? 'pi pi-sun' : 'pi pi-moon'"
                [text]="true"
                [rounded]="true"
                severity="secondary"
                size="small"
                (click)="toggleDarkMode()"
              ></p-button>
              <p-button
                icon="pi pi-palette"
                [text]="true"
                [rounded]="true"
                severity="secondary"
                size="small"
                (click)="drawerVisible = true"
              ></p-button>
            </div>
          </ng-template>
        </p-menubar>
      </header>
      <p-drawer
        [(visible)]="drawerVisible"
        position="right"
        [modal]="true"
        [dismissible]="true"
        header="Theme Settings"
        [style]="{ width: '700px', 'max-width': '50%' }"
      >
        <div class="theme-settings">
          <!-- Dark Mode Section -->
          <div class="setting-section">
            <div class="label">Dark Mode</div>
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
            <div class="label">Preset Theme</div>
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
            <div class="label">Surface Config</div>
            <div class="surface-color-options-row">
              <div
                *ngFor="let surfaceColor of surfaceColors"
                class="surface-color-option"
                [class.selected]="surfaceColor.value === selectedSurfaceColor"
                (click)="onSelectSurfaceColor(surfaceColor.value)"
                [title]="surfaceColor.name"
              >
                <div
                  class="surface-color-preview"
                  [ngStyle]="{ background: surfaceColor.preview }"
                ></div>
                <span class="surface-color-name">{{ surfaceColor.name }}</span>
                <i *ngIf="surfaceColor.value === selectedSurfaceColor" class="pi pi-check"></i>
              </div>
            </div>
          </div>
          <!-- Font Size Section -->
          <div class="setting-section">
            <div class="label">Font Size</div>
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
                    (click)="onSelectPrimary(color)"
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
      <main class="main-content">
        <div class="content-container">
          <div class="flex flex-col gap-8 min-h-[80vh] w-full">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-bottom">
            <div class="copyright">
              <i class="pi pi-copyright"></i>
              {{ currentYear }} Crispy. 保留所有权利。
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .home-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--p-content-background) !important;
      }
      .header {
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: none;
        background: var(--p-surface-card);
        border-bottom: 1px solid var(--p-content-border-color);
      }
      .custom-menubar {
        border: none;
        border-radius: 0;
        background: transparent;
        padding: 0.5rem 1rem;
      }
      .logo-link .logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--p-primary-color);
        text-shadow: none;
      }
      .main-content {
        flex: 1;
        padding: 2rem 0;
        background: transparent;
      }
      .content-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .footer {
        background: var(--p-surface-section);
        padding: 2rem 1rem 1rem;
        margin-top: auto;
        border-top: 1px solid var(--p-content-border-color);
      }
      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
      }
      .footer-bottom {
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid var(--p-content-border-color);
      }
      .copyright {
        color: var(--p-text-color-secondary);
        font-size: 1.05rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        text-shadow: none;
      }
      @media (max-width: 768px) {
        .main-content {
          padding: 1rem 0;
        }
      }
    `,
    // Theme settings drawer styles migrated from backstage header
    `
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
export class HomeLayoutComponent implements OnInit {
  currentYear = new Date().getFullYear()
  menuItems: MenuItem[] = []

  // Theme drawer state
  drawerVisible = false

  // Inject SettingsService
  settingsService = inject(SettingsService)

  // Surface configuration
  selectedSurfaceColor = 'zinc'
  surfaceColors = [
    { name: 'Zinc (White Gray)', value: 'zinc', preview: '#fafafa' },
    { name: 'Gray', value: 'gray', preview: '#6b7280' },
    { name: 'Slate', value: 'slate', preview: '#475569' },
    { name: 'Neutral', value: 'neutral', preview: '#171717' },
    { name: 'Stone', value: 'stone', preview: '#f5f5f4' },
    { name: 'Amber', value: 'amber', preview: '#fffbeb' },
    { name: 'Red', value: 'red', preview: '#ef4444' },
    { name: 'Orange', value: 'orange', preview: '#f97316' },
    { name: 'Yellow', value: 'yellow', preview: '#eab308' },
    { name: 'Lime', value: 'lime', preview: '#84cc16' },
    { name: 'Green', value: 'green', preview: '#22c55e' },
    { name: 'Emerald', value: 'emerald', preview: '#10b981' },
    { name: 'Teal', value: 'teal', preview: '#14b8a6' },
    { name: 'Cyan', value: 'cyan', preview: '#06b6d4' },
    { name: 'Sky', value: 'sky', preview: '#0ea5e9' },
    { name: 'Blue', value: 'blue', preview: '#3b82f6' },
    { name: 'Indigo', value: 'indigo', preview: '#6366f1' },
    { name: 'Violet', value: 'violet', preview: '#8b5cf6' },
    { name: 'Purple', value: 'purple', preview: '#a855f7' },
    { name: 'Fuchsia', value: 'fuchsia', preview: '#d946ef' },
    { name: 'Pink', value: 'pink', preview: '#ec4899' },
    { name: 'Rose', value: 'rose', preview: '#f43f5e' }
  ]

  // Font size options
  fontSizes = [
    { value: 12, label: 'XS (12px)' },
    { value: 14, label: 'S (14px)' },
    { value: 16, label: 'M (16px)' },
    { value: 18, label: 'L (18px)' },
    { value: 20, label: 'XL (20px)' }
  ]
  selectedFontSize: number = 16

  // Dark mode options
  darkModeOptions = [
    { value: false, label: 'Light' },
    { value: true, label: 'Dark' }
  ]
  selectedDarkMode: boolean = false

  // Preset theme options
  presetOptions = [
    { value: 'lara', label: 'Lara' },
    { value: 'aura', label: 'Aura' },
    { value: 'nora', label: 'Nora' },
    { value: 'material', label: 'Material' }
  ]
  selectedPreset: string = 'lara'

  // Primary color options
  // Generate all available color palettes using the palette method
  colorCategories = [
    {
      name: '基础色彩',
      colors: [
        { name: 'Green', palette: { 500: '#22c55e' } },
        { name: 'Blue', palette: { 500: '#3b82f6' } },
        { name: 'Purple', palette: { 500: '#a855f7' } },
        { name: 'Red', palette: { 500: '#f43f5e' } },
        { name: 'Orange', palette: { 500: '#f59e42' } },
        { name: 'Yellow', palette: { 500: '#eab308' } },
        { name: 'Pink', palette: { 500: '#ec4899' } },
        { name: 'Gray', palette: { 500: '#6b7280' } }
      ]
    },
    {
      name: 'Tailwind 标准色',
      colors: [
        { name: 'Red-500', palette: { 500: '#ef4444' } },
        { name: 'Orange-500', palette: { 500: '#f97316' } },
        { name: 'Amber-500', palette: { 500: '#f59e0b' } },
        { name: 'Yellow-500', palette: { 500: '#eab308' } },
        { name: 'Lime-500', palette: { 500: '#84cc16' } },
        { name: 'Green-500', palette: { 500: '#22c55e' } },
        { name: 'Emerald-500', palette: { 500: '#10b981' } },
        { name: 'Teal-500', palette: { 500: '#14b8a6' } },
        { name: 'Cyan-500', palette: { 500: '#06b6d4' } },
        { name: 'Sky-500', palette: { 500: '#0ea5e9' } },
        { name: 'Blue-500', palette: { 500: '#3b82f6' } },
        { name: 'Indigo-500', palette: { 500: '#6366f1' } },
        { name: 'Violet-500', palette: { 500: '#8b5cf6' } },
        { name: 'Purple-500', palette: { 500: '#a855f7' } },
        { name: 'Fuchsia-500', palette: { 500: '#d946ef' } },
        { name: 'Pink-500', palette: { 500: '#ec4899' } },
        { name: 'Rose-500', palette: { 500: '#f43f5e' } }
      ]
    },
    {
      name: '宝石色彩',
      colors: [
        { name: 'Ruby', palette: { 500: '#dc2626' } },
        { name: 'Sapphire', palette: { 500: '#2563eb' } },
        { name: 'Emerald', palette: { 500: '#059669' } },
        { name: 'Topaz', palette: { 500: '#d97706' } },
        { name: 'Amethyst', palette: { 500: '#7c3aed' } },
        { name: 'Garnet', palette: { 500: '#be123c' } },
        { name: 'Aquamarine', palette: { 500: '#0891b2' } },
        { name: 'Peridot', palette: { 500: '#65a30d' } },
        { name: 'Opal', palette: { 500: '#f0f9ff' } },
        { name: 'Jade', palette: { 500: '#047857' } },
        { name: 'Turquoise', palette: { 500: '#0d9488' } }
      ]
    },
    {
      name: '金属质感',
      colors: [
        { name: 'Gold', palette: { 500: '#ca8a04' } },
        { name: 'Silver', palette: { 500: '#6b7280' } },
        { name: 'Bronze', palette: { 500: '#92400e' } },
        { name: 'Copper', palette: { 500: '#b45309' } },
        { name: 'Platinum', palette: { 500: '#374151' } },
        { name: 'Titanium', palette: { 500: '#4b5563' } },
        { name: 'Steel', palette: { 500: '#6b7280' } },
        { name: 'Iron', palette: { 500: '#374151' } },
        { name: 'Carbon', palette: { 500: '#111827' } },
        { name: 'Obsidian', palette: { 500: '#030712' } }
      ]
    },
    {
      name: '自然色彩',
      colors: [
        { name: 'Ocean', palette: { 500: '#0891b2' } },
        { name: 'Forest', palette: { 500: '#059669' } },
        { name: 'Sunset', palette: { 500: '#ea580c' } },
        { name: 'Berry', palette: { 500: '#be185d' } },
        { name: 'Lavender', palette: { 500: '#7c3aed' } },
        { name: 'Mint', palette: { 500: '#059669' } },
        { name: 'Coral', palette: { 500: '#fb7185' } },
        { name: 'Salmon', palette: { 500: '#fda4af' } },
        { name: 'Peach', palette: { 500: '#fed7aa' } },
        { name: 'Cream', palette: { 500: '#fef3c7' } },
        { name: 'Ivory', palette: { 500: '#fefce8' } },
        { name: 'Beige', palette: { 500: '#f5f5dc' } },
        { name: 'Tan', palette: { 500: '#d2b48c' } },
        { name: 'Khaki', palette: { 500: '#c3b091' } },
        { name: 'Olive', palette: { 500: '#808000' } }
      ]
    },
    {
      name: '经典色彩',
      colors: [
        { name: 'Navy', palette: { 500: '#1e3a8a' } },
        { name: 'Maroon', palette: { 500: '#800000' } },
        { name: 'Burgundy', palette: { 500: '#800020' } },
        { name: 'Wine', palette: { 500: '#722f37' } },
        { name: 'Plum', palette: { 500: '#8b4513' } },
        { name: 'Eggplant', palette: { 500: '#614051' } },
        { name: 'Charcoal', palette: { 500: '#36454f' } },
        { name: 'Slate', palette: { 500: '#708090' } },
        { name: 'Smoke', palette: { 500: '#848884' } },
        { name: 'Ash', palette: { 500: '#b2beb5' } },
        { name: 'Fog', palette: { 500: '#d3d3d3' } },
        { name: 'Mist', palette: { 500: '#e6e6fa' } },
        { name: 'Frost', palette: { 500: '#f0f8ff' } },
        { name: 'Snow', palette: { 500: '#fffafa' } },
        { name: 'Pearl', palette: { 500: '#f9fafb' } },
        { name: 'Diamond', palette: { 500: '#ffffff' } }
      ]
    }
  ]

  // Flatten all colors for backward compatibility
  primaryColors = this.colorCategories.flatMap((category) => category.colors)

  get selectedPrimary() {
    const current = this.settingsService.getPrimaryColor()
    return (
      this.primaryColors.find((c) => c.palette[500].toLowerCase() === current.toLowerCase()) ||
      this.primaryColors[0]
    )
  }

  ngOnInit() {
    this.menuItems = [
      {
        label: '首页',
        icon: 'pi pi-home',
        routerLink: '/',
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: '关于',
        icon: 'pi pi-user',
        routerLink: '/about'
      },
      {
        label: '迁移',
        icon: 'pi pi-refresh',
        routerLink: '/migration'
      },
      {
        label: 'API 文档',
        icon: 'pi pi-book',
        routerLink: '/api-docs'
      },
      {
        label: '模版',
        icon: 'pi pi-code',
        routerLink: '/templates'
      },
      {
        label: '数据模型',
        icon: 'pi pi-database',
        routerLink: '/data-models'
      }
    ]
    // Initialize theme settings
    this.selectedFontSize = this.settingsService.getFontSize()
    this.selectedDarkMode = this.settingsService.settings().darkMode
    this.selectedPreset = this.settingsService.settings().theme || 'lara'
    this.selectedSurfaceColor = this.settingsService.getSurfaceConfig().color
  }

  toggleDarkMode(): void {
    this.settingsService.toggleDarkMode()
    this.selectedDarkMode = this.settingsService.settings().darkMode
  }
  onDarkModeChange(event: any) {
    this.selectedDarkMode = event.value
    this.settingsService.setDarkMode(this.selectedDarkMode)
  }
  onPresetChange(event: any) {
    this.selectedPreset = event.value
    this.settingsService.setPresetTheme(this.selectedPreset)
  }
  onSelectSurfaceColor(color: string) {
    this.selectedSurfaceColor = color
    this.settingsService.setSurfaceConfig({ color: color })
  }
  onFontSizeChange(event: any) {
    this.selectedFontSize = event.value
    this.settingsService.setFontSize(this.selectedFontSize)
  }
  onSelectPrimary(color: any) {
    this.settingsService.setPrimaryColor(color.palette[500])
  }
}
