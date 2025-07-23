import { Component } from '@angular/core'
import { AvatarModule } from 'primeng/avatar'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'cs-home',
  standalone: true,
  imports: [AvatarModule, CardModule, ButtonModule],
  template: `
    <!-- Article List Section -->
    <section class="max-w-4xl mx-auto mb-16">
      <h2 class="text-2xl font-bold mb-6">最新文章</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Article Card 1 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
              alt="Markdown Extended Features"
              class="w-full h-40 object-cover"
            />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">Markdown Extended Features</h3>
            <div class="flex gap-2 text-xs mb-2 text-muted">
              <span>2024-05-01</span>
              <span>·</span>
              <span>Examples</span>
            </div>
            <p class="mb-3">Read more about Markdown features in Fuwari.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
        <!-- Article Card 2 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
              alt="Expressive Code Example"
              class="w-full h-40 object-cover"
            />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">Expressive Code Example</h3>
            <div class="flex gap-2 text-xs mb-2 text-muted">
              <span>2024-04-10</span>
              <span>·</span>
              <span>Examples</span>
            </div>
            <p class="mb-3">How code blocks look in Markdown using Expressive Code.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
        <!-- Article Card 3 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img
              src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"
              alt="Simple Guides for Fuwari"
              class="w-full h-40 object-cover"
            />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">Simple Guides for Fuwari</h3>
            <div class="flex gap-2 text-xs mb-2 text-muted">
              <span>2024-04-01</span>
              <span>·</span>
              <span>Guides</span>
            </div>
            <p class="mb-3">How to use this blog template.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
        <!-- Article Card 4 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img
              src="https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=600&q=80"
              alt="Markdown Example"
              class="w-full h-40 object-cover"
            />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">Markdown Example</h3>
            <div class="flex gap-2 text-xs mb-2 text-muted">
              <span>2023-10-01</span>
              <span>·</span>
              <span>Examples</span>
            </div>
            <p class="mb-3">A simple example of a Markdown blog post.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
      </div>
    </section>
  `,
  styles: [
    `
      .bg-content {
        background: var(--p-content-background) !important;
      }
      .text-main {
        color: var(--p-text-color) !important;
      }
      .text-muted {
        color: var(--p-text-muted-color) !important;
      }
      .border-content {
        border-color: var(--p-content-border-color) !important;
      }
      .rounded-xl {
        border-radius: 1rem !important;
      }
      .shadow {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
      }
      .blog-card,
      .p-card {
        background: var(--p-content-background) !important;
        color: var(--p-text-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      .blog-banner-content {
        color: var(--p-text-color) !important;
      }
      .blog-title {
        color: var(--p-text-color) !important;
      }
      .blog-prose {
        color: var(--p-text-color) !important;
      }
      .text-xs {
        font-size: 0.85rem !important;
      }
      .text-lg {
        font-size: 1.25rem !important;
      }
      .text-2xl {
        font-size: 2rem !important;
      }
      .font-semibold {
        font-weight: 600 !important;
      }
      .font-bold {
        font-weight: 700 !important;
      }
    `
  ]
})
export class HomePage {}
