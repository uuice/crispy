import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { LinkDetailComponent } from './link-detail.component'

interface FriendLink {
  id: number
  title: string
  url: string
  description?: string
  logo?: string
  sort: number
  status: number
  type_id?: number
  create_time: number
  update_time: number
}

interface Category {
  id: number
  title: string
  alias: string
  des?: string
  parent_id: number
  sort: number
  status: number
  create_time: number
  update_time: number
  children?: Category[]
}

interface FriendLinksResponse {
  success: boolean
  message: string
  data: {
    dataList: FriendLink[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

@Component({
  selector: 'cs-links',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    LinkDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>友情链接管理</h1>
        <p-button label="创建链接" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="friendLinks()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条链接"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadFriendLinksLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="link-search-keyword" class="sr-only">链接名称</label>
              <input
                id="link-search-keyword"
                pInputText
                type="text"
                [(ngModel)]="titleValue"
                placeholder="链接名称"
              />
              <label for="link-category-select" class="sr-only">分类</label>
              <p-select
                id="link-category-select"
                [options]="categoryOptions()"
                [(ngModel)]="categoryValue"
                optionLabel="title"
                optionValue="id"
                placeholder="选择分类"
                [showClear]="true"
              />
              <label for="link-status-select" class="sr-only">状态</label>
              <p-select
                id="link-status-select"
                [options]="statusOptions()"
                [(ngModel)]="statusValue"
                optionLabel="label"
                optionValue="value"
                placeholder="状态"
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
            <th style="min-width: 10rem;">链接名称</th>
            <th style="min-width: 15rem;">URL</th>
            <th style="min-width: 15rem;">描述</th>
            <th style="min-width: 8rem;">分类</th>
            <th style="min-width: 6rem;">排序</th>
            <th style="min-width: 8rem;">状态</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-link>
          <tr>
            <td>{{ link.id }}</td>
            <td>{{ link.title }}</td>
            <td>
              <a [href]="link.url" target="_blank" class="link-url">{{ link.url }}</a>
            </td>
            <td>{{ link.description || '-' }}</td>
            <td>
              <p-tag [value]="getCategoryName(link.type_id)" severity="info" size="small"></p-tag>
            </td>
            <td>{{ link.sort }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(link.status)"
                [value]="getStatusText(link.status)"
              ></p-tag>
            </td>
            <td>{{ link.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(link)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(link)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="9" class="text-center">没有找到友情链接。</td>
          </tr>
        </ng-template>
      </p-table>

      @if (isDetailVisible()) {
        <cs-link-detail
          [friendLink]="selectedFriendLink()"
          [mode]="selectedFriendLink() ? 'edit' : 'create'"
          (saved)="onFriendLinkSaved($event)"
          (cancelled)="onFriendLinkCancelled()"
        ></cs-link-detail>
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
        margin-bottom: 1rem;
      }
      .search-controls {
        display: flex;
        gap: 1rem;
      }
      .search-actions {
        display: flex;
        gap: 0.5rem;
      }
      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }
      .link-url {
        color: var(--p-primary-color);
        text-decoration: none;
        word-break: break-all;
      }
      .link-url:hover {
        text-decoration: underline;
      }
    `
  ]
})
export class LinksPage implements OnInit {
  friendLinks: WritableSignal<FriendLink[]> = signal([])
  categories: WritableSignal<Category[]> = signal([])
  loading = signal(false)
  title = signal('')
  selectedCategory = signal<number | null>(null)
  selectedStatus = signal<number | null>(null)
  selectedFriendLink = signal<FriendLink | null>(null)
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)
  isDetailVisible = signal(false)

  statusOptions = signal([
    { label: '全部状态', value: null },
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ])

  categoryOptions = signal<Category[]>([])

  get titleValue() {
    return this.title()
  }
  set titleValue(val: string) {
    this.title.set(val)
  }

  get categoryValue() {
    return this.selectedCategory()
  }
  set categoryValue(val: number | null) {
    this.selectedCategory.set(val)
  }

  get statusValue() {
    return this.selectedStatus()
  }
  set statusValue(val: number | null) {
    this.selectedStatus.set(val)
  }

  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)
  private httpService = inject(HttpService)

  constructor() {}

  ngOnInit() {
    this.loadCategories()
    this.loadFriendLinks()
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadFriendLinks()
  }

  loadFriendLinksLazy(event: any) {
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadFriendLinks()
  }

  loadCategories() {
    // Load categories tree with alias LINK_SYS_CAT
    this.httpService.get<any>('/api/admin/categories/tree', { alias: 'LINK_SYS_CAT' }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories.set(response.data || [])
          // Flatten the tree structure for select options
          const flatCategories = this.flattenCategories(response.data || [])
          this.categoryOptions.set(flatCategories)
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

  loadFriendLinks() {
    this.loading.set(true)
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }

    if (this.title()) {
      params.site_name = this.title()
    }
    if (this.selectedCategory() !== null) {
      params.type_id = this.selectedCategory()
    }
    if (this.selectedStatus() !== null) {
      params.status = this.selectedStatus()
    }

    this.httpService.get<FriendLinksResponse>('/api/admin/links', params).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Transform the response to match our interface
          const transformedLinks = response.data.dataList.map((link: any) => ({
            id: link.id,
            title: link.site_name,
            url: link.url,
            description: link.des,
            logo: link.logo,
            sort: link.sort,
            status: link.status,
            type_id: link.type_id,
            create_time: link.create_time,
            update_time: link.update_time
          }))
          this.friendLinks.set(transformedLinks)
          this.totalRecords.set(response.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取友情链接列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading friend links:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取友情链接列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  getStatusSeverity(status: number): string {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return '未分类'
    const category = this.categories().find((c) => c.id === categoryId)
    return category ? category.title : '未知分类'
  }

  openCreateDialog() {
    this.selectedFriendLink.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(link: FriendLink) {
    this.selectedFriendLink.set({ ...link })
    this.isDetailVisible.set(true)
  }

  onFriendLinkSaved(linkData: Partial<FriendLink>) {
    // Transform the data to match the backend API
    const transformedData = {
      site_name: linkData.title,
      url: linkData.url,
      des: linkData.description || '',
      logo: linkData.logo || '',
      type_id: linkData.type_id || 0,
      sort: linkData.sort || 0,
      status: linkData.status || 10
    }

    const apiCall = linkData.id
      ? this.httpService.put<any>(`/api/admin/links/${linkData.id}`, transformedData)
      : this.httpService.post<any>('/api/admin/links', transformedData)

    const action = linkData.id ? '更新' : '创建'

    apiCall.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: `友情链接${action}成功`
          })
          this.isDetailVisible.set(false)
          this.loadFriendLinks()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || `${action}友情链接失败`
          })
        }
      },
      error: (error) => {
        console.error(`Failed to ${action.toLowerCase()} friend link:`, error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || `${action}友情链接失败`
        })
      }
    })
  }

  onFriendLinkCancelled() {
    this.isDetailVisible.set(false)
  }

  confirmDelete(link: FriendLink) {
    this.confirmationService.confirm({
      message: `确定要删除友情链接 "${link.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFriendLink(link.id)
      }
    })
  }

  deleteFriendLink(id: number) {
    this.httpService.delete<any>(`/api/admin/links/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '友情链接删除成功'
          })
          this.loadFriendLinks()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除友情链接失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete friend link:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '删除友情链接失败'
        })
      }
    })
  }

  resetFilters() {
    this.title.set('')
    this.selectedCategory.set(null)
    this.selectedStatus.set(null)
    this.currentPage.set(1)
    this.loadFriendLinks()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadFriendLinks()
  }
}
