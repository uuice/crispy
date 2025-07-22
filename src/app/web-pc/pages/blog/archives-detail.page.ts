import { Component, signal } from '@angular/core'
import { TocItem, generateTocAndHeadings } from '@src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'cs-archives-detail',
  standalone: true,
  imports: [TocComponent],
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
    <!-- 主内容 -->
    <section class="blog-section">
      <div class="blog-prose prose text-main">
        <h2 id="introduction">Introduction</h2>
        <p>
          This article demonstrates extended Markdown features in Fuwari, including code blocks,
          tables, and more.
        </p>
        <h3 id="code-example">Code Example</h3>
        <pre><code>const greet = (name: string) =&gt; 'Hello, ' + name + '!';
console.log(greet('Fuwari'));
</code></pre>
        <h3 id="table-example">Table Example</h3>
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
        <h3 id="image-example">Image Example</h3>
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
          alt="Sample"
          class="rounded-xl shadow max-w-full"
        />
        <h3 id="conclusion">Conclusion</h3>
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
    <!-- TOC 悬浮在主内容右侧，不占用主内容宽度 -->
    <cs-toc [toc]="toc" />
  `,
  styles: []
})
export class ArchivesDetailPage {
  rawHtml = `
    <h2>This is the demo site for Fuwari.</h2>
    <p>saicaca/fuwari</p>
    <h3>Sources of images used in this site</h3>
    <ul>
      <li>Unsplash</li>
      <li>星と少女 by Stella</li>
      <li>Rabbit - v1.4 Showcase by Rabbit_YourMajesty</li>
    </ul>
  `
  html = signal<SafeHtml>('')
  toc = signal<TocItem[]>([])
  constructor(private sanitizer: DomSanitizer) {
    const { html, toc } = generateTocAndHeadings(this.rawHtml)
    this.html.set(this.sanitizer.bypassSecurityTrustHtml(html))
    this.toc.set(toc)
  }
}
