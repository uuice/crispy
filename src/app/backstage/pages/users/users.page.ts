import { Component, OnInit, signal, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { ConfirmationService, MessageService } from 'primeng/api'
import { SelectModule } from 'primeng/select'
import { HttpService } from '../../services/http.service'

interface User {
  id: number
  user_name: string
  nick_name: string
  email: string
  phone: string
  status: number // 10=正常，-10=禁用/黑名单
  is_admin: number
  is_super_admin: number
  last_login_time: number
  avatar_url: string
  create_time: number
  update_time: number
}

interface UsersResponse {
  success: boolean
  message: string
  data: {
    dataList: User[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

@Component({
  selector: 'cs-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>用户管理</h1>
        <p-button label="新增用户" icon="pi pi-plus" routerLink="create"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="users()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条用户"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadUsersLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="user-search-keyword" class="sr-only">用户名</label>
              <input
                id="user-search-keyword"
                pInputText
                type="text"
                [(ngModel)]="user_name"
                placeholder="用户名"
              />
              <label for="user-status-select" class="sr-only">用户状态</label>
              <p-select
                id="user-status-select"
                [options]="statusOptions()"
                [(ngModel)]="statusValue"
                optionLabel="label"
                optionValue="value"
                placeholder="用户状态"
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
            <th style="min-width: 6rem;">用户ID</th>
            <th style="min-width: 6rem;">头像</th>
            <th style="min-width: 8rem;">用户名</th>
            <th style="min-width: 8rem;">昵称</th>
            <th style="min-width: 12rem;">邮箱</th>
            <th style="min-width: 8rem;">手机号</th>
            <th style="min-width: 5rem;">状态</th>
            <th style="min-width: 5rem;">管理员</th>
            <th style="min-width: 8rem;">超级管理员</th>
            <th style="min-width: 14rem;">最后登录</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 14rem;">更新时间</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.id }}</td>
            <td>
              <img
                *ngIf="user.avatar_url"
                [src]="user.avatar_url"
                alt="avatar"
                width="32"
                height="32"
                style="border-radius:50%;"
              />
            </td>
            <td>{{ user.user_name }}</td>
            <td>{{ user.nick_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <p-tag
                [severity]="user.status === 10 ? 'success' : 'danger'"
                [value]="user.status === 10 ? '正常' : '禁用'"
              ></p-tag>
            </td>
            <td>
              <p-tag
                [severity]="user.is_admin === 1 ? 'success' : 'secondary'"
                [value]="user.is_admin === 1 ? '是' : '否'"
              ></p-tag>
            </td>
            <td>
              <p-tag
                [severity]="user.is_super_admin === 1 ? 'danger' : 'secondary'"
                [value]="user.is_super_admin === 1 ? '是' : '否'"
              ></p-tag>
            </td>
            <td>{{ user.last_login_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>{{ user.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>{{ user.update_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  [routerLink]="[user.id, 'edit']"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(user)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="13" class="text-center">没有找到用户。</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: []
})
export class UsersPage implements OnInit {
  users: WritableSignal<User[]> = signal<User[]>([])
  loading = signal(false)
  user_name = signal('')
  selectedStatus = signal<number | null>(null)
  statusOptions = signal([
    { label: '全部状态', value: null },
    { label: '正常', value: 10 },
    { label: '禁用', value: -10 }
  ])
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)

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

  ngOnInit() {}

  onSearch() {
    this.currentPage.set(1)
    this.loadUsers()
  }

  loadUsersLazy(event: any) {
    // Update pagination from table event
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadUsers()
  }

  loadUsers() {
    this.loading.set(true)

    // Build query parameters
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }

    // Add search filters
    if (this.user_name()) {
      params.user_name = this.user_name()
    }

    if (this.selectedStatus() !== null) {
      params.status = this.selectedStatus()
    }

    // Call API to get users
    this.httpService.get<UsersResponse>('/api/admin/users', params).subscribe({
      next: (response) => {
        console.log(response)
        if (response.success === true && response.data) {
          this.users.set(response.data.dataList)
          this.totalRecords.set(response.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取用户列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading users:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取用户列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: `确定要删除用户 ${user.user_name} 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(user.id)
      }
    })
  }

  deleteUser(userId: number) {
    this.httpService.delete(`/api/admin/users/${userId}`).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: response.message || '用户删除成功'
          })
          // Reload users list
          this.loadUsers()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除用户失败'
          })
        }
      },
      error: (error) => {
        console.error('Error deleting user:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '删除用户失败'
        })
      }
    })
  }

  resetFilters() {
    this.user_name.set('')
    this.selectedStatus.set(null)
    this.currentPage.set(1)
    this.loadUsers()
  }

  onPageChange(event: any) {
    console.log('Page change event:', event)
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadUsers()
  }
}
