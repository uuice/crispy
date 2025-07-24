import { Component, OnInit, signal, WritableSignal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { TextareaModule } from 'primeng/textarea'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { AuthService } from '../../services/auth.service'
import { JobDetailComponent } from './job-detail.component'

interface Job {
  id: number
  title: string
  content: string
  address?: string
  branch?: string
  email?: string
  nature?: string
  num: number
  typeName?: string
  sort?: number
  create_time: number
  update_time: number
  is_delete: number
}

interface JobsResponse {
  success: boolean
  message: string
  data: {
    dataList: Job[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

@Component({
  selector: 'cs-recruitment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    TextareaModule,
    JobDetailComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>招聘信息管理</h1>
        <p-button label="新增招聘" icon="pi pi-plus" (click)="openCreateDialog()"></p-button>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        [value]="jobs()"
        [lazy]="true"
        [paginator]="true"
        [rows]="20"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条招聘信息"
        [rowsPerPageOptions]="[10, 20, 25, 50]"
        [loading]="loading()"
        (onLazyLoad)="loadJobsLazy($event)"
        selectionMode="single"
        scrollable="true"
        (onPageChange)="onPageChange($event)"
      >
        <ng-template pTemplate="caption">
          <div class="search-bar">
            <div class="search-controls">
              <input pInputText type="text" [(ngModel)]="title" placeholder="职位名称" />
              <input pInputText type="text" [(ngModel)]="typeName" placeholder="职位类别" />
              <input pInputText type="text" [(ngModel)]="nature" placeholder="工作性质" />
              <input pInputText type="text" [(ngModel)]="branch" placeholder="所在部门" />
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
            <th style="min-width: 12rem;">职位名称</th>
            <th style="min-width: 8rem;">职位类别</th>
            <th style="min-width: 8rem;">工作性质</th>
            <th style="min-width: 8rem;">所在部门</th>
            <th style="min-width: 8rem;">招聘人数</th>
            <th style="min-width: 12rem;">工作地址</th>
            <th style="min-width: 14rem;">创建时间</th>
            <th style="min-width: 14rem;">更新时间</th>
            <th style="min-width: 8rem;" alignFrozen="right" pFrozenColumn [frozen]="true">操作</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-job>
          <tr>
            <td>{{ job.id }}</td>
            <td>
              <div class="job-title">
                <span class="title-text" [pTooltip]="job.title" tooltipPosition="top">
                  {{ job.title }}
                </span>
              </div>
            </td>
            <td>
              @if (job.typeName) {
                <span>{{ job.typeName }}</span>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>
              @if (job.nature) {
                <span>{{ job.nature }}</span>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>
              @if (job.branch) {
                <span>{{ job.branch }}</span>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>
              <span class="job-num">{{ job.num }} 人</span>
            </td>
            <td>
              @if (job.address) {
                <span class="job-address" [pTooltip]="job.address" tooltipPosition="top">
                  {{ job.address }}
                </span>
              } @else {
                <span class="text-gray-500">-</span>
              }
            </td>
            <td>{{ job.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td>{{ job.update_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
            <td alignFrozen="right" pFrozenColumn [frozen]="true">
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  pTooltip="编辑"
                  tooltipPosition="top"
                  (click)="openEditDialog(job)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  pTooltip="删除"
                  tooltipPosition="top"
                  (click)="confirmDelete(job)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="10" class="text-center">没有找到招聘信息。</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Job Detail Component -->
      @if (isDetailVisible()) {
        <cs-job-detail
          [job]="selectedJob()"
          [mode]="selectedJob() ? 'edit' : 'create'"
          (saved)="onJobSaved($event)"
          (cancelled)="onJobCancelled()"
        ></cs-job-detail>
      }
    </div>
  `,
  styles: [
    `
      .job-title {
        .title-text {
          font-weight: 500;
          display: block;
          margin-bottom: 0.25rem;
        }
      }

      .job-num {
        font-weight: 500;
        color: #2563eb;
      }

      .job-address {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    `
  ]
})
export class JobPage implements OnInit {
  jobs: WritableSignal<Job[]> = signal<Job[]>([])
  loading = signal(false)
  title = signal('')
  typeName = signal('')
  nature = signal('')
  branch = signal('')
  selectedJob = signal<Job | null>(null)
  currentPage = signal(1)
  pageSize = signal(20)
  totalRecords = signal(0)
  isDetailVisible = signal(false)

  private authService = inject(AuthService)

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadJobs()
  }

  onSearch() {
    this.currentPage.set(1)
    this.loadJobs()
  }

  loadJobsLazy(event: any) {
    this.currentPage.set(event.first / event.rows + 1)
    this.pageSize.set(event.rows)
    this.loadJobs()
  }

  loadJobs() {
    this.loading.set(true)

    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    }

    if (this.title()) {
      params.title = this.title()
    }

    if (this.typeName()) {
      params.typeName = this.typeName()
    }

    if (this.nature()) {
      params.nature = this.nature()
    }

    if (this.branch()) {
      params.branch = this.branch()
    }

    this.httpService.get<JobsResponse>('/api/admin/jobs', params).subscribe({
      next: (response) => {
        if (response.success === true && response.data) {
          this.jobs.set(response.data.dataList)
          this.totalRecords.set(response.data.pagination.total)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取招聘信息列表失败'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        console.error('Error loading jobs:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取招聘信息列表失败'
        })
        this.loading.set(false)
      }
    })
  }

  openCreateDialog() {
    this.selectedJob.set(null)
    this.isDetailVisible.set(true)
  }

  openEditDialog(job: Job) {
    this.httpService.get<any>(`/api/admin/jobs/${job.id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedJob.set(response.data)
          this.isDetailVisible.set(true)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '获取招聘信息详情失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to get job details:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '获取招聘信息详情失败'
        })
      }
    })
  }

  onJobSaved(jobData: Job) {
    if (jobData.id) {
      this.httpService.put<any>(`/api/admin/jobs/${jobData.id}`, jobData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '招聘信息更新成功'
            })
            this.selectedJob.set(null)
            this.isDetailVisible.set(false)
            this.loadJobs()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '更新招聘信息失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to update job:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '更新招聘信息失败'
          })
        }
      })
    } else {
      this.httpService.post<any>('/api/admin/jobs', jobData).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '招聘信息创建成功'
            })
            this.selectedJob.set(null)
            this.isDetailVisible.set(false)
            this.loadJobs()
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '创建招聘信息失败'
            })
          }
        },
        error: (error) => {
          console.error('Failed to create job:', error)
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: error.error.message || '创建招聘信息失败'
          })
        }
      })
    }
  }

  onJobCancelled() {
    this.selectedJob.set(null)
    this.isDetailVisible.set(false)
  }

  confirmDelete(job: Job) {
    this.confirmationService.confirm({
      message: `确定要删除招聘信息 "${job.title}" 吗？此操作不可恢复。`,
      header: '删除确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteJob(job.id)
      }
    })
  }

  deleteJob(id: number) {
    this.httpService.delete<any>(`/api/admin/jobs/${id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '成功',
            detail: '招聘信息删除成功'
          })
          this.loadJobs()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: response.message || '删除招聘信息失败'
          })
        }
      },
      error: (error) => {
        console.error('Failed to delete job:', error)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: error.error.message || '删除招聘信息失败'
        })
      }
    })
  }

  resetFilters() {
    this.title.set('')
    this.typeName.set('')
    this.nature.set('')
    this.branch.set('')
    this.currentPage.set(1)
    this.loadJobs()
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1)
    this.pageSize.set(event.rows)
    this.loadJobs()
  }
}
