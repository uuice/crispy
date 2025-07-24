import { Component, OnInit, Input, Output, EventEmitter, OnChanges, signal } from '@angular/core'
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
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { SelectModule } from 'primeng/select'

interface MenuNode {
  id: number
  title: string
  alias: string
  icon?: string
  url?: string
  image_url?: string
  method?: string
  sort: number
  status: number
  parent_id: number
  create_time: number
  update_time: number
  children?: MenuNode[]
}

@Component({
  selector: 'cs-menu-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    MessageModule,
    SelectModule
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
      <form [formGroup]="menuForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label for="title" class="block text-900 font-medium mb-2">菜单名称 *</label>
              <input
                id="title"
                type="text"
                pInputText
                formControlName="title"
                placeholder="请输入菜单名称"
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
              <label for="alias" class="block text-900 font-medium mb-2">别名 *</label>
              <input
                id="alias"
                type="text"
                pInputText
                formControlName="alias"
                placeholder="请输入别名"
                class="w-full"
                [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('alias') }"
              />
              @if (isFieldInvalid('alias')) {
                <p-message
                  severity="error"
                  [text]="getErrorMessage('alias')"
                  styleClass="mt-1"
                ></p-message>
              }
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
              <label for="url" class="block text-900 font-medium mb-2">链接</label>
              <input
                id="url"
                type="text"
                pInputText
                formControlName="url"
                placeholder="请输入链接"
                class="w-full"
              />
            </div>
          </div>

          <div class="col-6">
            <div class="field">
              <label for="method" class="block text-900 font-medium mb-2">打开方式</label>
              <input
                id="method"
                type="text"
                pInputText
                formControlName="method"
                placeholder="_blank/_self等"
                class="w-full"
              />
            </div>
          </div>

          <div class="col-6">
            <div class="field">
              <label for="image_url" class="block text-900 font-medium mb-2">图片URL</label>
              <input
                id="image_url"
                type="text"
                pInputText
                formControlName="image_url"
                placeholder="请输入图片URL"
                class="w-full"
              />
            </div>
          </div>

          <div class="col-6">
            <div class="field">
              <label for="parent_id" class="block text-900 font-medium mb-2">父级菜单</label>
              <p-select
                id="parent_id"
                [options]="parentOptions()"
                formControlName="parent_id"
                optionLabel="title"
                optionValue="id"
                placeholder="请选择父级菜单"
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
          (click)="onCancel()"
        ></button>
        <button
          pButton
          label="保存"
          icon="pi pi-check"
          [loading]="submitting()"
          [disabled]="menuForm.invalid"
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
export class MenuDetailComponent implements OnInit, OnChanges {
  @Input() menu: MenuNode | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  menuForm: FormGroup
  submitting = signal(false)
  parentOptions = signal<MenuNode[]>([])

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: 0 }
  ]

  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {
    this.menuForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      alias: ['', [Validators.required, Validators.minLength(2)]],
      icon: [''],
      url: [''],
      image_url: [''],
      method: [''],
      parent_id: [0],
      sort: [0],
      status: [10]
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadParentOptions()
      this.menuForm.reset({
        title: '',
        alias: '',
        icon: '',
        url: '',
        image_url: '',
        method: '',
        parent_id: 0,
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

  get dialogTitle(): string {
    if (this.mode === 'create') return '创建菜单'
    return '编辑菜单'
  }

  loadParentOptions() {
    this.httpService.get<any>('/api/admin/menus/tree').subscribe({
      next: (response) => {
        if (response.success) {
          this.parentOptions.set(this.flattenTreeData(response.data || []))
        }
      },
      error: (error) => {
        console.error('Failed to load parent options:', error)
      }
    })
  }

  flattenTreeData(nodes: MenuNode[]): MenuNode[] {
    let result: MenuNode[] = []
    nodes.forEach((node) => {
      result.push(node)
      if (node.children && node.children.length > 0) {
        result = result.concat(this.flattenTreeData(node.children))
      }
    })
    return result
  }

  initializeForm() {
    if (this.menu && this.mode === 'edit') {
      this.menuForm.patchValue({
        title: this.menu.title,
        alias: this.menu.alias,
        icon: this.menu.icon || '',
        url: this.menu.url || '',
        image_url: this.menu.image_url || '',
        method: this.menu.method || '',
        parent_id: this.menu.parent_id,
        sort: this.menu.sort,
        status: this.menu.status
      })
    } else if (this.mode === 'create') {
      this.resetForm()
    }
    this.submitting.set(false)
  }

  resetForm() {
    this.menuForm.reset({
      title: '',
      alias: '',
      icon: '',
      url: '',
      image_url: '',
      method: '',
      parent_id: 0,
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
    const formControl = this.menuForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.menuForm.get(field)
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
    if (this.menuForm.valid) {
      this.submitting.set(true)
      const formData = this.menuForm.value
      if (this.mode === 'edit' && this.menu) {
        this.httpService.put<any>(`/api/admin/menus/${this.menu.id}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '菜单更新成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新菜单失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to update menu:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '更新菜单失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      } else {
        this.httpService.post<any>('/api/admin/menus', formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '菜单创建成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建菜单失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create menu:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '创建菜单失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      }
    } else {
      this.menuForm.markAllAsTouched()
    }
  }
}
