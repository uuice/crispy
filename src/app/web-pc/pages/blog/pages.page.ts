import {
  Component,
  signal,
  OnInit,
  inject,
  PLATFORM_ID,
  TransferState,
  makeStateKey
} from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { isPlatformServer } from '@angular/common'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { generateTocAndHeadings, TocItem } from 'src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { HttpService, ApiResponse } from '../../services/http.service'

@Component({
  selector: 'cs-pages',
  standalone: true,
  imports: [TocComponent, RouterModule],
  template: `
    <!-- Pages Banner -->
    <section class="blog-banner">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        alt="Banner"
        class="blog-banner-img"
      />
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">{{ pageTitle() }}</h1>
      </div>
    </section>
    <!-- Pages Content -->
    <section class="blog-section">
      <div class="blog-prose prose text-main" [innerHTML]="html()"></div>
      <div class="blog-tags mt-4 text-muted">
        @for (tag of pageTags(); track $index) {
          <span
            class="blog-tag {{ getTagClass($index) }}"
            [routerLink]="['/tags', pageTagRef()[tag] || tag]"
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
export class PagesPage implements OnInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private sanitizer = inject(DomSanitizer)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)

  // TransferState keys - will be created dynamically based on URL
  private getPageKey(url: string) {
    return makeStateKey<any>(`page-${url}`)
  }

  private getPageTocKey(url: string) {
    return makeStateKey<TocItem[]>(`pageToc-${url}`)
  }

  // Loading flag
  private pageLoaded = false

  // Tag color class list for blog tags
  tagClassList = [
    'blog-tag-blue',
    'blog-tag-green',
    'blog-tag-yellow',
    'blog-tag-purple',
    'blog-tag-pink',
    'blog-tag-gray',
    'blog-tag-indigo'
  ]

  // Signals for content
  pageTitle = signal<string>('页面')
  pageTags = signal<string[]>([])
  pageTagRef = signal<{ [key: string]: string }>({})
  html = signal<SafeHtml>('')
  toc = signal<TocItem[]>([])

  ngOnInit() {
    // Get url parameter from route
    this.route.params.subscribe((params) => {
      const url = params['url']
      if (url) {
        // Load data - TransferState will handle caching automatically
        this.loadPageData(url)
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
   * Load page data from API
   */
  loadPageData(url: string) {
    // Get dynamic keys based on URL
    const pageKey = this.getPageKey(url)
    const tocKey = this.getPageTocKey(url)

    // Check if data exists in TransferState
    const cachedPageData = this.transferState.get(pageKey, null)
    const cachedTocData = this.transferState.get(tocKey, null)

    if (cachedPageData && cachedTocData) {
      this.pageTitle.set(cachedPageData.title || '页面')
      this.pageTags.set(cachedPageData.tags || [])
      this.pageTagRef.set(cachedPageData.tagRef || {})
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(cachedPageData.html))
      this.toc.set(cachedTocData)
      this.pageLoaded = true
      return
    }

    // Call content API to get page by URL
    this.httpService.get<ApiResponse<any>>(`/api/content/pages/url/${url}`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const pageData = response.data

          // Set page title
          this.pageTitle.set(pageData.title || '页面')

          // Parse tags
          let tags: string[] = []
          if (pageData.tags) {
            tags = pageData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          }
          this.pageTags.set(tags)

          // Set tagRef from page data
          this.pageTagRef.set(pageData.tagRef || {})

          // Process content and generate TOC
          const { html, toc } = generateTocAndHeadings(pageData.content)
          this.html.set(this.sanitizer.bypassSecurityTrustHtml(html))
          this.toc.set(toc)
          this.pageLoaded = true

          // Store in TransferState on server-side
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(pageKey, {
              title: pageData.title,
              tags: tags,
              tagRef: pageData.tagRef || {},
              html: html
            })
            this.transferState.set(tocKey, toc)
          }
        }
      },
      error: (err) => {
        console.error('Failed to load page:', err)
      }
    })
  }
}
