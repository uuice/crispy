import { Component, OnInit, Inject, PLATFORM_ID, signal, computed } from '@angular/core'
import { isPlatformServer } from '@angular/common'
import { TransferState, makeStateKey } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { BadgeModule } from 'primeng/badge'
import { DividerModule } from 'primeng/divider'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { AvatarModule } from 'primeng/avatar'
import { ChipModule } from 'primeng/chip'
import { TooltipModule } from 'primeng/tooltip'
import { HttpService } from '@src/app/web-pc/services/http.service'
import { SeoService } from '../../services/seo.service'

// TransferState keys
const LINKS_KEY = makeStateKey<Link[]>('links-data')
// 定义 Link 接口，避免依赖服务端模块
interface Link {
  id: number
  site_name: string
  des: string
  url: string
  logo?: string
  method?: string
  type_id: number
  type_name?: string
  color?: string
  sort: number
  status: number
  create_time: number
  update_time: number
  is_delete: number
}

@Component({
  selector: 'cs-links',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    DividerModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    AvatarModule,
    ChipModule,
    TooltipModule
  ],
  template: `
    <div class="links-page">
      <!-- Header Section -->
      <div class="page-header">
        <h1>
          <i class="pi pi-link"></i>
          实用链接
        </h1>
        <p>发现开发者的精彩资源、工具和网站</p>
        <div class="header-stats">
          <p-badge [value]="links().length.toString()" severity="info" size="large"> </p-badge>
          <span class="stats-label">总链接数</span>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="controls-section">
        <p-card class="controls-card">
          <div class="controls-content">
            <div class="search-control">
              <span class="p-input-icon-left">
                <input
                  type="text"
                  pInputText
                  placeholder="搜索链接..."
                  [ngModel]="searchTerm()"
                  (ngModelChange)="searchTerm.set($event)"
                />
              </span>
            </div>
            <div class="filter-control">
              <p-dropdown
                [options]="categoryOptions()"
                [ngModel]="selectedCategory()"
                (ngModelChange)="selectedCategory.set($event)"
                optionLabel="label"
                optionValue="value"
                placeholder="按分类筛选"
              >
              </p-dropdown>
            </div>
            <div class="featured-control">
              <p-button
                [label]="showFeaturedOnly() ? '显示全部' : '仅精选'"
                [icon]="showFeaturedOnly() ? 'pi pi-list' : 'pi pi-star'"
                [outlined]="!showFeaturedOnly()"
                (click)="toggleFeatured()"
              >
              </p-button>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Featured Links -->
      <section class="featured-section" *ngIf="!showFeaturedOnly()">
        <h2>
          <i class="pi pi-star"></i>
          精选链接
        </h2>
        <div class="featured-grid">
          <p-card *ngFor="let link of getFeaturedLinks()" class="featured-link-card">
            <ng-template pTemplate="header">
              <div class="featured-header" style="background-color: #6366f1">
                <i [class]="link.logo || 'pi pi-link'" class="featured-icon"></i>
                <p-chip label="精选" icon="pi pi-star" styleClass="featured-chip"> </p-chip>
              </div>
            </ng-template>

            <div class="featured-content">
              <h3>{{ link.site_name }}</h3>
              <p class="link-description">{{ link.des }}</p>
              <p-tag
                [value]="link.type_name || '未分类'"
                [severity]="getCategorySeverity(link.type_name || '')"
              >
              </p-tag>
            </div>

            <ng-template pTemplate="footer">
              <div class="featured-actions">
                <p-button
                  label="访问网站"
                  icon="pi pi-external-link"
                  [raised]="true"
                  (click)="openLink(link.url)"
                >
                </p-button>
              </div>
            </ng-template>
          </p-card>
        </div>
      </section>

      <p-divider *ngIf="!showFeaturedOnly()"></p-divider>

      <!-- All Links -->
      <section class="links-section">
        <div class="section-header">
          <h2>
            <i class="pi pi-globe"></i>
            {{ showFeaturedOnly() ? '精选链接' : '所有链接' }}
          </h2>
          <span class="results-count"> 找到 {{ filteredLinks().length }} 个链接 </span>
        </div>

        <div class="links-grid">
          <p-card *ngFor="let link of filteredLinks(); trackBy: trackByLinkId" class="link-card">
            <div class="link-content">
              <div class="link-header">
                <div class="link-icon" style="background-color: #6366f1">
                  <i [class]="link.logo || 'pi pi-link'"></i>
                </div>
                <div class="link-info">
                  <h3>{{ link.site_name }}</h3>
                  <p class="link-url">{{ getDomainFromUrl(link.url) }}</p>
                </div>
                <div class="link-badges">
                  <!-- <p-chip
                    *ngIf="link.featured"
                    label="精选"
                    icon="pi pi-star"
                    styleClass="featured-badge"
                  >
                  </p-chip> -->
                  <p-tag
                    [value]="link.type_name || '未分类'"
                    [severity]="getCategorySeverity(link.type_name || '')"
                    size="small"
                  >
                  </p-tag>
                </div>
              </div>

              <p class="link-description">{{ link.des }}</p>

              <div class="link-actions">
                <p-button
                  label="访问"
                  icon="pi pi-external-link"
                  [text]="true"
                  size="small"
                  (click)="openLink(link.url)"
                >
                </p-button>
                <p-button
                  icon="pi pi-copy"
                  [text]="true"
                  size="small"
                  pTooltip="复制链接"
                  (click)="copyUrl(link.url)"
                >
                </p-button>
              </div>
            </div>
          </p-card>
        </div>

        <div class="empty-state" *ngIf="filteredLinks.length === 0">
          <i class="pi pi-search empty-icon"></i>
          <h3>未找到链接</h3>
          <p>请尝试调整搜索或筛选条件</p>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .links-page {
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
              .featured-control {
                min-width: 150px;
              }
            }
          }
        }

        .featured-section {
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

          .featured-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;

            .featured-link-card {
              transition: transform 0.3s ease;

              &:hover {
                transform: translateY(-8px);
              }

              .featured-header {
                position: relative;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;

                .featured-icon {
                  font-size: 3rem;
                  color: white;
                }

                .featured-chip {
                  position: absolute;
                  top: 1rem;
                  right: 1rem;
                }
              }

              .featured-content {
                padding: 1.5rem;

                h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: var(--p-text-color);
                  margin-bottom: 0.75rem;
                }

                .link-description {
                  color: var(--p-text-color-secondary);
                  line-height: 1.5;
                  margin-bottom: 1rem;
                }
              }

              .featured-actions {
                padding: 1rem;
                text-align: center;
              }
            }
          }
        }

        .links-section {
          margin-bottom: 3rem;

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;

            h2 {
              font-size: 2rem;
              font-weight: 600;
              color: var(--p-text-color);
              margin: 0;
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

          .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 1.5rem;

            .link-card {
              transition: transform 0.3s ease;

              &:hover {
                transform: translateY(-4px);
              }

              .link-content {
                padding: 1.5rem;

                .link-header {
                  display: flex;
                  align-items: flex-start;
                  gap: 1rem;
                  margin-bottom: 1rem;

                  .link-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    flex-shrink: 0;

                    i {
                      font-size: 1.5rem;
                      color: white;
                    }
                  }

                  .link-info {
                    flex: 1;

                    h3 {
                      font-size: 1.1rem;
                      font-weight: 600;
                      color: var(--p-text-color);
                      margin: 0 0 0.25rem 0;
                    }

                    .link-url {
                      color: var(--p-text-color-secondary);
                      font-size: 0.9rem;
                      margin: 0;
                    }
                  }

                  .link-badges {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-end;
                  }
                }

                .link-description {
                  color: var(--p-text-color-secondary);
                  line-height: 1.5;
                  margin-bottom: 1.5rem;
                  font-size: 0.95rem;
                }

                .link-actions {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
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
      }

      @media (max-width: 768px) {
        .links-page {
          .page-header h1 {
            font-size: 2.5rem;
          }

          .controls-content {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .featured-grid,
          .links-grid {
            grid-template-columns: 1fr !important;
          }

          .link-header {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center;

            .link-badges {
              align-items: center !important;
            }
          }
        }
      }
    `
  ]
})
export class LinksPage implements OnInit {
  // 使用 signal 管理状态
  searchTerm = signal('')
  selectedCategory = signal('')
  showFeaturedOnly = signal(false)
  links = signal<Link[]>([])

  categoryOptions = signal<
    {
      label: string
      value: string
    }[]
  >([])

  // 计算属性：过滤后的链接
  filteredLinks = computed(() => {
    let filtered = [...this.links()]

    // Filter by search term
    if (this.searchTerm().trim()) {
      const term = this.searchTerm().toLowerCase()
      filtered = filtered.filter(
        (link) =>
          link.site_name.toLowerCase().includes(term) || link.des.toLowerCase().includes(term)
      )
    }

    // Filter by category
    if (this.selectedCategory()) {
      filtered = filtered.filter((link) => link.type_name === this.selectedCategory())
    }

    // Filter by featured
    if (this.showFeaturedOnly()) {
      filtered = filtered.filter((link) => link.status === 10 && link.sort < 10)
    }

    return filtered
  })

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState,
    private httpService: HttpService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    // Set SEO data for links page
    this.seoService.setLinksSeo()

    // 简化的数据获取逻辑
    this.loadLinks()
  }

  private loadLinks() {
    // 尝试从 TransferState 获取数据
    const cachedLinks = this.transferState.get(LINKS_KEY, null)

    if (cachedLinks && cachedLinks.length > 0) {
      // 使用缓存数据
      this.links.set(cachedLinks)
      this.transferState.remove(LINKS_KEY) // 清除缓存
      console.log('Using cached links:', cachedLinks.length)
    } else {
      // 从 API 获取数据
      this.httpService
        .get<any>('/api/content/links', {
          page: 1,
          pageSize: 1000
        })
        .subscribe({
          next: (res) => {
            const linksData = res.data?.dataList || []
            this.links.set(linksData)

            // 只在服务器端设置 TransferState
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(LINKS_KEY, linksData)
            }

            console.log('Links loaded:', linksData.length)
          },
          error: (error) => {
            console.error('Error loading links:', error)
            this.links.set([])
          }
        })
    }
  }

  toggleFeatured(): void {
    this.showFeaturedOnly.update((value) => !value)
  }

  getFeaturedLinks(): Link[] {
    return this.links().filter((link: Link) => link.status === 10 && link.sort < 10)
  }

  trackByLinkId(_index: number, link: Link): string {
    return link.id.toString()
  }

  getDomainFromUrl(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  getCategorySeverity(
    category: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    const severityMap: {
      [key: string]: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
    } = {
      development: 'info',
      design: 'success',
      tools: 'warning',
      learning: 'secondary'
    }
    return severityMap[category] || 'info'
  }

  openLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      // In a real app, you might show a toast notification here
      console.log('URL copied to clipboard:', url)
    })
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category)
  }

  getPlatform(): string {
    return isPlatformServer(this.platformId) ? 'server' : 'client'
  }
}
