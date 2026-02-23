import React from 'react'
import BlogLayout from './layout'

interface TagsPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  currentTag?: any
  articleList?: any[]
}

export default function TagsPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  currentTag,
  articleList = []
}: TagsPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Tag"
    >
      <div className="max-w-6xl mx-auto">
        {/* 标签头部 */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🏷️</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <h1 className="text-4xl font-bold">标签:</h1>
                {currentTag && (
                  <span className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-bold text-xl shadow-lg">
                    #{currentTag.title}
                  </span>
                )}
              </div>
              <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
                {currentTag?.description || `查看与 "${currentTag?.title || '该'}" 标签相关的前端工具`}
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span>📚</span>
                  <span className="font-medium">{articleList.length} 个相关库</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span>🔥</span>
                  <span className="font-medium">热门标签</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {articleList.length > 0 ? (
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articleList.map((lib: any, index: number) => (
                <a
                  key={lib.id}
                  href={`/daily-libs/${lib.url}`}
                  className="group block bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                      <span className="text-2xl">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600">
                          {lib.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-xs font-medium">🔥</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {lib.summary || '这个工具在实际项目中很有用'}
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
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium">
                              {lib.category_name}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-xs">精选</span>
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
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
              >
                <span>查看所有相关库</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">该标签下暂无前端库</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {currentTag
                ? `标签 "${currentTag.title}" 下还没有前端库，敬请期待更多精彩内容！`
                : '未找到指定标签'}
            </p>
            <a
              href="/daily-libs"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              浏览所有前端库
            </a>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
