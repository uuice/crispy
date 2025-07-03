import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { TagModule } from 'primeng/tag'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { TooltipModule } from 'primeng/tooltip'
import { DialogModule } from 'primeng/dialog'
import { BadgeModule } from 'primeng/badge'
import { AvatarModule } from 'primeng/avatar'

interface Comment {
  id: number
  content: string
  author: {
    name: string
    avatar: string
    email: string
  }
  post: {
    id: number
    title: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  createdAt: Date
  ip: string
  parentId?: number
  replyTo?: string
}

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    BadgeModule,
    AvatarModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="container mx-auto p-4">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">评论管理</h1>
        <div class="flex gap-2">
          <button
            pButton
            label="批量审核"
            icon="pi pi-check"
            class="p-button-success"
            [disabled]="!selectedComments.length"
            (click)="batchApprove()"
          ></button>
          <button
            pButton
            label="批量删除"
            icon="pi pi-trash"
            class="p-button-danger"
            [disabled]="!selectedComments.length"
            (click)="batchDelete()"
          ></button>
        </div>
      </div>

      <div class="card">
        <!-- 工具栏 -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              placeholder="搜索评论..."
              [(ngModel)]="searchText"
              (input)="onSearch()"
            />
          </span>

          <p-dropdown
            [options]="statusOptions"
            [(ngModel)]="selectedStatus"
            placeholder="选择状态"
            (onChange)="onStatusChange()"
            [showClear]="true"
            styleClass="w-40"
          ></p-dropdown>

          <p-dropdown
            [options]="timeRangeOptions"
            [(ngModel)]="selectedTimeRange"
            placeholder="时间范围"
            (onChange)="onTimeRangeChange()"
            [showClear]="true"
            styleClass="w-40"
          ></p-dropdown>
        </div>

        <!-- 评论列表 -->
        <p-table
          [value]="comments"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 20, 50]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条"
          [globalFilterFields]="['content', 'author.name', 'post.title']"
          [loading]="loading"
          [(selection)]="selectedComments"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 3rem">
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th style="width: 40%">评论内容</th>
              <th style="width: 15%">评论者</th>
              <th style="width: 20%">文章</th>
              <th style="width: 10%">状态</th>
              <th style="width: 12%">操作</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-comment>
            <tr>
              <td>
                <p-tableCheckbox [value]="comment"></p-tableCheckbox>
              </td>
              <td>
                <div class="flex flex-column">
                  <div class="mb-2">{{ comment.content }}</div>
                  <div class="flex gap-2 text-sm text-gray-500">
                    <span>{{ comment.createdAt | date: 'yyyy-MM-dd HH:mm' }}</span>
                    <span>IP: {{ comment.ip }}</span>
                    <span *ngIf="comment.parentId">回复: {{ comment.replyTo }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <p-avatar
                    [image]="comment.author.avatar"
                    [label]="comment.author.name[0]"
                    styleClass="mr-2"
                  ></p-avatar>
                  <div class="flex flex-column">
                    <span class="font-medium">{{ comment.author.name }}</span>
                    <span class="text-sm text-gray-500">{{ comment.author.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <a class="text-blue-600 hover:text-blue-800">{{ comment.post.title }}</a>
              </td>
              <td>
                <p-tag
                  [severity]="getStatusSeverity(comment.status)"
                  [value]="getStatusLabel(comment.status)"
                ></p-tag>
              </td>
              <td>
                <div class="flex gap-2">
                  <button
                    *ngIf="comment.status === 'pending'"
                    pButton
                    icon="pi pi-check"
                    class="p-button-rounded p-button-success p-button-text p-button-sm"
                    pTooltip="通过"
                    tooltipPosition="top"
                    (click)="approveComment(comment)"
                  ></button>
                  <button
                    *ngIf="comment.status === 'pending'"
                    pButton
                    icon="pi pi-times"
                    class="p-button-rounded p-button-danger p-button-text p-button-sm"
                    pTooltip="拒绝"
                    tooltipPosition="top"
                    (click)="rejectComment(comment)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-reply"
                    class="p-button-rounded p-button-info p-button-text p-button-sm"
                    pTooltip="回复"
                    tooltipPosition="top"
                    (click)="replyComment(comment)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-text p-button-sm"
                    pTooltip="删除"
                    tooltipPosition="top"
                    (click)="confirmDelete(comment)"
                  ></button>
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
      </div>

      <!-- 回复对话框 -->
      <p-dialog
        [(visible)]="replyVisible"
        [style]="{ width: '50vw' }"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        header="回复评论"
        [closeOnEscape]="false"
      >
        <div *ngIf="selectedComment" class="p-4">
          <div class="mb-4">
            <h3 class="font-medium mb-2">原评论：</h3>
            <div class="bg-gray-50 p-3 rounded">
              <div class="flex items-center gap-2 mb-2">
                <p-avatar
                  [image]="selectedComment.author.avatar"
                  [label]="selectedComment.author.name[0]"
                  size="normal"
                ></p-avatar>
                <span class="font-medium">{{ selectedComment.author.name }}</span>
                <span class="text-sm text-gray-500">{{
                  selectedComment.createdAt | date: 'yyyy-MM-dd HH:mm'
                }}</span>
              </div>
              <p>{{ selectedComment.content }}</p>
            </div>
          </div>

          <div class="field">
            <label for="replyContent" class="block text-900 font-medium mb-2"
              >回复内容</label
            >
            <textarea
              id="replyContent"
              pInputTextarea
              [(ngModel)]="replyContent"
              [rows]="4"
              class="w-full"
              placeholder="输入回复内容..."
            ></textarea>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button
            pButton
            label="取消"
            icon="pi pi-times"
            class="p-button-text"
            (click)="replyVisible = false"
          ></button>
          <button
            pButton
            label="提交回复"
            icon="pi pi-check"
            class="p-button-success"
            (click)="submitReply()"
          ></button>
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class CommentsPage implements OnInit {
  comments: Comment[] = []
  selectedComments: Comment[] = []
  loading = false
  searchText = ''
  selectedStatus: string | null = null
  selectedTimeRange: string | null = null
  replyVisible = false
  selectedComment: Comment | null = null
  replyContent = ''

  statusOptions = [
    { label: '待审核', value: 'pending' },
    { label: '已通过', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
    { label: '垃圾评论', value: 'spam' }
  ]

  timeRangeOptions = [
    { label: '今天', value: 'today' },
    { label: '昨天', value: 'yesterday' },
    { label: '最近7天', value: 'last7days' },
    { label: '最近30天', value: 'last30days' }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadComments()
  }

  loadComments() {
    this.loading = true
    // TODO: Implement API call to load comments
    // Mock data for now
    setTimeout(() => {
      this.comments = [
        {
          id: 1,
          content: '这是一条测试评论，文章写得很好！',
          author: {
            name: '张三',
            avatar: '',
            email: 'zhangsan@example.com'
          },
          post: {
            id: 1,
            title: 'Angular 最佳实践指南'
          },
          status: 'pending',
          createdAt: new Date('2024-03-21 10:00:00'),
          ip: '192.168.1.1'
        },
        {
          id: 2,
          content: '感谢分享，学到了很多！',
          author: {
            name: '李四',
            avatar: '',
            email: 'lisi@example.com'
          },
          post: {
            id: 2,
            title: 'TypeScript 入门教程'
          },
          status: 'approved',
          createdAt: new Date('2024-03-20 15:30:00'),
          ip: '192.168.1.2',
          parentId: 1,
          replyTo: '张三'
        }
      ]
      this.loading = false
    }, 1000)
  }

  onSearch() {
    // TODO: Implement search logic
    console.log('Searching for:', this.searchText)
  }

  onStatusChange() {
    // TODO: Implement status filter logic
    console.log('Status changed to:', this.selectedStatus)
  }

  onTimeRangeChange() {
    // TODO: Implement time range filter logic
    console.log('Time range changed to:', this.selectedTimeRange)
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'danger'
      case 'spam':
        return 'info'
      default:
        return 'info'
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved':
        return '已通过'
      case 'pending':
        return '待审核'
      case 'rejected':
        return '已拒绝'
      case 'spam':
        return '垃圾评论'
      default:
        return status
    }
  }

  approveComment(comment: Comment) {
    // TODO: Implement approve logic
    this.messageService.add({
      severity: 'success',
      summary: '成功',
      detail: '评论已通过'
    })
  }

  rejectComment(comment: Comment) {
    // TODO: Implement reject logic
    this.messageService.add({
      severity: 'info',
      summary: '已拒绝',
      detail: '评论已拒绝'
    })
  }

  replyComment(comment: Comment) {
    this.selectedComment = comment
    this.replyContent = ''
    this.replyVisible = true
  }

  submitReply() {
    if (this.replyContent.trim()) {
      // TODO: Implement reply submission
      this.messageService.add({
        severity: 'success',
        summary: '成功',
        detail: '回复已提交'
      })
      this.replyVisible = false
    } else {
      this.messageService.add({
        severity: 'error',
        summary: '错误',
        detail: '请输入回复内容'
      })
    }
  }

  confirmDelete(comment: Comment) {
    this.confirmationService.confirm({
      message: '确定要删除这条评论吗？',
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Implement delete logic
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '评论已删除'
        })
      }
    })
  }

  batchApprove() {
    if (this.selectedComments.length > 0) {
      this.confirmationService.confirm({
        message: `确定要通过选中的 ${this.selectedComments.length} 条评论吗？`,
        header: '批量审核确认',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // TODO: Implement batch approve logic
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '选中的评论已通过'
          })
          this.selectedComments = []
        }
      })
    }
  }

  batchDelete() {
    if (this.selectedComments.length > 0) {
      this.confirmationService.confirm({
        message: `确定要删除选中的 ${this.selectedComments.length} 条评论吗？`,
        header: '批量删除确认',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // TODO: Implement batch delete logic
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '选中的评论已删除'
          })
          this.selectedComments = []
        }
      })
    }
  }
}
