import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router, NavigationEnd } from '@angular/router'
import { MenubarModule } from 'primeng/menubar'
import { SidebarModule } from 'primeng/sidebar'
import { ButtonModule } from 'primeng/button'
import { TabViewModule } from 'primeng/tabview'
import { MenuItem } from 'primeng/api'
import { filter } from 'rxjs/operators'

interface TabItem {
  label: string
  routerLink: string
  icon?: string
  closable: boolean
}

@Component({
  selector: 'cs-backstage-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, SidebarModule, ButtonModule, TabViewModule],
  template: `
    <div class="backstage-layout">
      <!-- Header -->
      <header class="header">
        <p-menubar [model]="menuItems" [style]="{ 'border-radius': '0' }" class="border-none">
          <ng-template pTemplate="start">
            <span class="logo">Crispy Backstage</span>
          </ng-template>
          <ng-template pTemplate="end">
            <button
              pButton
              icon="pi pi-user"
              class="p-button-text"
              (click)="toggleUserMenu()"
            ></button>
          </ng-template>
        </p-menubar>
      </header>

      <!-- Main Content -->
      <div class="main-container">
        <!-- Sidebar -->
        <aside class="sidebar" [class.sidebar-collapsed]="isSidebarCollapsed">
          <div class="sidebar-header">
            <button
              pButton
              icon="pi pi-bars"
              class="p-button-text"
              (click)="toggleSidebar()"
            ></button>
          </div>
          <nav class="sidebar-menu">
            <ul>
              <li *ngFor="let item of sidebarItems" [class.active]="isActive(item.routerLink)">
                <a [routerLink]="item.routerLink" routerLinkActive="active">
                  <i [class]="item.icon"></i>
                  <span *ngIf="!isSidebarCollapsed">{{ item.label }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Content Area -->
        <main class="content">
          <!-- Tabs -->
          <div class="tabs-container" *ngIf="tabs.length > 0">
            <p-tabView (onChange)="onTabChange($event)" [activeIndex]="activeTabIndex">
              <p-tabPanel
                *ngFor="let tab of tabs; let i = index"
                [header]="tab.label"
                [closable]="tab.closable"
              >
                <ng-template pTemplate="header">
                  <span>
                    <i [class]="tab.icon" *ngIf="tab.icon"></i>
                    {{ tab.label }}
                  </span>
                </ng-template>
              </p-tabPanel>
            </p-tabView>
          </div>

          <!-- Page Content -->
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <span>&copy; {{ currentYear }} Crispy Backstage. All rights reserved.</span>
          <span class="version">Version 1.0.0</span>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .backstage-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: #f8f9fa;
      }

      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

        .logo {
          font-size: 1.2rem;
          font-weight: 600;
          color: #495057;
          margin-right: 2rem;
        }
      }

      .main-container {
        display: flex;
        margin-top: 60px;
        flex: 1;
      }

      .sidebar {
        position: fixed;
        left: 0;
        top: 60px;
        bottom: 0;
        width: 250px;
        background: #fff;
        border-right: 1px solid #dee2e6;
        transition: all 0.3s ease;
        z-index: 900;

        &.sidebar-collapsed {
          width: 60px;

          .sidebar-menu {
            span {
              display: none;
            }
          }
        }

        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }

        .sidebar-menu {
          padding: 1rem 0;

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              a {
                display: flex;
                align-items: center;
                padding: 0.75rem 1rem;
                color: #495057;
                text-decoration: none;
                transition: all 0.3s ease;

                i {
                  margin-right: 0.75rem;
                  font-size: 1.1rem;
                }

                &:hover {
                  background: #f8f9fa;
                  color: #007bff;
                }

                &.active {
                  background: #e9ecef;
                  color: #007bff;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }

      .content {
        flex: 1;
        margin-left: 250px;
        transition: all 0.3s ease;
        padding: 1rem;

        .tabs-container {
          background: #fff;
          border-radius: 6px;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

          ::ng-deep {
            .p-tabview-nav {
              border: none;
              background: #f8f9fa;
            }

            .p-tabview-nav-link {
              padding: 0.75rem 1rem;
            }
          }
        }

        .page-content {
          background: #fff;
          border-radius: 6px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      }

      .footer {
        background: #fff;
        border-top: 1px solid #dee2e6;
        padding: 1rem;
        margin-left: 250px;
        transition: all 0.3s ease;

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          color: #6c757d;
          font-size: 0.9rem;

          .version {
            color: #adb5bd;
          }
        }
      }

      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%);

          &.sidebar-collapsed {
            transform: translateX(0);
          }
        }

        .content {
          margin-left: 0;
        }

        .footer {
          margin-left: 0;
        }
      }
    `
  ]
})
export class BackstageLayoutComponent implements OnInit {
  currentYear = new Date().getFullYear()
  isSidebarCollapsed = false
  activeTabIndex = 0
  tabs: TabItem[] = []

  menuItems: MenuItem[] = [
    {
      label: 'File',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'Document', icon: 'pi pi-fw pi-file' },
            { label: 'Image', icon: 'pi pi-fw pi-image' }
          ]
        },
        { label: 'Open', icon: 'pi pi-fw pi-folder-open' },
        { label: 'Save', icon: 'pi pi-fw pi-save' }
      ]
    },
    {
      label: 'Edit',
      icon: 'pi pi-fw pi-pencil',
      items: [
        { label: 'Undo', icon: 'pi pi-fw pi-undo' },
        { label: 'Redo', icon: 'pi pi-fw pi-redo' }
      ]
    },
    {
      label: 'View',
      icon: 'pi pi-fw pi-eye',
      items: [
        { label: 'Full Screen', icon: 'pi pi-fw pi-window-maximize' },
        { label: 'Settings', icon: 'pi pi-fw pi-cog' }
      ]
    }
  ]

  sidebarItems = [
    { label: 'Dashboard', routerLink: '/backstage', icon: 'pi pi-fw pi-home' },
    { label: 'Posts', routerLink: '/backstage/posts', icon: 'pi pi-fw pi-file' },
    { label: 'Categories', routerLink: '/backstage/categories', icon: 'pi pi-fw pi-tags' },
    { label: 'Tags', routerLink: '/backstage/tags', icon: 'pi pi-fw pi-tag' },
    { label: 'Comments', routerLink: '/backstage/comments', icon: 'pi pi-fw pi-comments' },
    { label: 'Users', routerLink: '/backstage/users', icon: 'pi pi-fw pi-users' },
    { label: 'Settings', routerLink: '/backstage/settings', icon: 'pi pi-fw pi-cog' }
  ]

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to router events to handle tab management
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.handleNavigation(event.urlAfterRedirects)
      })
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed
  }

  toggleUserMenu() {
    // Implement user menu toggle logic
  }

  isActive(routerLink: string): boolean {
    return this.router.isActive(routerLink, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })
  }

  handleNavigation(url: string) {
    const path = url.split('?')[0]
    const existingTab = this.tabs.find((tab) => tab.routerLink === path)

    if (!existingTab) {
      const menuItem = this.sidebarItems.find((item) => item.routerLink === path)
      if (menuItem) {
        this.tabs.push({
          label: menuItem.label,
          routerLink: path,
          icon: menuItem.icon,
          closable: true
        })
        this.activeTabIndex = this.tabs.length - 1
      }
    } else {
      this.activeTabIndex = this.tabs.indexOf(existingTab)
    }
  }

  onTabChange(event: any) {
    const tab = this.tabs[event.index]
    if (tab) {
      this.router.navigate([tab.routerLink])
    }
  }
}
