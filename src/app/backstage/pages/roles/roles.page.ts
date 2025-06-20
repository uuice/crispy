import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'

interface Role {
  id: number
  title: string
  des?: string
  module_id: number
  rule_ids: string
  sort: number
  status: number
  type_id: number
  create_time: number
  update_time: number
}

@Component({
  selector: 'cs-roles',
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
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="roles-page">
      <div class="page-header">
        <h1>角色管理</h1>
        <button pButton label="创建角色" icon="pi pi-plus" (click)="openCreateDialog()"></button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="card">
        <p-table
          [value]="roles"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条记录"
          [rowsPerPageOptions]="[10, 25, 50]"
          [loading]="loading"
          [globalFilterFields]="['title', 'des']"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-content-between">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  (input)="applyFilterGlobal($event, 'contains')"
                  placeholder="搜索角色..."
                />
              </span>
              <div class="flex gap-2">
                <p-dropdown
                  [options]="statusOptions"
                  [(ngModel)]="selectedStatus"
                  placeholder="按状态筛选"
                  (onChange)="filterByStatus($event)"
                  styleClass="p-inputtext-sm"
                ></p-dropdown>
              </div>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th>角色名称</th>
              <th>描述</th>
              <th>模块ID</th>
              <th>排序</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-role>
            <tr>
              <td>{{ role.title }}</td>
              <td>{{ role.des || '-' }}</td>
              <td>{{ role.module_id }}</td>
              <td>{{ role.sort }}</td>
              <td>
                <p-tag
                  [severity]="getStatusSeverity(role.status)"
                  [value]="getStatusText(role.status)"
                ></p-tag>
              </td>
              <td>{{ role.create_time | date: 'medium' }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="编辑"
                    tooltipPosition="top"
                    (click)="openEditDialog(role)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="删除"
                    tooltipPosition="top"
                    (click)="confirmDelete(role)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">暂无角色数据</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Role Dialog -->
      <p-dialog
        [(visible)]="dialogVisible"
        [header]="isEditMode ? '编辑角色' : '创建角色'"
        [modal]="true"
        [style]="{ width: '500px' }"
        [draggable]="false"
        [resizable]="false"
        (onHide)="onDialogHide()"
      >
        <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="title" class="block text-900 font-medium mb-2">角色名称 *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="请输入角色名称"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('title') }"
            />
            <small *ngIf="isFieldInvalid('title')" class="p-error">
              {{ getErrorMessage('title') }}
            </small>
          </div>

          <div class="field">
            <label for="des" class="block text-900 font-medium mb-2">描述</label>
            <textarea
              id="des"
              pInputTextarea
              formControlName="des"
              placeholder="请输入角色描述"
              [rows]="3"
              class="w-full"
            ></textarea>
          </div>

          <div class="field">
            <label for="module_id" class="block text-900 font-medium mb-2">模块ID</label>
            <input
              id="module_id"
              type="number"
              pInputText
              formControlName="module_id"
              placeholder="请输入模块ID"
              class="w-full"
            />
          </div>

          <div class="field">
            <label for="sort" class="block text-900 font-medium mb-2">排序</label>
            <input
              id="sort"
              type="number"
              pInputText
              formControlName="sort"
              placeholder="请输入排序值"
              class="w-full"
            />
          </div>

          <div class="field">
            <label for="status" class="block text-900 font-medium mb-2">状态</label>
            <p-dropdown
              id="status"
              [options]="statusOptions"
              formControlName="status"
              placeholder="请选择状态"
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="field">
            <label for="type_id" class="block text-900 font-medium mb-2">类型ID</label>
            <input
              id="type_id"
              type="number"
              pInputText
              formControlName="type_id"
              placeholder="请输入类型ID"
              class="w-full"
            />
          </div>
        </form>

        <ng-template pTemplate="footer">
          <button
            pButton
            label="取消"
            icon="pi pi-times"
            class="p-button-text"
            (click)="closeDialog()"
          ></button>
          <button
            pButton
            label="保存"
            icon="pi pi-check"
            [loading]="submitting"
            [disabled]="roleForm.invalid"
            (click)="onSubmit()"
          ></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .roles-page {
        padding: 1rem;

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          h1 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
          }
        }

        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .field {
          margin-bottom: 1rem;
        }

        ::ng-deep {
          .p-datatable {
            .p-datatable-header {
              background: transparent;
              border: none;
              padding: 0 0 1rem 0;
            }

            .p-datatable-thead > tr > th {
              background: #f8f9fa;
              font-weight: 600;
            }

            .p-datatable-tbody > tr > td {
              padding: 0.75rem;
            }
          }
        }
      }
    `
  ]
})
export class RolesPage implements OnInit {
  roles: Role[] = []
  loading = false
  submitting = false
  selectedStatus: number | null = null
  dialogVisible = false
  isEditMode = false
  currentRoleId: number | null = null

  roleForm: FormGroup

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: 0 }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      des: [''],
      module_id: [0],
      rule_ids: [''],
      sort: [0],
      status: [10],
      type_id: [0]
    })
  }

  ngOnInit() {
    this.loadRoles()
  }

  loadRoles() {
    this.loading = true
    this.httpService.get<any>('/api/admin/roles').subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.data.data || []
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '加载角色列表失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to load roles:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载角色列表失败'
        })
      },
      complete: () => {
        this.loading = false
      }
    })
  }

  getStatusSeverity(status: number): string {
    return status === 10 ? 'success' : 'warning'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const target = event.target as HTMLInputElement
    const value = target.value
    // Implement global filter logic here
    console.log('Filter by:', value)
  }

  filterByStatus(event: any) {
    this.selectedStatus = event.value
    // Implement status filter logic here
    console.log('Filter by status:', this.selectedStatus)
  }

  openCreateDialog() {
    this.isEditMode = false
    this.currentRoleId = null
    this.roleForm.reset({
      title: '',
      des: '',
      module_id: 0,
      rule_ids: '',
      sort: 0,
      status: 10,
      type_id: 0
    })
    this.dialogVisible = true
  }

  openEditDialog(role: Role) {
    this.isEditMode = true
    this.currentRoleId = role.id
    this.roleForm.patchValue({
      title: role.title,
      des: role.des || '',
      module_id: role.module_id,
      rule_ids: role.rule_ids,
      sort: role.sort,
      status: role.status,
      type_id: role.type_id
    })
    this.dialogVisible = true
  }

  closeDialog() {
    this.dialogVisible = false
    this.roleForm.reset()
  }

  onDialogHide() {
    this.closeDialog()
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.roleForm.get(field)
    return formControl ? formControl.invalid && formControl.dirty : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.roleForm.get(field)
    if (!formControl) return ''

    if (formControl.hasError('required')) {
      return '此字段为必填项'
    }
    if (formControl.hasError('minlength')) {
      return `最少需要 ${formControl.errors?.['minlength'].requiredLength} 个字符`
    }
    return ''
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.submitting = true
      const formData = this.roleForm.value

      if (this.isEditMode && this.currentRoleId) {
        // Update role
        this.httpService.put<any>(`/api/admin/roles/${this.currentRoleId}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '角色更新成功'
              })
              this.closeDialog()
              this.loadRoles()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新角色失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to update role:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '更新角色失败'
            })
          },
          complete: () => {
            this.submitting = false
          }
        })
      } else {
        // Create role
        this.httpService.post<any>('/api/admin/roles', formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '角色创建成功'
              })
              this.closeDialog()
              this.loadRoles()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建角色失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create role:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '创建角色失败'
            })
          },
          complete: () => {
            this.submitting = false
          }
        })
      }
    } else {
      this.roleForm.markAllAsTouched()
    }
  }

  confirmDelete(role: Role) {
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
          detail: '删除角色失败'
        })
      }
    })
  }
}
