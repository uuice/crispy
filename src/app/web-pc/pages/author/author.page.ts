import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { AvatarModule } from 'primeng/avatar'
import { DividerModule } from 'primeng/divider'
import { ChipModule } from 'primeng/chip'
import { TimelineModule } from 'primeng/timeline'
import { PanelModule } from 'primeng/panel'
import { TooltipModule } from 'primeng/tooltip'

interface Post {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  views?: number
  likes?: number
}

@Component({
  selector: 'cs-author',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    DividerModule,
    ChipModule,
    TimelineModule,
    PanelModule,
    TooltipModule
  ],
  template: `
    <div class="author-page">
      <!-- Author Profile Section -->
      <section class="author-profile">
        <p-card class="profile-card">
          <div class="profile-content">
            <div class="profile-avatar">
              <p-avatar
                label="张"
                size="xlarge"
                shape="circle"
                [style]="{
                  'background-color': 'var(--p-primary-color)',
                  color: 'white',
                  'font-size': '3rem',
                  width: '120px',
                  height: '120px'
                }"
              >
              </p-avatar>
            </div>
            <div class="profile-info">
              <h1>{{ author.name }}</h1>
              <p class="title">{{ author.title }}</p>
              <p class="bio">{{ author.bio }}</p>

              <div class="profile-stats">
                <div class="stat">
                  <span class="stat-number">{{ author.postsCount }}</span>
                  <span class="stat-label">文章</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ author.experience }}</span>
                  <span class="stat-label">年经验</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ author.followers }}</span>
                  <span class="stat-label">关注者</span>
                </div>
              </div>

              <div class="social-links">
                <p-button
                  *ngFor="let social of author.socialLinks"
                  [icon]="social.icon"
                  [text]="true"
                  [rounded]="true"
                  severity="secondary"
                  size="large"
                  [pTooltip]="social.platform"
                  (click)="openSocialLink(social.url)"
                >
                </p-button>
              </div>
            </div>
          </div>
        </p-card>
      </section>

      <p-divider></p-divider>

      <!-- Skills & Expertise -->
      <section class="skills-section">
        <h2>
          <i class="pi pi-star"></i>
          技能与专长
        </h2>
        <div class="skills-grid">
          <p-card *ngFor="let skill of author.skills" class="skill-card">
            <div class="skill-content">
              <i [class]="skill.icon" class="skill-icon"></i>
              <h3>{{ skill.name }}</h3>
              <p>{{ skill.description }}</p>
              <p-tag [value]="skill.level" [severity]="getSkillSeverity(skill.level)"> </p-tag>
            </div>
          </p-card>
        </div>
      </section>

      <p-divider></p-divider>

      <!-- Career Timeline -->
      <section class="timeline-section">
        <p-panel header="职业历程" [toggleable]="true">
          <ng-template pTemplate="icons">
            <i class="pi pi-briefcase"></i>
          </ng-template>

          <p-timeline [value]="author.timeline" align="alternate" styleClass="custom-timeline">
            <ng-template pTemplate="marker" let-event>
              <span class="timeline-marker" [style.backgroundColor]="event.color">
                <i [class]="event.icon"></i>
              </span>
            </ng-template>

            <ng-template pTemplate="content" let-event>
              <p-card class="timeline-card">
                <ng-template pTemplate="header">
                  <div class="timeline-header">
                    <h3>{{ event.title }}</h3>
                    <span class="timeline-date">{{ event.period }}</span>
                  </div>
                </ng-template>

                <p>{{ event.description }}</p>
                <div class="timeline-tags">
                  <p-chip
                    *ngFor="let tech of event.technologies"
                    [label]="tech"
                    [style]="{ margin: '0.25rem' }"
                  >
                  </p-chip>
                </div>
              </p-card>
            </ng-template>
          </p-timeline>
        </p-panel>
      </section>

      <p-divider></p-divider>

      <!-- Recent Posts -->
      <section class="posts-section">
        <div class="section-header">
          <h2>
            <i class="pi pi-file"></i>
            最新文章
          </h2>
          <p-button
            label="查看所有文章"
            icon="pi pi-arrow-right"
            [outlined]="true"
            routerLink="/archives"
          >
          </p-button>
        </div>

        <div class="posts-grid">
          <p-card
            *ngFor="let post of recentPosts"
            class="post-card"
            [routerLink]="['/post', post.id]"
          >
            <div class="post-content">
              <div class="post-header">
                <p-tag
                  [value]="post.category"
                  [severity]="getCategorySeverity(post.category)"
                  size="small"
                >
                </p-tag>
                <span class="post-date">
                  <i class="pi pi-calendar"></i>
                  {{ post.date }}
                </span>
              </div>

              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>

              <div class="post-footer">
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
                <p-button icon="pi pi-arrow-right" [text]="true" size="small"> </p-button>
              </div>
            </div>
          </p-card>
        </div>
      </section>

      <p-divider></p-divider>

      <!-- Contact Section -->
      <section class="contact-section">
        <p-card class="contact-card">
          <ng-template pTemplate="header">
            <div class="contact-header">
              <i class="pi pi-envelope"></i>
              <h3>联系我</h3>
            </div>
          </ng-template>

          <div class="contact-content">
            <p>
              对合作感兴趣或有关于我工作的问题？
              我很乐意听到您的声音！请随时通过以下任何渠道联系我。
            </p>

            <div class="contact-methods">
              <p-button
                label="发送邮件"
                icon="pi pi-envelope"
                [raised]="true"
                (click)="sendEmail()"
              >
              </p-button>
              <p-button
                label="预约通话"
                icon="pi pi-calendar"
                severity="secondary"
                [outlined]="true"
                (click)="scheduleCall()"
              >
              </p-button>
            </div>
          </div>
        </p-card>
      </section>
    </div>
  `,
  styles: [
    `
      .author-page {
        .author-profile {
          margin-bottom: 3rem;

          .profile-card {
            .profile-content {
              display: grid;
              grid-template-columns: auto 1fr;
              gap: 2rem;
              align-items: center;
              padding: 2rem;

              @media (max-width: 768px) {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 1.5rem;
              }
            }

            .profile-avatar {
              display: flex;
              justify-content: center;
            }

            .profile-info {
              h1 {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--p-text-color);
                margin-bottom: 0.5rem;
              }

              .title {
                font-size: 1.2rem;
                color: var(--p-primary-color);
                font-weight: 600;
                margin-bottom: 1rem;
              }

              .bio {
                color: var(--p-text-color-secondary);
                line-height: 1.6;
                margin-bottom: 2rem;
                font-size: 1.1rem;
              }

              .profile-stats {
                display: flex;
                gap: 2rem;
                margin-bottom: 2rem;

                @media (max-width: 768px) {
                  justify-content: center;
                }

                .stat {
                  text-align: center;

                  .stat-number {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--p-primary-color);
                  }

                  .stat-label {
                    font-size: 0.9rem;
                    color: var(--p-text-color-secondary);
                  }
                }
              }

              .social-links {
                display: flex;
                gap: 0.5rem;

                @media (max-width: 768px) {
                  justify-content: center;
                }
              }
            }
          }
        }

        .skills-section {
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

          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;

            .skill-card {
              transition: transform 0.3s ease;

              &:hover {
                transform: translateY(-4px);
              }

              .skill-content {
                text-align: center;
                padding: 1.5rem;

                .skill-icon {
                  font-size: 2.5rem;
                  color: var(--p-primary-color);
                  margin-bottom: 1rem;
                }

                h3 {
                  font-size: 1.1rem;
                  font-weight: 600;
                  color: var(--p-text-color);
                  margin-bottom: 0.5rem;
                }

                p {
                  color: var(--p-text-color-secondary);
                  line-height: 1.5;
                  margin-bottom: 1rem;
                  font-size: 0.9rem;
                }
              }
            }
          }
        }

        .timeline-section {
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
              font-size: 1.2rem;
            }

            .timeline-date {
              color: var(--p-text-color-secondary);
              font-size: 0.9rem;
            }
          }

          .timeline-tags {
            margin-top: 1rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }

        .posts-section {
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
          }

          .posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 1.5rem;

            .post-card {
              transition: transform 0.3s ease;
              cursor: pointer;

              &:hover {
                transform: translateY(-4px);
              }

              .post-content {
                padding: 1.5rem;

                .post-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 1rem;

                  .post-date {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--p-text-color-secondary);
                    font-size: 0.9rem;
                  }
                }

                .post-title {
                  font-size: 1.2rem;
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

                .post-footer {
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
            }
          }
        }

        .contact-section {
          .contact-card {
            .contact-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 1rem;
              padding: 2rem;
              background: var(--p-primary-50);

              i {
                font-size: 2rem;
                color: var(--p-primary-color);
              }

              h3 {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--p-text-color);
                margin: 0;
              }
            }

            .contact-content {
              padding: 2rem;
              text-align: center;

              p {
                color: var(--p-text-color-secondary);
                line-height: 1.6;
                margin-bottom: 2rem;
                font-size: 1.1rem;
              }

              .contact-methods {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .author-page {
          .profile-content {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }

          .profile-stats {
            justify-content: center !important;
          }

          .social-links {
            justify-content: center !important;
          }

          .skills-grid,
          .posts-grid {
            grid-template-columns: 1fr !important;
          }

          .section-header {
            flex-direction: column !important;
            gap: 1rem;
            text-align: center;
          }

          .contact-methods {
            flex-direction: column !important;
          }
        }
      }
    `
  ]
})
export class AuthorPage {
  author = {
    name: '张明',
    title: '全栈开发工程师 & 技术作家',
    bio: '充满热情的全栈开发工程师，拥有5年以上构建现代化Web应用程序的经验。专精于Angular、Node.js和TypeScript。我热爱通过写作分享知识，帮助其他开发者在职业生涯中成长。',
    postsCount: 42,
    experience: 5,
    followers: 1250,
    socialLinks: [
      { platform: 'GitHub', icon: 'pi pi-github', url: 'https://github.com/johndoe' },
      { platform: 'Twitter', icon: 'pi pi-twitter', url: 'https://twitter.com/johndoe' },
      { platform: 'LinkedIn', icon: 'pi pi-linkedin', url: 'https://linkedin.com/in/johndoe' },
      { platform: 'Email', icon: 'pi pi-envelope', url: 'mailto:john@example.com' }
    ],
    skills: [
      {
        name: '前端开发',
        description: 'Angular, React, Vue.js, TypeScript, JavaScript',
        icon: 'pi pi-desktop',
        level: '专家'
      },
      {
        name: '后端开发',
        description: 'Node.js, Express, NestJS, RESTful APIs',
        icon: 'pi pi-server',
        level: '高级'
      },
      {
        name: '数据库设计',
        description: 'PostgreSQL, MongoDB, Redis, 数据库优化',
        icon: 'pi pi-database',
        level: '高级'
      },
      {
        name: 'DevOps & 云服务',
        description: 'Docker, AWS, CI/CD, Kubernetes',
        icon: 'pi pi-cloud',
        level: '中级'
      }
    ],
    timeline: [
      {
        title: '高级全栈开发工程师',
        period: '2022 - 至今',
        description:
          '领导使用Angular和Node.js开发企业级Web应用程序。指导初级开发者并建立最佳实践。',
        technologies: ['Angular', 'Node.js', 'TypeScript', 'AWS'],
        icon: 'pi pi-briefcase',
        color: '#9C27B0'
      },
      {
        title: '全栈开发工程师',
        period: '2020 - 2022',
        description: '使用现代Web技术开发和维护多个客户项目。将应用程序性能提升了40%。',
        technologies: ['React', 'Express', 'MongoDB', 'Docker'],
        icon: 'pi pi-code',
        color: '#673AB7'
      },
      {
        title: '前端开发工程师',
        period: '2019 - 2020',
        description:
          '专注于前端开发的职业生涯开始。构建响应式Web应用程序并学习现代JavaScript框架。',
        technologies: ['JavaScript', 'HTML', 'CSS', 'Vue.js'],
        icon: 'pi pi-palette',
        color: '#FF9800'
      },
      {
        title: '计算机科学学位',
        period: '2015 - 2019',
        description: '计算机科学学士学位。专注于软件工程原理和Web技术。',
        technologies: ['Java', 'Python', '算法', '数据结构'],
        icon: 'pi pi-graduation-cap',
        color: '#607D8B'
      }
    ]
  }

  // Sample data - In a real application, this would come from a service
  recentPosts: Post[] = [
    {
      id: '1',
      title: 'Angular SSR 入门指南',
      date: 'Mar 15, 2024',
      excerpt: '学习如何在Angular应用程序中实现服务器端渲染，以获得更好的性能和SEO。',
      category: 'Angular',
      views: 1250,
      likes: 89
    },
    {
      id: '2',
      title: 'TypeScript 最佳实践',
      date: 'Mar 10, 2024',
      excerpt: '探索高级TypeScript特性和最佳实践，编写更易维护和类型安全的代码。',
      category: 'TypeScript',
      views: 980,
      likes: 67
    },
    {
      id: '3',
      title: '构建现代Web应用程序',
      date: 'Mar 5, 2024',
      excerpt: '使用最新工具和技术构建现代Web应用程序的综合指南。',
      category: 'Web开发',
      views: 756,
      likes: 45
    }
  ]

  getSkillSeverity(
    level: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    const severityMap: {
      [key: string]: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
    } = {
      专家: 'success',
      高级: 'info',
      中级: 'warning',
      初级: 'secondary'
    }
    return severityMap[level] || 'info'
  }

  getCategorySeverity(
    category: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    const severityMap: {
      [key: string]: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
    } = {
      Angular: 'danger',
      TypeScript: 'success',
      Web开发: 'info',
      'Node.js': 'warning',
      JavaScript: 'secondary'
    }
    return severityMap[category] || 'info'
  }

  openSocialLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  sendEmail(): void {
    window.location.href = 'mailto:john@example.com?subject=Hello from your blog'
  }

  scheduleCall(): void {
    window.open('https://calendly.com/johndoe', '_blank', 'noopener,noreferrer')
  }
}
