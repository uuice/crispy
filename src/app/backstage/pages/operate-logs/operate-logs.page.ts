import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { HttpService } from '../../services/http.service'
import { MessageService } from 'primeng/api'
import { OperateLogDetailComponent } from './operate-log-detail.component'

interface OperateLog {
  id: number
  code: string
  content: string
  type_id: number
  user_id: number
  create_time: number
  update_time: number
  is_delete: number
}

interface OperateLogsResponse {
  success: boolean
  message: string
  data: {
    dataList: OperateLog[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

@Component({
  selector: 'cs-operate-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    OperateLogDetailComponent
  ],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>操作日志</h1>
      </div>
      <p-toast></p-toast>

      <p-table
        [value]="logs()"
        [paginator]="true"
        [rows]="20"
        [lazy]="true"
        [totalRecords]="totalRecords()"
        [loading]="loading()"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条页面"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        scrollable="true"
        selectionMode="single"
        (onPageChange)="onPageChange($event)"
        (onLazyLoad)="loadLogsLazy($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="search-code" class="sr-only">操作类型</label>
              <input
                pInputText
                [ngModel]="searchCode()"
                (ngModelChange)="searchCode.set($event)"
                placeholder="操作类型"
              />
              <label for="search-user-id" class="sr-only">用户ID</label>
              <input
                pInputText
                [ngModel]="searchUserId()"
                (ngModelChange)="searchUserId.set($event)"
                placeholder="用户ID"
                type="number"
              />
              <label for="search-keyword" class="sr-only">关键字</label>
              <input
                pInputText
                [ngModel]="searchKeyword()"
                (ngModelChange)="searchKeyword.set($event)"
                placeholder="关键字"
              />
              <label for="search-start-time" class="sr-only">开始时间</label>
              <input
                pInputText
                [ngModel]="searchStartTime()"
                (ngModelChange)="searchStartTime.set($event)"
                placeholder="开始时间(时间戳)"
                type="number"
              />
              <label for="search-end-time" class="sr-only">结束时间</label>
              <input
                pInputText
                [ngModel]="searchEndTime()"
                (ngModelChange)="searchEndTime.set($event)"
                placeholder="结束时间(时间戳)"
                type="number"
              />
            </div>
            <div class="search-actions">
              <p-button label="重置" severity="secondary" (click)="onReset()"></p-button>
              <p-button
                label="查询"
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
            <th style="min-width: 10rem;">操作类型</th>
            <th style="min-width: 8rem;">用户ID</th>
            <th style="min-width: 8rem;">类型ID</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 16rem;">内容摘要</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-log>
          <tr>
            <td>{{ log.id }}</td>
            <td>{{ log.code }}</td>
            <td>{{ log.user_id }}</td>
            <td>{{ log.type_id }}</td>
            <td>{{ log.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>
              {{ log.content.length > 40 ? (log.content | slice: 0 : 40) + '...' : log.content }}
            </td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <p-button icon="pi pi-eye" label="查看" (click)="openDetail(log)"></p-button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center">暂无日志</td>
          </tr>
        </ng-template>
      </p-table>
      <cs-operate-log-detail
        [log]="selectedLog()"
        [visible]="detailVisible"
        (closed)="detailVisible.set(false)"
      ></cs-operate-log-detail>
    </div>
  `,
  styles: []
})
export class OperateLogsPage implements OnInit {
  logs: WritableSignal<OperateLog[]> = signal([])
  loading = signal(false)
  totalRecords = signal(0)
  currentPage = signal(1)
  pageSize = signal(20)
  searchCode = signal('')
  searchUserId = signal('')
  searchKeyword = signal('')
  searchStartTime = signal('')
  searchEndTime = signal('')
  selectedLog = signal<OperateLog | null>(null)
  detailVisible = signal(false)

  private httpService = inject(HttpService)
  private messageService = inject(MessageService)

  ngOnInit() {
    this.loadLogs()
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadLogs()
  }

  onReset() {
    this.searchCode.set('')
    this.searchUserId.set('')
    this.searchKeyword.set('')
    this.searchStartTime.set('')
    this.searchEndTime.set('')
    this.currentPage.set(1)
    this.loadLogs()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadLogs()
  }

  loadLogsLazy(event: any) {
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadLogs()
  }

  loadLogs() {
    this.loading.set(true)
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }
    if (this.searchCode()) params.code = this.searchCode()
    if (this.searchUserId()) params.user_id = Number(this.searchUserId())
    if (this.searchKeyword()) params.content = this.searchKeyword()
    if (this.searchStartTime()) params.start_time = Number(this.searchStartTime())
    if (this.searchEndTime()) params.end_time = Number(this.searchEndTime())
    this.httpService.get<OperateLogsResponse>('/api/admin/operate-logs', params).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.logs.set(res.data.dataList)
          this.totalRecords.set(res.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: res.message || '获取日志失败'
          })
        }
        this.loading.set(false)
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: '错误', detail: '获取日志失败' })
        this.loading.set(false)
      }
    })
  }

  openDetail(log: OperateLog) {
    this.selectedLog.set(log)
    this.detailVisible.set(true)
  }
}
