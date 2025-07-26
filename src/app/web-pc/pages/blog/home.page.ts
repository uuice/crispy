import { Component, OnInit, inject, signal } from '@angular/core'
import { AvatarModule } from 'primeng/avatar'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpService, ApiResponse } from '../../services/http.service'

// Article interface
interface Article {
  id: number
  title: string
  url: string
  abstract: string
  image: string
  create_time: number
  attrs: string
}

// Paginated response interface
interface PaginatedResponse<T> {
  dataList: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

@Component({
  selector: 'cs-home',
  standalone: true,
  imports: [AvatarModule, CardModule, ButtonModule, CommonModule, RouterModule],
  template: `
    <!-- Article List Section -->
    <section class="max-w-4xl mx-auto mb-16">
      <h2 class="text-2xl font-bold mb-6">文章推荐</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Article Card -->
        <p-card *ngFor="let article of hotArticles()" class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img
              [src]="
                article.image ||
                'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80'
              "
              [alt]="article.title"
              class="w-full h-40 object-cover"
            />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ article.title }}</h3>
            <div class="flex gap-2 text-xs mb-2 text-muted">
              <span>{{ article.create_time | date: 'yyyy-MM-dd' }}</span>
            </div>
            <p class="mb-3">{{ article.abstract || '暂无摘要' }}</p>
            <a [routerLink]="['/archives', article.url]" class="blog-icon-blue hover:opacity-80">
              阅读更多
            </a>
          </div>
        </p-card>
      </div>
    </section>
  `,
  styles: [
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
      .rounded-xl {
        border-radius: 1rem !important;
      }
      .shadow {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
      }
      .blog-card,
      .p-card {
        background: var(--p-content-background) !important;
        color: var(--p-text-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      .blog-banner-content {
        color: var(--p-text-color) !important;
      }
      .blog-title {
        color: var(--p-text-color) !important;
      }
      .blog-prose {
        color: var(--p-text-color) !important;
      }
      .text-xs {
        font-size: 0.85rem !important;
      }
      .text-lg {
        font-size: 1.25rem !important;
      }
      .text-2xl {
        font-size: 2rem !important;
      }
      .font-semibold {
        font-weight: 600 !important;
      }
      .font-bold {
        font-weight: 700 !important;
      }
    `
  ]
})
export class HomePage implements OnInit {
  private httpService = inject(HttpService)

  // Signal for hot articles
  hotArticles = signal<Article[]>([])

  ngOnInit() {
    this.loadHotArticles()
  }

  /**
   * Load hot articles from API
   */
  loadHotArticles() {
    this.httpService
      .get<ApiResponse<PaginatedResponse<Article>>>('/api/content/articles', {
        page: 1,
        pageSize: 4,
        status: 10,
        attrs: 'hot'
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.dataList) {
            this.hotArticles.set(response.data.dataList)
          }
        },
        error: (err) => {
          console.error('Failed to load hot articles:', err)
        }
      })
  }
}
