import { Component, signal, OnInit, inject } from '@angular/core'
import { TocItem, generateTocAndHeadings } from '@src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { HttpService, ApiResponse } from '../../services/http.service'

// Article interface
interface Article {
  id: number
  title: string
  url: string
  content: string
  abstract: string
  author_id: number
  create_time: number
  tags: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
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

@Component({
  selector: 'cs-archives-detail',
  standalone: true,
  imports: [TocComponent, CommonModule, RouterModule],
  template: `
    <!-- Article Banner -->
    <section class="blog-banner">
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">{{ articleTitle() }}</h1>
        <div class="flex flex-wrap gap-3 items-center text-sm text-muted mb-2">
          <span>{{ articleCreateTime() | date: 'yyyy-MM-dd' }}</span>
          <span>·</span>
          <span>by <span class="font-semibold blog-icon">作者</span></span>
          <span>·</span>
          <span class="blog-tag blog-tag-blue text-xs">文章</span>
        </div>
      </div>
    </section>
    <!-- 主内容 -->
    <section class="blog-section">
      <div class="blog-prose prose text-main" [innerHTML]="html()"></div>
      <div class="blog-tags mt-4 text-muted">
        <span
          *ngFor="let tag of articleTags(); let i = index"
          class="blog-tag {{ getTagClass(i) }}"
          [routerLink]="['/tags', tag]"
          style="cursor: pointer"
        >
          {{ tag }}
        </span>
      </div>
    </section>
    <!-- TOC 悬浮在主内容右侧，不占用主内容宽度 -->
    <cs-toc [toc]="toc" />
  `,
  styles: []
})
export class ArchivesDetailPage implements OnInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private sanitizer = inject(DomSanitizer)

  // Article data signals
  articleTitle = signal<string>('')
  articleCreateTime = signal<number>(0)
  articleTags = signal<string[]>([])
  html = signal<SafeHtml>('')
  toc = signal<TocItem[]>([])

  // Tag color class list for blog tags (same as home-layout)
  tagClassList = [
    'blog-tag-blue',
    'blog-tag-green',
    'blog-tag-yellow',
    'blog-tag-purple',
    'blog-tag-pink',
    'blog-tag-gray',
    'blog-tag-indigo'
  ]

  ngOnInit() {
    // Get url parameter from route
    this.route.params.subscribe((params) => {
      const url = params['url']
      if (url) {
        this.loadArticle(url)
      }
    })
  }

  /**
   * Get tag class based on index (cycle through tagClassList)
   */
  getTagClass(index: number): string {
    return this.tagClassList[index % this.tagClassList.length]
  }

  /**
   * Load article data from API
   */
  loadArticle(url: string) {
    this.httpService
      .get<ApiResponse<PaginatedResponse<Article>>>('/api/content/articles', {
        url: url,
        page: 1,
        pageSize: 1
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.dataList && response.data.dataList.length > 0) {
            const article = response.data.dataList[0]

            // Set article data
            this.articleTitle.set(article.title)
            this.articleCreateTime.set(article.create_time)

            // Parse tags
            if (article.tags) {
              const tags = article.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag)
              this.articleTags.set(tags)
            } else {
              this.articleTags.set([])
            }

            // Process content and generate TOC
            const { html, toc } = generateTocAndHeadings(article.content)
            this.html.set(this.sanitizer.bypassSecurityTrustHtml(html))
            this.toc.set(toc)
          }
        },
        error: (err) => {
          console.error('Failed to load article:', err)
        }
      })
  }
}
