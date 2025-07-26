import { Component, signal, OnInit, inject } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { generateTocAndHeadings, TocItem } from 'src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { HttpService, ApiResponse } from '../../services/http.service'
import { PaginatedPagesResult } from '@src/server/services/pageService'

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

  // Signals for content
  pageTitle = signal<string>('About')
  html = signal<SafeHtml>('')
  toc = signal<TocItem[]>([])

  ngOnInit() {
    this.loadPageData()
  }

  /**
   * Load page data from API
   */
  loadPageData() {
    // Call content API to get page with url 'about'
    this.httpService
      .get<ApiResponse<PaginatedPagesResult>>('/api/content/pages', { url: 'about' })
      .subscribe({
        next: (response) => {
          // get dataList[0]
          if (
            response.success &&
            response.data &&
            response.data.dataList &&
            response.data.dataList.length > 0
          ) {
            // Set page title
            this.pageTitle.set(response.data.dataList[0].title || 'About')

            // Process content and generate TOC
            const { html, toc } = generateTocAndHeadings(response.data.dataList[0].content)
            this.html.set(this.sanitizer.bypassSecurityTrustHtml(html))
            this.toc.set(toc)
          }
        },
        error: (err) => {
          console.error('Failed to load about page:', err)
        }
      })
  }
}
