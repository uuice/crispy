import React from 'react'
import BlogLayout from './layout'

interface IndexPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  hotArticleList?: any[]
}

export default function IndexPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  hotArticleList = []
}: IndexPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Index"
    >
      <div className="space-y-12">
        {/* Hero Banner 区域 */}
        <div className="relative overflow-hidden rounded-3xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-16 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6">发现优秀前端库</h1>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                {siteConfig?.description || '分享实用的前端工具和框架，帮助开发者提高效率'}
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <a
                  href="/daily-libs"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <span>🔍</span>
                  浏览前端库
                </a>
                <a
                  href="/about"
                  className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                >
                  <span>👤</span>
                  关于我们
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 热门前端库 */}
        {hotArticleList.length > 0 && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🔥</span>
                </div>
                热门前端库
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">实时更新</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{hotArticleList.length}个精选</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotArticleList.slice(0, 4).map((lib: any, index: number) => (
                <a
                  key={lib.id}
                  href={`/daily-libs/${lib.url}`}
                  className="group block bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 mb-2">
                        {lib.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {lib.summary || '这个工具可以帮助你解决开发中的实际问题'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500 gap-3">
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
                        {lib.category_name && (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium">
                            {lib.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="/daily-libs"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>看查看全部热门库</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* 最新前端库列表 */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🆕</span>
              </div>
              最新前端库
            </h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">每日更新</span>
              <a
                href="/daily-libs"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
              >
                全部库
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <a
                key={i}
                href="#"
                className="group block bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      JS
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">第{i}个前端库示例</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">NEW</span>
                      </div>
                      <p className="text-gray-600 mb-3">实用的前端开发工具，接口简单易用，功能丰富，能有效提升开发效率。</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>⭐</span>
                          4.8 评分
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📥</span>
                          10K+ 下载
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          2024-01-0{i}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">更新时间</div>
                    <div className="text-lg font-bold text-blue-600">2024-01-0{i}</div>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium">JavaScript</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}
