import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core'
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
      [header]="'缓存详情: ' + cacheKey"
      (onHide)="closed.emit()"
    >
      <pre>{{ cacheInfo() | json }}</pre>
      <ng-template pTemplate="footer">
        <p-button label="关闭" icon="pi pi-times" (click)="closed.emit()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class CacheDetailComponent implements OnInit {
  @Input() cacheKey!: string
  @Output() closed = new EventEmitter<void>()
  cacheInfo = signal<any>(null)

  private http = inject(HttpService)

  ngOnInit() {
    if (this.cacheKey) {
      this.http.get<any>(`/api/admin/page-cache/info/${this.cacheKey}`).subscribe({
        next: (res) => this.cacheInfo.set(res.data),
        error: () => this.cacheInfo.set({ error: '获取详情失败' })
      })
    }
  }
}
