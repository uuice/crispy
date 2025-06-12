import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
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

interface Post {
  id: number
  title: string
  author: string
  category: string
  status: 'draft' | 'published' | 'archived'
  publishDate: Date
  tags: string[]
}

@Component({
  selector: 'app-posts',
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
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="container mx-auto p-4">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">文章管理</h1>
        <button
          pButton
          label="新建文章"
          icon="pi pi-plus"
          routerLink="create"
          class="p-button-success"
        ></button>
      </div>

      <div class="card">
        <!-- 工具栏 -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              placeholder="搜索文章..."
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
            [options]="categoryOptions"
            [(ngModel)]="selectedCategory"
            placeholder="选择分类"
            (onChange)="onCategoryChange()"
            [showClear]="true"
            styleClass="w-40"
          ></p-dropdown>
        </div>

        <!-- 文章列表 -->
        <p-table
          [value]="posts"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 20, 50]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条"
          [globalFilterFields]="['title', 'author', 'category']"
          [loading]="loading"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 3rem">
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th pSortableColumn="title" style="width: 30%">
                标题
                <p-sortIcon field="title"></p-sortIcon>
              </th>
              <th pSortableColumn="author" style="width: 15%">
                作者
                <p-sortIcon field="author"></p-sortIcon>
              </th>
              <th pSortableColumn="category" style="width: 15%">
                分类
                <p-sortIcon field="category"></p-sortIcon>
              </th>
              <th pSortableColumn="status" style="width: 10%">
                状态
                <p-sortIcon field="status"></p-sortIcon>
              </th>
              <th pSortableColumn="publishDate" style="width: 15%">
                发布日期
                <p-sortIcon field="publishDate"></p-sortIcon>
              </th>
              <th style="width: 12%">操作</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-post>
            <tr>
              <td>
                <p-tableCheckbox [value]="post"></p-tableCheckbox>
              </td>
              <td>
                <span class="font-medium">{{ post.title }}</span>
              </td>
              <td>{{ post.author }}</td>
              <td>{{ post.category }}</td>
              <td>
                <p-tag
                  [severity]="getStatusSeverity(post.status)"
                  [value]="getStatusLabel(post.status)"
                ></p-tag>
              </td>
              <td>{{ post.publishDate | date: 'yyyy-MM-dd HH:mm' }}</td>
              <td>
                <div class="flex gap-2">
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="编辑"
                    tooltipPosition="top"
                    [routerLink]="['edit', post.id]"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="删除"
                    tooltipPosition="top"
                    (click)="confirmDelete(post)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-info p-button-sm"
                    pTooltip="预览"
                    tooltipPosition="top"
                    (click)="previewPost(post)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center p-4">
                <div class="flex flex-column align-items-center">
                  <i class="pi pi-inbox text-4xl text-gray-400 mb-2"></i>
                  <span class="text-gray-500">暂无数据</span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- 预览对话框 -->
      <p-dialog
        [(visible)]="previewVisible"
        [style]="{ width: '80vw' }"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        header="文章预览"
      >
        <div *ngIf="selectedPost" class="p-4">
          <h2 class="text-2xl font-bold mb-4">{{ selectedPost.title }}</h2>
          <div class="flex gap-4 mb-4">
            <p-tag [value]="selectedPost.author" icon="pi pi-user"></p-tag>
            <p-tag [value]="selectedPost.category" icon="pi pi-folder"></p-tag>
            <p-tag
              [severity]="getStatusSeverity(selectedPost.status)"
              [value]="getStatusLabel(selectedPost.status)"
            ></p-tag>
          </div>
          <div class="prose max-w-none">
            <!-- TODO: Add post content preview -->
            <p>文章内容预览...</p>
          </div>
        </div>
      </p-dialog>
    </div>
  `
})
export class PostsPage implements OnInit {
  posts: Post[] = []
  loading = false
  searchText = ''
  selectedStatus: string | null = null
  selectedCategory: string | null = null
  previewVisible = false
  selectedPost: Post | null = null

  statusOptions = [
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
    { label: '已归档', value: 'archived' }
  ]

  categoryOptions = [
    { label: '技术', value: 'tech' },
    { label: '生活', value: 'life' },
    { label: '随笔', value: 'essay' }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPosts()
  }

  loadPosts() {
    this.loading = true
    // TODO: Implement API call to load posts
    // Mock data for now
    setTimeout(() => {
      this.posts = [
        {
          id: 1,
          title: 'Angular 最佳实践指南',
          author: '张三',
          category: '技术',
          status: 'published',
          publishDate: new Date('2024-03-20'),
          tags: ['Angular', '前端']
        },
        {
          id: 2,
          title: 'TypeScript 入门教程',
          author: '李四',
          category: '技术',
          status: 'draft',
          publishDate: new Date('2024-03-19'),
          tags: ['TypeScript', '教程']
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

  onCategoryChange() {
    // TODO: Implement category filter logic
    console.log('Category changed to:', this.selectedCategory)
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'info'
      default:
        return 'info'
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'published':
        return '已发布'
      case 'draft':
        return '草稿'
      case 'archived':
        return '已归档'
      default:
        return status
    }
  }

  confirmDelete(post: Post) {
    this.confirmationService.confirm({
      message: `确定要删除文章"${post.title}"吗？`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Implement delete logic
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '文章已删除'
        })
      }
    })
  }

  previewPost(post: Post) {
    this.selectedPost = post
    this.previewVisible = true
  }
}
