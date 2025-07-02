import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  signal
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
import { DropdownModule } from 'primeng/dropdown'
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { MessageService } from 'primeng/api'
import { FileUploadModule } from 'primeng/fileupload'
import { HttpHeaders } from '@angular/common/http'

interface AdItem {
  id?: number
  ad_id: number
  title: string
  content: string
  url: string
  image_url: string
  method: string
  sort: number
  status: number
  create_time?: number
  update_time?: number
}

interface AdsOption {
  id: number
  title: string
}

@Component({
  selector: 'cs-ad-item-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    MessageModule,
    FileUploadModule
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
      [closeOnEscape]="false"
    >
      <form [formGroup]="adItemForm" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12">
            <label for="ad_id" class="block text-900 font-medium mb-2">所属广告 *</label>
            <p-dropdown
              id="ad_id"
              [options]="adsOptions"
              formControlName="ad_id"
              optionLabel="title"
              optionValue="id"
              placeholder="请选择广告"
              class="w-full"
              [showClear]="true"
            ></p-dropdown>
          </div>
          <div class="field col-12">
            <label for="title" class="block text-900 font-medium mb-2">标题 *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="请输入广告项标题"
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
            <label for="content" class="block text-900 font-medium mb-2">内容</label>
            <input
              id="content"
              type="text"
              pInputText
              formControlName="content"
              placeholder="请输入内容"
              class="w-full"
            />
          </div>
          <div class="field col-12">
            <label for="url" class="block text-900 font-medium mb-2">链接</label>
            <input
              id="url"
              type="text"
              pInputText
              formControlName="url"
              placeholder="请输入跳转链接"
              class="w-full"
            />
          </div>
          <div class="field col-12">
            <label for="image_url" class="block text-900 font-medium mb-2"
              >图片（可多选，逗号分隔）</label
            >
            <p-fileUpload
              name="images[]"
              url="/api/admin/upload"
              accept="image/*"
              maxFileSize="2000000"
              [auto]="true"
              (onUpload)="onImageUpload($event)"
              [multiple]="true"
              chooseLabel="上传图片"
              [showUploadButton]="false"
              [showCancelButton]="false"
              [headers]="uploadHeaders"
            ></p-fileUpload>
            <div class="uploaded-images mt-2">
              <ng-container *ngIf="adItemForm.get('image_url')?.value">
                <img
                  *ngFor="let img of adItemForm.get('image_url')?.value.split(',')"
                  [src]="img"
                  style="max-width:40px;max-height:30px;margin-right:2px;"
                />
              </ng-container>
            </div>
          </div>
          <div class="field col-6">
            <label for="method" class="block text-900 font-medium mb-2">打开方式 *</label>
            <p-dropdown
              id="method"
              [options]="methodOptions"
              formControlName="method"
              optionLabel="label"
              optionValue="value"
              placeholder="请选择打开方式"
              class="w-full"
            ></p-dropdown>
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
            <p-dropdown
              id="status"
              [options]="statusOptions"
              formControlName="status"
              optionLabel="label"
              optionValue="value"
              placeholder="请选择状态"
              class="w-full"
            ></p-dropdown>
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
          [disabled]="adItemForm.invalid"
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
      .uploaded-images img {
        border-radius: 2px;
        border: 1px solid #eee;
      }
    `
  ]
})
export class AdItemDetailComponent implements OnInit, OnChanges {
  @Input() adItem: AdItem | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Input() adsOptions: AdsOption[] = []
  @Output() saved = new EventEmitter<Partial<AdItem>>()
  @Output() cancelled = new EventEmitter<void>()

  submitting = signal(false)
  adItemForm: FormGroup

  methodOptions = [
    { label: '文章详情', value: '1' },
    { label: '外链', value: '5' }
  ]
  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ]

  uploadHeaders!: HttpHeaders

  getUploadHeaders() {
    let headers = new HttpHeaders()
    const token = localStorage.getItem('jwt_token') || ''
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.adItemForm = this.fb.group({
      ad_id: [undefined, Validators.required],
      title: ['', [Validators.required, Validators.minLength(2)]],
      content: [''],
      url: [''],
      image_url: [''],
      method: [undefined, Validators.required],
      sort: [0],
      status: [10, Validators.required]
    })
  }

  ngOnInit() {
    this.updateForm()
    this.uploadHeaders = this.getUploadHeaders()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adItem'] || changes['mode']) {
      this.updateForm()
    }
  }

  get dialogTitle(): string {
    return this.mode === 'create' ? '创建广告项' : '编辑广告项'
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adItemForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getErrorMessage(fieldName: string): string {
    const field = this.adItemForm.get(fieldName)
    if (!field || !field.errors) return ''
    const errors = field.errors
    if (errors['required']) return '此字段为必填项'
    if (errors['minlength']) return `最少需要 ${errors['minlength'].requiredLength} 个字符`
    return '输入格式不正确'
  }

  onCancel() {
    this.cancelled.emit()
  }

  onSubmit() {
    if (this.adItemForm.valid) {
      this.submitting.set(true)
      const formData: Partial<AdItem> = {
        ...this.adItemForm.value
      }
      if (this.adItem) {
        formData.id = this.adItem.id
      }
      this.saved.emit(formData)
      this.submitting.set(false)
    } else {
      this.adItemForm.markAllAsTouched()
    }
  }

  onImageUpload(event: any) {
    // 假设后端返回 { location: 'url' } 或 { urls: ['url1','url2'] }
    let urls: string[] = []
    if (event.originalEvent.body) {
      if (event.originalEvent.body.urls) {
        urls = event.originalEvent.body.urls
      } else if (event.originalEvent.body.location) {
        urls = [event.originalEvent.body.location]
      }
    }
    const old = this.adItemForm.get('image_url')?.value
    const all = old ? old.split(',').filter(Boolean).concat(urls) : urls
    this.adItemForm.get('image_url')?.setValue(all.join(','))
  }

  private updateForm() {
    if (this.mode === 'edit' && this.adItem) {
      this.adItemForm.patchValue(this.adItem)
    } else {
      this.adItemForm.reset({
        ad_id: undefined,
        title: '',
        content: '',
        url: '',
        image_url: '',
        method: undefined,
        sort: 0,
        status: 10
      })
    }
  }
}
