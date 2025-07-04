import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { TimelineModule } from 'primeng/timeline'
import { DividerModule } from 'primeng/divider'
import { PanelModule } from 'primeng/panel'
import { AccordionModule } from 'primeng/accordion'
import { BadgeModule } from 'primeng/badge'

interface ArchivePost {
  id: string
  title: string
  date: string
  category: string
  excerpt?: string
  readTime?: number
}

@Component({
  selector: 'cs-archives',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    TimelineModule,
    DividerModule,
    PanelModule,
    AccordionModule,
    BadgeModule
  ],
  template: `
    <div class="archives-page">
      <!-- Header Section -->
      <div class="page-header">
        <h1>
          <i class="pi pi-calendar"></i>
          文章归档
        </h1>
        <p>按时间顺序浏览所有文章</p>
        <div class="archive-stats">
          <p-badge [value]="getTotalPosts().toString()" severity="info" size="large"> </p-badge>
          <span class="stats-label">总文章数</span>
        </div>
      </div>

      <!-- Timeline View -->
      <section class="timeline-section">
        <p-panel header="时间线视图" [toggleable]="true" [collapsed]="false">
          <ng-template pTemplate="icons">
            <i class="pi pi-clock"></i>
          </ng-template>

          <p-timeline [value]="timelineData" align="alternate" styleClass="custom-timeline">
            <ng-template pTemplate="marker" let-event>
              <span class="timeline-marker" [style.backgroundColor]="event.color">
                <i [class]="event.icon"></i>
              </span>
            </ng-template>

            <ng-template pTemplate="content" let-event>
              <p-card class="timeline-card">
                <ng-template pTemplate="header">
                  <div class="timeline-header">
                    <h3>{{ event.period }}</h3>
                    <p-badge [value]="event.count.toString()" severity="success"> </p-badge>
                  </div>
                </ng-template>

                <div class="posts-preview">
                  <div *ngFor="let post of event.posts.slice(0, 3)" class="post-preview">
                    <div class="post-info">
                      <h4 [routerLink]="['/post', post.id]" class="post-title">
                        {{ post.title }}
                      </h4>
                      <p class="post-excerpt" *ngIf="post.excerpt">
                        {{ post.excerpt }}
                      </p>
                      <div class="post-meta">
                        <span class="post-date">
                          <i class="pi pi-calendar"></i>
                          {{ post.date }}
                        </span>
                        <p-tag
                          [value]="post.category"
                          [severity]="getCategorySeverity(post.category)"
                        >
                        </p-tag>
                        <span class="read-time" *ngIf="post.readTime">
                          <i class="pi pi-clock"></i>
                          {{ post.readTime }} 分钟阅读
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="view-all" *ngIf="event.posts.length > 3">
                    <p-button
                      [label]="'查看全部 ' + event.count + ' 篇文章'"
                      icon="pi pi-arrow-right"
                      [text]="true"
                      size="small"
                      (click)="expandPeriod(event.period)"
                    >
                    </p-button>
                  </div>
                </div>
              </p-card>
            </ng-template>
          </p-timeline>
        </p-panel>
      </section>

      <p-divider></p-divider>

      <!-- Accordion View -->
      <section class="accordion-section">
        <p-panel header="按年份浏览" [toggleable]="true" [collapsed]="true">
          <ng-template pTemplate="icons">
            <i class="pi pi-list"></i>
          </ng-template>

          <p-accordion [multiple]="true">
            <p-accordionTab
              *ngFor="let year of archivesByYear"
              [header]="year.year + ' (' + year.totalPosts + ' 篇文章)'"
            >
              <div class="year-content">
                <div *ngFor="let month of year.months" class="month-section">
                  <div class="month-header">
                    <h4>{{ month.month }}</h4>
                    <p-badge [value]="month.posts.length.toString()" severity="info"> </p-badge>
                  </div>

                  <div class="posts-grid">
                    <p-card *ngFor="let post of month.posts" class="post-card">
                      <div class="post-content">
                        <h5 [routerLink]="['/post', post.id]" class="post-title">
                          {{ post.title }}
                        </h5>
                        <p class="post-excerpt" *ngIf="post.excerpt">
                          {{ post.excerpt }}
                        </p>
                        <div class="post-footer">
                          <div class="post-meta">
                            <span class="post-date">{{ post.date }}</span>
                            <p-tag
                              [value]="post.category"
                              [severity]="getCategorySeverity(post.category)"
                              size="small"
                            >
                            </p-tag>
                          </div>
                          <p-button
                            icon="pi pi-arrow-right"
                            [text]="true"
                            size="small"
                            [routerLink]="['/post', post.id]"
                          >
                          </p-button>
                        </div>
                      </div>
                    </p-card>
                  </div>
                </div>
              </div>
            </p-accordionTab>
          </p-accordion>
        </p-panel>
      </section>

      <!-- Quick Stats -->
      <section class="stats-section">
        <div class="stats-grid">
          <p-card class="stat-card">
            <div class="stat-content">
              <i class="pi pi-file stat-icon"></i>
              <div class="stat-info">
                <span class="stat-number">{{ getTotalPosts() }}</span>
                <span class="stat-label">总文章数</span>
              </div>
            </div>
          </p-card>

          <p-card class="stat-card">
            <div class="stat-content">
              <i class="pi pi-tags stat-icon"></i>
              <div class="stat-info">
                <span class="stat-number">{{ getUniqueCategories().length }}</span>
                <span class="stat-label">分类数</span>
              </div>
            </div>
          </p-card>

          <p-card class="stat-card">
            <div class="stat-content">
              <i class="pi pi-calendar stat-icon"></i>
              <div class="stat-info">
                <span class="stat-number">{{ archivesByYear.length }}</span>
                <span class="stat-label">活跃年份</span>
              </div>
            </div>
          </p-card>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .archives-page {
        .page-header {
          text-align: center;
          margin-bottom: 3rem;

          h1 {
            font-size: 3rem;
            font-weight: 700;
            color: var(--p-text-color);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;

            i {
              color: var(--p-primary-color);
            }
          }

          p {
            font-size: 1.2rem;
            color: var(--p-text-color-secondary);
            margin-bottom: 1.5rem;
          }

          .archive-stats {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;

            .stats-label {
              color: var(--p-text-color-secondary);
              font-weight: 500;
            }
          }
        }

        .timeline-section,
        .accordion-section {
          margin-bottom: 3rem;

          ::ng-deep .custom-timeline {
            .p-timeline-event-content {
              .timeline-card {
                margin-top: 1rem;
              }
            }

            .timeline-marker {
              display: flex;
              width: 2.5rem;
              height: 2.5rem;
              align-items: center;
              justify-content: center;
              color: white;
              border-radius: 50%;
              z-index: 1;

              i {
                font-size: 1rem;
              }
            }
          }

          .timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;

            h3 {
              margin: 0;
              color: var(--p-text-color);
              font-size: 1.5rem;
            }
          }

          .posts-preview {
            padding: 1rem;

            .post-preview {
              padding: 1rem 0;
              border-bottom: 1px solid var(--p-surface-border);

              &:last-child {
                border-bottom: none;
              }

              .post-title {
                color: var(--p-text-color);
                text-decoration: none;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                cursor: pointer;
                display: block;

                &:hover {
                  color: var(--p-primary-color);
                }
              }

              .post-excerpt {
                color: var(--p-text-color-secondary);
                line-height: 1.5;
                margin-bottom: 0.75rem;
                font-size: 0.95rem;
              }

              .post-meta {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;

                .post-date,
                .read-time {
                  display: flex;
                  align-items: center;
                  gap: 0.25rem;
                  font-size: 0.9rem;
                  color: var(--p-text-color-secondary);
                }
              }
            }

            .view-all {
              text-align: center;
              margin-top: 1rem;
              padding-top: 1rem;
              border-top: 1px solid var(--p-surface-border);
            }
          }
        }

        .year-content {
          .month-section {
            margin-bottom: 2rem;

            .month-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid var(--p-surface-border);

              h4 {
                margin: 0;
                color: var(--p-text-color);
                font-size: 1.2rem;
              }
            }

            .posts-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1rem;

              .post-card {
                transition: transform 0.3s ease;

                &:hover {
                  transform: translateY(-2px);
                }

                .post-content {
                  padding: 1rem;

                  .post-title {
                    color: var(--p-text-color);
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    display: block;

                    &:hover {
                      color: var(--p-primary-color);
                    }
                  }

                  .post-excerpt {
                    color: var(--p-text-color-secondary);
                    line-height: 1.5;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                  }

                  .post-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .post-meta {
                      display: flex;
                      align-items: center;
                      gap: 0.75rem;

                      .post-date {
                        font-size: 0.85rem;
                        color: var(--p-text-color-secondary);
                      }
                    }
                  }
                }
              }
            }
          }
        }

        .stats-section {
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;

            .stat-card {
              transition: transform 0.3s ease;

              &:hover {
                transform: translateY(-4px);
              }

              .stat-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;

                .stat-icon {
                  font-size: 2.5rem;
                  color: var(--p-primary-color);
                }

                .stat-info {
                  .stat-number {
                    display: block;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--p-text-color);
                  }

                  .stat-label {
                    font-size: 0.9rem;
                    color: var(--p-text-color-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                  }
                }
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .archives-page {
          .page-header h1 {
            font-size: 2.5rem;
          }

          .posts-grid {
            grid-template-columns: 1fr !important;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .post-meta {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
        }
      }
    `
  ]
})
export class ArchivesPage {
  // Sample data - In a real application, this would come from a service
  allPosts: ArchivePost[] = [
    {
      id: '1',
      title: 'Angular SSR 入门指南',
      date: 'Mar 15, 2024',
      category: 'Angular',
      excerpt: '学习如何在 Angular 应用程序中实现服务器端渲染，以获得更好的 SEO 和性能。',
      readTime: 8
    },
    {
      id: '2',
      title: '构建现代 Web 应用程序',
      date: 'Mar 10, 2024',
      category: 'Web 开发',
      excerpt: '探索现代 Web 开发的最新趋势和最佳实践。',
      readTime: 12
    },
    {
      id: '3',
      title: 'TypeScript 最佳实践',
      date: 'Feb 28, 2024',
      category: 'TypeScript',
      excerpt: '掌握这些重要的 TypeScript 最佳实践和高级技术。',
      readTime: 10
    },
    {
      id: '4',
      title: 'Node.js 性能优化技巧',
      date: 'Dec 20, 2023',
      category: 'Node.js',
      excerpt: '使用这些经过验证的性能技术优化您的 Node.js 应用程序。',
      readTime: 15
    },
    {
      id: '5',
      title: 'PrimeNG 组件库指南',
      date: 'Feb 15, 2024',
      category: 'Angular',
      excerpt: '使用 PrimeNG 组件构建美丽 UI 的完整指南。',
      readTime: 20
    },
    {
      id: '6',
      title: 'JavaScript ES2024 新特性',
      date: 'Jan 30, 2024',
      category: 'JavaScript',
      excerpt: '发现最新的 JavaScript 特性以及如何在项目中使用它们。',
      readTime: 7
    }
  ]

  timelineData = [
    {
      period: 'March 2024',
      count: 2,
      icon: 'pi pi-calendar',
      color: '#9C27B0',
      posts: this.allPosts.filter((p) => p.date.includes('Mar 2024'))
    },
    {
      period: 'February 2024',
      count: 2,
      icon: 'pi pi-calendar',
      color: '#673AB7',
      posts: this.allPosts.filter((p) => p.date.includes('Feb 2024'))
    },
    {
      period: 'January 2024',
      count: 1,
      icon: 'pi pi-calendar',
      color: '#FF9800',
      posts: this.allPosts.filter((p) => p.date.includes('Jan 2024'))
    },
    {
      period: 'December 2023',
      count: 1,
      icon: 'pi pi-calendar',
      color: '#607D8B',
      posts: this.allPosts.filter((p) => p.date.includes('Dec 2023'))
    }
  ]

  archivesByYear = [
    {
      year: '2024',
      totalPosts: 5,
      months: [
        {
          month: 'March',
          posts: this.allPosts.filter((p) => p.date.includes('Mar 2024'))
        },
        {
          month: 'February',
          posts: this.allPosts.filter((p) => p.date.includes('Feb 2024'))
        },
        {
          month: 'January',
          posts: this.allPosts.filter((p) => p.date.includes('Jan 2024'))
        }
      ]
    },
    {
      year: '2023',
      totalPosts: 1,
      months: [
        {
          month: 'December',
          posts: this.allPosts.filter((p) => p.date.includes('Dec 2023'))
        }
      ]
    }
  ]

  getTotalPosts(): number {
    return this.allPosts.length
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.allPosts.map((post) => post.category))]
  }

  getCategorySeverity(
    category: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    const severityMap: {
      [key: string]: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
    } = {
      Angular: 'danger',
      'Web 开发': 'info',
      TypeScript: 'success',
      'Node.js': 'warning',
      JavaScript: 'secondary'
    }
    return severityMap[category] || 'info'
  }

  expandPeriod(period: string): void {
    // In a real application, this would navigate to a detailed view
    console.log('Expanding period:', period)
  }
}
