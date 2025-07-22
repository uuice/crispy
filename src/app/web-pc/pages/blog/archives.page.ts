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
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Archive</h1>
      <p-tabView>
        <!-- Category Archive Tab -->
        <p-tabPanel header="By Category">
          <div class="space-y-8">
            <!-- Example Category Block -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Examples</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2024-05-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Markdown Extended Features</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2024-04-10</span>
                  <span class="font-medium text-gray-900 dark:text-white">Expressive Code Example</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2023-10-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Markdown Example</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Guides</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon-green">2024-04-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Simple Guides for Fuwari</span>
                </li>
              </ul>
            </div>
          </div>
        </p-tabPanel>
        <!-- Tag Archive Tab -->
        <p-tabPanel header="By Tag">
          <div class="space-y-8">
            <!-- Example Tag Block -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Blogging</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2023-10-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Markdown Example</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Demo</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2024-05-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Markdown Extended Features</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2024-04-10</span>
                  <span class="font-medium text-gray-900 dark:text-white">Expressive Code Example</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Guides</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon-green">2024-04-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Simple Guides for Fuwari</span>
                </li>
              </ul>
            </div>
          </div>
        </p-tabPanel>
        <!-- Date Archive Tab -->
        <p-tabPanel header="By Date">
          <div class="space-y-8">
            <!-- Example Year Block -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">2024</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2024-05-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Markdown Extended Features</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2024-04-10</span>
                  <span class="font-medium text-gray-900 dark:text-white">Expressive Code Example</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="blog-icon-green">2024-04-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Simple Guides for Fuwari</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">2023</h2>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="blog-icon-blue">2023-10-01</span>
                  <span class="font-medium text-gray-900 dark:text-white">Markdown Example</span>
                </li>
              </ul>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </section>
  `
})
export class ArchivesPage {}
