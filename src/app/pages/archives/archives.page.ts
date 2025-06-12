import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

interface ArchivePost {
  id: string
  title: string
  date: string
  category: string
}

@Component({
  selector: 'cs-archives',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="archives-page">
      <h1>Archives</h1>

      <div class="archives-content">
        <!-- Year 2024 -->
        <section class="year-section">
          <h2>2024</h2>

          <!-- March -->
          <div class="month-section">
            <h3>March</h3>
            <ul class="post-list">
              <li *ngFor="let post of march2024Posts">
                <span class="date">{{ post.date }}</span>
                <a [routerLink]="['/post', post.id]" class="title">{{ post.title }}</a>
                <span class="category">{{ post.category }}</span>
              </li>
            </ul>
          </div>

          <!-- February -->
          <div class="month-section">
            <h3>February</h3>
            <ul class="post-list">
              <li *ngFor="let post of february2024Posts">
                <span class="date">{{ post.date }}</span>
                <a [routerLink]="['/post', post.id]" class="title">{{ post.title }}</a>
                <span class="category">{{ post.category }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Year 2023 -->
        <section class="year-section">
          <h2>2023</h2>

          <!-- December -->
          <div class="month-section">
            <h3>December</h3>
            <ul class="post-list">
              <li *ngFor="let post of december2023Posts">
                <span class="date">{{ post.date }}</span>
                <a [routerLink]="['/post', post.id]" class="title">{{ post.title }}</a>
                <span class="category">{{ post.category }}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .archives-page {
        h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .archives-content {
          .year-section {
            margin-bottom: 3rem;

            h2 {
              font-size: 1.8rem;
              color: #333;
              margin-bottom: 1.5rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #eee;
            }
          }

          .month-section {
            margin-bottom: 2rem;

            h3 {
              font-size: 1.4rem;
              color: #666;
              margin-bottom: 1rem;
            }
          }

          .post-list {
            list-style: none;
            padding: 0;

            li {
              display: grid;
              grid-template-columns: 100px 1fr 120px;
              gap: 1rem;
              padding: 0.75rem 0;
              border-bottom: 1px solid #eee;

              &:last-child {
                border-bottom: none;
              }

              .date {
                color: #999;
                font-size: 0.9rem;
              }

              .title {
                color: #333;
                text-decoration: none;
                font-weight: 500;

                &:hover {
                  color: #007bff;
                }
              }

              .category {
                color: #666;
                font-size: 0.9rem;
                text-align: right;
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .archives-page {
          .post-list li {
            grid-template-columns: 1fr;
            gap: 0.25rem;

            .date {
              font-size: 0.8rem;
            }

            .category {
              text-align: left;
            }
          }
        }
      }
    `
  ]
})
export class ArchivesPage {
  // Sample data - In a real application, this would come from a service
  march2024Posts: ArchivePost[] = [
    {
      id: '1',
      title: 'Getting Started with Angular SSR',
      date: 'Mar 15',
      category: 'Angular'
    },
    {
      id: '2',
      title: 'Building Modern Web Applications',
      date: 'Mar 10',
      category: 'Web Dev'
    }
  ]

  february2024Posts: ArchivePost[] = [
    {
      id: '3',
      title: 'TypeScript Best Practices',
      date: 'Feb 28',
      category: 'TypeScript'
    }
  ]

  december2023Posts: ArchivePost[] = [
    {
      id: '4',
      title: 'Node.js Performance Tips',
      date: 'Dec 20',
      category: 'Node.js'
    }
  ]
}
