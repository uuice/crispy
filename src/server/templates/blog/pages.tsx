import React from 'react'
import BlogLayout from './layout'

interface PagesPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  page?: any
}

export default function PagesPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  page
}: PagesPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Page"
    >
      <div className="max-w-4xl">
        {page ? (
          <article className="card-base">
            {/* 页面头部 */}
            <div className="p-8 border-b border-[var(--line-divider)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm font-medium">
                  页面
                </span>
              </div>

              <h1 className="text-4xl font-bold text-[var(--deep-text)] mb-6">
                {page.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--btn-content)]">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {new Date(page.create_time).toLocaleDateString('zh-CN', {
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
                  {page.view_count || 0} 次浏览
                </span>
              </div>
            </div>

            {/* 页面内容 */}
            <div className="p-8">
              {page.cover_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={page.cover_image}
                    alt={page.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div
                  className="custom-md"
                  dangerouslySetInnerHTML={{ __html: page.content || '暂无内容' }}
                />
              </div>
            </div>
          </article>
        ) : (
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-[var(--btn-regular-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--btn-content)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">未找到该页面</h3>
            <p className="text-[var(--btn-content)]">抱歉，没有找到您要查看的页面</p>
            <a
              href="/"
              className="mt-4 inline-block px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              返回首页
            </a>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
