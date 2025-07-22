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
        <h1 class="blog-title">Links</h1>
      </div>
    </section>
    <!-- Links Content (Grouped & Optimized) -->
    <section class="max-w-2xl mx-auto mb-16 px-2 sm:px-4 flex flex-col gap-10">
      <!-- Personal Blogs Card -->
      <div class="blog-card">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-user blog-icon-blue"></i>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Blogs</h2>
        </div>
        <ul class="flex flex-col gap-3">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag blog-tag-blue">Fuwari Official</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs">Minimal blog starter</span>
            <a href="https://fuwari.vercel.app/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon-blue hover:opacity-80"
              ></p-button>
            </a>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag blog-tag-pink">Overreacted</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs">Dan Abramov's blog</span>
            <a href="https://overreacted.io/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon-pink hover:opacity-80"
              ></p-button>
            </a>
          </li>
        </ul>
      </div>
      <!-- Resource Sites Card -->
      <div class="blog-card">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-globe blog-icon-green"></i>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Resource Sites</h2>
        </div>
        <ul class="flex flex-col gap-3">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag blog-tag-green">Unsplash</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs">Free photos</span>
            <a href="https://unsplash.com/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon-green hover:opacity-80"
              ></p-button>
            </a>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag blog-tag-yellow">Google Fonts</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs">Web fonts</span>
            <a href="https://fonts.google.com/" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon-yellow hover:opacity-80"
              ></p-button>
            </a>
          </li>
        </ul>
      </div>
      <!-- Projects / Source Code Card -->
      <div class="blog-card">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-github blog-icon-gray"></i>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Projects / Source Code
          </h2>
        </div>
        <ul class="flex flex-col gap-3">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag blog-tag-gray">Fuwari GitHub</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs">Source code</span>
            <a href="https://github.com/saicaca/fuwari" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon-gray hover:opacity-80"
              ></p-button>
            </a>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="blog-tag blog-tag-indigo">Angular</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs">Angular source</span>
            <a href="https://github.com/angular/angular" target="_blank" rel="noopener">
              <p-button
                label="Visit"
                icon="pi pi-external-link"
                size="small"
                styleClass="p-button-text p-button-sm blog-icon-indigo hover:opacity-80"
              ></p-button>
            </a>
          </li>
        </ul>
      </div>
    </section>
  `
})
export class LinksPage {}
