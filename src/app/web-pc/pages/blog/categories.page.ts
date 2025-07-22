import { Component } from '@angular/core'

@Component({
  selector: 'cs-categories',
  standalone: true,
  template: `
    <!-- Categories Banner -->
    <section class="blog-banner">
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">Categories</h1>
      </div>
    </section>
    <!-- Categories Content -->
    <section class="blog-section">
      <div class="blog-prose text-main">
        <h2>All Categories</h2>
        <ul class="list-disc pl-6">
          <li>Examples (4)</li>
          <li>Guides (1)</li>
        </ul>
      </div>
    </section>
  `,
  styles: [``]
})
export class CategoriesPage {}
