import { Component, OnInit } from '@angular/core'
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
    TooltipModule
  ],
  template: `
    <div class="home-layout">
      <header class="header">
        <p-menubar [model]="menuItems" class="custom-menubar">
          <ng-template pTemplate="start">
            <a routerLink="/" class="logo-link">
              <span class="logo">🍪 Crispy</span>
            </a>
          </ng-template>
          <ng-template pTemplate="end">
            <div class="header-actions">
              <p-button
                icon="pi pi-search"
                [text]="true"
                [rounded]="true"
                severity="secondary"
                size="small"
                pTooltip="Search"
                tooltipPosition="bottom"
              >
              </p-button>
              <p-button
                icon="pi pi-moon"
                [text]="true"
                [rounded]="true"
                severity="secondary"
                size="small"
                pTooltip="Toggle Dark Mode"
                tooltipPosition="bottom"
              >
              </p-button>
            </div>
          </ng-template>
        </p-menubar>
      </header>

      <main class="main-content">
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>快速链接</h4>
            <div class="footer-links">
              <a href="/rss" target="_blank" rel="noopener noreferrer">
                <i class="pi pi-rss"></i> RSS 订阅
              </a>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                <i class="pi pi-sitemap"></i> 网站地图
              </a>
              <a routerLink="/disclaimer"> <i class="pi pi-info-circle"></i> 免责声明 </a>
            </div>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <div class="social-links">
              <p-button
                icon="pi pi-github"
                [text]="true"
                [rounded]="true"
                severity="secondary"
                size="small"
              >
              </p-button>
              <p-button
                icon="pi pi-twitter"
                [text]="true"
                [rounded]="true"
                severity="secondary"
                size="small"
              >
              </p-button>
              <p-button
                icon="pi pi-linkedin"
                [text]="true"
                [rounded]="true"
                severity="secondary"
                size="small"
              >
              </p-button>
            </div>
          </div>
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
        background: var(--p-surface-ground);
      }

      .header {
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: var(--p-shadow-2);
      }

      .custom-menubar {
        border: none;
        border-radius: 0;
        background: var(--p-surface-card);
        padding: 0.5rem 1rem;

        .logo-link {
          text-decoration: none;

          .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--p-primary-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
      }

      .main-content {
        flex: 1;
        padding: 2rem 0;

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
      }

      .footer {
        background: var(--p-surface-section);
        padding: 3rem 1rem 1rem;
        margin-top: auto;
        border-top: 1px solid var(--p-surface-border);

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;

          .footer-section {
            h4 {
              color: var(--p-text-color);
              margin-bottom: 1rem;
              font-size: 1.1rem;
              font-weight: 600;
            }

            .footer-links {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;

              a {
                color: var(--p-text-color-secondary);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: color 0.3s ease;

                &:hover {
                  color: var(--p-primary-color);
                }

                i {
                  font-size: 0.9rem;
                }
              }
            }

            .social-links {
              display: flex;
              gap: 0.5rem;
            }
          }

          .footer-bottom {
            grid-column: 1 / -1;
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid var(--p-surface-border);

            .copyright {
              color: var(--p-text-color-secondary);
              font-size: 0.9rem;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
            }
          }
        }
      }

      @media (max-width: 768px) {
        .main-content {
          padding: 1rem 0;
        }

        .footer {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;

            .footer-section {
              text-align: center;

              .footer-links {
                align-items: center;
              }

              .social-links {
                justify-content: center;
              }
            }
          }
        }
      }
    `
  ]
})
export class HomeLayoutComponent implements OnInit {
  currentYear = new Date().getFullYear()
  menuItems: MenuItem[] = []

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
        label: '归档',
        icon: 'pi pi-calendar',
        routerLink: '/archives'
      },
      {
        label: '分类',
        icon: 'pi pi-tags',
        routerLink: '/categories'
      },
      {
        label: '标签',
        icon: 'pi pi-tag',
        routerLink: '/tags'
      },
      {
        label: '链接',
        icon: 'pi pi-link',
        routerLink: '/links'
      },
      {
        label: '作者',
        icon: 'pi pi-id-card',
        routerLink: '/author'
      }
    ]
  }
}
