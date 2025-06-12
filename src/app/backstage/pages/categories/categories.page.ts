import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'cs-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">分类管理</h1>
      <!-- TODO: Add categories management interface -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="搜索分类..."
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              搜索
            </button>
          </div>
          <button
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            新建分类
          </button>
        </div>
        <!-- TODO: Add categories tree/table component -->
      </div>
    </div>
  `
})
export class CategoriesPage {
  // TODO: Implement categories management logic
}
