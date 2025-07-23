import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'cs-links',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <!-- Links Banner -->
    <section class="blog-banner">
      <div class="blog-banner-content">
        <h1 class="blog-title text-main">链接</h1>
      </div>
    </section>
    <!-- Links Content (Grouped & Optimized) -->
    <section class="max-w-2xl mx-auto mb-16 px-2 sm:px-4 flex flex-col gap-10">
      <!-- Personal Blogs Card -->
      <div class="blog-card">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-user blog-icon"></i>
          <h2 class="text-lg font-semibold text-main">个人博客</h2>
        </div>
        <ul class="flex flex-col gap-3">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag">Fuwari Official</span>
            <span class="text-muted text-xs">Minimal blog starter</span>
            <a href="https://fuwari.vercel.app/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon hover:opacity-80"
              ></p-button>
            </a>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag">Overreacted</span>
            <span class="text-muted text-xs">Dan Abramov's blog</span>
            <a href="https://overreacted.io/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon hover:opacity-80"
              ></p-button>
            </a>
          </li>
        </ul>
      </div>
      <!-- Resource Sites Card -->
      <div class="blog-card">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-globe blog-icon"></i>
          <h2 class="text-lg font-semibold text-main">资源站点</h2>
        </div>
        <ul class="flex flex-col gap-3">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag">Unsplash</span>
            <span class="text-muted text-xs">Free photos</span>
            <a href="https://unsplash.com/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon hover:opacity-80"
              ></p-button>
            </a>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag">Google Fonts</span>
            <span class="text-muted text-xs">Web fonts</span>
            <a href="https://fonts.google.com/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon hover:opacity-80"
              ></p-button>
            </a>
          </li>
        </ul>
      </div>
      <!-- Projects / Source Code Card -->
      <div class="blog-card">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-github blog-icon"></i>
          <h2 class="text-lg font-semibold text-main">项目 / 源码</h2>
        </div>
        <ul class="flex flex-col gap-3">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag">Fuwari GitHub</span>
            <span class="text-muted text-xs">Source code</span>
            <a href="https://github.com/saicaca/fuwari" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon hover:opacity-80"
              ></p-button>
            </a>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag">Angular</span>
            <span class="text-muted text-xs">Angular source</span>
            <a href="https://github.com/angular/angular" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon hover:opacity-80"
              ></p-button>
            </a>
          </li>
        </ul>
      </div>
    </section>
  `,
  styles: [``]
})
export class LinksPage {}
