import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'

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
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [header]="isEditMode() ? '编辑管理员' : '创建管理员'"
      [modal]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
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
          <small *ngIf="isFieldInvalid('user_name')" class="p-error">
            {{ getErrorMessage('user_name') }}
          </small>
        </div>

        <div class="field" *ngIf="!isEditMode()">
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
          <small *ngIf="isFieldInvalid('password')" class="p-error">
            {{ getErrorMessage('password') }}
          </small>
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
          <small *ngIf="isFieldInvalid('email')" class="p-error">
            {{ getErrorMessage('email') }}
          </small>
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
          <small *ngIf="isFieldInvalid('phone')" class="p-error">
            {{ getErrorMessage('phone') }}
          </small>
        </div>

        <div class="field">
          <label for="status" class="block text-900 font-medium mb-2">状态</label>
          <p-select
            id="status"
            [options]="statusOptions()"
            formControlName="status"
            placeholder="请选择状态"
            class="w-full"
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
          ></p-select>
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
          [disabled]="adminForm.invalid"
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
export class AdminDetailComponent implements OnInit {
  @Input() set admin(value: Admin | null) {
    if (value) {
      this.currentAdmin.set(value)
      this.isEditMode.set(true)
      this.loadAdminData(value)
      this.visible.set(true)
    } else if (value === null) {
      // Create mode
      this.currentAdmin.set(null)
      this.isEditMode.set(false)
      this.resetForm()
      this.visible.set(true)
    } else {
      // Hide dialog
      this.visible.set(false)
    }
  }

  @Output() saved = new EventEmitter<Admin>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(false)
  isEditMode = signal(false)
  submitting = signal(false)
  currentAdmin = signal<Admin | null>(null)

  adminForm: FormGroup

  statusOptions = signal([
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ])

  blacklistOptions = signal([
    { label: '正常', value: 0 },
    { label: '黑名单', value: 1 }
  ])

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.adminForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nick_name: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^1[3-9]\d{9}$/)]],
      status: [10],
      is_black: [0]
    })
  }

  ngOnInit() {}

  onDialogHide() {
    this.onCancel()
  }

  onCancel() {
    this.visible.set(false)
    this.resetForm()
    this.cancelled.emit()
  }

  loadAdminData(admin: Admin) {
    this.adminForm.patchValue({
      user_name: admin.user_name,
      password: '', // Don't show password in edit mode
      nick_name: admin.nick_name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      status: admin.status,
      is_black: admin.is_black
    })
    // Remove password validation for edit mode
    this.adminForm.get('password')?.clearValidators()
    this.adminForm.get('password')?.updateValueAndValidity()
  }

  resetForm() {
    this.adminForm.reset({
      user_name: '',
      password: '',
      nick_name: '',
      email: '',
      phone: '',
      status: 10,
      is_black: 0
    })
    // Restore password validation
    this.adminForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)])
    this.adminForm.get('password')?.updateValueAndValidity()
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.adminForm.get(field)
    return formControl ? formControl.invalid && formControl.dirty : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.adminForm.get(field)
    if (!formControl) return ''

    if (formControl.hasError('required')) {
      return '此字段为必填项'
    }
    if (formControl.hasError('minlength')) {
      return `最少需要 ${formControl.errors?.['minlength'].requiredLength} 个字符`
    }
    if (formControl.hasError('maxlength')) {
      return `最多只能 ${formControl.errors?.['maxlength'].requiredLength} 个字符`
    }
    if (formControl.hasError('email')) {
      return '请输入有效的邮箱地址'
    }
    if (formControl.hasError('pattern')) {
      return '请输入有效的手机号'
    }
    return ''
  }

  onSubmit() {
    if (this.adminForm.valid) {
      this.submitting.set(true)
      const formData = this.adminForm.value

      // Remove password if it's empty in edit mode
      if (this.isEditMode() && !formData.password) {
        delete formData.password
      }

      // Add admin type fields
      formData.is_admin = 1
      formData.is_super_admin = 0

      // Create admin object
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
}
