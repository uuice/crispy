import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'

interface Config {
  id: number
  title: string
  alias?: string
  value: string
  type_id?: number
  type_ids?: string
  sort: number
  status: number
  create_time: number
  update_time: number
}

@Component({
  selector: 'cs-config-detail',
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
    ToastModule,
    MessageModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [header]="dialogTitle"
      [modal]="true"
      [style]="{ width: '600px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
      [closeOnEscape]="false"
    >
      <form [formGroup]="configForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label for="title" class="block text-900 font-medium mb-2">配置标题 *</label>
              <input
                id="title"
                type="text"
                pInputText
                formControlName="title"
                placeholder="请输入配置标题"
                class="w-full"
                [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('title') }"
              />
              @if (isFieldInvalid('title')) {
                <p-message
                  severity="error"
                  [text]="getErrorMessage('title')"
                  styleClass="mt-1"
                ></p-message>
              }
            </div>
          </div>

          <div class="col-12">
            <div class="field">
              <label for="alias" class="block text-900 font-medium mb-2">别名</label>
              <input
                id="alias"
                type="text"
                pInputText
                formControlName="alias"
                placeholder="请输入配置别名"
                class="w-full"
              />
            </div>
          </div>

          <div class="col-12">
            <div class="field">
              <label for="value" class="block text-900 font-medium mb-2">配置值 *</label>
              <textarea
                id="value"
                pInputTextarea
                formControlName="value"
                placeholder="请输入配置值"
                [rows]="4"
                class="w-full"
                [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('value') }"
                (input)="onValueInput($event)"
              ></textarea>
              @if (isFieldInvalid('value')) {
                <p-message
                  severity="error"
                  [text]="getErrorMessage('value')"
                  styleClass="mt-1"
                ></p-message>
              }
              @if (jsonValidationMessage()) {
                <p-message
                  [severity]="jsonValidationSeverity()"
                  [text]="jsonValidationMessage()"
                  styleClass="mt-1"
                ></p-message>
              }
            </div>
          </div>

          <div class="col-6">
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
          </div>

          <div class="col-6">
            <div class="field">
              <label for="type_ids" class="block text-900 font-medium mb-2">类型IDs</label>
              <input
                id="type_ids"
                type="text"
                pInputText
                formControlName="type_ids"
                placeholder="请输入类型IDs"
                class="w-full"
              />
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
          (click)="onCancel()"
        ></button>
        <button
          pButton
          label="保存"
          icon="pi pi-check"
          [loading]="submitting()"
          [disabled]="configForm.invalid"
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
    `
  ]
})
export class ConfigDetailComponent implements OnInit, OnChanges {
  @Input() config: Config | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  configForm: FormGroup
  submitting = signal(false)
  jsonValidationMessage = signal('')
  jsonValidationSeverity = signal<'success' | 'warn' | 'error'>('success')

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ]

  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {
    this.configForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      alias: [''],
      value: ['', [Validators.required]],
      type_id: [undefined],
      type_ids: [''],
      sort: [0],
      status: [10]
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.configForm.reset({
        title: '',
        alias: '',
        value: '',
        type_id: null,
        type_ids: '',
        sort: 0,
        status: 10
      })
      this.initializeForm()
    })
  }

  ngOnChanges() {
    setTimeout(() => {
      this.initializeForm()
    })
  }

  initializeForm() {
    if (this.config && this.mode === 'edit') {
      this.loadConfigData()
    } else if (this.mode === 'create') {
      this.resetForm()
    }
    this.submitting.set(false)
  }

  get isEditMode(): boolean {
    return this.mode === 'edit'
  }

  get dialogTitle(): string {
    if (this.mode === 'create') return '创建配置'
    return '编辑配置'
  }

  loadConfigData() {
    if (this.config) {
      this.configForm.patchValue({
        title: this.config.title,
        alias: this.config.alias || '',
        value: this.config.value,
        type_id: this.config.type_id || null,
        type_ids: this.config.type_ids || '',
        sort: this.config.sort,
        status: this.config.status
      })

      // Validate JSON format for existing value
      this.validateJsonFormat(this.config.value)
    }
  }

  resetForm() {
    this.configForm.reset({
      title: '',
      alias: '',
      value: '',
      type_id: null,
      type_ids: '',
      sort: 0,
      status: 10
    })
  }

  onDialogHide() {
    this.cancelled.emit()
  }

  onCancel() {
    this.visible.set(false)
    this.cancelled.emit()
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.configForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.configForm.get(field)
    if (!formControl) return ''

    if (formControl.hasError('required')) {
      return '此字段为必填项'
    }
    if (formControl.hasError('minlength')) {
      return `最少需要 ${formControl.errors?.['minlength'].requiredLength} 个字符`
    }
    return ''
  }

  onValueInput(event: any) {
    const value = event.target.value
    this.validateJsonFormat(value)
  }

  validateJsonFormat(value: string) {
    if (!value || value.trim() === '') {
      this.jsonValidationMessage.set('')
      return
    }

    try {
      // Try to parse as JSON
      const parsed = JSON.parse(value)

      // Only consider object and array as valid JSON format
      if (typeof parsed === 'object' && parsed !== null) {
        this.jsonValidationMessage.set('✅ 有效的 JSON 格式')
        this.jsonValidationSeverity.set('success')
      } else {
        // For primitive values, treat them as non-JSON format
        if (typeof parsed === 'string') {
          this.jsonValidationMessage.set('📝 字符串类型')
          this.jsonValidationSeverity.set('warn')
        } else if (typeof parsed === 'number') {
          this.jsonValidationMessage.set('📊 数值类型')
          this.jsonValidationSeverity.set('warn')
        } else if (typeof parsed === 'boolean') {
          this.jsonValidationMessage.set('🔘 布尔值类型')
          this.jsonValidationSeverity.set('warn')
        } else {
          this.jsonValidationMessage.set('⚠️ 是有效的 JSON，但建议使用对象或数组格式')
          this.jsonValidationSeverity.set('warn')
        }
      }
    } catch (error) {
      // Check if it's a primitive type that's not JSON
      const trimmedValue = value.trim()

      // Check if it's a number
      if (!isNaN(Number(trimmedValue)) && trimmedValue !== '') {
        this.jsonValidationMessage.set('📊 数值类型')
        this.jsonValidationSeverity.set('warn')
      }
      // Check if it's a boolean
      else if (trimmedValue.toLowerCase() === 'true' || trimmedValue.toLowerCase() === 'false') {
        this.jsonValidationMessage.set('🔘 布尔值类型')
        this.jsonValidationSeverity.set('warn')
      }
      // Check if it's a string (not wrapped in quotes)
      else if (
        trimmedValue.length > 0 &&
        !trimmedValue.startsWith('"') &&
        !trimmedValue.endsWith('"')
      ) {
        this.jsonValidationMessage.set('📝 字符串类型')
        this.jsonValidationSeverity.set('warn')
      }
      // Otherwise it's invalid JSON
      else {
        this.jsonValidationMessage.set('❌ 不是有效的 JSON 格式，请检查语法')
        this.jsonValidationSeverity.set('error')
      }
    }
  }

  onSubmit() {
    if (this.configForm.valid) {
      this.submitting.set(true)
      const formData = this.configForm.value

      if (this.mode === 'edit' && this.config) {
        // Update config
        this.httpService.put<any>(`/api/admin/configs/${this.config.id}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '配置更新成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新配置失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to update config:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '更新配置失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      } else {
        // Create config
        this.httpService.post<any>('/api/admin/configs', formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '配置创建成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建配置失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create config:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '创建配置失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      }
    } else {
      this.configForm.markAllAsTouched()
    }
  }
}
