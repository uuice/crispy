import { Component, OnInit, signal } from '@angular/core'
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
import { HolidayDetailComponent } from './holiday-detail.component'

interface Holiday {
  id: number
  title: string
  value: string
  sort: number
  create_time: number
  update_time: number
  is_delete: number
}

@Component({
  selector: 'cs-holidays',
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
    HolidayDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>假期管理</h1>
        <p-button label="创建假期" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="holidays()"
        [lazy]="true"
        [loading]="loading()"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="total()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条假期"
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
            <col style="min-width: 15rem;" />
            <col style="min-width: 8rem;" />
            <col style="min-width: 10rem;" />
            <col style="min-width: 8rem;" />
          </colgroup>
        </ng-template>

        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <div class="search-item">
                <label for="name-search" class="sr-only">假期名称</label>
                <input
                  id="name-search"
                  type="text"
                  pInputText
                  [(ngModel)]="searchFilters.title"
                  placeholder="搜索假期名称"
                  class="search-input"
                />
              </div>
              <div class="search-item">
                <label for="value-search" class="sr-only">假期日期</label>
                <input
                  id="value-search"
                  type="text"
                  pInputText
                  [(ngModel)]="searchFilters.value"
                  placeholder="搜索假期日期"
                  class="search-input"
                />
              </div>
            </div>
            <div class="search-actions">
              <p-button
                label="搜索"
                icon="pi pi-search"
                (click)="searchHolidays()"
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
            <th>假期名称</th>
            <th>假期日期</th>
            <th>排序</th>
            <th>创建时间</th>
            <th alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData>
          <tr>
            <td>{{ rowData.title }}</td>
            <td>
              <div class="holiday-dates">
                @for (date of getHolidayDates(rowData.value); track date) {
                  <span class="date-tag">{{ date }}</span>
                }
              </div>
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
            <td colspan="5" class="text-center">暂无假期数据</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Holiday Detail Component -->
      @if (isDetailVisible()) {
        <cs-holiday-detail
          [holiday]="selectedHoliday()"
          [mode]="selectedHoliday() ? 'edit' : 'create'"
          (saved)="onHolidaySaved()"
          (cancelled)="onHolidayCancelled()"
        ></cs-holiday-detail>
      }
    </div>
  `,
  styles: [
    `
      .date-tag {
        background-color: #e3f2fd;
        color: #1976d2;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
        border: 1px solid #bbdefb;
      }
    `
  ]
})
export class HolidayPage implements OnInit {
  holidays = signal<Holiday[]>([])
  loading = signal(false)
  total = signal(0)
  selectedHoliday = signal<Holiday | null>(null)
  isDetailVisible = signal(false)
  page = 1
  pageSize = 10

  searchFilters = {
    title: '',
    value: ''
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {}

  loadHolidays(page = 1, pageSize = 10) {
    this.loading.set(true)

    // Build query parameters
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())

    if (this.searchFilters.title) {
      params.append('title', this.searchFilters.title)
    }
    if (this.searchFilters.value) {
      params.append('value', this.searchFilters.value)
    }

    this.httpService.get<any>(`/api/admin/holidays?${params.toString()}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.holidays.set(response.data.dataList || [])
          this.total.set(response.data.pagination?.total || 0)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '加载假期列表失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to load holidays:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载假期列表失败'
        })
        this.loading.set(false)
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  searchHolidays() {
    this.page = 1
    this.loadHolidays(this.page, this.pageSize)
  }

  resetSearch() {
    this.searchFilters = {
      title: '',
      value: ''
    }
    this.page = 1
    this.loadHolidays(this.page, this.pageSize)
  }

  onLazyLoad(event: any) {
    const page = Math.floor(event.first / event.rows) + 1
    const pageSize = event.rows
    this.page = page
    this.pageSize = pageSize
    this.loadHolidays(page, pageSize)
  }

  getHolidayDates(value: string): string[] {
    if (!value) return []
    return value
      .split(',')
      .map((date) => date.trim())
      .filter((date) => date)
  }

  openCreateDialog() {
    this.selectedHoliday.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(holiday: Holiday) {
    this.selectedHoliday.set(holiday)
    this.isDetailVisible.set(true)
  }

  onHolidaySaved() {
    this.loadHolidays(this.page, this.pageSize)
    this.selectedHoliday.set(null)
    this.isDetailVisible.set(false)
  }

  onHolidayCancelled() {
    this.selectedHoliday.set(null)
    this.isDetailVisible.set(false)
  }

  confirmDelete(holiday: Holiday) {
    this.confirmationService.confirm({
      message: `确定要删除假期 "${holiday.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteHoliday(holiday.id)
      }
    })
  }

  deleteHoliday(id: number) {
    this.httpService.delete<any>(`/api/admin/holidays/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '假期删除成功'
          })
          this.loadHolidays(this.page, this.pageSize)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除假期失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete holiday:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '删除假期失败'
        })
      }
    })
  }

  onPageChange(event: any) {
    this.page = event.page + 1
    this.pageSize = event.rows
    this.loadHolidays(this.page, this.pageSize)
  }
}
