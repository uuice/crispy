import React from 'react'
import BlogLayout from './layout'

interface ArchivePageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  article?: any
  previousArticle?: any
  nextArticle?: any
}

export default function ArchivePage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  article,
  previousArticle,
  nextArticle
}: ArchivePageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Post"
    >
      <div className="max-w-6xl mx-auto">
        {article ? (
          <article className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* 文章头部横幅 */}
            <div className="relative">
              {article.cover_image ? (
                <div className="h-80 relative overflow-hidden">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-4xl">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
                          📝 文章
                        </span>
                        {article.category_name && (
                          <a
                            href={`/categories/${article.category_alias}`}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                          >
                            {article.category_name}
                          </a>
                        )}
                      </div>
                      
                      <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {article.title}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>{new Date(article.create_time).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>{article.view_count || 0} 次浏览</span>
                        </div>
                        {article.author_name && (
                          <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{article.author_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 flex items-center justify-center p-8">
                  <div className="text-center text-white max-w-2xl">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                        📝 文章
                      </span>
                      {article.category_name && (
                        <a
                          href={`/categories/${article.category_alias}`}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium"
                        >
                          {article.category_name}
                        </a>
                      )}
                    </div>
                    <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{new Date(article.create_time).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span>{article.view_count || 0} 次浏览</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 文章内容 */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {article.summary && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                    <h3 className="text-lg font-semibold mb-3 text-blue-800">文章摘要</h3>
                    <p className="text-gray-700 leading-relaxed">{article.summary}</p>
                  </div>
                )}

                <div
                  className="custom-md"
                  dangerouslySetInnerHTML={{ __html: article.content || '<div class="text-center py-12"><p class="text-gray-500">暂无内容</p></div>' }}
                />
              </div>

              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">相关标签</h3>
                  <div className="flex flex-wrap gap-3">
                    {article.tags.map((tag: string) => (
                      <a
                        key={tag}
                        href={`/tags/${tag}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium hover:from-blue-200 hover:to-purple-200 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
                      >
                        #{tag}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 上下篇文章导航 */}
            {(previousArticle || nextArticle) && (
              <div className="px-8 py-8 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between gap-6">
                  {previousArticle ? (
                    <a
                      href={`/archives/${previousArticle.url}`}
                      className="flex items-center gap-4 p-6 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group flex-1"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-500 mb-1 font-medium">上一篇文章</div>
                        <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                          {previousArticle.title}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex-1"></div>
                  )}

                  {nextArticle ? (
                    <a
                      href={`/archives/${nextArticle.url}`}
                      className="flex items-center gap-4 p-6 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group flex-1"
                    >
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-sm text-gray-500 mb-1 font-medium">下一篇文章</div>
                        <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                          {nextArticle.title}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>
                  ) : (
                    <div className="flex-1"></div>
                  )}
                </div>
              </div>
            )}
          </article>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/30">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">未找到该文章</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              抱歉，没有找到您要查看的文章，可能已被删除或移动。
            </p>
            <a
              href="/archives"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              返回文章列表
            </a>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
