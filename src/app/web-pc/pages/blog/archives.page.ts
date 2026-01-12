import {
  Component,
  computed,
  inject,
  makeStateKey,
  OnInit,
  PLATFORM_ID,
  signal,
  TransferState
} from '@angular/core'
import { CommonModule, isPlatformServer } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ApiResponse, HttpService } from '../../services/http.service'

// Article interface
interface Article {
  id: number
  title: string
  url: string
  create_time: number
  status: number
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

// Year group interface
interface YearGroup {
  year: number
  articles: Article[]
  count: number
}

@Component({
  selector: 'cs-archives',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="max-w-4xl mx-auto mb-16">
      <h1 class="text-3xl font-bold text-main mb-8">归档</h1>

      <!-- Timeline Archive -->
      <div class="archive-timeline">
        @for (yearGroup of yearGroups(); track yearGroup) {
          <div class="year-group">
            <!-- Year Header -->
            <div class="year-header">
              <div class="year-marker">
                <i class="pi pi-calendar"></i>
              </div>
              <h2 class="year-title">{{ yearGroup.year }}</h2>
              <span class="year-count">{{ yearGroup.count }} 篇文章</span>
            </div>
            <!-- Articles List -->
            <div class="articles-list">
              @for (article of yearGroup.articles; track article) {
                <div class="article-item">
                  <div class="article-dot"></div>
                  <div class="article-content">
                    <span class="article-date">{{ article.create_time | date: 'MM-dd' }}</span>
                    <a [routerLink]="['/archives', article.url]" class="article-title">
                      {{ article.title }}
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (yearGroups().length === 0) {
          <div class="empty-state">
            <i class="pi pi-inbox text-4xl text-muted mb-4"></i>
            <p class="text-muted">暂无文章</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .archive-timeline {
        position: relative;
        padding-left: 2rem;
      }

      .archive-timeline::before {
        content: '';
        position: absolute;
        left: 1.5rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--p-content-border-color, #e5e7eb);
        border-radius: 1px;
      }

      .year-group {
        margin-bottom: 3rem;
        position: relative;
      }

      .year-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        position: relative;
      }

      .year-marker {
        position: absolute;
        left: -2rem;
        width: 1rem;
        height: 1rem;
        background: var(--p-primary-color, #2196f3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.5rem;
        z-index: 2;
      }

      .year-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--p-text-color);
        margin: 0;
      }

      .year-count {
        font-size: 0.875rem;
        color: var(--p-text-muted-color);
        background: var(--p-content-hover-background, #f3f4f6);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
      }

      .articles-list {
        margin-left: 1rem;
      }

      .article-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        position: relative;
      }

      .article-dot {
        width: 0.5rem;
        height: 0.5rem;
        background: var(--p-text-muted-color, #6b7280);
        border-radius: 50%;
        flex-shrink: 0;
      }

      .article-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
      }

      .article-date {
        font-size: 0.875rem;
        color: var(--p-text-muted-color);
        min-width: 3rem;
        text-align: right;
      }

      .article-title {
        color: var(--p-text-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
        line-height: 1.4;
      }

      .article-title:hover {
        color: var(--p-primary-color, #2196f3);
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--p-text-muted-color);
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
      .font-semibold {
        font-weight: 600 !important;
      }
      .text-3xl {
        font-size: 2rem !important;
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
export class ArchivesPage implements OnInit {
  private httpService = inject(HttpService)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)

  // TransferState key
  private readonly ARTICLES_KEY = makeStateKey<Article[]>('archivesArticles')

  // Loading flag
  private articlesLoaded = false

  articles = signal<Article[]>([])

  // Group articles by year
  yearGroups = computed(() => {
    const articles = this.articles()
    if (!articles.length) return []

    // Group articles by year
    const groups = new Map<number, Article[]>()

    articles.forEach((article) => {
      const year = new Date(article.create_time).getFullYear()
      if (!groups.has(year)) {
        groups.set(year, [])
      }
      groups.get(year)!.push(article)
    })

    // Convert to array and sort by year (descending)
    return Array.from(groups.entries())
      .map(([year, articles]) => ({
        year,
        articles: articles.sort((a, b) => b.create_time - a.create_time), // Sort articles by date (newest first)
        count: articles.length
      }))
      .sort((a, b) => b.year - a.year) // Sort years descending
  })

  ngOnInit() {
    // Load data - TransferState will handle caching automatically
    this.loadArticles()
  }

  /**
   * Load all published articles
   */
  loadArticles() {
    // Check if data exists in TransferState
    const cachedData = this.transferState.get(this.ARTICLES_KEY, null)
    if (cachedData) {
      this.articles.set(cachedData)
      this.articlesLoaded = true
      return
    }

    this.httpService
      .get<ApiResponse<PaginatedResponse<Article>>>('/api/content/articles', {
        page: 1,
        pageSize: 1000, // Get all articles
        status: 10 // Published articles only
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.dataList) {
            this.articles.set(response.data.dataList)
            this.articlesLoaded = true

            // Store in TransferState on server-side
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(this.ARTICLES_KEY, response.data.dataList)
            }
          }
        },
        error: (err) => {
          console.error('Failed to load articles:', err)
        }
      })
  }
}
