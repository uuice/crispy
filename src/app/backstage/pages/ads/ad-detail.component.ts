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
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { MessageService } from 'primeng/api'
import { DatePickerModule } from 'primeng/datepicker'
import { SelectModule } from 'primeng/select'
import { HttpService } from '../../services/http.service'
import { AdEntity } from '@src/types'

@Component({
  selector: 'cs-ad-detail',
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
    DatePickerModule,
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
      <form [formGroup]="adForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label for="title" class="block text-900 font-medium mb-2">广告标题 *</label>
              <input
                id="title"
                type="text"
                pInputText
                formControlName="title"
                placeholder="请输入广告标题"
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
              <label for="alias" class="block text-900 font-medium mb-2">别名</label>
              <input
                id="alias"
                type="text"
                pInputText
                formControlName="alias"
                placeholder="请输入别名"
                class="w-full"
              />
            </div>
          </div>

          <div class="col-12">
            <div class="field">
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
          </div>

          <!-- <div class="col-6">
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
          </div> -->

          <!-- <div class="col-6">
            <div class="field">
              <label for="link_url" class="block text-900 font-medium mb-2">跳转链接</label>
              <input
                id="link_url"
                type="text"
                pInputText
                formControlName="link_url"
                placeholder="请输入跳转链接"
                class="w-full"
              />
            </div>
          </div> -->

          <!-- <div class="col-6">
            <div class="field">
              <label for="position" class="block text-900 font-medium mb-2">广告位置</label>
              <input
                id="position"
                type="text"
                pInputText
                formControlName="position"
                placeholder="请输入广告位置"
                class="w-full"
              />
            </div>
          </div> -->

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
              <label for="start_time" class="block text-900 font-medium mb-2">开始时间</label>
              <p-datepicker
                id="start_time"
                formControlName="start_time"
                [showTime]="true"
                dateFormat="yy-mm-dd"
                placeholder="请选择开始时间"
                class="w-full"
                appendTo="body"
              ></p-datepicker>
            </div>
          </div>

          <div class="col-6">
            <div class="field">
              <label for="end_time" class="block text-900 font-medium mb-2">结束时间</label>
              <p-datepicker
                id="end_time"
                formControlName="end_time"
                [showTime]="true"
                dateFormat="yy-mm-dd"
                placeholder="请选择结束时间"
                class="w-full"
                appendTo="body"
              ></p-datepicker>
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
          [disabled]="adForm.invalid"
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
export class AdDetailComponent implements OnInit, OnChanges {
  @Input() ad: AdEntity | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  adForm: FormGroup
  submitting = signal(false)

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: -10 }
  ]

  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      alias: [''],
      content: [''],
      // image_url: [''],
      // link_url: [''],
      // position: [''],
      start_time: [null],
      end_time: [null],
      status: [10],
      sort: [0]
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.initializeForm()
    })
  }

  ngOnChanges() {
    setTimeout(() => {
      this.initializeForm()
    })
  }

  get dialogTitle(): string {
    if (this.mode === 'create') return '创建广告'
    return '编辑广告'
  }

  initializeForm() {
    if (this.ad && this.mode === 'edit') {
      this.adForm.patchValue({
        title: this.ad.title,
        alias: this.ad.alias || '',
        content: this.ad.content || '',
        // image_url: this.ad.image_url || '',
        // link_url: this.ad.link_url || '',
        // position: this.ad.position || '',
        start_time: this.ad.start_time ? new Date(this.ad.start_time) : null,
        end_time: this.ad.end_time ? new Date(this.ad.end_time) : null,
        status: this.ad.status,
        sort: this.ad.sort || 0
      })
    } else if (this.mode === 'create') {
      this.resetForm()
    }
    this.submitting.set(false)
  }

  resetForm() {
    this.adForm.reset({
      title: '',
      alias: '',
      content: '',
      // image_url: '',
      // link_url: '',
      // position: '',
      start_time: null,
      end_time: null,
      status: 10,
      sort: 0
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
    const formControl = this.adForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.adForm.get(field)
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
    if (this.adForm.valid) {
      this.submitting.set(true)
      const formData = this.adForm.value
      // 转换时间为时间戳
      if (formData.start_time instanceof Date) {
        formData.start_time = formData.start_time.getTime()
      }
      if (formData.end_time instanceof Date) {
        formData.end_time = formData.end_time.getTime()
      }
      if (this.mode === 'edit' && this.ad) {
        this.httpService.put<any>(`/api/admin/ads/${this.ad.id}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '广告更新成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新广告失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to update ad:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '更新广告失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      } else {
        this.httpService.post<any>('/api/admin/ads', formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '广告创建成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建广告失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create ad:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '创建广告失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      }
    } else {
      this.adForm.markAllAsTouched()
    }
  }
}
