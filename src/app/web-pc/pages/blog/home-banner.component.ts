import { Component } from '@angular/core'

@Component({
  selector: 'cs-home-banner',
  standalone: true,
  template: `
    <section class="blog-banner">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        alt="Banner"
        class="blog-banner-img"
      />
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">UUICE(一句话)</h1>
        <p class="text-lg md:text-xl text-muted mb-2">
          一个现代、简约的博客启动器，由Crisp和UUICE驱动
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .blog-banner {
        background: var(--p-content-background) !important;
        border-radius: 1.25rem;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
      }
      .blog-banner-img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 1.25rem 1.25rem 0 0;
      }
      .blog-banner-content {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 2rem 2.5rem 1.5rem 2.5rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0.18) 100%);
      }
      .blog-title {
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
    `
  ]
})
export class HomeBannerComponent {}
