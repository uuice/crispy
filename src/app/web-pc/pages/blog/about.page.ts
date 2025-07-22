import { Component } from '@angular/core'

@Component({
  selector: 'cs-about',
  standalone: true,
  template: `
    <!-- About Banner -->
    <section class="blog-banner">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        alt="Banner"
        class="blog-banner-img"
      />
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">About</h1>
      </div>
    </section>
    <!-- About Content -->
    <section class="blog-section">
      <div class="blog-prose prose text-main">
        <h2>This is the demo site for Fuwari.</h2>
        <p>saicaca/fuwari</p>
        <h3>Sources of images used in this site</h3>
        <ul class="list-disc pl-6">
          <li>Unsplash</li>
          <li>星と少女 by Stella</li>
          <li>Rabbit - v1.4 Showcase by Rabbit_YourMajesty</li>
        </ul>
      </div>
    </section>
  `,
  styles: [``]
})
export class AboutPage {}
