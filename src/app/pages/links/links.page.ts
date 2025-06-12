import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

interface Link {
  name: string
  url: string
  description: string
  category: string
}

@Component({
  selector: 'cs-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="links-page">
      <h1>Links</h1>

      <div class="links-content">
        <!-- Development -->
        <section class="category-section">
          <h2>Development</h2>
          <div class="links-grid">
            <a
              *ngFor="let link of developmentLinks"
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
            >
              <h3>{{ link.name }}</h3>
              <p>{{ link.description }}</p>
              <span class="category">{{ link.category }}</span>
            </a>
          </div>
        </section>

        <!-- Design -->
        <section class="category-section">
          <h2>Design</h2>
          <div class="links-grid">
            <a
              *ngFor="let link of designLinks"
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
            >
              <h3>{{ link.name }}</h3>
              <p>{{ link.description }}</p>
              <span class="category">{{ link.category }}</span>
            </a>
          </div>
        </section>

        <!-- Tools -->
        <section class="category-section">
          <h2>Tools</h2>
          <div class="links-grid">
            <a
              *ngFor="let link of toolLinks"
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
            >
              <h3>{{ link.name }}</h3>
              <p>{{ link.description }}</p>
              <span class="category">{{ link.category }}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .links-page {
        h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .links-content {
          .category-section {
            margin-bottom: 3rem;

            h2 {
              font-size: 1.8rem;
              color: #333;
              margin-bottom: 1.5rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #eee;
            }
          }

          .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .link-card {
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

            h3 {
              font-size: 1.2rem;
              color: #333;
              margin-bottom: 0.5rem;
            }

            p {
              color: #666;
              font-size: 0.9rem;
              line-height: 1.5;
              margin-bottom: 1rem;
            }

            .category {
              display: inline-block;
              padding: 0.25rem 0.75rem;
              background: #f5f5f5;
              border-radius: 1rem;
              font-size: 0.8rem;
              color: #666;
            }
          }
        }
      }

      @media (max-width: 768px) {
        .links-page {
          .links-grid {
            grid-template-columns: 1fr;
          }
        }
      }
    `
  ]
})
export class LinksPage {
  // Sample data - In a real application, this would come from a service
  developmentLinks: Link[] = [
    {
      name: 'Angular',
      url: 'https://angular.io',
      description: "The modern web developer's platform",
      category: 'Framework'
    },
    {
      name: 'TypeScript',
      url: 'https://www.typescriptlang.org',
      description: 'JavaScript with syntax for types',
      category: 'Language'
    }
  ]

  designLinks: Link[] = [
    {
      name: 'Figma',
      url: 'https://www.figma.com',
      description: 'The collaborative interface design tool',
      category: 'Design Tool'
    },
    {
      name: 'Dribbble',
      url: 'https://dribbble.com',
      description: 'Discover and connect with designers worldwide',
      category: 'Inspiration'
    }
  ]

  toolLinks: Link[] = [
    {
      name: 'VS Code',
      url: 'https://code.visualstudio.com',
      description: 'Code editor redefined and optimized for building and debugging',
      category: 'Editor'
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      description: 'Where the world builds software',
      category: 'Version Control'
    }
  ]
}
