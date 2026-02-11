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
import { CategoryEntity, CategoryEntityNested } from '@src/types'

@Component({
  selector: 'cs-category-detail',
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
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label for="title" class="block text-900 font-medium mb-2">分类名称 *</label>
              <input
                id="title"
                type="text"
                pInputText
                formControlName="title"
                placeholder="请输入分类名称"
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
                placeholder="请输入分类别名"
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

          <div class="col-12">
            <div class="field">
              <label for="des" class="block text-900 font-medium mb-2">描述</label>
              <textarea
                id="des"
                pInputTextarea
                formControlName="des"
                placeholder="请输入分类描述"
                [rows]="3"
                class="w-full"
              ></textarea>
            </div>
          </div>

          <div class="col-6">
            <div class="field">
              <label for="parent_id" class="block text-900 font-medium mb-2">父级分类</label>
              <p-select
                id="parent_id"
                [options]="parentOptions()"
                formControlName="parent_id"
                optionLabel="title"
                optionValue="id"
                placeholder="请选择父级分类"
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
          [disabled]="categoryForm.invalid"
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
export class CategoryDetailComponent implements OnInit, OnChanges {
  @Input() category: CategoryEntityNested | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  categoryForm: FormGroup
  submitting = signal(false)
  parentOptions = signal<CategoryEntityNested[]>([])

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: 0 }
  ]

  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      alias: ['', [Validators.required, Validators.minLength(2)]],
      des: [''],
      parent_id: [0],
      sort: [0],
      status: [10]
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadParentOptions()
      this.categoryForm.reset({
        title: '',
        alias: '',
        des: '',
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

  initializeForm() {
    if (this.category && this.mode === 'edit') {
      this.loadCategoryData()
    } else if (this.mode === 'create') {
      this.resetForm()
    }
    this.submitting.set(false)
  }

  get isEditMode(): boolean {
    return this.mode === 'edit'
  }

  get dialogTitle(): string {
    if (this.mode === 'create') return '创建分类'
    return '编辑分类'
  }

  loadParentOptions() {
    this.httpService.get<any>('/api/admin/categories/tree').subscribe({
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

  flattenTreeData(nodes: CategoryEntityNested[]): CategoryEntityNested[] {
    let result: CategoryEntityNested[] = []
    nodes.forEach((node) => {
      result.push(node)
      if (node.children && node.children.length > 0) {
        result = result.concat(this.flattenTreeData(node.children))
      }
    })
    return result
  }

  loadCategoryData() {
    if (this.category) {
      this.categoryForm.patchValue({
        title: this.category.title,
        alias: this.category.alias,
        des: this.category.des || '',
        parent_id: this.category.parent_id,
        sort: this.category.sort,
        status: this.category.status
      })
    }
  }

  resetForm() {
    this.categoryForm.reset({
      title: '',
      alias: '',
      des: '',
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
    const formControl = this.categoryForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.categoryForm.get(field)
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
    if (this.categoryForm.valid) {
      this.submitting.set(true)
      const formData = this.categoryForm.value

      if (this.mode === 'edit' && this.category) {
        // Update category
        this.httpService.put<any>(`/api/admin/categories/${this.category.id}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '分类更新成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新分类失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to update category:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '更新分类失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      } else {
        // Create category
        this.httpService.post<any>('/api/admin/categories', formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '分类创建成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建分类失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create category:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '创建分类失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      }
    } else {
      this.categoryForm.markAllAsTouched()
    }
  }
}
