import { Component, Input, Signal } from '@angular/core'
import { TocItem } from 'src/utils/markdown'

@Component({
  selector: 'cs-toc',
  standalone: true,
  template: `
    <nav class="toc-nav-fixed">
      <div class="blog-card" style="padding: 1.25rem;">
        <div class="font-bold text-main mb-2">目录</div>
        <ul class="toc-list">
          @for (item of toc(); track item.id) {
            <li class="text-main mb-1">
              <a href="" [id]="item.id" class="text-main" (click)="scrollTo(item.id, $event)">{{
                item.text
              }}</a>
            </li>
          }
        </ul>
      </div>
    </nav>
  `,
  styles: [
    `
      .toc-nav-fixed {
        position: fixed;
        top: 120px;
        left: calc(50% + 35rem);
        margin-left: 0;
        min-width: 220px;
        max-width: 260px;
        z-index: 20;
        align-self: flex-start;
        display: block;
      }
      @media (max-width: 1200px) {
        .toc-nav-fixed {
          display: none;
        }
      }
      .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .toc-list li {
        margin-bottom: 0.5rem;
      }
      .toc-list a {
        text-decoration: none;
        color: var(--p-text-color);
        transition: color 0.15s;
      }
      .toc-list a:hover {
        color: var(--p-primary-color);
      }
    `
  ]
})
export class TocComponent {
  @Input({ required: true }) toc!: Signal<TocItem[]>

  scrollTo(id: string, event: Event) {
    event.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const navHeight = 80 // 可根据实际导航栏高度调整
      const y = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}
