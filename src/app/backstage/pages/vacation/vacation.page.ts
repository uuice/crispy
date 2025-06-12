import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-vacation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">假期管理</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <!-- 工具栏 -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="搜索假期..."
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
            新建假期
          </button>
        </div>

        <!-- 假期列表 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  假期名称
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  开始时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  结束时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- TODO: Add vacation list data -->
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">春节假期</td>
                <td class="px-6 py-4 whitespace-nowrap">2024-02-10</td>
                <td class="px-6 py-4 whitespace-nowrap">2024-02-17</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    已结束
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                  <button class="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            显示 1 到 10 条，共 20 条
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
export class VacationPage {
  // TODO: Implement vacation management logic
}
