import { Component, signal, computed, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { PaginatorModule } from 'primeng/paginator'
import { TagModule } from 'primeng/tag'
import { HttpService } from '../../services/http.service'

// Article-like structure for npm libraries
export interface Article {
  id: number
  title: string
  url: string
  sub_title?: string
  abstract?: string
  content?: string
  image?: string
  image_list?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  remark?: string
  user_id?: number
  tags?: string
  type_id?: number
  type_ids?: string
  status?: number
  sort?: number
  click?: number
  attrs?: string
  is_review?: number
  redirect_url?: string
  create_time?: number
  update_time?: number
  is_delete?: number
}

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

// Category/Type interface
interface Category {
  id: number
  title: string
  alias: string
  status: number
  sort: number
  parent_id: number
  des?: string
  create_time: number
  update_time: number
  is_delete: number
}

@Component({
  selector: 'cs-daily-lib',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    TagModule
  ],
  template: `
    <div class="lib-page-root">
      <div class="search-bar">
        <input
          pInputText
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
          placeholder="搜索库名称"
        />
        <button
          pButton
          type="button"
          label="搜索"
          icon="pi pi-search"
          (click)="onSearch()"
        ></button>
      </div>
      <div class="card-list">
        <div *ngFor="let lib of pagedList()" class="card-item">
          <p-card
            [header]="lib.title"
            [subheader]="lib.seo_title"
            [ngClass]="{ 'custom-card': true }"
          >
            <ng-template pTemplate="header">
              <div class="lib-logo-wrap">
                <img
                  *ngIf="lib.image"
                  [src]="lib.image"
                  [alt]="lib.title"
                  class="lib-logo"
                  loading="lazy"
                />
                <div *ngIf="!lib.image" class="lib-logo-default">
                  <i class="pi pi-box"></i>
                </div>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="desc">{{ lib.abstract }}</div>
              <div class="tags">
                <ng-container *ngIf="lib.tags">
                  <p-tag *ngFor="let tag of lib.tags.split(',')" [value]="tag.trim()"></p-tag>
                </ng-container>
              </div>
              <div class="btn-group">
                <a
                  pButton
                  pRipple
                  class="p-button-sm p-button-outlined"
                  [href]="lib.redirect_url"
                  target="_blank"
                  >主页</a
                >
                <button
                  pButton
                  type="button"
                  label="详情"
                  icon="pi pi-info-circle"
                  class="p-button-sm p-button-outlined"
                  (click)="gotoDetail(lib.url)"
                ></button>
              </div>
              <div class="seo-desc">{{ lib.seo_description }}</div>
            </ng-template>
          </p-card>
        </div>
      </div>
      <div class="paginator-wrap">
        <p-paginator
          [rows]="pageSize()"
          [totalRecords]="totalRecords()"
          [first]="(page() - 1) * pageSize()"
          [rowsPerPageOptions]="[5, 10, 20, 50, 100]"
          (onPageChange)="onPageChange($event)"
          styleClass="p-paginator-sm"
        ></p-paginator>
      </div>
    </div>
  `,
  styles: [
    `
      .lib-page-root {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 16px;
        background: var(--p-content-background);
      }
      .search-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 32px;
      }
      .card-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .card-item {
        flex: 1 1 100%;
        max-width: 100%;
        margin-bottom: 32px;
        display: flex;
      }
      @media (min-width: 768px) {
        .card-item {
          flex: 1 1 48%;
          max-width: 48%;
        }
      }
      @media (min-width: 1200px) {
        .card-item {
          flex: 1 1 31%;
          max-width: 31%;
        }
      }
      :host ::ng-deep .custom-card {
        background: var(--p-content-background);
        color: var(--p-content-color);
        border: 1px solid var(--p-content-border-color);
        border-radius: 12px;
        min-height: 220px;
        margin-bottom: 0;
        display: flex;
        flex: 1;
      }
      :host ::ng-deep .p-card {
        flex: 1 !important;
      }
      :host ::ng-deep .p-card-content,
      :host ::ng-deep .p-card-header,
      :host ::ng-deep .p-card-subtitle {
        text-align: left;
      }
      :host ::ng-deep .p-card-header {
        color: var(--p-text-color);
      }
      :host ::ng-deep .p-card-subtitle {
        color: var(--p-text-muted-color);
      }
      .desc {
        color: var(--p-text-muted-color);
        font-size: 15px;
        min-height: 40px;
        margin-bottom: 8px;
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
      .btn-group a,
      .btn-group button {
        color: var(--p-content-color);
      }
      .seo-desc {
        color: var(--p-text-hover-muted-color);
        font-size: 13px;
        margin-top: 8px;
      }
      .paginator-wrap {
        display: flex;
        justify-content: center;
        margin-top: 24px;
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
    `
  ]
})
export class DailyLibPage implements OnInit {
  private httpService = inject(HttpService)

  libs = signal<Article[]>([])
  search = signal('')
  page = signal(1)
  pageSize = signal(3)
  totalRecords = signal(0)

  filteredList = computed(() => {
    const q = this.search().toLowerCase()
    return this.libs().filter((lib) => lib.title.toLowerCase().includes(q))
  })

  pagedList = computed(() => {
    const start = (this.page() - 1) * this.pageSize()
    return this.filteredList().slice(start, start + this.pageSize())
  })

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()) || 1)

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDailyLibs()
  }

  /**
   * Load daily libraries data
   */
  loadDailyLibs() {
    // First get the category with alias 'daily-libs' to get type_id
    this.httpService
      .get<ApiResponse<PaginatedResponse<Category>>>('/api/content/categories', {
        alias: 'daily-libs',
        page: 1,
        pageSize: 1
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.dataList && response.data.dataList.length > 0) {
            const category = response.data.dataList[0]
            // Then get articles with this type_id
            this.loadArticlesByTypeId(category.id)
          }
        },
        error: (err) => {
          console.error('Failed to load daily-libs category:', err)
        }
      })
  }

  /**
   * Load articles by type_id
   */
  loadArticlesByTypeId(typeId: number) {
    this.httpService
      .get<ApiResponse<PaginatedResponse<Article>>>('/api/content/articles', {
        type_id: typeId,
        page: this.page(),
        pageSize: this.pageSize(),
        status: 10
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.libs.set(response.data.dataList)
            // Set pagination info from API response
            this.totalRecords.set(response.data.pagination.total)
          }
        },
        error: (err) => {
          console.error('Failed to load daily lib articles:', err)
        }
      })
  }

  onSearch() {
    this.page.set(1)
    this.loadArticlesByTypeId(this.getCurrentTypeId())
  }

  onPageChange(event: any) {
    this.page.set(Math.floor(event.first / event.rows) + 1)
    this.pageSize.set(event.rows)
    this.loadArticlesByTypeId(this.getCurrentTypeId())
  }

  /**
   * Get current type_id from loaded articles
   */
  private getCurrentTypeId(): number {
    const articles = this.libs()
    return articles.length > 0 ? articles[0].type_id || 0 : 0
  }

  gotoDetail(url: string) {
    this.router.navigate(['/daily-lib', url])
  }
}
