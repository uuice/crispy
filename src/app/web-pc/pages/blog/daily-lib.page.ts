import {
  Component,
  signal,
  computed,
  OnInit,
  inject,
  OnDestroy,
  PLATFORM_ID,
  TransferState,
  makeStateKey
} from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule, isPlatformServer } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { PaginatorModule } from 'primeng/paginator'
import { TagModule } from 'primeng/tag'
import { HttpService } from '../../services/http.service'
import { Subject } from 'rxjs'

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
  tagRef?: { [key: string]: string }
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
          (ngModelChange)="onSearchChange($event)"
          (keyup.enter)="onSearchButtonClick()"
          placeholder="搜索库名称"
        />
        <button
          pButton
          type="button"
          label="搜索"
          icon="pi pi-search"
          (click)="onSearchButtonClick()"
        ></button>
      </div>
      <div class="card-list">
        <div *ngIf="loading()" class="loading-message">
          <i class="pi pi-spin pi-spinner"></i> 加载中...
        </div>
        <div *ngIf="!loading() && pagedList().length === 0" class="empty-message">
          <i class="pi pi-search"></i>
          <p>没有找到相关的库</p>
        </div>
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
      // @media (min-width: 1000px) {
      //   .card-item {
      //     flex: 1 1 31%;
      //     max-width: 31%;
      //   }
      // }
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

      .loading-message {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;
        color: var(--p-text-muted-color);
        font-size: 16px;
        gap: 8px;
      }

      .empty-message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 60px 20px;
        color: var(--p-text-muted-color);
        text-align: center;
      }

      .empty-message i {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-message p {
        font-size: 16px;
        margin: 0;
      }
    `
  ]
})
export class DailyLibPage implements OnInit, OnDestroy {
  private httpService = inject(HttpService)
  private platformId = inject(PLATFORM_ID)
  private transferState = inject(TransferState)
  private destroy$ = new Subject<void>()

  private readonly LIBS_KEY = makeStateKey<Article[]>('dailyLibs')

  libs = signal<Article[]>([])
  search = signal('')
  page = signal(1)
  pageSize = signal(10)
  totalRecords = signal(0)
  currentTypeId = signal<number>(0)
  loading = signal(false)

  pagedList = computed(() => {
    return this.libs()
  })

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()) || 1)

  constructor(private router: Router) {}

  ngOnInit() {
    // 优先从 TransferState 读取
    const cachedLibs = this.transferState.get(this.LIBS_KEY, null)
    if (cachedLibs) {
      this.libs.set(cachedLibs)
      return
    }
    this.loadDailyLibs()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
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
            this.currentTypeId.set(category.id)
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
    this.loading.set(true)

    const params: any = {
      type_id: typeId,
      page: this.page(),
      pageSize: this.pageSize(),
      status: 10
    }

    // Add search parameter if search term exists
    if (this.search().trim()) {
      params.title = this.search().trim()
    }

    this.httpService
      .get<ApiResponse<PaginatedResponse<Article>>>('/api/content/articles', params)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.libs.set(response.data.dataList)
            // Set pagination info from API response
            this.totalRecords.set(response.data.pagination.total)
            if (isPlatformServer(this.platformId) && this.page() === 1 && !this.search().trim()) {
              this.transferState.set(this.LIBS_KEY, response.data.dataList)
            }
          }
          this.loading.set(false)
        },
        error: (err) => {
          console.error('Failed to load daily lib articles:', err)
          this.loading.set(false)
        }
      })
  }

  onSearchChange(value: string) {
    this.search.set(value)
  }

  onSearchButtonClick() {
    this.page.set(1)
    this.loadArticlesByTypeId(this.currentTypeId())
  }

  onPageChange(event: any) {
    this.page.set(Math.floor(event.first / event.rows) + 1)
    this.pageSize.set(event.rows)
    this.loadArticlesByTypeId(this.currentTypeId())
  }

  gotoDetail(url: string) {
    this.router.navigate(['/daily-lib', url])
  }
}
