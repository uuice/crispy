import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ChartModule } from 'primeng/chart'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { RippleModule } from 'primeng/ripple'

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
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    RippleModule
  ],
  template: `
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <p-card *ngFor="let stat of stats" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" [style.background-color]="stat.color">
              <i [class]="stat.icon"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stat.title }}</h3>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-change" *ngIf="stat.change" [class.positive]="stat.change > 0" [class.negative]="stat.change < 0">
                {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <p-card header="Visitors" class="chart-card">
          <p-chart type="line" [data]="visitorsData" [options]="chartOptions"></p-chart>
        </p-card>
        <p-card header="Posts by Category" class="chart-card">
          <p-chart type="pie" [data]="categoryData" [options]="pieOptions"></p-chart>
        </p-card>
      </div>

      <!-- Recent Posts -->
      <p-card header="Recent Posts" class="recent-posts">
        <p-table [value]="recentPosts" [rows]="5" [showCurrentPageReport]="true" responsiveLayout="scroll"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
          [rowsPerPageOptions]="[5,10,25]">
          <ng-template pTemplate="header">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-post>
            <tr>
              <td>{{ post.title }}</td>
              <td>{{ post.author }}</td>
              <td>{{ post.date }}</td>
              <td>
                <span class="status-badge" [class]="post.status.toLowerCase()">
                  {{ post.status }}
                </span>
              </td>
              <td>{{ post.views }}</td>
              <td>
                <div class="action-buttons">
                  <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"></button>
                  <button pButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger p-button-sm"></button>
                </div>
              </td>
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
        ::ng-deep .p-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,.05);
        }

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
          }

          .stat-info {
            flex: 1;

            h3 {
              margin: 0;
              font-size: 0.9rem;
              color: #6c757d;
              font-weight: 500;
            }

            .stat-value {
              font-size: 1.5rem;
              font-weight: 600;
              color: #212529;
              margin: 0.25rem 0;
            }

            .stat-change {
              font-size: 0.875rem;
              font-weight: 500;

              &.positive {
                color: #28a745;
              }

              &.negative {
                color: #dc3545;
              }
            }
          }
        }
      }

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1rem;
      }

      .chart-card {
        ::ng-deep .p-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,.05);
        }
      }

      .recent-posts {
        ::ng-deep .p-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,.05);
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;

          &.published {
            background: #e8f5e9;
            color: #2e7d32;
          }

          &.draft {
            background: #fff3e0;
            color: #ef6c00;
          }

          &.pending {
            background: #e3f2fd;
            color: #1976d2;
          }
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
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
  stats: StatCard[] = [
    {
      title: 'Total Posts',
      value: 156,
      icon: 'pi pi-file',
      color: '#4CAF50',
      change: 12
    },
    {
      title: 'Total Views',
      value: 24580,
      icon: 'pi pi-eye',
      color: '#2196F3',
      change: 8
    },
    {
      title: 'Total Comments',
      value: 892,
      icon: 'pi pi-comments',
      color: '#FF9800',
      change: -3
    },
    {
      title: 'Total Users',
      value: 45,
      icon: 'pi pi-users',
      color: '#9C27B0',
      change: 5
    }
  ]

  visitorsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Visitors',
        data: [1200, 1900, 1500, 2100, 1800, 2400],
        borderColor: '#2196F3',
        tension: 0.4,
        fill: false
      }
    ]
  }

  categoryData = {
    labels: ['Technology', 'Design', 'Business', 'Lifestyle'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']
      }
    ]
  }

  recentPosts: RecentPost[] = [
    {
      id: 1,
      title: 'Getting Started with Angular SSR',
      author: 'John Doe',
      date: '2024-03-15',
      status: 'Published',
      views: 1234
    },
    {
      id: 2,
      title: 'TypeScript Best Practices',
      author: 'Jane Smith',
      date: '2024-03-14',
      status: 'Draft',
      views: 0
    },
    {
      id: 3,
      title: 'Web Development Trends 2024',
      author: 'Mike Johnson',
      date: '2024-03-13',
      status: 'Pending',
      views: 856
    }
  ]

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

  constructor() {}

  ngOnInit() {}
}
