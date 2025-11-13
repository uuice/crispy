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
  selector: 'cs-admin-detail',
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
          <label for="user_name" class="block text-900 font-medium mb-2">用户名 *</label>
          <input
            id="user_name"
            type="text"
            pInputText
            formControlName="user_name"
            placeholder="请输入用户名"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('user_name') }"
          />
          <p-message
            *ngIf="isFieldInvalid('user_name')"
            severity="error"
            [text]="getErrorMessage('user_name')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="field">
          <label class="block text-900 font-medium mb-2">头像</label>
          <div class="avatar-grid">
            <div
              class="avatar-item"
              *ngFor="let url of avatars"
              (click)="selectAvatar(url)"
              [class.selected]="currentAvatar() === url"
            >
              <img [src]="url" alt="avatar" />
            </div>
          </div>
        </div>

        <div class="field" *ngIf="isCreateMode">
          <label for="password" class="block text-900 font-medium mb-2">密码 *</label>
          <input
            id="password"
            type="password"
            pInputText
            formControlName="password"
            placeholder="请输入密码"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('password') }"
          />
          <p-message
            *ngIf="isFieldInvalid('password')"
            severity="error"
            [text]="getErrorMessage('password')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="field">
          <label for="nick_name" class="block text-900 font-medium mb-2">昵称</label>
          <input
            id="nick_name"
            type="text"
            pInputText
            formControlName="nick_name"
            placeholder="请输入昵称"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="email" class="block text-900 font-medium mb-2">邮箱</label>
          <input
            id="email"
            type="email"
            pInputText
            formControlName="email"
            placeholder="请输入邮箱"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('email') }"
          />
          <p-message
            *ngIf="isFieldInvalid('email')"
            severity="error"
            [text]="getErrorMessage('email')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="field">
          <label for="phone" class="block text-900 font-medium mb-2">手机号</label>
          <input
            id="phone"
            type="text"
            pInputText
            formControlName="phone"
            placeholder="请输入手机号"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('phone') }"
          />
          <p-message
            *ngIf="isFieldInvalid('phone')"
            severity="error"
            [text]="getErrorMessage('phone')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="field">
          <label for="role_id" class="block text-900 font-medium mb-2">角色</label>
          <p-select
            id="role_id"
            [options]="roleOptions()"
            formControlName="role_id"
            optionLabel="title"
            optionValue="id"
            placeholder="请选择角色"
            class="w-full"
            appendTo="body"
          ></p-select>
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

        <div class="field">
          <label for="is_black" class="block text-900 font-medium mb-2">黑名单</label>
          <p-select
            id="is_black"
            [options]="blacklistOptions()"
            formControlName="is_black"
            placeholder="请选择是否黑名单"
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
export class AdminDetailComponent implements OnInit {
  @Input() admin: Admin | null = null
  @Input() roles: Role[] = []
  @Input() mode: 'edit' | 'create' = 'create'

  @Output() saved = new EventEmitter<Admin>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true) // Always visible when component is rendered
  submitting = signal(false)

  adminForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.adminForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      password: [''],
      nick_name: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^1[3-9]\d{9}$/)]],
      role_id: [undefined],
      status: [10],
      is_black: [0],
      avatar_url: ['']
    })
  }

  ngOnInit() {
    this.avatars = this.buildAvatars()
    this.currentAdmin.set(this.admin)
    this.availableRoles.set(this.roles)
    this.currentMode.set(this.mode)

    if (this.admin) {
      this.loadFormData(this.admin)
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
    if (this.isCreateMode) return '创建管理员'
    return '编辑管理员'
  }

  roleOptions() {
    return this.availableRoles().map((role) => ({
      id: role.id,
      title: role.title
    }))
  }

  statusOptions() {
    return [
      { label: '启用', value: 10 },
      { label: '禁用', value: -10 }
    ]
  }

  blacklistOptions() {
    return [
      { label: '正常', value: 0 },
      { label: '黑名单', value: 1 }
    ]
  }

  loadFormData(admin: Admin) {
    this.adminForm.patchValue({
      user_name: admin.user_name,
      password: '',
      nick_name: admin.nick_name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      role_id: admin.role_id || null,
      status: admin.status,
      is_black: admin.is_black,
      avatar_url: admin.avatar_url || ''
    })

    this.adminForm.get('password')?.clearValidators()
    this.adminForm.get('password')?.updateValueAndValidity()

    this.adminForm.enable()

    this.adminForm.markAllAsTouched()

    this.logFormErrors()
  }

  resetForm() {
    this.adminForm.reset({
      status: 10,
      is_black: 0,
      avatar_url: this.avatars[0] || ''
    })
    this.adminForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)])
    this.adminForm.get('password')?.updateValueAndValidity()
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

      if (!this.isCreateMode && (formData.password === null || formData.password === '')) {
        delete formData.password
      }

      formData.is_admin = 1
      // formData.is_super_admin = 0

      const adminData: Partial<Admin> = {
        ...formData,
        id: this.currentAdmin()?.id || 0
      }

      this.saved.emit(adminData as Admin)
      this.submitting.set(false)
    } else {
      this.adminForm.markAllAsTouched()
    }
  }

  currentAdmin = signal<Admin | null>(null)
  availableRoles = signal<Role[]>([])
  currentMode = signal<'edit' | 'create'>('create')
  avatars: string[] = []
  buildAvatars(): string[] {
    const colors = [
      '#e57373',
      '#f06292',
      '#ba68c8',
      '#9575cd',
      '#7986cb',
      '#64b5f6',
      '#4fc3f7',
      '#4dd0e1',
      '#4db6ac',
      '#81c784',
      '#aed581',
      '#dce775',
      '#fff176',
      '#ffd54f',
      '#ffb74d',
      '#a1887f',
      '#90a4ae',
      '#ff8a65',
      '#ce93d8',
      '#b39ddb'
    ]
    return colors.map((c) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.3"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="url(#g)"/><circle cx="32" cy="28" r="12" fill="#fff" fill-opacity="0.2"/><path d="M16 50c4-8 12-12 16-12s12 4 16 12" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.3"/></svg>`
      const b64 =
        typeof window !== 'undefined' && window.btoa
          ? window.btoa(unescape(encodeURIComponent(svg)))
          : Buffer.from(svg).toString('base64')
      return `data:image/svg+xml;base64,${b64}`
    })
  }
  selectAvatar(url: string) {
    this.adminForm.get('avatar_url')?.setValue(url)
  }
  currentAvatar(): string {
    return this.adminForm.get('avatar_url')?.value || ''
  }
}
