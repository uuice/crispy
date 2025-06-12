import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'cs-disclaimer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="disclaimer-page">
      <h1>Disclaimer</h1>

      <div class="disclaimer-content">
        <section class="section">
          <h2>Content Disclaimer</h2>
          <p>
            The information provided on this website is for general informational purposes only.
            While we strive to keep the information up to date and correct, we make no
            representations or warranties of any kind, express or implied, about the completeness,
            accuracy, reliability, suitability or availability of the information, products,
            services, or related graphics contained on the website for any purpose.
          </p>
        </section>

        <section class="section">
          <h2>External Links</h2>
          <p>
            Our website may contain links to external websites that are not provided or maintained
            by us. Please note that we do not guarantee the accuracy, relevance, timeliness, or
            completeness of any information on these external websites.
          </p>
        </section>

        <section class="section">
          <h2>Professional Advice</h2>
          <p>
            Any reliance you place on such information is strictly at your own risk. In no event
            will we be liable for any loss or damage including without limitation, indirect or
            consequential loss or damage, or any loss or damage whatsoever arising from loss of data
            or profits arising out of, or in connection with, the use of this website.
          </p>
        </section>

        <section class="section">
          <h2>Copyright</h2>
          <p>
            All content on this website, including but not limited to text, graphics, logos, images,
            and software, is the property of the website owner or its content suppliers and is
            protected by international copyright laws.
          </p>
        </section>

        <section class="section">
          <h2>Changes to Disclaimer</h2>
          <p>
            We reserve the right to modify this disclaimer at any time. We do so by posting modified
            terms on this website. Your continued use of the website means you accept any changes.
          </p>
        </section>

        <section class="section">
          <h2>Contact Information</h2>
          <p>
            If you have any questions about this disclaimer, please contact us at:
            <a href="mailto:contact@example.com">contactample.com</a>
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .disclaimer-page {
        h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .disclaimer-content {
          .section {
            margin-bottom: 2.5rem;

            h2 {
              font-size: 1.5rem;
              color: #333;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #eee;
            }

            p {
              color: #666;
              line-height: 1.6;
              margin-bottom: 1rem;

              &:last-child {
                margin-bottom: 0;
              }
            }

            a {
              color: #007bff;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .disclaimer-page {
          h1 {
            font-size: 2rem;
          }

          .disclaimer-content {
            .section {
              h2 {
                font-size: 1.3rem;
              }
            }
          }
        }
      }
    `
  ]
})
export class DisclaimerPage {}
