import { Component } from '@angular/core'

@Component({
  selector: 'cs-categories',
  standalone: true,
  template: `
    <!-- Categories Banner -->
    <section class="blog-banner">
      <div class="blog-banner-content">
        <h1 class="blog-title">Categories</h1>
      </div>
    </section>
    <!-- Categories Content -->
    <section class="blog-section">
      <div class="blog-prose">
        <h2>All Categories</h2>
        <ul>
          <li>Examples (4)</li>
          <li>Guides (1)</li>
        </ul>
      </div>
    </section>
  `
})
export class CategoriesPage {}
