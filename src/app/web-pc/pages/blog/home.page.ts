import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'cs-home',
  standalone: true,
  imports: [AvatarModule, CardModule, ButtonModule],
  template: `
    <!-- Banner Section -->
    <section class="blog-banner">
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Banner" class="blog-banner-img" />
      <div class="blog-banner-content">
        <h1 class="blog-title">空色天絵 / NEO TOKYO NOIR 01</h1>
        <p class="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-2">A modern, minimal blog starter powered by Astro & Fuwari</p>
      </div>
    </section>
    <!-- Profile & Categories Section -->
    <section class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <!-- Profile Card -->
      <div class="blog-card items-center md:items-start">
        <p-avatar image="https://randomuser.me/api/portraits/men/32.jpg" size="xlarge" shape="circle" class="mb-4"></p-avatar>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lorem Ipsum</h2>
        <p class="text-gray-600 dark:text-gray-300 text-center md:text-left mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.</p>
        <div class="flex gap-3">
          <a href="#" class="blog-icon-blue hover:opacity-80" title="GitHub"><i class="pi pi-github text-xl"></i></a>
          <a href="#" class="blog-icon-pink hover:opacity-80" title="Twitter"><i class="pi pi-twitter text-xl"></i></a>
        </div>
      </div>
      <!-- Categories Card -->
      <div class="md:col-span-2 flex flex-col gap-6">
        <div class="blog-card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                                <div class="flex flex-wrap gap-3">
                        <span class="blog-tag blog-tag-blue text-sm">Examples (4)</span>
                        <span class="blog-tag blog-tag-green text-sm">Guides (1)</span>
                      </div>
        </div>
        <!-- Tags Card -->
        <div class="blog-card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span class="blog-tag blog-tag-gray">Blogging</span>
            <span class="blog-tag blog-tag-purple">Customization</span>
            <span class="blog-tag blog-tag-pink">Demo</span>
            <span class="blog-tag blog-tag-blue">Example</span>
            <span class="blog-tag blog-tag-green">Fuwari</span>
            <span class="blog-tag blog-tag-yellow">Markdown</span>
            <span class="blog-tag blog-tag-indigo">Video</span>
          </div>
        </div>
      </div>
    </section>
    <!-- Article List Section -->
    <section class="max-w-4xl mx-auto mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Posts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Article Card 1 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Markdown Extended Features" class="w-full h-40 object-cover" />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Markdown Extended Features</h3>
            <div class="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>2024-05-01</span>
              <span>·</span>
              <span>Examples</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-3">Read more about Markdown features in Fuwari.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
        <!-- Article Card 2 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80" alt="Expressive Code Example" class="w-full h-40 object-cover" />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expressive Code Example</h3>
            <div class="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>2024-04-10</span>
              <span>·</span>
              <span>Examples</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-3">How code blocks look in Markdown using Expressive Code.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
        <!-- Article Card 3 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80" alt="Simple Guides for Fuwari" class="w-full h-40 object-cover" />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Simple Guides for Fuwari</h3>
            <div class="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>2024-04-01</span>
              <span>·</span>
              <span>Guides</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-3">How to use this blog template.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
        <!-- Article Card 4 -->
        <p-card class="blog-card overflow-hidden">
          <ng-template pTemplate="header">
            <img src="https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=600&q=80" alt="Markdown Example" class="w-full h-40 object-cover" />
          </ng-template>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Markdown Example</h3>
            <div class="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>2023-10-01</span>
              <span>·</span>
              <span>Examples</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-3">A simple example of a Markdown blog post.</p>
            <a href="#" class="blog-icon-blue hover:opacity-80">Read more</a>
          </div>
        </p-card>
      </div>
    </section>
  `
})
export class HomePage {}
