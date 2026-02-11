import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { JobEntity } from '@src/types'

@Component({
  selector: 'cs-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [header]="dialogTitle"
      [modal]="true"
      [style]="{ width: '600px', maxHeight: '90vh' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
      [closeOnEscape]="false"
    >
      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="title" class="block text-900 font-medium mb-2">Job Title *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="Enter job title"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('title') }"
            />
          </div>
          <div class="field">
            <label for="typeName" class="block text-900 font-medium mb-2">Job Type</label>
            <input
              id="typeName"
              type="text"
              pInputText
              formControlName="typeName"
              placeholder="Enter job type"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="nature" class="block text-900 font-medium mb-2">Nature</label>
            <input
              id="nature"
              type="text"
              pInputText
              formControlName="nature"
              placeholder="Enter job nature"
              class="w-full"
            />
          </div>
          <div class="field">
            <label for="branch" class="block text-900 font-medium mb-2">Branch</label>
            <input
              id="branch"
              type="text"
              pInputText
              formControlName="branch"
              placeholder="Enter branch"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="address" class="block text-900 font-medium mb-2">Address</label>
            <input
              id="address"
              type="text"
              pInputText
              formControlName="address"
              placeholder="Enter address"
              class="w-full"
            />
          </div>
          <div class="field">
            <label for="email" class="block text-900 font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              pInputText
              formControlName="email"
              placeholder="Enter email"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="num" class="block text-900 font-medium mb-2">Number of Positions *</label>
            <input
              id="num"
              type="number"
              pInputText
              formControlName="num"
              placeholder="Enter number"
              class="w-full"
              min="1"
            />
          </div>
          <div class="field">
            <label for="sort" class="block text-900 font-medium mb-2">Sort</label>
            <input
              id="sort"
              type="number"
              pInputText
              formControlName="sort"
              placeholder="Sort order"
              class="w-full"
              min="0"
            />
          </div>
        </div>
        <div class="field">
          <label for="content" class="block text-900 font-medium mb-2">Job Description *</label>
          <textarea
            id="content"
            pInputTextarea
            formControlName="content"
            placeholder="Enter job description"
            class="w-full"
            rows="4"
          ></textarea>
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          (click)="onCancel()"
        ></p-button>
        <p-button
          label="Save"
          icon="pi pi-check"
          [loading]="submitting()"
          [disabled]="jobForm.invalid"
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
    `
  ]
})
export class JobDetailComponent implements OnInit {
  @Input() job: JobEntity | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<JobEntity>()
  @Output() cancelled = new EventEmitter<void>()

  visible = signal(true)
  submitting = signal(false)
  jobForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      typeName: [''],
      nature: [''],
      branch: [''],
      address: [''],
      email: ['', [Validators.email]],
      num: [1, [Validators.required, Validators.min(1)]],
      sort: [0],
      content: ['', [Validators.required, Validators.minLength(10)]]
    })
  }

  ngOnInit() {
    if (this.job) {
      this.loadFormData(this.job)
    } else {
      this.resetForm()
    }
  }

  get dialogTitle(): string {
    return this.mode === 'create' ? 'Create Job' : 'Edit Job'
  }

  loadFormData(job: JobEntity) {
    this.jobForm.patchValue({
      title: job.title,
      typeName: job.typeName || '',
      nature: job.nature || '',
      branch: job.branch || '',
      address: job.address || '',
      email: job.email || '',
      num: job.num,
      sort: job.sort || 0,
      content: job.content
    })
    this.jobForm.enable()
    this.jobForm.markAllAsTouched()
  }

  resetForm() {
    this.jobForm.reset({
      num: 1,
      sort: 0
    })
    this.jobForm.enable()
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  onDialogHide() {
    this.cancelled.emit()
  }

  onCancel() {
    this.visible.set(false)
    this.cancelled.emit()
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.submitting.set(true)
      const formData = this.jobForm.value
      const jobData: Partial<JobEntity> = {
        ...formData,
        id: this.job?.id || 0
      }
      this.saved.emit(jobData as JobEntity)
      this.submitting.set(false)
    } else {
      this.jobForm.markAllAsTouched()
    }
  }
}
