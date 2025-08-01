import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  TransferState,
  makeStateKey
} from '@angular/core'
import { CommonModule, isPlatformServer } from '@angular/common'
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
  tags?: string
}

// Tag interface
interface Tag {
  id: number
  title: string
  value: string
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
  selector: 'cs-tags',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="max-w-4xl mx-auto mb-16">
      <h1 class="text-3xl font-bold text-main mb-8">
        标签：{{ tagTitle() }}
        <span class="text-lg font-normal text-muted ml-2">({{ articles().length }} 篇文章)</span>
      </h1>

      <!-- Tag Description -->
      <div *ngIf="tagDescription()" class="tag-description mb-8">
        <p class="text-muted">{{ tagDescription() }}</p>
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
            <div *ngIf="article.tags" class="article-tags">
              <span *ngFor="let tag of getArticleTags(article.tags)" class="article-tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="articles().length === 0" class="empty-state">
          <i class="pi pi-inbox text-4xl text-muted mb-4"></i>
          <p class="text-muted">该标签下暂无文章</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .tag-description {
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
        margin-bottom: 0.5rem;
      }

      .article-tags {
        margin-left: 6rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .article-tag {
        font-size: 0.75rem;
        color: var(--p-primary-color, #2196f3);
        background: var(--p-content-hover-background, #f3f4f6);
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        border: 1px solid var(--p-content-border-color, #e5e7eb);
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
export class TagsPage implements OnInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)

  private getTagKey(title: string) {
    return makeStateKey<any>(`tag-${title}`)
  }
  private getArticlesKey(title: string) {
    return makeStateKey<any[]>(`tag-articles-${title}`)
  }

  tagTitle = signal<string>('标签')
  tagDescription = signal<string>('')
  articles = signal<Article[]>([])

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const value = params['value']
      if (value) {
        this.loadTagAndArticles(value)
      }
    })
  }

  /**
   * Load tag info and articles
   */
  loadTagAndArticles(value: string) {
    // 1. 检查 TransferState
    const cachedTag = this.transferState.get(this.getTagKey(value), null)
    const cachedArticles = this.transferState.get(this.getArticlesKey(value), null)
    if (cachedTag && cachedArticles) {
      this.tagTitle.set(cachedTag.title)
      this.tagDescription.set(cachedTag.des || '')
      this.articles.set(cachedArticles)
      return
    }
    // // First get tag info using new value endpoint
    // this.httpService.get<ApiResponse<Tag>>(`/api/content/tags/value/${value}`).subscribe({
    //   next: (response) => {
    //     if (response.success && response.data) {
    //       const tag = response.data
    //       this.tagTitle.set(tag.title)
    //       this.tagDescription.set(tag.des || '')

    //       // Then load articles for this tag
    //       this.loadArticlesByTag(value)
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Failed to load tag:', err)
    //   }
    // })
    // get tag by value
    this.httpService.get<ApiResponse<Tag>>(`/api/content/tags/value/${value}`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.tagTitle.set(response.data.title)
          this.tagDescription.set(response.data.des || '')
          this.loadArticlesByTag(response.data.title, true)
        }
      }
    })
  }

  /**
   * Load articles by tag value
   */
  loadArticlesByTag(tagValue: string, setTransferState = false) {
    this.httpService
      .get<ApiResponse<PaginatedResponse<Article>>>('/api/content/articles', {
        tags: tagValue,
        page: 1,
        pageSize: 1000, // Get all articles
        status: 10 // Published articles only
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.dataList) {
            // Sort articles by create_time (newest first)
            const sortedArticles = response.data.dataList.sort(
              (a, b) => b.create_time - a.create_time
            )
            this.articles.set(sortedArticles)
            if (isPlatformServer(this.platformId) && setTransferState) {
              this.transferState.set(this.getTagKey(tagValue), { title: tagValue, des: '' })
              this.transferState.set(this.getArticlesKey(tagValue), sortedArticles)
            }
          }
        },
        error: (err) => {
          console.error('Failed to load articles:', err)
        }
      })
  }

  /**
   * Parse article tags string to array
   */
  getArticleTags(tagsString: string): string[] {
    return tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)
  }
}
