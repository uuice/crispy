import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
  ViewChild
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { ChipsModule } from 'primeng/chips'
import { EditorModule, Editor } from 'primeng/editor'
import { HttpService } from '../../services/http.service'

interface Page {
  id: number
  title: string
  alias: string
  content: string
  abstract?: string
  sub_title?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  image_list?: string
  tags?: string
  remark?: string
  type_id?: number
  author_id?: number
  user_id?: number
  status: number
  create_time: number
  update_time: number
  is_delete: number
}

interface Category {
  id: number
  title: string
  alias?: string
  des?: string
  parent_id?: number
  sort?: number
  status?: number
  create_time: number
  update_time: number
  children?: Category[]
}

interface CategoriesResponse {
  success: boolean
  message: string
  data: Category[]
}

@Component({
  selector: 'cs-page-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DialogModule,
    ToastModule,
    MessageModule,
    ChipsModule,
    EditorModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [header]="dialogTitle"
      [modal]="true"
      [style]="{ width: '800px', maxHeight: '90vh' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
    >
      <form [formGroup]="pageForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="title" class="block text-900 font-medium mb-2">标题 *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="请输入页面标题"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('title') }"
            />
            <p-message
              *ngIf="isFieldInvalid('title')"
              severity="error"
              [text]="getErrorMessage('title')"
              styleClass="mt-1"
            ></p-message>
          </div>

          <div class="field">
            <label for="alias" class="block text-900 font-medium mb-2">别名 *</label>
            <input
              id="alias"
              type="text"
              pInputText
              formControlName="alias"
              placeholder="请输入页面别名"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('alias') }"
            />
            <p-message
              *ngIf="isFieldInvalid('alias')"
              severity="error"
              [text]="getErrorMessage('alias')"
              styleClass="mt-1"
            ></p-message>
          </div>
        </div>

        <div class="field">
          <label for="sub_title" class="block text-900 font-medium mb-2">副标题</label>
          <input
            id="sub_title"
            type="text"
            pInputText
            formControlName="sub_title"
            placeholder="请输入副标题"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="abstract" class="block text-900 font-medium mb-2">摘要</label>
          <textarea
            id="abstract"
            pInputTextarea
            formControlName="abstract"
            placeholder="请输入页面摘要"
            class="w-full"
            [rows]="3"
          ></textarea>
        </div>

        <div class="field">
          <label for="content" class="block text-900 font-medium mb-2">内容 *</label>
          <p-editor
            id="content"
            formControlName="content"
            [style]="{ height: '300px' }"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('content') }"
            [modules]="editorModules"
            #editorRef
          ></p-editor>
          <p-message
            *ngIf="isFieldInvalid('content')"
            severity="error"
            [text]="getErrorMessage('content')"
            styleClass="mt-1"
          ></p-message>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="type_id" class="block text-900 font-medium mb-2">分类</label>
            <p-select
              id="type_id"
              [options]="categoryOptions()"
              formControlName="type_id"
              optionLabel="title"
              optionValue="id"
              placeholder="请选择分类"
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
        </div>

        <div class="field">
          <label for="tags" class="block text-900 font-medium mb-2">标签</label>
          <p-chips
            id="tags"
            formControlName="tags"
            placeholder="请输入标签，按回车键添加"
            class="w-full"
            [addOnBlur]="true"
            [allowDuplicate]="false"
          ></p-chips>
          <p-message severity="info" text="标签将用逗号分隔保存" styleClass="mt-1"></p-message>
        </div>

        <div class="field">
          <label for="seo_title" class="block text-900 font-medium mb-2">SEO标题</label>
          <input
            id="seo_title"
            type="text"
            pInputText
            formControlName="seo_title"
            placeholder="请输入SEO标题"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="seo_description" class="block text-900 font-medium mb-2">SEO描述</label>
          <textarea
            id="seo_description"
            pInputTextarea
            formControlName="seo_description"
            placeholder="请输入SEO描述"
            class="w-full"
            [rows]="3"
          ></textarea>
        </div>

        <div class="field">
          <label for="seo_keywords" class="block text-900 font-medium mb-2">SEO关键词</label>
          <input
            id="seo_keywords"
            type="text"
            pInputText
            formControlName="seo_keywords"
            placeholder="请输入SEO关键词，用逗号分隔"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="image_list" class="block text-900 font-medium mb-2">图片列表</label>
          <p-chips
            id="image_list"
            formControlName="image_list"
            placeholder="请输入图片URL，按回车键添加"
            class="w-full"
            [addOnBlur]="true"
            [allowDuplicate]="false"
          ></p-chips>
          <p-message severity="info" text="图片URL将用逗号分隔保存" styleClass="mt-1"></p-message>

          <!-- Image Preview -->
          @if (pageForm.get('image_list')?.value && pageForm.get('image_list')?.value.length > 0) {
            <div class="image-preview mt-3">
              <h4 class="text-sm font-medium mb-2">图片预览：</h4>
              <div class="image-grid">
                @for (
                  imageUrl of pageForm.get('image_list')?.value;
                  track imageUrl;
                  let i = $index
                ) {
                  <div class="image-item">
                    <img
                      [src]="imageUrl"
                      [alt]="'图片 ' + (i + 1)"
                      class="preview-image"
                      (error)="onImageError($event, i)"
                    />
                    <div class="image-overlay">
                      <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        (click)="removeImage(i)"
                        pTooltip="删除图片"
                      ></p-button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="field">
          <label for="remark" class="block text-900 font-medium mb-2">备注</label>
          <textarea
            id="remark"
            pInputTextarea
            formControlName="remark"
            placeholder="请输入备注信息"
            class="w-full"
            [rows]="3"
          ></textarea>
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
          [disabled]="pageForm.invalid"
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

      .grid {
        display: grid;
      }

      .grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .gap-4 {
        gap: 1rem;
      }

      .image-preview {
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1rem;
        background-color: #f9fafb;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
      }

      .image-item {
        position: relative;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease;
      }

      .image-item:hover {
        transform: scale(1.05);
      }

      .preview-image {
        width: 100%;
        height: 120px;
        object-fit: cover;
        display: block;
      }

      .image-overlay {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .image-item:hover .image-overlay {
        opacity: 1;
      }

      .image-overlay .p-button {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
    `
  ]
})
export class PageDetailComponent implements OnInit {
  @Input() page: Page | null = null
  @Input() mode: 'edit' | 'create' = 'create'

  @Output() saved = new EventEmitter<Page>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true) // Always visible when component is rendered
  submitting = signal(false)

  pageForm: FormGroup

  @ViewChild('editorRef') editorComponent!: Editor

  public editorModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video']
      ],
      handlers: {
        image: () => {
          this.selectLocalImage()
        }
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private httpService: HttpService
  ) {
    this.pageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      alias: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sub_title: [''],
      abstract: [''],
      content: ['', [Validators.required, Validators.minLength(10)]],
      type_id: [null],
      status: [10],
      tags: [[]],
      seo_title: [''],
      seo_description: [''],
      seo_keywords: [''],
      image_list: [[]],
      remark: ['']
    })
  }

  ngOnInit() {
    // Initialize with current values
    this.currentPage.set(this.page)
    this.currentMode.set(this.mode)

    // Load categories
    this.fetchCategories()

    // Load form data if page exists, otherwise reset form
    if (this.page) {
      this.loadFormData(this.page)
    } else {
      this.resetForm()
    }

    // Log form status changes for debugging
    this.pageForm.statusChanges.subscribe(() => {
      this.logFormErrors()
    })
  }

  logFormErrors() {
    if (this.pageForm.invalid) {
      console.log('--- Form is INVALID ---')
      Object.keys(this.pageForm.controls).forEach((key) => {
        const control = this.pageForm.get(key)
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
    if (this.isCreateMode) return '创建页面'
    return '编辑页面'
  }

  categoryOptions() {
    return this.flattenCategories(this.availableCategories())
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

  statusOptions() {
    return [
      { label: '启用', value: 10 },
      { label: '禁用', value: -10 }
    ]
  }

  loadFormData(page: Page) {
    // Convert tags string to array for chips component
    const tags = page.tags
      ? page.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : []

    // Convert image_list string to array for chips component
    const imageList = page.image_list
      ? page.image_list
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url)
      : []

    this.pageForm.patchValue({
      title: page.title,
      alias: page.alias,
      sub_title: page.sub_title || '',
      abstract: page.abstract || '',
      content: page.content,
      type_id: page.type_id || null,
      status: page.status,
      tags: tags,
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      seo_keywords: page.seo_keywords || '',
      image_list: imageList,
      remark: page.remark || ''
    })

    this.pageForm.enable()
    this.pageForm.markAllAsTouched()
    this.logFormErrors()
  }

  resetForm() {
    this.pageForm.reset({
      status: 10,
      tags: [],
      image_list: []
    })
    this.pageForm.enable()
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.pageForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getErrorMessage(fieldName: string): string {
    const field = this.pageForm.get(fieldName)
    if (!field || !field.errors) return ''

    const errors = field.errors
    if (errors['required']) return '此字段为必填项'
    if (errors['minlength']) return `最少需要 ${errors['minlength'].requiredLength} 个字符`
    if (errors['maxlength']) return `最多只能输入 ${errors['maxlength'].requiredLength} 个字符`

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
    if (this.pageForm.valid) {
      this.submitting.set(true)
      const formData = this.pageForm.value

      // Convert tags array back to comma-separated string
      if (formData.tags && Array.isArray(formData.tags)) {
        formData.tags = formData.tags.join(',')
      }

      // Convert image_list array back to comma-separated string
      if (formData.image_list && Array.isArray(formData.image_list)) {
        formData.image_list = formData.image_list.join(',')
      }

      // Ensure empty values are converted to empty strings instead of null
      const sanitizedData = {
        ...formData,
        abstract: formData.abstract || '',
        sub_title: formData.sub_title || '',
        seo_title: formData.seo_title || '',
        seo_description: formData.seo_description || '',
        seo_keywords: formData.seo_keywords || '',
        image_list: formData.image_list || '',
        tags: formData.tags || '',
        remark: formData.remark || '',
        type_id: formData.type_id || 0,
        author_id: formData.author_id || 0,
        user_id: formData.user_id || 0
      }

      const pageData: Partial<Page> = {
        ...sanitizedData,
        id: this.currentPage()?.id || 0
      }

      console.log('content:', formData.content)

      this.saved.emit(pageData as Page)
      this.submitting.set(false)
    } else {
      this.pageForm.markAllAsTouched()
    }
  }

  currentPage = signal<Page | null>(null)
  currentMode = signal<'edit' | 'create'>('create')
  availableCategories = signal<Category[]>([])

  onImageError(event: any, index: number) {
    console.error(`Image at index ${index} failed to load:`, event.target.src)
    // Optionally show a message to the user
    this.messageService.add({
      severity: 'warn',
      summary: '图片加载失败',
      detail: `图片 ${index + 1} 无法加载，请检查URL是否正确`
    })
  }

  removeImage(index: number) {
    const currentImages = this.pageForm.get('image_list')?.value || []
    const updatedImages = currentImages.filter((_: any, i: number) => i !== index)
    this.pageForm.get('image_list')?.setValue(updatedImages)
  }

  private fetchCategories() {
    this.httpService
      .get<CategoriesResponse>('/api/admin/categories/tree', { alias: 'PAGE_SYS_CAT' })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.availableCategories.set(response.data)
          } else {
            console.error('Failed to load categories:', response.message)
          }
        },
        error: (error) => {
          console.error('Error fetching categories:', error)
        }
      })
  }

  selectLocalImage() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        this.httpService.post('/api/admin/upload/image', formData).subscribe({
          next: (response: any) => {
            if (response.success) {
              // 通过ViewChild拿到quill实例
              const quillEditor = this.editorComponent?.quill
              if (quillEditor) {
                const range = quillEditor.getSelection(true)
                quillEditor.insertEmbed(range.index, 'image', response.data.url)
                quillEditor.setSelection(range.index + 1)
                // 关键：同步内容到表单
                const html = quillEditor.root.innerHTML
                this.pageForm.get('content')?.setValue(html)
              }
              this.messageService.add({
                severity: 'success',
                summary: '上传成功',
                detail: '图片上传成功'
              })
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '上传失败',
                detail: response.message || '图片上传失败'
              })
            }
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: '上传失败',
              detail: '图片上传失败，请重试'
            })
          }
        })
      }
    }
  }
}
