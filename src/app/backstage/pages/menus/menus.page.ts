import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { TreeModule } from 'primeng/tree'
import { TreeTableModule } from 'primeng/treetable'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { ConfirmationService, MessageService } from 'primeng/api'
import { TreeNode } from 'primeng/api'

interface MenuItem {
  id: number
  name: string
  type: 'link' | 'category' | 'page' | 'custom'
  url: string
  icon?: string
  order: number
  parentId: number | null
  status: 'active' | 'inactive'
  children?: MenuItem[]
}

@Component({
  selector: 'cs-menus',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TreeModule,
    TreeTableModule,
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
    <div class="menus-page">
      <div class="page-header">
        <h1>Menu Management</h1>
        <button pButton label="Create Menu Item" icon="pi pi-plus" routerLink="create"></button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="card">
        <div class="menu-tree">
          <p-treeTable
            [value]="menuTree"
            [scrollable]="true"
            [scrollHeight]="'400px'"
            styleClass="p-treetable-sm"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 30%">Name</th>
                <th style="width: 15%">Type</th>
                <th style="width: 25%">URL</th>
                <th style="width: 10%">Order</th>
                <th style="width: 10%">Status</th>
                <th style="width: 10%">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
              <tr [ttRow]="rowNode">
                <td>
                  <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                  <span class="menu-item-name">
                    <i *ngIf="rowData.icon" [class]="rowData.icon" class="mr-2"></i>
                    {{ rowData.name }}
                  </span>
                </td>
                <td>
                  <p-tag [severity]="getTypeSeverity(rowData.type)" [value]="rowData.type"></p-tag>
                </td>
                <td>
                  <span class="menu-url" [pTooltip]="rowData.url" tooltipPosition="top">
                    {{ rowData.url }}
                  </span>
                </td>
                <td>{{ rowData.order }}</td>
                <td>
                  <p-tag
                    [severity]="getStatusSeverity(rowData.status)"
                    [value]="rowData.status"
                  ></p-tag>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      pButton
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-sm"
                      pTooltip="Edit"
                      tooltipPosition="top"
                      [routerLink]="[rowData.id, 'edit']"
                    ></button>
                    <button
                      pButton
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-danger p-button-sm"
                      pTooltip="Delete"
                      tooltipPosition="top"
                      (click)="confirmDelete(rowData)"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-treeTable>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .menus-page {
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

        .menu-tree {
          ::ng-deep {
            .p-treetable {
              .p-treetable-header {
                background: transparent;
                border: none;
                padding: 0 0 1rem 0;
              }

              .p-treetable-thead > tr > th {
                background: #f8f9fa;
                font-weight: 600;
              }

              .p-treetable-tbody > tr > td {
                padding: 0.75rem;
              }

              .menu-item-name {
                display: flex;
                align-items: center;
                gap: 0.5rem;
              }

              .menu-url {
                display: inline-block;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #6c757d;
              }
            }
          }
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
      }
    `
  ]
})
export class MenusPage implements OnInit {
  menuTree: TreeNode[] = []

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadMenuTree()
  }

  loadMenuTree() {
    // TODO: Replace with actual API call
    const menuItems: MenuItem[] = [
      {
        id: 1,
        name: 'Home',
        type: 'link',
        url: '/',
        icon: 'pi pi-home',
        order: 1,
        parentId: null,
        status: 'active'
      },
      {
        id: 2,
        name: 'Blog',
        type: 'category',
        url: '/blog',
        icon: 'pi pi-book',
        order: 2,
        parentId: null,
        status: 'active',
        children: [
          {
            id: 3,
            name: 'Technology',
            type: 'category',
            url: '/blog/technology',
            order: 1,
            parentId: 2,
            status: 'active'
          },
          {
            id: 4,
            name: 'Design',
            type: 'category',
            url: '/blog/design',
            order: 2,
            parentId: 2,
            status: 'active'
          }
        ]
      },
      {
        id: 5,
        name: 'About',
        type: 'page',
        url: '/about',
        icon: 'pi pi-info-circle',
        order: 3,
        parentId: null,
        status: 'active'
      },
      {
        id: 6,
        name: 'Custom Link',
        type: 'custom',
        url: 'https://example.com',
        icon: 'pi pi-external-link',
        order: 4,
        parentId: null,
        status: 'inactive'
      }
    ]

    this.menuTree = this.convertToTreeNodes(menuItems)
  }

  convertToTreeNodes(items: MenuItem[]): TreeNode[] {
    const nodeMap = new Map<number, TreeNode>()
    const rootNodes: TreeNode[] = []

    // First pass: create all nodes
    items.forEach((item) => {
      nodeMap.set(item.id, {
        data: item,
        children: []
      })
    })

    // Second pass: build tree structure
    items.forEach((item) => {
      const node = nodeMap.get(item.id)!
      if (item.parentId === null) {
        rootNodes.push(node)
      } else {
        const parentNode = nodeMap.get(item.parentId)
        if (parentNode) {
          parentNode.children = parentNode.children || []
          parentNode.children.push(node)
        }
      }
    })

    return rootNodes
  }

  getTypeSeverity(type: string): string {
    switch (type) {
      case 'link':
        return 'info'
      case 'category':
        return 'success'
      case 'page':
        return 'warning'
      case 'custom':
        return 'help'
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

  confirmDelete(item: MenuItem) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete menu item "${item.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Implement delete menu item
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Menu item "${item.name}" has been deleted`
        })
      }
    })
  }
}
