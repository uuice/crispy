import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { EditorModule } from 'primeng/editor'
import { DropdownModule } from 'primeng/dropdown'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'cs-create-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="create-page">
      <div class="page-header">
        <h1>Create New Page</h1>
        <div class="header-actions">
          <button
            pButton
            label="Save as Draft"
            icon="pi pi-save"
            class="p-button-secondary"
            (click)="saveAsDraft()"
            [disabled]="!pageForm.valid"
          ></button>
          <button
            pButton
            label="Publish"
            icon="pi pi-check"
            (click)="publishPage()"
            [disabled]="!pageForm.valid"
          ></button>
        </div>
      </div>

      <p-toast></p-toast>

      <div class="card">
        <form [formGroup]="pageForm" (ngSubmit)="onSubmit()" class="page-form">
          <div class="form-grid">
            <div class="form-col-main">
              <div class="form-field">
                <label for="title">Title</label>
                <input
                  id="title"
                  type="text"
                  pInputText
                  formControlName="title"
                  [class.ng-invalid]="isFieldInvalid('title')"
                  placeholder="Enter page title"
                />
                <small class="error-message" *ngIf="isFieldInvalid('title')">
                  Title is required
                </small>
              </div>

              <div class="form-field">
                <label for="slug">Slug</label>
                <input
                  id="slug"
                  type="text"
                  pInputText
                  formControlName="slug"
                  [class.ng-invalid]="isFieldInvalid('slug')"
                  placeholder="Enter URL slug"
                />
                <small class="error-message" *ngIf="isFieldInvalid('slug')">
                  Slug is required and must be URL-friendly
                </small>
              </div>

              <div class="form-field">
                <label for="content">Content</label>
                <p-editor
                  id="content"
                  formControlName="content"
                  [style]="{ height: '400px' }"
                  [class.ng-invalid]="isFieldInvalid('content')"
                ></p-editor>
                <small class="error-message" *ngIf="isFieldInvalid('content')">
                  Content is required
                </small>
              </div>
            </div>

            <div class="form-col-sidebar">
              <div class="form-section">
                <h3>Page Settings</h3>

                <div class="form-field">
                  <label for="status">Status</label>
                  <p-dropdown
                    id="status"
                    [options]="statusOptions"
                    formControlName="status"
                    placeholder="Select status"
                  ></p-dropdown>
                </div>

                <div class="form-field">
                  <label for="featuredImage">Featured Image URL</label>
                  <input
                    id="featuredImage"
                    type="text"
                    pInputText
                    formControlName="featuredImage"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              <div class="form-section">
                <h3>SEO Settings</h3>

                <div class="form-field">
                  <label for="metaDescription">Meta Description</label>
                  <textarea
                    id="metaDescription"
                    pInputTextarea
                    formControlName="metaDescription"
                    [rows]="3"
                    placeholder="Enter meta description"
                  ></textarea>
                  <small class="help-text"> Recommended length: 150-160 characters </small>
                </div>

                <div class="form-field">
                  <label for="metaKeywords">Meta Keywords</label>
                  <textarea
                    id="metaKeywords"
                    pInputTextarea
                    formControlName="metaKeywords"
                    [rows]="3"
                    placeholder="Enter meta keywords (comma-separated)"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .create-page {
        padding: 1rem;

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          h1 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .header-actions {
            display: flex;
            gap: 0.5rem;
          }
        }

        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 1rem;
        }

        .page-form {
          .form-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 2rem;
          }

          .form-section {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 1rem;
            margin-bottom: 1rem;

            h3 {
              margin: 0 0 1rem;
              font-size: 1rem;
              font-weight: 600;
            }
          }

          .form-field {
            margin-bottom: 1rem;

            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }

            input,
            textarea,
            p-dropdown {
              width: 100%;
            }

            .error-message {
              color: #dc3545;
              font-size: 0.875rem;
              margin-top: 0.25rem;
            }

            .help-text {
              color: #6c757d;
              font-size: 0.875rem;
              margin-top: 0.25rem;
            }
          }

          ::ng-deep {
            .p-editor-container {
              .p-editor-content {
                min-height: 300px;
              }
            }
          }
        }
      }
    `
  ]
})
export class CreatePagePage implements OnInit {
  pageForm: FormGroup
  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' }
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.pageForm = this.fb.group({
      title: ['', [Validators.required]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      content: ['', [Validators.required]],
      status: ['draft', [Validators.required]],
      featuredImage: [''],
      metaDescription: [''],
      metaKeywords: ['']
    })
  }

  ngOnInit() {
    // Auto-generate slug from title
    this.pageForm.get('title')?.valueChanges.subscribe((title) => {
      if (title && !this.pageForm.get('slug')?.dirty) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
        this.pageForm.patchValue({ slug })
      }
    })
  }

  isFieldInvalid(field: string): boolean {
    const control = this.pageForm.get(field)
    return control ? control.invalid && (control.dirty || control.touched) : false
  }

  saveAsDraft() {
    if (this.pageForm.valid) {
      this.pageForm.patchValue({ status: 'draft' })
      this.onSubmit()
    }
  }

  publishPage() {
    if (this.pageForm.valid) {
      this.pageForm.patchValue({ status: 'published' })
      this.onSubmit()
    }
  }

  onSubmit() {
    if (this.pageForm.valid) {
      // TODO: Implement page creation
      console.log('Form submitted:', this.pageForm.value)
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Page has been created successfully'
      })
      // this.router.navigate(['../'], { relativeTo: this.router.routeConfig?.path })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields'
      })
    }
  }
}
