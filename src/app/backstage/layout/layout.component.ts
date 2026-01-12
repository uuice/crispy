import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { filter } from 'rxjs/operators'
import { HeaderComponent } from './header.component'
import { SidebarComponent } from './sidebar.component'
import { FooterComponent } from './footer.component'
import { PageTabsComponent } from './page-tabs.component'
import { SettingsService } from '../services/settings.service'
import { AuthService } from '../services/auth.service'

interface TabItem {
  label: string
  routerLink: string
  icon?: string
  closable: boolean
}

interface MenuData {
  id: number
  title: string
  icon?: string
  condition?: string
  parent_id?: number
  children?: MenuData[]
}

@Component({
  selector: 'cs-backstage-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    PageTabsComponent
  ],
  template: `
    <div class="backstage-layout">
      <!-- 顶部 -->
      <div class="header-container">
        <cs-header [menuItems]="menuItems" (darkModeToggle)="onDarkModeToggle($event)"></cs-header>
      </div>

      <div class="main-container">
        <div
          class="sidebar-container"
          [class.collapsed]="settingsService.settings().sidebarCollapsed"
        >
          <!-- 侧边栏 -->
          <cs-sidebar
            [items]="sidebarItems"
            [collapsed]="settingsService.settings().sidebarCollapsed"
            (toggleSidebar)="toggleSidebar()"
          ></cs-sidebar>
        </div>

        <!-- 内容区 -->
        <main class="content" [class.collapsed]="settingsService.settings().sidebarCollapsed">
          <div class="page-tabs-container">
            <cs-page-tabs
              [tabs]="tabs"
              [activeIndex]="activeTabIndex"
              (tabChange)="onTabChange($event)"
              (closeTab)="closeTab($event)"
            ></cs-page-tabs>
          </div>
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- 底部 -->
      <div class="footer-container">
        <cs-footer
          [year]="currentYear"
          [class.footer-collapsed]="settingsService.settings().sidebarCollapsed"
        ></cs-footer>
      </div>
    </div>
  `,
  styles: [
    `
      .backstage-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        background-color: var(--p-content-background);
        color: var(--text-color);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .header-container {
        flex-shrink: 0;
        height: 60px;
        border-bottom: 1px solid var(--p-content-border-color);
      }

      .footer-container {
        flex-shrink: 0;
        height: 30px;
        border-top: 1px solid var(--p-content-border-color);
      }

      .main-container {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .sidebar-container {
        flex-shrink: 0;
        width: 220px;
        transition: width 0.3s ease;
      }

      .sidebar-container.collapsed {
        width: 60px;
      }

      .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }

      .page-tabs-container {
        flex-shrink: 0;
        height: auto;
        min-height: 50px;
      }

      .page-content {
        flex: 1;
        transition: all 0.3s;
        padding: 1rem;
        overflow-y: auto;
        height: 100%;
        background: var(--p-content-background);
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
    `
  ]
})
export class BackstageLayoutComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear()
  activeTabIndex = 0
  tabs: TabItem[] = []

  protected settingsService = inject(SettingsService)
  private authService = inject(AuthService)

  menuItems: MenuItem[] = [
    { label: '首页', icon: 'pi pi-home', routerLink: '/backstage/dashboard' },
    { label: '系统管理', icon: 'pi pi-cog', routerLink: '/backstage/settings' }
  ]

  sidebarItems: MenuItem[] = []

  constructor(private router: Router) {}

  ngOnInit() {
    // Load menu items from user info
    this.loadMenuItems()

    // Add default dashboard tab if no tabs exist
    if (this.tabs.length === 0) {
      this.tabs.push({
        label: '仪表盘',
        routerLink: '/backstage/dashboard',
        icon: 'pi pi-home',
        closable: false
      })
      this.activeTabIndex = 0
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.handleNavigation(event.urlAfterRedirects)
      })

    // Set overflow hidden for backstage pages
    document.body.style.overflow = 'hidden'
  }

  ngOnDestroy() {
    // Restore overflow when leaving backstage
    document.body.style.overflow = ''
  }

  /**
   * Load menu items from user authentication data
   */
  private loadMenuItems() {
    const menuData = this.authService.getMenu<MenuData[]>()
    if (menuData && menuData.length > 0) {
      this.sidebarItems = this.convertMenuDataToMenuItems(menuData || [])
    } else {
      // Fallback to default menu if no menu data available
      this.sidebarItems = this.getDefaultMenuItems()
    }
  }

  /**
   * Convert menu data from API to PrimeNG MenuItem format
   */
  private convertMenuDataToMenuItems(menuData: MenuData[]): MenuItem[] {
    return menuData.map((item) => ({
      label: item.title,
      icon: item.icon || this.getDefaultIcon(item.title),
      routerLink: item.condition || undefined,
      items: item.children ? this.convertMenuDataToMenuItems(item.children) : undefined
    }))
  }

  /**
   * Get default menu items as fallback
   */
  private getDefaultMenuItems(): MenuItem[] {
    return []
  }

  /**
   * Get default icon based on menu name
   */
  private getDefaultIcon(menuName: string): string {
    const iconMap: { [key: string]: string } = {}
    return iconMap[menuName] || 'pi pi-file'
  }

  toggleSidebar() {
    this.settingsService.toggleSidebarCollapsed()
  }

  onDarkModeToggle(enabled: boolean) {
    console.log('Dark mode toggled:', enabled)
  }

  handleNavigation(url: string) {
    const path = url.split('?')[0]
    const existingTab = this.tabs.find((tab) => tab.routerLink === path)

    if (existingTab) {
      this.activeTabIndex = this.tabs.indexOf(existingTab)
      return
    }

    const menuItem = this.findMenuItem(path, this.sidebarItems)

    if (menuItem) {
      this.tabs.push({
        label: menuItem.label || '',
        routerLink: path,
        icon: menuItem.icon || '',
        closable: true
      })
    } else {
      const pathParts = path.split('/')
      const lastPart = pathParts[pathParts.length - 1]
      const label = lastPart.charAt(0).toUpperCase() + lastPart.slice(1)
      const icon = this.getRouteIcon(lastPart)

      this.tabs.push({
        label: label,
        routerLink: path,
        icon: icon,
        closable: true
      })
    }

    this.activeTabIndex = this.tabs.length - 1
  }

  private findMenuItem(url: string, items: MenuItem[]): MenuItem | undefined {
    for (const item of items) {
      if (item.routerLink === url) {
        return item
      }
      if (item.items) {
        const found = this.findMenuItem(url, item.items)
        if (found) {
          return found
        }
      }
    }
    return undefined
  }

  private getRouteIcon(route: string): string {
    const iconMap: { [key: string]: string } = {
      dashboard: 'pi pi-home',
      posts: 'pi pi-file',
      categories: 'pi pi-tags',
      tags: 'pi pi-tag',
      comments: 'pi pi-comments',
      users: 'pi pi-users',
      settings: 'pi pi-cog',
      admins: 'pi pi-user',
      roles: 'pi pi-id-card',
      rules: 'pi pi-list',
      advertisements: 'pi pi-image',
      menus: 'pi pi-list',
      pages: 'pi pi-file-edit',
      'friend-links': 'pi pi-link',
      recruitment: 'pi pi-briefcase',
      configuration: 'pi pi-cog',
      system: 'pi pi-server',
      vacation: 'pi pi-calendar',
      'special-tags': 'pi pi-tag'
    }

    return iconMap[route] || 'pi pi-file'
  }

  onTabChange(event: number) {
    const tab = this.tabs[event]
    if (tab) {
      this.router.navigate([tab.routerLink])
    }
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1)
    if (this.tabs.length === 0) return
    this.activeTabIndex = Math.max(0, index - 1)
    this.router.navigate([this.tabs[this.activeTabIndex].routerLink])
  }
}
