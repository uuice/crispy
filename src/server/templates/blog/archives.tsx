import React from 'react'
import BlogLayout from './layout'

interface ArchivesPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  archiveGroups?: Array<{ year: string; items: any[] }>
}

export default function ArchivesPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  archiveGroups = []
}: ArchivesPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Archive"
    >
      <div className="max-w-6xl mx-auto">
        {/* 归档头部 */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-500"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-lg font-medium bg-white/20 px-4 py-2 rounded-full">
                  📚 文章归档
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6">文章归档</h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl">
                按时间顺序查看所有文章，回顾创作历程和知识积累。
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">时间轴</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">持续更新</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {archiveGroups.length > 0 ? (
          <div className="space-y-12">
            {archiveGroups.map((group) => (
              <div key={group.year} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{group.year}</h2>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
                      {group.items.length} 篇文章
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {group.items.map((article: any, index: number) => (
                      <article
                        key={article.id}
                        className="group bg-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-amber-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold mb-2 group-hover:text-amber-600 transition-colors">
                                <a
                                  href={`/archives/${article.url}`}
                                  className="text-gray-800 hover:text-amber-600 transition-colors line-clamp-2"
                                >
                                  {article.title}
                                </a>
                              </h3>
                              {article.summary && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                  {article.summary}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-gray-500 flex-shrink-0">
                            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {new Date(article.create_time).toLocaleDateString('zh-CN', {
                                month: '2-digit',
                                day: '2-digit'
                              })}
                            </div>
                            {article.category_name && (
                              <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-xs font-medium">
                                {article.category_name}
                              </span>
                            )}
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
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">暂无文章</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              还没有发布任何文章，敬请期待更多精彩内容！
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              返回首页
            </a>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
