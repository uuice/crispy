import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { SelectModule } from 'primeng/select'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { AuthService } from '../../services/auth.service'
import { AppsDetailComponent } from './apps-detail.component'
import { AvatarModule } from 'primeng/avatar'

interface AccessToken {
  id: number
  app_name: string
  channel: string
  token: string
  status: number // 10=启用, -10=未启用
  create_time: number
  update_time: number
  is_delete: number
  user_id: number
}

interface AccessTokensResponse {
  success: boolean
  message: string
  data: {
    dataList: AccessToken[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

@Component({
  selector: 'cs-apps',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    SelectModule,
    AppsDetailComponent,
    AvatarModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>应用管理</h1>
        <p-button label="新增应用" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="accessTokens()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条应用"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadAccessTokensLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="app-name-search" class="sr-only">应用名称</label>
              <input
                id="app-name-search"
                pInputText
                type="text"
                [(ngModel)]="app_name"
                placeholder="应用名称"
              />
              <label for="channel-search" class="sr-only">渠道</label>
              <input
                id="channel-search"
                pInputText
                type="text"
                [(ngModel)]="channel"
                placeholder="渠道"
              />
              <label for="status-select" class="sr-only">状态</label>
              <p-select
                id="status-select"
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
            <th style="min-width: 10rem;">应用名称</th>
            <th style="min-width: 8rem;">渠道</th>
            <th style="min-width: 15rem;">Token</th>
            <th style="min-width: 8rem;">用户ID</th>
            <th style="min-width: 8rem;">状态</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 14rem;">更新时间</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-token>
          <tr>
            <td>{{ token.id }}</td>
            <td>{{ token.app_name }}</td>
            <td>{{ token.channel }}</td>
            <td>{{ token.token }}</td>
            <td>{{ token.user_id }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(token.status)"
                [value]="getStatusText(token.status)"
              ></p-tag>
            </td>
            <td>{{ token.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>{{ token.update_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(token)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDeleteToken(token)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="9" class="text-center">没有找到应用。</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Admin Detail Component -->
      @if (isDetailVisible()) {
        <cs-apps-detail
          [accessToken]="selectedToken()"
          [mode]="selectedToken() ? 'edit' : 'create'"
          (saved)="onTokenSaved($event)"
          (cancelled)="onTokenCancelled()"
        ></cs-apps-detail>
      }
    </div>
  `,
  styles: []
})
export class AppsPage implements OnInit {
  accessTokens: WritableSignal<AccessToken[]> = signal<AccessToken[]>([])
  loading = signal(false)
  app_name = signal('')
  channel = signal('')
  selectedStatus = signal<number | null>(null)
  selectedToken = signal<AccessToken | null>(null)
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)
  isDetailVisible = signal(false)

  statusOptions = signal([
    { label: '全部状态', value: null },
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ])

  get statusValue() {
    return this.selectedStatus()
  }
  set statusValue(val: number | null) {
    this.selectedStatus.set(val)
  }

  private authService = inject(AuthService)

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadAccessTokens()
  }

  // Check if current user is super admin
  isCurrentUserSuperAdmin(): boolean {
    const currentUser = this.authService.getUser<any>()
    return currentUser?.is_super_admin === 1
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadAccessTokens()
  }

  loadAccessTokensLazy(event: any) {
    // Update pagination from table event
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadAccessTokens()
  }

  loadAccessTokens() {
    this.loading.set(true)

    // Build query parameters
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }

    // Add search filters
    if (this.app_name()) {
      params.app_name = this.app_name()
    }

    if (this.channel()) {
      params.channel = this.channel()
    }

    if (this.selectedStatus() !== null) {
      params.status = this.selectedStatus()
    }

    // Call API to get access tokens
    this.httpService.get<AccessTokensResponse>('/api/admin/access-token', params).subscribe({
      next: (response) => {
        if (response.success === true && response.data) {
          this.accessTokens.set(response.data.dataList)
          this.totalRecords.set(response.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取应用列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading access tokens:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取应用列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  getStatusSeverity(status: number) {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '未启用'
  }

  confirmDeleteToken(token: AccessToken) {
    this.confirmationService.confirm({
      message: `确定要删除应用 "${token.app_name}" 吗？此操作不可撤销。`,
      header: '删除应用确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteToken(token.id)
      }
    })
  }

  deleteToken(id: number) {
    this.httpService.delete<any>(`/api/admin/access-token/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '应用删除成功'
          })
          this.loadAccessTokens()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除应用失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete access token:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '删除应用失败'
        })
      }
    })
  }

  openCreateDialog() {
    this.selectedToken.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(token: AccessToken) {
    this.selectedToken.set(token)
    this.isDetailVisible.set(true)
  }

  onTokenSaved(tokenData: AccessToken) {
    if (tokenData.id) {
      // Update access token
      this.httpService.put<any>(`/api/admin/access-token/${tokenData.id}`, tokenData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '应用更新成功'
            })
            this.selectedToken.set(null)
            this.isDetailVisible.set(false)
            this.loadAccessTokens()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '更新应用失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to update access token:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '更新应用失败'
          })
        }
      })
    } else {
      // Create access token
      this.httpService.post<any>('/api/admin/access-token', tokenData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '应用创建成功'
            })
            this.selectedToken.set(null)
            this.isDetailVisible.set(false)
            this.loadAccessTokens()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '创建应用失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to create access token:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '创建应用失败'
          })
        }
      })
    }
  }

  onTokenCancelled() {
    this.selectedToken.set(null)
    this.isDetailVisible.set(false)
  }

  resetFilters() {
    this.app_name.set('')
    this.channel.set('')
    this.selectedStatus.set(null)
    this.currentPage.set(1)
    this.loadAccessTokens()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadAccessTokens()
  }
}
