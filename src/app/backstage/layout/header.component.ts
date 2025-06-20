import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { AvatarModule } from 'primeng/avatar'
import { MenuItem, ConfirmationService } from 'primeng/api'
import { NgClass } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { SettingsService } from '../services/settings.service'
import { DrawerModule } from 'primeng/drawer'
import { usePreset, updatePrimaryPalette, palette } from '@primeng/themes'
import { MenuModule } from 'primeng/menu'
import { AuthService } from '../services/auth.service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'

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
    ConfirmDialogModule
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
      [style]="{ width: '350px' }"
    >
      <div class="theme-settings">
        <!-- Font Size Section -->
        <div class="setting-section">
          <div class="label">字体大小</div>
          <div class="font-size-options">
            @for (size of fontSizes; track size.value) {
              <div
                class="font-size-option"
                [class.selected]="size.value === selectedFontSize"
                (click)="selectFontSize(size.value)"
                [title]="size.label"
              >
                <span class="font-size-text" [style.font-size.px]="size.value">{{
                  size.label
                }}</span>
                @if (size.value === selectedFontSize) {
                  <i class="pi pi-check"></i>
                }
              </div>
            }
          </div>
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
        padding: 24px 16px 16px 16px;
      }

      .setting-section {
        margin-bottom: 32px;
      }

      .color-section {
        margin-bottom: 24px;
      }

      .label {
        font-weight: bold;
        margin: 18px 0 8px 0;
        font-size: 1.1rem;
        color: var(--p-text-color);
      }

      .font-size-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;
      }

      .font-size-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border: 2px solid var(--p-content-border-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--p-content-background);
      }

      .font-size-option:hover {
        border-color: var(--p-primary-color);
        background: var(--p-hover-color);
      }

      .font-size-option.selected {
        border-color: var(--p-primary-color);
        background: var(--p-primary-color);
        color: white;
      }

      .font-size-text {
        font-weight: 500;
      }

      .font-size-option i.pi {
        font-size: 1rem;
        font-weight: bold;
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

  // Font size options from 12px to 20px (5 levels)
  fontSizes = [
    { value: 12, label: '极小 (12px)' },
    { value: 14, label: '小 (14px)' },
    { value: 16, label: '标准 (16px)' },
    { value: 18, label: '大 (18px)' },
    { value: 20, label: '极大 (20px)' }
  ]

  get selectedFontSize(): number {
    return this.settingsService.getFontSize()
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
}
