import {
  Component,
  inject,
  makeStateKey,
  OnInit,
  PLATFORM_ID,
  signal,
  TransferState
} from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { isPlatformServer } from '@angular/common'
import { ApiResponse, HttpService } from '../../services/http.service'
import { CategoryEntity, LinkEntity, PaginatedResult } from '@src/types'

// Data interfaces - extending CategoryEntity with children for tree structure
interface Category extends CategoryEntity {
  children?: Category[]
}

@Component({
  selector: 'cs-links',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <!-- Links Banner -->
    <section class="blog-banner">
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">链接</h1>
      </div>
    </section>
    <!-- Links Content (Dynamic) -->
    <section class="max-w-2xl mx-auto mb-16 px-2 sm:px-4 flex flex-col gap-10">
      <!-- Category Cards -->
      @for (category of categories(); track category) {
        <div class="blog-card">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-link blog-icon"></i>
            <h2 class="text-lg font-semibold text-main">{{ category.title }}</h2>
          </div>
          <ul class="flex flex-col gap-3">
            @for (link of getLinksByCategory(category.id); track link) {
              <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span class="blog-tag">{{ link.site_name }}</span>
                <span class="text-muted text-xs">{{ link.des || '链接' }}</span>
                <a [href]="link.url" target="_blank" rel="noopener">
                  <p-button
                    label="访问"
                    icon="pi pi-external-link"
                    size="small"
                    styleClass="p-button-text p-button-sm blog-icon hover:opacity-80"
                  ></p-button>
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </section>
  `,
  styles: [``]
})
export class LinksPage implements OnInit {
  private httpService = inject(HttpService)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)

  private readonly CATEGORIES_KEY = makeStateKey<Category[]>('linkCategories')
  private readonly LINKS_KEY = makeStateKey<LinkEntity[]>('linkLinks')

  // Data signals
  categories = signal<Category[]>([])
  links = signal<LinkEntity[]>([])

  ngOnInit() {
    // 优先从 TransferState 读取
    const cachedCategories = this.transferState.get(this.CATEGORIES_KEY, null)
    const cachedLinks = this.transferState.get(this.LINKS_KEY, null)
    if (cachedCategories && cachedLinks) {
      this.categories.set(cachedCategories)
      this.links.set(cachedLinks)
      return
    }
    this.loadCategoriesAndLinks()
  }

  /**
   * Load categories and links data
   */
  loadCategoriesAndLinks() {
    // Get categories tree with alias LINK_SYS_CAT
    this.httpService
      .get<ApiResponse<Category[]>>('/api/content/categories/tree', {
        alias: 'LINK_SYS_CAT',
        page: 1,
        pageSize: 10
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data && response.data[0] && response.data[0].children) {
            this.categories.set(response.data[0].children || [])

            // Then load all links for these categories
            this.loadLinks()
          }
        },
        error: (err) => {
          console.error('Failed to load categories:', err)
        }
      })
  }

  /**
   * Load all links
   */
  loadLinks() {
    this.httpService
      .get<ApiResponse<PaginatedResult<LinkEntity>>>('/api/content/links', {
        page: 1,
        pageSize: 1000,
        status: 10 // Only published links
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.dataList) {
            this.links.set(response.data.dataList)
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(this.CATEGORIES_KEY, this.categories())
              this.transferState.set(this.LINKS_KEY, response.data.dataList)
            }
          }
        },
        error: (err) => {
          console.error('Failed to load links:', err)
        }
      })
  }

  /**
   * Get links by category ID
   */
  getLinksByCategory(categoryId: number): LinkEntity[] {
    return this.links().filter((link) => link.type_id === categoryId)
  }
}
