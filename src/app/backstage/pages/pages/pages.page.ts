import { Component, OnInit, signal, WritableSignal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { SelectModule } from 'primeng/select'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { AuthService } from '../../services/auth.service'
import { PageDetailComponent } from './page-detail.component'

interface Page {
  id: number
  title: string
  alias: string
  content: string
  abstract?: string
  sub_title?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  image_list?: string
  tags?: string
  remark?: string
  type_id?: number
  author_id?: number
  user_id?: number
  status: number // 10=正常，-10=禁用
  create_time: number
  update_time: number
  is_delete: number
  type?: {
    id: number
    title: string
  }
}

interface Category {
  id: number
  title: string
  alias?: string
  des?: string
  parent_id?: number
  sort?: number
  status?: number
  create_time: number
  update_time: number
  children?: Category[]
}

interface PagesResponse {
  success: boolean
  message: string
  data: {
    dataList: Page[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

interface CategoriesResponse {
  success: boolean
  message: string
  data: Category[]
}

@Component({
  selector: 'cs-pages',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    SelectModule,
    PageDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>页面管理</h1>
        <p-button label="新增页面" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="pages()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条页面"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadPagesLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="page-search-title" class="sr-only">标题</label>
              <input
                id="page-search-title"
                pInputText
                type="text"
                [(ngModel)]="title"
                placeholder="标题"
              />
              <label for="page-search-alias" class="sr-only">别名</label>
              <input
                id="page-search-alias"
                pInputText
                type="text"
                [(ngModel)]="alias"
                placeholder="别名"
              />
              <label for="page-status-select" class="sr-only">状态</label>
              <p-select
                id="page-status-select"
                [options]="statusOptions()"
                [(ngModel)]="statusValue"
                optionLabel="label"
                optionValue="value"
                placeholder="状态"
              />
              <label for="page-category-select" class="sr-only">分类</label>
              <p-select
                id="page-category-select"
                [options]="categoryOptions()"
                [(ngModel)]="categoryValue"
                optionLabel="label"
                optionValue="value"
                placeholder="分类"
              />
            </div>
            <div class="search-actions">
              <p-button label="重置" severity="secondary" (click)="resetFilters()"></p-button>
              <p-button
                label="搜索"
                icon="pi pi-search"
                (click)="onSearch()"
                [loading]="loading()"
              ></p-button>
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="header">
          <tr>
            <th style="min-width: 6rem;">ID</th>
            <th style="min-width: 12rem;">标题</th>
            <th style="min-width: 8rem;">别名</th>
            <th style="min-width: 8rem;">分类</th>
            <th style="min-width: 8rem;">状态</th>
            <th style="min-width: 12rem;">标签</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 14rem;">更新时间</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-page>
          <tr>
            <td>{{ page.id }}</td>
            <td>
              <div class="page-title">
                <span class="title-text" [pTooltip]="page.title" tooltipPosition="top">
                  {{ page.title }}
                </span>
                @if (page.sub_title) {
                  <div class="sub-title text-gray-500 text-sm">{{ page.sub_title }}</div>
                }
              </div>
            </td>
            <td>
              <span class="page-alias">{{ page.alias }}</span>
            </td>
            <td>
              @if (page.type?.title) {
                <span>{{ page.type.title }}</span>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(page.status)"
                [value]="getStatusText(page.status)"
              ></p-tag>
            </td>
            <td>
              @if (page.tags) {
                <div class="tags-container">
                  @for (tag of page.tags.split(','); track tag) {
                    @if (tag.trim()) {
                      <p-tag [value]="tag.trim()" severity="info" styleClass="mr-1 mb-1"></p-tag>
                    }
                  }
                </div>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>{{ page.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>{{ page.update_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(page)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(page)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="9" class="text-center">没有找到页面。</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Page Detail Component -->
      @if (isDetailVisible()) {
        <cs-page-detail
          [page]="selectedPage()"
          [mode]="selectedPage() ? 'edit' : 'create'"
          (saved)="onPageSaved($event)"
          (cancelled)="onPageCancelled()"
        ></cs-page-detail>
      }
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 1rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .page-header h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .search-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .search-controls {
        display: flex;
        gap: 1rem;
        flex: 1;
      }

      .search-actions {
        display: flex;
        gap: 0.5rem;
      }

      .page-title {
        .title-text {
          font-weight: 500;
          display: block;
          margin-bottom: 0.25rem;
        }

        .sub-title {
          font-size: 0.875rem;
        }
      }

      .page-alias {
        color: #6c757d;
        font-family: monospace;
        font-size: 0.875rem;
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }
    `
  ]
})
export class PagesPage implements OnInit {
  pages: WritableSignal<Page[]> = signal<Page[]>([])
  loading = signal(false)
  title = signal('')
  alias = signal('')
  selectedStatus = signal<number | null>(null)
  selectedCategory = signal<number | null>(null)
  selectedPage = signal<Page | null>(null)
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)
  categories = signal<Category[]>([])
  isDetailVisible = signal(false)

  statusOptions = signal([
    { label: '全部状态', value: null },
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ])

  categoryOptions = signal<{ label: string; value: number | null }[]>([
    { label: '全部分类', value: null }
  ])

  get statusValue() {
    return this.selectedStatus()
  }
  set statusValue(val: number | null) {
    this.selectedStatus.set(val)
  }

  get categoryValue() {
    return this.selectedCategory()
  }
  set categoryValue(val: number | null) {
    this.selectedCategory.set(val)
  }

  private authService = inject(AuthService)

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadPages()
    this.loadCategories()
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadPages()
  }

  loadPagesLazy(event: any) {
    // Update pagination from table event
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadPages()
  }

  loadPages() {
    this.loading.set(true)

    // Build query parameters
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }

    // Add search filters
    if (this.title()) {
      params.title = this.title()
    }

    if (this.alias()) {
      params.alias = this.alias()
    }

    if (this.selectedStatus() !== null) {
      params.status = this.selectedStatus()
    }

    if (this.selectedCategory() !== null) {
      params.type_id = this.selectedCategory()
    }

    // Call API to get pages
    this.httpService.get<PagesResponse>('/api/admin/pages', params).subscribe({
      next: (response) => {
        if (response.success === true && response.data) {
          this.pages.set(response.data.dataList)
          this.totalRecords.set(response.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取页面列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading pages:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取页面列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  loadCategories() {
    this.httpService
      .get<CategoriesResponse>('/api/admin/categories/tree', { alias: 'PAGE_SYS_CAT' })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categories.set(response.data)
            // Flatten categories for dropdown
            const flattenedCategories = this.flattenCategories(response.data)
            this.categoryOptions.set([
              { label: '全部分类', value: null },
              ...flattenedCategories.map((category) => ({
                label: category.title,
                value: category.id
              }))
            ])
          }
        },
        error: (error) => {
          console.error('Error loading categories:', error)
        }
      })
  }

  flattenCategories(categories: Category[]): Category[] {
    const result: Category[] = []
    const flatten = (cats: Category[]) => {
      cats.forEach((cat) => {
        result.push(cat)
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children)
        }
      })
    }
    flatten(categories)
    return result
  }

  getStatusSeverity(status: number): string {
    return status === 10 ? 'success' : 'warning'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  openCreateDialog() {
    this.selectedPage.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(page: Page) {
    // Get full page data for editing
    this.httpService.get<any>(`/api/admin/pages/${page.id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedPage.set(response.data)
          this.isDetailVisible.set(true)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取页面详情失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to get page details:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '获取页面详情失败'
        })
      }
    })
  }

  onPageSaved(pageData: Page) {
    if (pageData.id) {
      // Update page
      this.httpService.put<any>(`/api/admin/pages/${pageData.id}`, pageData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '页面更新成功'
            })
            this.selectedPage.set(null)
            this.isDetailVisible.set(false)
            this.loadPages()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '更新页面失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to update page:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '更新页面失败'
          })
        }
      })
    } else {
      // Create page
      this.httpService.post<any>('/api/admin/pages', pageData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '页面创建成功'
            })
            this.selectedPage.set(null)
            this.isDetailVisible.set(false)
            this.loadPages()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '创建页面失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to create page:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '创建页面失败'
          })
        }
      })
    }
  }

  onPageCancelled() {
    this.selectedPage.set(null)
    this.isDetailVisible.set(false)
  }

  confirmDelete(page: Page) {
    this.confirmationService.confirm({
      message: `确定要删除页面 "${page.title}" 吗？此操作不可恢复。`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePage(page.id)
      }
    })
  }

  deletePage(id: number) {
    this.httpService.delete<any>(`/api/admin/pages/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '页面删除成功'
          })
          this.loadPages()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除页面失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete page:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '删除页面失败'
        })
      }
    })
  }

  resetFilters() {
    this.title.set('')
    this.alias.set('')
    this.selectedStatus.set(null)
    this.selectedCategory.set(null)
    this.currentPage.set(1)
    this.loadPages()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadPages()
  }
}
