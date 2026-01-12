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
import { VditorEditorComponent } from '../../components/vditor-editor.component'
import Vditor from 'vditor'

interface Article {
  id: number
  title: string
  url: string
  content: string
  markdown_content?: string
  is_markdown?: number
  abstract?: string
  sub_title?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  image?: string
  image_list?: string
  tags?: string
  remark?: string
  type_id?: number
  type_ids?: string
  author_id?: number
  user_id?: number
  status: number // 10=已发布, -10=待发布, -20=草稿箱, -100=已删除
  click?: number
  is_review?: number
  redirect_url?: string
  attrs?: string
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
  selector: 'cs-post-detail',
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
      [style]="{ width: '900px', maxHeight: '90vh' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
      [closeOnEscape]="false"
    >
      <form [formGroup]="articleForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="title" class="block text-900 font-medium mb-2">标题 *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="请输入文章标题"
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
          <label for="abstract" class="block text-900 font-medium mb-2">摘要</label>
          <textarea
            id="abstract"
            pInputTextarea
            formControlName="abstract"
            placeholder="请输入文章摘要"
            class="w-full"
            [rows]="3"
          ></textarea>
        </div>

        <div class="field">
          <label for="is_markdown" class="block text-900 font-medium mb-2">是否是markdown</label>
          <p-select
            id="is_markdown"
            [options]="markdownOptions()"
            formControlName="is_markdown"
            placeholder="请选择是否是markdown"
            class="w-full"
            appendTo="body"
          ></p-select>
        </div>

        @if (articleForm.get('is_markdown')?.value === 1) {
          <div class="field">
            <label for="markdown_content" class="block text-900 font-medium mb-2"
              >markdown内容</label
            >
            <vditor-editor
              #vditorEditor
              [value]="articleForm.get('markdown_content')?.value"
              (valueChange)="articleForm.get('markdown_content')?.setValue($event)"
            ></vditor-editor>
          </div>
        } @else {
          <div class="field">
            <label for="content" class="block text-900 font-medium mb-2">内容 *</label>
            <p-editor
              id="content"
              formControlName="content"
              [style]="{ height: '400px' }"
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
        <div class="grid grid-cols-3 gap-4">
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

          <div class="field">
            <label for="is_review" class="block text-900 font-medium mb-2">审核状态</label>
            <p-select
              id="is_review"
              [options]="reviewOptions()"
              formControlName="is_review"
              placeholder="请选择审核状态"
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
            (keydown)="onTagKeydown($event)"
            placeholder="请输入标签，按回车键添加"
            class="w-full"
          ></p-autoComplete>
          <p-message severity="info" text="标签将用逗号分隔保存" styleClass="mt-1"></p-message>
        </div>

        <div class="field flex items-center gap-2">
          <input
            id="image"
            type="text"
            pInputText
            formControlName="image"
            placeholder="请输入封面图片URL"
            class="w-full"
          />
          <div class="flex items-center gap-2 w-[100px]">
            <p-button
              icon="pi pi-upload"
              label="上传图片"
              (click)="uploadCoverImage()"
              styleClass="p-button-outlined p-button-sm upload-btn"
              type="button"
            ></p-button>
          </div>
        </div>

        <div class="field">
          <label for="image_list" class="block text-900 font-medium mb-2">图片列表</label>

          <div class="field flex items-center gap-2">
            <p-autoComplete
              id="image_list"
              formControlName="image_list"
              [multiple]="true"
              [suggestions]="filteredImages"
              (completeMethod)="filterImages($event)"
              (keydown)="onImageKeydown($event)"
              placeholder="请输入图片URL，按回车键添加"
              class="w-full"
            ></p-autoComplete>
            <div class="flex items-center gap-2 w-[100px]">
              <p-button
                icon="pi pi-upload"
                label="上传图片"
                (click)="uploadImageToList()"
                styleClass="p-button-outlined p-button-sm upload-btn"
                type="button"
              ></p-button>
            </div>
          </div>

          <p-message severity="info" text="图片URL将用逗号分隔保存" styleClass="mt-1"></p-message>

          <!-- Image Preview -->
          @if (
            articleForm.get('image_list')?.value && articleForm.get('image_list')?.value.length > 0
          ) {
            <div class="image-preview mt-3">
              <h4 class="text-sm font-medium mb-2">图片预览：</h4>
              <div class="image-grid">
                @for (
                  imageUrl of articleForm.get('image_list')?.value;
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
          <label for="redirect_url" class="block text-900 font-medium mb-2">跳转链接</label>
          <input
            id="redirect_url"
            type="text"
            pInputText
            formControlName="redirect_url"
            placeholder="请输入跳转链接"
            class="w-full"
          />
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
          [disabled]="articleForm.invalid"
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

      .grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
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

      .upload-btn {
        border-radius: 0.5rem;
        height: 2.25rem;
        font-size: 0.92rem;
        min-width: 80px;
        padding: 0 1rem;
      }
    `
  ]
})
export class PostDetailComponent implements OnInit {
  @Input() article: Article | null = null
  @Input() mode: 'edit' | 'create' = 'create'

  @Output() saved = new EventEmitter<Article>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  submitting = signal(false)

  articleForm: FormGroup

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
        ['link', 'image', 'video'],
        ['table']
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
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      url: [''],
      sub_title: [''],
      abstract: [''],
      content: [''],
      markdown_content: [''],
      is_markdown: [0],
      type_id: [undefined],
      status: [10], // Default published
      is_review: [-10], // Default no review needed
      tags: [[]],
      image: [''],
      image_list: [[]],
      redirect_url: [''],
      seo_title: [''],
      seo_description: [''],
      seo_keywords: [''],
      remark: ['']
    })
  }

  ngOnInit() {
    this.currentArticle.set(this.article)
    this.currentMode.set(this.mode)

    // Configure highlight.js
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

    // Load form data if article exists, otherwise reset form
    if (this.article) {
      this.loadFormData(this.article)
    } else {
      this.resetForm()
    }

    // // check is_markdown
    // if (this.articleForm.get('is_markdown')?.value === 1) {
    //   debugger
    // }

    // Log form status changes for debugging
    this.articleForm.statusChanges.subscribe(() => {
      this.logFormErrors()
    })
  }

  logFormErrors() {
    if (this.articleForm.invalid) {
      console.log('--- Form is INVALID ---')
      Object.keys(this.articleForm.controls).forEach((key) => {
        const control = this.articleForm.get(key)
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
    if (this.isCreateMode) return '创建文章'
    return '编辑文章'
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
      { label: '已发布', value: 10 },
      { label: '待发布', value: -10 },
      { label: '草稿箱', value: -20 },
      { label: '已删除', value: -100 }
    ]
  }

  reviewOptions() {
    return [
      { label: '不需要审核', value: -10 },
      { label: '需要审核', value: 10 }
    ]
  }

  markdownOptions() {
    return [
      { label: '否', value: 0 },
      { label: '是', value: 1 }
    ]
  }

  loadFormData(article: Article) {
    // Convert tags string to array for autoComplete component
    const tags = article.tags
      ? article.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : []

    // Convert image_list string to array for autoComplete component
    const imageList = article.image_list
      ? article.image_list
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url)
      : []

    this.articleForm.patchValue({
      title: article.title,
      url: article.url,
      sub_title: article.sub_title || '',
      abstract: article.abstract || '',
      content: article.content,
      markdown_content: article.markdown_content || '',
      is_markdown: article.is_markdown || 0,
      type_id: article.type_id || null,
      status: article.status,
      is_review: article.is_review || -10,
      tags: tags,
      image: article.image || '',
      image_list: imageList,
      redirect_url: article.redirect_url || '',
      seo_title: article.seo_title || '',
      seo_description: article.seo_description || '',
      seo_keywords: article.seo_keywords || '',
      remark: article.remark || ''
    })

    this.articleForm.enable()
    this.articleForm.markAllAsTouched()
    this.logFormErrors()
  }

  resetForm() {
    this.articleForm.reset({
      status: 10,
      is_review: -10,
      tags: [],
      is_markdown: 1,
      image_list: []
    })
    this.articleForm.enable()
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.articleForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getErrorMessage(fieldName: string): string {
    const field = this.articleForm.get(fieldName)
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
    if (this.articleForm.valid) {
      this.submitting.set(true)
      const formData = this.articleForm.value

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
        image: formData.image || '',
        image_list: formData.image_list || '',
        tags: formData.tags || '',
        redirect_url: formData.redirect_url || '',
        remark: formData.remark || '',
        type_id: formData.type_id || 0,
        author_id: formData.author_id || 0,
        user_id: formData.user_id || 0
      }

      if (this.articleForm.get('is_markdown')?.value === 1) {
        sanitizedData.content = await Vditor.md2html(sanitizedData.markdown_content, {
          cdn: '',
          mode: 'light',
          hljs: {
            enable: true,
            lineNumber: true
          }
        })
      }

      const articleData: Partial<Article> = {
        ...sanitizedData,
        id: this.currentArticle()?.id || 0
      }

      console.log('content:', formData.content)

      this.saved.emit(articleData as Article)
      this.submitting.set(false)
    } else {
      this.articleForm.markAllAsTouched()
    }
  }

  currentArticle = signal<Article | null>(null)
  currentMode = signal<'edit' | 'create'>('create')
  availableCategories = signal<Category[]>([])

  // AutoComplete properties and methods
  filteredTags: string[] = []
  filteredImages: string[] = []

  filterTags(event: any) {
    // 允许自由输入，不做过滤
    this.filteredTags = []
  }

  filterImages(event: any) {
    // 允许自由输入，不做过滤
    this.filteredImages = []
  }

  onTagKeydown(event: any) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      event.preventDefault()
      const currentTags = this.articleForm.get('tags')?.value || []
      const newTag = event.target.value.trim()
      if (!currentTags.includes(newTag)) {
        this.articleForm.get('tags')?.setValue([...currentTags, newTag])
      }
      event.target.value = ''
    }
  }

  onImageKeydown(event: any) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      event.preventDefault()
      const currentImages = this.articleForm.get('image_list')?.value || []
      const newImage = event.target.value.trim()
      if (!currentImages.includes(newImage)) {
        this.articleForm.get('image_list')?.setValue([...currentImages, newImage])
      }
      event.target.value = ''
    }
  }

  onImageError(event: any, index?: number) {
    if (index !== undefined) {
      console.error(`Image at index ${index} failed to load:`, event.target.src)
      this.messageService.add({
        severity: 'warn',
        summary: '图片加载失败',
        detail: `图片 ${index + 1} 无法加载，请检查URL是否正确`
      })
    } else {
      console.error('Cover image failed to load:', event.target.src)
      this.messageService.add({
        severity: 'warn',
        summary: '图片加载失败',
        detail: '封面图片无法加载，请检查URL是否正确'
      })
    }
  }

  removeImage(index: number) {
    const currentImages = this.articleForm.get('image_list')?.value || []
    const updatedImages = currentImages.filter((_: any, i: number) => i !== index)
    this.articleForm.get('image_list')?.setValue(updatedImages)
  }

  private fetchCategories() {
    this.httpService
      .get<CategoriesResponse>('/api/admin/categories/tree', { alias: 'POST_SYS_CAT' })
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
              // Get quill instance through ViewChild
              const quillEditor = this.editorComponent?.quill
              if (quillEditor) {
                const range = quillEditor.getSelection(true)
                quillEditor.insertEmbed(range.index, 'image', response.data.url)
                quillEditor.setSelection(range.index + 1)
                // Key: sync content to form
                const html = quillEditor.root.innerHTML
                this.articleForm.get('content')?.setValue(html)
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

  uploadCoverImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        this.httpService.post('/api/admin/upload/image', formData).subscribe({
          next: (res: any) => {
            if (res.success && res.data?.url) {
              this.articleForm.get('image')?.setValue(res.data.url)
              this.messageService.add({
                severity: 'success',
                summary: '上传成功',
                detail: '封面图片已上传'
              })
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '上传失败',
                detail: res.message || '上传失败'
              })
            }
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: '上传失败',
              detail: '上传失败，请重试'
            })
          }
        })
      }
    }
    input.click()
  }

  uploadImageToList() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        this.httpService.post('/api/admin/upload/image', formData).subscribe({
          next: (res: any) => {
            if (res.success && res.data?.url) {
              const list = this.articleForm.get('image_list')?.value || []
              this.articleForm.get('image_list')?.setValue([...list, res.data.url])
              this.messageService.add({
                severity: 'success',
                summary: '上传成功',
                detail: '图片已添加到列表'
              })
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '上传失败',
                detail: res.message || '上传失败'
              })
            }
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: '上传失败',
              detail: '上传失败，请重试'
            })
          }
        })
      }
    }
    input.click()
  }
}
