import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'cs-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-page">
      <h1>About</h1>

      <section class="about-content">
        <div class="profile">
          <div class="avatar"></div>
          <h2>Your Name</h2>
          <p class="bio">A brief introduction about yourself and your interests.</p>
        </div>

        <div class="details">
          <section class="section">
            <h3>About This Blog</h3>
            <p>
              This is a modern blog platform built with Angular and Node.js. It features server-side
              rendering for better performance and SEO.
            </p>
          </section>

          <section class="section">
            <h3>Skills & Expertise</h3>
            <ul class="skills-list">
              <li>Web Development</li>
              <li>Angular</li>
              <li>Node.js</li>
              <li>TypeScript</li>
              <li>UI/UX Design</li>
            </ul>
          </section>

          <section class="section">
            <h3>Contact</h3>
            <p>
              Feel free to reach out to me at:
              <a href="mailto:your.email@example.com">sdfsdf</a>
            </p>
          </section>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .about-page {
        h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .about-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        .profile {
          text-align: center;

          .avatar {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: #eee;
            margin: 0 auto 1.5rem;
          }

          h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #333;
          }

          .bio {
            color: #666;
            line-height: 1.6;
          }
        }

        .details {
          .section {
            margin-bottom: 2rem;

            h3 {
              font-size: 1.25rem;
              margin-bottom: 1rem;
              color: #333;
            }

            p {
              color: #666;
              line-height: 1.6;
            }

            a {
              color: #007bff;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }

          .skills-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            li {
              background: #f5f5f5;
              padding: 0.5rem 1rem;
              border-radius: 2rem;
              font-size: 0.9rem;
              color: #666;
            }
          }
        }
      }
    `
  ]
})
export class AboutPage {}
