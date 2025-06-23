import { Component, OnInit, signal, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { TreeTableModule } from 'primeng/treetable'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { CategoryDetailComponent } from './category-detail.component'

interface CategoryNode {
  id: number
  title: string
  alias: string
  des?: string
  parent_id: number
  sort: number
  status: number
  create_time: number
  update_time: number
  children?: CategoryNode[]
}

@Component({
  selector: 'cs-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TreeTableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    CategoryDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>分类管理</h1>
        <p-button label="创建分类" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-treeTable
        [value]="categories()"
        [loading]="loading()"
        styleClass="p-treetable-sm"
        [scrollable]="true"
        scrollHeight="600px"
      >
        <ng-template pTemplate="colgroup">
          <colgroup>
            <col style="min-width: 17rem;" />
            <col style="min-width: 10rem;" />
            <col style="min-width: 15rem;" />
            <col style="min-width: 5rem;" />
            <col style="min-width: 5rem;" />
            <col style="min-width: 12rem;" />
            <col style="min-width: 6.25rem;" />
          </colgroup>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th>分类名称</th>
            <th>别名</th>
            <th>描述</th>
            <th>排序</th>
            <th>状态</th>
            <th>创建时间</th>
            <th class="sticky-right">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
          <tr [ttRow]="rowNode">
            <td>
              <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
              <span class="category-title">{{ rowData.title }}</span>
            </td>
            <td>{{ rowData.alias }}</td>
            <td>{{ rowData.des || '-' }}</td>
            <td>{{ rowData.sort }}</td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(rowData.status)"
                [value]="getStatusText(rowData.status)"
              ></p-tag>
            </td>
            <td>{{ rowData.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
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
            <td colspan="7" class="text-center">暂无分类数据</td>
          </tr>
        </ng-template>
      </p-treeTable>

      <!-- Category Detail Component -->
      @if (isDetailVisible()) {
        <cs-category-detail
          [category]="selectedCategory()"
          [mode]="selectedCategory() ? 'edit' : 'create'"
          (saved)="onCategorySaved()"
          (cancelled)="onCategoryCancelled()"
        ></cs-category-detail>
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

        .p-treetable-tbody tr:hover .sticky-right {
        }
      }
    `
  ]
})
export class CategoriesPage implements OnInit {
  categories = signal<TreeNode[]>([])
  loading = signal(false)
  selectedCategory = signal<CategoryNode | null>(null)
  isDetailVisible = signal(false)

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.loadCategories()
    })
  }

  loadCategories() {
    this.loading.set(true)
    this.httpService.get<any>('/api/admin/categories/tree').subscribe({
      next: (response) => {
        if (response.success) {
          this.categories.set(this.convertToTreeNodes(response.data || []))
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '加载分类列表失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to load categories:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载分类列表失败'
        })
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  convertToTreeNodes(nodes: CategoryNode[]): TreeNode[] {
    return nodes.map((node) => ({
      data: node,
      children: node.children ? this.convertToTreeNodes(node.children) : undefined,
      expanded: true
    }))
  }

  getStatusSeverity(status: number): string {
    return status === 10 ? 'success' : 'warning'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }

  openCreateDialog() {
    this.selectedCategory.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(category: CategoryNode) {
    this.selectedCategory.set(category)
    this.isDetailVisible.set(true)
  }

  onCategorySaved() {
    this.loadCategories()
    this.selectedCategory.set(null)
    this.isDetailVisible.set(false)
  }

  onCategoryCancelled() {
    this.selectedCategory.set(null)
    this.isDetailVisible.set(false)
  }

  confirmDelete(category: CategoryNode) {
    this.confirmationService.confirm({
      message: `确定要删除分类 "${category.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCategory(category.id)
      }
    })
  }

  deleteCategory(id: number) {
    this.httpService.delete<any>(`/api/admin/categories/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '分类删除成功'
          })
          this.loadCategories()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除分类失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete category:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error?.message || '删除分类失败'
        })
      }
    })
  }
}
