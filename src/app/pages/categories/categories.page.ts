import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

interface Category {
  id: string
  name: string
  count: number
  description: string
}

@Component({
  selector: 'cs-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="categories-page">
      <h1>Categories</h1>

      <div class="categories-content">
        <div class="categories-grid">
          <a
            *ngFor="let category of categories"
            [routerLink]="['/category', category.id]"
            class="category-card"
          >
            <div class="category-header">
              <h2>{{ category.name }}</h2>
              <span class="count">{{ category.count }} posts</span>
            </div>
            <p class="description">{{ category.description }}</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .categories-page {
        h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .categories-content {
          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .category-card {
            display: block;
            padding: 1.5rem;
            background: #fff;
            border: 1px solid #eee;
            border-radius: 8px;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border-color: #ddd;
            }

            .category-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1rem;

              h2 {
                font-size: 1.2rem;
                color: #333;
                margin: 0;
              }

              .count {
                font-size: 0.9rem;
                color: #666;
                background: #f5f5f5;
                padding: 0.25rem 0.75rem;
                border-radius: 1rem;
              }
            }

            .description {
              color: #666;
              font-size: 0.9rem;
              line-height: 1.5;
              margin: 0;
            }
          }
        }
      }

      @media (max-width: 768px) {
        .categories-page {
          h1 {
            font-size: 2rem;
          }

          .categories-content {
            .categories-grid {
              grid-template-columns: 1fr;
            }
          }
        }
      }
    `
  ]
})
export class CategoriesPage {
  // Sample data - In a real application, this would come from a service
  categories: Category[] = [
    {
      id: 'angular',
      name: 'Angular',
      count: 12,
      description: 'Articles about Angular development, best practices, and tips.'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      count: 8,
      description: 'TypeScript tutorials, advanced types, and language features.'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      count: 6,
      description: 'Server-side JavaScript development with Node.js.'
    },
    {
      id: 'web-development',
      name: 'Web Development',
      count: 15,
      description: 'General web development topics, tools, and techniques.'
    }
  ]
}
