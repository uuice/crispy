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
import { RoleDetailComponent } from './role-detail.component'
import { RoleEntity, PaginatedResult } from '@src/types'

interface RolesResponse {
  success: boolean
  message: string
  data: PaginatedResult<RoleEntity>
}

@Component({
  selector: 'cs-roles',
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
    RoleDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>角色管理</h1>
        <p-button label="创建角色" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="roles()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条角色"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadRolesLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="role-search-keyword" class="sr-only">角色名称</label>
              <input
                id="role-search-keyword"
                pInputText
                type="text"
                [(ngModel)]="titleValue"
                placeholder="角色名称"
              />
              <label for="role-status-select" class="sr-only">状态</label>
              <p-select
                id="role-status-select"
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
            <th style="min-width: 10rem;">角色名称</th>
            <th style="min-width: 15rem;">描述</th>
            <th style="min-width: 6rem;">排序</th>
            <th style="min-width: 8rem;">状态</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-role>
          <tr>
            <td>{{ role.id }}</td>
            <td>{{ role.title }}</td>
            <td>{{ role.des || '-' }}</td>
            <td>{{ role.sort }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(role.status)"
                [value]="getStatusText(role.status)"
              ></p-tag>
            </td>
            <td>{{ role.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(role)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(role)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="8" class="text-center">没有找到角色。</td>
          </tr>
        </ng-template>
      </p-table>

      @if (isDetailVisible()) {
        <cs-role-detail
          [role]="selectedRole()"
          [mode]="selectedRole() ? 'edit' : 'create'"
          (saved)="onRoleSaved($event)"
          (cancelled)="onRoleCancelled()"
        ></cs-role-detail>
      }
    </div>
  `,
  styles: [``]
})
export class RolesPage implements OnInit {
  roles: WritableSignal<RoleEntity[]> = signal([])
  loading = signal(false)
  titleValue = signal('')
  statusValue = signal<number | null>(null)
  selectedRole = signal<RoleEntity | null>(null)
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)
  isDetailVisible = signal(false)

  statusOptions = signal([
    { label: '全部状态', value: null },
    { label: '启用', value: 10 },
    { label: '禁用', value: 0 }
  ])

  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)
  private httpService = inject(HttpService)

  constructor() {}

  ngOnInit() {
    this.loadRoles()
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadRoles()
  }

  loadRolesLazy(event: any) {
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadRoles()
  }

  loadRoles() {
    this.loading.set(true)
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }

    if (this.titleValue()) {
      params.title = this.titleValue()
    }
    if (this.statusValue() !== null) {
      params.status = this.statusValue()
    }

    this.httpService.get<RolesResponse>('/api/admin/roles', params).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.roles.set(response.data.dataList)
          this.totalRecords.set(response.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取角色列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading roles:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取角色列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  getStatusSeverity(status: number) {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  openCreateDialog() {
    this.selectedRole.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(role: RoleEntity) {
    this.selectedRole.set({ ...role })
    this.isDetailVisible.set(true)
  }

  onRoleSaved(roleData: Partial<RoleEntity>) {
    const apiCall = roleData.id
      ? this.httpService.put<any>(`/api/admin/roles/${roleData.id}`, roleData)
      : this.httpService.post<any>('/api/admin/roles', roleData)

    const action = roleData.id ? '更新' : '创建'

    apiCall.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: `角色${action}成功`
          })
          this.isDetailVisible.set(false)
          this.loadRoles()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || `${action}角色失败`
          })
        }
      },
      error: (error) => {
        console.error(`Failed to ${action.toLowerCase()} role:`, error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || `${action}角色失败`
        })
      }
    })
  }

  onRoleCancelled() {
    this.isDetailVisible.set(false)
  }

  confirmDelete(role: RoleEntity) {
    this.confirmationService.confirm({
      message: `确定要删除角色 "${role.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRole(role.id)
      }
    })
  }

  deleteRole(id: number) {
    this.httpService.delete<any>(`/api/admin/roles/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '角色删除成功'
          })
          this.loadRoles()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除角色失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete role:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '删除角色失败'
        })
      }
    })
  }

  resetFilters() {
    this.titleValue.set('')
    this.statusValue.set(null)
    this.currentPage.set(1)
    this.loadRoles()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadRoles()
  }
}
