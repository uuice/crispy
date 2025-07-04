import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { DataViewModule } from 'primeng/dataview'
import { BadgeModule } from 'primeng/badge'
import { DividerModule } from 'primeng/divider'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'

interface Category {
  id: string
  name: string
  count: number
  description: string
  color?: string
  icon?: string
  posts?: any[]
}

@Component({
  selector: 'cs-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    DataViewModule,
    BadgeModule,
    DividerModule,
    DropdownModule,
    InputTextModule,
    FormsModule
  ],
  template: `
    <div class="categories-page">
      <!-- Header Section -->
      <div class="page-header">
        <h1>
          <i class="pi pi-tags"></i>
          分类
        </h1>
        <p>探索按主题和话题组织的文章</p>
        <div class="header-stats">
          <p-badge [value]="categories.length.toString()" severity="info" size="large"> </p-badge>
          <span class="stats-label">总分类数</span>
        </div>
      </div>

      <!-- Filter and Sort Controls -->
      <div class="controls-section">
        <p-card class="controls-card">
          <div class="controls-content">
            <div class="search-control">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  type="text"
                  pInputText
                  placeholder="搜索分类..."
                  [(ngModel)]="searchTerm"
                  (input)="filterCategories()"
                />
              </span>
            </div>
            <div class="sort-control">
              <p-dropdown
                [options]="sortOptions"
                [(ngModel)]="selectedSort"
                optionLabel="label"
                optionValue="value"
                placeholder="排序方式"
                (onChange)="sortCategories()"
              >
              </p-dropdown>
            </div>
            <div class="view-control">
              <p-button
                icon="pi pi-th-large"
                [text]="true"
                [raised]="viewMode === 'grid'"
                (click)="setViewMode('grid')"
                pTooltip="网格视图"
              >
              </p-button>
              <p-button
                icon="pi pi-list"
                [text]="true"
                [raised]="viewMode === 'list'"
                (click)="setViewMode('list')"
                pTooltip="列表视图"
              >
              </p-button>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Categories DataView -->
      <div class="categories-section">
        <p-dataView
          [value]="filteredCategories"
          [layout]="viewMode"
          [paginator]="true"
          [rows]="12"
          [sortField]="selectedSort"
          [sortOrder]="1"
        >
          <ng-template pTemplate="header">
            <div class="dataview-header">
              <h2>浏览分类</h2>
              <span class="results-count"> 找到 {{ filteredCategories.length }} 个分类 </span>
            </div>
          </ng-template>

          <ng-template pTemplate="gridItem" let-category>
            <div class="category-grid-item">
              <p-card class="category-card" [routerLink]="['/category', category.id]">
                <ng-template pTemplate="header">
                  <div class="category-icon" [style.background-color]="category.color">
                    <i [class]="category.icon"></i>
                  </div>
                </ng-template>

                <div class="category-content">
                  <h3>{{ category.name }}</h3>
                  <p class="category-description">{{ category.description }}</p>

                  <div class="category-stats">
                    <p-badge [value]="category.count.toString()" severity="success"> </p-badge>
                    <span class="posts-label">
                      {{ category.count === 1 ? '篇文章' : '篇文章' }}
                    </span>
                  </div>

                  <div class="recent-posts" *ngIf="category.posts && category.posts.length > 0">
                    <h5>最新文章:</h5>
                    <ul>
                      <li *ngFor="let post of category.posts.slice(0, 3)">
                        <a [routerLink]="['/post', post.id]">{{ post.title }}</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <ng-template pTemplate="footer">
                  <div class="category-actions">
                    <p-button
                      label="查看文章"
                      icon="pi pi-arrow-right"
                      [text]="true"
                      size="small"
                      [routerLink]="['/category', category.id]"
                    >
                    </p-button>
                  </div>
                </ng-template>
              </p-card>
            </div>
          </ng-template>

          <ng-template pTemplate="listItem" let-category>
            <div class="category-list-item">
              <p-card class="category-list-card">
                <div class="list-content">
                  <div class="category-info">
                    <div class="category-icon-small" [style.background-color]="category.color">
                      <i [class]="category.icon"></i>
                    </div>
                    <div class="category-details">
                      <h3 [routerLink]="['/category', category.id]">{{ category.name }}</h3>
                      <p class="category-description">{{ category.description }}</p>
                      <div class="category-meta">
                        <p-tag [value]="category.count + ' 篇文章'" severity="info" size="small">
                        </p-tag>
                      </div>
                    </div>
                  </div>
                  <div class="category-actions">
                    <p-button
                      label="探索"
                      icon="pi pi-arrow-right"
                      [outlined]="true"
                      size="small"
                      [routerLink]="['/category', category.id]"
                    >
                    </p-button>
                  </div>
                </div>
              </p-card>
            </div>
          </ng-template>

          <ng-template pTemplate="empty">
            <div class="empty-state">
              <i class="pi pi-search empty-icon"></i>
              <h3>未找到分类</h3>
              <p>请尝试调整搜索条件</p>
            </div>
          </ng-template>
        </p-dataView>
      </div>

      <p-divider></p-divider>

      <!-- Popular Categories -->
      <section class="popular-section">
        <h2>
          <i class="pi pi-star"></i>
          最受欢迎的分类
        </h2>
        <div class="popular-grid">
          <p-card
            *ngFor="let category of getPopularCategories()"
            class="popular-card"
            [routerLink]="['/category', category.id]"
          >
            <div class="popular-content">
              <div class="popular-icon" [style.background-color]="category.color">
                <i [class]="category.icon"></i>
              </div>
              <h4>{{ category.name }}</h4>
              <p-badge [value]="category.count.toString()" severity="warn"> </p-badge>
            </div>
          </p-card>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .categories-page {
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

          .header-stats {
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

        .controls-section {
          margin-bottom: 2rem;

          .controls-card {
            .controls-content {
              display: flex;
              gap: 1rem;
              align-items: center;
              flex-wrap: wrap;
              padding: 1rem;

              @media (max-width: 768px) {
                flex-direction: column;
                align-items: stretch;
              }

              .search-control {
                flex: 1;
                min-width: 250px;
              }

              .sort-control {
                min-width: 150px;
              }

              .view-control {
                display: flex;
                gap: 0.5rem;
              }
            }
          }
        }

        .categories-section {
          margin-bottom: 3rem;

          .dataview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--p-surface-section);
            border-radius: var(--p-border-radius);

            h2 {
              margin: 0;
              color: var(--p-text-color);
            }

            .results-count {
              color: var(--p-text-color-secondary);
              font-size: 0.9rem;
            }
          }

          .category-grid-item {
            padding: 1rem;

            .category-card {
              height: 100%;
              transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
              cursor: pointer;

              &:hover {
                transform: translateY(-4px);
                box-shadow: var(--p-shadow-4);
              }

              .category-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 80px;
                border-radius: var(--p-border-radius);

                i {
                  font-size: 2rem;
                  color: white;
                }
              }

              .category-content {
                padding: 1.5rem;

                h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: var(--p-text-color);
                  margin-bottom: 0.75rem;
                }

                .category-description {
                  color: var(--p-text-color-secondary);
                  line-height: 1.5;
                  margin-bottom: 1rem;
                  font-size: 0.95rem;
                }

                .category-stats {
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  margin-bottom: 1rem;

                  .posts-label {
                    color: var(--p-text-color-secondary);
                    font-size: 0.9rem;
                  }
                }

                .recent-posts {
                  h5 {
                    color: var(--p-text-color);
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                  }

                  ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;

                    li {
                      margin-bottom: 0.25rem;

                      a {
                        color: var(--p-text-color-secondary);
                        text-decoration: none;
                        font-size: 0.85rem;

                        &:hover {
                          color: var(--p-primary-color);
                        }
                      }
                    }
                  }
                }
              }

              .category-actions {
                padding: 1rem;
                border-top: 1px solid var(--p-surface-border);
              }
            }
          }

          .category-list-item {
            padding: 0.5rem;

            .category-list-card {
              .list-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;

                .category-info {
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                  flex: 1;

                  .category-icon-small {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;

                    i {
                      font-size: 1.2rem;
                      color: white;
                    }
                  }

                  .category-details {
                    flex: 1;

                    h3 {
                      margin: 0 0 0.5rem 0;
                      color: var(--p-text-color);
                      font-size: 1.1rem;
                      cursor: pointer;

                      &:hover {
                        color: var(--p-primary-color);
                      }
                    }

                    .category-description {
                      color: var(--p-text-color-secondary);
                      margin-bottom: 0.5rem;
                      font-size: 0.9rem;
                    }

                    .category-meta {
                      display: flex;
                      gap: 0.5rem;
                    }
                  }
                }

                .category-actions {
                  flex-shrink: 0;
                }
              }
            }
          }

          .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--p-text-color-secondary);

            .empty-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
              color: var(--p-surface-400);
            }

            h3 {
              margin-bottom: 0.5rem;
              color: var(--p-text-color);
            }
          }
        }

        .popular-section {
          h2 {
            font-size: 2rem;
            font-weight: 600;
            color: var(--p-text-color);
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;

            i {
              color: var(--p-primary-color);
            }
          }

          .popular-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;

            .popular-card {
              transition: transform 0.3s ease;
              cursor: pointer;

              &:hover {
                transform: translateY(-2px);
              }

              .popular-content {
                text-align: center;
                padding: 1.5rem;

                .popular-icon {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                  margin: 0 auto 1rem;

                  i {
                    font-size: 1.5rem;
                    color: white;
                  }
                }

                h4 {
                  margin-bottom: 0.75rem;
                  color: var(--p-text-color);
                }
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .categories-page {
          .page-header h1 {
            font-size: 2.5rem;
          }

          .controls-content {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .popular-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
          }
        }
      }
    `
  ]
})
export class CategoriesPage {
  searchTerm = ''
  selectedSort = 'name'
  viewMode: 'grid' | 'list' = 'grid'
  filteredCategories: Category[] = []

  sortOptions = [
    { label: '名称', value: 'name' },
    { label: '文章数量', value: 'count' },
    { label: '最新', value: 'recent' }
  ]

  // Sample data - In a real application, this would come from a service
  categories: Category[] = [
    {
      id: 'angular',
      name: 'Angular',
      count: 12,
      description: '关于 Angular 开发、最佳实践和技巧的文章。',
      color: '#DD0031',
      icon: 'pi pi-code',
      posts: [
        { id: '1', title: 'Angular SSR 入门指南' },
        { id: '2', title: 'Angular 最佳实践' },
        { id: '3', title: '组件通信' }
      ]
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      count: 8,
      description: 'TypeScript 教程、高级类型和语言特性。',
      color: '#3178C6',
      icon: 'pi pi-file-edit',
      posts: [
        { id: '4', title: 'TypeScript 最佳实践' },
        { id: '5', title: '高级类型' }
      ]
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      count: 6,
      description: '使用 Node.js 进行服务器端 JavaScript 开发。',
      color: '#339933',
      icon: 'pi pi-server',
      posts: [
        { id: '6', title: 'Node.js 性能优化技巧' },
        { id: '7', title: 'Express.js 指南' }
      ]
    },
    {
      id: 'web-development',
      name: 'Web 开发',
      count: 15,
      description: '通用 Web 开发主题、工具和技术。',
      color: '#FF6B35',
      icon: 'pi pi-globe',
      posts: [
        { id: '8', title: '现代 Web 开发' },
        { id: '9', title: '响应式设计' },
        { id: '10', title: 'Web 性能优化' }
      ]
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      count: 10,
      description: 'JavaScript 基础、ES6+ 和现代开发。',
      color: '#F7DF1E',
      icon: 'pi pi-code',
      posts: [
        { id: '11', title: 'ES2024 新特性' },
        { id: '12', title: '异步编程' }
      ]
    },
    {
      id: 'css',
      name: 'CSS',
      count: 7,
      description: 'CSS 样式、动画和现代布局技术。',
      color: '#1572B6',
      icon: 'pi pi-palette',
      posts: [
        { id: '13', title: 'CSS Grid 布局' },
        { id: '14', title: 'CSS 动画' }
      ]
    }
  ]

  constructor() {
    this.filteredCategories = [...this.categories]
    this.sortCategories()
  }

  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories]
    } else {
      const term = this.searchTerm.toLowerCase()
      this.filteredCategories = this.categories.filter(
        (category) =>
          category.name.toLowerCase().includes(term) ||
          category.description.toLowerCase().includes(term)
      )
    }
    this.sortCategories()
  }

  sortCategories(): void {
    this.filteredCategories.sort((a, b) => {
      switch (this.selectedSort) {
        case 'count':
          return b.count - a.count
        case 'recent':
          // In a real app, this would sort by actual date
          return b.count - a.count
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode
  }

  getPopularCategories(): Category[] {
    return [...this.categories].sort((a, b) => b.count - a.count).slice(0, 4)
  }
}
