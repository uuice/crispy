import { Component } from '@angular/core'

@Component({
  selector: 'cs-tags',
  standalone: true,
  template: `
    <!-- Tags Banner -->
    <section class="blog-banner">
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">标签</h1>
      </div>
    </section>
    <!-- Tags Content -->
    <section class="blog-section">
      <div class="blog-prose text-main">
        <h2>所有标签</h2>
        <div class="flex flex-wrap gap-2 mt-4">
          <span class="blog-tag blog-tag-gray">Blogging</span>
          <span class="blog-tag blog-tag-purple">Customization</span>
          <span class="blog-tag blog-tag-pink">Demo</span>
          <span class="blog-tag blog-tag-blue">Example</span>
          <span class="blog-tag blog-tag-green">Fuwari</span>
          <span class="blog-tag blog-tag-yellow">Markdown</span>
          <span class="blog-tag blog-tag-indigo">Video</span>
        </div>
      </div>
    </section>
  `,
  styles: [``]
})
export class TagsPage {}
