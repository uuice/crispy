import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { TreeTableModule } from 'primeng/treetable'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { MenuDetailComponent } from './menu-detail.component'

// 菜单节点类型，递归结构
interface MenuNode {
  id: number
  title: string
  alias: string
  icon?: string
  url?: string
  image_url?: string
  method?: string
  sort: number
  status: number
  parent_id: number
  create_time: number
  update_time: number
  children?: MenuNode[]
}

@Component({
  selector: 'cs-menus',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TreeTableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    MenuDetailComponent
    // MenuDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>菜单管理</h1>
        <p-button label="创建菜单" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-treeTable
        [value]="menus()"
        [loading]="loading()"
        styleClass="p-treetable-sm"
        [scrollable]="true"
      >
        <ng-template pTemplate="colgroup">
          <colgroup>
            <col style="min-width: 20rem;" />
            <col style="min-width: 8rem;" />
            <col style="min-width: 8rem;" />
            <col style="min-width: 8rem;" />
            <col style="min-width: 8rem;" />
            <col style="min-width: 5rem;" />
            <col style="min-width: 5rem;" />
            <col style="min-width: 10rem;" />
          </colgroup>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th>菜单名称</th>
            <th>别名</th>
            <th>图标</th>
            <th>链接</th>
            <th>打开方式</th>
            <th>排序</th>
            <th>状态</th>
            <th class="sticky-right">操作</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
          <tr [ttRow]="rowNode">
            <td>
              <div class="flex align-items-center">
                <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                <span class="menu-title">
                  <i *ngIf="rowData.icon" [class]="rowData.icon" class="mr-2"></i>
                  {{ rowData.title }}
                </span>
              </div>
            </td>
            <td>{{ rowData.alias }}</td>
            <td>{{ rowData.icon || '-' }}</td>
            <td>
              <span class="menu-url" [pTooltip]="rowData.url" tooltipPosition="top">
                {{ rowData.url || '-' }}
              </span>
            </td>
            <td>{{ rowData.method || '-' }}</td>
            <td>{{ rowData.sort }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(rowData.status)"
                [value]="getStatusText(rowData.status)"
              ></p-tag>
            </td>
            <td class="sticky-right">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(rowData)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(rowData)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="8" class="text-center">暂无菜单数据</td>
          </tr>
        </ng-template>
      </p-treeTable>

      <!-- Menu Detail Component -->
      @if (isDetailVisible()) {
        <cs-menu-detail
          [menu]="selectedMenu()"
          [mode]="selectedMenu() ? 'edit' : 'create'"
          (saved)="onMenuSaved()"
          (cancelled)="onMenuCancelled()"
        ></cs-menu-detail>
      }
    </div>
  `,
  styles: [
    `
      ::ng-deep .p-treetable {
        .sticky-right {
          position: sticky !important;
          right: 0 !important;
          background: var(--p-treetable-header-cell-background);
          z-index: 10 !important;
        }
        .p-treetable-thead .sticky-right {
          background: var(--p-treetable-header-cell-background);
        }
        .p-treetable-tbody .sticky-right {
          background: var(--p-treetable-header-cell-background);
        }
      }
    `
  ]
})
export class MenusPage implements OnInit {
  menus = signal<TreeNode[]>([])
  loading = signal(false)
  selectedMenu = signal<MenuNode | null>(null)
  isDetailVisible = signal(false)

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadMenus()
    })
  }

  loadMenus() {
    this.loading.set(true)
    this.httpService.get<any>('/api/admin/menus/tree').subscribe({
      next: (response) => {
        if (response.success) {
          this.menus.set(this.convertToTreeNodes(response.data || []))
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '加载菜单列表失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to load menus:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载菜单列表失败'
        })
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  convertToTreeNodes(menus: MenuNode[]): TreeNode[] {
    return menus.map((menu) => ({
      data: menu,
      children: menu.children ? this.convertToTreeNodes(menu.children) : undefined,
      expanded: true
    }))
  }

  getStatusSeverity(status: number): string {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  openCreateDialog() {
    this.selectedMenu.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(menu: MenuNode) {
    this.selectedMenu.set(menu)
    this.isDetailVisible.set(true)
  }

  onMenuSaved() {
    this.loadMenus()
    this.selectedMenu.set(null)
    this.isDetailVisible.set(false)
  }

  onMenuCancelled() {
    this.selectedMenu.set(null)
    this.isDetailVisible.set(false)
  }

  confirmDelete(menu: MenuNode) {
    this.confirmationService.confirm({
      message: `确定要删除菜单 "${menu.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMenu(menu.id)
      }
    })
  }

  deleteMenu(id: number) {
    this.httpService.delete<any>(`/api/admin/menus/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '菜单删除成功'
          })
          this.loadMenus()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除菜单失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete menu:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '删除菜单失败'
        })
      }
    })
  }
}
