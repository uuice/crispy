import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">系统管理</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 系统信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">系统信息</h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">系统版本</span>
              <span class="font-medium">1.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Node.js 版本</span>
              <span class="font-medium">v18.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">数据库版本</span>
              <span class="font-medium">PostgreSQL 14.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">运行环境</span>
              <span class="font-medium">Production</span>
            </div>
          </div>
        </div>

        <!-- 系统维护 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">系统维护</h2>
          <div class="space-y-4">
            <button
              class="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              清理缓存
            </button>
            <button
              class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              系统重启
            </button>
            <button
              class="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              备份数据
            </button>
          </div>
        </div>

        <!-- 日志查看 -->
        <div class="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 class="text-xl font-semibold mb-4">系统日志</h2>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <select
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="error">错误日志</option>
                <option value="access">访问日志</option>
                <option value="system">系统日志</option>
              </select>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                刷新日志
              </button>
            </div>
            <div class="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              <!-- TODO: Add log viewer component -->
              <pre class="text-sm font-mono">[2024-03-21 10:00:00] INFO: System started
[2024-03-21 10:01:00] INFO: Database connection established
[2024-03-21 10:02:00] INFO: Cache initialized</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SystemPage {
  // TODO: Implement system management logic
}
