import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

interface Tag {
  id: string
  name: string
  count: number
}

@Component({
  selector: 'cs-tags',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tags-page">
      <h1>Tags</h1>

      <div class="tags-content">
        <div class="tags-cloud">
          <a
            *ngFor="let tag of tags"
            [routerLink]="['/tag', tag.id]"
            class="tag-item"
            [style.fontSize.px]="getTagSize(tag.count)"
          >
            {{ tag.name }}
            <span class="count">({{ tag.count }})</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .tags-page {
        h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .tags-content {
          .tags-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            padding: 1rem;
            background: #fff;
            border: 1px solid #eee;
            border-radius: 8px;
          }

          .tag-item {
            display: inline-flex;
            align-items: center;
            padding: 0.5rem 1rem;
            background: #f5f5f5;
            border-radius: 2rem;
            text-decoration: none;
            color: #333;
            transition: all 0.3s ease;
            font-size: 1rem;
            line-height: 1;

            &:hover {
              background: #e0e0e0;
              transform: translateY(-1px);
            }

            .count {
              margin-left: 0.5rem;
              font-size: 0.8em;
              color: #666;
            }
          }
        }
      }

      @media (max-width: 768px) {
        .tags-page {
          h1 {
            font-size: 2rem;
          }

          .tags-content {
            .tags-cloud {
              padding: 0.75rem;
              gap: 0.75rem;
            }

            .tag-item {
              padding: 0.4rem 0.8rem;
              font-size: 0.9rem;
            }
          }
        }
      }
    `
  ]
})
export class TagsPage {
  // Sample data - In a real application, this would come from a service
  tags: Tag[] = [
    { id: 'angular', name: 'Angular', count: 25 },
    { id: 'typescript', name: 'TypeScript', count: 18 },
    { id: 'javascript', name: 'JavaScript', count: 30 },
    { id: 'nodejs', name: 'Node.js', count: 15 },
    { id: 'css', name: 'CSS', count: 12 },
    { id: 'html', name: 'HTML', count: 10 },
    { id: 'webpack', name: 'Webpack', count: 8 },
    { id: 'rxjs', name: 'RxJS', count: 7 },
    { id: 'testing', name: 'Testing', count: 9 },
    { id: 'performance', name: 'Performance', count: 6 }
  ]

  // Calculate tag size based on count
  getTagSize(count: number): number {
    const minSize = 14
    const maxSize = 24
    const minCount = Math.min(...this.tags.map((t) => t.count))
    const maxCount = Math.max(...this.tags.map((t) => t.count))
    const range = maxCount - minCount

    if (range === 0) return (minSize + maxSize) / 2

    const size = minSize + ((count - minCount) / range) * (maxSize - minSize)
    return Math.round(size)
  }
}
