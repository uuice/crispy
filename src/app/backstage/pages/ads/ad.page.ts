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
import { AdDetailComponent } from './ad-detail.component'
import { AdItemListDialogComponent } from './ad-item-list-dialog.component'
import { AdEntity } from '@src/types'

@Component({
  selector: 'cs-ads',
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
    AdDetailComponent,
    AdItemListDialogComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>广告管理</h1>
        <p-button label="新增广告" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="ads()"
        [paginator]="true"
        [rows]="pageSize()"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条广告"
        [rowsPerPageOptions]="[10, 20, 50]"
        [loading]="loading()"
        [lazy]="true"
        (onLazyLoad)="onLazyLoad($event)"
        [globalFilterFields]="['title', 'alias', 'position']"
        styleClass="p-datatable-sm"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <span class="p-input-icon-left">
              <input
                pInputText
                type="text"
                [ngModel]="searchTitle()"
                (ngModelChange)="searchTitle.set($event)"
                placeholder="广告标题/别名/位置"
                (keydown.enter)="onSearch()"
              />
            </span>
            <p-select
              [options]="statusOptions"
              [ngModel]="searchStatus()"
              (ngModelChange)="searchStatus.set($event)"
              placeholder="状态"
            ></p-select>
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
            <th>标题</th>
            <th>别名</th>
            <th>类型ID</th>
            <th>内容</th>
            <th>图片</th>
            <th>链接</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>状态</th>
            <th>排序</th>
            <th>操作</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-ad>
          <tr>
            <td>{{ ad.title }}</td>
            <td>{{ ad.alias || '-' }}</td>
            <td>{{ ad.type_id || '-' }}</td>
            <td>{{ ad.content || '-' }}</td>
            <td>
              @if (ad.image_url) {
                <img [src]="ad.image_url" alt="广告图片" style="max-width:60px;max-height:40px;" />
              }
            </td>
            <td>
              @if (ad.url) {
                <a [href]="ad.url" target="_blank">{{ ad.url }}</a>
              }
            </td>
            <td>{{ ad.start_time ? (ad.start_time | date: 'yyyy-MM-dd HH:mm') : '-' }}</td>
            <td>{{ ad.end_time ? (ad.end_time | date: 'yyyy-MM-dd HH:mm') : '-' }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(ad.status)"
                [value]="getStatusText(ad.status)"
              ></p-tag>
            </td>
            <td>{{ ad.sort }}</td>
            <td>
              <div class="action-buttons">
                <p-button
                  icon="pi pi-eye"
                  pTooltip="查看详情"
                  tooltipPosition="top"
                  (click)="openAdItemListDialog(ad)"
                ></p-button>
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(ad)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(ad)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="11" class="text-center">暂无广告数据</td>
          </tr>
        </ng-template>
      </p-table>

      @if (isDetailVisible()) {
        <cs-ad-detail
          [ad]="selectedAd()"
          [mode]="selectedAd() ? 'edit' : 'create'"
          (saved)="onAdSaved()"
          (cancelled)="onAdCancelled()"
        ></cs-ad-detail>
      }

      @if (isAdItemListVisible()) {
        <cs-ad-item-list-dialog
          [adId]="selectedAdId()"
          [visible]="isAdItemListVisible()"
        ></cs-ad-item-list-dialog>
      }
    </div>
  `,
  styles: [``]
})
export class AdvertisementsPage implements OnInit {
  ads: WritableSignal<AdEntity[]> = signal([])
  loading = signal(false)
  pageSize = signal(10)
  totalRecords = signal(0)
  searchTitle = signal('')
  searchStatus = signal<number | null>(null)
  isDetailVisible = signal(false)
  selectedAd = signal<AdEntity | null>(null)
  isAdItemListVisible = signal(false)
  selectedAdId = signal(0)

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
    this.loadAds()
  }

  loadAds(page: number = 1) {
    this.loading.set(true)
    const params: any = {
      page,
      pageSize: this.pageSize()
    }
    if (this.searchTitle()) params.title = this.searchTitle()
    if (this.searchStatus() !== null) params.status = this.searchStatus()
    this.httpService.get<any>('/api/admin/ads', params).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.ads.set(res.data.dataList)
          this.totalRecords.set(res.data.pagination.total)
        } else {
          this.ads.set([])
          this.totalRecords.set(0)
        }
        this.loading.set(false)
      },
      error: () => {
        this.ads.set([])
        this.totalRecords.set(0)
        this.loading.set(false)
      }
    })
  }

  openCreateDialog() {
    this.selectedAd.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(ad: AdEntity) {
    this.selectedAd.set({ ...ad })
    this.isDetailVisible.set(true)
  }

  onAdSaved() {
    this.isDetailVisible.set(false)
    this.selectedAd.set(null)
    this.loadAds()
  }

  onAdCancelled() {
    this.isDetailVisible.set(false)
    this.selectedAd.set(null)
  }

  openAdItemListDialog(ad: AdEntity) {
    this.selectedAdId.set(ad.id)
    this.isAdItemListVisible.set(true)
  }

  onLazyLoad(event: any) {
    const page = event.first / event.rows + 1
    this.pageSize.set(event.rows)
    this.loadAds(page)
  }

  onSearch() {
    this.loadAds(1)
  }

  resetFilters() {
    this.searchTitle.set('')
    this.searchStatus.set(null)
    this.loadAds(1)
  }

  confirmDelete(ad: AdEntity) {
    this.confirmationService.confirm({
      message: `确定要删除广告 "${ad.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.httpService.delete<any>(`/api/admin/ads/${ad.id}`).subscribe({
          next: (res) => {
            if (res.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '广告删除成功'
              })
              this.loadAds()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: res.message || '删除失败'
              })
            }
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: '错误', detail: '删除失败' })
          }
        })
      }
    })
  }

  getStatusSeverity(status: number) {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }
}
