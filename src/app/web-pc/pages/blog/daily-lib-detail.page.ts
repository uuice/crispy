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
import { CommonModule, isPlatformServer, isPlatformBrowser } from '@angular/common'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Article } from './daily-lib.page'
import { TagModule } from 'primeng/tag'
import { ButtonModule } from 'primeng/button'
import { HttpService } from '../../services/http.service'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { TocItem, generateTocAndHeadings } from '@src/utils/markdown'
import hljs from 'highlight.js'

// API response interfaces
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  dataList: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

@Component({
  selector: 'cs-daily-lib-detail',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, RouterModule],
  template: `
    <div class="lib-detail-flex">
      <!-- 左侧：文章详情 -->
      <div class="lib-detail-main">
        <div class="lib-logo-wrap">
          <img
            *ngIf="lib()?.image"
            [src]="lib()?.image"
            [alt]="lib()?.title"
            class="lib-logo"
            loading="lazy"
          />
          <div *ngIf="!lib()?.image" class="lib-logo-default">
            <i class="pi pi-box"></i>
          </div>
        </div>
        <h1 class="lib-title">{{ lib()?.title }}</h1>
        <div class="lib-subtitle">{{ lib()?.sub_title }}</div>
        <div class="tags">
          <ng-container *ngIf="lib()?.tags">
            <p-tag
              *ngFor="let tag of lib()?.tags!.split(',')"
              [value]="tag.trim()"
              [routerLink]="['/tags', lib()?.tagRef?.[tag.trim()] || tag.trim()]"
              style="cursor: pointer"
            >
            </p-tag>
          </ng-container>
        </div>
        <div class="btn-group">
          <a
            pButton
            pRipple
            class="p-button-text p-button-sm p-button-outlined"
            [href]="lib()?.redirect_url"
            target="_blank"
            >主页</a
          >
        </div>
        <div class="section" id="desc">
          <h2>简介</h2>
          <div>{{ lib()?.abstract }}</div>
        </div>
        <div class="section" id="content">
          <h2>内容</h2>
          <div [innerHTML]="html()" class="prose"></div>
        </div>
      </div>
      <!-- 右侧：TOC -->
      <div class="lib-detail-toc">
        <div class="toc-title">目录</div>
        <ul class="toc-list">
          <li><a href="#desc" (click)="scrollTo('desc', $event)">简介</a></li>
          <li><a href="#content" (click)="scrollTo('content', $event)">内容</a></li>
          <li *ngFor="let item of toc()">
            <a [href]="'#' + item.id" (click)="scrollTo(item.id, $event)">{{ item.text }}</a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .lib-detail-flex {
        display: flex;
        gap: 32px;
        max-width: 1100px;
        margin: 32px auto;
        padding: 0 16px;
      }
      .lib-detail-main {
        flex: 1 1 0%;
        background: var(--p-content-background);
        color: var(--p-content-color);
        border-radius: 12px;
        box-shadow: 0 2px 16px 0 var(--p-content-border-color, rgba(0, 0, 0, 0.08));
        padding: 32px 28px 28px 28px;
        min-width: 0;
      }
      .lib-logo-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 72px;
        margin-bottom: 8px;
      }
      .lib-logo {
        width: 56px;
        height: 56px;
        object-fit: contain;
        border-radius: 12px;
        background: var(--p-content-hover-background, #222);
        box-shadow: 0 1px 4px 0 var(--p-content-border-color, rgba(0, 0, 0, 0.08));
        display: block;
      }
      .lib-logo-default {
        width: 56px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--p-content-hover-background, #222);
        border-radius: 12px;
        color: var(--p-content-color);
        font-size: 24px;
      }
      .lib-title {
        font-size: 2rem;
        font-weight: bold;
        margin: 12px 0 4px 0;
        color: var(--p-text-color);
      }
      .lib-subtitle {
        color: var(--p-text-muted-color);
        font-size: 1.1rem;
        margin-bottom: 12px;
      }
      .tags {
        margin-bottom: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .btn-group {
        display: flex;
        gap: 12px;
        margin: 16px 0 8px 0;
      }
      .section {
        margin: 24px 0 0 0;
        padding: 0;
      }
      .section h2 {
        font-size: 18px;
        color: var(--p-text-color);
        margin-bottom: 8px;
      }
      .lib-detail-toc {
        flex: 0 0 180px;
        background: var(--p-content-background);
        border-radius: 12px;
        box-shadow: 0 2px 16px 0 var(--p-content-border-color, rgba(0, 0, 0, 0.08));
        padding: 24px 18px;
        height: fit-content;
        position: sticky;
        top: 120px;
        align-self: flex-start;
      }
      .toc-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 12px;
        color: var(--p-text-color);
      }
      .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .toc-list li {
        margin-bottom: 10px;
      }
      .toc-list a {
        color: var(--p-text-muted-color);
        text-decoration: none;
        font-size: 15px;
        transition: color 0.2s;
      }
      .toc-list a:hover {
        color: var(--p-text-hover-color);
        text-decoration: underline;
      }
      @media (max-width: 900px) {
        .lib-detail-flex {
          flex-direction: column;
        }
        .lib-detail-toc {
          position: static;
          margin-top: 32px;
          width: 100%;
        }
      }
    `
  ]
})
export class DailyLibDetailPage implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private sanitizer = inject(DomSanitizer)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)
  private elementRef = inject(ElementRef)

  private getLibKey(url: string) {
    return makeStateKey<any>(`daily-lib-${url}`)
  }
  private getTocKey(url: string) {
    return makeStateKey<any[]>(`daily-lib-toc-${url}`)
  }

  lib = signal<Article | undefined>(undefined)
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

    this.route.params.subscribe((params) => {
      const url = params['url']
      if (url) {
        this.loadArticleByUrl(url)
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
   * Load article by URL (use new /url/{url} API)
   */
  loadArticleByUrl(url: string) {
    const cachedLib = this.transferState.get(this.getLibKey(url), null)
    const cachedToc = this.transferState.get(this.getTocKey(url), null)
    if (cachedLib && cachedToc) {
      this.lib.set(cachedLib)
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(cachedLib.html))
      this.toc.set(cachedToc)

      // Apply code highlighting after content is loaded from cache
      setTimeout(() => {
        this.applyCodeHighlighting()
      }, 0)
      return
    }
    this.httpService.get<ApiResponse<Article>>(`/api/content/articles/url/${url}`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lib.set(response.data)

          // Process content and generate TOC
          const { html, toc } = generateTocAndHeadings(response.data.content || '')
          this.html.set(this.sanitizer.bypassSecurityTrustHtml(html))
          this.toc.set(toc)

          // Apply code highlighting after content is loaded
          setTimeout(() => {
            this.applyCodeHighlighting()
          }, 0)

          if (isPlatformServer(this.platformId)) {
            // Store complete article data including tagRef
            this.transferState.set(this.getLibKey(url), {
              ...response.data,
              html,
              tagRef: response.data.tagRef || {}
            })
            this.transferState.set(this.getTocKey(url), toc)
          }
        }
      },
      error: (err) => {
        console.error('Failed to load article:', err)
      }
    })
  }

  scrollTo(id: string, event: Event) {
    event.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
