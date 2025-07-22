import { Component } from '@angular/core'

@Component({
  selector: 'cs-archives-detail',
  standalone: true,
  template: `
    <!-- Article Banner -->
    <section class="blog-banner">
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">Markdown Extended Features</h1>
        <div class="flex flex-wrap gap-3 items-center text-sm text-muted mb-2">
          <span>2024-05-01</span>
          <span>·</span>
          <span>by <span class="font-semibold blog-icon">Lorem Ipsum</span></span>
          <span>·</span>
          <span class="blog-tag blog-tag-blue text-xs">Examples</span>
        </div>
      </div>
    </section>
    <!-- Article Content -->
    <section class="blog-section">
      <div class="blog-prose text-main">
        <h2>Introduction</h2>
        <p>
          This article demonstrates extended Markdown features in Fuwari, including code blocks,
          tables, and more.
        </p>
        <h3>Code Example</h3>
        <pre><code>const greet = (name: string) =&gt; 'Hello, ' + name + '!';
console.log(greet('Fuwari'));
</code></pre>
        <h3>Table Example</h3>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Supported</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Code Highlight</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Tables</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Images</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
        <h3>Image Example</h3>
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
          alt="Sample"
          class="rounded-xl shadow max-w-full"
        />
        <h3>Conclusion</h3>
        <p>
          Fuwari provides a beautiful and modern blogging experience with extended Markdown support.
        </p>
      </div>
      <div class="blog-tags mt-4 text-muted">
        <span class="blog-tag blog-tag-gray">Blogging</span>
        <span class="blog-tag blog-tag-purple">Demo</span>
        <span class="blog-tag blog-tag-blue">Example</span>
      </div>
    </section>
  `,
  styles: [``]
})
export class ArchivesDetailPage {}
