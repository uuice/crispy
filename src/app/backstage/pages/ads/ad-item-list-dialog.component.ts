import {
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { AdItemEntity } from '@src/types'

@Component({
  selector: 'cs-ad-item-list-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TableModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <p-dialog
      header="广告项列表"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '90vw', maxWidth: '1200px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onClose()"
    >
      <div class="dialog-content">
        <p-table
          [value]="adItems()"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 条广告项"
          [rowsPerPageOptions]="[10, 20, 50]"
          [loading]="loading()"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>标题</th>
              <th>内容</th>
              <th>图片</th>
              <th>链接</th>
              <th>打开方式</th>
              <th>排序</th>
              <th>状态</th>
              <th>创建时间</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.title || '-' }}</td>
              <td>
                <div class="content-cell">
                  {{ item.content || '-' }}
                </div>
              </td>
              <td>
                @if (item.image_url) {
                  <div class="image-container">
                    @for (image of getImageList(item.image_url); track image) {
                      <img
                        [src]="image"
                        alt="广告图片"
                        class="ad-image"
                        (click)="previewImage(image)"
                      />
                    }
                  </div>
                } @else {
                  <span>-</span>
                }
              </td>
              <td>
                @if (item.url) {
                  <a [href]="item.url" target="_blank" class="link-text">
                    {{ item.url }}
                  </a>
                } @else {
                  <span>-</span>
                }
              </td>
              <td>
                <p-tag
                  [severity]="getMethodSeverity(item.method)"
                  [value]="getMethodText(item.method)"
                ></p-tag>
              </td>
              <td>{{ item.sort }}</td>
              <td>
                <p-tag
                  [severity]="getStatusSeverity(item.status)"
                  [value]="getStatusText(item.status)"
                ></p-tag>
              </td>
              <td>
                {{ item.create_time ? (item.create_time * 1000 | date: 'yyyy-MM-dd HH:mm') : '-' }}
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center">暂无广告项数据</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end">
          <p-button
            label="关闭"
            icon="pi pi-times"
            (click)="onClose()"
            styleClass="p-button-text"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>

    <!-- Image preview dialog -->
    <p-dialog
      header="图片预览"
      [visible]="imagePreviewVisible()"
      (visibleChange)="imagePreviewVisible.set($event)"
      [modal]="true"
      [style]="{ width: 'auto', maxWidth: '80vw' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="image-preview-container">
        <img [src]="previewImageUrl()" alt="预览图片" class="preview-image" />
      </div>
      <ng-template pTemplate="footer">
        <div class="flex justify-content-end">
          <p-button
            label="关闭"
            icon="pi pi-times"
            (click)="imagePreviewVisible.set(false)"
            styleClass="p-button-text"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .dialog-content {
        max-height: 70vh;
        overflow-y: auto;
      }

      .content-cell {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .image-container {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .ad-image {
        width: 40px;
        height: 30px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid #ddd;
      }

      .ad-image:hover {
        opacity: 0.8;
      }

      .link-text {
        color: #007bff;
        text-decoration: none;
        max-width: 150px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .link-text:hover {
        text-decoration: underline;
      }

      .image-preview-container {
        text-align: center;
      }

      .preview-image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
      }
    `
  ]
})
export class AdItemListDialogComponent implements OnInit, OnChanges {
  @Input() adId: number = 0
  @Input() visible: boolean = false

  adItems: WritableSignal<AdItemEntity[]> = signal<AdItemEntity[]>([])
  loading = signal(false)
  imagePreviewVisible = signal(false)
  previewImageUrl = signal('')

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.adId && this.visible) {
      this.loadAdItems()
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.adId && this.visible) {
      this.loadAdItems()
    }
  }

  loadAdItems() {
    this.loading.set(true)
    this.httpService.get<any>('/api/admin/ad-items', { ad_id: this.adId }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.adItems.set(res.data.dataList || [])
        } else {
          this.adItems.set([])
          this.messageService.add({
            severity: 'warn',
            summary: '提示',
            detail: res.message || '暂无广告项数据'
          })
        }
        this.loading.set(false)
      },
      error: (error) => {
        this.adItems.set([])
        this.loading.set(false)
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '获取广告项列表失败，请稍后重试'
        })
        console.error('Failed to load ad items:', error)
      }
    })
  }

  onClose() {
    this.visible = false
    this.adItems.set([])
  }

  getImageList(imageUrl: string): string[] {
    if (!imageUrl) return []
    return imageUrl
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url)
  }

  previewImage(imageUrl: string) {
    this.previewImageUrl.set(imageUrl)
    this.imagePreviewVisible.set(true)
  }

  getMethodSeverity(method: string) {
    switch (method) {
      case '1':
        return 'info' // Article detail
      case '5':
        return 'warn' // External link
      default:
        return 'secondary'
    }
  }

  getMethodText(method: string): string {
    switch (method) {
      case '1':
        return '文章详情'
      case '5':
        return '外链'
      default:
        return '未知'
    }
  }

  getStatusSeverity(status: number) {
    return status === 10 ? 'success' : 'danger'
  }

  getStatusText(status: number): string {
    return status === 10 ? '启用' : '禁用'
  }
}
