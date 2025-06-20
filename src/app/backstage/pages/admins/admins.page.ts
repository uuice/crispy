import { Component, OnInit, signal, WritableSignal } from '@angular/core'
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
import { AdminDetailComponent } from './admin-detail.component'

interface Admin {
  id: number
  user_name: string
  nick_name: string
  email: string
  phone: string
  status: number // 10=正常，-10=禁用
  is_admin: number // 1=管理员，0=普通用户
  is_super_admin: number // 1=超级管理员，0=普通管理员
  is_black: number // 1=黑名单，0=正常
  last_login_time: number
  avatar_url: string
  create_time: number
  update_time: number
  role_id?: number
  type_id?: number
}

interface AdminsResponse {
  success: boolean
  message: string
  data: {
    dataList: Admin[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

@Component({
  selector: 'cs-admins',
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
    AdminDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>管理员管理</h1>
        <p-button label="新增管理员" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="admins()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条管理员"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadAdminsLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="admin-search-keyword" class="sr-only">用户名</label>
              <input
                id="admin-search-keyword"
                pInputText
                type="text"
                [(ngModel)]="user_name"
                placeholder="用户名"
              />
              <label for="admin-status-select" class="sr-only">状态</label>
              <p-select
                id="admin-status-select"
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
            <th style="min-width: 6rem;">头像</th>
            <th style="min-width: 8rem;">用户名</th>
            <th style="min-width: 8rem;">昵称</th>
            <th style="min-width: 12rem;">邮箱</th>
            <th style="min-width: 8rem;">手机号</th>
            <th style="min-width: 8rem;">管理员类型</th>
            <th style="min-width: 12rem;">状态</th>
            <th style="min-width: 14rem;">最后登录</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 8rem;">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-admin>
          <tr>
            <td>{{ admin.id }}</td>
            <td>
              <img
                *ngIf="admin.avatar_url"
                [src]="admin.avatar_url"
                alt="avatar"
                width="32"
                height="32"
                style="border-radius:50%;"
              />
            </td>
            <td>{{ admin.user_name }}</td>
            <td>{{ admin.nick_name || '-' }}</td>
            <td>{{ admin.email || '-' }}</td>
            <td>{{ admin.phone || '-' }}</td>
            <td>
              <div class="admin-type">
                <p-tag
                  *ngIf="admin.is_super_admin === 1"
                  value="超级管理员"
                  severity="danger"
                  styleClass="mr-1"
                ></p-tag>
                <p-tag
                  *ngIf="admin.is_admin === 1 && admin.is_super_admin !== 1"
                  value="管理员"
                  severity="warning"
                ></p-tag>
                <span *ngIf="admin.is_admin !== 1 && admin.is_super_admin !== 1">普通用户</span>
              </div>
            </td>
            <td>
              <div class="status-tags flex flex-wrap gap-2">
                <p-tag
                  [severity]="getStatusSeverity(admin.status)"
                  [value]="getStatusText(admin.status)"
                  styleClass="mr-1"
                ></p-tag>
                <p-tag *ngIf="admin.is_black === 1" value="黑名单" severity="danger"></p-tag>
              </div>
            </td>
            <td>
              {{
                admin.last_login_time
                  ? (admin.last_login_time | date: 'yyyy-MM-dd HH:mm:ss')
                  : '从未登录'
              }}
            </td>
            <td>{{ admin.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(admin)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(admin)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="11" class="text-center">没有找到管理员。</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Admin Detail Component -->
      <cs-admin-detail
        [admin]="selectedAdmin()"
        (saved)="onAdminSaved($event)"
        (cancelled)="onAdminCancelled()"
      ></cs-admin-detail>
    </div>
  `,
  styles: []
})
export class AdminsPage implements OnInit {
  admins: WritableSignal<Admin[]> = signal<Admin[]>([])
  loading = signal(false)
  user_name = signal('')
  selectedStatus = signal<number | null>(null)
  selectedAdmin = signal<Admin | null>(null)
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)

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

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadAdmins()
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadAdmins()
  }

  loadAdminsLazy(event: any) {
    // Update pagination from table event
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadAdmins()
  }

  loadAdmins() {
    this.loading.set(true)

    // Build query parameters
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      is_admin: 1 // Only load admins
    }

    // Add search filters
    if (this.user_name()) {
      params.user_name = this.user_name()
    }

    if (this.selectedStatus() !== null) {
      params.status = this.selectedStatus()
    }

    // Call API to get admins
    this.httpService.get<AdminsResponse>('/api/admin/users', params).subscribe({
      next: (response) => {
        if (response.success === true && response.data) {
          this.admins.set(response.data.dataList)
          this.totalRecords.set(response.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取管理员列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading admins:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取管理员列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  getStatusSeverity(status: number): string {
    return status === 10 ? 'success' : 'warning'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  openCreateDialog() {
    this.selectedAdmin.set(null)
  }

  openEditDialog(admin: Admin) {
    this.selectedAdmin.set(admin)
  }

  onAdminSaved(adminData: Admin) {
    if (adminData.id) {
      // Update admin
      this.httpService.put<any>(`/api/admin/users/${adminData.id}`, adminData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '管理员更新成功'
            })
            this.selectedAdmin.set(null)
            this.loadAdmins()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '更新管理员失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to update admin:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '更新管理员失败'
          })
        }
      })
    } else {
      // Create admin
      this.httpService.post<any>('/api/admin/users', adminData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '管理员创建成功'
            })
            this.selectedAdmin.set(null)
            this.loadAdmins()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '创建管理员失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to create admin:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '创建管理员失败'
          })
        }
      })
    }
  }

  onAdminCancelled() {
    this.selectedAdmin.set(null)
  }

  confirmDelete(admin: Admin) {
    this.confirmationService.confirm({
      message: `确定要删除管理员 "${admin.user_name}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAdmin(admin.id)
      }
    })
  }

  deleteAdmin(id: number) {
    this.httpService.delete<any>(`/api/admin/users/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '管理员删除成功'
          })
          this.loadAdmins()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除管理员失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete admin:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '删除管理员失败'
        })
      }
    })
  }

  resetFilters() {
    this.user_name.set('')
    this.selectedStatus.set(null)
    this.currentPage.set(1)
    this.loadAdmins()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadAdmins()
  }
}
