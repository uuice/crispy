import React from 'react'
import BlogLayout from './layout'

interface CategoriesPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  currentCategory?: any
  articleList?: any[]
}

export default function CategoriesPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  currentCategory,
  articleList = []
}: CategoriesPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Category"
    >
      <div className="max-w-6xl mx-auto">
        {/* 分类头部 */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📁</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {currentCategory?.name || '全部分类'}
              </h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                {currentCategory?.description || `查看 ${currentCategory?.name || '该'} 分类下的前端工具和框架`}
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span>📚</span>
                  <span className="font-medium">{articleList.length} 个库</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span>🔄</span>
                  <span className="font-medium">持续更新</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {articleList.length > 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articleList.map((lib: any, index: number) => (
                <a
                  key={lib.id}
                  href={`/daily-libs/${lib.url}`}
                  className="group block bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                      {lib.title?.charAt(0) || '库'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                          {lib.title}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">#{index + 1}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {lib.summary || '实用的前端开发工具，解决实际开发问题'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            {new Date(lib.create_time).toLocaleDateString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>👁️</span>
                            {lib.view_count || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lib.category_name && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium">
                              {lib.category_name}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">推荐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="/daily-libs"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                <span>查看所有前端库</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/30">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">该分类下暂无前端库</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {currentCategory
                ? `分类 "${currentCategory.name}" 下还没有前端库，敬请期待更多精彩内容！`
                : '未找到指定分类'}
            </p>
            <a
              href="/daily-libs"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              浏览所有前端库
            </a>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
