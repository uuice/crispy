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

interface Admin {
  id: number
  username: string
  email: string
  role: 'super_admin' | 'admin' | 'editor'
  permissions: string[]
  status: 'active' | 'inactive'
  lastLogin: string
  createdAt: string
}

@Component({
  selector: 'cs-admins',
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
    <div class="admins-page">
      <div class="page-header">
        <h1>Admin Management</h1>
        <button pButton label="Create Admin" icon="pi pi-plus" routerLink="create"></button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="card">
        <p-table
          [value]="admins"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} admins"
          [rowsPerPageOptions]="[10, 25, 50]"
          [loading]="loading"
          [globalFilterFields]="['username', 'email', 'role']"
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
                  [options]="roleOptions"
                  [(ngModel)]="selectedRole"
                  placeholder="Filter by role"
                  (onChange)="filterByRole($event)"
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
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-admin>
            <tr>
              <td>{{ admin.username }}</td>
              <td>{{ admin.email }}</td>
              <td>
                <p-tag [severity]="getRoleSeverity(admin.role)" [value]="admin.role"></p-tag>
              </td>
              <td>
                <div class="permissions">
                  <p-tag
                    *ngFor="let permission of admin.permissions"
                    [value]="permission"
                    styleClass="mr-1"
                    severity="info"
                  ></p-tag>
                </div>
              </td>
              <td>
                <p-tag [severity]="getStatusSeverity(admin.status)" [value]="admin.status"></p-tag>
              </td>
              <td>{{ admin.lastLogin | date: 'medium' }}</td>
              <td>{{ admin.createdAt | date: 'medium' }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="Edit"
                    tooltipPosition="top"
                    [routerLink]="[admin.id, 'edit']"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="Delete"
                    tooltipPosition="top"
                    (click)="confirmDelete(admin)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center">No admins found.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [
    `
      .admins-page {
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

        .permissions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
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
export class AdminsPage implements OnInit {
  admins: Admin[] = []
  loading = false
  selectedRole: string | null = null
  selectedStatus: string | null = null

  roleOptions = [
    { label: 'All Roles', value: null },
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' }
  ]

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAdmins()
  }

  loadAdmins() {
    this.loading = true
    // TODO: Replace with actual API call
    setTimeout(() => {
      this.admins = [
        {
          id: 1,
          username: 'super_admin',
          email: 'super@example.com',
          role: 'super_admin',
          permissions: ['all'],
          status: 'active',
          lastLogin: '2024-03-15T10:30:00',
          createdAt: '2024-01-01T00:00:00'
        },
        {
          id: 2,
          username: 'content_admin',
          email: 'content@example.com',
          role: 'admin',
          permissions: ['posts', 'categories', 'tags', 'comments'],
          status: 'active',
          lastLogin: '2024-03-14T15:45:00',
          createdAt: '2024-01-15T00:00:00'
        },
        {
          id: 3,
          username: 'editor',
          email: 'editor@example.com',
          role: 'editor',
          permissions: ['posts', 'comments'],
          status: 'inactive',
          lastLogin: '2024-03-10T08:20:00',
          createdAt: '2024-02-01T00:00:00'
        }
      ]
      this.loading = false
    }, 1000)
  }

  getRoleSeverity(role: string): string {
    switch (role) {
      case 'super_admin':
        return 'danger'
      case 'admin':
        return 'warning'
      case 'editor':
        return 'info'
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

  filterByRole(event: any) {
    const table = document.querySelector('p-table')
    // if (table) {
    //   // @ts-ignore
    //   table.filter(event.value, 'role', 'equals')
    // }
  }

  filterByStatus(event: any) {
    const table = document.querySelector('p-table')
    // if (table) {
    //   // @ts-ignore
    //   table.filter(event.value, 'status', 'equals')
    // }
  }

  confirmDelete(admin: Admin) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete admin ${admin.username}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Implement delete admin
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Admin ${admin.username} has been deleted`
        })
      }
    })
  }
}
