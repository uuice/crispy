import { Component, signal } from '@angular/core'
import { generateTocAndHeadings, TocItem } from 'src/utils/markdown'
import { TocComponent } from '../../components/blog/toc.component'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'cs-pages',
  standalone: true,
  imports: [TocComponent],
  template: `
    <!-- Pages Banner -->
    <section class="blog-banner">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        alt="Banner"
        class="blog-banner-img"
      />
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">页面Title</h1>
      </div>
    </section>
    <!-- Pages Content -->
    <section class="blog-section">
      <div class="blog-prose text-main" [innerHTML]="html()"></div>
    </section>
    <cs-toc [toc]="toc" />
  `,
  styles: []
})
export class PagesPage {
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
