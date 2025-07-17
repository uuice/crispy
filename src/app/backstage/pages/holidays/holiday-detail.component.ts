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
import { CalendarModule } from 'primeng/calendar'
import { DatePickerModule } from 'primeng/datepicker'
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'

interface Holiday {
  id: number
  title: string
  value: string
  sort: number
  create_time: number
  update_time: number
  is_delete: number
}

@Component({
  selector: 'cs-holiday-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DatePickerModule,
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
      <form [formGroup]="holidayForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label for="name" class="block text-900 font-medium mb-2">假期名称 *</label>
              <input
                id="name"
                type="text"
                pInputText
                formControlName="title"
                placeholder="请输入假期名称"
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
              <label for="dateRange" class="block text-900 font-medium mb-2">假期日期范围 *</label>
              <p-datepicker
                id="dateRange"
                formControlName="dateRange"
                selectionMode="range"
                [showIcon]="true"
                dateFormat="yy-mm-dd"
                placeholder="请选择假期日期范围"
                class="w-full"
                [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('dateRange') }"
                [readonlyInput]="true"
                [showButtonBar]="true"
                [showClear]="true"
                [touchUI]="false"
                [showOtherMonths]="true"
                [selectOtherMonths]="true"
                [autoZIndex]="true"
                [appendTo]="'body'"
              ></p-datepicker>
              @if (isFieldInvalid('dateRange')) {
                <p-message
                  severity="error"
                  [text]="getErrorMessage('dateRange')"
                  styleClass="mt-1"
                ></p-message>
              }
              @if (selectedDatesText()) {
                <div
                  class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700"
                >
                  <strong>已选择日期：</strong>{{ selectedDatesText() }}
                </div>
              }
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
          [disabled]="holidayForm.invalid"
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
export class HolidayDetailComponent implements OnInit, OnChanges {
  @Input() holiday: Holiday | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  holidayForm: FormGroup
  submitting = signal(false)
  selectedDatesText = signal('')

  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {
    this.holidayForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      dateRange: [null, [Validators.required]],
      sort: [0]
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.holidayForm.reset({
        title: '',
        dateRange: null,
        sort: 0
      })
      this.initializeForm()
      this.setupDateRangeListener()
    })
  }

  ngOnChanges() {
    setTimeout(() => {
      this.initializeForm()
    })
  }

  initializeForm() {
    if (this.holiday && this.mode === 'edit') {
      this.loadHolidayData()
    } else if (this.mode === 'create') {
      this.resetForm()
    }
    this.submitting.set(false)
  }

  setupDateRangeListener() {
    // Listen to date range changes to update the display text
    this.holidayForm.get('dateRange')?.valueChanges.subscribe((value) => {
      this.updateSelectedDatesText(value)
    })
  }

  updateSelectedDatesText(dateRange: any) {
    if (dateRange && Array.isArray(dateRange) && dateRange.length === 2) {
      const startDate = dateRange[0]
      const endDate = dateRange[1]
      if (startDate && endDate) {
        const dates = this.generateDateRange(startDate, endDate)
        this.selectedDatesText.set(dates.join(', '))
      } else {
        this.selectedDatesText.set('')
      }
    } else {
      this.selectedDatesText.set('')
    }
  }

  generateDateRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      dates.push(this.formatDate(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  get isEditMode(): boolean {
    return this.mode === 'edit'
  }

  get dialogTitle(): string {
    if (this.mode === 'create') return '创建假期'
    return '编辑假期'
  }

  loadHolidayData() {
    if (this.holiday) {
      // Parse the value string to get date range
      const dateValues = this.holiday.value
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d)
      let dateRange: any[] | null = null

      if (dateValues.length >= 2) {
        const startDate = new Date(dateValues[0])
        const endDate = new Date(dateValues[dateValues.length - 1])
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          dateRange = [startDate, endDate]
        }
      }

      this.holidayForm.patchValue({
        title: this.holiday.title,
        dateRange: dateRange,
        sort: this.holiday.sort
      })

      // Update the display text
      this.updateSelectedDatesText(dateRange)
    }
  }

  resetForm() {
    this.holidayForm.reset({
      title: '',
      dateRange: null,
      sort: 0
    })
    this.selectedDatesText.set('')
  }

  onDialogHide() {
    this.cancelled.emit()
  }

  onCancel() {
    this.visible.set(false)
    this.cancelled.emit()
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.holidayForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.holidayForm.get(field)
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
    if (this.holidayForm.valid) {
      this.submitting.set(true)
      const formData = this.holidayForm.value

      // Convert date range to comma-separated string
      let value = ''
      if (
        formData.dateRange &&
        Array.isArray(formData.dateRange) &&
        formData.dateRange.length === 2
      ) {
        const dates = this.generateDateRange(formData.dateRange[0], formData.dateRange[1])
        value = dates.join(',')
      }

      const submitData = {
        title: formData.title,
        value: value,
        sort: formData.sort || 0
      }

      if (this.mode === 'edit' && this.holiday) {
        // Update holiday
        this.httpService.put<any>(`/api/admin/holidays/${this.holiday.id}`, submitData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '假期更新成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '更新假期失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to update holiday:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error?.message || '更新假期失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      } else {
        // Create holiday
        this.httpService.post<any>('/api/admin/holidays', submitData).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '假期创建成功'
              })
              this.saved.emit()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建假期失败'
              })
            }
          },
          error: (error) => {
            console.error('Failed to create holiday:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: error.error?.message || '创建假期失败'
            })
          },
          complete: () => {
            this.submitting.set(false)
          }
        })
      }
    } else {
      this.holidayForm.markAllAsTouched()
    }
  }
}
