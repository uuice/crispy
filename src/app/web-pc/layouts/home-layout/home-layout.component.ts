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
import { ScrollTopModule } from 'primeng/scrolltop'

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
    FormsModule,
    ScrollTopModule
  ],
  template: `
    <div class="home-layout min-h-screen flex flex-col">
      <!-- Top Navigation Bar -->
      <header class="header w-full sticky top-0 z-50">
        <nav class="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="font-bold text-2xl blog-icon-blue tracking-tight">Fuwari</a>
            <!-- Desktop Menu -->
            <ul class="hidden md:flex gap-6 text-base font-medium">
              <li *ngFor="let item of menuItems">
                <a
                  *ngIf="!item.url"
                  [routerLink]="item.routerLink"
                  routerLinkActive="active"
                  class="hover:opacity-80 transition"
                  [routerLinkActiveOptions]="item.routerLinkActiveOptions || {}"
                >
                  {{ item.label }}
                </a>
                <a
                  *ngIf="item.url"
                  [href]="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:opacity-80 transition"
                >
                  {{ item.label }}
                </a>
              </li>
            </ul>
            <!-- Mobile Menu Button -->
            <button
              class="md:hidden ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
              (click)="mobileMenuVisible = true"
              aria-label="Open menu"
            >
              <i class="pi pi-bars text-xl"></i>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <p-button
              [icon]="settingsService.settings().darkMode ? 'pi pi-sun' : 'pi pi-moon'"
              [text]="true"
              [rounded]="true"
              severity="secondary"
              size="small"
              (click)="toggleDarkMode()"
              class="mr-1"
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
        </nav>
      </header>
      <!-- Mobile Menu Drawer -->
      <p-drawer
        [(visible)]="mobileMenuVisible"
        position="left"
        [modal]="true"
        [dismissible]="true"
        header="Menu"
        [style]="{
          width: '80vw',
          maxWidth: '320px',
          background: 'var(--p-content-background)',
          color: 'var(--p-text-color)'
        }"
      >
        <ul class="flex flex-col gap-4 mt-4">
          <li *ngFor="let item of menuItems">
            <a
              *ngIf="!item.url"
              [routerLink]="item.routerLink"
              (click)="mobileMenuVisible = false"
              class="block py-2 px-3 rounded hover:opacity-80 text-base font-medium"
              [routerLinkActive]="'active'"
              [routerLinkActiveOptions]="item.routerLinkActiveOptions || {}"
            >
              {{ item.label }}
            </a>
            <a
              *ngIf="item.url"
              [href]="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="block py-2 px-3 rounded hover:opacity-80 text-base font-medium"
              (click)="mobileMenuVisible = false"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </p-drawer>
      <!-- Main Content: Sidebar + Content -->
      <!-- banner -->
      <div class="w-full max-w-6xl mx-auto">
        <router-outlet name="banner"></router-outlet>
      </div>
      <div
        class="flex-1 w-full max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-8 px-4 py-8"
      >
        <!-- Sidebar (Desktop) -->
        <aside class="lg:block w-full lg:w-80 flex-shrink-0">
          <!-- Author Card -->
          <div class="bg-content rounded-xl shadow p-6 mb-8 flex flex-col items-center">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Author"
              class="w-20 h-20 rounded-full mb-3 border-4 border-blue-200 dark:border-blue-900 shadow"
            />
            <h2 class="text-lg font-semibold mb-1">Lorem Ipsum</h2>
            <p class="text-center text-sm mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div class="flex gap-3 mt-2">
              <a href="#" class="blog-icon-blue hover:opacity-80" title="GitHub"
                ><i class="pi pi-github text-xl"></i
              ></a>
              <a href="#" class="blog-icon-pink hover:opacity-80" title="Twitter"
                ><i class="pi pi-twitter text-xl"></i
              ></a>
            </div>
          </div>
          <!-- Categories Card -->
          <div class="rounded-xl shadow p-6 mb-8">
            <h3 class="text-base font-semibold mb-3">Categories</h3>
            <div class="flex flex-wrap gap-3">
              <span class="blog-tag blog-tag-blue text-sm">Examples (4)</span>
              <span class="blog-tag blog-tag-green text-sm">Guides (1)</span>
            </div>
          </div>
          <!-- Tags Card -->
          <div class="rounded-xl shadow p-6">
            <h3 class="text-base font-semibold mb-3">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span class="blog-tag blog-tag-gray text-xs">Blogging</span>
              <span class="blog-tag blog-tag-purple text-xs">Customization</span>
              <span class="blog-tag blog-tag-pink text-xs">Demo</span>
              <span class="blog-tag blog-tag-blue text-xs">Example</span>
              <span class="blog-tag blog-tag-green text-xs">Fuwari</span>
              <span class="blog-tag blog-tag-yellow text-xs">Markdown</span>
              <span class="blog-tag blog-tag-indigo text-xs">Video</span>
            </div>
          </div>
        </aside>
        <!-- Main Content Area: always visible on all screens -->
        <main class="flex-1 min-w-0">
          <router-outlet></router-outlet>
        </main>
      </div>
      <!-- Theme Settings Drawer -->
      <p-drawer
        [(visible)]="drawerVisible"
        position="right"
        [modal]="true"
        [dismissible]="true"
        header="Theme Settings"
        [style]="{
          width: '700px',
          'max-width': '80%',
          background: 'var(--p-content-background)',
          color: 'var(--p-text-color)'
        }"
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
      <!-- Footer -->
      <footer class="footer w-full py-8 mt-auto">
        <div
          class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4"
        >
          <div class="text-sm text-center md:text-left">
            © {{ currentYear }} UUICE. All Rights Reserved. <span class="mx-2">/</span>
            <a href="#" class="hover:underline">RSS</a>
            <span class="mx-2">/</span>
            <a href="#" class="hover:underline">Sitemap</a>
          </div>
          <div class="text-xs text-center md:text-right">
            Powered by <span class="font-semibold">UUICE</span> &
            <span class="font-semibold">Crispy</span>
            <span class="mx-2">|</span>
            <a href="https://github.com/uuice/crispy" class="hover:underline">GitHub</a>
          </div>
        </div>
      </footer>
      <p-scrollTop [threshold]="200" icon="pi pi-arrow-up" styleClass="global-scrolltop" />
    </div>
  `,
  styles: [
    // PrimeNG style: unify background, card, section, spacing, and tag styles
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
        background: var(--p-content-background, #fff);
        border-bottom: 1px solid var(--p-content-border-color, #e5e7eb);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
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
      }
      .footer {
        background: var(--p-content-background, #f4f4f5);
        padding: 2rem 1rem 1rem;
        margin-top: auto;
        border-top: 1px solid var(--p-content-border-color, #e5e7eb);
      }
      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
      }
      .footer-bottom {
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid var(--p-content-border-color, #e5e7eb);
      }
      .copyright {
        color: var(--text-color-secondary, #6b7280);
        font-size: 1.05rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
      .blog-card,
      .p-card {
        background: var(--p-content-background, #fff);
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: none;
      }
      .blog-banner {
        position: relative;
        width: 100%;
        border-radius: 1.25rem;
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
        background: var(--p-content-background, #fff);
      }
      .blog-banner-img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 1.25rem 1.25rem 0 0;
      }
      .blog-banner-content {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 2rem 2.5rem 1.5rem 2.5rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0.18) 100%);
        color: #fff;
      }
      .blog-title {
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--primary-color, #2196f3);
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      .blog-section {
        background: var(--p-content-background, #fff);
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        padding: 2rem 2.5rem;
        margin-bottom: 2rem;
      }
      .blog-prose {
        color: var(--text-color, #374151);
        font-size: 1.1rem;
        line-height: 1.8;
      }
      .blog-tag {
        display: inline-block;
        padding: 0.18em 0.8em;
        border-radius: 999px;
        font-size: 0.95em;
        font-weight: 500;
        background: var(--p-content-background, #f4f4f5);
        color: var(--primary-color, #2196f3);
        margin-right: 0.5em;
        margin-bottom: 0.3em;
      }
      .blog-tag-blue {
        color: #2196f3;
        background: #e3f2fd;
      }
      .blog-tag-green {
        color: #43d572;
        background: #e6f9ed;
      }
      .blog-tag-yellow {
        color: #fbc02d;
        background: #fff9e1;
      }
      .blog-tag-pink {
        color: #ec4899;
        background: #fce7f3;
      }
      .blog-tag-purple {
        color: #a855f7;
        background: #ede9fe;
      }
      .blog-tag-gray {
        color: #6b7280;
        background: #f3f4f6;
      }
      .blog-tag-indigo {
        color: #6366f1;
        background: #e0e7ff;
      }
      .blog-icon-blue {
        color: #2196f3;
      }
      .blog-icon-green {
        color: #43d572;
      }
      .blog-icon-yellow {
        color: #fbc02d;
      }
      .blog-icon-pink {
        color: #ec4899;
      }
      .blog-icon-purple {
        color: #a855f7;
      }
      .blog-icon-gray {
        color: #6b7280;
      }
      .blog-icon-indigo {
        color: #6366f1;
      }
      .p-button {
        border-radius: 999px;
        font-weight: 500;
      }
      .p-avatar {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      .p-tabview .p-tabview-nav {
        border-radius: 1rem 1rem 0 0;
        background: var(--p-content-background, #fff);
      }
      .p-tabview .p-tabview-panels {
        border-radius: 0 0 1rem 1rem;
        background: var(--p-content-background, #fff);
      }
      .p-card {
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: none;
      }
      .p-card .p-card-body {
        padding: 1.5rem;
      }
      .p-card .p-card-title {
        font-size: 1.25rem;
        font-weight: 600;
      }
      .p-card .p-card-content {
        font-size: 1.05rem;
      }
      @media (max-width: 768px) {
        .main-content,
        .blog-section {
          padding: 1rem 0.5rem;
        }
        .blog-banner-content {
          padding: 1.2rem 1rem 1rem 1rem;
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
    `,
    // New styles for ScrollTopModule
    `
      :host ::ng-deep .global-scrolltop {
        z-index: 9999;
        right: 32px;
        bottom: 48px;
      }
    `,
    // Custom styles for inline styles
    `
      .bg-content {
        background: var(--p-content-background) !important;
      }
      .text-main {
        color: var(--p-text-color) !important;
      }
      .text-muted {
        color: var(--p-text-muted-color) !important;
      }
      .border-content {
        border-color: var(--p-content-border-color) !important;
      }
      .bg-hover {
        background: var(--p-content-hover-background) !important;
      }
      .border-b-content {
        border-bottom: 1px solid var(--p-content-border-color) !important;
      }
      .border-t-content {
        border-top: 1px solid var(--p-content-border-color) !important;
      }
      .rounded-xl {
        border-radius: 1rem !important;
      }
      .shadow {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
      }
      .font-semibold {
        font-weight: 600 !important;
      }
      .font-bold {
        font-weight: 700 !important;
      }
      .text-xs {
        font-size: 0.85rem !important;
      }
      .text-base {
        font-size: 1rem !important;
      }
      .text-lg {
        font-size: 1.25rem !important;
      }
      .text-2xl {
        font-size: 2rem !important;
      }
      .text-3xl {
        font-size: 2.5rem !important;
      }
      .p-card {
        background: var(--p-content-background) !important;
        color: var(--p-text-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
      }
      .blog-card {
        background: var(--p-content-background) !important;
        color: var(--p-text-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
      }
      .blog-banner-content {
        color: var(--p-text-color) !important;
      }
      .footer {
        background: var(--p-content-background) !important;
        color: var(--p-text-muted-color) !important;
        border-top: 1px solid var(--p-content-border-color) !important;
      }
      .footer a {
        color: var(--p-text-color) !important;
      }
      .label {
        color: var(--p-text-color) !important;
      }
      .surface-color-option {
        color: var(--p-text-color) !important;
      }
      .color-dot {
        border-color: var(--p-content-border-color) !important;
      }
    `
  ]
})
export class HomeLayoutComponent implements OnInit {
  currentYear = new Date().getFullYear()
  menuItems: MenuItem[] = []

  // Theme drawer state
  drawerVisible = false
  mobileMenuVisible = false

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

  // Tag color class list for blog tags
  tagClassList = [
    'blog-tag-blue',
    'blog-tag-green',
    'blog-tag-red',
    'blog-tag-yellow',
    'blog-tag-purple',
    'blog-tag-orange',
    'blog-tag-pink',
    'blog-tag-gray',
    'blog-tag-indigo'
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
        label: '归档',
        icon: 'pi pi-archive',
        routerLink: '/archives'
      },
      {
        label: '友情链接',
        icon: 'pi pi-link',
        routerLink: '/links'
      },
      {
        label: '分类',
        icon: 'pi pi-folder',
        routerLink: '/categories'
      },
      {
        label: '标签',
        icon: 'pi pi-tag',
        routerLink: '/tags'
      },
      {
        label: '页面',
        icon: 'pi pi-file',
        routerLink: '/pages'
      },
      {
        label: '每日一库',
        icon: 'pi pi-book',
        routerLink: '/daily-lib'
      },
      {
        label: '关于',
        icon: 'pi pi-info-circle',
        routerLink: '/about'
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
