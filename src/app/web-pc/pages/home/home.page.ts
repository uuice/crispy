import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { AvatarModule } from 'primeng/avatar'
import { DividerModule } from 'primeng/divider'
import { SkeletonModule } from 'primeng/skeleton'
import { RippleModule } from 'primeng/ripple'

@Component({
  selector: 'cs-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    DividerModule,
    SkeletonModule,
    RippleModule
  ],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <p-card class="hero-card">
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title">
                <i class="pi pi-sparkles"></i>
                欢迎来到 Crispy
              </h1>
              <p class="hero-subtitle">
                一个基于 Angular 和 PrimeNG 构建的现代化、优雅的博客平台。
                发现精彩内容，分享你的想法，与作家和读者社区建立联系。
              </p>
              <div class="hero-actions">
                <p-button
                  label="浏览文章"
                  icon="pi pi-arrow-right"
                  [raised]="true"
                  size="large"
                  routerLink="/archives"
                >
                </p-button>
                <p-button
                  label="关于我们"
                  icon="pi pi-info-circle"
                  severity="secondary"
                  [outlined]="true"
                  size="large"
                  routerLink="/about"
                >
                </p-button>
              </div>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">150+</span>
                <span class="stat-label">文章</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">25+</span>
                <span class="stat-label">分类</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">1K+</span>
                <span class="stat-label">读者</span>
              </div>
            </div>
          </div>
        </p-card>
      </section>

      <p-divider></p-divider>

      <!-- Featured Posts Section -->
      <section class="featured-section">
        <div class="section-header">
          <h2>
            <i class="pi pi-star-fill"></i>
            精选文章
          </h2>
          <p>发现我们最受欢迎和最新的文章</p>
        </div>

        <div class="posts-grid">
          <p-card
            *ngFor="let post of featuredPosts; trackBy: trackByPostId"
            class="post-card"
            [style]="{ height: '100%' }"
          >
            <ng-template pTemplate="header">
              <div class="post-image">
                <p-skeleton height="200px" *ngIf="!post.image"></p-skeleton>
                <img [src]="post.image" [alt]="post.title" *ngIf="post.image" />
                <div class="post-overlay">
                  <p-tag
                    [value]="post.category"
                    [severity]="getTagSeverity(post.category)"
                    icon="pi pi-tag"
                  >
                  </p-tag>
                </div>
              </div>
            </ng-template>

            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>

              <div class="post-meta">
                <div class="author-info">
                  <p-avatar [label]="post.author.charAt(0)" size="normal" shape="circle">
                  </p-avatar>
                  <span class="author-name">{{ post.author }}</span>
                </div>
                <div class="post-date">
                  <i class="pi pi-calendar"></i>
                  {{ post.date }}
                </div>
              </div>
            </div>

            <ng-template pTemplate="footer">
              <div class="post-actions">
                <p-button
                  label="阅读更多"
                  icon="pi pi-arrow-right"
                  [text]="true"
                  size="small"
                  [routerLink]="['/post', post.id]"
                >
                </p-button>
                <div class="post-stats">
                  <span class="stat">
                    <i class="pi pi-eye"></i>
                    {{ post.views }}
                  </span>
                  <span class="stat">
                    <i class="pi pi-heart"></i>
                    {{ post.likes }}
                  </span>
                </div>
              </div>
            </ng-template>
          </p-card>
        </div>

        <div class="section-footer">
          <p-button
            label="查看所有文章"
            icon="pi pi-arrow-right"
            [outlined]="true"
            size="large"
            routerLink="/archives"
          >
          </p-button>
        </div>
      </section>

      <p-divider></p-divider>

      <!-- Quick Links Section -->
      <section class="quick-links-section">
        <div class="section-header">
          <h2>
            <i class="pi pi-compass"></i>
            探索更多
          </h2>
        </div>

        <div class="quick-links-grid">
          <p-card *ngFor="let link of quickLinks" class="quick-link-card" [routerLink]="link.route">
            <div class="quick-link-content">
              <i [class]="link.icon" class="quick-link-icon"></i>
              <h3>{{ link.title }}</h3>
              <p>{{ link.description }}</p>
              <p-tag [value]="link.count + ' 项'" severity="info" *ngIf="link.count"> </p-tag>
            </div>
          </p-card>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-page {
        .hero-section {
          margin-bottom: 3rem;

          .hero-card {
            background: linear-gradient(135deg, var(--p-primary-50) 0%, var(--p-primary-100) 100%);
            border: none;
            box-shadow: var(--p-shadow-3);

            .hero-content {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 3rem;
              align-items: center;
              padding: 2rem;

              @media (max-width: 768px) {
                grid-template-columns: 1fr;
                gap: 2rem;
                text-align: center;
              }
            }

            .hero-title {
              font-size: 3rem;
              font-weight: 700;
              color: var(--p-text-color);
              margin-bottom: 1rem;
              display: flex;
              align-items: center;
              gap: 1rem;

              i {
                color: var(--p-primary-color);
              }

              @media (max-width: 768px) {
                font-size: 2.5rem;
                justify-content: center;
              }
            }

            .hero-subtitle {
              font-size: 1.2rem;
              color: var(--p-text-color-secondary);
              line-height: 1.6;
              margin-bottom: 2rem;
            }

            .hero-actions {
              display: flex;
              gap: 1rem;
              flex-wrap: wrap;

              @media (max-width: 768px) {
                justify-content: center;
              }
            }

            .hero-stats {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;

              @media (max-width: 768px) {
                flex-direction: row;
                justify-content: center;
              }

              .stat-item {
                text-align: center;
                padding: 1rem;
                background: var(--p-surface-card);
                border-radius: var(--p-border-radius);
                box-shadow: var(--p-shadow-1);

                .stat-number {
                  display: block;
                  font-size: 2rem;
                  font-weight: 700;
                  color: var(--p-primary-color);
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

        .section-header {
          text-align: center;
          margin-bottom: 3rem;

          h2 {
            font-size: 2.5rem;
            font-weight: 600;
            color: var(--p-text-color);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;

            i {
              color: var(--p-primary-color);
            }
          }

          p {
            font-size: 1.1rem;
            color: var(--p-text-color-secondary);
          }
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .post-card {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
          cursor: pointer;

          &:hover {
            transform: translateY(-8px);
            box-shadow: var(--p-shadow-4);
          }

          .post-image {
            position: relative;
            height: 200px;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .post-overlay {
              position: absolute;
              top: 1rem;
              right: 1rem;
            }
          }

          .post-content {
            padding: 1.5rem;

            .post-title {
              font-size: 1.25rem;
              font-weight: 600;
              color: var(--p-text-color);
              margin-bottom: 0.75rem;
              line-height: 1.4;
            }

            .post-excerpt {
              color: var(--p-text-color-secondary);
              line-height: 1.6;
              margin-bottom: 1.5rem;
            }

            .post-meta {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1rem;

              .author-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                .author-name {
                  font-size: 0.9rem;
                  color: var(--p-text-color-secondary);
                }
              }

              .post-date {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.9rem;
                color: var(--p-text-color-secondary);
              }
            }
          }

          .post-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .post-stats {
              display: flex;
              gap: 1rem;

              .stat {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.9rem;
                color: var(--p-text-color-secondary);
              }
            }
          }
        }

        .section-footer {
          text-align: center;
          margin-top: 2rem;
        }

        .quick-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .quick-link-card {
          transition: transform 0.3s ease;
          cursor: pointer;

          &:hover {
            transform: translateY(-4px);
          }

          .quick-link-content {
            text-align: center;
            padding: 1.5rem;

            .quick-link-icon {
              font-size: 3rem;
              color: var(--p-primary-color);
              margin-bottom: 1rem;
            }

            h3 {
              font-size: 1.25rem;
              font-weight: 600;
              color: var(--p-text-color);
              margin-bottom: 0.75rem;
            }

            p {
              color: var(--p-text-color-secondary);
              line-height: 1.5;
              margin-bottom: 1rem;
            }
          }
        }
      }
    `
  ]
})
export class HomePage {
  featuredPosts = [
    {
      id: '1',
      title: 'Angular 和 PrimeNG 入门指南',
      excerpt:
        '学习如何使用 Angular 框架和 PrimeNG UI 组件构建现代化的 Web 应用程序。这个全面的指南涵盖了从设置到部署的所有内容。',
      category: 'Angular',
      author: '张三',
      date: 'Mar 15, 2024',
      views: 1250,
      likes: 89,
      image: null
    },
    {
      id: '2',
      title: '现代 Web 开发最佳实践',
      excerpt:
        '探索 Web 开发的最新趋势和最佳实践。从响应式设计到性能优化，了解什么造就了优秀的 Web 应用程序。',
      category: 'Web 开发',
      author: '李四',
      date: 'Mar 12, 2024',
      views: 980,
      likes: 67,
      image: null
    },
    {
      id: '3',
      title: 'TypeScript 高级特性',
      excerpt:
        '深入了解 TypeScript 的高级特性，包括泛型、装饰器和高级类型。非常适合希望提升技能的开发者。',
      category: 'TypeScript',
      author: '王五',
      date: 'Mar 10, 2024',
      views: 756,
      likes: 45,
      image: null
    }
  ]

  quickLinks = [
    {
      title: '分类',
      description: '按主题浏览文章',
      icon: 'pi pi-tags',
      route: '/categories',
      count: 12
    },
    {
      title: '标签',
      description: '按标签探索内容',
      icon: 'pi pi-tag',
      route: '/tags',
      count: 45
    },
    {
      title: '归档',
      description: '按时间顺序浏览所有文章',
      icon: 'pi pi-calendar',
      route: '/archives',
      count: 150
    },
    {
      title: '关于',
      description: '了解更多关于我们',
      icon: 'pi pi-info-circle',
      route: '/about',
      count: null
    }
  ]

  trackByPostId(index: number, post: any): string {
    return post.id
  }

  getTagSeverity(
    category: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    const severityMap: {
      [key: string]: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
    } = {
      Angular: 'danger',
      'Web Dev': 'info',
      TypeScript: 'success',
      'Node.js': 'warning',
      JavaScript: 'secondary'
    }
    return severityMap[category] || 'info'
  }
}
