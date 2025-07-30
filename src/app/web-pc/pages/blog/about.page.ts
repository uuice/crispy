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
import { isPlatformServer, isPlatformBrowser } from '@angular/common'
import { generateTocAndHeadings, TocItem } from 'src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { HttpService, ApiResponse } from '../../services/http.service'

@Component({
  selector: 'cs-about',
  standalone: true,
  imports: [TocComponent],
  template: `
    <!-- About Banner -->
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
    <!-- About Content -->
    <section class="blog-section">
      <div class="blog-prose prose text-main" [innerHTML]="html()"></div>
    </section>
    <!-- TOC 悬浮在主内容右侧，不占用主内容宽度 -->
    <cs-toc [toc]="toc" />
  `,
  styles: []
})
export class AboutPage implements OnInit {
  private httpService = inject(HttpService)
  private sanitizer = inject(DomSanitizer)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)

  // TransferState keys
  private readonly ABOUT_PAGE_KEY = makeStateKey<any>('aboutPage')
  private readonly ABOUT_TOC_KEY = makeStateKey<TocItem[]>('aboutToc')

  // Loading flag
  private aboutPageLoaded = false

  // Signals for content
  pageTitle = signal<string>('About')
  html = signal<SafeHtml>('')
  toc = signal<TocItem[]>([])

  ngOnInit() {
    // Load data - TransferState will handle caching automatically
    this.loadPageData()
  }

  /**
   * Load page data from API
   */
  loadPageData() {
    // Check if data exists in TransferState
    const cachedPageData = this.transferState.get(this.ABOUT_PAGE_KEY, null)
    const cachedTocData = this.transferState.get(this.ABOUT_TOC_KEY, null)

    if (cachedPageData && cachedTocData) {
      this.pageTitle.set(cachedPageData.title || 'About')
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(cachedPageData.html))
      this.toc.set(cachedTocData)
      this.aboutPageLoaded = true
      return
    }

    // Call content API to get page by URL 'about'
    this.httpService.get<ApiResponse<any>>('/api/content/pages/url/about').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const pageData = response.data

          // Set page title
          this.pageTitle.set(pageData.title || 'About')

          // Process content and generate TOC
          const { html, toc } = generateTocAndHeadings(pageData.content)
          this.html.set(this.sanitizer.bypassSecurityTrustHtml(html))
          this.toc.set(toc)
          this.aboutPageLoaded = true

          // Store in TransferState on server-side
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(this.ABOUT_PAGE_KEY, {
              title: pageData.title,
              html: html
            })
            this.transferState.set(this.ABOUT_TOC_KEY, toc)
          }
        }
      },
      error: (err) => {
        console.error('Failed to load about page:', err)
      }
    })
  }
}
