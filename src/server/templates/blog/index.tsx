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
      <div className="space-y-8">
        {/* Banner 区域 */}
        <div className="card-base overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 p-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">欢迎来到我的博客</h1>
              <p className="text-xl opacity-90 mb-6">
                {siteConfig?.description || '分享技术心得，记录学习成长的点点滴滴'}
              </p>
              <div className="flex space-x-4">
                <a
                  href="/archives"
                  className="btn-regular bg-white text-[var(--primary)] hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-all"
                >
                  浏览文章
                </a>
                <a
                  href="/about"
                  className="btn-regular bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-all"
                >
                  了解更多
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 热门文章 */}
        {hotArticleList.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-[var(--line-divider)]">
              热门文章
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotArticleList.slice(0, 4).map((article: any) => (
                <article
                  key={article.id}
                  className="card-base overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {article.cover_image && (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      <a
                        href={`/archives/${article.url}`}
                        className="text-[var(--deep-text)] hover:text-[var(--primary)] transition-colors"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="text-[var(--btn-content)] mb-4 line-clamp-3">
                      {article.summary || article.content?.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-[var(--btn-content)]">
                      <div className="flex items-center space-x-4">
                        <span>{new Date(article.create_time).toLocaleDateString()}</span>
                        {article.category_name && (
                          <span className="px-2 py-1 bg-[var(--btn-regular-bg)] rounded-full">
                            {article.category_name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {article.view_count || 0}
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
