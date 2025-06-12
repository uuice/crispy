import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

interface Post {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
}

@Component({
  selector: 'cs-author',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="author-page">
      <div class="author-header">
        <div class="avatar"></div>
        <div class="info">
          <h1>John Doe</h1>
          <p class="bio">
            Full-stack developer passionate about web technologies. Specializing in Angular,
            Node.js, and TypeScript. Building modern web applications with a focus on performance
            and user experience.
          </p>
          <div class="social-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div class="author-content">
        <h2>Recent Posts</h2>
        <div class="posts-list">
          <article *ngFor="let post of recentPosts" class="post-card">
            <div class="post-header">
              <span class="category">{{ post.category }}</span>
              <span class="date">{{ post.date }}</span>
            </div>
            <h3>
              <a [routerLink]="['/post', post.id]">{{ post.title }}</a>
            </h3>
            <p class="excerpt">{{ post.excerpt }}</p>
          </article>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .author-page {
        .author-header {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
          padding: 2rem;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 8px;

          .avatar {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: #eee;
          }

          .info {
            h1 {
              font-size: 2rem;
              color: #333;
              margin-bottom: 1rem;
            }

            .bio {
              color: #666;
              line-height: 1.6;
              margin-bottom: 1.5rem;
            }

            .social-links {
              display: flex;
              gap: 1rem;

              .social-link {
                padding: 0.5rem 1rem;
                background: #f5f5f5;
                border-radius: 2rem;
                text-decoration: none;
                color: #333;
                font-size: 0.9rem;
                transition: all 0.3s ease;

                &:hover {
                  background: #e0e0e0;
                  transform: translateY(-1px);
                }
              }
            }
          }
        }

        .author-content {
          h2 {
            font-size: 1.8rem;
            color: #333;
            margin-bottom: 1.5rem;
          }

          .posts-list {
            display: grid;
            gap: 1.5rem;

            .post-card {
              padding: 1.5rem;
              background: #fff;
              border: 1px solid #eee;
              border-radius: 8px;

              .post-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;

                .category {
                  color: #666;
                  font-size: 0.9rem;
                  background: #f5f5f5;
                  padding: 0.25rem 0.75rem;
                  border-radius: 1rem;
                }

                .date {
                  color: #999;
                  font-size: 0.9rem;
                }
              }

              h3 {
                font-size: 1.2rem;
                margin-bottom: 0.75rem;

                a {
                  color: #333;
                  text-decoration: none;

                  &:hover {
                    color: #007bff;
                  }
                }
              }

              .excerpt {
                color: #666;
                line-height: 1.6;
                margin: 0;
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .author-page {
          .author-header {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 1.5rem;

            .avatar {
              width: 150px;
              height: 150px;
              margin: 0 auto;
            }

            .info {
              .social-links {
                justify-content: center;
              }
            }
          }

          .author-content {
            h2 {
              font-size: 1.5rem;
            }
          }
        }
      }
    `
  ]
})
export class AuthorPage {
  // Sample data - In a real application, this would come from a service
  recentPosts: Post[] = [
    {
      id: '1',
      title: 'Getting Started with Angular SSR',
      date: 'Mar 15, 2024',
      excerpt:
        'Learn how to implement server-side rendering in your Angular applications for better performance and SEO.',
      category: 'Angular'
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      date: 'Mar 10, 2024',
      excerpt:
        'Explore advanced TypeScript features and best practices for writing more maintainable and type-safe code.',
      category: 'TypeScript'
    },
    {
      id: '3',
      title: 'Building Modern Web Applications',
      date: 'Mar 5, 2024',
      excerpt:
        'A comprehensive guide to building modern web applications with the latest tools and technologies.',
      category: 'Web Development'
    }
  ]
}
