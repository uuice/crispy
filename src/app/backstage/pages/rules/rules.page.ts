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
import { RuleDetailComponent } from './rule-detail.component'

interface RuleNode {
  id: number
  title: string
  alias: string
  condition?: string
  des?: string
  icon?: string
  module_id: number
  parent_id: number
  sort: number
  status: number
  type_id: number
  create_time: number
  update_time: number
  children?: RuleNode[]
}

@Component({
  selector: 'cs-rules',
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
    RuleDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>规则管理</h1>
        <p-button label="创建规则" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-treeTable
        [value]="rules()"
        [loading]="loading()"
        styleClass="p-treetable-sm"
        [scrollable]="true"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="rule-search-keyword" class="sr-only" style="opacity: 0">规则名称</label>
            </div>
            <div class="search-actions">
              <p-button
                label="搜索"
                icon="pi pi-search"
                (click)="loadRules()"
                [loading]="loading()"
              ></p-button>
            </div>
          </div>
        </ng-template>
        <ng-template pTemplate="colgroup">
          <colgroup>
            <col style="min-width: 35rem;" />
            <col style="min-width: 7.5rem;" />
            <col style="min-width: 9.375rem;" />
            <col style="min-width: 7.5rem;" />
            <col style="min-width: 5rem;" />
            <col style="min-width: 3.75rem;" />
            <col style="min-width: 5rem;" />
            <col style="min-width: 24rem;" />
            <col style="min-width: 6.25rem;" />
          </colgroup>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th>规则名称</th>
            <th>别名</th>
            <th>描述</th>
            <th>条件</th>
            <th>父级ID</th>
            <th>排序</th>
            <th>状态</th>
            <th>创建时间</th>
            <th class="sticky-right">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
          <tr [ttRow]="rowNode">
            <td>
              <div class="flex align-items-center">
                <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                <span class="rule-title">
                  <i *ngIf="rowData.icon" [class]="rowData.icon" class="mr-2"></i>
                  {{ rowData.title }}
                </span>
              </div>
            </td>
            <td>{{ rowData.alias }}</td>
            <td>{{ rowData.des || '-' }}</td>
            <td>{{ rowData.condition || '-' }}</td>
            <td>{{ rowData.parent_id || '-' }}</td>
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
            <td colspan="9" class="text-center">暂无规则数据</td>
          </tr>
        </ng-template>
      </p-treeTable>

      <!-- Rule Detail Component -->
      @if (isDetailVisible()) {
        <cs-rule-detail
          [rule]="selectedRule()"
          [mode]="selectedRule() ? 'edit' : 'create'"
          (saved)="onRuleSaved()"
          (cancelled)="onRuleCancelled()"
        ></cs-rule-detail>
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
export class RulesPage implements OnInit {
  rules = signal<TreeNode[]>([])
  loading = signal(false)
  selectedRule = signal<RuleNode | null>(null)
  isDetailVisible = signal(false)

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.loadRules()
    })
  }

  loadRules() {
    this.loading.set(true)
    this.httpService.get<any>('/api/admin/rules/tree').subscribe({
      next: (response) => {
        if (response.success) {
          this.rules.set(this.convertToTreeNodes(response.data || []))
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '加载规则列表失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to load rules:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载规则列表失败'
        })
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  convertToTreeNodes(rules: RuleNode[]): TreeNode[] {
    return rules.map((rule) => ({
      data: rule,
      children: rule.children ? this.convertToTreeNodes(rule.children) : undefined,
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
    this.selectedRule.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(rule: RuleNode) {
    this.selectedRule.set(rule)
    this.isDetailVisible.set(true)
  }

  onRuleSaved() {
    this.loadRules()
    this.selectedRule.set(null)
    this.isDetailVisible.set(false)
  }

  onRuleCancelled() {
    this.selectedRule.set(null)
    this.isDetailVisible.set(false)
  }

  confirmDelete(rule: RuleNode) {
    this.confirmationService.confirm({
      message: `确定要删除规则 "${rule.title}" 吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRule(rule.id)
      }
    })
  }

  deleteRule(id: number) {
    this.httpService.delete<any>(`/api/admin/rules/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '规则删除成功'
          })
          this.loadRules()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除规则失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete rule:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '删除规则失败'
        })
      }
    })
  }
}
