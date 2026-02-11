import { Component, OnInit, signal, WritableSignal } from '@angular/core'
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
import { AdItemDetailComponent } from './ad-item-detail.component'
import { AdItemEntity } from '@src/types'

interface AdsOption {
  id: number
  title: string
}

@Component({
  selector: 'cs-ad-items',
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
    AdItemDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>广告项管理</h1>
        <p-button label="新增广告项" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
      <p-table
        [value]="adItems()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条广告项"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadAdItemsLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <p-select
                [options]="adsOptions()"
                [ngModel]="selectedAdId()"
                (ngModelChange)="selectedAdId.set($event)"
                optionLabel="title"
                optionValue="id"
                placeholder="选择广告"
                [showClear]="true"
              ></p-select>
              <input
                pInputText
                type="text"
                [ngModel]="searchTitle()"
                (ngModelChange)="searchTitle.set($event)"
                placeholder="广告项标题"
              />
              <p-select
                [options]="statusOptions"
                [ngModel]="searchStatus()"
                (ngModelChange)="searchStatus.set($event)"
                optionLabel="label"
                optionValue="value"
                placeholder="状态"
              ></p-select>
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
            <th>ID</th>
            <th>广告</th>
            <th>标题</th>
            <th>内容</th>
            <th>图片</th>
            <th>链接</th>
            <th>打开方式</th>
            <th>状态</th>
            <th>排序</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ getAdTitle(item.ad_id) }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.content || '-' }}</td>
            <td>
              @if (item.image_url) {
                @for (img of item.image_url.split(','); track img) {
                  <img [src]="img" style="max-width:40px;max-height:30px;margin-right:2px;" />
                }
              }
            </td>
            <td>
              <a [href]="item.url" target="_blank">{{ item.url }}</a>
            </td>
            <td>{{ getMethodText(item.method) }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(item.status)"
                [value]="getStatusText(item.status)"
              ></p-tag>
            </td>
            <td>{{ item.sort }}</td>
            <td>{{ item.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(item)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(item)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="11" class="text-center">没有找到广告项。</td>
          </tr>
        </ng-template>
      </p-table>
      @if (isDetailVisible()) {
        <cs-ad-item-detail
          [adItem]="selectedAdItem()"
          [mode]="selectedAdItem() ? 'edit' : 'create'"
          [adsOptions]="adsOptions()"
          (saved)="onAdItemSaved($event)"
          (cancelled)="onAdItemCancelled()"
        ></cs-ad-item-detail>
      }
    </div>
  `,
  styles: []
})
export class AdItemsPage implements OnInit {
  adItems: WritableSignal<AdItemEntity[]> = signal([])
  adsOptions: WritableSignal<AdsOption[]> = signal([])
  loading = signal(false)
  totalRecords = signal(0)
  selectedAdId = signal<number | null>(null)
  searchTitle = signal('')
  searchStatus = signal<number | null>(null)
  selectedAdItem = signal<AdItemEntity | null>(null)
  isDetailVisible = signal(false)
  currentPage = signal(1)
  pageSize = signal(20)

  statusOptions = [
    { label: '全部状态', value: null },
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadAdsOptions()
    this.loadAdItems()
  }

  loadAdsOptions() {
    this.httpService.get<any>('/api/admin/ads', { page: 1, pageSize: 1000 }).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.dataList) {
          this.adsOptions.set(res.data.dataList.map((ad: any) => ({ id: ad.id, title: ad.title })))
        }
      }
    })
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadAdItems()
  }

  loadAdItemsLazy(event: any) {
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadAdItems()
  }

  loadAdItems() {
    this.loading.set(true)
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }
    if (this.selectedAdId()) params.ad_id = this.selectedAdId()
    if (this.searchTitle()) params.title = this.searchTitle()
    if (this.searchStatus() !== null) params.status = this.searchStatus()
    this.httpService.get<any>('/api/admin/ad-items', params).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.dataList) {
          this.adItems.set(res.data.dataList)
          this.totalRecords.set(res.data.pagination.total)
        } else {
          this.adItems.set([])
          this.totalRecords.set(0)
        }
        this.loading.set(false)
      },
      error: () => {
        this.loading.set(false)
      }
    })
  }

  getAdTitle(ad_id: number): string {
    const ad = this.adsOptions().find((a) => a.id === ad_id)
    return ad ? ad.title : '未知广告'
  }

  getMethodText(method: string): string {
    if (method === '1') return '文章详情'
    if (method === '5') return '外链'
    return method
  }

  getStatusSeverity(status: number) {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  openCreateDialog() {
    this.selectedAdItem.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(item: AdItemEntity) {
    this.selectedAdItem.set({ ...item })
    this.isDetailVisible.set(true)
  }

  onAdItemSaved(itemData: Partial<AdItemEntity>) {
    const apiCall = itemData.id
      ? this.httpService.put<any>(`/api/admin/ad-items/${itemData.id}`, itemData)
      : this.httpService.post<any>('/api/admin/ad-items', itemData)
    const action = itemData.id ? '更新' : '创建'
    apiCall.subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: `广告项${action}成功`
          })
          this.isDetailVisible.set(false)
          this.loadAdItems()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: res.message || `${action}失败`
          })
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: err.error?.message || `${action}失败`
        })
      }
    })
  }

  onAdItemCancelled() {
    this.isDetailVisible.set(false)
  }

  confirmDelete(item: AdItemEntity) {
    this.confirmationService.confirm({
      message: `确定要删除广告项 "${item.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAdItem(item.id)
      }
    })
  }

  deleteAdItem(id: number) {
    this.httpService.delete<any>(`/api/admin/ad-items/${id}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '广告项删除成功'
          })
          this.loadAdItems()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: res.message || '删除失败'
          })
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: err.error?.message || '删除失败'
        })
      }
    })
  }

  resetFilters() {
    this.selectedAdId.set(null)
    this.searchTitle.set('')
    this.searchStatus.set(null)
    this.currentPage.set(1)
    this.loadAdItems()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadAdItems()
  }
}
