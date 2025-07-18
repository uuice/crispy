import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { TableModule } from 'primeng/table'
import { ToastModule } from 'primeng/toast'
import { AccordionModule } from 'primeng/accordion'
import { MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'

interface SystemInfo {
  label: string
  value: string
}

interface Dependency {
  name: string
  version: string
}

@Component({
  selector: 'cs-system',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, AccordionModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="p-4">
      <div class="grid gap-4">
        <!-- 系统信息卡片 -->
        <div class="col-12">
          <p-card header="项目信息" styleClass="system-card">
            <p-table [value]="systemInfo()" styleClass="p-datatable-sm p-datatable-gridlines">
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td style="width: 240px; font-weight: 500; color: var(--text-color-secondary);">
                    {{ row.label }}
                  </td>
                  <td>{{ row.value }}</td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
        <!-- 依赖信息卡片 -->
        <div class="col-12">
          <p-card header="生产环境依赖" styleClass="system-card">
            <p-table
              [value]="prodDependencies()"
              responsiveLayout="scroll"
              styleClass="p-datatable-sm p-datatable-gridlines"
            >
              <ng-template pTemplate="body" let-row let-i="rowIndex">
                <tr>
                  <td style="width: 240px; font-weight: 500; color: var(--text-color-secondary);">
                    {{ row.name }}
                  </td>
                  <td>{{ row.version }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="header">
                <tr>
                  <th>依赖名</th>
                  <th>版本</th>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
        <div class="col-12">
          <p-card header="开发环境依赖" styleClass="system-card">
            <p-table
              [value]="devDependencies()"
              responsiveLayout="scroll"
              styleClass="p-datatable-sm p-datatable-gridlines"
            >
              <ng-template pTemplate="body" let-row let-i="rowIndex">
                <tr>
                  <td style="width: 240px; font-weight: 500; color: var(--text-color-secondary);">
                    {{ row.name }}
                  </td>
                  <td>{{ row.version }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="header">
                <tr>
                  <th>依赖名</th>
                  <th>版本</th>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .system-card {
        border-radius: 12px;
        box-shadow: var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.06));
        background: var(--surface-card);
      }
      :host ::ng-deep .p-card-header {
        font-size: 1.1rem;
        font-weight: 600;
      }
      @media (max-width: 768px) {
        .system-card {
          padding: 0;
        }
      }
    `
  ]
})
export class SystemPage implements OnInit {
  systemInfo = signal<[]>([])
  prodDependencies = signal<Dependency[]>([])
  devDependencies = signal<Dependency[]>([])
  loading = signal(false)

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSystemInfo()
  }

  loadSystemInfo() {
    this.loading.set(true)
    this.httpService.get<any>('/api/admin/system/getSystemInfo').subscribe({
      next: (res) => {
        if (res.success) {
          this.systemInfo.set(res.data.systemInfo || [])
          this.prodDependencies.set(res.data.prodDependencies || [])
          this.devDependencies.set(res.data.devDependencies || [])
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: res.message || '获取系统信息失败'
          })
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: err?.message || '请求失败'
        })
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }
}
