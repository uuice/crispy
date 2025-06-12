import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'cs-home-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-layout">
      <header class="header">
        <nav class="nav">
          <a routerLink="/" class="logo">Crispy</a>
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
              >Home</a
            >
            <a routerLink="/about" routerLinkActive="active">About</a>
            <a routerLink="/archives" routerLinkActive="active">Archives</a>
            <a routerLink="/categories" routerLinkActive="active">Categories</a>
            <a routerLink="/tags" routerLinkActive="active">Tags</a>
            <a routerLink="/links" routerLinkActive="active">Links</a>
            <a routerLink="/author" routerLinkActive="active">Author</a>
            <a routerLink="/disclaimer" routerLinkActive="active">Disclaimer</a>
          </div>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <div class="footer-content">
          <div class="footer-links">
            <a href="/rss" target="_blank" rel="noopener noreferrer">RSS</a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
            <a routerLink="/disclaimer">Disclaimer</a>
          </div>
          <div class="copyright">© {{ currentYear }} Crispy. All rights reserved.</div>
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
        background: #fafafa;
      }

      .header {
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 1rem;
        background: transparent;
      }

      .nav {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
        color: #333;

        &:hover {
          color: #007bff;
        }
      }

      .nav-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;

        a {
          text-decoration: none;
          color: #666;
          transition: color 0.3s ease;
          font-size: 0.95rem;

          &.active {
            color: #007bff;
            font-weight: 500;
          }

          &:hover {
            color: #007bff;
          }
        }
      }

      .main-content {
        flex: 1;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
        width: 100%;
      }

      .footer {
        background: #f8f9fa;
        padding: 2rem 1rem;
        margin-top: auto;

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;

          .footer-links {
            margin-bottom: 1rem;

            a {
              color: #666;
              text-decoration: none;
              margin: 0 0.75rem;
              font-size: 0.9rem;

              &:hover {
                color: #007bff;
              }
            }
          }

          .copyright {
            color: #999;
            font-size: 0.9rem;
          }
        }
      }

      @media (max-width: 768px) {
        .header {
          .nav {
            flex-direction: column;
            gap: 1rem;

            .nav-links {
              flex-wrap: wrap;
              justify-content: center;
              gap: 1rem;
            }
          }
        }

        .footer {
          .footer-content {
            .footer-links {
              a {
                display: inline-block;
                margin: 0.5rem;
              }
            }
          }
        }
      }
    `
  ]
})
export class HomeLayoutComponent {
  currentYear = new Date().getFullYear()
}
