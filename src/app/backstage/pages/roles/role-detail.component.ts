import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { MessageService, TreeNode } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { TextareaModule } from 'primeng/textarea'
import { TreeTableModule } from 'primeng/treetable'
import { TooltipModule } from 'primeng/tooltip'
import { CheckboxModule } from 'primeng/checkbox'
import { TagModule } from 'primeng/tag'
import { HttpService } from '../../services/http.service'
import { RoleEntity, RuleTreeItem } from '@src/types'

interface RulesTreeResponse {
  success: boolean
  data: RuleTreeItem[]
}

@Component({
  selector: 'cs-role-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    ToastModule,
    MessageModule,
    TextareaModule,
    TreeTableModule,
    TooltipModule,
    CheckboxModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-dialog
      [visible]="true"
      (visibleChange)="onCancel()"
      [header]="dialogTitle"
      [modal]="true"
      [style]="{ width: '800px' }"
      [draggable]="false"
      [resizable]="false"
      [closeOnEscape]="false"
    >
      <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12">
            <label for="title" class="block text-900 font-medium mb-2">角色名称 *</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              placeholder="请输入角色名称"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('title') }"
            />
            @if (isFieldInvalid('title')) {
              <p-message
                severity="error"
                [text]="getErrorMessage('title')"
                styleClass="mt-1"
              ></p-message>
            }
          </div>

          <div class="field col-12">
            <label for="des" class="block text-900 font-medium mb-2">描述</label>
            <textarea
              id="des"
              pInputTextarea
              formControlName="des"
              placeholder="请输入角色描述"
              [rows]="3"
              class="w-full"
            ></textarea>
          </div>

          <div class="field col-6">
            <label for="sort" class="block text-900 font-medium mb-2">排序</label>
            <input
              id="sort"
              type="number"
              pInputText
              formControlName="sort"
              placeholder="请输入排序值"
              class="w-full"
            />
          </div>

          <div class="field col-6">
            <label for="status" class="block text-900 font-medium mb-2">状态</label>
            <p-select
              id="status"
              [options]="statusOptions"
              formControlName="status"
              placeholder="请选择状态"
              class="w-full"
              appendTo="body"
            ></p-select>
          </div>

          <div class="field col-12">
            <label class="block text-900 font-medium mb-2">权限规则</label>
            <div class="rules-table-container">
              <p-treeTable [value]="ruleTreeNodes()" dataKey="key" [loading]="loadingRules()">
                <ng-template pTemplate="colgroup">
                  <colgroup>
                    <col style="width: 15rem" />
                    <col style="width: 9.375rem" />
                    <col style="width: 6.25rem" />
                    <col style="width: 5rem" />
                    <col style="width: 12.5rem" />
                    <col style="width: 6.25rem" />
                  </colgroup>
                </ng-template>
                <ng-template pTemplate="header">
                  <tr>
                    <th>
                      <p-checkbox
                        [binary]="true"
                        [ngModel]="isAllSelected()"
                        (onChange)="toggleSelectAll($event.checked)"
                        [indeterminate]="isIndeterminate()"
                        [ngModelOptions]="{ standalone: true }"
                      ></p-checkbox>
                      <span class="ml-2">规则名称</span>
                    </th>
                    <th>别名</th>
                    <th>状态</th>
                    <th>排序</th>
                    <th>条件</th>
                    <th>操作</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
                  <tr [ttRow]="rowNode">
                    <td>
                      <div class="flex align-items-center">
                        <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                        <p-checkbox
                          [value]="rowData.id"
                          [ngModel]="selectedRuleIds()"
                          (ngModelChange)="selectedRuleIds.set($event)"
                          [ngModelOptions]="{ standalone: true }"
                        ></p-checkbox>
                        <span class="ml-2 rule-title">{{ rowData.title }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="rule-alias">{{ rowData.alias }}</span>
                    </td>
                    <td>
                      <p-tag
                        [severity]="rowData.status === 10 ? 'success' : 'danger'"
                        [value]="rowData.status === 10 ? '启用' : '禁用'"
                      ></p-tag>
                    </td>
                    <td>{{ rowData.sort }}</td>
                    <td>
                      <span class="rule-alias">{{ rowData.condition }}</span>
                    </td>
                    <td>
                      <p-button
                        icon="pi pi-eye"
                        size="small"
                        pTooltip="查看详情"
                        tooltipPosition="top"
                        (click)="viewRuleDetail(rowData)"
                      ></p-button>
                    </td>
                  </tr>
                </ng-template>
                <ng-template pTemplate="loadingbody">
                  <tr>
                    <td colspan="6" class="text-center">
                      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                      <p class="mt-2">加载规则中...</p>
                    </td>
                  </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                  <tr>
                    <td colspan="6" class="text-center">没有找到规则数据</td>
                  </tr>
                </ng-template>
              </p-treeTable>
            </div>
            <pre>{{ selectedRuleIds() | json }}</pre>

            <div class="selected-rules-info mt-3">
              <p class="text-sm text-gray-600">
                已选择 <strong>{{ selectedRuleIds().length }}</strong> 个规则
              </p>
            </div>
          </div>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <p-button
          label="关闭"
          icon="pi pi-times"
          severity="secondary"
          (click)="onCancel()"
        ></p-button>
        <p-button
          label="保存"
          icon="pi pi-check"
          [loading]="submitting()"
          [disabled]="roleForm.invalid"
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

      .rules-table-container {
        border: 1px solid var(--p-content-border-color);
        border-radius: 6px;
        overflow: hidden;
      }

      .rule-title {
        font-weight: 500;
      }

      .rule-alias {
        color: var(--p-text-color);
        font-family: monospace;
        background-color: var(--p-content-background);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.875rem;
      }

      .selected-rules-info {
        background-color: var(--p-content-background);
        border: 1px solid var(--p-content-border-color);
        border-radius: 6px;
        padding: 0.75rem;
      }
    `
  ]
})
export class RoleDetailComponent implements OnInit, OnChanges {
  @Input() role: RoleEntity | null = null
  @Input() mode: 'edit' | 'create' = 'create'
  @Output() saved = new EventEmitter<Partial<RoleEntity>>()
  @Output() cancelled = new EventEmitter<void>()

  submitting = signal(false)
  loadingRules = signal(false)
  roleForm: FormGroup
  ruleTreeNodes = signal<TreeNode<RuleTreeItem>[]>([])
  selectedRuleIds = signal<number[]>([])
  allNodeIds: number[] = []

  private httpService = inject(HttpService)

  statusOptions = [
    { label: '启用', value: 10 },
    { label: '禁用', value: 0 }
  ]

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.roleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      des: [''],
      module_id: [0], // Preserved but not shown
      rule_ids: [''],
      sort: [0],
      status: [10],
      type_id: [0] // Preserved but not shown
    })
  }

  ngOnInit() {
    this.loadRules()
    this.updateForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] || changes['mode']) {
      this.updateForm()
    }
  }

  private loadRules() {
    this.loadingRules.set(true)
    this.httpService.get<RulesTreeResponse>('/api/admin/rules/tree').subscribe({
      next: (res: RulesTreeResponse) => {
        if (res.success) {
          const allIds: number[] = []
          const flattenIds = (nodes: RuleTreeItem[]) => {
            nodes.forEach((node) => {
              allIds.push(node.id)
              if (node.children) {
                flattenIds(node.children)
              }
            })
          }
          flattenIds(res.data)
          this.allNodeIds = allIds
          this.ruleTreeNodes.set(this.buildTreeNodes(res.data))
          // Set selected rules after data is loaded
          if (this.mode === 'edit' && this.role) {
            this.setSelectedRules(this.role.rule_ids)
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '加载规则数据失败'
          })
        }
        this.loadingRules.set(false)
      },
      error: (error) => {
        console.error('Error loading rules:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '加载规则数据失败'
        })
        this.loadingRules.set(false)
      }
    })
  }

  private buildTreeNodes(
    rules: RuleTreeItem[],
    parent: TreeNode<RuleTreeItem> | null = null
  ): TreeNode<RuleTreeItem>[] {
    return rules.map((rule) => {
      const node: TreeNode<RuleTreeItem> = {
        key: rule.id.toString(),
        data: rule,
        expanded: true,
        parent: parent ?? undefined
      }
      node.children = rule.children ? this.buildTreeNodes(rule.children, node) : []
      return node
    })
  }

  private updateForm() {
    if (this.mode === 'edit' && this.role) {
      this.roleForm.patchValue(this.role)
      // setSelectedRules will be called after rules are loaded
    } else {
      this.roleForm.reset({
        title: '',
        des: '',
        module_id: 0,
        rule_ids: '',
        sort: 0,
        status: 10,
        type_id: 0
      })
      this.selectedRuleIds.set([])
    }
  }

  private setSelectedRules(ruleIdsString: string | null) {
    if (!ruleIdsString) {
      this.selectedRuleIds.set([])
      return
    }
    const ruleIds = ruleIdsString
      .split(',')
      .filter((id) => id)
      .map(Number)
    this.selectedRuleIds.set(ruleIds)
  }

  private formatRuleIds(): string {
    if (this.selectedRuleIds().length === 0) {
      return ''
    }
    const ids = this.selectedRuleIds()
    return ids.join(',')
  }

  viewRuleDetail(rule: RuleTreeItem) {
    const statusText = rule.status === 10 ? '启用' : '禁用'
    this.messageService.add({
      severity: 'info',
      summary: '规则详情',
      detail: `规则名称: ${rule.title}, 别名: ${rule.alias}, 状态: ${statusText}, 排序: ${rule.sort}, 条件: ${rule.condition}`
    })
  }

  get isCreateMode(): boolean {
    return this.mode === 'create'
  }

  get dialogTitle(): string {
    return this.isCreateMode ? '创建角色' : '编辑角色'
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.roleForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getErrorMessage(fieldName: string): string {
    const field = this.roleForm.get(fieldName)
    if (!field || !field.errors) return ''

    const errors = field.errors
    if (errors['required']) return '此字段为必填项'
    if (errors['minlength']) return `最少需要 ${errors['minlength'].requiredLength} 个字符`
    return '输入格式不正确'
  }

  onCancel() {
    this.cancelled.emit()
  }

  onSubmit() {
    this.roleForm.patchValue({ rule_ids: this.formatRuleIds() })

    if (this.roleForm.valid) {
      this.submitting.set(true)
      const formData: Partial<RoleEntity> = {
        ...this.roleForm.value
      }
      if (this.role) {
        formData.id = this.role.id
      }
      this.saved.emit(formData)
      this.submitting.set(false)
    } else {
      this.roleForm.markAllAsTouched()
    }
  }

  isAllSelected(): boolean {
    return (
      this.allNodeIds &&
      this.allNodeIds.length > 0 &&
      this.selectedRuleIds().length === this.allNodeIds.length
    )
  }

  isIndeterminate(): boolean {
    return (
      this.allNodeIds &&
      this.selectedRuleIds().length > 0 &&
      this.selectedRuleIds().length < this.allNodeIds.length
    )
  }

  toggleSelectAll(isSelected: boolean) {
    if (isSelected) {
      this.selectedRuleIds.set([...this.allNodeIds])
    } else {
      this.selectedRuleIds.set([])
    }
  }
}
