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

interface Rule {
  id: number
  title: string
  alias: string
  condition?: string
  des?: string
  icon?: string
  module_id: number
  parent_id: number
  sort: number
  status: number
  type_id: number
  create_time: number
  update_time: number
}

@Component({
  selector: 'cs-rules',
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
    <div class="rules-page">
      <div class="page-header">
        <h1>规则管理</h1>
        <button pButton label="创建规则" icon="pi pi-plus" (click)="openCreateDialog()"></button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="card">
        <p-table
          [value]="rules"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条记录"
          [rowsPerPageOptions]="[10, 25, 50]"
          [loading]="loading"
          [globalFilterFields]="['title', 'alias', 'des']"
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
                  placeholder="搜索规则..."
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
              <th>规则名称</th>
              <th>别名</th>
              <th>描述</th>
              <th>模块ID</th>
              <th>父级ID</th>
              <th>排序</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-rule>
            <tr>
              <td>
                <span class="rule-title">
                  <i *ngIf="rule.icon" [class]="rule.icon" class="mr-2"></i>
                  {{ rule.title }}
                </span>
              </td>
              <td>{{ rule.alias }}</td>
              <td>{{ rule.des || '-' }}</td>
              <td>{{ rule.module_id }}</td>
              <td>{{ rule.parent_id || '-' }}</td>
              <td>{{ rule.sort }}</td>
              <td>
                <p-tag
                  [severity]="getStatusSeverity(rule.status)"
                  [value]="getStatusText(rule.status)"
                ></p-tag>
              </td>
              <td>{{ rule.create_time | date: 'medium' }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="编辑"
                    tooltipPosition="top"
                    (click)="openEditDialog(rule)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="删除"
                    tooltipPosition="top"
                    (click)="confirmDelete(rule)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="9" class="text-center">暂无规则数据</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Rule Dialog -->
      <p-dialog
        [(visible)]="dialogVisible"
        [header]="isEditMode ? '编辑规则' : '创建规则'"
        [modal]="true"
        [style]="{ width: '500px' }"
        [draggable]="false"
        [resizable]="false"
        (onHide)="onDialogHide()"
      >
        <form [formGroup]="ruleForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="title" class="block text-900 font-medium mb-2">规则名称 *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="请输入规则名称"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('title') }"
            />
            <small *ngIf="isFieldInvalid('title')" class="p-error">
              {{ getErrorMessage('title') }}
            </small>
          </div>

          <div class="field">
            <label for="alias" class="block text-900 font-medium mb-2">别名 *</label>
            <input
              id="alias"
              type="text"
              pInputText
              formControlName="alias"
              placeholder="请输入规则别名"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('alias') }"
            />
            <small *ngIf="isFieldInvalid('alias')" class="p-error">
              {{ getErrorMessage('alias') }}
            </small>
          </div>

          <div class="field">
            <label for="des" class="block text-900 font-medium mb-2">描述</label>
            <textarea
              id="des"
              pInputTextarea
              formControlName="des"
              placeholder="请输入规则描述"
              [rows]="3"
              class="w-full"
            ></textarea>
          </div>

          <div class="field">
            <label for="condition" class="block text-900 font-medium mb-2">条件</label>
            <input
              id="condition"
              type="text"
              pInputText
              formControlName="condition"
              placeholder="请输入规则条件"
              class="w-full"
            />
          </div>

          <div class="field">
            <label for="icon" class="block text-900 font-medium mb-2">图标</label>
            <input
              id="icon"
              type="text"
              pInputText
              formControlName="icon"
              placeholder="请输入图标类名"
              class="w-full"
            />
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
            <label for="parent_id" class="block text-900 font-medium mb-2">父级ID</label>
            <input
              id="parent_id"
              type="number"
              pInputText
              formControlName="parent_id"
              placeholder="请输入父级ID"
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
            [disabled]="ruleForm.invalid"
            (click)="onSubmit()"
          ></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .rules-page {
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

        .rule-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
export class RulesPage implements OnInit {
  rules: Rule[] = []
  loading = false
  submitting = false
  selectedStatus: number | null = null
  dialogVisible = false
  isEditMode = false
  currentRuleId: number | null = null

  ruleForm: FormGroup

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
    this.ruleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      alias: ['', [Validators.required, Validators.minLength(2)]],
      condition: [''],
      des: [''],
      icon: [''],
      module_id: [0],
      parent_id: [0],
      sort: [0],
      status: [10],
      type_id: [0]
    })
  }

  ngOnInit() {
    this.loadRules()
  }

  loadRules() {
    this.loading = true
    this.httpService.get<any>('/api/admin/rules').subscribe({
      next: (response) => {
        if (response.success) {
          this.rules = response.data.data || []
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '加载规则列表失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to load rules:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载规则列表失败'
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
    this.currentRuleId = null
    this.ruleForm.reset({
      title: '',
      alias: '',
      condition: '',
      des: '',
      icon: '',
      module_id: 0,
      parent_id: 0,
      sort: 0,
      status: 10,
      type_id: 0
    })
    this.dialogVisible = true
  }

  openEditDialog(rule: Rule) {
    this.isEditMode = true
    this.currentRuleId = rule.id
    this.ruleForm.patchValue({
      title: rule.title,
      alias: rule.alias,
      condition: rule.condition || '',
      des: rule.des || '',
      icon: rule.icon || '',
      module_id: rule.module_id,
      parent_id: rule.parent_id,
      sort: rule.sort,
      status: rule.status,
      type_id: rule.type_id
    })
    this.dialogVisible = true
  }

  closeDialog() {
    this.dialogVisible = false
    this.ruleForm.reset()
  }

  onDialogHide() {
    this.closeDialog()
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.ruleForm.get(field)
    return formControl ? formControl.invalid && formControl.dirty : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.ruleForm.get(field)
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
    if (this.ruleForm.valid) {
      this.submitting = true
      const formData = this.ruleForm.value

      if (this.isEditMode && this.currentRuleId) {
        // Update rule
        this.httpService.put<any>(`/api/admin/rules/${this.currentRuleId}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '规则更新成功'
              })
              this.closeDialog()
              this.loadRules()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新规则失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to update rule:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '更新规则失败'
            })
          },
          complete: () => {
            this.submitting = false
          }
        })
      } else {
        // Create rule
        this.httpService.post<any>('/api/admin/rules', formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '规则创建成功'
              })
              this.closeDialog()
              this.loadRules()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建规则失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create rule:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '创建规则失败'
            })
          },
          complete: () => {
            this.submitting = false
          }
        })
      }
    } else {
      this.ruleForm.markAllAsTouched()
    }
  }

  confirmDelete(rule: Rule) {
    this.confirmationService.confirm({
      message: `确定要删除规则 "${rule.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRule(rule.id)
      }
    })
  }

  deleteRule(id: number) {
    this.httpService.delete<any>(`/api/admin/rules/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '规则删除成功'
          })
          this.loadRules()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除规则失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete rule:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '删除规则失败'
        })
      }
    })
  }
}
