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
        <h1 class="blog-title">空色天絵 / NEO TOKYO NOIR 01</h1>
        <p class="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-2">
          A modern, minimal blog starter powered by Astro & Fuwari
        </p>
      </div>
    </section>
  `
})
export class HomeBannerComponent {}
