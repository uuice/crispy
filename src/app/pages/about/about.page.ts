import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { AvatarModule } from 'primeng/avatar'
import { DividerModule } from 'primeng/divider'
import { PanelModule } from 'primeng/panel'
import { TimelineModule } from 'primeng/timeline'
import { ChipModule } from 'primeng/chip'

@Component({
  selector: 'cs-about',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    DividerModule,
    PanelModule,
    TimelineModule,
    ChipModule
  ],
  template: `
    <div class="about-page">
      <!-- Header Section -->
      <div class="page-header">
        <h1>
          <i class="pi pi-user"></i>
          关于我们
        </h1>
        <p>了解我们的使命、团队以及 Crispy 背后的故事</p>
      </div>

      <!-- Profile Section -->
      <section class="profile-section">
        <p-card class="profile-card">
          <div class="profile-content">
            <div class="profile-avatar">
              <p-avatar
                label="C"
                size="xlarge"
                shape="circle"
                [style]="{
                  'background-color': 'var(--p-primary-color)',
                  color: 'white',
                  'font-size': '3rem'
                }"
              >
              </p-avatar>
            </div>
            <div class="profile-info">
              <h2>Crispy 团队</h2>
              <p class="bio">
                我们是充满热情的开发者和作家，致力于创造关于 Web
                开发、技术趋势和编程最佳实践的高质量内容。
                我们的使命是分享知识，帮助开发者社区成长。
              </p>
              <div class="profile-stats">
                <div class="stat">
                  <span class="stat-number">3+</span>
                  <span class="stat-label">年经验</span>
                </div>
                <div class="stat">
                  <span class="stat-number">150+</span>
                  <span class="stat-label">已发布文章</span>
                </div>
                <div class="stat">
                  <span class="stat-number">1K+</span>
                  <span class="stat-label">满意读者</span>
                </div>
              </div>
            </div>
          </div>
        </p-card>
      </section>

      <p-divider></p-divider>

      <!-- About Blog Section -->
      <section class="blog-section">
        <p-panel header="关于此博客" [toggleable]="true">
          <ng-template pTemplate="icons">
            <i class="pi pi-bookmark"></i>
          </ng-template>
          <p>
            Crispy 是一个使用 Angular、Node.js 和 PrimeNG 等尖端技术构建的现代博客平台。
            我们专注于提供高质量内容和优秀的用户体验与性能。
          </p>
          <p>
            我们的平台具有更好的SEO服务器端渲染、适用于所有设备的响应式设计，
            以及让阅读变得愉快的干净现代界面。
          </p>

          <div class="tech-stack">
            <h4>技术栈</h4>
            <div class="tech-chips">
              <p-chip
                *ngFor="let tech of techStack"
                [label]="tech.name"
                [icon]="tech.icon"
                [style]="{
                  margin: '0.25rem'
                }"
              >
              </p-chip>
            </div>
          </div>
        </p-panel>
      </section>

      <!-- Skills Section -->
      <section class="skills-section">
        <p-panel header="技能与专长" [toggleable]="true">
          <ng-template pTemplate="icons">
            <i class="pi pi-star"></i>
          </ng-template>
          <div class="skills-grid">
            <p-card *ngFor="let skill of skills" class="skill-card">
              <div class="skill-content">
                <i [class]="skill.icon" class="skill-icon"></i>
                <h4>{{ skill.name }}</h4>
                <p>{{ skill.description }}</p>
                <p-tag [value]="skill.level" [severity]="getSkillSeverity(skill.level)"> </p-tag>
              </div>
            </p-card>
          </div>
        </p-panel>
      </section>

      <!-- Timeline Section -->
      <section class="timeline-section">
        <p-panel header="我们的历程" [toggleable]="true">
          <ng-template pTemplate="icons">
            <i class="pi pi-clock"></i>
          </ng-template>
          <p-timeline [value]="timeline" align="alternate" styleClass="customized-timeline">
            <ng-template pTemplate="marker" let-event>
              <span class="custom-marker" [style.backgroundColor]="event.color">
                <i [class]="event.icon"></i>
              </span>
            </ng-template>
            <ng-template pTemplate="content" let-event>
              <p-card [header]="event.status" [subheader]="event.date">
                <p>{{ event.description }}</p>
                <p-tag [value]="event.tag" [severity]="event.tagSeverity" *ngIf="event.tag">
                </p-tag>
              </p-card>
            </ng-template>
          </p-timeline>
        </p-panel>
      </section>

      <!-- Contact Section -->
      <section class="contact-section">
        <p-card class="contact-card">
          <ng-template pTemplate="header">
            <div class="contact-header">
              <i class="pi pi-envelope"></i>
              <h3>联系我们</h3>
            </div>
          </ng-template>

          <div class="contact-content">
            <p>我们很乐意听到您的声音！无论您有疑问、建议，还是只是想打个招呼， 请随时联系我们。</p>

            <div class="contact-methods">
              <div class="contact-method">
                <p-button
                  label="发送邮件"
                  icon="pi pi-envelope"
                  [raised]="true"
                  (click)="sendEmail()"
                >
                </p-button>
              </div>
              <div class="contact-method">
                <p-button
                  label="关注 Twitter"
                  icon="pi pi-twitter"
                  severity="info"
                  [outlined]="true"
                  (click)="openTwitter()"
                >
                </p-button>
              </div>
              <div class="contact-method">
                <p-button
                  label="GitHub"
                  icon="pi pi-github"
                  severity="secondary"
                  [outlined]="true"
                  (click)="openGitHub()"
                >
                </p-button>
              </div>
            </div>
          </div>
        </p-card>
      </section>
    </div>
  `,
  styles: [
    `
      .about-page {
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
          }
        }

        .profile-section {
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
              h2 {
                font-size: 2rem;
                font-weight: 600;
                color: var(--p-text-color);
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
            }
          }
        }

        .blog-section,
        .skills-section,
        .timeline-section {
          margin-bottom: 3rem;

          .tech-stack {
            margin-top: 2rem;

            h4 {
              color: var(--p-text-color);
              margin-bottom: 1rem;
            }

            .tech-chips {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
            }
          }
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;

          .skill-card {
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-4px);
            }

            .skill-content {
              text-align: center;
              padding: 1rem;

              .skill-icon {
                font-size: 2.5rem;
                color: var(--p-primary-color);
                margin-bottom: 1rem;
              }

              h4 {
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

        .timeline-section {
          ::ng-deep .customized-timeline {
            .p-timeline-event-content {
              .p-card {
                margin-top: 1rem;
              }
            }

            .custom-marker {
              display: flex;
              width: 2rem;
              height: 2rem;
              align-items: center;
              justify-content: center;
              color: white;
              border-radius: 50%;
              z-index: 1;

              i {
                font-size: 0.8rem;
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

                .contact-method {
                  flex: 1;
                  min-width: 150px;
                }
              }
            }
          }
        }
      }
    `
  ]
})
export class AboutPage {
  techStack = [
    { name: 'Angular', icon: 'pi pi-code' },
    { name: 'TypeScript', icon: 'pi pi-file-edit' },
    { name: 'Node.js', icon: 'pi pi-server' },
    { name: 'PrimeNG', icon: 'pi pi-palette' },
    { name: 'MySQL', icon: 'pi pi-database' },
    { name: 'Express', icon: 'pi pi-globe' }
  ]

  skills = [
    {
      name: '前端开发',
      description: '使用 Angular、React 和 Vue.js 构建现代 Web 应用程序',
      icon: 'pi pi-desktop',
      level: '专家'
    },
    {
      name: '后端开发',
      description: '使用 Node.js 和 Express 构建服务器端应用程序',
      icon: 'pi pi-server',
      level: '高级'
    },
    {
      name: '数据库设计',
      description: '关系型和非关系型数据库架构',
      icon: 'pi pi-database',
      level: '高级'
    },
    {
      name: 'UI/UX 设计',
      description: '以用户为中心的设计和现代界面',
      icon: 'pi pi-palette',
      level: '中级'
    },
    {
      name: 'DevOps',
      description: 'CI/CD、容器化和云部署',
      icon: 'pi pi-cloud',
      level: '中级'
    },
    {
      name: '技术写作',
      description: '清晰的文档和教育内容',
      icon: 'pi pi-file-edit',
      level: '专家'
    }
  ]

  timeline = [
    {
      status: '博客上线',
      date: '2024年1月',
      icon: 'pi pi-rocket',
      color: '#9C27B0',
      description: '使用现代 Angular 架构和 PrimeNG 组件推出 Crispy 博客。',
      tag: '里程碑',
      tagSeverity: 'success'
    },
    {
      status: '首批50篇文章',
      date: '2024年2月',
      icon: 'pi pi-file',
      color: '#673AB7',
      description: '达到发布50篇涵盖各种技术主题文章的第一个里程碑。',
      tag: '成就',
      tagSeverity: 'info'
    },
    {
      status: '社区增长',
      date: '2024年3月',
      icon: 'pi pi-users',
      color: '#FF9800',
      description: '拥有1000多名活跃读者和贡献者的不断增长的社区。',
      tag: '增长',
      tagSeverity: 'warning'
    },
    {
      status: '平台增强',
      date: '2024年4月',
      icon: 'pi pi-cog',
      color: '#607D8B',
      description: '重大平台更新，包括改进的搜索、分类和用户体验。',
      tag: '更新',
      tagSeverity: 'secondary'
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

  sendEmail() {
    window.location.href = 'mailto:contact@crispy-blog.com?subject=Hello from Crispy Blog'
  }

  openTwitter() {
    window.open('https://twitter.com/crispy-blog', '_blank')
  }

  openGitHub() {
    window.open('https://github.com/crispy-blog', '_blank')
  }
}
