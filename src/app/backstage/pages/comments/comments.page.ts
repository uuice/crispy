import { Component, OnInit, signal, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { TagModule } from 'primeng/tag'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { TooltipModule } from 'primeng/tooltip'
import { DialogModule } from 'primeng/dialog'
import { BadgeModule } from 'primeng/badge'
import { AvatarModule } from 'primeng/avatar'
import { CommentService, type Comment, type CommentFilters } from '../../services/comment.service'
import { TextareaModule } from 'primeng/textarea'

@Component({
  selector: 'cs-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    BadgeModule,
    AvatarModule,
    TextareaModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>评论管理</h1>
        <div class="flex gap-2">
          <p-button
            label="批量审核"
            icon="pi pi-check"
            severity="success"
            [disabled]="!selectedComments().length"
            (click)="batchApprove()"
          ></p-button>
          <p-button
            label="批量删除"
            icon="pi pi-trash"
            severity="danger"
            [disabled]="!selectedComments().length"
            (click)="batchDelete()"
          ></p-button>
        </div>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="comments()"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="pagination().total || 0"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条评论"
        [rowsPerPageOptions]="[10, 20, 50]"
        [loading]="loading()"
        [lazy]="true"
        (onLazyLoad)="onLazyLoad($event)"
        [(selection)]="selectedComments"
        styleClass="p-datatable-sm"
        [scrollable]="true"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <span class="p-input-icon-left">
              <input
                pInputText
                type="text"
                [ngModel]="searchText()"
                (ngModelChange)="searchText.set($event)"
                placeholder="搜索评论内容..."
                (keydown.enter)="onSearch()"
              />
            </span>
            <p-select
              [options]="statusOptions"
              [ngModel]="selectedStatus()"
              (ngModelChange)="selectedStatus.set($event)"
              placeholder="选择状态"
            ></p-select>
            <p-select
              [options]="timeRangeOptions"
              [ngModel]="selectedTimeRange()"
              (ngModelChange)="selectedTimeRange.set($event)"
              placeholder="时间范围"
            ></p-select>
            <div class="search-actions">
              <p-button label="重置" severity="secondary" (click)="resetFilters()"></p-button>
              <p-button
                label="搜索"
                icon="pi pi-search"
                (click)="onSearch()"
                [loading]="loading()"
              ></p-button>
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="header">
          <tr>
            <th style="min-width: 3rem;">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th style="min-width: 18rem;">评论内容</th>
            <th style="min-width: 7rem;">评论者</th>
            <th style="min-width: 7rem;">评分</th>
            <th style="min-width: 5rem;">状态</th>
            <th style="min-width: 6rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-comment>
          <tr>
            <td>
              <p-tableCheckbox [value]="comment"></p-tableCheckbox>
            </td>
            <td>
              <div class="flex flex-column gap-2 mb-2">
                <div class="font-medium text-base">{{ comment.title }}</div>
                <div class="text-gray-600 break-all">{{ comment.content }}</div>
                <div class="text-sm text-gray-500">
                  {{
                    commentService.formatTimestamp(comment.create_time) | date: 'yyyy-MM-dd HH:mm'
                  }}
                </div>
              </div>

              @if (comment.parent_id) {
                <div class="flex flex-column gap-2">
                  <div class="text-sm text-blue-600 break-all" style="white-space: pre-line;">
                    回复: {{ comment.parent_content || '原评论' }}
                  </div>
                </div>
              }
            </td>
            <td>
              <div class="flex items-center gap-2">
                <p-avatar
                  size="large"
                  [style]="{ 'background-color': '#ece9fc', color: '#2a1261' }"
                  shape="circle"
                  [image]="comment.author_avatar"
                  [label]="comment.author_name?.[0] || 'U'"
                  styleClass="mr-2"
                ></p-avatar>
                <div class="flex flex-column">
                  <span class="font-medium">{{ comment.author_name || '匿名用户' }}</span>
                  <span class="text-sm text-gray-500">{{ comment.author_email || '无邮箱' }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="flex flex-column gap-1">
                <div class="flex items-center gap-1">
                  <span class="text-green-600">👍 {{ comment.good_article }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-red-600">👎 {{ comment.bad_article }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-gray-600">😐 {{ comment.not_article }}</span>
                </div>
              </div>
            </td>
            <td>
              <p-tag
                [severity]="commentService.getStatusSeverity(comment.status)"
                [value]="commentService.getStatusLabel(comment.status)"
              ></p-tag>
            </td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                @if (comment.status === 10) {
                  <p-button
                    icon="pi pi-check"
                    severity="success"
                    pTooltip="通过"
                    tooltipPosition="top"
                    (click)="approveComment(comment)"
                  ></p-button>
                  <p-button
                    icon="pi pi-times"
                    severity="danger"
                    pTooltip="拒绝"
                    tooltipPosition="top"
                    (click)="rejectComment(comment)"
                  ></p-button>
                }
                <p-button
                  icon="pi pi-reply"
                  severity="info"
                  pTooltip="回复"
                  tooltipPosition="top"
                  (click)="replyComment(comment)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(comment)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-4">
              <div class="flex flex-column align-items-center">
                <i class="pi pi-comments text-4xl text-gray-400 mb-2"></i>
                <span class="text-gray-500">暂无评论</span>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- 回复对话框 -->
      <p-dialog
        [(visible)]="replyVisible"
        [style]="{ width: '500px' }"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        header="回复评论"
        [closeOnEscape]="false"
      >
        <form>
          <!-- 原评论展示 -->
          <div class="field">
            <label class="block text-900 font-medium mb-2">原评论</label>
            <div class="p-3 border-1 border-round surface-border surface-card">
              <div class="flex align-items-center gap-2 mb-2">
                <p-avatar
                  size="large"
                  [style]="{ 'background-color': '#ece9fc', color: '#2a1261' }"
                  shape="circle"
                  [image]="selectedComment()?.author_avatar"
                  [label]="selectedComment()?.author_name?.[0] || 'U'"
                  size="normal"
                ></p-avatar>
                <span class="font-medium">{{ selectedComment()?.author_name || '匿名用户' }}</span>
                <span class="text-sm text-500">{{
                  commentService.formatTimestamp(selectedComment()?.create_time || 0)
                    | date: 'yyyy-MM-dd HH:mm'
                }}</span>
              </div>
              <div *ngIf="selectedComment()?.title" class="mb-1">
                <span class="font-medium text-900 text-sm">标题：</span>
                <span>{{ selectedComment()?.title }}</span>
              </div>
              <div>
                <span class="font-medium text-900 text-sm">内容：</span>
                <span>{{ selectedComment()?.content }}</span>
              </div>
            </div>
          </div>

          <!-- 回复标题 -->
          <div class="field">
            <label for="replyTitle" class="block text-900 font-medium mb-2">回复标题</label>
            <input
              id="replyTitle"
              pInputText
              [(ngModel)]="replyTitle"
              class="w-full"
              placeholder="输入回复标题..."
              name="replyTitle"
            />
          </div>

          <!-- 回复内容 -->
          <div class="field">
            <label for="replyContent" class="block text-900 font-medium mb-2">回复内容</label>
            <textarea
              id="replyContent"
              [(ngModel)]="replyContent"
              [rows]="5"
              class="w-full"
              placeholder="输入回复内容..."
              name="replyContent"
              pInputTextarea
            ></textarea>
            <small class="text-500 mt-1 block">
              <i class="pi pi-info-circle text-xs"></i>
              请详细描述您的回复内容
            </small>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <p-button
            label="取消"
            icon="pi pi-times"
            severity="secondary"
            (click)="replyVisible.set(false)"
          ></p-button>
          <p-button
            label="提交回复"
            icon="pi pi-check"
            severity="success"
            (click)="submitReply()"
            [loading]="submittingReply()"
          ></p-button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 1rem;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .page-header h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .search-bar {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .search-actions {
        display: flex;
        gap: 0.5rem;
      }
      .action-buttons {
        display: flex;
        gap: 0.25rem;
      }
      .action-buttons p-button {
        margin-right: 0.25rem;
      }
      /* 统一对话框内表单区域间距 */
      .field {
        margin-bottom: 1.2rem;
      }
      .p-dialog .field:last-child {
        margin-bottom: 0;
      }
      /* 原评论卡片内元素间距 */
      .comment-card .mb-1 {
        margin-bottom: 0.5rem;
      }
      .comment-card .mb-2 {
        margin-bottom: 0.75rem;
      }
      .comment-card .mb-3 {
        margin-bottom: 1rem;
      }
    `
  ]
})
export class CommentsPage implements OnInit {
  commentService = inject(CommentService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)

  // Signals
  comments = signal<Comment[]>([])
  selectedComments = signal<Comment[]>([])
  loading = signal(false)
  replyVisible = signal(false)
  selectedComment = signal<Comment | null>(null)
  searchText = signal('')
  selectedStatus = signal<number | null>(null)
  selectedTimeRange = signal<string | null>(null)
  replyTitle = signal('')
  replyContent = signal('')
  submittingReply = signal(false)

  // Pagination
  pagination = signal({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // Options
  statusOptions = [
    { label: '全部状态', value: null },
    { label: '待审核', value: 10 },
    { label: '已通过', value: 20 },
    { label: '已拒绝', value: -10 },
    { label: '垃圾评论', value: -20 }
  ]

  timeRangeOptions = [
    { label: '全部时间', value: null },
    { label: '今天', value: 'today' },
    { label: '昨天', value: 'yesterday' },
    { label: '最近7天', value: 'last7days' },
    { label: '最近30天', value: 'last30days' }
  ]

  ngOnInit() {
    this.loadComments()
  }

  loadComments() {
    this.loading.set(true)

    const filters: CommentFilters = {}
    if (this.searchText()) {
      filters.content = this.searchText()
    }
    if (this.selectedStatus() !== null) {
      filters.status = this.selectedStatus()!
    }

    // Apply time range filter
    const timeRange = this.selectedTimeRange()
    if (timeRange) {
      const now = Date.now()
      const dayMs = 24 * 60 * 60 * 1000

      switch (timeRange) {
        case 'today':
          filters.start_time = new Date().setHours(0, 0, 0, 0)
          filters.end_time = now
          break
        case 'yesterday':
          filters.start_time = new Date().setHours(0, 0, 0, 0) - dayMs
          filters.end_time = new Date().setHours(0, 0, 0, 0) - 1
          break
        case 'last7days':
          filters.start_time = now - 7 * dayMs
          filters.end_time = now
          break
        case 'last30days':
          filters.start_time = now - 30 * dayMs
          filters.end_time = now
          break
      }
    }

    const currentPagination = this.pagination()
    this.commentService
      .getComments({ page: currentPagination.page, pageSize: currentPagination.pageSize }, filters)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.comments.set(response.data.dataList)
            this.pagination.set(response.data.pagination)
            this.loading.set(false)
          } else {
            this.comments.set([])
            this.pagination.set({
              page: 1,
              pageSize: 10,
              total: 0,
              totalPages: 0
            })
            this.loading.set(false)
          }
        },
        error: (error) => {
          console.error('Error loading comments:', error)
          this.comments.set([])
          this.pagination.set({
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0
          })
          this.loading.set(false)
        }
      })
  }

  onLazyLoad(event: any) {
    const page = event.first / event.rows + 1
    this.pagination.update((p) => ({
      ...p,
      page,
      pageSize: event.rows
    }))
    this.loadComments()
  }

  onSearch() {
    this.pagination.update((p) => ({ ...p, page: 1 }))
    this.loadComments()
  }

  onStatusChange() {
    this.pagination.update((p) => ({ ...p, page: 1 }))
    this.loadComments()
  }

  onTimeRangeChange() {
    this.pagination.update((p) => ({ ...p, page: 1 }))
    this.loadComments()
  }

  resetFilters() {
    this.searchText.set('')
    this.selectedStatus.set(null)
    this.selectedTimeRange.set(null)
    this.pagination.update((p) => ({ ...p, page: 1 }))
    this.loadComments()
  }

  approveComment(comment: Comment) {
    this.commentService.updateComment(comment.id, { status: 20 }).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '评论已通过'
        })
        this.loadComments()
      },
      error: (error) => {
        console.error('Error approving comment:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '操作失败'
        })
      }
    })
  }

  rejectComment(comment: Comment) {
    this.commentService.updateComment(comment.id, { status: -10 }).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'info',
          summary: '已拒绝',
          detail: '评论已拒绝'
        })
        this.loadComments()
      },
      error: (error) => {
        console.error('Error rejecting comment:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '操作失败'
        })
      }
    })
  }

  replyComment(comment: Comment) {
    this.selectedComment.set(comment)
    this.replyTitle.set('')
    this.replyContent.set('')
    this.replyVisible.set(true)
  }

  submitReply() {
    if (!this.replyTitle().trim() || !this.replyContent().trim()) {
      this.messageService.add({
        severity: 'error',
        summary: '错误',
        detail: '请输入回复标题和内容'
      })
      return
    }

    const selectedComment = this.selectedComment()
    if (!selectedComment) return

    this.submittingReply.set(true)

    // Create reply comment
    this.commentService
      .createComment({
        title: this.replyTitle(),
        content: this.replyContent(),
        user_id: 1, // TODO: Get current user ID
        parent_id: selectedComment.id,
        status: 20 // Auto approve admin replies
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '回复已提交'
          })
          this.replyVisible.set(false)
          this.submittingReply.set(false)
          this.loadComments()
        },
        error: (error) => {
          console.error('Error submitting reply:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '回复提交失败'
          })
          this.submittingReply.set(false)
        }
      })
  }

  confirmDelete(comment: Comment) {
    this.confirmationService.confirm({
      message: '确定要删除这条评论吗？',
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.commentService.deleteComment(comment.id).subscribe({
          next: (result) => {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '评论已删除'
            })
            this.loadComments()
          },
          error: (error) => {
            console.error('Error deleting comment:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '删除失败'
            })
          }
        })
      }
    })
  }

  batchApprove() {
    const selectedComments = this.selectedComments()
    if (selectedComments.length === 0) return

    this.confirmationService.confirm({
      message: `确定要通过选中的 ${selectedComments.length} 条评论吗？`,
      header: '批量审核确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = selectedComments.map((c) => c.id)
        this.commentService.batchUpdateStatus(ids, 20).subscribe({
          next: (result) => {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: `已通过 ${result.data.updatedCount} 条评论`
            })
            this.selectedComments.set([])
            this.loadComments()
          },
          error: (error) => {
            console.error('Error batch approving comments:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '批量操作失败'
            })
          }
        })
      }
    })
  }

  batchDelete() {
    const selectedComments = this.selectedComments()
    if (selectedComments.length === 0) return

    this.confirmationService.confirm({
      message: `确定要删除选中的 ${selectedComments.length} 条评论吗？`,
      header: '批量删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = selectedComments.map((c) => c.id)
        this.commentService.batchDeleteComments(ids).subscribe({
          next: (result) => {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: `已删除 ${result.data.deletedCount} 条评论`
            })
            this.selectedComments.set([])
            this.loadComments()
          },
          error: (error) => {
            console.error('Error batch deleting comments:', error)
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '批量删除失败'
            })
          }
        })
      }
    })
  }
}
