import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'cs-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-page">
      <section class="hero">
        <h1>Welcome to Crispy</h1>
        <p class="subtitle">A modern blog platform</p>
      </section>

      <section class="featured-posts">
        <h2>Featured Posts</h2>
        <div class="post-grid">
          <!-- Post cards will go here -->
          <div class="post-card" *ngFor="let i of [1, 2, 3]">
            <div class="post-image"></div>
            <div class="post-content">
              <h3>Featured Post {{ i }}</h3>
              <p>This is a sample post description. It will be replaced with actual content.</p>
              <a href="#" class="read-more">Read More</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-page {
        .hero {
          text-align: center;
          padding: 4rem 1rem;
          background: linear-gradient(to right, #f6f7f9, #edf1f7);
          border-radius: 1rem;
          margin-bottom: 3rem;

          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #333;
          }

          .subtitle {
            font-size: 1.2rem;
            color: #666;
          }
        }

        .featured-posts {
          h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
            color: #333;
          }

          .post-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }

          .post-card {
            background: #fff;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;

            &:hover {
              transform: translateY(-4px);
            }

            .post-image {
              height: 200px;
              background: #eee;
            }

            .post-content {
              padding: 1.5rem;

              h3 {
                font-size: 1.25rem;
                margin-bottom: 0.5rem;
                color: #333;
              }

              p {
                color: #666;
                margin-bottom: 1rem;
              }

              .read-more {
                color: #007bff;
                text-decoration: none;
                font-weight: 500;

                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
    `
  ]
})
export class HomePage {}
