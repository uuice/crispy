import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { TextareaModule } from 'primeng/textarea'
import { HttpService } from '../../services/http.service'

interface FriendLink {
  id: number
  title: string
  url: string
  description?: string
  logo?: string
  sort: number
  status: number
  type_id?: number
  create_time: number
  update_time: number
}

interface Category {
  id: number
  title: string
  alias: string
  des?: string
  parent_id: number
  sort: number
  status: number
  create_time: number
  update_time: number
  children?: Category[]
}

@Component({
  selector: 'cs-friend-link-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    ToastModule,
    MessageModule,
    TextareaModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-dialog
      [visible]="true"
      (visibleChange)="onCancel()"
      [header]="dialogTitle"
      [modal]="true"
      [style]="{ width: '600px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <form [formGroup]="friendLinkForm" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12">
            <label for="title" class="block text-900 font-medium mb-2">链接名称 *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="请输入链接名称"
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

          <div class="field col-12">
            <label for="url" class="block text-900 font-medium mb-2">链接地址 *</label>
            <input
              id="url"
              type="url"
              pInputText
              formControlName="url"
              placeholder="请输入链接地址 (例如: https://example.com)"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('url') }"
            />
            @if (isFieldInvalid('url')) {
              <p-message
                severity="error"
                [text]="getErrorMessage('url')"
                styleClass="mt-1"
              ></p-message>
            }
          </div>

          <div class="field col-12">
            <label for="description" class="block text-900 font-medium mb-2">描述</label>
            <textarea
              id="description"
              pInputTextarea
              formControlName="description"
              placeholder="请输入链接描述"
              [rows]="3"
              class="w-full"
            ></textarea>
          </div>

          <div class="field col-6">
            <label for="type_id" class="block text-900 font-medium mb-2">分类</label>
            <p-select
              id="type_id"
              [options]="categoryOptions"
              formControlName="type_id"
              optionLabel="title"
              optionValue="id"
              placeholder="请选择分类"
              class="w-full"
              [showClear]="true"
              appendTo="body"
            ></p-select>
          </div>

          <div class="field col-6">
            <label for="logo" class="block text-900 font-medium mb-2">Logo URL</label>
            <input
              id="logo"
              type="url"
              pInputText
              formControlName="logo"
              placeholder="请输入Logo地址"
              class="w-full"
            />
          </div>

          <div class="field col-6">
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

          <div class="field col-6">
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
          [disabled]="friendLinkForm.invalid"
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
    `
  ]
})
export class FriendLinkDetailComponent implements OnInit, OnChanges {
  @Input() friendLink: FriendLink | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<Partial<FriendLink>>()
  @Output() cancelled = new EventEmitter<void>()

  submitting = signal(false)
  categories = signal<Category[]>([])
  friendLinkForm: FormGroup

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: 0 }
  ]

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private httpService: HttpService
  ) {
    this.friendLinkForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      description: [''],
      logo: [''],
      type_id: [null],
      sort: [0],
      status: [10]
    })
  }

  ngOnInit() {
    this.loadCategories()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['friendLink'] || changes['mode']) {
      this.updateForm()
    }
  }

  loadCategories() {
    // Load categories tree with alias LINK_SYS_CAT
    this.httpService.get<any>('/api/admin/categories/tree', { alias: 'LINK_SYS_CAT' }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Flatten the tree structure for select options
          const flatCategories = this.flattenCategories(response.data || [])
          this.categories.set(flatCategories)
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error)
      }
    })
  }

  flattenCategories(categories: Category[]): Category[] {
    const result: Category[] = []
    const flatten = (cats: Category[]) => {
      cats.forEach((cat) => {
        result.push(cat)
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children)
        }
      })
    }
    flatten(categories)
    return result
  }

  get categoryOptions() {
    return this.categories()
  }

  private updateForm() {
    if (this.mode === 'edit' && this.friendLink) {
      this.friendLinkForm.patchValue(this.friendLink)
    } else {
      this.friendLinkForm.reset({
        title: '',
        url: '',
        description: '',
        logo: '',
        type_id: null,
        sort: 0,
        status: 10
      })
    }
  }

  get isCreateMode(): boolean {
    return this.mode === 'create'
  }

  get dialogTitle(): string {
    return this.isCreateMode ? '创建友情链接' : '编辑友情链接'
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.friendLinkForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getErrorMessage(fieldName: string): string {
    const field = this.friendLinkForm.get(fieldName)
    if (!field || !field.errors) return ''

    const errors = field.errors
    if (errors['required']) return '此字段为必填项'
    if (errors['minlength']) return `最少需要 ${errors['minlength'].requiredLength} 个字符`
    if (errors['pattern']) return '请输入有效的URL地址'
    return '输入格式不正确'
  }

  onCancel() {
    this.cancelled.emit()
  }

  onSubmit() {
    if (this.friendLinkForm.valid) {
      this.submitting.set(true)
      const formData: Partial<FriendLink> = {
        ...this.friendLinkForm.value
      }
      if (this.friendLink) {
        formData.id = this.friendLink.id
      }
      this.saved.emit(formData)
      this.submitting.set(false)
    } else {
      this.friendLinkForm.markAllAsTouched()
    }
  }
}
