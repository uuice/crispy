import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { ConfirmationService, MessageService } from 'primeng/api'

interface Page {
  id: number
  title: string
  slug: string
  content: string
  status: 'draft' | 'published' | 'archived'
  author: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  metaDescription?: string
  metaKeywords?: string
  featuredImage?: string
}

@Component({
  selector: 'cs-pages',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="pages-page">
      <div class="page-header">
        <h1>Page Management</h1>
        <button pButton label="Create Page" icon="pi pi-plus" routerLink="create"></button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="card">
        <p-table
          [value]="pages"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} pages"
          [rowsPerPageOptions]="[10, 25, 50]"
          [loading]="loading"
          [globalFilterFields]="['title', 'slug', 'author']"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-content-between">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  (input)="applyFilterGlobal($event, 'contains')"
                  placeholder="Search..."
                />
              </span>
              <div class="flex gap-2">
                <p-dropdown
                  [options]="statusOptions"
                  [(ngModel)]="selectedStatus"
                  placeholder="Filter by status"
                  (onChange)="filterByStatus($event)"
                  styleClass="p-inputtext-sm"
                ></p-dropdown>
              </div>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th style="width: 30%">Title</th>
              <th style="width: 15%">Slug</th>
              <th style="width: 10%">Status</th>
              <th style="width: 15%">Author</th>
              <th style="width: 15%">Last Updated</th>
              <th style="width: 15%">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-page>
            <tr>
              <td>
                <div class="page-title">
                  <span class="title-text" [pTooltip]="page.title" tooltipPosition="top">
                    {{ page.title }}
                  </span>
                  <div class="meta-info" *ngIf="page.metaDescription">
                    <small class="text-muted">{{ page.metaDescription | slice: 0 : 50 }}...</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="page-slug">{{ page.slug }}</span>
              </td>
              <td>
                <p-tag [severity]="getStatusSeverity(page.status)" [value]="page.status"></p-tag>
              </td>
              <td>{{ page.author }}</td>
              <td>
                <div class="date-info">
                  <div>{{ page.updatedAt | date: 'medium' }}</div>
                  <small class="text-muted" *ngIf="page.publishedAt">
                    Published: {{ page.publishedAt | date: 'short' }}
                  </small>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    pButton
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="Preview"
                    tooltipPosition="top"
                    (click)="previewPage(page)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="Edit"
                    tooltipPosition="top"
                    [routerLink]="[page.id, 'edit']"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="Delete"
                    tooltipPosition="top"
                    (click)="confirmDelete(page)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center p-4">
                <div class="empty-state">
                  <i class="pi pi-file text-muted" style="font-size: 3rem"></i>
                  <h3>No Pages Found</h3>
                  <p>Create your first page to get started</p>
                  <button
                    pButton
                    label="Create Page"
                    icon="pi pi-plus"
                    routerLink="create"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [
    `
      .pages-page {
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
        }

        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 1rem;
        }

        .page-title {
          .title-text {
            font-weight: 500;
            display: block;
            margin-bottom: 0.25rem;
          }

          .meta-info {
            color: #6c757d;
            font-size: 0.875rem;
          }
        }

        .page-slug {
          color: #6c757d;
          font-family: monospace;
          font-size: 0.875rem;
        }

        .date-info {
          .text-muted {
            font-size: 0.75rem;
          }
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;

          h3 {
            margin: 1rem 0 0.5rem;
            font-size: 1.25rem;
            font-weight: 600;
          }

          p {
            color: #6c757d;
            margin-bottom: 1rem;
          }
        }
      }
    `
  ]
})
export class PagesPage implements OnInit {
  pages: Page[] = []
  loading = false
  selectedStatus: string | null = null
  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPages()
  }

  loadPages() {
    this.loading = true
    // TODO: Replace with actual API call
    setTimeout(() => {
      this.pages = [
        {
          id: 1,
          title: 'About Us',
          slug: 'about-us',
          content: '<p>About us page content...</p>',
          status: 'published',
          author: 'Admin',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15'),
          publishedAt: new Date('2024-01-10'),
          metaDescription: 'Learn more about our company and mission',
          metaKeywords: 'about, company, mission',
          featuredImage: '/assets/images/about.jpg'
        },
        {
          id: 2,
          title: 'Contact Information',
          slug: 'contact',
          content: '<p>Contact information page content...</p>',
          status: 'draft',
          author: 'Admin',
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-20'),
          metaDescription: 'Get in touch with our team',
          metaKeywords: 'contact, email, phone'
        }
      ]
      this.loading = false
    }, 1000)
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'danger'
      default:
        return 'info'
    }
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const table = document.querySelector('p-table')
    // TODO: Implement global filtering
  }

  filterByStatus(event: any) {
    const table = document.querySelector('p-table')
    // TODO: Implement status filtering
  }

  previewPage(page: Page) {
    // TODO: Implement page preview
    window.open(`/preview/${page.slug}`, '_blank')
  }

  confirmDelete(page: Page) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete page "${page.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Implement delete page
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Page "${page.title}" has been deleted`
        })
      }
    })
  }
}
