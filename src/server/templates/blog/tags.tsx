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
      <div className="max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">标签:</h1>
            {currentTag && (
              <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-full font-medium">
                {currentTag.title}
              </span>
            )}
          </div>
          {currentTag?.description && (
            <p className="text-[var(--btn-content)]">
              {currentTag.description}
            </p>
          )}
        </div>

        {articleList.length > 0 ? (
          <div className="space-y-6">
            {articleList.map((article: any) => (
              <article
                key={article.id}
                className="card-base p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      <a
                        href={`/archives/${article.url}`}
                        className="text-[var(--deep-text)] group-hover:text-[var(--primary)] transition-colors"
                      >
                        {article.title}
                      </a>
                    </h2>
                    <p className="text-[var(--btn-content)] mb-4 line-clamp-3">
                      {article.summary || article.content?.substring(0, 200) + '...'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--line-divider)]">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--btn-content)]">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(article.create_time).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {article.view_count || 0}
                      </span>
                      {article.category_name && (
                        <span className="px-2 py-1 bg-[var(--btn-regular-bg)] rounded-full text-xs">
                          {article.category_name}
                        </span>
                      )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag: string) => (
                          <a
                            key={tag}
                            href={`/tags/${tag}`}
                            className="px-2 py-1 bg-[var(--btn-regular-bg)] text-[var(--btn-content)] rounded-full text-xs hover:bg-[var(--primary)] hover:text-white transition-colors"
                          >
                            #{tag}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-[var(--btn-regular-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--btn-content)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">该标签下暂无文章</h3>
            <p className="text-[var(--btn-content)]">
              {currentTag
                ? `标签 "${currentTag.title}" 下还没有文章`
                : '未找到指定标签'}
            </p>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
