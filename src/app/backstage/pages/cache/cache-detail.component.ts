import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { HttpService } from '../../services/http.service'

export type CacheDetailType = 'memory' | 'database'

@Component({
  selector: 'cs-cache-detail',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="true"
      [modal]="true"
      [header]="'缓存详情: ' + cacheKey + (type === 'memory' ? ' (内存)' : ' (数据库)')"
      (onHide)="closed.emit()"
    >
      @if (cacheInfo() && !('error' in cacheInfo())) {
        <pre>{{ cacheInfo() | json }}</pre>
      }
      @if (cacheInfo() && 'error' in cacheInfo()) {
        <div style="color:red">{{ cacheInfo().error }}</div>
      }
      <ng-template pTemplate="footer">
        <p-button label="关闭" icon="pi pi-times" (click)="closed.emit()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class CacheDetailComponent implements OnInit {
  @Input() cacheKey!: string
  @Input() type: CacheDetailType = 'memory'
  @Output() closed = new EventEmitter<void>()
  cacheInfo = signal<any>(null)

  private http = inject(HttpService)

  ngOnInit() {
    if (this.cacheKey) {
      const url =
        this.type === 'memory'
          ? `/api/admin/page-cache/memory/${this.cacheKey}`
          : `/api/admin/page-cache/database/${this.cacheKey}`
      this.http.get<any>(url).subscribe({
        // delete html field
        next: (res) => {
          const data = res.data
          delete data.html
          delete data.cache_data
          this.cacheInfo.set(data)
        },
        error: () => this.cacheInfo.set({ error: '获取详情失败' })
      })
    }
  }
}
