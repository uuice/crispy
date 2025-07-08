import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { ChipModule } from 'primeng/chip'
import { BadgeModule } from 'primeng/badge'
import { DividerModule } from 'primeng/divider'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { SeoService } from '../../services/seo.service'

interface Tag {
  id: string
  name: string
  count: number
  color?: string
  category?: string
}

@Component({
  selector: 'cs-tags',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    ChipModule,
    BadgeModule,
    DividerModule,
    InputTextModule,
    DropdownModule,
    FormsModule
  ],
  template: `
    <div class="tags-page">
      <!-- Header Section -->
      <div class="page-header">
        <h1>
          <i class="pi pi-tag"></i>
          标签
        </h1>
        <p>通过标签和关键词探索内容</p>
        <div class="header-stats">
          <p-badge [value]="tags.length.toString()" severity="info" size="large"> </p-badge>
          <span class="stats-label">总标签数</span>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="controls-section">
        <p-card class="controls-card">
          <div class="controls-content">
            <div class="search-control">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  type="text"
                  pInputText
                  placeholder="搜索标签..."
                  [(ngModel)]="searchTerm"
                  (input)="filterTags()"
                />
              </span>
            </div>
            <div class="filter-control">
              <p-dropdown
                [options]="categoryOptions"
                [(ngModel)]="selectedCategory"
                optionLabel="label"
                optionValue="value"
                placeholder="按分类筛选"
                (onChange)="filterTags()"
              >
              </p-dropdown>
            </div>
            <div class="sort-control">
              <p-dropdown
                [options]="sortOptions"
                [(ngModel)]="selectedSort"
                optionLabel="label"
                optionValue="value"
                placeholder="排序方式"
                (onChange)="sortTags()"
              >
              </p-dropdown>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Tags Cloud -->
      <section class="tags-cloud-section">
        <p-card>
          <ng-template pTemplate="header">
            <div class="section-header">
              <h2>
                <i class="pi pi-cloud"></i>
                标签云
              </h2>
              <span class="results-count"> 找到 {{ filteredTags.length }} 个标签 </span>
            </div>
          </ng-template>

          <div class="tags-cloud">
            <p-chip
              *ngFor="let tag of filteredTags; trackBy: trackByTagId"
              [label]="tag.name + ' (' + tag.count + ')'"
              [style]="getTagStyle(tag)"
              [routerLink]="['/tag', tag.id]"
              class="tag-chip"
            >
            </p-chip>
          </div>

          <div class="empty-state" *ngIf="filteredTags.length === 0">
            <i class="pi pi-search empty-icon"></i>
            <h3>未找到标签</h3>
            <p>请尝试调整搜索或筛选条件</p>
          </div>
        </p-card>
      </section>

      <p-divider></p-divider>

      <!-- Popular Tags -->
      <section class="popular-tags-section">
        <h2>
          <i class="pi pi-star"></i>
          最受欢迎的标签
        </h2>
        <div class="popular-tags-grid">
          <p-card
            *ngFor="let tag of getPopularTags()"
            class="popular-tag-card"
            [routerLink]="['/tag', tag.id]"
          >
            <div class="popular-tag-content">
              <div class="tag-info">
                <h3>{{ tag.name }}</h3>
                <p class="tag-category">{{ tag.category }}</p>
              </div>
              <div class="tag-stats">
                <p-badge [value]="tag.count.toString()" severity="success" size="large"> </p-badge>
                <span class="posts-label">篇文章</span>
              </div>
            </div>
          </p-card>
        </div>
      </section>

      <p-divider></p-divider>

      <!-- Tags by Category -->
      <section class="categories-section">
        <h2>
          <i class="pi pi-list"></i>
          按分类查看标签
        </h2>
        <div class="categories-grid">
          <p-card *ngFor="let category of getTagsByCategory()" class="category-card">
            <ng-template pTemplate="header">
              <div class="category-header">
                <h3>{{ category.name }}</h3>
                <p-badge [value]="category.tags.length.toString()" severity="info"> </p-badge>
              </div>
            </ng-template>

            <div class="category-tags">
              <p-tag
                *ngFor="let tag of category.tags.slice(0, 8)"
                [value]="tag.name"
                [severity]="getTagSeverity(tag.category)"
                [routerLink]="['/tag', tag.id]"
                class="category-tag"
              >
              </p-tag>
              <p-button
                *ngIf="category.tags.length > 8"
                [label]="'查看全部 ' + category.tags.length + ' 个标签'"
                [text]="true"
                size="small"
                icon="pi pi-arrow-right"
              >
              </p-button>
            </div>
          </p-card>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="stats-section">
        <div class="stats-grid">
          <p-card class="stat-card">
            <div class="stat-content">
              <i class="pi pi-tag stat-icon"></i>
              <div class="stat-info">
                <span class="stat-number">{{ tags.length }}</span>
                <span class="stat-label">总标签数</span>
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
              <i class="pi pi-file stat-icon"></i>
              <div class="stat-info">
                <span class="stat-number">{{ getTotalPosts() }}</span>
                <span class="stat-label">总文章数</span>
              </div>
            </div>
          </p-card>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .tags-page {
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

              .filter-control,
              .sort-control {
                min-width: 150px;
              }
            }
          }
        }

        .tags-cloud-section {
          margin-bottom: 3rem;

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;

            h2 {
              margin: 0;
              color: var(--p-text-color);
              display: flex;
              align-items: center;
              gap: 0.75rem;

              i {
                color: var(--p-primary-color);
              }
            }

            .results-count {
              color: var(--p-text-color-secondary);
              font-size: 0.9rem;
            }
          }

          .tags-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            padding: 2rem;
            min-height: 200px;

            .tag-chip {
              cursor: pointer;
              transition: transform 0.3s ease;

              &:hover {
                transform: translateY(-2px);
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

        .popular-tags-section {
          margin-bottom: 3rem;

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

          .popular-tags-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;

            .popular-tag-card {
              transition: transform 0.3s ease;
              cursor: pointer;

              &:hover {
                transform: translateY(-4px);
              }

              .popular-tag-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;

                .tag-info {
                  h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--p-text-color);
                    font-size: 1.1rem;
                  }

                  .tag-category {
                    color: var(--p-text-color-secondary);
                    font-size: 0.9rem;
                  }
                }

                .tag-stats {
                  text-align: center;

                  .posts-label {
                    display: block;
                    color: var(--p-text-color-secondary);
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                  }
                }
              }
            }
          }
        }

        .categories-section {
          margin-bottom: 3rem;

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

          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;

            .category-card {
              .category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;

                h3 {
                  margin: 0;
                  color: var(--p-text-color);
                }
              }

              .category-tags {
                padding: 1rem;
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;

                .category-tag {
                  cursor: pointer;
                  transition: transform 0.2s ease;

                  &:hover {
                    transform: scale(1.05);
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
        .tags-page {
          .page-header h1 {
            font-size: 2.5rem;
          }

          .controls-content {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .popular-tags-grid,
          .categories-grid,
          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .tags-cloud {
            padding: 1rem !important;
          }
        }
      }
    `
  ]
})
export class TagsPage implements OnInit {
  ngOnInit(): void {
    // Set SEO data for tags page
    this.seoService.setSeoData({
      title: '标签 - Crispy',
      description: '通过标签和关键词探索 Crispy 博客平台的内容，发现您感兴趣的文章。',
      keywords: '标签, 关键词, 内容探索, crispy',
      ogTitle: '标签 - Crispy',
      ogDescription: '通过标签和关键词探索 Crispy 博客平台的内容，发现您感兴趣的文章。',
      ogType: 'website',
      robots: 'index, follow'
    })
  }

  searchTerm = ''
  selectedCategory = ''
  selectedSort = 'name'
  filteredTags: Tag[] = []

  categoryOptions = [
    { label: '全部分类', value: '' },
    { label: '前端', value: 'frontend' },
    { label: '后端', value: 'backend' },
    { label: '工具', value: 'tools' },
    { label: '测试', value: 'testing' }
  ]

  sortOptions = [
    { label: '名称', value: 'name' },
    { label: '文章数量', value: 'count' },
    { label: '受欢迎度', value: 'popularity' }
  ]

  // Sample data - In a real application, this would come from a service
  tags: Tag[] = [
    { id: 'angular', name: 'Angular', count: 25, color: '#DD0031', category: 'frontend' },
    { id: 'typescript', name: 'TypeScript', count: 18, color: '#3178C6', category: 'frontend' },
    { id: 'javascript', name: 'JavaScript', count: 30, color: '#F7DF1E', category: 'frontend' },
    { id: 'nodejs', name: 'Node.js', count: 15, color: '#339933', category: 'backend' },
    { id: 'css', name: 'CSS', count: 12, color: '#1572B6', category: 'frontend' },
    { id: 'html', name: 'HTML', count: 10, color: '#E34F26', category: 'frontend' },
    { id: 'webpack', name: 'Webpack', count: 8, color: '#8DD6F9', category: 'tools' },
    { id: 'rxjs', name: 'RxJS', count: 7, color: '#B7178C', category: 'frontend' },
    { id: 'testing', name: 'Testing', count: 9, color: '#4CAF50', category: 'testing' },
    { id: 'performance', name: 'Performance', count: 6, color: '#FF9800', category: 'tools' },
    { id: 'react', name: 'React', count: 22, color: '#61DAFB', category: 'frontend' },
    { id: 'vue', name: 'Vue.js', count: 14, color: '#4FC08D', category: 'frontend' },
    { id: 'express', name: 'Express', count: 11, color: '#000000', category: 'backend' },
    { id: 'mongodb', name: 'MongoDB', count: 13, color: '#47A248', category: 'backend' }
  ]

  constructor(private seoService: SeoService) {
    this.filteredTags = [...this.tags]
    this.sortTags()
  }

  filterTags(): void {
    let filtered = [...this.tags]

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter((tag) => tag.name.toLowerCase().includes(term))
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter((tag) => tag.category === this.selectedCategory)
    }

    this.filteredTags = filtered
    this.sortTags()
  }

  sortTags(): void {
    this.filteredTags.sort((a, b) => {
      switch (this.selectedSort) {
        case 'count':
          return b.count - a.count
        case 'popularity':
          return b.count - a.count
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }

  getTagStyle(tag: Tag): any {
    const baseSize = 1
    const maxSize = 1.5
    const minCount = Math.min(...this.tags.map((t) => t.count))
    const maxCount = Math.max(...this.tags.map((t) => t.count))
    const range = maxCount - minCount

    let scale = baseSize
    if (range > 0) {
      scale = baseSize + ((tag.count - minCount) / range) * (maxSize - baseSize)
    }

    return {
      transform: `scale(${scale})`,
      'background-color': tag.color || 'var(--p-primary-color)',
      color: 'white'
    }
  }

  trackByTagId(index: number, tag: Tag): string {
    return tag.id
  }

  getPopularTags(): Tag[] {
    return [...this.tags].sort((a, b) => b.count - a.count).slice(0, 6)
  }

  getTagsByCategory(): any[] {
    const categories = this.getUniqueCategories()
    return categories.map((category) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      tags: this.tags.filter((tag) => tag.category === category)
    }))
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.tags.map((tag) => tag.category || 'other'))]
  }

  getTotalPosts(): number {
    return this.tags.reduce((total, tag) => total + tag.count, 0)
  }

  getTagSeverity(
    category?: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    const severityMap: {
      [key: string]: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
    } = {
      frontend: 'info',
      backend: 'success',
      tools: 'warning',
      testing: 'secondary'
    }
    return severityMap[category || 'other'] || 'info'
  }
}
