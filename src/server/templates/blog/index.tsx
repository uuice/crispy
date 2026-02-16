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
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">欢迎来到</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                探索<span className="text-yellow-300">技术</span>的无限可能
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl">
                {siteConfig?.description || '分享前沿技术见解，记录编程旅程中的每一个精彩瞬间'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/archives"
                  className="inline-flex items-center px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  浏览精选文章
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-xl font-semibold transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  了解更多故事
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-t from-white/10 to-transparent rounded-tl-full"></div>
        </div>

        {/* 热门文章 */}
        {hotArticleList.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
            <div className="flex items-center mb-8">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold text-gray-800">🔥 热门精选</h2>
              <div className="ml-auto flex items-center">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {hotArticleList.length} 篇精选文章
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hotArticleList.slice(0, 4).map((article: any, index: number) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  {article.cover_image && (
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          #{index + 1} 热门
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      <a
                        href={`/archives/${article.url}`}
                        className="text-gray-800 hover:text-purple-600 transition-colors"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {article.summary || article.content?.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                          <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {new Date(article.create_time).toLocaleDateString('zh-CN', {
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </span>
                        {article.category_name && (
                          <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-medium">
                            {article.category_name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                          <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {article.view_count || 0}
                        </span>
                        <span className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          HOT
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 最新文章列表 */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--line-divider)]">
            <h2 className="text-2xl font-bold">最新文章</h2>
            <a
              href="/archives"
              className="text-[var(--primary)] hover:underline text-sm font-medium"
            >
              查看更多 →
            </a>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article
                key={i}
                className="card-base p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      <a
                        href="#"
                        className="text-[var(--deep-text)] group-hover:text-[var(--primary)] transition-colors"
                      >
                        这是第{i}篇文章的标题 - 展示博客文章列表的样式
                      </a>
                    </h3>
                    <p className="text-[var(--btn-content)] mb-4 line-clamp-2">
                      这里是文章的摘要内容，用于展示文章的主要内容。摘要应该简洁明了，
                      能够吸引读者继续阅读完整文章。这里可以包含一些关键信息或者文章亮点。
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--btn-content)]">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        2024-01-0{i}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {Math.floor(Math.random() * 100) + 10}
                      </span>
                      <span className="px-2 py-1 bg-[var(--btn-regular-bg)] rounded-full">
                        技术分享
                      </span>
                    </div>
                  </div>
                  <div className="md:w-24 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}
