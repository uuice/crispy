import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-special-tags',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">特殊标签管理</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <!-- 工具栏 -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="搜索特殊标签..."
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
            新建特殊标签
          </button>
        </div>

        <!-- 特殊标签列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- 特殊标签卡片 -->
          <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold">置顶标签</h3>
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                系统标签
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4">用于标记需要置顶显示的内容</p>
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <button class="text-blue-600 hover:text-blue-900 text-sm">编辑</button>
                <button class="text-red-600 hover:text-red-900 text-sm">删除</button>
              </div>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-2">使用次数：</span>
                <span class="font-medium">128</span>
              </div>
            </div>
          </div>

          <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold">精华标签</h3>
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                自定义标签
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4">用于标记高质量的内容</p>
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <button class="text-blue-600 hover:text-blue-900 text-sm">编辑</button>
                <button class="text-red-600 hover:text-red-900 text-sm">删除</button>
              </div>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-2">使用次数：</span>
                <span class="font-medium">256</span>
              </div>
            </div>
          </div>

          <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold">推荐标签</h3>
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                热门标签
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4">用于标记推荐给用户的内容</p>
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <button class="text-blue-600 hover:text-blue-900 text-sm">编辑</button>
                <button class="text-red-600 hover:text-red-900 text-sm">删除</button>
              </div>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-2">使用次数：</span>
                <span class="font-medium">512</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            显示 1 到 3 条，共 10 条
          </div>
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              上一页
            </button>
            <button
              class="px-3 py-1 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SpecialTagsPage {
  // TODO: Implement special tags management logic
}
