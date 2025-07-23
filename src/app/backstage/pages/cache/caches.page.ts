import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { TabViewModule } from 'primeng/tabview'
import { MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { CacheDetailComponent } from './cache-detail.component'

interface CacheStats {
  memory: { size: number; keys: string[] }
  database: { total: number; active: number; expired: number }
}

interface DbCache {
  id: number
  hash: string
  cache_data: string
  status: number
  create_time: number
  update_time: number
  is_delete: number
}

interface MemoryCacheItem {
  hash: string
  url: string
  expires: number
}

@Component({
  selector: 'cs-cache-page',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    TabViewModule,
    CacheDetailComponent
  ],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <p-toast></p-toast>
      <p-tabView>
        <p-tabPanel header="内存缓存">
          <div class="tab-actions">
            <p-button
              label="刷新统计"
              icon="pi pi-refresh"
              (click)="loadStats()"
              class="mr-2"
            ></p-button>
            <p-button
              label="清理内存缓存"
              icon="pi pi-trash"
              (click)="clearMemoryCache()"
            ></p-button>
          </div>
          <div class="stats">
            <pre>{{ stats() | json }}</pre>
          </div>
          <p-table
            [value]="memoryCacheList()"
            [paginator]="true"
            [rows]="20"
            [totalRecords]="memoryCacheList().length"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>URL</th>
                <th>Hash</th>
                <th>过期时间</th>
                <th>操作</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>{{ item.url }}</td>
                <td>{{ item.hash }}</td>
                <td>{{ item.expires | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
                <td>
                  <p-button
                    label="详情"
                    icon="pi pi-eye"
                    (click)="openDetail(item.hash)"
                    class="mr-2"
                  ></p-button>
                  <p-button
                    label="删除"
                    icon="pi pi-trash"
                    severity="danger"
                    (click)="deleteCache(item.hash)"
                  ></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-tabPanel>
        <p-tabPanel header="数据库缓存">
          <div class="tab-actions">
            <p-button
              label="清理过期DB缓存"
              icon="pi pi-database"
              (click)="clearExpiredDbCache()"
            ></p-button>
          </div>
          <p-table
            [value]="dbCaches()"
            [paginator]="true"
            [rows]="dbPageSize()"
            [totalRecords]="dbTotal()"
            [loading]="dbLoading()"
            (onPageChange)="onDbPageChange($event)"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>URL</th>
                <th>Hash</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-cache>
              <tr>
                <td>{{ cache.id }}</td>
                <td>{{ cache.url }}</td>
                <td>{{ cache.hash }}</td>
                <td>{{ cache.status }}</td>
                <td>{{ cache.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
                <td>
                  <p-button
                    label="详情"
                    icon="pi pi-eye"
                    (click)="openDbDetail(cache)"
                    class="mr-2"
                  ></p-button>
                  <p-button
                    label="删除"
                    icon="pi pi-trash"
                    severity="danger"
                    (click)="deleteDbCache(cache)"
                  ></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-tabPanel>
      </p-tabView>
      @if (isDetailVisible() && selectedKey()) {
        <cs-cache-detail [cacheKey]="selectedKey()!" (closed)="closeDetail()"></cs-cache-detail>
      }
      @if (isDbDetailVisible() && selectedDbCache()?.hash) {
        <cs-cache-detail
          [cacheKey]="selectedDbCache()?.hash!"
          (closed)="closeDbDetail()"
        ></cs-cache-detail>
      }
    </div>
  `
})
export class CachePage implements OnInit {
  stats: WritableSignal<CacheStats | null> = signal(null)
  memoryCacheList = signal<MemoryCacheItem[]>([])
  selectedKey = signal<string | null>(null)
  isDetailVisible = signal(false)

  dbCaches = signal<DbCache[]>([])
  dbPage = signal(1)
  dbPageSize = signal(20)
  dbTotal = signal(0)
  dbLoading = signal(false)
  selectedDbCache = signal<DbCache | null>(null)
  isDbDetailVisible = signal(false)

  private http = inject(HttpService)
  private message = inject(MessageService)

  ngOnInit() {
    this.loadStats()
    this.loadMemoryCacheList()
    this.loadDbCaches()
  }

  loadStats() {
    this.http.get<any>('/api/admin/page-cache/stats').subscribe({
      next: (res) => this.stats.set(res.data),
      error: () => this.message.add({ severity: 'error', summary: '错误', detail: '获取统计失败' })
    })
  }

  loadMemoryCacheList() {
    this.http.get<any>('/api/admin/page-cache/memory/list').subscribe({
      next: (res) => this.memoryCacheList.set(res.data.list),
      error: () =>
        this.message.add({ severity: 'error', summary: '错误', detail: '获取内存缓存列表失败' })
    })
  }

  clearMemoryCache() {
    this.http.delete('/api/admin/page-cache/memory').subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: '成功', detail: '已清理内存缓存' })
        this.loadMemoryCacheList()
      }
    })
  }

  deleteCache(hash: string) {
    this.http.delete(`/api/admin/page-cache/${hash}`).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: '成功', detail: '缓存已删除' })
        this.loadMemoryCacheList()
        this.loadStats()
      }
    })
  }

  openDetail(hash: string) {
    this.selectedKey.set(hash)
    this.isDetailVisible.set(true)
  }

  closeDetail() {
    this.isDetailVisible.set(false)
    this.selectedKey.set(null)
  }

  // 数据库缓存相关
  loadDbCaches() {
    this.dbLoading.set(true)
    this.http
      .get<any>('/api/admin/caches', { page: this.dbPage(), pageSize: this.dbPageSize() })
      .subscribe({
        next: (res) => {
          this.dbCaches.set(res.data.dataList)
          this.dbTotal.set(res.data.pagination.total)
          this.dbLoading.set(false)
        },
        error: () => {
          this.dbLoading.set(false)
          this.message.add({ severity: 'error', summary: '错误', detail: '获取数据库缓存失败' })
        }
      })
  }

  onDbPageChange(event: any) {
    this.dbPage.set(event.page + 1)
    this.dbPageSize.set(event.rows)
    this.loadDbCaches()
  }

  openDbDetail(cache: DbCache) {
    this.selectedDbCache.set(cache)
    this.isDbDetailVisible.set(true)
  }

  closeDbDetail() {
    this.isDbDetailVisible.set(false)
    this.selectedDbCache.set(null)
  }

  deleteDbCache(cache: DbCache) {
    this.http.delete(`/api/admin/page-cache/${cache.hash}`).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: '成功', detail: '数据库缓存已删除' })
        this.loadDbCaches()
        this.loadStats()
      }
    })
  }

  clearExpiredDbCache() {
    this.http.post('/api/admin/page-cache/database/cleanup', {}).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: '成功', detail: '已清理过期DB缓存' })
        this.loadDbCaches()
        this.loadStats()
      }
    })
  }
}
