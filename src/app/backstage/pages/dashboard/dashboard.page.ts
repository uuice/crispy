import { Component, OnInit, signal } from '@angular/core'

import { CardModule } from 'primeng/card'
import { ChartModule } from 'primeng/chart'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { RippleModule } from 'primeng/ripple'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { HttpService } from '../../services/http.service'
import { TagModule } from 'primeng/tag'

interface StatCard {
  title: string
  value: number
  icon: string
  color: string
  change?: number
}

interface RecentPost {
  id: number
  title: string
  author: string
  date: string
  status: string
  views: number
}

@Component({
  selector: 'cs-dashboard',
  standalone: true,
  imports: [
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid">
        @for (stat of stats(); track stat) {
          <p-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" [style.background-color]="stat.color">
                <i [class]="stat.icon"></i>
              </div>
              <div class="stat-info">
                <h3>{{ stat.title }}</h3>
                <div class="stat-value">{{ stat.value }}</div>
                @if (stat.change !== undefined) {
                  <div
                    class="stat-change"
                    [class.positive]="stat.change > 0"
                    [class.negative]="stat.change < 0"
                  >
                    {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
                  </div>
                }
              </div>
            </div>
          </p-card>
        }
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <p-card header="访问趋势" class="chart-card">
          <p-chart type="line" [data]="visitorsData()" [options]="chartOptions"></p-chart>
        </p-card>
        <p-card header="分类分布" class="chart-card">
          <p-chart type="pie" [data]="categoryData()" [options]="pieOptions"></p-chart>
        </p-card>
      </div>

      <!-- Recent Posts -->
      <p-card header="最新文章" class="recent-posts">
        <p-table
          [value]="recentPosts()"
          [rows]="5"
          [showCurrentPageReport]="true"
          responsiveLayout="scroll"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
          [rowsPerPageOptions]="[5, 10, 25]"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>标题</th>
              <th>作者</th>
              <th>日期</th>
              <th>状态</th>
              <th>浏览量</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-post>
            <tr>
              <td>{{ post.title }}</td>
              <td>{{ post.author }}</td>
              <td>{{ post.date }}</td>
              <td>
                <span class="status-badge">
                  <p-tag [value]="post.status"></p-tag>
                </span>
              </td>
              <td>{{ post.click || 0 }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [
    `
      .dashboard {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }
      .stat-card {
        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 1.5rem;
            background: var(--p-primary-color);
          }
          .stat-info {
            flex: 1;
            h3 {
              margin: 0;
              font-size: 0.9rem;
              color: var(--p-text-muted-color);
              font-weight: 500;
            }
            .stat-value {
              font-size: 1.5rem;
              font-weight: 600;
              color: var(--p-text-color);
              margin: 0.25rem 0;
            }
            .stat-change {
              font-size: 0.875rem;
              font-weight: 500;
            }
            .stat-change.positive {
              color: var(--p-success-color);
            }
            .stat-change.negative {
              color: var(--p-red-500);
            }
          }
        }
      }
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1rem;
      }

      .recent-posts {
        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          &.published {
            background: var(--p-success-color, #e8f5e9);
            color: var(--p-success-color, #2e7d32);
          }
          &.draft {
            background: #fff3e0;
            color: #f59e42;
          }
          &.pending {
            background: var(--p-primary-100, #e3f2fd);
            color: var(--p-primary-400, #1976d2);
          }
        }
      }
      @media (max-width: 768px) {
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardPage implements OnInit {
  stats = signal<StatCard[]>([])
  visitorsData = signal<any>({ labels: [], datasets: [] })
  categoryData = signal<any>({ labels: [], datasets: [] })
  recentPosts = signal<RecentPost[]>([])
  loading = signal(false)

  chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  pieOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadDashboardData()
  }

  loadDashboardData() {
    this.loading.set(true)
    this.httpService.get<any>('/api/admin/dashboard/overview').subscribe({
      next: (res) => {
        if (res.success) {
          // 统计卡片
          const statsRaw = res.data.stats || {}
          this.stats.set([
            {
              title: '文章总数',
              value: statsRaw.totalPosts || 0,
              icon: 'pi pi-file',
              color: 'var(--p-primary-color)',
              change: statsRaw.postsChange || 0
            },
            {
              title: '总浏览',
              value: statsRaw.totalViews || 0,
              icon: 'pi pi-eye',
              color: 'var(--p-primary-400)',
              change: statsRaw.viewsChange || 0
            },
            {
              title: '用户总数',
              value: statsRaw.totalUsers || 0,
              icon: 'pi pi-users',
              color: 'var(--p-primary-700)',
              change: statsRaw.usersChange || 0
            }
          ])
          // 访问趋势
          const trend = res.data.visitorsTrend || { labels: [], data: [] }
          this.visitorsData.set({
            labels: trend.labels,
            datasets: [
              {
                label: 'Visitors',
                data: trend.data,
                borderColor: 'var(--p-primary-400)',
                backgroundColor: 'rgba(16,185,129,0.08)',
                tension: 0.4,
                fill: true
              }
            ]
          })
          // 分类分布
          const cat = res.data.categoryDistribution || { labels: [], data: [] }
          this.categoryData.set({
            labels: cat.labels,
            datasets: [
              {
                data: cat.data,
                backgroundColor: [
                  '#34d399', // emerald-400
                  '#059669', // emerald-600
                  '#f59e42', // amber-400
                  '#fbbf24', // amber-300
                  '#60a5fa', // blue-400
                  '#ef4444', // red-500
                  '#a5b4fc', // indigo-300
                  '#6366f1' // indigo-500
                ]
              }
            ]
          })
          // 最新文章
          this.recentPosts.set(res.data.recentPosts || [])
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: res.message || '获取仪表盘数据失败'
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
