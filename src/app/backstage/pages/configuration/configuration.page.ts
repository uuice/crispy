import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'cs-configuration',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">配置管理</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 基本配置 -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">基本配置</h2>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">网站标题</label>
              <input
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入网站标题"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">网站描述</label>
              <textarea
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="输入网站描述"
              ></textarea>
            </div>
          </div>

          <!-- 高级配置 -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">高级配置</h2>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">系统主题</label>
              <select
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">浅色主题</option>
                <option value="dark">深色主题</option>
                <option value="auto">跟随系统</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">时区设置</label>
              <select
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC+8">UTC+8 (北京时间)</option>
                <option value="UTC+0">UTC+0 (格林威治时间)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            重置
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfigurationPage {
  // TODO: Implement configuration management logic
}
