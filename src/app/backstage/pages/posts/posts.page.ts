import { Component, OnInit, signal, WritableSignal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { SelectModule } from 'primeng/select'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { AuthService } from '../../services/auth.service'
import { PostDetailComponent } from './post-detail.component'
import { CheckboxModule } from 'primeng/checkbox'

interface Article {
  id: number
  title: string
  content: string
  abstract?: string
  sub_title?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  image?: string
  image_list?: string
  tags?: string
  remark?: string
  type_id?: number
  type_ids?: string
  author_id?: number
  user_id?: number
  status: number // 10=已发布, -10=待发布, -20=草稿箱, -100=已删除
  click?: number
  is_review?: number
  redirect_url?: string
  attrs?: string
  create_time: number
  update_time: number
  is_delete: number
  type?: {
    id: number
    title: string
  }
}

interface Category {
  id: number
  title: string
  alias?: string
  des?: string
  parent_id?: number
  sort?: number
  status?: number
  create_time: number
  update_time: number
  children?: Category[]
}

interface ArticlesResponse {
  success: boolean
  message: string
  data: {
    dataList: Article[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

interface CategoriesResponse {
  success: boolean
  message: string
  data: Category[]
}

@Component({
  selector: 'cs-posts',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    SelectModule,
    PostDetailComponent,
    CheckboxModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>文章管理</h1>
        <p-button label="新增文章" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="articles()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条文章"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadArticlesLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <label for="article-search-title" class="sr-only">标题</label>
              <input
                id="article-search-title"
                pInputText
                type="text"
                [(ngModel)]="title"
                placeholder="标题"
              />
              <label for="article-search-abstract" class="sr-only">摘要</label>
              <input
                id="article-search-abstract"
                pInputText
                type="text"
                [(ngModel)]="abstract"
                placeholder="摘要"
              />
              <label for="article-status-select" class="sr-only">状态</label>
              <p-select
                id="article-status-select"
                [options]="statusOptions()"
                [(ngModel)]="statusValue"
                optionLabel="label"
                optionValue="value"
                placeholder="状态"
              />
              <label for="article-category-select" class="sr-only">分类</label>
              <p-select
                id="article-category-select"
                [options]="categoryOptions()"
                [(ngModel)]="categoryValue"
                optionLabel="label"
                optionValue="value"
                placeholder="分类"
              />
            </div>
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
            <th style="min-width: 6rem;">ID</th>
            <th style="min-width: 12rem;">标题</th>
            <th style="min-width: 8rem;">分类</th>
            <th style="min-width: 8rem;">状态</th>
            <th style="min-width: 8rem;">审核状态</th>
            <th style="min-width: 12rem;">标签</th>
            <th style="min-width: 8rem;">点击量</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 14rem;">更新时间</th>
            <th style="min-width: 10rem;">属性</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-article>
          <tr>
            <td>{{ article.id }}</td>
            <td>
              <div class="article-title">
                <span class="title-text" [pTooltip]="article.title" tooltipPosition="top">
                  {{ article.title }}
                </span>
                @if (article.sub_title) {
                  <div class="sub-title text-gray-500 text-sm">{{ article.sub_title }}</div>
                }
                @if (article.abstract) {
                  <div class="abstract text-gray-400 text-xs mt-1">
                    {{
                      article.abstract.length > 50
                        ? article.abstract.substring(0, 50) + '...'
                        : article.abstract
                    }}
                  </div>
                }
              </div>
            </td>
            <td>
              @if (article.type?.title) {
                <span>{{ article.type.title }}</span>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>
              <p-tag
                [severity]="getStatusSeverity(article.status)"
                [value]="getStatusText(article.status)"
              ></p-tag>
            </td>
            <td>
              <p-tag
                [severity]="getReviewSeverity(article.is_review)"
                [value]="getReviewText(article.is_review)"
              ></p-tag>
            </td>
            <td>
              @if (article.tags) {
                <div class="tags-container">
                  @for (tag of article.tags.split(','); track tag) {
                    @if (tag.trim()) {
                      <p-tag [value]="tag.trim()" severity="info" styleClass="mr-1 mb-1"></p-tag>
                    }
                  }
                </div>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>{{ article.click || 0 }}</td>
            <td>{{ article.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>{{ article.update_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>
              <div class="flex flex-wrap gap-2">
                @for (opt of attrsOptions(); track opt) {
                  <p-checkbox
                    [inputId]="'attr-' + article.id + '-' + opt.value"
                    [value]="opt.value"
                    [name]="'attr-' + article.id"
                    [(ngModel)]="attrsCheckedMap[article.id]"
                    (ngModelChange)="onAttrsChange(article, $event)"
                    styleClass="mr-2"
                  ></p-checkbox>
                  <label [for]="'attr-' + article.id + '-' + opt.value" class="mr-3">{{
                    opt.label
                  }}</label>
                }
              </div>
            </td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(article)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(article)"
                ></p-button>
                <p-button
                  icon="pi pi-eye"
                  severity="info"
                  pTooltip="预览"
                  tooltipPosition="top"
                  (click)="previewArticle(article)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="10" class="text-center">没有找到文章。</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Article Detail Component -->
      @if (isDetailVisible()) {
        <cs-post-detail
          [article]="selectedArticle()"
          [mode]="selectedArticle() ? 'edit' : 'create'"
          (saved)="onArticleSaved($event)"
          (cancelled)="onArticleCancelled()"
        ></cs-post-detail>
      }

      <!-- Preview Dialog -->
      @if (previewVisible()) {
        <p-dialog
          [visible]="previewVisible()"
          (visibleChange)="previewVisible.set($event)"
          [style]="{ width: '80vw' }"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          header="文章预览"
          [closeOnEscape]="false"
        >
          @if (previewArticleData()) {
            <div class="p-4">
              <h2 class="text-2xl font-bold mb-4">{{ previewArticleData()?.title }}</h2>
              <div class="flex gap-4 mb-4">
                @if (previewArticleData()?.type?.title) {
                  <p-tag [value]="previewArticleData()?.type?.title" icon="pi pi-folder"></p-tag>
                }
                <p-tag
                  [severity]="getStatusSeverity(previewArticleData()?.status || 0)"
                  [value]="getStatusText(previewArticleData()?.status || 0)"
                ></p-tag>
                <p-tag
                  [severity]="getReviewSeverity(previewArticleData()?.is_review || 0)"
                  [value]="getReviewText(previewArticleData()?.is_review || 0)"
                ></p-tag>
              </div>
              @if (previewArticleData()?.abstract) {
                <div class="mb-4 p-3 bg-gray-50 rounded">
                  <h3 class="font-medium mb-2">摘要：</h3>
                  <p>{{ previewArticleData()?.abstract }}</p>
                </div>
              }
              <div class="prose max-w-none">
                <div [innerHTML]="previewArticleData()?.content"></div>
              </div>
            </div>
          }
        </p-dialog>
      }
    </div>
  `,
  styles: [
    `
      .article-title {
        .title-text {
          font-weight: 500;
          display: block;
          margin-bottom: 0.25rem;
        }

        .sub-title {
          font-size: 0.875rem;
        }

        .abstract {
          font-size: 0.75rem;
          line-height: 1.2;
        }
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }
    `
  ]
})
export class PostsPage implements OnInit {
  articles: WritableSignal<Article[]> = signal<Article[]>([])
  loading = signal(false)
  title = signal('')
  abstract = signal('')
  selectedStatus = signal<number | null>(null)
  selectedCategory = signal<number | null>(null)
  selectedArticle = signal<Article | null>(null)
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)
  categories = signal<Category[]>([])
  isDetailVisible = signal(false)
  previewVisible = signal(false)
  previewArticleData = signal<Article | null>(null)
  attrsOptions = signal<{ label: string; value: string }[]>([])
  attrsCheckedMap: { [id: number]: string[] } = {}

  statusOptions = signal([
    { label: '全部状态', value: null },
    { label: '已发布', value: 10 },
    { label: '待发布', value: -10 },
    { label: '草稿箱', value: -20 },
    { label: '已删除', value: -100 }
  ])

  categoryOptions = signal<{ label: string; value: number | null }[]>([
    { label: '全部分类', value: null }
  ])

  get statusValue() {
    return this.selectedStatus()
  }
  set statusValue(val: number | null) {
    this.selectedStatus.set(val)
  }

  get categoryValue() {
    return this.selectedCategory()
  }
  set categoryValue(val: number | null) {
    this.selectedCategory.set(val)
  }

  private authService = inject(AuthService)

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadArticles()
    this.loadCategories()
    this.loadAttrs()
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadArticles()
  }

  loadArticlesLazy(event: any) {
    // Update pagination from table event
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadArticles()
  }

  loadArticles() {
    this.loading.set(true)

    // Build query parameters
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }

    // Add search filters
    if (this.title()) {
      params.title = this.title()
    }

    if (this.abstract()) {
      params.abstract = this.abstract()
    }

    if (this.selectedStatus() !== null) {
      params.status = this.selectedStatus()
    }

    if (this.selectedCategory() !== null) {
      params.type_id = this.selectedCategory()
    }

    // Call API to get articles
    this.httpService.get<ArticlesResponse>('/api/admin/articles', params).subscribe({
      next: (response) => {
        if (response.success === true && response.data) {
          this.articles.set(response.data.dataList)
          this.totalRecords.set(response.data.pagination.total)
          // Initialize checked attrs for each article
          response.data.dataList.forEach((article) => {
            this.attrsCheckedMap[article.id] = this.getArticleAttrsArray(article.attrs)
          })
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取文章列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading articles:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取文章列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  loadCategories() {
    this.httpService
      .get<CategoriesResponse>('/api/admin/categories/tree', { alias: 'POST_SYS_CAT' })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categories.set(response.data)
            // Flatten categories for dropdown
            const flattenedCategories = this.flattenCategories(response.data)
            this.categoryOptions.set([
              { label: '全部分类', value: null },
              ...flattenedCategories.map((category) => ({
                label: category.title,
                value: category.id
              }))
            ])
          }
        },
        error: (error) => {
          console.error('Error loading categories:', error)
        }
      })
  }

  flattenCategories(categories: Category[]): Category[] {
    const result: Category[] = []
    const flatten = (cats: Category[]) => {
      cats.forEach((cat) => {
        result.push(cat)
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children)
        }
      })
    }
    flatten(categories)
    return result
  }

  getStatusSeverity(status: number): string {
    switch (status) {
      case 10:
        return 'success'
      case -10:
        return 'warning'
      case -20:
        return 'info'
      case -100:
        return 'danger'
      default:
        return 'info'
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 10:
        return '已发布'
      case -10:
        return '待发布'
      case -20:
        return '草稿箱'
      case -100:
        return '已删除'
      default:
        return '未知'
    }
  }

  getReviewSeverity(isReview: number): string {
    return isReview === 10 ? 'warning' : 'success'
  }

  getReviewText(isReview: number): string {
    return isReview === 10 ? '需要审核' : '不需要审核'
  }

  openCreateDialog() {
    this.selectedArticle.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(article: Article) {
    // Get full article data for editing
    this.httpService.get<any>(`/api/admin/articles/${article.id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedArticle.set(response.data)
          this.isDetailVisible.set(true)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取文章详情失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to get article details:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '获取文章详情失败'
        })
      }
    })
  }

  onArticleSaved(articleData: Article) {
    if (articleData.id) {
      // Update article
      this.httpService.put<any>(`/api/admin/articles/${articleData.id}`, articleData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '文章更新成功'
            })
            this.selectedArticle.set(null)
            this.isDetailVisible.set(false)
            this.loadArticles()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '更新文章失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to update article:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '更新文章失败'
          })
        }
      })
    } else {
      // Create article
      this.httpService.post<any>('/api/admin/articles', articleData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '文章创建成功'
            })
            this.selectedArticle.set(null)
            this.isDetailVisible.set(false)
            this.loadArticles()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '创建文章失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to create article:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '创建文章失败'
          })
        }
      })
    }
  }

  onArticleCancelled() {
    this.selectedArticle.set(null)
    this.isDetailVisible.set(false)
  }

  previewArticle(article: Article) {
    this.previewArticleData.set(article)
    this.previewVisible.set(true)
  }

  confirmDelete(article: Article) {
    this.confirmationService.confirm({
      message: `确定要删除文章 "${article.title}" 吗？此操作不可恢复。`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteArticle(article.id)
      }
    })
  }

  deleteArticle(id: number) {
    this.httpService.delete<any>(`/api/admin/articles/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '文章删除成功'
          })
          this.loadArticles()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除文章失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete article:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '删除文章失败'
        })
      }
    })
  }

  resetFilters() {
    this.title.set('')
    this.abstract.set('')
    this.selectedStatus.set(null)
    this.selectedCategory.set(null)
    this.currentPage.set(1)
    this.loadArticles()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadArticles()
  }

  // Load attribute options from attrs table
  loadAttrs() {
    this.httpService.get<any>('/api/admin/attrs', { page: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        if (res.success && res.data?.dataList) {
          this.attrsOptions.set(
            res.data.dataList.map((item: any) => ({
              label: item.title,
              value: item.alias
            }))
          )
        }
      }
    })
  }

  // Convert attrs string to array
  getArticleAttrsArray(attrs: string | undefined): string[] {
    return attrs
      ? attrs
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  }

  // Handle attribute checkbox change
  onAttrsChange(article: Article, checkedList: string[]) {
    const newAttrs = checkedList.join(',')
    this.httpService.put<any>(`/api/admin/articles/${article.id}`, { attrs: newAttrs }).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: '属性更新成功'
          })
          article.attrs = newAttrs
          this.attrsCheckedMap[article.id] = checkedList
        }
      }
    })
  }
}
