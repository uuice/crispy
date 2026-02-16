import React from 'react'
import BlogLayout from './layout'

interface DailyLibsPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  archiveGroups?: Array<{ year: string; items: any[] }>
  category?: any
}

export default function DailyLibsPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  archiveGroups = [],
  category
}: DailyLibsPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="DailyLib"
    >
      <div className="max-w-6xl mx-auto">
        {/* 每日库头部 */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-lg font-medium bg-white/20 px-4 py-2 rounded-full">
                  📚 每日库
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6">每日库</h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl">
                每日推荐一个优秀的开源库或工具，帮助开发者发现和学习新的技术工具。
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C5.595 5.027 4.878 4 4 4 2.365 4 1 5.365 1 7c0 1.75.95 3.25 2.388 4.06.725.344 1.51.529 2.312.529.802 0 1.587-.185 2.312-.529 1.438-.811 2.388-2.311 2.388-4.06 0-1.635-.95-3-2.388-3-.802 0-1.587.185-2.312.529z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">精选推荐</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">每日更新</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {archiveGroups.length > 0 ? (
          <div className="space-y-12">
            {archiveGroups.map((group) => (
              <div key={group.year} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{group.year}</h2>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
                      {group.items.length} 个推荐
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((article: any, index: number) => (
                      <article
                        key={article.id}
                        className="group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                      >
                        <div className="relative h-32 bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                              <span className="text-2xl font-bold">{article.title?.charAt(0) || '库'}</span>
                            </div>
                            <h3 className="text-lg font-bold">{article.title}</h3>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {article.summary || article.content?.substring(0, 100) + '...'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {new Date(article.create_time).toLocaleDateString('zh-CN', {
                                month: '2-digit',
                                day: '2-digit'
                              })}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              {article.view_count || 0}
                            </div>
                          </div>
                          <div className="mt-3">
                            <a
                              href={`/daily-libs/${article.url}`}
                              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                              <span>查看详情</span>
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/30">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">暂无推荐</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              还没有发布任何库推荐，敬请期待每日精选的优质开源项目！
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              返回首页
            </a>
          </div>
        )}

        {/* 说明信息 */}
        <div className="card-base p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">关于每日库</h3>
          <div className="prose prose-sm max-w-none text-[var(--btn-content)]">
            <p>
              每日库是一个专门推荐优秀开源库和工具的栏目。每天精选一个值得关注的项目，
              帮助开发者发现和学习新的技术工具。
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[var(--btn-plain-bg-hover)] rounded-lg">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">⭐</span>
                </div>
                <h4 className="font-medium mb-1">精选推荐</h4>
                <p className="text-xs text-[var(--btn-content)]">
                  每日精选优质开源项目
                </p>
              </div>
              <div className="text-center p-4 bg-[var(--btn-plain-bg-hover)] rounded-lg">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">📚</span>
                </div>
                <h4 className="font-medium mb-1">学习资源</h4>
                <p className="text-xs text-[var(--btn-content)]">
                  提供详细的学习和使用指南
                </p>
              </div>
              <div className="text-center p-4 bg-[var(--btn-plain-bg-hover)] rounded-lg">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">🚀</span>
                </div>
                <h4 className="font-medium mb-1">实用工具</h4>
                <p className="text-xs text-[var(--btn-content)]">
                  推荐实用的开发工具和库
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}
