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
import { CalendarModule } from 'primeng/calendar'
import { ConfirmationService, MessageService } from 'primeng/api'

interface Advertisement {
  id: number
  name: string
  position: string
  type: 'image' | 'text' | 'html'
  content: string
  link: string
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'expired'
  clicks: number
  impressions: number
  createdAt: string
}

@Component({
  selector: 'cs-advertisements',
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
    ToastModule,
    CalendarModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="advertisements-page">
      <div class="page-header">
        <h1>Advertisement Management</h1>
        <button pButton label="Create Advertisement" icon="pi pi-plus" routerLink="create"></button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="card">
        <p-table
          [value]="advertisements"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} advertisements"
          [rowsPerPageOptions]="[10, 25, 50]"
          [loading]="loading"
          [globalFilterFields]="['name', 'position', 'type']"
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
                  [options]="typeOptions"
                  [(ngModel)]="selectedType"
                  placeholder="Filter by type"
                  (onChange)="filterByType($event)"
                  styleClass="p-inputtext-sm"
                ></p-dropdown>
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
              <th>Name</th>
              <th>Position</th>
              <th>Type</th>
              <th>Content Preview</th>
              <th>Period</th>
              <th>Status</th>
              <th>Stats</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-ad>
            <tr>
              <td>{{ ad.name }}</td>
              <td>{{ ad.position }}</td>
              <td>
                <p-tag [severity]="getTypeSeverity(ad.type)" [value]="ad.type"></p-tag>
              </td>
              <td>
                <div class="content-preview" [pTooltip]="ad.content" tooltipPosition="top">
                  {{
                    ad.type === 'text'
                      ? (ad.content | slice: 0 : 30) + '...'
                      : ad.type === 'image'
                        ? '[Image]'
                        : '[HTML]'
                  }}
                </div>
              </td>
              <td>
                <div class="date-range">
                  <div>{{ ad.startDate | date: 'short' }}</div>
                  <div class="text-muted">to</div>
                  <div>{{ ad.endDate | date: 'short' }}</div>
                </div>
              </td>
              <td>
                <p-tag [severity]="getStatusSeverity(ad.status)" [value]="ad.status"></p-tag>
              </td>
              <td>
                <div class="stats">
                  <div class="stat-item">
                    <i class="pi pi-eye"></i>
                    <span>{{ ad.impressions }}</span>
                  </div>
                  <div class="stat-item">
                    <i class="pi pi-mouse"></i>
                    <span>{{ ad.clicks }}</span>
                  </div>
                  <div class="stat-item" *ngIf="ad.impressions > 0">
                    <i class="pi pi-percentage"></i>
                    <span>{{ (ad.clicks / ad.impressions) * 100 | number: '1.1-1' }}%</span>
                  </div>
                </div>
              </td>
              <td>{{ ad.createdAt | date: 'medium' }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="Edit"
                    tooltipPosition="top"
                    [routerLink]="[ad.id, 'edit']"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="Delete"
                    tooltipPosition="top"
                    (click)="confirmDelete(ad)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="9" class="text-center">No advertisements found.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [
    `
      .advertisements-page {
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

        .content-preview {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6c757d;
        }

        .date-range {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;

          .text-muted {
            color: #6c757d;
            font-size: 0.75rem;
          }
        }

        .stats {
          display: flex;
          gap: 1rem;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.875rem;
            color: #6c757d;

            i {
              font-size: 0.75rem;
            }
          }
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        ::ng-deep {
          .p-datatable {
            .p-datatable-header {
              background: transparent;
              border: none;
              padding: 0 0 1rem 0;
            }

            .p-datatable-thead > tr > th {
              background: #f8f9fa;
              font-weight: 600;
            }

            .p-datatable-tbody > tr > td {
              padding: 0.75rem;
            }
          }
        }
      }
    `
  ]
})
export class AdvertisementsPage implements OnInit {
  advertisements: Advertisement[] = []
  loading = false
  selectedType: string | null = null
  selectedStatus: string | null = null

  typeOptions = [
    { label: 'All Types', value: null },
    { label: 'Image', value: 'image' },
    { label: 'Text', value: 'text' },
    { label: 'HTML', value: 'html' }
  ]

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Expired', value: 'expired' }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAdvertisements()
  }

  loadAdvertisements() {
    this.loading = true
    // TODO: Replace with actual API call
    setTimeout(() => {
      this.advertisements = [
        {
          id: 1,
          name: 'Homepage Banner',
          position: 'header',
          type: 'image',
          content: 'https://example.com/banner.jpg',
          link: 'https://example.com',
          startDate: '2024-03-01T00:00:00',
          endDate: '2024-03-31T23:59:59',
          status: 'active',
          clicks: 1234,
          impressions: 5678,
          createdAt: '2024-02-28T00:00:00'
        },
        {
          id: 2,
          name: 'Sidebar Text Ad',
          position: 'sidebar',
          type: 'text',
          content: 'Special offer: 50% off on all products!',
          link: 'https://example.com/special-offer',
          startDate: '2024-03-15T00:00:00',
          endDate: '2024-03-20T23:59:59',
          status: 'active',
          clicks: 567,
          impressions: 2345,
          createdAt: '2024-03-14T00:00:00'
        },
        {
          id: 3,
          name: 'Footer HTML Ad',
          position: 'footer',
          type: 'html',
          content: '<div class="custom-ad">Custom HTML content</div>',
          link: 'https://example.com/custom',
          startDate: '2024-02-01T00:00:00',
          endDate: '2024-02-29T23:59:59',
          status: 'expired',
          clicks: 890,
          impressions: 3456,
          createdAt: '2024-01-31T00:00:00'
        }
      ]
      this.loading = false
    }, 1000)
  }

  getTypeSeverity(type: string): string {
    switch (type) {
      case 'image':
        return 'info'
      case 'text':
        return 'success'
      case 'html':
        return 'warning'
      default:
        return 'info'
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'warning'
      case 'expired':
        return 'danger'
      default:
        return 'info'
    }
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const table = document.querySelector('p-table')
    // if (table) {
    //   const filterValue = (event.target as HTMLInputElement).value
    //   // @ts-ignore
    //   table.filterGlobal(filterValue, matchMode)
    // }
  }

  filterByType(event: any) {
    const table = document.querySelector('p-table')
    // if (table) {
    //   // @ts-ignore
    //   table.filter(event.value, 'type', 'equals')
    // }
  }

  filterByStatus(event: any) {
    const table = document.querySelector('p-table')
    // if (table) {
    //   // @ts-ignore
    //   table.filter(event.value, 'status', 'equals')
    // }
  }

  confirmDelete(ad: Advertisement) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete advertisement "${ad.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Implement delete advertisement
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Advertisement "${ad.name}" has been deleted`
        })
      }
    })
  }
}
