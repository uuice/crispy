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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-lg font-medium bg-white/20 px-4 py-2 rounded-full">
                  文章分类
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                {currentCategory?.name || '全部分类'}
              </h1>
              {currentCategory?.description ? (
                <p className="text-xl opacity-90 mb-8 max-w-2xl">
                  {currentCategory.description}
                </p>
              ) : (
                <p className="text-xl opacity-90 mb-8 max-w-2xl">
                  浏览 {currentCategory?.name || '该'} 分类下的所有精彩文章
                </p>
              )}
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{articleList.length} 篇文章</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">持续更新</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {articleList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {articleList.map((article: any, index: number) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative">
                  {article.cover_image ? (
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                      {article.category_name && (
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                            {article.category_name}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold">精彩内容</h3>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    <a
                      href={`/archives/${article.url}`}
                      className="text-gray-800 hover:text-purple-600 transition-colors"
                    >
                      {article.title}
                    </a>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.summary || article.content?.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(article.create_time).toLocaleDateString('zh-CN', {
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {article.view_count || 0}
                      </span>
                    </div>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/30">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">该分类下暂无文章</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {currentCategory
                ? `分类 "${currentCategory.name}" 下还没有文章，敬请期待更多精彩内容！`
                : '未找到指定分类'}
            </p>
            <a
              href="/archives"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              浏览所有文章
            </a>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
