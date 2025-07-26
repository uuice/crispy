import { Component, OnInit, inject, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { HttpService, ApiResponse } from '../../services/http.service'

// Data interfaces
interface Category {
  id: number
  title: string
  alias: string
  sort: number
  parent_id: number
  status: number
  des?: string
  children?: Category[]
}

interface Link {
  id: number
  url: string
  site_name: string
  logo?: string
  des?: string
  sort: number
  status: number
  type_id: number
  type_name: string
  create_time: number
  update_time: number
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
  selector: 'cs-links',
  standalone: true,
  imports: [ButtonModule, CommonModule],
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
      <div *ngFor="let category of categories()" class="blog-card">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-link blog-icon"></i>
          <h2 class="text-lg font-semibold text-main">{{ category.title }}</h2>
        </div>
        <ul class="flex flex-col gap-3">
          <li
            *ngFor="let link of getLinksByCategory(category.id)"
            class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
          >
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
        </ul>
      </div>
    </section>
  `,
  styles: [``]
})
export class LinksPage implements OnInit {
  private httpService = inject(HttpService)

  // Data signals
  categories = signal<Category[]>([])
  links = signal<Link[]>([])

  ngOnInit() {
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
      .get<ApiResponse<PaginatedResponse<Link>>>('/api/content/links', {
        page: 1,
        pageSize: 1000,
        status: 10 // Only published links
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.dataList) {
            this.links.set(response.data.dataList)
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
  getLinksByCategory(categoryId: number): Link[] {
    return this.links().filter((link) => link.type_id === categoryId)
  }
}
