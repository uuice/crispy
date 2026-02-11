import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core'
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
import { AutoCompleteModule } from 'primeng/autocomplete'
import { Editor, EditorModule } from 'primeng/editor'
import { HttpService } from '../../services/http.service'
import hljs from 'highlight.js'
import Vditor from 'vditor'
import { VditorEditorComponent } from '../../components/vditor-editor.component'
import { CategoryEntityNested, PageEntity } from '@src/types'

interface CategoriesResponse {
  success: boolean
  message: string
  data: CategoryEntityNested[]
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
    AutoCompleteModule,
    EditorModule,
    VditorEditorComponent
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
      [closeOnEscape]="false"
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
            @if (isFieldInvalid('title')) {
              <p-message
                severity="error"
                [text]="getErrorMessage('title')"
                styleClass="mt-1"
              ></p-message>
            }
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
            @if (isFieldInvalid('alias')) {
              <p-message
                severity="error"
                [text]="getErrorMessage('alias')"
                styleClass="mt-1"
              ></p-message>
            }
          </div>
        </div>

        <div class="field">
          <label for="url" class="block text-900 font-medium mb-2">URL</label>
          <input
            id="url"
            type="text"
            pInputText
            formControlName="url"
            placeholder="请输入文章URL, 新增的时候不填会自动生成"
            class="w-full"
          />
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
          <label for="is_markdown" class="block text-900 font-medium mb-2">是否使用markdown</label>
          <p-select
            id="is_markdown"
            [options]="markdownOptions()"
            formControlName="is_markdown"
            placeholder="请选择是否使用markdown"
            class="w-full"
            appendTo="body"
          ></p-select>
        </div>

        @if (pageForm.get('is_markdown')?.value === 1) {
          <div class="field">
            <label for="markdown_content" class="block text-900 font-medium mb-2"
              >markdown内容</label
            >
            <vditor-editor
              #vditorEditor
              [value]="pageForm.get('markdown_content')?.value"
              (valueChange)="pageForm.get('markdown_content')?.setValue($event)"
            ></vditor-editor>
          </div>
        } @else {
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
            @if (isFieldInvalid('content')) {
              <p-message
                severity="error"
                [text]="getErrorMessage('content')"
                styleClass="mt-1"
              ></p-message>
            }
          </div>
        }

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
          <p-autoComplete
            id="tags"
            formControlName="tags"
            [multiple]="true"
            [suggestions]="filteredTags"
            (completeMethod)="filterTags($event)"
            (onSelect)="onTagSelect($event)"
            (onUnselect)="onTagUnselect($event)"
            (keydown)="onTagKeydown($event)"
            placeholder="请输入标签，按回车键添加"
            class="w-full"
          ></p-autoComplete>
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
          <p-autoComplete
            id="image_list"
            formControlName="image_list"
            [multiple]="true"
            [suggestions]="filteredImages"
            (completeMethod)="filterImages($event)"
            (onSelect)="onImageSelect($event)"
            (onUnselect)="onImageUnselect($event)"
            (keydown)="onImageKeydown($event)"
            placeholder="请输入图片URL，按回车键添加"
            class="w-full"
          ></p-autoComplete>
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
  @Input() page: PageEntity | null = null
  @Input() mode: 'edit' | 'create' = 'create'

  @Output() saved = new EventEmitter<PageEntity>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true) // Always visible when component is rendered
  submitting = signal(false)

  pageForm: FormGroup

  @ViewChild('editorRef') editorComponent!: Editor

  @ViewChild('vditorEditor') vditorEditor!: VditorEditorComponent

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
    },
    syntax: { hljs }
  }

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private httpService: HttpService
  ) {
    this.pageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      url: [''],
      alias: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sub_title: [''],
      abstract: [''],
      content: [''],
      markdown_content: [''],
      is_markdown: [0],
      type_id: [undefined],
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

    // 配置 highlight.js
    hljs.configure({
      languages: [
        'javascript',
        'typescript',
        'html',
        'css',
        'python',
        'java',
        'cpp',
        'c',
        'php',
        'ruby',
        'go',
        'rust',
        'sql',
        'json',
        'xml',
        'yaml',
        'bash',
        'shell'
      ]
    })

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

  flattenCategories(categories: CategoryEntityNested[]): CategoryEntityNested[] {
    const result: CategoryEntityNested[] = []
    const flatten = (cats: CategoryEntityNested[]) => {
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

  markdownOptions() {
    return [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ]
  }

  loadFormData(page: PageEntity) {
    // Convert tags string to array for autoComplete component
    const tags = page.tags
      ? page.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : []

    // Convert image_list string to array for autoComplete component
    const imageList = page.image_list
      ? page.image_list
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url)
      : []

    this.pageForm.patchValue({
      title: page.title,
      url: page.url,
      alias: page.alias,
      sub_title: page.sub_title || '',
      abstract: page.abstract || '',
      content: page.content,
      markdown_content: page.markdown_content || '',
      is_markdown: page.is_markdown || 0,
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
      is_markdown: 1,
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

  async onSubmit() {
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

      if (this.pageForm.get('is_markdown')?.value === 1) {
        sanitizedData.content = await Vditor.md2html(sanitizedData.markdown_content, {
          cdn: '',
          mode: 'light',
          hljs: {
            enable: true,
            lineNumber: true
          }
        })
      }

      const pageData: Partial<PageEntity> = {
        ...sanitizedData,
        id: this.currentPage()?.id || 0
      }

      console.log('content:', formData.content)

      this.saved.emit(pageData as PageEntity)
      this.submitting.set(false)
    } else {
      this.pageForm.markAllAsTouched()
    }
  }

  currentPage = signal<PageEntity | null>(null)
  currentMode = signal<'edit' | 'create'>('create')
  availableCategories = signal<CategoryEntityNested[]>([])

  // AutoComplete properties and methods
  filteredTags: string[] = []
  filteredImages: string[] = []

  filterTags(event: any) {
    // For tags, we can provide suggestions based on existing tags or allow free input
    // For now, we'll allow free input by not filtering
    this.filteredTags = []
  }

  filterImages(event: any) {
    // For images, we can provide suggestions based on existing images or allow free input
    // For now, we'll allow free input by not filtering
    this.filteredImages = []
  }

  onTagSelect(event: any) {
    // Handle tag selection if needed
    console.log('Tag selected:', event)
  }

  onTagUnselect(event: any) {
    // Handle tag unselection if needed
    console.log('Tag unselected:', event)
  }

  onImageSelect(event: any) {
    // Handle image selection if needed
    console.log('Image selected:', event)
  }

  onImageUnselect(event: any) {
    // Handle image unselection if needed
    console.log('Image unselected:', event)
  }

  onTagKeydown(event: any) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      event.preventDefault()
      const currentTags = this.pageForm.get('tags')?.value || []
      const newTag = event.target.value.trim()
      if (!currentTags.includes(newTag)) {
        this.pageForm.get('tags')?.setValue([...currentTags, newTag])
      }
      event.target.value = ''
    }
  }

  onImageKeydown(event: any) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      event.preventDefault()
      const currentImages = this.pageForm.get('image_list')?.value || []
      const newImage = event.target.value.trim()
      if (!currentImages.includes(newImage)) {
        this.pageForm.get('image_list')?.setValue([...currentImages, newImage])
      }
      event.target.value = ''
    }
  }

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

  // Restore selectLocalImage method
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
              // Get quill instance via ViewChild
              const quillEditor = this.editorComponent?.quill
              if (quillEditor) {
                const range = quillEditor.getSelection(true)
                quillEditor.insertEmbed(range.index, 'image', response.data.url)
                quillEditor.setSelection(range.index + 1)
                // Sync content to form
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
