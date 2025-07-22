import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'cs-archives',
  standalone: true,
  imports: [TabViewModule, TagModule],
  template: `
    <!-- Archive Page Tabs -->
    <section class="max-w-4xl mx-auto mb-16">
      <h1 class="text-3xl font-bold text-main mb-8">Archive</h1>
      <p-tabView>
        <!-- Category Archive Tab -->
        <p-tabPanel header="By Category">
          <div class="space-y-8">
            <!-- Example Category Block -->
            <div class="blog-card p-card">
              <h2 class="text-xl font-semibold text-main mb-2">Examples</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-05-01</span>
                  <span class="font-medium text-main">Markdown Extended Features</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-04-10</span>
                  <span class="font-medium text-main">Expressive Code Example</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2023-10-01</span>
                  <span class="font-medium text-main">Markdown Example</span>
                </li>
              </ul>
            </div>
            <div class="blog-card p-card">
              <h2 class="text-xl font-semibold text-main mb-2">Guides</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-04-01</span>
                  <span class="font-medium text-main">Simple Guides for Fuwari</span>
                </li>
              </ul>
            </div>
          </div>
        </p-tabPanel>
        <!-- Tag Archive Tab -->
        <p-tabPanel header="By Tag">
          <div class="space-y-8">
            <!-- Example Tag Block -->
            <div class="blog-card p-card">
              <h2 class="text-xl font-semibold text-main mb-2">Blogging</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2023-10-01</span>
                  <span class="font-medium text-main">Markdown Example</span>
                </li>
              </ul>
            </div>
            <div class="blog-card p-card">
              <h2 class="text-xl font-semibold text-main mb-2">Demo</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-05-01</span>
                  <span class="font-medium text-main">Markdown Extended Features</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-04-10</span>
                  <span class="font-medium text-main">Expressive Code Example</span>
                </li>
              </ul>
            </div>
            <div class="blog-card p-card">
              <h2 class="text-xl font-semibold text-main mb-2">Guides</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-04-01</span>
                  <span class="font-medium text-main">Simple Guides for Fuwari</span>
                </li>
              </ul>
            </div>
          </div>
        </p-tabPanel>
        <!-- Date Archive Tab -->
        <p-tabPanel header="By Date">
          <div class="space-y-8">
            <!-- Example Year Block -->
            <div class="blog-card p-card">
              <h2 class="text-xl font-semibold text-main mb-2">2024</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-05-01</span>
                  <span class="font-medium text-main">Markdown Extended Features</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-04-10</span>
                  <span class="font-medium text-main">Expressive Code Example</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2024-04-01</span>
                  <span class="font-medium text-main">Simple Guides for Fuwari</span>
                </li>
              </ul>
            </div>
            <div class="blog-card p-card">
              <h2 class="text-xl font-semibold text-main mb-2">2023</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon">2023-10-01</span>
                  <span class="font-medium text-main">Markdown Example</span>
                </li>
              </ul>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </section>
  `,
  styles: [
    `
      .blog-card, .p-card { background: var(--p-content-background) !important; color: var(--p-text-color) !important; border: 1px solid var(--p-content-border-color) !important; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      .blog-section { background: var(--p-content-background) !important; color: var(--p-text-color) !important; border: 1px solid var(--p-content-border-color) !important; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      .blog-banner-content { color: var(--p-text-color) !important; }
      .blog-title { color: var(--p-text-color) !important; }
      .text-main { color: var(--p-text-color) !important; }
      .text-muted { color: var(--p-text-muted-color) !important; }
      .blog-icon { color: var(--p-primary-color) !important; }
      .border-content { border-color: var(--p-content-border-color) !important; }
      .rounded-xl { border-radius: 1rem !important; }
      .shadow { box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important; }
      .text-xs { font-size: 0.85rem !important; }
      .text-lg { font-size: 1.25rem !important; }
      .text-2xl { font-size: 2rem !important; }
      .font-semibold { font-weight: 600 !important; }
      .font-bold { font-weight: 700 !important; }
    `
  ]
})
export class ArchivesPage {}
