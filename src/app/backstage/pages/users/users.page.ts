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
              <label for="user-search-keyword" class="sr-only">模糊搜索</label>
              <input
                id="user-search-keyword"
                pInputText
                type="text"
                [(ngModel)]="searchKeyword"
                placeholder="搜索用户名、邮箱、昵称"
              />
              <label for="user-status-select" class="sr-only">用户状态</label>
              <p-select
                id="user-status-select"
                [options]="statusOptions()"
                [(ngModel)]="statusValue"
                optionLabel="label"
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
            <th style="min-width: 80px;">用户ID</th>
            <th style="min-width: 80px;">头像</th>
            <th style="min-width: 120px;">用户名</th>
            <th style="min-width: 120px;">昵称</th>
            <th style="min-width: 180px;">邮箱</th>
            <th style="min-width: 120px;">手机号</th>
            <th style="min-width: 80px;">状态</th>
            <th style="min-width: 80px;">管理员</th>
            <th style="min-width: 100px;">超级管理员</th>
            <th style="min-width: 160px;">最后登录</th>
            <th style="min-width: 160px;">创建时间</th>
            <th style="min-width: 160px;">更新时间</th>
            <th style="min-width: 120px;">操作</th>
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
                [severity]="getStatusSeverity(user.status)"
                [value]="user.status === 10 ? '正常' : '禁用'"
              ></p-tag>
            </td>
            <td>
              <p-tag
                [severity]="user.is_admin === 1 ? 'info' : 'secondary'"
                [value]="user.is_admin === 1 ? '是' : '否'"
              ></p-tag>
            </td>
            <td>
              <p-tag
                [severity]="user.is_super_admin === 1 ? 'warning' : 'secondary'"
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
            <td colspan="7" class="text-center">没有找到用户。</td>
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
  selectedStatus = signal<number | null>(null)
  statusOptions = signal([
    { label: '全部状态', value: null },
    { label: '正常', value: 10 },
    { label: '禁用', value: -10 }
  ])
  searchKeyword = signal('')

  totalRecords = signal(1000)

  get statusValue() {
    return this.selectedStatus()
  }
  set statusValue(val: number | null) {
    this.selectedStatus.set(val)
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // this.loadUsers()
  }

  onSearch() {
    this.loadUsers()
  }

  loadUsersLazy(event: any) {
    this.loadUsers()
  }

  loadUsers() {
    this.loading.set(true)
    // TODO: Replace with actual API call
    setTimeout(() => {
      this.users.set([
        {
          id: 1,
          user_name: 'john_doe',
          nick_name: 'John',
          email: 'john@example.com',
          phone: '1234567890',
          status: 10,
          is_admin: 0,
          is_super_admin: 0,
          last_login_time: 1710489000000,
          avatar_url: '',
          create_time: 1704038400000,
          update_time: 1710489000000
        },
        {
          id: 2,
          user_name: 'jane_smith',
          nick_name: 'Jane',
          email: 'jane@example.com',
          phone: '1234567891',
          status: -10,
          is_admin: 1,
          is_super_admin: 0,
          last_login_time: 1710411900000,
          avatar_url: '',
          create_time: 1705257600000,
          update_time: 1710411900000
        },
        {
          id: 3,
          user_name: 'bob_wilson',
          nick_name: 'Bob',
          email: 'bob@example.com',
          phone: '1234567892',
          status: 10,
          is_admin: 0,
          is_super_admin: 1,
          last_login_time: 1710058800000,
          avatar_url: '',
          create_time: 1706745600000,
          update_time: 1710058800000
        }
      ])
      this.loading.set(false)
    }, 1000)
  }

  getStatusSeverity(status: number): string {
    switch (status) {
      case 10:
        return 'success'
      case -10:
        return 'danger'
      default:
        return 'info'
    }
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const table = document.querySelector('p-table')
    if (table) {
      const filterValue = (event.target as HTMLInputElement).value
      // @ts-expect-error: PrimeNG Table instance is not strongly typed, filterGlobal is available at runtime
      table.filterGlobal(filterValue, matchMode)
    }
  }

  filterByStatus(event: any) {
    const table = document.querySelector('p-table')
    if (table) {
      // @ts-expect-error: PrimeNG Table instance is not strongly typed, filter is available at runtime
      table.filter(event.value, 'status', 'equals')
    }
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: `确定要删除用户 ${user.user_name} 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: 实现删除用户
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: `用户 ${user.user_name} 已删除`
        })
      }
    })
  }

  resetFilters() {
    this.searchKeyword.set('')
    this.selectedStatus.set(null)
    // 这里可以加刷新表格逻辑
  }

  onCollapse() {
    // 这里写收缩/展开逻辑
  }

  onPageChange(event: any) {
    console.log(event)
    // event.first: 当前页第一条数据的索引
    // event.rows: 每页条数
    // event.page: 当前页码（从0开始）
    // event.pageCount: 总页数
    // 你可以在这里发起 API 请求获取新页数据
  }
}
