import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { HttpService, ApiResponse } from '../../services/http.service'

// Article interface
interface Article {
  id: number
  title: string
  url: string
  create_time: number
  status: number
  abstract?: string
  type_id?: number
}

// Category interface
interface Category {
  id: number
  title: string
  alias: string
  des?: string
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
  selector: 'cs-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="max-w-4xl mx-auto mb-16">
      <h1 class="text-3xl font-bold text-main mb-8">
        分类：{{ categoryTitle() }}
        <span class="text-lg font-normal text-muted ml-2">({{ articles().length }} 篇文章)</span>
      </h1>

      <!-- Category Description -->
      <div *ngIf="categoryDescription()" class="category-description mb-8">
        <p class="text-muted">{{ categoryDescription() }}</p>
      </div>

      <!-- Articles List -->
      <div class="articles-timeline">
        <div *ngFor="let article of articles()" class="article-item">
          <div class="article-dot"></div>
          <div class="article-content">
            <div class="article-header">
              <span class="article-date">{{ article.create_time | date: 'yyyy-MM-dd' }}</span>
              <a [routerLink]="['/archives', article.url]" class="article-title">
                {{ article.title }}
              </a>
            </div>
            <div *ngIf="article.abstract" class="article-abstract">
              {{ article.abstract }}
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div
          *ngIf="articles().length > 0 && articles().length < totalRecords()"
          class="load-more-container"
        >
          <button (click)="loadMoreArticles()" [disabled]="loading()" class="load-more-btn">
            <span *ngIf="!loading()">加载更多</span>
            <span *ngIf="loading()">加载中...</span>
          </button>
        </div>

        <!-- Empty State -->
        <div *ngIf="articles().length === 0 && !loading()" class="empty-state">
          <i class="pi pi-inbox text-4xl text-muted mb-4"></i>
          <p class="text-muted">该分类下暂无文章</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .category-description {
        background: var(--p-content-hover-background, #f3f4f6);
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        border-left: 4px solid var(--p-primary-color, #2196f3);
      }

      .articles-timeline {
        position: relative;
        padding-left: 2rem;
      }

      .articles-timeline::before {
        content: '';
        position: absolute;
        left: 1.5rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--p-content-border-color, #e5e7eb);
        border-radius: 1px;
      }

      .article-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 2rem;
        position: relative;
      }

      .article-dot {
        width: 0.5rem;
        height: 0.5rem;
        background: var(--p-primary-color, #2196f3);
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 0.5rem;
      }

      .article-content {
        flex: 1;
        min-width: 0;
      }

      .article-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }

      .article-date {
        font-size: 0.875rem;
        color: var(--p-text-muted-color);
        min-width: 5rem;
        text-align: right;
      }

      .article-title {
        color: var(--p-text-color);
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        transition: color 0.2s;
        line-height: 1.4;
        flex: 1;
      }

      .article-title:hover {
        color: var(--p-primary-color, #2196f3);
      }

      .article-abstract {
        color: var(--p-text-muted-color);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-left: 6rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--p-text-muted-color);
      }

      .load-more-container {
        text-align: center;
        margin-top: 2rem;
        padding: 1rem;
      }

      .load-more-btn {
        background: var(--p-primary-color, #2196f3);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .load-more-btn:hover:not(:disabled) {
        background: var(--p-primary-hover-color, #1976d2);
        transform: translateY(-1px);
      }

      .load-more-btn:disabled {
        background: var(--p-text-muted-color, #6b7280);
        cursor: not-allowed;
        transform: none;
      }

      /* Theme variables */
      .text-main {
        color: var(--p-text-color) !important;
      }
      .text-muted {
        color: var(--p-text-muted-color) !important;
      }
      .font-bold {
        font-weight: 700 !important;
      }
      .font-normal {
        font-weight: 400 !important;
      }
      .text-3xl {
        font-size: 2rem !important;
      }
      .text-lg {
        font-size: 1.25rem !important;
      }
      .text-4xl {
        font-size: 2.5rem !important;
      }
      .mb-4 {
        margin-bottom: 1rem !important;
      }
      .mb-8 {
        margin-bottom: 2rem !important;
      }
      .mb-16 {
        margin-bottom: 4rem !important;
      }
      .ml-2 {
        margin-left: 0.5rem !important;
      }
      .max-w-4xl {
        max-width: 56rem !important;
      }
      .mx-auto {
        margin-left: auto !important;
        margin-right: auto !important;
      }
    `
  ]
})
export class CategoriesPage implements OnInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)

  categoryTitle = signal<string>('分类')
  categoryDescription = signal<string>('')
  articles = signal<Article[]>([])

  // Pagination signals
  page = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)
  loading = signal(false)

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Handle parameter name with trailing space
      const alias = params['alias'] || params['alias ']
      if (alias) {
        this.loadCategoryAndArticles(alias)
      }
    })
  }

  /**
   * Load category info and articles
   */
  loadCategoryAndArticles(alias: string) {
    // First get category info using new alias endpoint
    this.httpService
      .get<ApiResponse<Category>>(`/api/content/categories/alias/${alias}`)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const category = response.data
            this.categoryTitle.set(category.title)
            this.categoryDescription.set(category.des || '')

            // Then load articles for this category
            this.loadArticlesByCategory(category.id)
          }
        },
        error: (err) => {
          console.error('Failed to load category:', err)
        }
      })
  }

  /**
   * Load articles by category ID with pagination
   */
  loadArticlesByCategory(categoryId: number) {
    this.loading.set(true)
    this.httpService
      .get<ApiResponse<PaginatedResponse<Article>>>('/api/content/articles', {
        type_id: categoryId,
        page: this.page(),
        pageSize: this.pageSize(),
        status: 10 // Published articles only
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.articles.set(response.data.dataList)
            this.totalRecords.set(response.data.pagination.total)
          }
          this.loading.set(false)
        },
        error: (err) => {
          console.error('Failed to load articles:', err)
          this.loading.set(false)
        }
      })
  }

  /**
   * Load more articles (next page)
   */
  loadMoreArticles() {
    const categoryId = this.getCurrentCategoryId()
    if (categoryId) {
      this.page.set(this.page() + 1)
      this.loadArticlesByCategory(categoryId)
    }
  }

  /**
   * Get current category ID from loaded articles
   */
  private getCurrentCategoryId(): number | null {
    const articles = this.articles()
    return articles.length > 0 ? articles[0].type_id || null : null
  }
}
