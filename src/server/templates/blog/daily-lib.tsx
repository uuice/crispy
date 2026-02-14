import React from 'react'
import BlogLayout from './layout'

interface DailyLibPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  article?: any
  previousArticle?: any
  nextArticle?: any
}

export default function DailyLibPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  article,
  previousArticle,
  nextArticle
}: DailyLibPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="DailyLib"
    >
      <div className="max-w-4xl">
        {article ? (
          <article className="card-base">
            {/* 文章头部 */}
            <div className="p-8 border-b border-[var(--line-divider)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
                  {article.title?.charAt(0) || '库'}
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm font-medium mb-2">
                    每日库推荐
                  </span>
                  <h1 className="text-3xl font-bold text-[var(--deep-text)] mt-2">
                    {article.title}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--btn-content)]">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {new Date(article.create_time).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {article.view_count || 0} 次浏览
                </span>
                {article.category_name && (
                  <span className="px-3 py-1 bg-[var(--btn-regular-bg)] rounded-full">
                    {article.category_name}
                  </span>
                )}
              </div>
            </div>

            {/* 文章内容 */}
            <div className="p-8">
              {article.cover_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none dark:prose-invert">
                {article.summary && (
                  <div className="bg-[var(--btn-plain-bg-hover)] border-l-4 border-[var(--primary)] p-6 mb-8 rounded-r-lg">
                    <h3 className="text-lg font-semibold mb-2">简介</h3>
                    <p className="text-[var(--btn-content)]">{article.summary}</p>
                  </div>
                )}

                <div
                  className="custom-md"
                  dangerouslySetInnerHTML={{ __html: article.content || '暂无内容' }}
                />
              </div>

              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[var(--line-divider)]">
                  <h3 className="text-lg font-semibold mb-4">相关标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string) => (
                      <a
                        key={tag}
                        href={`/tags/${tag}`}
                        className="px-3 py-1 bg-[var(--btn-regular-bg)] text-[var(--btn-content)] rounded-full text-sm hover:bg-[var(--primary)] hover:text-white transition-colors"
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
              <div className="px-8 py-6 border-t border-[var(--line-divider)]">
                <div className="flex justify-between gap-4">
                  {previousArticle ? (
                    <a
                      href={`/daily-libs/${previousArticle.url}`}
                      className="flex items-center gap-3 p-4 rounded-lg border border-[var(--line-divider)] hover:border-[var(--primary)] hover:shadow-md transition-all group flex-1"
                    >
                      <svg className="w-5 h-5 text-[var(--btn-content)] group-hover:text-[var(--primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[var(--btn-content)] mb-1">上一篇</div>
                        <div className="font-medium text-[var(--deep-text)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {previousArticle.title}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex-1"></div>
                  )}

                  {nextArticle ? (
                    <a
                      href={`/daily-libs/${nextArticle.url}`}
                      className="flex items-center gap-3 p-4 rounded-lg border border-[var(--line-divider)] hover:border-[var(--primary)] hover:shadow-md transition-all group flex-1"
                    >
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-sm text-[var(--btn-content)] mb-1">下一篇</div>
                        <div className="font-medium text-[var(--deep-text)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {nextArticle.title}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-[var(--btn-content)] group-hover:text-[var(--primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ) : (
                    <div className="flex-1"></div>
                  )}
                </div>
              </div>
            )}
          </article>
        ) : (
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-[var(--btn-regular-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--btn-content)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">未找到该库</h3>
            <p className="text-[var(--btn-content)]">抱歉，没有找到您要查看的库推荐</p>
            <a
              href="/daily-libs"
              className="mt-4 inline-block px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              返回每日库列表
            </a>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
