import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'cs-cache-detail',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="true"
      [modal]="true"
      [header]="'缓存详情: ' + cacheKey + ' (数据库)'"
      (onHide)="closed.emit()"
    >
      @if (cacheInfo() && !('error' in cacheInfo()!)) {
        <pre>{{ cacheInfo() | json }}</pre>
      }
      @if (cacheInfo() && 'error' in cacheInfo()!) {
        <div style="color:red">{{ cacheInfo()!['error'] }}</div>
      }
      <ng-template pTemplate="footer">
        <p-button label="关闭" icon="pi pi-times" (click)="closed.emit()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class CacheDetailComponent implements OnInit {
  @Input() cacheKey!: string
  @Output() closed = new EventEmitter<void>()
  cacheInfo = signal<Record<string, unknown> | null>(null)

  private http = inject(HttpService)

  ngOnInit() {
    if (this.cacheKey) {
      this.http.get<any>(`/api/admin/page-cache/database/${this.cacheKey}`).subscribe({
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
