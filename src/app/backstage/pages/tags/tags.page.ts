import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
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
import { Tag, TagDetailComponent } from './tag-detail.component'

@Component({
  selector: 'cs-tags',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    TagDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>标签管理</h1>
        <p-button label="新建标签" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
      <p-table
        [value]="tags()"
        [lazy]="true"
        [loading]="loading()"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="total()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条"
        (onLazyLoad)="onLazyLoad($event)"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        selectionMode="single"
        scrollable="true"
        styleClass="p-datatable-sm"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="colgroup">
          <colgroup>
            <col style="min-width: 12rem;" />
            <col style="min-width: 8rem;" />
            <col style="min-width: 6rem;" />
            <col style="min-width: 6rem;" />
            <col style="min-width: 5rem;" />
            <col style="min-width: 10rem;" />
            <col style="min-width: 8rem;" />
          </colgroup>
        </ng-template>
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <div class="search-item">
                <label for="title-search" class="sr-only">标签名称</label>
                <input
                  id="title-search"
                  type="text"
                  pInputText
                  [ngModel]="searchTitle()"
                  (ngModelChange)="searchTitle.set($event)"
                  placeholder="搜索标签名称"
                  class="search-input"
                />
              </div>
              <div class="search-item">
                <label for="status-filter" class="sr-only">状态筛选</label>
                <p-select
                  id="status-filter"
                  [options]="statusOptions"
                  [ngModel]="searchStatus()"
                  (ngModelChange)="searchStatus.set($event)"
                  placeholder="选择状态"
                  [showClear]="true"
                  optionLabel="label"
                  optionValue="value"
                  class="search-dropdown"
                ></p-select>
              </div>
            </div>
            <div class="search-actions">
              <p-button
                label="搜索"
                icon="pi pi-search"
                (click)="searchTags()"
                [loading]="loading()"
              ></p-button>
              <p-button
                label="重置"
                icon="pi pi-refresh"
                severity="secondary"
                (click)="resetSearch()"
              ></p-button>
            </div>
          </div>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th>名称</th>
            <th>别名(Value)</th>
            <th>描述</th>
            <th>值</th>
            <th>分类ID</th>
            <th>状态</th>
            <th>排序</th>
            <th>创建时间</th>
            <th alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData>
          <tr>
            <td>{{ rowData.title }}</td>
            <td>{{ rowData.value }}</td>
            <td>{{ rowData.des || '-' }}</td>
            <td>{{ rowData.value || '-' }}</td>
            <td>{{ rowData.type_id || '-' }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(rowData.status)"
                [value]="getStatusText(rowData.status)"
              ></p-tag>
            </td>
            <td>{{ rowData.sort }}</td>
            <td>{{ rowData.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(rowData)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(rowData)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="9" class="text-center">暂无标签数据</td>
          </tr>
        </ng-template>
      </p-table>
      @if (isDetailVisible()) {
        <cs-tag-detail
          [tag]="selectedTag()"
          [mode]="selectedTag() ? 'edit' : 'create'"
          (saved)="onTagSaved()"
          (cancelled)="onTagCancelled()"
        ></cs-tag-detail>
      }
    </div>
  `
})
export class TagsPage implements OnInit {
  tags = signal<Tag[]>([])
  loading = signal(false)
  total = signal(0)
  selectedTag = signal<Tag | null>(null)
  isDetailVisible = signal(false)
  page = signal(1)
  pageSize = signal(10)
  searchTitle = signal('')
  searchStatus = signal<number | null>(null)

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadTags()
    })
  }

  loadTags(page = 1, pageSize = 10) {
    this.loading.set(true)
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    if (this.searchTitle()) {
      params.append('title', this.searchTitle())
    }
    if (this.searchStatus() !== null) {
      params.append('status', this.searchStatus()!.toString())
    }
    this.httpService.get<any>(`/api/admin/tags?${params.toString()}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.tags.set(response.data.dataList || [])
          this.total.set(response.data.pagination?.total || 0)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '加载标签列表失败'
          })
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载标签列表失败'
        })
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  searchTags() {
    this.page.set(1)
    this.loadTags(this.page(), this.pageSize())
  }

  resetSearch() {
    this.searchTitle.set('')
    this.searchStatus.set(null)
    this.page.set(1)
    this.loadTags(this.page(), this.pageSize())
  }

  onLazyLoad(event: any) {
    const page = Math.floor(event.first / event.rows) + 1
    const pageSize = event.rows
    this.page.set(page)
    this.pageSize.set(pageSize)
    this.loadTags(page, pageSize)
  }

  getStatusSeverity(status: number): string {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  openCreateDialog() {
    this.selectedTag.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(tag: Tag) {
    this.selectedTag.set(tag)
    this.isDetailVisible.set(true)
  }

  onTagSaved() {
    this.loadTags(this.page(), this.pageSize())
    this.selectedTag.set(null)
    this.isDetailVisible.set(false)
  }

  onTagCancelled() {
    this.selectedTag.set(null)
    this.isDetailVisible.set(false)
  }

  confirmDelete(tag: Tag) {
    this.confirmationService.confirm({
      message: `确定要删除标签 "${tag.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTag(tag.id)
      }
    })
  }

  deleteTag(id: number) {
    this.httpService.delete<any>(`/api/admin/tags/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '标签删除成功'
          })
          this.loadTags(this.page(), this.pageSize())
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除标签失败'
          })
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '删除标签失败'
        })
      }
    })
  }

  onPageChange(event: any) {
    this.page.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadTags(this.page(), this.pageSize())
  }
}
