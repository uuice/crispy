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
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">每日库</h1>
          <p className="text-[var(--btn-content)]">
            每日推荐一个优秀的开源库或工具
          </p>
        </div>

        {archiveGroups.length > 0 ? (
          <div className="space-y-8">
            {archiveGroups.map((group) => (
              <div key={group.year} className="card-base">
                <div className="border-l-4 border-[var(--primary)] pl-4 py-2 mb-6">
                  <h2 className="text-2xl font-bold text-[var(--primary)]">{group.year}</h2>
                  <p className="text-[var(--btn-content)] mt-1">
                    {group.items.length} 个推荐
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((article: any) => (
                    <article
                      key={article.id}
                      className="group p-4 rounded-lg border border-[var(--line-divider)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                            {article.title?.charAt(0) || '库'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                            <a
                              href={`/daily-libs/${article.url}`}
                              className="text-[var(--deep-text)] group-hover:text-[var(--primary)] transition-colors"
                            >
                              {article.title}
                            </a>
                          </h3>
                          <p className="text-sm text-[var(--btn-content)] mb-3 line-clamp-2">
                            {article.summary || article.content?.substring(0, 100) + '...'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-[var(--btn-content)]/60">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {new Date(article.create_time).toLocaleDateString('zh-CN', {
                                month: '2-digit',
                                day: '2-digit'
                              })}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
            ))}
          </div>
        ) : (
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-[var(--btn-regular-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--btn-content)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">暂无推荐</h3>
            <p className="text-[var(--btn-content)]">还没有发布任何库推荐</p>
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
