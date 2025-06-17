import { Component, Input, Output, EventEmitter, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { AvatarModule } from 'primeng/avatar'
import { MenuItem } from 'primeng/api'
import { NgClass } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SettingsService } from '../services/settings.service'

@Component({
  selector: 'cs-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, NgClass, RouterModule],
  template: `
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
            icon="pi pi-user"
            [rounded]="true"
            [text]="true"
            class="header-btn"
            title="用户菜单"
          ></p-button>
          <p-button
            icon="pi pi-cog"
            [rounded]="true"
            [text]="true"
            class="header-btn"
            (click)="onSettings()"
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
          <p-button icon="pi pi-bell" class="p-button-text header-btn" (click)="onNotify()">
            @if (hasNotification) {
              <span class="dot"></span>
            }
          </p-button>
          <p-avatar
            image="/assets/avatar.png"
            shape="circle"
            size="large"
            class="header-avatar"
            (click)="onUserMenu()"
          ></p-avatar>
        </div>
      </div>
    </header>
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
    `
  ]
})
export class HeaderComponent {
  @Input() menuItems: MenuItem[] = []
  @Output() sidebarToggle = new EventEmitter<void>()
  @Output() darkModeToggle = new EventEmitter<boolean>()
  hasNotification = true

  protected settingsService = inject(SettingsService)

  onSettings() {}
  onFullscreen() {}
  onLang() {}
  onNotify() {}
  onUserMenu() {}

  toggleDarkMode(): void {
    this.settingsService.toggleDarkMode()
    this.darkModeToggle.emit(this.settingsService.settings().darkMode)
  }
}
