import React from 'react'
import BlogLayout from './layout'

interface NavigationPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
}

export default function NavigationPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl
}: NavigationPageProps) {
  // 示例导航数据
  const navigationItems = [
    {
      id: 1,
      name: 'React 官网',
      url: 'https://react.dev',
      description: '用于构建用户界面的 JavaScript 库',
      category: 'UI Framework',
      icon: '⚛️'
    },
    {
      id: 2,
      name: 'Vue 官网',
      url: 'https://vuejs.org',
      description: '渐进式 JavaScript 框架',
      category: 'UI Framework',
      icon: '💚'
    },
    {
      id: 3,
      name: 'TypeScript',
      url: 'https://www.typescriptlang.org',
      description: 'JavaScript 的超集，添加静态类型检查',
      category: 'Language',
      icon: '🔵'
    },
    {
      id: 4,
      name: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: '功能优先的 CSS 框架',
      category: 'CSS Framework',
      icon: '🔷'
    },
    {
      id: 5,
      name: 'Webpack',
      url: 'https://webpack.js.org',
      description: '模块打包工具',
      category: 'Build Tool',
      icon: '📦'
    },
    {
      id: 6,
      name: 'Vite',
      url: 'https://vitejs.dev',
      description: '下一代前端构建工具',
      category: 'Build Tool',
      icon: '⚡'
    }
  ]

  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Navigation"
    >
      <div className="max-w-6xl mx-auto">
        {/* 导航页头部 */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-lg font-medium bg-white/20 px-4 py-2 rounded-full">
                  前端资源导航
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                精选前端资源
              </h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl">
                收集最实用的前端开发工具、框架和库，助力高效开发
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{navigationItems.length} 个精选资源</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">持续更新</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 导航分类 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {['All', 'UI Framework', 'CSS Framework', 'Build Tool', 'Language'].map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full font-medium hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 导航资源列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </BlogLayout>
  )
}
