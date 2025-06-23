import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
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

interface RuleNode {
  id: number
  title: string
  alias: string
  children?: RuleNode[]
  status?: number
  sort?: number
  condition?: string
}

@Component({
  selector: 'cs-rule-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <p-dialog
      [(visible)]="visible"
      [header]="isEditMode ? '编辑规则' : '创建规则'"
      [modal]="true"
      [style]="{ width: '600px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
    >
      <form [formGroup]="ruleForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12">
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
          </div>

          <div class="col-12">
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
          </div>

          <div class="col-12">
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
          </div>

          <div class="col-12">
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
          </div>

          <div class="col-6">
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
          </div>

          <div class="col-6">
            <div class="field">
              <label for="parent_id" class="block text-900 font-medium mb-2">父级规则</label>
              <p-select
                id="parent_id"
                [options]="parentOptions"
                formControlName="parent_id"
                optionLabel="title"
                optionValue="id"
                placeholder="请选择父级规则"
                class="w-full"
                [showClear]="true"
                appendTo="body"
              ></p-select>
            </div>
          </div>

          <div class="col-6">
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
          </div>

          <div class="col-6">
            <div class="field">
              <label for="status" class="block text-900 font-medium mb-2">状态</label>
              <p-select
                id="status"
                [options]="statusOptions"
                formControlName="status"
                placeholder="请选择状态"
                class="w-full"
                appendTo="body"
              ></p-select>
            </div>
          </div>
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
  `,
  styles: [
    `
      .field {
        margin-bottom: 1rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 1rem;
      }

      .col-6 {
        grid-column: span 6;
      }

      .col-12 {
        grid-column: span 12;
      }

      @media (max-width: 768px) {
        .col-6 {
          grid-column: span 12;
        }
      }
    `
  ]
})
export class RuleDetailComponent implements OnInit, OnChanges {
  @Input() visible = false
  @Input() rule: Rule | null = null
  @Input() isEditMode = false
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() saved = new EventEmitter<void>()

  ruleForm: FormGroup
  submitting = false
  parentOptions: RuleNode[] = []

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: 0 }
  ]

  constructor(
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
      parent_id: [0],
      sort: [0],
      status: [10]
    })
  }

  ngOnInit() {
    this.loadParentOptions()
    this.ruleForm.reset({
      title: '',
      alias: '',
      condition: '',
      des: '',
      icon: '',
      parent_id: 0,
      sort: 0,
      status: 10
    })
  }

  ngOnChanges() {
    if (this.visible && this.rule && this.isEditMode) {
      this.loadRuleData()
    } else if (this.visible && !this.isEditMode) {
      this.resetForm()
    }
  }

  loadParentOptions() {
    this.httpService.get<any>('/api/admin/rules/tree').subscribe({
      next: (response) => {
        if (response.success) {
          this.parentOptions = this.flattenTreeData(response.data || [])
        }
      },
      error: (error) => {
        console.error('Failed to load parent options:', error)
      }
    })
  }

  flattenTreeData(nodes: RuleNode[]): RuleNode[] {
    let result: RuleNode[] = []
    nodes.forEach((node) => {
      result.push(node)
      if (node.children && node.children.length > 0) {
        result = result.concat(this.flattenTreeData(node.children))
      }
    })
    return result
  }

  loadRuleData() {
    if (this.rule) {
      this.ruleForm.patchValue({
        title: this.rule.title,
        alias: this.rule.alias,
        condition: this.rule.condition || '',
        des: this.rule.des || '',
        icon: this.rule.icon || '',
        parent_id: this.rule.parent_id,
        sort: this.rule.sort,
        status: this.rule.status
      })
    }
  }

  resetForm() {
    this.ruleForm.reset({
      title: '',
      alias: '',
      condition: '',
      des: '',
      icon: '',
      parent_id: 0,
      sort: 0,
      status: 10
    })
  }

  closeDialog() {
    this.visible = false
    this.visibleChange.emit(false)
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

      if (this.isEditMode && this.rule) {
        // Update rule
        this.httpService.put<any>(`/api/admin/rules/${this.rule.id}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '规则更新成功'
              })
              this.closeDialog()
              this.saved.emit()
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
              detail: error.error.message || '更新规则失败'
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
              this.saved.emit()
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
              detail: error.error.message || '创建规则失败'
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
}
