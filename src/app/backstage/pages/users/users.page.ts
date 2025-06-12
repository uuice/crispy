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

interface User {
  id: number
  username: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'banned'
  lastLogin: string
  createdAt: string
}

@Component({
  selector: 'cs-users',
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
    <div class="users-page">
      <div class="page-header">
        <h1>User Management</h1>
        <button pButton label="Create User" icon="pi pi-plus" routerLink="create"></button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="card">
        <p-table [value]="users" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          [rowsPerPageOptions]="[10,25,50]" [loading]="loading" [globalFilterFields]="['username','email','role']"
          styleClass="p-datatable-sm">
          <ng-template pTemplate="caption">
            <div class="flex justify-content-between">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input pInputText type="text" (input)="applyFilterGlobal($event, 'contains')" placeholder="Search..." />
              </span>
              <p-dropdown [options]="statusOptions" [(ngModel)]="selectedStatus" placeholder="Filter by status"
                (onChange)="filterByStatus($event)" styleClass="p-inputtext-sm"></p-dropdown>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-user>
            <tr>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <p-tag [severity]="getStatusSeverity(user.status)" [value]="user.status"></p-tag>
              </td>
              <td>{{ user.lastLogin | date:'medium' }}</td>
              <td>{{ user.createdAt | date:'medium' }}</td>
              <td>
                <div class="action-buttons">
                  <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="Edit" tooltipPosition="top" [routerLink]="[user.id, 'edit']"></button>
                  <button pButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="Delete" tooltipPosition="top" (click)="confirmDelete(user)"></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">No users found.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [
    `
      .users-page {
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
          box-shadow: 0 2px 4px rgba(0,0,0,.05);
          padding: 1rem;
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
export class UsersPage implements OnInit {
  users: User[] = []
  loading = false
  selectedStatus: string | null = null
  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Banned', value: 'banned' }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.loading = true
    // TODO: Replace with actual API call
    setTimeout(() => {
      this.users = [
        {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          role: 'User',
          status: 'active',
          lastLogin: '2024-03-15T10:30:00',
          createdAt: '2024-01-01T00:00:00'
        },
        {
          id: 2,
          username: 'jane_smith',
          email: 'jane@example.com',
          role: 'Editor',
          status: 'inactive',
          lastLogin: '2024-03-14T15:45:00',
          createdAt: '2024-01-15T00:00:00'
        },
        {
          id: 3,
          username: 'bob_wilson',
          email: 'bob@example.com',
          role: 'User',
          status: 'banned',
          lastLogin: '2024-03-10T08:20:00',
          createdAt: '2024-02-01T00:00:00'
        }
      ]
      this.loading = false
    }, 1000)
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'warning'
      case 'banned':
        return 'danger'
      default:
        return 'info'
    }
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const table = document.querySelector('p-table')
    if (table) {
      const filterValue = (event.target as HTMLInputElement).value
      // @ts-ignore
      table.filterGlobal(filterValue, matchMode)
    }
  }

  filterByStatus(event: any) {
    const table = document.querySelector('p-table')
    if (table) {
      // @ts-ignore
      table.filter(event.value, 'status', 'equals')
    }
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user ${user.username}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Implement delete user
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${user.username} has been deleted`
        })
      }
    })
  }
}
