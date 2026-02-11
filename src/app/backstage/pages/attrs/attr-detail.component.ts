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
import { HttpService } from '../../services/http.service'
import { AttrEntity } from '@src/types'

@Component({
  selector: 'cs-attr-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
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
      <form [formGroup]="tagForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label for="title" class="block text-900 font-medium mb-2">标签名称 *</label>
              <input
                id="title"
                type="text"
                pInputText
                formControlName="title"
                placeholder="请输入标签名称"
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
                placeholder="请输入标签别名"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="status" class="block text-900 font-medium mb-2">状态</label>
              <select id="status" formControlName="status" class="w-full p-inputtext">
                <option [ngValue]="10">启用</option>
                <option [ngValue]="-10">禁用</option>
              </select>
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
          [disabled]="tagForm.invalid"
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
export class AttrDetailComponent implements OnInit, OnChanges {
  @Input() tag: AttrEntity | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  tagForm: FormGroup
  submitting = signal(false)

  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {
    this.tagForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      alias: [''],
      status: [10],
      sort: [0]
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.tagForm.reset({
        title: '',
        alias: '',
        status: 10,
        sort: 0
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
    return this.mode === 'create' ? '新建特殊标签' : '编辑特殊标签'
  }

  initializeForm() {
    if (this.tag && this.mode === 'edit') {
      this.tagForm.patchValue({
        title: this.tag.title,
        alias: this.tag.alias || '',
        status: this.tag.status,
        sort: this.tag.sort
      })
    } else if (this.mode === 'create') {
      this.resetForm()
    }
    this.submitting.set(false)
  }

  resetForm() {
    this.tagForm.reset({
      title: '',
      alias: '',
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
    const formControl = this.tagForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.tagForm.get(field)
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
    if (this.tagForm.valid) {
      this.submitting.set(true)
      const formData = this.tagForm.value
      if (this.mode === 'edit' && this.tag) {
        this.httpService.put<any>(`/api/admin/special-tags/${this.tag.id}`, formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '特殊标签更新成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新特殊标签失败'
              })
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '更新特殊标签失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      } else {
        this.httpService.post<any>('/api/admin/special-tags', formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '特殊标签创建成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建特殊标签失败'
              })
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error.message || '创建特殊标签失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      }
    } else {
      this.tagForm.markAllAsTouched()
    }
  }
}
