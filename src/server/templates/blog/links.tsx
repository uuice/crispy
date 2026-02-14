import React from 'react'
import BlogLayout from './layout'

interface LinksPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  linkCategories?: any[]
  groupedLinks?: { [key: string]: any[] }
  links?: any[]
}

export default function LinksPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  linkCategories = [],
  groupedLinks = {},
  links = []
}: LinksPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Link"
    >
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">友情链接</h1>
          <p className="text-[var(--btn-content)]">
            感谢这些优秀的网站和博主
          </p>
        </div>

        {Object.keys(groupedLinks).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedLinks).map(([categoryName, categoryLinks]) => (
              <div key={categoryName} className="card-base">
                <div className="border-l-4 border-[var(--primary)] pl-4 py-2 mb-6">
                  <h2 className="text-2xl font-bold text-[var(--primary)]">{categoryName}</h2>
                  <p className="text-[var(--btn-content)] mt-1">
                    {categoryLinks.length} 个链接
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryLinks.map((link: any) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 rounded-lg border border-[var(--line-divider)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {link.avatar && (
                          <img
                            src={link.avatar}
                            alt={link.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.parentElement!.querySelector('.fallback-avatar')!.classList.remove('hidden')
                            }}
                          />
                        )}
                        <div className={`w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold flex-shrink-0 fallback-avatar ${link.avatar ? 'hidden' : ''}`}>
                          {link.name?.charAt(0) || '友'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[var(--deep-text)] group-hover:text-[var(--primary)] transition-colors truncate">
                            {link.name}
                          </h3>
                          {link.description && (
                            <p className="text-sm text-[var(--btn-content)] mt-1 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--btn-content)]/60">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                              </svg>
                              {link.url}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-[var(--btn-regular-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--btn-content)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">暂无友情链接</h3>
            <p className="text-[var(--btn-content)]">还没有添加任何友情链接</p>
          </div>
        )}

        {/* 申请友链 */}
        <div className="card-base p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">申请友链</h3>
          <div className="prose prose-sm max-w-none text-[var(--btn-content)]">
            <p>如果您希望与本站交换友情链接，请满足以下要求：</p>
            <ul className="mt-2 space-y-1">
              <li>网站内容健康、积极向上</li>
              <li>有一定的原创内容</li>
              <li>网站正常访问，无恶意代码</li>
              <li>已在您的网站添加本站链接</li>
            </ul>
            <p className="mt-4">
              请通过邮件联系：<a href="mailto:admin@example.com" className="text-[var(--primary)] hover:underline">
                admin@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}
