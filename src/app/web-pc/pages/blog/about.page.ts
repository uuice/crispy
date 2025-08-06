import {
  Component,
  signal,
  OnInit,
  AfterViewInit,
  inject,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  ElementRef
} from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { isPlatformServer, isPlatformBrowser } from '@angular/common'
import { generateTocAndHeadings, TocItem } from 'src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { HttpService, ApiResponse } from '../../services/http.service'
import hljs from 'highlight.js'

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
export class AboutPage implements OnInit, AfterViewInit {
  private httpService = inject(HttpService)
  private sanitizer = inject(DomSanitizer)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)
  private elementRef = inject(ElementRef)

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

    // Load data - TransferState will handle caching automatically
    this.loadPageData()
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

      // Apply code highlighting after content is loaded from cache
      setTimeout(() => {
        this.applyCodeHighlighting()
      }, 0)
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

          // Apply code highlighting after content is loaded
          setTimeout(() => {
            this.applyCodeHighlighting()
          }, 0)

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
