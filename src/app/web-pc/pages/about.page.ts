import { Component, OnInit, signal } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TableModule } from 'primeng/table'
import { TabViewModule } from 'primeng/tabview'
import { HttpService } from '../services/http.service'

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CardModule, TableModule, TabViewModule],
  template: `
    <p-card header="系统信息" styleClass="system-card">
      <table class="min-w-full text-sm border-separate border-spacing-y-2">
        @for (info of systemInfo(); track info.label) {
          <tr class="hover:bg-[var(--p-surface-section)] transition">
            <td
              class="font-semibold w-40 px-2 py-1 rounded-l bg-[var(--p-surface-section)]"
              style="color: var(--p-text-muted-color)"
            >
              {{ info.label }}
            </td>
            <td class="px-2 py-1 rounded-r">{{ info.value }}</td>
          </tr>
        }
      </table>
    </p-card>
    <p-card header="项目依赖" styleClass="system-card">
      <p-tabView>
        <p-tabPanel header="生产依赖">
          <p-table
            [value]="prodDependencies()"
            responsiveLayout="scroll"
            styleClass="p-datatable-sm beautify-table"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Name</th>
                <th>Version</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.name }}</td>
                <td>{{ row.version }}</td>
              </tr>
            </ng-template>
          </p-table>
        </p-tabPanel>
        <p-tabPanel header="开发依赖">
          <p-table
            [value]="devDependencies()"
            responsiveLayout="scroll"
            styleClass="p-datatable-sm beautify-table"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Name</th>
                <th>Version</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.name }}</td>
                <td>{{ row.version }}</td>
              </tr>
            </ng-template>
          </p-table>
        </p-tabPanel>
      </p-tabView>
    </p-card>
    <p-card header="项目信息" styleClass="system-card">
      <div class="space-y-2 text-base">
        <div>
          <span class="font-semibold" style="color: var(--p-text-muted-color)">GitHub:</span>
          <a
            href="https://github.com/uuice/crispy"
            class="text-blue-600 underline hover:text-blue-800 transition"
            target="_blank"
            >https://github.com/uuice/crispy</a
          >
        </div>
        <div>
          <span class="font-semibold" style="color: var(--p-text-muted-color)">License:</span> MIT
        </div>
        <div>
          <span class="font-semibold" style="color: var(--p-text-muted-color)">Author:</span>
          UUICE
        </div>
        <div>
          <span class="font-semibold" style="color: var(--p-text-muted-color)">Contact:</span>
          admin&#64;uuice.com
        </div>
      </div>
    </p-card>
  `,
  styles: [
    `
      .system-card {
        flex: 1;
        background: var(--p-content-background) !important;
        color: var(--p-content-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
        border-radius: 10px;
        box-shadow: none;
        padding: 1.2rem 1.2rem 1rem 1.2rem;
        transition: border-color 0.2s;
      }
      .system-card:hover {
        border-color: var(--p-primary-color) !important;
      }
      .beautify-table th,
      .beautify-table td {
        padding: 0.5rem 1rem;
        font-size: 1.05rem;
        background: var(--p-content-background);
        border-bottom: 1px solid var(--p-content-border-color);
      }
      .beautify-table tr:hover {
        background: var(--p-primary-color) !important;
        color: #fff;
      }
      .bg-gradient-to-br {
        background: var(--p-content-background) !important;
      }
    `
  ]
})
export class AboutPage implements OnInit {
  systemInfo = signal<any[]>([])
  prodDependencies = signal<any[]>([])
  devDependencies = signal<any[]>([])
  constructor(private http: HttpService) {}
  ngOnInit() {
    this.http.get('/api/content/system/getSystemInfo').subscribe((res: any) => {
      this.systemInfo.set(res.data.systemInfo || [])
      this.prodDependencies.set(res.data.prodDependencies || [])
      this.devDependencies.set(res.data.devDependencies || [])
    })
  }
}
