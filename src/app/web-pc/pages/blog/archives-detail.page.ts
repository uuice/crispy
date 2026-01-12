import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  makeStateKey,
  OnInit,
  PLATFORM_ID,
  signal,
  TransferState
} from '@angular/core'
import { generateTocAndHeadings, TocItem } from '@src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common'
import { ApiResponse, HttpService } from '../../services/http.service'
import hljs from 'highlight.js'

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
  tagRef: { [key: string]: string }
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
  status: number
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
        @for (tag of articleTags(); track tag; let i = $index) {
          <span
            class="blog-tag {{ getTagClass(i) }}"
            [routerLink]="['/tags', articleTagRef()[tag] || tag]"
            style="cursor: pointer"
          >
            {{ tag }}
          </span>
        }
      </div>
    </section>
    <!-- TOC 悬浮在主内容右侧，不占用主内容宽度 -->
    <cs-toc [toc]="toc" />
  `,
  styles: []
})
export class ArchivesDetailPage implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private sanitizer = inject(DomSanitizer)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)
  private elementRef = inject(ElementRef)

  // TransferState keys - will be created dynamically based on URL
  private getArticleKey(url: string) {
    return makeStateKey<any>(`article-${url}`)
  }

  private getArticleTocKey(url: string) {
    return makeStateKey<TocItem[]>(`articleToc-${url}`)
  }

  // Loading flag
  private articleLoaded = false

  // Article data signals
  articleTitle = signal<string>('')
  articleCreateTime = signal<number>(0)
  articleTags = signal<string[]>([])
  articleTagRef = signal<{ [key: string]: string }>({})
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
    // Configure highlight.js
    hljs.configure({
      languages: [
        'javascript',
        'typescript',
        'html',
        'css',
        'python',
        'java',
        'cpp',
        'c',
        'php',
        'ruby',
        'go',
        'rust',
        'sql',
        'json',
        'xml',
        'yaml',
        'bash',
        'shell'
      ]
    })

    // Get url parameter from route
    this.route.params.subscribe((params) => {
      const url = params['url']
      if (url) {
        // Load data - TransferState will handle caching automatically
        this.loadArticle(url)
      }
    })
  }

  ngAfterViewInit() {
    // Apply code highlighting after view is initialized
    this.applyCodeHighlighting()
  }

  /**
   * Apply code highlighting to all code blocks in the content
   */
  private applyCodeHighlighting() {
    if (isPlatformBrowser(this.platformId)) {
      // Wait for the next tick to ensure DOM is updated
      setTimeout(() => {
        // Find all code blocks - both pre code and standalone pre elements
        const codeBlocks = this.elementRef.nativeElement.querySelectorAll('pre code, pre')
        codeBlocks.forEach((codeBlock: HTMLElement) => {
          // Check if the code block is already highlighted
          if (!codeBlock.classList.contains('hljs')) {
            try {
              hljs.highlightElement(codeBlock)
            } catch (error) {
              console.warn('Failed to highlight code block:', error)
            }
          }
        })
      }, 100) // Increased timeout to ensure content is fully rendered
    }
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
    // Get dynamic keys based on URL
    const articleKey = this.getArticleKey(url)
    const tocKey = this.getArticleTocKey(url)

    // Check if data exists in TransferState
    const cachedArticleData = this.transferState.get(articleKey, null)
    const cachedTocData = this.transferState.get(tocKey, null)

    if (cachedArticleData && cachedTocData) {
      // Set article data from cache
      this.articleTitle.set(cachedArticleData.title)
      this.articleCreateTime.set(cachedArticleData.create_time)
      this.articleTags.set(cachedArticleData.tags || [])
      this.articleTagRef.set(cachedArticleData.tagRef || {})
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(cachedArticleData.html))
      this.toc.set(cachedTocData)
      this.articleLoaded = true

      // Apply code highlighting after content is loaded from cache
      setTimeout(() => {
        this.applyCodeHighlighting()
      }, 0)
      return
    }

    // Call content API to get article by URL
    this.httpService.get<ApiResponse<Article>>(`/api/content/articles/url/${url}`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const article = response.data

          // Set article data
          this.articleTitle.set(article.title)
          this.articleCreateTime.set(article.create_time)

          // Parse tags
          let tags: string[] = []
          if (article.tags) {
            tags = article.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          }
          this.articleTags.set(tags)

          // Set tagRef from article data
          this.articleTagRef.set(article.tagRef || {})

          // Process content and generate TOC
          const { html, toc } = generateTocAndHeadings(article.content)
          this.html.set(this.sanitizer.bypassSecurityTrustHtml(html))
          this.toc.set(toc)
          this.articleLoaded = true

          // Apply code highlighting after content is loaded
          setTimeout(() => {
            this.applyCodeHighlighting()
          }, 0)

          // Store in TransferState on server-side
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(articleKey, {
              title: article.title,
              create_time: article.create_time,
              tags: tags,
              tagRef: article.tagRef || {},
              html: html
            })
            this.transferState.set(tocKey, toc)
          }
        }
      },
      error: (err) => {
        console.error('Failed to load article:', err)
      }
    })
  }
}
