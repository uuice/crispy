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
import { HttpService } from '../../services/http.service'

interface User {
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
}

@Component({
  selector: 'cs-user-detail',
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
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
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
          [disabled]="userForm.invalid"
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
export class UserDetailComponent implements OnInit {
  @Input() user: User | null = null
  @Input() mode: 'edit' | 'create' = 'create'

  @Output() saved = new EventEmitter<User>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true) // Always visible when component is rendered
  submitting = signal(false)

  userForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private httpService: HttpService
  ) {
    this.userForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      password: [''],
      nick_name: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^1[3-9]\d{9}$/)]],
      status: [10],
      is_black: [0],
      avatar_url: ['']
    })
  }

  ngOnInit() {
    this.avatars = this.buildAvatars()
    this.currentUser.set(this.user)
    this.currentMode.set(this.mode)

    if (this.user) {
      this.loadFormData(this.user)
    } else {
      this.resetForm()
    }

    // Log form status changes for debugging
    this.userForm.statusChanges.subscribe(() => {
      this.logFormErrors()
    })
  }

  logFormErrors() {
    if (this.userForm.invalid) {
      console.log('--- Form is INVALID ---')
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key)
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
    if (this.isCreateMode) return '创建用户'
    return '编辑用户'
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

  loadFormData(user: User) {
    this.userForm.patchValue({
      user_name: user.user_name,
      password: '',
      nick_name: user.nick_name || '',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status,
      is_black: user.is_black,
      avatar_url: user.avatar_url || ''
    })

    this.userForm.get('password')?.clearValidators()
    this.userForm.get('password')?.updateValueAndValidity()

    this.userForm.enable()

    this.userForm.markAllAsTouched()

    this.logFormErrors()
  }

  resetForm() {
    this.userForm.reset({
      status: 10,
      is_black: 0,
      avatar_url: this.avatars[0] || ''
    })
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)])
    this.userForm.get('password')?.updateValueAndValidity()
    this.userForm.enable()
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName)
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
    if (this.userForm.valid) {
      this.submitting.set(true)
      const formData = this.userForm.value

      if (!this.isCreateMode && (formData.password === null || formData.password === '')) {
        delete formData.password
      }

      // Set default values for new users
      if (this.isCreateMode) {
        formData.is_admin = 0
        formData.is_super_admin = 0
      }

      const userData: Partial<User> = {
        ...formData,
        id: this.currentUser()?.id || 0
      }

      if (this.isCreateMode) {
        // Create user
        this.httpService.post<any>('/api/admin/users', userData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '用户创建成功'
              })
              this.saved.emit(userData as User)
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建用户失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create user:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error?.message || '创建用户失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      } else {
        // Update user
        this.httpService
          .put<any>(`/api/admin/users/${this.currentUser()?.id}`, userData)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.messageService.add({
                  severity: 'success',
                  summary: '成功',
                  detail: '用户更新成功'
                })
                this.saved.emit(userData as User)
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: '错误',
                  detail: response.message || '更新用户失败'
                })
              }
            },
            error: (error) => {
              console.error('Failed to update user:', error)
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: error.error?.message || '更新用户失败'
              })
            },
            complete: () => {
              this.submitting.set(false)
            }
          })
      }
    } else {
      this.userForm.markAllAsTouched()
    }
  }

  currentUser = signal<User | null>(null)
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
    this.userForm.get('avatar_url')?.setValue(url)
  }
  currentAvatar(): string {
    return this.userForm.get('avatar_url')?.value || ''
  }
}
