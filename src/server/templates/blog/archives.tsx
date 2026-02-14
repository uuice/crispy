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
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">文章归档</h1>
          <p className="text-[var(--btn-content)]">
            按时间顺序查看所有文章
          </p>
        </div>

        {archiveGroups.length > 0 ? (
          <div className="space-y-8">
            {archiveGroups.map((group) => (
              <div key={group.year} className="card-base">
                <div className="border-l-4 border-[var(--primary)] pl-4 py-2 mb-6">
                  <h2 className="text-2xl font-bold text-[var(--primary)]">{group.year}</h2>
                  <p className="text-[var(--btn-content)] mt-1">
                    {group.items.length} 篇文章
                  </p>
                </div>

                <div className="space-y-4">
                  {group.items.map((article: any) => (
                    <article
                      key={article.id}
                      className="group hover:bg-[var(--btn-plain-bg-hover)] p-4 rounded-lg transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-lg font-medium">
                          <a
                            href={`/archives/${article.url}`}
                            className="text-[var(--deep-text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2"
                          >
                            {article.title}
                          </a>
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-[var(--btn-content)] flex-shrink-0">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(article.create_time).toLocaleDateString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>
                          {article.category_name && (
                            <span className="px-2 py-1 bg-[var(--btn-regular-bg)] rounded-full text-xs">
                              {article.category_name}
                            </span>
                          )}
                        </div>
                      </div>
                      {article.summary && (
                        <p className="text-[var(--btn-content)] mt-2 text-sm line-clamp-2">
                          {article.summary}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-[var(--btn-regular-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--btn-content)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">暂无文章</h3>
            <p className="text-[var(--btn-content)]">还没有发布任何文章</p>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
