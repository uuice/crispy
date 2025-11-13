import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'

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

@Component({
  selector: 'cs-apps-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
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
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
      [closeOnEscape]="false"
    >
      <form [formGroup]="adminForm" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="app_name" class="block text-900 font-medium mb-2">应用名称 *</label>
          <input
            id="app_name"
            type="text"
            pInputText
            formControlName="app_name"
            placeholder="请输入应用名称"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('app_name') }"
          />
          <p-message
            *ngIf="isFieldInvalid('app_name')"
            severity="error"
            [text]="getErrorMessage('app_name')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="field">
          <label for="token" class="block text-900 font-medium mb-2">Token</label>
          <div class="flex gap-2">
            <input
              id="token"
              type="text"
              pInputText
              formControlName="token"
              placeholder="系统将自动生成Token"
              class="flex-1"
              readonly
            />
            <button type="button" pButton label="生成" (click)="generateToken()"></button>
          </div>
        </div>

        <div class="field">
          <label for="channel" class="block text-900 font-medium mb-2">渠道 *</label>
          <input
            id="channel"
            type="text"
            pInputText
            formControlName="channel"
            placeholder="请输入渠道"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('channel') }"
          />
          <p-message
            *ngIf="isFieldInvalid('channel')"
            severity="error"
            [text]="getErrorMessage('channel')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="field">
          <label for="user_id" class="block text-900 font-medium mb-2">用户ID *</label>
          <input
            id="user_id"
            type="number"
            pInputText
            formControlName="user_id"
            placeholder="请输入用户ID"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('user_id') }"
          />
          <p-message
            *ngIf="isFieldInvalid('user_id')"
            severity="error"
            [text]="getErrorMessage('user_id')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="field">
          <label for="status" class="block text-900 font-medium mb-2">状态</label>
          <p-select
            id="status"
            [options]="statusOptions()"
            formControlName="status"
            placeholder="请选择状态"
            class="w-full"
            appendTo="body"
          ></p-select>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <p-button
          label="关闭"
          icon="pi pi-times"
          severity="secondary"
          (click)="onCancel()"
        ></p-button>
        <p-button
          label="保存"
          icon="pi pi-check"
          [loading]="submitting()"
          [disabled]="adminForm.invalid"
          (click)="onSubmit()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .field {
        margin-bottom: 1rem;
      }
      .avatar-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }
      .avatar-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
      }
      .avatar-item.selected {
        border-color: #a259e6;
        box-shadow: 0 0 0 2px rgba(162, 89, 230, 0.3);
      }
      .avatar-item img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    `
  ]
})
export class AppsDetailComponent implements OnInit {
  @Input() accessToken: AccessToken | null = null
  @Input() mode: 'edit' | 'create' = 'create'

  @Output() saved = new EventEmitter<AccessToken>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true) // Always visible when component is rendered
  submitting = signal(false)

  adminForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.adminForm = this.fb.group({
      app_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      token: [''],
      channel: [''],
      user_id: ['', [Validators.required, Validators.min(1)]],
      status: [10]
    })
  }

  ngOnInit() {
    this.currentToken.set(this.accessToken)
    this.currentMode.set(this.mode)

    if (this.accessToken) {
      this.loadFormData(this.accessToken)
    } else {
      this.resetForm()
    }

    // Log form status changes for debugging
    this.adminForm.statusChanges.subscribe(() => {
      this.logFormErrors()
    })
  }

  logFormErrors() {
    if (this.adminForm.invalid) {
      console.log('--- Form is INVALID ---')
      Object.keys(this.adminForm.controls).forEach((key) => {
        const control = this.adminForm.get(key)
        if (control && control.invalid) {
          console.log(`Control '${key}' has errors:`, control.errors)
        }
      })
    }
  }

  get isCreateMode(): boolean {
    return this.currentMode() === 'create'
  }

  get dialogTitle(): string {
    if (this.isCreateMode) return '创建应用'
    return '编辑应用'
  }

  roleOptions() {
    return []
  }

  statusOptions() {
    return [
      { label: '启用', value: 10 },
      { label: '禁用', value: -10 }
    ]
  }

  loadFormData(token: AccessToken) {
    this.adminForm.patchValue({
      app_name: token.app_name,
      token: token.token,
      channel: token.channel,
      user_id: token.user_id,
      status: token.status
    })

    this.adminForm.enable()

    this.adminForm.markAllAsTouched()

    this.logFormErrors()
  }

  resetForm() {
    this.adminForm.reset({
      status: 10
    })
    this.adminForm.enable()
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adminForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getErrorMessage(fieldName: string): string {
    const field = this.adminForm.get(fieldName)
    if (!field || !field.errors) return ''

    const errors = field.errors
    if (errors['required']) return '此字段为必填项'
    if (errors['minlength']) return `最少需要 ${errors['minlength'].requiredLength} 个字符`
    if (errors['maxlength']) return `最多只能输入 ${errors['maxlength'].requiredLength} 个字符`
    if (errors['email']) return '请输入有效的邮箱地址'
    if (errors['pattern']) return '请输入有效的手机号'

    return '输入格式不正确'
  }

  onDialogHide() {
    this.cancelled.emit()
  }

  onCancel() {
    this.visible.set(false)
    this.cancelled.emit()
  }

  onSubmit() {
    if (this.adminForm.valid) {
      this.submitting.set(true)
      const formData = this.adminForm.value

      const tokenData: Partial<AccessToken> = {
        ...formData,
        id: this.currentToken()?.id || 0
      }

      this.saved.emit(tokenData as AccessToken)
      this.submitting.set(false)
    } else {
      this.adminForm.markAllAsTouched()
    }
  }

  currentToken = signal<AccessToken | null>(null)
  currentMode = signal<'edit' | 'create'>('create')

  /**
   * 生成UUID格式的token
   * @returns UUID字符串
   */
  generateUUID(): string {
    // 生成UUID v4 格式的字符串
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * 生成token并填充到表单中
   */
  generateToken(): void {
    const token = this.generateUUID()
    this.adminForm.get('token')?.setValue(token)
  }
}
